/*jslint browser: true, plusplus: true, nomen: true, white: false */
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
         * @param {string} location
         * @param {object} gridpos
         * @param {object} plot
         */
    var setTooltipPosition = function (location, gridpos, plot) {
        
        var c = plot.plugins.cursor,
            elem = c._tooltipElem,
            x,
            y;
        
        switch (location) {
        case 'nw':
            x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
            y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
            break;
        case 'n':
            x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) / 2;
            y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
            break;
        case 'ne':
            x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
            y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
            break;
        case 'e':
            x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
            y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true) / 2;
            break;
        case 'se':
            x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
            y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
            break;
        case 's':
            x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) / 2;
            y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
            break;
        case 'sw':
            x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
            y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
            break;
        case 'w':
            x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
            y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true) / 2;
            break;
        default:
            x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
            y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
            break;
        }

        elem.css({'left': x, 'top': y});
        elem = null;
    },
        
        /**
         * Resets the selection
         */
        resetSelection = function () {
            var sel;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.empty) {  // Chrome
                    sel.empty();
                } else if (sel.removeAllRanges) {  // Firefox
                    sel.removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }
        },
    
        /**
         * @param   {Object}   plot
         * @param   {integer} x 
         * @param   {integer} y 
         * @returns {object}
         */
        getIntersectingPoints = function (plot, x, y) {

            var ret = {
                    indices: [],
                    data: []
                },
                s,
                i,
                d0,
                d,
                j,
                r,
                p,
                threshold,
                c = plot.plugins.cursor,
                seriesLen = plot.series.length,
                gridDataLen = 0;

            for (i = 0; i < seriesLen; i++) {

                s = plot.series[i];
                r = s.renderer;

                if (s.show) {

                    threshold = c.intersectionThreshold;

                    if (s.showMarker) {
                        threshold += s.markerRenderer.size / 2;
                    }

                    gridDataLen = s.gridData.length;

                    for (j = 0; j < gridDataLen; j++) {

                        p = s.gridData[j];
                        // check vertical line

                        if (c.showVerticalLine) {
                            if (Math.abs(x - p[0]) <= threshold) {
                                ret.indices.push(i);
                                ret.data.push({
                                    seriesIndex: i,
                                    pointIndex: j,
                                    gridData: p,
                                    data: s.data[j]
                                });
                            }
                        }
                    }
                }
            }
            return ret;
        },

        /**
         * @param {Object} gridpos 
         * @param {Number} datapos 
         * @param {Object} plot    
         */
        updateTooltip = function (gridpos, datapos, plot) {

            var c = plot.plugins.cursor,
                serie,
                series = plot.series,
                seriesLen = series.length,
                s = '',
                addbr = false,
                data,
                g,
                i,
                j,
                tooltipAxisGroupLen,
                serieIndex,
                af,
                afstr,
                yaxisStr,
                xaxisStr,
                sx,
                sy,
                yfstr,
                xfstr,
                ret,
                idx,
                label,
                cellid,
                ystr,
                xstr;

            if (c.showTooltipGridPosition) {
                s = gridpos.x + ', ' + gridpos.y;
                addbr = true;
            }

            if (c.showTooltipUnitPosition) {

                for (i = 0, tooltipAxisGroupLen = c.tooltipAxisGroups.length; i < tooltipAxisGroupLen; i++) {

                    serieIndex = i;
                    
                    g = c.tooltipAxisGroups[i];

                    if (addbr) {
                        s += '<br />';
                    } else {
                        
                        for (j = 0; j < g.length; j++) {
                            if (j) {
                                s += ', ';
                            }
                            af = plot.axes[g[j]]._ticks[0].formatter;
                            afstr = plot.axes[g[j]]._ticks[0].formatString;
                            s += af(afstr, datapos[g[j]]);
                        }
                        
                    }

                    if (c.yaxis || c.xaxis) {

                        if (c.yaxis && c.yaxis.formatter) {
                            yaxisStr = c.yaxis.formatter(series[i]._yaxis._ticks[0].formatString, datapos[g[1]], serieIndex);
                        } else {
                            yfstr = g._yaxis._ticks[0].formatString;
                            sx = g._yaxis._ticks[0].formatter(yfstr, data[1], serieIndex);
                        }

                        if (c.xaxis && c.xaxis.formatter) {
                            xaxisStr = c.xaxis.formatter(series[i]._xaxis._ticks[0].formatString, datapos[g[0]], serieIndex);
                        } else {
                            xfstr = g._xaxis._ticks[0].formatString;
                            sx = g._xaxis._ticks[0].formatter(xfstr, data[0], serieIndex);
                        }

                        s += $.jqplot.sprintf(c.tooltipFormatString, xaxisStr, yaxisStr);

                    } else if (c.useAxesFormatters) {

                        for (j = 0; j < g.length; j++) {
                            if (j) {
                                s += ', ';
                            }
                            af = plot.axes[g[j]]._ticks[0].formatter;
                            afstr = plot.axes[g[j]]._ticks[0].formatString;
                            s += af(afstr, datapos[g[j]], serieIndex);
                        }

                    } else {
                        s += $.jqplot.sprintf(c.tooltipFormatString, datapos[g[0]], datapos[g[1]]);
                    }

                    addbr = true;

                }
            }

            if (c.showTooltipDataPosition) {

                ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);

                for (i = 0; i < seriesLen; i++) {

                    serieIndex = i;
                    serie = series[i];

                    if (serie.show) {

                        idx = serie.index;
                        label = serie.label.toString();

                        if (c.useSeriesColor) {
                            label = $.jqplot.sprintf("<span style=\"color:%s\">%s</span>", serie.color, label);
                        }

                        cellid = $.inArray(idx, ret.indices);
                        
                        sx = null;
                        sy = null;

                        if (cellid !== -1) {

                            data = ret.data[cellid].data;

                            if (c.yaxis || c.xaxis) {

                                if (c.yaxis && c.yaxis.formatter) {
                                    sy = c.yaxis.formatter(serie._yaxis._ticks[0].formatString, data[1], serieIndex);
                                } else {
                                    yfstr = serie._yaxis._ticks[0].formatString;
                                    sy = serie._yaxis._ticks[0].formatter(yfstr, data[1], serieIndex);
                                }

                                if (c.xaxis && c.xaxis.formatter) {
                                    sx = c.xaxis.formatter(serie._xaxis._ticks[0].formatString, data[0], serieIndex);
                                } else {
                                    xfstr = serie._xaxis._ticks[0].formatString;
                                    sx = serie._xaxis._ticks[0].formatter(xfstr, data[0], serieIndex);
                                }

                                if (!addbr && c.insertHead) {
                                    s += $.jqplot.sprintf(c.headTooltipFormatString, sx, sy);
                                    s += '<br />';
                                }

                            } else if (c.useAxesFormatters) {
                                
                                xfstr = serie._xaxis._ticks[0].formatString;
                                yfstr = serie._yaxis._ticks[0].formatString;
                                sx = serie._xaxis._ticks[0].formatter(xfstr, data[0], serieIndex);
                                sy = serie._yaxis._ticks[0].formatter(yfstr, data[1], serieIndex);
                                
                                if (!addbr && c.insertHead) {
                                    s += $.jqplot.sprintf(c.headTooltipFormatString, sx, sy);
                                    s += '<br />';
                                }
                                
                            } else {
                                sx = data[0];
                                sy = data[1];
                            }
                            
                            if (addbr) {
                                s += '<br />';
                            }
                            
                            s += $.jqplot.sprintf(c.tooltipFormatString, label, sx, sy);
                            
                            addbr = true;
                            
                        }
                    }
                }

            }

            if (s === "") {
                c._tooltipElem.css({display: 'none'});
            } else {
                c._tooltipElem.css({display: 'block'});
            }

            c._tooltipElem.html(s);
            
        },

        /**
         * @param   {Object}   option
         * @returns {object}
*/
        convertToShapeOption = function (option) {
            if (option) {
                var output = {};

                if (option.color) {
                    output.strokeStyle = option.color;
                }

                if (option.style) {
                    output.linePattern = option.style;
                }

                if (option.lineWidth) {
                    output.lineWidth = option.lineWidth;
                }

                return output;

            } else {
                return option;
            }
        },

        /**
         * @param {Object} gridp
         * @param {Object} plot     
         */
        moveLine = function (gridpos, plot) {

            var c = plot.plugins.cursor,
                ctx = c.cursorCanvas._ctx,
                ret,
                cells,
                i,
                optionsVertical,
                optionsHorizontal,
                idx,
                serie,
                series,
                label,
                data,
                cellid,
                sx,
                sy,
                yfstr,
                xfstr,
                xf,
                yf;

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if (c.showVerticalLine) {
                optionsVertical = convertToShapeOption(c.verticalLine);
                c.shapeRenderer.draw(ctx, [[gridpos.x, 0], [gridpos.x, ctx.canvas.height]], optionsVertical);
            }

            if (c.showHorizontalLine) {
                optionsHorizontal = convertToShapeOption(c.horizontalLine);
                c.shapeRenderer.draw(ctx, [[0, gridpos.y], [ctx.canvas.width, gridpos.y]], optionsHorizontal);
            }

            ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);

            if (c.showCursorLegend) {

                cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');

                for (i = 0; i < cells.length; i++) {

                    serie = series[i];
                    idx = $(cells[i]).data('seriesIndex');
                    series = plot.series[idx];
                    label = series.label.toString();
                    cellid = $.inArray(idx, ret.indices);
                    sx = null;
                    sy = null;

                    if (cellid !== -1) {

                        data = ret.data[cellid].data;

                        if (c.yaxis || c.xaxis) {
                            if (c.yaxis && c.yaxis.formatter) {
                                sy = c.yaxis.formatter(serie._yaxis._ticks[0].formatString, data[1], idx);
                            } else {
                                yfstr = series._yaxis._ticks[0].formatString;
                                sy = series._yaxis._ticks[0].formatter(yfstr, data[1], idx);
                            }

                            if (c.xaxis && c.xaxis.formatter) {
                                sx = c.xaxis.formatter(serie._xaxis._ticks[0].formatString, data[0], idx);
                            } else {
                                xfstr = series._xaxis._ticks[0].formatString;
                                sx = series._xaxis._ticks[0].formatter(xfstr, data[0], idx);
                            }

                        } else if (c.useAxesFormatters) {

                            xf = series._xaxis._ticks[0].formatter;
                            yf = series._yaxis._ticks[0].formatter;
                            xfstr = series._xaxis._ticks[0].formatString;
                            yfstr = series._yaxis._ticks[0].formatString;

                            sx = xf(xfstr, data[0], idx);
                            sy = yf(yfstr, data[1], idx);

                        } else {
                            sx = data[0];
                            sy = data[1];
                        }
                    }

                    if (plot.legend.escapeHtml) {
                        $(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
                    } else {
                        $(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
                    }
                }
            }
            ctx = null;
        },

        /**
         * 
         * @param {Object} gridpos 
         * @param {Object} plot    
         * @param {Object} ev      
         */
        moveTooltip = function (gridpos, plot, ev) {

            var c = plot.plugins.cursor,
                elem = c._tooltipElem,
                fallbackTooltipLocation = null,
                x,
                y,
                xPosition,
                yPosition;

            switch (c.tooltipLocation) {
            case 'nw':
                x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'n':
                x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) / 2;
                y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'ne':
                x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'e':
                x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true) / 2;
                break;
            case 'se':
                x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 's':
                x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) / 2;
                y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'sw':
                x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'w':
                x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true) / 2;
                break;
            default:
                x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            }

            if (c.constrainTooltipToScreen && typeof ev !== "undefined") {

                xPosition = "";
                yPosition = "";

                yPosition += c.tooltipLocation[0];
                xPosition += c.tooltipLocation.length > 1 ? c.tooltipLocation[1] : c.tooltipLocation[0];

                if (yPosition === 'n' && (ev.pageY - c.tooltipOffset - elem.outerHeight(true)) <= 0) {
                    fallbackTooltipLocation = 's';
                } else if (yPosition === 's' && ((ev.pageY + elem.outerHeight(true) + c.tooltipOffset) >= document.body.clientHeight)) {
                    fallbackTooltipLocation = 'n';
                } else if (yPosition === 'n' || yPosition === 's') {
                    fallbackTooltipLocation = yPosition;
                }

                if (xPosition === 'w' && (ev.pageX - elem.outerWidth(true)) <= 0) {
                    fallbackTooltipLocation += 'e';
                } else if (xPosition === 'e' && ((ev.pageX + elem.outerWidth(true)) >= document.body.clientWidth)) {
                    fallbackTooltipLocation += 'w';
                } else if (xPosition === 'e' || xPosition === 'w') {
                    fallbackTooltipLocation += xPosition;
                }

                if (fallbackTooltipLocation !== null) {
                    setTooltipPosition(fallbackTooltipLocation, gridpos, plot);
                    return;
                }
            }

            elem.css({'left': x, 'top': y});
            elem = null;

        },

        /**
         * 
         * @param {Object} plot 
         */
        positionTooltip = function (plot) {
            // fake a grid for positioning
            var grid = plot._gridPadding,
                c = plot.plugins.cursor,
                elem = c._tooltipElem,
                a,
                b;
            switch (c.tooltipLocation) {
            case 'nw':
                a = grid.left + c.tooltipOffset;
                b = grid.top + c.tooltipOffset;
                elem.css({'left': a, 'top': b});
                break;
            case 'n':
                a = (grid.left + (plot._plotDimensions.width - grid.right)) / 2 - elem.outerWidth(true) / 2;
                b = grid.top + c.tooltipOffset;
                elem.css({'left': a, 'top': b});
                break;
            case 'ne':
                a = grid.right + c.tooltipOffset;
                b = grid.top + c.tooltipOffset;
                elem.css({right: a, top: b});
                break;
            case 'e':
                a = grid.right + c.tooltipOffset;
                b = (grid.top + (plot._plotDimensions.height - grid.bottom)) / 2 - elem.outerHeight(true) / 2;
                elem.css({right: a, top: b});
                break;
            case 'se':
                a = grid.right + c.tooltipOffset;
                b = grid.bottom + c.tooltipOffset;
                elem.css({right: a, bottom: b});
                break;
            case 's':
                a = (grid.left + (plot._plotDimensions.width - grid.right)) / 2 - elem.outerWidth(true) / 2;
                b = grid.bottom + c.tooltipOffset;
                elem.css({left: a, bottom: b});
                break;
            case 'sw':
                a = grid.left + c.tooltipOffset;
                b = grid.bottom + c.tooltipOffset;
                elem.css({left: a, bottom: b});
                break;
            case 'w':
                a = grid.left + c.tooltipOffset;
                b = (grid.top + (plot._plotDimensions.height - grid.bottom)) / 2 - elem.outerHeight(true) / 2;
                elem.css({left: a, top: b});
                break;
            default:  // same as 'se'
                a = grid.right - c.tooltipOffset;
                b = grid.bottom + c.tooltipOffset;
                elem.css({right: a, bottom: b});
                break;
            }
            elem = null;
        },

        /**
         * @param {object} ev       
         * @param {number} gridpos  
         * @param {number} datapos  
         * @param {object} neighbor 
         * @param {Object}   plot     
         */
        handleClick = function (ev, gridpos, datapos, neighbor, plot) {

            ev.preventDefault();
            ev.stopImmediatePropagation();

            var c = plot.plugins.cursor;

            if (c.clickReset) {
                c.resetZoom(plot, c);
            }

            // Reset selection
            resetSelection();

            return false;

        },

        /**
         * 
         * @param {object} ev       
         * @param {number} gridpos  
         * @param {number} datapos  
         * @param {object} neighbor 
         * @param {Object}   plot     
         */
        handleDblClick = function (ev, gridpos, datapos, neighbor, plot) {

            ev.preventDefault();
            ev.stopImmediatePropagation();

            var c = plot.plugins.cursor,
                sel;    // object

            if (c.dblClickReset) {
                c.resetZoom(plot, c);
            }

            // Reset selection
            resetSelection();

            return false;

        },

        /**
         * 
         * @param {object} ev       
         * @param {number} gridpos  
         * @param {number} datapos  
         * @param {object} neighbor 
         * @param {Object}   plot     
         */
        handleMouseLeave = function (ev, gridpos, datapos, neighbor, plot) {

            var c = plot.plugins.cursor,
                cells,
                i,
                idx,
                ctx,
                series,
                label;

            c.onGrid = false;

            if (c.show) {
                $(ev.target).css('cursor', c.previousCursor);
                if (c.showTooltip && !(c._zoom.zooming && c.showTooltipOutsideZoom && !c.constrainOutsideZoom)) {
                    c._tooltipElem.empty();
                    c._tooltipElem.hide();
                }
                if (c.zoom) {
                    c._zoom.gridpos = gridpos;
                    c._zoom.datapos = datapos;
                }
                if (c.showVerticalLine || c.showHorizontalLine) {
                    ctx = c.cursorCanvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx = null;
                }
                if (c.showCursorLegend) {
                    cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
                    for (i = 0; i < cells.length; i++) {
                        idx = $(cells[i]).data('seriesIndex');
                        series = plot.series[idx];
                        label = series.label.toString();
                        if (plot.legend.escapeHtml) {
                            $(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, undefined, undefined));
                        } else {
                            $(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, undefined, undefined));
                        }

                    }
                }
            }
        },

        /**
         * 
         * @param {object} ev       
         * @param {number} gridpos  
         * @param {number} datapos  
         * @param {object} neighbor 
         * @param {Object}   plot     
         */
        handleMouseEnter = function (ev, gridpos, datapos, neighbor, plot) {
            var c = plot.plugins.cursor;
            c.onGrid = true;
            if (c.show) {
                c.previousCursor = ev.target.style.cursor;
                ev.target.style.cursor = c.style;
                if (c.showTooltip) {
                    updateTooltip(gridpos, datapos, plot);
                    if (c.followMouse) {
                        moveTooltip(gridpos, plot, ev);
                    } else {
                        positionTooltip(plot);
                    }
                    c._tooltipElem.show();
                }
                if (c.showVerticalLine || c.showHorizontalLine) {
                    moveLine(gridpos, plot);
                }
            }

        },

        /**
         * 
         * @param {object} ev       
         * @param {number} gridpos  
         * @param {number} datapos  
         * @param {object} neighbor 
         * @param {Object}   plot     
         */
        handleMouseMove = function (ev, gridpos, datapos, neighbor, plot) {
            var c = plot.plugins.cursor;
            if (c.show) {
                if (c.showTooltip) {
                    updateTooltip(gridpos, datapos, plot);
                    if (c.followMouse) {
                        moveTooltip(gridpos, plot, ev);
                    }
                }
                if (c.showVerticalLine || c.showHorizontalLine) {
                    moveLine(gridpos, plot);
                }
            }
        },

        /**
         * 
         * @param   {Object} ev 
         * @returns {Object} 
         */
        getEventPosition = function (ev) {

            var plot = ev.data.plot,
                go = plot.eventCanvas._elem.offset(),
                gridPos = {x: ev.pageX - go.left, y: ev.pageY - go.top},
                dataPos,
                an,
                ax,
                n,
                axis;

            //////
            // TO DO: handle yMidAxis
            //////
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
         * 
         */
        drawZoomBox = function () {

            var start,
                end,
                ctx,
                l,
                t,
                h,
                w;

            // @TODO What does `this` stand for here?
            start = this._zoom.start;
            end = this._zoom.end;
            ctx = this.zoomCanvas._ctx;

            if (end[0] > start[0]) {
                l = start[0];
                w = end[0] - start[0];
            } else {
                l = end[0];
                w = start[0] - end[0];
            }

            if (end[1] > start[1]) {
                t = start[1];
                h = end[1] - start[1];
            } else {
                t = end[1];
                h = start[1] - end[1];
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.strokeStyle = '#999999';
            ctx.lineWidth = 1.0;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.clearRect(l, t, w, h);
            // IE won't show transparent fill rect, so stroke a rect also.
            ctx.strokeRect(l, t, w, h);
            ctx = null;

        },

        /**
         * 
         * @param {Object} ev 
         */
        handleZoomMove = function (ev) {

            var plot = ev.data.plot,
                c = plot.plugins.cursor,
                ctx,
                positions,
                gridpos,
                datapos,
                xpos,
                ypos,
                height,
                width;

            // don't do anything if not on grid.
            if (c.show && c.zoom && c._zoom.started && !c.zoomTarget) {

                ev.preventDefault();

                ctx = c.zoomCanvas._ctx;
                positions = getEventPosition(ev);
                gridpos = positions.gridPos;
                datapos = positions.dataPos;

                c._zoom.gridpos = gridpos;
                c._zoom.datapos = datapos;
                c._zoom.zooming = true;

                xpos = gridpos.x;
                ypos = gridpos.y;
                height = ctx.canvas.height;
                width = ctx.canvas.width;

                if (c.showTooltip && !c.onGrid && c.showTooltipOutsideZoom) {
                    updateTooltip(gridpos, datapos, plot);
                    if (c.followMouse) {
                        moveTooltip(gridpos, plot, ev);
                    }
                }

                if (c.constrainZoomTo === 'x') {
                    c._zoom.end = [xpos, height];
                } else if (c.constrainZoomTo === 'y') {
                    c._zoom.end = [width, ypos];
                } else {
                    c._zoom.end = [xpos, ypos];
                }

                // Reset selection
                resetSelection();

                drawZoomBox.call(c);
                ctx = null;
            }
        },

        /**
         * 
         * @param {Object} ev 
         */
        handleMouseUp = function (ev) {

            var plot = ev.data.plot,
                c = plot.plugins.cursor,
                xpos,
                ypos,
                datapos,
                height,
                width,
                axes,
                axis;

            if (c.zoom && c._zoom.zooming && !c.zoomTarget) {

                xpos = c._zoom.gridpos.x;
                ypos = c._zoom.gridpos.y;
                datapos = c._zoom.datapos;
                height = c.zoomCanvas._ctx.canvas.height;
                width = c.zoomCanvas._ctx.canvas.width;
                axes = plot.axes;

                if (c.constrainOutsideZoom && !c.onGrid) {
                    if (xpos < 0) {
                        xpos = 0;
                    } else if (xpos > width) {
                        xpos = width;
                    }

                    if (ypos < 0) {
                        ypos = 0;
                    } else if (ypos > height) {
                        ypos = height;
                    }

                    for (axis in datapos) {
                        if (datapos.hasOwnProperty(axis) && datapos[axis]) {
                            if (axis.charAt(0) === 'x') {
                                datapos[axis] = axes[axis].series_p2u(xpos);
                            } else {
                                datapos[axis] = axes[axis].series_p2u(ypos);
                            }
                        }
                    }
                }

                if (c.constrainZoomTo === 'x') {
                    ypos = height;
                } else if (c.constrainZoomTo === 'y') {
                    xpos = width;
                }

                c._zoom.end = [xpos, ypos];
                c._zoom.gridpos = {x: xpos, y: ypos};

                c.doZoom(c._zoom.gridpos, datapos, plot, c);
            }

            c._zoom.started = false;
            c._zoom.zooming = false;

            $(document).unbind('mousemove.jqplotCursor', handleZoomMove);

            if (document.onselectstart && c._oldHandlers.onselectstart !== null) {
                document.onselectstart = c._oldHandlers.onselectstart;
                c._oldHandlers.onselectstart = null;
            }
            if (document.ondrag && c._oldHandlers.ondrag !== null) {
                document.ondrag = c._oldHandlers.ondrag;
                c._oldHandlers.ondrag = null;
            }
            if (document.onmousedown && c._oldHandlers.onmousedown !== null) {
                document.onmousedown = c._oldHandlers.onmousedown;
                c._oldHandlers.onmousedown = null;
            }

        },

        /**
         * 
         * @param   {[[Type]]} ev       
         * @param   {Object}   gridpos  
         * @param   {[[Type]]} datapos  
         * @param   {[[Type]]} neighbor 
         * @param   {Object}   plot     
         * @returns {Boolean}  
         */
        handleMouseDown = function (ev, gridpos, datapos, neighbor, plot) {

            var c = plot.plugins.cursor,
                axes = plot.axes,
                ctx,
                ax;

            if (plot.plugins.mobile) {
                $(document).one('vmouseup.jqplot_cursor', {plot: plot}, handleMouseUp);
            } else {
                $(document).one('mouseup.jqplot_cursor', {plot: plot}, handleMouseUp);
            }

            if (document.onselectstart) {
                c._oldHandlers.onselectstart = document.onselectstart;
                document.onselectstart = function () { return false; };
            }

            if (document.ondrag) {
                c._oldHandlers.ondrag = document.ondrag;
                document.ondrag = function () { return false; };
            }

            if (document.onmousedown) {
                c._oldHandlers.onmousedown = document.onmousedown;
                document.onmousedown = function () { return false; };
            }

            if (c.zoom) {
                if (!c.zoomProxy) {
                    ctx = c.zoomCanvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx = null;
                }
                if (c.constrainZoomTo === 'x') {
                    c._zoom.start = [gridpos.x, 0];
                } else if (c.constrainZoomTo === 'y') {
                    c._zoom.start = [0, gridpos.y];
                } else {
                    c._zoom.start = [gridpos.x, gridpos.y];
                }

                c._zoom.started = true;

                for (ax in datapos) {
                    if (datapos.hasOwnProperty(ax)) {
                        // get zoom starting position.
                        c._zoom.axes.start[ax] = datapos[ax];
                    }
                }

                if (plot.plugins.mobile) {
                    $(document).bind('vmousemove.jqplotCursor', {plot: plot}, handleZoomMove);
                } else {
                    $(document).bind('mousemove.jqplotCursor', {plot: plot}, handleZoomMove);
                }

            }
        };

   
    /**
     * Class: $.jqplot.Cursor
     * Plugin class representing the cursor as displayed on the plot.
     */
    $.jqplot.Cursor = function (options) {
        // Group: Properties
        //
        // prop: style
        // CSS spec for cursor style
        this.style = 'crosshair';
        this.previousCursor = 'auto';
        // Constraint the tooltip position to the edge of screen.
        // This will change the position of tooltip if tooltip
        // is not completly displayed on screen due
        // to tooltip size & cursor position.
        this.constrainTooltipToScreen = false;
        // prop: show
        // whether to show the cursor or not.
        this.show = $.jqplot.config.enablePlugins;
        // prop: showTooltip
        // show a cursor position tooltip.  Location of the tooltip
        // will be controlled by followMouse and tooltipLocation.
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
        // prop: showTooltipDataPosition
        // Used with showVerticalLine to show intersecting data points in the tooltip.
        this.showTooltipDataPosition = false;
        // prop: tooltipFormatString
        // sprintf format string for the tooltip.
        // Uses Ash Searle's javascript sprintf implementation
        // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
        // See http://perldoc.perl.org/functions/sprintf.html for reference
        // Note, if showTooltipDataPosition is true, the default tooltipFormatString
        // will be set to the cursorLegendFormatString, not the default given here.
        this.tooltipFormatString = '%.4P, %.4P';
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
        // zoomProxy and zoomTarget properties are not directly set by user.
        // They Will be set through call to zoomProxy method.
        this.zoomProxy = false;
        this.zoomTarget = false;
        // prop: looseZoom
        // Will expand zoom range to provide more rounded tick values.
        // Works only with linear, log and date axes.
        this.looseZoom = true;
        // prop: clickReset
        // Will reset plot zoom if single click on plot without drag.
        this.clickReset = false;
        // prop: dblClickReset
        // Will reset plot zoom if double click on plot without drag.
        this.dblClickReset = true;
        // prop: showVerticalLine
        // draw a vertical line across the plot which follows the cursor.
        // When the line is near a data point, a special legend and/or tooltip can
        // be updated with the data values.
        this.showVerticalLine = false;
        // prop: showHorizontalLine
        // draw a horizontal line across the plot which follows the cursor.
        this.showHorizontalLine = false;
        // prop: constrainZoomTo
        // 'none', 'x' or 'y'
        this.constrainZoomTo = 'none';
        // // prop: autoscaleConstraint
        // // when a constrained axis is specified, true will
        // // auatoscale the adjacent axis.
        // this.autoscaleConstraint = true;
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        this._zoom = {
            start: [],
            end: [],
            started: false,
            zooming: false,
            isZoomed: false,
            axes: {
                start: {},
                end: {}
            },
            gridpos: {},
            datapos: {}
        };
        this._tooltipElem = null;
        this.zoomCanvas = null;
        this.cursorCanvas = null;
        // prop: intersectionThreshold
        // pixel distance from data point or marker to consider cursor lines intersecting with point.
        // If data point markers are not shown, this should be >= 1 or will often miss point intersections.
        this.intersectionThreshold = 2;
        // prop: showCursorLegend
        // Replace the plot legend with an enhanced legend displaying intersection information.
        this.showCursorLegend = false;
        // prop: cursorLegendFormatString
        // Format string used in the cursor legend.  If showTooltipDataPosition is true,
        // this will also be the default format string used by tooltipFormatString.
        this.cursorLegendFormatString = $.jqplot.Cursor.cursorLegendFormatString;
        // whether the cursor is over the grid or not.
        this._oldHandlers = {onselectstart: null, ondrag: null, onmousedown: null};
        // prop: constrainOutsideZoom
        // True to limit actual zoom area to edges of grid, even when zooming
        // outside of plot area.  That is, can't zoom out by mousing outside plot.
        this.constrainOutsideZoom = true;
        // prop: showTooltipOutsideZoom
        // True will keep updating the tooltip when zooming of the grid.
        this.showTooltipOutsideZoom = false;
        // true if mouse is over grid, false if not.
        this.onGrid = false;

        this.verticalLine = null;
        this.horizontalLine = null;

        this.insertHead = false;
        this.headTooltipFormatString = '%s';
        this.useSeriesColor = false;
        this.yaxis = null;
        this.xaxis = null;

        $.extend(true, this, options);
    };

    $.jqplot.Cursor.cursorLegendFormatString = '%s x:%s, y:%s';

    // called with scope of plot
    $.jqplot.Cursor.init = function (target, data, opts) {
        
        // add a cursor attribute to the plot
        var options = opts || {},
            c;
        
        this.plugins.cursor = new $.jqplot.Cursor(options.cursor);
        
        c = this.plugins.cursor;

        if (c.show) {
            
            this.eventListenerHooks.addOnce('jqplotMouseEnter', handleMouseEnter);
            this.eventListenerHooks.addOnce('jqplotMouseLeave', handleMouseLeave);
            this.eventListenerHooks.addOnce('jqplotMouseMove', handleMouseMove);

            if (c.showCursorLegend) {
                opts.legend = opts.legend || {};
                opts.legend.renderer =  $.jqplot.CursorLegendRenderer;
                opts.legend.formatString = this.plugins.cursor.cursorLegendFormatString;
                opts.legend.show = true;
            }

            if (c.zoom) {
                this.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);

                if (c.clickReset) {
                    this.eventListenerHooks.addOnce('jqplotClick', handleClick);
                }

                if (c.dblClickReset) {
                    this.eventListenerHooks.addOnce('jqplotDblClick', handleDblClick);
                }
            }

            /**
             * Add resetZoom method to the plot instance
             * plot1.resetZoom()
             */
            this.resetZoom = function () {
                var axes = this.axes,   // object
                    ax,
                    ctx;
                if (!c.zoomProxy) {
                    for (ax in axes) {
                        if (axes.hasOwnProperty(ax)) {
                            axes[ax].reset();
                            axes[ax]._ticks = [];
                            // fake out tick creation algorithm to make sure original auto
                            // computed format string is used if _overrideFormatString is true
                            if (c._zoom.axes[ax] !== undefined) {
                                axes[ax]._autoFormatString = c._zoom.axes[ax].tickFormatString;
                            }
                        }
                    }
                    this.redraw();
                } else {
                    ctx = this.plugins.cursor.zoomCanvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx = null;
                }
                this.plugins.cursor._zoom.isZoomed = false;
                this.target.trigger('jqplotResetZoom', [this, this.plugins.cursor]);
            };


            if (c.showTooltipDataPosition) {
                c.showTooltipUnitPosition = false;
                c.showTooltipGridPosition = false;
                if (typeof options.cursor.tooltipFormatString === "undefined") {
                    c.tooltipFormatString = $.jqplot.Cursor.cursorLegendFormatString;
                }
            }
        }
    };

    // called with context of plot
    $.jqplot.Cursor.postDraw = function () {
        
        var c = this.plugins.cursor,
            elem = document.createElement('div'),
            series,
            s,
            i,
            l,
            temp = [],
            ax;

        // Memory Leaks patch
        if (c.zoomCanvas) {
            c.zoomCanvas.resetCanvas();
            c.zoomCanvas = null;
        }

        if (c.cursorCanvas) {
            c.cursorCanvas.resetCanvas();
            c.cursorCanvas = null;
        }

        if (c._tooltipElem) {
            c._tooltipElem.emptyForce();
            c._tooltipElem = null;
        }
        
        if (c.zoom) {
            c.zoomCanvas = new $.jqplot.GenericCanvas();
            this.eventCanvas._elem.before(c.zoomCanvas.createElement(this._gridPadding, 'jqplot-zoom-canvas', this._plotDimensions, this));
            c.zoomCanvas.setContext();
        }
        
        c._tooltipElem = $(elem);
        
        elem = null;
        
        c._tooltipElem.addClass('jqplot-cursor-tooltip');
        c._tooltipElem.css({position: 'absolute', display: 'none'});

        if (c.zoomCanvas) {
            c.zoomCanvas._elem.before(c._tooltipElem);
        } else {
            this.eventCanvas._elem.before(c._tooltipElem);
        }

        if (c.showVerticalLine || c.showHorizontalLine) {
            c.cursorCanvas = new $.jqplot.GenericCanvas();
            this.eventCanvas._elem.before(c.cursorCanvas.createElement(this._gridPadding, 'jqplot-cursor-canvas', this._plotDimensions, this));
            c.cursorCanvas.setContext();
        }

        // if we are showing the positions in unit coordinates, and no axes groups
        // were specified, create a default set.
        if (c.showTooltipUnitPosition) {
            if (c.tooltipAxisGroups.length === 0) {
                series = this.series;
                for (i = 0, l = series.length; i < l; i++) {
                    s = series[i];
                    ax = s.xaxis + ',' + s.yaxis;
                    if ($.inArray(ax, temp) === -1) {
                        temp.push(ax);
                    }
                }
                for (i = 0, l = temp.length; i < l; i++) {
                    c.tooltipAxisGroups.push(temp[i].split(','));
                }
            }
        }
    };

    // Group: methods
    //
    // method: $.jqplot.Cursor.zoomProxy
    // links targetPlot to controllerPlot so that plot zooming of
    // targetPlot will be controlled by zooming on the controllerPlot.
    // controllerPlot will not actually zoom, but acts as an
    // overview plot.  Note, the zoom options must be set to true for
    // zoomProxy to work.
    $.jqplot.Cursor.zoomProxy = function (targetPlot, controllerPlot) {
        
        var tc = targetPlot.plugins.cursor,
            cc = controllerPlot.plugins.cursor,
            /**
             */
            plotZoom = function (ev, gridpos, datapos, plot, cursor) {
                tc.doZoom(gridpos, datapos, targetPlot, cursor);
            },
            /**
             */
            plotReset = function (ev, plot, cursor) {
                targetPlot.resetZoom();
            };
        
        tc.zoomTarget = true;
        tc.zoom = true;
        tc.style = 'auto';
        tc.dblClickReset = false;
        cc.zoom = true;
        cc.zoomProxy = true;
        
        controllerPlot.target.bind('jqplotZoom', plotZoom);
        controllerPlot.target.bind('jqplotResetZoom', plotReset);
        
    };

    /**
     *
     */
    $.jqplot.Cursor.prototype.resetZoom = function (plot, cursor) {
        var axes = plot.axes,   // object
            cax = cursor._zoom.axes,
            ax,
            ctx;
        if (!plot.plugins.cursor.zoomProxy && cursor._zoom.isZoomed) {
            for (ax in axes) {
                if (axes.hasOwnProperty(ax)) {
                    // axes[ax]._ticks = [];
                    // axes[ax].min = cax[ax].min;
                    // axes[ax].max = cax[ax].max;
                    // axes[ax].numberTicks = cax[ax].numberTicks;
                    // axes[ax].tickInterval = cax[ax].tickInterval;
                    // // for date axes
                    // axes[ax].daTickInterval = cax[ax].daTickInterval;
                    axes[ax].reset();
                    axes[ax]._ticks = [];
                    // fake out tick creation algorithm to make sure original auto
                    // computed format string is used if _overrideFormatString is true
                    axes[ax]._autoFormatString = cax[ax].tickFormatString;
                }
            }
            plot.redraw();
            cursor._zoom.isZoomed = false;
        } else {
            ctx = cursor.zoomCanvas._ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx = null;
        }
        plot.target.trigger('jqplotResetZoom', [plot, cursor]);
    };

    $.jqplot.Cursor.resetZoom = function (plot) {
        plot.resetZoom();
    };

    $.jqplot.Cursor.prototype.doZoom = function (gridpos, datapos, plot, cursor) {

        var c = cursor,
            axes = plot.axes,
            zaxes = c._zoom.axes,
            start = zaxes.start,
            end = zaxes.end,
            min,
            max,
            dp,
            span,
            newmin,
            newmax,
            curax,
            _numberTicks,
            ret,
            ctx = plot.plugins.cursor.zoomCanvas._ctx,
            ax;
        
        // don't zoom if zoom area is too small (in pixels)
        if ((c.constrainZoomTo === 'none' && Math.abs(gridpos.x - c._zoom.start[0]) > 6 && Math.abs(gridpos.y - c._zoom.start[1]) > 6) || (c.constrainZoomTo === 'x' && Math.abs(gridpos.x - c._zoom.start[0]) > 6) ||  (c.constrainZoomTo === 'y' && Math.abs(gridpos.y - c._zoom.start[1]) > 6)) {
            if (!plot.plugins.cursor.zoomProxy) {

                for (ax in datapos) {
                    
                    if (datapos.hasOwnProperty(ax)) {
                    
                        // make a copy of the original axes to revert back.
                        if (typeof c._zoom.axes[ax] === "undefined") {
                            c._zoom.axes[ax] = {};
                            c._zoom.axes[ax].numberTicks = axes[ax].numberTicks;
                            c._zoom.axes[ax].tickInterval = axes[ax].tickInterval;
                            // for date axes...
                            c._zoom.axes[ax].daTickInterval = axes[ax].daTickInterval;
                            c._zoom.axes[ax].min = axes[ax].min;
                            c._zoom.axes[ax].max = axes[ax].max;
                            c._zoom.axes[ax].tickFormatString = (axes[ax].tickOptions !== null) ? axes[ax].tickOptions.formatString :  '';
                        }

                        if ((c.constrainZoomTo === 'none') || (c.constrainZoomTo === 'x' && ax.charAt(0) === 'x') || (c.constrainZoomTo === 'y' && ax.charAt(0) === 'y')) {

                            dp = datapos[ax];

                            if (dp !== null) {

                                if (dp > start[ax]) {
                                    newmin = start[ax];
                                    newmax = dp;
                                } else {
                                    span = start[ax] - dp;
                                    newmin = dp;
                                    newmax = start[ax];
                                }

                                curax = axes[ax];
                                _numberTicks = null;

                                // if aligning this axis, use number of ticks from previous axis.
                                // Do I need to reset somehow if alignTicks is changed and then graph is replotted??
                                if (curax.alignTicks) {
                                    if (curax.name === 'x2axis' && plot.axes.xaxis.show) {
                                        _numberTicks = plot.axes.xaxis.numberTicks;
                                    } else if (curax.name.charAt(0) === 'y' && curax.name !== 'yaxis' && curax.name !== 'yMidAxis' && plot.axes.yaxis.show) {
                                        _numberTicks = plot.axes.yaxis.numberTicks;
                                    }
                                }

                                if (this.looseZoom && (axes[ax].renderer.constructor === $.jqplot.LinearAxisRenderer || axes[ax].renderer.constructor === $.jqplot.LogAxisRenderer)) { //} || axes[ax].renderer.constructor === $.jqplot.DateAxisRenderer)) {

                                    ret = $.jqplot.LinearTickGenerator(newmin, newmax, curax._scalefact, _numberTicks);

                                    // if new minimum is less than "true" minimum of axis display, adjust it
                                    if (axes[ax].tickInset && ret[0] < axes[ax].min + axes[ax].tickInset * axes[ax].tickInterval) {
                                        ret[0] += ret[4];
                                        ret[2] -= 1;
                                    }

                                    // if new maximum is greater than "true" max of axis display, adjust it
                                    if (axes[ax].tickInset && ret[1] > axes[ax].max - axes[ax].tickInset * axes[ax].tickInterval) {
                                        ret[1] -= ret[4];
                                        ret[2] -= 1;
                                    }

                                    // for log axes, don't fall below current minimum, this will look bad and can't have 0 in range anyway.
                                    if (axes[ax].renderer.constructor === $.jqplot.LogAxisRenderer && ret[0] < axes[ax].min) {
                                        // remove a tick and shift min up
                                        ret[0] += ret[4];
                                        ret[2] -= 1;
                                    }

                                    axes[ax].min = ret[0];
                                    axes[ax].max = ret[1];
                                    axes[ax]._autoFormatString = ret[3];
                                    axes[ax].numberTicks = ret[2];
                                    axes[ax].tickInterval = ret[4];
                                    // for date axes...
                                    axes[ax].daTickInterval = [ret[4] / 1000, 'seconds'];

                                } else {

                                    axes[ax].min = newmin;
                                    axes[ax].max = newmax;
                                    axes[ax].tickInterval = null;
                                    axes[ax].numberTicks = null;
                                    // for date axes...
                                    axes[ax].daTickInterval = null;
                                }

                                axes[ax]._ticks = [];
                            }
                        }

                        // if ((c.constrainZoomTo == 'x' && ax.charAt(0) == 'y' && c.autoscaleConstraint) || (c.constrainZoomTo == 'y' && ax.charAt(0) == 'x' && c.autoscaleConstraint)) {
                        //     dp = datapos[ax];
                        //     if (dp != null) {
                        //         axes[ax].max == null;
                        //         axes[ax].min = null;
                        //     }
                        // }
                        
                    }
                        
                }
                
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                plot.redraw();
                c._zoom.isZoomed = true;
                ctx = null;
            }
            plot.target.trigger('jqplotZoom', [gridpos, datapos, plot, cursor]);
        }
    };

    $.jqplot.Cursor.prototype.setZoom = function (posStart, posStop, plot) {

        var startEv,
            stopEv,
            gridpos,
            datapos,
            c,
            ax;
        
        startEv = {
            pageX: posStart.x,
            pageY: posStart.y,
            preventDefault: function () { console.log("prevent"); },
            data: {
                plot: plot
            }
        };
        
        stopEv = {
            pageX: posStop.x,
            pageY: posStop.y,
            preventDefault: function () { console.log("prevent"); },
            data: {
                plot: plot
            }
        };

        gridpos = getEventPosition(startEv).gridPos;
        datapos = getEventPosition(startEv).dataPos;
        c = plot.plugins.cursor;
        
        if (c.constrainZoomTo === 'x') {
            c._zoom.start = [gridpos.x, 0];
        } else if (c.constrainZoomTo === 'y') {
            c._zoom.start = [0, gridpos.y];
        } else {
            c._zoom.start = [gridpos.x, gridpos.y];
        }
        
        c._zoom.started = true;
        
        for (ax in datapos) {
            if (datapos.hasOwnProperty(ax)) {
                // get zoom starting position.
                c._zoom.axes.start[ax] = datapos[ax];
            }
        }
        
        if (plot.plugins.mobile) {
            $(document).bind('vmousemove.jqplotCursor', {plot: plot}, handleZoomMove);
        } else {
            $(document).bind('mousemove.jqplotCursor', {plot: plot}, handleZoomMove);
        }

        handleMouseDown(startEv, gridpos, datapos, {}, plot);
        handleZoomMove(startEv);
        handleMouseUp(stopEv);
        
    };
    
    $.jqplot.preInitHooks.push($.jqplot.Cursor.init);
    $.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw);
    
    $.jqplot.CursorLegendRenderer = function (options) {
        $.jqplot.TableLegendRenderer.call(this, options);
        this.formatString = '%s';
    };
    
    $.jqplot.CursorLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    
    $.jqplot.CursorLegendRenderer.prototype.constructor = $.jqplot.CursorLegendRenderer;

    // called in context of a Legend
    $.jqplot.CursorLegendRenderer.prototype.draw = function () {
        
        var series,
            elem,
            pad,
            i,
            j,
            seriesLen,
            s,
            lt,
            color,
            item,
            /**
             * @param {string} label
             * @param {string} color
             * @param {integer} pad
             * @param {object} idx
             */
            addrow = function (label, color, pad, idx) {
            
                var rs = (pad) ? this.rowSpacing : '0',
                    tr = $('<tr class="jqplot-legend jqplot-cursor-legend"></tr>').appendTo(this._elem),
                    td;

                tr.data('seriesIndex', idx);

                $('<td class="jqplot-legend jqplot-cursor-legend-swatch" style="padding-top:' + rs + ';">' +
                    '<div style="border:1px solid #cccccc;padding:0.2em;">' +
                    '<div class="jqplot-cursor-legend-swatch" style="background-color:' + color + ';"></div>' +
                    '</div></td>').appendTo(tr);

                td = $('<td class="jqplot-legend jqplot-cursor-legend-label" style="vertical-align:middle;padding-top:' + rs + ';"></td>');

                td.appendTo(tr);
                td.data('seriesIndex', idx);

                if (this.escapeHtml) {
                    td.text(label);
                } else {
                    td.html(label);
                }
                tr = null;
                td = null;
            };
        
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null;
        }
        
        if (this.show) {
            
            series = this._series;
            
            // make a table.  one line label per row.
            elem = document.createElement('table');
            
            this._elem = $(elem);
            
            elem = null;
            
            this._elem.addClass('jqplot-legend jqplot-cursor-legend');
            this._elem.css('position', 'absolute');

            pad = false;
            
            for (i = 0, seriesLen = series.length; i < seriesLen; i++) {
                
                s = series[i];
                
                if (s.show && s.showLabel) {
                    
                    lt = $.jqplot.sprintf(this.formatString, s.label.toString());
                    
                    if (lt) {
                        
                        color = s.color;
                        
                        if (s._stack && !s.fill) {
                            color = '';
                        }
                        
                        addrow.call(this, lt, color, pad, i);
                        
                        pad = true;
                    }
                    
                    // let plugins add more rows to legend.  Used by trend line plugin.
                    for (j = 0; j < $.jqplot.addLegendRowHooks.length; j++) {
                        item = $.jqplot.addLegendRowHooks[j].call(this, s);
                        if (item) {
                            addrow.call(this, item.label, item.color, pad);
                            pad = true;
                        }
                    }
                }
            }
            
            series = s = null;
            
        }
        
        return this._elem;
        
    };

}(jQuery));
