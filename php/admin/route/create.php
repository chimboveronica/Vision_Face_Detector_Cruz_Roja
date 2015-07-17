<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $existeSql = "select id_ruta from rutas where nombre='" . $json["nombreRoute"] . "'";
    $result = $mysqli->query($existeSql);
    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:false, message: 'Ya existe el codigo asignado a otra ruta.'}";
        } else {

            $insertSql = "insert into rutas (nombre, tipo) "
                    . "values(?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("ss", utf8_decode($json["nombreRoute"]), utf8_decode($json["tipoRoute"]));
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    $correct = true;
                    //para insertar en la tabla coordenadas
                    $dataCoordenadas = explode(";", $json["coordenadas"]);
                    $consultaSql1 = "SELECT max(id_ruta)as id_ruta FROM rutas;";
                    $result1 = $mysqli->query($consultaSql1);
                    $myrow1 = $result1->fetch_assoc();
                    $id_ruta = $myrow1['id_ruta'];
                    $cont = 0;

                    for ($index = 0; $index < count($dataCoordenadas) - 1; $index++) {
                        $data = explode(",", $dataCoordenadas[$index]);
                        $lat = $data[0];
                        $lon = $data[1];
                        $insertSql = "insert into coordenadas_gps (id_ruta,lat,lon,orden) values(" . $id_ruta . "," . $lat . "," . $lon . "," . $index . ");";
                        if ($mysqli->query($insertSql)) {
                            $correct = true;
                        }
                    }

                    $dataParadas = explode(",", $json["listEvt"]);
                    for ($index = 0; $index < count($dataParadas); $index++) {
                        $idParada = $dataParadas[$index];
                        $insertSql = "insert into ruta_parada(id_ruta,id_parada,orden) values(" . $id_ruta . "," . $idParada . "," . $index . ");";
                        if ($mysqli->query($insertSql)) {
                            $correct = true;
                        }
                    }
                    $dataHorario = explode(",", $json["horaRoutes"]);
                    for ($index = 1; $index < count($dataHorario) - 1; $index++) {
                        $insertSql = "insert into ruta_hora(id_ruta,hora) values(" . $id_ruta . ",'" . $dataHorario[$index] . "')";
                        if ($mysqli->query($insertSql)) {
                            $correct = true;
                        }
                    }

                    if ($correct) {
                        echo "{success:true, message: 'Datos Insertados Correctamente.'}";
                    } else {
                        echo "{success:false, message: 'No se pudo ingresar el trazado de la Ruta.'}";
                    }
                } else {
                    echo "{success:false, message: 'No se pudo ingresar la Ruta.'}";
                }
                $stmt->close();
            }
        }
        $mysqli->close();
    } else {
        echo "{success:false, message: 'Problemas en la construcción de la consulta.'}";
    }
}
