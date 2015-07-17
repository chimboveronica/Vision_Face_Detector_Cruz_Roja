/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var winAdminCategory;
var formAdminCategory;

Ext.onReady(function() {
    Ext.define('DataCategory', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idCategory', type: 'int'},
            {name: 'nameCategory', type: 'int'},
            {name: 'dimensionCategory', type: 'int'}
            
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        //autoLoad: true,
        //autoSync: true,
        model: 'DataCategory',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/Category/read.php',
                create: 'php/admin/Category/create.php',
                update: 'php/admin/Category/update.php',
                destroy: 'php/admin/Category/destroy.php'
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
                onResetCategory();
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });

    formAdminCategory = Ext.create('Ext.form.Panel', {
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
                id: 'tipeCategory',
                name: 'tipeCategory',
                forceSelection: true,
                //store: storePerson,
                valueField: 'id',
                displayField: 'textDocument',
                queryMode: 'local',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Nombre de la Categoria',
                listConfig: {
                    minWidth: 320
                }
            }, {
                xtype: 'textareafield',
                fieldLabel: 'Descripción',
                afterLabelTextTpl: required,
                name: 'dimensionCategory',
                //store: storeRolCategory,
                valueField: 'id',
                displayField: 'text',
                queryMode: 'local',
                allowBlank: false,
                editable: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Describa brevemente la categoria'
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
                        handler: onCreateCategory
                    }, {
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetCategory
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        handler: function() {
                            winAdminCategory.hide();
                        }
                    }]
            }]
    });
});

function showWinAdminCategory() {
    if (!winAdminCategory) {
        winAdminCategory = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administracion de Categorias',
            resizable: false,
            width: 400,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [formAdminCategory]
        });
    }
    onResetCategory();
    winAdminCategory.show();
}

function setActiveRecordCategory(record) {
    formAdminCategory.activeRecord = record;
    formAdminCategory.down('#update').enable();
    formAdminCategory.down('#create').disable();
    formAdminCategory.getForm().loadRecord(record);
}

function onUpdateCategory() {
    var active = formAdminCategory.activeRecord,
            form = formAdminCategory.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateCategory() {
    var form = formAdminCategory.getForm();
    if (form.isValid()) {
        formAdminCategory.fireEvent('create', formAdminCategory, form.getValues());
        formAdminCategory.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetCategory() {
    formAdminCategory.getForm().reset();
}