<?php 
    $title = "Cursor Autoscale Constraint";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<p>
This example demonstrates the use of the zoom using a constraint
on the X-axis (constrainZoomTo: 'x') that also auto-scales the new zone on
the Y-axes (autoscaleConstraint: true).
</p>

<div id="chart1" style="height:400px; width:600px;"></div>
<input type="button" id="constrain1" value="Constrain Zoom" />
<input type="button" id="unconstrain1" value="Unconstrain Zoom" />

<pre class="code prettyprint brush: js"></pre>

<div id="chart2" style="height:400px; width:600px;"></div>
<input type="button" id="constrain2" value="Constrain Zoom" />
<input type="button" id="unconstrain2" value="Unconstrain Zoom" />

<pre class="code prettyprint brush: js"></pre>
  
<script class="code" type="text/javascript">
$(document).ready(function(){

   var data = [
            [4192, 0.714], [4228, 0.378], [4264, 0.272], [4300, 0.320], [4336, 0.432],
            [4372, 0.523], [4408, 0.711], [4444, 0.953], [4480, 0.330], [4516, 1.947],
            [4552, 2.055], [4588, 2.112], [4624, 5.656], [4660, 5.778], [4696, 9.806],
            [4732, 9.673], [4768, 0.245], [4804, 5.010], [4840, 0.890], [4876, 1.042],
            [4912, 0.816], [4948, 0.309], [4984, 0.541], [5020, 0.731], [5056, 0.794],
            [5092, 0.232], [5128, 0.886], [5164, 0.676], [5200, 0.526], [5236, 0.371],
            [5272, 0.327], [5308, 0.252], [5344, 0.501], [5380, 0.667], [5416, 0.266]];
   var plot1;
   var options = {
        axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
            rendererOptions: {
                alignTicks: true
            },
            tickRenderer: $.jqplot.CanvasAxisTickRenderer
        },
        axes: {
            xaxis: {
                tickOptions: {
                    angle: -15,
                    fontSize: '9pt',
                    labelPosition: 'middle'
                }
            },
            yaxis: {
                tickOptions: {
                    angle: -15,
                    fontSize: '9pt',
                    labelPosition: 'middle'
                },
                min: 0
            }
        },
        highlighter: {
            show: true
        },
        cursor:{
            show: true,
            zoom:true,
            showTooltip:false,
            constrainZoomTo: 'x',
            autoscaleConstraint: true
        } 
    };
  
    $('#constrain1').on('click', function() {
        plot1.plugins.cursor.constrainZoomTo = 'x';
    });
    $('#unconstrain1').on('click', function() {
        plot1.plugins.cursor.constrainZoomTo = 'none';
    });
  
    plot1 = $.jqplot ('chart1', [data], options);
});
</script>
 
<script class="code" type="text/javascript">
$(document).ready(function(){
    var data = [
            [1381419238000.0, 0.714], [1381422838000.0, 0.378], [1381426438000.0, 0.272], [1381430038000.0, 0.320], [1381433638000.0, 0.432],
            [1381437238000.0, 0.523], [1381440838000.0, 0.711], [1381444438000.0, 0.953], [1381448038000.0, 0.330], [1381451638000.0, 1.947],
            [1381455238000.0, 2.055], [1381458838000.0, 2.112], [1381462438000.0, 5.656], [1381466038000.0, 0.778], [1381469638000.0, 9.806],
            [1381473238000.0, 9.673], [1381476838000.0, 8.245], [1381480438000.0, 1.010], [1381484038000.0, 5.890], [1381487638000.0, 0.042],
            [1381491238000.0, 0.816], [1381494838000.0, 0.309], [1381498438000.0, 0.541], [1381502038000.0, 0.731], [1381505638000.0, 0.794],
            [1381509238000.0, 0.232], [1381512838000.0, 0.886], [1381516438000.0, 0.676], [1381520038000.0, 0.526], [1381523638000.0, 0.371],
            [1381527238000.0, 0.327], [1381530838000.0, 0.252], [1381534438000.0, 0.501], [1381538038000.0, 0.667], [1381541638000.0, 0.266]];

   var plot2;
   var options = {
        series: [],
        axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
            rendererOptions: {
                alignTicks: true
            },
            tickRenderer: $.jqplot.CanvasAxisTickRenderer
        },
        axes: {
            xaxis: {
                tickOptions: {
                    angle: -15,
                    fontSize: '9pt',
                    labelPosition: 'middle'
                },
                renderer:$.jqplot.DateAxisRenderer
            },
            yaxis: {
                tickOptions: {
                    angle: -15,
                    fontSize: '9pt',
                    labelPosition: 'middle'
                },
                min: 0
            }
        },
        highlighter: {
            show: true
        },
        cursor:{
            show: true,
            zoom:true,
            showTooltip:false,
            constrainZoomTo: 'x',
            autoscaleConstraint: true
        } 
    };
  
    $('#constrain2').on('click', function() {
        plot2.plugins.cursor.constrainZoomTo = 'x';
    });
    $('#unconstrain2').on('click', function() {
        plot2.plugins.cursor.constrainZoomTo = 'none';
    });
  
    plot2 = $.jqplot ('chart2', [data], options);
});
</script>
  

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>


<!-- End additional plugins -->

<?php include "closer.php"; ?>