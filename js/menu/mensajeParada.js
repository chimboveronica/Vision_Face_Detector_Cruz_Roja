var winInfoParada;

function showParadaCercana() {
    if (!winInfoParada) {
        winInfoParada = Ext.create('Ext.window.Window', {
            layout: "fit",
            title: "<div id='titulosForm'><b>Información</div>",
            resizable: false,
            width: anchoSesion(),
            height: altoSesion(),
            closeAction: "hide",
            plain: true,
            items: [{
                    items: [{
                            html: '<div id="efecto"><b><center> ' +
                                    '<img src="img/mapa1.PNG" height="100"  width="300">' +
                                    '</div>'
                        }],
                    buttonAlign: "center",
                    buttons: [{
                            text: '<span class="btn-menu">OK</span>',
                            handler: function() {
                                winInfoParada.hide();
                                limpiarMapa();
                                obtenerLongLatParadas();
                            },
                            listeners: {
                                mouseover: function() {
                                    this.setText('<span class="btn-menu-over">OK</span>');
                                },
                                mouseout: function() {
                                    this.setText('<span class="btn-menu">OK</span>');
                                }
                            }
                        }]
                }]
        });
    }
    winInfoParada.show();
}