<?php
  $pages = array('coretests.php', 'pieTests.php', 'multipleYAxesTests.php', 'logAxisTests.php', 'dateAxisTests.php', 'highlighterTests.php', 'zoomTests.php', 'categoryAxisTests.php', 'barRendererTests.php', 'dragableTests.php', 'stackedTests.php', 'canvasAxisTests.php');
        
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
  <body onLoad="runSuites();">
    <div id="main">
      <div class="logo">
      
        <div id="navhome" onclick="location.href='../../index.php';"></div> <div id="navexamples" onclick="location.href='./';"></div> <div id="navdocs" onclick="location.href='../docs/';"></div> <div id="navdownload" onclick="location.href='http://bitbucket.org/cleonello/jqplot/downloads/';"></div> <div id="navinfo" onclick="location.href='../info.php';"></div>
        
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
    
        <div class="nav">
          <?php echo '<a href="'.$prevpage.'"><img src="images/arrow_left_48.png" height="24" width="24" /></a>'; ?> 
          <a href="./index.html"><img src="images/arrow_up_48.png" height="24" width="24" /></a> 
          <?php echo '<a href="'.$nextpage.'"><img src="images/arrow_right_48.png" height="24" width="24" /></a>'; ?>
        </div>
      </div>
    </div>
        <div id="preloader" style="display: none;">
        <img src="../images/navdownloadover.png" alt="navdownloadover" width="89" height="26"/>
        <img src="../images/navexamplesover.png" alt="navexamplesover" width="88" height="26"/>
        <img src="../images/navhomeover.png" alt="navhomeover" width="59" height="26"/>
        <img src="../images/navdocsover.png" alt="navdocsover" width="55" height="26"/>
        <img src="../images/navinfoover.png" alt="navinfoover" width="46" height="26"/>
        <img src="../images/downloadnowover.png" alt="downloadnowover" width="102" height="39"/>
    </div>
  </body>
</html>
