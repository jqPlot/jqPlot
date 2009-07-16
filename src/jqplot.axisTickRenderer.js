/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
    // class: $.jqplot.AxisTickRenderer
    // A "tick" object showing the value of a tick/gridline on the plot.
    $.jqplot.AxisTickRenderer = function(options) {
        // Group: Properties
        $.jqplot.ElemContainer.call(this);
        // prop: mark
        // tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
        this.mark = 'outside';
        // prop: showMark
        // wether or not to show the mark on the axis.
        this.showMark = true;
        // prop: showGridline
        // wether or not to draw the gridline on the grid at this tick.
        this.showGridline = true;
        // prop: isMinorTick
        // if this is a minor tick.
        this.isMinorTick = false;
        // prop: size
        // Length of the tick beyond the grid in pixels.
        // DEPRECATED: This has been superceeded by markSize
        this.size = 4;
        // prop:  markSize
        // Length of the tick marks in pixels.  For 'cross' style, length
        // will be stoked above and below axis, so total length will be twice this.
        this.markSize = 6;
        // prop: show
        // wether or not to show the tick (mark and label).
        this.show = true;
        // prop: showLabel
        // wether or not to show the label.
        this.showLabel = true;
        this.label = '';
        this.value = null;
        this._styles = {};
        // prop: formatter
        // A class of a formatter for the tick text.  sprintf by default.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: fontFamily
        // css spec for the font-family css attribute.
        this.fontFamily;
        // prop: fontSize
        // css spec for the font-size css attribute.
        this.fontSize;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor;
        this._elem;
        
        $.extend(true, this, options);
    };
    
    $.jqplot.AxisTickRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    $.jqplot.AxisTickRenderer.prototype = new $.jqplot.ElemContainer();
    $.jqplot.AxisTickRenderer.prototype.constructor = $.jqplot.AxisTickRenderer;
    
    $.jqplot.AxisTickRenderer.prototype.setTick = function(value, axisName, isMinor) {
        this.value = value;
        if (isMinor) {
        	this.isMinorTick = true;
        }
        return this;
    };
    
    $.jqplot.AxisTickRenderer.prototype.draw = function() {
        if (!this.label) {
        	this.label = this.formatter(this.formatString, this.value);
        }
        style ='style="position:absolute;';
        if (Number(this.label)) {
            style +='white-space:nowrap;';
        }
        style += '"';
        this._elem = $('<div '+style+'class="jqplot-'+this.axis+'-tick">'+this.label+'</div>');
        for (var s in this._styles) {
            this._elem.css(s, this._styles[s]);
        }
        if (this.fontFamily) {
        	this._elem.css('font-family', this.fontFamily);
        }
        if (this.fontSize) {
        	this._elem.css('font-size', this.fontSize);
        }
        if (this.textColor) {
        	this._elem.css('color', this.textColor);
        }
        return this._elem;
    };
        
    $.jqplot.DefaultTickFormatter = function (format, val) {
        if (typeof val == 'number') {
            if (!format) {
            	format = '%.1f';
            }
            return $.jqplot.sprintf(format, val);
        }
        else {
            return String(val);
        }
    };
    
    $.jqplot.AxisTickRenderer.prototype.pack = function() {
    };
})(jQuery);