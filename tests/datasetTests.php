<?php
  $title = "jqPlot Core Test and Examples";
  $jspec_title = "jqPlot Core Tests and Examples";
  $jqplot_js_includes = array();
  $jqplot_js_includes[] = "../src/plugins/jqplot.dateAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.logAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.categoryAxisRenderer.js";
  $jqplot_js_includes[] = "../src/plugins/jqplot.barRenderer.js";
  require("opener.php");
?>

  <script language="javascript" type="text/javascript">

    function runSuites() {
      var o, n, nid, c;
      
      
      nid = uID();
      
      c = 'Test for Issue #1, <a href="http://bitbucket.org/cleonello/jqplot/issue/1/jqplot-throws-exception-if-all-y-coordinates-are">jqPlot throws exception if all y coordinates are equal</a>.  The problem with a series where all x and/or y values are equal is that the minimum and maximum value in the series are the same.  This is now handled properly.'
      
      o = "line1=[10, 10, 10, 10]; \
      plot1 = $.jqplot('_target_', [line1], \
      {title:'Equal Y Coordinates'});";
            
      genplot(o, {comment:c});
      
      c = 'Test for Issue #1, <a href="http://bitbucket.org/cleonello/jqplot/issue/1/jqplot-throws-exception-if-all-y-coordinates-are">jqPlot throws exception if all y coordinates are equal</a> with date axis renderer'
      
      o = "line1=[['Jan 1, 2009',12], ['Jan 1, 2009',13], ['Jan 1, 2009',14], ['Jan 1, 2009',15]]; \
      plot2 = $.jqplot('_target_', [line1], \
      {title:'Equal X Coordinates With Date Axis',\
      axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}});";
            
      genplot(o, {comment:c});
      
      c = 'Test for Issue #1, <a href="http://bitbucket.org/cleonello/jqplot/issue/1/jqplot-throws-exception-if-all-y-coordinates-are">jqPlot throws exception if all y coordinates are equal</a> with log axis renderer'
      
      o = "line1=[10, 10, 10, 10]; \
      plot3 = $.jqplot('_target_', [line1], \
      {title:'Equal Y Coordinates with Log Axis',\
      axes:{yaxis:{renderer:$.jqplot.LogAxisRenderer, tickDistribution:'power'}}});";
            
      genplot(o, {comment:c});
      
      c = 'Test for Issue #1, <a href="http://bitbucket.org/cleonello/jqplot/issue/1/jqplot-throws-exception-if-all-y-coordinates-are">jqPlot throws exception if all y coordinates are equal</a> with category axis renderer.  The category axis (the x axis here), was not affected by the equal value bug.  However, the data axis (the y axis here), was affected.  Additionally, a single data point series would have also caused this bug.'
      
      o = "line1=[10]; \
      plot4 = $.jqplot('_target_', [line1], \
      {title:'Single Category Test',\
      axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}},\
      seriesDefaults:{renderer:$.jqplot.BarRenderer}});";
            
      genplot(o, {comment:c});
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('datasetTests.js')
      .run()
      .report()
    }
  </script>

<?php require('closer.php') ?>
