<?php 
    $title = "Pie Charts with Enhanced Legend Renderer";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<style>
#chart10 td.jqplot-table-legend-label {
    white-space: normal;
}
#chart11 td.jqplot-table-legend-label {
    white-space: normal;
}
#chart12 td.jqplot-table-legend-label {
    white-space: normal;
}
</style>
   
<!-- Example scripts go here --><!DOCTYPE html>

    <div style="margin-left:20px; margin-top:20px;">The EnhancedPieLegendRenderer allows use of shorter legend labels, but longer tooltips.</div>
    <div id="chart1" style="margin-top:20px; margin-left:20px; width:460px; height:300px;"></div>

    <div id="chart2" style="margin-top:20px; margin-left:20px; width:460px; height:300px;"></div>

    <div id="chart3" style="margin-top:20px; margin-left:20px; width:460px; height:300px;"></div>

<script class="code" type="text/javascript">$(document).ready(function(){

    data1 = [[['Apples', 210],['Oranges', 111], ['Bananas', 74], ['Grapes', 72],['Pears', 49]]];
    toolTip1 = ['Red Delicious Apples', 'Parson Brown Oranges', 'Cavendish Bananas', 'Albaranzeuli Nero Grapes', 'Green Anjou Pears'];

    var plot1 = jQuery.jqplot('chart1', 
        data1,
        {
            title: ' ', 
            seriesDefaults: {
                shadow: false, 
                renderer: jQuery.jqplot.PieRenderer, 
                rendererOptions: { padding: 2, sliceMargin: 2, showDataLabels: true }
            },
            legend: {
                show: true,
                location: 'e',
                renderer: $.jqplot.EnhancedPieLegendRenderer,
                rendererOptions: {
                    numberColumns: 1,
                    toolTips: toolTip1
                }
            },
        }
    );
});</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.pieRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.enhancedPieLegendRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>
