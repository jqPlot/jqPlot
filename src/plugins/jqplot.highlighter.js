/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
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
	
    function draw(plot, neighbor) {
        var hl = plot.plugins.highlighter;
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