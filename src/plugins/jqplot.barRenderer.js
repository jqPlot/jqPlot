/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
    /**
    *  Class: $.jqplot.BarRenderer
    *  A plugin renderer for jqPlot to draw a bar plot.
    *  Draws series as a line.
    */
    $.jqplot.BarRenderer = function(){
        $.jqplot.LineRenderer.call(this);
        /**
        *  Group: Properties
        *  
        *  prop: seriesDefaults
        *  Attributes that will be added to the series object which
        *  are needed for bar renderering.
        * 
        *  Properties
        * 
        *  barPadding - Number of pixels between adjacent bars at the same axis value.
        *  barDirection - 'vertical' = up and down bars, 'horizontal' = side to side bars
        *  barColor - CSS color spec for the bar
        *  barWidth - width of the bars.  Auto calculated by default.
        *  fillBar - wether bars are filled or not.
        *  prop: barPadding
        */
        this.seriesDefaults = {
            barPadding : null,
            barMargin : null,
            barDirection : 'vertical',
            barColor : null,
            barWidth : null,
            fillBar : true
        };
    };
    
    $.jqplot.BarRenderer.prototype = new $.jqplot.LineRenderer();
    $.jqplot.BarRenderer.prototype.constructor = $.jqplot.BarRenderer;
    
    // called with scope of series.
    $.jqplot.BarRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        for (var d in this.renderer.seriesDefaults) {
            if (this[d] == null) {
                this[d] = this.renderer.seriesDefaults[d];
            }
        }
        if (this.barColor == null) {
            this.barColor = this.color;
        }
        if (this.barPadding == null) {
            this.barPadding = 2*this.lineWidth;
        }
        if (this.barMargin == null) {
            if (this.lineWidth > 0) {
                this.barMargin = 8 * this.lineWidth;
            }
            else {
                this.barMargin = 10;
            }
        }
        if (this.barDirection == 'vertical' ) {
            this._primaryAxis = '_xaxis';
        }
        else {
            this._primaryAxis = '_yaxis';
        }
    };
    
    $.jqplot.BarRenderer.prototype.setBarWidth = function() {
        // need to know how many data values we have on the approprate axis and figure it out.
        var i;
        var nvals = 0;
        var nseries = 0;
        var paxis = this[this._primaryAxis];
        var s, series, pos;
        // loop through all series on this axis
        for (var i=0; i < paxis._series.length; i++) {
            series = paxis._series[i];
            if (series === this) {
                pos = i;
            }
            // is the series rendered as a bar?
            if (series.renderer.constructor == $.jqplot.BarRenderer) {
                // gridData may not be computed yet, use data length insted
                nvals += series.data.length;
                nseries += 1;
            }
        }
        // so, now we have total number of axis values.
        if (paxis.name == 'xaxis' || paxis.name == 'x2axis') {
            this.barWidth = (paxis._offsets.max - paxis._offsets.min) / nvals - this.barPadding - this.barMargin/2;
        }
        else {
            this.barWidth = (paxis._offsets.min - paxis._offsets.max) / nvals - this.barPadding - this.barMargin/2;
        }
//        this.barWidth = Math.abs(paxis._offsets.max - paxis._offsets.min - this.barMargin*2) / nvals - this.barPadding;
        this._barNudge = (-Math.abs(nseries/2 - 0.5) + pos) * (this.barWidth + this.barPadding);
    };
    
    $.jqplot.BarRenderer.prototype.draw = function(ctx, gridData, options) {
        var i;
        var xaxis = this.xaxis;
        var yaxis = this.yaxis;
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var pointx, pointy;
        if (this.barWidth == null) {
            //this.barWidth = computeBarWidth(this);
            this.renderer.setBarWidth.call(this);
        }
        ctx.save();
        if (this.showLine) {
            ctx.beginPath();
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'butt';
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.barColor;
            
            if (this.barDirection == 'vertical') {
                for (var i=0; i<gridData.length; i++) {
                    var base = gridData[i][0] + this._barNudge;
                    ctx.moveTo(base-this.barWidth/2, ctx.canvas.height);
                    ctx.lineTo(base-this.barWidth/2, gridData[i][1]);
                    ctx.lineTo(base+this.barWidth/2, gridData[i][1]);
                    ctx.lineTo(base+this.barWidth/2, ctx.canvas.height);
                    ctx.stroke();
                }
            }
            
            else if (this.barDirection == 'horizontal'){
                for (var i=0; i<gridData.length; i++) {
                    var base = gridData[i][1] - this._barNudge;
                    ctx.moveTo(0, base+this.barWidth/2);
                    ctx.lineTo(gridData[i][0], base+this.barWidth/2);
                    ctx.lineTo(gridData[i][0], base-this.barWidth/2);
                    ctx.lineTo(0, base-this.barWidth/2);
                    ctx.stroke();
                }
            }
        }
        
        if (this.fillBar) {
            ctx.beginPath();
            
            if (this.barDirection == 'vertical') {
                for (var i=0; i<gridData.length; i++) {
                    var base = gridData[i][0] + this._barNudge;
                    ctx.moveTo(base-this.barWidth/2, ctx.canvas.height);
                    ctx.lineTo(base-this.barWidth/2, gridData[i][1]);
                    ctx.lineTo(base+this.barWidth/2, gridData[i][1]);
                    ctx.lineTo(base+this.barWidth/2, ctx.canvas.height);
                    ctx.closePath();
                    ctx.fill();
                }
            }
            
            else if (this.barDirection == 'horizontal'){
                for (var i=0; i<gridData.length; i++) {
                    var base = gridData[i][1] - this._barNudge;
                    ctx.moveTo(0, base+this.barWidth/2);
                    ctx.lineTo(gridData[i][0], base+this.barWidth/2);
                    ctx.lineTo(gridData[i][0], base-this.barWidth/2);
                    ctx.lineTo(0, base-this.barWidth/2);
                    ctx.closePath();
                    ctx.fill();
                }
            }
            
        }
        
        //     // now draw the shadows
        //     if (this.shadow) {
        //         ctx.save();
        //         for (var j=0; j<this.shadowDepth; j++) {
        //             ctx.translate(Math.cos(this.shadowAngle*Math.PI/180)*this.shadowOffset, Math.sin(this.shadowAngle*Math.PI/180)*this.shadowOffset);
        //             ctx.beginPath();
        //             ctx.strokeStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
        //             ctx.moveTo(this.gridData[0][0], this.gridData[0][1]);
        //             for (var i=1; i<this.gridData.length; i++) {
        //                 ctx.lineTo(this.gridData[i][0], this.gridData[i][1]);
        //             }
        //             ctx.stroke();
        //         }
        //         ctx.restore();
        //     }
        // 
        // // now draw the markers
        // if (this.markerRenderer.show) {
        //     for (i=0; i<this.gridData.length; i++) {
        //         this.markerRenderer.draw(this.gridData[i][0], this.gridData[i][1], ctx);
        //     }
        // }
        
        ctx.restore();
    };
})(jQuery);    