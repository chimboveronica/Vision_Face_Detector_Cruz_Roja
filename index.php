<?php
//
include("php/login/isLogin.php");
if (isset($_SESSION["USUARIO"])) {
    $rutaPrincipal = $_SESSION["NAMESESION"];
//      header("Location: $rutaPrincipal");
}
?>
<html>
    <head>
        <title>UTPL | Ruta de Buses</title>
        <meta charset="UTF-8">
        <link rel="shortcut icon" href="img/logo-rutas.png" type="image/x-icon">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="stylesheet" type="text/css" href="libreria/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css">
        <link rel="stylesheet" type="text/css" href="libreria/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">

        <script type="text/javascript" src="libreria/ext-all.js"></script>
        <script type="text/javascript" src="libreria/packages/ext-theme-neptune/build/ext-theme-neptune.js"></script>
        <script type="text/javascript" src="libreria/examples/shared/examples.js"></script>

        <script type="text/javascript" src="js/publico.js"></script>
        <script type="text/javascript" src="js/inicioSesion.js"></script>
        <script type="text/javascript" src="js/functions.js"></script>
        <script type="text/javascript" src="js/menu/searchRoute.js"></script>
        <script type="text/javascript" src="js/menu/rutasParadas.js"></script>
        <script type="text/javascript" src="js/menu/horariosRuta.js"></script>
        <script type="text/javascript" src="js/menu/mensajeParada.js"></script>
        <script type="text/javascript" src="js/menu/searchDateRoute.js"></script>
        <script type="text/javascript" src="js/menu/infoParadas.js"></script>
        <script type="text/javascript" src="js/menu/panelImagen.js"></script>
        <script type="text/javascript" src="js/stores.js"></script>
        
        <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=drawing"></script>
        <script type="text/javascript" src="js/google-maps.js"></script>
    </head>
    <body>
        <script type="text/javascript">
            var anchoImagen1 = screen.width;
            if (anchoImagen1 > 640) {
                document.write('<div id="imagen">' +
                        '<a href="http://www.kradac.com">' +
                        '<img alt="www.kradac.com"  src="img/simbología.png"  width="80" height="80"/>' +
                        '</a>' +
                        '</div>');
            }
        </script>
        <script type="text/javascript">
            document.getElementById("imagen").style.display = "block";
        </script>
    </body>
</html>
