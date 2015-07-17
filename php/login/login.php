<?php

include ('../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    $Error = "Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.";
    echo "<script>alert('$Error');</script>";
    echo "<script>location.href='../../index.php'</script>";
} else {
    $encriptClave = md5($ps);

    $consultaSql = "SELECT u.id_usuario,u.usuario,u.clave,p.nombres,p.apellidos FROM usuarios u, personas p where u.id_persona=p.id_persona and usuario = '$us' and clave = '$encriptClave'";
    $result = $mysqli->query($consultaSql);

    if ($result->num_rows > 0) {
        $myrow = $result->fetch_assoc();
//
        // Deteccion de la ip y del proxy
        if (isset($HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"])) {
            $ip = $HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"];
            $array = split(",", $ip);
            $host = @gethostbyaddr($ip_proxy);
            $ip_proxy = $HTTP_SERVER_VARS["REMOTE_ADDR"];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
            $host = @gethostbyaddr($ip);
        }

        $idUser = $myrow["id_usuario"];
        //$fecha = @date("Y-m-d");
        //$hora = @date("H:i:s"

        $consultaSql = "insert into accesos (ip, host, id_usuario) "
                . "values (?, ?, ?) ";
        $stmt = $mysqli->prepare($consultaSql);

        if ($stmt) {
            $stmt->bind_param("ssi", $ip, $host, $idUser);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {

                session_start();

                $_SESSION["IDUSUARIO"] = $myrow["id_usuario"];
                $_SESSION["USUARIO"] = utf8_encode($myrow["usuario"]);
                $_SESSION["PERSON"] = utf8_encode($myrow["nombres"] . " " . $myrow["apellidos"]);
                $_SESSION["SESION"] = true;


                $_SESSION["NAMESESION"] = "admin.php";
                echo "<script type='text/javascript'>location.href='../../admin.php'</script>";
//                    echo "{success: true}";
            } else {
                echo "<script type='text/javascript'>location.href='../../login.php'</script>";
            }
        } else {
            $Error = utf8_decode("Problemas en la construcción de la consulta.");
            echo "<script>alert('$Error');</script>";
            echo "<script type='text/javascript'>location.href='../../login.php'</script>";
        }
    } else {
        $Error = utf8_decode("Usuario o Contraseña Incorrectas");
        echo "<script>alert('$Error');</script>";
        echo "<script type='text/javascript'>location.href='../../login.php'</script>";
    }
    $mysqli->close();
}
