(function($) {
	// class: $.jqplot.MarkerRenderer
	// The default jqPlot marker renderer, rendering the points on the line.
    $.jqplot.MarkerRenderer = function(){
        // prop: show
        // wether or not to show the marker.
        this.show = true;
        // prop: style
        // One of diamond, circle, square, x, plus, dash, filledDiamond, filledCircle, filledSquare
        this.style = 'filledCircle';
        // prop: lineWidth
        // size of the line for non-filled markers.
        this.lineWidth = 2;
        // prop: size
        // Size of the marker (diameter or circle, length of edge of square, etc.)
        this.size = 9.0;
        // prop: color
        // color of marker.  Will be set to color of series by default on init.
        this.color = '#666666';
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
    };
    
    $.jqplot.MarkerRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    }
    
    $.jqplot.MarkerRenderer.prototype.drawDiamond = function(x, y, ctx, fill) {
        ctx.save();
        ctx.lineJoin = 'miter';
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        var stretch = 1.2;
        var dx = this.size/2/stretch;
        var dy = this.size/2*stretch;
        ctx.moveTo(x-dx, y);
        ctx.lineTo(x, y+dy);
        ctx.lineTo(x+dx, y);
        ctx.lineTo(x, y-dy);
        ctx.closePath();
        if (fill) ctx.fill();
        else ctx.stroke();
        
        if (this.shadow) {
            ctx.save();
            for (var j=0; j<this.shadowDepth; j++) {
                ctx.translate(Math.cos(this.shadowAngle*Math.PI/180)*this.shadowOffset, Math.sin(this.shadowAngle*Math.PI/180)*this.shadowOffset);
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.fillStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.moveTo(x-dx, y);
                ctx.lineTo(x, y+dy);
                ctx.lineTo(x+dx, y);
                ctx.lineTo(x, y-dy);
                ctx.closePath();
                if (fill) ctx.fill();
                else ctx.stroke();
            }
            ctx.restore();
        }
        
        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawSquare = function(x, y, ctx, fill) {
        ctx.save();
        ctx.lineJoin = 'miter';
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        var stretch = 1.0;
        var dx = this.size/2/stretch;
        var dy = this.size/2*stretch;
        ctx.moveTo(x-dx, y-dy);
        ctx.lineTo(x-dx, y+dy);
        ctx.lineTo(x+dx, y+dy);
        ctx.lineTo(x+dx, y-dy);
        ctx.closePath();
        if (fill) ctx.fill();
        else ctx.stroke();
        
        if (this.shadow) {
            ctx.save();
            for (var j=0; j<this.shadowDepth; j++) {
                ctx.translate(Math.cos(this.shadowAngle*Math.PI/180)*this.shadowOffset, Math.sin(this.shadowAngle*Math.PI/180)*this.shadowOffset);
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.fillStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.moveTo(x-dx, y-dy);
                ctx.lineTo(x-dx, y+dy);
                ctx.lineTo(x+dx, y+dy);
                ctx.lineTo(x+dx, y-dy);
                ctx.closePath();
                if (fill) ctx.fill();
                else ctx.stroke();
            }
            ctx.restore();
        }
        
        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawCircle = function(x, y, ctx, fill) {
        ctx.save();
        ctx.lineJoin = 'miter';
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        var radius = this.size/2;
        var end = 2*Math.PI;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, end, true);
        if (fill) ctx.fill();
        else ctx.stroke();
        
        if (this.shadow) {
            ctx.save();
            for (var j=0; j<this.shadowDepth; j++) {
                ctx.translate(Math.cos(this.shadowAngle*Math.PI/180)*this.shadowOffset, Math.sin(this.shadowAngle*Math.PI/180)*this.shadowOffset);
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.fillStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.arc(x, y, radius, 0, end, true);
                if (fill) ctx.fill();
                else ctx.stroke();
            }
            ctx.restore();
        }
        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.draw = function(x, y, ctx) {
        switch (this.style) {
            case 'diamond':
                this.drawDiamond(x,y,ctx, false);
                break;
            case 'filledDiamond':
                this.drawDiamond(x,y,ctx, true);
                break;
            case 'circle':
                this.drawCircle(x,y,ctx, false);
                break;
            case 'filledCircle':
                this.drawCircle(x,y,ctx, true);
                break;
            case 'square':
                this.drawSquare(x,y,ctx, false);
                break;
            case 'filledSquare':
                this.drawSquare(x,y,ctx, true);
                break;
            default:
                this.drawDiamond(x,y,ctx, false);
                break;
        }
    };
})(jQuery);    