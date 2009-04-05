(function($) {    
    $.jqplot.AxisTick = function(options) {
        $.jqplot.ElemContainer.call(this);
        this.mark = 'outside';
        this.showMark = true;
        this.isMinorTick = false;
        this.size = 4;
        this.markSize = 4;
        this.show = true;
        this.showLabel = true;
        this.label = '';
        this.value = null;
        this._styles = {};
        this.formatter = $.jqplot.sprintf;
        this.formatString;
        this.fontFamily='';
        this.fontSize = '0.75em';
        this.textColor = '';
        this._elem;
        
        $.extend(true, this, options);
    };
    
    $.jqplot.AxisTick.prototype = new $.jqplot.ElemContainer();
    $.jqplot.AxisTick.prototype.constructor = $.jqplot.AxisTick;
    
    $.jqplot.AxisTick.prototype.setTick = function(value, axisName, isMinor) {
        this.value = value;
        var pox = '15px';
        switch (axisName) {
            case 'xaxis':
                this._styles = {position:'absolute', top:'0px', left:pox, paddingTop:'10px'};
                break;
            case 'x2axis':
                this._styles = {position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'};
                break;
            case 'yaxis':
                this._styles = {position:'absolute', left:'0px', top:pox, paddingRight:'10px'};
                break;
            case 'y2axis':
                this._styles = {position:'absolute', right:'0px', top:pox, paddingLeft:'10px'};
                break;
        }
        if (isMinor) this.isMinorTick = true;
        return this;
    };
    
    $.jqplot.AxisTick.prototype.draw = function() {
        if (!this.label) this.label = this.formatter(this.formatString, this.value);
        this._elem = $('<div class="jqplot-axis-tick">'+this.label+'</div>');
        for (var s in this._styles) {
            this._elem.css(s, this._styles[s]);
        }
        if (this.fontFamily) this._elem.css('font-family', this.fontFamily);
        if (this.fontSize) this._elem.css('font-size', this.fontSize);
        if (this.textColor) this._elem.css('color', this.textColor);
        return this._elem;
    }
})(jQuery);