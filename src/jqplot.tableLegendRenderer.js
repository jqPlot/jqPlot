/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
    // class $.jqplot.TableLegendRenderer
    // The default legend renderer for jqPlot, this class has no options beyond the <Legend> class.
    $.jqplot.TableLegendRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    $.jqplot.TableLegendRenderer.prototype.draw = function() {
        var legend = this;
        if (this.show) {
            var series = this._series;
            // make a table.  one line label per row.
            var ss = 'position:absolute;';
            ss += (this.background) ? 'background:'+this.background+';' : '';
            ss += (this.border) ? 'border:'+this.border+';' : '';
            ss += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            ss += (this.fontFamily) ? 'font-family:'+this.fontFamily+';' : '';
            ss += (this.textColor) ? 'color:'+this.textColor+';' : '';
            this._elem = $('<table class="jqplot-legend" style="'+ss+'"></table>');
        
            var pad = false;
            for (var i = 0; i< series.length; i++) {
                s = series[i];
                if (s.show) {
                    var lt = s.label.toString();
                    if (lt) {
                        addrow.call(this, lt, s.color, pad);
                        pad = true;
                    }
                    for (var j=0; j<$.jqplot.addLegendRowHooks.length; j++) {
                        var item = $.jqplot.addLegendRowHooks[j].call(this, s);
                        if (item) {
                            addrow.call(this, item.label, item.color, pad);
                            pad = true;
                        } 
                    }
                }
            }
        }
        
        function addrow(label, color, pad) {
            var rs = (pad) ? this.rowSpacing : '0';
            var tr = $('<tr class="jqplot-legend"></tr>').appendTo(this._elem);
            $('<td class="jqplot-legend" style="vertical-align:middle;text-align:center;padding-top:'+rs+';">'+
                '<div style="border:1px solid #cccccc;padding:0.2em;">'+
                '<div style="width:1.2em;height:0.7em;background-color:'+color+';"></div>'+
                '</div></td>').appendTo(tr);
            $('<td class="jqplot-legend" style="vertical-align:middle;padding-top:'+rs+';">'+label+'</td>').appendTo(tr);
        }
        return this._elem;
    };
    
    $.jqplot.TableLegendRenderer.prototype.pack = function(offsets) {
        if (this.show) {
            // fake a grid for positioning
            var grid = {_top:offsets.top, _left:offsets.left, _right:offsets.right, _bottom:this._plotDimensions.height - offsets.bottom};      
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
    };
})(jQuery);