(function($) {
    $._jqPlot = function() {
        // user's data.  Should be in the form of
        // [ [[x1, y1], [x2, y2],...], [[x1, y1], [x2, y2], ...] ] or
        // [{ data:[[x1, y1], [x2, y2],...], other_options...}, { data:[[x1, y1], [x2, y2],...], other_options...} ]
        this.data = [];
        // the id of the dom element to render the plot into
        this.targetId = null;
        // the jquery object for the dom target.
        this.target = null;
        // the defaults merged with the options the user passed into us.
        this.options = null;
    
        // default options object to be overridden by user.
        this.defaults = {
            pointsDefaults: {show:true, renderer:'circleRenderer', transform:null},
            points:[],
            axesDefaults: {show:true, margin:0.1, numberTicks:null, tickInterval:null, renderer:'linearAxisRenderer', transform:null,
                label:{text:null, font:null, align:null},
                tickLabel:{formatString:null, font:null, align:null},
                ticks:null
            },
            axes:{xaxis:{}, yaxis:{}, x2axis:{show:false}, y2axis:{show:false}},
            grid:{gridLines:{}, background:{}, border:{}},
            title: { text:null, font:null, align:null},
            seriesDefaults: {show:true, xaxis:'xaxis', yaxis:'yaxis', renderer:'lineRenderer', transform:null},
            series:[]
        };
    
        // properties for the individual data series
        this.series = [];
        // the actual grid coordinates that will be plotted (in scaled grid coordinates)
        this.gridData = [];
        // properties for points of individual data series
        this.points = [];
        // properties for axes
        this.axes = {};
        this.grid = {};
        // handle to the grid canvas drawing context.  Holds the axes, grid, and labels.
        // Stuff that should be rendered only at initial plot drawing.
        this.gctx = null;
        // handle to the series  canvas drawing context.  Holds the rendered
        // rendered series which may be manipulated through user interaction.
        this.sctx = null;
        // handle to the overlay canvas drawing object.  Holds interactive content
        // like highlights that are rendered according to user interaction
        this.octx = null;
        // width and height of the canvas
        this.width = null;
        this.height = null;
        this.gridOffset = null;
        // max and min x and y
        this.dataBounds={xaxis:{min:null, max:null}, yaxis:{min:null, max:null}, x2axis:{min:null, max:null}, y2axis:{min:null, max:null}};
        
            
        this.init = function(target, data, options) {
            this.targetId = target;
            this.target = $(target);
            if (!this.target) throw "No plot target specified";
            this.height = this.target.css('height');
            this.width = this.target.css('width');
            if (this.height <=0 || this.width <=0) throw "Canvas dimensions <=0";
            // get a handle to the plot object from the target to help with events.
            $(target).data('jqplot', this);
            this.data = data;
            if (data.length < 1 || data[0].length < 2) throw "Invalid Plot data";
            this.parseOptions(options);
            
            // compute the min and max x and y values for each axes
            var db = this.dataBounds;
            
            for (var i=0; i<data.length; i++) {
                var d=data[i];
                var dbx = this.series[i].xaxis;
                var dby = this.series[i].yaxis;
                if (db[dbx].min == null) db[dbx].min = d[0][0];
                if (db[dbx].max == null) db[dbx].max = d[0][0];
                if (db[dby].min == null) db[dby].min = d[0][1];
                if (db[dby].max == null) db[dby].max = d[0][1];
                for (var j=0; j<d.length; j++) {
                    if (d[j][0] < db[dbx].min) db[dbx].min = d[j][0];
                    else if (d[j][0] > db[dbx].max) db[dbx].max = d[j][0];
                    if (d[j][1] < db[dby].min) db[dby].min = d[j][1];
                    else if (d[j][1] > db[dby].max) db[dby].max = d[j][1];
                }
            }
            
            this.processData();
        }
    
        // parse the user supplied options and override defaults, then
        // populate the instance properties
        this.parseOptions = function(){
            this.options = $.extend(true, {}, this.defaults, options);
            for (var axis in this.axes) {
                this.axes[axis] = $.extend(true, {}, this.options.axesDefaults, this.options.axes[axis]);
            }
            
            for (var i=0; i<this.data.length; i++) {
                var temp = $.extend(true, {}, this.options.seriesDefaults, this.options.series[i]);
                this.series.push(temp);
            }
            
            for (var i=0; i<this.data.length; i++) {
                var temp = $.extend(true, {}, this.options.pointsDefaults, this.options.points[i]);
                this.points.push(temp);
            }
            
            for (var opt in ['grid', 'title']) {
                this[opt] = $.extend(true, {}, this.options[opt]);
            }
        };
    
        // populate the gridData array with any necessary transformations
        this.processData = function(){
            // actually rather involved.
            // have to figure out:
            // overall size of canvas
            // space for axes labels, axes ticks, title, maybe grid border
            // (will it be inside, outside, or half&half on grid?)
            //
            // Then, figure out size of plotting area and offset from
            // top left of canvas.
            // then, tranform data points to plotting area coordinates
            // and ultimately transform that back to top left grid coordinates.
            
        };
    
        // determine xmax, xmin, ymax, ymin for each series
        this.getDataRange = function(){};
    
        // calculate tick spacing;
        this.setAxis = function(name) {
            // if a ticks array is specified, use it.
            var axis = this.axes[name];
            var db = this.dataBounds[name];
            if (axis.ticks.constructor == Array) {
                var temp = $.extend(true, [], axis.ticks);
                axis.ticks = {labels:[], values:[]};
                // if 2-D array, match them up
                if (temp[0].lenth) {
                    for (var i=0; i< temp; i++) {
                        axis.ticks.labels.push(temp[i][1].toString());
                        axis.ticks.values.push(parseFloat(temp[i][0]));
                    }
                }
                // else 1-D array
                else {
                    for (var i=0; i< temp; i++) {
                        axis.ticks.labels.push(temp[i].toString());
                        axis.ticks.values.push(parseFloat(temp[i]));
                    }
                }
            }
            // else call the axis renderer
            else this[this.axes[name].renderer].call(this, name);
        };
        
        
        this.linearAxisRenderer = function(name){
            var axis = this.axes[name];
            var db = this.dataBounds[name];
            var dim, interval;
            if (name == 'xaxis' || name == 'x2axis') dim = this.width;
            else dim = this.height;
            if (dim > 100) {
                axis.numberTicks = parseInt(2+(dim-100)/50);
            }
            else axis.numberTicks = 2;
            
            var range = (db.max - db.min)*(1+2*axis.margin);
            var rdbmin = db.min - range*axis.margin;
            var rdbmax = db.max - range*axis.margin;
            axis.tickInterval = range/axis.numberTicks;
            for (var i=0; i<axis.numberTicks; i++){
                axis.ticks.labels.push((rdbmin + i*axis.tickInterval).toString());
                axis.ticks.values.push(rdbmin + i*axis.tickInterval);
            }
        };
    
        // create the plot and add it do the dom
        this.draw = function(){};
    
        // Add the canvas element to the DOM
        this.insertCanvas = function(){};
    
        this.drawTitle = function(){};
    
        this.drawAxes = function(){
            var offsets;
            for (var axis in this.axes) {
                // axis labels not supported yet
                // offsets = this.drawAxisLabel(axis);
                offsets = [0,0];
                this.drawAxisTicks(axis);
            }
        };
        
        this.drawAxisLabel = function(axis) {};
        
        this.drawAxisTicks = function(axis) {
            
            
        };
    
        this.drawGrid = function(){};
    
        this.drawSeries = function(){};
    
        this.drawPoints = function(){};
    
        this.lineRenderer = function(){};   
    
        this.lineColors = ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"];
    
        this.colorMap = {
            aqua:[0,255,255],
            azure:[240,255,255],
            beige:[245,245,220],
            black:[0,0,0],
            blue:[0,0,255],
            brown:[165,42,42],
            cyan:[0,255,255],
            darkblue:[0,0,139],
            darkcyan:[0,139,139],
            darkgrey:[169,169,169],
            darkgreen:[0,100,0],
            darkkhaki:[189,183,107],
            darkmagenta:[139,0,139],
            darkolivegreen:[85,107,47],
            darkorange:[255,140,0],
            darkorchid:[153,50,204],
            darkred:[139,0,0],
            darksalmon:[233,150,122],
            darkviolet:[148,0,211],
            fuchsia:[255,0,255],
            gold:[255,215,0],
            green:[0,128,0],
            indigo:[75,0,130],
            khaki:[240,230,140],
            lightblue:[173,216,230],
            lightcyan:[224,255,255],
            lightgreen:[144,238,144],
            lightgrey:[211,211,211],
            lightpink:[255,182,193],
            lightyellow:[255,255,224],
            lime:[0,255,0],
            magenta:[255,0,255],
            maroon:[128,0,0],
            navy:[0,0,128],
            olive:[128,128,0],
            orange:[255,165,0],
            pink:[255,192,203],
            purple:[128,0,128],
            violet:[128,0,128],
            red:[255,0,0],
            silver:[192,192,192],
            white:[255,255,255],
            yellow:[255,255,0]
        }; 
    };
    
    $.jqplot = function(target, data, options) {
        var plot = new $._jqPlot();
        plot.init(target, data, options);
        plot.draw();
        return plot;
    };
    
    /**
     * From "JavaScript: the Definitive Guide, by David Flanagan. Copyright 2006 O'Reilly Media, Inc."
     * 
     * make(tagname, attributes, children):
     *   create an HTML element with specified tagname, attributes and children.
     * 
     * The attributes argument is a JavaScript object: the names and values of its
     * properties are taken as the names and values of the attributes to set.
     * If attributes is null, and children is an array or a string, the attributes 
     * can be omitted altogether and the children passed as the second argument. 
     *
     * The children argument is normally an array of children to be added to 
     * the created element.  If there are no children, this argument can be 
     * omitted.  If there is only a single child, it can be passed directly 
     * instead of being enclosed in an array. (But if the child is not a string
     * and no attributes are specified, an array must be used.)
     * 
     * Example: make("p", ["This is a ", make("b", "bold"), " word."]);
     *
     * Inspired by the MochiKit library (http://mochikit.com) by Bob Ippolito
     */
    function make(tagname, attributes, children) {
    
        // If we were invoked with two arguments the attributes argument is
        // an array or string, it should really be the children arguments.
        if (arguments.length == 2 && 
            (attributes instanceof Array || typeof attributes == "string")) {
            children = attributes;
            attributes = null;
        }

        // Create the element
        var e = document.createElement(tagname);

        // Set attributes
        if (attributes) {
            for(var name in attributes) e.setAttribute(name, attributes[name]);
        }

        // Add children, if any were specified.
        if (children != null) {
            if (children instanceof Array) {  // If it really is an array
                for(var i = 0; i < children.length; i++) { // Loop through kids
                    var child = children[i];
                    if (typeof child == "string")          // Handle text nodes
                        child = document.createTextNode(child);
                    e.appendChild(child);  // Assume anything else is a Node
                }
            }
            else if (typeof children == "string") // Handle single text child
                e.appendChild(document.createTextNode(children));
            else e.appendChild(children);         // Handle any other single child
        }

        // Finally, return the element.
        return e;
    }

    /**
     * From "JavaScript: the Definitive Guide, by David Flanagan. Copyright 2006 O'Reilly Media, Inc."
     * 
     * maker(tagname): return a function that calls make() for the specified tag.
     * Example: var table = maker("table"), tr = maker("tr"), td = maker("td");
     */
    function maker(tag) {
        return function(attrs, kids) {
            if (arguments.length == 1) return make(tag, attrs);
            else return make(tag, attrs, kids);
        }
    }
    
})(jQuery);