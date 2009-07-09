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
        this.tickLength = null;
        this.bodyWidth = null;
        this.openColor = null;
        this.closeColor = null;
        this.wickColor = null;
        this.fillUpBody = false;
        this.fillDownBody = true;
        this.upBodyColor = null;
        this.downBodyColor = null;
        
        this.candleWidth
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
        var i, prevColor, ops, b, h, w, a, points;
        var o;
        var r = this.renderer;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var fillAndStroke = (opts.fillAndStroke != undefined) ? opts.fillAndStroke : this.fillAndStroke;
        ctx.save();
        if (this.show) {
            var x, open, hi, low, close;
            if (r.candleStick && r.bodyWidth == null) {
                r.bodyWidth = ctx.canvas.width/d.length/2;
            }
            else if (!r.candleStick && r.tickLength == null) {
                r.tickLength = ctx.canvas.width/d.length/4;
            }
            for (var i=0; i<d.length; i++) {
                x = xp(d[i][0]);
                open = yp(d[i][1]);
                hi = yp(d[i][2]);
                low = yp(d[i][3]);
                close = yp(d[i][4]);
                o = {};
                if (r.candleStick) {
                    w = r.bodyWidth;
                    a = x - w/2;
                    // draw candle
                    // determine if candle up or down
                    // up, remember grid coordinates increase downward
                    if (close < open) {
                        // draw wick
                        if (r.wickColor) {
                            o.color = r.wickColor;
                        }
                        ops = $.extend(true, {}, opts, o);
                        r.shapeRenderer.draw(ctx, [[x, hi], [x, close]], ops); 
                        r.shapeRenderer.draw(ctx, [[x, open], [x, low]], ops); 
                        o = {};
                        b = close;
                        h = open - close;
                        // if color specified, use it
                        if (r.fillUpBody) {
                            o.fillRect = true;
                        }
                        else {
                            o.strokeRect = true;
                            w = w - this.lineWidth;
                            a = x - w/2;
                        }
                        if (r.upBodyColor) {
                            o.color = r.upBodyColor;
                        }
                        points = [a, b, w, h];
                    }
                    // down
                    else if (close >  open) {
                        // draw wick
                        if (r.wickColor) {
                            o.color = r.wickColor;
                        }
                        ops = $.extend(true, {}, opts, o);
                        r.shapeRenderer.draw(ctx, [[x, hi], [x, open]], ops); 
                        r.shapeRenderer.draw(ctx, [[x, close], [x, low]], ops); 
                        o = {};
                        
                        b = open;
                        h = close - open;
                        // if color specified, use it
                        if (r.fillDownBody) {
                            o.fillRect = true;
                        }
                        else {
                            o.strokeRect = true;
                            w = w - this.lineWidth;
                            a = x - w/2;
                        }
                        if (r.downBodyColor) {
                            o.color = r.downBodyColor;
                        }
                        points = [a, b, w, h];
                    }
                    // even, open = close
                    else  {
                        // draw wick
                        if (r.wickColor) {
                            o.color = r.wickColor;
                        }
                        ops = $.extend(true, {}, opts, o);
                        r.shapeRenderer.draw(ctx, [[x, hi], [x, low]], ops); 
                        o = {};
                        o.fillRect = false;
                        o.strokeRect = false;
                        a = [x - w/2, open];
                        b = [x + w/2, close];
                        w = null;
                        h = null;
                        points = [a, b];
                    }
                    ops = $.extend(true, {}, opts, o);
                    r.shapeRenderer.draw(ctx, points, ops);
                }
                else {
                    prevColor = opts.color;
                    if (r.openColor) {
                        opts.color = r.openColor;
                    }
                    // draw open tick
                    r.shapeRenderer.draw(ctx, [[x-r.tickLength, yp(d[i][1])], [x, yp(d[i][1])]], opts); 
                    opts.color = prevColor;
                    // draw wick
                    if (r.wickColor) {
                        opts.color = r.wickColor;
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