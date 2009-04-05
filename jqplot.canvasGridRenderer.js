(function($) {    
    // Class: $.jqplot.canvasGridRenderer
    // (Public) Rendrer for the jqPlot grid which draws the grid as a canvas element on the page.
    $.jqplot.canvasGridRenderer = function(){};
    
    // called with context of Grid object
    $.jqplot.canvasGridRenderer.prototype.init = function(options) {
        this._ctx;
        $.extend(true, this, options);
    }
    
    // called with context of Grid.
    $.jqplot.canvasGridRenderer.prototype.createElements = function() {
        var elem = document.createElement('canvas');
        var w = this._plotDimensions.width;
        var h = this._plotDimensions.height;
        elem.width = w;
        elem.height = h;
        if ($.browser.msie) // excanvas hack
            elem = window.G_vmlCanvasManager.initElement(elem);
        this._elem = $(elem);
        this._elem.css({ position: 'absolute', left: 0, top: 0 });
        this._top = this._offsets.top;
        this._bottom = h - this._offsets.bottom;
        this._left = this._offsets.left;
        this._right = w - this._offsets.right;
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
        return this._elem;
    };
    
        // var h = this._plotDimensions.height - this._offsets.bottom - this._offsets.top;
        // var w = this._plotDimensions.width - this._offsets.left - this._offsets.right;
    
    // Function: createDrawingContext
    // (Public) Creates (but doesn't populate) the actual canvas elements for plotting.
    // Called within context of jqPlot object.
    // $.jqplot.canvasGridRenderer.prototype.createDrawingContext = function(){
    //     this.gridCanvas = document.createElement('canvas');
    //     this.gridCanvas.width = this._width;
    //     this.gridCanvas.height = this._height;
    //     if ($.browser.msie) // excanvas hack
    //         this.gridCanvas = window.G_vmlCanvasManager.initElement(this.gridCanvas);
    //     $(this.gridCanvas).css({ position: 'absolute', left: 0, top: 0 });
    //     this.target.append(this.gridCanvas);
    //     this.gctx = this.gridCanvas.getContext("2d");
    //     
    //     this.seriesCanvas = document.createElement('canvas');
    //     this.seriesCanvas.width = this.grid._width;
    //     this.seriesCanvas.height = this.grid._height;
    //     if ($.browser.msie) // excanvas hack
    //         this.seriesCanvas = window.G_vmlCanvasManager.initElement(this.seriesCanvas);
    //     $(this.seriesCanvas).css({ position: 'absolute', left: this.grid._left, top: this.grid._top });
    //     this.target.append(this.seriesCanvas);
    //     this.sctx = this.seriesCanvas.getContext("2d");
    //     
    //     this.overlayCanvas = document.createElement('canvas');
    //     this.overlayCanvas.width = this._width;
    //     this.overlayCanvas.height = this._height;
    //     if ($.browser.msie) // excanvas hack
    //         this.overlayCanvas = window.G_vmlCanvasManager.initElement(this.overlayCanvas);
    //     $(this.overlayCanvas).css({ position: 'absolute', left: 0, top: 0 });
    //     this.target.append(this.overlayCanvas);
    //     this.octx = this.overlayCanvas.getContext("2d");
    // };
    
    $.jqplot.canvasGridRenderer.prototype.draw = function() {
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
                    switch (name) {
                        case 'xaxis':
                            for (var i=0; i<ticks.length; i++) {
                                var pos = Math.round(axis.u2p(axis._ticks[i].value)) + 0.5;
                                drawLine(pos, this._top, pos, this._bottom);
                            }
                            break;
                        case 'yaxis':
                            for (var i=0; i<ticks.length; i++) {
                                var pos = Math.round(axis.u2p(axis._ticks[i].value)) + 0.5;
                                drawLine(this._right, pos, this._left, pos);
                            }
                            break;
                        case 'x2axis':
                            for (var i=0; i<ticks.length; i++) {
                                var pos = Math.round(axis.u2p(axis._ticks[i].value)) + 0.5;
                                drawLine(pos, this._bottom, pos, this._top);
                            }
                            break;
                        case 'y2axis':
                            for (var i=0; i<ticks.length; i++) {
                                var pos = Math.round(axis.u2p(axis._ticks[i].value)) + 0.5;
                                drawLine(this._left, pos, this._right, pos);
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
            var to = axis.tickOptions;
            if (axis.show && to.mark) {
                var ticks = axis._ticks;
                var s = to.markSize;
                var m = to.mark;
                var t = axis._ticks;
                switch (name) {
                    case 'xaxis':
                        for (var i=0; i<t.length; i++) {
                            var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                            var b, e;
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
                        }
                        break;
                    case 'yaxis':
                        for (var i=0; i<t.length; i++) {
                            var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                            var b, e;
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
                        }
                        break;
                    case 'x2axis':
                        for (var i=0; i<t.length; i++) {
                            var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                            var b, e;
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
                        }
                        break;
                    case 'y2axis':
                        for (var i=0; i<t.length; i++) {
                            var pos = Math.round(axis.u2p(t[i].value)) + 0.5;
                            var b, e;
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
                        }
                        break;
                }
            }
        }
        ctx.restore();
        ctx.lineWidth = this.borderWidth;
        ctx.strokeStyle = this.borderColor;
        ctx.strokeRect(this._left, this._top, this._width, this._height);
        
        // now draw the shadow
        if (this.shadow) {
            ctx.save();
            for (var j=0; j<this.shadowDepth; j++) {
                ctx.translate(Math.cos(this.shadowAngle*Math.PI/180)*this.shadowOffset, Math.sin(this.shadowAngle*Math.PI/180)*this.shadowOffset);
                ctx.lineWidth = this.shadowWidth;
                ctx.strokeStyle = 'rgba(0,0,0,'+this.shadowAlpha+')';
                ctx.lineJoin = 'miter';
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this._left, this._bottom);
                ctx.lineTo(this._right, this._bottom);
                ctx.lineTo(this._right, this._top);
                ctx.stroke();
                //ctx.strokeRect(this._left, this._top, this._width, this._height);
            }
            ctx.restore();
        }
    
        ctx.restore();
    };
})(jQuery);