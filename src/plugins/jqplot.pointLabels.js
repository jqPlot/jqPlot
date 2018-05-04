/*jslint browser: true, plusplus: true, nomen: true, white: false, continue:true */
/*global jQuery, console, jqPlot */

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
    
    var locationIndicies = {'nw': 0, 'n': 1, 'ne': 2, 'e': 3, 'se': 4, 's': 5, 'sw': 6, 'w': 7},
        oppositeLocations = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];
    
    /**
     * Class: $.jqplot.PointLabels
     * Plugin for putting labels at the data points.
     * 
     * To use this plugin, include the js
     * file in your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.pointLabels.js"></script>
     * 
     * By default, the last value in the data ponit array in the data series is used
     * for the label.  For most series renderers, extra data can be added to the 
     * data point arrays and the last value will be used as the label.
     * 
     * For instance, 
     * this series:
     * 
     * > [[1,4], [3,5], [7,2]]
     * 
     * Would, by default, use the y values in the labels.
     * Extra data can be added to the series like so:
     * 
     * > [[1,4,'mid'], [3 5,'hi'], [7,2,'low']]
     * 
     * And now the point labels would be 'mid', 'low', and 'hi'.
     * 
     * Options to the point labels and a custom labels array can be passed into the
     * "pointLabels" option on the series option like so:
     * 
     * > series:[{pointLabels:{
     * >    labels:['mid', 'hi', 'low'],
     * >    location:'se',
     * >    ypadding: 12
     * >    }
     * > }]
     * 
     * A custom labels array in the options takes precendence over any labels
     * in the series data.  If you have a custom labels array in the options,
     * but still want to use values from the series array as labels, set the
     * "labelsFromSeries" option to true.
     * 
     * By default, html entities (<, >, etc.) are escaped in point labels.  
     * If you want to include actual html markup in the labels, 
     * set the "escapeHTML" option to false.
     * 
     */
    $.jqplot.PointLabels = function (options) {
        // Group: Properties
        //
        // prop: show
        // show the labels or not.
        this.show = $.jqplot.config.enablePlugins;
        // prop: location
        // compass location where to position the label around the point.
        // 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.location = 'n';
        // prop: labelsFromSeries
        // true to use labels within data point arrays.
        this.labelsFromSeries = false;
        // prop: seriesLabelIndex
        // array index for location of labels within data point arrays.
        // if null, will use the last element of the data point array.
        this.seriesLabelIndex = null;
        // prop: labels
        // array of arrays of labels, one array for each series.
        this.labels = [];
        // actual labels that will get displayed.
        // needed to preserve user specified labels in labels array.
        this._labels = [];
        // prop: stackedValue
        // true to display value as stacked in a stacked plot.
        // no effect if labels is specified.
        this.stackedValue = false;
        // prop: ypadding
        // vertical padding in pixels between point and label
        this.ypadding = 6;
        // prop: xpadding
        // horizontal padding in pixels between point and label
        this.xpadding = 6;
        // prop: escapeHTML
        // true to escape html entities in the labels.
        // If you want to include markup in the labels, set to false.
        this.escapeHTML = true;
        // prop: edgeTolerance
        // Number of pixels that the label must be away from an axis
        // boundary in order to be drawn.  Negative values will allow overlap
        // with the grid boundaries.
        this.edgeTolerance = -5;
        // prop: formatter
        // A class of a formatter for the tick text.  sprintf by default.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: hideZeros
        // true to not show a label for a value which is 0.
        this.hideZeros = false;
        this._elems = [];
        // prop: darkColor
        this.darkColor = "#000";
        // prop: brightColor
        this.brightColor = "#EEE";
        // prop: checkColorBrightnessLevel
        // true to check the color value levels
        this.checkColorBrightnessLevel = false;
        
        $.extend(true, this, options);
    };
    
    /**
     * called with scope of a series
     * @param {object} target         [[Description]]
     * @param {array} data           [[Description]]
     * @param {object} seriesDefaults [[Description]]
     * @param {object} opts           [[Description]]
     * @param {Object}   plot           [[Description]]
     */
    $.jqplot.PointLabels.init = function (target, data, seriesDefaults, opts, plot) {
        var options = $.extend(true, {}, seriesDefaults, opts);
        options.pointLabels = options.pointLabels || {};
        if (this.renderer.constructor === $.jqplot.BarRenderer && this.barDirection === 'horizontal' && !options.pointLabels.location) {
            options.pointLabels.location = 'e';
        }
        // add a pointLabels attribute to the series plugins
        this.plugins.pointLabels = new $.jqplot.PointLabels(options.pointLabels);
        this.plugins.pointLabels.setLabels.call(this);
    };
    
    /**
     * called with scope of series
     */
    $.jqplot.PointLabels.prototype.setLabels = function () {
        
        var p = this.plugins.pointLabels,
            labelIdx,
            d,
            i;
        
        if (p.seriesLabelIndex !== null) {
            labelIdx = p.seriesLabelIndex;
        } else if (this.renderer.constructor === $.jqplot.BarRenderer && this.barDirection === 'horizontal') {
            labelIdx = (this._plotData[0].length < 3) ? 0 : this._plotData[0].length - 1;
        } else {
            labelIdx = (this._plotData.length === 0) ? 0 : this._plotData[0].length - 1;
        }
        
        p._labels = [];
        
        if (p.labels.length === 0 || p.labelsFromSeries) {
            if (p.stackedValue) {
                if (this._plotData.length && this._plotData[0].length) {
                    // var idx = p.seriesLabelIndex || this._plotData[0].length -1;
                    for (i = 0; i < this._plotData.length; i++) {
                        p._labels.push(this._plotData[i][labelIdx]);
                    }
                }
            } else {
                // var d = this._plotData;
                d = this.data;
                if (this.renderer.constructor === $.jqplot.BarRenderer && this.waterfall) {
                    d = this._data;
                }
                if (d.length && d[0].length) {
                    // var idx = p.seriesLabelIndex || d[0].length -1;
                    for (i = 0; i < d.length; i++) {
                        p._labels.push(d[i][labelIdx]);
                    }
                }
                d = null;
            }
        } else if (p.labels.length) {
            p._labels = p.labels;
        }
    };
    
    /**
     * [[Description]]
     * @param   {object} elem                     [[Description]]
     * @param   {string} [location=this.location] [[Description]]
     * @param   {number} [padding=this.xpadding]  [[Description]]
     * @returns {number} [[Description]]
     */
    $.jqplot.PointLabels.prototype.xOffset = function (elem, location, padding) {
        
        var offset;
        
        location = location || this.location;
        padding = padding || this.xpadding;
        
        switch (location) {
        case 'nw':
            offset = -elem.outerWidth(true) - this.xpadding;
            break;
        case 'n':
            offset = -elem.outerWidth(true) / 2;
            break;
        case 'ne':
            offset =  this.xpadding;
            break;
        case 'e':
            offset = this.xpadding;
            break;
        case 'se':
            offset = this.xpadding;
            break;
        case 's':
            offset = -elem.outerWidth(true) / 2;
            break;
        case 'sw':
            offset = -elem.outerWidth(true) - this.xpadding;
            break;
        case 'w':
            offset = -elem.outerWidth(true) - this.xpadding;
            break;
        default: // same as 'nw'
            offset = -elem.outerWidth(true) - this.xpadding;
            break;
        }
        return offset;
    };
    
    /**
     * [[Description]]
     * @param   {object} elem                     [[Description]]
     * @param   {string} [location=this.location] [[Description]]
     * @param   {number} [padding=this.xpadding]  [[Description]]
     * @returns {number} [[Description]]
     */
    $.jqplot.PointLabels.prototype.yOffset = function (elem, location, padding) {
        
        var offset;
        
        location = location || this.location;
        padding = padding || this.xpadding;
        
        switch (location) {
        case 'nw':
            offset = -elem.outerHeight(true) - this.ypadding;
            break;
        case 'n':
            offset = -elem.outerHeight(true) - this.ypadding;
            break;
        case 'ne':
            offset = -elem.outerHeight(true) - this.ypadding;
            break;
        case 'e':
            offset = -elem.outerHeight(true) / 2;
            break;
        case 'se':
            offset = this.ypadding;
            break;
        case 's':
            offset = this.ypadding;
            break;
        case 'sw':
            offset = this.ypadding;
            break;
        case 'w':
            offset = -elem.outerHeight(true) / 2;
            break;
        default: // same as 'nw'
            offset = -elem.outerHeight(true) - this.ypadding;
            break;
        }
        return offset;
    };

    /**
     * called with scope of series
     * @param {Object}   sctx    [[Description]]
     * @param {object} options [[Description]]
     * @param {Object}   plot    [[Description]]
     */
    $.jqplot.PointLabels.draw = function (sctx, options, plot) {
        
		var i,
            len,
            p = this.plugins.pointLabels,
			pd = this._plotData,
			xax = this._xaxis,
			yax = this._yaxis,
			elem,
            helem,
            that = this,
            ax,
            label,
            location,
            ell,
            elt,
            elr,
            elb,
            et,
            scl,
            sct,
            scr,
            scb,
            barPoint,
            serieColor;

        // set labels again in case they have changed.
        p.setLabels.call(this);
        
        // remove any previous labels
        for (i = 0, len = p._elems.length; i < len; i++) {
            // Memory Leaks patch
            // p._elems[i].remove();
            if (p._elems[i]) {
                p._elems[i].emptyForce();
            }
        }
        
        p._elems.splice(0, p._elems.length);

        if (p.show) {
            
            ax = '_' + this._stackAxis + 'axis';
        
            if (!p.formatString) {
                p.formatString = this[ax]._ticks[0].formatString;
                p.formatter = this[ax]._ticks[0].formatter;
            }

            for (i = 0, len = p._labels.length; i < len; i++) {
                
                label = p._labels[i];
                location = p.location;
                
                if (label === null || (p.hideZeros && parseInt(label, 10) === 0)) {
                    continue;
                }
                
                label = p.formatter(p.formatString, label);

                helem = document.createElement('div');
                p._elems[i] = $(helem);

                elem = p._elems[i];

                elem
                    .addClass('jqplot-point-label jqplot-series-' + this.index + ' jqplot-point-' + i)
                    .css('position', 'absolute');
                
                serieColor = (this._dataColors && this._dataColors[i]) ? this._dataColors[i] : this.color;
                
                //console.log("checking color", serieColor);
                
                // Set the color of the label element when it matters
                // @TODO: check contrast between background and foreground colors
                if ((this.barDirection === "horizontal" && p.location === "w") || p.checkColorBrightnessLevel) {
                    if (!$.jqplot.isDarkColor(serieColor)) {
                        elem.addClass('jqplot-point-darkColor');
                        if (p.darkColor !== null) {
                            elem.css('color', p.darkColor);
                        }
                    } else {
                        elem.addClass('jqplot-point-brightColor');
                        if (p.brightColor !== null) {
                            elem.css('color', p.brightColor);
                        }
                    }
                }

                elem.insertAfter(sctx.canvas);

                if (p.escapeHTML) {
                    elem.text(label);
                } else {
                    elem.html(label);
                }

                if ((this.fillToZero && pd[i][1] < 0) || (this.fillToZero && this._type === 'bar' && this.barDirection === 'horizontal' && pd[i][0] < 0) || (this.waterfall && parseInt(label, 10)) < 0) {
                    location = oppositeLocations[locationIndicies[location]];
                }

                ell = xax.u2p(pd[i][0]) + p.xOffset(elem, location);
                elt = yax.u2p(pd[i][1]) + p.yOffset(elem, location);

                // we have stacked chart but are not showing stacked values,
                // place labels in center.
                if (this._stack && !p.stackedValue) {
                    barPoint = that._barPoints[i];
                    if (this.barDirection === "vertical") {
                        elt = (barPoint[0][1] + barPoint[1][1]) / 2 + plot._gridPadding.top - 0.5 * elem.outerHeight(true);
                        ell = (barPoint[2][0] + barPoint[0][0]) / 2 + plot._gridPadding.left - 0.5 * elem.outerWidth(true);
                    } else {
                        ell = (barPoint[2][0] + barPoint[0][0]) / 2 + plot._gridPadding.left - 0.5 * elem.outerWidth(true);
                    }
                }

                if (this.renderer.constructor === $.jqplot.BarRenderer) {
                    if (this.barDirection === "vertical") {
                        ell += this._barNudge;
                    } else {
                        elt -= this._barNudge;
                    }
                }
                
                elem.css({'left': ell, 'top': elt });

                elr = ell + elem.width();
                elb = elt + elem.height();
                et = p.edgeTolerance;
                scl = $(sctx.canvas).position().left;
                sct = $(sctx.canvas).position().top;
                scr = sctx.canvas.width + scl;
                scb = sctx.canvas.height + sct;
                // if label is outside of allowed area, remove it
                /*if (ell - et < scl || elt - et < sct || elr + et > scr || elb + et > scb) {
                    elem.remove();
                }*/

                elem = null;
                helem = null;
            }

            // finally, animate them if the series is animated
            // if (this.renderer.animation && this.renderer.animation._supported && this.renderer.animation.show && plot._drawCount < 2) {
            //     var sel = '.jqplot-point-label.jqplot-series-'+this.index;
            //     $(sel).hide();
            //     $(sel).fadeIn(1000);
            // }

        }
    };
    
    $.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);
    $.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw);
    
}(jQuery));