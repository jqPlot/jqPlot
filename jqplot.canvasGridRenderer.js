(function($) {    
    // Class: $.jqplot.canvasGridRenderer
    // (Public) Rendrer for the jqPlot grid which draws the grid as a canvas element on the page.
    $.jqplot.canvasGridRenderer = function(){};
    
    // Function: createDrawingContext
    // (Public) Creates (but doesn't populate) the actual canvas elements for plotting.
    // Called within context of jqPlot object.
    $.jqplot.canvasGridRenderer.prototype.createDrawingContext = function(){
        this.gridCanvas = document.createElement('canvas');
        this.gridCanvas.width = this._width;
        this.gridCanvas.height = this._height;
        if ($.browser.msie) // excanvas hack
            this.gridCanvas = window.G_vmlCanvasManager.initElement(this.gridCanvas);
        $(this.gridCanvas).css({ position: 'absolute', left: 0, top: 0 });
        this.target.append(this.gridCanvas);
        this.gctx = this.gridCanvas.getContext("2d");
        
        this.seriesCanvas = document.createElement('canvas');
        this.seriesCanvas.width = this.grid._width;
        this.seriesCanvas.height = this.grid._height;
        if ($.browser.msie) // excanvas hack
            this.seriesCanvas = window.G_vmlCanvasManager.initElement(this.seriesCanvas);
        $(this.seriesCanvas).css({ position: 'absolute', left: this.grid._left, top: this.grid._top });
        this.target.append(this.seriesCanvas);
        this.sctx = this.seriesCanvas.getContext("2d");
        
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = this._width;
        this.overlayCanvas.height = this._height;
        if ($.browser.msie) // excanvas hack
            this.overlayCanvas = window.G_vmlCanvasManager.initElement(this.overlayCanvas);
        $(this.overlayCanvas).css({ position: 'absolute', left: 0, top: 0 });
        this.target.append(this.overlayCanvas);
        this.octx = this.overlayCanvas.getContext("2d");
    };
    
    $.jqplot.canvasGridRenderer.prototype.draw = function(ctx, axes) {
        var grid = this;
        // Add the grid onto the grid canvas.  This is the bottom most layer.
        ctx.save();
        ctx.fillStyle = grid.background;
        ctx.fillRect(grid._left, grid._top, grid._width, grid._height);
        
        function drawGridLine(x1, y1, x2, y2) {
            
        }
        
        if (grid.drawGridlines) {
            ctx.save();
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'round';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#cccccc';
            for (var name in axes) {
                var axis = axes[name];
                var ticks = axis._ticks;
                if (axis.show) {
                    switch (name) {
                        case 'xaxis':
                            for (var i=0; i<ticks.length; i++) {
                                var pos = Math.round(axis.u2p(axis._ticks[i].value)) + 0.5;
                                drawLine(pos, grid._top, pos, grid._bottom);
                            }
                            break;
                        case 'yaxis':
                            for (var i=0; i<ticks.length; i++) {
                                var pos = Math.round(axis.u2p(axis._ticks[i].value)) + 0.5;
                                drawLine(grid._right, pos, grid._left, pos);
                            }
                            break;
                        case 'x2axis':
                            for (var i=0; i<ticks.length; i++) {
                                var pos = Math.round(axis.u2p(axis._ticks[i].value)) + 0.5;
                                drawLine(pos, grid._bottom, pos, grid._top);
                            }
                            break;
                        case 'y2axis':
                            for (var i=0; i<ticks.length; i++) {
                                var pos = Math.round(axis.u2p(axis._ticks[i].value)) + 0.5;
                                drawLine(grid._left, pos, grid._right, pos);
                            }
                            break;
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
            if (axis.show && axis.ticks.mark) {
                var ticks = axis.ticks;
                var s = ticks.markSize;
                var m = ticks.mark;
                var t = axis._ticks;
                switch (name) {
                    case 'xaxis':
                        for (var i=0; i<t.length; i++) {
                            var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                            var b, e;
                            switch (m) {
                                case 'inside':
                                    b = grid._bottom-s;
                                    e = grid._bottom;
                                    break;
                                case 'outside':
                                    b = grid._bottom;
                                    e = grid._bottom+s;
                                    break;
                                case 'cross':
                                    b = grid._bottom-s;
                                    e = grid._bottom+s;
                                    break;
                                default:
                                    b = grid._bottom;
                                    e = grid._bottom+s;
                                    break;
                            }
                            drawLine(pos, b, pos, e);
                        }
                        break;
                    case 'yaxis':
                        for (var i=0; i<t.length; i++) {
                            var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                            var b, e;
                            switch (m) {
                                case 'outside':
                                    b = grid._left-s;
                                    e = grid._left;
                                    break;
                                case 'inside':
                                    b = grid._left;
                                    e = grid._left+s;
                                    break;
                                case 'cross':
                                    b = grid._left-s;
                                    e = grid._left+s;
                                    break;
                                default:
                                    b = grid._left-s;
                                    e = grid._left;
                                    break;
                            }
                            drawLine(b, pos, e, pos);
                        }
                        break;
                    case 'x2axis':
                        for (var i=0; i<t.length; i++) {
                            var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                            var b, e;
                            switch (m) {
                                case 'outside':
                                    b = grid._top-s;
                                    e = grid._top;
                                    break;
                                case 'inside':
                                    b = grid._top;
                                    e = grid._top+s;
                                    break;
                                case 'cross':
                                    b = grid._top-s;
                                    e = grid._top+s;
                                    break;
                                default:
                                    b = grid._top-s;
                                    e = grid._top;
                                    break;
                            }
                            drawLine(pos, b, pos, e);
                        }
                        break;
                    case 'y2axis':
                        for (var i=0; i<t.length; i++) {
                            var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                            var b, e;
                            switch (m) {
                                case 'inside':
                                    b = grid._right-s;
                                    e = grid._right;
                                    break;
                                case 'outside':
                                    b = grid._right;
                                    e = grid._right+s;
                                    break;
                                case 'cross':
                                    b = grid._right-s;
                                    e = grid._right+s;
                                    break;
                                default:
                                    b = grid._right;
                                    e = grid._right+s;
                                    break;
                            }
                            drawLine(b, pos, e, pos);
                        }
                        break;
                }
            }
        }
        ctx.restore();
        ctx.lineWidth = grid.borderWidth;
        ctx.strokeStyle = grid.borderColor;
        ctx.strokeRect(grid._left, grid._top, grid._width, grid._height);
        
        // now draw the shadow
        if (grid.shadow) {
            ctx.save();
            for (var j=0; j<grid.shadowDepth; j++) {
                ctx.translate(Math.cos(grid.shadowAngle*Math.PI/180)*grid.shadowOffset, Math.sin(grid.shadowAngle*Math.PI/180)*grid.shadowOffset);
                ctx.lineWidth = grid.shadowWidth;
                ctx.strokeStyle = 'rgba(0,0,0,'+grid.shadowAlpha+')';
                ctx.lineJoin = 'miter';
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(grid._left, grid._bottom);
                ctx.lineTo(grid._right, grid._bottom);
                ctx.lineTo(grid._right, grid._top);
                ctx.stroke();
                //ctx.strokeRect(grid._left, grid._top, grid._width, grid._height);
            }
            ctx.restore();
        }
    
        ctx.restore();
    };
})(jQuery);