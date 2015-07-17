<?php

include ('../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $queryRumbo = "SELECT p.id_parada, r.tipo "
            . "FROM ruta_parada rp, paradas p, rutas r "
            . "WHERE rp.id_ruta = r.id_ruta "
            . "AND rp.id_parada = p.id_parada";

    if (isset($query)) {
        $queryParadas = "SELECT id_parada, lon, lat, direccion, referencia, barrio, dir_img, imagen_visible "
                . "FROM paradas p "
                . "WHERE direccion LIKE '%$query%' OR referencia LIKE '%$query%' OR barrio LIKE '%$query%'";
    } else {
        $queryParadas = "SELECT id_parada, lon, lat, direccion, referencia, barrio, dir_img, imagen_visible "
                . "FROM paradas";
    }

    $result = $mysqli->query($queryParadas);
    $resultParadas = allRows($mysqli->query($queryRumbo));

    if ($result->num_rows > 0) {
        $objJson = "{data: [";
        while ($myrow = $result->fetch_assoc()) {
            $listaHora = '';
            $id = $myrow["id_parada"];
            $queryRutas = "SELECT p.id_ruta, r.nombre, r.tipo FROM irbudata.ruta_parada p, irbudata.rutas r where r.id_ruta=p.id_ruta and id_parada='$id'";
            $resultRutas = $mysqli->query($queryRutas);
            if ($resultRutas->num_rows > 0) {
                while ($myrowRutas = $resultRutas->fetch_assoc()) {
                    $idRuta1 = $myrowRutas["id_ruta"];
                    $queryHoras = "SELECT id_ruta,hora FROM ruta_hora where id_ruta='$idRuta1' group by hora asc";
                    $resultHoras = $mysqli->query($queryHoras);
                    if ($resultHoras->num_rows > 0) {
                        while ($myrowHoras = $resultHoras->fetch_assoc()) {
                            $rumbo = '';
                            switch ($myrowRutas["tipo"]) {
                                case "B":
                                    $rumbo = 'BAJA';
                                    break;
                                case "R":
                                    $rumbo = 'SUBE';
                                    break;
                                default:
                                    $rumbo = 'SUBE Y BAJA';
                                    break;
                            }
                            $listaHora = $listaHora . $rumbo . ',' . $myrowHoras['hora'] . ';';
                        }
                    }
                }
            }

            $objJson .= "{"
                    . "idParada:" . $myrow["id_parada"] . ","
                    . "latitudParada:" . $myrow["lat"] . ","
                    . "longitudParada:" . $myrow["lon"] . ","
                    . "referenciaParada:'" . utf8_encode($myrow["referencia"]) . "',"
                    . "direccionParada:'" . utf8_encode($myrow["direccion"]) . "',"
                    . "barrioParada:'" . utf8_encode($myrow["barrio"]) . "',"
                    . "rumboParada:'" . $listaHora . "',"
                    . "imagenParada:'" . $myrow["dir_img"] . "',"
                    . "imagenVisibleParada:" . $myrow["imagen_visible"]
                    . "},";
        }
        $queryRutas = "SELECT id_ruta, nombre,tipo from rutas";
        $resultRutas = $mysqli->query($queryRutas);
        if ($resultRutas->num_rows > 0) {
            while ($myrowRutas = $resultRutas->fetch_assoc()) {
                $lat = 0;
                $lon = 0;
                $barrio = '';
                $estado = 'ruta';
                $dir_img = '';
                $imagen_visible = 0;
                $objJson .= "{"
                        . "idParada:" . $myrowRutas["id_ruta"] . ","
                        . "latitudParada:" . $lat . ","
                        . "longitudParada:" . $lon . ","
                        . "referenciaParada:'" . utf8_encode($myrowRutas["tipo"]) . "',"
                        . "direccionParada:'" . utf8_encode($myrowRutas["nombre"]) . "',"
                        . "barrioParada:'" . utf8_encode($barrio) . "',"
                        . "rumboParada:'" . $estado . "',"
                        . "imagenParada:'" . $dir_img . "',"
                        . "imagenVisibleParada:" . $imagen_visible
                        . "},";
            }
        }
        $objJson .="]}";
        echo $objJson;
        $mysqli->close();
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}

  