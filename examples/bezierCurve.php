<?php 
    $title = "Animated Charts";
    // $plotTargets = array('chart1', 'chart2', 'chart3');
?>
<?php include "opener.php"; ?>

<!-- Additional plugins go here -->

  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.BezierCurveRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>

<!-- End additional plugins -->

<!-- Example scripts go here -->

 <p>The Bezier curve renderer can distinguish between two different input data formats.  This first example has the data passed in as 2 data points, the second one defining the Bezier curve to the end point.  With this format, non-default axes renderers will require specifying the minimum and maximum on the axes.</p>
<pre>
    [[xstart, ystart], [cp1x, cp1y, cp2x, cp2y, xend, yend]];
</pre>
<div id="chart1" class='plot' style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>
<p>This second example has the data broken out into 4 points, which will be assembled to define the Bezier Curve.  With this format, any axes renderer can be used without explicitly specifying the minimum and maximum.</p>
<pre>
    [[xstart, ystart], [cp1x, cp1y], [cp2x, cp2y], [xend, yend]];
</pre>
<div id="chart2" class='plot' style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>
<p> Here is an example using a date axis renderer with Bezier curves.  The data looks like:</p>
<pre>
    [['01/01/2010', 6], ['02/01/2010', 9], ['03/01/2010', 8], ['04/01/2010', 3]]
</pre>

<div id="chart3" class='plot' style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>

<script class="code" type="text/javascript">
$(document).ready(function(){
    
    var line1 = [[0, 1], [2, 2, 4, .5, 6, 0]];
    var line2 = [[0, 5], [2, 6, 5, 1, 6, .5]];
    var line3 = [[0, 6], [3, 9, 4, 8, 6, 3]];
    var line4 = [[0, 7], [2, 9, 4, 8, 6, 6]];
    var line5 = [[0, 8], [3, 9, 4, 8, 6, 8]];

    plot1 = $.jqplot("chart1", [line1,line2, line3, line4, line5], {
           seriesDefaults: {renderer:$.jqplot.BezierCurveRenderer},
           legend:{show:true}
    });
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
    
    var s1 = [[0, 1], [2, 2], [4, .5], [6, 0]];
    var s2 = [[0, 5], [2, 6], [5, 1], [6, .5]];
    var s3 = [[0, 6], [3, 9], [4, 8], [6, 3]];
    var s4 = [[0, 7], [2, 9], [4, 8], [6, 6]];
    var s5 = [[0, 8], [3, 9], [4, 8], [6, 8]];

    plot2 = $.jqplot("chart2", [s1,s2, s3, s4, s5], {
           seriesDefaults: {renderer:$.jqplot.BezierCurveRenderer},
           legend:{show:true}
    });
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
    
    var s1 = [['01/01/2010', 1], ['02/01/2010', 2], ['03/01/2010', .5], ['04/01/2010', 0]];
    var s2 = [['01/01/2010', 5], ['02/01/2010', 6], ['03/01/2010', 1], ['04/01/2010', .5]];
    var s3 = [['01/01/2010', 6], ['02/01/2010', 9], ['03/01/2010', 8], ['04/01/2010', 3]];
    var s4 = [['01/01/2010', 7], ['02/01/2010', 9], ['03/01/2010', 8], ['04/01/2010', 6]];
    var s5 = [['01/01/2010', 8], ['02/01/2010', 9], ['03/01/2010', 8], ['04/01/2010', 8]];

    plot3 = $.jqplot("chart3", [s1,s2, s3, s4, s5], {
           seriesDefaults: {renderer:$.jqplot.BezierCurveRenderer},
           axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, numberTicks:4}},
           legend:{show:true}
    });
});
</script>

<!-- End example scripts -->

<?php include "closer.html"; ?>
