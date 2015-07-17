<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success: false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $idPersona =  $usuario = $dataPass = "";

    $result = false;
    if (isset($json["idPersona"])) {
        $idPersona = "id_persona=" . $json["idPersona"]. ",";
    }
    
    if (isset($json["usuario"])) {
        $usuario = "usuario='" . utf8_decode($json["usuario"]) . "',";
    }

    if (isset($json["clave"])) {
        $dataPass = explode(",", utf8_decode($json["clave"]));
        $dataPass = "clave='" . getEncryption($dataPass[0]) . "',";
    }

    $id = "id_usuario=" . $json["id"];

    $insertSql = "UPDATE usuarios "
            . "SET $idPersona$usuario$dataPass$id "
            . "WHERE id_usuario=?";

    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success: true, message:'Usuario modificado correctamente.'}";
        } else {
            if ($stmt->errno == 1062) {
                echo "{success: false, message: 'El usuario, correo o clave, ya existen en los registros'}";
            } else {
                echo "{success: false, message: 'No se puede registrar el Usuario'}";
            }
        }
        $stmt->close();
    } else {
        echo "{success: false, message: 'Problemas en la construcción de la consulta1.'}";
    }
}
$mysqli->close();
