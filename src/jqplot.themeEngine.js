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
        // get the Default theme from the current plot settings.
        var th = new $.jqplot.Theme({_name:'Default'});
        var n, i;
        
        for (n in th.target) {
            if (n == "textColor") {
                th.target[n] = this.target.css('color');
            }
            else {
                th.target[n] = this.target.css(n);
            }
        }
        
        if (this.title.show && this.title._elem) {
            for (n in th.title) {
                if (n == "textColor") {
                    th.title[n] = this.title._elem.css('color');
                }
                else {
                    th.title[n] = this.title._elem.css(n);
                }
            }
        }
        
        for (n in th.grid) {
            th.grid[n] = this.grid[n];
        }
        if (th.grid.backgroundColor == null && this.grid.background != null) {
            th.grid.backgroundColor = this.grid.background;
        }
        if (this.legend.show && this.legend._elem) {
            for (n in th.legend) {
                if (n == 'textColor') {
                    th.legend[n] = this.legend._elem.css('color');
                }
                else {
                    th.legend[n] = this.legend._elem.css(n);
                }
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
        var a, ax;
        for (n in this.axes) {
            ax = this.axes[n];
            a = th.axes[n] = new AxisProperties();
            a.borderColor = ax.borderColor;
            a.borderWidth = ax.borderWidth;
            if (ax._ticks && ax._ticks[0]) {
                for (nn in a.ticks) {
                    if (ax._ticks[0].hasOwnProperty(nn)) {
                        a.ticks[nn] = ax._ticks[0][nn];
                    }
                    else if (ax._ticks[0]._elem){
                        a.ticks[nn] = ax._ticks[0]._elem.css(nn);
                    }
                }
            }
            if (ax._label && ax._label.show) {
                for (nn in a.label) {
                    // a.label[nn] = ax._label._elem.css(nn);
                    if (ax._label[nn]) {
                        a.label[nn] = ax._label[nn];
                    }
                    else if (ax._label._elem){
                        if (nn == 'textColor') {
                            a.label[nn] = ax._label._elem.css('color');
                        }
                        else {
                            a.label[nn] = ax._label._elem.css(nn);
                        }
                    }
                }
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
            var val, checkBorderColor = false, checkBorderWidth = false;
            var arr = ['xaxis', 'x2axis', 'yaxis', 'y2axis'];
            
            for (i=0; i<arr.length; i++) {
                var ax = arr[i];
                if (th.axesStyles.borderColor != null) {
                    plot.axes[ax].borderColor = th.axesStyles.borderColor;
                }
                if (th.axesStyles.borderWidth != null) {
                    plot.axes[ax].borderWidth = th.axesStyles.borderWidth;
                }
            }
            
            for (axname in plot.axes) {
                var axis = plot.axes[axname];
                if (axis.show) {
                    var thaxis = th.axes[axname] || {};
                    var thaxstyle = th.axesStyles;
                    var thax = $.jqplot.extend(true, {}, thaxis, thaxstyle);
                    val = (th.axesStyles.borderColor != null) ? th.axesStyles.borderColor : thax.borderColor;
                    if (thax.borderColor != null) {
                        axis.borderColor = thax.borderColor;
                        redrawPlot = true;
                    }
                    val = (th.axesStyles.borderWidth != null) ? th.axesStyles.borderWidth : thax.borderWidth;
                    if (thax.borderWidth != null) {
                        axis.borderWidth = thax.borderWidth;
                        redrawPlot = true;
                    }
                    if (axis._ticks && axis._ticks[0]) {
                        for (nn in thax.ticks) {
                            // val = null;
                            // if (th.axesStyles.ticks && th.axesStyles.ticks[nn] != null) {
                            //     val = th.axesStyles.ticks[nn];
                            // }
                            // else if (thax.ticks[nn] != null){
                            //     val = thax.ticks[nn]
                            // }
                            val = thax.ticks[nn];
                            if (val != null) {
                                axis.tickOptions[nn] = val;
                                axis._ticks = [];
                                redrawPlot = true;
                            }
                        }
                    }
                    if (axis._label && axis._label.show) {
                        for (nn in thax.label) {
                            // val = null;
                            // if (th.axesStyles.label && th.axesStyles.label[nn] != null) {
                            //     val = th.axesStyles.label[nn];
                            // }
                            // else if (thax.label && thax.label[nn] != null){
                            //     val = thax.label[nn]
                            // }
                            val = thax.label[nn];
                            if (val != null) {
                                axis.labelOptions[nn] = val;
                                redrawPlot = true;
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
            
            if (plot.legend.show) { 
                for (n in th.legend) {
                    if (th.legend[n] != null) {
                        plot.legend[n] = th.legend[n];
                    }
                }
            }
            if (plot.title.show) {
                for (n in th.title) {
                    if (th.title[n] != null) {
                        plot.title[n] = th.title[n];
                    }
                }
            }
            
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
                    }
                }
            }
            
            if (redrawPlot) {
                plot.target.empty();
                plot.draw();
            }
            
            for (n in th.target) {
                if (th.target[n] != null) {
                    plot.target.css(n, th.target[n]);
                }
            }
        }
        
    };
    
    $.jqplot.ThemeEngine.prototype.add = function(theme, name) {
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
        if (name == 'Default') return false;
        return delete this.themes[name];
    };
    
        // create a copy of the Default theme merging it with supplied options and return it.
    $.jqplot.ThemeEngine.prototype.newTheme = function(name, obj) {
        if (typeof(name) == 'object') {
            obj = obj || name;
            name = null;
        }
        if (obj && obj._name) {
            name = obj._name;
        }
        else {
            name = name || Date.parse(new Date());
        }
        // var th = new $.jqplot.Theme(name);
        var th = this.copy(this.themes['Default']._name, name);
        $.jqplot.extend(th, obj);
        return th;
    };
    
    // function clone(obj) {
    //     return eval(obj.toSource());
    // }
    
    function clone(obj){
        if(obj == null || typeof(obj) != 'object'){
            return obj;
        }
    
        var temp = new obj.constructor();
        for(var key in obj){
            temp[key] = clone(obj[key]);
        }   
        return temp;
    }
    
    $.jqplot.clone = clone;
    
    function merge(obj1, obj2) {
        if (obj2 ==  null || typeof(obj2) != 'object') {
            return;
        }
        // if (obj1 == null){
        //     console.log('obj1 is null');
        //     obj1 = clone(obj2);
        //     return;
        // }
        for (var key in obj2) {
            if (key == 'highlightColors') {
                obj1[key] = clone(obj2[key]);
            }
            if (obj2[key] != null && typeof(obj2[key]) == 'object') {
                if (!obj1.hasOwnProperty(key)) {
                    obj1[key] = {};
                }
                merge(obj1[key], obj2[key]);
            }
            else {
                obj1[key] = obj2[key];
            }
        }
    }
    
    $.jqplot.merge = merge;
    
        // Use the jQuery 1.3.2 extend function since behaviour in jQuery 1.4 seems problematic
    $.jqplot.extend = function() {
    	// copy reference to target object
    	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

    	// Handle a deep copy situation
    	if ( typeof target === "boolean" ) {
    		deep = target;
    		target = arguments[1] || {};
    		// skip the boolean and the target
    		i = 2;
    	}

    	// Handle case when target is a string or something (possible in deep copy)
    	if ( typeof target !== "object" && !toString.call(target) === "[object Function]" )
    		target = {};

    	for ( ; i < length; i++ )
    		// Only deal with non-null/undefined values
    		if ( (options = arguments[ i ]) != null )
    			// Extend the base object
    			for ( var name in options ) {
    				var src = target[ name ], copy = options[ name ];

    				// Prevent never-ending loop
    				if ( target === copy )
    					continue;

    				// Recurse if we're merging object values
    				if ( deep && copy && typeof copy === "object" && !copy.nodeType )
    					target[ name ] = $.jqplot.extend( deep, 
    						// Never move original objects, clone them
    						src || ( copy.length != null ? [ ] : { } )
    					, copy );

    				// Don't bring in undefined values
    				else if ( copy !== undefined )
    					target[ name ] = copy;
    			}

    	// Return the modified object
    	return target;
    };
    
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
            var th = clone(this.themes[sourceName]);
            th._name = targetName;
            $.jqplot.extend(true, th, obj);
            this.add(th);
            return th;
        }
    };
    
    $.jqplot.Theme = function(name, obj) {
        if (typeof(name) == 'object') {
            obj = obj || name;
            name = null;
        }
        name = name || Date.parse(new Date());
        this._name = name;
        this.autoHighlightColors = true;
        this.target = {
            backgroundColor: null
        };
        this.legend = {
            textColor: null,
            fontFamily: null,
            fontSize: null,
            border: null,
            background: null
        };
        this.title = {
            textColor: null,
            fontFamily: null,
            fontSize: null,
            textAlign: null
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
        this.axesStyles = {label:{}, ticks:{}};
        this.axes = {};
        if (typeof(obj) == 'string') {
            this._name = obj;
        }
        else if(typeof(obj) == 'object') {
            $.jqplot.extend(true, this, obj);
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
        this.textColor = null;
        this.whiteSpace = null;
        this.fontSize = null;
        this.fontFamily = null;
    }
    
    var AxisLabel = function() {
        this.textColor = null;
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
        this.highlightColors=null;
    };
    
    var PieSeriesProperties = function() {
        this.seriesColors=null;
        this.padding=null;
        this.sliceMargin=null;
        this.fill=null;
        this.shadow=null;
        this.startAngle=null;
        this.lineWidth=null;
        this.highlightColors=null;
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
        this.highlightColors=null;
    };
    
    var FunnelSeriesProperties = function() {
        this.color=null;
        this.lineWidth=null;
        this.shadow=null;
        this.padding=null;
        this.sectionMargin=null;
        this.seriesColors=null;
        this.highlightColors=null;
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