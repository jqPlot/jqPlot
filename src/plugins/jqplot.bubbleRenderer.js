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
    var arrayMax = function( array ){
        return Math.max.apply( Math, array );
    };
    var arrayMin = function( array ){
        return Math.min.apply( Math, array );
    };

    /**
     * Class: $.jqplot.BubbleRenderer
     * Plugin renderer to draw a bubble chart.  A Bubble chart has data points displayed as
     * colored circles with an optional text label inside.  Data must be supplied in the form:
     * 
     * > [[x1, y1, r1, {options}], [x2, y2, r2, {options}], ...]
     * 
     * The options object is optional and of the form:
     * >   {
     * >     label: 'label',
     * >     color: css color
     * >   }
     * 
     */
    $.jqplot.BubbleRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.BubbleRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.BubbleRenderer.prototype.constructor = $.jqplot.BubbleRenderer;
    
    // called with scope of a series
    $.jqplot.BubbleRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        // prop: varyBubbleColors
        // true to vary the color of each bubble in this series according to
        // the seriesColors array.  False to set each bubble to the color
        // specified on this series.  This has no effect if a css background color
        // option is specified in the renderer css options.
        this.varyBubbleColors = false;
        // prop: autoScaleBubbles
        // True to scale the bubble radius based on plot size.
        // False will use the radius value as provided as a raw pixel value for
        // bubble radius.
        this.autoscaleBubbles = true;
        // prop: autoscaleMultiplier
        // Multiplier applied to the bubble autoscaling factor if autoscaleBubbles is true.
        this.autoscaleMultiplier = 1.0;
        // prop: autoscaleCoefficient
        // Coefficient for the exponent of the autoscaling equation.
        // This how the number of bubbles in the series affects the scale of the bubbles.
        // This should be a negative number.  The smaller the coefficient, the more the bubbles
        // will shrink as more points are added to the series. A value of 0 disables bubble scaling
        // based on number of points in the series.
        this.autoscaleCoefficient = 0;
        // prop: escapeHtml
        // True to escape html in bubble label text.
        this.escapeHtml = true;
        // prop: highlightMouseOver
        // True to highlight bubbles when moused over.
        // This must be false to enable highlightMouseDown to highlight when clicking on a slice.
        this.highlightMouseOver = true;
        // prop: highlightMouseDown
        // True to highlight when a mouse button is pressed over a bubble.
        // This will be disabled if highlightMouseOver is true.
        this.highlightMouseDown = false;
        // prop: highlightColors
        // an array of colors to use when highlighting a slice.
        this.highlightColors = [];
        // prop: bubbleAlpha
        // Alpha transparency to apply to all bubbles in this series.
        this.bubbleAlpha;
        // prop: bubbleGradients
        // True to color the bubbles with gradient fills instead of flat colors.
        this.bubbleGradients = false;
        // array of [point index, radius] which will be sorted in descending order to plot 
        // largest points below smaller points.
        this.radii = [];
        this.maxRadius = 0;
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        // array of jQuery labels.
        this.labels = [];
        this.bubbleCanvases = [];
        
        // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
        if (options.highlightMouseDown && options.highlightMouseOver == null) {
            options.highlightMouseOver = false;
        }
        
        $.extend(true, this, options);
        
        // index of the currenty highlighted point, if any
        this._highlightedPoint = null;
        
        // adjust the series colors for options colors passed in with data or for alpha.
        // note, this can leave undefined holes in the seriesColors array.
        for (var i=0; i<this.data.length; i++) {
            var color = null;
            var d = this.data[i];
            this.maxRadius = Math.max(this.maxRadius, d[2]);
            if (d[3]) {
                if (typeof(d[3]) == 'object') {
                    color = d[3]['color'];
                }
            }
            
            if (color == null) {
                if (this.seriesColors[i] != null) {
                    color = this.seriesColors[i];
                }
            }
            
            if (color && this.bubbleAlpha != null) {
                comps = $.jqplot.getColorComponents(color);
                color = 'rgba('+comps[0]+', '+comps[1]+', '+comps[2]+', '+this.bubbleAlpha+')';
            }
            
            if (color) {
                this.seriesColors[i] = color;
            }
        }
        
        this.colorGenerator = new $.jqplot.ColorGenerator(this.seriesColors);
        
        // set highlight colors if none provided
        if (this.highlightColors.length == 0) {
            for (var i=0; i<this.seriesColors.length; i++){
                var rgba = $.jqplot.getColorComponents(this.seriesColors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                    newrgb[j] = parseInt(newrgb[j], 10);
                }
                this.highlightColors.push('rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+', 0.6)');
            }
        }
        
        this.highlightColorGenerator = new $.jqplot.ColorGenerator(this.highlightColors);
        
        var sopts = {fill:true, isarc:true, angle:this.shadowAngle, alpha:this.shadowAlpha, closePath:true};
        
        this.renderer.shadowRenderer.init(sopts);
        
        this.canvas = new $.jqplot.DivCanvas();
        this.canvas._plotDimensions = this._plotDimensions;
        
        plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
        plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
        plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
        plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
        plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);
        plot.postDrawHooks.addOnce(postPlotDraw);
        
    };
    
    // Need to get the radius values into the grid data so can adjust the 
    // axis min/max accordingly.
    // called with scope of a series, but not necessarily this series, any
    // series in the plot.
    // Note going to work b/c need u2p funciton to do this.
    // function postInit (target, data, seriesDefaults, seriesOptions, plot) {
    //     if (this.renderer.constructor == $.jqplot.BubbleRenderer) {
    //         this.setGridData(plot);
    //     }
    // }
    
    // Method: setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.BubbleRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        this.gridData = [];
        var radii = [];
        this.radii = [];
        var dim = Math.min(plot._height, plot._width);
        for (var i=0; i<this.data.length; i++) {
            if (data[i] != null) {
                this.gridData.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1]), data[i][2]]);
                this.radii.push([i, data[i][2]]);
                radii.push(data[i][2]);
            }
        }
        var r, val, maxr = this.maxRadius = arrayMax(radii);
        var l = this.gridData.length;
        if (this.autoscaleBubbles) {
            for (var i=0; i<l; i++) {
                val = radii[i]/maxr;
                r = this.autoscaleMultiplier * dim / 6 * Math.pow(l*3, this.autoscaleCoefficient);
                this.gridData[i][2] = r * val;
            }
        }
        
        this.radii.sort(function(a, b) { return b[1] - a[1]; });
    };
    
    // Method: makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.BubbleRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gd = [];
        var radii = [];
        this.radii = [];
        var dim = Math.min(plot._height, plot._width);
        for (var i=0; i<data.length; i++) {
            if (data[i] != null) {
                gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1]), data[i][2]]);
                radii.push(data[i][2]);
                this.radii.push([i, data[i][2]]);
            }
        }
        var r, val, maxr = this.maxRadius = arrayMax(radii);
        var l = this.gridData.length;
        if (this.autoscaleBubbles) {
            for (var i=0; i<l; i++) {
                val = radii[i]/maxr;
                r = this.autoscaleMultiplier * dim / 6 * Math.pow(l*3, this.autoscaleCoefficient);
                gd[i][2] = r * val;
            }
        }
        this.radii.sort(function(a, b) { return b[1] - a[1]; });
        return gd;
    };
    
    // called with scope of series
    $.jqplot.BubbleRenderer.prototype.draw = function (ctx, gd, options) {
        if (this.plugins.pointLabels) {
            this.plugins.pointLabels.show = false;
        }
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var colorGenerator = (this.varyBubbleColors && this.seriesColors.length) ? new $.jqplot.ColorGenerator(this.seriesColors) : null;
        this.canvas._elem.empty();
        for (var i=0; i<this.radii.length; i++) {
            var idx = this.radii[i][0];
            var t=null;
            var color = null;
            var el = tel = null;
            var d = this.data[idx];
            var gd = this.gridData[idx];
            if (d[3]) {
                if (typeof(d[3]) == 'object') {
                    t = d[3]['label'];
                }
                else if (typeof(d[3]) == 'string') {
                    t = d[3];
                }
            }
            
            color = this.colorGenerator.get(idx);
            
            // If we're drawing a shadow, expand the canvas dimensions to accomodate.
            var canvasRadius = gd[2];
            var offset, depth;
            if (this.shadow) {
                offset = (0.7 + gd[2]/40).toFixed(1);
                depth = 1 + Math.ceil(gd[2]/15);
                canvasRadius += offset*depth;
            }
            this.bubbleCanvases[idx] = el = new $.jqplot.BubbleCanvas(gd[0], gd[1], canvasRadius);
            var ctx = el._ctx;
            var x = ctx.canvas.width/2;
            var y = ctx.canvas.height/2;
            if (this.shadow) {
                this.renderer.shadowRenderer.draw(ctx, [x, y, gd[2], 0, 2*Math.PI], {offset: offset, depth: depth});
            }
            el.draw(gd[2], color, this.bubbleGradients, this.shadowAngle/180*Math.PI);
            this.canvas._elem.append(el._elem);
            
            // now draw label.
            if (t) {
                tel = $('<div style="position:absolute;" class="jqplot-bubble-label"></div>');
                if (this.escapeHtml) {
                    tel.text(t);
                }
                else {
                    tel.html(t);
                }
                this.canvas._elem.append(tel);
                var h = $(tel).outerHeight();
                var w = $(tel).outerWidth();
                var top = gd[1] - 0.5*h;
                var left = gd[0] - 0.5*w;
                tel.css({top: top, left: left});
                this.labels[idx] = $(tel);
            }
        }
    };

    
    $.jqplot.DivCanvas = function() {
        $.jqplot.ElemContainer.call(this);
        this._ctx;  
    };
    
    $.jqplot.DivCanvas.prototype = new $.jqplot.ElemContainer();
    $.jqplot.DivCanvas.prototype.constructor = $.jqplot.DivCanvas;
    
    $.jqplot.DivCanvas.prototype.createElement = function(offsets, clss, plotDimensions) {
        this._offsets = offsets;
        var klass = 'jqplot-DivCanvas';
        if (clss != undefined) {
            klass = clss;
        }
        var elem;
        // if this canvas already has a dom element, don't make a new one.
        if (this._elem) {
            elem = this._elem.get(0);
        }
        else {
            elem = document.createElement('div');
        }
        // if new plotDimensions supplied, use them.
        if (plotDimensions != undefined) {
            this._plotDimensions = plotDimensions;
        }
        
        var w = this._plotDimensions.width - this._offsets.left - this._offsets.right + 'px';
        var h = this._plotDimensions.height - this._offsets.top - this._offsets.bottom + 'px';
        this._elem = $(elem);
        this._elem.css({ position: 'absolute', width:w, height:h, left: this._offsets.left, top: this._offsets.top });
        
        this._elem.addClass(klass);
        return this._elem;
    };
    
    $.jqplot.DivCanvas.prototype.setContext = function() {
        this._ctx = {
            canvas:{
                width:0,
                height:0
            },
            clearRect:function(){return null;}
        };
        return this._ctx;
    };
    
    $.jqplot.BubbleCanvas = function(x, y, r, rr, color) {
        $.jqplot.ElemContainer.call(this);
        this._ctx;
        var el;
        if (x != null && y != null && r != null) {
            el = this.createElement(x, y, r);
            if (!this._ctx) this._ctx = this.setContext();
        }
    };
    
    $.jqplot.BubbleCanvas.prototype = new $.jqplot.ElemContainer();
    $.jqplot.BubbleCanvas.prototype.constructor = $.jqplot.BubbleCanvas;
    
    // initialize with the x,y pont of bubble center and the bubble radius.
    $.jqplot.BubbleCanvas.prototype.createElement = function(x, y, r) {     
        var klass = 'jqplot-bubble-point';

        var elem;
        // if this canvas already has a dom element, don't make a new one.
        if (this._elem) {
            elem = this._elem.get(0);
        }
        else {
            elem = document.createElement('canvas');
        }
        
        elem.width = (r != null) ? 2*r : elem.width;
        elem.height = (r != null) ? 2*r : elem.height;
        this._elem = $(elem);
        var l = (x != null && r != null) ? x - r : this._elem.css('left');
        var t = (y != null && r != null) ? y - r : this._elem.css('top');
        this._elem.css({ position: 'absolute', left: l, top: t });
        
        this._elem.addClass(klass);
        if ($.browser.msie) {
            window.G_vmlCanvasManager.init_(document);
            elem = window.G_vmlCanvasManager.initElement(elem);
        }
        
        return this._elem;
    };
    
    $.jqplot.BubbleCanvas.prototype.draw = function(r, color, gradients, angle) {
        var ctx = this._ctx;
        // r = Math.floor(r*1.04);
        // var x = Math.round(ctx.canvas.width/2);
        // var y = Math.round(ctx.canvas.height/2);
        var x = ctx.canvas.width/2;
        var y = ctx.canvas.height/2;
        ctx.save();
        if (gradients) {
            r = r*1.04;
            var comps = $.jqplot.getColorComponents(color);
            var colorinner = 'rgba('+Math.round(comps[0]+0.8*(255-comps[0]))+', '+Math.round(comps[1]+0.8*(255-comps[1]))+', '+Math.round(comps[2]+0.8*(255-comps[2]))+', '+comps[3]+')';
            var colorend = 'rgba('+comps[0]+', '+comps[1]+', '+comps[2]+', 0)';
            // var rinner = Math.round(0.35 * r);
            // var xinner = Math.round(x - Math.cos(angle) * 0.33 * r);
            // var yinner = Math.round(y - Math.sin(angle) * 0.33 * r);
            var rinner = 0.35 * r;
            var xinner = x - Math.cos(angle) * 0.33 * r;
            var yinner = y - Math.sin(angle) * 0.33 * r;
            var radgrad = ctx.createRadialGradient(xinner, yinner, rinner, x, y, r);
            radgrad.addColorStop(0, colorinner);
            radgrad.addColorStop(0.93, color);
            radgrad.addColorStop(0.96, 'rgba(0, 0, 0, 0)');
            radgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            // radgrad.addColorStop(.98, colorend);
            ctx.fillStyle = radgrad;
            ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
        }
        else {
            ctx.fillStyle = color;
            ctx.beginPath();
            var ang = 2*Math.PI
            ctx.arc(x, y, r, 0, ang, true);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    };
    
    $.jqplot.BubbleCanvas.prototype.setContext = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        return this._ctx;
    };
    
    $.jqplot.BubbleAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.BubbleAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.BubbleAxisRenderer.prototype.constructor = $.jqplot.BubbleAxisRenderer;
        
    // called with scope of axis object.
    $.jqplot.BubbleAxisRenderer.prototype.init = function(options){
        $.extend(true, this, options);
        var db = this._dataBounds;
        var minsidx=minpidx=maxsids=maxpidx=maxr=minr=minMaxRadius=maxMaxRadius=maxMult=minMult=0;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s._plotData;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[j][0] < db.min || db.min == null) {
                        db.min = d[j][0];
                        minsidx=i;
                        minpidx=j;
                        minr = d[j][2];
                        minMaxRadius = s.maxRadius;
                        minMult = s.autoscaleMultiplier;
                    }
                    if (d[j][0] > db.max || db.max == null) {
                        db.max = d[j][0];
                        maxsidx=i;
                        maxpidx=j;
                        maxr = d[j][2];
                        maxMaxRadius = s.maxRadius;
                        maxMult = s.autoscaleMultiplier;
                    }
                }              
                else {
                    if (d[j][1] < db.min || db.min == null) {
                        db.min = d[j][1];
                        minsidx=i;
                        minpidx=j;
                        minr = d[j][2];
                        minMaxRadius = s.maxRadius;
                        minMult = s.autoscaleMultiplier;
                    }
                    if (d[j][1] > db.max || db.max == null) {
                        db.max = d[j][1];
                        maxsidx=i;
                        maxpidx=j;
                        maxr = d[j][2];
                        maxMaxRadius = s.maxRadius;
                        maxMult = s.autoscaleMultiplier;
                    }
                }              
            }
        }
        
        var minRatio = minr/minMaxRadius;
        var maxRatio = maxr/maxMaxRadius;
        
        // need to estimate the effect of the radius on total axis span and adjust axis accordingly.
        var span = db.max - db.min;
        // var dim = (this.name == 'xaxis' || this.name == 'x2axis') ? this._plotDimensions.width : this._plotDimensions.height;
        var dim = Math.min(this._plotDimensions.width, this._plotDimensions.height);
        
        var minfact = minRatio * minMult/4 * span;
        var maxfact = maxRatio * maxMult/4 * span;
        db.max += maxfact;
        db.min -= minfact;
    };
    
    function highlight (plot, sidx, pidx) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.bubbleRenderer.highlightCanvas;
        var ctx = canvas._ctx;
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.bubbleRenderer.highlightedSeriesIndex = sidx;
        
        var color = s.highlightColorGenerator.get(pidx);
        var x = s.gridData[pidx][0],
            y = s.gridData[pidx][1],
            r = s.gridData[pidx][2];
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();        
        // bring label to front
        if (s.labels[pidx]) {
            plot.plugins.bubbleRenderer.highlightLabel = s.labels[pidx].clone();
            plot.plugins.bubbleRenderer.highlightCanvas._elem.after(plot.plugins.bubbleRenderer.highlightLabel);
        }
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.bubbleRenderer.highlightCanvas;
        var sidx = plot.plugins.bubbleRenderer.highlightedSeriesIndex;
        if (plot.plugins.bubbleRenderer.highlightLabel != null) {
            plot.plugins.bubbleRenderer.highlightLabel.remove();
            plot.plugins.bubbleRenderer.highlightLabel = null;
        }
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.bubbleRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
    }
    
 
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.bubbleRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    } 
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.bubbleRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, ins[0], ins[1]);
            }
        }
        else if (neighbor == null) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.bubbleRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt = jQuery.Event('jqplotDataClick');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var idx = plot.plugins.bubbleRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        this.plugins.bubbleRenderer = {highlightedSeriesIndex:null};
        this.plugins.bubbleRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        this.plugins.bubbleRenderer.highlightLabel = null;
        this.plugins.bubbleRenderer.highlightLabelCanvas = $('<div style="position:absolute;"></div>');
        var top = this._gridPadding.top;
        var left = this._gridPadding.left;
        var width = this._plotDimensions.width - this._gridPadding.left - this._gridPadding.right;
            var height = this._plotDimensions.height - this._gridPadding.top - this._gridPadding.bottom;

        this.eventCanvas._elem.before(this.plugins.bubbleRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-bubbleRenderer-highlight-canvas', this._plotDimensions));
        
        var hctx = this.plugins.bubbleRenderer.highlightCanvas.setContext();
    }

    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.seriesDefaults = options.seriesDefaults || {};
        // only set these if there is a Bubble series
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.BubbleRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.BubbleRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.BubbleAxisRenderer;
        }
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
})(jQuery);
    
    