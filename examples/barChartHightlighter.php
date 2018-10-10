<?php 
    $title = "Bar Charts with Highlighter";
    // $plotTargets = array(array('id'=>'chart1', 'height'=>300, 'width'=>700));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->


    <p>These are two bar charts with highlighter enabled. Hovering the mouse over a bar should show a dot at the top of the bar, at the point representing the value.<p>
    
    <div id="chart1" style="margin-top:20px; margin-left:20px; width:300px; height:300px;"></div>
<pre class="code brush:js"></pre>
    
    <div id="chart2" style="margin-top:20px; margin-left:20px; width:300px; height:300px;"></div>
<pre class="code brush:js"></pre>
    

    
  <script class="code" type="text/javascript">$(document).ready(function(){
        var s1 = [2, 6, 7, 10];
        var s2 = [7, 5, 3, 2];
        var ticks = ['a', 'b', 'c', 'd'];
        
        plot1 = $.jqplot('chart1', [s1, s2], {
            seriesDefaults: {
                renderer:$.jqplot.BarRenderer
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks
                }
            },
            highlighter: {
                show: true
            }
        });
    });</script>
    
  <script class="code" type="text/javascript">$(document).ready(function(){
        plot2 = $.jqplot('chart2', [[[2,1], [4,2], [6,3], [3,4]], [[5,1], [1,2], [3,3], [4,4]], [[4,1], [7,2], [1,3], [2,4]]], {
            seriesDefaults: {
                renderer:$.jqplot.BarRenderer,
                shadowAngle: 135,
                rendererOptions: {
                    barDirection: 'horizontal'
                }
            },
            axes: {
                yaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer
                }
            },
            highlighter: {
                show: true
            }
        });
    });</script>
<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.pieRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>