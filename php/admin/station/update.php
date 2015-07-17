<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success: false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $direccion = $referencia = $barrio = $image = $lat = $lon = "";

    if (isset($json["direccion"])) {
        $direccion = "direccion='" . utf8_decode($json["direccion"]) . "',";
    }
    if (isset($json["referencia"])) {
        $referencia = "referencia='" . utf8_decode($json["referencia"]) . "',";
    }
    if (isset($json["barrio"])) {
        $barrio = "barrio='" . utf8_decode($json["barrio"]) . "',";
    }
    if (isset($json["image"])) {
        $image = "dir_img='" . utf8_decode($json["image"]) . "',";
    }
    if (isset($json["lat"])) {
        $lat = "lat=" . $json["lat"] . ",";
    }

    if (isset($json["lon"])) {
        $lon = "lon=" . $json["lon"] . ",";
    }

    $id = "id_camara=" . $json["id"];

    $insertSql = "UPDATE camaras "
            . "SET $direccion$referencia$barrio$image$lat$lon$id "
            . "WHERE id_camara=?";

    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success: true, message: 'Camara modificada correctamente.'}";
        } else {
            if ($stmt->errno == 1062) {
                echo "{success: false, message: 'La dirección, ya existe en los registros'}";
            } else {
                echo "{success: false, message: 'No se pudo actualizar la Parada'}";
            }
        }
        $stmt->close();
    } else {
        echo "{success: false, message: 'Problemas en la construcción de la consulta.'}";
    }
}
$mysqli->close();
