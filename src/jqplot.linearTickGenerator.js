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
    /**
    * The following code was generaously given to me a while back by Scott Prahl.
    * He did a good job at computing axes min, max and number of ticks for the 
    * case where the user has not set any scale related parameters (tickInterval,
    * numberTicks, min or max).  I had ignored this use case for a long time,
    * focusing on the more difficult case where user has set some option controlling
    * tick generation.  Anyway, about time I got this into jqPlot.
    * Thanks Scott!!
    */
    
    /**
    * Copyright (c) 2010 Scott Prahl
    * The next three routines are currently available for use in all personal 
    * or commercial projects under both the MIT and GPL version 2.0 licenses. 
    * This means that you can choose the license that best suits your project 
    * and use it accordingly. 
    */

    // A good format string depends on the interval. If the interval is greater 
    // than 1 then there is no need to show any decimal digits. If it is < 1.0, then
    // use the magnitude of the interval to determine the number of digits to show.
    function bestFormatString (interval)
    {
        var fstr;
        interval = Math.abs(interval);
        if (interval > 1) {
            fstr = '%d';
        }

        else {
            var expv = -Math.floor(Math.log(interval)/Math.LN10);
            fstr = '%.' + expv + 'f';
        }
        
        return fstr; 
    }

    var _factors = [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1, 2, 3, 4, 5];

    var _getLowerFactor = function(f) {
        var i = _factors.indexOf(f);
        if (i > 0) {
            return _factors[i-1];
        }
        else {
            return _factors[_factors.length - 1] / 100;
        }
    };

    var _getHigherFactor = function(f) {
        var i = _factors.indexOf(f);
        if (i < _factors.length-1) {
            return _factors[i+1];
        }
        else {
            return _factors[0] * 100;
        }
    };

    // This will return an interval of form 2 * 10^n, 5 * 10^n or 10 * 10^n
    function bestLinearInterval(range, scalefact) {
        var expv = Math.floor(Math.log(range)/Math.LN10);
        var magnitude = Math.pow(10, expv);
        // 0 < f < 10
        var f = range / magnitude;
        var fact;
        // for large plots, scalefact will decrease f and increase number of ticks.
        // for small plots, scalefact will increase f and decrease number of ticks.
        f = f/scalefact;

        // for large plots, smaller interval, more ticks.
        if (f<=0.38) {
            fact = 0.1;
        }
        else if (f<=1.6) {
            fact = 0.2;
        }
        else if (f<=4.0) {
            fact = 0.5;
        }
        else if (f<=8.0) {
            fact = 1.0;
        }
        // for very small plots, larger interval, less ticks in number ticks
        else if (f<=16.0) {
            fact = 2;
        }
        // else if (f<=20.0) {
        //     fact = 3;
        // }
        else {
            fact = 5;
        } 

        return fact*magnitude; 
    }

    // This will return an interval of form 2 * 10^n, 5 * 10^n or 10 * 10^n
    function bestLinearComponents(range, scalefact) {
        var expv = Math.floor(Math.log(range)/Math.LN10);
        var magnitude = Math.pow(10, expv);
        // 0 < f < 10
        var f = range / magnitude;
        var interval;
        var fact;
        // for large plots, scalefact will decrease f and increase number of ticks.
        // for small plots, scalefact will increase f and decrease number of ticks.
        f = f/scalefact;

        // for large plots, smaller interval, more ticks.
        if (f<=0.38) {
            fact = 0.1;
        }
        else if (f<=1.6) {
            fact = 0.2;
        }
        else if (f<=4.0) {
            fact = 0.5;
        }
        else if (f<=8.0) {
            fact = 1.0;
        }
        // for very small plots, larger interval, less ticks in number ticks
        else if (f<=16.0) {
            fact = 2;
        }
        // else if (f<=20.0) {
        //     fact = 3;
        // }
        // else if (f<=24.0) {
        //     fact = 4;
        // }
        else {
            fact = 5;
        } 

        interval = fact * magnitude;

        return [interval, fact, magnitude];
    }

    // Given the min and max for a dataset, return suitable endpoints
    // for the graphing, a good number for the number of ticks, and a
    // format string so that extraneous digits are not displayed.
    // returned is an array containing [min, max, nTicks, format]
    $.jqplot.LinearTickGenerator = function(axis_min, axis_max, scalefact, numberTicks) {
        // if endpoints are equal try to include zero otherwise include one
        if (axis_min === axis_max) {
            axis_max = (axis_max) ? 0 : 1;
        }

        scalefact = scalefact || 1.0;

        // make sure range is positive
        if (axis_max < axis_min) {
            var a = axis_max;
            axis_max = axis_min;
            axis_min = a;
        }

        var r = [];
        
        if (numberTicks === undefined) {
            var ss = bestLinearInterval(axis_max - axis_min, scalefact);

            // Figure out the axis min, max and number of ticks
            // the min and max will be some multiple of the tick interval,
            // 1*10^n, 2*10^n or 5*10^n.  This gaurantees that, if the
            // axis min is negative, 0 will be a tick.
            r[0] = Math.floor(axis_min / ss) * ss;  // min
            r[1] = Math.ceil(axis_max / ss) * ss;   // max
            r[2] = Math.round((r[1]-r[0])/ss+1.0);  // number of ticks
            r[3] = bestFormatString(ss);            // format string
            r[4] = ss;                              // tick Interval
        }

        else {
            console.log('number ticks: ', numberTicks);
            var ss = bestLinearInterval(axis_max - axis_min, scalefact);
            var tempr = [];

            // Figure out the axis min, max and number of ticks
            // the min and max will be some multiple of the tick interval,
            // 1*10^n, 2*10^n or 5*10^n.  This gaurantees that, if the
            // axis min is negative, 0 will be a tick.
            tempr[0] = Math.floor(axis_min / ss) * ss;  // min
            tempr[1] = Math.ceil(axis_max / ss) * ss;   // max
            tempr[2] = Math.round((tempr[1]-tempr[0])/ss+1.0);    // number of ticks
            tempr[3] = bestFormatString(ss);            // format string
            tempr[4] = ss;                              // tick Interval

            console.log('tempr: ', tempr);

            if (tempr[2] === numberTicks) {
                r = tempr;
            }

            // Not enough ticks, add some
            else if (tempr[2] < numberTicks) {
                console.log('too few');
                // returns interval, factor, magnitude
                var c = bestLinearComponents(axis_max - axis_min, scalefact);
                // the offset we would get by simply adding more ticks;
                var error = numberTicks - tempr[2] * ss;

                var ntmult = Math.ceil(numberTicks / tempr[2]);

                var range = tempr[1] - tempr[0];

                var curf = c[1];
                var curti = c[0];
                var curnt = tempr[2];

                var count = 0;

                function getMoreTicks(f, mag, r) {
                    // try to adjust factor and see what we get
                    var newf = _getLowerFactor(f);
                    var newti = newf * mag;
                    var newnt = r / newti + 1;
                    // new factor, tickInterval, numberTicks
                    return [newf, newti, newnt];
                }

                function findMoreTicks(f, mag, r) {
                    var getMore = getMoreTicks(f, mag, r);
                    console.log('getting some more: ', getMore);

                    if (count < 2*(ntmult+1)) {
                        if (getMore[2] < numberTicks) {
                            curf = getMore[0];
                            curti = getMore[1];
                            curnt = getMore[2];
                            count++;
                            getMore = findMoreTicks(getMore[0], mag, r);
                        }

                        else if (getMore[2] > numberTicks) {
                            getMore = [curf, curti, curnt];
                        }
                    }

                    return getMore;
                }

                // Try getting more ticks at nice interval.
                // return:
                //          0: factor
                //          1: tick interval
                //          2: number ticks
                var gotMore = findMoreTicks(c[1], c[2], range);
                console.log('got more: ', gotMore);

                // Have 3 conditions now.
                //
                // gotMore has too many ticks, add some more ticks at existing interval and expand max.
                if (gotMore[2] > numberTicks) {
                    r[0] = Math.floor(axis_min / ss) * ss;  // min
                    r[2] = numberTicks;                     // number of ticks
                    r[3] = bestFormatString(ss);            // format string
                    r[4] = ss;                              // tick Interval
                    r[1] = r[0] + (r[2] - 1) * r[4];        // max
                }

                // gotMore has just enough ticks, use them.
                else if (gotMore[2] === numberTicks) {
                    r[0] = Math.floor(axis_min / gotMore[1]) * gotMore[1];  // minimum
                    r[1] = Math.ceil(axis_max / gotMore[1]) * gotMore[1];   // maximum
                    r[2] = numberTicks;                                     // number ticks
                    r[3] = bestFormatString(gotMore[1]);                    // format string
                    r[4] = gotMore[1];                                      // tick interval
                    r[1] = r[0] + (r[2] - 1) * r[4];                        // max
                }

                // gotMore doesn't have enough ticks, add some at gotMore interval.
                else {
                    r[0] = Math.floor(axis_min / gotMore[1]) * gotMore[1];  // minimum
                    r[2] = numberTicks;                                     // number of ticks
                    r[3] = bestFormatString(gotMore[1]);                    // format string
                    r[4] = gotMore[1];                                      // tick interval
                    r[1] = r[0] + (r[2] - 1) * r[4];                        // max
                }
                
            }

            // too many ticks, take away some
            else {
                console.log('too many');
                // returns interval, factor, magnitude
                var c = bestLinearComponents(axis_max - axis_min, scalefact);
                // the offset we would get by simply adding more ticks;
                var error = numberTicks - tempr[2] * ss;

                var ntmult = Math.ceil(numberTicks / tempr[2]);
                var count = 0;

                var range = tempr[1] - tempr[0];

                function getLessTicks(f, mag, r) {
                    // try to adjust factor and see what we get
                    var newf = _getHigherFactor(f);
                    var newti = newf * mag;
                    var newnt = Math.round(r / newti + 1);
                    // new factor, tickInterval, numberTicks
                    return [newf, newti, newnt];
                }

                function findLessTicks(f, mag, r) {
                    var getLess = getLessTicks(f, mag, r);
                    console.log('getting less: ', getLess);

                    if (count < 2 * (ntmult+1)) {

                        if (getLess[2] > numberTicks) {
                            count++;
                            getLess = findLessTicks(getLess[0], mag, r);
                        }
                        
                    }

                    return  getLess;
                }

                // Try getting more ticks at nice interval.
                // return:
                //          0: factor
                //          1: tick interval
                //          2: number ticks
                var gotLess = findLessTicks(c[1], c[2], range);
                console.log('got less: ', gotLess);

                //
                // gotLess has too few ticks, add some more ticks at gotless interval and expand max.
                if (gotLess[2] < numberTicks) {
                    r[0] = Math.floor(axis_min / gotLess[1]) * gotLess[1];  // min
                    r[2] = numberTicks;                     // number of ticks
                    r[3] = bestFormatString(ss);            // format string
                    r[4] = gotLess[1];                              // tick Interval
                    r[1] = r[0] + (r[2] - 1) * r[4];        // max
                }

                // gotLess has just enough ticks, use them.
                else if (gotLess[2] === numberTicks) {
                    r[0] = Math.floor(axis_min / gotLess[1]) * gotLess[1];  // minimum
                    r[2] = numberTicks;                                     // number ticks
                    r[3] = bestFormatString(gotLess[1]);                    // format string
                    r[4] = gotLess[1];                                      // tick interval
                    r[1] = r[0] + (r[2] - 1) * r[4];        // max
                }
            }
        }

        console.log('r is: ', r);

        return r;
    };

    $.jqplot.LinearTickGenerator.bestLinearInterval = bestLinearInterval;
    $.jqplot.LinearTickGenerator.bestLinearComponents = bestLinearComponents;

})(jQuery);