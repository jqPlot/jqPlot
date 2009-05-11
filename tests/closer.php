<?php
  $test_pages = array('coretests.php' => 'Core', 
      'logAxisTests.php' => 'Log Axes', 
      'dateAxisTests.php' => 'Date Axes', 
      'CategoryAxisTests.php' => 'Category Axes', 
      'barRendererTests.php' => 'Bar Plots');
  $pages = array('coretests.php', 'logAxisTests.php', 'dateAxisTests.php', 'categoryAxisTests.php', 'barRendererTests.php');
  $labels = array('Core', 'Log Axes', 'Date Axes', 'Category Axes', 'Bar Plots');
      
      $len = count($pages);
      $parts = explode("/", $_SERVER["REQUEST_URI"]);
      $currpage = end($parts);
      $curridx = array_search($currpage, $pages);
      $prevpage = $pages[$curridx - 1];
      if (!$prevpage) $prevpage = $pages[$len-1];
      $nextpage = $pages[$curridx + 1];
      if (!$nextpage) $nextpage = $pages[0];
      
      $currlabel = $labels[$curridx];
      $prevlabel = $labels[$curridx - 1];
      $nextlabel = $labels[$curridx + 1];
      
      $a = '<a href="%s">';
?>

</head>
  <body onLoad="runSuites();">
    <div id="main">
    <div id="content">
    <div class="nav"><?php echo '<a href="'.$prevpage.'"><img src="images/arrow_left_48.png" /></a>'; ?>  <a href="index.html"><img src="images/arrow_up_48.png" /></a>  <?php echo '<a href="'.$nextpage.'"><img src="images/arrow_right_48.png" /></a>'; ?>
    </div>
    <div id="jspec-top"><h2 id="jspec-title"><?php echo $jspec_title ?></h2></div>
    <div id="jspec"></div>
    <div id="jspec-bottom"></div>
    
    <div class="nav"><?php echo '<a href="'.$prevpage.'"><img src="images/arrow_left_48.png" /></a>'; ?>  <a href="index.html"><img src="images/arrow_up_48.png" /></a>  <?php echo '<a href="'.$nextpage.'"><img src="images/arrow_right_48.png" /></a>'; ?>
    </div>
    </div>
</body>
</html>
