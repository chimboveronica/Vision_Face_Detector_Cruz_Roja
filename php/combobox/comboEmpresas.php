<?php

include('../login/isLogin.php');
include ('../../dll/config.php');
extract($_GET);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idRol = $_SESSION["IDROLKARVIEW"];
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];

    if ($idRol == 1) {
        $consultaSql = "select id_empresa, empresa,acronimo,
                direccion, telefono, correo, color from empresas 
                order by id_empresa";
    }else {
        $consultaSql = "select id_empresa, empresa,acronimo,
                direccion, telefono, correo, color 
                from empresas 
                where id_empresa = '$idEmpresa'";
    }
    if ($idRol == 4) {
        $consultaSql = "select e.id_empresa, e.empresa, e.acronimo,
                e.direccion, e.telefono, e.correo, e.color from empresas e
                where e.id_persona_dom='$idPersona' order by id_empresa";
    } 
    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{empresas: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:" . $myrow["id_empresa"] . ","
                    . "acronimo:'" . $myrow["acronimo"] . "',"
                    . "color:'" . $myrow["color"] . "',"
                    . "text:'" . utf8_encode($myrow["empresa"]) . "'},";
        }

        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}