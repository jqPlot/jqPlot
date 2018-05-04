/*jslint browser: true, plusplus: true, nomen: true, white: false, continue: true */
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
    
    // Class: $.jqplot.BarRenderer
    // A plugin renderer for jqPlot to draw a bar plot.
    // Draws series as a line.
    
    var /**
         *
         */
        highlight = function (plot, sidx, pidx, points) {
            var s,
                canvas,
                opts;
            s = plot.series[sidx];
            canvas = plot.plugins.barRenderer.highlightCanvas;
            canvas._ctx.clearRect(0, 0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
            s._highlightedPoint = pidx;
            plot.plugins.barRenderer.highlightedSeriesIndex = sidx;
            opts = {fillStyle: s.highlightColors[pidx]};
            s.renderer.shapeRenderer.draw(canvas._ctx, points, opts);
            canvas = null;
        },
    
        /**
         * [[Description]]
         * @param {Object} plot [[Description]]
         */
        unhighlight = function (plot) {
            var canvas = plot.plugins.barRenderer.highlightCanvas,
                i;
            canvas._ctx.clearRect(0, 0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
            for (i = 0; i < plot.series.length; i++) {
                plot.series[i]._highlightedPoint = null;
            }
            plot.plugins.barRenderer.highlightedSeriesIndex = null;
            plot.target.trigger('jqplotDataUnhighlight');
            canvas = null;
        },

        /**
         * [[Description]]
         * @param {Object}   ev       [[Description]]
         * @param {[[Type]]} gridpos  [[Description]]
         * @param {[[Type]]} datapos  [[Description]]
         * @param {Object}   neighbor [[Description]]
         * @param {Object}   plot     [[Description]]
         */
        handleMove = function (ev, gridpos, datapos, neighbor, plot) {

            var ins,
                evt1,
                evt;

            if (neighbor) {
                ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
                evt1 = jQuery.Event('jqplotDataMouseOver');
                evt1.pageX = ev.pageX;
                evt1.pageY = ev.pageY;
                plot.target.trigger(evt1, ins);
                if (plot.series[ins[0]].show && plot.series[ins[0]].highlightMouseOver && !(ins[0] === plot.plugins.barRenderer.highlightedSeriesIndex && ins[1] === plot.series[ins[0]]._highlightedPoint)) {
                    evt = jQuery.Event('jqplotDataHighlight');
                    evt.which = ev.which;
                    evt.pageX = ev.pageX;
                    evt.pageY = ev.pageY;
                    plot.target.trigger(evt, ins);
                    highlight(plot, neighbor.seriesIndex, neighbor.pointIndex, neighbor.points);
                }
            } else if (neighbor === null) {
                unhighlight(plot);
            }
        },

        /**
         * [[Description]]
         * @param {Object}   ev       [[Description]]
         * @param {[[Type]]} gridpos  [[Description]]
         * @param {[[Type]]} datapos  [[Description]]
         * @param {Object}   neighbor [[Description]]
         * @param {Object}   plot     [[Description]]
         */
        handleMouseDown = function (ev, gridpos, datapos, neighbor, plot) {
            var ins,
                evt;
            if (neighbor) {
                ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
                if (plot.series[ins[0]].highlightMouseDown && !(ins[0] === plot.plugins.barRenderer.highlightedSeriesIndex && ins[1] === plot.series[ins[0]]._highlightedPoint)) {
                    evt = jQuery.Event('jqplotDataHighlight');
                    evt.which = ev.which;
                    evt.pageX = ev.pageX;
                    evt.pageY = ev.pageY;
                    plot.target.trigger(evt, ins);
                    highlight(plot, neighbor.seriesIndex, neighbor.pointIndex, neighbor.points);
                }
            } else if (neighbor === null) {
                unhighlight(plot);
            }
        },

        /**
         * [[Description]]
         * @param {[[Type]]} ev       [[Description]]
         * @param {[[Type]]} gridpos  [[Description]]
         * @param {[[Type]]} datapos  [[Description]]
         * @param {[[Type]]} neighbor [[Description]]
         * @param {Object}   plot     [[Description]]
         */
        handleMouseUp = function (ev, gridpos, datapos, neighbor, plot) {
            var idx = plot.plugins.barRenderer.highlightedSeriesIndex;
            if (idx !== null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
        },

        /**
         * [[Description]]
         * @param {Object}   ev       [[Description]]
         * @param {[[Type]]} gridpos  [[Description]]
         * @param {[[Type]]} datapos  [[Description]]
         * @param {Object}   neighbor [[Description]]
         * @param {Object}   plot     [[Description]]
         */
        handleClick = function (ev, gridpos, datapos, neighbor, plot) {
            var ins,
                evt;
            if (neighbor) {
                ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
                evt = jQuery.Event('jqplotDataClick');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
            }
        },

        /**
         * [[Description]]
         * @param {Object}   ev       [[Description]]
         * @param {[[Type]]} gridpos  [[Description]]
         * @param {[[Type]]} datapos  [[Description]]
         * @param {Object}   neighbor [[Description]]
         * @param {Object}   plot     [[Description]]
         */
        handleRightClick = function (ev, gridpos, datapos, neighbor, plot) {
            var ins,
                idx,
                evt;
            if (neighbor) {
                ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
                idx = plot.plugins.barRenderer.highlightedSeriesIndex;
                if (idx !== null && plot.series[idx].highlightMouseDown) {
                    unhighlight(plot);
                }
                evt = jQuery.Event('jqplotDataRightClick');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
            }
        },

        /**
         * [[Description]]
         * @param   {[[Type]]} sidx [[Description]]
         * @param   {[[Type]]} didx [[Description]]
         * @param   {[[Type]]} comp [[Description]]
         * @param   {Object}   plot [[Description]]
         * @param   {Object}   axis [[Description]]
         * @returns {[[Type]]} [[Description]]
         */
        getStart = function (sidx, didx, comp, plot, axis) {
            // check if sign change
            var seriesIndex = sidx,
                prevSeriesIndex = sidx - 1,
                start,
                prevVal,
                aidx = (axis === 'x') ? 0 : 1;

            // is this not the first series?
            if (seriesIndex > 0) {
                prevVal = plot.series[prevSeriesIndex]._plotData[didx][aidx];

                // is there a sign change
                if ((comp * prevVal) < 0) {
                    start = getStart(prevSeriesIndex, didx, comp, plot, axis);
                // no sign change. 
                } else {
                    start = plot.series[prevSeriesIndex].gridData[didx][aidx];
                }

            // if first series, return value at 0
            } else {
                start = (aidx === 0) ? plot.series[seriesIndex]._xaxis.series_u2p(0) : plot.series[seriesIndex]._yaxis.series_u2p(0);
            }

            return start;
        },

        /**
         * [[Description]]
         * @param   {[[Type]]} colors [[Description]]
         * @returns {[[Type]]} [[Description]]
         */
        computeHighlightColors = function (colors) {

            var ret = [],
                i,
                rgba,
                newrgb,
                sum,
                j;

            for (i = 0; i < colors.length; i++) {
                rgba = $.jqplot.getColorComponents(colors[i]);
                newrgb = [rgba[0], rgba[1], rgba[2]];
                sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (j = 0; j < 3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                ret.push('rgb(' + newrgb[0] + ',' + newrgb[1] + ',' + newrgb[2] + ')');
            }
            return ret;
        },
    
        /**
         * called with scope of series
         * @param {[[Type]]} target         [[Description]]
         * @param {Array}    data           [[Description]]
         * @param {[[Type]]} seriesDefaults [[Description]]
         * @param {[[Type]]} options        [[Description]]
         */
        barPreInit = function (target, data, seriesDefaults, options) {

            var sum,
                pos,
                i,
                l,
                skip,
                count;

            if (this.rendererOptions.barDirection === 'horizontal') {
                this._stackAxis = 'x';
                this._primaryAxis = '_yaxis';
            }

            if (this.rendererOptions.waterfall === true) {

                this._data = $.extend(true, [], this.data);

                sum = 0;
                pos = (!this.rendererOptions.barDirection || this.rendererOptions.barDirection === 'vertical' || this.transposedData === false) ? 1 : 0;

                for (i = 0; i < this.data.length; i++) {
                    sum += this.data[i][pos];
                    if (i > 0) {
                        this.data[i][pos] += this.data[i - 1][pos];
                    }
                }
                this.data[this.data.length] = (pos === 1) ? [this.data.length + 1, sum] : [sum, this.data.length + 1];
                this._data[this._data.length] = (pos === 1) ? [this._data.length + 1, sum] : [sum, this._data.length + 1];
            }

            if (this.rendererOptions.groups > 1) {

                this.breakOnNull = true;

                l = this.data.length;
                skip = parseInt(l / this.rendererOptions.groups, 10);
                count = 0;

                for (i = skip; i < l; i += skip) {
                    this.data.splice(i + count, 0, [null, null]);
                    this._plotData.splice(i + count, 0, [null, null]);
                    this._stackData.splice(i + count, 0, [null, null]);
                    count++;
                }

                for (i = 0; i < this.data.length; i++) {
                    if (this._primaryAxis === '_xaxis') {
                        this.data[i][0] = i + 1;
                        this._plotData[i][0] = i + 1;
                        this._stackData[i][0] = i + 1;
                    } else {
                        this.data[i][1] = i + 1;
                        this._plotData[i][1] = i + 1;
                        this._stackData[i][1] = i + 1;
                    }
                }
            }
        };
    
    /**
     * @class
     */
    $.jqplot.BarRenderer = function () {
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.BarRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.BarRenderer.prototype.constructor = $.jqplot.BarRenderer;
    
    /**
     * called with scope of series.
     * @param {Object} options [[Description]]
     * @param {Object} plot    [[Description]]
     */
    $.jqplot.BarRenderer.prototype.init = function (options, plot) {
        
        var opts,
            sopts,
            
            /**
             * [[Description]]
             * @param {[[Type]]} target  [[Description]]
             * @param {[[Type]]} data    [[Description]]
             * @param {[[Type]]} options [[Description]]
             */
            postInit = function (target, data, options) {
                var i;
                for (i = 0; i < this.series.length; i++) {
                    if (this.series[i].renderer.constructor === $.jqplot.BarRenderer) {
                        // don't allow mouseover and mousedown at same time.
                        if (this.series[i].highlightMouseOver) {
                            this.series[i].highlightMouseDown = false;
                        }
                    }
                }
            },
            
            /**
             * called within context of plot
             * create a canvas which we can draw on.
             * insert it before the eventCanvas, so eventCanvas will still capture events.
             */
            postPlotDraw = function () {

                // Memory Leaks patch    
                if (this.plugins.barRenderer && this.plugins.barRenderer.highlightCanvas) {
                    this.plugins.barRenderer.highlightCanvas.resetCanvas();
                    this.plugins.barRenderer.highlightCanvas = null;
                }

                this.plugins.barRenderer = {highlightedSeriesIndex: null};
                this.plugins.barRenderer.highlightCanvas = new $.jqplot.GenericCanvas();

                this.eventCanvas._elem.before(this.plugins.barRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-barRenderer-highlight-canvas', this._plotDimensions, this));
                this.plugins.barRenderer.highlightCanvas.setContext();
                this.eventCanvas._elem.bind('mouseleave', {plot: this}, function (ev) { unhighlight(ev.data.plot); });
                
            };
        
        // Group: Properties
        //
        // prop: barPadding
        // Number of pixels between adjacent bars at the same axis value.
        this.barPadding = 8;
        // prop: barMargin
        // Number of pixels between groups of bars at adjacent axis values.
        this.barMargin = 10;
        // prop: barDirection
        // 'vertical' = up and down bars, 'horizontal' = side to side bars
        this.barDirection = 'vertical';
        // prop: barWidth
        // Width of the bar in pixels (auto by default).  null = calculated automatically.
        this.barWidth = null;
        // prop: shadowOffset
        // offset of the shadow from the slice and offset of 
        // each succesive stroke of the shadow from the last.
        this.shadowOffset = 2;
        // prop: shadowDepth
        // number of strokes to apply to the shadow, 
        // each stroke offset shadowOffset from the last.
        this.shadowDepth = 5;
        // prop: shadowAlpha
        // transparency of the shadow (0 = transparent, 1 = opaque)
        this.shadowAlpha = 0.08;
        // prop: waterfall
        // true to enable waterfall plot.
        this.waterfall = false;
        // prop: groups
        // group bars into this many groups
        this.groups = 1;
        // prop: varyBarColor
        // true to color each bar of a series separately rather than
        // have every bar of a given series the same color.
        // If used for non-stacked multiple series bar plots, user should
        // specify a separate 'seriesColors' array for each series.
        // Otherwise, each series will set their bars to the same color array.
        // This option has no Effect for stacked bar charts and is disabled.
        this.varyBarColor = false;
        // prop: highlightMouseOver
        // True to highlight slice when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a slice.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // an array of colors to use when highlighting a bar.
        this.highlightColors = [];
        // prop: transposedData
        // NOT IMPLEMENTED YET.  True if this is a horizontal bar plot and 
        // x and y values are "transposed".  Tranposed, or "swapped", data is 
        // required prior to rev. 894 builds of jqPlot with horizontal bars. 
        // Allows backward compatability of bar renderer horizontal bars with 
        // old style data sets.
        this.transposedData = true;
        this.renderer.animation = {
            show: false,
            direction: 'down',
            speed: 3000,
            _supported: true
        };
        this._type = 'bar';
        // prop: onTick
        this.onTick = false;
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver === null) {
            options.highlightMouseOver = false;
        }
        
        //////
        // This is probably wrong here.
        // After going back and forth on whether renderer should be the thing
        // or extend the thing, it seems that it it best if it is a property
        // on the thing.  This should be something that is commonized 
        // among series renderers in the future.
        //////
        $.extend(true, this, options);

        // really should probably do this
        $.extend(true, this.renderer, options);
        
        // fill is still needed to properly draw the legend.
        // bars have to be filled.
        this.fill = true;

        // if horizontal bar and animating, reset the default direction
        if (this.barDirection === 'horizontal' && this.rendererOptions.animation && this.rendererOptions.animation.direction === null) {
            this.renderer.animation.direction = 'left';
        }
        
        if (this.waterfall) {
            this.fillToZero = false;
            this.disableStack = true;
        }
        
        if (this.barDirection === 'vertical') {
            this._primaryAxis = '_xaxis';
            this._stackAxis = 'y';
            this.fillAxis = 'y';
        } else {
            this._primaryAxis = '_yaxis';
            this._stackAxis = 'x';
            this.fillAxis = 'x';
        }
        
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        // total number of values for all bar series, total number of bar series, and position of this series
        this._plotSeriesInfo = null;
        // Array of actual data colors used for each data point.
        this._dataColors = [];
        this._barPoints = [];
        
        // set the shape renderer options
        opts = {lineJoin: 'miter', lineCap: 'round', fill: true, isarc: false, strokeStyle: this.color, fillStyle: this.color, closePath: this.fill};
        
        this.renderer.shapeRenderer.init(opts);
        
        // set the shadow renderer options
        sopts = {lineJoin: 'miter', lineCap: 'round', fill: true, isarc: false, angle: this.shadowAngle, offset: this.shadowOffset, alpha: this.shadowAlpha, depth: this.shadowDepth, closePath: this.fill};
        
        this.renderer.shadowRenderer.init(sopts);
        
        plot.postInitHooks.addOnce($.proxy(postInit, plot));
        plot.postDrawHooks.addOnce($.proxy(postPlotDraw, plot));
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);

    };
    
    $.jqplot.preSeriesInitHooks.push(barPreInit);
    
    /**
     * needs to be called with scope of series, not renderer.
     * @returns {Array} [[Description]]
     */
    $.jqplot.BarRenderer.prototype.calcSeriesNumbers = function () {
        
        var nvals,
            nseries,
            paxis,
            s,
            series,
            pos,
            i;
        
        nvals = 0;
        nseries = 0;
        paxis = this[this._primaryAxis];

        // loop through all series on this axis
        for (i = 0; i < paxis._series.length; i++) {
            series = paxis._series[i];
            if (series === this) {
                pos = i;
            }
            // is the series rendered as a bar?
            if (series.renderer.constructor === $.jqplot.BarRenderer) {
                // gridData may not be computed yet, use data length insted
                nvals += series.data.length;
                nseries += 1;
            }
        }
        // return total number of values for all bar series, total number of bar series, and position of this series
        return [nvals, nseries, pos];
    };

    /**
     * [[Description]]
     * @returns {Array} [[Description]]
     */
    $.jqplot.BarRenderer.prototype.setBarWidth = function () {
        
        var i,
            nvals,
            nseries,
            paxis,
            s,
            series,
            pos,
            temp,
            nticks,
            nbins;
        
        
        // need to know how many data values we have on the approprate axis and figure it out.
        nvals = 0;
        nseries = 0;
        paxis = this[this._primaryAxis];
        
        temp = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
        nvals = temp[0];
        nseries = temp[1];
        nticks = paxis.numberTicks;
        nbins = (nticks - 1) / 2;
        
        if (this.onTick) {
            
            if (this.barDirection === 'vertical') {
                this.barWidth = Math.floor(paxis._plotWidth / nticks);
            } else if (this.barDirection === 'horizontal') {
                this.barWidth = Math.floor(paxis._plotHeight / nticks);
            }
            
        } else {
            
            // so, now we have total number of axis values.
            if (paxis.name === 'xaxis' || paxis.name === 'x2axis') {
                if (this._stack) {
                    this.barWidth = (paxis._offsets.max - paxis._offsets.min) / nvals * nseries - this.barMargin;
                } else {
                    this.barWidth = ((paxis._offsets.max - paxis._offsets.min) / nbins  - this.barPadding * (nseries - 1) - this.barMargin * 2) / nseries;
                    // this.barWidth = (paxis._offsets.max - paxis._offsets.min) / nvals - this.barPadding - this.barMargin/nseries;
                }
            } else {
                if (this._stack) {
                    this.barWidth = (paxis._offsets.min - paxis._offsets.max) / nvals * nseries - this.barMargin;
                } else {
                    this.barWidth = ((paxis._offsets.min - paxis._offsets.max) / nbins  - this.barPadding * (nseries - 1) - this.barMargin * 2) / nseries;
                    // this.barWidth = (paxis._offsets.min - paxis._offsets.max) / nvals - this.barPadding - this.barMargin/nseries;
                }
            }
        }
        
        return [nvals, nseries];
        
    };

    /**
     * [[Description]]
     * @param {Object}   ctx      [[Description]]
     * @param {[[Type]]} gridData [[Description]]
     * @param {[[Type]]} options  [[Description]]
     * @param {Object}   plot     [[Description]]
     */
    $.jqplot.BarRenderer.prototype.draw = function (ctx, gridData, options, plot) {
        
        var i,
            opts,
            shadow,
            showLine,
            fill,
            xaxis,
            yaxis,
            yp,
            xp,
            pointx,
            pointy,
            temp,
            nvals,
            nseries,
            pos,
            points,
            negativeColors,
            positiveColors,
            negativeColor,
            positiveColor,
            base,
            xstart,
            ystart,
            sopts,
            clr;
        
        // Ughhh, have to make a copy of options b/c it may be modified later.
        opts = $.extend({}, options);
        shadow = opts.shadow || this.shadow;
        showLine = opts.showLine || this.showLine;
        fill = opts.fill || this.fill;
        xaxis = this.xaxis;
        yaxis = this.yaxis;
        xp = this._xaxis.series_u2p;
        yp = this._yaxis.series_u2p;
        
        if (this.onTick) {
            shadow = false;
        }

        // clear out data colors.
        this._dataColors = [];
        this._barPoints = [];
        
        if (this.barWidth === null) {
            this.renderer.setBarWidth.call(this);
        }
        
        temp = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
        nvals = temp[0];
        nseries = temp[1];
        pos = temp[2];
        points = [];
        
        if (this._stack) {
            this._barNudge = 0;
        } else {
            this._barNudge = (-Math.abs(nseries / 2 - 0.5) + pos) * (this.barWidth + this.barPadding);
        }
        
        if (showLine) {
            
            negativeColors = new $.jqplot.ColorGenerator(this.negativeSeriesColors);
            positiveColors = new $.jqplot.ColorGenerator(this.seriesColors);
            negativeColor = negativeColors.get(this.index);
            
            if (!this.useNegativeColors) {
                negativeColor = opts.fillStyle;
            }
            
            positiveColor = opts.fillStyle;
            
            if (this.barDirection === 'vertical') {
                
                for (i = 0; i < gridData.length; i++) {
                    
                    // @TODO verify null !== undefined
                    if (!this._stack && this.data[i][1] === null) {
                        continue;
                    }
                    
                    points = [];
                    base = gridData[i][0] + this._barNudge;
                    
                    // stacked
                    if (this._stack && this._prevGridData.length) {
                        
                        ystart = getStart(this.index, i, this._plotData[i][1], plot, 'y');
                    
                    // not stacked
                    } else {
                        
                        if (this.fillToZero) {
                            ystart = this._yaxis.series_u2p(0);
                        } else if (this.waterfall && i > 0 && i < this.gridData.length - 1) {
                            ystart = this.gridData[i - 1][1];
                        } else if (this.waterfall && i === 0 && i < this.gridData.length - 1) {
                            if (this._yaxis.min <= 0 && this._yaxis.max >= 0) {
                                ystart = this._yaxis.series_u2p(0);
                            } else if (this._yaxis.min > 0) {
                                ystart = ctx.canvas.height;
                            } else {
                                ystart = 0;
                            }
                        } else if (this.waterfall && i === this.gridData.length - 1) {
                            if (this._yaxis.min <= 0 && this._yaxis.max >= 0) {
                                ystart = this._yaxis.series_u2p(0);
                            } else if (this._yaxis.min > 0) {
                                ystart = ctx.canvas.height;
                            } else {
                                ystart = 0;
                            }
                        } else {
                            ystart = ctx.canvas.height;
                        }
                    }
                    
                    if ((this.fillToZero && this._plotData[i][1] < 0) || (this.waterfall && this._data[i][1] < 0)) {
                        if (this.varyBarColor && !this._stack) {
                            if (this.useNegativeColors) {
                                opts.fillStyle = negativeColors.next();
                            } else {
                                opts.fillStyle = positiveColors.next();
                            }
                        } else {
                            opts.fillStyle = negativeColor;
                        }
                    } else {
                        if (this.varyBarColor && !this._stack) {
                            opts.fillStyle = positiveColors.next();
                        } else {
                            opts.fillStyle = positiveColor;
                        }
                    }
                    
                    if (!this.fillToZero || this._plotData[i][1] >= 0) {
                        
                        if (!this.onTick) {
                            points.push([base - this.barWidth / 2, ystart]);
                            points.push([base - this.barWidth / 2, gridData[i][1]]);
                            points.push([base + this.barWidth / 2, gridData[i][1]]);
                            points.push([base + this.barWidth / 2, ystart]);
                        } else {
                            points.push([base, ystart]);
                            points.push([base, gridData[i][1]]);
                            points.push([base + this.barWidth, gridData[i][1]]);
                            points.push([base + this.barWidth, ystart]);
                        }
                        
                    // for negative bars make sure points are always ordered clockwise
                    } else {
                        
                        if (!this.onTick) {
                            points.push([base - this.barWidth / 2, gridData[i][1]]);
                            points.push([base - this.barWidth / 2, ystart]);
                            points.push([base + this.barWidth / 2, ystart]);
                            points.push([base + this.barWidth / 2, gridData[i][1]]);
                        } else {
                            points.push([base, gridData[i][1]]);
                            points.push([base, ystart]);
                            points.push([base + this.barWidth, ystart]);
                            points.push([base + this.barWidth, gridData[i][1]]);
                        }
                        
                    }
                    
                    this._barPoints.push(points);
                    
                    // now draw the shadows if not stacked.
                    // for stacked plots, they are predrawn by drawShadow
                    if (shadow && !this._stack) {
                        sopts = $.extend(true, {}, opts);
                        // need to get rid of fillStyle on shadow.
                        delete sopts.fillStyle;
                        this.renderer.shadowRenderer.draw(ctx, points, sopts);
                    }
                    
                    clr = opts.fillStyle || this.color;
                    
                    this._dataColors.push(clr);
                    this.renderer.shapeRenderer.draw(ctx, points, opts);
                    
                }
                
            } else if (this.barDirection === 'horizontal') {
                
                for (i = 0; i < gridData.length; i++) {
                    
                    if (!this._stack && this.data[i][0] === null) {
                        continue;
                    }
                    
                    points = [];
                    base = gridData[i][1] - this._barNudge;
                    
                    if (this._stack && this._prevGridData.length) {
                        xstart = getStart(this.index, i, this._plotData[i][0], plot, 'x');
                    // not stacked
                    } else {
                        if (this.fillToZero) {
                            xstart = this._xaxis.series_u2p(0);
                        } else if (this.waterfall && i > 0 && i < this.gridData.length - 1) {
                            xstart = this.gridData[i - 1][0];
                        } else if (this.waterfall && i === 0 && i < this.gridData.length - 1) {
                            if (this._xaxis.min <= 0 && this._xaxis.max >= 0) {
                                xstart = this._xaxis.series_u2p(0);
                            } else if (this._xaxis.min > 0) {
                                xstart = 0;
                            } else {
                                xstart = 0;
                            }
                        } else if (this.waterfall && i === this.gridData.length - 1) {
                            if (this._xaxis.min <= 0 && this._xaxis.max >= 0) {
                                xstart = this._xaxis.series_u2p(0);
                            } else if (this._xaxis.min > 0) {
                                xstart = 0;
                            } else {
                                xstart = ctx.canvas.width;
                            }
                        } else {
                            xstart = 0;
                        }
                    }
                    
                    if ((this.fillToZero && this._plotData[i][0] < 0) || (this.waterfall && this._data[i][0] < 0)) {
                        if (this.varyBarColor && !this._stack) {
                            if (this.useNegativeColors) {
                                opts.fillStyle = negativeColors.next();
                            } else {
                                opts.fillStyle = positiveColors.next();
                            }
                        } else {
                            opts.fillStyle = negativeColor;
                        }
                    } else {
                        if (this.varyBarColor && !this._stack) {
                            opts.fillStyle = positiveColors.next();
                        } else {
                            opts.fillStyle = positiveColor;
                        }
                    }

                    if (!this.fillToZero || this._plotData[i][0] >= 0) {
                        points.push([xstart, base + this.barWidth / 2]);
                        points.push([xstart, base - this.barWidth / 2]);
                        points.push([gridData[i][0], base - this.barWidth / 2]);
                        points.push([gridData[i][0], base + this.barWidth / 2]);
                    } else {
                        points.push([gridData[i][0], base + this.barWidth / 2]);
                        points.push([gridData[i][0], base - this.barWidth / 2]);
                        points.push([xstart, base - this.barWidth / 2]);
                        points.push([xstart, base + this.barWidth / 2]);
                    }

                    this._barPoints.push(points);
                    
                    // now draw the shadows if not stacked.
                    // for stacked plots, they are predrawn by drawShadow
                    if (shadow && !this._stack) {
                        sopts = $.extend(true, {}, opts);
                        delete sopts.fillStyle;
                        this.renderer.shadowRenderer.draw(ctx, points, sopts);
                    }
                    
                    clr = opts.fillStyle || this.color;
                    this._dataColors.push(clr);
                    this.renderer.shapeRenderer.draw(ctx, points, opts);
                }
            }
        }
        
        if (this.highlightColors.length === 0) {
            this.highlightColors = $.jqplot.computeHighlightColors(this._dataColors);
        } else if (typeof (this.highlightColors) === 'string') {
            temp = this.highlightColors;
            this.highlightColors = [];
            for (i = 0; i < this._dataColors.length; i++) {
                this.highlightColors.push(temp);
            }
        }
        
    };
    
    /**
     * for stacked plots, shadows will be pre drawn by drawShadow.
     * @param {Object}   ctx      [[Description]]
     * @param {[[Type]]} gridData [[Description]]
     * @param {[[Type]]} options  [[Description]]
     * @param {Object}   plot     [[Description]]
     */
    $.jqplot.BarRenderer.prototype.drawShadow = function (ctx, gridData, options, plot) {
        
        var i,
            opts,
            shadow,
            showLine,
            fill,
            xaxis,
            yaxis,
            xp,
            yp,
            pointx,
            points,
            pointy,
            nvals,
            nseries,
            pos,
            temp,
            ystart,
            xstart,
            base;
        
        opts = options || {};
        shadow = opts.shadow || this.shadow;
        showLine = opts.showLine || this.showLine;
        fill = opts.fill || this.fill;
        xaxis = this.xaxis;
        yaxis = this.yaxis;
        xp = this._xaxis.series_u2p;
        yp = this._yaxis.series_u2p;
        
        if (!this.onTick && this._stack && this.shadow) {
            
            if (this.barWidth === null) {
                this.renderer.setBarWidth.call(this);
            }
        
            temp = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
            nvals = temp[0];
            nseries = temp[1];
            pos = temp[2];
        
            if (this._stack) {
                this._barNudge = 0;
            } else {
                this._barNudge = (-Math.abs(nseries / 2 - 0.5) + pos) * (this.barWidth + this.barPadding);
            }
            
            if (showLine) {
            
                if (this.barDirection === 'vertical') {
                    
                    for (i = 0; i < gridData.length; i++) {
                        
                        if (this.data[i][1] === null) {
                            continue;
                        }
                        
                        points = [];
                        
                        base = gridData[i][0] + this._barNudge;
                    
                        if (this._stack && this._prevGridData.length) {
                            ystart = getStart(this.index, i, this._plotData[i][1], plot, 'y');
                        } else {
                            if (this.fillToZero) {
                                ystart = this._yaxis.series_u2p(0);
                            } else {
                                ystart = ctx.canvas.height;
                            }
                        }
                    
                        points.push([base - this.barWidth / 2, ystart]);
                        points.push([base - this.barWidth / 2, gridData[i][1]]);
                        points.push([base + this.barWidth / 2, gridData[i][1]]);
                        points.push([base + this.barWidth / 2, ystart]);
                        
                        this.renderer.shadowRenderer.draw(ctx, points, opts);
                        
                    }
                    
                } else if (this.barDirection === 'horizontal') {
                    
                    for (i = 0; i < gridData.length; i++) {
                        
                        if (this.data[i][0] === null) {
                            continue;
                        }
                        
                        points = [];
                        base = gridData[i][1] - this._barNudge;
                    
                        if (this._stack && this._prevGridData.length) {
                            xstart = getStart(this.index, i, this._plotData[i][0], plot, 'x');
                        } else {
                            if (this.fillToZero) {
                                xstart = this._xaxis.series_u2p(0);
                            } else {
                                xstart = 0;
                            }
                        }
                    
                        points.push([xstart, base + this.barWidth / 2]);
                        points.push([gridData[i][0], base + this.barWidth / 2]);
                        points.push([gridData[i][0], base - this.barWidth / 2]);
                        points.push([xstart, base - this.barWidth / 2]);
                        
                        this.renderer.shadowRenderer.draw(ctx, points, opts);
                        
                    }
                }
            }
        }
        
    };
    
}(jQuery));