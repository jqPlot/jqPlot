<?php
  $title = "Multiple Y Axes Test and Examples";
  $jspec_title = "Multiple Y Axes Tests and Examples";
  $jqplot_js_includes = array();
  require("opener.php");
?>

  <script language="javascript" type="text/javascript">

    function runSuites() {
      var o, n, nid, c;
      
      
      nid = uID();
      
      c = "Up to 9 y axes are supported.  Simply specify which y axis you want to associate with your series in the plot options.";
      
      o = "var l1 = [2, 3, 1, 4, 3]; \
      var l2 = [1, 4, 3, 2, 2.5]; \
      var l3 = [14, 24, 18, 8, 22]; \
      var l4 = [102, 104, 153, 122, 138]; \
      var l5 = [843, 777, 754, 724, 722]; \
      plot1 = $.jqplot('_target_', [l1, l3, l4, l5], { \
        title:'Default Multiply y axes', \
          series:[{}, {yaxis:'y2axis'}, {yaxis:'y3axis'}, {yaxis:'y4axis'}, {yaxis:'y5axis'}, {yaxis:'y6axis'}] \
      });";
    
      genplot(o, {comment:c, height:300, width:660});
      
      c="You can customize the additional axes with options to color axes with the series lines.  Padding on the top and bottom of the axes can be controlled as well.  Shadows are drawn behind the axes lines and ticks according to the grid shadow preferences."
      
      o = "var l1 = [2, 3, 1, 4, 3]; \
      var l2 = [1, 4, 3, 2, 2.5]; \
      var l3 = [14, 24, 18, 8, 22]; \
      var l4 = [102, 104, 153, 122, 138]; \
      var l5 = [843, 777, 754, 724, 722]; \
      plot2 = $.jqplot('_target_', [l1, l2, l3, l4, l5], { \
      title:'Customized Multiply y axes', \
        series:[{}, {yaxis:'y2axis'}, {yaxis:'y3axis'}, {yaxis:'y4axis'}, {yaxis:'y5axis'}, {yaxis:'y6axis'}], \
        axesDefaults:{useSeriesColor: true}, \
        axes:{y2axis:{padMax:2}, y3axis:{padMax:2.5}, y4axis:{padMin:2}, y5axis:{padMin:2.3}}, \
        grid:{gridLineWidth:1.0, borderWidth:2.5, shadow:false} \
    });"
    
      genplot(o, {comment:c, height:300, width:660});
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('multipleYAxesTests.js')
      .run()
      .report()
    }
  </script>

<?php require('closer.php') ?>
