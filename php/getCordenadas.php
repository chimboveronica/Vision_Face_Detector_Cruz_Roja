<?php

include ('../dll/config.php');

extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    if ($id_Ruta != '') {
        $consultaSql = "SELECT LON,LAT FROM COORDENADAS_GPS WHERE ID_RUTA = '$id_Ruta' ORDER BY ORDEN ASC";
    } else {
        $consultaSql = "SELECT LON,LAT FROM COORDENADAS_GPS WHERE ID_RUTA = '1' ORDER BY ORDEN ASC";
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $json = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $json .= "{"
                    . "lon:" . $myrow["LON"] . ","
                    . "lat:" . $myrow["LAT"] . ""
                    . "},";
        }
        $json .="]";

        echo "{success: true, $json}";
    } else {
        echo "{failure: true,message: 'No hay datos que obtener'}";
    }
}

  