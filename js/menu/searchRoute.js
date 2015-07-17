var winShowWinsearchRoute;
var formShowWinsearchRoute;
var gridsearchRoute;
var tipo = '';
var id_Ruta;
Ext.onReady(function () {
    tipo = 'R';
    storeRutas.load({
        params: {
            tipo: tipo
        }
    });
    gridsearchRoute = Ext.create('Ext.grid.Panel', {
        store: storeRutas,
        stripeRows: true,
        width: '55%',
        margins: '0 2 0 0',
        region: 'center',
        title: 'Resultados',
        plugins: 'gridfilters',
        multiSelect: true,
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: false
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', flex: 0.2, align: 'center'}),
            {text: 'Ruta', flex: 1, dataIndex: 'text', align: 'center', filter: true}
        ],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                if (selected.length > 0) {
                    id_Ruta = selected[0].data.id;
                }
                dibujarRutasMapa();

                Ext.example.msg("<center>Mensaje</center>", '<center>Ruta Graficada</center>');
            }
        }
    });
    formShowWinsearchRoute = Ext.create('Ext.form.Panel', {
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
                title: '<b><div id="camposForm">Criterios de Búsqueda</div></b>',
                items: [
                    {
                        xtype: 'radiogroup',
                        columns: 2,
                        horizonta: true,
                        items: [
                            {boxLabel: 'Baja de la UTPL ', name: 'rb', inputValue: '1', checked: true},
                            {boxLabel: 'Sube a la UTPL', name: 'rb', inputValue: '2'},
                            {boxLabel: 'Sube y baja de la UTPL', name: 'rb', inputValue: '3'}
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




function showWinsearchRoute() {
    if (!winShowWinsearchRoute) {
        winShowWinsearchRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Búsqueda de Rutas</div>',
            icon: 'img/buscar1.png',
            resizable: false,
            width: ancho(),
            height: alto(),
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 2,
                    items: [
                        gridsearchRoute,
                        formShowWinsearchRoute
                    ]
                }]
        });
    }
    winShowWinsearchRoute.show();
}

function dibujarRutasMapa() {
    limpiarMapa();

    var form = formShowWinsearchRoute.getForm();
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