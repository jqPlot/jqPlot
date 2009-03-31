(function($) {
    var debug = 1;
        
	// Convienence function that won't hang IE.
	function log() {
	    if (window.console && debug) {
	       if (arguments.length == 1) console.log (arguments[0]);
	       else console.log(arguments);
	    }
	};
	
    $.jqplot.lineAxisRenderer = function() {
    };
    
    
    // called with scope of axis
    $.jqplot.lineAxisRenderer.prototype.draw = function(target, plotHeight, plotWidth) {
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
                for (var i=0; i<axis.ticks.labels.length; i++) {
                    var elem = $('<div class="jqplot-axis-tick"></div>').appendTo(axis._elem).get(0);
                    
                    for (var s in axis.ticks.styles[i]) $(elem).css(s, axis.ticks.styles[i][s]);
                    $(elem).html(axis.ticks.labels[i]);
                    
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
    };
    
    // called with scope of an axis
    // Populate the axis properties, giving a label and value
    // (corresponding to the user data coordinates, not plot coords.)
    // for each tick on the axis.
    $.jqplot.lineAxisRenderer.prototype.setAxis = function(plotHeight, plotWidth) {
        // if a ticks array is specified, use it to fill in
        // the labels and values.
        var axis = this;
        axis._canvasHeight = plotHeight;
        axis._canvasWidth = plotWidth;
        var db = axis._dataBounds;
        if (axis.ticks && axis.ticks.constructor == Array) {
            var temp = $.extend(true, [], axis.ticks);
            // if 2-D array, match them up
            if (temp[0].lenth) {
                for (var i=0; i< temp; i++) {
                    var t = new AxisTick();
                    axis._ticks.push($.extend(true, t, {label:temp[i][1].toString(), value:temp[i][0]}));
                    axis.ticks.labels.push(temp[i][1].toString());
                    axis.ticks.values.push(parseFloat(temp[i][0]));
                }
            }
            // else 1-D array
            else {
                for (var i=0; i< temp; i++) {
                    var t = new AxisTick();
                    if (typeof(temp[i]) == 'number') axis._ticks.push($.extend(true, t, {label:temp[i].toString(), value:temp[i]}));
                    else  axis._ticks.push($.extend(true, t, {label:temp[i].toString(), value:i+1}));
                    if (typeof(temp[i]) == 'number') {
                        axis.ticks.labels.push(temp[i].toString());
                        axis.ticks.values.push(parseFloat(temp[i]));
                    }
                    else {
                        axis.ticks.labels.push(temp[i].toString());
                        axis.ticks.values.push(i+1);
                    }
                }
            }
        }
        // else call the axis renderer and fill in the labels
        // and values from there.
        else axis.renderer.fill.call(axis);
    };
    
    $.jqplot.lineAxisRenderer.prototype.fill = function() {
        var name = this.name;
        log('render axis ', name);
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt;
        if (name == 'xaxis' || name == 'x2axis') {
            dim = this._canvasWidth;
        }
        else {
            dim = this._canvasHeight;
        }
        
        min = ((this.min != null) ? this.min : db.min);
        max = ((this.max != null) ? this.max : db.max);
        var range = max - min;
        var rmin, rmax;
        log('min and max: ', min, max);
        log('type of axis: ', this.type);

        if (this.type == 'log' || this.type == 'logarithmic') {
            // for log axes, open up range to get a nice power of 10.
            rmin = Math.pow(10, Math.ceil(Math.log(min*(2-this.pad))/Math.LN10)-1);
            rmax = Math.pow(10, Math.floor(Math.log(max*this.pad)/Math.LN10)+1);
            // rmin = min - min*((this.pad-1)/2);
            // if (rmin <= 0) rmin = .01;
            // rmax = max + max*((this.pad-1)/2);
            log('rmin and rmax, ', rmin, rmax);
            this.min = rmin;
            this.max = rmax;
            range = this.max - this.min;
            var fittedTicks = 0;
            var minorTicks = 0;
            if (this.numberTicks == null){
                if (dim > 100) {
                    this.numberTicks = Math.log(this.max/this.min)/Math.LN10 + 1;
                    //this.numberTicks = Math.ceil(Math.log(range)/Math.LN10 + 1);
                    if (this.numberTicks < 2) this.numberTicks = 2;
                    fittedTicks = parseInt(3+(dim-100)/75);
                }
                else {
                    this.numberTicks = 2;
                    fittedTicks = 2;
                }
                // if we don't have enough ticks, add some minor ticks
                // how many to have between major ticks.
                if (this.numberTicks < fittedTicks-1) {
                    minorTicks = 1 + Math.floor(fittedTicks/this.numberTicks);
                }
            }
            log('numberticks, fittedticks: ', this.numberticks, fittedTicks);
            
            function fillTick(tt) {
                this.ticks.labels.push(this.tickFormatter(this.ticks.formatString, tt));
                this.ticks.values.push(tt);
                var pox = i*15+'px';
                switch (name) {
                    case 'xaxis':
                        this.ticks.styles.push({position:'absolute', top:'0px', left:pox, paddingTop:'10px'});
                        break;
                    case 'x2axis':
                        this.ticks.styles.push({position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'});
                        break;
                    case 'yaxis':
                        this.ticks.styles.push({position:'absolute', right:'0px', top:pox, paddingRight:'10px'});
                        break;
                    case 'y2axis':
                        this.ticks.styles.push({position:'absolute', left:'0px', top:pox, paddingLeft:'10px'});
                        break;
                }
            };
        
            log('number of ticks ', this.numberTicks);
            this.tickInterval = range / (this.numberTicks-1);
            for (var i=0; i<this.numberTicks; i++){
                // if (i == 0) tt = this.min;
                // else tt = Math.pow(10, i - this.numberTicks + 1) * this.max;
                tt = Math.pow(10, i - this.numberTicks + 1) * this.max
                
                // tt = this.min + i * range / (this.numberTicks-1);
                log('tick value ', tt);
                fillTick.call(this, tt);
                
                if (minorTicks) {
                    var tt1 = Math.pow(10, i - this.numberTicks + 2) * this.max;
                    var spread = tt1 - tt;
                    var interval = spread / (minorTicks+1);
                    for (var j=0; j<minorTicks; j++) {
                        fillTick.call(this, tt+interval*(j+1));
                    }
                }       
            }
        }
        
        else {
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
                this.ticks.labels.push(this.tickFormatter(this.ticks.formatString, tt));
                this.ticks.values.push(tt);
                var pox = i*15+'px';
                switch (name) {
                    case 'xaxis':
                        this.ticks.styles.push({position:'absolute', top:'0px', left:pox, paddingTop:'10px'});
                        break;
                    case 'x2axis':
                        this.ticks.styles.push({position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'});
                        break;
                    case 'yaxis':
                        this.ticks.styles.push({position:'absolute', right:'0px', top:pox, paddingRight:'10px'});
                        break;
                    case 'y2axis':
                        this.ticks.styles.push({position:'absolute', left:'0px', top:pox, paddingLeft:'10px'});
                        break;
                    
                }
            }
        }
        if (name == 'yaxis' || name == 'y2axis') this.ticks.styles.reverse();
    };
    
    // Now we know offsets around the grid, we can define conversioning functions
    // and properly lay out the axes.
    $.jqplot.lineAxisRenderer.prototype.pack = function(offsets, gridwidth, gridheight) {
        var ticks = this.ticks;
        var tickdivs = $(this._elem).children('div');
        // linear or log axis.  All it changes is the transformation functions from units to coordinates
        var trans = function(v) { return v };
        var logtrans = function (v) { return Math.log(v)/Math.LN10; };
        var max = this.max;
        var min = this.min;
        if (this.type == 'log' || this.type == 'logarithmic') {
            // trans = logtrans;
            // max = Math.log(this.max)/Math.LN10;
            // min = Math.log(this.min)/Math.LN10;
            trans = Math.log;
            max = Math.log(this.max);
            min = Math.log(this.min);
        }
        
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
                for (i=0; i<tickdivs.length; i++) {
                    var shim = $(tickdivs[i]).outerWidth(true)/2;
                    //var t = this.u2p(ticks.values[i]);
                    var val = this.u2p(ticks.values[i]) - shim + 'px';
                    $(tickdivs[i]).css('left', val);
                    // remember, could have done it this way
                    //tickdivs[i].style.left = val;
                }
            }
        }  
        else {
            this._offsets = {min:offsets.bottom, max:offsets.top};
            
            this.p2u = function(p) {
                return (trans(p) - this._canvasHeight + this._offsets.min)*(max - min)/(this._canvasHeight - this._offsets.min - this._offsets.max) + min;
            }
            
            this.u2p = function(u) {
                return -(trans(u) - min) * (this._canvasHeight - this._offsets.min - this._offsets.max) / (max - min) + this._canvasHeight - this._offsets.min;
            }
            
            this.series_u2p = function(u) {
                return (max - trans(u)) * gridheight /(max - min);
            }
            
            this.series_p2u = function(p) {
                return -trans(p) * (max - min) / gridheight + max;
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
                    var shim = $(tickdivs[i]).outerHeight(true)/2;
                    var val = this.u2p(ticks.values[i]) - shim + 'px';
                    $(tickdivs[i]).css('top', val);
                }
            }
        }    
        
    };
})(jQuery);