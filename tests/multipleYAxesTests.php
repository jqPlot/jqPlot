<?php
  $title = "Multiple Y Axes Example";
  $jspec_title = "Multiple Y Axes Example";
  $jqplot_js_includes = array();
  require("opener.php");
?>
      
<p class="description">jqPlot supports up to 9 y axes.  Simply specify which y axis you want to associate with your series in the plot options. The first y axis (called "yaxis") is the default for each series.</p>

<div class="jqPlot" id="chart1" style="height:380px; width:680px;"></div>

<pre class="prettyprint plot">
var l1 = [2, 3, 1, 4, 3];
var l2 = [1, 4, 3, 2, 2.5];
var l3 = [14, 24, 18, 8, 22];
var l4 = [102, 104, 153, 122, 138];
var l5 = [843, 777, 754, 724, 722];
plot1 = $.jqplot('chart1', [l1, l3, l4, l5], {
    title:'Default Multiply y axes',
    series:[
        {}, 
        {yaxis:'y2axis'}, 
        {yaxis:'y3axis'}, 
        {yaxis:'y4axis'}, 
        {yaxis:'y5axis'}, 
        {yaxis:'y6axis'}
    ]
});
</pre>

<p class="description">You can customize the additional axes with options to color axes the same as the series.  Padding on the top and bottom of the axes can be controlled as well.  Shadows are drawn behind the axes lines and ticks according to the grid shadow preferences.</p>

<div class="jqPlot" id="chart2" style="height:380px; width:680px;"></div>

<pre class="prettyprint plot">
var l1 = [2, 3, 1, 4, 3];
var l2 = [1, 4, 3, 2, 2.5];
var l3 = [14, 24, 18, 8, 22];
var l4 = [102, 104, 153, 122, 138];
var l5 = [843, 777, 754, 724, 722];
plot2 = $.jqplot('chart2', [l1, l2, l3, l4, l5], {
    title:'Customized Multiply y axes',
    series:[
        {}, 
        {yaxis:'y2axis'}, 
        {yaxis:'y3axis'}, 
        {yaxis:'y4axis'}, 
        {yaxis:'y5axis'}, 
        {yaxis:'y6axis'}
    ],
    axesDefaults:{useSeriesColor: true},
    axes:{
        y2axis:{padMax:2}, 
        y3axis:{padMax:2.5}, 
        y4axis:{padMin:2}, 
        y5axis:{padMin:2.3}
    },
    grid:{gridLineWidth:1.0, borderWidth:2.5, shadow:false}
});
</pre>
    
<?php require('closer.php') ?>
