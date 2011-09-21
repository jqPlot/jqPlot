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

    // if bar renderer is not loaded, load it since pyramid is subclass of bar.
    // Note, have to block with synchronous request in order to execute bar renderer code.
    if ($.jqplot.BarRenderer === undefined) {
        $.ajax({
            url: $.jqplot.pluginLocation + 'jqplot.barRenderer.js',
            dataType: "script",
            async: false
        });
    }

    $.jqplot.PyramidRenderer = function(){
        $.jqplot.BarRenderer.call(this);
    };
    
    $.jqplot.PyramidRenderer.prototype = new $.jqplot.BarRenderer();
    $.jqplot.PyramidRenderer.prototype.constructor = $.jqplot.PyramidRenderer;
    
    // called with scope of a series
    $.jqplot.PyramidRenderer.prototype.init = function(options, plot) {
        options = options || {};
        this._type = 'pyramid';
        // Group: Properties
        //
        // prop: barPadding
        this.barPadding = 10;
        this.barWidth = null;
        // prop: fill
        // True to fill the bars.
        this.fill = true;
        // prop: highlightMouseOver
        // True to highlight slice when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a slice.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // an array of colors to use when highlighting a slice.
        this.highlightColors = [];
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        $.extend(true, this, options);
        
        this.renderer.options = options;
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        // Array of actual data colors used for each data point.
        this._dataColors = [];
        this._barPoints = [];
        this.fillAxis = 'y';
        this._primaryAxis = '_yaxis';
        
        // set the shape renderer options
        var opts = {lineJoin:'miter', lineCap:'round', fill:this.fill, fillRect:this.fill, isarc:false, strokeStyle:this.color, fillStyle:this.color, closePath:this.fill};
        this.renderer.shapeRenderer.init(opts);
        // set the shadow renderer options
        var sopts = {lineJoin:'miter', lineCap:'round', fill:this.fill, fillRect:this.fill, isarc:false, angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, depth:this.shadowDepth, closePath:this.fill};
        this.renderer.shadowRenderer.init(sopts);
        
        // set highlight colors if none provided
        if (this.highlightColors.length === 0) {
            for (var i=0, l=this.seriesColors.length; i<l; i++){
                var rgba = $.jqplot.getColorComponents(this.seriesColors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                this.highlightColors.push('rgb('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+')');
            }
        }
        
        this.highlightColorGenerator = new $.jqplot.ColorGenerator(this.highlightColors);
    };
    
    // setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.PyramidRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        var pdata = this._prevPlotData;
        this.gridData = [];
        this._prevGridData = [];

        var hasNull = false;
        for (var i=0, l=this.data.length; i < l; i++) {
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (data[i][0] != null && data[i][1] != null) {
                this.gridData.push([xp(data[i][1]), yp(data[i][0])]);
            }
            // else if there is a null, preserve it.
            else if (data[i][0] == null) {
                hasNull = true;
                this.gridData.push([xp(data[i][1]), null]);
            }
            else if (data[i][1] == null) {
                hasNull = true;
                this.gridData.push(null, [yp(data[i][0])]);
            }
            // if not a line series or if no nulls in data, push the converted point onto the array.
            // if (pdata[i] != null && pdata[i][0] != null && pdata[i][1] != null) {
            //     this._prevGridData.push([xp.call(this._xaxis, pdata[i][0]), yp.call(this._yaxis, pdata[i][1])]);
            // }
            // // else if there is a null, preserve it.
            // else if (pdata[i] != null && pdata[i][0] == null) {
            //     this._prevGridData.push([null, yp.call(this._yaxis, pdata[i][1])]);
            // }  
            // else if (pdata[i] != null && pdata[i][0] != null && pdata[i][1] == null) {
            //     this._prevGridData.push([xp.call(this._xaxis, pdata[i][0]), null]);
            // }
        }
    };
    
    // makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.PyramidRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gd = [];
        var pgd = [];
        this.renderer._smoothedData = [];
        this.renderer._smoothedPlotData = [];
        this.renderer._hiBandGridData = [];
        this.renderer._lowBandGridData = [];
        this.renderer._hiBandSmoothedData = [];
        this.renderer._lowBandSmoothedData = [];
        var bands = this.renderer.bands;
        var hasNull = false;
        for (var i=0; i<data.length; i++) {
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (data[i][0] != null && data[i][1] != null) {
                gd.push([xp(data[i][1]), yp(data[i][0])]);
            }
            // else if there is a null, preserve it.
            else if (data[i][0] == null) {
                hasNull = true;
                gd.push([xp(data[i][1]), null]);
            }
            else if (data[i][1] == null) {
                hasNull = true;
                gd.push([null, yp(data[i][0])]);
            }
        }
        return gd;
    };


    
    $.jqplot.PyramidRenderer.prototype.draw = function(ctx, gridData, options) {
        var i;
        // Ughhh, have to make a copy of options b/c it may be modified later.
        var opts = $.extend({}, options);
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var xaxis = this.xaxis;
        var yaxis = this.yaxis;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var pointx, pointy;
        // clear out data colors.
        this._dataColors = [];
        this._barPoints = [];
        
        if (this.barWidth == null) {
            this.renderer.setBarWidth.call(this);
        }
        
        // var temp = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
        // var nvals = temp[0];
        // var nseries = temp[1];
        // var pos = temp[2];
        var points = [],
            w,
            h;
        
        // this._barNudge = 0;

        if (showLine) {
            var negativeColors = new $.jqplot.ColorGenerator(this.negativeSeriesColors);
            var positiveColors = new $.jqplot.ColorGenerator(this.seriesColors);
            var negativeColor = negativeColors.get(this.index);
            if (! this.useNegativeColors) {
                negativeColor = opts.fillStyle;
            }
            var positiveColor = opts.fillStyle;
            var base;
            var xstart; 
            var ystart;
            
            for (var i=0; i<gridData.length; i++) {
                if (this.data[i][0] == null) {
                    continue;
                }
                points = [];
                base = gridData[i][1];
                xstart;
                // not stacked and first series in stack

                xstart = this._xaxis.series_u2p(0);

                if (this._plotData[i][1] < 0) {
                    if (this.varyBarColor && !this._stack) {
                        if (this.useNegativeColors) {
                            opts.fillStyle = negativeColors.next();
                        }
                        else {
                            opts.fillStyle = positiveColors.next();
                        }
                    }
                }
                else {
                    if (this.varyBarColor && !this._stack) {
                        opts.fillStyle = positiveColors.next();
                    }
                    else {
                        opts.fillStyle = positiveColor;
                    }                    
                }
                

                if (this._plotData[i][1] >= 0) {
                    // points.push([xstart, base + this.barWidth / 2]);
                    // points.push([xstart, base - this.barWidth / 2]);
                    // points.push([gridData[i][1], base - this.barWidth / 2]);
                    // points.push([gridData[i][1], base + this.barWidth / 2]);
                    w = gridData[i][0] - xstart;
                    h = this.barWidth;
                    points = [xstart, base - this.barWidth/2, w, h];
                }
                else {
                    // points.push([gridData[i][1], base + this.barWidth / 2]);
                    // points.push([gridData[i][1], base - this.barWidth / 2]);
                    // points.push([xstart, base - this.barWidth / 2]);
                    // points.push([xstart, base + this.barWidth / 2]);
                    w = xstart - gridData[i][0];;
                    h = this.barWidth;
                    points = [gridData[i][0], base - this.barWidth/2, w, h];
                }

                this._barPoints.push([[points[0], points[1] + h], [points[0], points[1]], [points[0] + w, points[1]], [points[0] + w, points[1] + h]]);

                if (shadow) {
                    var sopts = $.extend(true, {}, opts);
                    delete sopts.fillStyle;
                    this.renderer.shadowRenderer.draw(ctx, points, sopts);
                }
                var clr = opts.fillStyle || this.color;
                this._dataColors.push(clr);
                this.renderer.shapeRenderer.draw(ctx, points, opts); 
            }  
        }        
        
        if (this.highlightColors.length == 0) {
            this.highlightColors = $.jqplot.computeHighlightColors(this._dataColors);
        }
        
        else if (typeof(this.highlightColors) == 'string') {
            var temp = this.highlightColors;
            this.highlightColors = [];
            for (var i=0; i<this._dataColors.length; i++) {
                this.highlightColors.push(temp);
            }
        }
        
    };

        
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.axes = options.axes || {};
        options.axes.yaxis = options.axes.yaxis || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a pie series
        var setopts = false;
        if (options.seriesDefaults.renderer === $.jqplot.PyramidRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer === $.jqplot.PyramidRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axes.yaxis.renderer = $.jqplot.PyramidAxisRenderer;
            options.legend.show = false;
            options.seriesDefaults.pointLabels = {show: false};
        }
    }

    // Have to add hook here, becuase it needs called before series is inited.
    $.jqplot.preInitHooks.push(preInit);
    

})(jQuery);