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

    $.jqplot.PyramidRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.PyramidRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.PyramidRenderer.prototype.constructor = $.jqplot.PyramidRenderer;
    
    // called with scope of a series
    $.jqplot.PyramidRenderer.prototype.init = function(options, plot) {
        options = options || {};
        this._type = 'pyramid';
        // Group: Properties
        //
        // prop: barPadding
        this.barPadding = 10;
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
        
        // set highlight colors if none provided
        if (this.highlightColors.length === 0) {
            for (var i=0, l=this.serieColors.length; i<l; i++){
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

        plot.preInitHooks.addOnce(preInit);
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
        var hasNull = false;
        for (var i=0, l=this.data.length; i < l; i++) {
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (data[i][0] != null && data[i][1] != null) {
                this.gridData.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
            }
            // else if there is a null, preserve it.
            else if (data[i][0] == null) {
                hasNull = true;
                this.gridData.push([null, yp.call(this._yaxis, data[i][1])]);
            }
            else if (data[i][1] == null) {
                hasNull = true;
                this.gridData.push([xp.call(this._xaxis, data[i][0]), null]);
            }
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (pdata[i] != null && pdata[i][0] != null && pdata[i][1] != null) {
                this._prevGridData.push([xp.call(this._xaxis, pdata[i][0]), yp.call(this._yaxis, pdata[i][1])]);
            }
            // else if there is a null, preserve it.
            else if (pdata[i] != null && pdata[i][0] == null) {
                this._prevGridData.push([null, yp.call(this._yaxis, pdata[i][1])]);
            }  
            else if (pdata[i] != null && pdata[i][0] != null && pdata[i][1] == null) {
                this._prevGridData.push([xp.call(this._xaxis, pdata[i][0]), null]);
            }
        }

        // don't do smoothing or bands on broken lines.
        if (hasNull) {
            this.renderer.smooth = false;
            if (this._type === 'liine') {
                bands.show = false;
            }
        }

        if (this._type === 'line' && bands.show) {
            for (var i=0, l=bands.hiData.length; i<l; i++) {
                this.renderer._hiBandGridData.push([xp.call(this._xaxis, bands.hiData[i][0]), yp.call(this._yaxis, bands.hiData[i][1])]);
            }
            for (var i=0, l=bands.lowData.length; i<l; i++) {
                this.renderer._lowBandGridData.push([xp.call(this._xaxis, bands.lowData[i][0]), yp.call(this._yaxis, bands.lowData[i][1])]);
            }
        }

        // calculate smoothed data if enough points and no nulls
        if (this._type === 'line' && this.renderer.smooth && this.gridData.length > 2) {
            var ret;
            if (this.renderer.constrainSmoothing) {
                ret = computeConstrainedSmoothedData.call(this, this.gridData);
                this.renderer._smoothedData = ret[0];
                this.renderer._smoothedPlotData = ret[1];

                if (bands.show) {
                    ret = computeConstrainedSmoothedData.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ret[0];
                    ret = computeConstrainedSmoothedData.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ret[0];
                }

                ret = null;
            }
            else {
                ret = computeHermiteSmoothedData.call(this, this.gridData);
                this.renderer._smoothedData = ret[0];
                this.renderer._smoothedPlotData = ret[1];

                if (bands.show) {
                    ret = computeHermiteSmoothedData.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ret[0];
                    ret = computeHermiteSmoothedData.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ret[0];
                }

                ret = null;
            }
        }
    };
    
    $.jqplot.PyramidAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.PyramidAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.PyramidAxisRenderer.prototype.constructor = $.jqplot.PyramidAxisRenderer;
        
    $.jqplot.PyramidAxisRenderer.prototype.init = function(options){
        // Group: Properties
        //
        // prop: position
        // Position of axis.  Values are: top, bottom , left, center, right.
        // By default, x and x2 axes are bottom, y axis is center.
        this.position = null;

        if (this.name.charAt(0) === 'x') {
            this.position = 'bottom';
        }
        else {
            this.position = 'center';
        }
        
        $.extend(true, this, options);
        this.renderer.options = options;

    };
        
    
    $.jqplot.PyramidAxisRenderer.prototype.resetDataBounds = function() {
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        var db = this._dataBounds;
        db.min = null;
        db.max = null;
        var tempxmin;
        var tempxmax;
        var tempy;
        // check for when to force min 0 on bar series plots.
        var doforce = (this.show) ? true : false;
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s._plotData;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name === 'xaxis' || this.name === 'x2axis') {
                    tempxmin = Math.min(d[j][1], d[j][2]);
                    tempxmax = Math.max(d[j][1], d[j][2]);
                    if ((tempxmin !== null && tempxmin < db.min) || db.min === null) {
                        db.min = tempxmin;
                    }
                    if ((tempxmax !== null && tempxmax > db.max) || db.max === null) {
                        db.max = tempxmax;
                    }
                }              
                else {
                    tempy = d[j][0];
                    if ((tempy !== null && tempy < db.min) || db.min === null) {
                        db.min = tempy;
                    }
                    if ((tempy !== null && tempy > db.max) || db.max === null) {
                        db.max = tempy;
                    }
                }              
            }

            // Hack to not pad out bottom of plot unless user has specified a padding.
            // every series will have a chance to set doforce to false.  once it is set to 
            // false, it cannot be reset to true.

            if (doforce && this._options.hasOwnProperty('forceTickAt0') && this._options.forceTickAt0 === false) {
                doforce = false;
            }

            else if (doforce && (this._options.pad !== null || this._options.padMin !== null)) {
                doforce = false;
            }
        }

        if (doforce && db.min >= 0) {
            this.padMin = 1.0;
            this.forceTickAt0 = true;
        }
    };
    
    // called with scope of axis
    $.jqplot.PyramidAxisRenderer.prototype.draw = function(ctx, plot) {
        if (this.show) {
            // populate the axis label and value properties.
            // createTicks is a method on the renderer, but
            // call it within the scope of the axis.
            this.renderer.createTicks.call(this);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get it's bounds and
            // position it and the labels correctly on the plot.
            var dim=0;
            var temp;
            // Added for theming.
            if (this._elem) {
                // Memory Leaks patch
                //this._elem.empty();
                this._elem.emptyForce();
                this._elem = null;
            }
            
            this._elem = $(document.createElement('div'));
            this._elem.addClass('jqplot-axis jqplot-pyramid-'+this.name);
            this._elem.css('position', 'absolute');

            
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                this._elem.width(this._plotDimensions.width);
            }
            else {
                this._elem.height(this._plotDimensions.height);
            }
            
            // create a _label object.
            this.labelOptions.axis = this.name;
            this._label = new this.labelRenderer(this.labelOptions);
            if (this._label.show) {
                var elem = this._label.draw(ctx, plot);
                elem.appendTo(this._elem);
                elem = null;
            }
    
            var t = this._ticks;
            var tick;
            for (var i=0; i<t.length; i++) {
                tick = t[i];
                if (tick.show && tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    this._elem.append(tick.draw(ctx, plot));
                }
            }
            tick = null;
            t = null;
        }
        return this._elem;
    };
        
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
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
            options.axesDefaults.renderer = $.jqplot.PyramidAxisRenderer;
            options.legend.show = false;
            options.seriesDefaults.pointLabels = {show: false};
        }
    }
    

})(jQuery);