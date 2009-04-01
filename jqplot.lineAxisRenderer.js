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
        var ticks = this.ticks;
        if (ticks.values.length) {
            if (!ticks.labels.length) {
                for (var i=0; i<ticks.values.length; i++) {
                    ticks.labels[i] = ticks.values[i].toString();
                }
            }
        }
        this._canvasHeight = plotHeight;
        this._canvasWidth = plotWidth;
        this.renderer.fill.call(this);
    };
    
    $.jqplot.lineAxisRenderer.prototype.fill = function() {
        var name = this.name;
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt;
        if (this.ticks.values.length) {
            var v = this.ticks.values;
            this.numberTicks = v.length;
            this.min = v[0];
            this.max = v[this.numberTicks-1];
            this.tickInterval = (this.max - this.min) / (this.numberTicks - 1);
            for (var i=0; i<this.numberTicks; i++) {
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

            function fillLog() {
                if (this.logStyle == 'even') {                    
                    // for log axes, open up range to get a nice power of this.logBase.
                    rmin = min - min*((this.pad-1)/2);
                    rmax = max + max*((this.pad-1)/2);
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
        
                    var u = Math.pow(this.logBase, (1/(this.numberTicks-1)*Math.log(this.max/this.min)/Math.log(this.logBase)));
                    for (var i=0; i<this.numberTicks; i++){
                        tt = this.min * Math.pow(u, i);
                        fillTick.call(this, tt);
                
                    }
                    
                }
                
                else {
                    
                    // for log axes, open up range to get a nice power of this.logBase.
                    rmin = Math.pow(this.logBase, Math.ceil(Math.log(min*(2-this.pad))/Math.log(this.logBase))-1);
                    rmax = Math.pow(this.logBase, Math.floor(Math.log(max*this.pad)/Math.log(this.logBase))+1);
                    this.min = rmin;
                    this.max = rmax;
                    range = this.max - this.min;            
            
                    var fittedTicks = 0;
                    var minorTicks = 0;
                    if (this.numberTicks == null){
                        if (dim > 100) {
                            this.numberTicks = Math.round(Math.log(this.max/this.min)/Math.log(this.logBase) + 1);
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
                            minorTicks = 1 + Math.floor(fittedTicks/this.numberTicks);
                        }
                    }

                    for (var i=0; i<this.numberTicks; i++){
                        tt = Math.pow(this.logBase, i - this.numberTicks + 1) * this.max;

                        fillTick.call(this, tt);
                
                        if (minorTicks) {
                            var tt1 = Math.pow(this.logBase, i - this.numberTicks + 2) * this.max;
                            var spread = tt1 - tt;
                            var interval = spread / (minorTicks+1);
                            for (var j=0; j<minorTicks; j++) {
                                fillTick.call(this, tt+interval*(j+1));
                            }
                        }       
                    }                    
                }
            
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
        
            };
        
            function fillLinear() {
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
            };
            if (this.type == 'log' || this.type == 'logarithmic') fillLog.call(this);
            else fillLinear.call(this);
        }
        
        if (name == 'yaxis' || name == 'y2axis') this.ticks.styles.reverse();
    };
    
    // Now we know offsets around the grid, we can define conversioning functions
    // and properly lay out the axes.
    $.jqplot.lineAxisRenderer.prototype.pack = function(offsets, gridwidth, gridheight) {
        var lb = parseInt(this.logBase);
        var ticks = this.ticks;
        var tickdivs = $(this._elem).children('div');
        // linear or log axis.  All it changes is the transformation functions from units to coordinates
        var trans = function(v) { return v };
        var logtrans = function (v) { return Math.log(v)/Math.log(lb); };
        var max = this.max;
        var min = this.min;
        if (this.type == 'log' || this.type == 'logarithmic') {
            trans = logtrans;
            max = Math.log(this.max)/Math.log(this.logBase);
            min = Math.log(this.min)/Math.log(this.logBase);
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