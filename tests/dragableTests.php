<?php
  $title = "jqPlot Dragable and Trend Line Plugins";
  $jspec_title = "jqPlot Dragable and Trend Line Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.dragable.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.trendline.js";
  require("opener.php");
?>
  
  <p class="description">The dragable plugin allows you to mouse over a data point, drag it, and drop it somewhere else on the plot.  It automatically redraws the series after the point is dragged and dropped.  The underlying plot data is updated as well.</p>
  <p class="description">The trend line plugin automatically computes a linear regression trend line of the series data.  The trend line is automatically recalculated as data is changed.  So when you drag and drop a point, the trend line updates.</p>
  <p class="description">Plugins like dragable and trendline don't require any additional options to be set.  Just include the plugin file in your source and they're active!</p>

<div class="jqPlot"  id="chart1" style="height:380px; width:540px;"></div>
  
<pre class="prettyprint plot">
line1=[4, 25, 13, 22, 14, 17, 15];
plot1 = $.jqplot('chart1', [line1],
    {title:'Dragable and Trend Line Example'}
);
</pre>

<?php
  require('closer.php');
?>