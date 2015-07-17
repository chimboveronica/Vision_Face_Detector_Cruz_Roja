<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success: false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $insertSql = "INSERT INTO camaras (direccion, referencia, barrio, dir_img, lat, lon) "
            . "VALUES(?, ?, ?, ?, ?, ?)";

    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $stmt->bind_param("ssssss", utf8_decode($json["direccion"]), utf8_decode($json["referencia"]), utf8_decode($json["barrio"]), utf8_decode($json["image"]), $json["lat"], $json["lon"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success: true, message: 'Camara registrada correctamente.'}";
        } else {
            if ($stmt->errno == 1062) {
                echo "{success: false, message: 'La dirección, ya existe en los registros'}";
            } else {
                echo "{success: false, message: 'No se puede registrar la Camara'}";
            }
        }
        $stmt->close();
    } else {
        echo "{success: false, message: 'Problemas en la construcción de la consulta.'}";
    }
    $mysqli->close();
}