

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'libreria/examples/ux');
Ext.require([
    'Ext.grid.filters.Filters',
    'Ext.ux.form.ItemSelector'
]);

var finishDrawRoute;
var required = '<span style="color:red;font-weight:bold" data-qtip="Campo Obligatorio">*</span>';

Ext.onReady(function () {
        actualizarMapa();
    Ext.apply(Ext.form.field.VTypes, {
        daterange: function (val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() !== this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() !== this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        },
        password: function (val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val === pwd.getValue());
            }
            return true;
        },
        passwordText: 'Las Contraseñas no coinciden',
        emailNuevo: function (val, field) {
            if (!/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(val)) {
                return  false;
            }
            return true;
        },
        emailNuevoText: 'Dede ingresar segun elz formato vpchi@gmail.com <br>sin caracteres especiales',
        cedulaValida: function (val, field) {
            if (val.length === 10) {
                return check_cedula(val);
            } else {
                return false;
            }
        },
        cedulaValidaText: 'Número de Cedula Invalida',
        cedulaValidaMask: /[0-9]/,
        numeroTelefono: function (val, field) {
            var partes = val.split("");
            if (partes.length === 10) {
                if (!/^[0]{1}[9]{1}[0-9]{8}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (!/^[0]{1}[7]{1}[0-9]{7}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        numeroTelefonoText: 'Número de telefono Inválido',
        numeroTelefonoMask: /[0-9]/,
        alphanum: function (val, field) {
            if (!/^[-0-9..A-Z.a-z.áéíóúñ()\s*]{2,150}$/.test(val)) {
                return false;
            }
            return true;
        },
        alphanumText: 'Solo carateres alfa numéricos',
        nombresApe: function (val, field) {
            if (!/^[.A-Z.a-z.áéíóúñ()\s*]{1,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        nombresApeText: 'No se permite caracteres númericos.',
        direccion: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ()\s*]{2,150}$/.test(val)) {
                return false;
            }
            return true;
        },
        direccionText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 150 carateres',
        campos: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ()\s*]{2,1000}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 150 carateres'
    });
    Ext.tip.QuickTipManager.init();

    finishDrawRoute = Ext.create('Ext.button.Button', {
        iconCls: 'icon-terminar',
        text: '<span class="btn-menu">Terminar</span>',
        hidden: true,
        height: 30,
        tooltip: '<span class="tooltip">Finalizar la Edicion de Ruta.</span>',
        handler: function () {
            google.maps.event.removeListener(editar);
            winAdminRoute.show();
            finishDrawRoute.hide();
        },
        listeners: {
            mouseover: function () {
                this.setText('<span class="btn-menu-over">Terminar</span>');
            },
            mouseout: function () {
                this.setText('<span class="btn-menu">Terminar</span>');
            }
        }
    });

    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        width: '100%',
        padding: '5 2 5 60',
        style: {
            background: '#F2EFE6'
        },
        items: [
            {
                height: 30,
                text: '<span class="btn-menu">Personas</span>',
                tooltip: '<span class="tooltip">Administrar Personas </span>',
                handler: showWinAdminPerson,
                listeners: {
                    mouseover: function () {
                        this.setText('<span class="btn-menu-over">Personas</span>');
                    },
                    mouseout: function () {
                        this.setText('<span class="btn-menu">Personas</span>');
                    }
                }
            },
            {
                height: 30,
                text: '<span class="btn-menu">Usuarios</span>',
                tooltip: '<span class="tooltip">Administrar Usuarios </span>',
                handler: showWinAdminUser,
                listeners: {
                    mouseover: function () {
                        this.setText('<span class="btn-menu-over">Usuarios</span>');
                    },
                    mouseout: function () {
                        this.setText('<span class="btn-menu">Usuarios</span>');
                    }
                }
            }, {xtype: 'tbseparator'}, {
                height: 30,
                text: '<span class="btn-menu">Camaras</span>',
                tooltip: '<span class="tooltip">Administrar Camaras</span>',
                handler: showWinAdminParadas,
                listeners: {
                    mouseover: function () {
                        this.setText('<span class="btn-menu-over">Camaras</span>');
                    },
                    mouseout: function () {
                        this.setText('<span class="btn-menu">Camaras</span>');
                    }
                }

            },
//            {xtype: 'tbseparator'}, {
//                height: 30,
//                text: '<span class="btn-menu">Rutas</span>',
//                tooltip: '<span class="tooltip">Administrar Rutas</span>',
//                handler: showWinAdminRoute,
//                listeners: {
//                    mouseover: function () {
//                        this.setText('<span class="btn-menu-over">Rutas</span>');
//                    },
//                    mouseout: function () {
//                        this.setText('<span class="btn-menu">Rutas</span>');
//                    }
//                }
//            }, 
            {xtype: 'tbseparator'}, {
                height: 30,
                text: '<span class="btn-menu">Salir</span>',
                tooltip: '<span class="tooltip">Salir de sesión</span>',
                handler: function () {
                    Ext.MessageBox.confirm('Atención!', 'Desea Salir del Sistema', function (choice) {
                        if (choice === 'yes') {
                            location.href = 'php/login/logout.php';
                        }
                    });
                },
                listeners: {
                    mouseover: function () {
                        this.setText('<span class="btn-menu-over">Salir</span>');
                    },
                    mouseout: function () {
                        this.setText('<span class="btn-menu">Salir</span>');
                    }
                }
            }, {xtype: 'tbseparator'}, {
                height: 30,
                tooltip: '<span class="tooltip">Ver Ayuda</span>',
                text: '<span class="btn-menu">Ayuda</span>',
                handler: function () {
                    window.open("php/login/restablecer.php");
                },
                listeners: {
                    mouseover: function () {
                        this.setText('<span class="btn-menu-over">Ayuda</span>');
                    },
                    mouseout: function () {
                        this.setText('<span class="btn-menu">Ayuda</span>');
                    }
                }
            }, '->', finishDrawRoute
        ]
    });

    var panelMenu = Ext.create('Ext.form.Panel', {
        region: 'north',
        items: [{
                layout: 'hbox',
                bodyStyle: {
                    // background: '#003F72'
                    background: '#AF1010'

                },
                items: [{
                        padding: '10 2 2 68',
                        xtype: 'label',
                        html: '<div id="encabezado"><p>ECU 911 LOJA | FACE DETECTOR</p>'
                    }
                ]
            },
            barraMenu]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelMenu, {
                region: 'center',
                style: {
                    borderColor: '#003F72',
                    borderStyle: 'solid'
                },
                html: '<div id="map-canvas"><div>'
            }]
    });
   
    
  
});

function actualizarMapa(){
           
 setTimeout(function (){
      console.log("entro");
//    var formCamaras = Ext.create('Ext.form.Panel', {});
//    var form = formCamaras.getForm();
//        console.log("entro");
//        form.submit({
//            url: 'php/getParadasRutas.php',
//            method: 'POST',
//            params: {
//            },
//            success: function (form, action) {
//                paradasRutas(action.result.data);
//            },
//            failure: function (form, action) {
//            }
//        });
         },10*1000);
}
function check_cedula(b) {
    var h = b.split("");
    var c = h.length;
    if (c == 10) {
        var f = 0;
        var a = (h[9] * 1);
        for (i = 0; i < (c - 1); i++) {
            var g = 0;
            if ((i % 2) != 0) {
                f = f + (h[i] * 1)
            } else {
                g = h[i] * 2;
                if (g > 9) {
                    f = f + (g - 9)
                } else {
                    f = f + g
                }
            }
        }
        var e = f / 10;
        e = Math.floor(e);
        e = (e + 1) * 10;
        var d = (e - f);
        if ((d == 10 && a == 0) || (d == a)) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }

}



