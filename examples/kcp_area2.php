<?php 
    $title = "Area Chart 2";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->


  <link class="include" type="text/css" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/themes/smoothness/jquery-ui.css" rel="Stylesheet" />

   <style type="text/css">

    .chart-container {
        border: 1px solid darkblue;
        padding: 30px 0px 30px 30px;
        width: 900px;
        height: 400px;
        
    }

    table.jqplot-table-legend {
        border: 0px;
    }

    td.jqplot-table-legend-label {
      padding: 0.25em;
    }

    td.jqplot-table-legend-label + td.jqplot-table-legend-swatch {
        padding-left: 1.5em;
    }

    div.jqplot-table-legend-swatch {
        border-width: 4px 6px;
    }

    div.jqplot-table-legend-swatch-outline {
        border: none;
    }

    #chart1 {
        width: 96%;
        height: 96%;
    }

    .jqplot-datestamp {
      font-size: 0.8em;
      color: #777;
/*      margin-top: 1em;
      text-align: right;*/
      font-style: italic;
      position: absolute;
      bottom: 15px;
      right: 15px;
    }

    td.controls li {
        list-style-type: none;
    }

    td.controls ul {
        margin-top: 0.5em;
        padding-left: 0.2em;
    }

    pre.code {
        margin-top: 45px;
        clear: both;
    }

  </style>

      <div class="chart-container">    
        <div id="chart1"></div>
        <div class="jqplot-datestamp"></div>
    </div>

    <pre class="code brush:js"></pre>
  
  <script class="common" type="text/javascript">
    var data = {
      "rural": [0.9176, 0.9296, 0.927, 0.9251, 0.9241, 0.9225, 0.9197, 0.9164, 0.9131, 0.9098, 0.9064, 0.9028, 0.8991, 0.8957, 0.8925, 0.8896, 0.8869, 0.8844, 0.882, 0.8797, 0.8776, 0.8755, 0.8735, 0.8715, 0.8696, 0.8677, 0.8658, 0.8637, 0.8616, 0.8594, 0.8572, 0.8548, 0.8524, 0.8499, 0.8473, 0.8446, 0.8418, 0.8389, 0.8359, 0.8328, 0.8295, 0.8262, 0.8227, 0.8191, 0.8155, 0.8119, 0.8083, 0.8048, 0.8013, 0.7979, 0.7945, 0.7912, 0.7879, 0.7846, 0.7813, 0.778, 0.7747, 0.7714, 0.768, 0.7647, 0.7612, 0.7577, 0.7538, 0.7496, 0.7449, 0.7398, 0.7342, 0.7279, 0.721, 0.7137, 0.7059, 0.6977, 0.6889, 0.6797, 0.6698, 0.6593, 0.6482, 0.6367, 0.6247, 0.6121, 0.5989, 0.5852, 0.571, 0.5561, 0.5402, 0.5232, 0.505, 0.4855, 0.4643, 0.4414, 0.4166, 0.3893, 0.3577, 0.3204, 0.2764, 0.2272, 0.1774, 0.1231, 0.0855, 0.0849],
      "urban": [0.0824, 0.0704, 0.073, 0.0749, 0.0759, 0.0775, 0.0803, 0.0836, 0.0869, 0.0902, 0.0936, 0.0972, 0.1009, 0.1043, 0.1075, 0.1104, 0.1131, 0.1156, 0.118, 0.1203, 0.1224, 0.1245, 0.1265, 0.1285, 0.1304, 0.1323, 0.1342, 0.1363, 0.1384, 0.1406, 0.1428, 0.1452, 0.1476, 0.1501, 0.1527, 0.1554, 0.1582, 0.1611, 0.1641, 0.1672, 0.1705, 0.1738, 0.1773, 0.1809, 0.1845, 0.1881, 0.1917, 0.1952, 0.1987, 0.2021, 0.2055, 0.2088, 0.2121, 0.2154, 0.2187, 0.222, 0.2253, 0.2286, 0.232, 0.2353, 0.2388, 0.2423, 0.2462, 0.2504, 0.2551, 0.2602, 0.2658, 0.2721, 0.279, 0.2863, 0.2941, 0.3023, 0.3111, 0.3203, 0.3302, 0.3407, 0.3518, 0.3633, 0.3753, 0.3879, 0.4011, 0.4148, 0.429, 0.4439, 0.4598, 0.4768, 0.495, 0.5145, 0.5357, 0.5586, 0.5834, 0.6107, 0.6423, 0.6796, 0.7236, 0.7728, 0.8226, 0.8769, 0.9145, 0.9151]
    };

  </script>

  <script class="code" type="text/javascript">
$(document).ready(function(){

    var labels = ['Rural', 'Urban'];

    // make the plot
    plot1 = $.jqplot('chart1', [data.rural, data.urban], {
        title: 'Contribution of Urban and Rural Population to National Percentiles (edited data)',
        stackSeries: true,
        seriesColors: ['#77933C', '#B9CDE5'],
        seriesDefaults: {
            showMarker: false,
            fill: true,
            fillAndStroke: true
        },
        legend: {
            show: true,
            renderer: $.jqplot.EnhancedLegendRenderer,
            rendererOptions: {
                numberRows: 1
            },
            placement: 'outsideGrid',
            labels: labels,
            location: 's'
        },
        axes: {
            xaxis: {
                pad: 0,
                min: 1,
                max: 100,
                label: 'Population Percentile',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickInterval: 3,
                tickOptions: {
                    showGridline: false
                }
            },
            yaxis: {
                min: 0,
                max: 1,
                label: 'Percentage of Population',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickOptions: {
                  formatter: $.jqplot.PercentTickFormatter,
                  showGridline: false,
                  formatString: '%d%%'
                }
            }
        },
        grid: {
            drawBorder: false,
            shadow: false,
            // background: 'rgba(0,0,0,0)'  works to make transparent.
            background: 'white'
        }
    });

    // data is in json format in plain file.
    // Each series is represented by a 1-D array of y values.
    // X values will be added by jqPlot and will start 1 by default.
    //$.getJSON('kcp_area2.json', '', makePlot);

    // add a date at the bottom.

    var d = new $.jsDate();
    $('div.jqplot-datestamp').html('Generated on '+d.strftime('%v'));

    // make it resizable.
    
    $("div.chart-container").resizable({delay:20});

    $('div.chart-container').bind('resize', function(event, ui) {
        plot1.replot();
    });
});

</script>


<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.enhancedLegendRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
  <script class="include" type="text/javascript" src="jquery-ui/js/jquery-ui.min.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>
