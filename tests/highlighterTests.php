<?php
  $title = "jqPlot Data Point Highlighter Tests";
  $jspec_title = "jqPlot Data Point Highlighter Plugin Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.dateAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasTextRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.canvasAxisTickRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.highlighter.js";
  require("opener.php");
?>  
  <script language="javascript" type="text/javascript">
  
    function runSuites() {
      var o, n, nid;
          
      nid = uID();
      
      o = "line1=[['23-May-08', 578.55], ['20-Jun-08', 566.5], ['25-Jul-08', 480.88], ['22-Aug-08', 509.84]]; \
      line1.push(['26-Sep-08', 454.13], ['24-Oct-08', 379.75], ['21-Nov-08', 303], ['26-Dec-08', 308.56]); \
      line1.push(['23-Jan-09', 299.14], ['20-Feb-09', 346.51], ['20-Mar-09', 325.99], ['24-Apr-09', 386.15]); \
      plot1 = $.jqplot('_target_', [line1], \
      {title:'Data Point Highlighting', \
      axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer, \
      rendererOptions:{tickRenderer:$.jqplot.CanvasAxisTickRenderer}, \
      tickOptions:{formatString:'%b %#d, %Y', fontSize:'10pt', fontFamily:'Tahoma', angle:-30}}}, \
      highlighter: {sizeAdjust: 7.5}});";
      
      genplot(o);
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('highlighterTests.js')
      .run()
      .report()
    }
  </script>

<?php require('closer.php') ?>