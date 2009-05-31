<?php
  $title = "jqPlot Rotated Axis Text";
  $jspec_title = "jqPlot Canvas Axis Plugin and Rotated Text Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.dateAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasTextRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasAxisTickRenderer.js";
  require("opener.php");
?>  
  <script language="javascript" type="text/javascript">
  
    function runSuites() {
      var o, n, nid;
          
      nid = uID();
      
      o = "line1=[['2008-09-30', 4], ['2008-10-30', 6.5], ['2008-11-30', 5.7], ['2008-12-30', 9], ['2009-01-30', 8.2]]; \
      plot1 = $.jqplot('_target_', [line1], \
      {title:'Rotated Text with Canvas Axis', \
      axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, min:'August 30, 2008', tickInterval:'1 month', \
      rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer}, \
      tickOptions:{formatString:'%b %#d, %Y', fontSize:'10pt', fontFamily:'Tahoma', angle:-40}}}, \
      series:[{lineWidth:4, markerOptions:{style:'square'}}]});";
      
      genplot(o, '', false);
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('canvasAxisTest.js')
      .run()
      .report()
    }
  </script>

<?php require('closer.php') ?>