/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: @VERSION
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot  or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
 
 /**
 * 
 * This is a boot loader for the source version of jqplot.
 * It will load all of the necessary core jqplot files that
 * are concated together in the distribution.
 * 
 */

(function(){
    var getRootNode = function(){
        // figure out the path to this loader
        if(this["document"] && this["document"]["getElementsByTagName"]){
            var scripts = document.getElementsByTagName("script");
            var pat = /jquery\.jqplot\.js/i;
            for(var i = 0; i < scripts.length; i++){
                var src = scripts[i].getAttribute("src");
                if(!src){ continue; }
                var m = src.match(pat);
                if(m){
                    return { 
                        node: scripts[i], 
                        root: src.substring(0, m.index)
                    };
                }
            }
        }
    };


// if (window.$LAB === undefined) {
//     var _script = document.createElement('script');
//     _script.type = "text/javascript";
//     _script.src = "LAB.min.js";
//     document.getElementsByTagName("head")[0].appendChild(_script);
//     _script = null;
// }

// var $_loader = $LAB.sandbox();

// var bp = getRootNode().root;
// console.log(bp);

// $_loader.setOptions({BasePath:bp})
// .script('jqplot.core.js').wait()
// .script('jqplot.linearTickGenerator.js')
// .script('jqplot.linearAxisRenderer.js')
// .script('jqplot.axisTickRenderer.js')
// .script('jqplot.axisLabelRenderer.js')
// .script('jqplot.tableLegendRenderer.js')
// .script('jqplot.lineRenderer.js')
// .script('jqplot.lineRenderer.js')
// .script('jqplot.markerRenderer.js')
// .script('jqplot.divTitleRenderer.js')
// .script('jqplot.canvasGridRenderer.js')
// .script('jqplot.linePattern.js')
// .script('jqplot.shadowRenderer.js')
// .script('jqplot.shapeRenderer.js')
// .script('jqplot.themeEngine.js')
// .script('jsdate.js')
// .script('jqplot.sprintf.js')
// .script('jqplot.effects.core').wait()
// .script('jqplot.effects.blind.js');


// if (!window.LazyLoad) {
//     var _script = document.createElement('script');
//     _script.type = "text/javascript";
//     _script.src = "lazyload-min.js";
//     document.getElementsByTagName("head")[0].appendChild(_script);
//     _script = null;
// }

// LazyLoad.js(['jqplot.core.js', 'jqplot.linearTickGenerator.js', 'jqplot.linearAxisRenderer.js', 'jqplot.axisTickRenderer.js', 'jqplot.axisLabelRenderer.js', 'jqplot.tableLegendRenderer.js', 'jqplot.lineRenderer.js', 'jqplot.markerRenderer.js', 'jqplot.divTitleRenderer.js', 'jqplot.canvasGridRenderer.js', 'jqplot.linePattern.js', 'jqplot.shadowRenderer.js', 'jqplot.shapeRenderer.js', 'jqplot.sprintf.js', 'jsdate.js', 'jqplot.themeEngine.js', 'jqplot.toImage.js', 'jqplot.effects.core.js', 'jqplot.effects.blind.js']);


    var files = ['jqplot.core.js', 'jqplot.linearTickGenerator.js', 'jqplot.linearAxisRenderer.js', 'jqplot.axisTickRenderer.js', 'jqplot.axisLabelRenderer.js', 'jqplot.tableLegendRenderer.js', 'jqplot.lineRenderer.js', 'jqplot.markerRenderer.js', 'jqplot.divTitleRenderer.js', 'jqplot.canvasGridRenderer.js', 'jqplot.linePattern.js', 'jqplot.shadowRenderer.js', 'jqplot.shapeRenderer.js', 'jqplot.sprintf.js', 'jsdate.js', 'jqplot.themeEngine.js', 'jqplot.toImage.js', 'jqplot.effects.core.js', 'jqplot.effects.blind.js'];
    var rn = getRootNode().root;
    for (var i=0; i<files.length; i++) {
        var pp = rn+files[i];
        try {
            document.write("<scr"+"ipt type='text/javascript' src='"+pp+"'></scr"+"ipt>");
        } catch (e) {
            var script = document.createElement("script");
            script.src = pp;
            document.getElementsByTagName("head")[0].appendChild(script);
            // avoid memory leak
            script = null;
        }
    }
    
})();