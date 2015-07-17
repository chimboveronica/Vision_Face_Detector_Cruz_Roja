var panel1;
var winusuario;
Ext.onReady(function() {
    panel1 = Ext.create('Ext.form.Panel', {
        items: [
            {xtype: 'form',
                padding: '10 10 10 10',
                items: [
                    {
                        xtype: 'fieldset',
                        title: '<b><div id="titulos">Ingresar</b></div>',
                        items: [{
                                fieldLabel: '<FONT FACE="Gotham Medium" SIZE=3 COLOR="BLUE">Usuario</FONT>',
                                xtype: 'textfield',
                                afterLabelTextTpl: required,
                                name: 'us',
                                emptyText: 'Ingresar Usuario',
                                allowBlank: false,
                                listeners: {
                                    specialkey: function(field, e) {
                                        if (e.getKey() == e.ENTER) {
                                            var form = field.up('form').getForm();
                                            form.submit();
                                        }
                                    }
                                }},
                            {
                                xtype: 'textfield',
                                fieldLabel: '<FONT FACE="Gotham Medium" SIZE=3 COLOR="BLUE">Contraseña</FONT>',
                                afterLabelTextTpl: required,
                                name: 'ps',
                                inputType: 'password',
                                initialPassField: 'pass',
                                emptyText: 'Ingrese Contraseña',
                                allowBlank: false,
                                listeners: {
                                    specialkey: function(field, e) {
                                        if (e.getKey() == e.ENTER) {
                                            validar();
                                        }
                                    }
                                }
                            }]}
                ]}],
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-sesion',
                        itemId: 'update',
                        text: '<div id="botonesMenuForm">Ingresar</div>',
                        tooltip: '<div id="tooltip">Ingresar</div>',
                        handler: function() {
                            validar();
                        }

                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: '<div id="tooltip">Cancelar</div>',
                        text: '<div id="botonesMenuForm">Cancelar</div>',
                        handler: function() {
                            winusuario.hide();
                        }
                    }]
            }]
    });
});

function ventanaLogeo() {
    if (!winusuario) {
        winusuario = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Acceso al Sistema</div>',
            icon: 'img/user.gif',
            resizable: false,
            width: anchoSesion(),
            height: altoSesion(),
            closeAction: 'hide',
            items: [panel1]
        });
    }
    panel1.getForm().reset();
    winusuario.show();
}
function validar() {

    var form = panel1.getForm();
    if (form.isValid()) {
        form.submit({
            url: 'php/login/login.php',
            waitMsg: 'Comprobando Datos...',
            success: function(form, action) {
                location.href = 'index_admin.php';
            },
            failure: function(form, action) {
                Ext.example.msg("Mensaje", 'Usuario Incorrecto');
            }
        });
    }
}