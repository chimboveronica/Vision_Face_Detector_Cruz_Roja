var winShowsearchDateRoute;
var formShowsearchDateRoute;
var gridsearchDateRoute;
var tipo = 'R';
var hora;
var gridHoras;
var storeHorarios;


Ext.onReady(function () {
    storeHorarios = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboboxHorarios.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['text']
    });

    gridsearchDateRoute = Ext.create('Ext.grid.Panel', {
        frame: true,
        width: '60%',
        title: '',
        store: storeRutas,
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: false
        },
        region: 'west',
        columns: [
            {text: 'Rutas', width: 500, dataIndex: 'text', filter: true}
        ],
        listeners: {
            itemclick: function (thisObj, record, item, index, e, eOpts) {

                var id_Ruta = record.get('id');
                storeHorarios.load({
                    params: {
                        id_ruta: id_Ruta
                    }
                });
                dibujarenMapa(id_Ruta);
            }}
    });

    gridHoras = Ext.create('Ext.grid.Panel', {
        region: 'center',
        frame: true,
        width: '40%',
        title: '',
        store: storeHorarios,
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: false
        },
        columns: [
            {text: 'Horarios', flex: 1, dataIndex: 'text', align: 'center', filter: true}
        ]

    });
    formShowsearchDateRoute = Ext.create('Ext.form.Panel', {
        region: 'north',
        activeRecord: null,
        bodyPadding: '10 10 10 10',
        margins: '0 0 0 3',
        defaultType: 'textfield',
        layout: 'anchor',
        fieldDefaults: {
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },
        items: [
            {
                xtype: 'fieldset',
                title: '<div id="camposForm"><b>Criterios de Búsqueda</div></b>',
                items: [
                    {
                        xtype: 'radiogroup',
                        columns: 2,
                        horizonta: true,
                        items: [
                            {boxLabel: 'Baja de la UTPL ', id: 'r', name: 'rb', inputValue: '1', checked: true},
                            {boxLabel: 'Sube a la UTPL', id: 'b', name: 'rb', inputValue: '2'},
                            {boxLabel: 'Sube y baja de la UTPL', id: 'br', name: 'rb', inputValue: '3'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        tipo = 'R';
                                        storeRutas.load({
                                            params: {
                                                tipo: tipo
                                            }
                                        });
                                        break;
                                    case 2:
                                        tipo = 'B';
                                        storeRutas.load({
                                            params: {
                                                tipo: tipo
                                            }
                                        });
                                        break;
                                    case 3:
                                        tipo = 'BR';
                                        storeRutas.load({
                                            params: {
                                                tipo: tipo
                                            }
                                        });
                                        break;
                                }

                            }
                        }
                    }
                ]
            }
        ],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
                gridStore.reload();
            }
        }
    });
});

function showWinsearchDateRoute() {
    if (!winShowsearchDateRoute) {
        winShowsearchDateRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Paradas por Horarios</div>',
            width: ancho(),
            height: alto(),
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        formShowsearchDateRoute,
                        gridsearchDateRoute,
                        gridHoras
                    ]
                }]
        });
    }

    winShowsearchDateRoute.show();
}
function dibujarenMapa(id_Ruta) {
    limpiarMapa();
    var form = formShowsearchDateRoute.getForm();
    if (form.isValid()) {
        form.submit({
            url: 'php/getCordenadas.php',
            params: {
                id_Ruta: id_Ruta
            },
            success: function (form, action) {
                calcRoute(action.result.data);
                form.submit({
                    url: 'php/getParadasRutas.php',
                    method: 'POST',
                    params: {
                        tipo: tipo,
                        id_ruta: id_Ruta
                    },
                    success: function (form, action) {
                        paradasRutas(action.result.data);
                    },
                    failure: function (form, action) {
                    }
                });
            },
            failure: function (form, action) {
            }
        });
    }
}

