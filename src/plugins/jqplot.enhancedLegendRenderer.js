/**
 * Copyright (c) 2009 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * The author would appreciate an email letting him know of any substantial
 * use of jqPlot.  You can reach the author at: chris dot leonello at gmail 
 * dot com or see http://www.jqplot.com/info.php .  This is, of course, 
 * not required.
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * Thanks for using jqPlot!
 * 
 */
(function($) {
    // class $.jqplot.EnhancedLegendRenderer
    $.jqplot.EnhancedLegendRenderer = function(){
        //
    };
    
    $.jqplot.EnhancedLegendRenderer.prototype.init = function(options) {
        // prop: numberRows
        // Maximum number of rows in the legend.  0 or null for unlimited.
        this.numberRows = null;
        // prop: numberColumns
        // Maximum number of columns in the legend.  0 or null for unlimited.
        this.numberColumns = null;
        $.extend(true, this, options);
    };
    
    // called with scope of legend
    $.jqplot.EnhancedLegendRenderer.prototype.draw = function() {
        var legend = this;
        if (this.show) {
            var series = this._series;
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            this._elem = $('<table class="jqplot-table-legend" style="'+ss+'"></table>');
        
            var pad = false, 
                reverse = false,
                nr, nc;
            if (this.numberRows) {
                nr = this.numberRows;
                if (!this.numberColumns)
                    nc = Math.ceil(series.length/nr);
                else
                    nc = this.numberColumns;
            }
            else if (this.numberColumns) {
                nc = this.numberColumns;
                nr = Math.ceil(series.length/this.numberColumns);
            }
            else {
                nr = series.length;
                nc = 1;
            }
                
            var i, j, tr, td1, td2, lt, rs;
            var idx = 0;
            // check to see if we need to reverse
            for (i=series.length-1; i>=0; i--) {
                if (series[i]._stack || series[i].renderer.constructor == $.jqplot.BezierCurveRenderer)
                    reverse = true;
            }    
                
            for (i=0; i<nr; i++) {
                if (reverse)
                    tr = $('<tr class="jqplot-table-legend"></tr>').prependTo(this._elem);
                else
                    tr = $('<tr class="jqplot-table-legend"></tr>').appendTo(this._elem);
                for (j=0; j<nc; j++) {
                    if (idx < series.length && series[idx].show && series[idx].showLabel){
                        s = series[idx];
                        lt = this.labels[idx] || s.label.toString();
                        if (lt) {
                            var color = s.color;
                            if (s._stack && !s.fill) {
                                color = '';
                            }
                            if (!reverse)
                                if (i>0)
                                    pad = true;
                                else
                                    pad = false;
                            else
                                if (i == nr -1)
                                    pad = false;
                                else
                                    pad = true;
                    
                            rs = (pad) ? this.rowSpacing : '0';
                    
                            td1 = $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
                                '<div><div class="jqplot-table-legend-swatch" style="border-color:'+color+';"></div>'+
                                '</div></td>');
                            td2 = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
                            if (this.escapeHtml)
                                td2.text(lt);
                            else 
                                td2.html(lt);
                            if (reverse) {
                                td2.prependTo(tr);
                                td1.prependTo(tr);
                            }
                            else {
                                td1.appendTo(tr);
                                td2.appendTo(tr);
                            }
                            pad = true;
                        }
                    }
                    idx++;
                }   
            }
        }
        return this._elem;
    };
    
    $.jqplot.EnhancedLegendRenderer.prototype.pack = function(offsets) {
        if (this.show) {
            // fake a grid for positioning
            var grid = {_top:offsets.top, _left:offsets.left, _right:offsets.right, _bottom:this._plotDimensions.height - offsets.bottom};        
            if (this.placement == 'inside') {
                switch (this.location) {
                    case 'nw':
                        var a = grid._left + this.xoffset;
                        var b = grid._top + this.yoffset;
                        this._elem.css('left', a);
                        this._elem.css('top', b);
                        break;
                    case 'n':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = grid._top + this.yoffset;
                        this._elem.css('left', a);
                        this._elem.css('top', b);
                        break;
                    case 'ne':
                        var a = offsets.right + this.xoffset;
                        var b = grid._top + this.yoffset;
                        this._elem.css({right:a, top:b});
                        break;
                    case 'e':
                        var a = offsets.right + this.xoffset;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({right:a, top:b});
                        break;
                    case 'se':
                        var a = offsets.right + this.xoffset;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({right:a, bottom:b});
                        break;
                    case 's':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 'sw':
                        var a = grid._left + this.xoffset;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 'w':
                        var a = grid._left + this.xoffset;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({left:a, top:b});
                        break;
                    default:  // same as 'se'
                        var a = grid._right - this.xoffset;
                        var b = grid._bottom + this.yoffset;
                        this._elem.css({right:a, bottom:b});
                        break;
                }
                
            }
            else {
                switch (this.location) {
                    case 'nw':
                        var a = this._plotDimensions.width - grid._left + this.xoffset;
                        var b = grid._top + this.yoffset;
                        this._elem.css('right', a);
                        this._elem.css('top', b);
                        break;
                    case 'n':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = this._plotDimensions.height - grid._top + this.yoffset;
                        this._elem.css('left', a);
                        this._elem.css('bottom', b);
                        break;
                    case 'ne':
                        var a = this._plotDimensions.width - offsets.right + this.xoffset;
                        var b = grid._top + this.yoffset;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'e':
                        var a = this._plotDimensions.width - offsets.right + this.xoffset;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'se':
                        var a = this._plotDimensions.width - offsets.right + this.xoffset;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 's':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = this._plotDimensions.height - offsets.bottom + this.yoffset;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'sw':
                        var a = this._plotDimensions.width - grid._left + this.xoffset;
                        var b = offsets.bottom + this.yoffset;
                        this._elem.css({right:a, bottom:b});
                        break;
                    case 'w':
                        var a = this._plotDimensions.width - grid._left + this.xoffset;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({right:a, top:b});
                        break;
                    default:  // same as 'se'
                        var a = grid._right - this.xoffset;
                        var b = grid._bottom + this.yoffset;
                        this._elem.css({right:a, bottom:b});
                        break;
                }
            }
        } 
    };
})(jQuery);