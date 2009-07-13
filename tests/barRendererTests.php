<?php
  $title = "jqplot Bar Charts";
  $jspec_title = "jqPlot Bar Chart Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.categoryAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.barRenderer.js";
  require("opener.php");
?>

<p class="description">Bar charts are rendered with the barRenderer plugin.  Bar charts work best when displayed on a category axis.</p> 

<div class="jqPlot" id="chart1" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">
line1 = [1,4,9, 16];
line2 = [25, 12.5, 6.25, 3.125];
plot1 = $.jqplot('chart1', [line1, line2], {
    legend:{show:true, location:'ne'},title:'Bar Chart',
    series:[
        {label:'Profits', renderer:$.jqplot.BarRenderer}, 
        {label:'Expenses', renderer:$.jqplot.BarRenderer}
    ],
    axes:{
        xaxis:{renderer:$.jqplot.CategoryAxisRenderer}, 
        yaxis:{min:0}
    }
});
</pre>        

<p class="description">Bar charts can be customized to control the padding both between individual bars in a group (barPadding) and between groups of bars (barMargin).  Here, the "seriesDefaults" option is used to apply options to all series at once.  Bar charts have many other options as well.</p>

<div class="jqPlot" id="chart2" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">
line1 = [1,4, 9, 16];
line2 = [25, 12.5, 6.25, 3.125];
line3 = [2, 7, 15, 30];
plot2 = $.jqplot('chart2', [line1, line2, line3], {
    legend:{show:true, location:'ne', xoffset:55},
    title:'Bar Chart With Options',
    seriesDefaults:{
        renderer:$.jqplot.BarRenderer, 
        rendererOptions:{barPadding: 8, barMargin: 20}
    },
    series:[
        {label:'Profits'}, 
        {label:'Expenses'}, 
        {label:'Sales'}
    ],
    axes:{
        xaxis:{
            renderer:$.jqplot.CategoryAxisRenderer, 
            ticks:['1st Qtr', '2nd Qtr', '3rd Qtr', '4th Qtr']
        }, 
        yaxis:{min:0}
    }
});
</pre>
         
<p class="description">Bar charts are displayed vertically (up and down) by default.  You can specify the "barDirection" option as "horzontal" to get side to side bars.  Note that series data is still interpreted as an array of [x, y] values.  This means a horizontal bar chart would have it's [x, y] data points transposed when compared to a vertical bar chart.</p>

<div class="jqPlot" id="chart3" style="height:360px; width:420px;"></div>

<pre class="prettyprint plot">
line1 = [[1,1], [4,2], [9,3], [16,4]];
line2 = [[25,1], [12.5,2], [6.25,3], [3.125,4]];
plot3 = $.jqplot('chart3', [line1, line2], {
    legend:{show:true, location:'ne'},
    title:'Horizontally Oriented Bar Chart',
    seriesDefaults:{
        renderer:$.jqplot.BarRenderer, 
        rendererOptions:{barDirection:'horizontal', barPadding: 6, barMargin:15}, 
        shadowAngle:135},
    series:[
        {label:'Cats'}, 
        {label:'Dogs'}
    ],
    axes:{
        xaxis:{min:0}, 
        yaxis:{
            renderer:$.jqplot.CategoryAxisRenderer, 
            ticks:['Once', 'Twice', 'Three Times', 'More']
        }
    }
});
</pre>

<?php
  require('closer.php');
?>