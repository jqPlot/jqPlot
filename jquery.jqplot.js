/* jqPlot JavaScript plotting library for jQuery.
 * 
 * Copyright (c) 2009 Chris Leonello
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function($) {
    var debug = 1;

    function Axis(name) {
        this.name = name;
        this.show = false;
        // How much bigger or smaller to make the axis than the data range.
        this.scale = 1.2;
        this.numberTicks;
        this.tickInterval;
        this.renderer = new $.jqplot.lineAxisRenderer();
        this.tickFormatter = sprintf;
        this.label = {text:null, font:null, align:null};
        this.ticks = {mark:'outside', size:4, showLabels:true, labels:[], values:[], styles:[], formatString:'%.1f', fontFamily:'', fontSize:'0.75em', textColor:''};
        this.height = 0;
        this.width = 0;
        this.elem;
        // lowest/highest user data associated with this axis.
        this.dataBounds = {min:null, max:null};
        // lowest/highest values on axis.
        this.min=null;
        this.max=null;
        this.style;
        // axis will push the grid at position by value
        this.gridOffsets;
        // pixel offsets of min/max labels
        this.offsets = {min:null, max:null};
        this.canvasWidth;
        this.canvasHeight;
    };
    
    function Legend() {
        this.show = true;
        this.location = 'se'; // one of the compas directions: nw, n, ne, e, se, s, sw, w
        this.xoffset = 12;    // px
        this.yoffset = 12;    // px
        this.border = '1px solid #cccccc';  // css spec for border around legend box
        this.background = 'rgba(255,255,255,0.6)'   // css spec for background of legend box
        this.textColor = '';
        this.fontFamily = '';    // css spec
        this.fontSize = '0.75em';     // css spec
        this.rowSpacing = '0.5em';    // css spec for padding-top of rows
        this.elem;
        
    }
    
    function Title(text) {
        this.text = text;
        this.fontFamily = '';
        this.fontSize = '1.2em';
        this.textAlign = 'center';
        this.elem;
        this.height = 0;
        this.width = 0;
        this.textColor = '';
        
    }
    
    function Series() {
        this.show = true;
        this.xaxis = 'xaxis';
        this._xaxis = new Axis(this.xaxis);
        this.yaxis = 'yaxis';
        this._yaxis = new Axis(this.yaxis);
        this.renderer = new $.jqplot.lineRenderer();
        // raw user data points.  These should never be altered!!!
        this.data = [];
        // data in grid coordinates.  User data transformed for plotting on grid.
        this.gridData = [];
        // place holder, don't do anything with points yet.
        this.points = {show:true, renderer: 'circleRenderer'};
        this.color;
        this.lineWidth = 2.5;
        this.shadow = true;
        // shadow angle in degrees
        this.shadowAngle = 45;
        // shadow offset in pixels
        this.shadowOffset = 1;
        this.shadowDepth = 3;
        this.shadowAlpha = '0.07';
        this.breakOnNull = false;
        this.label = '';
    };
    
    function Grid() {
        this.drawGridlines = true;
        this.background = '#fffdf6';
        this.borderColor = '#999999';
        this.borderWidth = 2.0;
        this.borderShadow = true;
        // shadow angle in degrees
        this.shadowAngle = 45;
        // shadow offset in pixels
        this.shadowOffset = 1.5;
        this.shadowWidth = 3;
        this.shadowDepth = 3;
        this.shadowAlpha = '0.07';
        this.width;
        this.height;
        this.top;
        this.bottom;
        this.left;
        this.right;
        
    };
    
    function circleRenderer(){};
    
    $._jqPlot = function() {
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
        this.width = null;
        this.height = null; 
        this.gridOffsets = {top:10, right:10, bottom:10, left:10};
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
            
        this.init = function(target, data, options) {
            this.targetId = target;
            this.target = $('#'+target);
            // make sure the target is positioned by some means
            if (!this.target) throw "No plot target specified";
            if (this.target.css('position') == 'static') this.target.css('position', 'relative');
            this.target.css('color', this.textColor);
            this.target.css('font-family', this.fontFamily);
            this.target.css('font-size', this.fontSize);
            this.height = parseFloat(this.target.css('height'));
            this.width = parseFloat(this.target.css('width'));
            if (this.height <=0 || this.width <=0) throw "Canvas dimensions <=0";
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
    
        // parse the user supplied options and override defaults, then
        // populate the instance properties
        this.parseOptions = function(options){
            this.options = $.extend(true, {}, this.defaults, options);
            for (var n in this.axes) {
                var axis = this.axes[n];
                $.extend(true, axis, this.options.axesDefaults, this.options.axes[n]);
                switch (n) {
                    case 'xaxis':
                        //axis.style = {position:'absolute', left:'0px', bottom:'0px'};
                        axis.height = 0;
                        axis.width = this.width;
                        axis.gridOffset = 'bottom';
                        break;
                    case 'x2axis':
                        //axis.style = {position:'absolute', left:'0px', top:'0px'};
                        axis.height = 0;
                        axis.width = this.width;
                        axis.gridOffset = 'top';
                        break;
                    case 'yaxis':
                        //axis.style = {position:'absolute', left:'0px', top:'0px'};
                        axis.height = this.height;
                        axis.width = 0;
                        axis.gridOffset = 'left';
                        break;
                    case 'y2axis':
                        //axis.style = {position:'absolute', right:'0px', top:'0px'};
                        axis.height = this.height;
                        axis.width = 0;
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
    
        // create the plot and add it do the dom
        this.draw = function(){
            this.drawTitle();
            this.drawAxes();
            this.pack();
            this.makeCanvas();
            this.drawGrid();
            this.drawLegend();
            this.drawSeries();
            for (var i=0; i<$.jqplot.postDrawHooks.length; i++) {
                $.jqplot.postDrawHooks[i].call(this);
            }
        };
    
        this.drawTitle = function(){
            // title will alway start at the top left
            var t = this.title;
            if (t.text) {
                t.elem = $('<div class="jqplot-title" style="padding-bottom:0.4em;text-align:center;'+
                    'position:absolute;top:0px;left:0px;width:'+this.width+
                    'px;color:'+t.textColor+';">'+t.text+'</div>').appendTo(this.target);
                t.height = $(t.elem).outerHeight(true);
                t.width = $(t.elem).outerWidth(true);              
            }
        };
    
        this.drawAxes = function(){
            for (var name in this.axes) {
                var axis = this.axes[name];
                if (axis.show) {
                    // populate the axis label and value properties.
                    this.setAxis(axis.name);
                    // fill a div with axes labels in the right direction.
                    // Need to pregenerate each axis to get it's bounds and
                    // position it and the labels correctly on the plot.
                    var h, w;
                    
                    axis.elem = $('<div class="jqplot-axis"></div>').appendTo(this.target).get(0);
                    //for (var s in axis.style) $(axis.elem).css(s, axis.style[s]);
            
                    if (axis.ticks.showLabels) {
                        for (var i=0; i<axis.ticks.labels.length; i++) {
                            var elem = $('<div class="jqplot-axis-tick"></div>').appendTo(axis.elem).get(0);
                            
                            for (var s in axis.ticks.styles[i]) $(elem).css(s, axis.ticks.styles[i][s]);
                            $(elem).html(axis.ticks.labels[i]);
                            
                            if (axis.ticks.fontFamily) elem.style.fontFamily = axis.ticks.fontFamily;
                            if (axis.ticks.fontSize) elem.style.fontSize = axis.ticks.fontSize;
                            
                            h = $(elem).outerHeight(true);
                            w = $(elem).outerWidth(true);
                            
                            if (axis.height < h) {
                                axis.height = h;
                            }
                            if (axis.width < w) {
                                axis.width = w;
                            }
                        }
                    }
                    //$(axis.elem).height(axis.height);
                    //$(axis.elem).width(axis.width);
                }
            }
        };
    
        // Populate the axis properties, giving a label and value
        // (corresponding to the user data coordinates, not plot coords.)
        // for each tick on the axis.
        this.setAxis = function(name) {
            // if a ticks array is specified, use it to fill in
            // the labels and values.
            var axis = this.axes[name];
            axis.canvasHeight = this.height;
            axis.canvasWidth = this.width;
            var db = axis.dataBounds;
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
        
        this.pack = function() {
            // calculate grid offsets
            var offsets = this.gridOffsets;
            var axes = this.axes;
            var temp
            temp = this.title.height + axes.x2axis.height;
            if (temp) offsets.top = temp;
            if (axes.yaxis.width) offsets.left = axes.yaxis.width;
            if (axes.xaxis.height) offsets.bottom = axes.xaxis.height;
            if (axes.y2axis.width) offsets.right = axes.y2axis.width;
            
            this.grid.top = this.gridOffsets.top;
            this.grid.left = this.gridOffsets.left;
            this.grid.height = this.height - this.gridOffsets.top - this.gridOffsets.bottom;
            this.grid.width = this.width - this.gridOffsets.left - this.gridOffsets.right;
            this.grid.bottom = this.grid.top + this.grid.height;
            this.grid.right = this.grid.left + this.grid.width;
            
            for (var name in this.axes) {
                var axis = this.axes[name];
                axis.renderer.pack.call(axis, offsets);
            }
            
        };
    
        this.makeCanvas = function(){
            this.gridCanvas = document.createElement('canvas');
            this.gridCanvas.width = this.width;
            this.gridCanvas.height = this.height;
            if ($.browser.msie) // excanvas hack
                this.gridCanvas = window.G_vmlCanvasManager.initElement(this.gridCanvas);
            $(this.gridCanvas).css({ position: 'absolute', left: 0, top: 0 });
            this.target.append(this.gridCanvas);
            this.gctx = this.gridCanvas.getContext("2d");
            
            this.seriesCanvas = document.createElement('canvas');
            this.seriesCanvas.width = this.width;
            this.seriesCanvas.height = this.height;
            if ($.browser.msie) // excanvas hack
                this.seriesCanvas = window.G_vmlCanvasManager.initElement(this.seriesCanvas);
            $(this.seriesCanvas).css({ position: 'absolute', left: 0, top: 0 });
            this.target.append(this.seriesCanvas);
            this.sctx = this.seriesCanvas.getContext("2d");
            
            this.overlayCanvas = document.createElement('canvas');
            this.overlayCanvas.width = this.width;
            this.overlayCanvas.height = this.height;
            if ($.browser.msie) // excanvas hack
                this.overlayCanvas = window.G_vmlCanvasManager.initElement(this.overlayCanvas);
            $(this.overlayCanvas).css({ position: 'absolute', left: 0, top: 0 });
            this.target.append(this.overlayCanvas);
            this.octx = this.overlayCanvas.getContext("2d");
        };
        
        this.drawGrid = function(){
            // Add the grid onto the grid canvas.  This is the bottom most layer.
            var ctx = this.gctx;
            var grid = this.grid;
            ctx.save();
            ctx.fillStyle = grid.background;
            ctx.fillRect(grid.left, grid.top, grid.width, grid.height);
            if (grid.drawGridlines) {
                ctx.save();
                ctx.lineJoin = 'miter';
                ctx.lineCap = 'round';
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#cccccc';
                for (var name in this.axes) {
                    var axis = this.axes[name];
                    if (axis.show) {
                        var ticks = axis.ticks;
                        switch (name) {
                            case 'xaxis':
                                for (var i=0; i<ticks.values.length; i++) {
                                    var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                    ctx.beginPath();
                                    ctx.moveTo(pos, grid.top);
                                    ctx.lineTo(pos, grid.bottom);
                                    ctx.stroke();
                                }
                                break;
                            case 'yaxis':
                                for (var i=0; i<ticks.values.length; i++) {
                                    var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                    ctx.beginPath();
                                    ctx.moveTo(grid.right, pos);
                                    ctx.lineTo(grid.left, pos);
                                    ctx.stroke();
                                }
                                break;
                            case 'x2axis':
                                for (var i=0; i<ticks.values.length; i++) {
                                    var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                    ctx.beginPath();
                                    ctx.moveTo(pos, grid.bottom);
                                    ctx.lineTo(pos, grid.top);
                                    ctx.stroke();
                                }
                                break;
                            case 'y2axis':
                                for (var i=0; i<ticks.values.length; i++) {
                                    var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                    ctx.beginPath();
                                    ctx.moveTo(grid.left, pos);
                                    ctx.lineTo(grid.right, pos);
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
            
            ctx.save();
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'round';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#cccccc';
            for (var name in this.axes) {
                var axis = this.axes[name];
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
                                        b = grid.bottom-s;
                                        e = grid.bottom;
                                        break;
                                    case 'outside':
                                        b = grid.bottom;
                                        e = grid.bottom+s;
                                        break;
                                    case 'cross':
                                        b = grid.bottom-s;
                                        e = grid.bottom+s;
                                        break;
                                    default:
                                        b = grid.bottom;
                                        e = grid.bottom+s;
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
                                        b = grid.left-s;
                                        e = grid.left;
                                        break;
                                    case 'inside':
                                        b = grid.left;
                                        e = grid.left+s;
                                        break;
                                    case 'cross':
                                        b = grid.left-s;
                                        e = grid.left+s;
                                        break;
                                    default:
                                        b = grid.left-s;
                                        e = grid.left;
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
                                        b = grid.top-s;
                                        e = grid.top;
                                        break;
                                    case 'inside':
                                        b = grid.top;
                                        e = grid.top+s;
                                        break;
                                    case 'cross':
                                        b = grid.top-s;
                                        e = grid.top+s;
                                        break;
                                    default:
                                        b = grid.top-s;
                                        e = grid.top;
                                        break;
                                }
                                drawMark(b, pos, e, pos);
                            }
                            break;
                        case 'y2axis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                var b, e;
                                switch (m) {
                                    case 'inside':
                                        b = grid.right-s;
                                        e = grid.right;
                                        break;
                                    case 'outside':
                                        b = grid.right;
                                        e = grid.right+s;
                                        break;
                                    case 'cross':
                                        b = grid.right-s;
                                        e = grid.right+s;
                                        break;
                                    default:
                                        b = grid.right;
                                        e = grid.right+s;
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
            ctx.strokeRect(grid.left, grid.top, grid.width, grid.height);
            
            // now draw the shadow
            if (grid.borderShadow) {
                ctx.save();
                for (var j=0; j<grid.shadowDepth; j++) {
                    ctx.translate(Math.cos(grid.shadowAngle*Math.PI/180)*grid.shadowOffset, Math.sin(grid.shadowAngle*Math.PI/180)*grid.shadowOffset);
                    ctx.lineWidth = grid.shadowWidth;
                    ctx.strokeStyle = 'rgba(0,0,0,'+grid.shadowAlpha+')';
                    ctx.lineJoin = 'miter';
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(grid.left, grid.bottom);
                    ctx.lineTo(grid.right, grid.bottom);
                    ctx.lineTo(grid.right, grid.top);
                    ctx.stroke();
                    //ctx.strokeRect(grid.left, grid.top, grid.width, grid.height);
                }
                ctx.restore();
            }

            ctx.restore();
        };
        
        this.drawLegend = function() {
            var legend = this.legend;
            var grid = this.grid;
            if (legend.show) {
                var series = this.series;
                // make a table.  one line label per row.
                var ss = 'background:'+legend.background+';border:'+legend.border+';font-size:'+legend.fontSize+';font-family:'+legend.fontFamily+';position:absolute;color:'+legend.textColor+';';
                switch (legend.location) {
                    case 'nw':
                        var a = grid.left + legend.xoffset;
                        var b = grid.top + legend.yoffset;
                        ss += 'left:'+a+'px;top:'+b+'px;';
                        break;
                    case 'n':
                        var a = (grid.left + grid.right)/2 + legend.xoffset;
                        var b = grid.top + legend.yoffset;
                        ss += 'left:'+a+'px;top:'+b+'px;';
                        break;
                    case 'ne':
                        var a = grid.right - legend.xoffset;
                        var b = grid.top + legend.yoffset;
                        ss += 'right:'+a+'px;top:'+b+'px;';
                        break;
                    case 'e':
                        var a = grid.right - legend.xoffset;
                        var b = (grid.top + grid.bottom)/2 + legend.yoffset;
                        ss += 'right:'+a+'px;top:'+b+'px;';
                        break;
                    case 'se':
                        var a = this.width - grid.right + legend.xoffset;
                        var b = this.height - grid.bottom + legend.yoffset;
                        ss += 'right:'+a+'px;bottom:'+b+'px;';
                        break;
                    case 's':
                        var a = (grid.left + grid.right)/2 + legend.xoffset;
                        var b = grid.bottom + legend.yoffset;
                        ss += 'left:'+a+'px;bottom:'+b+'px;';
                        break;
                    case 'sw':
                        var a = grid.left + legend.xoffset;
                        var b = grid.bottom + legend.yoffset;
                        ss += 'left:'+a+'px;bottom:'+b+'px;';
                        break;
                    case 'w':
                        var a = grid.left + legend.xoffset;
                        var b = (grid.top + grid.bottom)/2 + legend.yoffset;
                        ss += 'left:'+a+'px;top:'+b+'px;';
                        break;
                    default:  // same as 'se'
                        var a = grid.right - legend.xoffset;
                        var b = grid.bottom + legend.yoffset;
                        ss += 'right:'+a+'px;bottom:'+b+'px;';
                        break;
                        
                }
                legend.elem = $('<table class="jqplot-legend" style="'+ss+'"></table>').appendTo(this.target).get(0);
                
                function addrow(label, color, pad) {
                    var rs = (pad) ? legend.rowSpacing : '0';
                    var tr = $('<tr class="jqplot-legend"></tr>').appendTo(legend.elem);
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
    
        this.drawSeries = function(){
            for (var i=0; i<this.series.length; i++) {
                this.series[i].renderer.draw.call(this.series[i], this.grid, this.sctx);
                for (var j=0; j<$.jqplot.postDrawSeriesHooks.length; j++) {
                    $.jqplot.postDrawSeriesHooks[j].call(this.series[i], this.grid, this.sctx);
                }
            }
        };
    
        this.drawPoints = function(){};   

    };
    
    $.jqplot = function(target, data, options) {
        options = options || {};
        var plot = new $._jqPlot();
        plot.init(target, data, options);
        plot.draw();
        return plot;
    };
    
    $.jqplot.postParseOptionsHooks = [];
    $.jqplot.postDrawHooks = [];
    $.jqplot.postDrawSeriesHooks = [];
    $.jqplot.drawLegendHooks = [];
           
    $.jqplot.lineAxisRenderer = function() {
    };
    
    $.jqplot.lineAxisRenderer.prototype.fill = function() {
        var name = this.name;
        var db = this.dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        if (name == 'xaxis' || name == 'x2axis') {
            dim = this.canvasWidth;
        }
        else {
            dim = this.canvasHeight;
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
        var tickdivs = $(this.elem).children('div');
        if (this.name == 'xaxis' || this.name == 'x2axis') {
            this.offsets = {min:offsets.left, max:offsets.right};
            
            this.p2u = function(p) {
                return (p - this.offsets.min)*(this.max - this.min)/(this.canvasWidth - this.offsets.max - this.offsets.min) + this.min;
            }
            
            this.u2p = function(u) {
                return (u - this.min) * (this.canvasWidth - this.offsets.max - this.offsets.min) / (this.max - this.min) + this.offsets.min;
            }
            
            if (this.show) {
                // set the position
                if (this.name == 'xaxis') {
                    $(this.elem).css({position:'absolute', left:'0px', top:(this.canvasHeight-offsets.bottom)+'px'});
                }
                else {
                    $(this.elem).css({position:'absolute', left:'0px', bottom:(this.canvasHeight-offsets.top)+'px'});
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
            this.offsets = {min:offsets.bottom, max:offsets.top};
            
            this.p2u = function(p) {
                return (p - this.canvasHeight + this.offsets.min)*(this.max - this.min)/(this.canvasHeight - this.offsets.min - this.offsets.max) + this.min;
            }
            
            this.u2p = function(u) {
                return -(u - this.min) * (this.canvasHeight - this.offsets.min - this.offsets.max) / (this.max - this.min) + this.canvasHeight - this.offsets.min;
            }
            if (this.show) {
                // set the position
                if (this.name == 'yaxis') {
                    $(this.elem).css({position:'absolute', right:(this.canvasWidth-offsets.left)+'px', top:'0px'});
                }
                else {
                    $(this.elem).css({position:'absolute', left:(this.canvasWidth - offsets.right)+'px', top:'0px'});
                }
                for (i=0; i<tickdivs.length; i++) {
                    var shim = $(tickdivs[i]).outerHeight(true)/2;
                    var val = this.u2p(ticks.values[i]) - shim + 'px';
                    $(tickdivs[i]).css('top', val);
                }
            }
        }    
        
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
        ctx.moveTo(grid.left, grid.top);
        ctx.lineTo(grid.right, grid.top);
        ctx.lineTo(grid.right, grid.bottom);
        ctx.lineTo(grid.left, grid.bottom);
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
        var dbx = this._xaxis.dataBounds;
        var dby = this._yaxis.dataBounds;

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
	        console.log(arguments);
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