<?php
  $title = "jqPlot Charts with Rotated Axis Text";
  $jspec_title = "jqPlot Charts with Rotated Axis Text";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.dateAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasTextRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasAxisTickRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.categoryAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.barRenderer.js";
  require("opener.php");
?>  
      
<p class="description">Rotated axis tick labels is possible through the "jqplot.canvasTextRenderer.js" and "jqplot.canvasAxisTickRenderer.js" plugins.  Canvas text is rendered using the Hershey sans-serif font metrics.  Setting the "enableFontSupport" option to true will enable the native font capabilities of the canvas element in Firefox 3.5 and Safari 4.  In IE, it enables rendering text using native SVG support through excanvas. In this mode, css font specifications are supported.</p>

<p class="description">By default, tick labels are positioned to so the label end closest to the axis is nearest the tick or bar.</p>
      
<div class="jqPlot" id="chart1" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">
line1 = [['Cup Holder Pinion Bob', 7], ['Generic Fog Lamp', 9], ['HDTV Receiver', 15], 
['8 Track Control Module', 12], [' Sludge Pump Fourier Modulator', 3], 
['Transcender/Spice Rack', 6], ['Hair Spray Danger Indicator', 18]];

plot1 = $.jqplot('chart1', [line1], {
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
    },
    yaxis: {
      autoscale:true
    }
  }
});
</pre>

<p class="description">For comparison, here is the same graph as above but with "enableFontSupport" turned on and the "fontFamily" set.  If you have a supported browser, you should see a difference in label fonts.  Native font support in the canvas element is somewhat inconsistent among supported browsers and platforms and depends on fonts installed on the system.  Therefore, it should be used cautiously.</p>
      
<div class="jqPlot" id="chart1b" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">
plot1b = $.jqplot('chart1b', [line1], {
  title: 'Concern vs. Occurrance',
  series:[{renderer:$.jqplot.BarRenderer}],
  axesDefaults: {
      tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
      tickOptions: {
        enableFontSupport: true,
        fontFamily: 'Georgia',
        fontSize: '10pt',
        angle: -30
      }
  },
  axes: {
    xaxis: {
      renderer: $.jqplot.CategoryAxisRenderer
    },
    yaxis: {
      autoscale:true
    }
  }
});
</pre>

<p class="description">The default positioning applies to either primary or secondary axes and accounts for label rotation to ensure that the labels point to the appropriate bar or tick position.</p>

<div class="jqPlot" id="chart2" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">
line2 = [['Nickle', 28], ['Aluminum', 13], ['Xenon', 54], ['Silver', 47], 
['Sulfer', 16], ['Silicon', 14], ['Vanadium', 23]];

plot2 = $.jqplot('chart2', [line1, line2], {
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
  
</pre>

<p class="description">You can override the default position by specifying a labelPosition of 'start', 'middle' or 'end'. The results probably are not as pleasing as the default 'auto' setting.</p>
      
<div class="jqPlot" id="chart3" style="height:320px; width:480px;"></div>

<pre class="prettyprint plot">

plot3 = $.jqplot('chart3', [line1], {
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
</pre>
  

<?php require('closer.php') ?>