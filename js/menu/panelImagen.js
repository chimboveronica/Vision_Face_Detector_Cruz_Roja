var winInfoImagen;
var contenedorWinImagen;
function infoImagen(imagen) {
    if (!winInfoImagen) {
        contenedorWinImagen = Ext.create('Ext.form.Panel', {
            id: 'panel-infoImagen',
            padding: '5 5 5 5',
            items: [{
                    html: '<div id="efecto"><center> ' +
                            '<img src="' + imagen + '" width="' + anchoImg() + '" height="' + altoImg() + '">' +
                            '</div><p></center><center><div id="camposForm">' + direccion + '</div></center></p>'
                }]
        });
        winInfoImagen = Ext.create('Ext.window.Window', {
            resizable: false,
            width: anchoRoute(),
            height: altoRoute(),
            closeAction: "hide",
            items: [contenedorWinImagen],
            listeners: {
                close: function(panel, eOpts) {
                    spot.hide();
                    contenedorWinImagen.getForm().reset();
                    winInfoImagen.hide();
                }
            }
        });
        Ext.create('Ext.fx.Anim', {
            target: contenedorWinImagen,
            duration: 2000,
            from: {
                opacity: 0,
            },
            to: {
                opacity: 1
            }
        });
    }
    winInfoImagen.show();
}