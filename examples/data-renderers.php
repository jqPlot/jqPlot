<?php 
    $title = "AJAX and JSON Data Loading via Data Renderers";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->

<p>Data renderers allow jqPlot to pull data from any external source (e.g. a function implementing an AJAX call).  Simply assign the external source to the "dataRenderer" plot option.  The only requirement on data renderers is that it must return a valid jqPlot data array.</p>

<div id="chart1" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>


<p>Data renderers get passed options by the plot.  The signiture for a data renderer is:</p>


<pre class="brush: js">
function(userData, plotObject, options) {
  ...
  return data;
}
</pre>


<p>Where userData is whatever data was passed into the plot, plotObject is a reference back to the plot itself, and options are any options passed into the plots "dataRendererOption" option.  The following example shows a more complicated example which uses ajax pulls data from an external json data source.</p>

<div id="chart2" style="height:300px; width:500px;"></div>

<pre class="code prettyprint brush: js"></pre>


<script class="code" type="text/javascript">
$(document).ready(function(){
  // Our data renderer function, returns an array of the form:
  // [[[x1, sin(x1)], [x2, sin(x2)], ...]]
  var sineRenderer = function() {
    var data = [[]];
    for (var i=0; i<13; i+=0.5) {
      data[0].push([i, Math.sin(i)]);
    }
    return data;
  };

  // we have an empty data array here, but use the "dataRenderer"
  // option to tell the plot to get data from our renderer.
  var plot1 = $.jqplot('chart1',[],{
      title: 'Sine Data Renderer',
      dataRenderer: sineRenderer
  });
});
</script>

  
<script class="code" type="text/javascript">
$(document).ready(function(){
  // Our ajax data renderer which here retrieves a text file.
  // it could contact any source and pull data, however.
  // The options argument isn't used in this renderer.
  var ajaxDataRenderer = function(url, plot, options) {
    var ret = null;
    $.ajax({
      // have to use synchronous here, else the function 
      // will return before the data is fetched
      async: false,
      url: url,
      dataType:"json",
      success: function(data) {
        ret = data;
      }
    });
    return ret;
  };

  // The url for our json data
  var jsonurl = "./jsondata.txt";

  // passing in the url string as the jqPlot data argument is a handy
  // shortcut for our renderer.  You could also have used the
  // "dataRendererOptions" option to pass in the url.
  var plot2 = $.jqplot('chart2', jsonurl,{
    title: "AJAX JSON Data Renderer",
    dataRenderer: ajaxDataRenderer,
    dataRendererOptions: {
      unusedOptionalUrl: jsonurl
    }
  });
});
</script>


<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

    <script class="include" language="javascript" type="text/javascript" src="../src/plugins/jqplot.json2.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
