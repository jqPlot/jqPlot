<?php 
    $title = "Filled (Area) Charts";
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<style type="text/css">
.jqplot-target {
    margin: 30px;
}
</style>

<p>Area charts support highlighting and mouse events by default.  The options and handlers and callbacks are essentially the same as with bar, pie, donut and funnel charts.  One notable exception for area charts is that no data point index will be provided to the callback and the entire data set for the highlighted area will be returned.  This is because the area is not associated with one particular data point, but with the entire data set of the series.</p>

<div><span>Moused Over: </span><span id="info1b">Nothing</span></div>

<div id="chart1b" style="width:400px;height:260px;"></div>

<p>For the chart below, mouseover has been disabled and click handling is enabled by setting "highlightMouseDown: true".  For "fillToZero" area charts that have both negative and positive values as shown below, clicking in either the positive of negative regions will generate the same result.</p> 

<div><span>You Clicked: </span><span id="info1c">Nothing yet</span></div>

<div id="chart1c" style="width:400px;height:260px;"></div>
  


<script class="code" language="javascript" type="text/javascript">
$(document).ready(function(){

    var l2 = [11, 9, 5, 12, 14];
    var l3 = [4, 8, 5, 3, 6];
    var l4 = [12, 6, 13, 11, 2];    

    
    var plot1b = $.jqplot('chart1b',[l2, l3, l4],{
       stackSeries: true,
       showMarker: false,
       seriesDefaults: {
           fill: true
       },
       axes: {
           xaxis: {
               renderer: $.jqplot.CategoryAxisRenderer,
               ticks: ["Mon", "Tue", "Wed", "Thr", "Fri"]
           }
       }
    });
    
    $('#chart1b').bind('jqplotDataHighlight', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info1b').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
    );
    
    $('#chart1b').bind('jqplotDataUnhighlight', 
        function (ev) {
            $('#info1b').html('Nothing');
        }
    );
});
</script>
 
 
<script class="code" language="javascript" type="text/javascript">
$(document).ready(function(){   
    var l5 = [4, -3, 3, 6, 2, -2];
    var plot1c = $.jqplot('chart1c',[l5],{
       stackSeries: true,
       showMarker: false,
       seriesDefaults: {
           fill: true,
           fillToZero: true,
           rendererOptions: {
               highlightMouseDown: true
           }
       }
    });

    $('#chart1c').bind('jqplotDataClick', 
        function (ev, seriesIndex, pointIndex, data) {
            $('#info1c').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
    );
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
