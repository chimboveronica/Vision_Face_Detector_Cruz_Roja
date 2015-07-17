<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{succes: false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $insertSql = "INSERT INTO usuarios (id_persona, usuario, clave) "
            . "VALUES(?, ?, ?)";

    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $dataPass = explode(",", $json["clave"]);
        $stmt->bind_param("iss", $json["idPersona"], $json["usuario"], getEncryption($dataPass[0]));
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success: true, message: 'Usuario registrado correctamente.'}";
        } else {
            if ($stmt->errno == 1062) {
                echo "{success: false, message: 'El usuario, ya existen en los registros'}";
            } else {
                echo "{success: false, message: 'No se puede registrar el Usuario'}";
            }
        }
        $stmt->close();
    } else {
        echo "{success: false, message: 'Problemas en la construcción de la consulta.'}";
    }

    $mysqli->close();
}