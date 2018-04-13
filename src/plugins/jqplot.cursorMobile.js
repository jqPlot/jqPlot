/**
 * jqplot.cursorMobile plugin
 * jQPlot Cursor touch event support.
 *
 * Version: @1.0.9
 * Revision: @d96a669
 *
 * Copyright (c) 2018 Dalton Dhavarev
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
 */
/**
 * 
 * @param {jQuery} $
 * @returns {undefined}
 */
(function ($) {
	$.jqplot.eventListenerHooks.push(['touchstart', handleTouchStart]);
	$.jqplot.eventListenerHooks.push(['touchmove', handleTouchMove]);
	$.jqplot.eventListenerHooks.push(['touchend', handleTouchEnd]);
	var touch = null;
	function handleTouchStart(ev) {
		if (ev.originalEvent && ev.originalEvent.touches && ev.originalEvent.touches.length > 0) {
			touch = ev.originalEvent.touches[0];
			var plot = ev.data.plot;
			var mouseDownEvent = $.Event({
				type: "mousedown",
				pageX: touch.pageX,
				pageY: touch.pageY,
				data: {
					plot: plot
				}
			});
			plot.eventCanvas._elem.trigger(mouseDownEvent);
			return false;
		}
	}
	function handleTouchMove(ev) {
		if (ev.originalEvent && ev.originalEvent.touches && ev.originalEvent.touches.length > 0) {
			touch = ev.originalEvent.touches[0];
			var plot = ev.data.plot;
			var mouseMoveEvent = $.Event({
				type: "mousemove",
				pageX: touch.pageX,
				pageY: touch.pageY,
				data: {
					plot: plot
				},
				preventDefault: function () {
				}
			});
			plot.eventCanvas._elem.trigger(mouseMoveEvent);
			return false;
		}
	}
	function handleTouchEnd(ev) {
		if (touch) {
			var plot = ev.data.plot;
			var mouseUpEvent = $.Event({
				type: "mouseup",
				pageX: touch.pageX,
				pageY: touch.pageY,
				data: {
					plot: plot
				}
			});
			plot.eventCanvas._elem.trigger(mouseUpEvent);
			touch = null;
			return false;
		}
	}
})(jQuery);
