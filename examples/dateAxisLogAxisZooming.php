<?php 
    $title = "Zooming with Date and Log Axes";
    $plotTargets = array (array('id'=>'chart1', 'width'=>700, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<script type="text/javascript" src="yahooData.js" ></script>

<script type="text/javascript" class="code">
$(document).ready(function(){
    plot1 = $.jqplot('chart1', [yahoo], { 
        series: [{ 
            renderer: $.jqplot.OHLCRenderer,
            rendererOptions: {
                candleStick: true
            } 
        }], 
        axes: { 
            xaxis: { 
                renderer:$.jqplot.DateAxisRenderer,
                rendererOptions: {
                    tickInset: 0
                },
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                  angle: -30
                } 
            }, 
            yaxis: {  
                renderer: $.jqplot.LogAxisRenderer,
                tickOptions:{ prefix: '$' } 
            } 
        }, 
        cursor:{
            show: true, 
            zoom: true
        } 
    });
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script class="include" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.logAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.ohlcRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>