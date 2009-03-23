(function($) {
    var debug = 1;
    
    // function makeClass(klassname, konstructor) {
    //     var o = new Object();
    //     o.constructor = konstructor;
    //     o.classname = klassname;
    //     return o;
    // }
    // Axes object which contains all properties needed to draw an axis with 
    // the given renderer
    function Axis(name) {
        this.name = name;
        this.show = false;
        this.scale = 1.2;
        this.numberTicks;
        this.tickInterval;
        this.renderer = new linearAxisRenderer();
        this.label = {text:null, font:null, align:null};
        this.ticks = {labels:[], values:[], styles:[], formatString:'%.1f', font:null};
        this.height = 0;
        this.width = 0;
        this.elem;
        // lowest/highest user data associated with this axis.
        this.dataBounds = {min:null, max:null};
        // lowest/highest values on axis.
        this.min=null;
        this.max=null;
        this.style;
        // axis will push the grid at position by value
        this.gridOffsets;
        // pixel offsets of min/max labels
        this.offsets = {min:null, max:null};
    };
    
    // Series object
    function Series() {
        this.show = true;
        this.xaxis = 'xaxis';
        this._xaxis = new Axis(this.xaxis);
        this.yaxis = 'yaxis';
        this._yaxis = new Axis(this.yaxis);
        this.renderer = new lineRenderer();
        // raw user data points.  These should never be altered!!!
        this.data = [];
        // data in grid coordinates.  User data transformed for plotting on grid.
        this.gridData = [];
        this.points = {show:true, renderer: 'circleRenderer'};
        this.color;
        this.lineWidth = 2.5;
        this.shadow = true;
    };
    
    function Grid() {
        this.gridlines;
        this.background;
        this.border;
        this.width;
        this.height;
        this.top;
        this.left;
        this.width;
        this.height;
        
    };
    
    function circleRenderer(){};
    
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
        //this.options = {};
    
        // default options object to be overridden by user.
        this.defaults = {
            pointsDefaults: {},
            axesDefaults: {},
            axes: {xaxis:{}, yaxis:[], x2axis:{}, y2axis:{}},
            title: {},
            seriesDefaults: {},
            series:[]
        };
        // container for the individual data series
        this.series = [];
        this.axes = {xaxis: new Axis('xaxis'), yaxis: new Axis('yaxis'), x2axis: new Axis('x2axis'), y2axis: new Axis('y2axis')};
        this.grid = new Grid();
        this.title = {text:null, font:null};
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
        this.gridOffsets = {top:10, right:10, bottom:10, left:10};
        this.equalXTicks = true;
        this.equalYTicks = true;
        this.colorCyclerIdx = 0;
        this.seriesColors = ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"];
            
        this.init = function(target, data, options) {
            log('in init');
            //this.setDefaults();
            this.targetId = target;
            this.target = $('#'+target);
            // make sure the target is positioned by some means
            if (this.target.css('position') == 'static') this.target.css('position', 'relative');
            if (!this.target) throw "No plot target specified";
            this.height = parseFloat(this.target.css('height'));
            this.width = parseFloat(this.target.css('width'));
            if (this.height <=0 || this.width <=0) throw "Canvas dimensions <=0";
            // get a handle to the plot object from the target to help with events.
            $(target).data('jqplot', this);
            this.data = data;
            if (data.length < 1 || data[0].length < 2) throw "Invalid Plot data";
            this.parseOptions(options);
            
            // set the dataBounds (min and max) for each axis
            for (var i=0; i<this.series.length; i++) {
                this.series[i].renderer.processData.call(this.series[i]);
            }
        }
    
        // parse the user supplied options and override defaults, then
        // populate the instance properties
        this.parseOptions = function(options){
            log('in parseOptions');
            var opts = $.extend(true, {}, this.defaults, options);
            for (var n in this.axes) {
                // opts.axes[axis] = $.extend(true, {}, opts.axesDefaults, opts.axes[axis]);
                // for (var p in opts.axes[axis]){
                //     this.axes[axis][p] = opts.axes[axis][p];
                // }
                var axis = this.axes[n];
                $.extend(true, axis, opts.axesDefaults, opts.axes[n]);
                switch (n) {
                    case 'xaxis':
                        axis.style = {position:'absolute', left:'0px', bottom:'0px'};
                        axis.height = 0;
                        axis.width = this.width;
                        axis.gridOffset = 'bottom';
                        break;
                    case 'x2axis':
                        axis.style = {position:'absolute', left:'0px', top:'0px'};
                        axis.height = 0;
                        axis.width = this.width;
                        axis.gridOffset = 'top';
                        break;
                    case 'yaxis':
                        axis.style = {position:'absolute', left:'0px', top:'0px'};
                        axis.height = this.height;
                        axis.width = 0;
                        axis.gridOffset = 'left';
                        break;
                    case 'y2axis':
                        axis.style = {position:'absolute', right:'0px', top:'0px'};
                        axis.height = this.height;
                        axis.width = 0;
                        axis.gridOffset = 'right';
                        break;
                    default:
                        break;
                }
            }
            
            for (var i=0; i<this.data.length; i++) {
                var temp = $.extend(true, new Series(), opts.series[i]);
                temp.data = this.data[i];
                switch (temp.xaxis) {
                    case 'xaxis':
                        temp._xaxis = this.axes.xaxis;
                        break;
                    case 'x2axis':
                        temp._xaxis = this.axes.x2axis;
                        break;
                    default:
                        break;
                }
                switch (temp.yaxis) {
                    case 'yaxis':
                        temp._yaxis = this.axes.yaxis;
                        break;
                    case 'y2axis':
                        temp._yaxis = this.axes.y2axis;
                        break;
                    default:
                        break;
                }
                if (temp.show) {
                    temp._xaxis.show = true;
                    temp._yaxis.show = true;
                }
                if (!temp.color) temp.color = this.seriesColors[i];
                this.series.push(temp);
            }
            
            // copy the grid and title options into this object.
            for (var opt in ['grid', 'title']) {
                this[opt] = $.extend(true, {}, opts[opt]);
            }
        };
    
        // determine xmax, xmin, ymax, ymin for each series
        this.getDataRange = function(){};
    
        // Populate the axis properties, giving a label and value
        // (corresponding to the user data coordinates, not plot coords.)
        // for each tick on the axis.
        this.setAxis = function(name) {
            // if a ticks array is specified, use it to fill in
            // the labels and values.
            var axis = this.axes[name];
            axis.gridHeight = this.height;
            axis.gridWidth = this.width;
            var db = axis.dataBounds;
            if (axis.ticks && axis.ticks.constructor == Array) {
                var temp = $.extend(true, [], axis.ticks);
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
            // else call the axis renderer and fill in the labels
            // and values from there.
            else axis.renderer.fill.call(axis);
        };
        
        this.pack = function() {
            for (var name in this.axes) {
                var axis = this.axes[name];
                axis.renderer.pack.call(axis, this.gridOffsets);
            }
            this.grid.top = this.gridOffsets.top;
            this.grid.left = this.gridOffsets.left;
            this.grid.height = this.height - this.gridOffsets.top - this.gridOffsets.bottom;
            this.grid.width = this.width - this.gridOffsets.left - this.gridOffsets.right;
            this.grid.bottom = this.grid.top + this.grid.height;
            this.grid.right = this.grid.left + this.grid.width;
        }
    
        // create the plot and add it do the dom
        this.draw = function(){
            this.drawTitle();
            this.drawAxes();
            this.pack();
            this.makeCanvas();
            this.drawGrid();
            this.drawSeries();
        };
    
        // Add the canvas element to the DOM
        this.insertCanvas = function(){};
    
        this.drawTitle = function(){};
    
        this.drawAxes = function(){
            for (var name in this.axes) {
                var axis = this.axes[name];
                if (axis.show) {
                    // populate the axis label and value properties.
                    this.setAxis(name);
                    // fill a div with axes labels in the right direction.
                    // Need to pregenerate each axis to get it's bounds and
                    // position it and the labels correctly on the plot.
                    var h, w;
                    axis.elem = makeTag('div', {class:'jqplot', style:axis.style});
                    // divs don't have dimensions untill added to dom
                    this.target.append(axis.elem);
                    for (var i=0; i<axis.ticks.labels.length; i++) {
                        var elem = makeTag('div', {class:'jqplot', style:axis.ticks.styles[i]}, axis.ticks.labels[i]);
                        axis.elem.appendChild(elem);
                        h = $(elem).outerHeight();
                        w = $(elem).outerWidth();
                        if (axis.height < h) {
                            axis.height = h;
                            this.gridOffsets[axis.gridOffset] = h;
                        }
                        if (axis.width < w) {
                            axis.width = w;
                            this.gridOffsets[axis.gridOffset] = w;
                        }
                    }
                    $(axis.elem).height(axis.height);
                    $(axis.elem).width(axis.width);
                }
            }
            
            // if want equal axis ticks, recompute
            if (this.equalXTicks) {
                this.axes.x2axis.numberTicks = this.axes.xaxis.numberTicks;
                this.setAxis('x2axis');
            } 
            
            if (this.equalYTicks) {
                this.axes.y2axis.numberTicks = this.axes.yaxis.numberTicks;
                this.setAxis('y2axis');
            } 
        };
        
        this.drawGrid = function(){
            // Add the grid onto the grid canvas.  This is the bottom most layer.
            var ctx = this.gctx;
            var grid = this.grid;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#cccccc';
            for (var name in this.axes) {
                var axis = this.axes[name];
                if (axis.show) {
                    log(name);
                    var ticks = axis.ticks;
                    switch (name) {
                        case 'xaxis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                ctx.beginPath();
                                ctx.moveTo(pos, grid.top);
                                ctx.lineTo(pos, grid.bottom+4);
                                ctx.stroke();
                            }
                            break;
                        case 'yaxis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                ctx.beginPath();
                                ctx.moveTo(grid.right, pos);
                                ctx.lineTo(grid.left-4, pos);
                                ctx.stroke();
                            }
                            break;
                        case 'x2axis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                ctx.beginPath();
                                ctx.moveTo(pos, grid.bottom);
                                ctx.lineTo(pos, grid.top-4);
                                ctx.stroke();
                            }
                            break;
                        case 'y2axis':
                            for (var i=0; i<ticks.values.length; i++) {
                                var pos = Math.round(axis.u2p(ticks.values[i])) + 0.5;
                                ctx.beginPath();
                                ctx.moveTo(grid.left, pos);
                                ctx.lineTo(grid.right+4, pos);
                                ctx.stroke();
                            }
                            break;
                    }
                }
            }
            ctx.save();
            ctx.lineWidth = 2.0;
            ctx.strokeStyle = '#999999';
            ctx.strokeRect(grid.left, grid.top, grid.width, grid.height);
            ctx.restore();
        };
    
        this.makeCanvas = function(){
            this.gridCanvas = document.createElement('canvas');
            this.gridCanvas.width = this.width;
            this.gridCanvas.height = this.height;
            if ($.browser.msie) // excanvas hack
                this.gridCanvas = window.G_vmlCanvasManager.initElement(this.gridCanvas);
            $(this.gridCanvas).css({ position: 'absolute', left: 0, top: 0 });
            this.target.append(this.gridCanvas);
            this.gctx = this.gridCanvas.getContext("2d");
            
            this.seriesCanvas = document.createElement('canvas');
            this.seriesCanvas.width = this.width;
            this.seriesCanvas.height = this.height;
            if ($.browser.msie) // excanvas hack
                this.seriesCanvas = window.G_vmlCanvasManager.initElement(this.seriesCanvas);
            $(this.seriesCanvas).css({ position: 'absolute', left: 0, top: 0 });
            this.target.append(this.seriesCanvas);
            this.sctx = this.seriesCanvas.getContext("2d");
            
            this.overlayCanvas = document.createElement('canvas');
            this.overlayCanvas.width = this.width;
            this.overlayCanvas.height = this.height;
            if ($.browser.msie) // excanvas hack
                this.overlayCanvas = window.G_vmlCanvasManager.initElement(this.overlayCanvas);
            $(this.overlayCanvas).css({ position: 'absolute', left: 0, top: 0 });
            this.target.append(this.overlayCanvas);
            this.octx = this.overlayCanvas.getContext("2d");
            log (this.sctx);
        };
    
        this.drawSeries = function(){
            for (var i=0; i<this.series.length; i++) {
                this.series[i].renderer.draw.call(this.series[i], this.grid, this.sctx);
            }
        };
    
        this.drawPoints = function(){};   
    
        // this.colorCycler = function() {
        //     var color = this.colorCyclerColors[this.colorCyclerIdx];
        //     this.colorCyclerIdx += 1;
        //     return color;
        // }
    };
    
    $.jqplot = function(target, data, options) {
        options = options || {};
        var plot = new $._jqPlot();
        plot.init(target, data, options);
        plot.draw();
        return plot;
    };
           
    function linearAxisRenderer() {
    };
    
    linearAxisRenderer.prototype.fill = function() {
        log('in linearAxisRenderer');
        var name = this.name;
        var db = this.dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        if (name == 'xaxis' || name == 'x2axis') {
            dim = this.width;
        }
        else {
            dim = this.height;
        }
        if (this.numberTicks == null){
            if (dim > 100) {
                this.numberTicks = parseInt(3+(dim-100)/75);
            }
            else this.numberTicks = 3;
        }
        
        min = this.min || db.min;
        max = this.max || db.max;
        var range = max - min;
        var rmin = min - (this.min != null ? 0 : range/2*(this.scale - 1));
        var rmax = max + (this.max != null ? 0 : range/2*(this.scale - 1));
        this.min = rmin;
        this.max = rmax;
        this.tickInterval = (rmax - rmin)/(this.numberTicks-1);
        for (var i=0; i<this.numberTicks; i++){
            var tt = rmin + i*this.tickInterval
            this.ticks.labels.push(sprintf(this.ticks.formatString, tt));
            this.ticks.values.push(rmin + i*this.tickInterval);
            var pox = i*15+'px';
            switch (name) {
                case 'xaxis':
                    this.ticks.styles.push({position:'absolute', top:'0px', left:pox, paddingTop:'10px'});
                    break;
                case 'x2axis':
                    this.ticks.styles.push({position:'absolute', bottom:'0px', left:pox, paddingBottom:'10px'});
                    break;
                case 'yaxis':
                    this.ticks.styles.push({position:'absolute', right:'0px', top:pox, paddingRight:'10px'});
                    break;
                case 'y2axis':
                    this.ticks.styles.push({position:'absolute', left:'0px', top:pox, paddingLeft:'10px'});
                    break;
                    
            }
        }
        if (name == 'yaxis' || name == 'y2axis') this.ticks.styles.reverse();
    };
    
    // Now we know offsets around the grid, we can define conversioning functions
    // and properly lay out the axes.
    linearAxisRenderer.prototype.pack = function(offsets) {
        log('in packer');;
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
    
    function lineRenderer(){
    };

    lineRenderer.prototype.draw = function(grid, ctx) {
        var i;
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        var d = this.data;
        var xp = this._xaxis.u2p;
        var yp = this._yaxis.u2p;
//        var start = true;
//        // populate the gridData property for sections on grid
//        for (i=0; i<this.data.length; i++) {
//            var d = this.data[i];
//            if (d == null) continue;
//            // check to see if we've just started line.
//            if (start) {
//                // if below an axis, interpolate to next point only.
//                if (d[0] < this._yaxis.min) {
//                    
//                }
//            }
//            if (d[0] < this._yaxis.min)
//        }
        var pointx, pointy;
        this.gridData.push([xp.call(this._xaxis, this.data[0][0]), yp.call(this._yaxis, this.data[0][1])]);
        ctx.moveTo(this.gridData[0][0], this.gridData[0][1]);
        for (var i=1; i<this.data.length; i++) {
            this.gridData.push([xp.call(this._xaxis, this.data[i][0]), yp.call(this._yaxis, this.data[i][1])]);
            ctx.lineTo(this.gridData[i][0], this.gridData[i][1]);
        }
        ctx.stroke();
        ctx.restore();
    };
    
    lineRenderer.prototype.processData = function() {   
        var d = this.data;
        var i;
        var dbx = this._xaxis.dataBounds;
        var dby = this._yaxis.dataBounds;
        // weed out any null points and set the axes bounds
        for (i=0; i<d.length; i++) {
            if (d[i] == null || d[i][0] == null || d[i][1] == null) d[i] = null;
            else {                
                if (d[i][0] < dbx.min || dbx.min == null) dbx.min = d[i][0];
                else if (d[i][0] > dbx.max || dbx.max == null) dbx.max = d[i][0];
                if (d[i][1] < dby.min || dby.min == null) dby.min = d[i][1];
                else if (d[i][1] > dby.max || dby.max == null) dby.max = d[i][1];
            }
        }
    }
    
    $._jqPlot.colorMap = {
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
    function makeTag(tagname, attributes, children) {

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
            for(var name in attributes) {
                if (name == 'style') {
                    for (var s in attributes[name]) {
                        e.style[s] = attributes[name][s].toString();
                    }
                }
                else e.setAttribute(name, attributes[name]);
            }
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
    };    


    /**
     * From "JavaScript: the Definitive Guide, by David Flanagan. Copyright 2006 O'Reilly Media, Inc."
     * 
     * maker(tagname): return a function that calls make() for the specified tag.
     * Example: var table = maker("table"), tr = maker("tr"), td = maker("td");
     */
    function tagMaker(tag) {
        return function(attrs, kids) {
            if (arguments.length == 1) return make(tag, attrs);
            else return make(tag, attrs, kids);
        }
    }
	
	// Convienence function that won't hang IE.
	function log(something) {
	    if (window.console && debug) {
	        console.log(something);
	    }
	};
	
    /**
     * sprintf() for JavaScript v.0.4
     *
     * Copyright (c) 2007 Alexandru Marasteanu <http://alexei.417.ro/>
     * Thanks to David Baird (unit test and patch).
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU General Public License as published by the Free Software
     * Foundation; either version 2 of the License, or (at your option) any later
     * version.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
     * details.
     *
     * You should have received a copy of the GNU General Public License along with
     * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
     * Place, Suite 330, Boston, MA 02111-1307 USA
     */
// 
// It's prototype is simple:
// 
// string sprintf(string format[mixed arg1[, mixed arg2[,...]]])
// The placeholders in the format string are marked by "%" and are followed by one or more of these elements, in this order:
// 
// An optional "+" sign that forces to preceed the result with a plus or minus sign on numeric values. By default, only the "-" sign is used on negative numbers.
// An optional padding specifier that says what character to use for padding (if specified). Possible values are 0 or any other character precedeed by a '. The default is to pad with spaces.
// An optional "-" sign, that causes sprintf to left-align the result of this placeholder. The default is to right-align the result.
// An optional number, that says how many characters the result should have. If the value to be returned is shorter than this number, the result will be padded.
// An optional precision modifier, consisting of a "." (dot) followed by a number, that says how many digits should be displayed for floating point numbers. When used on a string, it causes the result to be truncated.
// A type specifier that can be any of:
// % - print a literal "%" character
// b - print an integer as a binary number
// c - print an integer as the character with that ASCII value
// d - print an integer as a signed decimal number
// e - print a float as scientific notation
// u - print an integer as an unsigned decimal number
// f - print a float as is
// o - print an integer as an octal number
// s - print a string as is
// x - print an integer as a hexadecimal number (lower-case)
// X - print an integer as a hexadecimal number (upper-case)
// 

    function str_repeat(i, m) { for (var o = []; m > 0; o[--m] = i); return(o.join('')); }

    function sprintf () {
      var i = 0, a, f = arguments[i++], o = [], m, p, c, x;
      while (f) {
        if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
        else if (m = /^\x25{2}/.exec(f)) o.push('%');
        else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
          if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) throw("Too few arguments.");
          if (/[^s]/.test(m[7]) && (typeof(a) != 'number'))
            throw("Expecting number but found " + typeof(a));
          switch (m[7]) {
            case 'b': a = a.toString(2); break;
            case 'c': a = String.fromCharCode(a); break;
            case 'd': a = parseInt(a); break;
            case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
            case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
            case 'o': a = a.toString(8); break;
            case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
            case 'u': a = Math.abs(a); break;
            case 'x': a = a.toString(16); break;
            case 'X': a = a.toString(16).toUpperCase(); break;
          }
          a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
          c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
          x = m[5] - String(a).length;
          p = m[5] ? str_repeat(c, x) : '';
          o.push(m[4] ? a + p : p + a);
        }
        else throw ("Huh ?!");
        f = f.substring(m[0].length);
      }
      return o.join('');
    }
    
    $.sprintf = sprintf;
    
})(jQuery);