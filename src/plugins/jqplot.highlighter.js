(function($) {
	$.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
	
	$.jqplot.Highlighter = function(options) {
	    this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
	    this.isHighlighting = false;

	    $.extend(true, this, options);
	};
	
	// called with scope of plot
	$.jqplot.Highlighter.init = function (target, data, opts){
	    var options = opts || {};
	    // add a highlighter attribute to the plot
	    this.highlighter = new $.jqplot.Highlighter(options.highlighter);
	};
	
	// called within scope of series
	$.jqplot.Highlighter.parseOptions = function (defaults, options) {
	    this.showHighlight = true;
	};
	
	// called within context of plot
	// create a canvas which we can draw on.
	// insert it before the eventCanvas, so eventCanvas will still capture events.
	$.jqplot.Highlighter.postPlotDraw = function() {
	    this.highlightCanvas = new $.jqplot.GenericCanvas();
	    
        this.eventCanvas._elem.before(this.highlightCanvas.createElement(this._gridPadding, 'jqplot-highlight-canvas', this._plotDimensions));
        var hctx = this.highlightCanvas.setContext();
	};
	
	$.jqplot.preInitHooks.push($.jqplot.Highlighter.init);
	$.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Highlighter.parseOptions);
	$.jqplot.postDrawHooks.push($.jqplot.Highlighter.postPlotDraw);
	
    function draw(plot, neighbor) {
        var hl = plot.highlighter;
        var s = plot.series[neighbor.seriesIndex];
        var smr = s.markerRenderer;
        var mr = plot.highlighter.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + 2.5;
        mr.size = smr.size + 5;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var alpha = rgba[3] - 0.4;
        mr.color = 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+','+alpha+')';
        mr.init();
        mr.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], plot.highlightCanvas._ctx);
    }
	
	function handleMove(ev, gridpos, datapos, neighbors, plot) {
	    if (neighbors == null && plot.highlighter.isHighlighting) {
	       var ctx = plot.highlightCanvas._ctx;
	       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	       plot.highlighter.isHighlighting = false;
	        
	    }
	    if (neighbors != null && plot.series[neighbors.seriesIndex].showHighlight && !plot.highlighter.isHighlighting) {
	        plot.highlighter.isHighlighting = true;
	        draw(plot, neighbors);
	    }
	}
})(jQuery);