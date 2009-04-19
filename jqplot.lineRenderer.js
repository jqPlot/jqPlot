(function($) {
    $.jqplot.LineRenderer = function(){
    };
    
    // called with scope of series.
    $.jqplot.LineRenderer.prototype.init = function(options) {
        $.extend(true, this.renderer, options);
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

    $.jqplot.LineRenderer.prototype.draw = function(ctx) {
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
            ctx.moveTo(this.gridData[0][0], this.gridData[0][1]);
            for (var i=1; i<this.data.length; i++) {
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
        if (this.markerRenderer.show) {
            for (i=0; i<this.gridData.length; i++) {
                this.markerRenderer.draw(this.gridData[i][0], this.gridData[i][1], ctx);
            }
        }
        
        ctx.restore();
    };  
})(jQuery);    