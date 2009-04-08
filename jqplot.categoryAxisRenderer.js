(function($) {
    var debug = 1;
        
	// Convienence function that won't hang IE.
	function log() {
	    if (window.console && debug) {
	       if (arguments.length == 1) console.log (arguments[0]);
	       else console.log(arguments);
	    }
	};
    
    $.jqplot.categoryAxisRenderer = function() {
        $.jqplot.linearAxisRenderer.call(this);
    };
    
    $.jqplot.categoryAxisRenderer.prototype = new $.jqplot.linearAxisRenderer();
    $.jqplot.categoryAxisRenderer.prototype.constructor = $.jqplot.categoryAxisRenderer;
 

    $.jqplot.categoryAxisRenderer.prototype.setAxis = function(plotHeight, plotWidth) {
        // we're are operating on an axis here
        var axis = this;
        var ticks = this._ticks;
        var name = this.name;
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        
        this._canvasHeight = plotHeight;
        this._canvasWidth = plotWidth;
        
        // if tick
        
        // Ticks should have been already specified by the user or set by the line renderer.  Since we
        // don't have access to the series, there's not much to do if we don't already have ticks.
        if (ticks.length) {
            this.numberTicks =ticks.length;
            for (i=0; i<ticks.length; i++){
                var t = ticks[i];
                if (!t.label) t.label = this.formatter(this.formatString, t.value.toString());
                // databounds should have been set to 0, 2*series length in line renderer
                this.min = db.min;
                this.max = db.max;
                // set iitial css positioning styles for the ticks.
                var pox = i*15+'px';
                switch (name) {
                    case 'xaxis':
                        t._styles = {position:'absolute', top:'0px', left:pox, paddingTop:'10px'};
                        break;
                    case 'x2axis':
                        t._styles = {position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'};
                        break;
                    case 'yaxis':
                        t._styles = {position:'absolute', right:'0px', top:pox, paddingRight:'10px'};
                        break;
                    case 'y2axis':
                        t._styles = {position:'absolute', left:'0px', top:pox, paddingLeft:'10px'};
                        break;
                }
            }
        }
        
        // we don't have any ticks yet, try to guess based on the bounds.
        else {
            // TBD what to do here.
        }
        
        if (name == 'yaxis' || name == 'y2axis') this.ticks.styles.reverse();
    };
    
    
})(jQuery);