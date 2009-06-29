/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
	
	/**
	 * Class: $.jqplot.Cursor
	 * Plugin class representing the cursor as displayed on the plot.
	 */
	$.jqplot.Cursor = function(options) {
	    // Group: Properties
	    //
	    // prop: style
	    // CSS spec for cursor style
	    this.style = 'crosshair';
	    this.previousCursor = 'auto';
	    // prop: show
	    // wether to show the cursor or not.
	    this.show = true;
	    // prop: showTooltip
	    // show a cursor position tooltip near the cursor
	    this.showTooltip = true;
	    // prop: followMouse
	    // Tooltip follows the mouse, it is not at a fixed location.
	    // Tooltip will show on the grid at the location given by
	    // tooltipLocation, offset from the grid edge by tooltipOffset.
	    this.followMouse = false;
	    // prop: tooltipLocation
	    // Where to position tooltip.  If followMouse is true, this is
	    // relative to the cursor, otherwise, it is relative to the grid.
	    // One of 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
	    this.tooltipLocation = 'se';
	    // prop: tooltipOffset
	    // Pixel offset of tooltip from the grid boudaries or cursor center.
	    this.tooltipOffset = 6;
	    // prop: showTooltipGridPosition
	    // show the grid pixel coordinates of the mouse.
	    this.showTooltipGridPosition = false;
	    // prop: showTooltipUnitPosition
	    // show the unit (data) coordinates of the mouse.
	    this.showTooltipUnitPosition = true;
	    // prop: tooltipFormatString
	    // sprintf format string for the tooltip.
	    // Uses Ash Searle's javascript sprintf implementation
	    // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
	    // See http://perldoc.perl.org/functions/sprintf.html for reference
	    this.tooltipFormatString = '%.4P';
	    // prop: useAxesFormatters
	    // Use the x and y axes formatters to format the text in the tooltip.
	    this.useAxesFormatters = true;
	    // prop: tooltipAxisGroups
	    // Show position for the specified axes.
	    // This is an array like [['xaxis', 'yaxis'], ['xaxis', 'y2axis']]
	    // Default is to compute automatically for all visible axes.
	    this.tooltipAxisGroups = [];
	    // prop: zoom
	    // Enable plot zooming.
	    this.zoom = false;
	    // prop: clickReset
	    // Will reset plot zoom if single click on plot without drag.
	    this.clickReset = false;
	    // prop: dblClickReset
	    // Will reset plot zoom if double click on plot without drag.
	    this.dblClickReset = true;
	    this._zoom = {start:[], end:[], started: false, zooming:false, axes:{start:{}, end:{}}};
	    this._tooltipElem;
	    this.zoomCanvas;
	    $.extend(true, this, options);
	};
	
	// called with scope of plot
	$.jqplot.Cursor.init = function (target, data, opts){
	    // add a cursor attribute to the plot
	    var options = opts || {};
	    this.plugins.cursor = new $.jqplot.Cursor(options.cursor);

        if (this.plugins.cursor.show) {
        	$.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
        	$.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
            $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMouseMove]);
            
            if (this.plugins.cursor.zoom) {
                $.jqplot.eventListenerHooks.push(['jqplotMouseDown', handleMouseDown]);
                $.jqplot.eventListenerHooks.push(['jqplotMouseUp', handleMouseUp]);
                
                if (this.plugins.cursor.clickReset) {
                    $.jqplot.eventListenerHooks.push(['jqplotClick', handleClick]);
                }
                
                if (this.plugins.cursor.dblClickReset) {
                    $.jqplot.eventListenerHooks.push(['jqplotDblClick', handleDblClick]);
                }
            }
        }
	};
	
	// called with context of plot
	$.jqplot.Cursor.postDraw = function() {
    	var c = this.plugins.cursor;
        c._tooltipElem = $('<div id="jqplotCursorTooltip" class="jqplot-cursor-tooltip" style="position:absolute;display:none"></div>');
	    this.target.append(c._tooltipElem);
	    if (c.zoom) {
	        c.zoomCanvas = new $.jqplot.GenericCanvas();
            this.eventCanvas._elem.before(c.zoomCanvas.createElement(this._gridPadding, 'jqplot-zoom-canvas', this._plotDimensions));
            var zctx = c.zoomCanvas.setContext();
	    }

        // if we are showing the positions in unit coordinates, and no axes groups
        // were specified, create a default set.
        if (c.showTooltipUnitPosition){
	        if (c.tooltipAxisGroups.length === 0) {
	            var series = this.series;
	            var s;
	            var temp = [];
	            for (var i=0; i<series.length; i++) {
	                s = series[i];
	                var ax = s.xaxis+','+s.yaxis;
	                if ($.inArray(ax, temp) == -1) {
	                    temp.push(ax);
	                }
	            }
	            for (var i=0; i<temp.length; i++) {
	                c.tooltipAxisGroups.push(temp[i].split(','));
	            }         
	        }
        }
	};
	
	$.jqplot.Cursor.resetZoom = function(plot) {
	    var axes = plot.axes;
	    var cax = plot.plugins.cursor._zoom.axes;
	    for (var ax in axes) {
            axes[ax]._ticks = [];
	        axes[ax].min = cax[ax].min;
	        axes[ax].max = cax[ax].max;
	        axes[ax].numberTicks = cax[ax].numberTicks; 
	        axes[ax].tickInterval = cax[ax].tickInterval;
	        // for date axes
	        axes[ax]._tickInterval = cax[ax]._tickInterval;
	    }
	    plot.redraw();
	};
	
	$.jqplot.preInitHooks.push($.jqplot.Cursor.init);
	$.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw);
	
	function updateTooltip(gridpos, datapos, plot) {
    	var c = plot.plugins.cursor;
        var s = '';
        var addbr = false;
        if (c.showTooltipGridPosition) {
            s = gridpos.x+', '+gridpos.y;
            addbr = true;
        }
        if (c.showTooltipUnitPosition) {
            var g;
            for (var i=0; i<c.tooltipAxisGroups.length; i++) {
                g = c.tooltipAxisGroups[i];
                if (addbr) {
                    s += '<br />';
                }
                if (c.useAxesFormatters) {
                    var xf = plot.axes[g[0]]._ticks[0].formatter;
                    var yf = plot.axes[g[1]]._ticks[0].formatter;
                    var xfstr = plot.axes[g[0]]._ticks[0].formatString;
                    var yfstr = plot.axes[g[1]]._ticks[0].formatString;
                    s += xf(xfstr, datapos[g[0]]) + ', '+ yf(yfstr, datapos[g[1]]);
                }
                else {
                    s += $.jqplot.sprintf(c.tooltipFormatString, datapos[g[0]]) + ', '+ $.jqplot.sprintf(c.tooltipFormatString, datapos[g[1]]);
                }
                addbr = true;
            }
        }
        c._tooltipElem.html(s);
	}
	
	function moveTooltip(gridpos, plot) {
    	var c = plot.plugins.cursor;  
    	var elem = c._tooltipElem;
        switch (c.tooltipLocation) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default:
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
        }
            
        c._tooltipElem.css('left', x);
        c._tooltipElem.css('top', y);
	}
	
	function positionTooltip(plot) { 
	    // fake a grid for positioning
	    var grid = plot._gridPadding; 
    	var c = plot.plugins.cursor;
    	var elem = c._tooltipElem;  
        switch (c.tooltipLocation) {
            case 'nw':
                var a = grid.left + c.tooltipOffset;
                var b = grid.top + c.tooltipOffset;
                elem.css('left', a);
                elem.css('top', b);
                break;
            case 'n':
                var a = (grid.left + (plot._plotDimensions.width - grid.right))/2 - elem.outerWidth(true)/2;
                var b = grid.top + c.tooltipOffset;
                elem.css('left', a);
                elem.css('top', b);
                break;
            case 'ne':
                var a = grid.right + c.tooltipOffset;
                var b = grid.top + c.tooltipOffset;
                elem.css({right:a, top:b});
                break;
            case 'e':
                var a = grid.right + c.tooltipOffset;
                var b = (grid.top + (plot._plotDimensions.height - grid.bottom))/2 - elem.outerHeight(true)/2;
                elem.css({right:a, top:b});
                break;
            case 'se':
                var a = grid.right + c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({right:a, bottom:b});
                break;
            case 's':
                var a = (grid.left + (plot._plotDimensions.width - grid.right))/2 - elem.outerWidth(true)/2;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({left:a, bottom:b});
                break;
            case 'sw':
                var a = grid.left + c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({left:a, bottom:b});
                break;
            case 'w':
                var a = grid.left + c.tooltipOffset;
                var b = (grid.top + (plot._plotDimensions.height - grid.bottom))/2 - elem.outerHeight(true)/2;
                elem.css({left:a, top:b});
                break;
            default:  // same as 'se'
                var a = grid.right - c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({right:a, bottom:b});
                break;
        }
	}
	
	function handleClick (ev, gridpos, datapos, neighbor, plot) {
	    var c = plot.plugins.cursor;
        if (c.clickReset) {
            $.jqplot.Cursor.resetZoom(plot);
        }
        return true;
	}
	
	function handleDblClick (ev, gridpos, datapos, neighbor, plot) {
	    var c = plot.plugins.cursor;
        if (c.dblClickReset) {
            $.jqplot.Cursor.resetZoom(plot);
        }
        return;
	}
	
	function handleMouseLeave(ev, gridpos, datapos, neighbor, plot) {
	    var c = plot.plugins.cursor;
	    if (c.show) {
	        $(ev.target).css('cursor', c.previousCursor);
            if (c.showTooltip) {
                c._tooltipElem.hide();
            }
            if (c.zoom) {
                c._zoom.started = false;
                c._zoom.zooming = false;
	            var ctx = c.zoomCanvas._ctx;
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                
            }
	    }
	}
	
	function handleMouseEnter(ev, gridpos, datapos, neighbor, plot) {
	    var c = plot.plugins.cursor;
	    if (c.show) {
    	    c.previousCursor = ev.target.style.cursor;
    	    ev.target.style.cursor = c.style;
            if (c.showTooltip) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
                else {
                    positionTooltip(plot);
                }
                c._tooltipElem.show();
            }
	    }
	}
	
	function handleMouseMove(ev, gridpos, datapos, neighbor, plot) {
    	var c = plot.plugins.cursor;
    	if (c.show) {
    	    if (c.showTooltip) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
    	    }
            if (c.zoom && c._zoom.started) {
                c._zoom.zooming = true;
                c._zoom.end = [gridpos.x, gridpos.y];
                drawZoomBox.call(c);
            }
    	}
	}
	
	function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
	    var c = plot.plugins.cursor;
	    var axes = plot.axes;
	    if (c.zoom) {
	        c._zoom.start = [gridpos.x, gridpos.y];
	        c._zoom.started = true;
            for (var ax in datapos) {
                // get zoom starting position.
                c._zoom.axes.start[ax] = datapos[ax];
                // make a copy of the original axes to revert back.
                if (c._zoom.axes[ax] == undefined) {
                    c._zoom.axes[ax] = {};
                    c._zoom.axes[ax].numberTicks = axes[ax].numberTicks;
                    c._zoom.axes[ax].tickInterval = axes[ax].tickInterval;
                    // for date axes...
                    c._zoom.axes[ax]._tickInterval = axes[ax]._tickInterval;
                    c._zoom.axes[ax].min = axes[ax].min;
                    c._zoom.axes[ax].max = axes[ax].max;
                }
                
            }
	    }
	}
	
	function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
	    var c = plot.plugins.cursor;
	    if (c.zoom && c._zoom.zooming) {
	        var axes = plot.axes;
	        var zaxes = c._zoom.axes;
	        var start = zaxes.start;
	        var end = zaxes.end;
	        var min, max;
	        var ctx = c.zoomCanvas._ctx;
            ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
            // don't zoom is zoom area is too small (in pixels)
            if (!(Math.abs(gridpos.x - c._zoom.start[0]) < 8 || Math.abs(gridpos.y - c._zoom.start[1]) < 8)) {
                for (var ax in datapos) {
                    dp = datapos[ax];
                    if (dp != null) {           
                        if (dp > start[ax]) { 
                            axes[ax].min = start[ax];
                            axes[ax].max = dp;
                        }
                        else {
                            span = start[ax] - dp;
                            axes[ax].max = start[ax];
                            axes[ax].min = dp;
                        }
                        axes[ax].tickInterval = null;
                        // for date axes...
                        axes[ax]._tickInterval = null;
                        axes[ax]._ticks = [];
                    }
                }
                plot.redraw();
            }
        }
        c._zoom.started = false;
        c._zoom.zooming = false;
	}
	
	function drawZoomBox() {
	    var start = this._zoom.start;
	    var end = this._zoom.end;
	    var ctx = this.zoomCanvas._ctx;
	    var l, t, h, w;
	    if (end[0] > start[0]) {
	        l = start[0];
	        w = end[0] - start[0];
	    }
	    else {
	        l = end[0];
	        w = start[0] - end[0];
	    }
	    if (end[1] > start[1]) {
	        t = start[1];
	        h = end[1] - start[1];
	    }
	    else {
	        t = end[1];
	        h = start[1] - end[1];
	    }
	    ctx.fillStyle = 'rgba(0,0,0,0.2)';
	    ctx.strokeStyle = '#999999';
	    ctx.lineWidth = 1.0;
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
	    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
	    ctx.clearRect(l, t, w, h);
	    // IE won't show transparent fill rect, so stroke a rect also.
	    ctx.strokeRect(l,t,w,h);
	}
	
})(jQuery);