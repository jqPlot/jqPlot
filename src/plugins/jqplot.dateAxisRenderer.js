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
    
    var SECOND = 1000,
        MINUTE = 60 * SECOND,
        HOUR = 60 * MINUTE,
        DAY = 24 * HOUR,
        WEEK = 7 * DAY,

        // these are less definitive
        MONTH = 30.4368499 * DAY,
        YEAR = 365.242199 * DAY,

        DAYSINMONTHS = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30],
        
    // array of consistent nice intervals.  Longer intervals
    // will depend on days in month, days in year, etc.
        NICEFORMATSTRINGS = ['%M:%S.%#N', '%M:%S.%#N', '%M:%S.%#N', '%M:%S', '%M:%S', '%M:%S', '%M:%S', '%H:%M:%S', '%H:%M:%S', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%a %H:%M', '%a %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%v', '%v', '%v', '%v', '%v', '%v', '%v'],
        
        NICEINTERVALS = [0.1 * SECOND, 0.2 * SECOND, 0.5 * SECOND, SECOND, 2 * SECOND, 5 * SECOND, 10 * SECOND, 15 * SECOND, 30 * SECOND, MINUTE, 2 * MINUTE, 5 * MINUTE, 10 * MINUTE, 15 * MINUTE, 30 * MINUTE, HOUR, 2 * HOUR, 4 * HOUR, 6 * HOUR, 8 * HOUR, 12 * HOUR, DAY, 2 * DAY, 3 * DAY, 4 * DAY, 5 * DAY, WEEK, 2 * WEEK],

        niceMonthlyIntervals = [],
        
        RendererExistingTicks,
        RendererOnePointTick,
        RendererDefaultTicks,
        RendererBestTicks;
        
    /**
     * Iterate through NICEINTERVALS to find one closest to titarget
     * @param   {Number} min      
     * @param   {Number} max      
     * @param   {Number} titarget 
     * @returns {Array}
     */
    function bestDateInterval(min, max, titarget) {
        var badness = Number.MAX_VALUE,
            temp,
            bestTi,
            bestfmt,
            i,
            l;
        
        for (i = 0, l = NICEINTERVALS.length; i < l; i++) {
            temp = Math.abs(titarget - NICEINTERVALS[i]);
            if (temp < badness) {
                badness = temp;
                bestTi = NICEINTERVALS[i];
                bestfmt = NICEFORMATSTRINGS[i];
            }
        }

        return [bestTi, bestfmt];
    }
    
    // Tick Renderers
    
    /**
     * Renders given ticks
     * Binded to axis (this)
     * @param {Array} userTicks
     */
    RendererExistingTicks = function (userTicks) {

        //console.count("RendererExistingTicks");

        var i,
            ut,
            tick,
            isMinor = true,
            now = new Date();

        // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
        for (i = 0; i < userTicks.length; i++) {

            ut = userTicks[i];
            tick = new this.tickRenderer(this.tickOptions);

            // Is the tick an array?
            if (ut.constructor === Array) {

                tick.value = new $.jsDate(ut[0]).getTime();
                tick.label = ut[1];

                if (!this.showTicks) {
                    tick.showLabel = false;
                    tick.showMark = false;
                } else if (!this.showTickMarks) {
                    tick.showMark = false;
                }

                if (this.tickOptions.formatString === "%H:%M" && this.tickOptions.labelFullHoursOnly) {
                    
                    // Check if tick.value is a full hour
                    // If not then the tick is minor
                    now.setTime(tick.value);
                    isMinor = (now.getMinutes() === 0) ? false : true;
                    tick.setTick(tick.value, this.name, isMinor);
                
                // Non minor defined tick
                } else {
                    tick.setTick(tick.value, this.name);
                }
                
                this._ticks.push(tick);

            // The tick is not an array
            } else {

                tick.value = new $.jsDate(ut).getTime();

                if (!this.showTicks) {
                    tick.showLabel = false;
                    tick.showMark = false;
                } else if (!this.showTickMarks) {
                    tick.showMark = false;
                }
                
                if (this.tickOptions.formatString === "%H:%M" && this.tickOptions.labelFullHoursOnly) {
                    // Check if tick.value is a full hour
                    // If not then the tick is minor
                    now.setTime(tick.value);
                    isMinor = (now.getMinutes() === 0) ? false : true;
                }

                tick.setTick(tick.value, this.name, isMinor);

                this._ticks.push(tick);
            }
        }

        this.numberTicks = userTicks.length;
        this.min = this._ticks[0].value;
        this.max = this._ticks[this.numberTicks - 1].value;
        this.daTickInterval = [(this.max - this.min) / (this.numberTicks - 1) / 1000, 'seconds'];

    };

    /**
     * Special case when there is only one point, make three tick marks to center the point.
     * Binded to axis (this)
     * @param {Object} db
     */
    RendererOnePointTick = function (db) {

        //console.count("RendererOnePointTick");

        var onePointOpts,
            delta,
            i,
            t;

        onePointOpts = $.extend(true, {}, this.tickOptions, {name: this.name, value: null});
        delta = 300000;

        this.min = db.min - delta;
        this.max = db.max + delta;
        this.numberTicks = 3;

        for (i = this.min; i <= this.max; i += delta) {

            onePointOpts.value = i;

            t = new this.tickRenderer(onePointOpts);

            if (this._overrideFormatString && this._autoFormatString !== '') {
                t.formatString = this._autoFormatString;
            }

            t.showLabel = false;
            t.showMark = false;

            this._ticks.push(t);
        }

        if (this.showTicks) {
            this._ticks[1].showLabel = true;
        }

        if (this.showTickMarks) {
            this._ticks[1].showTickMarks = true;
        }

    };

    /**
     * Renders all other ticks
     * @param   {[[Type]]} daTickInterval [[Description]]
     * @param   {[[Type]]} min            [[Description]]
     * @param   {[[Type]]} max            [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    RendererDefaultTicks = function (daTickInterval, min, max) {

        //console.count("RendererDefaultTicks");

        var name = this.name,
            dim,
            range,
            optNumTicks,
            rmin,
            rmax,
            nc,
            insetMult,
            i,
            tick,
            tt,
            adj;

        if (name === 'xaxis' || name === 'x2axis') {
            dim = this._plotDimensions.width;
        } else {
            dim = this._plotDimensions.height;
        }

        // if min, max and number of ticks specified, user can't specify interval.
        if (this.min !== null && this.max !== null && this.numberTicks !== null) {
            this.tickInterval = null;
        }

        if (this.tickInterval !== null && daTickInterval !== null) {
            this.daTickInterval = daTickInterval;
        }

        // if min and max are same, space them out a bit
        if (min === max) {
            adj = 24 * 60 * 60 * 500;  // 1/2 day
            min -= adj;
            max += adj;
        }

        range = max - min;

        optNumTicks = 2 + parseInt(Math.max(0, dim - 100) / 100, 10);

        rmin = (this.min !== null) ? new $.jsDate(this.min).getTime() : min - range / 2 * (this.padMin - 1);
        rmax = (this.max !== null) ? new $.jsDate(this.max).getTime() : max + range / 2 * (this.padMax - 1);

        this.min = rmin;
        this.max = rmax;

        range = this.max - this.min;

        if (this.numberTicks === null) {
            // if tickInterval is specified by user, we will ignore computed maximum.
            // max will be equal or greater to fit even # of ticks.
            if (this.daTickInterval !== null) {
                nc = new $.jsDate(this.max).diff(this.min, this.daTickInterval[1], true);
                this.numberTicks = Math.ceil(nc / this.daTickInterval[0]) + 1;
                // this.max = new $.jsDate(this.min).add(this.numberTicks-1, this.daTickInterval[1]).getTime();
                this.max = new $.jsDate(this.min).add((this.numberTicks - 1) * this.daTickInterval[0], this.daTickInterval[1]).getTime();
            } else if (dim > 200) {
                this.numberTicks = parseInt(3 + (dim - 200) / 100, 10);
            } else {
                this.numberTicks = 2;
            }
        }

        insetMult = range / (this.numberTicks - 1) / 1000;

        if (this.daTickInterval === null) {
            this.daTickInterval = [insetMult, 'seconds'];
        }

        for (i = 0; i < this.numberTicks; i++) {

            min = new $.jsDate(this.min);

            tt = min.add(i * this.daTickInterval[0], this.daTickInterval[1]).getTime();

            tick = new this.tickRenderer(this.tickOptions);

            // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
            if (!this.showTicks) {
                tick.showLabel = false;
                tick.showMark = false;
            } else if (!this.showTickMarks) {
                tick.showMark = false;
            }

            tick.setTick(tt, this.name);
            this._ticks.push(tick);
        }

        return insetMult;

    };

    /**
     * [[Description]]
     * @param   {[[Type]]} threshold      [[Description]]
     * @param   {[[Type]]} min            [[Description]]
     * @param   {[[Type]]} max            [[Description]]
     * @param   {[[Type]]} daTickInterval [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    RendererBestTicks = function (threshold, min, max, daTickInterval) {

        //console.count("RendererBestTicks");

        var opts = $.extend(true, {}, this.tickOptions, {name: this.name, value: null}),
            insetMult,
            nttarget,
            titarget,
            tdim,
            spacingFactor,
            ret,
            tempti,
            i,
            tick,
            intv,
            mstart,
            tempmend,
            mend,
            nmonths,
            nyears,
            dim = (this.name.charAt(0) === 'x') ? this._plotDimensions.width : this._plotDimensions.height;

        // if no tickInterval or numberTicks options specified,  make a good guess.
        if (!this.tickInterval && !this.numberTicks) {

            tdim = Math.max(dim, threshold + 1);

            // how many ticks to put on the axis?
            // date labels tend to be long.  If ticks not rotated,
            // don't use too many and have a high spacing factor.
            // If we are rotating ticks, use a lower factor.
            spacingFactor = 115;

            if (this.tickRenderer === $.jqplot.CanvasAxisTickRenderer && this.tickOptions.angle) {
                spacingFactor = 115 - 40 * Math.abs(Math.sin(this.tickOptions.angle / 180 * Math.PI));
            }

            nttarget =  Math.ceil((tdim - threshold) / spacingFactor + 1);
            titarget = (max - min) / (nttarget - 1);

        // If tickInterval is specified, we'll try to honor it.
        // Not guaranteed to get this interval, but we'll get as close as we can.
        // tickInterval will be used before numberTicks, that is if
        // both are specified, numberTicks will be ignored.
        } else if (this.tickInterval) {

            titarget = new $.jsDate(0).add(daTickInterval[0], daTickInterval[1]).getTime();

        // if numberTicks specified, try to honor it.
        // Not guaranteed, but will try to get close.
        } else if (this.numberTicks) {
            nttarget = this.numberTicks;
            titarget = (max - min) / (nttarget - 1);
        }

        // If we can use an interval of 2 weeks or less, pick best one
        if (titarget <= 19 * DAY) {

            ret = bestDateInterval(min, max, titarget);
            tempti = ret[0];
            this._autoFormatString = ret[1];

            min = new $.jsDate(min);
            min = Math.floor((min.getTime() - min.getUtcOffset()) / tempti) * tempti + min.getUtcOffset();

            nttarget = Math.ceil((max - min) / tempti) + 1;
            this.min = min;
            this.max = min + (nttarget - 1) * tempti;

            // if max is less than max, add an interval
            if (this.max < max) {
                this.max += tempti;
                nttarget += 1;
            }

            this.tickInterval = tempti;
            this.numberTicks = nttarget;

            for (i = 0; i < nttarget; i++) {

                opts.value = this.min + i * tempti;

                tick = new this.tickRenderer(opts);

                if (this._overrideFormatString && this._autoFormatString !== '') {
                    tick.formatString = this._autoFormatString;
                }

                if (!this.showTicks) {
                    tick.showLabel = false;
                    tick.showMark = false;
                } else if (!this.showTickMarks) {
                    tick.showMark = false;
                }

                this._ticks.push(tick);
            }

            insetMult = this.tickInterval;

        // should we use a monthly interval?
        } else if (titarget <= 9 * MONTH) {

            this._autoFormatString = '%v';

            // how many months in an interval?
            intv = Math.round(titarget / MONTH);

            if (intv < 1) {
                intv = 1;
            } else if (intv > 6) {
                intv = 6;
            }

            // figure out the starting month and ending month.
            mstart = new $.jsDate(min).setDate(1).setHours(0, 0, 0, 0);

            // See if max ends exactly on a month
            tempmend = new $.jsDate(max);
            mend = new $.jsDate(max).setDate(1).setHours(0, 0, 0, 0);

            if (tempmend.getTime() !== mend.getTime()) {
                mend = mend.add(1, 'month');
            }

            nmonths = mend.diff(mstart, 'month');

            nttarget = Math.ceil(nmonths / intv) + 1;

            this.min = mstart.getTime();
            this.max = mstart.clone().add((nttarget - 1) * intv, 'month').getTime();
            this.numberTicks = nttarget;

            for (i = 0; i < nttarget; i++) {

                if (i === 0) {
                    opts.value = mstart.getTime();
                } else {
                    opts.value = mstart.add(intv, 'month').getTime();
                }

                tick = new this.tickRenderer(opts);

                if (this._overrideFormatString && this._autoFormatString !== '') {
                    tick.formatString = this._autoFormatString;
                }

                if (!this.showTicks) {
                    tick.showLabel = false;
                    tick.showMark = false;
                } else if (!this.showTickMarks) {
                    tick.showMark = false;
                }

                this._ticks.push(tick);

            }

            insetMult = intv * MONTH;

        // use yearly intervals
        } else {

            this._autoFormatString = '%v';

            // how many years in an interval?
            intv = Math.round(titarget / YEAR);

            if (intv < 1) {
                intv = 1;
            }

            // figure out the starting and ending years.
            mstart = new $.jsDate(min).setMonth(0, 1).setHours(0, 0, 0, 0);
            mend = new $.jsDate(max).add(1, 'year').setMonth(0, 1).setHours(0, 0, 0, 0);

            nyears = mend.diff(mstart, 'year');

            nttarget = Math.ceil(nyears / intv) + 1;

            this.min = mstart.getTime();
            this.max = mstart.clone().add((nttarget - 1) * intv, 'year').getTime();
            this.numberTicks = nttarget;

            for (i = 0; i < nttarget; i++) {

                if (i === 0) {
                    opts.value = mstart.getTime();
                } else {
                    opts.value = mstart.add(intv, 'year').getTime();
                }

                tick = new this.tickRenderer(opts);

                if (this._overrideFormatString && this._autoFormatString !== '') {
                    tick.formatString = this._autoFormatString;
                }

                if (!this.showTicks) {
                    tick.showLabel = false;
                    tick.showMark = false;
                } else if (!this.showTickMarks) {
                    tick.showMark = false;
                }

                this._ticks.push(tick);

            }

            insetMult = intv * YEAR;

        }

        return insetMult;

    };
    
    
    
    /**
     * Class: $.jqplot.DateAxisRenderer
     * A plugin for a jqPlot to render an axis as a series of date values.
     * This renderer has no options beyond those supplied by the <Axis> class.
     * It supplies its own tick formatter, so the tickOptions.formatter option
     * should not be overridden.
     * 
     * Thanks to Ken Synder for his enhanced Date instance methods which are
     * included with this code <http://kendsnyder.com/sandbox/date/>.
     * 
     * To use this renderer, include the plugin in your source
     * > <script type="text/javascript" language="javascript" src="plugins/jqplot.dateAxisRenderer.js"></script>
     * 
     * and supply the appropriate options to your plot
     * 
     * > {axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}}
     * 
     * Dates can be passed into the axis in almost any recognizable value and 
     * will be parsed.  They will be rendered on the axis in the format
     * specified by tickOptions.formatString.  e.g. tickOptions.formatString = '%Y-%m-%d'.
     * 
     * Accecptable format codes 
     * are:
     * 
     * > Code    Result                  Description
     * >             == Years ==
     * > %Y      2008                Four-digit year
     * > %y      08                  Two-digit year
     * >             == Months ==
     * > %m      09                  Two-digit month
     * > %#m     9                   One or two-digit month
     * > %B      September           Full month name
     * > %b      Sep                 Abbreviated month name
     * >             == Days ==
     * > %d      05                  Two-digit day of month
     * > %#d     5                   One or two-digit day of month
     * > %e      5                   One or two-digit day of month
     * > %A      Sunday              Full name of the day of the week
     * > %a      Sun                 Abbreviated name of the day of the week
     * > %w      0                   Number of the day of the week (0 = Sunday, 6 = Saturday)
     * > %o      th                  The ordinal suffix string following the day of the month
     * >             == Hours ==
     * > %H      23                  Hours in 24-hour format (two digits)
     * > %#H     3                   Hours in 24-hour integer format (one or two digits)
     * > %I      11                  Hours in 12-hour format (two digits)
     * > %#I     3                   Hours in 12-hour integer format (one or two digits)
     * > %p      PM                  AM or PM
     * >             == Minutes ==
     * > %M      09                  Minutes (two digits)
     * > %#M     9                   Minutes (one or two digits)
     * >             == Seconds ==
     * > %S      02                  Seconds (two digits)
     * > %#S     2                   Seconds (one or two digits)
     * > %s      1206567625723       Unix timestamp (Seconds past 1970-01-01 00:00:00)
     * >             == Milliseconds ==
     * > %N      008                 Milliseconds (three digits)
     * > %#N     8                   Milliseconds (one to three digits)
     * >             == Timezone ==
     * > %O      360                 difference in minutes between local time and GMT
     * > %Z      Mountain Standard Time  Name of timezone as reported by browser
     * > %G      -06:00              Hours and minutes between GMT
     * >             == Shortcuts ==
     * > %F      2008-03-26          %Y-%m-%d
     * > %T      05:06:30            %H:%M:%S
     * > %X      05:06:30            %H:%M:%S
     * > %x      03/26/08            %m/%d/%y
     * > %D      03/26/08            %m/%d/%y
     * > %#c     Wed Mar 26 15:31:00 2008  %a %b %e %H:%M:%S %Y
     * > %v      3-Sep-2008          %e-%b-%Y
     * > %R      15:31               %H:%M
     * > %r      3:31:00 PM          %I:%M:%S %p
     * >             == Characters ==
     * > %n      \n                  Newline
     * > %t      \t                  Tab
     * > %%      %                   Percent Symbol 
     */
    $.jqplot.DateAxisRenderer = function () {
        $.jqplot.LinearAxisRenderer.call(this);
        this.date = new $.jsDate();
    };
    
    $.jqplot.DateAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.DateAxisRenderer.prototype.constructor = $.jqplot.DateAxisRenderer;
    
    /**
     * Set the typeFormatter
     * @param {Object} typeFormatter
     */
    $.jqplot.DateTickFormatter = function (typeFormatter) {
        this.typeFormatter = typeFormatter;
    };

    /**
     * Formats the date for the tick according to given format using jsDate
     * @param   {String}   format
     * @param   {String}   val
     * @returns {Object} jsDate object
     */
    $.jqplot.DateTickFormatter.prototype.format = function (format, val) {
        if (!format) {
            format = '%Y/%m/%d';
        }
        return $.jsDate.strftime(val, format, this.typeFormatter);
    };
    
    /**
     * Initializes the DateAxisRenderer
     * @param   {Object}   options
     * @returns void
     */
    $.jqplot.DateAxisRenderer.prototype.init = function (options) {
        
        var db = this._dataBounds,
            stats,
            sum,
            s,
            d,
            pd,
            sd,
            intv,
            i,
            j,
            l,
            bd,
            tempf,
            tempn,
            key,
            /**
             * [[Description]]
             * @param   {Object}   a [[Description]]
             * @param   {Object}   b [[Description]]
             * @returns {[[Type]]} [[Description]]
             */
            frequencySort = function (a, b) {
                return b.frequency - a.frequency;
            };
        
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        // this.tickRenderer = $.jqplot.AxisTickRenderer;
        // this.labelRenderer = $.jqplot.AxisLabelRenderer;
        this.tickOptions.typeFormatter = this.tickOptions.typeFormatter || 'perl';
        this.tickOptions.formatter = new $.jqplot.DateTickFormatter(this.tickOptions.typeFormatter).format;
        // prop: labelFullHoursOnly
        // true so only full hours will be displayed.
        // Only works with formatString "%H:%M"
        this.tickOptions.labelFullHoursOnly = (typeof this.tickOptions.labelFullHoursOnly !== "undefined") ? this.tickOptions.labelFullHoursOnly : false;
        // prop: tickInset
        // Controls the amount to inset the first and last ticks from 
        // the edges of the grid, in multiples of the tick interval.
        // 0 is no inset, 0.5 is one half a tick interval, 1 is a full
        // tick interval, etc.
        this.tickInset = 0;
        // prop: drawBaseline
        // True to draw the axis baseline.
        this.drawBaseline = (typeof this.drawBaseline !== "undefined") ? this.drawBaseline : true;
        // prop: baselineWidth
        // width of the baseline in pixels.
        this.baselineWidth = null;
        // prop: baselineColor
        // CSS color spec for the baseline.
        this.baselineColor = null;
        this.daTickInterval = null;
        this._daTickInterval = null;
        
        $.extend(true, this, options);
        
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (i = 0; i < this._series.length; i++) {
            
            stats = {intervals: [], frequencies: {}, sortedIntervals: [], min: null, max: null, mean: null};
            sum = 0;
            s = this._series[i];
            d = s.data;
            pd = s._plotData;
            sd = s._stackData;
            intv = 0;
            
            // Set stats and frequencies
            for (j = 0; j < d.length; j++) {
                
                if (this.name === 'xaxis' || this.name === 'x2axis') {
                    
                    d[j][0] = new $.jsDate(d[j][0]).getTime();
                    pd[j][0] = new $.jsDate(d[j][0]).getTime();
                    sd[j][0] = new $.jsDate(d[j][0]).getTime();
                    
                    if ((d[j][0] !== null && d[j][0] < db.min) || db.min === null) {
                        db.min = d[j][0];
                    }
                    
                    if ((d[j][0] !== null && d[j][0] > db.max) || db.max === null) {
                        db.max = d[j][0];
                    }
                    
                    if (j > 0) {
                        intv = Math.abs(d[j][0] - d[j - 1][0]);
                        stats.intervals.push(intv);
                        if (stats.frequencies.hasOwnProperty(intv)) {
                            stats.frequencies[intv] += 1;
                        } else {
                            stats.frequencies[intv] = 1;
                        }
                    }
                    
                    sum += intv;
                    
                } else {
                    
                    d[j][1] = new $.jsDate(d[j][1]).getTime();
                    pd[j][1] = new $.jsDate(d[j][1]).getTime();
                    sd[j][1] = new $.jsDate(d[j][1]).getTime();
                    
                    if ((d[j][1] !== null && d[j][1] < db.min) || db.min === null) {
                        db.min = d[j][1];
                    }
                    
                    if ((d[j][1] !== null && d[j][1] > db.max) || db.max === null) {
                        db.max = d[j][1];
                    }
                    
                    if (j > 0) {
                        intv = Math.abs(d[j][1] - d[j - 1][1]);
                        stats.intervals.push(intv);
                        if (stats.frequencies.hasOwnProperty(intv)) {
                            stats.frequencies[intv] += 1;
                        } else {
                            stats.frequencies[intv] = 1;
                        }
                    }
                }
                
                sum += intv;
                
            }

            if (s.renderer.bands) {
                
                if (s.renderer.bands.hiData.length) {
                    bd = s.renderer.bands.hiData;
                    for (j = 0, l = bd.length; j < l; j++) {
                        if (this.name === 'xaxis' || this.name === 'x2axis') {
                            bd[j][0] = new $.jsDate(bd[j][0]).getTime();
                            if ((bd[j][0] !== null && bd[j][0] > db.max) || db.max === null) {
                                db.max = bd[j][0];
                            }
                        } else {
                            bd[j][1] = new $.jsDate(bd[j][1]).getTime();
                            if ((bd[j][1] !== null && bd[j][1] > db.max) || db.max === null) {
                                db.max = bd[j][1];
                            }
                        }
                    }
                }
                
                if (s.renderer.bands.lowData.length) {
                    bd = s.renderer.bands.lowData;
                    for (j = 0, l = bd.length; j < l; j++) {
                        if (this.name === 'xaxis' || this.name === 'x2axis') {
                            bd[j][0] = new $.jsDate(bd[j][0]).getTime();
                            if ((bd[j][0] !== null && bd[j][0] < db.min) || db.min === null) {
                                db.min = bd[j][0];
                            }
                        } else {
                            bd[j][1] = new $.jsDate(bd[j][1]).getTime();
                            if ((bd[j][1] !== null && bd[j][1] < db.min) || db.min === null) {
                                db.min = bd[j][1];
                            }
                        }
                    }
                }
            }
            
            tempf = 0;
            tempn = 0;
            
            for (key in stats.frequencies) {
                if (stats.frequencies.hasOwnProperty(key)) {
                    stats.sortedIntervals.push({interval: key, frequency: stats.frequencies[key]});
                }
            }
            
            stats.sortedIntervals.sort(frequencySort);
            
            stats.min = $.jqplot.arrayMin(stats.intervals);
            stats.max = $.jqplot.arrayMax(stats.intervals);
            stats.mean = sum / d.length;
            
            this._intervalStats.push(stats);
            
            stats = sum = s = d = pd = sd = null;
            
        }
        
        db = null;
        
    };
    
    /**
     * called with scope of an axis
     */
    $.jqplot.DateAxisRenderer.prototype.reset = function () {
        this.min = this._options.min;
        this.max = this._options.max;
        this.tickInterval = this._options.tickInterval;
        this.numberTicks = this._options.numberTicks;
        this._autoFormatString = '';
        if (this._overrideFormatString && this.tickOptions && this.tickOptions.formatString) {
            this.tickOptions.formatString = '';
        }
        this.daTickInterval = this._daTickInterval;
        // this._ticks = this.__ticks;
    };
    
    /**
     * Creates ticks
     * @param {Object} plot The chart plot
     */
    $.jqplot.DateAxisRenderer.prototype.createTicks = function (plot) {
        
        var ticks,
            userTicks,
            name,
            db,
            iv,
            dim,
            interval,
            min,
            max,
            pos1,
            pos2,
            tt,
            i,
            threshold,
            insetMult,
            daTickInterval,
            parts,
            tickInterval,
            cursor,
            range,
            renderTicks = null;
        
        // we're are operating on an axis here
        ticks = this._ticks;
        userTicks = this.ticks;
        name = this.name;
        // databounds were set on axis initialization.
        db = this._dataBounds;
        iv = this._intervalStats;
        dim = (this.name.charAt(0) === 'x') ? this._plotDimensions.width : this._plotDimensions.height;

        threshold = 30;
        insetMult = 1;
        daTickInterval = null;
        
        // if user specified a tick interval, convert to usable.
        if (this.tickInterval !== null) {
            // if interval is a number or can be converted to one, use it.
            // Assume it is in SECONDS!!!
            if (Number(this.tickInterval)) {
                daTickInterval = [Number(this.tickInterval), 'seconds'];
            // else, parse out something we can build from.
            } else if (typeof this.tickInterval === "string") {
                parts = this.tickInterval.split(' ');
                if (parts.length === 1) {
                    daTickInterval = [1, parts[0]];
                } else if (parts.length === 2) {
                    daTickInterval = [parts[0], parts[1]];
                }
            }
        }

        tickInterval = this.tickInterval;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        min = new $.jsDate((this.min !== null) ? this.min : db.min).getTime();
        max = new $.jsDate((this.max !== null) ? this.max : db.max).getTime();

        // see if we're zooming.  if we are, don't use the min and max we're given,
        // but compute some nice ones.  They will be reset later.

        cursor = plot.plugins.cursor;

        if (cursor && cursor._zoom && cursor._zoom.zooming) {
            this.min = null;
            this.max = null;
        }

        range = max - min;

        if (this.tickOptions === null || !this.tickOptions.formatString) {
            this._overrideFormatString = true;
        }
        
        // RENDERING TICKS
        
        if (userTicks.length) {
            renderTicks = RendererExistingTicks.bind(this);
            renderTicks(userTicks);
        // We don't have any ticks yet, let's make some!
        // Special case when there is only one point, make three tick marks to center the point
        } else if (this.min === null && this.max === null && db.min === db.max) {
            renderTicks = RendererOnePointTick.bind(this);
            renderTicks(db);
        // If user specified min and max are null, we set those to make best ticks.
        // We want to find a nice interval 
        } else if (this.min === null && this.max === null) {
            renderTicks = RendererBestTicks.bind(this);
            insetMult = renderTicks(threshold, min, max, daTickInterval);
        // Some option(s) specified, work around that.
        } else {
            renderTicks = RendererDefaultTicks.bind(this);
            insetMult = renderTicks(daTickInterval, min, max);
        }

        if (this.tickInset) {
            this.min = this.min - this.tickInset * insetMult;
            this.max = this.max + this.tickInset * insetMult;
        }

        if (this._daTickInterval === null) {
            this._daTickInterval = this.daTickInterval;
        }

        ticks = null;
        
    };
   
}(jQuery));