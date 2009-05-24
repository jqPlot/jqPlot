/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
	$.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMouseMove]);
	
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
	    this.showTooltip = false;
	    // prop: followMouse
	    // Tooltip follows the mouse, it is not at a fixed location.
	    // Tooltip will show on the grid at the location given by
	    // tooltipLocation, offset from the grid edge by tooltipOffset.
	    this.followMouse = true;
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
	    this.tooltipFormatString = '%.3g';
	    // prop: tooltipAxisGroups
	    // Show position for the specified axes.
	    // This is an array like [['xaxis', 'yaxis'], ['xaxis', 'y2axis']]
	    // Default is to compute automatically for all visible axes.
	    this.tooltipAxisGroups = [];
	    this._tooltipElem;
	    $.extend(true, this, options);
	};
	
	// called with scope of plot
	$.jqplot.Cursor.init = function (target, data, opts){
	    // add a cursor attribute to the plot
	    var options = opts || {};
	    this.plugins.cursor = new $.jqplot.Cursor(options.cursor);
	};
	
	// called with context of plot
	$.jqplot.Cursor.postDraw = function() {
    	var c = this.plugins.cursor;
        c._tooltipElem = $('<div id="jqplotCursorTooltip" class="jqplot-cursor-tooltip" style="position:absolute;display:none"></div>');
	    this.target.append(c._tooltipElem);

        // if we are showing the positions in unit coordinates, and no axes groups
        // were specified, create a default set.
        if (c.showTooltipUnitPosition){
	        if (c.tooltipAxisGroups.length === 0) {
	            if (this.axes.xaxis.show && !this.axes.x2axis.show) {
	                if (this.axes.yaxis.show) {
	                    c.tooltipAxisGroups.push(['xaxis', 'yaxis']);
	                }
	                if (this.axes.y2axis.show) {
	                    c.tooltipAxisGroups.push(['xaxis', 'y2axis']);
	                }
	            }
	            else if (this.axes.xaxis.show && this.axes.x2axis.show) {
	                if (this.axes.yaxis.show) {
	                    c.tooltipAxisGroups.push(['xaxis', 'yaxis']);
	                }
	                if (this.axes.y2axis.show) {
	                    c.tooltipAxisGroups.push(['x2axis', 'y2axis']);
	                }
	                else {
	                    c.tooltipAxisGroups.push(['x2axis', 'yaxis']);
	                }
	            }
	            else if (!this.axes.xaxis.show && this.axes.x2axis.show) {
	                if (this.axes.yaxis.show) {
	                    c.tooltipAxisGroups.push(['x2axis', 'yaxis']);
	                }
	                if (this.axes.y2axis.show) {
	                    c.tooltipAxisGroups.push(['x2axis', 'y2axis']);
	                }
	            }           
	        }
        }
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
                s += $.jqplot.sprintf(c.tooltipFormatString, datapos[g[0]])+', '+$.jqplot.sprintf(c.tooltipFormatString, datapos[g[1]]);
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
	
	function handleMouseEnter(ev, gridpos, datapos, neighbors, plot) {
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
	
	function handleMouseLeave(ev, gridpos, datapos, neighbors, plot) {
	    var c = plot.plugins.cursor;
	    if (c.show) {
	        $(ev.target).css('cursor', c.previousCursor);
            if (c.showTooltip) {
                c._tooltipElem.hide();
            }
	    }
	}
	
	function handleMouseMove(ev, gridpos, datapos, neighbors, plot) {
    	var c = plot.plugins.cursor;
    	if (c.show && c.showTooltip) {
            updateTooltip(gridpos, datapos, plot);
            if (c.followMouse) {
                moveTooltip(gridpos, plot);
            }
    	}
	}
})(jQuery);