var cadena;
var data = [];
function ancho() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 300;
    } else {
        ancho = 600;
    }
    return ancho;
}
function alto() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 300;
    } else {
        alto = 450;
    }

    return alto;
}
function anchoInfo() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 300;
    } else {
        ancho = 480;
    }
    return ancho;
}
function anchoParadas() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 300;
    } else {
        ancho = 340;
    }
    return ancho;
}
function altoParadas() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 300;
    } else {
        alto = 425;
    }
    return alto;
}

function altoInfo() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 180;
    } else {
        alto = 230;
    }
    return alto;
}
function anchoSesion() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 300;
    } else {
        ancho = 340;
    }

    return ancho;
}
function altoSesion() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {

        alto = 200;
    } else {
        alto = 400;
    }

    return ancho;
}


function anchoEdicion() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 300;

    } else {
        ancho = 380;
    }
    return ancho;
}
function altoEdicion() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 300;
    } else {
        alto = 550;
    }
    return alto;
}
function anchoEdicionUsuario() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 320;

    } else {
        ancho = 320;
    }
    return ancho;
}
function altoEdicionUsuario() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 350;
    } else {
        alto = 250;
    }
    return alto;
}

function anchoEdicionPersona() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 4;

    } else {
        ancho = 340;
    }
    return ancho;
}
function altoEdicionPersona() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 470;
    } else {
        alto = 370;
    }
    return alto;
}

function anchoRoute() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 300;

    } else {
        ancho = 700;


    }
    return ancho;
}
function altoRoute() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 300;
    } else {
        alto = 420;
    }
    return alto;
}
function anchoImg() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 200;

    } else {
        ancho = 600;


    }
    return ancho;
}
function altoImg() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 200;
    } else {
        alto = 300;
    }
    return alto;
}
function connectionMap() {

}

//para datos
function fijarcadenaPrueba(cadenas) {
    cadena = cadenas;
}


function dataPrueba() {
    var data = [];
    data = cadena.split(',');
    for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        if (data[i] !== '') {
            dataPrueba.push({
                text: data[i]
            });
        }
    }
    return data;

}

function anchoCuadroInfo() {
    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 600) {
        ancho = 300;
    } else {
        ancho = 600;
    }
    return ancho;
}
function altoCuadroInfo() {
    var alto = screen.height;
    if (alto >= 200 && alto <= 600) {
        alto = 200;
    } else {
        alto = 300;
    }

    return alto;
}