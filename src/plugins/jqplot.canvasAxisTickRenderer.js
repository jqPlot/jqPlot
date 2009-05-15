(function($) {
    // class: $.jqplot.CanvasAxisTickRenderer
    // A "tick" object showing the value of a tick/gridline on the plot.
    $.jqplot.CanvasAxisTickRenderer = function(options) {
        // Group: Properties
        // have to provide our own element container attributes.
        this._elem;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
        
        // prop: mark
        // tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
        this.mark = 'outside';
        // prop: showMark
        // wether or not to show the mark on the axis.
        this.showMark = true;
        // prop: showGridline
        // wether or not to draw the gridline on the grid at this tick.
        this.showGridline = true;
        // prop: isMinorTick
        // if this is a minor tick.
        this.isMinorTick = false;
        this.size = 4;
        // prop:  markSize
        // Length of the tick marks in pixels.  For 'cross' style, length
        // will be stoked above and below axis, so total length will be twice this.
        this.markSize = 4;
        // prop: show
        // wether or not to show the tick (mark and label).
        this.show = true;
        // prop: showLabel
        // wether or not to show the label.
        this.showLabel = true;
        this.label = '';
        this.value = null;
        this._styles = {};
        // prop: formatter
        // A class of a formatter for the tick text.  sprintf by default.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: fontFamily
        // css spec for the font-family css attribute.
        this.fontFamily = 'Hershey';
        // prop: fontSize
        // integer font size in points.
        this.fontSize = 12;
        this.fontWeight = 1.0;
        this.fontStretch = 1.0;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor = '#444444';
        // prop: angle
        // angle of text, measured clockwise from x axis.
        this.angle = 0;
        
        $.extend(true, this, options);
        this._textRenderer = new $.jqplot.CanvasTextRenderer({fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, strokeStyle:this.textColor, angle:this.getAngleRad()});
    };
    
    // convert css spec into point size
    function normalizeFontSize(sz) {
        n = parseFlot(sz);
        if (sz.indexOf('px') > -1) {
            return n*0.75;
        }
        else if (sz.indexOf('pt') > -1) {
            return n;
        }
        else if (sz.indexOf('em') > -1) {
            return n*12;
        }
        else if (sz.indexOf('%') > -1) {
            return n*12/100;
        }
        // default to pixels;
        else {
            return n*0.75;
        }
    }
    
    $.jqplot.CanvasAxisTickRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this._textRenderer.init({fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, strokeStyle:this.textColor, angle:this.getAngleRad()});
    };
    
    // return width along the x axis
    $.jqplot.CanvasAxisTickRenderer.prototype.getWidth = function() {
     	if (this._elem) {
     		return this._elem.outerWidth(true);
     	}
     	else {
     	    var tr = this._textRenderer;
	        var l = tr.getWidth();
	        var h = tr.getHeight();
	        var w = Math.abs(Math.sin(tr.angle)*h) + Math.abs(Math.cos(tr.angle)*l);
	        return w;
     	}
    };
    
    // return height along the y axis.
    $.jqplot.CanvasAxisTickRenderer.prototype.getHeight = function() {
     	if (this._elem) {
     		return this._elem.outerHeight(true);
     	}
     	else {
     	    var tr = this._textRenderer;
	        var l = tr.getWidth();
	        var h = tr.getHeight();
            var w = Math.abs(Math.cos(tr.angle)*h) + Math.abs(Math.sin(tr.angle)*l);
            return w;
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad = function() {
        var a = this.angle * Math.PI/180;
        return a;
    }
    
    
    $.jqplot.CanvasAxisTickRenderer.prototype.setTick = function(value, axisName, isMinor) {
        this.value = value;
        var pox = '15px';
        switch (axisName) {
            case 'xaxis':
                this._styles = {position:'absolute', top:'0px', left:pox, paddingTop:'10px', textAlign:'top'};
                break;
            case 'x2axis':
                this._styles = {position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px', textAlign:'bottom'};
                break;
            case 'yaxis':
                this._styles = {position:'absolute', right:'0px', top:pox, paddingRight:'10px', textAlign:'right'};
                break;
            case 'y2axis':
                this._styles = {position:'absolute', left:'0px', top:pox, paddingLeft:'10px', textAlign:'left'};
                break;
            default:
                break;
        }
        if (isMinor) {
        	this.isMinorTick = true;
        }
        return this;
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.draw = function() {
        if (!this.label) {
        	this.label = this.formatter(this.formatString, this.value);
        }
        this._textRenderer.setText(this.label);
        // var style='width:'+this.getWidth()+';height:'+this.getHeight();
        var domelem = document.createElement('canvas');
        var w = this.getWidth();
        var h = this.getHeight();
		domelem.width = w;
		domelem.height = h;
		this._domelem = domelem;
        this._elem = $(domelem);
        this._elem.css(this._styles);
        //var cstr = '.jqplot-axis-tick';
        //console.log('axis: %s, cstr: %s, style: %s', this.axis, cstr, $(cstr).css('font-weight'));
        //this._elem.css('border', '1px dotted #dd99bb');
        var ctx = domelem.getContext("2d");
        this._textRenderer.draw(ctx, this.label);
        //ctx.drawText(0, h-h*7/25, this.label);

        this._elem.addClass('jqplot-axis-tick');
        
       if (this.fontFamily) {
        this._domelem.fontFamily = this.fontFamily;
       }
       if (this.fontSize) {
        this._domelem.fontSize = this.fontSize;
       }
       if (this.textColor) {
        this._domelem.color = this.textColor;
       }
        return this._elem;
    };    
})(jQuery);