<?php 
    $title = "Draw Lines on Plots - Canvas Overlay";
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

        
    <div id="chart1" style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>
    <button onclick="lineup()">Up</button>
    <button onclick="linedown()">Down</button>

<pre class="code prettyprint brush: js"></pre>

    <div id="chart2" style="margin-top:20px; margin-left:20px; width:400px; height:300px;"></div>
<pre class="code prettyprint brush: js"></pre>

  
  <script class="code" type="text/javascript">
$(document).ready(function(){
    var s1 = [[2009, 3.5], [2010, 4.4], [2011, 6.0], [2012, 9.1], [2013, 12.0], [2014, 14.4]];
    
    var grid = {
        gridLineWidth: 1.5,
        gridLineColor: 'rgb(235,235,235)',
        drawGridlines: true
    };
    
    plot1 = $.jqplot('chart1', [s1], {
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
                {horizontalLine: {
                    name: 'barney',
                    y: 4,
                    lineWidth: 6,
                    color: 'rgb(100, 55, 124)',
                    shadow: false
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
$(document).ready(function(){
    var s2 = [[9, 3.5], [15, 4.4], [22, 6.0], [38, 9.1], [51, 12.0], [62, 14.4]];
    
    var grid = {
        gridLineWidth: 1.5,
        gridLineColor: 'rgb(235,235,235)',
        drawGridlines: true
    };
    
    plot2 = $.jqplot('chart2', [s2], {
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

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasOverlay.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
