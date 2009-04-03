(function($) {
    var debug = 1;
        
	// Convienence function that won't hang IE.
	function log() {
	    if (window.console && debug) {
	       if (arguments.length == 1) console.log (arguments[0]);
	       else console.log(arguments);
	    }
	};
	
    $.jqplot.logAxisRenderer = function() {
        this.base = 10;
        this.tickDistribution = 'even';
    };
    
    $.jqplot.logAxisRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    // function: draw
    // Creates the axis container DOM element and tick DOM elements.
    // Populates some properties of the elements and figures out
    // height and width of element.
    // called with scope of axis
    $.jqplot.logAxisRenderer.prototype.draw = function(target, plotHeight, plotWidth) {
        // we are operating on a axis objec here.
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
    // Set initial styles on tick dom elements.
    // figure out numberTicks, min, max, tickInterval and tick values.
    $.jqplot.logAxisRenderer.prototype.setAxis = function(plotHeight, plotWidth) {
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
                dim = axis._canvasWidth;
            }
            else {
                dim = axis._canvasHeight;
            }
        
            min = ((axis.min != null) ? axis.min : db.min);
            max = ((axis.max != null) ? axis.max : db.max);
            // perform some checks
            if (min < 1e-9) min = 1e-9;
            if (max < 1e-8) max = 1e-8;
            if (axis.pad >1.99) axis.pad = 1.99;
            var range = max - min;
            var rmin, rmax;

            if (axis.renderer.tickDistribution == 'even') {                    
                // for log axes, open up range to get a nice power of axis.renderer.base.
                rmin = min - min*((axis.pad-1)/2);
                rmax = max + max*((axis.pad-1)/2);
                axis.min = rmin;
                axis.max = rmax;
                range = axis.max - axis.min;            
        
                if (axis.numberTicks == null){
                    if (dim > 100) {
                        axis.numberTicks = parseInt(3+(dim-100)/75);
                    }
                    else {
                        axis.numberTicks = 2;
                    }
                }
    
                var u = Math.pow(axis.renderer.base, (1/(axis.numberTicks-1)*Math.log(axis.max/axis.min)/Math.log(axis.renderer.base)));
                for (var i=0; i<axis.numberTicks; i++){
                    tt = axis.min * Math.pow(u, i);
                    var t = new $.jqplot.AxisTick();
                    var label = axis.tickFormatter(axis.ticks.formatString, tt);
                    t.setTick(tt, label, name);
                    axis._ticks.push(t);
                }
                
            }
            
            else if (axis.renderer.tickDistribution == 'power'){
                
                // for log axes, open up range to get a nice power of axis.renderer.base.
                rmin = Math.pow(axis.renderer.base, Math.ceil(Math.log(min*(2-axis.pad))/Math.log(axis.renderer.base))-1);
                rmax = Math.pow(axis.renderer.base, Math.floor(Math.log(max*axis.pad)/Math.log(axis.renderer.base))+1);
                axis.min = rmin;
                axis.max = rmax;
                range = axis.max - axis.min;            
        
                var fittedTicks = 0;
                var minorTicks = 0;
                if (axis.numberTicks == null){
                    if (dim > 100) {
                        axis.numberTicks = Math.round(Math.log(axis.max/axis.min)/Math.log(axis.renderer.base) + 1);
                        if (axis.numberTicks < 2) axis.numberTicks = 2;
                        fittedTicks = parseInt(3+(dim-100)/75);
                    }
                    else {
                        axis.numberTicks = 2;
                        fittedTicks = 2;
                    }
                    // if we don't have enough ticks, add some intermediate ticks
                    // how many to have between major ticks.
                    if (axis.numberTicks < fittedTicks-1) {
                        minorTicks = Math.floor(fittedTicks/axis.numberTicks);
                    }
                }

                for (var i=0; i<axis.numberTicks; i++){
                    tt = Math.pow(axis.renderer.base, i - axis.numberTicks + 1) * axis.max;
                    var t = new $.jqplot.AxisTick();
                    var label = axis.tickFormatter(axis.ticks.formatString, tt);
                    t.setTick(tt, label, name);
                    axis._ticks.push(t);
            
                    if (minorTicks && i<axis.numberTicks-1) {
                        var tt1 = Math.pow(axis.renderer.base, i - axis.numberTicks + 2) * axis.max;
                        var spread = tt1 - tt;
                        var interval = tt1 / (minorTicks+1);
                        for (var j=minorTicks-1; j>=0; j--) {
                            var t = new $.jqplot.AxisTick();
                            var val = tt1-interval*(j+1);
                            var label = axis.tickFormatter(axis.ticks.formatString, val, true);
                            t.setTick(val, label, name);
                            axis._ticks.push(t);
                        }
                    }       
                }                    
            }       
        }
        
        if (name == 'yaxis' || name == 'y2axis') this.ticks.styles.reverse();
    };
    
    // functions: pack
    // Define unit <-> coordinate conversions and properly position tick dom elements.
    // Now we know offsets around the grid, we can define conversioning functions.
    // called with scope of axis.
    $.jqplot.logAxisRenderer.prototype.pack = function(offsets, gridwidth, gridheight) {
        var axis = this;
        var lb = parseInt(axis.renderer.base);
        var ticks = axis._ticks;
        var trans = function (v) { return Math.log(v)/Math.log(lb); };
        max = Math.log(axis.max)/Math.log(lb);
        min = Math.log(axis.min)/Math.log(lb);
        
        if (axis.name == 'xaxis' || axis.name == 'x2axis') {
            axis._offsets = {min:offsets.left, max:offsets.right};
            
            axis.p2u = function(p) {
                return (trans(p) - axis._offsets.min)*(axis.max - axis.min)/(axis._canvasWidth - axis._offsets.max - axis._offsets.min) + axis.min;
            }
            
            axis.u2p = function(u) {
                return (trans(u) - axis.min) * (axis._canvasWidth - axis._offsets.max - axis._offsets.min) / (axis.max - axis.min) + axis._offsets.min;
            }
            
            axis.series_u2p = function(u) {
                return (trans(u) - axis.min) * gridwidth / (axis.max - axis.min);
            }
            
            axis.series_p2u = function(p) {
                return trans(p) * (axis.max - axis.min) / gridwidth + axis.min;
            }
            
            if (axis.show) {
                // set the position
                if (axis.name == 'xaxis') {
                    $(axis._elem).css({position:'absolute', left:'0px', top:(axis._canvasHeight-offsets.bottom)+'px'});
                }
                else {
                    $(axis._elem).css({position:'absolute', left:'0px', bottom:(axis._canvasHeight-offsets.top)+'px'});
                }
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    var shim = $(t._elem).outerWidth(true)/2;
                    var val = axis.u2p(t.value) - shim + 'px';
                    $(t._elem).css('left', val);
                    // remember, could have done it this way
                    //tickdivs[i].style.left = val;
                }
            }
        }  
        else {
            axis._offsets = {min:offsets.bottom, max:offsets.top};
            
            axis.p2u = function(p) {
                return (trans(p) - axis._canvasHeight + axis._offsets.min)*(max - min)/(axis._canvasHeight - axis._offsets.min - axis._offsets.max) + min;
            }
            
            axis.u2p = function(u) {
                return -(trans(u) - min) * (axis._canvasHeight - axis._offsets.min - axis._offsets.max) / (max - min) + axis._canvasHeight - axis._offsets.min;
            }
            
            axis.series_u2p = function(u) {
                return (max - trans(u)) * gridheight /(max - min);
            }
            
            axis.series_p2u = function(p) {
                return -trans(p) * (max - min) / gridheight + max;
            }
            
            if (axis.show) {
                // set the position
                if (axis.name == 'yaxis') {
                    $(axis._elem).css({position:'absolute', right:(axis._canvasWidth-offsets.left)+'px', top:'0px'});
                }
                else {
                    $(axis._elem).css({position:'absolute', left:(axis._canvasWidth - offsets.right)+'px', top:'0px'});
                }
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    var shim = $(t._elem).outerHeight(true)/2;
                    var val = axis.u2p(t.value) - shim + 'px';
                    $(t._elem).css('top', val);
                }
            }
        }    
        
    };
})(jQuery);