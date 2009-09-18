<?php
  $title = "jqplot Fill to Zero";
  $jspec_title = "jqPlot Fill to Zero Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.categoryAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.barRenderer.js";
  require("opener.php");
?>

<p class="description">The fillToZero series option will create a chart where lines or bars are filled down or up toward the zero axis line.  The portion of the line below zero will be shaded darker than the portion above zero.  These colors can be customized with the "negativeSeriesColors" option.  Positive values are colored according to the "seriesColors" option.</p> 

<div class="jqPlot" id="chart1" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">
line0 = [-4, -7, 9, 16, 3, 5, -2, 1, -6, -3, -2, 8];
      
plot1 = $.jqplot('chart1', [line0], {
  seriesDefaults: {
    fill:true, 
    fillToZero: true,
    showMarker: false
  },
  axes:{
    yaxis:{autoscale:true}
  }
});
</pre>

<p class="description">The fillToZero option works with multiple series and can be selectively turned off on series.</p>

<div class="jqPlot" id="chart2" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">
line2 = [-1, -3, 6, 3];
line3 = [8, -5, -7, 16];
line4 = [12, 5, 8, 15];
      
plot3 = $.jqplot('chart2', [line2, line3, line4], {
  seriesDefaults: {
    fill:true, 
    fillToZero:true, 
    showMarker: false, 
    renderer:$.jqplot.BarRenderer
  },
  series:[
    {},
    {},
    {renderer:$.jqplot.LineRenderer, fill:false, fillToZero:false}
  ],    
  axes: {
    xaxis: {
      renderer:$.jqplot.CategoryAxisRenderer,
      ticks:[2006,2007,2008,2009], 
      tickOptions:{formatString:'%d'}
    }, 
    yaxis:{autoscale:true}
  }
});
</pre>

<?php
  require('closer.php');
?>