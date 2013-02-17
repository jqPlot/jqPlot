<?php 
    $title = "Filled (Area) Charts";
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<style type="text/css">
.jqplot-target {
    margin: 30px;
}

#customTooltipDiv {
    position: absolute; 
    display: none; 
    color: #333333;
    font-size: 0.8em;
    border: 1px solid #666666; 
    background-color: rgba(160, 160, 160, 0.2);
    padding: 2px;
}
</style>

<p>Area charts support highlighting and mouse events by default.  The options and handlers and callbacks are essentially the same as with bar, pie, donut and funnel charts.  One notable exception for area charts is that no data point index will be provided to the callback and the entire data set for the highlighted area will be returned.  This is because the area is not associated with one particular data point, but with the entire data set of the series.</p>

<div><span>Moused Over: </span><span id="info1b">Nothing</span></div>

<div id="chart1b" style="width:400px;height:260px;"></div>

<p>For the chart below, mouseover has been disabled and click handling is enabled by setting "highlightMouseDown: true".  For "fillToZero" area charts that have both negative and positive values as shown below, clicking in either the positive of negative regions will generate the same result.</p> 

<div><span>You Clicked: </span><span id="info1c">Nothing yet</span></div>

<div id="chart1c" style="width:400px;height:260px;"></div>

<div id="chart2" style="width:600px;height:260px;"></div>

<div id="customTooltipDiv">I'm a tooltip.</div>
  


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


<script class="code" language="javascript" type="text/javascript">
$(document).ready(function(){
    var l6 = [11, 9, 5, 12, 14, 8, 7, 9, 6, 11, 9, 3, 4];
    var l7 = [4, 8, 5, 3, 6, 5, 3, 2, 6, 7, 4, 3, 2];
    var l8 = [12, 6, 13, 11, 2, 3, 4, 2, 1, 5, 7, 4, 8];

    var ticks = [[1,'Dec 10'], [2,'Jan 11'], [3,'Feb 11'], [4,'Mar 11'], [5,'Apr 11'], [6,'May 11'], [7,'Jun 11'], [8,'Jul 11'], [9,'Aug 11'], [10,'Sep 11'], [11,'Oct 11'], [12,'Nov 11'], [13,'Dec 11']];  

    
    plot2 = $.jqplot('chart2',[l6, l7, l8],{
       stackSeries: true,
       showMarker: false,
       highlighter: {
        show: true,
        showTooltip: false
       },
       seriesDefaults: {
           fill: true,
       },
       series: [
        {label: 'Beans'},
        {label: 'Oranges'},
        {label: 'Crackers'}
       ],
       legend: {
        show: true,
        placement: 'outsideGrid'
       },
       grid: {
        drawBorder: false,
        shadow: false
       },
       axes: {
           xaxis: {
              ticks: ticks,
              tickRenderer: $.jqplot.CanvasAxisTickRenderer,
              tickOptions: {
                angle: -90 
              },
              drawMajorGridlines: false
          }           
        }
    });
    
    // capture the highlighters highlight event and show a custom tooltip.
    $('#chart2').bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
            var content = plot.series[seriesIndex].label + ', ' + plot.series[seriesIndex]._xaxis.ticks[pointIndex][1] + ', ' + data[1];
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('#customTooltipDiv');
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var left = ev.pageX - w - 10;
            var top = ev.pageY - h - 10;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(200);
        }
    );
    
    // Hide the tooltip when unhighliting.
    $('#chart2').bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('#customTooltipDiv').fadeOut(300);
        }
    );
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>