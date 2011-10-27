<!DOCTYPE html>

<html>
<head>
    
    <title>jqPlot Sample Charts</title>

    <link class="include" rel="stylesheet" type="text/css" href="../src/jquery.jqplot.css" />
    <link rel="stylesheet" type="text/css" href="examples.css" />
    <link type="text/css" rel="stylesheet" href="syntaxhighlighter/styles/shCoreDefault.min.css" />
    <link type="text/css" rel="stylesheet" href="syntaxhighlighter/styles/shThemejqPlot.min.css" />
  
  <!--[if lt IE 9]><script language="javascript" type="text/javascript" src="../src/excanvas.js"></script><![endif]-->
    <script class="include" type="text/javascript" src="../src/jquery.js"></script>

</head>
<body>
    <?php include "topbanner.html"; ?>

<!-- Index content goes here -->

<style type="text/css">

    p.example-link {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
        margin-left: 120px;
    }

</style>

<div class="example-links">

<?php
    $tmpnames = scandir('./');
    $skip = array('opener.php', 'bodyOpener.php', 'nav.php', 'closer.html', 'commonScripts.html', 'topbanner.html', 'index.php');

    foreach( $tmpnames as $value) {
        if (preg_match('/^[a-z0-9][a-z0-9_\-]+\.(html|php)$/i', $value)) {
            if (! in_array($value, $skip)) {
                $nfiles[] = $value;
                $content = file_get_contents($value);
                preg_match('/\$title *= *"(.*)";/', $content, $match);
                if (count($match) > 1) {
                    print "<p class=\"example-link\"><a class=\"example-link\" href=\"$value\">$match[1]</a></p>\n";
                }
            }
        }
    }
?>

</div>

<!-- End Index content -->


    </div>

</body>


</html>
