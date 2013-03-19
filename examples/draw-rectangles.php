<?php 
    $title = "Draw Rectangles on Plots";
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<p>These examples use rectangle overlays to show various ranges.
xmin, xmax, ymin, ymax are all optional -- the rectangle will go to the end of the plot area if they are not specified.
Colors are specified in the canvas drawing format (use rgba for transparency).
</p>

    <div id="chart1" style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>
    <button onclick="lineup()">Up</button>
    <button onclick="linedown()">Down</button>

<pre class="code prettyprint brush: js"></pre>

    <div id="chart2" style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>

<pre class="code prettyprint brush: js"></pre>
  
    <div id="chart3" style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>

<pre class="code prettyprint brush: js"></pre>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var plot1 = $.jqplot ('chart1', [[30,-10,90,20,50,130,80,120,50]], {
      canvasOverlay: {
        show: true,
        objects: [
          { rectangle: { ymax: 0, xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",
                    color: "rgba(0, 0, 200, 0.3)", showTooltip: true, tooltipFormatString: "Too Cold" } },
          { rectangle: { ymin: 100, xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",
                    color: "rgba(200, 0, 0, 0.3)", showTooltip: true, tooltipFormatString: "Too Warm" } }
        ]
      } 
  });
});
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var plot2 = $.jqplot ('chart2',
          [ [ ["2012-01-01", 30], ["2012-01-02", -10], ["2012-01-03", 90], ["2012-01-04", 20], ["2012-01-05", 50], 
              ["2012-01-06", 130], ["2012-01-07", 80], ["2012-01-08", 120],["2012-01-09", 50] ]], {
      axes : {
        xaxis : {
          label : "X Axis Label",
          renderer:$.jqplot.DateAxisRenderer,
        }
      },
      canvasOverlay: {
        show: true,
        objects: [
          { rectangle: { xmin: new Date("2012-01-03"), xmax: new Date("2012-01-07"), xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",
                    color: "rgba(0, 200, 200, 0.3)", showTooltip: true, tooltipFormatString: "Holidays" } },
        ]
      } 
  });
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
  var plot3 = $.jqplot ('chart3', [[30,-10,90,20,50,130,80,120,50]], {
      canvasOverlay: {
        show: true,
        objects: [
          { rectangle: { xmin:3.5, xmax: 8.2, ymin: 10, ymax: 70, xminOffset: "0px", xmaxOffset: "0px", yminOffset: "0px", ymaxOffset: "0px",
                    color: "rgba(200, 100, 100, 0.3)", showTooltip: true, tooltipFormatString: "Ideal Zone" } },
        ]
      } 
  });
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasOverlay.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.min.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.min.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.min.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>