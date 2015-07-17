<?php

include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT id_usuario,usuario,clave,id_persona FROM usuarios";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idUsuario:" . $myrow["id_usuario"] . ","
                . "idPersona:" . $myrow["id_persona"] . ","
                . "usuario:'" . $myrow["usuario"] . "',"
                . "clave:'" . $myrow["clave"] . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
}

 