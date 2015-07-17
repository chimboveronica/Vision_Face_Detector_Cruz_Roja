<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success: false, message:'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $insertSql = "delete from usuarios where id_usuario=?";
    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success:true, message: 'Uusario eliminado correctamente.'}";
        }
        $stmt->close();
    } else {
        echo "{success:false, message: 'Problemas al actualizar en la tabla.'}";
    }

    $mysqli->close();
}