<?php 
    $title = "Plot Creation with jQuery Selectors";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<div id="chart1" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<div class="chart2" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<div class="jqplot" style="height:300px; width:500px;"></div>

<div class="jqplot" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

  
<script class="code" type="text/javascript">
$(document).ready(function(){
  // Use jQuery selector for a specific element ID.
  $('#chart1').jqplot([[3,7,9,1,5,3,8,2,5]]);
});
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  // jQuery selector for elements with a specific class attribute.
  // Here, there is one div with the class "chart2"
  $(".chart2").jqplot ([[3,7,9,1,5,3,8,2,5]], {
      title: "Plot With Options",
      axesDefaults: {
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
      },
      seriesDefaults: {
          rendererOptions: {
              smooth: true
          }
      },
      axes: {
        xaxis: {
          label: "X Axis",
          pad: 0
        },
        yaxis: {
          label: "Y Axis"
        }
      }
    });
});

// the jqPlot plot object can be accessed through the jQuery "data" method:
//
// >>> $('.chart2').data('jqplot').series[0].data
// [[1, 3], [2, 7], [3, 9], [4, 1], [5, 5], [6, 3], [7, 8], [8, 2], [9, 5]]
  
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  // Some simple loops to build up data arrays.
  var cosPoints = [];
  for (var i=0; i<2*Math.PI; i+=1){ 
    cosPoints.push([i, Math.cos(i)]); 
  }
   
  var sinPoints = []; 
  for (var i=0; i<2*Math.PI; i+=0.4){ 
     sinPoints.push([i, 2*Math.sin(i-.8)]); 
  }
   
  var powPoints1 = []; 
  for (var i=0; i<2*Math.PI; i+=1) { 
      powPoints1.push([i, 2.5 + Math.pow(i/4, 2)]); 
  }
   
  var powPoints2 = []; 
  for (var i=0; i<2*Math.PI; i+=1) { 
      powPoints2.push([i, -2.5 - Math.pow(i/4, 2)]); 
  } 

  // jQuery selector for all divs with a class of "jqplot".
  // Here, there are two divs that match.  By supplying 2 seperate
  // arrays of data, each plot will have it's own independent series.
  // Only one options array is supplied, so it will be used for both
  // plots.
  $("div.jqplot").jqplot([cosPoints, sinPoints], [powPoints1, powPoints2], {  
      title: "One Selector, Multiple Plots",
      seriesDefaults: {
          rendererOptions: {
              smooth: true
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
