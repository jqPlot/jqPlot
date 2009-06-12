/**
 * Copyright (c) 2009 Chris Leonello
 * This software is licensed under the GPL version 2.0 and MIT licenses.
 */
(function($) {
    /**
     * Class: $.jqplot.PieRenderer
     * Plugin renderer to draw a pie chart.
     * Pie charts will draw only the first series.  Other series are ignored.
     * x values, if present, will be used as slice labels.
     * y values give slice size.
     * slice labels can also be supplied through a ticks array, and will
     * override the x values of the data series.
     */
    $.jqplot.PieRenderer = function(){
        $.jqplot.LineRenderer.call(this);
    };
    
    $.jqplot.PieRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.PieRenderer.prototype.constructor = $.jqplot.PieRenderer;
    
    // called with scope of a series
    $.jqplot.PieRenderer.prototype.init = function(options) {
        // auto computed
        this.diameter;
        this.padding = 20;
        this.sliceMargin = 0;
        this.fill = true;
        this.shadowOffset = 2;
        this.shadowAlpha = .07;
        this.shadowDepth = 5;
        $.extend(true, this, options);
    };
    
    $.jqplot.PieRenderer.prototype.setGridData = function() {
        // this is a no-op
    };
    
    $.jqplot.PieRenderer.prototype.makeGridData = function(data) {
        var stack = [];
        var td = [];
        for (var i=0; i<data.length; i++){
            stack.push(data[i][1]);
            td.push([data[i][0]]);
            if (i>0) {
                stack[i] += stack[i-1];
            }
        }
        var fact = Math.PI*2/stack[stack.length - 1];
        
        for (var i=0; i<stack.length; i++) {
            td[i][1] = stack[i] * fact;
        }
        return td;
    };
    
    $.jqplot.PieRenderer.prototype.drawSlice = function (ctx, ang1, ang2, color, isShadow) {
        var r = this.diameter / 2;
        var fill = this.fill;
        ctx.save();

        ctx.translate(this.sliceMargin*Math.cos((ang1+ang2)/2), this.sliceMargin*Math.sin((ang1+ang2)/2));
        if (isShadow) {
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.save();
                ctx.translate(this.shadowOffset*Math.cos(this.shadowAngle/180*Math.PI), this.shadowOffset*Math.sin(this.shadowAngle/180*Math.PI));
                doDraw();
            }
        }
        
        else {
            doDraw();
        }
        
        function doDraw () {
            ctx.beginPath();  
            ctx.moveTo(0, 0);
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.arc(0, 0, r, ang1, ang2, false);
            ctx.closePath();
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
        
        if (isShadow) {
            for (var i=0; i<this.shadowDepth; i++) {
                ctx.restore();
            }
        }
        
        ctx.restore();        
    }
    
    // called with scope of series
    $.jqplot.PieRenderer.prototype.draw = function (ctx, gd, options) {
        var i;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;
        var d = Math.min(w,h);
        this.diameter = this.diameter || (d - 2 * this.padding);
        var r = this.diameter/2;
        ctx.save();
    
        ctx.translate(w/2, h/2);
        
        if (this.shadow) {
            var shadowColor = 'rgba(0,0,0,'+this.shadowAlpha+')';
            for (var i=0; i<gd.length; i++) {
                var ang1 = (i == 0) ? 0 : gd[i-1][1];
                this.renderer.drawSlice.call (this, ctx, ang1, gd[i][1], shadowColor, true);
            }
            
        }
        for (var i=0; i<gd.length; i++) {
            var ang1 = (i == 0) ? 0 : gd[i-1][1];
            this.renderer.drawSlice.call (this, ctx, ang1, gd[i][1], this.getNextSeriesColor());
        }
        // shadows
        // markers
        
        ctx.restore();        
    };
    
    $.jqplot.PieAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
    };
    
    $.jqplot.PieAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.PieAxisRenderer.prototype.constructor = $.jqplot.PieAxisRenderer;
        
    
    // There are no traditional axes on a pie chart.  We just need to provide
    // dummy objects with properties so the plot will render.
    // called with scope of axis object.
    $.jqplot.PieAxisRenderer.prototype.init = function(options){
        //
        this.tickRenderer = $.jqplot.PieTickRenderer;
        $.extend(true, this, options);
        // I don't think I'm going to need _dataBounds here.
        // have to go Axis scaling in a way to fit chart onto plot area
        // and provide u2p and p2u functionality for mouse cursor, etc.
        // for convienence set _dataBounds to 0 and 100 and
        // set min/max to 0 and 100.
        this._dataBounds = {min:0, max:100};
        this.min = 0;
        this.max = 100;
        this.showTicks = false;
        this.ticks = [];
        this.showMark = false;
        this.show = false;  
    };
    
    
    $.jqplot.PieTickRenderer = function() {
        $.jqplot.AxisTickRenderer.call(this);
    };
    
    $.jqplot.PieTickRenderer.prototype = new $.jqplot.AxisTickRenderer();
    $.jqplot.PieTickRenderer.prototype.constructor = $.jqplot.PieTickRenderer;
    
    $.jqplot.PieLegendRenderer = function() {
        $.jqplot.TableLegendRenderer.call(this);
        this.show = false;
    };
    
    $.jqplot.PieLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.PieLegendRenderer.prototype.constructor = $.jqplot.PieLegendRenderer;
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.axesDefaults.renderer = $.jqplot.PieAxisRenderer;
        options.legend.renderer = $.jqplot.PieLegendRenderer;
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
})(jQuery);
    
    