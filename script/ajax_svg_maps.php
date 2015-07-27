<?php
	$dir = '../svg/';
	$files = scandir($dir);
    $result_json = json_encode($files);
    echo($result_json);
?>