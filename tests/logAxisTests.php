<?php
  $title = "jqPlot Log Axis Renderer Plugin";
  $jspec_title = "jqPlot Log Axis Renderer Plugin Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.logAxisRenderer.js";
  require("opener.php");
?>

  <link rel="stylesheet" type="text/css" href="unittests.css" />

  <script language="javascript" type="text/javascript">
  
    function runSuites() {
      var o, n, nid;
      var h = 320;
      var w = 480;
      
      
      nid = uID();
      
      c = 'Support for logarithmic axes is provided through the logAxisRenderer plugin.  By default, ticks are displayed with an even visual spacing.  This can also be achieved by setting the "tickDistribution" option to "even".'

      o = "line2 = [25, 12.5, 6.25, 3.125]; \
      plot4 = $.jqplot('_target_', [line2], { \
      legend:{show:true, location:'ne'}, \
      title:'Log Y Axis, Even Tick Distribution', \
      series:[{label:'Declining line'}], \
      axes:{xaxis:{min:0, max:5}, yaxis:{min:1, max:64, renderer:$.jqplot.LogAxisRenderer}}});"
        
      genplot(o, {height:h, width:w, comment:c});
      
      c = 'Log axes can also display ticks in a traditional manner, with marks at every power of the log base and sub divisions between as appropriate.  This is achieved by setting the "tickDistribution" option to "power".'

      o = "line2 = [25, 12.5, 6.25, 3.125]; \
      plot1 = $.jqplot('_target_', [line2], { \
      legend:{show:true, location:'ne'}, \
      title:'Log Y Axis, Power Tick Distribution', \
      series:[{label:'Declining line'}], \
      axes:{xaxis:{min:0, max:5}, yaxis:{tickDistribution:'power', renderer:$.jqplot.LogAxisRenderer}}});"
        
      genplot(o, {height:h, width:w, comment:c});
      
      c = 'A ticks array can also be specified in a ticks array, to give the exact ticks desired.  The renderer will handle placing them at the appropriate positions on the plot.'

      o = "line2 = [25, 12.5, 6.25, 3.125]; \
      plot2 = $.jqplot('_target_', [line2], { \
      legend:{show:true, location:'ne'}, \
      title:'Log Y Axis, Specifying Tick Values', \
      series:[{label:'Declining line'}], \
      axes:{xaxis:{min:0, max:5}, yaxis:{renderer:$.jqplot.LogAxisRenderer, ticks:[1, 2, 4, 8, 16, 32, 64]}}});"
        
      genplot(o, {height:h, width:w, comment:c});
      
      c = 'Plots support dual axes as well.  Here is a plot with a normal primary y axis and a logarithmic secondary axis.  For dual axes, the plot tries to provide an equal number of ticks per axis to so marks fall at the same position on the grid for both primary and secondary axes.'
      
      o = "line1 = [[1,1],[2,4],[3,9],[4,16]]; \
      line2 = [25, 12.5, 6.25, 3.125]; \
      plot3 = $.jqplot('_target_', [line1, line2], \
      {legend:{show:true, location:'e'},title:'Secondary Log Axis, Even Tick Distribution,<br /> Specify Min/Max', \
      series:[{label:'Rising line'},{yaxis:'y2axis', label:'Declining line'}], \
      axes:{xaxis:{min:0, max:5}, y2axis:{renderer:$.jqplot.LogAxisRenderer, min:2, max:30}}});"
        
      genplot(o, {height:h, width:w, comment:c});
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('logAxisTests.js')
      .run()
      .report()
    }
  </script>
  
<?php require('closer.php') ?>
