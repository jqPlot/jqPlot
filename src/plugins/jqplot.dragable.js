(function($) {
    $.jqplot.Dragable = function(options) {
	    this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
	    this.shapeRenderer = new $.jqplot.ShapeRenderer();
	    this.isDragging = false;
	    this._ctx;
	    this._elem;
	    this._point;
	    this._gridData;
	    this.color;
	    this.contstrainTo = 'none';  // 'x', 'y', or 'none';

	    $.extend(true, this, options);
	};
	
	function DragCanvas() {
	    $.jqplot.GenericCanvas.call(this);
	    this.isDragging = false;
	    this._neighbor;
	    this._cursor;
	};
	
	DragCanvas.prototype = new $.jqplot.GenericCanvas();
	DragCanvas.prototype.constructor = DragCanvas;
	
    // // called with scope of plot
    // $.jqplot.Dragable.init = function (target, data, options){
    //     // add a dragable attribute to the plot
    //     this.dragable = new $.jqplot.Dragable(options.dragable);
    // };
	
	// called within scope of series
	$.jqplot.Dragable.parseOptions = function (defaults, opts) {
	    var options = opts || {};
	    this.dragable = new $.jqplot.Dragable(options.dragable);
	    this.isDragable = true;
	};
	
	// called within context of plot
	// create a copy of the overlay canvas which we can draw on.
	// insert it before the overlay, so the overlay will still capture events.
	$.jqplot.Dragable.postPlotDraw = function() {
	    this.dragCanvas = new DragCanvas();
	    
        this.eventCanvas._elem.before(this.dragCanvas.createElement(this._gridPadding, 'jqplot-event-canvas', this._plotDimensions));
        var dctx = this.dragCanvas.setContext();
	};
	
	//$.jqplot.preInitHooks.push($.jqplot.Dragable.init);
	$.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Dragable.parseOptions);
	$.jqplot.postDrawHooks.push($.jqplot.Dragable.postPlotDraw);
	$.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseDown', handleDown]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseUp', handleUp]);

    
    function initDragPoint(plot, neighbor) {
        var s = plot.series[neighbor.seriesIndex];
        var drag = s.dragable;
        
        // first, init the mark renderer for the dragged point
        var smr = s.markerRenderer;
        var mr = drag.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + 2.5;
        mr.size = smr.size + 5;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var alpha = rgba[3] - 0.5;
        var color = 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+','+alpha+')';
        drag.color = color;
        mr.color = color;
        mr.init();

        var start = (neighbor.pointIndex > 0) ? neighbor.pointIndex - 1 : 0;
        var end = neighbor.pointIndex+2;
        drag._gridData = s.gridData.slice(start, end);
    };
	
	function handleMove(ev, gridpos, datapos, neighbor, plot) {
	    if (plot.dragCanvas.isDragging) {
	        var dc = plot.dragCanvas;
	        var dp = dc._neighbor;
	        var s = plot.series[dp.seriesIndex];
	        var drag = s.dragable;
	        var gd = s.gridData;
	        
	        // compute the new grid position with any constraints.
	        var x = (drag.constrainTo == 'y') ? dp.gridData[0] : gridpos.x;
	        var y = (drag.constrainTo == 'x') ? dp.gridData[1] : gridpos.y;
	        
	        // compute data values for any listeners.
            var xu = s._xaxis.series_p2u(x);
            var yu = s._yaxis.series_p2u(y);
	        
	        // clear the canvas then redraw effect at new position.
	        var ctx = dc._ctx;
	        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	        
	        // adjust our gridData for the new mouse position
	        if (dp.pointIndex > 0) {
	            drag._gridData[1] = [x, y];
	        }
	        else {
	            drag._gridData[0] = [x, y];
	        }
	        plot.series[dp.seriesIndex].draw(dc._ctx, {gridData:drag._gridData, shadow:false, preventJqPlotSeriesDrawTrigger:true});
	        dc._elem.trigger('jqplotSeriesPointChange', [dp.seriesIndex, dp.pointIndex, [xu,yu], [x,y]]);
	    }
	};
	
	function handleDown(ev, gridpos, datapos, neighbor, plot) {
	    var dc = plot.dragCanvas;
	    dc._cursor = ev.target.style.cursor;
	    if (neighbor != null) {
	        var s = plot.series[neighbor.seriesIndex];
	        var drag = s.dragable;
	        if (s.isDragable && !dc.isDragging) {
	            dc._neighbor = neighbor;
    	        dc.isDragging = true;
    	        initDragPoint(plot, neighbor);
    	        drag.markerRenderer.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], dc._ctx);
    	        ev.target.style.cursor = "move";
            }
	    }
	    // Just in case of a hickup, we'll clear the drag canvas and reset.
	    else {
	       var ctx = dc._ctx;
	       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	       dc.isDragging = false;
	    }
	};
	
	function handleUp(ev, gridpos, datapos, neighbor, plot) {
	    if (plot.dragCanvas.isDragging) {
	        var dc = plot.dragCanvas;
	        // clear the canvas
	        var ctx = dc._ctx;
	        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	        dc.isDragging = false;
	        // redraw the series canvas at the new point.
	        var dp = dc._neighbor;
	        var s = plot.series[dp.seriesIndex];
	        var drag = s.dragable;
	        // compute the new grid position with any constraints.
	        var x = (drag.constrainTo == 'y') ? dp.data[0] : datapos[s.xaxis];
	        var y = (drag.constrainTo == 'x') ? dp.data[1] : datapos[s.yaxis];
            // var x = datapos[s.xaxis];
            // var y = datapos[s.yaxis];
            s.data[dp.pointIndex] = [x,y];
            plot.drawSeries(plot.seriesCanvas._ctx, {preventJqPlotSeriesDrawTrigger:true});
	        dc._neighbor = null;
	        ev.target.style.cursor = dc._cursor;
	    }
	};
})(jQuery);