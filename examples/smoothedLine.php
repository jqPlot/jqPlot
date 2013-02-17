<?php 
    $title = "Smoothed Lines";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

    <style type="text/css">
        body {
            background-color: #f3f3f3;
        }
    </style>


 <div id="chart1" style="height:400px; width:600px;"></div>

    <pre class="code brush:js"></pre>
  
    <script type="text/javascript" class="code">
    $(document).ready(function(){

        var d1 = [[0, -10.3], [1, 7.0], [2, 15.7], [3, 0.5], [4, -10.4], [5, 1.1], [6, 13.2], 
        [7, 1.8], [8, -4.5], [9, -1.8], [10, 2.0], [11, 3.0], [12, -3.5], [13, -7.4], [14, -11.3]];
        var d2 = [[0, 1.3], [1, 12.8], [2, -8.2], [3, -5.2], [4, 16.4], [5, -5.3], [6, 8.1], 
        [7, 15.1], [8, -4.4], [9, 7.8], [10, -1.4], [11, 0.2], [12, 1.3], [13, 11.7], [14, -9.7]];

        var plot1 = $.jqplot('chart1', [d1, d2], {
            grid: {
                drawBorder: false,
                shadow: false,
                background: 'rgba(0,0,0,0)'
            },
            highlighter: { show: true },
            seriesDefaults: { 
                shadowAlpha: 0.1,
                shadowDepth: 2,
                fillToZero: true
            },
            series: [
                {
                    color: 'rgba(198,88,88,.6)',
                    negativeColor: 'rgba(100,50,50,.6)',
                    showMarker: true,
                    showLine: true,
                    fill: true,
                    fillAndStroke: true,
                    markerOptions: {
                        style: 'filledCircle',
                        size: 8
                    },
                    rendererOptions: {
                        smooth: true
                    }
                },
                {
                    color: 'rgba(44, 190, 160, 0.7)',
                    showMarker: true,
                    rendererOptions: {
                        smooth: true,
                    },
                    markerOptions: {
                        style: 'filledSquare',
                        size: 8
                    },
                }
            ],
            axes: {
                xaxis: {
                    // padding of 0 or of 1 produce same results, range 
                    // is multiplied by 1x, so it is not padded.
                    pad: 1.0,
                    tickOptions: {
                      showGridline: false
                    }
                },
                yaxis: {
                    pad: 1.05
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
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>