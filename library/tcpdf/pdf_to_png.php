<?php
if (extension_loaded('imagick')) {
	$img = new Imagick();
	echo $img;
} else {
	echo "imagick not loaded";
}
?>