(function($) {
	$.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMouseMove]);
	
	$.jqplot.Cursor = function(options) {
	    this.style = 'crosshair';
	    this.previousCursor = 'auto';
	    this.show = true;
	    $.extend(true, this, options);
	    this.showTooltip = false;
	    this.tooltipLocation = 'se';
	    this.tooltipOffset = 6;
	    this.showTooltipGridPosition = false;
	    this.showTooltipUnitPosition = true;
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
	    if (c.showTooltip) {
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
	    }
	};
	
	$.jqplot.preInitHooks.push($.jqplot.Cursor.init);
	$.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw);
	
	function moveTooltip(gridpos, datapos, plot) {
    	var c = plot.plugins.cursor;
        var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
        var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
        c._tooltipElem.css('left', x);
        c._tooltipElem.css('top', y);
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
                s += datapos[g[0]].toFixed(2)+', '+datapos[g[1]].toFixed(2);
                addbr = true;
            }
        }
        c._tooltipElem.html(s);
	}
	
	function handleMouseEnter(ev, gridpos, datapos, neighbors, plot) {
	    var c = plot.plugins.cursor;
	    if (c.show) {
    	    c.previousCursor = ev.target.style.cursor;
    	    ev.target.style.cursor = c.style;
            if (c.showTooltip) {
                moveTooltip(gridpos, datapos, plot);
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
            moveTooltip(gridpos, datapos, plot);
    	}
	}
})(jQuery);