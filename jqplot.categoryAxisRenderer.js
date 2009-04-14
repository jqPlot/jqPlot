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
 

    $.jqplot.CategoryAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        log("in category axis renderer create ticks");
        var ticks = this._ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;

        //////////////////////////
        //////////////////////////
        // fix me
        //////////////////////////
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
            // axis.numberTicks = ticks.length;
            // axis.min = ticks[0].value;
            // axis.max = ticks[axis.numberTicks-1].value;
            // axis.tickInterval = (axis.max - axis.min) / (axis.numberTicks - 1);
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
                log(s);
                for (var j=0; j<s.data.length; j++) {
                    var val = String(s.data[j][0]);
                    log(val);
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
            var maxVisibleTicks = parseInt(3+dim/50);


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
                    t.showLabel = true;
                    t.label = labels[(i-1)/2];
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
            log(this);
        }
    };
    
    
})(jQuery);