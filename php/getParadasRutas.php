<?php

include ('../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT id_camara, direccion, lat, lon,referencia, barrio, dir_img,estado,imagen_visible FROM camaras";


    $result = $mysqli->query($consultaSql);


    if ($result->num_rows > 0) {
        $json = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $json .= "{"
                    . "id:" . $myrow["id_camara"] . ","
                    . "lon:" . $myrow["lon"] . ","
                    . "lat:" . $myrow["lat"] . ","
                    . "referencia:'" . utf8_encode($myrow["referencia"]) . "',"
                    . "barrio:'" . utf8_encode($myrow["barrio"]) . "',"
                    . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                    . "estado:" . $myrow["estado"] . ","
                    . "dir_img:'" . $myrow["dir_img"] . "',"
                    . "imagenVisibleParada:" . $myrow["imagen_visible"]
                    . "},";
        }
        $json .="]";
        echo "{success: true, $json}";
        $mysqli->close();
    } else {
        echo "{failure: true,,message: 'No hay datos que obtener'}";
    }
}

  