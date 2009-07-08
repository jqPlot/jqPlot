/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
    // Class: $.jqplot.OHLCRenderer
    // 
    $.jqplot.OHLCRenderer = function(){
        // subclass line renderer to make use of some of it's methods.
        $.jqplot.LineRenderer.call(this);
        // prop: candleStick
        // true to render chart as candleStick
        this.candleStick = false;
        this.tickLength = 4;
        this.openColor = null;
        this.closeColor = null;
        this.hiLowColor = null;
    };
    
    $.jqplot.OHLCRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.OHLCRenderer.prototype.constructor = $.jqplot.OHLCRenderer;
    
    // called with scope of series.
    $.jqplot.OHLCRenderer.prototype.init = function(options) {
        this.lineWidth = 1.5;
        $.jqplot.LineRenderer.prototype.init.call(this, options);
        // set the yaxis data bounds here to account for hi and low values
        var db = this._yaxis._dataBounds;
        var d = this._plotData;

        for (var j=0; j<d.length; j++) { 
            if (d[j][3] < db.min || db.min == null) {
            	db.min = d[j][3];
            }
            if (d[j][2] > db.max || db.max == null) {
            	db.max = d[j][2];
            }             
        }
        
    };
    
    // called within scope of series.
    $.jqplot.OHLCRenderer.prototype.draw = function(ctx, gd, options) {
        var d = this.data;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var i, prevColor;
        var r = this.renderer;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var fillAndStroke = (opts.fillAndStroke != undefined) ? opts.fillAndStroke : this.fillAndStroke;
        ctx.save();
        if (this.show) {
            var x;
            for (var i=0; i<d.length; i++) {
                x = xp(d[i][0]);
                if (r.candleStick) {
                    // do it
                }
                else {
                    prevColor = opts.color;
                    if (r.openColor) {
                        opts.color = r.openColor;
                    }
                    // draw open tick
                    r.shapeRenderer.draw(ctx, [[x-r.tickLength, yp(d[i][1])], [x, yp(d[i][1])]], opts); 
                    opts.color = prevColor;
                    // draw hi low line
                    if (r.hiLowColor) {
                        opts.color = r.hiLowColor;
                    }
                    r.shapeRenderer.draw(ctx, [[x, yp(d[i][2])], [x, yp(d[i][3])]], opts); 
                    opts.color  = prevColor;
                    // draw close tick
                    if (r.closeColor) {
                        opts.color = r.closeColor;
                    }
                    r.shapeRenderer.draw(ctx, [[x, yp(d[i][4])], [x+r.tickLength, yp(d[i][4])]], opts); 
                    opts.color = prevColor;
                }
            }
        }
        
        ctx.restore();
    };  
    
    $.jqplot.LineRenderer.prototype.drawShadow = function(ctx, gd, options) {
        // This is a no-op, shadows drawn with lines.
    };
    
})(jQuery);    