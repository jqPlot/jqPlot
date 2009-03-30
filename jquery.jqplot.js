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

*/

(function($) {
    var debug = 1;
    
    /* 
        Class: Axis
        [Private] An individual axis object.  Cannot be instantiated directly, but created
        by the Plot oject.  Axis properties can be set or overriden by the 
        options passed in from the user.
        
        Parameters:
            name - Axis name (identifier).  One of 'xaxis', 'yaxis', 'x2axis' or 'y2axis'.
    */
    function Axis(name) {
        // Group: Properties
        
        // prop: name
        // Axis name (identifier).  One of 'xaxis', 'yaxis', 'x2axis' or 'y2axis'.
        this.name = name;
        // prop: show
        // Wether to display the axis on the graph.
        this.show = false;
        // prop: scale
        // Factor to multiply by the data range when setting the axis bounds
        this.scale = 1.2;
        // prop: numberTicks
        // Desired number of ticks.  Computed automatically by default
        this.numberTicks;
        // prop: tickInterval
        // number of units between ticks.  Mutually exclusive with numberTicks.
        this.tickInterval;
        // prop: renderer
        // reference to a rendering engine that draws the axis on the plot.
        this.renderer = new $.jqplot.lineAxisRenderer();
        /*  
            prop: label
            Axis label object.  Container for axis label properties. Not implimeted yet.
        
            Properties:
          
            text - label text.
            fontFamily - css font-family spec.
            fontSize - css font-size spec.  
            align - css text-align spec.
        */
        this.label = {text:null, fontFamily:null, fontSize:null, align:null};
        /*  
            prop: ticks
            Container for axis ticks and their properties.
        
            Properties:
          
            mark - tick markings.  One of 'inside', 'outside', 'cross', '' or null.
                The latter 2 options will hide the tick marks.
            size - length of the tick marks in pixels.  For 'cross' style, length
                will be stoked above and below axis, so total length will be twice this.
            showLabels - Wether to show labels or not.
            labels - Array of tick labels.
            values - Array of underlying data values.
            styles - Array of css styles to be applied.
            formatString - formatting string passed to the tick formatter.
            fontFamily - css font-family spec.
            fontSize -css font-size spec.
            textColor - css color spec.
        */
        this.ticks = {mark:'outside', size:4, showLabels:true, labels:[], values:[], styles:[], formatString:'%.1f', fontFamily:'', fontSize:'0.75em', textColor:''};
        // prop: tickFormatter
        // Function applied to format tick label text.
        this.tickFormatter = sprintf;
        // prop: _height
        // height of the rendered axis in pixels.
        this._height = 0;
        // prop: _width
        // width of the rendered axis in pixels.
        this._width = 0;
        // prop: _elem
        // reference to the actual axis DOM element.
        this._elem;
        /*  
            prop: _dataBounds
            low/high values of all of the series bound to this axis.
        
            Properties:
          
            min - lowest value on this axis.
            max - highest value on this axis.
        */
        this._dataBounds = {min:null, max:null};
        // prop; min
        // minimum value of the axis (in data units, not pixels).
        this.min=null;
        // prop: max
        // maximum value of the axis (in data units, not pixels).
        this.max=null;
        // prop: style
        // Don't know? Will have to check if this is used.
        this.style;
        // prop: _gridOffsets
        // reference to the plot element grid offsets.
        this._gridOffsets;
        /*  
            Property: _offsets
            Pixel offsets from the edge of the DOM element in pixels.
        
            Properties:
            min - pixel offset to the minimum value.
            max - pixel offset to the maximum value.
        */
        this._offsets = {min:null, max:null};
        // prop: _canvasWidth
        // width of the grid canvas, total DOM element width.
        this._canvasWidth;
        // prop: _canvasHeight
        // height of the grid canvas, total DOM element height.
        this._canvasHeight;
    };
    
    /* 
        Class: Legend
        [Private] Legend object.  Cannot be instantiated directly, but created
        by the Plot oject.  Legend properties can be set or overriden by the 
        options passed in from the user.
    */
    function Legend() {
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
        // prop: border
        // css spec for the border around the legend box.
        this.border = '1px solid #cccccc';
        // prop: background
        // css spec for the background of the legend box.
        this.background = 'rgba(255,255,255,0.6)';
        // prop: textColor
        // css color spec for the legend text.
        this.textColor = '';
        // prop: fontFamily
        // css font-family spec for the legend text.
        this.fontFamily = ''; 
        // prop: fontSize
        // css font-size spec for the legend text.
        this.fontSize = '0.75em';
        // prop: rowSpacing
        // css padding-top spec for the rows in the legend.
        this.rowSpacing = '0.5em';
        // prop: _elem
        // reference to the legend DOM element.
        this._elem;
        
    }
    
    /* 
        Class: Title
        [Private] Plot Title object.  Cannot be instantiated directly, but created
        by the Plot oject.  Title properties can be set or overriden by the 
        options passed in from the user.
        
        Parameters:
            text - text of the title.
    */
    function Title(text) {
        // Group: Properties
        
        // prop: text
        // text of the title;
        this.text = text;
        // prop: fontFamily
        // css font-family spec for the text.
        this.fontFamily = '';
        // prop: fontSize
        // css font-size spec for the text.
        this.fontSize = '1.2em';
        // prop: textAlign
        // css text-align spec for the text.
        this.textAlign = 'center';
        // prop: _elem
        // reference to the title DOM element.
        this._elem;
        // prop: _height
        // height of the DOM element in pixels.
        this._height = 0;
        // prop: _width
        // width of the DOM element in pixels.
        this._width = 0;
        // prop: textColor
        // css color spec for the text.
        this.textColor = '';
        
    }
    
    /* 
        Class: Series
        [Private] An individual data series object.  Cannot be instantiated directly, but created
        by the Plot oject.  Series properties can be set or overriden by the 
        options passed in from the user.
    */
    function Series() {
        // Group: Properties
        
        // prop: show
        // wether or not to draw the series.
        this.show = true;
        // prop: xaxis
        // name of x axis to associate with this series.
        this.xaxis = 'xaxis';
        // prop: _xaxis
        // reference to the underlying x axis object associated with this series.
        this._xaxis = new Axis(this.xaxis);
        // prop: yaxis
        // name of y axis to associate with this series.
        this.yaxis = 'yaxis';
        // prop: _yaxis
        // reference to the underlying y axis object associated with this series.
        this._yaxis = new Axis(this.yaxis);
        // prop: renderer
        // reference to a renderer which will actually draw this series.
        this.renderer = new $.jqplot.lineRenderer();
        // prop: data
        // raw user data points.  These should never be altered!!!
        this.data = [];
        // prop: gridData
        // data in grid coordinates.  User data transformed for plotting on grid.
        this.gridData = [];
        // place holder, don't do anything with points yet.
        //this.points = {show:true, renderer: 'circleRenderer'};
        // prop: color
        // css color spec for the series
        this.color;
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
        // prop: label
        // Line label to use in legend.
        this.label = '';
    };
    
    /* 
        Class: Grid
        [Private] Object representing the grid on which the plot is drawn.  The grid in this
        context is the area bounded by the axes, the area which will contain the series.
        The Grid object cannot be instantiated directly, but is created by the Plot oject.  
        Grid properties can be set or overriden by the options passed in from the user.
    */
    function Grid() {
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
        // prop: _width
        // width of the grid area bounded by the border.
        this._width;
        // prop: _height
        // height of the grid area bounded by the border.
        this._height;
        // prop: _top
        // position of the top of the grid measures from the top left of the DOM container.
        this._top;
        // prop: _bottom
        // position of the bottom of the grid measures from the top left of the DOM container.
        this._bottom;
        // prop: _left
        // position of the left of the grid measures from the top left of the DOM container.
        this._left;
        // prop: _right
        // position of the right of the grid measures from the top left of the DOM container.
        this._right;
        // prop: renderer
        // reference to the object which will actually render the grid.
        this.renderer = new $.jqplot.canvasGridRenderer();
        
    };

    
    /* 
        Class: jqPlot
        [Private] Plot object returned to call to $.jqplot.  Handles parsing user options,
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
        // this.title = {text:null, font:null};
        // handle to the grid canvas drawing context.  Holds the axes, grid, and labels.
        // Stuff that should be rendered only at initial plot drawing.
        this.gctx = null;
        // handle to the series  canvas drawing context.  Holds the rendered
        // rendered series which may be manipulated through user interaction.
        this.sctx = null;
        // handle to the overlay canvas drawing object.  Holds interactive content
        // like highlights that are rendered according to user interaction
        this.octx = null;
        // width and height of the canvas
        this._width = null;
        this._height = null; 
        this._gridOffsets = {top:10, right:10, bottom:10, left:10};
        this.equalXTicks = true;
        this.equalYTicks = true;
        // borrowed colors from Flot.
        this.seriesColors = ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"];
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
        // target - ID of the DOM element the plot will render into.
        // data - data series.
        // options - user specified options object.    
        this.init = function(target, data, options) {
            this.targetId = target;
            this.target = $('#'+target);
            // make sure the target is positioned by some means
            if (!this.target) throw "No plot target specified";
            if (this.target.css('position') == 'static') this.target.css('position', 'relative');
            this.target.css('color', this.textColor);
            this.target.css('font-family', this.fontFamily);
            this.target.css('font-size', this.fontSize);
            this._height = parseFloat(this.target.css('height'));
            this._width = parseFloat(this.target.css('width'));
            if (this._height <=0 || this._width <=0) throw "Canvas dimensions <=0";
            // get a handle to the plot object from the target to help with events.
            $(target).data('jqplot', this);
            this.data = data;
            if (data.length < 1 || data[0].length < 2) throw "Invalid Plot data";
            this.parseOptions(options);
            
            // set the dataBounds (min and max) for each axis
            for (var i=0; i<this.series.length; i++) {
                this.series[i].renderer.processData.call(this.series[i]);
            }
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
                switch (n) {
                    case 'xaxis':
                        //axis.style = {position:'absolute', left:'0px', bottom:'0px'};
                        axis._width = this._width;
                        axis.gridOffset = 'bottom';
                        break;
                    case 'x2axis':
                        //axis.style = {position:'absolute', left:'0px', top:'0px'};
                        axis._width = this._width;
                        axis.gridOffset = 'top';
                        break;
                    case 'yaxis':
                        //axis.style = {position:'absolute', left:'0px', top:'0px'};
                        axis._height = this._height;
                        axis.gridOffset = 'left';
                        break;
                    case 'y2axis':
                        //axis.style = {position:'absolute', right:'0px', top:'0px'};
                        axis._height = this._height;
                        axis.gridOffset = 'right';
                        break;
                    default:
                        break;
                }
            }
            
            for (var i=0; i<this.data.length; i++) {
                var temp = $.extend(true, new Series(), this.seriesDefaults, this.options.series[i]);
                temp.data = this.data[i];
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
                if (temp.show) {
                    temp._xaxis.show = true;
                    temp._yaxis.show = true;
                }
                if (!temp.color) temp.color = this.seriesColors[i];
                this.series.push(temp);
            }
            
            // copy the grid and title options into this object.
            $.extend(true, this.grid, this.options.grid);
            if (typeof this.options.title == 'string') this.title.text = this.options.title;
            else if (typeof this.options.title == 'object') $.extend(true, this.title, this.options.title);
            $.extend(true, this.legend, this.options.legend);
            
            for (var i=0; i<$.jqplot.postParseOptionsHooks.length; i++) {
                $.jqplot.postParseOptionsHooks[i].call(this);
            }
        };
    
        // Function: draw
        // Calls functions needed to draw the plot.
        this.draw = function(){
            this.drawTitle();
            this.drawAxes();
            this.pack();
            this.grid.renderer.createDrawingContext.call(this);
            this.grid.renderer.draw.call(this.grid, this.gctx, this.axes);
            this.drawLegend();
            this.drawSeries();
            for (var i=0; i<$.jqplot.postDrawHooks.length; i++) {
                $.jqplot.postDrawHooks[i].call(this);
            }
        };
        
        // Function: drawTitle
        // Draws the plot title
        this.drawTitle = function(){
            // title will alway start at the top left
            var t = this.title;
            if (t.text) {
                var styletext = 'padding-bottom:0.4em;text-align:center;'+
                    'position:absolute;top:0px;left:0px;width:'+this._width+'px;';
                styletext += (t.textColor) ? 'color:'+t.textColor+';' : '';
                t._elem = $('<div class="jqplot-title" style="'+styletext+'">'+t.text+'</div>').appendTo(this.target);
                t._height = $(t._elem).outerHeight(true);
                t._width = $(t._elem).outerWidth(true);              
            }
        };
        
        // Function: drawAxes
        // Draws the axes on the plot.
        this.drawAxes = function(){
            for (var name in this.axes) {
                this.axes[name].renderer.draw.call(this.axes[name], this.target, this._height, this._width);
            }
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
                axis.renderer.pack.call(axis, offsets);
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
                    var lt = s.label.toString();
                    if (lt) {
                        addrow(lt, s.color, pad);
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
        };

        // Function: drawSeries
        // Calls the series renderer for each series in the plot within the context
        // of the individual series.
        this.drawSeries = function(){
            for (var i=0; i<this.series.length; i++) {
                this.series[i].renderer.draw.call(this.series[i], this.grid, this.sctx);
                for (var j=0; j<$.jqplot.postDrawSeriesHooks.length; j++) {
                    $.jqplot.postDrawSeriesHooks[j].call(this.series[i], this.grid, this.sctx);
                }
            }
        };
    };
    
    // Class: $.jqplot
    // jQuery extension called by user to create plot.
    //
    // Parameters:
    // target - ID of target element to render the plot into.
    // data - an array of data series.
    // options - user defined options object.
    $.jqplot = function(target, data, options) {
        options = options || {};
        var plot = new jqPlot();
        plot.init(target, data, options);
        plot.draw();
        return plot;
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
           
    $.jqplot.lineAxisRenderer = function() {
    };
    
    
    // called with scope of axis
    $.jqplot.lineAxisRenderer.prototype.draw = function(target, plotHeight, plotWidth) {
        var axis = this;
        if (axis.show) {
            // populate the axis label and value properties.
            axis.renderer.setAxis.call(axis, plotHeight, plotWidth);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get it's bounds and
            // position it and the labels correctly on the plot.
            var h, w;
            
            axis._elem = $('<div class="jqplot-axis"></div>').appendTo(target).get(0);
            //for (var s in axis.style) $(axis._elem).css(s, axis.style[s]);
    
            if (axis.ticks.showLabels) {
                for (var i=0; i<axis.ticks.labels.length; i++) {
                    var elem = $('<div class="jqplot-axis-tick"></div>').appendTo(axis._elem).get(0);
                    
                    for (var s in axis.ticks.styles[i]) $(elem).css(s, axis.ticks.styles[i][s]);
                    $(elem).html(axis.ticks.labels[i]);
                    
                    if (axis.ticks.fontFamily) elem.style.fontFamily = axis.ticks.fontFamily;
                    if (axis.ticks.fontSize) elem.style.fontSize = axis.ticks.fontSize;
                    
                    h = $(elem).outerHeight(true);
                    w = $(elem).outerWidth(true);
                    
                    if (axis._height < h) {
                        axis._height = h;
                    }
                    if (axis._width < w) {
                        axis._width = w;
                    }
                }
            }
        }
    };
    
    // called with scope of an axis
    // Populate the axis properties, giving a label and value
    // (corresponding to the user data coordinates, not plot coords.)
    // for each tick on the axis.
    $.jqplot.lineAxisRenderer.prototype.setAxis = function(plotHeight, plotWidth) {
        // if a ticks array is specified, use it to fill in
        // the labels and values.
        var axis = this;
        axis._canvasHeight = plotHeight;
        axis._canvasWidth = plotWidth;
        var db = axis._dataBounds;
        if (axis.ticks && axis.ticks.constructor == Array) {
            var temp = $.extend(true, [], axis.ticks);
            // if 2-D array, match them up
            if (temp[0].lenth) {
                for (var i=0; i< temp; i++) {
                    axis.ticks.labels.push(temp[i][1].toString());
                    axis.ticks.values.push(parseFloat(temp[i][0]));
                }
            }
            // else 1-D array
            else {
                for (var i=0; i< temp; i++) {
                    axis.ticks.labels.push(temp[i].toString());
                    axis.ticks.values.push(parseFloat(temp[i]));
                }
            }
        }
        // else call the axis renderer and fill in the labels
        // and values from there.
        else axis.renderer.fill.call(axis);
    };
    
    $.jqplot.lineAxisRenderer.prototype.fill = function() {
        var name = this.name;
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        if (name == 'xaxis' || name == 'x2axis') {
            dim = this._canvasWidth;
        }
        else {
            dim = this._canvasHeight;
        }
        if (this.numberTicks == null){
            if (dim > 100) {
                this.numberTicks = parseInt(3+(dim-100)/75);
            }
            else this.numberTicks = 3;
        }
        
        
        min = ((this.min != null) ? this.min : db.min);
        max = ((this.max != null) ? this.max : db.max);
        var range = max - min;
        var rmin = min - (this.min != null ? 0 : range/2*(this.scale - 1));
        var rmax = max + (this.max != null ? 0 : range/2*(this.scale - 1));
        this.min = rmin;
        this.max = rmax;
        this.tickInterval = (rmax - rmin)/(this.numberTicks-1);
        for (var i=0; i<this.numberTicks; i++){
            var tt = rmin + i*this.tickInterval
            this.ticks.labels.push(this.tickFormatter(this.ticks.formatString, tt));
            this.ticks.values.push(rmin + i*this.tickInterval);
            var pox = i*15+'px';
            switch (name) {
                case 'xaxis':
                    this.ticks.styles.push({position:'absolute', top:'0px', left:pox, paddingTop:'10px'});
                    break;
                case 'x2axis':
                    this.ticks.styles.push({position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'});
                    break;
                case 'yaxis':
                    this.ticks.styles.push({position:'absolute', right:'0px', top:pox, paddingRight:'10px'});
                    break;
                case 'y2axis':
                    this.ticks.styles.push({position:'absolute', left:'0px', top:pox, paddingLeft:'10px'});
                    break;
                    
            }
        }
        if (name == 'yaxis' || name == 'y2axis') this.ticks.styles.reverse();
    };
    
    // Now we know offsets around the grid, we can define conversioning functions
    // and properly lay out the axes.
    $.jqplot.lineAxisRenderer.prototype.pack = function(offsets, grid) {
        var ticks = this.ticks;
        var tickdivs = $(this._elem).children('div');
        if (this.name == 'xaxis' || this.name == 'x2axis') {
            this._offsets = {min:offsets.left, max:offsets.right};
            
            this.p2u = function(p) {
                return (p - this._offsets.min)*(this.max - this.min)/(this._canvasWidth - this._offsets.max - this._offsets.min) + this.min;
            }
            
            this.u2p = function(u) {
                return (u - this.min) * (this._canvasWidth - this._offsets.max - this._offsets.min) / (this.max - this.min) + this._offsets.min;
            }
            
            if (this.show) {
                // set the position
                if (this.name == 'xaxis') {
                    $(this._elem).css({position:'absolute', left:'0px', top:(this._canvasHeight-offsets.bottom)+'px'});
                }
                else {
                    $(this._elem).css({position:'absolute', left:'0px', bottom:(this._canvasHeight-offsets.top)+'px'});
                }
                for (i=0; i<tickdivs.length; i++) {
                    var shim = $(tickdivs[i]).outerWidth(true)/2;
                    //var t = this.u2p(ticks.values[i]);
                    var val = this.u2p(ticks.values[i]) - shim + 'px';
                    $(tickdivs[i]).css('left', val);
                    // remember, could have done it this way
                    //tickdivs[i].style.left = val;
                }
            }
        }  
        else {
            this._offsets = {min:offsets.bottom, max:offsets.top};
            
            this.p2u = function(p) {
                return (p - this._canvasHeight + this._offsets.min)*(this.max - this.min)/(this._canvasHeight - this._offsets.min - this._offsets.max) + this.min;
            }
            
            this.u2p = function(u) {
                return -(u - this.min) * (this._canvasHeight - this._offsets.min - this._offsets.max) / (this.max - this.min) + this._canvasHeight - this._offsets.min;
            }
            if (this.show) {
                // set the position
                if (this.name == 'yaxis') {
                    $(this._elem).css({position:'absolute', right:(this._canvasWidth-offsets.left)+'px', top:'0px'});
                }
                else {
                    $(this._elem).css({position:'absolute', left:(this._canvasWidth - offsets.right)+'px', top:'0px'});
                }
                for (i=0; i<tickdivs.length; i++) {
                    var shim = $(tickdivs[i]).outerHeight(true)/2;
                    var val = this.u2p(ticks.values[i]) - shim + 'px';
                    $(tickdivs[i]).css('top', val);
                }
            }
        }    
        
    };
    
    // Class: $.jqplot.canvasGridRenderer
    // Rendrer for a jqPlot object which draws the grid as a canvas element on the page.
    $.jqplot.canvasGridRenderer = function(){};
    
    // Function: createDrawingContext
    // Creates (but doesn't populate) the actual canvas elements for plotting.
    // Called within context of jqPlot object.
    $.jqplot.canvasGridRenderer.prototype.createDrawingContext = function(){
        this.gridCanvas = document.createElement('canvas');
        this.gridCanvas.width = this._width;
        this.gridCanvas.height = this._height;
        if ($.browser.msie) // excanvas hack
            this.gridCanvas = window.G_vmlCanvasManager.initElement(this.gridCanvas);
        $(this.gridCanvas).css({ position: 'absolute', left: 0, top: 0 });
        this.target.append(this.gridCanvas);
        this.gctx = this.gridCanvas.getContext("2d");
        
        this.seriesCanvas = document.createElement('canvas');
        this.seriesCanvas.width = this._width;
        this.seriesCanvas.height = this._height;
        if ($.browser.msie) // excanvas hack
            this.seriesCanvas = window.G_vmlCanvasManager.initElement(this.seriesCanvas);
        $(this.seriesCanvas).css({ position: 'absolute', left: 0, top: 0 });
        this.target.append(this.seriesCanvas);
        this.sctx = this.seriesCanvas.getContext("2d");
        
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = this._width;
        this.overlayCanvas.height = this._height;
        if ($.browser.msie) // excanvas hack
            this.overlayCanvas = window.G_vmlCanvasManager.initElement(this.overlayCanvas);
        $(this.overlayCanvas).css({ position: 'absolute', left: 0, top: 0 });
        this.target.append(this.overlayCanvas);
        this.octx = this.overlayCanvas.getContext("2d");
    };
    
    $.jqplot.canvasGridRenderer.prototype.draw = function(ctx, axes) {
        var grid = this;
        // Add the grid onto the grid canvas.  This is the bottom most layer.
        ctx.save();
        ctx.fillStyle = grid.background;
        ctx.fillRect(grid._left, grid._top, grid._width, grid._height);
        if (grid.drawGridlines) {
            ctx.save();
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'round';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#cccccc';
            for (var name in axes) {
                var axis = axes[name];
                if (axis.show) {
                    var ticks = axis.ticks;
                    switch (name) {
                        case 'xaxis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                ctx.beginPath();
                                ctx.moveTo(pos, grid._top);
                                ctx.lineTo(pos, grid._bottom);
                                ctx.stroke();
                            }
                            break;
                        case 'yaxis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                ctx.beginPath();
                                ctx.moveTo(grid._right, pos);
                                ctx.lineTo(grid._left, pos);
                                ctx.stroke();
                            }
                            break;
                        case 'x2axis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                ctx.beginPath();
                                ctx.moveTo(pos, grid._bottom);
                                ctx.lineTo(pos, grid._top);
                                ctx.stroke();
                            }
                            break;
                        case 'y2axis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                ctx.beginPath();
                                ctx.moveTo(grid._left, pos);
                                ctx.lineTo(grid._right, pos);
                                ctx.stroke();
                            }
                            break;
                    }
                }
            }
            ctx.restore();
        }
        
        function drawMark(bx, by, ex, ey) {
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(ex, ey);
            ctx.stroke();
        }
        // Now draw the tick marks.
        ctx.save();
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'round';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cccccc';
        for (var name in axes) {
            var axis = axes[name];
            if (axis.show && axis.ticks.mark) {
                var ticks = axis.ticks;
                var s = ticks.size;
                var m = ticks.mark;
                switch (name) {
                    case 'xaxis':
                        for (var i=0; i<ticks.values.length; i++) {
                            var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                            var b, e;
                            switch (m) {
                                case 'inside':
                                    b = grid._bottom-s;
                                    e = grid._bottom;
                                    break;
                                case 'outside':
                                    b = grid._bottom;
                                    e = grid._bottom+s;
                                    break;
                                case 'cross':
                                    b = grid._bottom-s;
                                    e = grid._bottom+s;
                                    break;
                                default:
                                    b = grid._bottom;
                                    e = grid._bottom+s;
                                    break;
                            }
                            drawMark(pos, b, pos, e);
                        }
                        break;
                    case 'yaxis':
                        for (var i=0; i<ticks.values.length; i++) {
                            var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                            var b, e;
                            switch (m) {
                                case 'outside':
                                    b = grid._left-s;
                                    e = grid._left;
                                    break;
                                case 'inside':
                                    b = grid._left;
                                    e = grid._left+s;
                                    break;
                                case 'cross':
                                    b = grid._left-s;
                                    e = grid._left+s;
                                    break;
                                default:
                                    b = grid._left-s;
                                    e = grid._left;
                                    break;
                            }
                            drawMark(b, pos, e, pos);
                        }
                        break;
                    case 'x2axis':
                        for (var i=0; i<ticks.values.length; i++) {
                            var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                            var b, e;
                            switch (m) {
                                case 'outside':
                                    b = grid._top-s;
                                    e = grid._top;
                                    break;
                                case 'inside':
                                    b = grid._top;
                                    e = grid._top+s;
                                    break;
                                case 'cross':
                                    b = grid._top-s;
                                    e = grid._top+s;
                                    break;
                                default:
                                    b = grid._top-s;
                                    e = grid._top;
                                    break;
                            }
                            drawMark(pos, b, pos, e);
                        }
                        break;
                    case 'y2axis':
                        for (var i=0; i<ticks.values.length; i++) {
                            var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                            var b, e;
                            switch (m) {
                                case 'inside':
                                    b = grid._right-s;
                                    e = grid._right;
                                    break;
                                case 'outside':
                                    b = grid._right;
                                    e = grid._right+s;
                                    break;
                                case 'cross':
                                    b = grid._right-s;
                                    e = grid._right+s;
                                    break;
                                default:
                                    b = grid._right;
                                    e = grid._right+s;
                                    break;
                            }
                            drawMark(b, pos, e, pos);
                        }
                        break;
                }
            }
        }
        ctx.restore();
        ctx.lineWidth = grid.borderWidth;
        ctx.strokeStyle = grid.borderColor;
        ctx.strokeRect(grid._left, grid._top, grid._width, grid._height);
        
        // now draw the shadow
        if (grid.shadow) {
            ctx.save();
            for (var j=0; j<grid.shadowDepth; j++) {
                ctx.translate(Math.cos(grid.shadowAngle*Math.PI/180)*grid.shadowOffset, Math.sin(grid.shadowAngle*Math.PI/180)*grid.shadowOffset);
                ctx.lineWidth = grid.shadowWidth;
                ctx.strokeStyle = 'rgba(0,0,0,'+grid.shadowAlpha+')';
                ctx.lineJoin = 'miter';
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(grid._left, grid._bottom);
                ctx.lineTo(grid._right, grid._bottom);
                ctx.lineTo(grid._right, grid._top);
                ctx.stroke();
                //ctx.strokeRect(grid._left, grid._top, grid._width, grid._height);
            }
            ctx.restore();
        }
    
        ctx.restore();
    };
    
    $.jqplot.lineRenderer = function(){
    };

    // called within scope of an individual series.
    $.jqplot.lineRenderer.prototype.draw = function(grid, ctx) {
        var i;
        ctx.save();
        ctx.beginPath();
        var xaxis = this.xaxis;
        var yaxis = this.yaxis;
        var d = this.data;
        var xp = this._xaxis.u2p;
        var yp = this._yaxis.u2p;
        // use a clipping path to cut lines outside of grid.
        ctx.moveTo(grid._left, grid._top);
        ctx.lineTo(grid._right, grid._top);
        ctx.lineTo(grid._right, grid._bottom);
        ctx.lineTo(grid._left, grid._bottom);
        ctx.closePath();
        ctx.clip();
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        var pointx, pointy;
        // recalculate the grid data
        this.gridData = [];
        this.gridData.push([xp.call(this._xaxis, this.data[0][0]), yp.call(this._yaxis, this.data[0][1])]);
        ctx.moveTo(this.gridData[0][0], this.gridData[0][1]);
        for (var i=1; i<this.data.length; i++) {
            this.gridData.push([xp.call(this._xaxis, this.data[i][0]), yp.call(this._yaxis, this.data[i][1])]);
            ctx.lineTo(this.gridData[i][0], this.gridData[i][1]);
        }
        ctx.stroke();
        
        // now draw the shadows
        if (this.shadow) {
            ctx.save();
            for (var j=0; j<this.shadowDepth; j++) {
                ctx.translate(Math.cos(this.shadowAngle*Math.PI/180)*this.shadowOffset, Math.sin(this.shadowAngle*Math.PI/180)*this.shadowOffset);
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.moveTo(this.gridData[0][0], this.gridData[0][1]);
                for (var i=1; i<this.data.length; i++) {
                    this.gridData.push([xp.call(this._xaxis, this.data[i][0]), yp.call(this._yaxis, this.data[i][1])]);
                    ctx.lineTo(this.gridData[i][0], this.gridData[i][1]);
                }
                ctx.stroke();
            }
            ctx.restore();
        }
        ctx.restore();
    };
    
    $.jqplot.lineRenderer.prototype.processData = function() { 
        // don't have axes conversion functions yet, all we can do is look for bad
        // points and set the axes bounds.  
        var d = this.data;
        var i;
        var dbx = this._xaxis._dataBounds;
        var dby = this._yaxis._dataBounds;

        // weed out any null points and set the axes bounds
        for (i=0; i<d.length; i++) {
            if (d[i] == null || d[i][0] == null || d[i][1] == null) {
                // if line breaking on null values is set, keep the null in the data
                if (this.breakOnNull) d[i] = null;
                // else delete the null to skip the point.
                else d.splice(i,1);
            }
        }
        for (i=0; i<d.length; i++) {
            if (d[i] == null || d[i][0] == null || d[i][1] == null) continue;
            else {                
                if (d[i][0] < dbx.min || dbx.min == null) dbx.min = d[i][0];
                if (d[i][0] > dbx.max || dbx.max == null) dbx.max = d[i][0];
                if (d[i][1] < dby.min || dby.min == null) dby.min = d[i][1];
                if (d[i][1] > dby.max || dby.max == null) dby.max = d[i][1];
            }
        }
    }
	
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

    function sprintf () {
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
    
    $.sprintf = sprintf;
    
})(jQuery);