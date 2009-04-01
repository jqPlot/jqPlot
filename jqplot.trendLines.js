(function($) {
    var debug = 1;
	// Convienence function that won't hang IE.
	function log(something) {
	    if (window.console && debug) {
	        console.log(something);
	    }
	};
    
    $.jqplot.postParseOptionsHooks.push(parseTrendLineOptions);
    $.jqplot.postDrawSeriesHooks.push(drawTrendLines);
    $.jqplot.drawLegendHooks.push(addTrendLineLegend);
    
    // called witin scope of the legend object
    // current series passed in
    // must return null or an object {label:label, color:color}
    function addTrendLineLegend(series) {
        var lt = series.trendLines.label.toString();
        var ret = null;
        if (series.trendLines.show && lt) ret = {label:lt, color:series.trendLines.color};
        return ret;
    }

    // called within scope of ._jqPlot
    function parseTrendLineOptions () {
        var s, i;
        var series = this.series;
        var options = this.options;
        var defaults = {
            show: false,
            color: '#666666',
            rendererOptions:{marker:{show:false}},
            // lineWidth:2.5,
            // shadows:true,
            // // shadow angle in degrees
            // shadowAngle:45,
            // // shadow offset in pixels
            // shadowOffset:1,
            // shadowDepth:3,
            // shadowAlpha:'0.07',
            label:'',
            // linear or exp or exponential
            type: 'linear'
        };
        for (i = 0; i < series.length; ++i) {
            s = series[i];
        	// merge user supplied trendline options with defaults.
        	if (!s.hasOwnProperty('trendLines')) s.trendLines = {};
        	s.trendLines = $.extend(true, {}, defaults, options.trendLines, s.trendLines);
    	}
    };
    
    // called within scope of series object
    function drawTrendLines(grid, ctx) {
        var fit;
        if (this.trendLines.show) {
            fit = fitData(this.data, this.trendLines.type);
            // make a trendline series
            var tl = $.extend(true, {}, this, this.trendLines);
            tl.data = fit.data;
            tl.gridData = [];
            var lineRenderer = new $.jqplot.lineRenderer();
            lineRenderer.init(tl.trendLines.rendererOptions);
            lineRenderer.draw.call(lineRenderer, tl, grid, ctx); 
        }  
    }
	
	function regression(x, y, type)  {
		var type = (type == null) ? 'linear' : type;
	    var N = x.length;
	    var slope;
	    var intercept;	
		var SX = 0;
		var SY = 0;
		var SXX = 0;
		var SXY = 0;
		var SYY = 0;
		var Y = [];
		var X = [];
	
		if (type == 'linear') {
			X = x;
			Y = y;
		}
		else if (type == 'exp' || type == 'exponential') {
			for ( var i=0; i<y.length; i++) {
				// ignore points <= 0, log undefined.
				if (y[i] <= 0) {
					N--;
				}
				else {
					X.push(x[i]);
			    	Y.push(Math.log(y[i]));
				}
			}
		}

		for ( var i = 0; i < N; i++) {
		    SX = SX + X[i];
		    SY = SY + Y[i];
		    SXY = SXY + X[i]* Y[i];
		    SXX = SXX + X[i]* X[i];
		    SYY = SYY + Y[i]* Y[i];
		}

		slope = (N*SXY - SX*SY)/(N*SXX - SX*SX);
		intercept = (SY - slope*SX)/N;

	    return [slope, intercept];
	}

	function linearRegression(X,Y) {
		var ret;
		ret = regression(X,Y,'linear');
		return [ret[0],ret[1]];
	}

	function expRegression(X,Y) {
		var ret;
		var x = X;
		var y = Y;
		ret = regression(x, y,'exp');
		var base = Math.exp(ret[0]);
		var coeff = Math.exp(ret[1]);
		return [base, coeff];
	}

	function fitData(data, type) {
		var type = (type == null) ?  'linear' : type;
		var ret;
		var res;
		var x = [];
		var y = [];
		var ypred = [];
		
		for (i=0; i<data.length; i++){
			if (data[i] != null && data[i][0] != null && data[i][1] != null) {
				x.push(data[i][0]);
				y.push(data[i][1]);
			}
		}
		
		if (type == 'linear') {
			ret = linearRegression(x,y);
			for ( var i=0; i<x.length; i++){
			    res = ret[0]*x[i] + ret[1];
			    ypred.push([x[i], res]);
			}
		}
		else if (type == 'exp' || type == 'exponential') {
			ret = expRegression(x,y);
			for ( var i=0; i<x.length; i++){
			    res = ret[1]*Math.pow(ret[0],x[i]);
			    ypred.push([x[i], res]);
			}
		}
		return {data: ypred, slope: ret[0], intercept: ret[1]};
	};    

})(jQuery);