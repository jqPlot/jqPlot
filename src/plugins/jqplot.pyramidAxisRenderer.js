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
    $.jqplot.PyramidAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.PyramidAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.PyramidAxisRenderer.prototype.constructor = $.jqplot.PyramidAxisRenderer;
        
    // called with scope of axis
    $.jqplot.PyramidAxisRenderer.prototype.init = function(options){
        // Group: Properties
        //
        // prop: position
        // Position of axis.  Values are: top, bottom , left, center, right.
        // By default, x and x2 axes are bottom, y axis is center.
        this.position = null;
        this._type = 'pyramid';

        if (this.name.charAt(0) === 'x') {
            this.position = 'bottom';
        }
        else {
            this.position = 'center';
        }
        
        $.extend(true, this, options);
        this.renderer.options = options;

        this.resetDataBounds = this.renderer.resetDataBounds;
        this.resetDataBounds();

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
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s._plotData;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name.charAt(0) === 'x') {
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
            this._elem.addClass('jqplot-axis jqplot-'+this.name);
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

    // called with scope of axis
    $.jqplot.PyramidAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        // get a copy of user's settings for min/max.
        var userMin = this.min;
        var userMax = this.max;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0, l=userTicks.length; i<l; i++){
                var ut = userTicks[i];
                var t = new this.tickRenderer(this.tickOptions);
                if ($.isArray(ut)) {
                    t.value = ut[0];
                    t.label = ut[1];
                    t.setTick(ut[0], this.name);
                    this._ticks.push(t);
                }

                else if ($.isPlainObject(ut)) {
                    $.extend(true, t, ut);
                    t.axis = this.name;
                    this._ticks.push(t);
                }
                
                else {
                    t.value = ut;
                    t.setTick(ut, this.name);
                    this._ticks.push(t);
                }
            }
            this.numberTicks = userTicks.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks-1].value;
            this.tickInterval = (this.max - this.min) / (this.numberTicks - 1);
        }

        // we don't have any ticks yet, let's make some!
        else {
            if (this.name.charAt(0) === 'x') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }

            // ticks will be on whole integers like 1, 2, 3, ... or 1, 4, 7, ...
            var min = this._dataBounds.min;
            var max = this._dataBounds.max;
            var s = this._series[0];
            this.ticks = [];

            var range = max - min;

            // if range is a prime, will get only 2 ticks, expand range in that case.
            var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
            if ($.inArray(range, primes) > -1) {
                range += 1;
                max += 1;
            }

            this.max = max;
            this.min = min;
            
            var maxVisibleTicks = Math.round(2 + Math.pow((dim/35), 0.8));

            if (range + 1 <= maxVisibleTicks) {
                this.numberTicks = range + 1;
                this.tickInterval = 1.0;
            }

            else {
                // figure out a round number of ticks to skip in every interval
                // range / ti + 1 = nt
                // ti = range / (nt - 1)
                for (var i=maxVisibleTicks; i>1; i--) {
                    if (range/(i - 1) === Math.round(range/(i - 1))) {
                        this.numberTicks = i;
                        this.tickInterval = range/(i - 1);
                        break;
                    }
                    
                }
            }

            for (var i=0; i<this.numberTicks; i++) {
                this.tickOptions.axis = this.name;
                this.tickOptions.label = String (this.min + this.tickInterval * i);
                this.tickOptions.value = this.min + this.tickInterval * i;
                var t = new this.tickRenderer(this.tickOptions);
                this._ticks.push(t);
                t = null;
            }
        }

        ticks = null;
    };
})(jQuery);