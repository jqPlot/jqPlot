(function($) {
    var debug = 1;
    // Axes object which contains all properties needed to draw an axis with 
    // the given renderer
    function Axis(name) {
        this.name = name;
        this.show = false;
        this.scale = 1.2;
        this.numberTicks;
        this.tickInterval;
        this.renderer = 'linearAxisRenderer';
        this.label = {text:null, font:null, align:null};
        this.ticks = {labels:[], values:[], formatString:'%.1f', font:null};
        this.height = 0;
        this.width = 0;
        this.elem;
        this.dataBounds = {min:null, max:null};
    };
    
    // Series object
    function Series() {
        this.show = true;
        // when options are parsed, these properties will reference
        // actual axes objects.
        this.xaxis = 'xaxis';
        this.yaxis = 'yaxis';
        this.renderer = 'lineRenderer';
        // raw user data points.  These should never be altered!!!
        this.data = [];
        // data in grid coordinates.  User data transformed for plotting on grid.
        this.gridData = [];
        this.points = {show:true, renderer: 'circleRenderer'}
    };
    
    // function Point() {
    //     this.show = true;
    //     this.renderer = 'circleRenderer';
    //     // the x, y coordinates on the grid.
    //     this.x;
    //     this.y;
    //     // the x, y values of the corresponding user data.
    //     // these should never be changed!!!
    //     this._x;
    //   ;  this._y;
    // }
    
    function Grid() {
        this.gridlines;
        this.background;
        this.border;
        this.renderer = 'defaultGridRenderer';
    };
    

        
        
    function linearAxisRenderer(axis) {
        log('in linearAxisRenderer');
        var name = axis.name;
        var db = axis.dataBounds;
        var dim, interval;
        if (name == 'xaxis' || name == 'x2axis') dim = this.width;
        else dim = this.height;
        if (dim > 100) {
            axis.numberTicks = parseInt(2+(dim-100)/50);
        }
        else axis.numberTicks = 2;
        
        var range = db.max - db.min;
        var rdbmin = db.min - range/2*(axis.scale - 1);
        var rdbmax = db.max + range/2*(axis.scale - 1);
        axis.tickInterval = (db.max - db.min)/axis.numberTicks;
        for (var i=0; i<axis.numberTicks; i++){
            var tt = rdbmin + i*axis.tickInterval
            axis.ticks.labels.push(sprintf(axis.ticks.formatString, tt));
            axis.ticks.values.push(rdbmin + i*axis.tickInterval);
        }
    };
    
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
            axes:{xaxis:{}, yaxis:{}, x2axis:{}, y2axis:{}},
            grid:{},
            title: {},
            seriesDefaults: {},
            series:[]
        };
    
        // properties for the individual data series
        this.series = [];
        // the actual grid coordinates that will be plotted (in scaled grid coordinates)
        // this.gridData = [];
        // properties for points of individual data series
        // this.points = [];
        // properties for axes
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
        this.gridOffsets = {top:0, right:0, bottom:0, left:0};
        // max and min x and y
        // this.dataBounds={xaxis:{min:null, max:null}, yaxis:{min:null, max:null}, x2axis:{min:null, max:null}, y2axis:{min:null, max:null}};
        
        // this.setDefaults = function() {
        //     // set defaults to default properties of the respective objects.
        //     // This is for ... what?... why bother, objects will have
        //     // defaults when initialized.
        //     var a = new Axis();
        //     var s = new Series();
        //     var p = new Point();
        //     var g = new Grid();
        //     for (var prop in a)
        //         this.defaults.axesDefaults[prop] = a[prop];
        //     for (var prop in s) 
        //         this.defaults.seriesDefaults[prop] = a[prop];
        //     for (var prop is p)
        //         this.defaults.pointsDefaults[prop] = a[prop];
        //     for (var prop in g)
        //         this.defaults.grid[prop] = a[prop]
        // }
        
            
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
            
            // compute the min and max x and y values for each axes
            // var db = this.dataBounds;
            // 
            // // need to:  set the databounds on the plot and for each axes.
            // // these are user data bounds, not display bounds
            // for (var i=0; i<data.length; i++) {
            //     var d=data[i];
            //     // get the axis name from the series
            //     var dbx = this.series[i].xaxis.name;
            //     var dby = this.series[i].yaxis.name;
            //     if (db[dbx].min == null) db[dbx].min = d[0][0];
            //     if (db[dbx].max == null) db[dbx].max = d[0][0];
            //     if (db[dby].min == null) db[dby].min = d[0][1];
            //     if (db[dby].max == null) db[dby].max = d[0][1];
            //     for (var j=0; j<d.length; j++) {
            //         if (d[j][0] < db[dbx].min) db[dbx].min = d[j][0];
            //         else if (d[j][0] > db[dbx].max) db[dbx].max = d[j][0];
            //         if (d[j][1] < db[dby].min) db[dby].min = d[j][1];
            //         else if (d[j][1] > db[dby].max) db[dby].max = d[j][1];
            //     }
            // }
            
            for (var i=0; i<this.series.length; i++) {
                var s = this.series[i];
                var d = s.data;
                var dbx = s.xaxis.dataBounds;
                var dby = s.yaxis.dataBounds;
                if (dbx.min == null) dbx.min = d[0][0];
                if (dbx.max == null) dbx.max = d[0][0];
                if (dby.min == null) dby.min = d[0][1];
                if (dby.max == null) dby.max = d[0][1];
                for (var j=0; j<d.length; j++) {
                    if (d[j][0] < dbx.min) dbx.min = d[j][0];
                    else if (d[j][0] > dbx.max) dbx.max = d[j][0];
                    if (d[j][1] < dby.min) dby.min = d[j][1];
                    else if (d[j][1] > dby.max) dby.max = d[j][1];
                }
            }
            
            this.processData();
        }
    
        // parse the user supplied options and override defaults, then
        // populate the instance properties
        this.parseOptions = function(options){
            log('in parseOptions');
            var opts = $.extend(true, {}, this.defaults, options);
            for (var axis in opts.axes) {
                // opts.axes[axis] = $.extend(true, {}, opts.axesDefaults, opts.axes[axis]);
                // for (var p in opts.axes[axis]){
                //     this.axes[axis][p] = opts.axes[axis][p];
                // }
                $.extend(true, this.axes[axis], opts.axesDefaults, opts.axes[axis]);
            }
            
            for (var i=0; i<this.data.length; i++) {
                var temp = $.extend(true, new Series(), opts.series[i]);
                temp.data = this.data[i];
                switch (temp.xaxis) {
                    case 'xaxis':
                        temp.xaxis = this.axes.xaxis;
                        break;
                    case 'x2axis':
                        temp.xaxis = this.axes.x2axis;
                        break;
                    default:
                        break;
                }
                switch (temp.yaxis) {
                    case 'yaxis':
                        temp.yaxis = this.axes.yaxis;
                        break;
                    case 'y2axis':
                        temp.yaxis = this.axes.y2axis;
                        break;
                    default:
                        break;
                }
                if (temp.show) {
                    temp.xaxis.show = true;
                    temp.yaxis.show = true;
                }
                // if (!temp.xaxis) temp.xaxis = 'xaxis';
                // if (!temp.yaxis) temp.yaxis = 'yaxis';
                this.series.push(temp);
                // this.axes[temp.xaxis.].show = true;
                // this.axes[temp.yaxis].show = true;
            }
            
            // for (var i=0; i<this.data.length; i++) {
            //     var temp = $.extend(true, {}, this.options.pointsDefaults, this.options.points[i]);
            //     this.points.push(temp);
            // }
            
            // copy the grid and title options into this object.
            for (var opt in ['grid', 'title']) {
                this[opt] = $.extend(true, {}, opts[opt]);
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
    
        // Populate the axis properties, giving a label and value
        // (corresponding to the user data coordinates, not plot coords.)
        // for each tick on the axis.
        this.setAxis = function(name) {
            // if a ticks array is specified, use it to fill in
            // the labels and values.
            var axis = this.axes[name];
            var db = this.dataBounds[name];
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
            else this[this.axes[name].renderer].call(this, name);
        };
    
        // create the plot and add it do the dom
        this.draw = function(){
            this.drawAxes();
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
                    var style, h, w, offset;
                    switch (name) {
                        case 'xaxis':
                            style = {position:'absolute', left:'0px', bottom:'0px'};
                            axis.height = 0;
                            axis.width = this.width;
                            offset = 'bottom';
                            break;
                        case 'x2axis':
                            style = {position:'absolute', left:'0px', top:'0px'};
                            axis.height = 0;
                            axis.width = this.width;
                            offset = 'top';
                            break;
                        case 'yaxis':
                            style = {position:'absolute', left:'0px', top:'0px'};
                            axis.height = this.height;
                            axis.width = 0;
                            offset = 'left';
                            break;
                        case 'y2axis':
                            style = {position:'absolute', right:'0px', top:'0px'};
                            axis.height = this.height;
                            axis.width = 0;
                            offset = 'right';
                            break;
                        default:
                            break;
                    }
                    axis.elem = makeTag('div', {style:style});
                    // divs don't have dimensions untill added to dom
                    this.target.append(axis.elem);
                    for (var i=0; i<axis.ticks.labels.length; i++) {
                        var elem = makeTag('div', axis.ticks.labels[i]);
                        axis.elem.appendChild(elem);
                        h = $(elem).outerHeight();
                        w = $(elem).outerWidth();
                        console.log(h,w);
                        if (axis.height < h) {
                            axis.height = h;
                            this.gridOffsets[offset] = h;
                        }
                        if (axis.width < w) {
                            axis.width = w;
                            this.gridOffsets[offset] = w;
                        }
                    }
                }
            }
            
            // now have all the axes with their dimensions, position the labels
            
            
        };
        
        this.fillAxisContainer = function(name) {
            var axis = this.axes[name];
            for (var i=0; i<axis.ticks.labels.length; i++) {
                var elem = makeTag('div', {style:{position:'absolute',
                    bottom:'0px', left:'0px'}}, axis.ticks.labels[i]);
            }
            return axis.elem;
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
        log(arguments);
        options = options || {};
        var plot = new $._jqPlot();
        plot.init(target, data, options);
        // plot.draw();
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