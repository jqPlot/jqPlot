<?php 
    $title = "Pyramid Charts 2";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

  <link class="include" type="text/css" href="jquery-ui/css/ui-lightness/jquery-ui.min.css" rel="Stylesheet" /> 

    <style type="text/css">
        .chart-container {
            border: 1px solid darkblue;
            padding: 30px;
            width: 600px;
            height: 700px;
        }

        #chart1 {
            width: 500px;
            height: 400px;
        }

        pre.code {
            margin-top: 45px;
            clear: both;
        }

        .quintile-toolbar .ui-icon {
            float: right;
            margin: 3px 5px;
        }

        .quintile-outer-container {
            width: 780px;
        }

    </style>


    <div class="quintile-outer-container ui-widget ui-corner-all">

        <div class="quintile-toolbar ui-widget-header  ui-corner-top">
            <span class="quintile-title">Income Level:</span>
            <div class="ui-icon ui-icon-arrowthickstop-1-s"></div>
            <div class="ui-icon ui-icon-clipboard"></div>
            <div class="ui-icon ui-icon-newwin"></div>
            <div class="ui-icon ui-icon-disk"></div>
            <div class="ui-icon ui-icon-print"></div>
        </div>
        <div class="quintile-content ui-widget-content ui-corner-bottom">
            <table>
                <tr>
                    <td rowspan="2">
                        <div id="chart1"></div>
                    </td>
                    <td>
                        Summary Table
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="tooltip">
                            <table>
                                <tr>
                                    <td>Age: </td><td><div class="tooltip-item" id="tooltipAge">&nbsp;</div></td>
                                </tr>
                                <tr>
                                    <td>Male: </td><td><div class="tooltip-item"  id="tooltipMale">&nbsp;</div></td>
                                </tr>
                                <tr>
                                    <td>Female: </td><td><div class="tooltip-item"  id="tooltipFemale">&nbsp;</div></td>
                                </tr>
                                <tr>
                                    <td>Ratio: </td><td><div class="tooltip-item"  id="tooltipRatio">&nbsp;</div></td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <pre class="code brush:js"></pre>
  


    <script class="code" type="text/javascript" language="javascript">
    $(document).ready(function(){
        $.jqplot._noToImageButton = true;
        $.jqplot._noCodeBlock = true;

        // the "x" values from the data will go into the ticks array.  
        // ticks should be strings for this case where we have values like "75+"
        var ticks = ["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75+"];

        // The "y" values of the data are put into seperate series arrays.
        var male = [4.425251, 5.064975, 4.401382, 3.787731, 2.306403, 3.110203, 2.824716, 3.846422, 3.067799, 2.936013, 2.505067, 2.018346, 1.90446, 1.357237, 0.909704, 0.988836];
        var female = [4.28698, 4.343237, 4.710053, 3.99281, 2.811107, 3.191518, 4.855351, 4.62347, 4.032976, 4.414623, 3.210845, 2.426347, 2.635736, 1.811459, 1.515899, 1.683044];
        var male2 = [1.445677, 2.088224, 2.159879, 2.401152, 3.701622, 3.897444, 5.048783, 4.367545, 3.304588, 3.784367, 3.059088, 2.052513, 1.412907, 0.934326, 0.541234, 0.784258];
        var female2 =[2.238284, 2.974165, 2.360351, 3.03517, 4.80941, 6.229139, 7.257596, 5.847782, 5.226342, 6.201237, 4.474141, 2.769444, 2.048169, 1.47749, 0.87372, 1.193951];

        // Custom color arrays are set up for each series to get the look that is desired.
        // Two color arrays are created for the default and optional color which the user can pick.
        var greenColors = ["#526D2C", "#77933C", "#C57225", "#C57225"];
        var blueColors = ["#3F7492", "#4F9AB8", "#C57225", "#C57225"];

        // To accomodate changing y axis, need to keep track of plot options.
        // changing axes will require recreating the plot, so need to keep 
        // track of state changes.
        var plotOptions = {
            // We set up a customized title which acts as labels for the left and right sides of the pyramid.
            title: '<div style="float:left;width:50%;text-align:center">Male</div><div style="float:right;width:50%;text-align:center">Female</div>',

            // by default, the series will use the green color scheme.
            seriesColors: greenColors,

            grid: {
                drawBorder: false,
                shadow: false,
                background: "white",
                rendererOptions: {
                    // plotBands is an option of the pyramidGridRenderer.
                    // it will put banding at starting at a specified value
                    // along the y axis with an adjustable interval.
                    plotBands: {
                        show: false,
                        interval: 2
                    }
                },
            },

            // This makes the effective starting value of the axes 0 instead of 1.
            // For display, the y axis will use the ticks we supplied.
            defaultAxisStart: 0,
            seriesDefaults: {
                renderer: $.jqplot.PyramidRenderer,
                rendererOptions: {
                    barPadding: 4
                },
                yaxis: "yaxis",
                shadow: false
            },

            // We have 4 series, the left and right pyramid bars and
            // the left and rigt overlay lines.
            series: [
                // For pyramid plots, the default side is right.
                // We want to override here to put first set of bars
                // on left.
                {rendererOptions:{side: "left"}},
                {yaxis: "y2axis"},
                // Pyramid series are filled bars by default.
                // The overlay series will be unfilled lines.
                {
                    rendererOptions: {
                        fill: false,
                        side: "left"
                    }
                },
                {
                    yaxis: "y2axis",
                    rendererOptions: {
                        fill: false
                    }
                }
            ],

            // Set up all the y axes, since users are allowed to switch between them.
            // The only axis that will show is the one that the series are "attached" to.
            // We need the appropriate options for the others for when the user switches.
            axes: {
                xaxis: {
                    tickOptions: {},
                    rendererOptions: {
                        baselineWidth: 2
                    }
                },
                yaxis: {
                    label: "Age",
                    // Use canvas label renderer to get rotated labels.
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    // include empty tick options, they will be used
                    // as users set options with plot controls.
                    tickOptions: {},
                    showMinorTicks: true,
                    ticks: ticks,
                    rendererOptions: {
                        category: true,
                        baselineWidth: 2
                    }
                },
                yMidAxis: {
                    label: "Age",
                    // include empty tick options, they will be used
                    // as users set options with plot controls.
                    tickOptions: {},
                    showMinorTicks: true,
                    ticks: ticks,
                    rendererOptions: {
                        category: true,
                        baselineWidth: 2
                    }
                },
                y2axis: {
                    label: "Age",
                    // Use canvas label renderer to get rotated labels.
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    // include empty tick options, they will be used
                    // as users set options with plot controls.
                    tickOptions: {},
                    showMinorTicks: true,
                    ticks: ticks,
                    rendererOptions: {
                        category: true,
                        baselineWidth: 2
                    }
                }
            }
        };

        plot1 = $.jqplot('chart1', [male, female, male2, female2], plotOptions);

        // bind to the data highlighting event to make custom tooltip:
        $(".jqplot-target").bind("jqplotDataHighlight", function(evt, seriesIndex, pointIndex, data) {
            // Here, assume first series is male poulation and second series is female population.
            // Adjust series indices as appropriate.
            var malePopulation = Math.abs(plot1.series[0].data[pointIndex][1]);
            var femalePopulation = Math.abs(plot1.series[1].data[pointIndex][1]);
            var ratio = femalePopulation / malePopulation * 100;

            $("#tooltipMale").stop(true, true).fadeIn(250).html(malePopulation.toPrecision(4));
            $("#tooltipFemale").stop(true, true).fadeIn(250).html(femalePopulation.toPrecision(4));
            $("#tooltipRatio").stop(true, true).fadeIn(250).html(ratio.toPrecision(4));

            // Since we don't know which axis is rendererd and acive with out a little extra work,
            // just use the supplied ticks array to get the age label.
            $("#tooltipAge").stop(true, true).fadeIn(250).html(ticks[pointIndex]);
        });

        // bind to the data highlighting event to make custom tooltip:
        $(".jqplot-target").bind("jqplotDataUnhighlight", function(evt, seriesIndex, pointIndex, data) {
            // clear out all the tooltips.
            $(".tooltip-item").stop(true, true).fadeOut(200).html('');
        });

    });
    </script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script class="include" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>

    <!-- load the pyramidAxis and Grid renderers in production.  pyramidRenderer will try to load via ajax if not present, but that is not optimal and depends on paths being set. -->
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.pyramidAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.pyramidGridRenderer.js"></script> 

    <script class="include" type="text/javascript" src="../src/plugins/jqplot.pyramidRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
    <script class="include" type="text/javascript" src="jquery-ui/js/jquery-ui.min.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
