(function($) {
	$.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
	
	$.jqplot.Cursor = function(options) {
	    this.style = 'crosshair';
	    this.show = true;
	    $.extend(true, this, options);
	};
	
	// called with scope of plot
	$.jqplot.Cursor.init = function (target, data, opts){
	    // add a cursor attribute to the plot
	    var options = opts || {};
	    this.plugins.cursor = new $.jqplot.Cursor(options.cursor);
	};
	
	$.jqplot.preInitHooks.push($.jqplot.Cursor.init);
	
	function handleMouseEnter(ev, gridpos, datapos, neighbors, plot) {
	    //ev.target.style.cursor = "url('"+$.jqplot.pluginsPath+"/"+plot.cursor.imagePath+"/crosscursor.png'), crosshair";
	    ev.target.style.cursor = plot.plugins.cursor.style;
	}
	
	function handleMouseLeave(ev, gridpos, datapos, neighbors, plot) {
	    $(ev.target).css('cursor', 'auto');
	}
})(jQuery);