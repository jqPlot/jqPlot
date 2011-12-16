<!DOCTYPE html>

<html>
<head>
    
    <title>Quintile Chart</title>

    <link class="include" rel="stylesheet" type="text/css" href="../src/jquery.jqplot.css" />
    <link rel="stylesheet" type="text/css" href="examples.css" />
    <link type="text/css" rel="stylesheet" href="syntaxhighlighter/styles/shCoreDefault.min.css" />
    <link type="text/css" rel="stylesheet" href="syntaxhighlighter/styles/shThemejqPlot.min.css" />
  
  <!--[if lt IE 9]><script language="javascript" type="text/javascript" src="../src/excanvas.js"></script><![endif]-->
    <script class="include" type="text/javascript" src="../src/jquery.min.js"></script>
    
     <link class="include" type="text/css" href="jquery-ui/css/smoothness/jquery-ui.min.css" rel="Stylesheet" /> 

    <style type="text/css">
        
        body {
            width: 98%;
            height: 98%;
            padding: 12px;
        }

        .quintile-outer-container {
            width: 96%;
            height: 96%;
            margin: auto;
        }

        .jqplot-chart {
            width: 800px;
            height: 800px;
        }

        .quintile-toolbar .ui-icon {
            float: right;
            margin: 3px 5px;
        }

        table.stats-table td, table.highlighted-stats-table td {
            background-color: rgb(230, 230, 230);
            padding: 0.5em;
        }

        col.label {
            width: 14em;
        }

        col.value {
            width: 7em;
        }

        td.quintile-value {
            width: 7em;
            text-align: right;
        }

        table.stats-table td.tooltip-header, table.highlighted-stats-table td.tooltip-header {
            background-color: rgb(200, 200, 200);
        }

        table.stats-table, table.highlighted-stats-table, td.contour-cell {
            font-size: 0.7em;
        }

        td.contour-cell {
            height: 1.5em;
            padding-left: 20px;
            padding-bottom: 1.5em;
        }

        table.highlighted-stats-table {
            margin-top: 15px;
        }

        td.stats-cell {
            padding-left: 20px;
            padding-top: 40px;
            vertical-align: top;

        }

        td.stats-cell div.input {
            font-size: 0.7em;
            margin-top: 1.5em;
        }

        div.overlay-chart-container {
            display: none;
            z-index: 11;
            position: fixed;
            width: 800px;
            left: 50%;
            margin-left: -400px;
            background-color: white;
        }

        div.overlay-chart-container div.ui-icon {
            float: right;
            margin: 3px 5px;
        }

        div.overlay-shadow {
            display: none;
            z-index: 10;
            background-color: rgba(0, 0, 0, 0.8);
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }

        @media print {
            td.stats-cell {
                vertical-align: top;
                padding-top: 35px;
            }

            table.stats-table, table.stats-table td {
                 color: #aaaaaa;
                 border: 1px solid #bbbbbb;
                 border-collapse: collapse;
            }

            table.stats-table tr {
                font-family: Verdana,Arial,sans-serif;
                /*font-size: 0.7em;*/
            }
        }

    </style>

   
</head>
<body>

<!-- Example scripts go here -->

 
    <div class="overlay-shadow"></div>

    <div class="overlay-chart-container ui-corner-all">
        <div class="overlay-chart-container-header ui-widget-header ui-corner-top">Right click the image to Copy or Save As...<div class="ui-icon ui-icon-closethick"></div></div>
        <div class="overlay-chart-container-content ui-corner-bottom"></div>
    </div>

    <div class="quintile-outer-container ui-widget ui-corner-all">
        <div class="quintile-toolbar ui-widget-header  ui-corner-top">
            <span class="quintile-title">Income Level:</span>
        </div>
        <div class="quintile-content ui-widget-content ui-corner-bottom">
            <table class="quintile-display">
                <tr>
                    <td class="chart-cell">
                        <div class="jqplot-chart"></div>
                    </td>
                    <td class="stats-cell">
                        <table class="stats-table">
                        <colgroup>
                            <col class="label">
                            <col class="value">
                        </colgroup>
                        <tbody>
                            <tr>
                                <td class="ui-corner-tl">Mean Age:</td>
                                <td class="quintile-value summary-meanAge ui-corner-tr"></td>
                            </tr>
                            <tr>
                                <td>Sex Ratio:</td>
                                <td class="quintile-value summary-sexRatio"></td>
                            </tr>
                            <tr>
                                <td>Age Dependency Ratio:</td>
                                <td class="quintile-value summary-ageDependencyRatio"></td>
                            </tr>
                            <tr>
                                <td>Population, Total:</td>
                                <td class="quintile-value summary-populationTotal"></td>
                            </tr>
                            <tr>
                                <td>Population, Male:</td>
                                <td class="quintile-value summary-populationMale"></td>
                            </tr>
                            <tr>
                                <td class="ui-corner-bl">Population, Female:</td>
                                <td class="quintile-value summary-populationFemale ui-corner-br"></td>
                            </tr>
                        </tbody>
                        </table>
                        <table class="highlighted-stats-table">
                        <colgroup>
                            <col class="label">
                            <col class="value">
                        </colgroup>
                        <tbody>
                            <tr class="tooltip-header">
                                <td class="tooltip-header ui-corner-top" colspan="2">Highlighted Age: <span class="tooltip-item tooltipAge">&nbsp;</span></td>
                            </tr>
                            <tr>
                                <td>Population, Male: </td>
                                <td class="quintile-value"><span class="tooltip-item tooltipMale">&nbsp;</span></td>
                            </tr>
                            <tr>
                                <td>Population, Female: </td>
                                <td class="quintile-value"><span class="tooltip-item tooltipFemale">&nbsp;</span></td>
                            </tr>
                            <tr>
                                <td class="ui-corner-bl">Sex Ratio: </td>
                                <td class="quintile-value ui-corner-br"><span class="tooltip-item tooltipRatio">&nbsp;</span></td>
                            </tr>
                        <tbody>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </div> 
  


    <script class="code" type="text/javascript">
    $(document).ready(function(){

        // if browser supports canvas, show additional toolbar icons
        if (!$.jqplot.use_excanvas) {
            $('div.quintile-toolbar').append('<div class="ui-icon ui-icon-image"></div><div class="ui-icon ui-icon-print"></div>');
        }

        var quintileIndex = parseInt(<?php echo $_GET["qidx"]; ?>);

        var male;
        var female;
        var summaryTable;
        var sexRatios;
        quintiles = [];


        // the "x" values from the data will go into the ticks array.  
        // ticks should be strings for this case where we have values like "75+"
        var ticks = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75+", ""];


        $.ajax({
            type: "GET",
            dataType: 'json',
            async: false,
            url: "ages.json",
            contentType: "application/json",
            success: function (retdata) {
                // array of arrays of data for each quintile
                // each quintile array has data for following:
                //  0: summary table
                //  1: male data
                //  2: female data
                //  3: ratios
                quintiles = retdata;
            },
            error: function (xhr) { console.log("ERROR: ", xhr.statusText) }
        });

        $('td.summary-meanAge').each(function(index) {
            $(this).html($.jqplot.sprintf('%5.2f', quintiles[quintileIndex][0][3]));
        });

        $('td.summary-sexRatio').each(function(index) {
            $(this).html($.jqplot.sprintf('%5.2f', quintiles[quintileIndex][3][0]));
        });

        $('td.summary-ageDependencyRatio').each(function(index) {
            $(this).html($.jqplot.sprintf('%5.2f', quintiles[quintileIndex][0][6]));
        });

        $('td.summary-populationTotal').each(function(index) {
            $(this).html($.jqplot.sprintf("%'d", quintiles[quintileIndex][0][0]));
        });

        $('td.summary-populationMale').each(function(index) {
            $(this).html($.jqplot.sprintf("%'d", quintiles[quintileIndex][0][1]));
        });

        $('td.summary-populationFemale').each(function(index) {
            $(this).html($.jqplot.sprintf("%'d", quintiles[quintileIndex][0][2]));
        });
        
        // These two variables should be removed outside of the jqplot.com example environment.
        $.jqplot._noToImageButton = true;
        $.jqplot._noCodeBlock = true;

        // Custom color arrays are set up for each series to get the look that is desired.
        // Two color arrays are created for the default and optional color which the user can pick.
        var greenColors = ["#526D2C", "#77933C", "#C57225", "#C57225"];
        var blueColors = ["#3F7492", "#4F9AB8", "#C57225", "#C57225"];

        // To accomodate changing y axis, need to keep track of plot options.
        // changing axes will require recreating the plot, so need to keep 
        // track of state changes.
        var plotOptions = {
            // We set up a customized title which acts as labels for the left and right sides of the pyramid.
            title: {
                text: '<span style="position:relative;left:25%;">Male</span><span style="position:relative;left:50%;">Female</span>',
                textAlign: 'left'
            },
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
                        show: true,
                        interval: 10,
                        color: 'rgb(245, 235, 215)'
                    }
                }
            },

            // This makes the effective starting value of the axes 0 instead of 1.
            // For display, the y axis will use the ticks we supplied.
            defaultAxisStart: 0,
            seriesDefaults: {
                renderer: $.jqplot.PyramidRenderer,
                rendererOptions: {
                    barPadding: 2,
                    offsetBars: true
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
                {
                    rendererOptions:{
                        side: "left",
                        synchronizeHighlight: 1
                    }
                },
                {
                    yaxis: "y2axis",
                    rendererOptions: {
                        synchronizeHighlight: 0
                    }
                },
                {
                    rendererOptions: {
                        fill: false,
                        side: 'left'
                    }
                },
                {
                    yaxis: 'y2axis',
                    rendererOptions: {
                        fill: false
                    }
                }
            ],
            axesDefaults: {
                tickOptions: {
                    showGridline: false
                },
                pad: 0,
                rendererOptions: {
                    baselineWidth: 2
                }
            },

            // Set up all the y axes, since users are allowed to switch between them.
            // The only axis that will show is the one that the series are "attached" to.
            // We need the appropriate options for the others for when the user switches.
            axes: {
                xaxis: {
                    tickOptions: {
                        formatter: $.jqplot.PercentTickFormatter,
                        formatString: '%d%%'
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
                        tickSpacingFactor: 15
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
                        tickSpacingFactor: 15
                    }
                }
            }
        };

        $('div.jqplot-chart').jqplot([quintiles[quintileIndex][1], quintiles[quintileIndex][2]], plotOptions);

        //////
        // The followng functions use verbose css selectors to make
        // it clear exactly which elements they are binging to/operating on
        //////

        // bind to the data highlighting event to make custom tooltip:
        $(".jqplot-target").each(function(index){
            $(this).bind("jqplotDataHighlight", function(evt, seriesIndex, pointIndex, data) {
                // Here, assume first series is male poulation and second series is female population.
                // Adjust series indices as appropriate.
                var plot = $(this).data('jqplot');
                var malePopulation = Math.abs(plot.series[0].data[pointIndex][1]) * quintiles[quintileIndex][0][1];
                var femalePopulation = Math.abs(plot.series[1].data[pointIndex][1]) * quintiles[quintileIndex][0][2];
                var malePopulation = quintiles[quintileIndex][1][pointIndex] * quintiles[quintileIndex][0][1];
                var femalePopulation = quintiles[quintileIndex][2][pointIndex] * quintiles[quintileIndex][0][2];
                // var ratio = femalePopulation / malePopulation * 100;
                var ratio = quintiles[quintileIndex][3][pointIndex+1];

                $(this).closest('table').find('.tooltipMale').stop(true, true).fadeIn(350).html($.jqplot.sprintf("%'d", malePopulation));
                $(this).closest('table').find('.tooltipFemale').stop(true, true).fadeIn(350).html($.jqplot.sprintf("%'d", femalePopulation));
                $(this).closest('table').find('.tooltipRatio').stop(true, true).fadeIn(350).html($.jqplot.sprintf('%5.2f', ratio));

                // Since we don't know which axis is rendererd and acive with out a little extra work,
                // just use the supplied ticks array to get the age label.
                $(this).closest('table').find('.tooltipAge').stop(true, true).fadeIn(350).html(ticks[pointIndex]);
            });
        });

        // bind to the data highlighting event to make custom tooltip:
        $(".jqplot-target").each(function() {
            $(this).bind("jqplotDataUnhighlight", function(evt, seriesIndex, pointIndex, data) {
                // clear out all the tooltips.
                $(this).closest('table').find(".tooltip-item").fadeOut(250);
            });
        });

        $('.ui-icon-print').click(function(){
            $(this).parent().next().print();
        });


        $('.ui-icon-image').each(function() {
            $(this).bind('click', function(evt) {
                var chart = $(this).closest('div.quintile-outer-container').find('div.jqplot-target');
                var imgelem = chart.jqplotToImageElem();
                var div = $('div.overlay-chart-container-content');
                div.empty();
                div.append(imgelem);
                $('div.overlay-shadow').fadeIn(600);
                div.parent().fadeIn(1000);
                div = null;
            });
        });

        $('div.overlay-chart-container-header div.ui-icon-closethick').click(function(){
            var div = $('div.overlay-chart-container-content');
            div.parent().fadeOut(600);
            $('div.overlay-shadow').fadeOut(1000);
        });

    });
    </script>


    <script class="include" type="text/javascript" src="../src/jquery.jqplot.js"></script>
    <script type="text/javascript" src="syntaxhighlighter/scripts/shCore.min.js"></script>
    <script type="text/javascript" src="syntaxhighlighter/scripts/shBrushJScript.min.js"></script>
    <script type="text/javascript" src="syntaxhighlighter/scripts/shBrushXml.min.js"></script>


    <script class="include" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>

    <!-- load the pyramidAxis and Grid renderers in production.  pyramidRenderer will try to load via ajax if not present, but that is not optimal and depends on paths being set. -->
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.pyramidAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.pyramidGridRenderer.js"></script> 

    <script class="include" type="text/javascript" src="../src/plugins/jqplot.pyramidRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.json2.js"></script>
    <script class="include" type="text/javascript" src="jquery-ui/js/jquery-ui.min.js"></script>
    <script class="include" type="text/javascript" src="kcp.print.js"></script>
 
    <script type="text/javascript" src="example.js"></script>

</body>


</html>
