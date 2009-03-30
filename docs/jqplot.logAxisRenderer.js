(function($) {
    $.jqplot.logAxisRenderer = function() {
    };
    
    $.jqplot.logAxisRenderer.prototype.fill = $.jqplot.linearAxisRenderer.fill;
    

    $.jqplot.logAxisRenderer.prototype.pack = function(offsets) {
        var ticks = this.ticks;
        var tickdivs = $(this.elem).children('div');
        if (this.name == 'xaxis' || this.name == 'x2axis') {
            this.offsets = {min:offsets.left, max:offsets.right};
            
            this.p2u = function(p) {
                return (p - this.offsets.min)*(this.max - this.min)/(this.gridWidth - this.offsets.max - this.offsets.min) + this.min;
            }
            
            this.u2p = function(u) {
                return (u - this.min) * (this.gridWidth - this.offsets.max - this.offsets.min) / (this.max - this.min) + this.offsets.min;
            }
            
            if (this.show) {
                for (i=0; i<tickdivs.length; i++) {
                    var shim = $(tickdivs[i]).outerWidth()/2;
                    var t = this.u2p(ticks.values[i]);
                    var val = this.u2p(ticks.values[i]) - shim + 'px';
                    $(tickdivs[i]).css('left', val);
                    // remember, could have done it this way
                    //tickdivs[i].style.left = val;
                }
            }
        }  
        else {
            this.offsets = {min:offsets.bottom, max:offsets.top};
            
            this.p2u = function(p) {
                return (p - this.gridHeight + this.offsets.min)*(this.max - this.min)/(this.gridHeight - this.offsets.min - this.offsets.max) + this.min;
            }
            
            this.u2p = function(u) {
                return -(u - this.min) * (this.gridHeight - this.offsets.min - this.offsets.max) / (this.max - this.min) + this.gridHeight - this.offsets.min;
            }
            if (this.show) {
                for (i=0; i<tickdivs.length; i++) {
                    var shim = $(tickdivs[i]).outerHeight()/2;
                    var val = this.u2p(ticks.values[i]) - shim + 'px';
                    $(tickdivs[i]).css('top', val);
                }
            }
        }    
        
    };
})(jQuery);