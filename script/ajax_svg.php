<?php
	$dir = '../svg/'.$_POST['directory'];
	$files = scandir($dir);
	$result = array();
	foreach($files as $file) {
        switch(ltrim(strstr($file, '.'), '.')) {
            case "svg": case "SVG":
                $result[] = $dir . "/" . $file;
        }
    }
    $result_json = json_encode($result);
    echo($result_json);
?>