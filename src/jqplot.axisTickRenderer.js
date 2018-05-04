/*jslint browser: true, plusplus: true, nomen: true, white: false, continue: true */
/*global jQuery */
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
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function ($) {
    
    "use strict";
    
    /**
     * @class $.jqplot.AxisTickRenderer
     * @classdesc A "tick" object showing the value of a tick/gridline on the plot.
     * @param {Object} options
     */
    $.jqplot.AxisTickRenderer = function (options) {
        
        // Group: Properties
        $.jqplot.ElemContainer.call(this);
        
        // prop: mark
        // tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
        this.mark = 'outside';
        // name of the axis associated with this tick
        this.axis = null;
        // prop: showMark
        // whether or not to show the mark on the axis.
        this.showMark = true;
        // prop: showGridline
        // whether or not to draw the gridline on the grid at this tick.
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
        // whether or not to show the tick (mark and label).
        // Setting this to false requires more testing.  It is recommended
        // to set showLabel and showMark to false instead.
        this.show = true;
        // prop: showLabel
        // whether or not to show the label.
        this.showLabel = true;
        this.label = null;
        this.value = null;
        this._styles = {};
        // prop: formatter
        // A class of a formatter for the tick text.  sprintf by default.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: prefix
        // String to prepend to the tick label.
        // Prefix is prepended to the formatted tick label.
        this.prefix = '';
        // prop: suffix
        // String to append to the tick label.
        // Suffix is appended to the formatted tick label.
        this.suffix = '';
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: fontFamily
        // css spec for the font-family css attribute.
        this.fontFamily = null;
        // prop: fontSize
        // css spec for the font-size css attribute.
        this.fontSize = null;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor = null;
        // prop: escapeHTML
        // true to escape HTML entities in the label.
        this.escapeHTML = false;
        this._elem = null;
        this._breakTick = false;
        
        $.extend(true, this, options);
        
    };
    
    /**
     * Init
     * @param {Object} options
     */
    $.jqplot.AxisTickRenderer.prototype.init = function (options) {
        $.extend(true, this, options);
    };
    
    $.jqplot.AxisTickRenderer.prototype = new $.jqplot.ElemContainer();
    $.jqplot.AxisTickRenderer.prototype.constructor = $.jqplot.AxisTickRenderer;
    
    /**
     * Sets the tick
     * @param   {String}  value    
     * @param   {String}  axisName 
     * @param   {Boolean}  isMinor
     * @returns {Object}
     */
    $.jqplot.AxisTickRenderer.prototype.setTick = function (value, axisName, isMinor) {
        this.value = value;
        this.axis = axisName;
        if (isMinor) {
            this.isMinorTick = true;
        }
        return this;
    };
    
    /**
     * Draws the axis
     * @returns {Object}
     */
    $.jqplot.AxisTickRenderer.prototype.draw = function () {
        
        var style,
            s;
        
        if (this.label === null) {
            this.label = this.prefix + this.formatter(this.formatString, this.value) + this.suffix;
        }
        
        style = {position: 'absolute'};
        
        if (Number(this.label)) {
            style.whiteSpace = 'nowrap';
        }
        
        // Memory Leaks patch
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null;
        }

        this._elem = $("<div/>", { "class": "jqplot-" + this.axis + "-tick" });
        
        if (!this.escapeHTML) {
            this._elem.html(this.label);
        } else {
            this._elem.text(this.label);
        }
        
        this._elem.css(style);

        for (s in this._styles) {
            if (this._styles.hasOwnProperty(s)) {
                this._elem.css(s, this._styles[s]);
            }
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
        
        if (this._breakTick) {
            this._elem.addClass('jqplot-breakTick');
        }
        
        return this._elem;
    };
    
    /**
     * Default Tick Formatter
     * @param   {String}   format
     * @param   {String} val    The date
     * @returns {String}
     */
    $.jqplot.DefaultTickFormatter = function (format, val) {
        if (typeof val === 'number') {
            if (!format) {
                format = $.jqplot.config.defaultTickFormatString;
            }
            return $.jqplot.sprintf(format, val);
        } else {
            return String(val);
        }
    };
    
    /**
     * Percent Tick Formatter
     * @param   {String}   format
     * @param   {String}   val
     * @returns {String}
     */
    $.jqplot.PercentTickFormatter = function (format, val) {
        if (typeof val === 'number') {
            val = 100 * val;
            if (!format) {
                format = $.jqplot.config.defaultTickFormatString;
            }
            return $.jqplot.sprintf(format, val);
        } else {
            return String(val);
        }
    };
    
    /**
     * @TODO
     */
    $.jqplot.AxisTickRenderer.prototype.pack = function () {
        // TODO
    };
    
}(jQuery));