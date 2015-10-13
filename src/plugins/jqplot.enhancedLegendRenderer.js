/*jslint browser: true, plusplus: true, nomen: true, white: false, continue: true */
/*global jQuery, console */

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
     * Called with scope of plot.
     */
    var postDraw = function () {
            var e;
            if (this.legend.renderer.constructor === $.jqplot.EnhancedLegendRenderer && this.legend.seriesToggle && this.legend._elem) {
                e = this.legend._elem.detach();
                this.eventCanvas._elem.after(e);
            }
        },
        
        /**
         * [[Description]]
         * @param   {Object} ev [[Description]]
         * @returns {Object} [[Description]]
         */
        getEventPosition = function (ev) {

            var plot,
                go,
                gridPos,
                dataPos,
                an,
                ax,
                n,
                axis;

            plot = ev.data.plot;
            go = plot.eventCanvas._elem.offset();
            gridPos = {x: ev.pageX - go.left, y: ev.pageY - go.top};
            dataPos = {xaxis: null, yaxis: null, x2axis: null, y2axis: null, y3axis: null, y4axis: null, y5axis: null, y6axis: null, y7axis: null, y8axis: null, y9axis: null, yMidAxis: null};
            an = ['xaxis', 'yaxis', 'x2axis', 'y2axis', 'y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis', 'yMidAxis'];
            ax = plot.axes;

            for (n = 11; n > 0; n--) {
                axis = an[n - 1];
                if (ax[axis].show) {
                    dataPos[axis] = ax[axis].series_p2u(gridPos[axis.charAt(0)]);
                }
            }

            return {
                offsets: go,
                gridPos: gridPos,
                dataPos: dataPos
            };
        },
        
        /**
         * [[Description]]
         * @param {Object} ev [[Description]]
         */
        handleToggle = function (ev) {

            // @TODO Bind here a toggle event

            var positions,
                p,
                evt,
                d,
                s,
                replot,
                plot,
                speed,
                sidx,
                showing,
                /**
                 * [[Description]]
                 */
                doLegendToggle = function () {

                    var opts = {},
                        s;

                    if (replot) {

                        if ($.isPlainObject(replot)) {
                            $.extend(true, opts, replot);
                        }

                        plot.replot(opts);

                        // if showing, there was no canvas element to fade in, so hide here
                        // and then do a fade in.
                        if (showing && speed) {

                            s = plot.series[sidx];

                            if (s.shadowCanvas._elem) {
                                s.shadowCanvas._elem.hide().fadeIn(speed);
                            }

                            s.canvas._elem.hide().fadeIn(speed);
                            s.canvas._elem.nextAll('.jqplot-point-label.jqplot-series-' + s.index).hide().fadeIn(speed);

                        }

                    } else {

                        s = plot.series[sidx];

                        if (s.canvas._elem.is(':hidden') || !s.show) {
                            // Not sure if there is a better way to check for showSwatches and showLabels === true.
                            // Test for "undefined" since default values for both showSwatches and showLables is true.
                            if (typeof plot.options.legend.showSwatches === 'undefined' || plot.options.legend.showSwatches === true) {
                                plot.legend._elem.find('td').eq(sidx * 2).addClass('jqplot-series-hidden');
                            }
                            if (typeof plot.options.legend.showLabels === 'undefined' || plot.options.legend.showLabels === true) {
                                plot.legend._elem.find('td').eq((sidx * 2) + 1).addClass('jqplot-series-hidden');
                            }
                        } else {
                            if (typeof plot.options.legend.showSwatches === 'undefined' || plot.options.legend.showSwatches === true) {
                                plot.legend._elem.find('td').eq(sidx * 2).removeClass('jqplot-series-hidden');
                            }
                            if (typeof plot.options.legend.showLabels === 'undefined' || plot.options.legend.showLabels === true) {
                                plot.legend._elem.find('td').eq((sidx * 2) + 1).removeClass('jqplot-series-hidden');
                            }
                        }

                    }

                };

            positions = getEventPosition(ev);
            p = ev.data.plot;
            evt = $.Event('jqplotLegendToggleSerie');

            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;

            d = ev.data;
            s = d.series;
            replot = d.replot;
            plot = d.plot;
            speed = d.speed;
            sidx = s.index;
            showing = false;

            evt.name = p.series[sidx].label;
            $(this).trigger(evt, [positions.gridPos, positions.dataPos, p]);

            if (s.canvas._elem.is(':hidden') || !s.show) {
                showing = true;
            }

            s.toggleDisplay(ev, doLegendToggle);

        };
    
    /**
     * @class $.jqplot.EnhancedLegendRenderer
     * @classdesc Legend renderer which can specify the number of rows and/or columns in the legend.
     */
    $.jqplot.EnhancedLegendRenderer = function () {
        $.jqplot.TableLegendRenderer.call(this);
    };
    
    $.jqplot.EnhancedLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.EnhancedLegendRenderer.prototype.constructor = $.jqplot.EnhancedLegendRenderer;
    
    /**
     * Called with scope of legend.
     * @param {[[Type]]} options [[Description]]
     */
    $.jqplot.EnhancedLegendRenderer.prototype.init = function (options) {
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        // prop: seriesToggle
        // false to not enable series on/off toggling on the legend.
        // true or a fadein/fadeout speed (number of milliseconds or 'fast', 'normal', 'slow') 
        // to enable show/hide of series on click of legend item.
        this.seriesToggle = 'normal';
        // prop: seriesToggleReplot
        // True to replot the chart after toggling series on/off.
        // This will set the series show property to false.
        // This allows for rescaling or other maniplation of chart.
        // Set to an options object (e.g. {resetAxes: true}) for replot options.
        this.seriesToggleReplot = false;
        // prop: disableIEFading
        // true to toggle series with a show/hide method only and not allow fading in/out.  
        // This is to overcome poor performance of fade in some versions of IE.
        this.disableIEFading = true;
        // prop: legendTextcolor
        // swatch: td color will be the same as the swatch color
        this.legendTextColor = "swatch";
        
        $.extend(true, this, options);
        
        if (this.seriesToggle) {
            $.jqplot.postDrawHooks.push(postDraw);
        }
    };
    
    /**
     * Called with scope of legend
     * @param   {[[Type]]} offsets [[Description]]
     * @param   {Object}   plot    [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    $.jqplot.EnhancedLegendRenderer.prototype.draw = function (offsets, plot) {
        
        var legend = this,
            series,
            s,
            pad,
            reverse,
            nr,
            nc,
            i,
            j,
            tr,
            td1,
            td2,
            lt,
            rs,
            div,
            div0,
            div1,
            idx,
            color,
            speed;
        
        if (!this.show) {
            return this._elem;
        }
            
        series = this._series;

        this._elem = $("<table/>", {
            "class": "jqplot-table-legend"
        }).css({
            "position": "absolute",
            "background": this.background,
            "border": this.border,
            "fontSize": this.fontSize,
            "color": this.textColor,
            "marginTop": this.marginTop,
            "marginBottom": this.marginBottom,
            "marginLeft": this.marginLeft,
            "marginRight": this.marginRight
        });
        
        if (this.seriesToggle) {
            this._elem.css('z-index', '3');
        }

        pad = false;
        reverse = false;

        if (this.numberRows) {
            nr = this.numberRows;
            if (!this.numberColumns) {
                nc = Math.ceil(series.length / nr);
            } else {
                nc = this.numberColumns;
            }
        } else if (this.numberColumns) {
            nc = this.numberColumns;
            nr = Math.ceil(series.length / this.numberColumns);
        } else {
            nr = series.length;
            nc = 1;
        }

        idx = 0;

        // check to see if we need to reverse
        for (i = series.length - 1; i >= 0; i--) {
            if ((nc === 1 && series[i]._stack) || series[i].renderer.constructor === $.jqplot.BezierCurveRenderer) {
                reverse = true;
            }
        }

        for (i = 0; i < nr; i++) {

            tr = $("<tr/>", {
                "class": "jqplot-table-legend"
            });

            if (reverse) {
                tr.prependTo(this._elem);
            } else {
                tr.appendTo(this._elem);
            }

            for (j = 0; j < nc; j++) {

                if (idx < series.length && (series[idx].show || series[idx].showLabel)) {

                    s = series[idx];
                    lt = this.labels[idx] || s.label.toString();

                    if (lt) {

                        color = s.color;

                        if (!reverse) {
                            if (i > 0) {
                                pad = true;
                            } else {
                                pad = false;
                            }
                        } else {
                            if (i === nr - 1) {
                                pad = false;
                            } else {
                                pad = true;
                            }
                        }

                        rs = (pad) ? this.rowSpacing : '0';

                        td1 = $("<td/>", {
                            "class": "jqplot-table-legend jqplot-table-legend-swatch"
                        }).css({textAlign: 'center', paddingTop: rs });

                        div0 = $("<div/>", {
                            "class": "jqplot-table-legend-swatch-outline"
                        });
                        
                        div1 = $("<div/>", {
                            "class": "jqplot-table-legend-swatch"
                        }).css({backgroundColor: color, borderColor: color});

                        td1.append(div0.append(div1));

                        td2 = $("<td/>", {
                            "class": "jqplot-table-legend jqplot-table-legend-label"
                        }).css({ paddingTop: rs, color: (legend.legendTextColor === "swatch") ? color : "inherit" });

                        // td1 = $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
                        //     '<div><div class="jqplot-table-legend-swatch" style="background-color:'+color+';border-color:'+color+';"></div>'+
                        //     '</div></td>');
                        // td2 = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
                        if (this.escapeHtml) {
                            td2.text(lt);
                        } else {
                            td2.html(lt);
                        }

                        if (reverse) {
                            if (this.showLabels) {
                                td2.prependTo(tr);
                            }
                            if (this.showSwatches) {
                                td1.prependTo(tr);
                            }
                        } else {
                            if (this.showSwatches) {
                                td1.appendTo(tr);
                            }
                            if (this.showLabels) {
                                td2.appendTo(tr);
                            }
                        }

                        if (this.seriesToggle) {

                            // add an overlay for clicking series on/off
                            // div0 = $(document.createElement('div'));
                            // div0.addClass('jqplot-table-legend-overlay');
                            // div0.css({position:'relative', left:0, top:0, height:'100%', width:'100%'});
                            // tr.append(div0);

                            if (typeof this.seriesToggle === 'string' || typeof this.seriesToggle === 'number') {
                                if (!$.jqplot.use_excanvas || !this.disableIEFading) {
                                    speed = this.seriesToggle;
                                }
                            }

                            if (this.showSwatches) {
                                td1.bind('click', {series: s, speed: speed, plot: plot, replot: this.seriesToggleReplot}, handleToggle);
                                td1.addClass('jqplot-seriesToggle');
                            }

                            if (this.showLabels) {
                                td2.bind('click', {series: s, speed: speed, plot: plot, replot: this.seriesToggleReplot}, handleToggle);
                                td2.addClass('jqplot-seriesToggle');
                            }

                            // for series that are already hidden, add the hidden class
                            if (!s.show && s.showLabel) {
                                td1.addClass('jqplot-series-hidden');
                                td2.addClass('jqplot-series-hidden');
                            }

                        }

                        pad = true;
                    }
                }
                idx++;
            }

            td1 = td2 = div0 = div1 = null;

        }
        
        return this._elem;
        
    };
    
}(jQuery));