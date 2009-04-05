/* 
Title: jqPlot

JavaScript plotting library for jQuery.

About: Copyright

Copyright (c) 2009 Chris Leonello

About: License

Licensed under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

About: Code Conventions

Properties can be set or overriden by the options object passed in by the user, 
however, properties prefixed with an underscore (_) should be considered private 
and not overriden.  Classes are marked(Private) or (Public) to indicate their 
visibility outside of the function closure and thus to the user.


Objects and methods which extend the jQuery namespace (prefixed with a $.) are visible
to the user through the jQuery namespace.  Except for the $.jqplot function, these are 
primarily the renderes for lines, axes, grid, etc. which can be replaced, extended, or 
enhanced by the user through plugins.

*/

(function($) {
    var debug = 1;
    
    // Class: $.jqplot
    // (Public) jQuery extension called by user to create plot.
    //
    // Parameters:
    // target - ID of target element to render the plot into.
    // data - an array of data series.
    // options - user defined options object.
    $.jqplot = function(target, data, options) {
        var _data, _options;
        
        // check to see if only 2 arguments were specified, what is what.
        if (options == null) {
            if (data instanceof Array) {
                _data = data;
                _options = null;   
            }
            
            else if (data.constructor == Object) {
                _data = null;
                _options = data;
            }
        }
        else {
            _data = data;
            _options = options;
        }
        var plot = new jqPlot();
        plot.init(target, _data, _options);
        plot.draw();
        return plot;
    };
    
    $.jqplot.ElemContainer = function() {
        this._elem;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
    };
            
    $.jqplot.ElemContainer.prototype.getWidth = function() {
        return this._elem.outerWidth(true);
    };
    
    $.jqplot.ElemContainer.prototype.getHeight = function() {
        return this._elem.outerHeight(true);
    };
    
    $.jqplot.ElemContainer.prototype.getPosition = function() {
        return this._elem.position();
    };
    
    $.jqplot.ElemContainer.prototype.getTop = function() {
        return this.getPosition().top;
    };
    
    $.jqplot.ElemContainer.prototype.getLeft = function() {
        return this.getPosition().left;
    };
    
    $.jqplot.ElemContainer.prototype.getBottom = function() {
        return this._elem.css('bottom');
    };
    
    $.jqplot.ElemContainer.prototype.getRight = function() {
        return this._elem.css('right');
    };
    

    // Class: Axis
    // (Private) An individual axis object.  Cannot be instantiated directly, but created
    // by the Plot oject.  Axis properties can be set or overriden by the 
    // options passed in from the user.  As currently implemented, the axis and 
    // the lineAxisRenderer are tightly integrated.  Options are assigned to the
    // Axis object itself, and not the renderer.
    // 
    // Parameters:
    //     name - Axis name (identifier).  One of 'xaxis', 'yaxis', 'x2axis' or 'y2axis'.
    function Axis(name) {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: name
        // Axis name (identifier).  One of 'xaxis', 'yaxis', 'x2axis' or 'y2axis'.
        this.name = name;
        this._series = [];
        // prop: show
        // Wether to display the axis on the graph.
        this.show = false;
        // prop; min
        // minimum value of the axis (in data units, not pixels).
        this.min=null;
        // prop: max
        // maximum value of the axis (in data units, not pixels).
        this.max=null;
        // prop: pad
        // Padding to extend the range above and below the data bounds.
        // Factor to multiply by the data range when setting the axis bounds
        this.pad = 1.2;
        // // prop: type
        // // Type of axis, linear or log
        // this.type = 'linear';
        // // prop: logStyle
        // // For log axis, weather to compute ticks by equal power (power) or by equal display spacing (even).
        // // One of 'power' or 'even'
        // this.logStyle = 'even';
        // this.logBase = 10;
        // // prop: _mode
        // // 'scatter' or 'category'
        // // Category axis data value considered a category label, not a position.
        // this._mode = 'scatter';
        // prop: numberTicks
        // Desired number of ticks.  Computed automatically by default
        this.numberTicks;
        // prop: tickInterval
        // number of units between ticks.  Mutually exclusive with numberTicks.
        this.tickInterval;
        // prop: renderer
        // Instance of a rendering engine that draws the axis on the plot.
        this.renderer = new $.jqplot.linearAxisRenderer();
        this.rendererOptions = {};

        // prop: label
        // Axis label object options.  Container for axis label properties. Not implimeted yet.
        // 
        // Properties:
        // text - label text.
        // fontFamily - css font-family spec.
        // fontSize - css font-size spec. 
        this.labelOptions = {text:null, fontFamily:null, fontSize:null};
        
        // prop: tickOptions
        // Container for axis tick properties.
        // 
        // Properties:
        // mark - tick markings.  One of 'inside', 'outside', 'cross', '' or null.
        //     The latter 2 options will hide the tick marks.
        // size - length of the tick marks in pixels.  For 'cross' style, length
        //     will be stoked above and below axis, so total length will be twice this.
        // showLabels - Wether to show labels or not.
        // formatString - formatting string passed to the tick formatter.
        // fontFamily - css font-family spec.
        // fontSize -css font-size spec.
        // textColor - css color spec.
        this.tickOptions = {mark:'outside', markSize:4, size:4, showLabel:true, formatter:$.jqplot.sprintf, formatString:'%.1f', fontFamily:'', fontSize:'0.75em', textColor:''};
        this.showTicks = true;
        this.showTickMarks = true;
        this.showMinorTicks = true;
        // prop: _dataBounds
        // low/high values of all of the series bound to this axis.
        // 
        // Properties:
        // min - lowest value on this axis.
        // max - highest value on this axis.
        this._dataBounds = {min:null, max:null};
        // Property: _offsets
        // Pixel offsets from the edge of the DOM element in pixels.
        // 
        // Properties:
        // min - pixel offset to the minimum value tick.
        // max - pixel offset to the maximum value tick.
        this._offsets = {min:null, max:null};
        // prop: _canvasWidth
        // width of the plot canvas, total DOM element width.
        this._plotWidth;
        // prop: _canvasHeight
        // height of the plot canvas, total DOM element height.
        this._plotHeight;
        this._ticks=[];
    };
    
    Axis.prototype = new $.jqplot.ElemContainer();
    Axis.prototype.constructor = Axis;
    
    Axis.prototype.init = function() {
        var db = this._dataBounds;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s.data;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[j][0] < db.min || db.min == null) db.min = d[j][0];
                    if (d[j][0] > db.max || db.max == null) db.max = d[j][0];
                }              
                else {
                    if (d[j][1] < db.min || db.min == null) db.min = d[j][1];
                    if (d[j][1] > db.max || db.max == null) db.max = d[j][1];
                }              
            }
        }
        
        this.renderer.init(this.rendererOptions);
    };
    
    Axis.prototype.draw = function() {
        return this.renderer.draw.call(this);
    };
    
    Axis.prototype.set = function() {
        this.renderer.set.call(this);
    };
    
    Axis.prototype.pack = function(pos, offsets) {
        if (this.show) this.renderer.pack.call(this, pos, offsets);
    };


    // Class: Legend
    // (Private) Legend object.  Cannot be instantiated directly, but created
    // by the Plot oject.  Legend properties can be set or overriden by the 
    // options passed in from the user.
    function Legend() {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: show
        // Wether to display the legend on the graph.
        this.show = true;
        // prop: location
        // Placement of the legend.  one of the compas directions: nw, n, ne, e, se, s, sw, w
        this.location = 'se';
        // prop: xoffset
        // offset from the inside edge of the plot in the x direction in pixels.
        this.xoffset = 12;
        // prop: yoffset
        // offset from the inside edge of the plot in the y direction in pixels.
        this.yoffset = 12;
        ///////////////////////////////
        ///////////////////////////////
        // make these options on the renderer.
        // // prop: border
        // // css spec for the border around the legend box.
        // this.border = '1px solid #cccccc';
        // // prop: background
        // // css spec for the background of the legend box.
        // this.background = 'rgba(255,255,255,0.6)';
        // // prop: textColor
        // // css color spec for the legend text.
        // this.textColor = '';
        // // prop: fontFamily
        // // css font-family spec for the legend text.
        // this.fontFamily = ''; 
        // // prop: fontSize
        // // css font-size spec for the legend text.
        // this.fontSize = '0.75em';
        // // prop: rowSpacing
        // // css padding-top spec for the rows in the legend.
        // this.rowSpacing = '0.5em';
        // prop: _elem
        // reference to the legend DOM element.
        this.renderer = new $.jqplot.tableLegendRenderer();
        this.rendererOptions = {};
        
    };
    
    Legend.prototype = new $.jqplot.ElemContainer();
    Legend.prototype.constructor = Legend;
    

    // Class: Title
    // (Private) Plot Title object.  Cannot be instantiated directly, but created
    // by the Plot oject.  Title properties can be set or overriden by the 
    // options passed in from the user.
    // 
    // Parameters:
    //     text - text of the title.
    function Title(text) {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: text
        // text of the title;
        this.text = text;
        this.show = true;
        // prop: fontFamily
        // css font-family spec for the text.
        this.fontFamily = '';
        // prop: fontSize
        // css font-size spec for the text.
        this.fontSize = '1.2em';
        // prop: textAlign
        // css text-align spec for the text.
        this.textAlign = 'center';
        // prop: textColor
        // css color spec for the text.
        this.textColor = '';
        this.renderer = new $.jqplot.divTitleRenderer();
        this.rendererOptions = {};   
    };
    
    Title.prototype = new $.jqplot.ElemContainer();
    Title.prototype.constructor = Title;
    
    Title.prototype.init = function() {
        this.renderer.init(this.rendererOptions);
    }
    
    Title.prototype.draw = function(width) {
        return this.renderer.draw.call(this, width);
    };
    
    Title.prototype.pack = function() {
        this.renderer.pack.call(this);
    };
    
    /* 
        Class: Series
        (Private) An individual data series object.  Cannot be instantiated directly, but created
        by the Plot oject.  Series properties can be set or overriden by the 
        options passed in from the user.
    */
    function Series() {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: show
        // wether or not to draw the series.
        this.show = true;
        // prop: xaxis
        // name of x axis to associate with this series.
        this.xaxis = 'xaxis';
        // prop: _xaxis
        // reference to the underlying x axis object associated with this series.
        this._xaxis;
        // prop: yaxis
        // name of y axis to associate with this series.
        this.yaxis = 'yaxis';
        // prop: _yaxis
        // reference to the underlying y axis object associated with this series.
        this._yaxis;
        // prop: renderer
        // Instance of a renderer which will draw the series.
        this.renderer = new $.jqplot.lineRenderer();
        // prop: rendererOptions
        // Options to set on the renderer.  See the renderer for possibly options.
        this.rendererOptions = {};
        // prop: data
        // raw user data points.  These should never be altered!!!
        this.data = [];
        // prop: gridData
        // data in grid coordinates.  User data transformed for plotting on grid.
        this.gridData = [];
        // place holder, don't do anything with points yet.
        //this.points = {show:true, renderer: 'circleRenderer'};
        // prop: label
        // Line label to use in legend.
        this.label = '';
        // prop: color
        // css color spec for the series
        this.color = '#666666';
        // prop: lineWidth
        // width of the line in pixels.  May have different meanings depending on renderer.
        this.lineWidth = 2.5;
        // prop: shadow
        // wether or not to draw a shadow on the line
        this.shadow = true;
        // prop: shadowAngle
        // Shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Shadow offset from line in pixels
        this.shadowOffset = 1;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        // prop: breakOnNull
        // wether line segments should be be broken at null value.
        // False will join point on either side of line.
        this.breakOnNull = false;
        // prop: marks
        // Either an instance of a mark renderer which will draw the data pont markers
        // or an options object with a renderer property and additional options to pass
        // to the renderer.  See the renderer for additional options.
        this.marker = new $.jqplot.markRenderer();
        // // prop: mode
        // // 'scatter' or 'category'
        // // 'scatter' gives an X-Y scatter line plot, 'category' gives equally spaced data line plot.
        // this.mode = 'scatter'
        // prop: showLine
        // wether to actually draw the line or not.  Series will still be renderered, even if no line is drawn.
        this.showLine = true;
    };
    
    Series.prototype = new $.jqplot.ElemContainer();
    Series.prototype.constructor = Series;
    
    Series.prototype.init = function() {
        // weed out any null values in the data.
        var d = this.data;
        for (i=0; i<d.length; i++) {
            if (d[i] == null || d[i][0] == null || d[i][1] == null) {
                // For the time being, just delete null values
                // could keep them if wanted to break lines on null.
                d.splice(i,1);
                continue;
            }
        }
        this.renderer.init(this.rendererOptions);
    }
    
    /* 
        Class: Grid
        (Private) Object representing the grid on which the plot is drawn.  The grid in this
        context is the area bounded by the axes, the area which will contain the series.
        The Grid object cannot be instantiated directly, but is created by the Plot oject.  
        Grid properties can be set or overriden by the options passed in from the user.
    */
    function Grid() {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: drawGridlines
        // wether to draw the gridlines on the plot.
        this.drawGridlines = true;
        // prop: background
        // css spec for the background color.
        this.background = '#fffdf6';
        // prop: borderColor
        // css spec for the color of the grid border.
        this.borderColor = '#999999';
        // prop: borderWidth
        // width of the border in pixels.
        this.borderWidth = 2.0;
        // prop: shadow
        // wether to show a shadow behind the grid.
        this.shadow = true;
        // prop: shadowAngle
        // shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Offset of each shadow stroke from the border in pixels
        this.shadowOffset = 1.5;
        // prop: shadowWidth
        // width of the stoke for the shadow
        this.shadowWidth = 3;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        this._left;
        this._top;
        this._right;
        this._bottom;
        this._width;
        this._height;

        // prop: _axes
        // reference to the plot axes
        this._axes = [];
        // prop: renderer
        // Instance of a renderer which will actually render the grid.
        this.renderer = new $.jqplot.canvasGridRenderer();
        this.rendererOptions = {};
        this._offsets = {top:null, bottom:null, left:null, right:null};
    };
    
    Grid.prototype = new $.jqplot.ElemContainer();
    Grid.prototype.constructor = Grid;
    
    Grid.prototype.init = function() {
        this.renderer.init.call(this, this.rendererOptions);
    }
    
    Grid.prototype.createElement = function(offsets) {
        this._offsets = offsets;
        return this.renderer.createElement.call(this);
    }
    
    Grid.prototype.draw = function() {
        this.renderer.draw.call(this);
    }
    
    function SeriesCanvas() {
        $.jqplot.ElemContainer.call(this);
    };
    
    SeriesCanvas.prototype = new $.jqplot.ElemContainer();
    SeriesCanvas.prototype.constructor = SeriesCanvas;

    
    /* 
        Class: jqPlot
        (Private) Plot object returned to call to $.jqplot.  Handles parsing user options,
        creating sub objects (Axes, legend, title, series) and rendering the plot.
    */    
    function jqPlot() {
        // user's data.  Should be in the form of
        // [ [[x1, y1], [x2, y2],...], [[x1, y1], [x2, y2], ...] ] or
        // [{ data:[[x1, y1], [x2, y2],...], other_options...}, { data:[[x1, y1], [x2, y2],...], other_options...} ]
        this.data = [];
        // the id of the dom element to render the plot into
        this.targetId = null;
        // the jquery object for the dom target.
        this.target = null;    
        // default options object.
        // Fill in axes properties by default so don't throw an error.
        // Remind me that can set defaults for all points, axes, series at once.
        this.defaults = {
            pointsDefaults: {},
            axesDefaults: {},
            axes: {xaxis:{}, yaxis:[], x2axis:{}, y2axis:{}},
            seriesDefaults: {},
            series:[]
        };
        // container for the individual data series
        this.series = [];
        // up to 4 axes are supported, each with it's own options.
        this.axes = {xaxis: new Axis('xaxis'), yaxis: new Axis('yaxis'), x2axis: new Axis('x2axis'), y2axis: new Axis('y2axis')};
        this.grid = new Grid();
        this.legend = new Legend();
        this.seriesView = new $.jqplot.canvasSeriesView();
        this.overlayView = new $.jqplot.canvasOverlayView();
        // Can get these through the representative ojects.
        // // handle to the grid canvas drawing context.  Holds the axes, grid, and labels.
        // // Stuff that should be rendered only at initial plot drawing.
        // this._gctx = null;
        // // handle to the series  canvas drawing context.  Holds the rendered
        // // rendered series which may be manipulated through user interaction.
        // this._sctx = null;
        // handle to the overlay canvas drawing object.  Holds interactive content
        // like highlights that are rendered according to user interaction
        this._octx = null;
        // width and height of the canvas
        this._width = null;
        this._height = null; 
        this._plotDimensions = {height:null, width:null};
        // default padding for the grid context
        this._gridOffsets = {top:10, right:10, bottom:10, left:10};
        // for dual axes, wether to space ticks the same on both sides.
        this.equalXTicks = true;
        this.equalYTicks = true;
        // borrowed colors from Flot.
        this.seriesColors = ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"];
        this._seriesColorsIndex = 0;
        // Default font characteristics which can be overriden by individual 
        // plot elements.  All are css specs.
        this.textColor = '#666666';
        this.fontFamily = 'Trebuchet MS, Arial, Helvetica, sans-serif';
        this.fontSize = '1em';
        this.title = new Title();
        // container to hold all of the merged options.  Convienence for plugins.
        this.options = {};
        
        // Constructor: init
        // Initializes the jqPlot object, parsing the user options and processing the data.
        //
        // Parameter:
        //  target - ID of the DOM element the plot will render into.
        //  data - data series.
        //  options - user specified options object.    
        this.init = function(target, data, options) {
            this.targetId = target;
            this.target = $('#'+target);
            if (!this.target) throw "No plot target specified";
            
            // make sure the target is positioned by some means and set css
            if (this.target.css('position') == 'static') this.target.css('position', 'relative');
            this.target.css('color', this.textColor);
            this.target.css('font-family', this.fontFamily);
            this.target.css('font-size', this.fontSize);
            
            this._height = parseFloat(this.target.css('height'));
            this._width = parseFloat(this.target.css('width'));
            this._plotDimensions.height = this._height;
            this._plotDimensions.width = this._width;
            this.grid._plotDimensions = this._plotDimensions;
            this.title._plotDimensions = this._plotDimensions;
            if (this._height <=0 || this._width <=0) throw "Canvas dimensions <=0";
            
            // get a handle to the plot object from the target to help with events.
            $(target).data('jqplot', this);
            
            this.data = data;
            
            this.parseOptions(options);
            
            this.initializeSeries();
            
            this.initializeAxes();
            
            this.grid.init();
            this.grid._axes = this.axes;
        }
        
        this.initializeSeries = function() {
            for (var i=0; i<this.series.length; i++) {
                this.series[i]._plotDimensions = this._plotDimensions;
               this.series[i].init();
            }
        };
        
        this.initializeAxes = function() {
            for (var name in this.axes) {
                this.axes[name]._plotDimensions = this._plotDimensions;
                this.axes[name].init();
            }
        };
        
        
        this.getNextSeriesColor = function() {
            var c = this.seriesColors[this._seriesColorsIndex];
            this._seriesColorsIndex++;
            return c;
        }
    
        // Function: parseOptions
        //  Parses the user's options overriding defaults.
        //
        // Parameters:
        // options - options object passed into $.jqplot by user.
        this.parseOptions = function(options){
            this.options = $.extend(true, {}, this.defaults, options);
            for (var n in this.axes) {
                var axis = this.axes[n];
                $.extend(true, axis, this.options.axesDefaults, this.options.axes[n]);
                axis._plotWidth = this._width;
                axis._plotHeight = this._height;
            }
            if (this.data.length == 0) {
                this.data = [];
                for (var i=0; i<this.options.series.length; i++) {
                    this.data.push(this.options.series.data);
                }    
            }
                
                
            function normalizeData(data) {
                // return data as an array of point arrays,
                // in form [[x1,y1...], [x2,y2...], ...]
                var temp = [];
                var i;
                if (!(data[0] instanceof Array)) {
                    // we have a series of scalars.  One line with just y values.
                    // turn the scalar list of data into a data array of form:
                    // [[1, data[0]], [2, data[1]], ...]
                    for (i=0; i<data.length; i++) {
                        temp.push([i+1, data[i]]);
                    }
                }
            
                else {
                    // we have a properly formatted data series, copy it.
                    $.extend(true, temp, data);
                }
                return temp;
            };


                
            for (var i=0; i<this.data.length; i++) {
                var temp = $.extend(true, new Series(), this.options.seriesDefaults, this.options.series[i]);
                temp.data = normalizeData(this.data[i]);
                switch (temp.xaxis) {
                    case 'xaxis':
                        temp._xaxis = this.axes.xaxis;
                        break;
                    case 'x2axis':
                        temp._xaxis = this.axes.x2axis;
                        break;
                    default:
                        break;
                }
                switch (temp.yaxis) {
                    case 'yaxis':
                        temp._yaxis = this.axes.yaxis;
                        break;
                    case 'y2axis':
                        temp._yaxis = this.axes.y2axis;
                        break;
                    default:
                        break;
                }
                temp._xaxis._series.push(temp);
                temp._yaxis._series.push(temp);
                if (temp.show) {
                    temp._xaxis.show = true;
                    temp._yaxis.show = true;
                }

                // parse the renderer options and apply default colors if not provided
                if (!temp.rendererOptions.color && temp.show != false) {
                    temp.rendererOptions.color = this.getNextSeriesColor();
                }
                // temp.rendererOptions.show = temp.show;
                // $.extend(true, temp.renderer, {color:this.seriesColors[i]}, this.rendererOptions);
                this.series.push(temp);  
            }
            
            // copy the grid and title options into this object.
            $.extend(true, this.grid, this.options.grid);
            if (typeof this.options.title == 'string') this.title.text = this.options.title;
            else if (typeof this.options.title == 'object') $.extend(true, this.title, this.options.title);
            this.title._plotWidth = this._width;
            $.extend(true, this.legend, this.options.legend);
            
            for (var i=0; i<$.jqplot.postParseOptionsHooks.length; i++) {
                $.jqplot.postParseOptionsHooks[i].call(this);
            }
        };
    
        // Function: draw
        // Calls functions needed to draw the plot.  Draws the objects, but doesn't do 
        // the final positioning on the Plot.  That is done by pack.
        this.draw = function(){
            this.target.append(this.title.draw());
            this.title.pack({top:0, left:0});
            for (var name in this.axes) {
                this.target.append(this.axes[name].draw());
                this.axes[name].set();
            }
            
            if (this.axes.yaxis.show) this._gridOffsets.left = this.axes.yaxis.getWidth();
            if (this.axes.y2axis.show) this._gridOffsets.right = this.axes.y2axis.getWidth();
            if (this.title.show && this.axes.x2axis.show) this._gridOffsets.top = this.title.getHeight() + this.x2axis.getHeight();
            else if (this.title.show) this._gridOffsets.top = this.title.getHeight();
            else if (this.axes.x2axis.show) this._gridOffsets.top = this.axes.x2axis.getHeight();
            if (this.axes.xaxis.show) this._gridOffsets.bottom = this.axes.xaxis.getHeight();
            this.axes.yaxis.pack({position:'absolute', top:0, left:0, height:this._height}, {min:this._height - this._gridOffsets.bottom, max: this._gridOffsets.top});
            this.axes.x2axis.pack({bottom:this._gridOffsets.top, left:0}, {min:this._gridOffsets.left, max:this._width - this._gridOffsets.right});
            this.axes.xaxis.pack({position:'absolute', bottom:0, left:0, width:this._width}, {min:this._gridOffsets.left, max:this._width - this._gridOffsets.right});
            this.axes.y2axis.pack({top:0, right:0}, {min:this._height - this._gridOffsets.bottom, max: this._gridOffsets.top});
            
            this.target.append(this.grid.createElement(this._gridOffsets));
            this.grid.draw();
            this.target.append(this.)
            // // the series share one element and drawing context.
            // this.target.append(this.createSeriesContext(););
            // // grid and series won't need to be packed since they are the last elements to be drawn.
            // this.grid.render();
            // for (var i=0; i<this.series.length; i++) {
            //     this.series[i].render();
            // }
            // // finally, draw and pack the legend
            // this.target.append(this.legend.draw(););
            // this.legend.pack();
            // for (var i=0; i<$.jqplot.postDrawHooks.length; i++) {
            //     $.jqplot.postDrawHooks[i].call(this);
            // }
        };
        
        // Function: pack
        // Dimensions an positions the grid and axes.
        this.pack = function() {
            // calculate grid offsets
            var offsets = this._gridOffsets;
            var axes = this.axes;
            var temp
            temp = this.title._height + axes.x2axis._height;
            if (temp) offsets.top = temp;
            if (axes.yaxis._width) offsets.left = axes.yaxis._width;
            if (axes.xaxis._height) offsets.bottom = axes.xaxis._height;
            if (axes.y2axis._width) offsets.right = axes.y2axis._width;
            
            this.grid._top = this._gridOffsets.top;
            this.grid._left = this._gridOffsets.left;
            this.grid._height = this._height - this._gridOffsets.top - this._gridOffsets.bottom;
            this.grid._width = this._width - this._gridOffsets.left - this._gridOffsets.right;
            this.grid._bottom = this.grid._top + this.grid._height;
            this.grid._right = this.grid._left + this.grid._width;
            
            for (var name in this.axes) {
                var axis = this.axes[name];
                axis.renderer.pack.call(axis, offsets, this.grid._width, this.grid._height);
            }
            
        };
        
        // Function: drawLegend
        // Draws the legend on top of the grid.  Renders it as a table.        
        this.drawLegend = function() {
            var legend = this.legend;
            var grid = this.grid;
            if (legend.show) {
                var series = this.series;
                // make a table.  one line label per row.
                var ss = 'background:'+legend.background+';border:'+legend.border+';position:absolute;';
                ss += (legend.fontSize) ? 'font-size:'+legend.fontSize+';' : '';
                ss += (legend.fontFamily) ? 'font-family:'+legend.fontFamily+';' : '';
                ss += (legend.textColor) ? 'color:'+legend.textColor+';' : '';
                switch (legend.location) {
                    case 'nw':
                        var a = grid._left + legend.xoffset;
                        var b = grid._top + legend.yoffset;
                        ss += 'left:'+a+'px;top:'+b+'px;';
                        break;
                    case 'n':
                        var a = (grid._left + grid._right)/2 + legend.xoffset;
                        var b = grid._top + legend.yoffset;
                        ss += 'left:'+a+'px;top:'+b+'px;';
                        break;
                    case 'ne':
                        var a = grid._right - legend.xoffset;
                        var b = grid._top + legend.yoffset;
                        ss += 'right:'+a+'px;top:'+b+'px;';
                        break;
                    case 'e':
                        var a = grid._right - legend.xoffset;
                        var b = (grid._top + grid._bottom)/2 + legend.yoffset;
                        ss += 'right:'+a+'px;top:'+b+'px;';
                        break;
                    case 'se':
                        var a = this._width - grid._right + legend.xoffset;
                        var b = this._height - grid._bottom + legend.yoffset;
                        ss += 'right:'+a+'px;bottom:'+b+'px;';
                        break;
                    case 's':
                        var a = (grid._left + grid._right)/2 + legend.xoffset;
                        var b = grid._bottom + legend.yoffset;
                        ss += 'left:'+a+'px;bottom:'+b+'px;';
                        break;
                    case 'sw':
                        var a = grid._left + legend.xoffset;
                        var b = grid._bottom + legend.yoffset;
                        ss += 'left:'+a+'px;bottom:'+b+'px;';
                        break;
                    case 'w':
                        var a = grid._left + legend.xoffset;
                        var b = (grid._top + grid._bottom)/2 + legend.yoffset;
                        ss += 'left:'+a+'px;top:'+b+'px;';
                        break;
                    default:  // same as 'se'
                        var a = grid._right - legend.xoffset;
                        var b = grid._bottom + legend.yoffset;
                        ss += 'right:'+a+'px;bottom:'+b+'px;';
                        break;
                        
                }
                legend._elem = $('<table class="jqplot-legend" style="'+ss+'"></table>').appendTo(this.target).get(0);
                
                function addrow(label, color, pad) {
                    var rs = (pad) ? legend.rowSpacing : '0';
                    var tr = $('<tr class="jqplot-legend"></tr>').appendTo(legend._elem);
                    $('<td class="jqplot-legend" style="vertical-align:middle;text-align:center;padding-top:'+rs+';">'+
                        '<div style="border:1px solid #cccccc;padding:0.2em;">'+
                        '<div style="width:1.2em;height:0.7em;background-color:'+color+';"></div>'+
                        '</div></td>').appendTo(tr);
                    $('<td class="jqplot-legend" style="vertical-align:middle;padding-top:'+rs+';">'+label+'</td>').appendTo(tr);
                };
                
                var pad = false;
                for (var i = 0; i< series.length; i++) {
                    s = series[i];
                    if (s.show) {
                        var lt = s.label.toString();
                        if (lt) {
                            addrow(lt, s.renderer.color, pad);
                            pad = true;
                        }
                        for (var j=0; j<$.jqplot.drawLegendHooks.length; j++) {
                            var item = $.jqplot.drawLegendHooks[j].call(legend, s);
                            if (item) {
                                addrow(item.label, item.color, pad);
                                pad = true;
                            } 
                        }
                    }
                }
            }
        };

        // Function: drawSeries
        // Calls the series renderer for each series in the plot within the context
        // of the individual series.
        this.drawSeries = function(){
            for (var i=0; i<this.series.length; i++) {
                if (this.series[i].show) {
                    this.series[i].renderer.draw.call(this.series[i].renderer, this.series[i], this.grid, this.sctx);
                    for (var j=0; j<$.jqplot.postDrawSeriesHooks.length; j++) {
                        $.jqplot.postDrawSeriesHooks[j].call(this.series[i], this.grid, this.sctx);
                    }
                }
            }
        };
    };
    
    // array: $.jqplot.postParseOptionsHooks
    // Array of plugin hooks run after jqPlot.parseOptions method
    $.jqplot.postParseOptionsHooks = [];
    // array: $.jqplot.postDrawHooks
    // Array of plugin hooks run after jqPlot.draw method
    $.jqplot.postDrawHooks = [];
    // array: $.jqplot.postDrawSeriesHooks
    // Array of plugin hooks run after each series renderer's draw method is called in jqPlot.drawSeries method.
    $.jqplot.postDrawSeriesHooks = [];
    // array: $.jqplot.drawLegendHooks
    // Array of plugin hooks run within but at the end of the jqPlot.drawLegend method.
    $.jqplot.drawLegendHooks = [];
    
	// Convienence function that won't hang IE.
	function log() {
	    if (window.console && debug) {
	       if (arguments.length == 1) console.log (arguments[0]);
	       else console.log(arguments);
	    }
	};
	
    /**
     * sprintf() for JavaScript v.0.4
     *
     * Copyright (c) 2007 Alexandru Marasteanu <http://alexei.417.ro/>
     * Thanks to David Baird (unit test and patch).
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU General Public License as published by the Free Software
     * Foundation; either version 2 of the License, or (at your option) any later
     * version.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
     * details.
     *
     * You should have received a copy of the GNU General Public License along with
     * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
     * Place, Suite 330, Boston, MA 02111-1307 USA
     */

    // 
    // It's prototype is simple:
    // 
    // string sprintf(string format[mixed arg1[, mixed arg2[,...]]])
    // The placeholders in the format string are marked by "%" and are followed by one or more of these elements, in this order:
    // 
    // An optional "+" sign that forces to preceed the result with a plus or minus sign on numeric values. By default, only the "-" sign is used on negative numbers.
    // An optional padding specifier that says what character to use for padding (if specified). Possible values are 0 or any other character precedeed by a '. The default is to pad with spaces.
    // An optional "-" sign, that causes sprintf to left-align the result of this placeholder. The default is to right-align the result.
    // An optional number, that says how many characters the result should have. If the value to be returned is shorter than this number, the result will be padded.
    // An optional precision modifier, consisting of a "." (dot) followed by a number, that says how many digits should be displayed for floating point numbers. When used on a string, it causes the result to be truncated.
    // A type specifier that can be any of:
    // % - print a literal "%" character
    // b - print an integer as a binary number
    // c - print an integer as the character with that ASCII value
    // d - print an integer as a signed decimal number
    // e - print a float as scientific notation
    // u - print an integer as an unsigned decimal number
    // f - print a float as is
    // o - print an integer as an octal number
    // s - print a string as is
    // x - print an integer as a hexadecimal number (lower-case)
    // X - print an integer as a hexadecimal number (upper-case)
    // 

    function str_repeat(i, m) { for (var o = []; m > 0; o[--m] = i); return(o.join('')); }

    $.jqplot.sprintf = function() {
      var i = 0, a, f = arguments[i++], o = [], m, p, c, x;
      while (f) {
        if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
        else if (m = /^\x25{2}/.exec(f)) o.push('%');
        else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
          if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) throw("Too few arguments.");
          if (/[^s]/.test(m[7]) && (typeof(a) != 'number'))
            throw("Expecting number but found " + typeof(a));
          switch (m[7]) {
            case 'b': a = a.toString(2); break;
            case 'c': a = String.fromCharCode(a); break;
            case 'd': a = parseInt(a); break;
            case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
            case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
            case 'o': a = a.toString(8); break;
            case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
            case 'u': a = Math.abs(a); break;
            case 'x': a = a.toString(16); break;
            case 'X': a = a.toString(16).toUpperCase(); break;
          }
          a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
          c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
          x = m[5] - String(a).length;
          p = m[5] ? str_repeat(c, x) : '';
          o.push(m[4] ? a + p : p + a);
        }
        else throw ("Huh ?!");
        f = f.substring(m[0].length);
      }
      return o.join('');
    }
    
})(jQuery);