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
	    // Show a tooltip with data point values.
	    this.showTooltip = true;
	    // prop: tooltipLocation
	    // Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
	    this.tooltipLocation = 'nw';
	    // prop: tooltipFade
	    // true = fade in/out tooltip, flase = show/hide tooltip
	    this.fadeTooltip = true;
	    // prop: tooltipFadeSpeed
	    // 'slow', 'def', 'fast', or number of milliseconds.
	    this.tooltipFadeSpeed = "fast";
	    // prop: tooltipOffset
	    // Pixel offset of tooltip from the highlight.
	    this.tooltipOffset = 2;
	    // prop: tooltipAxes
	    // Which axes to display in tooltip, 'x', 'y' or 'both'
	    this.tooltipAxes = 'both';
	    // prop; tooltipSeparator
	    // String to use to separate x and y axes in tooltip.
	    this.tooltipSeparator = ', ';
	    // prop: useAxesFormatters
	    // Use the x and y axes formatters to format the text in the tooltip.
	    this.useAxesFormatters = true;
	    // prop: tooltipFormatString
	    // sprintf format string for the tooltip.
	    // Uses Ash Searle's javascript sprintf implementation
	    // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
	    // See http://perldoc.perl.org/functions/sprintf.html for reference.
	    // Additional "p" and "P" format specifiers added by Chris Leonello.
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
            var str;
            if (hl.tooltipAxes == 'both') {
                str = xf(xfstr, neighbor.data[0]) + hl.tooltipSeparator + yf(yfstr, neighbor.data[1]);
            }
            else if (hl.tooltipAxes == 'x') {
                str = xf(xfstr, neighbor.data[0]);
            }
            else if (hl.tooltipAxes == 'y') {
                str = yf(yfstr, neighbor.data[1]);
            }
            
        }
        else {
            var str;
            if (hl.tooltipAxes == 'both') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]) + hl.tooltipSeparator + $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]);
            }
            else if (hl.tooltipAxes == 'x') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]);
            }
            else if (hl.tooltipAxes == 'y') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]);
            } 
        }
        elem.html(str);
        var gridpos = {x:neighbor.gridData[0], y:neighbor.gridData[1]};
        var ms = 0;
        var fact = 0.707;
        if (series.markerRenderer.show == true) { 
            ms = (series.markerRenderer.size + hl.sizeAdjust)/2;
        }
        switch (hl.tooltipLocation) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - ms;
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + fact * ms;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + ms;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + fact * ms;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
        }
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