<?php

include ('../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if ($hora != '') {
        $consultaSql = "SELECT h.id_ruta,r.nombre FROM ruta_hora h, rutas r where h.id_ruta=r.id_ruta and h.hora='$hora' and r.tipo='$tipo';";
    } else {

        $consultaSql = "SELECT h.id_ruta,r.nombre FROM ruta_hora h, rutas r where h.id_ruta=r.id_ruta and h.hora='1' and r.tipo='1';";
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:" . $myrow["id_ruta"] . ","
                    . "text:'" . utf8_encode($myrow["nombre"]) . "'},";
        }

        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}

  