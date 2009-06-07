/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
    /**
    *  Class: $.jqplot.CanvasAxisTickRenderer
    *  A tick renderer supporting rotated text by drawing text onto a canvas element.
    */
    $.jqplot.CanvasAxisTickRenderer = function(options) {
        // Group: Properties
        
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
        // prop: angle
        // angle of text, measured clockwise from x axis.
        this.angle = 0;
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
        // A class of a formatter for the tick text.
        // The default $.jqplot.DefaultTickFormatter uses sprintf.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: fontFamily
        // css spec for the font-family css attribute.
        this.fontFamily = 'sans-serif';
        // prop: fontSize
        // CSS spec for font size.
        this.fontSize = '10px';
        // prop: fontWeight
        // CSS spec for fontWeight
        this.fontWeight = 'normal';
        // prop: fontStretch
        // Multiplier to condense or expand font width.  
        // Applies only to browsers which don't support canvas native font rendering.
        this.fontStretch = 1.0;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor = '#666666';
        
        this._elem;
        this._ctx;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
        
        $.extend(true, this, options);
        
        var ropts = {fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, fillStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily};
        
        if ($.browser.safari && $.browser.version >= 528.16) {
            this._textRenderer = new $.jqplot.CanvasFontRenderer(ropts);
            this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts); 
        }
        else if ($.browser.mozilla) {
            var p = $.browser.version.split(".");
            if (p[0] > 1 || p[0] == 1 && (p[1] > 9 || (p[1] == 9 && p[2] > 0))) {
                this._textRenderer = new $.jqplot.CanvasFontRenderer(ropts);
            }
            else {
                this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts);
            }
        }
            
        else {
            this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts); 
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this._textRenderer.init({fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, fillStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily});
    };
    
    // return width along the x axis
    // will check first to see if an element exists.
    // if not, will return the computed text box width.
    $.jqplot.CanvasAxisTickRenderer.prototype.getWidth = function(ctx) {
        if (this._elem) {
         return this._elem.outerWidth(true);
        }
     	else {
     	    var tr = this._textRenderer;
	        var l = tr.getWidth(ctx);
	        var h = tr.getHeight(ctx);
	        var w = Math.abs(Math.sin(tr.angle)*h) + Math.abs(Math.cos(tr.angle)*l);
	        return w;
     	}
    };
    
    // return height along the y axis.
    $.jqplot.CanvasAxisTickRenderer.prototype.getHeight = function(ctx) {
        if (this._elem) {
         return this._elem.outerHeight(true);
        }
     	else {
     	    var tr = this._textRenderer;
	        var l = tr.getWidth(ctx);
	        var h = tr.getHeight(ctx);
            var w = Math.abs(Math.cos(tr.angle)*h) + Math.abs(Math.sin(tr.angle)*l);
            return w;
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad = function() {
        var a = this.angle * Math.PI/180;
        return a;
    };
    
    
    $.jqplot.CanvasAxisTickRenderer.prototype.setTick = function(value, axisName, isMinor) {
        this.value = value;
        if (isMinor) {
        	this.isMinorTick = true;
        }
        return this;
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.draw = function(ctx) {
        if (!this.label) {
        	this.label = this.formatter(this.formatString, this.value);
        }
        // create a canvas here, but can't draw on it untill it is appended
        // to dom for IE compatability.
        var domelem = document.createElement('canvas');
        if ($.browser.msie) {
            window.G_vmlCanvasManager.init_(document);
        }
        if ($.browser.msie) {
            domelem = window.G_vmlCanvasManager.initElement(domelem);
        }
        this._textRenderer.setText(this.label, ctx);
        var w = this.getWidth(ctx);
        var h = this.getHeight(ctx);
        domelem.width = w;
        domelem.height = h;
        domelem.style.width = w;
        domelem.style.height = h;
        domelem.style.textAlign = 'left';
		this._domelem = domelem;
        this._elem = $(domelem);
        this._elem.css(this._styles);
        this._elem.addClass('jqplot-'+this.axis+'-tick');
        
        return this._elem;
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.pack = function() {
    	var ctx = this._elem.get(0).getContext("2d");
    	this._textRenderer.draw(ctx, this.label);
    };
    
})(jQuery);