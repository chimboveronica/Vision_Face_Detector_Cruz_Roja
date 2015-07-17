<?php
//
include("php/login/isLogin.php");
if (!isset($_SESSION["IDUSUARIO"])) {
    header("Location: login.php");
}
?>
<html>
    <head>
        <title>ECU 911|Face Detector</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="img/ocultar.png" type="image/x-icon">

        <link rel="stylesheet" type="text/css" href="libreria/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css">
        <link rel="stylesheet" type="text/css" href="libreria/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="libreria/examples/ux/css/ItemSelector.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">

        <script type="text/javascript" src="libreria/ext-all.js"></script>
        <script type="text/javascript" src="libreria/packages/ext-theme-neptune/build/ext-theme-neptune.js"></script>
        <script type="text/javascript" src="libreria/examples/shared/examples.js"></script>

        <script type="text/javascript">
<?php
echo "          
                    var idUsuario = " . $_SESSION["IDUSUARIO"] . ";
                    var person = '" . $_SESSION["PERSON"] . "';
                    ";
?>

        </script>

        <script type="text/javascript" src="js/stores.js"></script>
        <script type="text/javascript" src="js/functions.js"></script>

        <script type="text/javascript" src="js/admin.js"></script>
        <script type="text/javascript" src="js/admin/user.js"></script>
        <script type="text/javascript" src="js/admin/person.js"></script>
        <script type="text/javascript" src="js/admin/camaras.js"></script>

        <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=drawing"></script>
        <script type="text/javascript" src="js/google-maps.js"></script>
    </head>
    <body>
        <script type="text/javascript">
            var anchoImagen1 = screen.width;
            if (anchoImagen1 > 640) {
                document.write('<div id="imagen">' +
                        '<a href="http://www.kradac.com">' +
                        '<img alt="www.kradac.com"  src="img/logo_ecu911.png"  width="180" height="80"/>' +
                        '</a>' +
                        '</div>');
            }
        </script>
    </body>
</html>
