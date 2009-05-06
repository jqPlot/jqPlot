(function($) {
    
    $.jqplot.Trendline = function() {
        this.show = true;
        this.color = '#666666';
        this.rendererOptions:{marker:{show:false}};
        this.label:'';
        this.type = 'linear';
        // don't rely on series renderer, it may not draw lines.
        this.renderer = new $.jqplot.lineRenderer();
        this.shadow = true;
    };
    
    $.jqplot.postParseSeriesOptionsHooks.push(parseTrendLineOptions);
    $.jqplot.postDrawSeriesHooks.push(drawTrendLine);
    $.jqplot.addLegendRowHooks.push(drawTrendLineLegend);
    
    // called witin scope of the legend object
    // current series passed in
    // must return null or an object {label:label, color:color}
    function addTrendLineLegend(series) {
        var lt = series.trendline.label.toString();
        var ret = null;
        if (series.trendline.show && lt) ret = {label:lt, color:series.trendline.color};
        return ret;
    };

    // called within scope of a series
    function parseTrendLineOptions (seriesDefaults, options) {
        this.trendline = new $.jqplot.Trendline();
        $.extend(true, this.trendline, seriesDefaults.trendline, options.trendline);
    };
    
    // called within scope of series object
    function drawTrendLines(sctx, options) {
        if (this.trendline.show) {
            var fit;
            // this.renderer.setGridData.call(this);
            var data = options.data || this.data;
            fit = fitData(data, this.trendline.type);
            var gridData = options.gridData || this.renderer.makeGridData.call(this, fit.data);
        
            this.trendline.renderer.draw.call(this, sctx, gridData, {showline:true, shadow:this.trendline.shadow});
        }
    };
	
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