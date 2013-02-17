         <div class="col2">

<?php
    $tmpnames = scandir('./');
    $skip = array('opener.php', 'bodyOpener.php', 'nav.php', 'closer.html', 'commonScripts.html', 'topbanner.html', 'index.php');

    foreach( $tmpnames as $value) {
        if (preg_match('/^[a-z0-9][a-z0-9_\-]+\.(html|php)$/i', $value)) {
            if (! in_array($value, $skip)) {
                $content = file_get_contents($value);
                preg_match('/\$title *= *"(.*)";/', $content, $match);
                if (count($match) > 1) {
                    $nfiles[$value] = $match[1];
                }
            }
        }
    }

    array_multisort($nfiles);

    foreach( $nfiles as $filename=>$title) {
        echo '           <div class="example-link"><a class="example-link" href="'.$filename.'">'.$title.'</a></div>'."\n";
    }
?>

         </div>
         