<?php 
    $title = "Date Axes";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->
<p>Date axes support is provided through the dateAxisRenderer plugin.  Date axes expand javascripts native date handling capabilities.  This allow dates to be input in almost any unambiguous form, not just in milliseconds!</p>

<p><em>Note, although jqPlot will parse most any human readable date, it is safest to use javascript time stamps when possible.  Also, it is best to specify a date and time and not just a date alone.  This is due to inconsistent browser handling of local time vs. UTC with bare dates.</em></p>

<div id="chart1" style="height:300px; width:650px;"></div>

<pre class="code prettyprint brush: js"></pre>

<p>Date Axes also provide powerful formatting features.  This allows custom formatter strings to be used to format axis tick labels precisely the way you want.</p>

<div id="chart2" style="height:300px; width:650px;"></div>

<pre class="code prettyprint brush: js"></pre>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1=[['2008-08-12 4:00PM',4], ['2008-09-12 4:00PM',6.5], ['2008-10-12 4:00PM',5.7], ['2008-11-12 4:00PM',9], ['2008-12-12 4:00PM',8.2]];
  var plot1 = $.jqplot('chart1', [line1], {
    title:'Default Date Axis',
    axes:{
        xaxis:{
            renderer:$.jqplot.DateAxisRenderer
        }
    },
    series:[{lineWidth:4, markerOptions:{style:'square'}}]
  });
});
</script>


<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1=[['2008-06-30 8:00AM',4], ['2008-7-14 8:00AM',6.5], ['2008-7-28 8:00AM',5.7], ['2008-8-11 8:00AM',9], ['2008-8-25 8:00AM',8.2]];
  var plot2 = $.jqplot('chart2', [line1], {
      title:'Customized Date Axis', 
      axes:{
        xaxis:{
          renderer:$.jqplot.DateAxisRenderer, 
          tickOptions:{formatString:'%b %#d, %#I %p'},
          min:'June 16, 2008 8:00AM', 
          tickInterval:'2 weeks'
        }
      },
      series:[{lineWidth:4, markerOptions:{style:'square'}}]
  });
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
