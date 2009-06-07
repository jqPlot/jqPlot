<?php
  $title = "jqPlot Category Axis Renderer Plugin";
  $jspec_title = "jqPlot Category Axis Renderer Plugin Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.categoryAxisRenderer.js";
  require("opener.php");
?>
  <script language="javascript" type="text/javascript">

  
    function runSuites() {
      var o, n, nid;
      
      
      nid = uID();
      
      o = "line1=[4, 25, 13, 22, 14, 17, 15]; \
      plot6 = $.jqplot('_target_', [line1], \
      {title:'Default Category X Axis', \
      axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}}, \
      series:[{lineWidth:4, markerOptions:{style:'square'}}]});";
      
      genplot(o);
      
      o = "line1=[4, 25, 13, 22, 14, 17, 15]; \
      ticks = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete']; \
      plot7 = $.jqplot('_target_', [line1], \
      {title:'Customized Category X Axis', \
      axes:{xaxis:{ticks:ticks, renderer:$.jqplot.CategoryAxisRenderer}}, \
      series:[{lineWidth:4, markerOptions:{style:'square'}}]});";
      
      genplot(o);
      
      o = "line1=[['uno', 4], ['due', 25], ['tre', 13], ['quattro', 22], ['cinque', 14], ['sei', 17], ['sette', 15]]; \
      plot8 = $.jqplot('_target_', [line1], \
      {title:'Customized Category X Axis by Series Data Specificaiton', \
      axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}}, \
      series:[{lineWidth:4, markerOptions:{style:'square'}}]});";
      
      genplot(o, {var_space:false});
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('categoryAxisTests.js')
      .run()
      .report()
    }
  </script>

<?php
  require('closer.php');
?>