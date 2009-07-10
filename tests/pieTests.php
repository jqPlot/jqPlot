<?php
  $title = "jqPlot Pie Charts";
  $jspec_title = "jqPlot Pie Chart Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.pieRenderer.js";
  require("opener.php");
?>

<p class="description">The default pie chart automatically sizes itself (with a customizable margin) and centers itself in the plot area.</p>

<div class="jqPlot" id="chart1" style="height:340px; width:540px;"></div>

<pre class="prettyprint plot">
line1 = [['frogs',3], ['buzzards',7], ['deer',2.5], ['turkeys',6], ['moles',5], ['ground hogs',4]];
plot1 = $.jqplot('chart1', [line1], {
    title: 'Default Pie Chart',
    seriesDefaults:{renderer:$.jqplot.PieRenderer}
});
</pre>

<p class="description">By changing the "sliceMargin" property (default 0), you can "explode" the pie chart into separate slices.  The chart is again automatically sized and positioned to fit into the plot area and account for the legend.</p>

<div class="jqPlot" id="chart2" style="height:340px; width:540px;"></div>

<pre class="prettyprint plot">
plot2 = $.jqplot('chart2', [line1], {
    title: 'Pie Chart with Legend and sliceMargin',
    seriesDefaults:{renderer:$.jqplot.PieRenderer, rendererOptions:{sliceMargin:8}},
    legend:{show:true}
});
</pre>


<p class="description">Want all the pie taste with less filling?  By setting the "fill:false" option, slices will be stroked but not filled.  You can control the line width of the slices and the margin between slices.</p>

<div class="jqPlot" id="chart3" style="height:340px; width:540px;"></div>

<pre class="prettyprint plot">
plot3 = $.jqplot('chart3', [line1], {
    title: 'Pie Chart without the Filling',
    seriesDefaults:{
        renderer:$.jqplot.PieRenderer, 
        rendererOptions:{sliceMargin:8, fill:false, shadow:false, lineWidth:5}
    },
    legend:{show:true, location: 'w'}
});
</pre>



<p class="description">Still too many calories?  You can specify a smaller pie by manually setting the "diameter" property.</p>

<div class="jqPlot" id="chart4" style="height:340px; width:540px;"></div>

<pre class="prettyprint plot">
plot4 = $.jqplot('chart4', [line1], {
    title: 'Small Pie Chart',
    seriesDefaults:{
        renderer:$.jqplot.PieRenderer, 
        rendererOptions:{sliceMargin:8, fill:false, shadow:false, lineWidth:5, diameter:100}
    },
    legend:{show:true, location: 'w'}
});
</pre>
      

<?php
  require('closer.php');
?>