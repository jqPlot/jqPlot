<?php 
    $title = "Pie and Donut Charts";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->
  <style type="text/css">

    .jqplot-data-label {
      /*color: #444;*/
/*      font-size: 1.1em;*/
    }
  </style>

<p>jqPlot bakes up the best pie and donut charts you've ever tasted!  Like bar and filled line plots, pie and donut slices highlight when you mouse over.</p>

<div id="chart1" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<p>Too many calories in that pie?  Get all the taste without the filling!  Highlighting and data labels are still supported.  You can even cut out the slices!</p>

<div id="chart2" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<p>Coming straight from the same bakery, donut plots have nearly identical options as pie charts.</p>

<div id="chart3" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<p>For donuts you can fill the empty space in the centre with useful total sum information.</p>

<div id="chart4" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>

<script class="code" type="text/javascript">
$(document).ready(function(){
  var data = [
    ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14], 
    ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
  ];
  var plot1 = jQuery.jqplot ('chart1', [data], 
    { 
      seriesDefaults: {
        // Make this a pie chart.
        renderer: jQuery.jqplot.PieRenderer, 
        rendererOptions: {
          // Put data labels on the pie slices.
          // By default, labels show the percentage of the slice.
          showDataLabels: true
        }
      }, 
      legend: { show:true, location: 'e' }
    }
  );
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
  var data = [
    ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14], 
    ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
  ];
  var plot2 = jQuery.jqplot ('chart2', [data], 
    {
      seriesDefaults: {
        renderer: jQuery.jqplot.PieRenderer, 
        rendererOptions: {
          // Turn off filling of slices.
          fill: false,
          showDataLabels: true, 
          // Add a margin to seperate the slices.
          sliceMargin: 4, 
          // stroke the slices with a little thicker line.
          lineWidth: 5
        }
      }, 
      legend: { show:true, location: 'e' }
    }
  );
});
</script>


<script class="code" type="text/javascript">
$(document).ready(function(){
  var s1 = [['a',6], ['b',8], ['c',14], ['d',20]];
  var s2 = [['a', 8], ['b', 12], ['c', 6], ['d', 9]];
  
  var plot3 = $.jqplot('chart3', [s1, s2], {
    seriesDefaults: {
      // make this a donut chart.
      renderer:$.jqplot.DonutRenderer,
      rendererOptions:{
        // Donut's can be cut into slices like pies.
        sliceMargin: 3,
        // Pies and donuts can start at any arbitrary angle.
        startAngle: -90,
        showDataLabels: true,
        // By default, data labels show the percentage of the donut/pie.
        // You can show the data 'value' or data 'label' instead.
        dataLabels: 'value'
      }
    }
  });
});
</script>

<script class="code" type="text/javascript">
$(document).ready(function(){
  var data = [
    ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14], 
    ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
  ];
  
  var plot4 = $.jqplot('chart4', [data], {
    seriesDefaults: {
      // make this a donut chart.
      renderer:$.jqplot.DonutRenderer,
      rendererOptions:{
        // Donut's can be cut into slices like pies.
        sliceMargin: 3,
        // Pies and donuts can start at any arbitrary angle.
        startAngle: -90,
        showDataLabels: true,
        // By default, data labels show the percentage of the donut/pie.
        // You can show the data 'value' or data 'label' instead.
        dataLabels: 'value',
        // "totalLabel=true" uses the centre of the donut for the total amount
        totalLabel: true
      }
    }
  });
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.pieRenderer.js"></script>
    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.donutRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>
