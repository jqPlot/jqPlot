(function($) {
	// class: $.jqplot.shadowRenderer
	// The default jqPlot shadow renderer, rendering shadows behind shapes.
    $.jqplot.ShapeRenderer = function(options){
        this.lineWidth = 1.5;
        this.lineJoin = 'miter';
        this.lineCap = 'round';
        this.closePath = false;
        this.fill = false;
        this.isarc = false;
        this.strokeStyle = '#999999';
        this.fillStyle = '#999999'; 
        $.extend(true, this, options);
    };
    
    $.jqplot.ShapeRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    // function: draw
    // draws an transparent black (i.e. gray) shadow.
    //
    // ctx - canvas drawing context
    // points - array of points for shapes or 
    // [x, y, radius, start angle (rad), end angle (rad)] for circles and arcs.
    $.jqplot.ShapeRenderer.prototype.draw = function(ctx, points) {
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = this.lineJoin;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        if (this.isarc) {
            ctx.arc(points[0], points[1], points[2], points[3], points[4], true);                
        }
        else {
            ctx.moveTo(points[0][0], points[0][1]);
            for (var i=1; i<points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
            
        }
        if (this.closePath) {
        	ctx.closePath();
        }
        if (this.fill) {
        	ctx.fill();
        }
        else {
            ctx.stroke();
        }
        ctx.restore();
    };
})(jQuery);    