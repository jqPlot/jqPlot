<?php
  $title = "jqPlot Stacked Bar and Line Charts";
  $jspec_title = "jqPlot Stacked Bar and Line Chart Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.categoryAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.barRenderer.js";
  require("opener.php");
?>

<div class="jqPlot" id="chart1" style="height:320px; width:420px;"></div> 
     
<pre class="prettyprint plot">
line1 = [4, 2, 9, 16];
line2 = [3, 7, 6.25, 3.125];
plot1 = $.jqplot('chart1', [line1, line2], {
    stackSeries: true,
    legend: {show: true, location: 'nw'},
    title: 'Unit Revenues: Acme Traps Division',
    seriesDefaults: {renderer: $.jqplot.BarRenderer,rendererOptions: {barWidth: 50}},
    series: [{label: '1st Qtr'}, {label: '2nd Qtr'}],
    axes: {
        xaxis: {
            renderer: $.jqplot.CategoryAxisRenderer, 
            ticks:['Red', 'Blue', 'Green', 'Yellow']
        }, 
        yaxis: {
            min: 0, 
            max: 20, 
            numberTicks:5, 
            tickOptions:{formatString:'$%.2f'}
        }
    }
});
</pre>

<div class="jqPlot" id="chart2" style="height:320px; width:420px;"></div>   

<pre class="prettyprint plot">
line1 = [[4, 1], [2, 2], [9, 3], [16, 4]];
line2 = [[3, 1], [7, 2], [6.25, 3], [3.125, 4]];
plot2 = $.jqplot('chart2', [line1, line2], {
    stackSeries: true, 
    legend: {show: true, location: 'se'},
    title: 'Unit Sales: Acme Decoy Division',
    seriesDefaults: {
        renderer: $.jqplot.BarRenderer, 
        shadowAngle: 135, 
        rendererOptions: {barDirection: 'horizontal', barWidth: 40}
    },
    series: [
        {label: 'Noisy'}, 
        {label: 'Quiet'}
    ],
    axes: {
        yaxis: {
            renderer: $.jqplot.CategoryAxisRenderer, 
            ticks: ['Q1', 'Q2', 'Q3', 'Q4']
        },
        xaxis: {min: 0, max: 20, numberTicks:5}
    }
});
</pre>

<div class="jqPlot" id="chart3" style="height:320px; width:420px;"></div>

<pre class="prettyprint plot">
line1 = [[2006,4], [2007,2], [2008,9], [2009,16]];
line2 = [[2006,3], [2007,7], [2008,6.25], [2009,3.125]];
plot3 = $.jqplot('chart3', [line1, line2], {
  stackSeries: true,
  legend: {show: true, location: 'nw'},
  title: 'Acme Company Unit Sales',
  seriesDefaults: {fill:true, showMarker: false},
  series: [
    {label: 'Traps Division'}, 
    {label: 'Decoy Division'}
  ],
  axes: {
      xaxis: {
          ticks:[2006,2007,2008,2009], 
          tickOptions:{formatString:'%d'}
      }, 
      yaxis: {min: 0, max: 20, numberTicks:5}
  }
});
</pre>

<?php
  require('closer.php');
?>