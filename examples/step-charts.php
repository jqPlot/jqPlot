<?php 
    $title = "Step Charts";
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<p>The jqPlot step chart is similar to a line chart, except that it shows a "step" to connect to the next data point instead of a direct line to the next data point.  Step charts use the lineRenderer with the "step" option for the series set to "true".</p>

<div id="chart1" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>


<script class="code" type="text/javascript">
$(document).ready(function(){
  var plot2 = $.jqplot ('chart1', [[3,7,9,1,5,3,8,2,5]], {
      // Give the plot a title.
      title: 'Step Chart',
      // You can specify options for all axes on the plot at once with
      // the axesDefaults object.  Here, we're using a canvas renderer
      // to draw the axis label which allows rotated text.
      axesDefaults: {
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
      },
      // Likewise, seriesDefaults specifies default options for all
      // series in a plot.  Options specified in seriesDefaults or
      // axesDefaults can be overridden by individual series or
      // axes options.
      // Here we set the step chart option
      seriesDefaults: {
          rendererOptions: {
              smooth: true
          },
          step: true,
          markerOptions: { show: false }
      },
      // An axes object holds options for all axes.
      // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
      // Up to 9 y axes are supported.
      axes: {
        // options for each axis are specified in seperate option objects.
        xaxis: {
          label: "X Axis",
          // Turn off "padding".  This will allow data point to lie on the
          // edges of the grid.  Default padding is 1.2 and will keep all
          // points inside the bounds of the grid.
          pad: 0
        },
        yaxis: {
          label: "Y Axis"
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

<?php include "closer.php"; ?>