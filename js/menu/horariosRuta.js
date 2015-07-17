var winShowHorariosRuta;
var gridHorariosRuta;
var tipo = 'R';
var gridStoreHoras;
var storeHorario;


Ext.onReady(function () {

    storeHorario = Ext.create('Ext.data.JsonStore', {
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

    gridHorariosRuta = Ext.create('Ext.grid.Panel', {
        frame: true,
        width: '60%',
        title: '',
        store: storeRuta,
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
                tipo = record.get('tipo');
                var id_Ruta = record.get('id');
                storeHorario.load({
                    params: {
                        id_ruta: id_Ruta
                    }
                });
                dibujarRutaMapa(id_Ruta);
            }}
    });

    gridStoreHoras = Ext.create('Ext.grid.Panel', {
        region: 'center',
        frame: true,
        width: '40%',
        title: '',
        store: storeHorario,
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

});

function showWinHorariosRuta() {
    if (!winShowHorariosRuta) {
        winShowHorariosRuta = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Horarios Ruta</div>',
            width: anchoInfo(),
            height: altoInfo(),
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridHorariosRuta,
                        gridStoreHoras
                    ]
                }]
        });
    }
    winShowHorariosRuta.show();
}


function dibujarRutaMapa(id_Ruta) {
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

