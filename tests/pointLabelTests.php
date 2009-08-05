<?php
  $title = "jqPlot Data Point Labels";
  $jspec_title = "jqPlot Data Point Label Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.barRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.categoryAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.pointLabels.js";
  require("opener.php");
?>  

<p class="description">The pointLabels plugin places labels on the plot at the data point locations.  Labeles can use the series data array or a separate labels array.  If using the series data, the last value in the data point array is used as the label by default.</p>
      
<div class="jqPlot" id="chart1" style="height:320px; width:540px;"></div>

<pre class="prettyprint plot">
line1 = [14, 32, 41, 44, 40, 47, 53, 67];
plot1 = $.jqplot('chart1', [line1], {
    title: 'Chart with Point Labels', 
    seriesDefaults: {showMarker:false},
    axesDefaults:{pad:1.3}
});
</pre>     

<p class="description">Additional data can be added to the series and it will be used for labels. If additional data is provided, each data point must have a value for the label, even if it is "null".</p>
      
<div class="jqPlot" id="chart2" style="height:320px; width:540px;"></div>

<pre class="prettyprint plot">
line1 = [[-12, 7, null], [-3, 14, null], [2, -1, '(low)'], 
    [7, -1, '(low)'], [11, 11, null], [13, -1, '(low)']];
plot2 = $.jqplot('chart2', [line1], {
    title: 'Point Labels From Extra Series Data', 
    seriesDefaults: {
        showMarker:false, 
        pointLabels:{location:'s', ypadding:3}
    },
    axes:{yaxis:{pad: 1.3}}
});
</pre> 

<p class="description">Labels work with Bar charts as well.  Here, the Labels have been supplied through the "labels" array on the "pointLabels" option to the series.  Also, additional css styling has been provided to the labels.</p>

<style type="text/css">
#chart3 .jqplot-point-label {
  border: 1.5px solid #aaaaaa;
  padding: 1px 3px;
  background-color: #eeccdd;
}
</style>

<div class="jqPlot" id="chart3" style="height:320px; width:540px;"></div>

<pre class="prettyprint">
#chart3 .jqplot-point-label {
  border: 1.5px solid #aaaaaa;
  padding: 1px 3px;
  background-color: #eeccdd;
}
</pre>

<pre class="prettyprint plot">
line1 = [14, 32, 41, 44, 40];
plot3 = $.jqplot('chart3', [line1], {
    title: 'Bar Chart with Point Labels', 
    seriesDefaults: {renderer: $.jqplot.BarRenderer},
    series:[
        {pointLabels:{
            labels:['fourteen', 'thirty two', 'fourty one', 'fourty four', 'fourty']
        }}],
    axes: {
        xaxis:{renderer:$.jqplot.CategoryAxisRenderer},
        yaxis:{padMax:1.3}}
});
</pre>

<p class="description">Point labels can be used on stacked bar charts.  If no labels array is specified, they will use data from the chart.  Values can be displayed individually for each series (stackedValue option is false, the default), or cumulative values for all series can be displayed (stackedValue option is true).</p>

<div class="jqPlot" id="chart4" style="height:320px; width:540px;"></div>

<pre class="prettyprint plot">
line1 = [14, 32, 41, 44, 40, 37, 29];
line2 = [7, 12, 15, 17, 20, 27, 39];
plot4 = $.jqplot('chart4', [line1, line2], {
    title: 'Stacked Bar Chart with Cumulative Point Labels', 
    stackSeries: true, 
    seriesDefaults: {
        renderer: $.jqplot.BarRenderer,
        rendererOptions:{barMargin: 25}, 
        pointLabels:{stackedValue: true}
    },
    axes: {
        xaxis:{renderer:$.jqplot.CategoryAxisRenderer},
        yaxis:{ticks:[0, 20, 40, 60, 80]}
    }
});
</pre>

<p class="description">Data point labels have an "edgeTolerance" option.  This options controls how close the data point label can be to an axis edge and still be drawn.  The default of 0 allows labels to touch the axis.  Positive values will increase the required distance between the axis and label, negative values will allow labels to overlap axes.</p>
      
<div class="jqPlot" id="chart5" style="height:320px; width:540px;"></div>

<pre class="prettyprint plot">
line1 = [14, 32, 41, 44, 40, 47, 53, 67];
plot5 = $.jqplot('chart5', [line1], {
    title: 'Chart with Point Labels', 
    seriesDefaults: {
      showMarker:false,
      pointLabels: {
        edgeTolerance: 5
      }},
    axes:{
      xaxis:{min:3}
    }
});
</pre>  
 
<?php require('closer.php') ?>