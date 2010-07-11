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
        // prop: autoscaleFactor
        // Scaling factor applied if autoscaleBubbles is true to make the bubbles smaller or larger.
        this.autoscaleFactor = 1.0;
        this.pointDimensions = [];
        $.extend(true, this, options);
        this.canvas = new $.jqplot.DivCanvas();
        this.canvas._plotDimensions = this._plotDimensions;
        
        // plot.postSeriesInitHooks.addOnce(postInit);
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
        for (var i=0; i<this.data.length; i++) {
            if (data[i] != null) {
                this.gridData.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1]), data[i][2]]);
                radii.push(data[i][2]);
                this.pointDimensions.push([[this.gridData[i][0] - this.gridData[i][2], this.gridData[i][1] - this.gridData[i][2]], [this.gridData[i][0] + this.gridData[i][2], this.gridData[i][1] + this.gridData[i][2]]]);
            }
        }
        var r, val, maxr = arrayMax(radii);
        var l = this.gridData.length;
        if (this.autoscaleBubbles) {
            for (var i=0; i<l; i++) {
                val = radii[i]/maxr;
                r = Math.min(plot._height, plot._width);
                r = this.autoscaleFactor * r/ 3 / Math.pow(l, 0.5);
                this.gridData[i][2] = r * val;
                this.pointDimensions[i] = [[this.gridData[i][0] - this.gridData[i][2], this.gridData[i][1] - this.gridData[i][2]], [this.gridData[i][0] + this.gridData[i][2], this.gridData[i][1] + this.gridData[i][2]]];
            }
        }
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
        for (var i=0; i<data.length; i++) {
            if (data[i] != null) {
                gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1]), data[i][2]]);
                radii.push(data[i][2]);
            }
        }
        var r, val, maxr = arrayMax(radii);
        var l = this.gridData.length;
        if (this.autoscaleBubbles) {
            for (var i=0; i<l; i++) {
                val = radii[i]/maxr;
                r = Math.min(plot._height, plot._width);
                r = this.autoscaleFactor * r/ 3 / Math.pow(l, 0.5);
                gd[i][2] = r * val;
            }
        }
        return gd;
    };
    
    // called with scope of series
    $.jqplot.BubbleRenderer.prototype.draw = function (ctx, gd, options) {
        if (this.plugins.pointLabels) {
            this.plugins.pointLabels.show = false;
        }
        var i, el, d, gd, t, color;
        var opts = (options != undefined) ? options : {};
        var colorGenerator = (this.varyBubbleColors && this.seriesColors.length) ? new $.jqplot.ColorGenerator(this.seriesColors) : null;
        this.canvas._elem.empty();
        for (i=0; i<this.gridData.length; i++) {
            d = this.data[i];
            gd = this.gridData[i];
            if (d[3] && typeof(d[3]) == 'object') {
                t = d[3]['label'];
                color = d[3]['color'];
            }
            
            if (color == null) {
                if (colorGenerator != null) {
                    color = colorGenerator.next();
                }
                else {
                    color = this.color;
                }
            }
            el = new $.jqplot.BubbleCanvas(gd[0], gd[1], gd[2], color);
            this.canvas._elem.append(el);
            
            el = null;
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
    
    $.jqplot.BubbleCanvas = function(x, y, r, color) {
        $.jqplot.ElemContainer.call(this);
        this._ctx;
        var el;
        if (x != null && y != null && r != null) {
            el = this.createElement(x, y, r);
            if (!this._ctx) this._ctx = this.setContext();
        }
        if (color != null) {
            if (!this._ctx) this._ctx = this.setContext();
            this.draw(r, color);
        }
        return el;
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
    
    $.jqplot.BubbleCanvas.prototype.draw = function(r, color) {
        var ctx = this._ctx;
        var x = ctx.canvas.width/2;
        var y = ctx.canvas.height/2;
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
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
        var minsidx=minpidx=maxsids=maxpidx=0;
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
                    }
                    if (d[j][0] > db.max || db.max == null) {
                        db.max = d[j][0];
                        maxsidx=i;
                        maxpidx=j;
                    }
                }              
                else {
                    if (d[j][1] < db.min || db.min == null) {
                        db.min = d[j][1];
                        minsidx=i;
                        minpidx=j;
                    }
                    if (d[j][1] > db.max || db.max == null) {
                        db.max = d[j][1];
                        maxsidx=i;
                        maxpidx=j;
                    }
                }              
            }
        }
        
        // need to estimate the effect of the radius on total axis span and adjust axis accordingly.
        var span = db.max - db.min;
        var dim = (this.name == 'xaxis' || this.name == 'x2axis') ? this._plotDimensions.width : this._plotDimensions.height;
        var adjust = [];
        // var fact = Math.pow(dim, 0.6)/20;
        var fact = 50/Math.sqrt(dim/10);
        var fact = 0.2 * Math.pow(dim, 0.2);
        var fact = .001;
        var fact = 1.3*Math.pow(Math.E, -.002928*dim);

        for (var i=0; i<this._series.length; i++) {
            adjust.push([]);
            var ad = adjust[i];
            var s = this._series[i];
            var d = [];
            var data = s._plotData;
            var radii = [];
            for (var i=0; i<s.data.length; i++) {
                if (data[i] != null) {
                    radii.push(data[i][2]);
                    ad.push(data[i][2]/dim * span);
                }
            }
            if (s.autoscaleBubbles) {
                var r, val, maxr = arrayMax(radii);
                var l = s.data.length;
                for (var j=0; j<l; j++) {
                        
                // val = radii[i]/maxr;
                // r = Math.min(plot._height, plot._width);
                // r = this.autoscaleFactor * r/ 3 / Math.pow(l, 0.5);
                // this.gridData[i][2] = r * val;
                    
                    
                    val = radii[j]/maxr;
                    ad[j] = s.autoscaleFactor / Math.sqrt(l) * val * span * fact;
                }
            }
        }
        
        
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s._plotData;
            var ad = adjust[i];
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[j][0] - ad[j] < db.min) {
                        db.min = d[j][0] -  ad[j];
                    }
                    if (d[j][0] + ad[j] > db.max) {
                        db.max = d[j][0] + ad[j];
                    }
                }              
                else {
                    if (d[j][1] - ad[j] < db.min) {
                        db.min = d[j][1] - ad[j];
                    }
                    if (d[j][1] + ad[j]> db.max) {
                        db.max = d[j][1] + ad[j];
                    }
                }              
            }
        }
    };
    
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
    
    