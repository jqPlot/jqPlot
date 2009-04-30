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

	    $.extend(true, this, options);
	};
	
	// called with scope of plot
	$.jqplot.Dragable.init = function (target, data, options){
	    // add a dragable attribute to the plot
	    this.dragable = new $.jqplot.Dragable(options.highlighter);
	};
	
	// called within scope of series
	$.jqplot.Dragable.parseOptions = function (defaults, options) {
	    this.isDragable = true;
	};
	
	// called within context of plot
	// create a copy of the overlay canvas which we can draw on.
	// insert it before the overlay, so the overlay will still capture events.
	$.jqplot.Dragable.postPlotDraw = function() {
	    this.dragable._elem = this.overlayCanvas._elem.clone();
	    this.dragable._elem.insertBefore(this.overlayCanvas._elem);
	    this.dragable._ctx = this.dragable._elem.get(0).getContext("2d");
	};
	
	$.jqplot.preInitHooks.push($.jqplot.Dragable.init);
	$.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Dragable.parseOptions);
	$.jqplot.postDrawHooks.push($.jqplot.Dragable.postPlotDraw);
	$.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseDown', handleDown]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseUp', handleUp]);
	
    function draw(plot, neighbor) {
        var hl = plot.highlighter;
        var s = plot.series[neighbor.seriesIndex];
        var smr = s.markerRenderer;
        var mr = hl.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + 2.5;
        mr.size = smr.size + 5;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var alpha = rgba[3] - 0.4;
        mr.color = 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+','+alpha+')';
        mr.init();
        mr.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], plot.overlayCanvas._ctx);
    };
    
    function initDragPoint(plot, neighbor) {
        var drag = plot.dragable;
        var ds = drag._series;
        var s = plot.series[neighbor.seriesIndex];
        
        // first, init the mark renderer for the dragged point
        var smr = s.markerRenderer;
        var mr = drag.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + 2.5;
        mr.size = smr.size + 5;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var alpha = rgba[3] - 0.4;
        var color = 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+','+alpha+')';
        drag.color = color;
        mr.color = color;
        mr.init();

        var start = (neighbor.pointIndex > 0) ? neighbor.pointIndex - 1 : 0;
        var end = neighbor.pointIndex+2;
        drag._gridData = s.gridData.slice(start, end);
    };
	
	function handleMove(ev, gridpos, datapos, neighbor, plot) {
	    if (plot.dragable.isDragging) {
	        var drag = plot.dragable;
	        var dp = drag._point;
	        var gd = plot.series[dp.seriesIndex].gridData;
	        // clear the canvas then redraw effect at new position.
	        var ctx = drag._ctx;
	        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	        // adjust our gridData for the new mouse position
	        if (dp.pointIndex > 0) {
	            drag._gridData[1] = [gridpos.x, gridpos.y];
	        }
	        else {
	            drag._gridData[0] = [gridpos.x, gridpos.y];
	        }
	        plot.series[dp.seriesIndex].draw(drag._ctx, {gridData:drag._gridData, shadow:false});
	    }
	};
	
	function handleDown(ev, gridpos, datapos, neighbor, plot) {
	    var drag = plot.dragable;
	    if (neighbor != null) {
	        var s = plot.series[neighbor.seriesIndex];
	        if (s.isDragable && !drag.isDragging) {
	            drag._point = neighbor;
    	        drag.isDragging = true;
    	        initDragPoint(plot, neighbor);
    	        drag.markerRenderer.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], drag._ctx);
            }
	    }
	    // Just in case of a hickup, we'll clear the drag canvas and reset.
	    else {
	       var ctx = plot.dragable._ctx;
	       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	       plot.dragable.isDragging = false;
	    }
	};
	
	function handleUp(ev, gridpos, datapos, neighbor, plot) {
	    if (plot.dragable.isDragging) {
	        // clear the canvas
	        var ctx = plot.dragable._ctx;
	        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	        plot.dragable.isDragging = false;
	        // redraw the series canvas at the new point.
	        var drag = plot.dragable;
	        var dp = drag._point;
	        var s = plot.series[dp.seriesIndex];
            var x = datapos[s.xaxis];
            var y = datapos[s.yaxis];
            s.data[dp.pointIndex] = [x,y];
            plot.drawSeries(plot.seriesCanvas._ctx);
	        plot.dragable._point = null;
	    }
	};
	
	

})(jQuery);