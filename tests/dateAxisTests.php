<?php
  $title = "jqPlot Date Axis Renderer Plugin";
  $jspec_title = "jqPlot Date Axis Renderer Plugin Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.dateAxisRenderer.js";
  require("opener.php");
?>  

<p class="description">Date axes support is provided through the dateAxisRenderer plugin.  Date axes expand javascripts native date handling capabilities.  This allow dates to be input in almost any unambiguous form, not just in milliseconds!</p>
      
<div class="jqPlot" id="chart1" style="height:320px; width:540px;"></div>

<pre class="prettyprint plot">
line1=[['2008-09-30',4], ['2008-10-30',6.5], ['2008-11-30',5.7], ['2008-12-30',9], ['2009-01-30',8.2]];
plot9 = $.jqplot('chart1', [line1], {
    title:'Default Date Axis',
    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}},
    series:[{lineWidth:4, markerOptions:{style:'square'}}]
});
</pre>     

<p class="description">Date Axes also provide powerful formatting features.  This allows custom formatter strings to be used to format axis tick labels precisely the way you want.</p>
      
<div class="jqPlot" id="chart2" style="height:320px; width:540px;"></div>

<pre class="prettyprint plot">
line1=[['2008-06-30',4], ['2008-7-30',6.5], ['2008-8-30',5.7], ['2008-9-30',9], ['2008-10-30',8.2]];
plot10 = $.jqplot('chart2', [line1], {
    title:'Customized Date Axis', 
    gridPadding:{right:35},
    axes:{
        xaxis:{
            renderer:$.jqplot.DateAxisRenderer, 
            tickOptions:{formatString:'%b %#d, %y'},
            min:'May 30, 2008', 
            tickInterval:'1 month'
        }
    },
    series:[{lineWidth:4, markerOptions:{style:'square'}}]
});
</pre>

<?php require('closer.php') ?>