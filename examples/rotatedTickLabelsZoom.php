<?php 
    $title = "Date Axes, Rotated Labels and Zooming";
    $plotTargets = array (array('id'=>'chart', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<style type="text/css">
    .jqplot-target: {
        margin-left: 70px;
    }
</style>

<script type="text/javascript" class="code">
  
$(document).ready(function(){
    // Enable plugins like highlighter and cursor by default.
    // Otherwise, must specify show: true option for those plugins.
    $.jqplot.config.enablePlugins = true;

    var line1=[['2008-09-30', 4], ['2008-10-30', 6.5], ['2008-11-30', 5.7], ['2008-12-30', 9], 
    ['2009-01-30', 8.2], ['2009-02-28', 7.6], ['2009-03-30', 11.4], ['2009-04-30', 16.2], 
    ['2009-05-30', 21.8], ['2009-06-30', 19.3], ['2009-07-30', 29.7], ['2009-08-30', 36.7], 
    ['2009-09-30', 38.7], ['2009-10-30', 33.7], ['2009-11-30', 49.7], ['2009-12-30', 62.7]];
    
    var plot1 = $.jqplot('chart', [line1], {
        title:'Rotated Axis Text',
        axes:{
            xaxis:{
                renderer:$.jqplot.DateAxisRenderer, 
                rendererOptions:{
                    tickRenderer:$.jqplot.CanvasAxisTickRenderer
                },
                tickOptions:{ 
                    fontSize:'10pt', 
                    fontFamily:'Tahoma', 
                    angle:-40
                }
            },
            yaxis:{
                rendererOptions:{
                    tickRenderer:$.jqplot.CanvasAxisTickRenderer},
                    tickOptions:{
                        fontSize:'10pt', 
                        fontFamily:'Tahoma', 
                        angle:30
                    }
            }
        },
        series:[{ lineWidth:4, markerOptions:{ style:'square' } }],
        cursor:{
            zoom:true,
            looseZoom: true
        }
    });

});
</script>


<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <!-- to render rotated axis ticks, include both the canvasText and canvasAxisTick renderers -->
    <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
    <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
    <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>
    <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
