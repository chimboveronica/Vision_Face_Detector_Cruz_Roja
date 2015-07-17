<?php

include ('../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT id_usuario,usuario, clave "
            . "FROM usuarios";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "id:" . $myrow["id_usuario"] . ","
                . "text:'" . $myrow["usuario"] . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
}

 