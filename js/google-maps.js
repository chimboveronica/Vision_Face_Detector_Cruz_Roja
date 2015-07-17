var imagenGeneral;
var direccionGeneral;
var banderaLine = false;
var obtener = false;
var winInfo;
var flightPath;
var coordenadas = ',';
var editar;
var mapGoogle;
var rendererOptions = {
    draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var listMarker = [];
var listInfoWindows = [];
var puntos = [];
var datosParadas = [];
var image = {
    url: 'img/parada_bus.png',
    size: new google.maps.Size(16, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
};
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var mapOptions;
var markers = Array();
var drawingManager;
var coordenadas = "";

Ext.onReady(function () {
    initialize();
});
//para inicializar mapa
function initialize() {
    mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(-3.9912, -79.20733),
        mapTypeId: google.maps.MapTypeId.ROADMAP, //ROADMAP :: SATELLITE :: TERRAIN
        minZoom: 2
    };
    directionsDisplay = new google.maps.DirectionsRenderer();
    mapGoogle = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    directionsDisplay.setMap(mapGoogle);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYLINE
            ]
        }
    });

}

//para graficar las rutas
function calcRoute(storeLatLong) {

    var start = new google.maps.LatLng(storeLatLong[0].lat, storeLatLong[0].lon);
    var end = new google.maps.LatLng(storeLatLong[storeLatLong.length - 1].lat, storeLatLong[storeLatLong.length - 1].lon);
    var data = [];
    var centrar = new google.maps.LatLng(storeLatLong[storeLatLong.length % 2].lat, storeLatLong[storeLatLong.length % 2].lon);

    for (var i = 0; i < storeLatLong.length; i++) {
        data[i] = new google.maps.LatLng(storeLatLong[i].lat, storeLatLong[i].lon);
    }

    image = 'img/inicio.png';
    addMarker(start, 'img/inicioRuta.png', 'Inicio Ruta');
    image = 'img/fin.png';
    addMarker(end, 'img/finRuta.png', 'Fin Ruta');
    setAllMap();
    flightPath = new google.maps.Polyline({
        path: data,
        strokeColor: '#0080FF',
        strokeOpacity: 1.0,
        strokeWeight: 5
    });
    mapGoogle.setCenter(centrar);
    addLine();
}
function editarRuta(storeLatLong) {
    coordenadas = "";
    var start = new google.maps.LatLng(storeLatLong[0].lat, storeLatLong[0].lon);
    var end = new google.maps.LatLng(storeLatLong[storeLatLong.length - 1].lat, storeLatLong[storeLatLong.length - 1].lon);
    var data = [];
    for (var i = 0; i < storeLatLong.length; i++) {
        data[i] = new google.maps.LatLng(storeLatLong[i].lat, storeLatLong[i].lon);
    }

    image = 'img/inicio.png';
    addMarker(start, 'img/logo.png', 'Inicio');
    image = 'img/fin.png';
    addMarker(end, 'img/utpl.png', 'Fin');
    setAllMap();
    flightPath = new google.maps.Polyline({
        path: data,
        editable: true,
        strokeColor: 'orange',
        strokeOpacity: 1.0,
        strokeWeight: 5
    });
    google.maps.event.addListener(flightPath, "dragend", getPath);
    google.maps.event.addListener(flightPath.getPath(), "insert_at", getPath);
    google.maps.event.addListener(flightPath.getPath(), "remove_at", getPath);
    google.maps.event.addListener(flightPath.getPath(), "set_at", getPath);
    addLine();

}
var infowindowActivo = false;

function getPath() {
    coordenadas = '';
    for (var i = 0; i < flightPath.getPath().length; i++) {
        coordenadas += flightPath.getPath().j[i].k + ',' + flightPath.getPath().j[i].D + ';';
    }
    Ext.getCmp('coordenadas').setValue(coordenadas);
    Ext.getCmp('selector').setValue(flightPath.getPath().length);
}
function addMarker(myLatLng, imagen, direccion, estado,referencia,barrio, visible) {
    console.log(estado+referencia+barrio+visible);
  
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: mapGoogle,
        icon: image
    });
//    if (typeof rumbo === 'undefined') {
//        rumbo = 'Información';
//    }
//    //para presentar Tabla horarios
//    var dat = rumbo.split(';');
//    var horaSube = '';
//    var horaBaja = '';
//    var horaSubeBaja = '';
//    var cont = 0;
//    var tabla = '';
    tabla = "<center><table border='1'><tr><td><div id='table'>Sube</div></td><td><div id='table'>Baja</div></td><td><div id='table'>Sube y baja</div></td></tr>";
//    for (var i = 0; i < dat.length - 1; i++) {
//        var dato = dat[i].split(',');
//        switch (dato[0]) {
//            case "SUBE":
//                horaSube = horaSube + "<td><div id='table'>" + dato[1] + "</div></td>";
//                cont++;
//                break;
//            case "BAJA":
//                horaBaja = horaBaja + "<td><div id='table'>" + dato[1] + "</div></td>";
//                cont++;
//                break;
//            default:
//                horaSubeBaja = horaSubeBaja + "<td><div id='table'>" + dato[1] + "</tdiv></td>";
//                cont++;
//                break;
//        }
//        if (cont === 3) {
//            cont = 0;
//            tabla = tabla + "<tr>" + horaSube + horaBaja + horaSubeBaja + "</tr>";
//            horaSube = '';
//            horaBaja = '';
//            horaSubeBaja = '';
//        }
//    }
//    if (cont > 0 || cont < 3) {
//        tabla = tabla + "<tr>" + horaSube + horaBaja + horaSubeBaja + "</tr>";
//    }
    tabla = tabla + '</table></center>';

    var contenido = "<center><div>"
            + "<div id='titulos'>" + direccion + "</div>"
            + "</div></center>";
    if (visible) {
        contenido = "<center><div>"
                + "<img src='" + imagen + "'width='150' height='100'/><br>"
                + "<div id='titulos'>Dirección: " + direccion + "</div><br>" +
                "</div></center>";
    }
    marker.infoWindow = new google.maps.InfoWindow({
        content: contenido
    });
    google.maps.event.addListener(marker, 'click', function () {
        if (infowindowActivo)
            infowindowActivo.close();
        infowindowActivo = this.infoWindow;
        infowindowActivo.open(mapGoogle, this);
    });
    markers.push(marker);
}
//para agregar marcadores al mapa

function addMarkerParadas(myLatLng, imagen, direccion, rumbo, visible) {
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: mapGoogle,
        icon: image
    });

    if (typeof rumbo === 'undefined') {
        rumbo = 'Información';
    }

    //para presentar 
    var dat = rumbo.split(';');
    var horaSube = '';
    var horaBaja = '';
    var horaSubeBaja = '';
    var cont = 0;
    var tabla = '';
    tabla = "<center><table border='1'><tr><td><div id='table'>Sube</div></td><td><div id='table'>Baja</div></td><td><div id='table'>Sube y baja</div></td></tr>";
    for (var i = 0; i < dat.length - 1; i++) {
        var dato = dat[i].split(',');
        switch (dato[0]) {
            case "SUBE":
                horaSube = horaSube + "<td><div id='table'>" + dato[1] + "</div></td>";
                cont++;
                break;
            case "BAJA":
                horaBaja = horaBaja + "<td><div id='table'>" + dato[1] + "</div></td>";
                cont++;
                break;
            default:
                horaSubeBaja = horaSubeBaja + "<td><div id='table'>" + dato[1] + "</tdiv></td>";
                cont++;
                break;
        }
        if (cont === 3) {
            cont = 0;
            tabla = tabla + "<tr>" + horaSube + horaBaja + horaSubeBaja + "</tr>";
            horaSube = '';
            horaBaja = '';
            horaSubeBaja = '';
        }
    }
    if (cont > 0 || cont < 3) {
        tabla = tabla + "<tr>" + horaSube + horaBaja + horaSubeBaja + "</tr>";
    }
    tabla = tabla + '</table></center>';
    var contenido = "<div><center>"
            + "<div id='titulos'>" + direccion + "</div><div>" + tabla + "</div>"
            + "</center></div>";
    if (visible) {
        contenido = "<div><center>"
                + "<img src='" + imagen + "'width='150' height='100'/><br>"
                + "<div id='titulos'>Dirección: " + direccion + "</div><div>" + tabla + "</div>"
                + "</center></div>";
    }

    var infowindow = new google.maps.InfoWindow({
        content: contenido
    });
    infowindow.open(mapGoogle, marker);
    markers.push(marker);
}

function setAllMap(mapGoogle) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(mapGoogle);
    }
}
function clearMarkers() {
    setAllMap(null);
}

function limpiarMapa() {
    clearMarkers();
    markers = [];
    removeLine();
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYLINE
            ]
        }
    });
    drawingManager.setMap(null);


}
function addLine() {
    flightPath.setMap(mapGoogle);
    banderaLine = true;
}
function removeLine() {
    if (banderaLine) {
        flightPath.setMap(null);
    }
}
//para coloar las paradas de la ruta en el mapa
function paradasRutas(storeParadasRutas) {
   
    var estado=0;
    for (var i = 0; i < storeParadasRutas.length; i++) {
          image = {
        url: 'img/marker5.png',
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 50)
    };
        if(i===1){
            estado=1;
            image = {
        url: 'img/marker6.png',
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 50)
    };
        }
        if(i===4){
            estado=1;
            image = {
        url: 'img/marker6.png',
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 50)
    };
        }
       
        var myLatLng = new google.maps.LatLng(storeParadasRutas[i].lat, storeParadasRutas[i].lon);
        addMarker(myLatLng, storeParadasRutas[i].dir_img, storeParadasRutas[i].direccion, estado,storeParadasRutas[i].referencia,storeParadasRutas[i].barrio, storeParadasRutas[i].imagenVisibleParada);
    }
    setAllMap(mapGoogle);
}
//calcular distancia entre los puntos
function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000.0;
}
function obtenerLongLat() {
    google.maps.event.addListener(mapGoogle, 'click', function (event) {
        if (obtener) {
            console.log(event);
            Ext.getCmp('latitud').setValue(event.latLng.A);
            Ext.getCmp('longitud').setValue(event.latLng.F);
            obtener = false;
            winAdminParada.show();
        }
    });
}
function obtenerLongLatParadas() {
    var listen = google.maps.event.addListener(mapGoogle, 'click', function (event) {
        cargarParadasCercanas(event.latLng.A, event.latLng.F);
        google.maps.event.removeListener(listen);
    });
}

function cargarParadasCercanas(latitud, longitud) {
    var distancias = [];
    var datos = [];
    var records = [];

    for (var i = 0; i < storeParadas.data.length; i++) {
        rad = function (x) {
            return x * Math.PI / 180;
        };

        var R = 6378.137; //Radio de la tierra en km
        var dLat = rad(storeParadas.getAt(i).data.latitudParada - latitud);
        var dLong = rad(storeParadas.getAt(i).data.longitudParada - longitud);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(latitud)) * Math.cos(rad(storeParadas.getAt(i).data.latitudParada)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        distancias[i] = parseFloat(d.toFixed(5)) * 1000;
        datos.push({
            idParada: storeParadas.getAt(i).data.idParada,
            longitudParada: storeParadas.getAt(i).data.longitudParada,
            latitudParada: storeParadas.getAt(i).data.latitudParada,
            distanciaParada: distancias[i],
            rumboParada: storeParadas.getAt(i).data.rumboParada,
            direccionParada: storeParadas.getAt(i).data.direccionParada,
            imagenParada: storeParadas.getAt(i).data.imagenParada,
            imagenVisibleParada: storeParadas.getAt(i).data.imagenVisibleParada
        });
    }
    var distanciasOrdenadas = distancias.sort(function (a, b) {
        return a - b;
    });

    for (var j = 0; j < 5; j++) {
        if (j === 0) {
            image = {
                url: 'img/inicio.png',
                size: new google.maps.Size(32, 51),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 32)
            };
        } else {
            image = {
                url: 'img/parada_bus.png',
                size: new google.maps.Size(16, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 32)
            };
        }

        for (var i = 0; i < distancias.length; i++) {
            if (distanciasOrdenadas[j] === datos[i].distanciaParada) {
                records.push({
                    idParada: datos[i].idParada,
                    latitudParada: datos[i].latitudParada,
                    longitudParada: datos[i].longitudParada,
                    direccionParada: datos[i].direccionParada,
                    rumboParada: datos[i].rumboParada,
                    imagenParada: datos[i].imagenParada,
                    distanciaParada: parseFloat(datos[i].distanciaParada.toFixed(2)),
                    imagenVisibleParada: datos[i].imagenVisibleParada
                });
                var myLatLng = new google.maps.LatLng(datos[i].latitudParada, datos[i].longitudParada);
                addMarker(myLatLng, datos[i].imagenParada, datos[i].direccionParada, datos[i].rumboParada);
                break;
            }

        }
        if (j === 4) {
            console.log(records);
            showWinParadasCercanas(records);
        }
    }
    setAllMap(mapGoogle);
}
function store() {
    return datosParadas;
}

function dibujarRuta() {
    drawingManager.setOptions({
        drawingControl: true
    });
    google.maps.event.addListener(drawingManager, 'polylinecomplete', function (line) {
        coordenadas = '';
        for (var i = 0; i < line.getPath().length; i++) {
            
            coordenadas = coordenadas + line.getPath().j[i].A + ',' + line.getPath().j[i].F + ';';
            puntos.push({
                latitud: line.getPath().j[i].A,
                longitud: line.getPath().j[i].F,
            });
        }

        Ext.getCmp('coordenadas').setValue(coordenadas);
        Ext.getCmp('selector').setValue(line.getPath().length);
        winAdminRoute.show();
        drawingManager.setMap(null);
        limpiarMapa();
        line.setPath([]);
    });
    drawingManager.setMap(mapGoogle);
}

function datosCoordenadas() {
    return  puntos;
}

function dibujarParadasMasCercanas() {

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,
                google.maps.drawing.OverlayType.RECTANGLE
            ]}
    });
    var puntos = [];
    drawingManager.setMap(mapGoogle);
}

function zoomUbicar(latitud, longitud) {
    var myLatLng = new google.maps.LatLng(latitud, longitud);
    mapGoogle.setZoom(16);
    mapGoogle.setCenter(myLatLng);
}

