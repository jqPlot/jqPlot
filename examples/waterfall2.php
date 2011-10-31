<?php 
    $title = "Probability Density Function Chart";
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


    <div id="chart1" style="margin-top:20px; margin-left:20px; width:350px; height:350px;"></div>

    <div id="chart1b" style="margin-top:20px; margin-left:20px; width:350px; height:350px;"></div>

    <div id="chart1c" style="margin-top:20px; margin-left:20px; width:350px; height:350px;"></div>

    <div id="chart1d" style="margin-top:20px; margin-left:20px; width:350px; height:350px;"></div>


  

<script class="code" type="text/javascript">$(document).ready(function(){
    var line1 = [14, 4, 3, -23, 5, 2, -3, -7];
    var ticks = ['2008', 'Apricots', 'Tomatoes', 'Potatoes', 'Rhubarb', 'Squash', 'Grapes', 'Peanuts', '2009'];


    plot1 = $.jqplot('chart1', [line1], {
        title: 'Crop Yield Change, 2008 to 2009',
        seriesDefaults:{
            fill: true,
            fillToZero: true,
            renderer:$.jqplot.BarRenderer, 
            rendererOptions:{
                waterfall:true,
                disableStack: true,
                varyBarColor: true
            },
            pointLabels: {
                show: true,
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
            }
        }
    });
});</script>

<script class="code" type="text/javascript">$(document).ready(function(){
    var line1 = [14, 4, 0, -23, 5, 0, -3, -7];
    var ticks = ['2008', 'Apricots', 'Tomatoes', 'Potatoes', 'Rhubarb', 'Squash', 'Grapes', 'Peanuts', '2009'];


    plot1b = $.jqplot('chart1b', [line1], {
        title: 'Crop Yield Change, 2008 to 2009',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer, 
            rendererOptions:{
                waterfall:true,
                varyBarColor: true
            },
            pointLabels: {
                show: true,
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
            }
        }
    });
});</script>

<script class="code" type="text/javascript">$(document).ready(function(){
    var line1 = [14, 0, 13, 0, -5, -9, 3, 7];
    var ticks = ['2008', 'Apricots', 'Tomatoes', 'Potatoes', 'Rhubarb', 'Squash', 'Grapes', 'Peanuts', '2009'];


    plot1c = $.jqplot('chart1c', [line1], {
        title: 'Crop Yield Change, 2008 to 2009',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer, 
            rendererOptions:{
                waterfall:true,
                varyBarColor: true
            },
            pointLabels: {
                show: true,
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
            }
        }
    });
});</script>

<script class="code" type="text/javascript">$(document).ready(function(){
    var line1 = [-14, 0, -13, 0, 5, 9, -3, -7];
    var ticks = ['2008', 'Apricots', 'Tomatoes', 'Potatoes', 'Rhubarb', 'Squash', 'Grapes', 'Peanuts', '2009'];


    plot1d = $.jqplot('chart1d', [line1], {
        title: 'Crop Yield Change, 2008 to 2009',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer, 
            rendererOptions:{
                waterfall: true,
                varyBarColor: true
            },
            pointLabels: {
                show: true,
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

<?php include "closer.html"; ?>
