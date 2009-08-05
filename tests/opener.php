<!DOCTYPE html>

<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="Author" content="Chris Leonello">
  <meta name="keywords" content="chart, plot, graph, javascript, jquery, jqplot, charting, plotting, graphing">
  <title><?php echo $title ?></title>
  <!--[if IE]><script language="javascript" type="text/javascript" src="../src/excanvas.min.js"></script><![endif]-->
  <link rel="stylesheet" type="text/css" href="../src/jquery.jqplot.css" />
  
  <!-- BEGIN: load jquery -->
  <script language="javascript" type="text/javascript" src="jquery-1.3.2.min.js"></script>
  <!-- END: load jquery -->
  
  <!-- BEGIN: load extras -->
  <script language="javascript" type="text/javascript" src="beautify.min.js" ></script>
  <script language="javascript" type="text/javascript" src="prettify.min.js"></script>
  <link rel="stylesheet" href="jspec.min.css" type="text/css" media="screen" title="no title" charset="utf-8">
  <link rel="stylesheet" href="prettify.min.css" type="text/css" rel="stylesheet" />
  <!-- END: load extras -->
  
  <!-- BEGIN: load jqplot -->
  <script language="javascript" type="text/javascript" src="../src/jquery.jqplot.js"></script>
  
  <?php
    if (count($jqplot_js_includes) > 0) {
      foreach ($jqplot_js_includes as $ji) {
        echo '<script language="javascript" type="text/javascript" src="'.$ji.'"></script>';
      }
    }
  ?>
  <!-- END: load jqplot -->

  <link rel="stylesheet" type="text/css" href="unittests.css" />
  
  <script language="javascript" type="text/javascript">
    // nice unique id function generator which I don't use anymore.
    var uID = (function() {
      var id = 1;
      return function(){return id++};
    })();

    function run() {
      var o, n, nid;
  
      var elems = $(".prettyprint.plot");
      
      for (var n=0; n<elems.length; n++) {
        var code = $(elems[n]).text();
        eval(code);
      }

      prettyPrint();
    }
    
  </script>
  
<?php
  $pages = array('coretests.php', 'axisAutoscaleTests.php', 'axisLabelTests.php', 'pieTests.php', 'multipleYAxesTests.php', 'logAxisTests.php', 'dateAxisTests.php', 'highlighterTests.php', 'OHLCTests.php', 'zoomTests.php', 'categoryAxisTests.php', 'barRendererTests.php', 'dragableTests.php', 'stackedTests.php', 'pointLabelTests.php', 'canvasAxisTests.php');
        
  $len = count($pages);
  $parts = explode("/", $_SERVER["REQUEST_URI"]);
  $currpage = end($parts);
  $curridx = array_search($currpage, $pages);
  $prevpage = $pages[$curridx - 1];
  if (!$prevpage) $prevpage = $pages[$len-1];
  $nextpage = $pages[$curridx + 1];
  if (!$nextpage) $nextpage = $pages[0];
  
  $a = '<a href="%s">';
?>

</head>
  <body onLoad="run();">
    <div id="main">
      <div class="logo">
      
        <div id="navhome" onclick="location.href='../../index.php';"><a href="../../index.php"></a></div> 
        <div id="navexamples" onclick="location.href='./';"><a href="./"></a></div> 
        <div id="navdocs" onclick="location.href='../docs/';"><a href="../docs/"></a></div> 
        <div id="navdownload" onclick="location.href='http://bitbucket.org/cleonello/jqplot/downloads/';"><a href="../../index.php"></a></div> 
        <div id="navinfo" onclick="location.href='../info.php';"><a href="../../info.php"></a></div>
        
      </div>
    
      <div id="content">
        <div id="jspec-top">
          <div id="jspec-title"><?php echo $jspec_title ?></div>
          <div class="nav top">
            <?php echo '<a href="'.$prevpage.'"><img src="images/arrow_left_48.png" height="24" width="24" /></a>'; ?> 
            <a href="./index.html"><img src="images/arrow_up_48.png" height="24" width="24" /></a> 
            <?php echo '<a href="'.$nextpage.'"><img src="images/arrow_right_48.png" height="24" width="24" /></a>'; ?>
          </div>
        </div>
        <div id="jspec"></div>
        <div id="jspec-bottom"></div>
        
  <?php
    if (count($jqplot_js_includes)==1) {
      echo '<p class="description">The plot(s) on this page use the following plugin:</p>';
      echo '<pre class="prettyprint">&lt;script type="text/javascript" src="'.$jqplot_js_includes[0].'"&gt;&lt;/script&gt;</pre>';
    }
    else if (count($jqplot_js_includes)>1) {
      echo '<p class="description">The plot(s) on this page use the following plugins:</p><pre class="prettyprint">';
      foreach ($jqplot_js_includes as $ji) {
        echo '&lt;script type="text/javascript" src="'.$ji.'"&gt;&lt;/script&gt;';
        echo '<br />';
      }
      echo '</pre>';
    }
  ?>