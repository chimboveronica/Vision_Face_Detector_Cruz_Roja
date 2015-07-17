<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{succes: false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $insertSql = "INSERT INTO personas (direccion,cedula,nombres,apellidos,celular,fecha_nacimiento,genero,correo,edad) "
            . "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $stmt->bind_param("ssssssssi", utf8_decode($json["direccion"]), $json["cedula"], utf8_decode($json["nombres"]), utf8_decode($json["apellidos"]), $json["celular"],$json["fecha_nacimiento"],$json["genero"],$json["correo"],$json["edad"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success: true, message: 'Usuario registrado correctamente.'}";
        } else {
            if ($stmt->errno == 1062) {
                echo "{success: false, message: 'El usuario o correo, ya existen en los registros'}";
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