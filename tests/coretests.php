<?php
  $title = "jqPlot Basic Chart Examples";
  $jspec_title = "jqPlot Basic Chart Examples";
  $jqplot_js_includes = array();
  require("opener.php");
?>

      
<p class="description">jqPlot has numerous options for styling.  Out of the box, it supports lines with customizable widths, markers (circles, squares, diamonds either filled or open), and colors.</p>
<p class="description">The plot title is specified by the "title" attribute.  Options for the title can be used by creating a "title" object instead of a "title" string.'</p>

<div class="jqPlot" id="chart1" style="height:380px; width:540px;"></div>
     
<pre class="prettyprint plot">
var cosPoints = [];
for (var i=0; i<2*Math.PI; i+=0.4){ 
  cosPoints.push([i, Math.cos(i)]); 
} 
var sinPoints = []; 
for (var i=0; i<2*Math.PI; i+=0.4){ 
   sinPoints.push([i, 2*Math.sin(i-.8)]); 
} 
var powPoints1 = []; 
for (var i=0; i<2*Math.PI; i+=0.4) { 
    powPoints1.push([i, 2.5 + Math.pow(i/4, 2)]); 
} 
var powPoints2 = []; 
for (var i=0; i<2*Math.PI; i+=0.4) { 
    powPoints2.push([i, -2.5 - Math.pow(i/4, 2)]); 
} 
plot1 = $.jqplot('chart1', [cosPoints, sinPoints, powPoints1, powPoints2], { 
    title:'Line Style Options', 
    series:[ 
        {lineWidth:2, markerOptions:{style:'square'}}, 
        {showLine:false, markerOptions:{style:'diamond'}}, 
        {markerOptions:{style:'circle'}}, 
        {lineWidth:5, markerOptions:{style:'filledSquare', size:14}}
    ]
});
</pre>
    
      
<p class="description">Shadows are also customizable.  The angle, offset (distance from the line), alpha (transparency or darkness) and depth (number of shadow strokes, offset by "shadowOffset" from eachother) are all customizable.</p>

<div class="jqPlot" id="chart2" style="height:380px; width:540px;"></div>
     
<pre class="prettyprint plot"> 
var cosPoints = []; 
for (var i=0; i<2*Math.PI; i+=0.1){ 
   cosPoints.push([i, Math.cos(i)]); 
} 
plot2 = $.jqplot('chart2', [cosPoints], { 
    title:'Shadow Options', 
    series:[
        {
            showMarker:false, 
            lineWidth:5, 
            shadowAngle:0, 
            shadowOffset:1.5, 
            shadowAlpha:.08, 
            shadowDepth:6
        }
    ]
});
</pre>
      
<p class="description">Line data can be specified as an array of [x, y] pairs, or as an simple 1-D array.  If a 1-D array is given, x values are automatically generated starting at one and increasing by one for each y value in the array.</p>
<p class="description">Line labels are specified in the "series" options.  The "series" option is an array of option objects, one for each series.  Here, the first series ("Rising line") is rendered as only markers by setting "showLine:false".</p>

<div class="jqPlot" id="chart3" style="height:380px; width:540px;"></div>
     
<pre class="prettyprint plot"> 
line1=[[1,1], [1.5, 2.25], [2,4], [2.5,6.25], [3,9], [3.5,12.25], [4,16]];
line2=[25, 17.5, 12.25, 8.6, 6.0, 4.2, 2.9];
line3=[4, 25, 13, 22, 14, 17, 15];
plot3 = $.jqplot('chart3', [line1, line2, line3], {
    legend:{show:true}, 
    title:'Mixed Data Input Formats',
    series:[
        {label:'Rising line', showLine:false, markerOptions:{style:'square'}},
        {label:'Declining line'}, 
        {label:'Zig Zag Line', lineWidth:5, showMarker:false}
    ]
});
</pre>
      
<p class="description">Axes ticks are computed automatically from the data, but can be customized if desired.  Ticks can be specified as an array of [value, label] pairs, or as a 1-D array of labels.</p>
<p class="description">Here the y axis ticks use a custom format string ("%d") to produce integer tick labels.  The default format string is %.1f and can be customized to any sprintf style format string.Additionally, the grid background color and grid line color have been changed.</p>

<div class="jqPlot" id="chart4" style="height:380px; width:540px;"></div>
     
<pre class="prettyprint plot">
line1=[[1,1], [1.5, 2.25], [2,4], [2.5,6.25], [3,9], [3.5,12.25], [4,16]];
line2=[25, 12.5, 6.25, 3.125];
xticks = [[0, 'zero'], [1, 'one'], [2, 'two'], [3, 'three'], [4, 'four'], [5, 'five']];
yticks = [-5, 0, 5, 10, 15, 20, 25, 30];
plot4 = $.jqplot('chart4', [line1, line2], {
    legend:{show:true}, 
    title:'Customized Axes Ticks',
    grid: {background:'#f3f3f3', gridLineColor:'#accf9b'},
    series:[
        {label:'Rising line', markerOptions:{style:'square'}}, 
        {label:'Declining line'}
    ],
    axes:{
        xaxis:{ticks:xticks}, 
        yaxis:{ticks:yticks, tickOptions:{formatString:'%d'}}
    }
});
</pre>            

<?php require('closer.php') ?>
