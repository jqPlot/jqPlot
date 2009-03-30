(function($) {
    $.jqplot.lineRenderer = function(){
        // prop: color
        // css color spec for the series
        this.color = '#666666';
        // prop: lineWidth
        // width of the line in pixels.  May have different meanings depending on renderer.
        this.lineWidth = 2.5;
        // prop: shadow
        // wether or not to draw a shadow on the line
        this.shadow = true;
        // prop: shadowAngle
        // Shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Shadow offset from line in pixels
        this.shadowOffset = 1;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        // prop: breakOnNull
        // wether line segments should be be broken at null value.
        // False will join point on either side of line.
        this.breakOnNull = false;
        // prop: marks
        // Either an instance of a mark renderer which will draw the data pont markers
        // or an options object with a renderer property and additional options to pass
        // to the renderer.  See the renderer for additional options.
        this.marker = new $.jqplot.markRenderer();
    };
    
    $.jqplot.lineRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this.markerOptions = {color: this.color};
        this.marker.init(this.markerOptions);
    }

    $.jqplot.lineRenderer.prototype.draw = function(series, grid, ctx) {
        var i;
        ctx.save();
        ctx.beginPath();
        var xaxis = series.xaxis;
        var yaxis = series.yaxis;
        var d = series.data;
        var xp = series._xaxis.series_u2p;
        var yp = series._yaxis.series_u2p;
        // use a clipping path to cut lines outside of grid.
        // ctx.moveTo(grid._left, grid._top);
        // ctx.lineTo(grid._right, grid._top);
        // ctx.lineTo(grid._right, grid._bottom);
        // ctx.lineTo(grid._left, grid._bottom);
        // ctx.closePath();
        // ctx.clip();
        // ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        var pointx, pointy;
        // recalculate the grid data
        series.gridData = [];
        series.gridData.push([xp.call(series._xaxis, series.data[0][0]), yp.call(series._yaxis, series.data[0][1])]);
        ctx.moveTo(series.gridData[0][0], series.gridData[0][1]);
        for (var i=1; i<series.data.length; i++) {
            series.gridData.push([xp.call(series._xaxis, series.data[i][0]), yp.call(series._yaxis, series.data[i][1])]);
            ctx.lineTo(series.gridData[i][0], series.gridData[i][1]);
        }
        ctx.stroke();
        
        // now draw the shadows
        if (this.shadow) {
            ctx.save();
            for (var j=0; j<this.shadowDepth; j++) {
                ctx.translate(Math.cos(this.shadowAngle*Math.PI/180)*this.shadowOffset, Math.sin(this.shadowAngle*Math.PI/180)*this.shadowOffset);
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.moveTo(series.gridData[0][0], series.gridData[0][1]);
                for (var i=1; i<series.data.length; i++) {
                    // pointx = xp.call(series._xaxis, series.data[i][0]);
                    // pointy = yp.call(series._yaxis, series.data[i][1]);
                    ctx.lineTo(series.gridData[i][0], series.gridData[i][1]);
                }
                ctx.stroke();
            }
            ctx.restore();
        }
        
        // now draw the markers
        if (this.marker.show) {
            for (i=0; i<series.gridData.length; i++) {
                this.marker.draw(series.gridData[i][0], series.gridData[i][1], ctx);
            }
        }
        
        ctx.restore();
    };
    
    $.jqplot.lineRenderer.prototype.processData = function() { 
        // don't have axes conversion functions yet, all we can do is look for bad
        // points and set the axes bounds.  
        var d = this.data;
        var i;
        var dbx = this._xaxis._dataBounds;
        var dby = this._yaxis._dataBounds;

        // weed out any null points and set the axes bounds
        for (i=0; i<d.length; i++) {
            if (d[i] == null || d[i][0] == null || d[i][1] == null) {
                // if line breaking on null values is set, keep the null in the data
                if (this.breakOnNull) d[i] = null;
                // else delete the null to skip the point.
                else d.splice(i,1);
            }
        }
        for (i=0; i<d.length; i++) {
            if (d[i] == null || d[i][0] == null || d[i][1] == null) continue;
            else {                
                if (d[i][0] < dbx.min || dbx.min == null) dbx.min = d[i][0];
                if (d[i][0] > dbx.max || dbx.max == null) dbx.max = d[i][0];
                if (d[i][1] < dby.min || dby.min == null) dby.min = d[i][1];
                if (d[i][1] > dby.max || dby.max == null) dby.max = d[i][1];
            }
        }
    };
})(jQuery);