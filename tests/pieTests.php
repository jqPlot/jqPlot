<?php
  $title = "jqPlot Pie Charts";
  $jspec_title = "jqPlot Pie Chart Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.pieRenderer.js";
  require("opener.php");
?>
  <script language="javascript" type="text/javascript">

  
    function runSuites() {
      var o, n, nid;
      
      
      nid = uID();
      
      c = "The default pie chart automatically sizes itself (with a customizable margin) and centers itself in the plot area.";
      
      o = "line1 = [['frogs', 3], ['buzzards', 7], ['deer', 2.5], ['turkeys', 6], ['moles', 5], ['ground hogs', 4]];\
      plot1 = $.jqplot('_target_', [line1], {\
        title: 'Default Pie Chart',\
        seriesDefaults:{renderer:$.jqplot.PieRenderer}\
      });";
      
      genplot(o, {comment:c, height:320, width:420, var_space:false});
      
      c = 'By changing the "sliceMargin" property (default 0), you can "explode" the pie chart into separate slices.  The chart is again automatically sized and positioned to fit into the plot area and account for the legend.';
      
      o = "plot2 = $.jqplot('_target_', [line1], {\
        title: 'Pie Chart with Legend and sliceMargin',\
        seriesDefaults:{renderer:$.jqplot.PieRenderer, rendererOptions:{sliceMargin:8}}, \
        legend:{show:true}\
      });";
      
      genplot(o, {comment: c, height:320, width:460});
      
      c = 'Want all the pie taste with less filling?  By setting the "fill:false" option, slices will be stroked but not filled.  You can control the line width of the slices and the margin between slices.';
      
      o = "plot3 = $.jqplot('_target_', [line1], {\
        title: 'Pie Chart without the Filling',\
        seriesDefaults:{renderer:$.jqplot.PieRenderer, rendererOptions:{sliceMargin:8, fill:false, shadow:false, lineWidth:5}}, \
        legend:{show:true, location: 'w'}\
      });";
      
      genplot(o, {comment:c, height:300, width:460});
      
      c = 'Still too many calories?  You can specify a smaller pie by manually setting the "diameter" property.';
      
      o = "plot4 = $.jqplot('_target_', [line1], {\
        title: 'Small Pie Chart',\
        seriesDefaults:{renderer:$.jqplot.PieRenderer, rendererOptions:{sliceMargin:8, fill:false, shadow:false, lineWidth:5, diameter:100}}, \
        legend:{show:true, location: 'w'}\
      });";
      
      genplot(o, {comment:c, height:300, width:460});
      
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('pieTests.js')
      .run()
      .report()
    }
  </script>

<?php
  require('closer.php');
?>