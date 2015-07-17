<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success: false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $direccion = $cedula = $nombres = $apellidos = $celular = $fecha_nacimiento = $genero = $correo = $edad = "";
    $result = false;
    if (isset($json["direccion"])) {
        $direccion = "direccion='" . utf8_decode($json["direccion"]) . "',";
    }
    if (isset($json["cedula"])) {
        $cedula = "cedula='" . $json["cedula"] . "',";
    }
    if (isset($json["nombres"])) {
        $nombres = "nombres='" . utf8_decode($json["nombres"]) . "',";
    }
    if (isset($json["apellidos"])) {
        $apellidos = "apellidos='" . utf8_decode($json["apellidos"]) . "',";
    }
    if (isset($json["celular"])) {
        $celular = "celular='" . $json["celular"] . "',";
    }
    if (isset($json["fecha_nacimiento"])) {
        $fecha_nacimiento = "fecha_nacimiento='" . $json["fecha_nacimiento"] . "',";
    }

    if (isset($json["genero"])) {
        $genero = "genero='" . $json["genero"] . "',";
    }
    if (isset($json["correo"])) {
        $correo = "correo='" . $json["correo"] . "',";
    }
    if (isset($json["edad"])) {
        $edad = "edad=" . $json["edad"] . ",";
    }
    $id = "id_persona=" . $json["id"];

    $insertSql = "UPDATE personas "
            . "SET $direccion$cedula$nombres$apellidos$celular$fecha_nacimiento$genero$correo$edad$id "
            . "WHERE id_persona=?";

    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success: true, message:'Persona modificado correctamente.'}";
        } else {
            if ($stmt->errno == 1062) {
                echo "{success: false, message: 'La persona, cedula ya existe en los registros'}";
            } else {
                echo "{success: false, message: 'No se puede actualizar la Persona'}";
            }
        }
        $stmt->close();
    } else {
        echo "{success: false, message: 'Problemas en la construcción de la consulta.'}";
    }
}
$mysqli->close();
