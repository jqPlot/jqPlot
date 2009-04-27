/*
*  $Rev$
*
*  $Id$
*/ 

// This is a bootstrap loader for using the source distribution of jqPlot.
// Unless you are doing development, you probably want one of the prepackaged distributions.
// You could also load all of the source files separately.
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
	}


    var files = ['jqplot.core.js', 'jqplot.linearAxisRenderer.js', 'jqplot.axisTickRenderer.js', 'jqplot.tableLegendRenderer.js', 'jqplot.lineRenderer.js', 'jqplot.markerRenderer.js', 'jqplot.divTitleRenderer.js', 'jqplot.canvasGridRenderer.js', 'jqplot.shadowRenderer.js', 'jqplot.sprintf.js'];
    var rn = getRootNode().root;
    for (var i=0; i<files.length; i++) {
        var pp = rn+files[i];
        try {
            document.write("<scr"+"ipt type='text/javascript' src='"+pp+"'></scr"+"ipt>");
        } catch (e) {
            var script = document.createElement("script");
            script.src = pp;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    }
    
})();