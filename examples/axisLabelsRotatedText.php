<?php 
    $title = "Axis Labels and Rotated Text";
    $plotTargets = array('chart1', 'chart2', 'chart3', 'chart4');
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

    <style type="text/css">
      .jqplot-point-label {white-space: nowrap;}
/*    .jqplot-yaxis-label {font-size: 14pt;}*/
/*    .jqplot-yaxis-tick {font-size: 7pt;}*/

    div.jqplot-target {
        height: 400px;
        width: 750px;
        margin: 70px;
    }
    </style>
    
    
        <script class="code" type="text/javascript" language="javascript">
$(document).ready(function(){
    var line1 = [6.5, 9.2, 14, 19.65, 26.4, 35, 51];

    var plot1 = $.jqplot('chart1', [line1], {
        legend: {show:false},
        axes:{
          xaxis:{
          tickOptions:{ 
            angle: -30
          },
          tickRenderer:$.jqplot.CanvasAxisTickRenderer,
            label:'Core Motor Amperage', 
          labelOptions:{
            fontFamily:'Helvetica',
            fontSize: '14pt'
          },
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
          }, 
          yaxis:{
            renderer:$.jqplot.LogAxisRenderer,
            tickOptions:{
                labelPosition: 'middle', 
                angle:-30
            },
            tickRenderer:$.jqplot.CanvasAxisTickRenderer,
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
            labelOptions:{
                fontFamily:'Helvetica',
                fontSize: '14pt'
            },
            label:'Core Motor Voltage'
          }
        }
    });

});
</script>
<script class="code" type="text/javascript" language="javascript">
$(document).ready(function(){   
    var line2 = [['1/1/2008', 42], ['2/14/2008', 56], ['3/7/2008', 39], ['4/22/2008', 81]];

    var plot2 = $.jqplot('chart2', [line2], {
      axes: {
        xaxis: {
          renderer: $.jqplot.DateAxisRenderer,
          label: 'Incliment Occurrance',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          tickRenderer: $.jqplot.CanvasAxisTickRenderer,
          tickOptions: {
              // labelPosition: 'middle',
              angle: 15
          }
          
        },
        yaxis: {
          label: 'Incliment Factor',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        }
      }
    });

});
</script>
<script class="code" type="text/javascript" language="javascript">
$(document).ready(function(){   
    var line3 = [['Cup Holder Pinion Bob', 7], ['Generic Fog Lamp Marketing Gimmick', 9], 
    ['HDTV Receiver', 15], ['8 Track Control Module', 12], 
    ['SSPFM (Sealed Sludge Pump Fourier Modulator)', 3], 
    ['Transcender/Spice Rack', 6], ['Hair Spray Rear View Mirror Danger Indicator', 18]];

    var plot3 = $.jqplot('chart3', [line3], {
      series:[{renderer:$.jqplot.BarRenderer}],
      axes: {
        xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer,
          label: 'Warranty Concern',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          tickRenderer: $.jqplot.CanvasAxisTickRenderer,
          tickOptions: {
              angle: -30,
              fontFamily: 'Courier New',
              fontSize: '9pt'
          }
          
        },
        yaxis: {
          label: 'Occurance',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        }
      }
    });
    
    
});
</script>
  
    <script class="code" type="text/javascript" language="javascript">
$(document).ready(function(){

    var line = [['Cup Holder Pinion Bob', 7], ['Generic Fog Lamp', 9], ['HDTV Receiver', 15], 
    ['8 Track Control Module', 12], [' Sludge Pump Fourier Modulator', 3], 
    ['Transcender/Spice Rack', 6], ['Hair Spray Danger Indicator', 18]];

    var line2 = [['Nickle', 28], ['Aluminum', 13], ['Xenon', 54], ['Silver', 47], 
    ['Sulfer', 16], ['Silicon', 14], ['Vanadium', 23]];

    var plot4 = $.jqplot('chart4', [line, line2], {
        title: 'Concern vs. Occurrance',
        series:[{renderer:$.jqplot.BarRenderer}, {xaxis:'x2axis', yaxis:'y2axis'}],
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                label: 'Warranty Concern',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: 30
                }
            },
            x2axis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                label: 'Metal',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: 30
                }
            },
            yaxis: {
                autoscale:true,
                label: 'Occurance',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: 30
                }
            },
            y2axis: {
                autoscale:true,
                label: 'Number',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    angle: 30
                }
            }
        }
    });
});
    </script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- Additional plugins go here -->

    <script class="include" type="text/javascript" src="../src/plugins/jqplot.logAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>