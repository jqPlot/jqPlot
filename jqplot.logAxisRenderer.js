(function($) {
	// class: $.jqplot.LogAxisRenderer
	// A plugin for a jqPlot to render a logarithmic axis.	
    $.jqplot.LogAxisRenderer = function() {
        // prop: seriesDefaults
        // Default properties which will be applied directly to the series.
        //
        // Group: Properties
        //
        // Properties
        /// base - the logarithmic base, commonly 2, 10 or Math.E
        // tickDistribution - 'even' or 'power'.  'even' gives equal pixel
        // spacing of the ticks on the plot.  'power' gives ticks in powers
        // of 10.
        this.seriesDefaults = {
            base : 10,
            tickDistribution :'even'
        };
    };
    
    $.jqplot.LogAxisRenderer.prototype.init = function(options) {
        $.extend(true, this.renderer, options);
        for (var d in this.renderer.seriesDefaults) {
            if (this[d] == null) this[d] = this.renderer.seriesDefaults[d];
        }
        var db = this._dataBounds;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s.data;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[j][0] < db.min || db.min == null) db.min = d[j][0];
                    if (d[j][0] > db.max || db.max == null) db.max = d[j][0];
                }              
                else {
                    if (d[j][1] < db.min || db.min == null) db.min = d[j][1];
                    if (d[j][1] > db.max || db.max == null) db.max = d[j][1];
                }              
            }
        }
    };

    $.jqplot.LogAxisRenderer.prototype.draw = function() {
        if (this.show) {
            // populate the axis label and value properties.
            this.renderer.createTicks.call(this);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get it's bounds and
            // position it and the labels correctly on the plot.
            var dim=0;
            var temp;
            
            this._elem = $('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>');
            //for (var s in axis.style) $(axis._elem).css(s, axis.style[s]);
    
            if (this.showTicks) {
                var t = this._ticks;
                for (var i=0; i<t.length; i++) {
                    var tick = t[i];
                    if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                        var elem = tick.draw();
                        //var elem = $(frag).appendTo(axis._elem).get(0);
                        elem.appendTo(this._elem);
                    }
                }
            }
        }
        return this._elem;
    };    
    
    $.jqplot.LogAxisRenderer.prototype.set = function() {   
        var dim = 0;
        var temp; 
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
                    if (temp > dim) dim = temp;
                }
            }
            if (this.name == 'xaxis') this._elem.css({'height':dim+'px', left:'0px', bottom:'0px'});
            else if (this.name == 'x2axis') this._elem.css({'height':dim+'px', left:'0px', top:'0px'});
            else if (this.name == 'yaxis') this._elem.css({'width':dim+'px', left:'0px', top:'0px'});
            else if (this.name == 'y2axis') this._elem.css({'width':dim+'px', right:'0px', top:'0px'});
        } 
    };
    
    $.jqplot.LogAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var name = this.name;
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        
        //////////////////
        // fix me
        /////////////////
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        if (ticks.length) {
            // for (i=0; i<ticks.length; i++){
            //     var t = ticks[i];
            //     if (!t.label) t.label = t.value.toString();
            //     // set iitial css positioning styles for the ticks.
            //     var pox = i*15+'px';
            //     switch (name) {
            //         case 'xaxis':
            //             t._styles = {position:'absolute', top:'0px', left:pox, paddingTop:'10px'};
            //             break;
            //         case 'x2axis':
            //             t._styles = {position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'};
            //             break;
            //         case 'yaxis':
            //             t._styles = {position:'absolute', right:'0px', top:pox, paddingRight:'10px'};
            //             break;
            //         case 'y2axis':
            //             t._styles = {position:'absolute', left:'0px', top:pox, paddingLeft:'10px'};
            //             break;
            //     }
            // }
            // this.numberTicks = ticks.length;
            // this.min = ticks[0].value;
            // this.max = ticks[this.numberTicks-1].value;
            // this.tickInterval = (this.max - this.min) / (this.numberTicks - 1);
        }
        
        // we don't have any ticks yet, let's make some!
        else {
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
        
            min = ((this.min != null) ? this.min : db.min);
            max = ((this.max != null) ? this.max : db.max);
            // perform some checks
            if (this.min != null && this.min <= 0) throw('log axis minimum must be greater than 0');
            if (this.max != null && this.max <= 0) throw('log axis maximum must be greater than 0');
            // if (this.pad >1.99) this.pad = 1.99;
            var range = max - min;
            var rmin, rmax;

            if (this.tickDistribution == 'even') {                    
                rmin = (this.min != null) ? this.min : min - min*((this.pad-1)/2);
                rmax = (this.max != null) ? this.max : max + max*((this.pad-1)/2);
                this.min = rmin;
                this.max = rmax;
                range = this.max - this.min;            
        
                if (this.numberTicks == null){
                    if (dim > 100) {
                        this.numberTicks = parseInt(3+(dim-100)/75);
                    }
                    else {
                        this.numberTicks = 2;
                    }
                }
    
                var u = Math.pow(this.base, (1/(this.numberTicks-1)*Math.log(this.max/this.min)/Math.log(this.base)));
                for (var i=0; i<this.numberTicks; i++){
                    tt = this.min * Math.pow(u, i);
                    var t = new this.tickRenderer(this.tickOptions);
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) t.showMark = false;
                    t.setTick(tt, this.name);
                    this._ticks.push(t);
                }
                
            }
            
            else if (this.tickDistribution == 'power'){
                // for power distribution, open up range to get a nice power of axis.renderer.base.
                // don't respect the user's min/max settings. (fix this).
                rmin = Math.pow(this.base, Math.ceil(Math.log(min*(2-this.pad))/Math.log(this.base))-1);
                rmax = Math.pow(this.base, Math.floor(Math.log(max*this.pad)/Math.log(this.base))+1);
                this.min = rmin;
                this.max = rmax;
                range = this.max - this.min;            
        
                var fittedTicks = 0;
                var minorTicks = 0;
                if (this.numberTicks == null){
                    if (dim > 100) {
                        this.numberTicks = Math.round(Math.log(this.max/this.min)/Math.log(this.base) + 1);
                        if (this.numberTicks < 2) this.numberTicks = 2;
                        fittedTicks = parseInt(3+(dim-100)/75);
                    }
                    else {
                        this.numberTicks = 2;
                        fittedTicks = 2;
                    }
                    // if we don't have enough ticks, add some intermediate ticks
                    // how many to have between major ticks.
                    if (this.numberTicks < fittedTicks-1) {
                        minorTicks = Math.floor(fittedTicks/this.numberTicks);
                    }
                }

                for (var i=0; i<this.numberTicks; i++){
                    tt = Math.pow(this.base, i - this.numberTicks + 1) * this.max;
                    var t = new this.tickRenderer(this.tickOptions);
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) t.showMark = false;
                    t.setTick(tt, this.name);
                    this._ticks.push(t);
            
                    if (minorTicks && i<this.numberTicks-1) {
                        var tt1 = Math.pow(this.base, i - this.numberTicks + 2) * this.max;
                        var spread = tt1 - tt;
                        var interval = tt1 / (minorTicks+1);
                        for (var j=minorTicks-1; j>=0; j--) {
                            var val = tt1-interval*(j+1);
                            var t = new this.tickRenderer(this.tickOptions);
                            if (!this.showTicks) {
                                t.showLabel = false;
                                t.showMark = false;
                            }
                            else if (!this.showTickMarks) t.showMark = false;
                            t.setTick(val, this.name);
                            this._ticks.push(t);
                        }
                    }       
                }                    
            }       
        }
    };
    
    $.jqplot.LogAxisRenderer.prototype.pack = function(pos, offsets) {
        var lb = parseInt(this.base);
        var ticks = this._ticks;
        var trans = function (v) { return Math.log(v)/Math.log(lb); };
        max = trans(this.max);
        min = trans(this.min);
        var offmax = offsets.max;
        var offmin = offsets.min;
        
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
            return (trans(u) - min) * pixellength / unitlength + offmin;
        };
        
        // point to unit and unit to point conversions references to Grid DOM element top left corner.
        this.series_p2u = function(p){
            return p * unitlength / pixellength + min;
        };
        
        if (this.name == 'xaxis' || this.name == 'x2axis'){
            this.series_u2p = function(u){
                return (trans(u) - min) * pixellength / unitlength;
            };
        }
        // yaxis is max at top of canvas.
        else {
            this.series_u2p = function(u){
                return (trans(u) - max) * pixellength / unitlength;
            };
        }
        
        if (this.show) {
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    var shim = t.getWidth()/2;
                    var val = this.u2p(t.value) - shim + 'px';
                    t._elem.css('left', val);
                }
            }
            else {
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    var shim = t.getHeight()/2;
                    var val = this.u2p(t.value) - shim + 'px';
                    t._elem.css('top', val);
                }
            }
        }        
    };
})(jQuery);