<?php 
    $title = "Area Chart 2";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->


  <link class="include" type="text/css" href="jquery-ui/css/smoothness/jquery-ui.min.css" rel="Stylesheet" /> 

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
  
  <script class="code" type="text/javascript">
$(document).ready(function(){

    var labels = ['Rural', 'Urban'];

    // make the plot

    var makePlot = function (data, textStatus, jqXHR) {
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
    };

    // data is in json format in plain file.
    // Each series is represented by a 1-D array of y values.
    // X values will be added by jqPlot and will start 1 by default.
    $.getJSON('kcp_area2.json', '', makePlot);

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

<?php include "closer.html"; ?>
