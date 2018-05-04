/*jslint browser: true, plusplus: true, nomen: true, white: false, continue: true */
/*global jQuery */
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: @VERSION
 * Revision: @REVISION
 *
 * Copyright (c) 2009-2013 Chris Leonello
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
(function ($) {
    
    "use strict";
    
    /**
     * @class: $.jqplot.CanvasGridRenderer
     * The default jqPlot grid renderer, creating a grid on a canvas element.
     * The renderer has no additional options beyond the <Grid> class.
     */
    $.jqplot.CanvasGridRenderer = function () {
        this.shadowRenderer = new $.jqplot.ShadowRenderer();
    };
    
    /**
     * called with context of Grid object
     * @param {[[Type]]} options [[Description]]
     */
    $.jqplot.CanvasGridRenderer.prototype.init = function (options) {
        this._ctx = null;
        $.extend(true, this, options);
        // set the shadow renderer options
        var sopts = {
            lineJoin: 'miter',
            lineCap: 'round',
            fill: false,
            isarc: false,
            angle: this.shadowAngle,
            offset: this.shadowOffset,
            alpha: this.shadowAlpha,
            depth: this.shadowDepth,
            lineWidth: this.shadowWidth,
            closePath: false,
            strokeStyle: this.shadowColor
        };
        this.renderer.shadowRenderer.init(sopts);
    };
    
    // called with context of Grid.
    $.jqplot.CanvasGridRenderer.prototype.createElement = function (plot) {
        
        var elem,
            w,
            h;
        
        // Memory Leaks patch
        if (this._elem) {
            if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement) {
                elem = this._elem.get(0);
                window.G_vmlCanvasManager.uninitElement(elem);
                elem = null;
            }
            this._elem.emptyForce();
            this._elem = null;
        }
      
        elem = plot.canvasManager.getCanvas();

        w = this._plotDimensions.width;
        h = this._plotDimensions.height;
        elem.width = w;
        elem.height = h;
        
        this._elem = $(elem)
            .addClass('jqplot-grid-canvas')
            .css({ position: 'absolute', left: 0, top: 0 });
        
        elem = plot.canvasManager.initCanvas(elem);

        this._top = this._offsets.top;
        this._bottom = h - this._offsets.bottom;
        this._left = this._offsets.left;
        this._right = w - this._offsets.right;
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
        
        // avoid memory leak
        elem = null;
        
        return this._elem;
    };
    
    /**
     * Draws out the lines
     */
    $.jqplot.CanvasGridRenderer.prototype.draw = function () {
        
        var ctx,
            axes,
            ax,
            i,
            name,
            axis,
            ticks,
            numticks,
            drawLine,
            points;
        
        this._ctx = this._elem.get(0).getContext("2d");
        
        ctx = this._ctx;
        axes = this._axes;
        
        // Add the grid onto the grid canvas.  This is the bottom most layer.
        ctx.save();
        ctx.clearRect(0, 0, this._plotDimensions.width, this._plotDimensions.height);
        ctx.fillStyle = this.backgroundColor || this.background;
        ctx.fillRect(this._left, this._top, this._width, this._height);
        
        ctx.save();
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'butt';
        ctx.lineWidth = this.gridLineWidth;
        ctx.strokeStyle = this.gridLineColor;

        ax = ['xaxis', 'yaxis', 'x2axis', 'y2axis'];
        
        /**
         * Canvas drawing a line
         * @param {[[Type]]} bx   [[Description]]
         * @param {[[Type]]} by   [[Description]]
         * @param {[[Type]]} ex   [[Description]]
         * @param {[[Type]]} ey   [[Description]]
         * @param {Object}   opts [[Description]]
         */
        drawLine = function (bx, by, ex, ey, opts) {
            ctx.save();
            opts = opts || {};
            if (opts.lineWidth === null || opts.lineWidth !== 0) {
                $.extend(true, ctx, opts);
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(ex, ey);
                ctx.stroke();
                ctx.restore();
            }
        };
        
        /**
             * Renders the X axis
             * @param {Object}   t    [[Description]]
             * @param {[[Type]]} pos  [[Description]]
             * @param {Object}   axis [[Description]]
             */
        this.renderXaxis = function (t, pos, axis) {
            
            var s,
                m,
                e,
                b;

            // draw the grid line if we should
            if (t.showGridline && this.drawGridlines && ((!t.isMinorTick && axis.drawMajorGridlines) || (t.isMinorTick && axis.drawMinorGridlines))) {
                drawLine(pos, this._top, pos, this._bottom);
            }

            // draw the mark
            if (t.showMark && t.mark && ((!t.isMinorTick && axis.drawMajorTickMarks) || (t.isMinorTick && axis.drawMinorTickMarks))) {

                s = t.markSize;
                m = t.mark;

                pos = Math.round(axis.u2p(t.value)) + 0.5;

                switch (m) {
                case 'outside':
                    b = this._bottom;
                    e = this._bottom + s;
                    break;
                case 'inside':
                    b = this._bottom - s;
                    e = this._bottom;
                    break;
                case 'cross':
                    b = this._bottom - s;
                    e = this._bottom + s;
                    break;
                default:
                    b = this._bottom;
                    e = this._bottom + s;
                    break;
                }

                // draw the shadow
                if (this.shadow) {
                    this.renderer.shadowRenderer.draw(ctx, [[pos, b], [pos, e]], {lineCap: 'butt', lineWidth: this.gridLineWidth, offset: this.gridLineWidth * 0.75, depth: 2, fill: false, closePath: false});
                }

                // draw the line
                drawLine(pos, b, pos, e);

            }

        };
        
        /**
             * Renders the Y axis
             * @param {Object}   t    [[Description]]
             * @param {[[Type]]} pos  [[Description]]
             * @param {Object}   axis [[Description]]
             */
        this.renderYaxis = function (t, pos, axis) {

            var s,
                m,
                e,
                b;

            // draw the grid line
            if (t.showGridline && this.drawGridlines && ((!t.isMinorTick && axis.drawMajorGridlines) || (t.isMinorTick && axis.drawMinorGridlines))) {
                drawLine(this._right, pos, this._left, pos);
            }

            // draw the mark
            if (t.showMark && t.mark && ((!t.isMinorTick && axis.drawMajorTickMarks) || (t.isMinorTick && axis.drawMinorTickMarks))) {

                s = t.markSize;
                m = t.mark;

                pos = Math.round(axis.u2p(t.value)) + 0.5;

                switch (m) {
                case 'outside':
                    b = this._left - s;
                    e = this._left;
                    break;
                case 'inside':
                    b = this._left;
                    e = this._left + s;
                    break;
                case 'cross':
                    b = this._left - s;
                    e = this._left + s;
                    break;
                default:
                    b = this._left - s;
                    e = this._left;
                    break;
                }

                // draw the shadow
                if (this.shadow) {
                    this.renderer.shadowRenderer.draw(ctx, [[b, pos], [e, pos]], {lineCap: 'butt', lineWidth: this.gridLineWidth * 1.5, offset: this.gridLineWidth * 0.75, fill: false, closePath: false});
                }

                drawLine(b, pos, e, pos, {strokeStyle: axis.borderColor});

            }

        };
            
            /**
             * Renders the X2 axis
             * @param {Object}   t    [[Description]]
             * @param {[[Type]]} pos  [[Description]]
             * @param {Object}   axis [[Description]]
             */
        this.renderX2axis = function (t, pos, axis) {

            var s,
                m,
                b,
                e;

            // draw the grid line
            if (t.showGridline && this.drawGridlines && ((!t.isMinorTick && axis.drawMajorGridlines) || (t.isMinorTick && axis.drawMinorGridlines))) {
                drawLine(pos, this._bottom, pos, this._top);
            }

            // draw the mark
            if (t.showMark && t.mark && ((!t.isMinorTick && axis.drawMajorTickMarks) || (t.isMinorTick && axis.drawMinorTickMarks))) {

                s = t.markSize;
                m = t.mark;

                pos = Math.round(axis.u2p(t.value)) + 0.5;

                switch (m) {
                case 'outside':
                    b = this._top - s;
                    e = this._top;
                    break;
                case 'inside':
                    b = this._top;
                    e = this._top + s;
                    break;
                case 'cross':
                    b = this._top - s;
                    e = this._top + s;
                    break;
                default:
                    b = this._top - s;
                    e = this._top;
                    break;
                }

                // draw the shadow
                if (this.shadow) {
                    this.renderer.shadowRenderer.draw(ctx, [[pos, b], [pos, e]], {lineCap: 'butt', lineWidth: this.gridLineWidth, offset: this.gridLineWidth * 0.75, depth: 2, fill: false, closePath: false});
                }

                drawLine(pos, b, pos, e);

            }

        };
            
            /**
             * Renders the Y2 axis
             * @param {Object}   t    [[Description]]
             * @param {[[Type]]} pos  [[Description]]
             * @param {Object}   axis [[Description]]
             */
        this.renderY2axis = function (t, pos, axis) {

            var s,
                m,
                b,
                e;

            // draw the grid line
            if (t.showGridline && this.drawGridlines && ((!t.isMinorTick && axis.drawMajorGridlines) || (t.isMinorTick && axis.drawMinorGridlines))) {
                drawLine(this._left, pos, this._right, pos);
            }

            // draw the mark
            if (t.showMark && t.mark && ((!t.isMinorTick && axis.drawMajorTickMarks) || (t.isMinorTick && axis.drawMinorTickMarks))) {

                s = t.markSize;
                m = t.mark;

                pos = Math.round(axis.u2p(t.value)) + 0.5;

                switch (m) {
                case 'outside':
                    b = this._right;
                    e = this._right + s;
                    break;
                case 'inside':
                    b = this._right - s;
                    e = this._right;
                    break;
                case 'cross':
                    b = this._right - s;
                    e = this._right + s;
                    break;
                default:
                    b = this._right;
                    e = this._right + s;
                    break;
                }

                // draw the shadow
                if (this.shadow) {
                    this.renderer.shadowRenderer.draw(ctx, [[b, pos], [e, pos]], {lineCap: 'butt', lineWidth: this.gridLineWidth * 1.5, offset: this.gridLineWidth * 0.75, fill: false, closePath: false});
                }

                drawLine(b, pos, e, pos, {strokeStyle: axis.borderColor});

            }

        };
        
        /**
         * [[Description]]
         * @param   {[[Type]]} name     [[Description]]
         * @param   {Object}   axis     [[Description]]
         * @param   {[[Type]]} ticks    [[Description]]
         * @param   {[[Type]]} numticks [[Description]]
         * @returns {[[Type]]} [[Description]]
         */
        this.drawXaxices = function (name, axis, ticks, numticks) {
            
            var bopts = {},
                j,
                t,
                pos;
            
            if (!axis.show) {
                axis = null;
                ticks = null;
                return this;
            }
            
            if (axis.drawBaseline) {

                if (axis.baselineWidth !== null) {
                    bopts.lineWidth = axis.baselineWidth;
                }

                if (axis.baselineColor !== null) {
                    bopts.strokeStyle = axis.baselineColor;
                }

                switch (name) {
                case 'xaxis':
                    drawLine(this._left, this._bottom, this._right, this._bottom, bopts);
                    break;
                case 'yaxis':
                    drawLine(this._left, this._bottom, this._left, this._top, bopts);
                    break;
                case 'x2axis':
                    drawLine(this._left, this._bottom, this._right, this._bottom, bopts);
                    break;
                case 'y2axis':
                    drawLine(this._right, this._bottom, this._right, this._top, bopts);
                    break;
                }

            }
            
            // RENDER AXICES
            
            for (j = numticks; j > 0; j--) {

                t = ticks[j - 1];

                if (t.show) {

                    pos = Math.round(axis.u2p(t.value)) + 0.5;

                    switch (name) {
                    case 'xaxis':
                        this.renderXaxis(t, pos, axis);
                        break;
                    case 'yaxis':
                        this.renderYaxis(t, pos, axis);
                        break;
                    case 'x2axis':
                        this.renderX2axis(t, pos, axis);
                        break;
                    case 'y2axis':
                        this.renderY2axis(t, pos, axis);
                        break;
                    default:
                        break;
                    }
                }
            }
            
            t = null;
            
            axis = null;
            ticks = null;
            
            return this;
            
        };
        
        /**
         * [[Description]]
         * @param {Object}   axis  [[Description]]
         * @param {[[Type]]} ticks [[Description]]
         */
        this.drawYaxices = function (axis, ticks) {
        
            var tn,
                t0,
                left,
                points,
                t,
                j,
                pos,
                s,
                m,
                b,
                e;
            
            if (!axis.show) {
                axis = null;
                ticks =  null;
                return;
            }
                
            tn = ticks[axis.numberTicks - 1];
            t0 = ticks[0];
            left = axis.getLeft();
            points = [[left, tn.getTop() + tn.getHeight() / 2], [left, t0.getTop() + t0.getHeight() / 2 + 1.0]];

            // draw the shadow
            if (this.shadow) {
                this.renderer.shadowRenderer.draw(ctx, points, {lineCap: 'butt', fill: false, closePath: false});
            }

            // draw the line
            drawLine(points[0][0], points[0][1], points[1][0], points[1][1], {lineCap: 'butt', strokeStyle: axis.borderColor, lineWidth: axis.borderWidth});

            // draw the tick marks
            for (j = ticks.length; j > 0; j--) {

                t = ticks[j - 1];

                s = t.markSize;
                m = t.mark;

                pos = Math.round(axis.u2p(t.value)) + 0.5;

                if (t.showMark && t.mark) {
                    
                    switch (m) {
                    case 'outside':
                        b = left;
                        e = left + s;
                        break;
                    case 'inside':
                        b = left - s;
                        e = left;
                        break;
                    case 'cross':
                        b = left - s;
                        e = left + s;
                        break;
                    default:
                        b = left;
                        e = left + s;
                        break;
                    }
                    
                    points = [[b, pos], [e, pos]];
                    
                    // draw the shadow
                    if (this.shadow) {
                        this.renderer.shadowRenderer.draw(ctx, points, {lineCap: 'butt', lineWidth: this.gridLineWidth * 1.5, offset: this.gridLineWidth * 0.75, fill: false, closePath: false});
                    }
                    
                    // draw the line
                    drawLine(b, pos, e, pos, {strokeStyle: axis.borderColor});
                    
                }
                
                t = null;
                
            }
            t0 = null;
            
            axis = null;
            ticks =  null;
        
        };
        
        // Draw initial 4 axises
        for (i = 4; i > 0; i--) {
            
            name = ax[i - 1];
            axis = axes[name];
            ticks = axis._ticks;
            numticks = ticks.length;
            
            this.drawXaxices(name, axis, ticks, numticks);
            
        }
        
        // Now draw grid lines for additional y axes
        //////
        // TO DO: handle yMidAxis
        //////
        ax = ['y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis', 'yMidAxis'];
        
        for (i = 7; i > 0; i--) {
            
            axis = axes[ax[i - 1]];
            ticks = axis._ticks;
            
            this.drawYaxices(axis, ticks);
            
        }
        
        ctx.restore();
        
        if (this.shadow) {
            points = [[this._left, this._bottom], [this._right, this._bottom], [this._right, this._top]];
            this.renderer.shadowRenderer.draw(ctx, points);
        }
        
        // Now draw border around grid.  Use axis border definitions. start at
        // upper left and go clockwise.
        if (this.borderWidth !== 0 && this.drawBorder) {
            drawLine(this._left, this._top, this._right, this._top, {lineCap: 'round', strokeStyle: axes.x2axis.borderColor, lineWidth: axes.x2axis.borderWidth});
            drawLine(this._right, this._top, this._right, this._bottom, {lineCap: 'round', strokeStyle: axes.y2axis.borderColor, lineWidth: axes.y2axis.borderWidth});
            drawLine(this._right, this._bottom, this._left, this._bottom, {lineCap: 'round', strokeStyle: axes.xaxis.borderColor, lineWidth: axes.xaxis.borderWidth});
            drawLine(this._left, this._bottom, this._left, this._top, {lineCap: 'round', strokeStyle: axes.yaxis.borderColor, lineWidth: axes.yaxis.borderWidth});
        }
        
        // ctx.lineWidth = this.borderWidth;
        // ctx.strokeStyle = this.borderColor;
        // ctx.strokeRect(this._left, this._top, this._width, this._height);
        
        ctx.restore();
        
        ctx =  null;
        axes = null;
        
    };
    
}(jQuery));