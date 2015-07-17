<?php

function getConectionDb() {
    $db_name = "vision_face_detector";
    $db_host = "localhost";
    $db_user = "root";
    $db_password = "";

    @$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    return ($mysqli->connect_errno) ? false : $mysqli;
}

function getEncryption($text) {
    $encriptClave = md5($text);
    return $encriptClave;
}

function allRows($result) {
    $vector = null;
    $pos = 0;

    while ($myrow = $result->fetch_row()) {
        $fila = "";
        for ($i = 0; $i < count($myrow); $i++) {
            $infoCampo = $result->fetch_field_direct($i);
            $fila[$infoCampo->name] = $myrow[$i];
        }
        $vector[$pos] = $fila;
        $pos++;
    }
    return $vector;
}
