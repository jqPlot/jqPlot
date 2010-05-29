/**
 * Copyright (c) 2009 - 2010 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * The author would appreciate an email letting him know of any substantial
 * use of jqPlot.  You can reach the author at: chris dot leonello at gmail 
 * dot com or see http://www.jqplot.com/info.php .  This is, of course, 
 * not required.
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * Thanks for using jqPlot!
 * 
 */
(function($) {
    // class: $.jqplot.LinearAxisRenderer
    // The default jqPlot axis renderer, creating a numeric axis.
    // The renderer has no additional options beyond the <Axis> object.
    $.jqplot.LinearAxisRenderer = function() {
    };
    
    // called with scope of axis object.
    $.jqplot.LinearAxisRenderer.prototype.init = function(options){
        $.extend(true, this, options);
        var db = this._dataBounds;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s._plotData;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[j][0] < db.min || db.min == null) {
                        db.min = d[j][0];
                    }
                    if (d[j][0] > db.max || db.max == null) {
                        db.max = d[j][0];
                    }
                }              
                else {
                    if (d[j][1] < db.min || db.min == null) {
                        db.min = d[j][1];
                    }
                    if (d[j][1] > db.max || db.max == null) {
                        db.max = d[j][1];
                    }
                }              
            }
        }
    };
    
    // called with scope of axis
    $.jqplot.LinearAxisRenderer.prototype.draw = function(ctx) {
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
                this._elem.empty();
            }
            
            this._elem = $('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>');
            
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
                var elem = this._label.draw(ctx);
                elem.appendTo(this._elem);
            }
    
            if (this.showTicks) {
                var t = this._ticks;
                for (var i=0; i<t.length; i++) {
                    var tick = t[i];
                    if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                        var elem = tick.draw(ctx);
                        elem.appendTo(this._elem);
                    }
                }
            }
        }
        return this._elem;
    };
    
    // called with scope of an axis
    $.jqplot.LinearAxisRenderer.prototype.reset = function() {
        this.min = this._min;
        this.max = this._max;
        this.tickInterval = this._tickInterval;
        this.numberTicks = this._numberTicks;
        // this._ticks = this.__ticks;
    };
    
    // called with scope of axis
    $.jqplot.LinearAxisRenderer.prototype.set = function() { 
        var dim = 0;
        var temp;
        var w = 0;
        var h = 0;
        var lshow = (this._label == null) ? false : this._label.show;
        if (this.show && this.showTicks) {
            var t = this._ticks;
            for (var i=0; i<t.length; i++) {
                var tick = t[i];
                if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        temp = tick._elem.outerHeight(true);
                    }
                    else {
                        temp = tick._elem.outerWidth(true);
                    }
                    if (temp > dim) {
                        dim = temp;
                    }
                }
            }
            
            if (lshow) {
                w = this._label._elem.outerWidth(true);
                h = this._label._elem.outerHeight(true); 
            }
            if (this.name == 'xaxis') {
                dim = dim + h;
                this._elem.css({'height':dim+'px', left:'0px', bottom:'0px'});
            }
            else if (this.name == 'x2axis') {
                dim = dim + h;
                this._elem.css({'height':dim+'px', left:'0px', top:'0px'});
            }
            else if (this.name == 'yaxis') {
                dim = dim + w;
                this._elem.css({'width':dim+'px', left:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
            else {
                dim = dim + w;
                this._elem.css({'width':dim+'px', right:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
        }  
    };    
    
    // called with scope of axis
    $.jqplot.LinearAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0; i<userTicks.length; i++){
                var ut = userTicks[i];
                var t = new this.tickRenderer(this.tickOptions);
                if (ut.constructor == Array) {
                    t.value = ut[0];
                    t.label = ut[1];
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(ut[0], this.name);
                    this._ticks.push(t);
                }
                
                else {
                    t.value = ut;
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
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
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
            
            // if min, max and number of ticks specified, user can't specify interval.
            if (!this.autoscale && this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null;
            }
            
            // if max, min, and interval specified and interval won't fit, ignore interval.
            // if (this.min != null && this.max != null && this.tickInterval != null) {
            //     if (parseInt((this.max-this.min)/this.tickInterval, 10) != (this.max-this.min)/this.tickInterval) {
            //         this.tickInterval = null;
            //     }
            // }
        
            min = ((this.min != null) ? this.min : db.min);
            max = ((this.max != null) ? this.max : db.max);
            
            // if min and max are same, space them out a bit
            if (min == max) {
                var adj = 0.05;
                if (min > 0) {
                    adj = Math.max(Math.log(min)/Math.LN10, 0.05);
                }
                min -= adj;
                max += adj;
            }

            var range = max - min;
            var rmin, rmax;
            var temp;
            
            // autoscale.  Can't autoscale if min or max is supplied.
            // Will use numberTicks and tickInterval if supplied.  Ticks
            // across multiple axes may not line up depending on how
            // bars are to be plotted.
            if (this.autoscale && this.min == null && this.max == null) {
                var rrange, ti, margin;
                var forceMinZero = false;
                var forceZeroLine = false;
                var intervals = {min:null, max:null, average:null, stddev:null};
                // if any series are bars, or if any are fill to zero, and if this
                // is the axis to fill toward, check to see if we can start axis at zero.
                for (var i=0; i<this._series.length; i++) {
                    var s = this._series[i];
                    var faname = (s.fillAxis == 'x') ? s._xaxis.name : s._yaxis.name;
                    // check to see if this is the fill axis
                    if (this.name == faname) {
                        var vals = s._plotValues[s.fillAxis];
                        var vmin = vals[0];
                        var vmax = vals[0];
                        for (var j=1; j<vals.length; j++) {
                            if (vals[j] < vmin) {
                                vmin = vals[j];
                            }
                            else if (vals[j] > vmax) {
                                vmax = vals[j];
                            }
                        }
                        var dp = (vmax - vmin) / vmax;
                        // is this sries a bar?
                        if (s.renderer.constructor == $.jqplot.BarRenderer) {
                            // if no negative values and could also check range.
                            if (vmin >= 0 && (s.fillToZero || dp > 0.1)) {
                                forceMinZero = true;
                            }
                            else {
                                forceMinZero = false;
                                if (s.fill && s.fillToZero && vmin < 0 && vmax > 0) {
                                    forceZeroLine = true;
                                }
                                else {
                                    forceZeroLine = false;
                                }
                            }
                        }
                        
                        // if not a bar and filling, use appropriate method.
                        else if (s.fill) {
                            if (vmin >= 0 && (s.fillToZero || dp > 0.1)) {
                                forceMinZero = true;
                            }
                            else if (vmin < 0 && vmax > 0 && s.fillToZero) {
                                forceMinZero = false;
                                forceZeroLine = true;
                            }
                            else {
                                forceMinZero = false;
                                forceZeroLine = false;
                            }
                        }
                        
                        // if not a bar and not filling, only change existing state
                        // if it doesn't make sense
                        else if (vmin < 0) {
                            forceMinZero = false;
                        }
                    }
                }
                
                // check if we need make axis min at 0.
                if (forceMinZero) {
                    // compute number of ticks
                    this.numberTicks = 2 + Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);
                    this.min = 0;
                    // what order is this range?
                    // what tick interval does that give us?
                    ti = max/(this.numberTicks-1);
                    temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti)/Math.LN10)));
                    if (ti/temp == parseInt(ti/temp, 10)) {
                        ti += temp;
                    }
                    this.tickInterval = Math.ceil(ti/temp) * temp;
                    this.max = this.tickInterval * (this.numberTicks - 1);
                }
                
                // check if we need to make sure there is a tick at 0.
                else if (forceZeroLine) {
                    // compute number of ticks
                    this.numberTicks = 2 + Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);
                    var ntmin = Math.ceil(Math.abs(min)/range*(this.numberTicks-1));
                    var ntmax = this.numberTicks - 1  - ntmin;
                    ti = Math.max(Math.abs(min/ntmin), Math.abs(max/ntmax));
                    temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti)/Math.LN10)));
                    this.tickInterval = Math.ceil(ti/temp) * temp;
                    this.max = this.tickInterval * ntmax;
                    this.min = -this.tickInterval * ntmin;                  
                }
                
                // if nothing else, do autoscaling which will try to line up ticks across axes.
                else {  
                    if (this.numberTicks == null){
                        if (this.tickInterval) {
                            this.numberTicks = 3 + Math.ceil(range / this.tickInterval);
                        }
                        else {
                            this.numberTicks = 2 + Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);
                        }
                    }
            
                    if (this.tickInterval == null) {
                        // get a tick interval
                        ti = range/(this.numberTicks - 1);

                        if (ti < 1) {
                            temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti)/Math.LN10)));
                        }
                        else {
                            temp = 1;
                        }
                        this.tickInterval = Math.ceil(ti*temp*this.pad)/temp;
                    }
                    else {
                        temp = 1 / this.tickInterval;
                    }
                    
                    // try to compute a nicer, more even tick interval
                    // temp = Math.pow(10, Math.floor(Math.log(ti)/Math.LN10));
                    // this.tickInterval = Math.ceil(ti/temp) * temp;
                    rrange = this.tickInterval * (this.numberTicks - 1);
                    margin = (rrange - range)/2;
       
                    if (this.min == null) {
                        this.min = Math.floor(temp*(min-margin))/temp;
                    }
                    if (this.max == null) {
                        this.max = this.min + rrange;
                    }
                }
            }
            
            // Use the default algorithm which pads each axis to make the chart
            // centered nicely on the grid.
            else {
                rmin = (this.min != null) ? this.min : min - range*(this.padMin - 1);
                rmax = (this.max != null) ? this.max : max + range*(this.padMax - 1);
                this.min = rmin;
                this.max = rmax;
                range = this.max - this.min;
    
                if (this.numberTicks == null){
                    // if tickInterval is specified by user, we will ignore computed maximum.
                    // max will be equal or greater to fit even # of ticks.
                    if (this.tickInterval != null) {
                        this.numberTicks = Math.ceil((this.max - this.min)/this.tickInterval)+1;
                        this.max = this.min + this.tickInterval*(this.numberTicks-1);
                    }
                    else if (dim > 100) {
                        this.numberTicks = parseInt(3+(dim-100)/75, 10);
                    }
                    else {
                        this.numberTicks = 2;
                    }
                }
            
                if (this.tickInterval == null) {
                    this.tickInterval = range / (this.numberTicks-1);
                }
            }

            for (var i=0; i<this.numberTicks; i++){
                tt = this.min + i * this.tickInterval;
                var t = new this.tickRenderer(this.tickOptions);
                // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
                if (!this.showTicks) {
                    t.showLabel = false;
                    t.showMark = false;
                }
                else if (!this.showTickMarks) {
                    t.showMark = false;
                }
                t.setTick(tt, this.name);
                this._ticks.push(t);
            }
        }
    };
    
    // called with scope of axis
    $.jqplot.LinearAxisRenderer.prototype.pack = function(pos, offsets) {
        var ticks = this._ticks;
        var max = this.max;
        var min = this.min;
        var offmax = offsets.max;
        var offmin = offsets.min;
        var lshow = (this._label == null) ? false : this._label.show;
        
        for (var p in pos) {
            this._elem.css(p, pos[p]);
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
        var pixellength = offmax - offmin;
        var unitlength = max - min;
        
        // point to unit and unit to point conversions references to Plot DOM element top left corner.
        this.p2u = function(p){
            return (p - offmin) * unitlength / pixellength + min;
        };
        
        this.u2p = function(u){
            return (u - min) * pixellength / unitlength + offmin;
        };
                
        if (this.name == 'xaxis' || this.name == 'x2axis'){
            this.series_u2p = function(u){
                return (u - min) * pixellength / unitlength;
            };
            this.series_p2u = function(p){
                return p * unitlength / pixellength + min;
            };
        }
        
        else {
            this.series_u2p = function(u){
                return (u - max) * pixellength / unitlength;
            };
            this.series_p2u = function(p){
                return p * unitlength / pixellength + max;
            };
        }
        
        if (this.show) {
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {
                        var shim;
                        
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'xaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                    if (temp * t.angle < 0) {
                                        shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    }
                                    // position at start
                                    else {
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
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                default:
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getWidth()/2;
                        }
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('left', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var w = this._label._elem.outerWidth(true);
                    this._label._elem.css('left', offmin + pixellength/2 - w/2 + 'px');
                    if (this.name == 'xaxis') {
                        this._label._elem.css('bottom', '0px');
                    }
                    else {
                        this._label._elem.css('top', '0px');
                    }
                    this._label.pack();
                }
            }
            else {
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {                        
                        var shim;
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'yaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                case 'end':
                                    if (temp * t.angle < 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'start':
                                    if (t.angle > 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'middle':
                                    // if (t.angle > 0) {
                                    //     shim = -t.getHeight()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    // }
                                    // else {
                                    //     shim = -t.getHeight()/2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    // }
                                    shim = -t.getHeight()/2;
                                    break;
                                default:
                                    shim = -t.getHeight()/2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getHeight()/2;
                        }
                        
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('top', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var h = this._label._elem.outerHeight(true);
                    this._label._elem.css('top', offmax - pixellength/2 - h/2 + 'px');
                    if (this.name == 'yaxis') {
                        this._label._elem.css('left', '0px');
                    }
                    else {
                        this._label._elem.css('right', '0px');
                    }   
                    this._label.pack();
                }
            }
        }
    };
})(jQuery);
