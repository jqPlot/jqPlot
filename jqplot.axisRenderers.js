(function($) {
    var debug = 1;
        
	// Convienence function that won't hang IE.
	function log() {
	    if (window.console && debug) {
	       if (arguments.length == 1) console.log (arguments[0]);
	       else console.log(arguments);
	    }
	};
	
    $.jqplot.linearAxisRenderer = function() {
    };
    
    $.jqplot.linearAxisRenderer.prototype.init = function(options){
        $.extend(true, this, options);
    };
    
    // function: draw
    // Creates the axis container DOM element and tick DOM elements.
    // Populates some properties of the elements and figures out
    // height and width of element.
    // called with scope of axis
    $.jqplot.linearAxisRenderer.prototype.draw = function() {
        if (this.show) {
            // populate the axis label and value properties.
            this.renderer.createTicks.call(this);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get it's bounds and
            // position it and the labels correctly on the plot.
            var dim=0;
            var temp;
            
            this._elem = $('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"
></div>');
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
    
    $.jqplot.linearAxisRenderer.prototype.set = function() {   
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
            else if (this.name == 'x2axis') this._elem.css({'height':dim+'px', left:'0px', top:'0px'
});
            else if (this.name == 'yaxis') this._elem.css({'width':dim+'px', left:'0px', top:'0px'})
;
            else if (this.name == 'y2axis') this._elem.css({'width':dim+'px', right:'0px', top:'0px'
});
        }  
    };
    
    // function: setAxis
    // called with scope of an axis
    // Populate the axis properties, giving a label and value
    // (corresponding to the user data coordinates, not plot coords.)
    // for each tick on the axis.
    $.jqplot.linearAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var axis = this;
        var ticks = axis._ticks;
        var name = axis.name;
        // databounds were set on axis initialization.
        var db = axis._dataBounds;
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
            //             t._styles = {position:'absolute', top:'0px', left:pox, paddingTop:'10px'}
;
            //             break;
            //         case 'x2axis':
            //             t._styles = {position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'
};
            //             break;
            //         case 'yaxis':
            //             t._styles = {position:'absolute', right:'0px', top:pox, paddingRight:'10px'
};
            //             break;
            //         case 'y2axis':
            //             t._styles = {position:'absolute', left:'0px', top:pox, paddingLeft:'10px'
};
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
                dim = this._plotWidth;
            }
            else {
                dim = this._plotHeight;
            }
        
            min = ((this.min != null) ? this.min : db.min);
            max = ((this.max != null) ? this.max : db.max);

            var range = max - min;
            var rmin, rmax;
        
            rmin = min - range/2*(this.pad - 1);
            rmax = max + range/2*(this.pad - 1);
            this.min = rmin;
            this.max = rmax;
            range = this.max - this.min;
    
            if (this.numberTicks == null){
                if (dim > 100) {
                    this.numberTicks = parseInt(3+(dim-100)/75);
                }
                else this.numberTicks = 2;
            }
    
            this.tickInterval = range / (this.numberTicks-1);
            for (var i=0; i<this.numberTicks; i++){
                tt = this.min + i * range / (this.numberTicks-1);
                var t = new $.jqplot.AxisTick(this.tickOptions);
                if (!this.showTicks) {
                    t.showLabel = false;
                    t.showMark = false;
                }
                else if (!this.showTickMarks) t.showMark = false;
                t.setTick(tt, this.name);
                axis._ticks.push(t);
            }
        }
    };
    
    // functions: pack
    // Define unit <-> coordinate conversions and properly position tick dom elements.
    // Now we know offsets around the grid, we can define conversioning functions.
    $.jqplot.linearAxisRenderer.prototype.pack = function(pos, offsets) {
        var ticks = this._ticks;
        var max = this.max;
        var min = this.min;
        var offmax = offsets.max;
        var offmin = offsets.min;
        
        for (var p in pos) {
            this._elem.css(p, pos[p]);
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top
 left.
        var pixellength = offmax - offmin;
        var unitlength = max - min;
        
        // point to unit and unit to point conversions references to Plot DOM element top left corner
.
        this.p2u = function(p){
            return (p - offmin) * unitlength / pixellength + min;
        };
        
        this.u2p = function(u){
            return (u - min) * pixellength / unitlength + offmin;
        };
        
        // point to unit and unit to point conversions references to Grid DOM element top left corner
.
        this.grid_p2u = function(p){
            return p * unitlength / pixellength + min;
        };
        
        this.grid_u2p = function(u){
            return (u - min) * pixellength / unitlength;
        };
        
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
    
    // Class: categoryAxisRenderer
    // Subclass of linearAxisRenderer.  Renderes axis as equally spaced category labels.
    $.jqplot.categoryAxisRenderer = function() {
        $.jqplot.linearAxisRenderer.call(this);
    };
 
    // function: setAxis
    // called with scope of an axis
    // Populate the axis properties, giving a label and value
    // (corresponding to the user data coordinates, not plot coords.)
    // for each tick on the axis.
    $.jqplot.categoryAxisRenderer.prototype.setAxis = function(plotHeight, plotWidth) {
        // we're are operating on an axis here
        var axis = this;
        var ticks = this._ticks;
        var name = this.name;
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        
        this._canvasHeight = plotHeight;
        this._canvasWidth = plotWidth;
        
        // if tick
        
        // Ticks should have been already specified by the user or set by the line renderer.  Since 
we
        // don't have access to the series, there's not much to do if we don't already have ticks.
        if (ticks.length) {
            this.numberTicks =ticks.length;
            for (i=0; i<ticks.length; i++){
                var t = ticks[i];
                if (!t.label) t.label = this.formatter(this.formatString, t.value.toString());
                // databounds should have been set to 0, 2*series length in line renderer
                this.min = db.min;
                this.max = db.max;
                // set iitial css positioning styles for the ticks.
                var pox = i*15+'px';
                switch (name) {
                    case 'xaxis':
                        t._styles = {position:'absolute', top:'0px', left:pox, paddingTop:'10px'};
                        break;
                    case 'x2axis':
                        t._styles = {position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'
};
                        break;
                    case 'yaxis':
                        t._styles = {position:'absolute', right:'0px', top:pox, paddingRight:'10px'}
;
                        break;
                    case 'y2axis':
                        t._styles = {position:'absolute', left:'0px', top:pox, paddingLeft:'10px'};
                        break;
                }
            }
        }
        
        // we don't have any ticks yet, try to guess based on the bounds.
        else {
            // TBD what to do here.
        }
        
        if (name == 'yaxis' || name == 'y2axis') this.ticks.styles.reverse();
    };
    
    
})(jQuery);