/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: @VERSION
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    // class: $.jqplot.CanvasOverlay
    $.jqplot.CanvasOverlay = function(opts){
        var options = opts || {};
        this.options = {
            show: $.jqplot.config.enablePlugins,
            deferDraw: false
        };
        // prop: objects
        this.objects = [];
        this.objectNames = [];
        this.canvas = null;
        this.markerRenderer = new $.jqplot.MarkerRenderer({style:'line'});
        this.markerRenderer.init();
        if (options.objects) {
            var objs = options.objects,
                obj;
            for (var i=0; i<objs.length; i++) {
                obj = objs[i];
                for (var n in obj) {
                    switch (n) {
                        case 'line':
                            this.addLine(obj[n]);
                            break;
                        case 'horizontalLine':
                            this.addHorizontalLine(obj[n]);
                            break;
                        case 'dashedHorizontalLine':
                            this.addDashedHorizontalLine(obj[n]);
                            break;
                        case 'verticalLine':
                            this.addVerticalLine(obj[n]);
                            break;
                        case 'dashedVerticalLine':
                            this.addDashedVerticalLine(obj[n]);
                            break;
                        default:
                            break;
                    }
                }   
            }
        }
        $.extend(true, this.options, options);
    };
    
    // called with scope of a plot object
    $.jqplot.CanvasOverlay.postPlotInit = function (target, data, opts) {
        var options = opts || {};
        // add a canvasOverlay attribute to the plot
        this.plugins.canvasOverlay = new $.jqplot.CanvasOverlay(options.canvasOverlay);     
    };


    function LineBase() {
        this.type = null;
        this.gridStart = null;
        this.gridStop = null;
        this.options = {           
            // prop: name
            // Optional name for the overlay object.
            // Can be later used to retrieve the object by name.
            name: null,
            // prop: show
            // true to show (draw), false to not draw.
            show: true,
            // prop: lineWidth
            // Width of the line.
            lineWidth: 2,
            // prop: lineCap
            // Type of ending placed on the line ['round', 'butt', 'square']
            lineCap: 'round',
            // prop: color
            // color of the line
            color: '#666666',
            // prop: shadow
            // wether or not to draw a shadow on the line
            shadow: true,
            // prop: shadowAngle
            // Shadow angle in degrees
            shadowAngle: 45,
            // prop: shadowOffset
            // Shadow offset from line in pixels
            shadowOffset: 1,
            // prop: shadowDepth
            // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
            shadowDepth: 3,
            // prop: shadowAlpha
            // Alpha channel transparency of shadow.  0 = transparent.
            shadowAlpha: '0.07',
            // prop: xaxis
            // X axis to use for positioning/scaling the line.
            xaxis: 'xaxis',
            // prop: yaxis
            // Y axis to use for positioning/scaling the line.
            yaxis: 'yaxis',
            // prop: showTooltip
            // Show a tooltip with data point values.
            showTooltip: false,
            // prop: tooltipLocation
            // Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
            tooltipLocation: 'nw',
            // prop: fadeTooltip
            // true = fade in/out tooltip, flase = show/hide tooltip
            fadeTooltip: true,
            // prop: tooltipFadeSpeed
            // 'slow', 'def', 'fast', or number of milliseconds.
            tooltipFadeSpeed: "fast",
            // prop: tooltipOffset
            // Pixel offset of tooltip from the highlight.
            tooltipOffset: 2,
            // prop: tooltipFormatString
            // Format string passed the x and y values of the cursor on the line.
            // e.g., 'Dogs: %.2f, Cats: %d'.
            tooltipFormatString: '%d, %d'
        }
    }

    /**
     * Class: Line
     * A straight line.
     */
    function Line(options) {
        LineBase.call(this);
        this.type = 'line';
        var opts = {
            // prop: start
            // [x, y] coordinates for the start of the line.
            start: [],
            // prop: stop
            // [x, y] coordinates for the end of the line.
            stop: []
        };
        $.extend(true, this.options, opts, options);
    }

    Line.prototype = new LineBase();
    Line.prototype.constructor = Line;


    /**
     * Class: HorizontalLine
     * A straight horizontal line.
     */
    function HorizontalLine(options) {
        LineBase.call(this);
        this.type = 'horizontalLine';
        var opts = {
            // prop: y
            // y value to position the line
            y: null,
            // prop: xmin
            // x value for the start of the line, null to scale to axis min.
            xmin: null,
            // prop: xmax
            // x value for the end of the line, null to scale to axis max.
            xmax: null,
            // prop xOffset
            // offset ends of the line inside the grid.  Number 
            xOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            xminOffset: null,
            xmaxOffset: null
        };
        $.extend(true, this.options, opts, options);
    }

    HorizontalLine.prototype = new LineBase();
    HorizontalLine.prototype.constructor = HorizontalLine;
    

    /**
     * Class: DashedHorizontalLine
     * A straight dashed horizontal line.
     */
    function DashedHorizontalLine(options) {
        LineBase.call(this);
        this.type = 'dashedHorizontalLine';
        var opts = {
            y: null,
            xmin: null,
            xmax: null,
            xOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            xminOffset: null,
            xmaxOffset: null,
            // prop: dashPattern
            // Array of line, space settings in pixels.
            // Default is 8 pixel of line, 8 pixel of space.
            // Note, limit to a 2 element array b/c of bug with higher order arrays.
            dashPattern: [8,8]
        };
        $.extend(true, this.options, opts, options);
    }

    DashedHorizontalLine.prototype = new LineBase();
    DashedHorizontalLine.prototype.constructor = DashedHorizontalLine;
    

    /**
     * Class: VerticalLine
     * A straight vertical line.
     */
    function VerticalLine(options) {
        LineBase.call(this);
        this.type = 'verticalLine';
        var opts = {
            x: null,
            ymin: null,
            ymax: null,
            yOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            yminOffset: null,
            ymaxOffset: null
        };
        $.extend(true, this.options, opts, options);
    }

    VerticalLine.prototype = new LineBase();
    VerticalLine.prototype.constructor = VerticalLine;
    

    /**
     * Class: DashedVerticalLine
     * A straight dashed vertical line.
     */
    function DashedVerticalLine(options) {
        LineBase.call(this);
        this.type = 'dashedVerticalLine';
        this.start = null;
        this.stop = null;
        var opts = {
            x: null,
            ymin: null,
            ymax: null,
            yOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            yminOffset: null,
            ymaxOffset: null,
            // prop: dashPattern
            // Array of line, space settings in pixels.
            // Default is 8 pixel of line, 8 pixel of space.
            // Note, limit to a 2 element array b/c of bug with higher order arrays.
            dashPattern: [8,8]
        };
        $.extend(true, this.options, opts, options);
    }

    DashedVerticalLine.prototype = new LineBase();
    DashedVerticalLine.prototype.constructor = DashedVerticalLine;
    
    $.jqplot.CanvasOverlay.prototype.addLine = function(opts) {
        var line = new Line(opts);
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addHorizontalLine = function(opts) {
        var line = new HorizontalLine(opts);
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addDashedHorizontalLine = function(opts) {
        var line = new DashedHorizontalLine(opts);
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addVerticalLine = function(opts) {
        var line = new VerticalLine(opts);
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addDashedVerticalLine = function(opts) {
        var line = new DashedVerticalLine(opts);
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.removeObject = function(idx) {
        // check if integer, remove by index
        if ($.type(idx) == 'number') {
            this.objects.splice(idx, 1);
            this.objectNames.splice(idx, 1);
        }
        // if string, remove by name
        else {
            var id = $.inArray(idx, this.objectNames);
            if (id != -1) {
                this.objects.splice(id, 1);
                this.objectNames.splice(id, 1);
            }
        }
    };
    
    $.jqplot.CanvasOverlay.prototype.getObject = function(idx) {
        // check if integer, remove by index
        if ($.type(idx) == 'number') {
            return this.objects[idx];
        }
        // if string, remove by name
        else {
            var id = $.inArray(idx, this.objectNames);
            if (id != -1) {
                return this.objects[id];
            }
        }
    };
    
    // Set get as alias for getObject.
    $.jqplot.CanvasOverlay.prototype.get = $.jqplot.CanvasOverlay.prototype.getObject;
    
    $.jqplot.CanvasOverlay.prototype.clear = function(plot) {
        this.canvas._ctx.clearRect(0,0,this.canvas.getWidth(), this.canvas.getHeight());
    };
    
    $.jqplot.CanvasOverlay.prototype.draw = function(plot) {
        var obj, 
            objs = this.objects,
            mr = this.markerRenderer,
            start,
            stop;
        if (this.options.show) {
            this.canvas._ctx.clearRect(0,0,this.canvas.getWidth(), this.canvas.getHeight());
            for (var k=0; k<objs.length; k++) {
                obj = objs[k];
                var opts = $.extend(true, {}, obj.options);
                if (obj.options.show) {
                    // style and shadow properties should be set before
                    // every draw of marker renderer.
                    mr.shadow = obj.options.shadow;
                    switch (obj.type) {
                        case 'line':
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            mr.style = 'line';
                            opts.closePath = false;
                            start = [plot.axes[obj.options.xaxis].series_u2p(obj.options.start[0]), plot.axes[obj.options.yaxis].series_u2p(obj.options.start[1])];
                            stop = [plot.axes[obj.options.xaxis].series_u2p(obj.options.stop[0]), plot.axes[obj.options.yaxis].series_u2p(obj.options.stop[1])];
                            obj.gridStart = start;
                            obj.gridStop = stop;
                            mr.draw(start, stop, this.canvas._ctx, opts);
                            break;
                        case 'horizontalLine':
                            
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.y != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var xaxis = plot.axes[obj.options.xaxis],
                                    xstart,
                                    xstop,
                                    y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y),
                                    xminoff = obj.options.xminOffset || obj.options.xOffset,
                                    xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;
                                if (obj.options.xmin != null) {
                                    xstart = xaxis.series_u2p(obj.options.xmin);
                                }
                                else if (xminoff != null) {
                                    if ($.type(xminoff) == "number") {
                                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                                    }
                                    else if ($.type(xminoff) == "string") {
                                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                                    }
                                }
                                if (obj.options.xmax != null) {
                                    xstop = xaxis.series_u2p(obj.options.xmax);
                                }
                                else if (xmaxoff != null) {
                                    if ($.type(xmaxoff) == "number") {
                                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                                    }
                                    else if ($.type(xmaxoff) == "string") {
                                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                                    }
                                }
                                if (xstop != null && xstart != null) {
                                    obj.gridStart = [xstart, y];
                                    obj.gridStop = [xstop, y];
                                    mr.draw([xstart, y], [xstop, y], this.canvas._ctx, opts);
                                }
                            }
                            break;

                        case 'dashedHorizontalLine':
                            
                            var dashPat = obj.options.dashPattern;
                            var dashPatLen = 0;
                            for (var i=0; i<dashPat.length; i++) {
                                dashPatLen += dashPat[i];
                            }

                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.y != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var xaxis = plot.axes[obj.options.xaxis],
                                    xstart,
                                    xstop,
                                    y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y),
                                    xminoff = obj.options.xminOffset || obj.options.xOffset,
                                    xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;
                                if (obj.options.xmin != null) {
                                    xstart = xaxis.series_u2p(obj.options.xmin);
                                }
                                else if (xminoff != null) {
                                    if ($.type(xminoff) == "number") {
                                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                                    }
                                    else if ($.type(xminoff) == "string") {
                                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                                    }
                                }
                                if (obj.options.xmax != null) {
                                    xstop = xaxis.series_u2p(obj.options.xmax);
                                }
                                else if (xmaxoff != null) {
                                    if ($.type(xmaxoff) == "number") {
                                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                                    }
                                    else if ($.type(xmaxoff) == "string") {
                                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                                    }
                                }
                                if (xstop != null && xstart != null) {
                                    obj.gridStart = [xstart, y];
                                    obj.gridStop = [xstop, y];
                                    var numDash = Math.ceil((xstop - xstart)/dashPatLen);
                                    var b=xstart, e;
                                    for (var i=0; i<numDash; i++) {
                                        for (var j=0; j<dashPat.length; j+=2) {
                                            e = b+dashPat[j];
                                            mr.draw([b, y], [e, y], this.canvas._ctx, opts);
                                            b += dashPat[j];
                                            if (j < dashPat.length-1) {
                                                b += dashPat[j+1];
                                            }
                                        }
                                    }
                                }
                            }
                            break;

                        case 'verticalLine':
                            
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.x != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var yaxis = plot.axes[obj.options.yaxis],
                                    ystart,
                                    ystop,
                                    x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x),
                                    yminoff = obj.options.yminOffset || obj.options.yOffset,
                                    ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                                if (obj.options.ymin != null) {
                                    ystart = yaxis.series_u2p(obj.options.ymin);
                                }
                                else if (yminoff != null) {
                                    if ($.type(yminoff) == "number") {
                                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                                    }
                                    else if ($.type(yminoff) == "string") {
                                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                                    }
                                }
                                if (obj.options.ymax != null) {
                                    ystop = yaxis.series_u2p(obj.options.ymax);
                                }
                                else if (ymaxoff != null) {
                                    if ($.type(ymaxoff) == "number") {
                                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                                    }
                                    else if ($.type(ymaxoff) == "string") {
                                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                                    }
                                }
                                if (ystop != null && ystart != null) {
                                    obj.gridStart = [x, ystart];
                                    obj.gridStop = [x, ystop];
                                    mr.draw([x, ystart], [x, ystop], this.canvas._ctx, opts);
                                }
                            }
                            break;

                        case 'dashedVerticalLine':
                            
                            var dashPat = obj.options.dashPattern;
                            var dashPatLen = 0;
                            for (var i=0; i<dashPat.length; i++) {
                                dashPatLen += dashPat[i];
                            }

                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.x != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var yaxis = plot.axes[obj.options.yaxis],
                                    ystart,
                                    ystop,
                                    x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x),
                                    yminoff = obj.options.yminOffset || obj.options.yOffset,
                                    ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                                if (obj.options.ymin != null) {
                                    ystart = yaxis.series_u2p(obj.options.ymin);
                                }
                                else if (yminoff != null) {
                                    if ($.type(yminoff) == "number") {
                                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                                    }
                                    else if ($.type(yminoff) == "string") {
                                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                                    }
                                }
                                if (obj.options.ymax != null) {
                                    ystop = yaxis.series_u2p(obj.options.ymax);
                                }
                                else if (ymaxoff != null) {
                                    if ($.type(ymaxoff) == "number") {
                                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                                    }
                                    else if ($.type(ymaxoff) == "string") {
                                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                                    }
                                }


                                if (ystop != null && ystart != null) {
                                    obj.gridStart = [x, ystart];
                                    obj.gridStop = [x, ystop];
                                    var numDash = Math.ceil((ystart - ystop)/dashPatLen);
                                    var firstDashAdjust = ((numDash * dashPatLen) - (ystart - ystop))/2.0;
                                    var b=ystart, e, bs, es;
                                    for (var i=0; i<numDash; i++) {
                                        for (var j=0; j<dashPat.length; j+=2) {
                                            e = b - dashPat[j];
                                            if (e < ystop) {
                                                e = ystop;
                                            }
                                            if (b < ystop) {
                                                b = ystop;
                                            }
                                            // es = e;
                                            // if (i == 0) {
                                            //  es += firstDashAdjust;
                                            // }
                                            mr.draw([x, b], [x, e], this.canvas._ctx, opts);
                                            b -= dashPat[j];
                                            if (j < dashPat.length-1) {
                                                b -= dashPat[j+1];
                                            }
                                        }
                                    }
                                }
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
        }
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.CanvasOverlay.postPlotDraw = function() {
        // Memory Leaks patch    
        if (this.plugins.canvasOverlay && this.plugins.canvasOverlay.highlightCanvas) {
            this.plugins.canvasOverlay.highlightCanvas.resetCanvas();
            this.plugins.canvasOverlay.highlightCanvas = null;
        }
        this.plugins.canvasOverlay.canvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.canvasOverlay.canvas.createElement(this._gridPadding, 'jqplot-overlayCanvas-canvas', this._plotDimensions, this));
        this.plugins.canvasOverlay.canvas.setContext();
        if (!this.plugins.canvasOverlay.deferDraw) {
            this.plugins.canvasOverlay.draw(this);
        }
    };


    function isNearLine(point, lstart, lstop) {

        // r is point to test, p and q are end points.
        rx = point[0];
        ry = point[1];
        px = lstop[0];
        py = lstop[1];
        qx = lstart[0];
        qy = lstart[1];

        var l = Math.sqrt(Math.pow(px-qx, 2) + Math.pow(py-qy, 2));

        // scale error term by length of line.
        var eps = 0.1*l;
        var res = Math.abs((qx-px) * (ry-py) - (qy-py) * (rx-px));
        var ret = (res < eps) ? true : false;
        return ret;
    }


    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var co = plot.plugins.canvasOverlay;
        var objs = co.objects;
        var l = objs.length;
        var obj;
        for (var i=0; i<l; i++) {
            obj = objs[i];
            var n = isNearLine([gridpos.x, gridpos.y], obj.gridStart, obj.gridStop);
            if (n) {
                console.log(n, obj.options.name, [gridpos.x, gridpos.y], obj.gridStart, obj.gridStop); 
            }
        }
    }
    
    $.jqplot.postInitHooks.push($.jqplot.CanvasOverlay.postPlotInit);
    $.jqplot.postDrawHooks.push($.jqplot.CanvasOverlay.postPlotDraw);
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);

})(jQuery);