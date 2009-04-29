(function($) {
	$.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
	$.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
	
	$.jqplot.Cursor = function(options) {
	    this.style = 'crosshair';
	    this.show = true;

	    $.extend(true, this, options);
	}
	
	// called with scope of plot
	$.jqplot.Cursor.init = function (target, data, options){
	    // add a cursor attribute to the plot
	    this.cursor = new $.jqplot.Cursor(options.cursor);
	}
	
	$.jqplot.preInitHooks.push($.jqplot.Cursor.init);
	
	function handleMove() {};
	
	function handleMouseEnter(ev, gridpos, datapos, neighbors, plot) {
	    ev.target.style.cursor = "url('./src/plugins/crosscursor.png'), crosshair";
	};
	
	function handleMouseLeave(ev, gridpos, datapos, neighbors, plot) {
	    $(ev.target).css('cursor', 'auto');
	};
})(jQuery);