var winAdminParada;
var formAdminParada;
var storeDataParada;
var recordSelectedParada;

Ext.onReady(function () {
    Ext.define('DataParadas', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idCamara', type: 'int'},
            {name: 'lon', type: 'number'},
            {name: 'lat', type: 'number'},
            {name: 'referencia', type: 'string'},
            {name: 'barrio', type: 'string'},
            {name: 'direccion', type: 'string'},
            {name: 'image', type: 'string'}
        ]
    });

    storeDataParada = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataParadas',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/station/read.php',
                create: 'php/admin/station/create.php',
                update: 'php/admin/station/update.php',
                destroy: 'php/admin/station/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'data',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    Ext.MessageBox.show({
                        title: 'ERROR',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
            write: function (store, operation, eOpts) {
                onResetParadas();
                if (operation.getRequest().getInitialConfig(['action']) === 'create') {
                    storeDataParada.reload();
                }
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });

    formAdminParada = Ext.create('Ext.form.Panel', {
        bodyPadding: 5,
        defaultType: 'textfield',
        fieldDefaults: {
            anchor: '100%'
        },
        items: [{
                name: 'image',
                hidden: true
            }, {
                name: 'direccion',
                hidden: true
            }, {
                xtype: 'combobox',
                fieldLabel: '<div id="camposForm">Dirección: ' + required + '</div>',
                labelSeparator: '',
                name: 'idCamara',
                store: storeDataParada,
                valueField: 'id',
                displayField: 'direccion',
                queryMode: 'local',
                vtype: 'direccion',
                allowBlank: false,
                allowOnlyWhitespace: false,
                blankText: 'Este campo es obligaorio',
                emptyText: 'Ingrese dirección...',
                maxLength: 150,
                listConfig: {
                    minWidth: 300
                },
                listeners: {
                    select: function (combo, record, eOpts) {
                        setActiveRecordsParadas(record);
                    },
                    change: function (thisObj, newValue, oldValue, eOpts) {
                        formAdminParada.down('[name=direccion]').setValue(newValue);
                    }
                }
            }, {
                xtype: 'form',
                items: [{
                        xtype: 'filefield',
                        name: 'imageFile',
                        emptyText: "Máximo 2MB",
                        fieldLabel: '<div id="camposForm">Foto:</div>',
                        labelSeparator: '',
                        buttonConfig: {
                            iconCls: 'icon-upload',
                            text: '',
                            tooltip: '<span class="tooltip">Escoger imagen</span>'
                        },
                        listeners: {
                            change: function (thisObj, value, eOpts) {
                                var form = this.up('form').getForm();
                                form.submit({
                                    url: 'php/upload/uploadParadas.php',
                                    success: function (form, action) {
                                        formAdminParada.down('[name=labelImage]').setSrc('img/datap/' + action.result.message);
                                        formAdminParada.down('[name=image]').setValue('img/datap/' + action.result.message);
                                        thisObj.setValue(action.result['img']);
                                    },
                                    failure: function (form, action) {
                                        Ext.Msg.alert('Error', action.result.message);
                                    }
                                });
                            }
                        }
                    }, {
                        xtype: 'image',
                        name: 'labelImage',
                        src: 'img/sin_img.png',
                        height: 120,
                        border: 2,
                        margin: '0 0 6 120',
                        anchor: '80%',
                        style: {
                            borderColor: '#157fcc',
                            borderStyle: 'solid'
                        }
                    }
                ]
            }, {
                fieldLabel: '<div id="camposForm">Referencia:</div>',
                name: 'referencia',
                vtype: 'direccion',
                labelSeparator: '',
                emptyText: 'Ingrese referencia',
                maxLength: 150
            }, {
                fieldLabel: '<div id="camposForm">Barrio:' + required + '</div>',
                name: 'barrio',
                vtype: 'direccion',
                labelSeparator: '',
                allowBlank: false,
                allowOnlyWhitespace: false,
                emptyText: 'Ingrese barrio',
                maxLength: 45
            }, {
                xtype: 'numberfield',
                id: 'latitud',
                fieldLabel: '<div id="camposForm">Latitud: ' + required + '</div>',
                name: 'lat',
                labelSeparator: '',
                allowBlank: false,
                allowOnlyWhitespace: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingrese latitud',
                decimalPrecision: 8
            }, {
                xtype: 'numberfield',
                fieldLabel: '<div id="camposForm">Longitud: ' + required + '</div>',
                name: 'lon',
                labelSeparator: '',
                id: 'longitud',
                allowBlank: false,
                allowOnlyWhitespace: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingrese longitud',
                decimalPrecision: 8
            }, {
                xtype: 'toolbar',
                items: ['->', {
                        xtype: 'button',
                        text: '<span class="btn-boton">Obtener posición</span>',
                        tooltip: '<span class="tooltip">Obtener posición a través de un "click", en el Mapa.</span>',
                        iconCls: 'icon-map',
                        handler: function () {
                            obtener = true;
                            obtenerLongLat();
                            winAdminParada.hide();
                        },
                        listeners: {
                            mouseover: function () {
                                this.setText('<span class="btn-menu-over">Obtener posición</span>');
                            },
                            mouseout: function () {
                                this.setText('<span class="btn-menu">Obtener posición</span>');
                            }
                        }
                    }
                ]
            }],
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                        tooltip: '<span class="tooltip">Mostrar Imagen</span>',
                        iconCls: 'icon-mostrar',
                        handler: function () {
                            procesoImagen(true);
                        }
                    }, {
                        tooltip: '<span class="tooltip">Ocultar Imagen</span>',
                        iconCls: 'icon-ocultar',
                        handler: function () {
                            procesoImagen(false);
                        }
                    }, '->', {
                        iconCls: 'icon-add',
                        itemId: 'create',
                        text: '<span class="btn-boton">Crear</span>',
                        scope: this,
                        tooltip: '<span class="tooltip">Crear Registro</span>',
                        handler: onCreateParadas,
                    }, {
                        iconCls: 'icon-updat',
                        itemId: 'update',
                        text: '<span class="btn-boton">Actualizar</span>',
                        scope: this,
                        tooltip: '<span class="tooltip">Actualizar Registro</span>',
                        handler: onUpdateParadas,
                    }, {
                        iconCls: 'icon-reset',
                        itemId: 'delete',
                        scope: this,
                        tooltip: '<span class="tooltip">Eliminar Registro</span>',
                        handler: onDeleteParadas
                    }, {
                        iconCls: 'limpiar',
                        tooltip: '<span class="tooltip">Limpiar Campos</span>',
                        scope: this,
                        handler: onResetParadas
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: '<span class="tooltip">Cancelar</span>',
                        scope: this,
                        handler: function () {
                            winAdminParada.hide();
                        }}
                ]
            }]
    });
});

function showWinAdminParadas() {
    if (!winAdminParada) {
        winAdminParada = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Administración de Camaras</div>',
            resizable: false,
            width: anchoParadas(),
            height: altoParadas(),
            closeAction: 'hide',
            plain: false,
            items: formAdminParada
        });
    }
    onResetParadas();
    winAdminParada.show();
}

function setActiveRecordsParadas(record) {
    recordSelectedParada = record;
    formAdminParada.getForm().loadRecord(record);
    formAdminParada.down('[name=image]').setValue(record.data.image);
    formAdminParada.down('[name=labelImage]').setSrc(record.data.image);
    formAdminParada.down('#update').enable();
    formAdminParada.down('#create').disable();
    formAdminParada.down('#delete').enable();
}

function onUpdateParadas() {
    var form = formAdminParada.getForm();
    if (form.isValid()) {
        form.updateRecord(formAdminParada.activeRecord);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateParadas() {
    var form = formAdminParada.getForm();
    if (form.isValid()) {
        storeDataParada.insert(0, form.getValues());
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetParadas() {
    formAdminParada.getForm().reset();
    formAdminParada.down('#update').disable();
    formAdminParada.down('#create').enable();
    formAdminParada.down('#delete').disable();
    formAdminParada.down('[name=image]').setValue('img/datap/sin_img.png');
    formAdminParada.down('[name=labelImage]').setSrc('img/datap/sin_img.png');
}

function onDeleteParadas() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar la parada', function (choice) {
        if (choice === 'yes') {
            storeDataParada.remove(recordSelectedParada);
        }
    });
}

function procesoImagen(estado) {
    Ext.create('Ext.form.Panel').getForm().submit({
        url: 'php/admin/station/mostrarImagen.php',
        params: {
            state: estado
        },
        success: function (form, action) {
            Ext.Msg.alert('Información', action.result.message);
        },
        failure: function (form, action) {
            Ext.Msg.alert('Información', action.result.message);
        }
    });
}