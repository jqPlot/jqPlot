<?php 
    $title = "Highlighthing Cursor";
    // $plotTargets = array('chart1');
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<p class="text">This has a vertical cursor and highlights all the points that are neighbours of that cursor.</p>
<div id="chart1" style="margin:20px;height:440px; width:640px;"></div>
<p class="text">This is the same example, but also uses the "update" callback to display the values in a separate table.

In this example, you can also click to freeze the cursor at the current position: the cursor will remain at that position even if you move the mouse.
The cursor can be released by clicking again.</p>
<table id="values2" style="height: 80px">
</table>
<div id="chart2" style="margin:20px;height:440px; width:640px;"></div>


<script type="text/javascript">
var data = [];
var baseOptions;

$(document).ready(function(){
    var series1 = [];
    var series2 = [];
    var i;
    for (i = 0; i < 300; i++) {
        var x = 1.5 * i;
        series1.push([x, 10+2*Math.sin(x/10.0)]);
        series2.push([x, 5*Math.exp(-(x-400)*(x-400)/300)]);
    }
    // This gap is just to test what happens when there is a gap.
    for (i = 450; i < 600; i++) {
        var x = 1.5 * i;
        series1.push([x, 10+2*Math.sin(x/10.0)]);
        series2.push([x, 5*Math.exp(-(x-400)*(x-400)/300)]);
    }
    data.push(series1);
    data.push(series2);
    
    baseOptions = {
        seriesDefaults: {
            lineWidth: 1,
            markerOptions: {
                size: 0
            }
        },
        series: {
            0: {
                label: "Test A",
                yaxis: 'yaxis'
            },
            1: {
                label: "Test B",
                yaxis: 'y2axis'
            }
        },
        axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
            labelOptions:{
                fontFamily: 'Helvetica',
                fontSize: '12pt'
            },
            rendererOptions: {
                alignTicks: true
            },
            tickRenderer: $.jqplot.CanvasAxisTickRenderer
        },
        axes: {
            xaxis: {
                tickOptions: {
                    angle:-15,
                    fontSize: '9pt',
                    labelPosition: 'middle'
                }
            },
            yaxis: {
                tickOptions: {
                    angle:-15,
                    fontSize: '9pt',
                    labelPosition: 'middle'
                }
            },
            y2axis: {
                tickOptions: {
                    angle:-15,
                    fontSize: '9pt',
                    labelPosition: 'middle'
                }
            }
        },
        legend: {
            renderer: $.jqplot.EnhancedLegendRenderer,
            show: true,
            showLabels: true,
            rendererOptions: {
                numberColumns: 4,
                showLineStyle: true,
                showMarkerStyle: true
            },
            placement: 'outsideGrid',
            location: 's',
            shrinkGrid: true
        },
        highlighter: {
            sizeAdjust: 10,
            show: false
        },
        highlightingCursor: {
            show: true,
            showVerticalLine: true
        },
        cursor:{
            show: true,
            zoom: true,
            showTooltip: false,
            constrainZoomTo: 'x',
            autoscaleConstraint: true
        } 
    };
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
    var options = $.extend(true, {}, baseOptions);
    plot1 = $.jqplot ('chart1', data, options);
});
</script>

<script class="code" type="text/javascript">
// <![CDATA[
$(document).ready(function(){
    var options = $.extend(true, {}, baseOptions);
	
	options.highlightingCursor.freezeCursorOnClick = true;
	
    options.highlightingCursor.update = function(event, action, gridpos, datapos, seriesDataPoints, plot) {
        $('#values2').empty();
        if (action == 'move' && seriesDataPoints != null) {
            var xAxes = [];
            var xAxesData = [];
            $.each(seriesDataPoints, function(idx, dataPoint) {
                if (dataPoint != null) {
                    var s = plot.series[dataPoint.seriesIndex];
                    if (s.show) {
                        var row = $("<tr />");
                        row.append($("<th />").text(s.label));
                        row.append($("<td />").text(dataPoint.data[1]));
                        $('#values2').append(row);
                        if ($.inArray(s.xaxis, xAxes) < 0) {
                            xAxes.unshift(s.xaxis);
                            xAxesData.unshift([s.xaxis, dataPoint.data[0]]);
                        }
                    }
                }
            });
            $.each(xAxesData, function(idx, axisData) {
                var row = $("<tr />");
                var label = plot.axes[axisData[0]].label;
                if (label == null) { label = 'X'; }
                row.append($("<th />").text(label));
                row.append($("<td />").text(axisData[1]));
                $('#values2').prepend(row);
            });
        }
    };
    plot2 = $.jqplot ('chart2', data, options);
});
// ]]>
</script>


<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.enhancedLegendRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlightingCursor.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>
