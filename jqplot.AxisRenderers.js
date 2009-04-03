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
    $.jqplot.linearAxisRenderer.prototype.draw = function(target, plotHeight, plotWidth) {
        var axis = this;
        if (axis.show) {
            // populate the axis label and value properties.
            axis.renderer.setAxis.call(axis, plotHeight, plotWidth);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get it's bounds and
            // position it and the labels correctly on the plot.
            var h, w;
            
            axis._elem = $('<div class="jqplot-axis"></div>').appendTo(target).get(0);
            //for (var s in axis.style) $(axis._elem).css(s, axis.style[s]);
    
            if (axis.ticks.showLabels) {
                var t = axis._ticks;
                for (var i=0; i<t.length; i++) {
                    var tick = t[i];
                    if (!tick.isMinorTick || axis.showMinorTicks) {
                        var elem = tick.draw();
                        //var elem = $(frag).appendTo(axis._elem).get(0);
                        $(elem).appendTo(axis._elem);
                        for (var s in tick._styles) {
                            $(elem).css(s, tick._styles[s]);   
                        }
                        $(elem).html(tick.label);
                    
                        if (axis.ticks.fontFamily) elem.style.fontFamily = axis.ticks.fontFamily;
                        if (axis.ticks.fontSize) elem.style.fontSize = axis.ticks.fontSize;
                    
                        h = $(elem).outerHeight(true);
                        w = $(elem).outerWidth(true);
                    
                        if (axis._height < h) {
                            axis._height = h;
                        }
                        if (axis._width < w) {
                            axis._width = w;
                        }
                    }
                }
            }
        }
    };
    
    // function: setAxis
    // called with scope of an axis
    // Populate the axis properties, giving a label and value
    // (corresponding to the user data coordinates, not plot coords.)
    // for each tick on the axis.
    $.jqplot.linearAxisRenderer.prototype.setAxis = function(plotHeight, plotWidth) {
        // we're are operating on an axis here
        var axis = this;
        var ticks = axis._ticks;
        var name = axis.name;
        var db = axis._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        
        axis._canvasHeight = plotHeight;
        axis._canvasWidth = plotWidth;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        if (ticks.length) {
            for (i=0; i<ticks.length; i++){
                var t = ticks[i];
                if (!t.label) t.label = t.value.toString();
                // set iitial css positioning styles for the ticks.
                var pox = i*15+'px';
                switch (name) {
                    case 'xaxis':
                        t._styles = {position:'absolute', top:'0px', left:pox, paddingTop:'10px'};
                        break;
                    case 'x2axis':
                        t._styles = {position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'};
                        break;
                    case 'yaxis':
                        t._styles = {position:'absolute', right:'0px', top:pox, paddingRight:'10px'};
                        break;
                    case 'y2axis':
                        t._styles = {position:'absolute', left:'0px', top:pox, paddingLeft:'10px'};
                        break;
                }
            }
            axis.numberTicks = ticks.length;
            axis.min = ticks[0].value;
            axis.max = ticks[axis.numberTicks-1].value;
            axis.tickInterval = (axis.max - axis.min) / (axis.numberTicks - 1);
        }
        
        // we don't have any ticks yet, let's make some!
        else {
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._canvasWidth;
            }
            else {
                dim = this._canvasHeight;
            }
        
            min = ((this.min != null) ? this.min : db.min);
            max = ((this.max != null) ? this.max : db.max);
            // perform some checks
            if (min < 1e-9) min = 1e-9;
            if (max < 1e-8) max = 1e-8;
            if (this.pad >1.99) this.pad = 1.99;
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
                var t = new $.jqplot.AxisTick();
                var label = axis.tickFormatter(axis.ticks.formatString, tt);
                t.setTick(tt, label, this.name);
                axis._ticks.push(t);
            }
        }
        
        if (name == 'yaxis' || name == 'y2axis') this.ticks.styles.reverse();
    };
    
    // functions: pack
    // Define unit <-> coordinate conversions and properly position tick dom elements.
    // Now we know offsets around the grid, we can define conversioning functions.
    $.jqplot.linearAxisRenderer.prototype.pack = function(offsets, gridwidth, gridheight) {
        var ticks = this._ticks;
        var max = this.max;
        var min = this.min;
        
        if (this.name == 'xaxis' || this.name == 'x2axis') {
            this._offsets = {min:offsets.left, max:offsets.right};
            
            this.p2u = function(p) {
                return (p - this._offsets.min)*(this.max - this.min)/(this._canvasWidth - this._offsets.max - this._offsets.min) + this.min;
            }
            
            this.u2p = function(u) {
                return (u - this.min) * (this._canvasWidth - this._offsets.max - this._offsets.min) / (this.max - this.min) + this._offsets.min;
            }
            
            this.series_u2p = function(u) {
                return (u - this.min) * gridwidth / (this.max - this.min);
            }
            
            this.series_p2u = function(p) {
                return p * (this.max - this.min) / gridwidth + this.min;
            }
            
            if (this.show) {
                // set the position
                if (this.name == 'xaxis') {
                    $(this._elem).css({position:'absolute', left:'0px', top:(this._canvasHeight-offsets.bottom)+'px'});
                }
                else {
                    $(this._elem).css({position:'absolute', left:'0px', bottom:(this._canvasHeight-offsets.top)+'px'});
                }
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    var shim = $(t._elem).outerWidth(true)/2;
                    var val = this.u2p(t.value) - shim + 'px';
                    $(t._elem).css('left', val);
                    // remember, could have done it this way
                    //tickdivs[i].style.left = val;
                }
            }
        }  
        else {
            this._offsets = {min:offsets.bottom, max:offsets.top};
            
            this.p2u = function(p) {
                return (p - this._canvasHeight + this._offsets.min)*(max - min)/(this._canvasHeight - this._offsets.min - this._offsets.max) + min;
            }
            
            this.u2p = function(u) {
                return -(u - min) * (this._canvasHeight - this._offsets.min - this._offsets.max) / (max - min) + this._canvasHeight - this._offsets.min;
            }
            
            this.series_u2p = function(u) {
                return (max - u) * gridheight /(max - min);
            }
            
            this.series_p2u = function(p) {
                return -p * (max - min) / gridheight + max;
            }
            
            if (this.show) {
                // set the position
                if (this.name == 'yaxis') {
                    $(this._elem).css({position:'absolute', right:(this._canvasWidth-offsets.left)+'px', top:'0px'});
                }
                else {
                    $(this._elem).css({position:'absolute', left:(this._canvasWidth - offsets.right)+'px', top:'0px'});
                }
                for (i=0; i<tickdivs.length; i++) {
                    var t = ticks[i];
                    var shim = $(t._elem).outerHeight(true)/2;
                    var val = axis.u2p(t.value) - shim + 'px';
                    $(t._elem).css('top', val);
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
    $.jqplot.categroyAxisRenderer.prototype.setAxis = function(plotHeight, plotWidth) {
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
        
        // Ticks should have been already specified by the user or set by the line renderer.  Since we
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
                        t._styles = {position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'};
                        break;
                    case 'yaxis':
                        t._styles = {position:'absolute', right:'0px', top:pox, paddingRight:'10px'};
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