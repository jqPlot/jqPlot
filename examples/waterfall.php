<?php 
    $title = "Waterfall Charts";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

  <style type="text/css" media="screen">
    .jqplot-axis {
      font-size: 0.85em;
    }
    .jqplot-title {
      font-size: 16px;
    }
      p {
        margin: 20px;
        font-family:Arial,Helvetica,Sans-serif;
      }
  </style>

    <p>Waterfall chart using default bar colors.</p>
    <div id="chart1" style="margin-top:20px; margin-left:20px; width:350px; height:350px;"></div>

    <p>Waterfall chart using custom colors and "useNegativeColors" set to "false".</p>
    <div id="chart2" style="margin-top:20px; margin-left:20px; width:350px; height:350px;"></div>

  

<script class="code" type="text/javascript">$(document).ready(function(){
    var line1 = [14, 3, 4, -3, 5, 2, -3, -7];
    var ticks = ['2008', 'Apricots', 'Tomatoes', 'Potatoes', 'Rhubarb', 'Squash', 'Grapes', 'Peanuts', '2009'];


    var plot1 = $.jqplot('chart1', [line1], {
        title: 'Crop Yield Charnge, 2008 to 2009',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer, 
            rendererOptions:{
                waterfall:true,
                varyBarColor: true
            },
            pointLabels: {
                hideZeros: true
            },
            yaxis:'y2axis'
        },
        axes:{
            xaxis:{
                renderer:$.jqplot.CategoryAxisRenderer, 
                ticks:ticks,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: -90,
                    fontSize: '10pt',
                    showMark: false,
                    showGridline: false
                }
            },
            y2axis: {
                min: 0,
                tickInterval: 5
            }
        }
    });
});</script>


<script class="code" type="text/javascript">$(document).ready(function(){

    var line1 = [14, 3, 4, -3, 5, 2, -3, -7];
    var ticks = ['2008', 'Apricots', 'Tomatoes', 'Potatoes', 'Rhubarb', 'Squash', 'Grapes', 'Peanuts', '2009'];
    var plot2 = $.jqplot('chart2', [line1], {
        title: 'Crop Yield Charnge, 2008 to 2009',
        seriesColors:['#333333', '#999999', '#3EA140', '#3EA140', '#3EA140', '#783F16', '#783F16', '#783F16', '#333333'],
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer, 
            rendererOptions:{
                waterfall:true,
                varyBarColor: true,
                useNegativeColors: false
            },
            pointLabels: {
                hideZeros: true
            },
            yaxis:'y2axis'
        },
        axes:{
            xaxis:{
                renderer:$.jqplot.CategoryAxisRenderer, 
                ticks:ticks,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: -90,
                    fontSize: '10pt',
                    showMark: false,
                    showGridline: false
                }
            },
            y2axis: {
                min: 0,
                tickInterval: 5
            }
        }
    });
});</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.pointLabels.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>