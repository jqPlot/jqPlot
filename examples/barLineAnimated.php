<?php 
    $title = "Animated Charts";
    // $plotTargets = array(array('id'=>'chart1', 'height'=>300, 'width'=>700));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

    <div id="chart1" style="width:700px; height:300px"></div>

    <p>This plot animates the bars bottom to top and the line series left to right upon initial page load.  Since the <code>animateReplot: true</code> option is set, the bars and line will also animate upon calls to <code>plot1.replot( { resetAxes: true } )</code>.</p>

    <pre class="code brush:js"></pre>


 <script class="code" type="text/javascript">

    $(document).ready(function () {
        var s1 = [[2002, 112000], [2003, 122000], [2004, 104000], [2005, 99000], [2006, 121000], 
        [2007, 148000], [2008, 114000], [2009, 133000], [2010, 161000], [2011, 173000]];
        var s2 = [[2002, 10200], [2003, 10800], [2004, 11200], [2005, 11800], [2006, 12400], 
        [2007, 12800], [2008, 13200], [2009, 12600], [2010, 13100]];

        plot1 = $.jqplot("chart1", [s2, s1], {
            // Turns on animatino for all series in this plot.
            animate: true,
            // Will animate plot on calls to plot1.replot()
            animateReplot: true,
            cursor: {
                show: true,
                zoom: true,
                looseZoom: true,
                showTooltip: false
            },
            series:[
                {
                    pointLabels: {
                        show: true
                    },
                    renderer: $.jqplot.BarRenderer,
                    showHighlight: false,
                    yaxis: 'y2axis',
                    rendererOptions: {
                        // Speed up the animation a little bit.
                        // This is a number of milliseconds.  
                        // Default for bar series is 3000.  
                        animation: {
                            speed: 2500
                        },
                        barWidth: 15,
                        barPadding: -15,
                        barMargin: 0,
                        highlightMouseOver: false
                    }
                }, 
                {
                    rendererOptions: {
                        // speed up the animation a little bit.
                        // This is a number of milliseconds.
                        // Default for a line series is 2500.
                        animation: {
                            speed: 2000
                        }
                    }
                }
            ],
            axesDefaults: {
                pad: 0
            },
            axes: {
                // These options will set up the x axis like a category axis.
                xaxis: {
                    tickInterval: 1,
                    drawMajorGridlines: false,
                    drawMinorGridlines: true,
                    drawMajorTickMarks: false,
                    rendererOptions: {
                    tickInset: 0.5,
                    minorTicks: 1
                }
                },
                yaxis: {
                    tickOptions: {
                        formatString: "$%'d"
                    },
                    rendererOptions: {
                        forceTickAt0: true
                    }
                },
                y2axis: {
                    tickOptions: {
                        formatString: "$%'d"
                    },
                    rendererOptions: {
                        // align the ticks on the y2 axis with the y axis.
                        alignTicks: true,
                        forceTickAt0: true
                    }
                }
            },
            highlighter: {
                show: true, 
                showLabel: true, 
                tooltipAxes: 'y',
                sizeAdjust: 7.5 , tooltipLocation : 'ne'
            }
        });
      
    });


</script>
<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script> 
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.pointLabels.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
