<?php
    require_once('..\library\tcpdf\tcpdf.php');
    $custom_svg_size = $_POST['size'];

    if ($custom_svg_size[0] > $custom_svg_size[1]) {
        $direction = 'P';
    } else {
        $direction = 'L';
    }

    $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, $custom_svg_size , true, false, false);
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);
    $pdf->SetMargins(0, 0, 0, 0);
    $pdf->setImageScale(1.53);
    $pdf->SetAutoPageBreak(false, 0);
    $pdf->AddPage($direction);

    $objects = json_decode($_POST['data'],true);
    for ($i = 0; $i < count($objects); $i++) {
        $pdf->StartTransform();
        $text = false;
        $type=$font=$top=$left=$textTop=$textLeft=$height=$textHeight=$textWidth=$width=$fill=$text=$r=$g=$b=$base64=$angle='';
        if ($objects[$i]["type"] == "rect") {
            foreach ($objects[$i] as $key => $value) {
                switch ($key) {
                    case 'top':
                        $top = $value;
                        break;
                    case 'left':
                        $left = $value;
                        break;
                    case 'height':
                        $height = $value;
                        break;
                    case 'width':
                        $width = $value;
                        break;
                    case 'angle':
                        $pdf->Rotate(-$value, $left, $top);
                        break;
                    case 'fill_r':
                        $r = $value;
                        break;
                    case 'fill_g':
                        $g = $value;
                        break;
                    case 'fill_b':
                        $b = $value;
                        break;
                }
            }
            $pdf->SetFillColor($r, $g, $b);
            $pdf->Rect($left, $top, $width, $height, 'F');
        }
        if ($objects[$i]["type"] == "path") {
            foreach ($objects[$i] as $key => $value) {
                switch ($key) {
                    case 'top':
                        $top = $value;
                        break;
                    case 'left':
                        $left = $value;
                        break;
                    case 'height':
                        $height = $value;
                        break;
                    case 'width':
                        $width = $value;
                        break;
                    case 'angle':
                        $pdf->Rotate(-$value, $left, $top);
                        break;
                    case 'base64':
                        $base64 = $value;
                        break;
                }
            }
            $pdf->ImageSVG('@'.$base64, $left, $top, $width, $height, $link='', $align='', $palign='', $border=0, $fitonpage=false);
            $text = false;
        }
        if ($objects[$i]["type"] == "image") {
            foreach ($objects[$i] as $key => $value) {
                switch ($key) {
                    case 'top':
                        $top = $value;
                        break;
                    case 'left':
                        $left = $value;
                        break;
                    case 'height':
                        $height = $value;
                        break;
                    case 'width':
                        $width = $value;
                        break;
                    case 'angle':
                        $pdf->Rotate(-$value, $left, $top);
                        break;
                    case 'base64':
                        $base64 = base64_decode($value);
                        break;
                }
            }
            $pdf->Image('@'.$base64, $left, $top, $width, $height, '', '', '', true, 110, '', false, false, 0, false, false, false);
        }
        $pdf->StopTransform();
    }
    echo (memory_get_peak_usage(true)/1024/1024)." MB peak memory used";
    $pdf_output = $pdf->Output('../pdf/test_file2.pdf', 'F');
    /*UNCOMMENT TO RENDER PDF ON SCREEN.
    $pdf_output = base64_encode($pdf->Output('test_file.pdf', 'S'));
    echo $pdf_output;
    */
?>