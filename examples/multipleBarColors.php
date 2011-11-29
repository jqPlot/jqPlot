<?php 
    $title = "Bar Colors Example";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>700, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<div id="chart1" class="example-chart" style="height:300px;width:500px"></div>
<div id="chart2" class="example-chart" style="height:300px;width:500px"></div>
<div id="chart3" class="example-chart" style="height:300px;width:500px"></div>

<script type="text/javascript" class="code">
$(document).ready(function(){
    // A Bar chart from a single series will have all the bar colors the same.
    var line1 = [['Nissan', 4],['Porche', 6],['Acura', 2],['Aston Martin', 5],['Rolls Royce', 6]];

    $('#chart1').jqplot([line1], {
        title:'Default Bar Chart',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
        },
        axes:{
            xaxis:{
                renderer: $.jqplot.CategoryAxisRenderer
            }
        }
    });
});
</script>

<script type="text/javascript" class="code">
$(document).ready(function(){
    var line1 = [['Nissan', 4],['Porche', 6],['Acura', 2],['Aston Martin', 5],['Rolls Royce', 6]];

    $('#chart2').jqplot([line1], {
        title:'Bar Chart with Varying Colors',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
                // Set the varyBarColor option to true to use different colors for each bar.
                // The default series colors are used.
                varyBarColor: true
            }
        },
        axes:{
            xaxis:{
                renderer: $.jqplot.CategoryAxisRenderer
            }
        }
    });
});
</script>

<script type="text/javascript" class="code">
$(document).ready(function(){
    var line1 = [['Nissan', 4],['Porche', 6],['Acura', 2],['Aston Martin', 5],['Rolls Royce', 6]];

    $('#chart3').jqplot([line1], {
        title:'Bar Chart with Custom Colors',
        // Provide a custom seriesColors array to override the default colors.
        seriesColors:['#85802b', '#00749F', '#73C774', '#C7754C', '#17BDB8'],
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
                // Set varyBarColor to tru to use the custom colors on the bars.
                varyBarColor: true
            }
        },
        axes:{
            xaxis:{
                renderer: $.jqplot.CategoryAxisRenderer
            }
        }
    });
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
    <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
