(function($) {    
    $.jqplot.AxisTick = function() {
        this.mark = 'outside';
        this.isMinorTick = false;
        this.size = 4;
        this.show = true;
        this.showLabel = true;
        this.label = '';
        this.value;
        this._styles = {};
        this.formatString;
        this.fontFamily='';
        this.fontSize = '0.75em';
        this.textColor = '';
        this._elem;
    };
    
    $.jqplot.AxisTick.prototype.setTick = function(value, label, axisName, isMinor) {
        this.label = label;
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
                this._styles = {position:'absolute', right:'0px', top:pox, paddingRight:'10px'};
                break;
            case 'y2axis':
                this._styles = {position:'absolute', left:'0px', top:pox, paddingLeft:'10px'};
                break;
        }
        if (isMinor) this.isMinorTick = true;
        return this;
    };
    
    $.jqplot.AxisTick.prototype.draw = function() {
        this._elem = $('<div class="jqplot-axis-tick"></div>').get(0);
        return this._elem;
    }
})(jQuery);