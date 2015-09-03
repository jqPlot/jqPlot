/*jslint browser: true, plusplus: true, nomen: true, white: false, continue:true */
/*global jQuery */

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: @VERSION
 * Revision: @REVISION
 *
 * Copyright (c) 2009-2013 Chris Leonello
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
(function ($) {
    
    "use strict";
    
    var objCounter = 0;
    
    /**
     * @class $.jqplot.CanvasOverlay
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay = function (opts) {
        
        var options = opts || {},
            objs,
            objslen,
            obj,
            i,
            element;
        
        this.options = {
            bellowSeries: false,
            show: $.jqplot.config.enablePlugins,
            deferDraw: false
        };
        
        // prop: objects
        this.objects = [];
        this.objectNames = [];
        this.canvas = null;
        this.markerRenderer = new $.jqplot.MarkerRenderer({style: 'line'});
        this.markerRenderer.init();
        this.highlightObjectIndex = null;
        
        if (options.objects) {
            
            objs = options.objects;
            
            for (i = 0, objslen = objs.length; i < objslen; i++) {
                
                obj = objs[i];
                
                for (element in obj) {
                    if (obj.hasOwnProperty(element)) {
                        switch (element) {
                        case 'line':
                            this.addLine(obj[element]);
                            break;
                        case 'horizontalLine':
                            this.addHorizontalLine(obj[element]);
                            break;
                        case 'dashedHorizontalLine':
                            this.addDashedHorizontalLine(obj[element]);
                            break;
                        case 'verticalLine':
                            this.addVerticalLine(obj[element]);
                            break;
                        case 'dashedVerticalLine':
                            this.addDashedVerticalLine(obj[element]);
                            break;
                        case 'rectangle':
                            this.addRectangle(obj[element]);
                            break;
                        case 'html':
                            this.addHTML(obj[element]);
                            break;
                        case 'workitem':
                            this.addWorkItem(obj[element]);
                            break;
                        default:
                            break;
                        }
                    }
                    
                }
            }
        }
        
        $.extend(true, this.options, options);
        
    };
    
    /**
     * Called with scope of a plot object
     * @param {object} target 
     * @param {object} data   
     * @param {object} opts   
     */
    $.jqplot.CanvasOverlay.postPlotInit = function (target, data, opts) {
        var options = opts || {};
        // add a canvasOverlay attribute to the plot
        this.plugins.canvasOverlay = new $.jqplot.CanvasOverlay(options.canvasOverlay);
    };

    /**
     * @class
     */
    function LineBase() {
        this.uid = null;
        this.type = null;
        this.gridStart = null;
        this.gridStop = null;
        this.tooltipWidthFactor = 0;
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
            // whether or not to draw a shadow on the line
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
            // prop: showTooltipPrecision
            // Controls how close to line cursor must be to show tooltip.
            // Higher number = closer to line, lower number = farther from line.
            // 1.0 = cursor must be over line.
            showTooltipPrecision: 0.6,
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
            tooltipOffset: 4,
            // prop: tooltipFormatString
            // Format string passed the x and y values of the cursor on the line.
            // e.g., 'Dogs: %.2f, Cats: %d'.
            tooltipFormatString: '%d, %d',

            // SVA
            // Format of values in x 
            xformat: null,
            yformat: null
        };
    }
    
    /**
     * @class HTMLEl
     * @classdesc A HTML element
     * @param {object} options
     */
    function HTMLEl(options) {
        LineBase.call(this);
        this.type = "html";
        var opts = {
            // x value for the start of the line, null to scale to axis min.
            xmin: null,
            // x value for the end of the line, null to scale to axis max.
            xmax: null,
            ymin: null,
            ymax: null
        };
        $.extend(true, this.options, opts, options);
    }
    
    HTMLEl.prototype = new LineBase();
    HTMLEl.prototype.constructor = HTMLEl;
    
    /**
     * @class WorkItem
     * @classdesc A workitem which can be scheduled
     * @param {object} options
     */
    function WorkItem(options) {
        LineBase.call(this);
        this.type = "workitem";
        var opts = {
            // x value for the start of the line, null to scale to axis min.
            xmin: null,
            // x value for the end of the line, null to scale to axis max.
            xmax: null,
            ymin: null,
            ymax: null
        };
        $.extend(true, this.options, opts, options);
    }
    
    WorkItem.prototype = new LineBase();
    WorkItem.prototype.constructor = WorkItem;
    
    /**
     * @class Rectangle
     * @classdesc A rectangle.
     * @param {object} options
     */
    function Rectangle(options) {
        LineBase.call(this);
        this.type = 'rectangle';
        var opts = {
            // prop: xmin
            // x value for the start of the line, null to scale to axis min.
            xmin: null,
            // prop: xmax
            // x value for the end of the line, null to scale to axis max.
            xmax: null,
            // prop xOffset
            // offset ends of the line inside the grid. Number
            xOffset: '6px', // number or string. Number interpreted as units, string as pixels.
            xminOffset: null,
            xmaxOffset: null,
            ymin: null,
            ymax: null,
            yOffset: '6px', // number or string. Number interpreted as units, string as pixels.
            yminOffset: null,
            ymaxOffset: null
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    Rectangle.prototype = new LineBase();
    Rectangle.prototype.constructor = Rectangle;
    
    /**
     * @class Line
     * @classdesc A straight line.
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

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    Line.prototype = new LineBase();
    Line.prototype.constructor = Line;

    /**
     * @class HorizontalLine
     * @classdesc A straight horizontal line.
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

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    HorizontalLine.prototype = new LineBase();
    HorizontalLine.prototype.constructor = HorizontalLine;

    /**
     * @class DashedHorizontalLine
     * @classdesc A straight dashed horizontal line.
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
            dashPattern: [8, 8]
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    DashedHorizontalLine.prototype = new LineBase();
    DashedHorizontalLine.prototype.constructor = DashedHorizontalLine;

    /**
     * @class VerticalLine
     * @classdesc A straight vertical line.
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

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    VerticalLine.prototype = new LineBase();
    VerticalLine.prototype.constructor = VerticalLine;
    
    /**
     * @class DashedVerticalLine
     * @classdesc A straight dashed vertical line.
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
            dashPattern: [8, 8]
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    DashedVerticalLine.prototype = new LineBase();
    DashedVerticalLine.prototype.constructor = DashedVerticalLine;
    
    /**
     * Creates a line object
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay.prototype.addLine = function (opts) {
        var obj = new Line(opts);
        obj.uid = objCounter++;
        this.objects.push(obj);
        this.objectNames.push(obj.options.name);
    };
    
    /**
     * Creates a horizontal line object
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay.prototype.addHorizontalLine = function (opts) {
        var obj = new HorizontalLine(opts);
        obj.uid = objCounter++;
        this.objects.push(obj);
        this.objectNames.push(obj.options.name);
    };
    
    /**
     * Creates an dashed horizontal line object
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay.prototype.addDashedHorizontalLine = function (opts) {
        var obj = new DashedHorizontalLine(opts);
        obj.uid = objCounter++;
        this.objects.push(obj);
        this.objectNames.push(obj.options.name);
    };
    
    /**
     * Creates a vertical line object
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay.prototype.addVerticalLine = function (opts) {
        var obj = new VerticalLine(opts);
        obj.uid = objCounter++;
        this.objects.push(obj);
        this.objectNames.push(obj.options.name);
    };
   
    /**
     * Creates a dashed vertical line object
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay.prototype.addDashedVerticalLine = function (opts) {
        var obj = new DashedVerticalLine(opts);
        obj.uid = objCounter++;
        this.objects.push(obj);
        this.objectNames.push(obj.options.name);
    };
    
    /**
     * Creates a rectangle object
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay.prototype.addRectangle = function (opts) {
        var obj = new Rectangle(opts);
        obj.uid = objCounter++;
        this.objects.push(obj);
        this.objectNames.push(obj.options.name);
    };
    
    /**
     * Creates a workitem object
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay.prototype.addWorkItem = function (opts) {
        var obj = new WorkItem(opts);
        obj.uid = objCounter++;
        this.objects.push(obj);
        this.objectNames.push(obj.options.name);
    };
    
    /**
     * Creates a HTML object
     * @param {object} opts
     */
    $.jqplot.CanvasOverlay.prototype.addHTML = function (opts) {
        var obj = new HTMLEl(opts);
        obj.uid = objCounter++;
        this.objects.push(obj);
        this.objectNames.push(obj.options.name);
    };
    
    /**
     * Removes an object
     * @param {number|string} idx
     */
    $.jqplot.CanvasOverlay.prototype.removeObject = function (idx) {
        var id;
        // check if integer, remove by index
        if ($.type(idx) === "number") {
            this.objects.splice(idx, 1);
            this.objectNames.splice(idx, 1);
        // if string, remove by name
        } else {
            id = $.inArray(idx, this.objectNames);
            if (id !== -1) {
                this.objects.splice(id, 1);
                this.objectNames.splice(id, 1);
            }
        }
    };
    
    /**
     * Returns an object
     * @param {number|string} idx
     * @returns {object}                          
     */
    $.jqplot.CanvasOverlay.prototype.getObject = function (idx) {
        var id;
        // check if integer, remove by index
        if ($.type(idx) === 'number') {
            return this.objects[idx];
        // if string, remove by name
        } else {
            id = $.inArray(idx, this.objectNames);
            if (id !== -1) {
                return this.objects[id];
            }
        }
    };
    
    // Set get as alias for getObject.
    $.jqplot.CanvasOverlay.prototype.get = $.jqplot.CanvasOverlay.prototype.getObject;
    
    /**
     * Clears rectangles from the canvas
     * @param {Object} plot
     */
    $.jqplot.CanvasOverlay.prototype.clear = function (plot) {
        this.canvas._ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    };
    
    /**
     * Draws elements in the canvas
     * @param {Object} plot [[Description]]
     * @returns;
     */
    $.jqplot.CanvasOverlay.prototype.draw = function (plot) {
        
        plot.objectCounter = {};
        
        var self = this,
            canvas = this.canvas,
            obj,
            objs = this.objects,
            objslen = objs.length,
            mr = this.markerRenderer,
            start,
            stop,
            k,
            opts,
            
            /**
             * Draws a line
             * @param {Object} mr   [[Description]]
             * @param {Object} opts [[Description]]
             * @param {Object} obj  [[Description]]
             * @param {Object} plot [[Description]]
             */
            rendererLine = function (mr, opts, obj, plot) {
            
                var xstart,
                    xstop,
                    ystart,
                    ystop,
                    start,
                    stop;
                
                // style and shadow properties should be set before
                // every draw of marker renderer.
                mr.style = 'line';
                opts.closePath = false;
                
                if (obj.options.xformat && obj.options.xformat.type === "date") {

                    if (obj.options.xformat.format) {
                        xstart = plot.axes[obj.options.xaxis].series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.start[0], obj.options.xformat.format)).getTime());
                        xstop = plot.axes[obj.options.xaxis].series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.stop[0], obj.options.xformat.format)).getTime());
                    } else {
                        xstart = plot.axes[obj.options.xaxis].series_u2p($.jsDate.createDate(obj.options.start[0]));
                        xstop = plot.axes[obj.options.xaxis].series_u2p($.jsDate.createDate(obj.options.stop[0]));
                    }
                    
                } else {
                    xstart = plot.axes[obj.options.xaxis].series_u2p(obj.options.start[0]);
                    xstop = plot.axes[obj.options.xaxis].series_u2p(obj.options.stop[0]);
                }
                
                if (obj.options.yformat && obj.options.yformat.type === "date") {
                    if (typeof obj.options.yformat.format !== "undefined") {
                        //console.log($.jsDate.strftime(obj.options.start[1], obj.options.yformat.format));
                        ystart = plot.axes[obj.options.yaxis].series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.start[1], obj.options.yformat.format)).getTime());
                        ystop = plot.axes[obj.options.yaxis].series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.stop[1], obj.options.yformat.format)).getTime());
                    } else {
                        ystart = plot.axes[obj.options.yaxis].series_u2p($.jsDate.createDate(obj.options.start[1]));
                        ystop = plot.axes[obj.options.yaxis].series_u2p($.jsDate.createDate(obj.options.stop[1]));
                    }
                } else {
                    ystart = plot.axes[obj.options.yaxis].series_u2p(obj.options.start[1]);
                    ystop = plot.axes[obj.options.yaxis].series_u2p(obj.options.stop[1]);
                }

                start = [xstart, ystart];
                stop = [xstop, ystop];

                obj.gridStart = start;
                obj.gridStop = stop;

                mr.draw(start, stop, canvas._ctx, opts);
                
            },
            
            /**
             * Draws a horizontal line
             * @param {Object} mr   [[Description]]
             * @param {Object} opts [[Description]]
             * @param {Object} obj  [[Description]]
             * @param {Object} plot [[Description]]
             */
            rendererHorizontalLine = function (mr, opts, obj, plot) {
            
                var xaxis,
                    yaxis,
                    xstart,
                    ystart,
                    xstop,
                    ystop,
                    y,
                    xminoff,
                    xmaxoff;
                
                // style and shadow properties should be set before
                // every draw of marker renderer.
                if (obj.options.y === null) {
                    return;
                }

                mr.style = 'line';
                opts.closePath = false;

                xaxis = plot.axes[obj.options.xaxis];
                y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y);
                xminoff = obj.options.xminOffset || obj.options.xOffset;
                xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;

                if (obj.options.yformat && obj.options.yformat.type === "date") {
                    if (obj.options.yformat.format) {
                        y = plot.axes[obj.options.yaxis].series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.y, obj.options.yformat.format)).getTime());
                    } else {
                        y = plot.axes[obj.options.yaxis].series_u2p($.jsDate.createDate(obj.options.y).getTime());
                    }
                }

                if (obj.options.xmin !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstart = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmin, obj.options.xformat.format)).getTime());
                        } else {
                            xstart = xaxis.series_u2p($.jsDate.createDate(obj.options.xmin).getTime());
                        }
                    } else {
                        xstart = xaxis.series_u2p(obj.options.xmin);
                    }
                } else if (xminoff !== null) {
                    if ($.type(xminoff) === "number") {
                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                    } else if ($.type(xminoff) === "string") {
                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                    }
                }
                
                if (obj.options.xmax !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstop = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmax, obj.options.xformat.format)).getTime());
                        } else {
                            xstop = xaxis.series_u2p($.jsDate.createDate(obj.options.xmax).getTime());
                        }
                    } else {
                        xstop = xaxis.series_u2p(obj.options.xmax);
                    }
                } else if (xmaxoff !== null) {
                    if ($.type(xmaxoff) === "number") {
                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                    } else if ($.type(xmaxoff) === "string") {
                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                    }
                }
                
                if (xstop !== null && xstart !== null) {
                    obj.gridStart = [xstart, y];
                    obj.gridStop = [xstop, y];
                    mr.draw([xstart, y], [xstop, y], canvas._ctx, opts);
                }
                
            },
            
            /**
             * Draws a dashed horizontal line
             * @param {Object} mr   [[Description]]
             * @param {Object} opts [[Description]]
             * @param {Object} obj  [[Description]]
             * @param {Object} plot [[Description]]
             */
            rendererDashedHorizontalLine = function (mr, opts, obj, plot) {
            
                var dashPat = obj.options.dashPattern,
                    dashPatLen = 0,
                    i,
                    xaxis,
                    xstart,
                    xstop,
                    y,
                    x,
                    xminoff,
                    xmaxoff,
                    numDash,
                    b,
                    e,
                    j;

                for (i = 0; i < dashPat.length; i++) {
                    dashPatLen += dashPat[i];
                }

                // style and shadow properties should be set before
                // every draw of marker renderer.
                if (obj.options.y === null) {
                    return;
                }
                    
                mr.style = 'line';
                opts.closePath = false;

                xaxis = plot.axes[obj.options.xaxis];
                y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y);
                xminoff = obj.options.xminOffset || obj.options.xOffset;
                xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;

                if (obj.options.yformat && obj.options.yformat.type === "date") {
                    if (obj.options.yformat.format) {
                        y = plot.axes[obj.options.yaxis].series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.y, obj.options.yformat.format)).getTime());
                    } else {
                        y = plot.axes[obj.options.yaxis].series_u2p($.jsDate.createDate(obj.options.y).getTime());
                    }
                }

                if (obj.options.xmin !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstart = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmin, obj.options.xformat.format)).getTime());
                        } else {
                            xstart = xaxis.series_u2p($.jsDate.createDate(obj.options.xmin).getTime());
                        }
                    } else {
                        xstart = xaxis.series_u2p(obj.options.xmin);
                    }
                } else if (xminoff !== null) {
                    if ($.type(xminoff) === "number") {
                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                    } else if ($.type(xminoff) === "string") {
                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                    }
                }
                
                if (obj.options.xmax !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstop = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmax, obj.options.xformat.format)).getTime());
                        } else {
                            xstop = xaxis.series_u2p($.jsDate.createDate(obj.options.xmax).getTime());
                        }
                    } else {
                        xstop = xaxis.series_u2p(obj.options.xmax);
                    }
                } else if (xmaxoff !== null) {
                    if ($.type(xmaxoff) === "number") {
                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                    } else if ($.type(xmaxoff) === "string") {
                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                    }
                }
                
                if (xstop !== null && xstart !== null) {
                    obj.gridStart = [xstart, y];
                    obj.gridStop = [xstop, y];
                    numDash = Math.ceil((xstop - xstart) / dashPatLen);
                    b = xstart;
                    for (i = 0; i < numDash; i++) {
                        for (j = 0; j < dashPat.length; j += 2) {
                            e = b + dashPat[j];
                            mr.draw([b, y], [e, y], canvas._ctx, opts);
                            b += dashPat[j];
                            if (j < dashPat.length - 1) {
                                b += dashPat[j + 1];
                            }
                        }
                    }
                }
                
            },
            
            /**
             * Draws a vertical line
             * @param {Object} mr   [[Description]]
             * @param {Object} opts [[Description]]
             * @param {Object} obj  [[Description]]
             * @param {Object} plot [[Description]]
             */
            rendererVerticalLine = function (mr, opts, obj, plot) {
            
                var xaxis,
                    yaxis,
                    ystop,
                    ystart,
                    x,
                    yminoff,
                    ymaxoff;
                
                // style and shadow properties should be set before
                // every draw of marker renderer.
                if (obj.options.x === null) {
                    return;
                }
                
                mr.style = 'line';
                opts.closePath = false;
                
                yaxis = plot.axes[obj.options.yaxis];
                x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x);
                yminoff = obj.options.yminOffset || obj.options.yOffset;
                ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                
                if (obj.options.xformat && obj.options.xformat.type === "date") {
                    if (obj.options.xformat.format) {
                        x = plot.axes[obj.options.xaxis].series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.x, obj.options.xformat.format)).getTime());
                    } else {
                        x = plot.axes[obj.options.xaxis].series_u2p($.jsDate.createDate(obj.options.x).getTime());
                    }
                }

                if (obj.options.ymin !== null) {
                    if (obj.options.yformat && obj.options.yformat.type === "date") {
                        if (obj.options.yformat.format) {
                            ystart = yaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.ymin, obj.options.yformat.format)).getTime());
                        } else {
                            ystart = yaxis.series_u2p($.jsDate.createDate(obj.options.ymin).getTime());
                        }
                    } else {
                        ystart = yaxis.series_u2p(obj.options.ymin);
                    }
                } else if (yminoff !== null) {
                    if ($.type(yminoff) === "number") {
                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                    } else if ($.type(yminoff) === "string") {
                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                    }
                }
                
                if (obj.options.ymax !== null) {
                    if (obj.options.yformat && obj.options.yformat.type === "date") {
                        if (obj.options.yformat.format) {
                            ystop = yaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.ymax, obj.options.yformat.format)).getTime());
                        } else {
                            ystop = yaxis.series_u2p($.jsDate.createDate(obj.options.ymax).getTime());
                        }
                    } else {
                        ystop = yaxis.series_u2p(obj.options.ymax);
                    }
                } else if (ymaxoff !== null) {
                    if ($.type(ymaxoff) === "number") {
                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                    } else if ($.type(ymaxoff) === "string") {
                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                    }
                }
                
                if (ystop !== null && ystart !== null) {
                    obj.gridStart = [x, ystart];
                    obj.gridStop = [x, ystop];
                    mr.draw([x, ystart], [x, ystop], canvas._ctx, opts);
                }
                
            },
            
            /**
             * Draws a dashed vertical line
             * @param {Object} mr   [[Description]]
             * @param {Object} opts [[Description]]
             * @param {Object} obj  [[Description]]
             * @param {Object} plot [[Description]]
             */
            rendererDashedVerticalLine = function (mr, opts, obj, plot) {
            
                var dashPat,
                    dashPatLen,
                    yaxis,
                    ystop,
                    ystart,
                    x,
                    yminoff,
                    ymaxoff,
                    i,
                    numDash,
                    firstDashAdjust,
                    b,
                    e,
                    bs,
                    es,
                    j;
                
                dashPat = obj.options.dashPattern;
                dashPatLen = 0;

                for (i = 0; i < dashPat.length; i++) {
                    dashPatLen += dashPat[i];
                }

                // style and shadow properties should be set before
                // every draw of marker renderer.
                if (obj.options.x === null) {
                    return;
                }
                
                mr.style = 'line';
                opts.closePath = false;
                
                yaxis = plot.axes[obj.options.yaxis];
                x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x);
                yminoff = obj.options.yminOffset || obj.options.yOffset;
                ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                
                if (obj.options.xformat && obj.options.xformat.type === "date") {
                    if (obj.options.xformat.format) {
                        x = plot.axes[obj.options.xaxis].series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.x, obj.options.xformat.format)).getTime());
                    } else {
                        x = plot.axes[obj.options.xaxis].series_u2p($.jsDate.createDate(obj.options.x).getTime());
                    }
                }

                if (obj.options.ymin !== null) {
                    if (obj.options.yformat && obj.options.yformat.type === "date") {
                        if (obj.options.yformat.format) {
                            ystart = yaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.ymin, obj.options.yformat.format)).getTime());
                        } else {
                            ystart = yaxis.series_u2p($.jsDate.createDate(obj.options.ymin).getTime());
                        }
                    } else {
                        ystart = yaxis.series_u2p(obj.options.ymin);
                    }
                } else if (yminoff !== null) {
                    if ($.type(yminoff) === "number") {
                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                    } else if ($.type(yminoff) === "string") {
                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                    }
                }
                
                if (obj.options.ymax !== null) {
                    if (obj.options.yformat && obj.options.yformat.type === "date") {
                        if (obj.options.yformat.format) {
                            ystop = yaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.ymax, obj.options.yformat.format)).getTime());
                        } else {
                            ystop = yaxis.series_u2p($.jsDate.createDate(obj.options.ymax).getTime());
                        }
                    } else {
                        ystop = yaxis.series_u2p(obj.options.ymax);
                    }
                } else if (ymaxoff !== null) {
                    if ($.type(ymaxoff) === "number") {
                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                    } else if ($.type(ymaxoff) === "string") {
                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                    }
                }
                
                if (ystop !== null && ystart !== null) {
                    obj.gridStart = [x, ystart];
                    obj.gridStop = [x, ystop];
                    numDash = Math.ceil((ystart - ystop) / dashPatLen);
                    firstDashAdjust = ((numDash * dashPatLen) - (ystart - ystop)) / 2.0;
                    b = ystart;
                    for (i = 0; i < numDash; i++) {
                        for (j = 0; j < dashPat.length; j += 2) {
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
                            mr.draw([x, b], [x, e], canvas._ctx, opts);
                            b -= dashPat[j];
                            if (j < dashPat.length - 1) {
                                b -= dashPat[j + 1];
                            }
                        }
                    }
                }
                
            },
            
            /**
             * Draws a rectangle
             * @param {Object} mr   [[Description]]
             * @param {Object} opts [[Description]]
             * @param {Object} obj  [[Description]]
             * @param {Object} plot [[Description]]
             */
            rendererRectangle = function (mr, opts, obj, plot) {
            
                var xaxis,
                    xstart = null,
                    xstop = null,
                    yaxis,
                    ystart = null,
                    ystop = null,
                    y,
                    x,
                    xminoff,
                    xmaxoff,
                    yminoff,
                    ymaxoff;
                
                // style and shadow properties should be set before
                // every draw of marker renderer.
                mr.style = 'line';
                opts.closePath = true;

                xaxis = plot.axes[obj.options.xaxis];
                y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y);
                xminoff = obj.options.xminOffset || obj.options.xOffset;
                xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;

                if (obj.options.xmin !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstart = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmin, obj.options.xformat.format)).getTime());
                        } else {
                            xstart = xaxis.series_u2p($.jsDate.createDate(obj.options.xmin).getTime());
                        }
                    } else {
                        xstart = xaxis.series_u2p(obj.options.xmin);
                    }
                } else if (xminoff !== null) {
                    if ($.type(xminoff) === "number") {
                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                    } else if ($.type(xminoff) === "string") {
                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                    }
                }

                if (obj.options.xmax !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstop = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmax, obj.options.xformat.format)).getTime());
                        } else {
                            xstop = xaxis.series_u2p($.jsDate.createDate(obj.options.xmax).getTime());
                        }
                    } else {
                        xstop = xaxis.series_u2p(obj.options.xmax);
                    }
                } else if (xmaxoff !== null) {
                    if ($.type(xmaxoff) === "number") {
                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                    } else if ($.type(xmaxoff) === "string") {
                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                    }
                }

                yaxis = plot.axes[obj.options.yaxis];
                x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x);
                yminoff = obj.options.yminOffset || obj.options.yOffset;
                ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                
                if (obj.options.ymin !== null) {
                    if (obj.options.yformat && obj.options.yformat.type === "date") {
                        if (obj.options.yformat.format) {
                            ystart = yaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.ymin, obj.options.yformat.format)).getTime());
                        } else {
                            ystart = yaxis.series_u2p($.jsDate.createDate(obj.options.ymin).getTime());
                        }
                    } else {
                        ystart = yaxis.series_u2p(obj.options.ymin);
                    }
                } else if (yminoff !== null) {
                    if ($.type(yminoff) === "number") {
                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                    } else if ($.type(yminoff) === "string") {
                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                    }
                }
                
                if (obj.options.ymax !== null) {
                    if (obj.options.yformat && obj.options.yformat.type === "date") {
                        if (obj.options.yformat.format) {
                            ystop = yaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.ymax, obj.options.yformat.format)).getTime());
                        } else {
                            ystop = yaxis.series_u2p($.jsDate.createDate(obj.options.ymax).getTime());
                        }
                    } else {
                        ystop = yaxis.series_u2p(obj.options.ymax);
                    }
                } else if (ymaxoff !== null) {
                    if ($.type(ymaxoff) === "number") {
                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                    } else if ($.type(ymaxoff) === "string") {
                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                    }
                }

                if (xstop !== null && xstart !== null && ystop !== null && ystart !== null) {
                    obj.gridStart = [xstart, ystart];
                    obj.gridStop = [xstop, ystop];
                    canvas._ctx.fillStyle = obj.options.color;
                    canvas._ctx.fillRect(xstart, ystart, xstop - xstart, ystop - ystart);
                }
                
            },
            
            /**
             * Draws a HTML element
             * @param {Object} mr   [[Description]]
             * @param {Object} opts [[Description]]
             * @param {Object} obj  [[Description]]
             * @param {Object} plot [[Description]]
             */
            rendererHTML = function (mr, opts, obj, plot) {
            
                var xaxis,
                    xstart = null,
                    xstop = null,
                    yaxis,
                    ystart = null,
                    ystop = null,
                    maxHeight,
                    maxWidth,
                    height,
                    width,
                    left,
                    top,
                    bottom,
                    $target = plot.target,
                    $el = $("<div />", {
                        "class": "jqplot-html",
                        "style": "position:absolute;"
                    }),
                    horizontalPosition;
                
                // style and shadow properties should be set before
                // every draw of marker renderer.
                mr.style = 'line';
                opts.closePath = true;
                
                xaxis = plot.axes[obj.options.xaxis];
                yaxis = plot.axes[obj.options.yaxis];
                
                maxHeight = plot.grid._height || canvas._plotDimensions.height;
                maxWidth = plot.grid._width || canvas._plotDimensions.width;
                
                // Find the time on the xaxis based upon the given xmin
                
                //xstart = xaxis.series_u2p(obj.options.xmin);
                //xstop = xaxis.series_u2p(xaxis.max);
                
                horizontalPosition = obj.options.horitonalPositioning || "bottom";
                
                height = obj.options.height || 40;
                width = obj.options.width || 100;
                
                if (obj.options.xmin !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstart = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmin, obj.options.xformat.format)).getTime());
                        } else {
                            xstart = xaxis.series_u2p($.jsDate.createDate(obj.options.xmin).getTime());
                        }
                    } else {
                        xstart = xaxis.series_u2p(obj.options.xmin);
                    }
                }
                
                if (obj.options.xmax !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstop = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmax, obj.options.xformat.format)).getTime());
                        } else {
                            xstop = xaxis.series_u2p($.jsDate.createDate(obj.options.xmax).getTime());
                        }
                    } else {
                        xstop = xaxis.series_u2p(obj.options.xmax);
                    }
                }
                
                ystart = obj.options.y || 0;
                ystop = obj.options.height || 100;
                
                if (xstop !== null && xstart !== null && ystop !== null && ystart !== null) {
                    
                    obj.gridStart = [xstart, ystart];
                    obj.gridStop = [xstop, ystop];
                    
                    left = xstart + plot._gridPadding.left;
                    top = ystart + plot._gridPadding.top;
                    bottom = ystart + plot._gridPadding.bottom;
                    
                    // Not using canvas elements, but you could if you wanted to.
                    //canvas._ctx.fillStyle = obj.options.color;
                    
                    //console.log("workitem", xstart, ystart, xstop - xstart, ystop - ystart);
                    
                    // x, y, width, height 
                    //canvas._ctx.fillRect(0, 0, 100, 100);
                    //canvas._ctx.fillRect(xstart, ystart, xstop - xstart, ystop);
                    
                    $el.css({
                        "left": left + "px",
                        "height": height + "px",
                        "width": width + "px"
                    });
                    
                    if (horizontalPosition === "bottom") {
                        $el.css({ "bottom": bottom + "px"});
                    } else {
                        $el.css({ "top": top + "px"});
                    }

                    if (obj.options.content) {
                        $el.html(obj.options.content);
                    }

                    if (obj.options.className) {
                        $el.addClass(obj.options.className);
                    }

                    $target.append($el);
                    
                }
                
            },
            
            /**
             * Draws a WorkItem
             * @param {object} mr   [[Description]]
             * @param {object} opts [[Description]]
             * @param {Object}   obj  [[Description]]
             * @param {object} plot [[Description]]
             */
            rendererWorkItem = function (mr, opts, obj, plot) {
            
                var maxWorkItems = (typeof plot.options.canvasOverlay.maxWorkItems !== "undefined") ? plot.options.canvasOverlay.maxWorkItems : 5,
                    xaxis,
                    yaxis,
                    xstart = null,
                    ystart = null,
                    xstop = null,
                    ystop = null,
                    workItemHeight = 0,
                    maxHeight = 0,
                    maxWidth = 0,
                    nrOfWorkItems = plot.objectCounter.workitem.total, // obj.type
                    currentWorkItem = plot.objectCounter.workitem.current,  // integer
                    $target = plot.target,
                    $workitem = $("<div />", {
                        "class": "jqplot-workitem",
                        "style": "position:absolute;"
                    }),
                    fillup = (typeof plot.options.canvasOverlay.fillup !== "undefined") ? plot.options.canvasOverlay.fillup : true;
                
                //console.log("plot", plot);
                
                // style and shadow properties should be set before
                // every draw of marker renderer.
                mr.style = 'line';
                opts.closePath = true;
                
                xaxis = plot.axes[obj.options.xaxis];
                yaxis = plot.axes[obj.options.yaxis];
                
                maxHeight = plot.grid._height || canvas._plotDimensions.height;
                maxWidth = plot.grid._width || canvas._plotDimensions.width;
                
                // Find the time on the xaxis based upon the given xmin
                
                //xstart = xaxis.series_u2p(obj.options.xmin);
                //xstop = xaxis.series_u2p(xaxis.max);
                
                if (obj.options.xmin !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstart = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmin, obj.options.xformat.format)).getTime());
                        } else {
                            xstart = xaxis.series_u2p($.jsDate.createDate(obj.options.xmin).getTime());
                        }
                    } else {
                        xstart = xaxis.series_u2p(obj.options.xmin);
                    }
                }
                
                if (obj.options.xmax !== null) {
                    if (obj.options.xformat && obj.options.xformat.type === "date") {
                        if (obj.options.xformat.format) {
                            xstop = xaxis.series_u2p($.jsDate.createDate($.jsDate.strftime(obj.options.xmax, obj.options.xformat.format)).getTime());
                        } else {
                            xstop = xaxis.series_u2p($.jsDate.createDate(obj.options.xmax).getTime());
                        }
                    } else {
                        xstop = xaxis.series_u2p(obj.options.xmax);
                    }
                }
                
                // Calculated where on the yaxis the element will be displayed
                
                // Fill the whole plot with the work items
                if (fillup) {
                    workItemHeight = maxHeight / nrOfWorkItems;
                    ystart = -(workItemHeight - currentWorkItem * workItemHeight);
                    ystop = workItemHeight * currentWorkItem;
                } else {
                    workItemHeight = maxHeight / maxWorkItems;
                    ystart = -(workItemHeight - currentWorkItem * workItemHeight);
                    ystop = workItemHeight;
                }
                
                //console.log("objectCounter", obj.type, nrOfWorkItems, currentWorkItem);
                
                if (xstop !== null && xstart !== null && ystop !== null && ystart !== null) {
                    
                    obj.gridStart = [xstart, ystart];
                    obj.gridStop = [xstop, ystop];
                    
                    // Not using canvas elements, but you could if you wanted to.
                    //canvas._ctx.fillStyle = obj.options.color;
                    
                    //console.log("workitem", xstart, ystart, xstop - xstart, ystop - ystart);
                    
                    // x, y, width, height 
                    //canvas._ctx.fillRect(0, 0, 100, 100);
                    //canvas._ctx.fillRect(xstart, ystart, xstop - xstart, ystop);
                    
                    // Don't generate work items which won't be visible
                    if (xstart >= 0 && xstart < plot.grid._width) {
                    
                        $workitem.css({
                            "top": ystart + plot._gridPadding.top + "px",
                            "left": xstart + plot._gridPadding.left + "px",
                            "height": workItemHeight + "px",
                            "width": xstop - xstart + "px"
                        });
                        
                        if (obj.options.backgroundColor) {
                            $workitem.css("backgroundColor", obj.options.backgroundColor);
                        }

                        if (obj.options.icon) {
                            $workitem.addClass("icon-" + obj.options.icon);
                        }

                        if (obj.options.content) {
                            $workitem.html(obj.options.content);
                        }

                        if (obj.options.className) {
                            $workitem.addClass(obj.options.className);
                        }

                        $target.append($workitem);
                        
                    }
                    
                }
                
            };
        
        
        if (!this.options.show) {
            return;
        }
        
        // @TODO here if I want to have z-index different on all overlay; 
        this.canvas._ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
        
        // Clear all existing div inside the plot.target
        $(plot.target).find(".jqplot-workitem").remove();

        // Count how many objects for each type we have to render
        for (k = 0; k < objslen; k++) {
            
            obj = objs[k];
            opts = $.extend(true, {}, obj.options);

            // Skip parsing if the obj should not be shown
            if (!obj.options.show) {
                continue;
            }
            
            if (!plot.objectCounter[obj.type]) {
                plot.objectCounter[obj.type] = {
                    total: 1,
                    current: 0
                };
            } else {
                plot.objectCounter[obj.type].total++;
            }
            
        }
        
        // Do the actual rendering of each object
        for (k = 0; k < objslen; k++) {

            obj = objs[k];
            opts = $.extend(true, {}, obj.options);

            // Skip parsing if the obj should not be shown
            if (!obj.options.show) {
                continue;
            }
            
            if (!plot.objectCounter[obj.type]) {
                plot.objectCounter[obj.type].current = 1;
            } else {
                plot.objectCounter[obj.type].current++;
            }

            // style and shadow properties should be set before
            // every draw of marker renderer.
            mr.shadow = obj.options.shadow;

            obj.tooltipWidthFactor = obj.options.lineWidth / obj.options.showTooltipPrecision;

            switch (obj.type) {

            case 'line':
                rendererLine(mr, opts, obj, plot);
                break;

            case 'horizontalLine':
                rendererHorizontalLine(mr, opts, obj, plot);
                break;

            case 'dashedHorizontalLine':
                rendererDashedHorizontalLine(mr, opts, obj, plot);
                break;

            case 'verticalLine':
                rendererVerticalLine(mr, opts, obj, plot);
                break;

            case 'dashedVerticalLine':
                rendererDashedVerticalLine(mr, opts, obj, plot);
                break;

            case 'rectangle':
                rendererRectangle(mr, opts, obj, plot);
                break;
                    
            case 'html':
                rendererHTML(mr, opts, obj, plot);
                break;
                    
            case 'workitem':
                rendererWorkItem(mr, opts, obj, plot);
                break;

            default:
                break;
            }

        }
        
    };
    
    /**
     * Called within context of plot
     * Creates a canvas which we can draw on.
     * Inserts it before the eventCanvas, so eventCanvas will still capture events.
     */
    $.jqplot.CanvasOverlay.postPlotDraw = function () {
        
        var co = this.plugins.canvasOverlay,
            targetCanvas;
        
        // Memory Leaks patch    
        if (co && co.highlightCanvas) {
            co.highlightCanvas.resetCanvas();
            co.highlightCanvas = null;
        }
        
        co.canvas = new $.jqplot.GenericCanvas();
        
        //this.eventCanvas._elem.before(co.canvas.createElement(this._gridPadding, 'jqplot-overlayCanvas-canvas', this._plotDimensions, this));
        targetCanvas = this.eventCanvas;
        
        if (this.plugins.canvasOverlay.options.bellowSeries === true) {
            targetCanvas = this.bellowSeriesCanvas;
        }
        
        targetCanvas._elem.before(co.canvas.createElement(this._gridPadding, 'jqplot-overlayCanvas-canvas', this._plotDimensions, this));

        co.canvas.setContext();
        
        if (!co.deferDraw) {
            co.draw(this);
        }

        co._tooltipElem = $('<div/>', { 'class': 'jqplot-canvasOverlay-tooltip' }).css({ position: 'absolute', display: 'none'});
        
        targetCanvas._elem.before(co._tooltipElem);
        targetCanvas._elem.bind('mouseleave', { elem: co._tooltipElem }, function (ev) { ev.data.elem.hide(); });

        co = null;
        
    };

    /**
     * Displays tooltip
     * @param {Object}   plot
     * @param {Object}   obj
     * @param {array} gridpos
     * @param {array} datapos
     */
    function showTooltip(plot, obj, gridpos, datapos) {
        
        var co = plot.plugins.canvasOverlay,
            elem = co._tooltipElem,
            opts = obj.options,
            x,
            y;
        
        elem.html($.jqplot.sprintf(opts.tooltipFormatString, datapos[0], datapos[1]));
        
        switch (opts.tooltipLocation) {
        case 'nw':
            x = gridpos[0] - plot._gridPadding.left - elem.outerWidth(true) * 1.5 - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
            break;
        case 'n':
            x = gridpos[0] - elem.outerWidth(true) - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) * 1.5;
            break;
        case 'ne':
            x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) / 1.5 - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
            break;
        case 'e':
            x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) / 1.5 - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top - elem.outerHeight(true) / 2;
            break;
        case 'se':
            x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) / 1.5 - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset + elem.outerHeight(true) * 0.5;
            break;
        case 's':
            x = gridpos[0] - elem.outerWidth(true) - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset + elem.outerHeight(true) * 0.5;
            break;
        case 'sw':
            x = gridpos[0] - plot._gridPadding.left - elem.outerWidth(true) * 1.5 - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset + elem.outerHeight(true) * 0.5;
            break;
        case 'w':
            x = gridpos[0] - plot._gridPadding.left - elem.outerWidth(true) * 1.5 - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top - elem.outerHeight(true) / 2;
            break;
        default: // same as 'nw'
            x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
            y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
            break;
        }

        elem.css({ 'left': x, 'top': y, 'zIndex': 1 });
        
        if (opts.fadeTooltip) {
            // Fix for stacked up animations. Thanks Trevor!
            elem.stop(true, true).fadeIn(opts.tooltipFadeSpeed);
        } else {
            elem.show();
        }
        elem = null;
    }

    /**
     * Used in handleMove
     * @param   {array} point  [[Description]]
     * @param   {array} lstart [[Description]]
     * @param   {array} lstop  [[Description]]
     * @param   {number} width  [[Description]]
     * @returns {boolean} is near a line
     */
    function isNearLine(point, lstart, lstop, width) {
        
        var rx,
            ry,
            px,
            py,
            qx,
            qy,
            l,
            eps,
            res,
            ret;
        
        // r is point to test, p and q are end points.
        rx = point[0];
        ry = point[1];
        px = Math.round(lstop[0]);
        py = Math.round(lstop[1]);
        qx = Math.round(lstart[0]);
        qy = Math.round(lstart[1]);

        l = Math.sqrt(Math.pow(px - qx, 2) + Math.pow(py - qy, 2));

        // scale error term by length of line.
        eps = width * l;
        res = Math.abs((qx - px) * (ry - py) - (qy - py) * (rx - px));
        ret = (res < eps) ? true : false;
        
        return ret;
    }
    
    /**
     * Used in handleMove 
     * @param   {array} point  [[Description]]
     * @param   {array} lstart [[Description]]
     * @param   {array} lstop  [[Description]]
     * @param   {number} width  [[Description]]
     * @returns {boolean} is near a rectangle
     */
    function isNearRectangle(point, lstart, lstop, width) {
        
        var rx,
            ry,
            px,
            py,
            qx,
            qy,
            temp,
            ret;
        
        // r is point to test, p and q are end points.
        rx = point[0];
        ry = point[1];
        px = Math.round(lstop[0]);
        py = Math.round(lstop[1]);
        qx = Math.round(lstart[0]);
        qy = Math.round(lstart[1]);

        if (px > qx) { temp = px; px = qx; qx = temp; }
        if (py > qy) { temp = py; py = qy; qy = temp; }
        
        ret = (rx >= px && rx <= qx && ry >= py && ry <= qy);
        
        return ret;
    }

    /**
     * Handles displaying tooltip at correct place 
     * @param {Object}   ev       [[Description]]
     * @param {Object}   gridpos  [[Description]]
     * @param {array} datapos  [[Description]]
     * @param {array} neighbor [[Description]]
     * @param {Object}   plot     [[Description]]
     */
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        
        var co = plot.plugins.canvasOverlay,
            objs = co.objects,
            l = objs.length,
            obj,
            haveHighlight = false,
            elem,
            i,
            n;
        
        for (i = 0; i < l; i++) {
            
            obj = objs[i];

            if (obj.options.showTooltip) {
                
                if (obj.type === 'rectangle') {
                    n = isNearRectangle([gridpos.x, gridpos.y], obj.gridStart, obj.gridStop, obj.tooltipWidthFactor);
                } else {
                    n = isNearLine([gridpos.x, gridpos.y], obj.gridStart, obj.gridStop, obj.tooltipWidthFactor);
                }
                
                datapos = [plot.axes[obj.options.xaxis].series_p2u(gridpos.x), plot.axes[obj.options.yaxis].series_p2u(gridpos.y)];

                // cases:
                //    near line, no highlighting
                //    near line, highliting on this line
                //    near line, highlighting another line
                //    not near any line, highlighting
                //    not near any line, no highlighting

                // near line, not currently highlighting

                if (n && co.highlightObjectIndex === null) {
                    
                    switch (obj.type) {
                    case 'line':
                        showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                        break;

                    case 'horizontalLine':
                    case 'dashedHorizontalLine':
                        showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                        break;

                    case 'verticalLine':
                    case 'dashedVerticalLine':
                        showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                        break;

                    case 'rectangle':
                        showTooltip(plot, obj, [ev.pageX, gridpos.y], [obj.options.x, datapos[1]]);
                        break;

                    default:
                        break;
                    }
                    
                    co.highlightObjectIndex = i;
                    haveHighlight = true;
                    break;
                
                // near line, highlighting another line.
                } else if (n && co.highlightObjectIndex !== i) {
                    
                    // turn off tooltip.
                    elem = co._tooltipElem;
                    
                    if (obj.fadeTooltip) {
                        elem.fadeOut(obj.tooltipFadeSpeed);
                    } else {
                        elem.hide();
                    }

                    // turn on right tooltip.
                    switch (obj.type) {
                    case 'line':
                        showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                        break;

                    case 'horizontalLine':
                    case 'dashedHorizontalLine':
                        showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                        break;

                    case 'verticalLine':
                    case 'dashedVerticalLine':
                        showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                        break;

                    case 'rectangle':
                        showTooltip(plot, obj, [ev.pageX, gridpos.y], [obj.options.x, datapos[1]]);
                        break;

                    default:
                        break;
                    }

                    co.highlightObjectIndex = i;
                    haveHighlight = true;
                    break;
                    
                // near line, already highlighting this line, update
                } else if (n) {
                    
                    switch (obj.type) {
                    case 'line':
                        showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                        break;

                    case 'horizontalLine':
                    case 'dashedHorizontalLine':
                        showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                        break;

                    case 'verticalLine':
                    case 'dashedVerticalLine':
                        showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                        break;

                    case 'rectangle':
                        showTooltip(plot, obj, [ev.pageX, gridpos.y], [obj.options.x, datapos[1]]);
                        break;

                    default:
                        break;
                    }

                    haveHighlight = true;
                    break;
                }
            }
        }

        // check if we are highlighting and not near a line, turn it off.
        if (!haveHighlight && co.highlightObjectIndex !== null) {
            elem = co._tooltipElem;
            obj = co.getObject(co.highlightObjectIndex);
            if (obj.fadeTooltip) {
                elem.fadeOut(obj.tooltipFadeSpeed);
            } else {
                elem.hide();
            }
            co.highlightObjectIndex = null;
        }
    }
    
    $.jqplot.postInitHooks.push($.jqplot.CanvasOverlay.postPlotInit);
    $.jqplot.postDrawHooks.push($.jqplot.CanvasOverlay.postPlotDraw);
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);

}(jQuery));