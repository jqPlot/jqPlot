<?php 
    $title = "Highlighting, Dragging Points, Cursor and Trend Lines";
    $plotTargets = array('chart1');
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

  <script class="code" type="text/javascript">

    $(document).ready(function () {

      $.jqplot.config.enablePlugins = true;

      s1 = [['23-May-08',1],['24-May-08',4],['25-May-08',2],['26-May-08', 6]];

      plot1 = $.jqplot('chart1',[s1],{
         title: 'Highlighting, Dragging, Cursor and Trend Line',
         axes: {
             xaxis: {
                 renderer: $.jqplot.DateAxisRenderer,
                 tickOptions: {
                     formatString: '%#m/%#d/%y'
                 },
                 numberTicks: 4
             },
             yaxis: {
                 tickOptions: {
                     formatString: '$%.2f'
                 }
             }
         },
         highlighter: {
             sizeAdjust: 10,
             tooltipLocation: 'n',
             tooltipAxes: 'y',
             tooltipFormatString: '<b><i><span style="color:red;">hello</span></i></b> %.2f',
             useAxesFormatters: false
         },
         cursor: {
             show: true
         }
      });
    });
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script class="include" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.categoryAxisRenderer.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.dragable.js"></script>
    <script class="include" type="text/javascript" src="../src/plugins/jqplot.trendline.js"></script> 

<!-- End additional plugins -->

<?php include "closer.php"; ?>