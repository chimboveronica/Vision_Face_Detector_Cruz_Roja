<?php

include ('../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if (isset($ruta)) {
        $consultaSql = "SELECT id_ruta,nombre,tipo
            FROM RUTAS
            WHERE ID_RUTA ='$ruta'";
    }
    if (isset($parada)) {
        $consultaSql = "SELECT p.id_ruta, r.nombre, r.tipo 
                FROM irbudata.ruta_parada p, irbudata.rutas r 
                WHERE R.ID_RUTA=P.ID_RUTA AND ID_PARADA='$parada'";
    }
    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:" . $myrow["id_ruta"] . ","
                    . "tipo:'" . $myrow["tipo"] . "',"
                    . "text:'" . utf8_encode($myrow["nombre"]) . "'},";
        }

        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}

  