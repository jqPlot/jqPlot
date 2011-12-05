<?php 
    $title = "Engel Curves";
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
    }

    td.jqplot-table-legend-label {
      width: 20em;
    }

    div.jqplot-table-legend-swatch {
        border-width: 1.5px 6px;
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

    ///////////
    // This is NOT a full csv parser.
    // It does not handle quoated text.
    // It is for demonstration only.
    // For a full featured csv parser, look at:
    //
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
            dataType:"text",
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
                        }
                        else {
                          labels.push(line[0]);
                          values.push(line.slice(1, line.length));
                          temp = values[values.length-1];
                          for (n in temp) {
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
    var data = infos[0];
    var labels = infos[1];
    var ticks = infos[2];

    // make the plot
    
    plot1 = $.jqplot("chart1", data, {
        title: "Engel Curves",
        axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        seriesDefaults: {
            showMarker: false
        },
        legend: {
            show: true,
            renderer: $.jqplot.EnhancedLegendRenderer,
            placement: "outsideGrid",
            labels: labels,
            location: "ne",
            rowSpacing: "0px"
        },
        axes: {
            xaxis: {
                pad: 1.01,
                tickOptions: {
                    showGridline: false
                }
            },
            yaxis: {
                padMin: 0,
                padMax: 1.05
            }
        },
        grid: {
            drawBorder: false,
            shadow: false,
            // background: 'rgba(0,0,0,0)'  works to make transparent.
            background: "white"
        }
    });

    // add a date at the bottom.

    var d = new $.jsDate();
    $("div.jqplot-datestamp").html("Generated on "+d.strftime("%v"));

    // make it resizable.
    
    $("div.chart-container").resizable({delay:20});

    $("div.chart-container").bind("resize", function(event, ui) {
        plot1.replot();
    });
});

</script>


<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.enhancedLegendRenderer.js"></script>
  <script class="include" type="text/javascript" src="jquery-ui/js/jquery-ui.min.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
