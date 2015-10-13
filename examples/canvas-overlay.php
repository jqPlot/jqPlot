<?php 
    $title = "Draw Lines on Plots - Canvas Overlay";
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<style>
    .jqplot-workitem {
        background-color: rgba(255,155,155, 0.5);
    }
    .jqplot-timer {
        border-left: 2px solid black;
        display: flex;
        align-items: flex-end;
        font-size: 14px;
        padding-left: 3px;
    }
</style>

<div id="chart1" style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>
<button onclick="lineup()">Up</button>
<button onclick="linedown()">Down</button>
<pre class="code prettyprint brush: js"></pre>

<div id="chart2" style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>
<pre class="code prettyprint brush: js"></pre>

<div id="chart3" style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>
<pre class="code prettyprint brush: js"></pre>


<script class="code" type="text/javascript">
      
$(function(){
    
    var s1 = [[2009, 3.5], [2010, 4.4], [2011, 6.0], [2012, 9.1], [2013, 12.0], [2014, 14.4]];
    
    var grid = {
        gridLineWidth: 1.5,
        gridLineColor: 'rgb(235,235,235)',
        drawGridlines: true
    };
    
    plot1 = $.jqplot('chart1', [s1], {
        
        title: "Chart with canvas overlay 1",
        
        series:[{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
                barWidth: 30
            }
        }],
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer
            }
        },
        grid: grid,
        canvasOverlay: {
            show: true,
            objects: [
                {rectangle: {
                    name: 'barney',
                    xformat: {
                        type: 'date',
                        format: '%Y-%m-%d %H:%M:%S'
                    },
                    xmin: '2008-09-01 05:00:00',
                    xmax: '2008-09-04 05:00:00',
                    ymin: [0],
                    ymax: [8],
                    xOffset: 0,
                    color: 'rgba(122, 122, 122,0.5)',
                    shadow: false,
                    showTooltip: true,
                    tooltipLocation: 'ne',
                    tooltipFormatString: '<b><i><span style="color:red;">Passe</span></i></b> %.2f',
                }},
                {horizontalLine: {
                    name: 'fred',
                    y: 6,
                    lineWidth: 12,
                    xminOffset: '8px',
                    xmaxOffset: '29px',
                    color: 'rgb(50, 55, 30)',
                    shadow: false
                }},
                {dashedHorizontalLine: {
                    name: 'wilma',
                    y: 8,
                    lineWidth: 2,
                    xOffset: '54',
                    color: 'rgb(133, 120, 24)',
                    shadow: false
                }},
                {horizontalLine: {
                    name: 'pebbles',
                    y: 10,
                    lineWidth: 3,
                    xOffset: 0,
                    color: 'rgb(89, 198, 154)',
                    shadow: false
                }},
                {dashedHorizontalLine: {
                    name: 'bam-bam',
                    y: 14,
                    lineWidth: 5,
                    dashPattern: [16, 12],
                    lineCap: 'round',
                    xOffset: '20',
                    color: 'rgb(66, 98, 144)',
                    shadow: false
                }}
            ]
        }
    });
});

function lineup() {
    var co = plot1.plugins.canvasOverlay;
    var line = co.get('fred');
    line.options.y += 1;
    co.draw(plot1);
}

function linedown() {
    var co = plot1.plugins.canvasOverlay;
    var line = co.get('fred');
    line.options.y -= 1;
    co.draw(plot1);
}

</script>

<script class="code" type="text/javascript">
    
$(function() {
    
    var s2 = [[9, 3.5], [15, 4.4], [22, 6.0], [38, 9.1], [51, 12.0], [62, 14.4]];
    
    var grid = {
        gridLineWidth: 1.5,
        gridLineColor: 'rgb(235,235,235)',
        drawGridlines: true
    };
    
    plot2 = $.jqplot('chart2', [s2], {
        title: "Chart with canvas overlay 2",
        grid: grid,
        canvasOverlay: {
            show: true,
            objects: [
                {verticalLine: {
                    name: 'barney',
                    x: 10,
                    lineWidth: 6,
                    color: 'rgb(100, 55, 124)',
                    shadow: false
                }},
                {verticalLine: {
                    name: 'fred',
                    x: 15,
                    lineWidth: 12,
                    yminOffset: '8px',
                    ymaxOffset: '29px',
                    color: 'rgb(50, 55, 30)',
                    shadow: false
                }},
                {dashedVerticalLine: {
                    name: 'wilma',
                    x: 20,
                    lineWidth: 2,
                    yOffset: '14',
                    color: 'rgb(133, 120, 24)',
                    shadow: false
                }},
                {verticalLine: {
                    name: 'pebbles',
                    x: 35,
                    lineWidth: 3,
                    yOffset: 0,
                    lineCap: 'butt',
                    color: 'rgb(89, 198, 154)',
                    shadow: false
                }},
                {dashedVerticalLine: {
                    name: 'bam-bam',
                    x: 45,
                    lineWidth: 5,
                    dashPattern: [16, 12],
                    lineCap: 'round',
                    yOffset: '20px',
                    color: 'rgb(66, 98, 144)',
                    shadow: false
                }}
            ]
        }
    });
    
});

</script>

<script class="code" type="text/javascript">
    
$(function() {
    
    var s3 = [],
        grid,
        generateHourTicks,
        generateTimePointData,
        i,
        len,
        entry,
        element = [],
        prognosis = [],
        now = new Date(),
        nowHHMM = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);
    
    grid = {
        gridLineWidth: 1.5,
        gridLineColor: 'rgb(235,235,235)',
        drawGridlines: true
    };
    
    /**
     * Generates an array of ticks
     * @param {Object} start Date object
     * @param   {object} options 
     * @returns {Array}
     */
    generateHourTicks = function (options) {
        
        options = options || {};

        var interval = (typeof options.interval !== "undefined") ? options.interval : 15,  // Every 15 minutes
            nrofhours = (typeof options.nrofhours !== "undefined") ? options.nrofhours : 6,
            nrOfTimePoint = (nrofhours * 60 / interval),     // For 6 hours = 24 / 4 = 6
            now = options.start || new Date(),
            delta = (typeof options.delta !== "undefined") ? options.delta : 2,
            startHour = 0,
            out = [],
            i = 0;

        startHour = now.getHours() - delta;

        //now = new Date(now.setDate(now.getDate() - 1)); // start from yesterday
        
        // Start two hours ago from now
        now.setHours(startHour);
        now.setMinutes(0);
        now.setSeconds(0);
        
        for (i = 0; i <= nrOfTimePoint; i += 1) {
            // Create "null" timestamps
            out.push([now.getTime(), null]);
            // Advance to next interval
            now.setMinutes(now.getMinutes() + interval);
        }

        return out;

    };
    
    /**
     * Fake data to fill the graphs
     */
    generateTimePointData = function () {

        var limit = 96, //every 60 minutes
            intervalBetweenPoints = 15 * 60 * 1000, // 15 minutes in milliseconds
            //duration = 12 * 60 * 60 * 1000, // hours in milliseconds
            now = new Date(),
            //start = new Date(new Date().setTime(now.getTime() - duration)),
            start = new Date(new Date().setHours(0, 0, 0, 0)),
            timestamp,
            power = 0,
            out = [],
            i = 0,
            getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

        for (i = 0; i < limit; i += 1) {

            timestamp = new Date(new Date().setTime(start.getTime() + (i * intervalBetweenPoints)));

            //power = (i > 10 && i < 65) ? getRandomInt(0, 2500) : 0;
            power = getRandomInt(1500, 2000);

            out.push({
                power: power,
                time: +(timestamp.getTime() / 1000).toFixed(),
                timestamp: timestamp.toISOString()
            });

        }

        //console.log("generateTimePointData", out);

        return out;

    };
    
    prognosis = generateTimePointData();
    
    for (i = 0, len = prognosis.length; i < len; i += 1) {
        entry = prognosis[i];
        if (entry.power > -1) {
            element.push([entry.time * 1000, entry.power]);
        }
    }

    s3 = element;
    
    
    
    plot3 = $.jqplot('chart3', [s3], {
        title: "Chart with canvas overlay 3",
        grid: grid,
        axes: {
            yaxis: {
                min: 0
            },
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                ticks: generateHourTicks(),
                tickOptions: {
                    formatString: "%H:%M",
                    showGridline: true,
                    labelFullHoursOnly: true
                }
            }
        },
        canvasOverlay: {
            show: true,
            objects: [
                {workitem: {
                    xformat: {
                        type: 'date',
                        format: '%H:%M'
                    },
                    name: "test3",
                    xmin: '15:00',
                    xmax: '18:00',
                    showTooltip: true,
                    icon: "iconTest3",
                    content: "<div>test3 - 15:00 to 18:00</div>"
                }},
                {workitem: {
                    xformat: {
                        type: 'date',
                        format: '%H:%M'
                    },
                    name: "test4",
                    xmin: '10:14',
                    xmax: '14:32',
                    showTooltip: true,
                    icon: "iconTest4",
                    content: "<div>test4 - 10:14 to 14:32</div>"
                }},
                {workitem: {
                    xformat: {
                        type: 'date',
                        format: '%H:%M'
                    },
                    name: "test5",
                    xmin: '18:00',
                    xmax: '20:00',
                    showTooltip: true,
                    icon: "iconTest5",
                    content: "<div>test5 - 18:00 to 20:00</div>"
                }},
                {workitem: {
                    xformat: {
                        type: 'date',
                        format: '%H:%M'
                    },
                    name: "test6",
                    xmin: '22:22',
                    xmax: '23:30',
                    showTooltip: true,
                    icon: "iconTest6",
                    content: "<div>test6 - 22:22 to 23:30</div>"
                }},
                {html: {
                    name: 'Joe',
                    xformat: {
                        type: 'date',
                        format: '%H:%M'
                    },
                    height: 45,     // px
                    width: 50,
                    className: "jqplot-timer",
                    xmin: nowHHMM,
                    xmax: nowHHMM,
                    y: -45,
                    content: nowHHMM
                }}
            ]
        }
    });
    
});

</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasOverlay.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>