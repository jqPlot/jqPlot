<?php
  $title = "jqPlot Axis Label Examples";
  $jspec_title = "jqPlot Axis Label Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasTextRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasAxisLabelRenderer.js";
  require("opener.php");
?>

      
<p class="description">jqPlot support axis labels through the "label" option of each axis.  The default label renderer creates labels in div tags, which allows full css control over every label.  Labels are assigned css classes like "jqplot-axis_name-label" where "axis_name" will be xaxis, yaxis, etc.</p>

<div class="jqPlot" id="chart1" style="height:300px; width:500px;"></div>
     
<pre class="prettyprint plot"> 
var cosPoints = []; 
for (var i=0; i<2*Math.PI; i+=0.1){ 
   cosPoints.push([i, Math.cos(i)]); 
} 
plot1 = $.jqplot('chart1', [cosPoints], {  
    series:[{showMarker:false}],
    axes:{
      xaxis:{
        label:'Angle (radians)',
        autoscale: true
      },
      yaxis:{
        label:'Cosine',
        autoscale: true
      }
    }
});
</pre>
      
<p class="description">By including the "jqplot.canvasTextRenderer.js" and "jqplot.canvasAxisLabelRenderer.js" plugins, you can render label text directly onto canvas elements.  This allows text to be rotated and yaxes will have their labels rotated 90 degrees by default.   By default the labels will be rendered using the Hershey font metrics and not stroked as text.  Most browsers do not yet support native text rendering in canvas elements.</p>

<div class="jqPlot" id="chart2" style="height:300px; width:500px;"></div>
     
<pre class="prettyprint plot"> 
var cosPoints = []; 
for (var i=0; i<2*Math.PI; i+=0.1){ 
   cosPoints.push([i, Math.cos(i)]); 
} 
plot2 = $.jqplot('chart2', [cosPoints], {  
    series:[{showMarker:false}],
    axes:{
      xaxis:{
        label:'Angle (radians)',
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
      },
      yaxis:{
        label:'Cosine',
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
      }
    }
});
</pre>  
      
<p class="description">Native canvas text rendering is supported in FireFox 3.5+ and Safari 4+.  You can enable native font support in those browsers by setting the "enableFontSupport" option to true.  This allows you to also specify the font family of text rendered on the canvas labels.  If a visitors is using a supported browser, they will see the labels rendered as the specified fonts.  If they are on an unsupported browser, they will see the default Hershey font.</p>

<p class="description">The chart below will have labels rendered in 12pt Georgia if you are on a supported browser.  Otherwise, They will be in 12pt Hershey.</p>

<div class="jqPlot" id="chart3" style="height:300px; width:500px;"></div>
     
<pre class="prettyprint plot"> 
var cosPoints = []; 
for (var i=0; i<2*Math.PI; i+=0.1){ 
   cosPoints.push([i, Math.cos(i)]); 
} 
plot3 = $.jqplot('chart3', [cosPoints], {  
    series:[{showMarker:false}],
    axes:{
      xaxis:{
        label:'Angle (radians)',
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        labelOptions: {
          enableFontSupport: true,
          fontFamily: 'Courier',
          fontSize: '12pt'
        }
      },
      yaxis:{
        label:'Cosine',
        autoscale: true,
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        labelOptions: {
          enableFontSupport: true,
          fontFamily: 'Courier',
          fontSize: '12pt'
        }
      }
    }
});
</pre>    

<?php require('closer.php') ?>
