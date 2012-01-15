<?php 
    $title = "Area Chart";
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
        font-size: 0.65em;
        line-height: 1em;
        margin: 0px 0px 10px 15px;
        border-collapse: collapse;
    }

    td.jqplot-table-legend-label {
      width: 20em;
    }

    div.jqplot-table-legend-swatch {
        border-width: 2px 6px;
    }

    div.jqplot-table-legend-swatch-outline {
        border: none;
    }

    tr.jqplot-table-legend td {
        padding: 2px;
    }

    .legend-row-highlighted {
        background-color: #666666;
    }

    .legend-text-highlighted {
        color: #ffffff;
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

    ///////////
    // Function to parse a csv file.
    // Note, this IS NOT a complete parser.  It does not handle quoted text.
    // It is implemented to demonstrate functionality from within JavaScript.
    // If a full csv parser is needed, check out:
    // http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
    ///////////
    var parseCSVFile = function(url) {
        var ret = null;
        var labels = [];
        var ticks = [];
        var values = [];
        var temp;
        $.ajax({
            // have to use synchronous here, else returns before data is fetched
            async: false,
            url: url,
            dataType:'text',
            success: function(data) {
                // parse csv data
                var lines = data.split('\n');
                var line;
                for (var i=0, l=lines.length; i<l; i++) {
                    line = lines[i].replace('\r', '').split(',');
                    // console.log(line);
                    if (line.length > 1) {
                        if (i === 0) {
                          ticks = line.slice(1, line.length);
                          for (var n=0, nl=ticks.length; n<nl; n++) {
                            ticks[n] = [n+1, ticks[n]];
                          }
                        }
                        else {
                          labels.push(line[0]);
                          values.push(line.slice(1, line.length));
                          temp = values[values.length-1];
                          // make a copy of temp
                          temp = temp.slice(0, temp.length);
                          for (var n=0, nl=temp.length; n<nl; n++) {
                            values[values.length-1][n] = parseFloat(temp[n]);
                          }
                        } 
                    }
                }
                ret = [values, labels, ticks];
            }
        });
        return ret;
    };
 
    var jsonurl = "./KCPsample4.csv";

    var infos = parseCSVFile(jsonurl);

    // area plots are made with all series except last 2
    data = infos[0].slice(0, infos[0].length-2);
    labels = infos[1].slice(0, infos[1].length-2);
    ticks = infos[2];

    // make the plot
    
    plot1 = $.jqplot('chart1', data, {
        title: 'Area Plot',
        stackSeries: true,
        seriesDefaults: {
            showMarker: false,
            fill: true,
            fillAndStroke: true
        },
        legend: {
            show: true,
            placement: 'outsideGrid',
            labels: labels,
            location: 'ne',
            rowSpacing: '0px'
        },
        axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        axes: {
            xaxis: {
                pad: 0,
                ticks: ticks,
                label: 'Population Vingtile',
                tickOptions: {
                    showGridline: false
                }
            },
            yaxis: {
                min: 0,
                max: 100,
                label: 'Share of Item in Total Expenditure (%)',
                tickOptions: {
                  showGridline: false,
                  suffix: '%'
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

    // add a date at the bottom.

    var d = new $.jsDate();
    $('div.jqplot-datestamp').html('Generated on '+d.strftime('%v'));

    // make it resizable.
    
    $("div.chart-container").resizable({delay:20});

    $('div.chart-container').bind('resize', function(event, ui) {
        plot1.replot();
    });

    $('#chart1').bind('jqplotDataHighlight', function(ev, seriesIndex, pointIndex, data) {
        var idx = 21 - seriesIndex
        $('tr.jqplot-table-legend').removeClass('legend-row-highlighted');  
        $('tr.jqplot-table-legend').children('.jqplot-table-legend-label').removeClass('legend-text-highlighted');
        $('tr.jqplot-table-legend').eq(idx).addClass('legend-row-highlighted'); 
        $('tr.jqplot-table-legend').eq(idx).children('.jqplot-table-legend-label').addClass('legend-text-highlighted'); 
    });

    $('#chart1').bind('jqplotDataUnhighlight', function(ev, seriesIndex, pointIndex, data) {
        $('tr.jqplot-table-legend').removeClass('legend-row-highlighted');  
        $('tr.jqplot-table-legend').children('.jqplot-table-legend-label').removeClass('legend-text-highlighted');
    });
});

</script>


<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="jquery-ui/js/jquery-ui.min.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
