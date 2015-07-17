<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $correct = false;
    $setCode = $setRoute = "";


    if (isset($json["tipoRoute"])) {
        $setCode = "tipo='" . utf8_decode($json["tipoRoute"]) . "',";
    }
    if (isset($json["nombreRoute"])) {
        $setRoute = "nombre='" . utf8_decode($json["nombreRoute"]) . "',";
        $existeSql = "select id_ruta from rutas where nombre='" . $json["nombreRoute"] . "'";
        $result = $mysqli->query($existeSql);
        if ($result->num_rows > 0) {
            echo "{success:false, message: 'Ya existe la ruta.'}";
        }
    }

    $setId = "id_ruta = " . $json["id"];
    if ($setRoute != '') {
        $existeSql = "select id_ruta from rutas where nombre='" . $json["nombreRoute"] . "'";
        $result = $mysqli->query($existeSql);

        if ($result) {
            if ($result->num_rows > 0) {
                echo "{success:false, message: 'Ya existe el nombre asignado a otra ruta.'}";
            } else {

                $updateSql = "update rutas "
                        . "set $setCode$setRoute$setId "
                        . "where id_ruta = ?";

                $stmt = $mysqli->prepare($updateSql);
                if ($stmt) {
                    $stmt->bind_param("i", $json["id"]);
                    $stmt->execute();

                    if ($stmt->affected_rows > 0) {
                        $correct = true;
                    } else {
                        $correct = false;
                    }
                    $stmt->close();
                } else {
                    echo "{success:false, message: 'Problemas en la construcción de la consulta.'}";
                }
            }
        }
    } else {
        $updateSql = "update rutas "
                . "set $setCode$setRoute$setId "
                . "where id_ruta = ?";

        $stmt = $mysqli->prepare($updateSql);
        if ($stmt) {
            $stmt->bind_param("i", $json["id"]);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {

                $correct = true;
            } else {
                $correct = false;
            }
            $stmt->close();
        } else {
            echo "{success:false, message: 'Problemas en la construcción de la consulta.'}";
        }
    }


    if (isset($json["coordenadas"])) {
        $id_ruta = $json["id"];
        $insertSql = "DELETE FROM coordenadas_gps where id_ruta=" . $id_ruta . "";
        if ($mysqli->query($insertSql)) {
            $correct = true;
        } else {
            $correct = false;
        }

        $dataCoordenadas = explode(";", $json["coordenadas"]);
        for ($index = 0; $index < count($dataCoordenadas) - 1; $index++) {
            $data = explode(",", $dataCoordenadas[$index]);
            $lat = $data[0];
            $lon = $data[1];

            $insertSql = "insert into coordenadas_gps (id_ruta,lat,lon,orden) values (" . $id_ruta . "," . $lat . "," . $lon . "," . $index . ")";
            if ($mysqli->query($insertSql)) {
                $correct = true;
            }
        }
    }

    if (isset($json["paradas"])) {
        $id_ruta = $json["id"];
        $insertSql = "delete FROM ruta_parada where id_ruta='" . $id_ruta . "'";
        if ($mysqli->query($insertSql)) {
            $correct = true;
        } else {
            $correct = false;
        }
        $dataParadas = explode(",", $json["paradas"]);
        $cont = count($dataParadas) - 1;
        for ($index = 0; $index < $cont; $index++) {
            $insertSql = "insert into ruta_parada (id_ruta,id_parada,orden) values (" . $id_ruta . "," . $dataParadas[$index] . "," . $index . ");";
            if ($mysqli->query($insertSql)) {
                $correct = true;
            }
        }
    }
    if (isset($json["horaRoutes"])) {
        $id_ruta = $json["id"];
        $insertSql = "select id_ruta FROM ruta_hora where id_ruta='" . $id_ruta . "'";
        if ($mysqli->query($insertSql)) {
            $correct = true;
        } else {
            $correct = false;
        }
        if ($correct) {
            $insertSql = "delete FROM ruta_hora where id_ruta='" . $id_ruta . "'";
            if ($mysqli->query($insertSql)) {
                $correct = true;
            } else {
                $correct = false;
            }
        }

        $dataHorario = explode(",", $json["horaRoutes"]);
        for ($index = 1; $index < count($dataHorario) - 1; $index++) {
            $insertSql = "insert into ruta_hora(id_ruta,hora) values(" . $id_ruta . ",'" . $dataHorario[$index] . "')";
            if ($mysqli->query($insertSql)) {
                $correct = true;
            } else {
                echo "{success:false, message: 'No se pudo ingresar el trazado de la Ruta.'}";
            }
        }
    }
    if ($correct) {
        echo "{success:true, message: 'Datos Modificados Correctamente.'}";
    } else {
        echo "{success:false, message: 'No se pudo ingresar el trazado de la Ruta.'}";
    }

    $mysqli->close();
}

    
