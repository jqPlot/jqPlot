(function($) {
    // class $.jqplot.LineRenderer
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
        var opts = {lineJoin:'miter', lineCap:'round', fill:false, isarc:false, strokeStyle:this.color, fillStyle:this.color, lineWidth:this.lineWidth, closePath:false};
        this.renderer.shapeRenderer.init(opts);
        // set the shadow renderer options
        var sopts = {lineJoin:'miter', lineCap:'round', fill:false, isarc:false, angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, depth:this.shadowDepth, lineWidth:this.lineWidth, closePath:false};
        this.renderer.shadowRenderer.init(sopts);
    };
    
    $.jqplot.LineRenderer.prototype.setGridData = function() {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        this.gridData = [];
        this.gridData.push([xp.call(this._xaxis, this.data[0][0]), yp.call(this._yaxis, this.data[0][1])]);
        for (var i=1; i<this.data.length; i++) {
            this.gridData.push([xp.call(this._xaxis, this.data[i][0]), yp.call(this._yaxis, this.data[i][1])]);
        }
    };
    
    $.jqplot.LineRenderer.prototype.makeGridData = function(data) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gridData = [];
        gridData.push([xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])]);
        for (var i=1; i<data.length; i++) {
            gridData.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
        }
        return gridData;
    };

    // called within scope of series.
    $.jqplot.LineRenderer.prototype.draw = function(ctx, gd, options) {
        var i;
        var xaxis = this.xaxis;
        var yaxis = this.yaxis;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var pointx, pointy;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        ctx.save();
        if (this.showLine) {
            this.renderer.shapeRenderer.draw(ctx, gd);
        
            // now draw the shadows
            if (shadow) {
                this.renderer.shadowRenderer.draw(ctx, gd);
            }
        }
        
        // now draw the markers
        if (this.markerRenderer.show) {
            for (i=0; i<gd.length; i++) {
                this.markerRenderer.draw(gd[i][0], gd[i][1], ctx);
            }
        }
        
        ctx.restore();
    };  
})(jQuery);    