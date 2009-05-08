<?php
  $title = "jqPlot Log Axis Renderer Plugin";
  $jspec_title = "jqPlot Log Axis Renderer Plugin Tests and Examples";
  require("opener.php");
?>

  <link rel="stylesheet" type="text/css" href="unittests.css" />

  <script language="javascript" type="text/javascript">
  
    function runSuites() {
      var o, n, nid;
      
      
      nid = uID();

      o = "line2 = [25, 12.5, 6.25, 3.125]; \
      plot1 = $.jqplot('_target_', [line2], { \
      legend:{show:true, location:'e'}, \
      title:'Log Y Axis, Power Tick Distribution', \
      series:[{label:'Declining line'}], \
      axes:{xaxis:{min:0, max:5}, yaxis:{tickDistribution:'power', renderer:$.jqplot.LogAxisRenderer}}});"
        
      genplot(o);

      o = "line2 = [25, 12.5, 6.25, 3.125]; \
      plot2 = $.jqplot('_target_', [line2], { \
      legend:{show:true, location:'e'}, \
      title:'Log Y Axis, Specifying Tick Values', \
      series:[{label:'Declining line'}], \
      axes:{xaxis:{min:0, max:5}, yaxis:{renderer:$.jqplot.LogAxisRenderer, ticks:[1, 2, 4, 8, 16, 32, 64]}}});"
        
      genplot(o);
      
      o = "line1 = [[1,1],[2,4],[3,9],[4,16]]; \
      line2 = [25, 12.5, 6.25, 3.125]; \
      plot3 = $.jqplot('_target_', [line1, line2], \
      {legend:{show:true, location:'e'},title:'Secondary Log Axis, Even Tick Distribution, Specify Min/Max', \
      series:[{label:'Rising line'},{yaxis:'y2axis', label:'Declining line'}], \
      axes:{xaxis:{min:0, max:5}, y2axis:{renderer:$.jqplot.LogAxisRenderer, min:2, max:30}}});"
        
      genplot(o);
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('logAxisTests.js')
      .run()
      .report()
    }
  </script>
  
<?php require('closer.php') ?>
