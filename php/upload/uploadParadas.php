<?php 
$target_path = "../../img/datap/";
$target_file = $target_path . basename($_FILES['imageFile']['name']);

if (!getimagesize($_FILES["imageFile"]["tmp_name"])) {
    echo "{failure: true, message: 'El Archivo no es una Imagen'}";
} else {
    $typeImg = pathinfo($target_file, PATHINFO_EXTENSION);
    if ($typeImg == 'JPG' || $typeImg == 'jpg' || $typeImg == 'jpeg' || $typeImg == 'png' || $typeImg == 'gif') {
        //La imagen es mayor de 2mb ?
        if ($_FILES["imageFile"]["size"] > 2000000) {
            echo "{failure: true, message: 'La Imagen excede el Tamaño ( Max: 2MB )'}";
        } else {
            if (strlen($_FILES['imageFile']['tmp_name']) > 40) {
                echo "{failure: true, message: 'El nombre del archivo es muy largo ( Max: 40 caracteres)'}";
            } else {
                if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $target_file)) {
                    echo "{success: true, message: '" . basename($_FILES['imageFile']['name']) . "' }";
                } else {
                    echo "{failure: true, message: 'No se pudo subir la Imagen, problemas con el archivo.<br>Intente con otra imagen.'}";
                }
            }
        }
    } else {
        echo "{failure: true, message: 'El Archivo no es un Formato de Imagen Valido ( JPG, JPEG, PNG, GIF ).'}";
    }
}





