<?php
  $title = "Axis Autoscale Example";
  $jspec_title = "Axis Autoscale Example";
  $jqplot_js_includes = array();
  require("opener.php");
?>
      
<p class="description">Axes have an "autoscale" option which enables an improved scaling algorithm.  The default scaling algorithm with the default tick formatting string will sometimes make it appear that the data points are not in the proper position.</p>
<p class="description">Consider the two plots below.  The one on the left looks as if the second and third data points (y values of 1.5 and 3.4) are not where they should be.  Additionally, the tick interval seems to change from 1 unit to 0.9 units back to 1 and the 0.9 again.  This is because the axes labels are rounded to the nearest tenth by default.  The plot on the right is the same with a higher precision on the axes text.  There we see that the points are in the right place.</p>

<table style="margin:auto;">
  <tr><td>
<div class="jqPlot" id="chart1" style="height:300px; width:300px;"></div>
  </td>
  <td>
<div class="jqPlot" id="chart2" style="height:300px; width:300px;margin-left:25px;"></div>
  </td></tr>
</table>

<pre class="prettyprint plot">
line1=[0.82, 1.5, 3.4, 4];
plot1 = $.jqplot('chart1', [line1], {
  //axes:{yaxis:{tickOptions:{formatString:'%.3f'}}}
});
plot2 = $.jqplot('chart2', [line1], {
  axes:{yaxis:{tickOptions:{formatString:'%.3f'}}}
});
</pre>

<p class="description">Here are the same 2 charts with autoscaling turned on.  With the improved algorithm, the ticks are chosen at much more "round" values, alleviating the need for more precision on the tick labels.</p>
<p class="description">the improved autoscaling option is off by default.  This is to not impact the look of users charts after a jqPlot upgrade.  In future release, autoscaling will most likely be on by default.</p>

<table style="margin:auto;">
  <tr><td>
<div class="jqPlot" id="chart3" style="height:300px; width:300px;"></div>
  </td>
  <td>
<div class="jqPlot" id="chart4" style="height:300px; width:300px;margin-left:25px;"></div>
  </td></tr>
</table>

<pre class="prettyprint plot">
plot3 = $.jqplot('chart3', [line1], {
  axes:{yaxis:{autoscale:true}}
});
plot4 = $.jqplot('chart4', [line1], {
  axes:{yaxis:{autoscale:true, tickOptions:{formatString:'%.3f'}}}
});
</pre>
    
<?php require('closer.php') ?>
