var winParadasCercanas;
var gridParadas;
var storeGridParadas;

Ext.onReady(function () {
    storeGridParadas = Ext.create('Ext.data.Store', {
        fields: [
            {name: 'idParada', type: 'int'},
            {name: 'latitudParada', type: 'number'},
            {name: 'longitudParada', type: 'number'},
            {name: 'direccionParada', type: 'string'},
            {name: 'rumboParada', type: 'string'},
            {name: 'imagenParada', type: 'string'},
            {name: 'distanciaParada', type: 'number'},
            {name: 'imagenVisibleParada', type: 'int'}
        ],
        proxy: {
            type: 'memory'
        },
        sorters: [{
                property: 'start',
                direction: 'ASC'
            }]
    });

    gridParadas = Ext.create('Ext.grid.Panel', {
        store: storeGridParadas,
        region: 'center',
        plugins: 'gridfilters',
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: false
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<div id="titulos">Nº</div>', width: 40, align: 'center'}),
            {text: '<div id="titulos">Dirección</div>', width: 300, dataIndex: 'direccionParada', align: 'center', filter: true},
            {text: '<div id="titulos">Distancia (m)</div>', width: 100, dataIndex: 'distanciaParada', align: 'center', filter: true}
        ],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                if (selected.length > 0) {
                    limpiarMapa();
                    var latLon = new google.maps.LatLng(selected[0].data.latitudParada, selected[0].data.longitudParada);
                    zoomUbicar(selected[0].data.latitudParada, selected[0].data.longitudParada);
                    addMarkerParadas(latLon, selected[0].data.imagenParada, selected[0].data.direccionParada, selected[0].data.rumboParada, selected[0].data.imagenVisibleParada);
                }
            }
        }
    });

});

function showWinParadasCercanas(records) {
    if (!winParadasCercanas) {
        winParadasCercanas = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Información de Paradas</div>',
            plain: false,
            width: anchoInfo(),
            height: altoInfo(),
            closeAction: 'hide',
            items: gridParadas
        });
    }
    storeGridParadas.loadData(records);
    winParadasCercanas.show();
}