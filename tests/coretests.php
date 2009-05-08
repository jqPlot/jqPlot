<?php
  $title = "jqPlot Core Test and Examples";
  $jspec_title = "jqPlot Core Tests and Examples";
  require("opener.php");
?>

  <script language="javascript" type="text/javascript">

    function runSuites() {
      var o, n, nid;
      
      
      nid = uID();
      o = "var cosPoints = []; \
      for (var i=0; i<2*Math.PI; i+=0.4){ \
        cosPoints.push([i, Math.cos(i)]); \
      } \
      var sinPoints = []; \
      for (var i=0; i<2*Math.PI; i+=0.4){ \
         sinPoints.push([i, 2*Math.sin(i-.8)]); \
      } \
      var powPoints1 = []; \
      for (var i=0; i<2*Math.PI; i+=0.4) { \
          powPoints1.push([i, 2.5 + Math.pow(i/4, 2)]); \
      } \
      var powPoints2 = []; \
      for (var i=0; i<2*Math.PI; i+=0.4) { \
          powPoints2.push([i, -2.5 - Math.pow(i/4, 2)]); \
      } \
      plot1 = $.jqplot('_target_', [cosPoints, sinPoints, powPoints1, powPoints2], { \
      title:'Line Style Options', series:[ \
      {lineWidth:2, markerOptions:{style:'square'}}, \
      {showLine:false, markerOptions:{style:'diamond'}}, \
      {markerOptions:{style:'circle'}}, \
      {lineWidth:5, markerOptions:{style:'filledSquare', size:14}}]});";
    
      genplot(o);
      
      o = "var cosPoints = []; \
      for (var i=0; i<2*Math.PI; i+=0.1){ \
         cosPoints.push([i, Math.cos(i)]); \
      } \
      plot1b = $.jqplot('_target_', [cosPoints], { \
          title:'Shadow Options', \
          series:[{showMarker:false, lineWidth:5, shadowAngle:0, shadowOffset:2, shadowAlpha:.06, shadowDepth:5}]});"
      
      genplot(o);
    
      o = "line1=[[1,1],[1.5, 2.25],[2,4],[2.5,6.25],[3,9],[3.5,12.25],[4,16]]; \
      line2=[25, 17.5, 12.25, 8.6, 6.0, 4.2, 2.9]; \
      line3=[4, 25, 13, 22, 14, 17, 15]; \
      plot2 = $.jqplot('_target_', [line1, line2, line3], \
      {legend:{show:true}, title:'Mixed Data Input Formats', \
      series:[{label:'Rising line', showLine:false, markerOptions:{style:'square'}}, \
      {label:'Declining line'}, {label:'Zig Zag Line', lineWidth:5, showMarker:false}]});";
            
      genplot(o);
      
      o = "line1=[[1,1],[1.5, 2.25],[2,4],[2.5,6.25],[3,9],[3.5,12.25],[4,16]]; \
      line2=[25, 12.5, 6.25, 3.125]; \
      xticks = [[0, 'zero'], [1, 'one'], [2, 'two'], [3, 'three'], [4, 'four'], [5, 'five']]; \
      yticks = [-5, 0, 5, 10, 15, 20, 25, 30]; \
      plot5 = $.jqplot('_target_', [line1, line2], \
      {legend:{show:true}, title:'Customized Axes Ticks', \
      series:[{label:'Rising line', markerOptions:{style:'square'}}, {label:'Declining line'}], \
      axes:{xaxis:{ticks:xticks}, yaxis:{ticks:yticks}}});";
            
      genplot(o);
  
      prettyPrint();
      
      JSpec.options.profile = false;
      JSpec
      .exec('coretests.js')
      .run()
      .report()
    }
  </script>

<?php require('closer.php') ?>
