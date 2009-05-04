(function($) {     
    // class: $.jqplot.CanvasGridRenderer
    // The default jqPlot grid renderer, creating a grid on a canvas element.
    // The renderer has no additional options beyond the <Grid> class.
    $.jqplot.CanvasGridRenderer = function(){
        this.shadowRenderer = new $.jqplot.ShadowRenderer();
    };
    
    // called with context of Grid object
    $.jqplot.CanvasGridRenderer.prototype.init = function(options) {
        this._ctx;
        $.extend(true, this, options);
        // set the shadow renderer options
        var sopts = {lineJoin:'miter', lineCap:'round', fill:false, isarc:false, angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, depth:this.shadowDepth, lineWidth:this.shadowWidth, closePath:false};
        this.renderer.shadowRenderer.init(sopts);
    };
    
    // called with context of Grid.
    $.jqplot.CanvasGridRenderer.prototype.createElement = function() {
        var elem = document.createElement('canvas');
        var w = this._plotDimensions.width;
        var h = this._plotDimensions.height;
        elem.width = w;
        elem.height = h;
        this._elem = $(elem);
        this._elem.css({ position: 'absolute', left: 0, top: 0 });
        // borrowed from flot by Ole Laursen
        if ($.browser.msie) {
            window.G_vmlCanvasManager.init_(document);
        }
        if ($.browser.msie) {
            elem = window.G_vmlCanvasManager.initElement(elem);
        }
        this._top = this._offsets.top;
        this._bottom = h - this._offsets.bottom;
        this._left = this._offsets.left;
        this._right = w - this._offsets.right;
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
        return this._elem;
    };
    
    $.jqplot.CanvasGridRenderer.prototype.draw = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        var ctx = this._ctx;
        var axes = this._axes;
        // Add the grid onto the grid canvas.  This is the bottom most layer.
        ctx.save();
        ctx.fillStyle = this.background;
        ctx.fillRect(this._left, this._top, this._width, this._height);
        
        if (this.drawGridlines) {
            ctx.save();
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'round';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#cccccc';
            for (var name in axes) {
                var axis = axes[name];
                var ticks = axis._ticks;
                if (axis.show) {
                    for (var i=0; i<ticks.length; i++) {
                        var t = axis._ticks[i];
                        if (t.show && t.showGridline) {
                            var pos = Math.round(axis.u2p(t.value)) + 0.5;
                            switch (name) {
                                case 'xaxis':
                                    drawLine(pos, this._top, pos, this._bottom);
                                    break;
                                case 'yaxis':
                                    drawLine(this._right, pos, this._left, pos);
                                    break;
                                case 'x2axis':
                                    drawLine(pos, this._bottom, pos, this._top);
                                    break;
                                case 'y2axis':
                                    drawLine(this._left, pos, this._right, pos);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            }
            ctx.restore();
        }
        
        function drawLine(bx, by, ex, ey) {
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(ex, ey);
            ctx.stroke();
        }
        // Now draw the tick marks.
        ctx.save();
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'round';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cccccc';
        for (var name in axes) {
            var axis = axes[name];
            if (axis.show) {
                var t = axis._ticks;
                for (var i=0; i<t.length; i++) {
                    if (t[i].show && t[i].showMark && t[i].mark) {
                        s = t[i].markSize;
                        m = t[i].mark;
                        var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                        var b, e;
                        switch (name)     {
                            case 'xaxis':
                                switch (m) {
                                    case 'inside':
                                        b = this._bottom-s;
                                        e = this._bottom;
                                        break;
                                    case 'outside':
                                        b = this._bottom;
                                        e = this._bottom+s;
                                        break;
                                    case 'cross':
                                        b = this._bottom-s;
                                        e = this._bottom+s;
                                        break;
                                    default:
                                        b = this._bottom;
                                        e = this._bottom+s;
                                        break;
                                }
                                drawLine(pos, b, pos, e);
                                break;
                            case 'yaxis':
                                switch (m) {
                                    case 'outside':
                                        b = this._left-s;
                                        e = this._left;
                                        break;
                                    case 'inside':
                                        b = this._left;
                                        e = this._left+s;
                                        break;
                                    case 'cross':
                                        b = this._left-s;
                                        e = this._left+s;
                                        break;
                                    default:
                                        b = this._left-s;
                                        e = this._left;
                                        break;
                                }
                                drawLine(b, pos, e, pos);
                                break;
                            case 'x2axis':
                                switch (m) {
                                    case 'outside':
                                        b = this._top-s;
                                        e = this._top;
                                        break;
                                    case 'inside':
                                        b = this._top;
                                        e = this._top+s;
                                        break;
                                    case 'cross':
                                        b = this._top-s;
                                        e = this._top+s;
                                        break;
                                    default:
                                        b = this._top-s;
                                        e = this._top;
                                        break;
                                }
                                drawLine(pos, b, pos, e);
                                break;
                            case 'y2axis':
                                switch (m) {
                                    case 'inside':
                                        b = this._right-s;
                                        e = this._right;
                                        break;
                                    case 'outside':
                                        b = this._right;
                                        e = this._right+s;
                                        break;
                                    case 'cross':
                                        b = this._right-s;
                                        e = this._right+s;
                                        break;
                                    default:
                                        b = this._right;
                                        e = this._right+s;
                                        break;
                                }
                                drawLine(b, pos, e, pos);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        ctx.restore();
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor;
        ctx.strokeRect(this._left, this._top, this._width, this._height);
        
        // now draw the shadow
        if (this.shadow) {
            var points = [[this._left, this._bottom], [this._right, this._bottom], [this._right, this._top]];
            this.renderer.shadowRenderer.draw(ctx, points);
        }
    
        ctx.restore();
    };
})(jQuery); 