   
</head>
<body>
    <?php // include "topbanner.html"; ?>

    <div class="example-content">

    <?php include "nav.php"; ?>

    <?php
        if (isset($plotTargets) and is_array($plotTargets)) {
            foreach ($plotTargets as $pt) {

                if (is_array($pt)) {
                    $str = '<div class="example-plot" id="'.$pt['id'].'"';
                    $width = (array_key_exists('width', $pt)) ? $pt['width'] : false;
                    $height = (array_key_exists('height', $pt)) ? $pt['height'] : false;
                    if ( $width or $height) {
                        $str .=' style="';
                        if ($width) {
                            $str .='width: '.$width.'px;';
                        }
                        if ($height) {
                            $str .=' height: '.$height.'px;';
                        }
                        $str .='"';
                    }
                    $str .='></div>';
                    print "$str\n";
                }

                else {
                    print '<div class="example-plot" id="'.$pt.'"'.'></div>';
                }
            } 
        }
    ?>
