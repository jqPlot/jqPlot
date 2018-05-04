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
    
    // Polyfill Function.prototype.bind
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof FNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            FNOP.prototype = this.prototype;
            fBound.prototype = new FNOP();
            return fBound;
        };
    }
    
    var RendererExistingTicks,
        RendererTicks;
    
    /**
     * @class $.jqplot.LinearAxisRenderer
     * @classdesc The default jqPlot axis renderer, creating a numeric axis.
     */
    $.jqplot.LinearAxisRenderer = function () {};
    
    /**
     * Called with scope of axis object.
     * @param {Object} options
     */
    $.jqplot.LinearAxisRenderer.prototype.init = function (options) {
        // prop: breakPoints
        // EXPERIMENTAL!! Use at your own risk!
        // Works only with linear axes and the default tick renderer.
        // Array of [start, stop] points to create a broken axis.
        // Broken axes have a "jump" in them, which is an immediate 
        // transition from a smaller value to a larger value.
        // Currently, axis ticks MUST be manually assigned if using breakPoints
        // by using the axis ticks array option.
        this.breakPoints = null;
        // prop: breakTickLabel
        // Label to use at the axis break if breakPoints are specified.
        this.breakTickLabel = "&asymp;";
        // prop: drawBaseline
        // True to draw the axis baseline.
        this.drawBaseline = (typeof this.drawBaseline !== "undefined") ? this.drawBaseline : true;
        // prop: baselineWidth
        // width of the baseline in pixels.
        this.baselineWidth = null;
        // prop: baselineColor
        // CSS color spec for the baseline.
        this.baselineColor = null;
        // prop: forceTickAt0
        // This will ensure that there is always a tick mark at 0.
        // If data range is strictly positive or negative,
        // this will force 0 to be inside the axis bounds unless
        // the appropriate axis pad (pad, padMin or padMax) is set
        // to 0, then this will force an axis min or max value at 0.
        // This has know effect when any of the following options
        // are set:  autoscale, min, max, numberTicks or tickInterval.
        this.forceTickAt0 = false;
        // prop: forceTickAt100
        // This will ensure that there is always a tick mark at 100.
        // If data range is strictly above or below 100,
        // this will force 100 to be inside the axis bounds unless
        // the appropriate axis pad (pad, padMin or padMax) is set
        // to 0, then this will force an axis min or max value at 100.
        // This has know effect when any of the following options
        // are set:  autoscale, min, max, numberTicks or tickInterval.
        this.forceTickAt100 = false;
        // prop: tickInset
        // Controls the amount to inset the first and last ticks from 
        // the edges of the grid, in multiples of the tick interval.
        // 0 is no inset, 0.5 is one half a tick interval, 1 is a full
        // tick interval, etc.
        this.tickInset = 0;
        // prop: minorTicks
        // Number of ticks to add between "major" ticks.
        // Major ticks are ticks supplied by user or auto computed.
        // Minor ticks cannot be created by user.
        this.minorTicks = 0;
        // prop: alignTicks
        // true to align tick marks across opposed axes
        // such as from the y2axis to yaxis.
        this.alignTicks = false;
        this._autoFormatString = '';
        this._overrideFormatString = false;
        this._scalefact = 1.0;
        // prop: labelFullHoursOnly
        // true so only full hours will be displayed.
        // Only works with formatString "%H:%M"
        this.labelFullHoursOnly = false;
        
        $.extend(true, this, options);
        
        if (this.breakPoints) {
            if (!$.isArray(this.breakPoints)) {
                this.breakPoints = null;
            } else if (this.breakPoints.length < 2 || this.breakPoints[1] <= this.breakPoints[0]) {
                this.breakPoints = null;
            }
        }
        
        if (this.numberTicks !== null && this.numberTicks < 2) {
            this.numberTicks = 2;
        }
        
        this.resetDataBounds();
        
    };
    
    /**
     * Called with scope of axis
     * @param   {Object} ctx  
     * @param   {Object} plot 
     * @returns {Object}
     */
    $.jqplot.LinearAxisRenderer.prototype.draw = function (ctx, plot) {
        
        var dim,
            temp,
            t,
            tick,
            elem,
            i;
        
        if (!this.show) {
            return this._elem;
        }
            
        // populate the axis label and value properties.
        // createTicks is a method on the renderer, but
        // call it within the scope of the axis.
        this.renderer.createTicks.call(this, plot);

        // fill a div with axes labels in the right direction.
        // Need to pregenerate each axis to get its bounds and
        // position it and the labels correctly on the plot.
        dim = 0;

        // Added for theming.
        if (this._elem) {
            // Memory Leaks patch
            //this._elem.empty();
            this._elem.emptyForce();
            this._elem = null;
        }

        this._elem = $(document.createElement('div')).addClass('jqplot-axis jqplot-' + this.name).css('position', 'absolute');

        if (this.name === 'xaxis' || this.name === 'x2axis') {
            this._elem.width(this._plotDimensions.width);
        } else {
            this._elem.height(this._plotDimensions.height);
        }

        // create a _label object.
        this.labelOptions.axis = this.name;
        this._label = new this.labelRenderer(this.labelOptions);

        if (this._label.show) {
            elem = this._label.draw(ctx, plot);
            elem.appendTo(this._elem);
            elem = null;
        }

        t = this._ticks;

        for (i = 0; i < t.length; i++) {
            tick = t[i];
            if (tick.show && tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                this._elem.append(tick.draw(ctx, plot));
            }
        }

        tick = null;
        t = null;
        
        return this._elem;
        
    };
    
    /**
     * Called with scope of an axis
     */
    $.jqplot.LinearAxisRenderer.prototype.reset = function () {
        this.min = this._options.min;
        this.max = this._options.max;
        this.tickInterval = this._options.tickInterval;
        this.numberTicks = this._options.numberTicks;
        this._autoFormatString = '';
        if (this._overrideFormatString && this.tickOptions && this.tickOptions.formatString) {
            this.tickOptions.formatString = '';
        }
        // this._ticks = this.__ticks;
    };
    
    /**
     * Called with scope of an axis
     */
    $.jqplot.LinearAxisRenderer.prototype.set = function () {
        
        var dim,
            temp,
            w,
            h,
            lshow,
            t,
            tick,
            i;
        
        dim = 0;
        w = 0;
        h = 0;
        lshow = (this._label === null) ? false : this._label.show;
        
        if (!this.show) {
            return;
        }
            
        t = this._ticks;

        for (i = 0; i < t.length; i++) {
            
            tick = t[i];

            if (!tick._breakTick && tick.show && tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                if (this.name === 'xaxis' || this.name === 'x2axis') {
                    temp = tick._elem.outerHeight(true);
                } else {
                    temp = tick._elem.outerWidth(true);
                }
                if (temp > dim) {
                    dim = temp;
                }
            }
        }

        tick = null;
        t = null;

        if (lshow) {
            w = this._label._elem.outerWidth(true);
            h = this._label._elem.outerHeight(true);
        }

        if (this.name === 'xaxis') {
            dim = dim + h;
            this._elem.css({'height': dim + 'px', left: '0px', bottom: '0px'});
        } else if (this.name === 'x2axis') {
            dim = dim + h;
            this._elem.css({'height': dim + 'px', left: '0px', top: '0px'});
        } else if (this.name === 'yaxis') {
            dim = dim + w;
            this._elem.css({'width': dim + 'px', left: '0px', top: '0px'});
            if (lshow && this._label.constructor === $.jqplot.AxisLabelRenderer) {
                this._label._elem.css('width', w + 'px');
            }
        } else {
            dim = dim + w;
            this._elem.css({'width': dim + 'px', right: '0px', top: '0px'});
            if (lshow && this._label.constructor === $.jqplot.AxisLabelRenderer) {
                this._label._elem.css('width', w + 'px');
            }
        }
    };
    
     /**
     * Renders given ticks
     * Binded to axis (this)
     * @param {Array} userTicks
     */
    RendererExistingTicks = function (userTicks) {
    
        var ut,
            t,
            i,
            l = userTicks.length;
        
        // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
        for (i = 0; i < l; i++) {

            ut = userTicks[i];
            t = new this.tickRenderer(this.tickOptions);

            if ($.isArray(ut)) {
                
                t.value = ut[0];
                
                if (this.breakPoints) {
                    if (ut[0] === this.breakPoints[0]) {
                        t.label = this.breakTickLabel;
                        t._breakTick = true;
                        t.showGridline = false;
                        t.showMark = false;
                    } else if (ut[0] > this.breakPoints[0] && ut[0] <= this.breakPoints[1]) {
                        t.show = false;
                        t.showGridline = false;
                        t.label = ut[1];
                    } else {
                        t.label = ut[1];
                    }
                } else {
                    t.label = ut[1];
                }
                
                t.setTick(ut[0], this.name);
                this._ticks.push(t);
                
            } else if ($.isPlainObject(ut)) {
                
                $.extend(true, t, ut);
                
                t.axis = this.name;
                this._ticks.push(t);
                
            } else {
                
                t.value = ut;
                
                if (this.breakPoints) {
                    if (ut === this.breakPoints[0]) {
                        t.label = this.breakTickLabel;
                        t._breakTick = true;
                        t.showGridline = false;
                        t.showMark = false;
                    } else if (ut > this.breakPoints[0] && ut <= this.breakPoints[1]) {
                        t.show = false;
                        t.showGridline = false;
                    }
                }
                
                t.setTick(ut, this.name);
                this._ticks.push(t);
                
            }
        }

        this.numberTicks = userTicks.length;
        this.min = this._ticks[0].value;
        this.max = this._ticks[this.numberTicks - 1].value;
        this.tickInterval = (this.max - this.min) / (this.numberTicks - 1);
        
    };
    
    /**
     * [[Description]]
     * @param {[[Type]]} dim  [[Description]]
     * @param {Object}   db   [[Description]]
     * @param {Object}   plot [[Description]]
     */
    RendererTicks = function (dim, db, plot) {
    
        var _numberTicks,
            min,
            max,
            adj,
            range,
            rmin,
            rmax,
            temp,
            ret,
            tumin,
            tumax,
            tt,
            t,
            to,
            i,
            j,
            scaler = null,
            drawTicks = null,
            
            /**
             * [[Description]]
             * @param {[[Type]]} min         [[Description]]
             * @param {[[Type]]} max         [[Description]]
             * @param {[[Type]]} range       [[Description]]
             * @param {[[Type]]} numberTicks [[Description]]
             */
            doCompleteAutoscaling = function (min, max, range, numberTicks) {
            
                var keepMin,
                    keepMax,
                    tumin,
                    tumax;
                
                // Check if user must have tick at 0 or 100 and ensure they are in range.
                // The autoscaling algorithm will always place ticks at 0 and 100 if they are in range.
                if (this.forceTickAt0) {
                    if (min > 0) {
                        min = 0;
                    }
                    if (max < 0) {
                        max = 0;
                    }
                }

                if (this.forceTickAt100) {
                    if (min > 100) {
                        min = 100;
                    }
                    if (max < 100) {
                        max = 100;
                    }
                }

                keepMin = false;
                keepMax = false;

                if (this.min !== null) {
                    keepMin = true;
                } else if (this.max !== null) {
                    keepMax = true;
                }

                // var threshold = 30;
                // var tdim = Math.max(dim, threshold+1);
                // this._scalefact =  (tdim-threshold)/300.0;
                ret = $.jqplot.LinearTickGenerator(min, max, this._scalefact, numberTicks, keepMin, keepMax);

                // calculate a padded max and min, points should be less than these
                // so that they aren't too close to the edges of the plot.
                // User can adjust how much padding is allowed with pad, padMin and PadMax options. 
                // If min or max is set, don't pad that end of axis.
                tumin = (this.min !== null) ? min : min + range * (this.padMin - 1);
                tumax = (this.max !== null) ? max : max - range * (this.padMax - 1);

                // if they're equal, we shouldn't have to do anything, right?
                // if (min <=tumin || max >= tumax) {
                if (min < tumin || max > tumax) {
                    tumin = (this.min !== null) ? min : min - range * (this.padMin - 1);
                    tumax = (this.max !== null) ? max : max + range * (this.padMax - 1);
                    ret = $.jqplot.LinearTickGenerator(tumin, tumax, this._scalefact, numberTicks, keepMin, keepMax);
                }

                this.min = ret[0];
                this.max = ret[1];
                // if numberTicks specified, it should return the same.
                this.numberTicks = ret[2];
                this._autoFormatString = ret[3];
                this.tickInterval = ret[4];
                
            },
            
            /**
             * [[Description]]
             * @param {[[Type]]} min   [[Description]]
             * @param {[[Type]]} max   [[Description]]
             * @param {[[Type]]} range [[Description]]
             * @param {[[Type]]} dim   [[Description]]
             */
            doAutoScale = function (min, max, range, dim) {
            
                var rrange,
                    ti,
                    margin,
                    forceMinZero,
                    forceZeroLine,
                    intervals,
                    i,
                    j,
                    seriesLen = this._series.length,
                    s,
                    faname,
                    vals,
                    vmin,
                    vmax,
                    dp,
                    userMin,
                    userMax,
                    ntmin,
                    ntmax,
                    sf,
                    fstr,
                    temp;
                
                forceMinZero = false;
                forceZeroLine = false;
                intervals = {min: null, max: null, average: null, stddev: null};
                
                // if any series are bars, or if any are fill to zero, and if this
                // is the axis to fill toward, check to see if we can start axis at zero.
                for (i = 0; i < seriesLen; i++) {
                    
                    s = this._series[i];
                    faname = (s.fillAxis === 'x') ? s._xaxis.name : s._yaxis.name;
                    
                    // check to see if this is the fill axis
                    if (this.name === faname) {
                        
                        vals = s._plotValues[s.fillAxis];
                        vmin = vals[0];
                        vmax = vals[0];
                        
                        for (j = 1; j < vals.length; j++) {
                            if (vals[j] < vmin) {
                                vmin = vals[j];
                            } else if (vals[j] > vmax) {
                                vmax = vals[j];
                            }
                        }
                        
                        dp = (vmax - vmin) / vmax;
                        
                        // is this sries a bar?
                        if (s.renderer.constructor === $.jqplot.BarRenderer) {
                            // if no negative values and could also check range.
                            if (vmin >= 0 && (s.fillToZero || dp > 0.1)) {
                                forceMinZero = true;
                            } else {
                                forceMinZero = false;
                                if (s.fill && s.fillToZero && vmin < 0 && vmax > 0) {
                                    forceZeroLine = true;
                                } else {
                                    forceZeroLine = false;
                                }
                            }
                            
                        // if not a bar and filling, use appropriate method.
                        } else if (s.fill) {
                            if (vmin >= 0 && (s.fillToZero || dp > 0.1)) {
                                forceMinZero = true;
                            } else if (vmin < 0 && vmax > 0 && s.fillToZero) {
                                forceMinZero = false;
                                forceZeroLine = true;
                            } else {
                                forceMinZero = false;
                                forceZeroLine = false;
                            }
                            
                        // if not a bar and not filling, only change existing state
                        // if it doesn't make sense
                        } else if (vmin < 0) {
                            forceMinZero = false;
                        }
                    }
                }

                // check if we need make axis min at 0.
                if (forceMinZero) {
                    
                    // compute number of ticks
                    this.numberTicks = 2 + Math.ceil((dim - (this.tickSpacing - 1)) / this.tickSpacing);
                    this.min = 0;
                    userMin = 0;
                    
                    // what order is this range?
                    // what tick interval does that give us?
                    ti = max / (this.numberTicks - 1);
                    temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti) / Math.LN10)));
                    
                    if (ti / temp === parseInt(ti / temp, 10)) {
                        ti += temp;
                    }
                    
                    this.tickInterval = Math.ceil(ti / temp) * temp;
                    this.max = this.tickInterval * (this.numberTicks - 1);
                    
                // check if we need to make sure there is a tick at 0.
                } else if (forceZeroLine) {
                    
                    // compute number of ticks
                    this.numberTicks = 2 + Math.ceil((dim - (this.tickSpacing - 1)) / this.tickSpacing);
                    
                    ntmin = Math.ceil(Math.abs(min) / range * (this.numberTicks - 1));
                    ntmax = this.numberTicks - 1  - ntmin;
                    ti = Math.max(Math.abs(min / ntmin), Math.abs(max / ntmax));
                    temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti) / Math.LN10)));
                    
                    this.tickInterval = Math.ceil(ti / temp) * temp;
                    this.max = this.tickInterval * ntmax;
                    this.min = -this.tickInterval * ntmin;
                
                // if nothing else, do autoscaling which will try to line up ticks across axes.
                } else {
                    
                    if (this.numberTicks === null) {
                        if (this.tickInterval) {
                            this.numberTicks = 3 + Math.ceil(range / this.tickInterval);
                        } else {
                            this.numberTicks = 2 + Math.ceil((dim - (this.tickSpacing - 1)) / this.tickSpacing);
                        }
                    }

                    if (this.tickInterval === null) {
                        
                        // get a tick interval
                        ti = range / (this.numberTicks - 1);

                        if (ti < 1) {
                            temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti) / Math.LN10)));
                        } else {
                            temp = 1;
                        }
                        
                        this.tickInterval = Math.ceil(ti * temp * this.pad) / temp;
                        
                    } else {
                        temp = 1 / this.tickInterval;
                    }

                    // try to compute a nicer, more even tick interval
                    // temp = Math.pow(10, Math.floor(Math.log(ti)/Math.LN10));
                    // this.tickInterval = Math.ceil(ti/temp) * temp;
                    rrange = this.tickInterval * (this.numberTicks - 1);
                    margin = (rrange - range) / 2;

                    if (this.min === null) {
                        this.min = Math.floor(temp * (min - margin)) / temp;
                    }
                    if (this.max === null) {
                        this.max = this.min + rrange;
                    }
                }

                // Compute a somewhat decent format string if it is needed.
                // get precision of interval and determine a format string.
                sf = $.jqplot.getSignificantFigures(this.tickInterval);

                // if we have only a whole number, use integer formatting
                if (sf.digitsLeft >= sf.significantDigits) {
                    fstr = '%d';
                } else {
                    temp = Math.max(0, 5 - sf.digitsLeft);
                    temp = Math.min(temp, sf.digitsRight);
                    fstr = '%.' + temp + 'f';
                }

                this._autoFormatString = fstr;
            
            },
            
            /**
             * [[Description]]
             * @param {[[Type]]} min   [[Description]]
             * @param {[[Type]]} max   [[Description]]
             * @param {[[Type]]} range [[Description]]
             * @param {[[Type]]} dim   [[Description]]
             */
            doDefaultScale = function (min, max, range, dim) {
            
                var rmin,
                    rmax,
                    sf,
                    fstr,
                    temp;
                
                rmin = (this.min !== null) ? this.min : min - range * (this.padMin - 1);
                rmax = (this.max !== null) ? this.max : max + range * (this.padMax - 1);
                range = rmax - rmin;

                if (this.numberTicks === null) {
                    
                    // if tickInterval is specified by user, we will ignore computed maximum.
                    // max will be equal or greater to fit even # of ticks.
                    if (this.tickInterval !== null) {
                        this.numberTicks = Math.ceil((rmax - rmin) / this.tickInterval) + 1;
                    } else if (dim > 100) {
                        this.numberTicks = parseInt(3 + (dim - 100) / 75, 10);
                    } else {
                        this.numberTicks = 2;
                    }
                }

                if (this.tickInterval === null) {
                    this.tickInterval = range / (this.numberTicks - 1);
                }

                if (this.max === null) {
                    rmax = rmin + this.tickInterval * (this.numberTicks - 1);
                }
                
                if (this.min === null) {
                    rmin = rmax - this.tickInterval * (this.numberTicks - 1);
                }

                // get precision of interval and determine a format string.
                sf = $.jqplot.getSignificantFigures(this.tickInterval);

                // if we have only a whole number, use integer formatting
                if (sf.digitsLeft >= sf.significantDigits) {
                    fstr = '%d';
                } else {
                    temp = Math.max(0, 5 - sf.digitsLeft);
                    temp = Math.min(temp, sf.digitsRight);
                    fstr = '%.' + temp + 'f';
                }

                this._autoFormatString = fstr;

                this.min = rmin;
                this.max = rmax;
                
            },
            
            /**
             * [[Description]]
             */
            DrawTicks = function () {
            
                var range,
                    temptick,
                    fs,
                    precision,
                    m,
                    fact,
                    n,
                    userMin,
                    userMax,
                    userNT,
                    userTI;
                
                // get a copy of user's settings for min/max.
                userMin = this.min;
                userMax = this.max;
                userNT = this.numberTicks;
                userTI = this.tickInterval;
                
                // fix for misleading tick display with small range and low precision.
                range = this.max - this.min;
                
                // figure out precision
                temptick = new this.tickRenderer(this.tickOptions);
                
                // use the tick formatString or, the default.
                fs = temptick.formatString || $.jqplot.config.defaultTickFormatString;
                fs = fs.match($.jqplot.sprintf.regex)[0];
                
                precision = 0;
                
                if (!fs) {
                    return;
                }
                    
                if (fs.search(/[fFeEgGpP]/) > -1) {
                    m = fs.match(/\%\.(\d{0,})?[eEfFgGpP]/);
                    if (m) {
                        precision = parseInt(m[1], 10);
                    } else {
                        precision = 6;
                    }
                } else if (fs.search(/[di]/) > -1) {
                    precision = 0;
                }

                // fact will be <= 1;
                fact = Math.pow(10, -precision);

                if (this.tickInterval > fact) {
                    return;
                }

                // need to correct underrange
                if (userNT === null && userTI === null) {

                    this.tickInterval = fact;

                    if (userMax === null && userMin === null) {

                        // this.min = Math.floor((this._dataBounds.min - this.tickInterval)/fact) * fact;
                        this.min = Math.floor(this._dataBounds.min / fact) * fact;

                        if (this.min === this._dataBounds.min) {
                            this.min = this._dataBounds.min - this.tickInterval;
                        }

                        // this.max = Math.ceil((this._dataBounds.max + this.tickInterval)/fact) * fact;
                        this.max = Math.ceil(this._dataBounds.max / fact) * fact;

                        if (this.max === this._dataBounds.max) {
                            this.max = this._dataBounds.max + this.tickInterval;
                        }

                        n = (this.max - this.min) / this.tickInterval;

                        n = n.toFixed(11);
                        n = Math.ceil(n);

                        this.numberTicks = n + 1;

                    } else if (userMax === null) {

                        // add one tick for top of range.
                        n = (this._dataBounds.max - this.min) / this.tickInterval;
                        n = n.toFixed(11);
                        this.numberTicks = Math.ceil(n) + 2;
                        this.max = this.min + this.tickInterval * (this.numberTicks - 1);

                    } else if (userMin === null) {

                        // add one tick for bottom of range.
                        n = (this.max - this._dataBounds.min) / this.tickInterval;
                        n = n.toFixed(11);
                        this.numberTicks = Math.ceil(n) + 2;
                        this.min = this.max - this.tickInterval * (this.numberTicks - 1);

                    } else {

                        // calculate a number of ticks so max is within axis scale
                        this.numberTicks = Math.ceil((userMax - userMin) / this.tickInterval) + 1;
                        // if user's min and max don't fit evenly in ticks, adjust.
                        // This takes care of cases such as user min set to 0, max set to 3.5 but tick
                        // format string set to %d (integer ticks)
                        this.min =  Math.floor(userMin * Math.pow(10, precision)) / Math.pow(10, precision);
                        this.max =  Math.ceil(userMax * Math.pow(10, precision)) / Math.pow(10, precision);
                        // this.max = this.min + this.tickInterval*(this.numberTicks-1);
                        this.numberTicks = Math.ceil((this.max - this.min) / this.tickInterval) + 1;

                    }
                }
                
            };
        
        _numberTicks = this.numberTicks;
        
        // if aligning this axis, use number of ticks from previous axis.
        // Do I need to reset somehow if alignTicks is changed and then graph is replotted??
        if (this.alignTicks) {
            if (this.name === 'x2axis' && plot.axes.xaxis.show) {
                _numberTicks = plot.axes.xaxis.numberTicks;
            } else if (this.name.charAt(0) === 'y' && this.name !== 'yaxis' && this.name !== 'yMidAxis' && plot.axes.yaxis.show) {
                _numberTicks = plot.axes.yaxis.numberTicks;
            }
        }

        min = ((this.min !== null) ? this.min : db.min);
        max = ((this.max !== null) ? this.max : db.max);

        // Merging merge#42 - issue#744
        //add padding if we are talking about a single-point series
        if (min === max) {
            adj = 0.05;
            if (min > 0) {
                adj = Math.max(Math.log(min) / Math.LN10, 0.05);
            }
            min -= adj;
            max += adj;
        }

        range = max - min;

        if (this.tickOptions === null || !this.tickOptions.formatString) {
            this._overrideFormatString = true;
        }

        // Doing complete autoscaling
        if ((this.min === null || (this.max === null && this.tickInterval === null)) && !this.autoscale) {

            scaler = doCompleteAutoscaling.bind(this);
            scaler(min, max, range, _numberTicks);

        // User has specified some axis scale related option, can use auto algorithm
        } else {

            // if min and max are same, space them out a bit
            if (min === max) {
                adj = 0.05;
                if (min > 0) {
                    adj = Math.max(Math.log(min) / Math.LN10, 0.05);
                }
                min -= adj;
                max += adj;
            }

            // autoscale.  Can't autoscale if min or max is supplied.
            // Will use numberTicks and tickInterval if supplied.  Ticks
            // across multiple axes may not line up depending on how
            // bars are to be plotted.
            if (this.autoscale && this.min === null && this.max === null) {
                scaler = doAutoScale.bind(this);
                scaler(min, max, range, dim);
            // Use the default algorithm which pads each axis to make the chart
            // centered nicely on the grid.
            } else {
                scaler = doDefaultScale.bind(this);
                scaler(min, max, range, dim);
            }

            if (this.renderer.constructor === $.jqplot.LinearAxisRenderer && this._autoFormatString === '') {
                drawTicks = DrawTicks.bind(this);
                drawTicks();
            }

        }

        if (this._overrideFormatString && this._autoFormatString !== '') {
            this.tickOptions = this.tickOptions || {};
            this.tickOptions.formatString = this._autoFormatString;
        }

        for (i = 0; i < this.numberTicks; i++) {

            tt = this.min + i * this.tickInterval;
            t = new this.tickRenderer(this.tickOptions);
            // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);

            t.setTick(tt, this.name);
            this._ticks.push(t);

            if (i < this.numberTicks - 1) {
                for (j = 0; j < this.minorTicks; j++) {
                    tt += this.tickInterval / (this.minorTicks + 1);
                    to = $.extend(true, {}, this.tickOptions, {
                        name: this.name,
                        value: tt,
                        label: '',
                        isMinorTick: true
                    });
                    t = new this.tickRenderer(to);
                    this._ticks.push(t);
                }
            }
            t = null;
        }
    
    };
    
    /**
     * Creates ticks
     * @param {Object} plot The chart plot
     */
    $.jqplot.LinearAxisRenderer.prototype.createTicks = function (plot) {
        
        var ticks,
            userTicks,
            name,
            db,
            dim,
            interval,
            min,
            max,
            pos1,
            pos2,
            tt,
            i,
            threshold,
            ut,
            t,
            renderTicks = null;
        
        // we're are operating on an axis here
        ticks = this._ticks;
        userTicks = this.ticks;
        name = this.name;
        // databounds were set on axis initialization.
        db = this._dataBounds;
        dim = (this.name.charAt(0) === 'x') ? this._plotDimensions.width : this._plotDimensions.height;

        threshold = 30;
        
        this._scalefact =  (Math.max(dim, threshold + 1) - threshold) / 300.0;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        if (userTicks.length) {
            
            renderTicks = RendererExistingTicks.bind(this);
            renderTicks(userTicks);
        
        // we don't have any ticks yet, let's make some!
        } else {
            
            if (name === 'xaxis' || name === 'x2axis') {
                dim = this._plotDimensions.width;
            } else {
                dim = this._plotDimensions.height;
            }
            
            renderTicks = RendererTicks.bind(this);
            renderTicks(dim, db, plot);
            
        }

        if (this.tickInset) {
            this.min = this.min - this.tickInset * this.tickInterval;
            this.max = this.max + this.tickInset * this.tickInterval;
        }

        ticks = null;
        
    };
    
    // Used to reset just the values of the ticks and then repack, which will
    // recalculate the positioning functions.  It is assuemd that the 
    // number of ticks is the same and the values of the new array are at the
    // proper interval.
    // This method needs to be called with the scope of an axis object, like:
    //
    // > plot.axes.yaxis.renderer.resetTickValues.call(plot.axes.yaxis, yarr);
    //
    $.jqplot.LinearAxisRenderer.prototype.resetTickValues = function (opts) {
        
        var t,
            i;
        
        if ($.isArray(opts) && opts.length === this._ticks.length) {
            for (i = 0; i < opts.length; i++) {
                t = this._ticks[i];
                t.value = opts[i];
                t.label = t.formatter(t.formatString, opts[i]);
                t.label = t.prefix + t.label;
                t._elem.html(t.label);
            }
            t = null;
            this.min = $.jqplot.arrayMin(opts);
            this.max = $.jqplot.arrayMax(opts);
            this.pack();
        }
        // Not implemented yet.
        // else if ($.isPlainObject(opts)) {
        // 
        // }
    };
    
    /**
     * Called with scope of axis
     * @param   {Object}   [pos={}]                
     * @param   {Object}   [offsets=this._offsets] 
     * @returns {Object} [[Description]]
     */
    $.jqplot.LinearAxisRenderer.prototype.pack = function (pos, offsets) {
        
        // Add defaults for repacking from resetTickValues function.
        pos = pos || {};
        offsets = offsets || this._offsets;
        
        var ticks,
            max,
            min,
            offmax,
            offmin,
            lshow,
            p,
            pixellength,
            unitlength,
            i,
            t,
            shim,
            temp,
            val,
            w,
            h;
        
        ticks = this._ticks;
        max = this.max;
        min = this.min;
        offmax = offsets.max;
        offmin = offsets.min;
        lshow = (this._label === null) ? false : this._label.show;
        
        for (p in pos) {
            if (pos.hasOwnProperty(p)) {
                this._elem.css(p, pos[p]);
            }
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
        pixellength = offmax - offmin;
        unitlength = max - min;
        
        // point to unit and unit to point conversions references to Plot DOM element top left corner.
        if (this.breakPoints) {
            
            unitlength = unitlength - this.breakPoints[1] + this.breakPoints[0];
            
            this.p2u = function (p) {
                return (p - offmin) * unitlength / pixellength + min;
            };
        
            this.u2p = function (u) {
                if (u > this.breakPoints[0] && u < this.breakPoints[1]) {
                    u = this.breakPoints[0];
                }
                if (u <= this.breakPoints[0]) {
                    return (u - min) * pixellength / unitlength + offmin;
                } else {
                    return (u - this.breakPoints[1] + this.breakPoints[0] - min) * pixellength / unitlength + offmin;
                }
            };
                
            if (this.name.charAt(0) === 'x') {
                
                this.series_u2p = function (u) {
                    
                    if (u > this.breakPoints[0] && u < this.breakPoints[1]) {
                        u = this.breakPoints[0];
                    }
                    
                    if (u <= this.breakPoints[0]) {
                        return (u - min) * pixellength / unitlength;
                    } else {
                        return (u - this.breakPoints[1] + this.breakPoints[0] - min) * pixellength / unitlength;
                    }
                };
                
                this.series_p2u = function (p) {
                    return p * unitlength / pixellength + min;
                };
                
            } else {
                
                this.series_u2p = function (u) {
                    if (u > this.breakPoints[0] && u < this.breakPoints[1]) {
                        u = this.breakPoints[0];
                    }
                    
                    if (u >= this.breakPoints[1]) {
                        return (u - max) * pixellength / unitlength;
                    } else {
                        return (u + this.breakPoints[1] - this.breakPoints[0] - max) * pixellength / unitlength;
                    }
                };
                
                this.series_p2u = function (p) {
                    return p * unitlength / pixellength + max;
                };
            }
            
        } else {
            
            this.p2u = function (p) {
                return (p - offmin) * unitlength / pixellength + min;
            };
        
            this.u2p = function (u) {
                return (u - min) * pixellength / unitlength + offmin;
            };
                
            if (this.name === 'xaxis' || this.name === 'x2axis') {
                this.series_u2p = function (u) {
                    return (u - min) * pixellength / unitlength;
                };
                this.series_p2u = function (p) {
                    return p * unitlength / pixellength + min;
                };
            } else {
                this.series_u2p = function (u) {
                    return (u - max) * pixellength / unitlength;
                };
                this.series_p2u = function (p) {
                    return p * unitlength / pixellength + max;
                };
            }
        }
        
        if (!this.show) {
            ticks = null;
            return;
        }
            
        if (this.name === 'xaxis' || this.name === 'x2axis') {

            for (i = 0; i < ticks.length; i++) {

                t = ticks[i];

                if (t.show && t.showLabel) {

                    if (t.constructor === $.jqplot.CanvasAxisTickRenderer && t.angle) {

                        // will need to adjust auto positioning based on which axis this is.
                        temp = (this.name === 'xaxis') ? 1 : -1;

                        switch (t.labelPosition) {
                        case 'auto':
                            // position at end
                            if (temp * t.angle < 0) {
                                shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                            // position at start
                            } else {
                                shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                            }
                            break;
                        case 'end':
                            shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                            break;
                        case 'start':
                            shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                            break;
                        case 'middle':
                            shim = -t.getWidth() / 2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                            break;
                        default:
                            shim = -t.getWidth() / 2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                            break;
                        }

                    } else {
                        shim = -t.getWidth() / 2;
                    }

                    val = this.u2p(t.value) + shim + 'px';

                    t._elem.css('left', val);

                    t.pack();

                }
            }

            if (lshow) {

                w = this._label._elem.outerWidth(true);

                this._label._elem.css('left', offmin + pixellength / 2 - w / 2 + 'px');

                if (this.name === 'xaxis') {
                    this._label._elem.css('bottom', '0px');
                } else {
                    this._label._elem.css('top', '0px');
                }

                this._label.pack();

            }

        // Other axices
        } else {

            for (i = 0; i < ticks.length; i++) {

                t = ticks[i];

                if (t.show && t.showLabel) {

                    if (t.constructor === $.jqplot.CanvasAxisTickRenderer && t.angle) {

                        // will need to adjust auto positioning based on which axis this is.
                        temp = (this.name === 'yaxis') ? 1 : -1;

                        switch (t.labelPosition) {
                        case 'auto':
                            // position at end
                        case 'end':
                            if (temp * t.angle < 0) {
                                shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                            } else {
                                shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                            }
                            break;
                        case 'start':
                            if (t.angle > 0) {
                                shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                            } else {
                                shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                            }
                            break;
                        case 'middle':
                            // if (t.angle > 0) {
                            //     shim = -t.getHeight() / 2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                            // }
                            // else {
                            //     shim = -t.getHeight() / 2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                            // }
                            shim = -t.getHeight() / 2;
                            break;
                        default:
                            shim = -t.getHeight() / 2;
                            break;
                        }

                    } else {
                        shim = -t.getHeight() / 2;
                    }

                    val = this.u2p(t.value) + shim + 'px';

                    t._elem.css('top', val);
                    t.pack();
                }
            }

            if (lshow) {

                h = this._label._elem.outerHeight(true);

                this._label._elem.css('top', offmax - pixellength / 2 - h / 2 + 'px');

                if (this.name === 'yaxis') {
                    this._label._elem.css('left', '0px');
                } else {
                    this._label._elem.css('right', '0px');
                }

                this._label.pack();

            }
            
        }

        ticks = null;
        
    };
    
}(jQuery));
