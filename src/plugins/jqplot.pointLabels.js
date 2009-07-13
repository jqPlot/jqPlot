/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
	
	/**
	 * Class: $.jqplot.PointLabels
	 * Plugin for putting labels at the data points.
	 * 
	 * To use this plugin, include the js
	 * file in your source:
	 * 
	 * > <script type="text/javascript" src="plugins/jqplot.pointLabels.js" />
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
	    this.show = true;
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
                    xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; }
                    yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; }
                    break;
                case 'n':
                    xoffset = function(elem) { return -elem.outerWidth(true)/2; }
                    yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; }
                    break;
                case 'ne':
                    xoffset = function(elem) { return p.xpadding; }
                    yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; }
                    break;
                case 'e':
                    xoffset = function(elem) { return p.xpadding; }
                    yoffset = function(elem) { return -elem.outerHeight(true)/2; }
                    break;
                case 'se':
                    xoffset = function(elem) { return p.xpadding; }
                    yoffset = function(elem) { return p.ypadding; }
                    break;
                case 's':
                    xoffset = function(elem) { return -elem.outerWidth(true)/2; }
                    yoffset = function(elem) { return p.ypadding; }
                    break;
                case 'sw':
                    xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; }
                    yoffset = function(elem) { return p.ypadding; }
                    break;
                case 'w':
                    xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; }
                    yoffset = function(elem) { return -elem.outerHeight(true)/2; }
                    break;
                default: // same as 'nw'
                    xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; }
                    yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; }
                    break;
            }
        
            for (var i=0; i<p.labels.length; i++) {
                var elem = $('<div class="jqplot-point-label" style="position:absolute"></div>');
                elem.insertAfter(sctx.canvas);
                if (p.escapeHTML) {
                    elem.text(p.labels[i]);
                }
                else {
                    elem.html(p.labels[i]);
                }
                var xp = this._plotData[i][0];
                var yp = this._plotData[i][1];
                var x = this._xaxis.u2p(this._plotData[i][0]) + xoffset(elem);
                var y = this._yaxis.u2p(this._plotData[i][1]) + yoffset(elem);
                elem.css('left', x);
                elem.css('top', y);
            }
            
        }
    };
	
    $.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);
    $.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw);
})(jQuery);