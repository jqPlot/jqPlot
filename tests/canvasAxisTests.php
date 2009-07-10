<?php
  $title = "jqPlot Graphs with Rotated Axis Text";
  $jspec_title = "jqPlot Graphs with Rotated Axis Text";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.dateAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasTextRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasAxisTickRenderer.js";
  require("opener.php");
?>  
      
<p class="description">Rotated axis text is possible through the "jqplot.canvasTextRenderer.js" and "jqplot.canvasAxisTickRenderer.js" plugins.  Native text rendering with the canvas tag is supported in FireFox 3.5 and Safari 4.  In these browsers, full css font specifications are supported.  For other browsers, text is drawn on canvas using the Hershey sans-serif font metrics.</p>
      
<div class="jqPlot" id="chart1" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">
line1=[['2008-09-30', 4], ['2008-10-30', 6.5], ['2008-11-30', 5.7], 
    ['2008-12-30', 9], ['2009-01-30', 8.2]];
plot1 = $.jqplot('chart1', [line1], {
    title:'Rotated Text with Canvas Axis',
    axes:{
        xaxis:{
            renderer:$.jqplot.DateAxisRenderer, 
            min:'August 30, 2008', 
            tickInterval:'1 month',
            rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer},
            tickOptions:{
                formatString:'%b %#d, %Y', 
                fontSize:'10pt', 
                fontFamily:'Tahoma', 
                angle:-40
            }
        }
    },
    series:[{lineWidth:4, markerOptions:{style:'square'}}]
});
</pre>

<?php require('closer.php') ?>