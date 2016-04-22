<?php 
    $title = "Line Charts and Options - Variable Markers";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<p>There are numerous line style options to control how the lines and markers are displayed.</p>

<div id="chart1" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>


<p>The following example shows how to control marker options depending on the data point, using the markerOptionsCallback.</p>

<div id="chart2" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<script type="text/javascript">
var cosPoints = [];
var sinPoints = []; 
var powPoints1 = [];
var powPoints2 = []; 
$(document).ready(function(){
  // Some simple loops to build up data arrays.
  for (var i=0; i<2*Math.PI; i+=1){ 
    cosPoints.push([i, Math.cos(i)]); 
  }
   
  for (var i=0; i<2*Math.PI; i+=0.4){ 
     sinPoints.push([i, 2*Math.sin(i-.8)]); 
  }
    
  for (var i=0; i<2*Math.PI; i+=1) { 
      powPoints1.push([i, 2.5 + Math.pow(i/4, 2)]); 
  }
   
  for (var i=0; i<2*Math.PI; i+=1) { 
      powPoints2.push([i, -2.5 - Math.pow(i/4, 2)]); 
  }
});
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var plot1 = $.jqplot('chart1', [cosPoints, sinPoints, powPoints1, powPoints2], 
    { 
      title:'Line Style Options', 
      // Set default options on all series, turn on smoothing.
      seriesDefaults: {
          rendererOptions: {
              smooth: true
          }
      },
      // Series options are specified as an array of objects, one object
      // for each series.
      series:[ 
          {
            // Change our line width and use a diamond shaped marker.
            lineWidth:2, 
            markerOptions: { style:'circle' }
          }, 
          {
            // Don't show a line, just show markers.
            // Make the markers 7 pixels with an 'x' style
            showLine:false, 
            markerOptions: { size: 7, style:"x" }
          },
          { 
            // Use (open) circlular markers.
            markerOptions: { size:20, style:"diamond" }
          }, 
          {
            // Use a thicker, 5 pixel line and 10 pixel
            // filled square markers.
            lineWidth:5, 
            markerOptions: { style:"filledSquare", size:10 }
          }
      ]
    }
  );
   
});
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var plot2 = $.jqplot('chart2', [cosPoints, sinPoints, powPoints1, powPoints2], 
    { 
      title:'Line Style Options', 
      // Set default options on all series, turn on smoothing.
      seriesDefaults: {
          rendererOptions: {
              smooth: true
          }
      },
      // Series options are specified as an array of objects, one object
      // for each series.
      series:[ 
          {
            // Change our line width and use a diamond shaped marker.
            lineWidth:2, 
            markerOptions: { style:'circle' },
            markerOptionsCallback: function(plot, series, idx, dataPoint, gridDataPoint) {
                var opts =  {};
                if (dataPoint[1] < 0) {
                    opts.color = "red";
                }
                return opts;
            }
          }, 
          {
            // Don't show a line, just show markers.
            // Make the markers 7 pixels with an 'x' style
            showLine:false, 
            markerOptions: { size: 7, style:"x" },
            markerOptionsCallback: function(plot, series, idx, dataPoint, gridDataPoint) {
                var opts =  { style:"diamond" };
                if (dataPoint[1] < 0) {
                    opts.color = "red";
                }
                return opts;
            }
          },
          { 
            // Use (open) circlular markers.
            markerOptions: { size: 20 , style:"circle" },
            markerOptionsCallback: function(plot, series, idx, dataPoint, gridDataPoint) {
                if (idx < 2) {
                    return { style:"square" };
                } else if (idx < 4) {
                    return { style:"diamond" };
                } else if (idx < 5) {
                    return { style: "filledDiamond", color: "blue" };
                }
            }
          }, 
          {
            // Use a thicker, 5 pixel line and 10 pixel
            // filled square markers.
            lineWidth:5, 
            markerOptions: { style:"filledSquare", size:10 },
            markerOptionsCallback: function(plot, series, idx, dataPoint, gridDataPoint) {
                var opts =  {};
                if (dataPoint[0] >3) {
                    opts.color = "yellow";
                }
                return opts;
            }
          }
      ]
    }
  );
   
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

<?php include "closer.php"; ?>
