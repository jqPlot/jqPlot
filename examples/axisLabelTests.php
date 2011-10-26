<?php 
    $title = "Line Charts and Options";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<p>jqPlot support axis labels through the "label" option of each axis.  The default label renderer creates labels in div tags, which allows full css control over every label.  Labels are assigned css classes like "jqplot-axis_name-label" where "axis_name" will be xaxis, yaxis, etc.</p>

<div id="chart1" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>


<p>By including the "jqplot.canvasTextRenderer.min.js" and "jqplot.canvasAxisLabelRenderer.min.js" plugins, you can render label text directly onto canvas elements.  This allows text to be rotated and yaxes will have their labels rotated 90 degrees by default.   By default the labels will be rendered using the Hershey font metrics and not stroked as text.  Most recent browsers (include IE 9) support native text rendering in canvas elements.</p>

<div id="chart2" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

      
<p>If a visitors is using a browser suppporting native canvas fonts, the plot belowsupported browser, they will see the labels in the plot below rendered as 12 pt Georgia (or their system serif font if Georgia is unavailable).  If they are on an unsupported browser, they will see the default Hershey font.</p>

<div id="chart3" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>


  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var cosPoints = []; 
  for (var i=0; i<2*Math.PI; i+=0.1){ 
     cosPoints.push([i, Math.cos(i)]); 
  } 
  var plot1 = $.jqplot('chart1', [cosPoints], {  
      series:[{showMarker:false}],
      axes:{
        xaxis:{
          label:'Angle (radians)'
        },
        yaxis:{
          label:'Cosine'
        }
      }
  });
});
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var cosPoints = []; 
  for (var i=0; i<2*Math.PI; i+=0.1){ 
     cosPoints.push([i, Math.cos(i)]); 
  } 
  var plot2 = $.jqplot('chart2', [cosPoints], {  
      series:[{showMarker:false}],
      axes:{
        xaxis:{
          label:'Angle (radians)',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        yaxis:{
          label:'Cosine',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        }
      }
  });
});
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var cosPoints = []; 
  for (var i=0; i<2*Math.PI; i+=0.1){ 
     cosPoints.push([i, Math.cos(i)]); 
  } 
  var plot3 = $.jqplot('chart3', [cosPoints], {  
      series:[{showMarker:false}],
      axes:{
        xaxis:{
          label:'Angle (radians)',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          labelOptions: {
            fontFamily: 'Georgia, Serif',
            fontSize: '12pt'
          }
        },
        yaxis:{
          label:'Cosine',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          labelOptions: {
            fontFamily: 'Georgia, Serif',
            fontSize: '12pt'
          }
        }
      }
  });
});
</script>



<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
