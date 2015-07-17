<?php

include ('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $valor = 0;
    if ($state == 'true') {
        $valor = 1;
    }
    $insertSql = "UPDATE camaras SET imagen_visible = ? "
            . "WHERE id_camara IS NOT NULL";

    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $stmt->bind_param("i", $valor);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success:true, message:'Información Modificada Correctamente'}";
        } else {
            echo "{success:false, message: 'La Información ya ha sido modificada'}";
        }
        $stmt->close();
    } else {
        echo "{success:false, message: 'Problemas en la construcción de la consulta1.'}";
    }
}
$mysqli->close();
