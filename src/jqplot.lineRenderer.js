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
        var opts = {lineJoin:'miter', lineCap:'round', fill:this.fill, isarc:false, strokeStyle:this.color, fillStyle:this.color, lineWidth:this.lineWidth, closePath:this.fill};
        this.renderer.shapeRenderer.init(opts);
        // set the shadow renderer options
        var sopts = {lineJoin:'miter', lineCap:'round', fill:this.fill, isarc:false, angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, depth:this.shadowDepth, lineWidth:this.lineWidth, closePath:this.fill};
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
        var gd = [];
        var data = [];
        this.gridData = [];
        // if (this._stack) {
        //     var sidx = this._stackAxis == 'x' ? 0 : 1;
        //     var idx = s ? 0 : 1;
        //     for (var i=0; i<this.data.length; i++) {
        //         var temp = [];
        //         temp[sidx] = this._stackData[i][sidx];
        //         temp[idx] = this.data[i][idx];
        //         data.push(temp);
        //     }
        // }
        // else {
        //     data = this.data;
        // }
        data = this._plotData;
//        gd.push([xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])]); //????
        for (var i=0; i<this.data.length; i++) {
            gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
        }
        this.gridData = gd;
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
        // gd.push([xp.call(this._xaxis, data[0][0]), yp.call(this._yaxis, data[0][1])]);
        for (var i=0; i<data.length; i++) {
            gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
        }
        return gd;
    };
    

    // called within scope of series.
    $.jqplot.LineRenderer.prototype.draw = function(ctx, gd, options, plot) {
        var i;
        var opts = (options != undefined) ? options : {};
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        ctx.save();
        if (showLine) {
            // if we fill, we'll have to add points to close the curve.
            if (fill) {
                var gridymin = this._yaxis.series_u2p(this._yaxis.min) - this.gridBorderWidth / 2;
                // IE doesn't return new length on unshift
                gd.unshift([gd[0][0], gridymin]);
                len = gd.length;
                gd.push([gd[len - 1][0], gridymin]);
            }
            this.renderer.shapeRenderer.draw(ctx, gd, opts);                

            // now draw the shadows
            if (shadow) {
                this.renderer.shadowRenderer.draw(ctx, gd, opts);
            }
        }
        
        // now draw the markers
        if (this.markerRenderer.show) {
            for (i=0; i<gd.length; i++) {
                this.markerRenderer.draw(gd[i][0], gd[i][1], ctx, opts);
            }
        }
        
        ctx.restore();
    };  
})(jQuery);    