var winShowHorariosRutasParada;
var gridHorariosRutasParada;
var tipo = 'R';
var hora;
var gridStoreHorasParadas;
var storeHorarioParada;


Ext.onReady(function () {

    storeHorarioParada = Ext.create('Ext.data.JsonStore', {
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

    gridHorariosRutasParada = Ext.create('Ext.grid.Panel', {
        frame: true,
        width: '60%',
        title: '',
        store: storeRutaParadas,
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
                storeHorarioParada.load({
                    params: {
                        id_ruta: id_Ruta
                    }
                });
                dibujarRutaParadaMapa(id_Ruta);
            }}
    });

    gridStoreHorasParadas = Ext.create('Ext.grid.Panel', {
        region: 'center',
        frame: true,
        width: '40%',
        title: '',
        store: storeHorarioParada,
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

function showWinHorariosRutaParada() {
    if (!winShowHorariosRutasParada) {
        winShowHorariosRutasParada = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Rutas y Horarios por Paradas</div>',
            width: anchoInfo(),
            height: altoInfo(),
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridHorariosRutasParada,
                        gridStoreHorasParadas
                    ]
                }]
        });
    }
    winShowHorariosRutasParada.show();
}


function dibujarRutaParadaMapa(id_Ruta) {

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

