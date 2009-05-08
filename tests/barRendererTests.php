<?php
  $title = "jqplot Bar Renderer Plugin";
  $jspec_title = "jqPlot Bar Renderer Tests and Examples";
  require("opener.php");
?>
  
<script>
    function runSuites() {
      var o, n, nid;
      
      
      nid = uID();
      
      o = "line1 = [1,4,9, 16]; \
      line2 = [25, 12.5, 6.25, 3.125]; \
      plot1 = $.jqplot('_target_', [line1, line2], \
      {legend:{show:true, location:'ne'},title:'Bar Chart', \
      series:[{label:'Profits', renderer:$.jqplot.BarRenderer}, {label:'Expenses', renderer:$.jqplot.BarRenderer}], \
      axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}}});"
        
      genplot(o);
      
      o = "line1 = [1,4,9, 16]; \
      line2 = [25, 12.5, 6.25, 3.125]; \
      line3 = [2, 7, 15, 30]; \
      plot2 = $.jqplot('_target_', [line1, line2, line3], \
      {legend:{show:true, location:'ne', xoffset:55}, \
      title:'Bar Chart With Options', \
      seriesDefaults:{renderer:$.jqplot.BarRenderer, rendererOptions:{barPadding: 8, barMargin: 20}}, \
      series:[{label:'Profits'}, {label:'Expenses'}, {label:'Sales'}], \
      axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer, ticks:['1st Qtr', '2nd Qtr', '3rd Qtr', '4th Qtr']}}});"
        
      genplot(o);
      
      o = "line1 = [[1,1], [4,2], [9,3], [16,4]]; \
      line2 = [[25,1], [12.5,2], [6.25,3], [3.125,4]]; \
      plot3 = $.jqplot('_target_', [line1, line2], \
      {legend:{show:true, location:'ne'}, \
      title:'Vertically Oriented Bar Chart', \
      seriesDefaults:{renderer:$.jqplot.BarRenderer, rendererOptions:{barDirection:'horizontal', barPadding: 6, barMargin:15}}, \
      series:[{label:'Cats'}, {label:'Dogs'}], \
      axes:{yaxis:{renderer:$.jqplot.CategoryAxisRenderer, ticks:['Once', 'Twice', 'Three Times', 'More']}}});"
        
      genplot(o);
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('barRendererTests.js')
      .run()
      .report()
    }
  </script>

<?php
  require('closer.php');
?>