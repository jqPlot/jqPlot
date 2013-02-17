<?php 
    $title = "Data Point labels";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<style type="text/css">
#chart3 .jqplot-point-label {
  border: 1.5px solid #aaaaaa;
  padding: 1px 3px;
  background-color: #eeccdd;
}
</style>

<!-- Example scripts go here -->
<P>The pointLabels plugin places labels on the plot at the data point locations.  Labeles can use the series data array or a separate labels array.  If using the series data, the last value in the data point array is used as the label by default.</p>

<div id="chart1" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<P>Additional data can be added to the series and it will be used for labels. If additional data is provided, each data point must have a value for the label, even if it is "null".</p>

<div id="chart2" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>
 
<P>Labels work with Bar charts as well.  Here, the Labels have been supplied through the "labels" array on the "pointLabels" option to the series.  Also, additional css styling has been provided to the labels.</p>

<div id="chart3" style="height:300px; width:500px;"></div>

<pre class="prettyprint brush: html">
<style type="text/css">
#chart3 .jqplot-point-label {
  border: 1.5px solid #aaaaaa;
  padding: 1px 3px;
  background-color: #eeccdd;
}
</style>
</pre>
<pre class="code prettyprint brush: js"></pre>

<P>Point labels can be used on stacked bar charts.  If no labels array is specified, they will use data from the chart.  Values can be displayed individually for each series (stackedValue option is false, the default), or cumulative values for all series can be displayed (stackedValue option is true).</p>

<div id="chart4" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<P>Data point labels have an "edgeTolerance" option.  This options controls how close the data point label can be to an axis edge and still be drawn.  The default of 0 allows labels to touch the axis.  Positive values will increase the required distance between the axis and label, negative values will allow labels to overlap axes.</p>

<div id="chart5" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [14, 32, 41, 44, 40, 47, 53, 67];
  var plot1 = $.jqplot('chart1', [line1], {
      title: 'Chart with Point Labels', 
      seriesDefaults: { 
        showMarker:false,
        pointLabels: { show:true } 
      }
  });
});
</script>


<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [[-12, 7, null], [-3, 14, null], [2, -1, '(low)'], 
      [7, -1, '(low)'], [11, 11, null], [13, -1, '(low)']];
  var plot2 = $.jqplot('chart2', [line1], {
    title: 'Point Labels From Extra Series Data', 
    seriesDefaults: {
      showMarker:false, 
      pointLabels:{ show:true, location:'s', ypadding:3 }
    },
    axes:{ yaxis:{ pad: 1.3 } }
  });
});
</script>


<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [14, 32, 41, 44, 40];
  var plot3 = $.jqplot('chart3', [line1], {
    title: 'Bar Chart with Point Labels', 
    seriesDefaults: {renderer: $.jqplot.BarRenderer},
    series:[
     {pointLabels:{
        show: true,
        labels:['fourteen', 'thirty two', 'fourty one', 'fourty four', 'fourty']
      }}],
    axes: {
      xaxis:{renderer:$.jqplot.CategoryAxisRenderer},
      yaxis:{padMax:1.3}}
  });
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [14, 32, 41, 44, 40, 37, 29];
  var line2 = [7, 12, 15, 17, 20, 27, 39];
  var plot4 = $.jqplot('chart4', [line1, line2], {
      title: 'Stacked Bar Chart with Cumulative Point Labels', 
      stackSeries: true, 
      seriesDefaults: {
          renderer: $.jqplot.BarRenderer,
          rendererOptions:{barMargin: 25}, 
          pointLabels:{show:true, stackedValue: true}
      },
      axes: {
          xaxis:{renderer:$.jqplot.CategoryAxisRenderer}
      }
  });
});
</script>


<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [14, 32, 41, 44, 40, 47, 53, 67];
  var plot5 = $.jqplot('chart5', [line1], {
      title: 'Chart with Point Labels', 
      seriesDefaults: {
        showMarker:false,
        pointLabels: {
          show: true,
          edgeTolerance: 5
        }},
      axes:{
        xaxis:{min:3}
      }
  });
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->
    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.pointLabels.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>