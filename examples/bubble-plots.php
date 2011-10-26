<?php 
    $title = "Bubble Plots";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

  <style type="text/css">
    
    .note {
        font-size: 0.8em;
    }
    
    #tooltip1b {
        font-size: 12px;
        color: rgb(15%, 15%, 15%);
        padding:2px;
        background-color: rgba(95%, 95%, 95%, 0.8);
    }
    
    #legend1b {
        font-size: 12px;
        border: 1px solid #cdcdcd;
        border-collapse: collapse;
    }
    #legend1b td, #legend1b th {
        border: 1px solid #cdcdcd;
        padding: 1px 4px;
    }


  </style>

<p>Bubble charts represent 3 dimensional data.  First, a basic bubble chart with the "bubbleGradients: true" option to specify gradient fills.  Radial gradients are not supported in IE version before IE 9 and will be automatically disabled.</p>  

<div id="chart1" style="height:340px; width:460px;"></div>

<pre class="code prettyprint brush: js"></pre>


<p>Data is passed in to a bubble chart as a series of [x, y, radius, &lt;label or object&gt;].  The optional fourth element of the data point can either be either a label string or an object having 'label' and/or 'color' properties to assign to the bubble.</p>

<p>By default, all bubbles are scaled according to the size of the plot area.  The radius value in the data point will be adjusted to fit the bubbles in the chart.  If the "autoscaleBubbles" option is set to false, the radius value in the data will be taken as a literal pixel value for the radius of the points.</p>

<p>Next are some basic customizations of bubble appearance with the "bubbleAlpha" and "highlightAlpha" options.</p>

<div id="chart2" style="height:340px; width:460px;"></div>

<pre class="code prettyprint brush: js"></pre>


<p>In the following example, display of a custom toolip and highlighting of a custom table legend is performed by binding to the "jqplotDataHighlight" and "jqplotDataUnhighlight" events.  The custom legend table here is dynamically created with a few lines of jQuery (O.K., it could be done in one line) based on the data array of the plot.</p>

<div style="position:absolute;z-index:99;display:none;" id="tooltip1b"></div>

<table style="margin-left:auto; margin-right:auto;"><tr>
    <td><div id="chart1b" style="width:460px;height:340px;"></div></td>
    <td><div style="height:340px;"><table id="legend1b"><tr><th>Company</th><th>R Value</th></tr></table></div></td>
</tr></table>

<pre class="code prettyprint brush: js"></pre>


<script class="code" type="text/javascript">
$(document).ready(function(){

    var arr = [[11, 123, 1236, "Acura"], [45, 92, 1067, "Alfa Romeo"], 
    [24, 104, 1176, "AM General"], [50, 23, 610, "Aston Martin Lagonda"], 
    [18, 17, 539, "Audi"], [7, 89, 864, "BMW"], [2, 13, 1026, "Bugatti"]];
    
    var plot1 = $.jqplot('chart1',[arr],{
        title: 'Bubble Chart with Gradient Fills',
        seriesDefaults:{
            renderer: $.jqplot.BubbleRenderer,
            rendererOptions: {
                bubbleGradients: true
            },
            shadow: true
        }
    });
});
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
    
    var arr = [[11, 123, 1236, "Acura"], [45, 92, 1067, "Alfa Romeo"], 
    [24, 104, 1176, "AM General"], [50, 23, 610, "Aston Martin Lagonda"], 
    [18, 17, 539, "Audi"], [7, 89, 864, "BMW"], [2, 13, 1026, "Bugatti"]];
    
    var plot2 = $.jqplot('chart2',[arr],{
        title: 'Transparent Bubbles',
        seriesDefaults:{
            renderer: $.jqplot.BubbleRenderer,
            rendererOptions: {
                bubbleAlpha: 0.6,
                highlightAlpha: 0.8
            },
            shadow: true,
            shadowAlpha: 0.05
        }
    });    
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
  
  var arr = [[11, 123, 1236, "Acura"], [45, 92, 1067, "Alfa Romeo"], 
  [24, 104, 1176, "AM General"], [50, 23, 610, "Aston Martin Lagonda"], 
  [18, 17, 539, "Audi"], [7, 89, 864, "BMW"], [2, 13, 1026, "Bugatti"]];
  
  var plot1b = $.jqplot('chart1b',[arr],{
    title: 'Tooltip and Custom Legend Highlighting',
    seriesDefaults:{
      renderer: $.jqplot.BubbleRenderer,
      rendererOptions: {
        bubbleAlpha: 0.6,
        highlightAlpha: 0.8,
        showLabels: false
      },
      shadow: true,
      shadowAlpha: 0.05
    }
  });
  
  // Legend is a simple table in the html.
  // Dynamically populate it with the labels from each data value.
  $.each(arr, function(index, val) {
    $('#legend1b').append('<tr><td>'+val[3]+'</td><td>'+val[2]+'</td></tr>');
  });
  
  // Now bind function to the highlight event to show the tooltip
  // and highlight the row in the legend. 
  $('#chart1b').bind('jqplotDataHighlight', 
    function (ev, seriesIndex, pointIndex, data, radius) {    
      var chart_left = $('#chart1b').offset().left,
        chart_top = $('#chart1b').offset().top,
        x = plot1b.axes.xaxis.u2p(data[0]),  // convert x axis unita to pixels
        y = plot1b.axes.yaxis.u2p(data[1]);  // convert y axis units to pixels
      var color = 'rgb(50%,50%,100%)';
      $('#tooltip1b').css({left:chart_left+x+radius+5, top:chart_top+y});
      $('#tooltip1b').html('<span style="font-size:14px;font-weight:bold;color:' + 
      color + ';">' + data[3] + '</span><br />' + 'x: ' + data[0] + 
      '<br />' + 'y: ' + data[1] + '<br />' + 'r: ' + data[2]);
      $('#tooltip1b').show();
      $('#legend1b tr').css('background-color', '#ffffff');
      $('#legend1b tr').eq(pointIndex+1).css('background-color', color);
    });
  
  // Bind a function to the unhighlight event to clean up after highlighting.
  $('#chart1b').bind('jqplotDataUnhighlight', 
      function (ev, seriesIndex, pointIndex, data) {
          $('#tooltip1b').empty();
          $('#tooltip1b').hide();
          $('#legend1b tr').css('background-color', '#ffffff');
      });
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.bubbleRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
