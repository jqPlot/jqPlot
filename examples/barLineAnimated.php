<?php 
    $title = "Animated Charts";
    $plotTargets = array(array('id'=>'chart1', 'height'=>300, 'width'=>700));
?>
<?php include "opener.php"; ?>

<!-- Additional plugins go here -->

  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.barRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script> 
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.pointLabels.js"></script>

<!-- End additional plugins -->

<!-- Example scripts go here -->
 <script class="code" type="text/javascript">

    $(document).ready(function () {
      var s1 = [[2002, 112000], [2003, 122000], [2004, 104000], [2005, 99000], [2006, 121000], 
      [2007, 148000], [2008, 114000], [2009, 133000], [2010, 161000], [2011, 173000]];
      var s2 = [[2002, 10200], [2003, 10800], [2004, 11200], [2005, 11800], [2006, 12400], 
      [2007, 12800], [2008, 13200], [2009, 12600], [2010, 13100]];

      plot1 = $.jqplot("chart1", [s2, s1], {
        animate: true,
        cursor: {
            show: true,
            zoom: true,
            looseZoom: true,
            showTooltip: false
        },
        series:[
          {
            pointLabels: {
              show: true
            },
            renderer: $.jqplot.BarRenderer,
            showHighlight: false,
            yaxis: 'y2axis',
            rendererOptions: {
              barWidth: 15,
              barPadding: -15,
              barMargin: 0,
              highlightMouseOver: false
            }
          }, {}],
          axesDefaults: {
            pad: 0
          },
          axes: {
            // These options will set up the x axis like a category axis.
            xaxis: {
              tickInterval: 1,
              drawMajorGridlines: false,
              drawMinorGridlines: true,
              drawMajorTickMarks: false,
              rendererOptions: {
                tickInset: 0.5,
                minorTicks: 1
              }
            },
            yaxis: {
              tickOptions: {
                formatString: "$%'d"
              },
              rendererOptions: {
                forceTickAt0: true
              }
            },
            y2axis: {
              tickOptions: {
                formatString: "$%'d"
              },
              rendererOptions: {
                // align the ticks on the y2 axis with the y axis.
                alignTicks: true,
                forceTickAt0: true
              }
            }
          },
          highlighter: {
            show: true, 
            showLabel: true, 
            tooltipAxes: 'y',
            sizeAdjust: 7.5 , tooltipLocation : 'ne'
          }
      });
      
    });


</script>
<!-- End example scripts -->

<?php include "closer.html"; ?>
