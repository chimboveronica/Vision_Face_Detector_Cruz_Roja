<?php

include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT id_persona,direccion,cedula,nombres,apellidos,celular,fecha_nacimiento,edad,genero,correo FROM personas";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idPersona:" . $myrow["id_persona"] . ","
                . "edad:" . $myrow["edad"] . ","
                . "nombres:'" . $myrow["nombres"] . "',"
                . "direccion:'" . $myrow["direccion"] . "',"
                . "apellidos:'" . $myrow["apellidos"] . "',"
                . "cedula:'" . $myrow["cedula"] . "',"
                . "celular:'" . $myrow["celular"] . "',"
                . "genero:'" . $myrow["genero"] . "',"
                . "fecha_nacimiento:'" . $myrow["fecha_nacimiento"] . "',"

                . "correo:'" . $myrow["correo"] . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
}

 