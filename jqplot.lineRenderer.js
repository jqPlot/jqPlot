(function($) {
    $.jqplot.lineRenderer = function(){
    };
    
    // called with scope of series.
    $.jqplot.lineRenderer.prototype.init = function(options) {
        $.extend(true, this.renderer, options);
        if (!this.markerOptions.color) this.markerOptions.color = this.color;
        this.marker.init(this.markerOptions);
    }

    $.jqplot.lineRenderer.prototype.draw = function(ctx) {
        var i;
        var xaxis = this.xaxis;
        var yaxis = this.yaxis;
        var d = this.data;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var pointx, pointy;
        ctx.save();
        if (this.showLine) {
            ctx.beginPath();
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            // recalculate the grid data
            this.gridData = [];
            this.gridData.push([xp.call(this._xaxis, this.data[0][0]), yp.call(this._yaxis, this.data[0][1])]);
            ctx.moveTo(this.gridData[0][0], this.gridData[0][1]);
            for (var i=1; i<this.data.length; i++) {
                this.gridData.push([xp.call(this._xaxis, this.data[i][0]), yp.call(this._yaxis, this.data[i][1])]);
                ctx.lineTo(this.gridData[i][0], this.gridData[i][1]);
            }
            ctx.stroke();
        
            // now draw the shadows
            if (this.shadow) {
                ctx.save();
                for (var j=0; j<this.shadowDepth; j++) {
                    ctx.translate(Math.cos(this.shadowAngle*Math.PI/180)*this.shadowOffset, Math.sin(this.shadowAngle*Math.PI/180)*this.shadowOffset);
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                    ctx.moveTo(this.gridData[0][0], this.gridData[0][1]);
                    for (var i=1; i<this.data.length; i++) {
                        ctx.lineTo(this.gridData[i][0], this.gridData[i][1]);
                    }
                    ctx.stroke();
                }
                ctx.restore();
            }
        }
        
        // now draw the markers
        if (this.marker.show) {
            for (i=0; i<this.gridData.length; i++) {
                this.marker.draw(this.gridData[i][0], this.gridData[i][1], ctx);
            }
        }
        
        ctx.restore();
    };
    
    ///////////////////////////
    //////////////////////////
    // Don't need this anymore.
    // $.jqplot.lineRenderer.prototype.processData = function() { 
    //     // don't have axes conversion functions yet, all we can do is look for bad
    //     // points and set the axes bounds.  
    //     var d = this.data;
    //     var i;
    //     var xaxis = this._xaxis;
    //     var yaxis = this._yaxis;
    //     var dbx = xaxis._dataBounds;
    //     var dby = yaxis._dataBounds;
    // 
    //     // weed out any null points and set the axes bounds
    //     for (i=0; i<d.length; i++) {
    //         if (d[i] == null || d[i][0] == null || d[i][1] == null) {
    //             // if line breaking on null values is set, keep the null in the data
    //             // if (this.renderer.breakOnNull && this.renderer.mode == 'scatter') d[i] = null;
    //             // else delete the null to skip the point.
    //             // else d.splice(i,1);
    //             // For the time being, just delete null values
    //             d.splice(i,1);
    //             continue;
    //         }
    //         // Set the initial axes databounds.  May be overriden later by axis padding or by
    //         // specific types of axes which call for different bounds.
    //         else {                
    //             if (d[i][0] < dbx.min || dbx.min == null) dbx.min = d[i][0];
    //             if (d[i][0] > dbx.max || dbx.max == null) dbx.max = d[i][0];
    //             if (d[i][1] < dby.min || dby.min == null) dby.min = d[i][1];
    //             if (d[i][1] > dby.max || dby.max == null) dby.max = d[i][1];
    //         }
    //     }
    //     
    //     // Maybe don't do any of this.  Handle category intelligence within Axis.
    //     // 
    //     // // if the xaxis is a category axis, modify the databounds and ticks.
    //     // if (xaxis.renderer.prototype == $.jqplot.categoryAxisRenderer) {
    //     //     // A category line (or just line) plot.
    //     //     // Populate the axis values if none were given.
    //     //     // Each axis values will start at 1 and increment by 2 so
    //     //     // that we can have nice "bins" for data and ticks.
    //     //     // set the databaounds to 1 less and greater than number of bins.
    //     //     dbx.min = 0;
    //     //     dbx.max = d.length*2;
    //     //     var ticks = xaxis._ticks;
    //     //     if (!ticks.length) {
    //     //         ticks = [];
    //     //         for (i=0; i<d.length; i++) {
    //     //             var t = new $.jqplot.AxisTick();
    //     //             // set the tick value to it's position on the axis
    //     //             // and set its label to the x value of the line.
    //     //             ticks.push(t.init(2*i+1, d[i][0].toString(), xaxis.name));
    //     //             // now reassign the x value to the right bin.
    //     //             d[i][0] = 2*i+1;
    //     //         }
    //     //     }
    //     // }
    //     // 
    //     // // Don't know if this makes sense, but allow it anyway.
    //     // // if the yaxis is a category axis, modify the databounds and ticks.
    //     // if (yaxis.renderer.prototype == $.jqplot.categoryAxisRenderer) {
    //     //     // A category line (or just line) plot.
    //     //     // Populate the axis values if none were given.
    //     //     // Each axis values will start at 1 and increment by 2 so
    //     //     // that we can have nice "bins" for data and ticks.
    //     //     // set the databaounds to 1 less and greater than number of bins.
    //     //     dby.min = 0;
    //     //     dby.max = d.length*2;
    //     //     var ticks = yaxis._ticks;
    //     //     if (!ticks.length) {
    //     //         ticks = [];
    //     //         for (i=0; i<d.length; i++) {
    //     //             var t = new $.jqplot.AxisTick();
    //     //             // set the tick value to it's position on the axis
    //     //             // and set its label to the y value of the line.
    //     //             ticks.push(t.init(2*i+1, d[i][1].toString(), xaxis.name));
    //     //             // now reassign the y value to the right bin.
    //     //             d[i][1] = 2*i+1;
    //     //         }
    //     //     }
    //     // }
    // };
})(jQuery);