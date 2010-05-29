/**
 * Copyright (c) 2009 - 2010 Chris Leonello
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
    // class: $.jqplot.ThemeEngine
    // Theme Engine provides a programatic way to change some of the  more
    // common jqplot options such as fonts, colors and grid options.
    // A theme engine instance is created with each plot.  The theme engine
    // manages a collection of themes which can be modified, added to, or 
    // applied to the plot at will.
    $.jqplot.ThemeEngine = function(){
        this.themes = {};
        // pointer to currently active theme
        this.activeTheme=null;
        
    };
    
    // called with scope of plot
    $.jqplot.ThemeEngine.prototype.init = function() {
        // get the default theme from the current plot settings.
        var th = new $.jqplot.Theme({_name:'default'});
        var n, i;
        for (n in th.target) {
            th.target[n] = this.target.css(n);
        }
        if (this.title.show && this.title._elem) {
            for (n in th.title) {
                th.title[n] = this.title._elem.css(n);
            }
        }
        
        // n = ['drawGridlines', 'gridlineColor', 'gridlineWidth', 'backgroundColor', 'borderColor', 'borderWidth', 'shadow'];
        // for (i=0; i<n.length; i++) {
        //     th.grid[n[i]] = this.grid[n[i]];
        // }
        
        for (n in th.grid) {
            th.grid[n] = this.grid[n];
        }
        if (th.grid.backgroundColor == null && this.grid.background != null) {
            th.grid.backgroundColor = this.grid.background;
        }
        if (this.legend.show && this.legend._elem) {
            for (n in th.legend) {
                th.legend[n] = this.legend._elem.css(n);
            }
        }
        var s;
        
        for (i=0; i<this.series.length; i++) {
            s = this.series[i];
            if (s.renderer.constructor == $.jqplot.LineRenderer) {
                th.series.push(new LineSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.BarRenderer) {
                th.series.push(new BarSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.PieRenderer) {
                th.series.push(new PieSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.DonutRenderer) {
                th.series.push(new DonutSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.FunnelRenderer) {
                th.series.push(new FunnelSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.MeterGaugeRenderer) {
                th.series.push(new MeterSeriesProperties());
            }
            else {
                th.series.push({});
            }
            for (n in th.series[i]) {
                th.series[i][n] = s[n];
            }
        }
        var a, ax, axis1;
        for (n in this.axes) {
            axis1 = axis1 || n;
            ax = this.axes[n];
            a = th.axes[n] = new AxisProperties();
            a.borderColor = ax.borderColor;
            a.borderWidth = ax.borderWidth;
            if (ax._ticks && ax._ticks[0]) {
                if (ax._ticks[0].constructor == $.jqplot.AxisTickRenderer || true) {
                    for (nn in a.ticks) {
                        if (ax._ticks[0].hasOwnProperty(nn)) {
                            a.ticks[nn] = ax._ticks[0][nn];
                        }
                        else if (ax._ticks[0]._elem){
                            a.ticks[nn] = ax._ticks[0]._elem.css(nn);
                        }
                    }
                }
            }
            if (ax._label && ax._label._elem) {
                for (nn in a.label) {
                    a.label[nn] = ax._label._elem.css(nn);
                }
            }
        }
        this.themeEngine._add(th);
        this.themeEngine.activeTheme  = this.themeEngine.themes[th._name];
    };
    
    $.jqplot.ThemeEngine.prototype.get = function(name) {
        if (!name) {
            // return the active theme
            return this.activeTheme;
        }
        else {
            return this.themes[name];
        }
    };
    
    function numericalOrder(a,b) { return a-b; }
    
    // return list of theme names in alpha-numerical order.
    $.jqplot.ThemeEngine.prototype.getThemeNames = function() {
        var tn = [];
        for (var n in this.themes) {
            tn.push(n);
        }
        return tn.sort(numericalOrder);
    };
    
    // return a list of themes in alpha-numerical order by name.
    $.jqplot.ThemeEngine.prototype.getThemes = function() {
        var tn = [];
        var themes = [];
        for (var n in this.themes) {
            tn.push(n);
        }
        tn.sort(numericalOrder);
        for (var i=0; i<tn.length; i++) {
            themes.push(this.themes[tn[i]]);
        }
        return themes;
    };
    
    // change active theme to theme named 'name'.
    $.jqplot.ThemeEngine.prototype.activate = function(plot, name) {
        // sometimes need to redraw whole plot.
        var redrawPlot = false;
        if (!name && this.activeTheme && this.activeTheme._name) {
            name = this.activeTheme._name;
        }
        if (!this.themes.hasOwnProperty(name)) {
            throw new Error("No theme of that name");
        }
        else {
            var th = this.themes[name];
            this.activeTheme = th;
            var val;
            for (axname in th.axes) {
                var axis = plot.axes[axname];
                if (axis.show) {
                    var thax = th.axes[axname];
                    val = (th.axesStyles.borderColor != null) ? th.axesStyles.borderColor : thax.borderColor;
                    if (val != null) {
                        axis.borderColor = val;
                        redrawPlot = true;
                    }
                    val = (th.axesStyles.borderWidth != null) ? th.axesStyles.borderWidth : thax.borderWidth;
                    if (val != null) {
                        axis.borderWidth = val;
                        redrawPlot = true;
                    }
                    if (axis._ticks && axis._ticks[0]) {

                        for (nn in thax.ticks) {
                            val = null;
                            if (th.axesStyles.ticks && th.axesStyles.ticks[nn] != null) {
                                val = th.axesStyles.ticks[nn];
                            }
                            else if (thax.ticks[nn] != null){
                                val = thax.ticks[nn]
                            }
                            if (val != null) {
                                if (axis.tickRenderer == $.jqplot.CanvasAxisTickRenderer || true) {
                                    axis.tickOptions[nn] = val;
                                    axis._ticks = [];
                                    redrawPlot = true;
                                }
                                else if (axis._ticks[0]._elem){
                                    for (var i=0; i<axis._ticks.length; i++) {
                                        axis._ticks[i]._elem.css(nn, val);
                                    }
                                    redrawPlot = false;
                                }
                            }
                        }

                    }
                }
            }
            
            
            for (var n in th.grid) {
                if (th.grid[n] != null) {
                    plot.grid[n] = th.grid[n];
                }
            }
            if (!redrawPlot) {
                plot.grid.draw();
            }
            for (n in th.target) {
                if (th.target[n] != null) {
                    plot.target.css(n, th.target[n]);
                }
            }
            if (plot.legend.show) { 
                for (n in th.legend) {
                    if (th.legend[n] != null) {
                        plot.legend._elem.css(n, th.legend[n]);
                    }
                }
            }
            if (plot.title.show) {
                for (n in th.title) {
                    if (th.title[n] != null) {
                        plot.title._elem.css(n, th.title[n]);
                    }
                }
            }
            
            // if (redrawPlot) {
            //     plot.target.empty();
            //     plot.draw();
            // }
            
            var i;
            for (i=0; i<th.series.length; i++) {
                var opts = {};
                var redrawSeries = false;
                for (n in th.series[i]) {
                    val = (th.seriesStyles[n] != null) ? th.seriesStyles[n] : th.series[i][n];
                    if (val != null) {
                        opts[n] = val;
                        if (n == 'color') {
                            plot.series[i].renderer.shapeRenderer.fillStyle = val;
                            plot.series[i].renderer.shapeRenderer.strokeStyle = val;
                            plot.series[i][n] = val;
                        }
                        else if (n == 'lineWidth') {
                            plot.series[i].renderer.shapeRenderer.lineWidth = val;
                            plot.series[i][n] = val;
                        }
                        else if (n == 'markerOptions') {
                            merge (plot.series[i].markerOptions, val);
                            merge (plot.series[i].markerRenderer, val);
                        }
                        else {
                            plot.series[i][n] = val;
                        }
                        redrawPlot = true;
                        // redrawSeries = true;
                    }
                }
                // if (redrawSeries) {
                //     console.log('redrawing series ', i)
                //     plot.drawSeries(opts, i);
                // }
            }
            
            if (redrawPlot) {
                plot.target.empty();
                plot.draw();
            }
        }
        
    };
    
    $.jqplot.ThemeEngine.prototype._add = function(theme, name) {
        if (name) {
            theme._name = name;
        }
        if (!theme._name) {
            theme._name = Date.parse(new Date());
        }
        if (!this.themes.hasOwnProperty(theme._name)) {
            this.themes[theme._name] = theme;
        }
        else {
            throw new Error("jqplot.ThemeEngine Error: Theme already in use");
        }
    };
    
    // delete the names theme, return true on success, false on failure.
    $.jqplot.ThemeEngine.prototype.remove = function(name) {
        if (name == 'default') return false;
        return delete this.themes[name];
    };
    
    // create a copy of the default theme and return it theme.
    $.jqplot.ThemeEngine.prototype.newTheme = function(name, obj) {
        if (typeof(name) == 'object') {
            obj = obj || name;
            name = null;
        }
        name = name || Date.parse(new Date());
        // var th = new $.jqplot.Theme(name);
        var th = this.copy(this.themes.default._name, name);
        merge(th, obj);
        return th;
    };
    
    function clone(obj) {
        return eval(obj.toSource());
    }
    
    $.jqplot.clone = clone;
    
    function merge(obj1, obj2) {
        if (obj2 ==  null || typeof(obj2) != 'object') {
            return;
        }
        if (typeof(obj1) != 'object'){
            obj1 = {};
        }
        for (var key in obj2) {
            if (typeof(obj2[key]) == 'object') {
                if (!obj1[key]) {
                    obj1[key] = {};
                }
                merge(obj1[key], obj2[key]);
            }
            else {
                obj1[key] = obj2[key];
            }
        }
    }
    
    $.jqplot.ThemeEngine.prototype.rename = function (oldName, newName) {
        if (this.themes.hasOwnProperty(newName)) {
            throw new Error ("jqplot.ThemeEngine Error: New name already in use.");
        }
        else if (this.themes.hasOwnProperty(oldName)) {
            var th = this.copy (oldName, newName);
            this.remove(oldName);
            return th;
        }
        throw new Error("jqplot.ThemeEngine Error: Old name or new name invalid");
    };
    
    $.jqplot.ThemeEngine.prototype.copy = function (sourceName, targetName, obj) {
        if (!this.themes.hasOwnProperty(sourceName)) {
            var s = "jqplot.ThemeEngine Error: Source name invalid";
            throw new Error(s);
        }
        if (this.themes.hasOwnProperty(targetName)) {
            var s = "jqplot.ThemeEngine Error: Target name invalid";
            throw new Error(s);
        }
        else {
            var th = eval(this.themes[sourceName].toSource());
            th._name = targetName;
            merge (th, obj);
            this._add(th);
            return th;
        }
    };
    
    $.jqplot.Theme = function(obj) {
        this._name = '';
        this.autoHighlightColors = true;
        this.target = {
            backgroundColor: null
        };
        this.legend = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null,
            borderLeftWidth: null,
            borderRightWidth: null,
            borderTopWidth: null,
            borderBottomWidth: null,
            borderLeftColor: null,
            borderRightColor: null,
            borderTopColor: null,
            borderBottomColor: null,
            backgroundColor: null
        };
        this.title = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null,
            paddingBottom: null
        };
        this.seriesStyles = {};
        this.series = [];
        this.grid = {
            drawGridlines: null,
            gridLineColor: null,
            gridLineWidth: null,
            backgroundColor: null,
            borderColor: null,
            borderWidth: null,
            shadow: null
        };
        this.axesStyles = {};
        this.axes = {};
        if (typeof(obj) == 'string') {
            this._name = obj;
        }
        else if(typeof(obj) == 'object') {
            merge(this, obj);
        }
    };
    
    var AxisProperties = function() {
        this.borderColor = null;
        this.borderWidth = null;
        this.ticks = new AxisTicks();
        this.label = new AxisLabel();
    }
    
    var AxisTicks = function() {
        this.show = null;
        this.showGridline = null;
        this.showLabel = null;
        this.showMark = null;
        this.size = null;
        this.color = null;
        this.whiteSpace = null;
        this.fontSize = null;
        this.fontFamily = null;
    }
    
    var AxisLabel = function() {
        this.color = null;
        this.whiteSpace = null;
        this.fontSize = null;
        this.fontFamily = null;
        this.fontWeight = null;
    }
    
    var LineSeriesProperties = function() {
        this.color=null;
        this.lineWidth=null;
        this.shadow=null;
        this.fillColor=null;
        this.fillAlpha=null;
        this.showMarker=null;
        this.markerOptions = new MarkerOptions();
    };
    
    var MarkerOptions = function() {
        this.show = null;
        this.style = null;
        this.lineWidth = null;
        this.size = null;
        this.color = null;
        this.shadow = null;
    };
    
    var BarSeriesProperties = function() {
        this.color=null;
        this.seriesColors=null;
        this.lineWidth=null;
        this.shadow=null;
        this.barPadding=null;
        this.barMargin=null;
        this.barWidth=null;
    };
    
    var PieSeriesProperties = function() {
        this.seriesColors=null;
        this.padding=null;
        this.sliceMargin=null;
        this.fill=null;
        this.shadow=null;
        this.startAngle=null;
        this.lineWidth=null;
    };
    
    var DonutSeriesProperties = function() {
        this.seriesColors=null;
        this.padding=null;
        this.sliceMargin=null;
        this.fill=null;
        this.shadow=null;
        this.startAngle=null;
        this.lineWidth=null;
        this.innerDiameter=null;
        this.thickness=null;
        this.ringMargin=null;
    };
    
    var FunnelSeriesProperties = function() {
        this.color=null;
        this.lineWidth=null;
        this.shadow=null;
        this.padding=null;
        this.sectionMargin=null;
        this.seriesColors=null;
    };
    
    var MeterSeriesProperties = function() {
        this.padding=null;
        this.backgroundColor=null;
        this.ringColor=null;
        this.tickColor=null;
        this.ringWidth=null;
        this.intervalColors=null;
        this.intervalInnerRadius=null;
        this.intervalOuterRadius=null;
        this.hubRadius=null;
        this.needleThickness=null;
        this.needlePad=null;
    };
        

})(jQuery);