(function($) {
    var debug = 1;
        
	// Convienence function that won't hang IE.
	function log() {
	    if (window.console && debug) {
	       if (arguments.length == 1) console.log (arguments[0]);
	       else console.log(arguments);
	    }
	};
    
    $.jqplot.CategoryAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.CategoryAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.CategoryAxisRenderer.prototype.constructor = $.jqplot.CategoryAxisRenderer;
    
    $.jqplot.CategoryAxisRenderer.prototype.init = function(options){
        $.extend(true, this, {tickOptions:{formatString:'%d'}}, options);
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
 

    $.jqplot.CategoryAxisRenderer.prototype.createTicks = function() {
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
        if (userTicks.length) {
            this.min = 0.5;
            this.max = userTicks.length + 0.5;
            var range = this.max - this.min;
            this.numberTicks = 2*userTicks.length + 1;
            for (i=0; i<userTicks.length; i++){
                tt = this.min + 2 * i * range / (this.numberTicks-1);
                // need a marker before and after the tick
                var t = new this.tickRenderer(this.tickOptions);
                t.showLabel = false;
                t.showMark = true;
                t.showGridline = true;
                t.setTick(tt, this.name);
                this._ticks.push(t);
                var t = new this.tickRenderer(this.tickOptions);
                t.label = userTicks[i];
                t.showLabel = true;
                t.showMark = false;
                t.showGridline = false;
                t.setTick(tt+0.5, this.name);
                this._ticks.push(t);
            }
            // now add the last tick at the end
            var t = new this.tickRenderer(this.tickOptions);
            t.showLabel = false;
            t.showMark = true;
            t.showGridline = true;
            t.setTick(tt+1, this.name);
            this._ticks.push(t);
        }

        // we don't have any ticks yet, let's make some!
        else {
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
        
            // find out how many categories are in the lines and collect labels
            var labels = [];
            var numcats = 0;
            var min = 0.5;
            var max;
            for (var i=0; i<this._series.length; i++) {
                var s = this._series[i];
                for (var j=0; j<s.data.length; j++) {
                    var val = s.data[j][0];
                    if ($.inArray(val, labels) == -1) {
                        numcats += 1;      
                        labels.push(val);
                    }
                    // for category axis, force the x values into category bins.
                    s.data[j][0] = j+1;
                }
            }
        
            max = numcats + 0.5;
            this.numberTicks = 2*numcats + 1;

            var range = max - min;
            this.min = min;
            this.max = max;
            var track = 0;
            var maxVisibleTicks = parseInt(3+dim/45);
            var skip = parseInt(numcats/maxVisibleTicks);


            this.tickInterval = range / (this.numberTicks-1);
            for (var i=0; i<this.numberTicks; i++){
                tt = this.min + i * range / (this.numberTicks-1);
                var t = new this.tickRenderer(this.tickOptions);
                // if even tick, it isn't a category, it's a divider
                if (i/2 == parseInt(i/2)) {
                    t.showLabel = false;
                    t.showMark = true;
                    t.showGridline = true;
                }
                else {
                    if (skip>0 && track<skip) {
                        t.showLabel = false;
                        track += 1;
                    }
                    else {
                        t.showLabel = true;
                        track = 0;
                    } 
                    t.label = t.formatter(t.formatString, labels[(i-1)/2]);
                    t.showMark = false;
                    t.showGridline = false;
                }
                if (!this.showTicks) {
                    t.showLabel = false;
                    t.showMark = false;
                }
                else if (!this.showTickMarks) t.showMark = false;
                t.setTick(tt, this.name);
                this._ticks.push(t);
            }
        }
    };
    
    
})(jQuery);