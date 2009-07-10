<?php
  $title = "jqPlot Category Axis Renderer Plugin";
  $jspec_title = "jqPlot Category Axis Renderer Plugin Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.categoryAxisRenderer.js";
  require("opener.php");
?>
       
<div class="jqPlot" id="chart1" style="height:340px; width:480px;"></div>

<pre class="prettyprint plot">
line1=[4, 25, 13, 22, 14, 17, 15];
plot1 = $.jqplot('chart1', [line1], {
    title:'Default Category X Axis',
    axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}},
    series:[{lineWidth:4, markerOptions:{style:'square'}}]
});
</pre>

<div class="jqPlot" id="chart2" style="height:340px; width:480px;"></div>

<pre class="prettyprint plot">
line1=[4, 25, 13, 22, 14, 17, 15];
ticks = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete'];
plot2 = $.jqplot('chart2', [line1], {
    title:'Customized Category X Axis',
    axes:{xaxis:{ticks:ticks, renderer:$.jqplot.CategoryAxisRenderer}},
    series:[{lineWidth:4, markerOptions:{style:'square'}}]
});
</pre>

<div class="jqPlot" id="chart3" style="height:340px; width:480px;"></div>

<pre class="prettyprint plot">
line1=[['uno',4], ['due',25], ['tre',13], ['quattro',22], ['cinque',14], ['sei',17], ['sette',15]];
plot3 = $.jqplot('chart3', [line1], {
    title:'Customized Category X Axis by <br />Series Data Specificaiton',
    axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}},
    series:[{lineWidth:4, markerOptions:{style:'square'}}]
});
</pre>      

<?php
  require('closer.php');
?>