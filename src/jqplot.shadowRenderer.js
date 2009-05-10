(function($) {
	// class: $.jqplot.shadowRenderer
	// The default jqPlot shadow renderer, rendering shadows behind shapes.
    $.jqplot.ShadowRenderer = function(options){
        // degrees
        this.angle = 45;
        this.offset = 1;
        this.alpha = 0.07;
        this.lineWidth = 1.5;
        this.lineJoin = 'miter';
        this.lineCap = 'round';
        this.closePath = false;
        this.fill = false;
        this.depth = 3;
        this.isarc = false;
        $.extend(true, this, options);
    };
    
    $.jqplot.ShadowRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    // function: draw
    // draws an transparent black (i.e. gray) shadow.
    //
    // ctx - canvas drawing context
    // points - array of points or [x, y, radius, start angle (rad), end angle (rad)]
    $.jqplot.ShadowRenderer.prototype.draw = function(ctx, points, options) {
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = this.lineJoin;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = 'rgba(0,0,0,'+this.alpha+')';
        ctx.fillStyle = 'rgba(0,0,0,'+this.alpha+')';
        for (var j=0; j<this.depth; j++) {
            ctx.translate(Math.cos(this.angle*Math.PI/180)*this.offset, Math.sin(this.angle*Math.PI/180)*this.offset);
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
        }
        ctx.restore();
    };
})(jQuery);    