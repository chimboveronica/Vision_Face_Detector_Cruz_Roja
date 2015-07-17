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
    'Ext.grid.filters.Filters'
]);

var panelSouth;
var bandera = false;
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

var storeRutas1 = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/getRutas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'nombre', 'tipo']
});

Ext.onReady(function() {
    Ext.tip.QuickTipManager.init();

    //vista principal
    var storeBuscarParadas = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'php/getparadas.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: [
            {name: 'idParada', type: 'int'},
            {name: 'latitudParada', type: 'number'},
            {name: 'longitudParada', type: 'number'},
            {name: 'referenciaParada', type: 'string'},
            {name: 'direccionParada', type: 'string'},
            {name: 'barrioParada', type: 'string'},
            {name: 'rumboParada', type: 'string'},
            {name: 'imagenParada', type: 'string'},
            {name: 'imagenVisibleParada', type: 'int'}
        ],
        pageSize: 10
    });
    var datos = [];
    for (var i = 0; i < storeRutas1.data.length; i++) {
        datos[i] = {
            text: '<div style="ont-family: arial; font-size: 13px; color: #083772;padding:1%;">' + storeRutas1.getAt(i).data.nombre + '</div>', handler: function() {
            }};

    }
    //Barra Web
    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        width: '100%',
        padding: '5 2 5 60',
        style: {
            background: '#F2EFE6'
        },
        items: [{
                height: 30,
                text: '<span class="btn-menu">UTPL</span>',
                tooltip: '<span class="tooltip">Pagina UTPL</span>',
                handler: function() {
                    window.open("http://www.utpl.edu.ec/");
                },
                listeners: {
                    mouseover: function() {
                        this.setText('<span class="btn-menu-over">UTPL</span>');
                    },
                    mouseout: function() {
                        this.setText('<span class="btn-menu">UTPL</span>');
                    }
                }
            },
            {xtype: 'tbseparator'},
            {
                height: 30,
                text: '<span class="btn-menu">Paradas más cercanas</span>',
                tooltip: '<span class="tooltip">Selecciona un punto en el mapa</span>',
                handler: function() {
                    showParadaCercana();
                },
                listeners: {
                    mouseover: function() {
                        this.setText('<span class="btn-menu-over">Paradas más cercanas</span>');
                    },
                    mouseout: function() {
                        this.setText('<span class="btn-menu">Paradas más cercanas</span>');
                    }
                }
            },
            {xtype: 'tbseparator'},
            {
                height: 30,
                text: '<span class="btn-menu">Paradas por Horarios</span>',
                tooltip: '<span class="tooltip">Selecciona una Ruta</span>',
                handler: showWinsearchDateRoute,
                listeners: {
                    mouseover: function() {
                        this.setText('<span class="btn-menu-over">Paradas por Horarios</span>');
                    },
                    mouseout: function() {
                        this.setText('<span class="btn-menu">Paradas por Horarios</span>');
                    }
                }
            },
            {xtype: 'tbseparator'},
            {
                height: 30,
                text: '<span class="btn-menu">Rutas</span>',
                tooltip: '<span class="tooltip">Selecciona una Ruta</span>',
                menu: new Ext.menu.Menu({
                    width: 450,
                    height: 350,
                    items: datos,
                    listeners: {
                        'click': function(store, item) {
                            limpiarMapa();
                            var dato = item.text.replace('<div style="ont-family: arial; font-size: 13px; color: #083772;padding:1%;">', '');
                            dato = dato.replace('</div>', '');
                            dibujaRuta(dato);
                        }
                    }

                }),
                listeners: {
                    mouseover: function() {
                        this.setText('<span class="btn-menu-over">Rutas</span>');
                    },
                    mouseout: function() {
                        this.setText('<span class="btn-menu">Rutas</span>');
                    }
                }
            },
            {xtype: 'tbseparator'},
            {
                height: 30,
                tooltip: '<span class="tooltip">Ver Ayuda</span>',
                text: '<span class="btn-menu">Ayuda</span>',
                handler: function() {
                    window.open("img/Mnual de Usuaio IRBU.pdf", "Ayuda KRADAC...");
                },
                listeners: {
                    mouseover: function() {
                        this.setText('<span class="btn-menu-over">Ayuda</span>');
                    },
                    mouseout: function() {
                        this.setText('<span class="btn-menu">Ayuda</span>');
                    }
                }
            }
        ]
    });
    //Panel para Web
    var panelMenu = Ext.create('Ext.form.Panel', {
        region: 'north',
        items: [{
                xtype: 'toolbar',
                padding: '5 0 0 60',
                border: '0 0 3 0',
                style: {
                    background: '#003F72',
                    borderColor: '#FFBF00',
                    borderStyle: 'solid'
                },
                items: [{
                        padding: '10 0 0 0',
                        xtype: 'label',
                        html: '<div id="encabezado"><p>UNIVERSIDAD TÉCNICA PARTICULAR DE LOJA | RUTA DE BUSES</p>'
                    }, '->', {
                        xtype: 'combo',
                        width: 250,
                        labelWidth: 20,
                        fieldLabel: '<img src="img/v.png" >',
                        store: storeBuscarParadas,
                        labelSeparator: '',
                        forceSelection: true,
                        typeAhead: false,
                        hideTrigger: true,
                        emptyText: 'Dirección | Referencia | Barrio',
                        listConfig: {
                            loadingText: 'Buscando...',
                            emptyText: 'No se ha encontrado resultados parecidos',
                            getInnerTpl: function() {
                                return '<div style="ont-family: arial; font-size: 13px; color: #083772;padding:3%;">{direccionParada}</div>';
                            }
                        },
                        listeners: {
                            select: function(thisObject, record, eOpts) {
                                limpiarMapa();
                                if (record.data.rumboParada === 'ruta') {
//                                    dibujaRuta(record[0].data.direccionParada);
                                    storeHorario.load({
                                        params: {
                                            id_ruta: record.data.idParada
                                        }
                                    });
                                    storeRuta.load({
                                        params: {
                                            ruta: record.data.idParada
                                        }
                                    });
                                    showWinHorariosRuta();
                                } else {
                                    storeRutaParadas.load({
                                        params: {
                                            parada: record.data.idParada
                                        }
                                    });
                                    storeHorarioParada.removeAll();
                                    showWinHorariosRutaParada();
//                                    var latLon = new google.maps.LatLng(record[0].data.latitudParada, record[0].data.longitudParada);
//                                    zoomUbicar(record[0].data.latitudParada, record[0].data.longitudParada);
//                                    addMarkerParadas(latLon, record[0].data.imagenParada, record[0].data.direccionParada, record[0].data.rumboParada, record[0].data.imagenVisibleParada);
                                }
                            }
                        }

                    }
                ]
            },
            barraMenu]
    });
    var panelMapa = Ext.create('Ext.panel.Panel', {
        region: 'center',
        style: {
            borderColor: '#003F72',
            borderStyle: 'solid'
        },
        html: '<div id="map-canvas"></div>'
    });
    var panelBuscar = Ext.create('Ext.panel.Panel', {
        region: 'north',
        bodyStyle: {
            background: '#003F72'
        },
        style: {
            borderStyle: 'solid',
            borderTopColor: '#FFBF00',
            borderTopWidth: '5px'
        },
        padding: '10 0 0 0',
        items: [{
                xtype: 'combo',
                width: '100%',
                id: 'buscador',
                labelWidth: 20,
                fieldLabel: '<img src="img/v.png" >',
                store: storeBuscarParadas,
                labelSeparator: '',
                forceSelection: true,
                typeAhead: false,
                hideTrigger: true,
                emptyText: 'Dirección | Referencia | Barrio',
                listConfig: {
                    loadingText: 'Buscando...',
                    emptyText: 'No ha encontrado resultados parecidos.',
                    getInnerTpl: function() {
                        return '<div style="ont-family: arial; font-size: 13px; color: #083772;padding:3%;">{direccionParada}</div>';
                    }
                },
                listeners: {
                    select: function(thisObject, record, eOpts) {
                        limpiarMapa();
                        if (record.data.rumboParada === 'ruta') {
//                                    dibujaRuta(record[0].data.direccionParada);
                            storeHorario.load({
                                params: {
                                    id_ruta: record.data.idParada
                                }
                            });
                            storeRuta.load({
                                params: {
                                    ruta: record.data.idParada
                                }
                            });
                            showWinHorariosRuta();
                        } else {
                            storeRutaParadas.load({
                                params: {
                                    parada: record.data.idParada
                                }
                            });
                            storeHorarioParada.removeAll();
                            showWinHorariosRutaParada();
//                                    var latLon = new google.maps.LatLng(record[0].data.latitudParada, record[0].data.longitudParada);
//                                    zoomUbicar(record[0].data.latitudParada, record[0].data.longitudParada);
//                                    addMarkerParadas(latLon, record[0].data.imagenParada, record[0].data.direccionParada, record[0].data.rumboParada, record[0].data.imagenVisibleParada);
                        }
                    }
                }
            }
        ]
    });
    var panelCentral = Ext.create('Ext.form.Panel', {
        region: 'center',
        layout: 'border',
        items: [
            panelBuscar,
            panelMapa]
    });

    //para el menu del movil
    var panelNorte = Ext.create('Ext.panel.Panel', {
        id: 'menu1',
        region: 'north',
        collapsible: true,
        collapsed: true,
        title: 'UTPL | Ruta de Buses',
        name: 'panelOeste',
        items: [
            {
                xtype: 'buttongroup',
                id: 'b1',
                columns: 4,
                items: [
                    {xtype: 'tbseparator'},
                    {
                        width: '100%',
                        style: {
                            borderStyle: 'solid',
                            background: '#FAFAFA'
                        },
                        height: '100%',
                        text: '<span style="color:#003F72"><img src="img/a2.png" width="100" height="100"></span>',
                        handler: function() {
                            showParadaCercana();
                            panelNorte.collapse(false);
                        }
                    },
                    {xtype: 'tbseparator'},
                    {
                        width: '100%',
                        height: '100%',
                        style: {
                            borderStyle: 'solid',
                            background: '#FAFAFA'
                        },
                        text: '<img src="img/a4.png" width="100" height="100",>',
                        menu: new Ext.menu.Menu({
                            width: 350,
                            height: 350,
                            style: {
                                borderStyle: 'solid',
                                borderTopColor: '#FFBF00',
                                borderTopWidth: '5px'
                            },
                            items: datos,
                            listeners: {
                                'click': function(store, item) {
                                    limpiarMapa();
                                    var dato = item.text.replace('<div style="ont-family: arial; font-size: 13px; color: #083772;padding:1%;">', '');
                                    dato = dato.replace('</div>', '');
                                    dibujaRuta(dato);
                                    panelNorte.collapse(false);
                                }
                            }
                        })
                    },
                    {xtype: 'tbseparator'},
                    {
                        width: '100%',
                        height: '100%',
                        style: {
                            borderStyle: 'solid', background: '#FAFAFA'
                        },
                        text: '<img src="img/a3.png" width="100" height="100",>', handler: function() {
                            showWinsearchDateRoute();
                            panelNorte.collapse(false);
                        }
                    },
                    {xtype: 'tbseparator'},
                    {
                        width: '100%',
                        height: '100%',
                        style: {
                            borderStyle: 'solid',
                            background: '#FAFAFA'
                        },
                        text: '<img src="img/a1.png" width="100" height="100",>',
                        handler: function() {
                            panelNorte.collapse(false);
                            window.open("img/Mnual de Usuaio IRBU.pdf", "Ayuda KRADAC...");
                        }
                    }
                ]
            }
        ],
        listeners: {
            collapse: function(p, eOpts) {
                panelBuscar.show();
            },
            expand: function(p, eOpts) {
                panelBuscar.hide();
            }
        }
    }
    );
    panelBuscar.hide();

    var ancho = screen.width;
    if (ancho >= 200 && ancho <= 640) {
        panelMenu = panelNorte;
        panelBuscar.show();
    }
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [
            panelMenu, panelCentral]
    });
});
//para graficar las rutas
var formRutas = Ext.create('Ext.form.Panel', {});
function dibujaRuta(ruta) {
    limpiarMapa();
    var form = formRutas.getForm();
    var idRuta;
    var tipo;
    for (var i = 0; i < storeRutas1.data.length; i++) {
        if (storeRutas1.getAt(i).data.nombre === ruta) {
            idRuta = storeRutas1.getAt(i).data.id;
            tipo = storeRutas1.getAt(i).data.tipo;
        }
    }
    form.submit({
        url: 'php/getCordenadas.php',
        params: {
            id_Ruta: idRuta
        },
        success: function(form, action) {
            calcRoute(action.result.data);
            form.submit({
                url: 'php/getParadasRutas.php',
                method: 'POST',
                params: {
                    tipo: tipo,
                    id_ruta: idRuta
                },
                success: function(form, action) {
                    paradasRutas(action.result.data);
                },
                failure: function(form, action) {
                }
            });
        }, failure: function(form, action) {

        }
    });
}

