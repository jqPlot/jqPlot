/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
    // Class: $.jqplot.LineRenderer
    // The default line renderer for jqPlot, this class has no options beyond the <Series> class.
    // Draws series as a line.
    $.jqplot.LineRenderer = function(){
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        this.shadowRenderer = new $.jqplot.ShadowRenderer();
    };
    
    // called with scope of series.
    $.jqplot.LineRenderer.prototype.init = function(options) {
        $.extend(true, this.renderer, options);
        // set the shape renderer options
        var opts = {lineJoin:'miter', lineCap:'round', fill:this.fill, isarc:false, strokeStyle:this.color, fillStyle:this.fillColor, lineWidth:this.lineWidth, closePath:this.fill};
        this.renderer.shapeRenderer.init(opts);
        // set the shadow renderer options
        // scale the shadowOffset to the width of the line.
        if (this.lineWidth > 2.5) {
            var shadow_offset = this.shadowOffset* (1 + (Math.atan((this.lineWidth/2.5))/0.785398163 - 1)*0.6);
            // var shadow_offset = this.shadowOffset;
        }
        // for skinny lines, don't make such a big shadow.
        else {
            var shadow_offset = this.shadowOffset*Math.atan((this.lineWidth/2.5))/0.785398163;
        }
        var sopts = {lineJoin:'miter', lineCap:'round', fill:this.fill, isarc:false, angle:this.shadowAngle, offset:shadow_offset, alpha:this.shadowAlpha, depth:this.shadowDepth, lineWidth:this.lineWidth, closePath:this.fill};
        this.renderer.shadowRenderer.init(sopts);
    };
    
    // Method: setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.LineRenderer.prototype.setGridData = function() {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        var pdata = this._prevPlotData;
        this.gridData = [];
        for (var i=0; i<this.data.length; i++) {
            this.gridData.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
            if (pdata.length > i) {
                this._prevGridData.push([xp.call(this._xaxis, pdata[i][0]), yp.call(this._yaxis, pdata[i][1])]);
            }
        }
    };
    
    // Method: makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.LineRenderer.prototype.makeGridData = function(data) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gd = [];
        var pgd = [];
        for (var i=0; i<data.length; i++) {
            gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
        }
        return gd;
    };
    

    // called within scope of series.
    $.jqplot.LineRenderer.prototype.draw = function(ctx, gd, options) {
        var i;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var fillAndStroke = (opts.fillAndStroke != undefined) ? opts.fillAndStroke : this.fillAndStroke;
        ctx.save();
        if (showLine) {
            // if we fill, we'll have to add points to close the curve.
            if (fill) {
                // is stoking line as well as filling, get a copy of line data.
                if (fillAndStroke) {
                    var fasgd = gd.slice(0);
                }
                // if not stacked, fill down to axis
                if (this.index == 0 || !this._stack) {
                    var gridymin = this._yaxis.series_u2p(this._yaxis.min) - this.gridBorderWidth / 2;
                    // IE doesn't return new length on unshift
                    gd.unshift([gd[0][0], gridymin]);
                    len = gd.length;
                    gd.push([gd[len - 1][0], gridymin]);                    
                }
                // if stacked, fill to line below 
                else {
                    var prev = this._prevGridData;
                    for (var i=prev.length-1; i>-1; i--) {
                        gd.push(prev[i]);
                    }
                }
            }
            if (shadow) {
                this.renderer.shadowRenderer.draw(ctx, gd, opts);
            }
            
            this.renderer.shapeRenderer.draw(ctx, gd, opts); 
            if (fillAndStroke) {
                var fasopts = $.extend(true, {}, opts, {fill:false, closePath:false});
                this.renderer.shapeRenderer.draw(ctx, fasgd, fasopts);
                //////////
                // TODO: figure out some way to do shadows nicely
                // if (shadow) {
                //     this.renderer.shadowRenderer.draw(ctx, fasgd, fasopts);
                // }
                // now draw the markers
                if (this.markerRenderer.show) {
                    for (i=0; i<fasgd.length; i++) {
                        this.markerRenderer.draw(fasgd[i][0], fasgd[i][1], ctx, opts.markerOptions);
                    }
                }
            }
        }
        
        // now draw the markers
        if (this.markerRenderer.show && !fill) {
            for (i=0; i<gd.length; i++) {
                this.markerRenderer.draw(gd[i][0], gd[i][1], ctx, opts.markerOptions);
            }
        }
        
        ctx.restore();
    };  
    
    $.jqplot.LineRenderer.prototype.drawShadow = function(ctx, gd, options) {
        // This is a no-op, shadows drawn with lines.
    };
    
})(jQuery);    