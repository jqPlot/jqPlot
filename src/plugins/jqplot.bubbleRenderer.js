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
    $.jqplot.BubbleRenderer.prototype.init = function(options) {
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
        $.extend(true, this, options);
        this.canvas = new $.jqplot.DivCanvas();
        this.canvas._plotDimensions = this._plotDimensions;
    };
    
    // Method: setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.BubbleRenderer.prototype.setGridData = function(plot) {
        console.log('in setGridData');
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
            }
        }
        var r, val, maxr = arrayMax(radii);
        var l = this.gridData.length;
        console.log('radii: ', radii, 'maxr: ', maxr);
        if (this.autoscaleBubbles) {
            for (var i=0; i<l; i++) {
                val = radii[i]/maxr;
                r = Math.min(plot._height, plot._width);
                r = this.autoscaleFactor * r/ 3 / Math.pow(l, 0.5);
                console.log('val: %s, r: %s', val, r);
                this.gridData[i][2] = r * val;
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
        console.log('in draw');
        if (this.plugins.pointLabels) {
            this.plugins.pointLabels.show = false;
        }
        var i, el, d, gd, t, color;
        var opts = (options != undefined) ? options : {};
        var colorGenerator = (this.varyBubbleColors && this.seriesColors.length) ? new $.jqplot.ColorGenerator(this.seriesColors) : null;
        console.log('color generator: ', colorGenerator);
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
            console.log(color);
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
    
})(jQuery);
    
    