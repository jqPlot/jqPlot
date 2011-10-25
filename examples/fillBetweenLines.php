<?php 
    $title = "Charts with Fill Between Lines";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

    <style type="text/css" media="screen">
    .jqplot-axis {
      font-size: 0.85em;
    }
    .jqplot-title {
      font-size: 1.1em;
    }
    </style>


    <div id="chart1" style="margin-top:20px; margin-left:20px; width:600px; height:400px;"></div>

    <p>Enter 2 series to fill between:</p>

    <label for="series1">First Series: </label>
    <input type="text" name="series1" value="1" />
    <label for="series2"> Second Series: </label>
    <input type="text" name="series2" value="3" />
    <button name="changeFill">Change Fill</button>

    <pre class="code brush:js"></pre>


    <script class="code" type="text/javascript" language="javascript">
    $(document).ready(function(){
        var l0 = [6,  11, 10, 13, 11,  7];
        var l1 = [3,   6,  7,  7,  5,  3];
        var l2 = [4,   8,  9, 10, 8,   6];
        var l3 = [9,  13, 14, 16, 17, 19];
        var l4 = [15, 17, 16, 18, 13, 11];
        
        var plot1 = $.jqplot("chart1", [l0, l1, l2, l3, l4], {
            title: "Fill between 2 lines",
            axesDefaults: {
                pad: 1.05
            },
            //////
            // Use the fillBetween option to control fill between two
            // lines on a plot.
            //////
            fillBetween: {
                // series1: Required, if missing won't fill.
                series1: 1,
                // series2: Required, if  missing won't fill.
                series2: 3,
                // color: Optional, defaults to fillColor of series1.
                color: "rgba(227, 167, 111, 0.7)",
                // baseSeries:  Optional.  Put fill on a layer below this series
                // index.  Defaults to 0 (first series).  If an index higher than 0 is
                // used, fill will hide series below it.
                baseSeries: 0,
                // fill:  Optional, defaults to true.  False to turn off fill.  
                fill: true
            },
            seriesDefaults: {
                rendererOptions: {
                    //////
                    // Turn on line smoothing.  By default, a constrained cubic spline
                    // interpolation algorithm is used which will not overshoot or
                    // undershoot any data points.
                    //////
                    smooth: true
                }
            }
        });

        // bind a function to the change button to update the plot's fillBetween series
        // and replot().
        $("button[name=changeFill]").click(function(e) {
        	plot1.fillBetween.series1 = parseInt($("input[name=series1]").val());
        	plot1.fillBetween.series2 = parseInt($("input[name=series2]").val());
        	plot1.replot();
        });
    });
    </script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

<!-- End additional plugins -->

<?php include "closer.html"; ?>
