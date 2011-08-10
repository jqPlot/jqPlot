/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: @VERSION
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    // class: $.jqplot.shadowRenderer
    // The default jqPlot shadow renderer, rendering shadows behind shapes.
    $.jqplot.ShadowRenderer = function(options){ 
        // Group: Properties
        
        // prop: angle
        // Angle of the shadow in degrees.  Measured counter-clockwise from the x axis.
        this.angle = 45;
        // prop: offset
        // Pixel offset at the given shadow angle of each shadow stroke from the last stroke.
        this.offset = 1;
        // prop: alpha
        // alpha transparency of shadow stroke.
        this.alpha = 0.07;
        // prop: lineWidth
        // width of the shadow line stroke.
        this.lineWidth = 1.5;
        // prop: lineJoin
        // How line segments of the shadow are joined.
        this.lineJoin = 'miter';
        // prop: lineCap
        // how ends of the shadow line are rendered.
        this.lineCap = 'round';
        // prop; closePath
        // whether line path segment is closed upon itself.
        this.closePath = false;
        // prop: fill
        // whether to fill the shape.
        this.fill = false;
        // prop: depth
        // how many times the shadow is stroked.  Each stroke will be offset by offset at angle degrees.
        this.depth = 3;
        this.strokeStyle = 'rgba(0,0,0,0.1)';
        // prop: isarc
        // wether the shadow is an arc or not.
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
        var opts = (options != null) ? options : {};
        var fill = (opts.fill != null) ? opts.fill : this.fill;
        var closePath = (opts.closePath != null) ? opts.closePath : this.closePath;
        var offset = (opts.offset != null) ? opts.offset : this.offset;
        var alpha = (opts.alpha != null) ? opts.alpha : this.alpha;
        var depth = (opts.depth != null) ? opts.depth : this.depth;
        var isarc = (opts.isarc != null) ? opts.isarc : this.isarc;
        ctx.lineWidth = (opts.lineWidth != null) ? opts.lineWidth : this.lineWidth;
        ctx.lineJoin = (opts.lineJoin != null) ? opts.lineJoin : this.lineJoin;
        ctx.lineCap = (opts.lineCap != null) ? opts.lineCap : this.lineCap;
        ctx.strokeStyle = opts.strokeStyle || this.strokeStyle || 'rgba(0,0,0,'+alpha+')';
        ctx.fillStyle = opts.fillStyle || this.fillStyle || 'rgba(0,0,0,'+alpha+')';
        for (var k=0; k<depth; k++) {
            ctx.translate(Math.cos(this.angle*Math.PI/180)*offset, Math.sin(this.angle*Math.PI/180)*offset);
            ctx.beginPath();
            if (isarc) {
                ctx.arc(points[0], points[1], points[2], points[3], points[4], true);  
                if (closePath) {
                    ctx.closePath();
                }
                if (fill) {
                    ctx.fill();
                }
                else {
                    ctx.stroke();
                }              
            }
            else if (points && points.length) {
                var move = true;
                var l = points.length;
                var pl;
                var ang, rise, run, dashx, gapx, dashy, gapy, ndashes, x, y;
                var dashContinuation = 0;
                var dashTotLen = 0;
                if (opts.dashedLine && $.isArray(opts.dashPattern)) {
                    dashTotLen = opts.dashPattern[0] + opts.dashPattern[1]; 
                }
                for (var i=0; i<l; i++) {
                    // skip to the first non-null point and move to it.
                    if (points[i][0] != null && points[i][1] != null) {
                        if (move) {
                            ctx.moveTo(points[i][0], points[i][1]);

                            // if drawing dashed line and just drawing points, draw one here
                            if (opts.dashedLine && opts.dashPoints) {
                                ctx.arc(points[i][0], points[i][1], 2, 0, 2*Math.PI, true);
                                ctx.fill();
                                ctx.beginPath();
                            }
                            move = false;
                        }
                        else {
                            if (opts.dashedLine) {

                                // is spacing such that we're just drawing points?
                                if (opts.dashPoints) {
                                    ctx.moveTo(points[i][0], points[i][1]);
                                    ctx.arc(points[i][0], points[i][1], 2, 0, 2*Math.PI, true);
                                    ctx.fill();
                                    ctx.beginPath();
                                }

                                // do we have part of a dash left over from last interval?
                                else {
                                    rise = points[i][1] - points[i-1][1];
                                    run = points[i][0] - points[i-1][0];
                                    pl = Math.sqrt(Math.pow(run, 2) + Math.pow(rise, 2));
                                    ang = Math.atan(rise/run);
                                    dashx = Math.cos(ang) * opts.dashPattern[0];
                                    dashy = Math.sin(ang) * opts.dashPattern[0];
                                    gapx = Math.cos(ang) * opts.dashPattern[1];
                                    gapy = Math.sin(ang) * opts.dashPattern[1];

                                    if (dashContinuation > 0) {
                                        if (dashContinuation <= pl) {
                                            
                                        }
                                        else {
                                            ctx.lineTo(points[i][0], points[i][1]);
                                            dashContinuation -= pl;
                                        }
                                    }

                                    else {
                                        ndashes = parseInt(pl/dashTotLen);
                                        x = points[i-1][0];
                                        y = points[i-1][1];

                                        for (var j=0; j<ndashes; j++) {
                                            x += dashx;
                                            y += dashy;
                                            ctx.lineTo(x, y);
                                            x += gapx;
                                            y += gapy;
                                            ctx.moveTo(x, y);
                                        }
                                        
                                    }
                                }
                            }
                            else {
                                ctx.lineTo(points[i][0], points[i][1]);
                            }
                        }
                    }
                    else {
                        move = true;
                        dashContinuation = 0;
                    }
                }
                if (closePath) {
                    ctx.closePath();
                }
                if (fill) {
                    ctx.fill();
                }
                else {
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    };
})(jQuery);    