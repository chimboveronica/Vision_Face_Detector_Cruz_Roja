<?php

include ('../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT id_persona, nombres, apellidos FROM personas";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{personas: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idPersona:" . $myrow["id_persona"] . ","
                . "text:'" . utf8_encode($myrow["nombres"] ." ".$myrow["apellidos"]). "'},";
    }
    $objJson .= "]}";
    echo $objJson;
}

 