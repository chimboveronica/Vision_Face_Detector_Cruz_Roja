/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var winAdminSector;
var formAdminSector;

Ext.onReady(function() {
    Ext.define('DataSector', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idSector', type: 'int'},
            {name: 'nameSector', type: 'int'},
            {name: 'dimensionSector', type: 'int'},
            {name: 'comentarioSector', type: 'string'},
            {name: 'latitudSector', type: 'string'},
            {name: 'longituddSector', type: 'string'},
            {name: 'linealSector', type: 'int'},
            {name: 'imagenSector', type: 'string'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        //autoLoad: true,
        //autoSync: true,
        model: 'DataSector',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/Sector/read.php',
                create: 'php/admin/Sector/create.php',
                update: 'php/admin/Sector/update.php',
                destroy: 'php/admin/Sector/destroy.php'
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
                exception: function(proxy, response, operation) {
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
            write: function(store, operation, eOpts) {
                onResetSector();
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });

    formAdminSector = Ext.create('Ext.form.Panel', {
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
        items: [{
                fieldLabel: 'Nombre',
                afterLabelTextTpl: required,
                id: 'tipeSector',
                name: 'tipeSector',
                forceSelection: true,
                //store: storePerson,
                valueField: 'id',
                displayField: 'textDocument',
                queryMode: 'local',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Seleccionar Opción...',
                listConfig: {
                    minWidth: 320
                }
            }, {
                xtype: 'numberfield',
                fieldLabel: 'Area',
                afterLabelTextTpl: required,
                name: 'dimensionSector',
                //store: storeRolSector,
                valueField: 'id',
                displayField: 'text',
                queryMode: 'local',
                allowBlank: false,
                editable: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingrese la dimensión del muro'
            }, {
                xtype: 'toolbar',
                items: ['->', {
                        xtype: 'button',
                        text: 'Dibujar Area en el Mapa',
                        tooltip: 'Obtener Area dibujando, en el Mapa.',
                        iconCls: 'icon-map',
                        handler: function() {
                            if (connectionMap()) {
                                winAdminPoint.hide();
                                positionPoint = true;
                            }
                        }
                    }]
            }],
        listeners: {
            create: function(form, data) {
                gridStore.insert(0, data);
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateSector
                    }, {
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetSector
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        handler: function() {
                            winAdminSector.hide();
                        }
                    }]
            }]
    });
});

function showWinAdminSector() {
    if (!winAdminSector) {
        winAdminSector = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administracion de Sectores',
            resizable: false,
            width: 400,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [formAdminSector]
        });
    }
    onResetSector();
    winAdminSector.show();
}

function setActiveRecordSector(record) {
    formAdminSector.activeRecord = record;
    formAdminSector.down('#update').enable();
    formAdminSector.down('#create').disable();
    formAdminSector.getForm().loadRecord(record);
}

function onUpdateSector() {
    var active = formAdminSector.activeRecord,
            form = formAdminSector.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateSector() {
    var form = formAdminSector.getForm();
    if (form.isValid()) {
        formAdminSector.fireEvent('create', formAdminSector, form.getValues());
        formAdminSector.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetSector() {
    formAdminSector.getForm().reset();
}