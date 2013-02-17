<?php 
    $title = "Data Point Highlighting, Tooltips and Cursor Tracking";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<p>The Highlighter plugin will highlight data points near the mouse and display an optional tooltip with the data point value.  By default, the tooltip values will be formatted with the same formatter as used to display the axes tick values.  The text format can be customized with an optional sprintf style format string.</p>

<div id="chart1" style="height:300px; width:600px;"></div>

<pre class="code prettyprint brush: js"></pre>

<p>The Cursor plugin changes the mouse cursor when it enters the graph area and displays an optional tooltip with the mouse position.  The tooltip can be in a fixed location, or it can follow the mouse.  The pointer style, set to "crosshair" by default, can also be customized.  Tooltip values are formatted similar to the Highlighter plugin.  By default they use the axes formatters, but can be customized with a sprintf format string.</p>

<div id="chart2" style="height:300px; width:600px;"></div>

<pre class="code prettyprint brush: js"></pre>

<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1=[['23-May-08', 578.55], ['20-Jun-08', 566.5], ['25-Jul-08', 480.88], ['22-Aug-08', 509.84],
      ['26-Sep-08', 454.13], ['24-Oct-08', 379.75], ['21-Nov-08', 303], ['26-Dec-08', 308.56],
      ['23-Jan-09', 299.14], ['20-Feb-09', 346.51], ['20-Mar-09', 325.99], ['24-Apr-09', 386.15]];
  var plot1 = $.jqplot('chart1', [line1], {
      title:'Data Point Highlighting',
      axes:{
        xaxis:{
          renderer:$.jqplot.DateAxisRenderer,
          tickOptions:{
            formatString:'%b&nbsp;%#d'
          } 
        },
        yaxis:{
          tickOptions:{
            formatString:'$%.2f'
            }
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 7.5
      },
      cursor: {
        show: false
      }
  });
});
</script>
  
<script class="code" type="text/javascript">
$(document).ready(function(){
  var line1=[['23-May-08', 578.55], ['20-Jun-08', 566.5], ['25-Jul-08', 480.88], ['22-Aug-08', 509.84],
      ['26-Sep-08', 454.13], ['24-Oct-08', 379.75], ['21-Nov-08', 303], ['26-Dec-08', 308.56],
      ['23-Jan-09', 299.14], ['20-Feb-09', 346.51], ['20-Mar-09', 325.99], ['24-Apr-09', 386.15]];
  var plot2 = $.jqplot('chart2', [line1], {
    title:'Mouse Cursor Tracking',
    axes:{
      xaxis:{
        renderer:$.jqplot.DateAxisRenderer,
          tickOptions:{
            formatString:'%b&nbsp;%#d'
          }
      },
      yaxis:{
        tickOptions:{
          formatString:'$%.2f'
        }
      }
    },
    highlighter: {
      show: false
    },
    cursor: {
      show: true,
      tooltipLocation:'sw'
    }
  });
});
</script>


<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>
    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script>
    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.php"; ?>