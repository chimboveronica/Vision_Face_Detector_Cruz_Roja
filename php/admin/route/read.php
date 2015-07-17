<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $consultaSql = "SELECT id_ruta,tipo,nombre FROM rutas";

    $result = $mysqli->query($consultaSql);

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $idRoute = $myrow["id_ruta"];
        $consultaSql1 = "SELECT LON,LAT FROM COORDENADAS_GPS WHERE ID_RUTA ='$idRoute'ORDER BY ORDEN ASC";


        $resultLine = $mysqli->query($consultaSql1);

        $verticesRoute = "";
        if ($resultLine->num_rows > 0) {
            while ($myrowline = $resultLine->fetch_assoc()) {
                $verticesRoute .= $myrowline["LAT"] . "," . $myrowline["LON"] . ";";
            }
        }
        $consultaSql2 = "SELECT hora FROM ruta_hora where id_ruta='$idRoute'";
        $result1 = $mysqli->query($consultaSql2);
        $horaRuta = "";
        while ($myrow1 = $result1->fetch_assoc()) {
            $horaRuta = $horaRuta . utf8_encode($myrow1["hora"]) . ',';
        }

        $objJson .= "{"
                . "idRoute:" . $myrow["id_ruta"] . ","
                . "tipoRoute:'" . $myrow["tipo"] . "',"
                . "horaRoutes:'" . $horaRuta . "',"
                . "nombreRoute:'" . utf8_encode($myrow["nombre"]) . "',"
                . "verticesRoute:'" . substr($verticesRoute, 0, -1) . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
    $mysqli->close();
}