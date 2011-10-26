<?php 
    $title = "Rotated Labels and Font Styling";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<p>Rotated axis tick labels are possible through the "jqplot.canvasTextRenderer.min.js" and "jqplot.canvasAxisTickRenderer.min.js" plugins. Native canvas font rendering capabilities are used in supported browsers.  This includes most recent browsers (including IE 9).  In browsers which don't support native canvas font text, text is rendered in the Hershey font.</p>

<div id="chart1" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>



<p>For comparison, here is the same graph with the "fontFamily" and "fontSize" set.  If you have a supported browser, you should see a difference in label fonts.</p>
 
<div id="chart1b" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

 
<p>The default positioning applies to either primary or secondary axes and accounts for label rotation to ensure that the labels point to the appropriate bar or tick position.</p>

<p>Also note here the use of the "autoscale" option on the y axes.  Turning this option on will force the y axes to line up tick marks for consistend grid lines across the grid.</p>

<div id="chart2" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>


<p>You can override the default position by specifying a labelPosition of 'start', 'middle' or 'end'. The results probably are not as pleasing as the default 'auto' setting.</p>

<div id="chart3" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [['Cup Holder Pinion Bob', 7], ['Generic Fog Lamp', 9], ['HDTV Receiver', 15], 
  ['8 Track Control Module', 12], [' Sludge Pump Fourier Modulator', 3], 
  ['Transcender/Spice Rack', 6], ['Hair Spray Danger Indicator', 18]];

  var plot1 = $.jqplot('chart1', [line1], {
    title: 'Concern vs. Occurrance',
    series:[{renderer:$.jqplot.BarRenderer}],
    axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        tickOptions: {
          angle: -30,
          fontSize: '10pt'
        }
    },
    axes: {
      xaxis: {
        renderer: $.jqplot.CategoryAxisRenderer
      }
    }
  });
});
</script>


<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [['Cup Holder Pinion Bob', 7], ['Generic Fog Lamp', 9], ['HDTV Receiver', 15], 
  ['8 Track Control Module', 12], [' Sludge Pump Fourier Modulator', 3], 
  ['Transcender/Spice Rack', 6], ['Hair Spray Danger Indicator', 18]];
  var plot1b = $.jqplot('chart1b', [line1], {
    title: 'Concern vs. Occurrance',
    series:[{renderer:$.jqplot.BarRenderer}],
    axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        tickOptions: {
          fontFamily: 'Georgia',
          fontSize: '10pt',
          angle: -30
        }
    },
    axes: {
      xaxis: {
        renderer: $.jqplot.CategoryAxisRenderer
      }
    }
  });
});
</script>


<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [['Cup Holder Pinion Bob', 7], ['Generic Fog Lamp', 9], ['HDTV Receiver', 15], 
  ['8 Track Control Module', 12], [' Sludge Pump Fourier Modulator', 3], 
  ['Transcender/Spice Rack', 6], ['Hair Spray Danger Indicator', 18]];
  var line2 = [['Nickle', 28], ['Aluminum', 13], ['Xenon', 54], ['Silver', 47], 
  ['Sulfer', 16], ['Silicon', 14], ['Vanadium', 23]];

  var plot2 = $.jqplot('chart2', [line1, line2], {
    series:[{renderer:$.jqplot.BarRenderer}, {xaxis:'x2axis', yaxis:'y2axis'}],
    axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
        tickOptions: {
          angle: 30
        }
    },
    axes: {
      xaxis: {
        renderer: $.jqplot.CategoryAxisRenderer
      },
      x2axis: {
        renderer: $.jqplot.CategoryAxisRenderer
      },
      yaxis: {
        autoscale:true
      },
      y2axis: {
        autoscale:true
      }
    }
  });
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1 = [['Cup Holder Pinion Bob', 7], ['Generic Fog Lamp', 9], ['HDTV Receiver', 15], 
  ['8 Track Control Module', 12], [' Sludge Pump Fourier Modulator', 3], 
  ['Transcender/Spice Rack', 6], ['Hair Spray Danger Indicator', 18]];
  var plot3 = $.jqplot('chart3', [line1], {
    title: 'Concern vs. Occurrance',
    series:[{renderer:$.jqplot.BarRenderer}],
    axesDefaults: {
        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
        tickOptions: {
          angle: -30
        }
    },
    axes: {
      xaxis: {
        renderer: $.jqplot.CategoryAxisRenderer,
        tickOptions: {
          labelPosition: 'middle'
        }
      },
      yaxis: {
        autoscale:true,
        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
        tickOptions: {
          labelPosition: 'start'
        }
      }
    }
  });
});
</script>



<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>
  <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
  <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
  <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
