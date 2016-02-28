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
 * 
 */
(function($) {
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
    $.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleEnter]);
    $.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleLeave]);
    
    /**
     */
    $.jqplot.HighlightingCursor = function(options) {
        $.extend(true, this, options);
    };
    
    // called with scope of plot
    $.jqplot.HighlightingCursor.init = function (target, data, opts) {
        var options = opts || {};
        // add a highlighter attribute to the plot
        if (this.plugins.highlighter == null) {
            this.plugins.highlighter = new $.jqplot.Highlighter(options.highlighter);
        }
        this.plugins.highlightingCursor = new $.jqplot.HighlightingCursor(options.highlightingCursor);
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.HighlightingCursor.postPlotDraw = function() {
    };
    
    $.jqplot.preInitHooks.push($.jqplot.HighlightingCursor.init);
    $.jqplot.postDrawHooks.push($.jqplot.HighlightingCursor.postPlotDraw);
    
    // This is the draw function from the $.jqplot.Highlighter plugin.
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
        var x_pos = s.gridData[neighbor.pointIndex][0];
        var y_pos = s.gridData[neighbor.pointIndex][1];
        // Adjusting with s._barNudge
        if (s.renderer.constructor == $.jqplot.BarRenderer) {
            if (s.barDirection == "vertical") {
                x_pos += s._barNudge;
            }
            else {
                y_pos -= s._barNudge;
            }
        }
        mr.draw(x_pos, y_pos, hl.highlightCanvas._ctx);
    }
    
    function handleEnter(ev, gridpos, datapos, neighbor, plot) {
        if (plot.plugins.highlightingCursor.update != null) {
            plot.plugins.highlightingCursor.update(ev, 'enter', gridpos, datapos, null, plot);
        }
    }
    
    function handleLeave(ev, gridpos, datapos, neighbor, plot) {
        if (plot.plugins.highlightingCursor.update != null) {
            plot.plugins.highlightingCursor.update(ev, 'leave', gridpos, datapos, null, plot);
        }
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var seriesDataPoints = [];
        $.each(plot.series, function(seriesIdx, series) {
            var candidateDataPoint = null;
            var prevDist = null;
            var threshold = series.markerRenderer.size/2+series.neighborThreshold;
            threshold = (threshold > 0) ? threshold : 0;
            for (var j = 0; j < series.gridData.length; j++) {
                var p = series.gridData[j];
                var dist = Math.abs(p[0] - gridpos.x);
                if (dist <= threshold) {
                   if (prevDist == null || dist <= prevDist) {
                       candidateDataPoint = {
                           seriesIndex: seriesIdx,
                           pointIndex: j,
                           data: series.data[j],
                           gridData: p
                       };
                       prevDist = dist;
                   }
                } else if (prevDist != null) {
                   break;
                }
            }
            seriesDataPoints[seriesIdx] = candidateDataPoint;
        });
      
        if (plot.plugins.highlightingCursor.show) {
            var hl = plot.plugins.highlighter;
            var ctx = hl.highlightCanvas._ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            $.each(seriesDataPoints, function(idx, neighbor) {
                if (neighbor != null
                        && plot.series[neighbor.seriesIndex].showHighlight
                        && plot.series[neighbor.seriesIndex].show) {
                    draw(plot, neighbor);
                }
            });
        }
        
        if (plot.plugins.highlightingCursor.update != null) {
            plot.plugins.highlightingCursor.update(ev, 'move', gridpos, datapos, seriesDataPoints, plot);
        }
    }
})(jQuery);
