<?php
  $title = "jqPlot Date Axis Renderer Plugin";
  $jspec_title = "jqPlot Date Axis Renderer Plugin Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.dateAxisRenderer.js";
  require("opener.php");
?>  
  <script language="javascript" type="text/javascript">
  
    function runSuites() {
      var o, n, nid;
          
      nid = uID();
      
      o = "line1=[['2008-09-30', 4], ['2008-10-30', 6.5], ['2008-11-30', 5.7], ['2008-12-30', 9], ['2009-01-30', 8.2]]; \
      plot9 = $.jqplot('_target_', [line1], \
      {title:'Default Date Axis', \
      axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}, \
      series:[{lineWidth:4, markerOptions:{style:'square'}}]});";
      
      genplot(o, {var_space:false});
      
      o = "line1=[['2008-06-30', 4], ['2008-7-30', 6.5], ['2008-8-30', 5.7], ['2008-9-30', 9], ['2008-10-30', 8.2]]; \
      plot10 = $.jqplot('_target_', [line1], \
      {title:'Customized Date Axis', gridPadding:{right:45}, \
      axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, tickOptions:{formatString:'%b %#d, %y'}, min:'May 30, 2008', tickInterval:'1 month'}}, \
      series:[{lineWidth:4, markerOptions:{style:'square'}}]});";
      
      genplot(o, {var_space:false});
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('dateAxisTests.js')
      .run()
      .report()
    }
  </script>

<?php require('closer.php') ?>