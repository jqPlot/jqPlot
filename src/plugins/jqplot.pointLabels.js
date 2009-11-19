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
    $.jqplot.PointLabels = function(options) {
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
        // if null, will use the last element of teh data point array.
        this.seriesLabelIndex = null;
        // prop: labels
        // array of arrays of labels, one array for each series.
        this.labels = [];
        // prop: stackedValue
        // true to display value as stacked in a stacked plot.
        // no effect if labels is specified.
        this.stackedValue = false;
        // prop: verticalPadding
        // vertical padding in pixels between point and label
        this.ypadding = 6;
        // prop: horizontalPadding
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
        this.edgeTolerance = 0;
        
        $.extend(true, this, options);
    };
    
    // called with scope of a series
    $.jqplot.PointLabels.init = function (target, data, seriesDefaults, opts){
        var options = $.extend(true, {}, seriesDefaults, opts);
        // add a pointLabels attribute to the series plugins
        this.plugins.pointLabels = new $.jqplot.PointLabels(options.pointLabels);
        var p = this.plugins.pointLabels;
        if (p.labels.length == 0 || p.labelsFromSeries) {
            if (p.stackedValue) {
                if (this._plotData.length && this._plotData[0].length){
                    var idx = p.seriesLabelIndex || this._plotData[0].length -1;
                    for (var i=0; i<this._plotData.length; i++) {
                        p.labels.push(this._plotData[i][idx]);
                    }
                }
            }
            else {
                if (this.data.length && this.data[0].length) {
                    var idx = p.seriesLabelIndex || this.data[0].length -1;
                    for (var i=0; i<this.data.length; i++) {
                        p.labels.push(this.data[i][idx]);
                    }
                }
            }
        }
    };
    
    // called with scope of series
    $.jqplot.PointLabels.draw = function (sctx, options) {
        var p = this.plugins.pointLabels;
        if (p.show) {
            var xoffset, yoffset;
        
            switch (p.location) {
                case 'nw':
                    xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; };
                    yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; };
                    break;
                case 'n':
                    xoffset = function(elem) { return -elem.outerWidth(true)/2; };
                    yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; };
                    break;
                case 'ne':
                    xoffset = function(elem) { return p.xpadding; };
                    yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; };
                    break;
                case 'e':
                    xoffset = function(elem) { return p.xpadding; };
                    yoffset = function(elem) { return -elem.outerHeight(true)/2; };
                    break;
                case 'se':
                    xoffset = function(elem) { return p.xpadding; };
                    yoffset = function(elem) { return p.ypadding; };
                    break;
                case 's':
                    xoffset = function(elem) { return -elem.outerWidth(true)/2; };
                    yoffset = function(elem) { return p.ypadding; };
                    break;
                case 'sw':
                    xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; };
                    yoffset = function(elem) { return p.ypadding; };
                    break;
                case 'w':
                    xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; };
                    yoffset = function(elem) { return -elem.outerHeight(true)/2; };
                    break;
                default: // same as 'nw'
                    xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; };
                    yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; };
                    break;
            }
        
            for (var i=0; i<p.labels.length; i++) {
                var pd = this._plotData;
                var xax = this._xaxis;
                var yax = this._yaxis;
                
                var elem = $('<div class="jqplot-point-label" style="position:absolute"></div>');
                elem.insertAfter(sctx.canvas);
                if (p.escapeHTML) {
                    elem.text(p.labels[i]);
                }
                else {
                    elem.html(p.labels[i]);
                }
                var ell = xax.u2p(pd[i][0]) + xoffset(elem);
                var elt = yax.u2p(pd[i][1]) + yoffset(elem);
                elem.css('left', ell);
                elem.css('top', elt);
                var elr = ell + $(elem).width();
                var elb = elt + $(elem).height();
                var et = p.edgeTolerance;
                var scl = $(sctx.canvas).position().left;
                var sct = $(sctx.canvas).position().top;
                var scr = sctx.canvas.width + scl;
                var scb = sctx.canvas.height + sct;
                // if label is outside of allowed area, remove it
                if (ell - et < scl || elt - et < sct || elr + et > scr || elb + et > scb) {
                    $(elem).remove();
                }
            }
            
        }
    };
    
    $.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);
    $.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw);
})(jQuery);