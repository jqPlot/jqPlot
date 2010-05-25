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
        if (this.title.show) {
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
        if (this.legend.show) {
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
        this.themeEngine.add(th);
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
        if (!name && this.activeTheme && this.activeTheme._name) {
            name = this.activeTheme._name;
        }
        if (!this.themes.hasOwnProperty(name)) {
            throw new Error("No theme of that name");
        }
        else {
            var th = this.themes[name];
            this.activeTheme = th;
            for (var n in th.grid) {
                plot.grid[n] = th.grid[n];
            }
            plot.grid.draw();
            for (n in th.target) {
                plot.target.css(n, th.target[n]);
            }
            for (n in th.legend) {
                plot.legend._elem.css(n, th.legend[n]);
            }
            for (n in th.title) {
                plot.title._elem.css(n, th.title[n]);
            }
            var i;
            for (i=0; i<th.series.length; i++) {
                for (n in th.series[i]) {
                    plot.series[i][n] = th.series[i][n];
                }
                plot.drawSeries(th.series[i], i);
            }
        }
        
    };
    
    $.jqplot.ThemeEngine.prototype.add = function(theme) {
        if (!this.themes.hasOwnProperty(theme._name)) {
            this.themes[theme._name] = theme;
        }
        else {
            throw new Error("jqplot.ThemeEngine Error: Theme already in use");
        }
    };
    
    // delete the names theme, return true on success, false on failure.
    $.jqplot.ThemeEngine.prototype.remove = function(name) {
        return delete this.themes[name];
    };
    
    // create and return a copy of the current active theme.
    $.jqplot.ThemeEngine.prototype.newTheme = function(name) {
        name = name || Date.parse(new Date());
        var th = new $.jqplot.Theme(name);
        $.extend(true, th, this.activeTheme);
        this.add(th);
        return th;      
    };
    
    $.jqplot.ThemeEngine.prototype.rename = function (oldName, newName) {
        if (this.themes.hasOwnProperty(newName)) {
            throw new Error ("New name already in use.");
        }
        else if (this.themes.hasOwnProperty(oldName)) {
            var th = this.copy (oldName, newName);
            this.remove(oldName);
            return th;
        }
        throw new Error("jqplot.ThemeEngine Error: Old name or new name invalid");
    };
    
    $.jqplot.ThemeEngine.prototype.copy = function (sourceName, targetName) {
        if (this.themes.hasOwnProperty(sourceName) && !this.themes.hasOwnProperty(targetName)) {
            var th = new $.jqplot.Theme(targetName);
            $.extend(true, th, this.themes[sourceName]);
            th._name = targetName;
            this.add(th);
            return th;
        }
        else {
            throw new Error("jqplot.ThemeEngine Error: Source or target name invalid");
        }
    };
    
    $.jqplot.Theme = function(obj) {
        this._name = '';
        this.autoHighlightColors = true;
        this.target = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null,
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
        },
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
        this.axesTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.xaxisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.yaxisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.x2axisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y2axisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y3axisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y4axisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y5axisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y6axisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y7axisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y8axissTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y9axisTicks = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.axisLabels = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.xaxisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.yaxisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.x2axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y2axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y3axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y4axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y5axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y6axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y7axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y8axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        this.y9axisLabel = {
            color: null,
            fontFamily: null,
            fontSize: null,
            fontWeight: null
        };
        
        if (typeof(obj) == 'string') {
            this._name = obj;
        }
        else if(typeof(obj) == 'object') {
            $.extend(true, this, obj);
        }
    };
    
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
    }
    
    var BarSeriesProperties = function() {
        this.color=null;
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