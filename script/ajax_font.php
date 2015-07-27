<?php
	$dir = '../library/opentype/fonts';
	$files = scandir($dir);
	$result = array();
	foreach($files as $file) {
        switch(ltrim(strstr($file, '.'), '.')) {
            case "ttf": case "TTF":
                $result[] = $dir . "/" . $file;
        }
    }
    $result_json = json_encode($result);
    echo($result_json);
?>