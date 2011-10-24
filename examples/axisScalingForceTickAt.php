<?php 
    $title = "Filled (Area) Charts";
    // $plotTargets = array('chart1', 'chart2', 'chart3', 'chart4');
?>
<?php include "opener.php"; ?>

<!-- Additional plugins go here -->


  <script language="javascript" type="text/javascript" src="../src/jquery.jqplot.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasAxisTickRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script language="javascript" type="text/javascript" src="../src/plugins/jqplot.canvasOverlay.js"></script>

<!-- End additional plugins -->

<!-- Example scripts go here -->


<script language="javascript" type="text/javascript">

  function makeContinuousData(npoints, ybase, yvariation) {
      var data = [];
      if (yvariation == null) {
          yvariation = ybase;
          ybase = (Math.random() - 0.5) * 2 * yvariation;
      }
      for (j=0; j<npoints; j++) {
          data.push([j, ybase]);
          ybase += (Math.random() - 0.5) * 2 * yvariation;
      }
      return data;
  }

  function makeRandomData(npoints, yvariation) {
      var data = [];
      for (j=0; j<npoints; j++) {
          var y = (Math.random() - 0.5) * 2 * yvariation;
          data.push([j, y]);
      }
      return data;
  }
  function makeDualContinuousData(npoints, xbase, xvariation, ybase, yvariation) {
      var data = [];
      if (ybase == null && yvariation == null) {
          xvariation = xbase;
          yvariation = xvariation;
          xbase = (Math.random() - 0.5) * 2 * xvariation;
          ybase = (Math.random() - 0.5) * 2 * yvariation;
      }
      for (j=0; j<npoints; j++) {
          data.push([xbase, ybase]);
          xbase += (Math.random()) * xvariation;
          ybase += (Math.random() - 0.5) * 2 * yvariation;
      }
      return data;
  }

  var plotOptions = {
      axes: {
          yaxis: {
              rendererOptions: { forceTickAt0:  true, forceTickAt100: true }
          }
      }
  };

</script>

<script class="code" type="text/javascript"> 
$(document).ready(function(){
  plot1 = $.jqplot('chart1',[makeContinuousData(100, 55)], {});
});
</script>

<script class="code" type="text/javascript"> 
$(document).ready(function(){
  plot2 = $.jqplot('chart2',[makeContinuousData(100, 1, 0.001)], {});
});
</script>

<script class="code" type="text/javascript"> 
$(document).ready(function(){
  plot3 = $.jqplot('chart3',[makeContinuousData(20, 40, 5)], {
    axes: {
      yaxis: {
        rendererOptions: { forceTickAt0: true, forceTickAt100: true }
      }
    }
  });
});
</script>

<script class="code" type="text/javascript"> 
$(document).ready(function(){
  plot4 = $.jqplot('chart4',[makeContinuousData(20, 40, 5)], {
    axesDefaults: {
      pad: 0
    },
    axes: {
      yaxis: {
        rendererOptions: { forceTickAt0: true, forceTickAt100: true }
      }
    }
  });
});
</script>

<script class="code" type="text/javascript"> 
$(document).ready(function(){
  plot5 = $.jqplot('chart5',[makeContinuousData(20, 40, 5)], {
    axes: {
      xaxis: {
        padMin: 0,
        padMax: 1.2
      },
      yaxis: {
        padMax: 0,
        rendererOptions: { forceTickAt0: true, forceTickAt100: true }
      }
    }
  });
});
</script>

<script class="code" type="text/javascript"> 
$(document).ready(function(){
  plot6 = $.jqplot('chart6',[makeContinuousData(20, 40, 8)], {
    axes: {
      yaxis: {
        rendererOptions: { forceTickAt0: true, forceTickAt100: true }
      }
    },
    canvasOverlay: {
      show: true,
      objects: [
        {horizontalLine: {
          name: 'pebbles',
          y: 0,
          lineWidth: 3,
          color: 'rgb(100, 55, 124)',
          shadow: true,
          lineCap: 'butt',
          xOffset: 0
        }},
        {dashedHorizontalLine: {
          name: 'bam-bam',
          y: 100,
          lineWidth: 4,
          dashPattern: [8, 16],
          lineCap: 'round',
          xOffset: '25',
          color: 'rgb(66, 98, 144)',
          shadow: false
        }}
      ]
    }
  });
});

function lineup(plot, name) {
    var co = plot.plugins.canvasOverlay;
    var line = co.get(name);
    line.options.y += 5;
    co.draw(plot);
}

function linedown(plot, name) {
    var co = plot.plugins.canvasOverlay;
    var line = co.get(name);
    line.options.y -= 5;
    co.draw(plot);
}

</script>

<div id="chart1" style="height:300px; width:600px;margin: 30px;"></div>
<pre class="code brush: js"></pre>
<div id="chart2" style="height:300px; width:600px;margin: 30px;"></div>
<pre class="code brush: js"></pre>
<div id="chart3" style="height:300px; width:600px;margin: 30px;"></div>
<pre class="code brush: js"></pre>
<div id="chart4" style="height:300px; width:600px;margin: 30px;"></div>
<pre class="code brush: js"></pre>
<div id="chart5" style="height:300px; width:600px;margin: 30px;"></div>
<pre class="code brush: js"></pre>
<div id="chart6" style="height:300px; width:600px;margin: 30px;"></div>

<div>
<button onclick="lineup(plot6, 'pebbles')">&nbsp;Pebbles Up&nbsp;&nbsp;</button>
<button onclick="linedown(plot6, 'pebbles')">&nbsp;Pebbles Down&nbsp;</button>
</div>
<div>
<button onclick="lineup(plot6, 'bam-bam')">Bam-Bam Up</button>
<button onclick="linedown(plot6, 'bam-bam')">Bam-Bam Down</button>
</div>

<pre class="code brush: js"></pre>

<!-- End example scripts -->

<?php include "closer.html"; ?>
