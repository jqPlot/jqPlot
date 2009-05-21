/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
	$.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
	
	/**
	 * Class: $.jqplot.Highlighter
	 * Plugin which will highlight data points when they are moused over.
	 */
	$.jqplot.Highlighter = function(options) {
	    // Group: Properties
	    
	    // prop: markerRenderer
	    // Renderer used to draw the marker of the highlighted point.
	    // Renderer will assimilate attributes from the data point being highlighted,
	    // so no attributes need set on the renderer directly.
	    // Default is to turn off shadow drawing on the highlighted point.
	    this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
	    this.lineWidthAdjust = 2.5;
	    this.sizeAdjust = 5;
	    this.isHighlighting = false;

	    $.extend(true, this, options);
	};
	
	// called with scope of plot
	$.jqplot.Highlighter.init = function (target, data, opts){
	    var options = opts || {};
	    // add a highlighter attribute to the plot
	    this.plugins.highlighter = new $.jqplot.Highlighter(options.highlighter);
	};
	
	// called within scope of series
	$.jqplot.Highlighter.parseOptions = function (defaults, options) {
	    this.showHighlight = true;
	};
	
	// called within context of plot
	// create a canvas which we can draw on.
	// insert it before the eventCanvas, so eventCanvas will still capture events.
	$.jqplot.Highlighter.postPlotDraw = function() {
	    this.plugins.highlighter.highlightCanvas = new $.jqplot.GenericCanvas();
	    
        this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding, 'jqplot-highlight-canvas', this._plotDimensions));
        var hctx = this.plugins.highlighter.highlightCanvas.setContext();
	};
	
	$.jqplot.preInitHooks.push($.jqplot.Highlighter.init);
	$.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Highlighter.parseOptions);
	$.jqplot.postDrawHooks.push($.jqplot.Highlighter.postPlotDraw);
	
	// called with scope of plot
    function draw(plot, neighbor) {
        var hl = plot.plugins.highlighter;
        var s = plot.series[neighbor.seriesIndex];
        var smr = s.markerRenderer;
        var mr = hl.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + hl.lineWidthAdjust;
        mr.size = smr.size + hl.sizeAdjust;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var newrgb = [rgba[0], rgba[1], rgba[2]];
        var alpha = (rgba[3] >= 0.6) ? rgba[3]*0.6 : rgba[3]*(2-rgba[3]);
        mr.color = 'rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+alpha+')';
        mr.init();
        mr.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], hl.highlightCanvas._ctx);
    }
	
	function handleMove(ev, gridpos, datapos, neighbors, plot) {
	    var hl = plot.plugins.highlighter;
	    if (neighbors == null && hl.isHighlighting) {
	       var ctx = hl.highlightCanvas._ctx;
	       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	       hl.isHighlighting = false;
	        
	    }
	    if (neighbors != null && plot.series[neighbors.seriesIndex].showHighlight && !hl.isHighlighting) {
	        hl.isHighlighting = true;
	        draw(plot, neighbors);
	    }
	}
})(jQuery);