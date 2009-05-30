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
	    
	    this.show = true;
	    // prop: markerRenderer
	    // Renderer used to draw the marker of the highlighted point.
	    // Renderer will assimilate attributes from the data point being highlighted,
	    // so no attributes need set on the renderer directly.
	    // Default is to turn off shadow drawing on the highlighted point.
	    this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
	    // prop: lineWidthAdjust
	    // Pixels to add to the lineWidth of the highlight.
	    this.lineWidthAdjust = 2.5;
	    // prop: sizeAdjust
	    // Pixels to add to the overall size of the highlight.
	    this.sizeAdjust = 5;
	    // prop: showTooltip
	    // Show a cursor position tooltip near the cursor
	    this.showTooltip = true;
	    // prop: tooltipLocation
	    // Where to position tooltip.  If followMouse is true, this is
	    // relative to the cursor, otherwise, it is relative to the grid.
	    // One of 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
	    this.tooltipLocation = 'nw';
	    // prop: tooltipFade
	    // true = fade in/out tooltip, flase = show/hide tooltip
	    this.fadeTooltip = true;
	    // prop: tooltipFadeSpeed
	    // 'slow', 'def', 'fast', or number of milliseconds.
	    this.tooltipFadeSpeed = "fast";
	    // prop: tooltipOffset
	    // Pixel offset of tooltip from the grid boudaries or cursor center.
	    this.tooltipOffset = 8;
	    // prop: useAxesFormatters
	    // Use the x and y axes formatters to format the text in the tooltip.
	    this.useAxesFormatters = true;
	    // prop: tooltipFormatString
	    // sprintf format string for the tooltip.
	    // Uses Ash Searle's javascript sprintf implementation
	    // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
	    // See http://perldoc.perl.org/functions/sprintf.html for reference
	    this.tooltipFormatString = '%.5P';
	    this._tooltipElem;
	    this.isHighlighting = false;

	    $.extend(true, this, options);
	};
	
	// axis.renderer.tickrenderer.formatter
	
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
        
    	var p = this.plugins.highlighter;
        p._tooltipElem = $('<div id="jqplotHighlighterTooltip" class="jqplot-highlighter-tooltip" style="position:absolute;display:none"></div>');
	    this.target.append(p._tooltipElem);
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
        mr.lineWidth = smr.lineWidth + hl.lineWidthAdjust;
        mr.size = smr.size + hl.sizeAdjust;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var newrgb = [rgba[0], rgba[1], rgba[2]];
        var alpha = (rgba[3] >= 0.6) ? rgba[3]*0.6 : rgba[3]*(2-rgba[3]);
        mr.color = 'rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+alpha+')';
        mr.init();
        mr.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], hl.highlightCanvas._ctx);
    }
    
    function showTooltip(plot, series, neighbor) {
        // neighbor looks like: {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]}
        // gridData should be x,y pixel coords on the grid.
        // add the plot._gridPadding to that to get x,y in the target.
        var hl = plot.plugins.highlighter;
        var elem = hl._tooltipElem;
        if (hl.useAxesFormatters) {
            var xf = series._xaxis._ticks[0].formatter;
            var yf = series._yaxis._ticks[0].formatter;
            var xfstr = series._xaxis._ticks[0].formatString;
            var yfstr = series._yaxis._ticks[0].formatString;
            var str = xf(xfstr, neighbor.data[0]) + ', '+ yf(yfstr, neighbor.data[1]);
        }
        else {
            var str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]) + ', '+ $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]);
        }
        elem.html(str);
        var gridpos = {x:neighbor.gridData[0], y:neighbor.gridData[1]}
        var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset;
        var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true);
        elem.css('left', x);
        elem.css('top', y);
        if (hl.fadeTooltip) {
            elem.fadeIn(hl.tooltipFadeSpeed);
        }
        else {
            elem.show();
        }
        
    }
	
	function handleMove(ev, gridpos, datapos, neighbor, plot) {
	    var hl = plot.plugins.highlighter;
	    if (hl.show) {
    	    if (neighbor == null && hl.isHighlighting) {
    	       var ctx = hl.highlightCanvas._ctx;
    	       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (hl.fadeTooltip) {
                    hl._tooltipElem.fadeOut(hl.tooltipFadeSpeed);
                }
                else {
                    hl._tooltipElem.hide();
                }
    	       hl.isHighlighting = false;
	        
    	    }
    	    if (neighbor != null && plot.series[neighbor.seriesIndex].showHighlight && !hl.isHighlighting) {
    	        hl.isHighlighting = true;
    	        draw(plot, neighbor);
                if (hl.showTooltip) {
                    showTooltip(plot, plot.series[neighbor.seriesIndex], neighbor);
                }
    	    }
	    }
	}
})(jQuery);