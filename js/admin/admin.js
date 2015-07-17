var winAdminUser;
var formAdminUser;
var storeDataUser;
var recordSelectedUser;

Ext.onReady(function () {
    Ext.define('DataUser', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idUsuario', type: 'int'},
            {name: 'usuario', type: 'string'},
            {name: 'idPersona', type: 'string'},
            {name: 'persona', type: 'string'},
            {name: 'clave', type: 'string'}
        ]
    });

    storeDataUser = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataUser',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/user/read.php',
                create: 'php/admin/user/create.php',
                update: 'php/admin/user/update.php',
                destroy: 'php/admin/user/destroy.php'
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
                onResetUser();
                if (operation.getRequest().getInitialConfig(['action']) === 'create') {
                    storeDataUser.reload();
                }
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });

    formAdminUser = Ext.create('Ext.form.Panel', {
        bodyPadding: 5,
        defaultType: 'textfield',
        fieldDefaults: {
            anchor: '100%'
        },
        items: [{
                name: 'correo',
                hidden: true
            }, {
                xtype: 'combobox',
                fieldLabel: '<div id="camposForm">Correo: ' + required + '</div>',
                name: 'idUsuario',
                store: storeDataUser,
                allowBlank: false,
                vtype: 'emailNuevo',
                valueField: 'id',
                displayField: 'correo',
                queryMode: 'local',
                labelSeparator: '',
                allowOnlyWhitespace: false,
                blankText: 'Este campo es obligaorio',
                emptyText: 'Ingresar Correo...',
                listeners: {
                    select: function (combo, record, eOpts) {
                        setActiveRecordUser(record);
                    },
                    change: function (thisObj, newValue, oldValue, eOpts) {
                        formAdminUser.down('[name=correo]').setValue(newValue);
                    }
                }
            }, {
                fieldLabel: '<div id="camposForm">Nombres: ' + required + '</div>',
                labelSeparator: '',
                allowBlank: false,
                vtype: 'nombresApe',
                name: 'nombres',
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingresar Nombres...',
                maxLength: 45
            }, {
                fieldLabel: '<div id="camposForm">Apellidos: ' + required + '</div>',
                name: 'apellidos',
                vtype: 'nombresApe',
                allowBlank: false,
                labelSeparator: '',
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingresar Apellidos...',
                maxLength: 45
            }, {
                fieldLabel: '<div id="camposForm">Usuario: ' + required + '</div>',
                name: 'usuario',
                vtype: 'alphanum',
                allowBlank: false,
                allowOnlyWhitespace: false,
                labelSeparator: '',
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingresar Usuario...'
            }, {
                fieldLabel: '<div id="camposForm">Contraseña: ' + required + '</div>',
                blankText: 'Este campo es Obligatorio',
                name: 'clave',
                allowBlank: false,
                itemId: 'pass',
                labelSeparator: '',
                inputType: 'password',
                emptyText: 'Ingresar Contraseña...'
            }, {
                fieldLabel: '<div id="camposForm">Confirmar Contraseña: ' + required + '</div>',
                blankText: 'Este campo es Obligatorio',
                name: 'clave',
                allowBlank: false,
                labelSeparator: '',
                inputType: 'password',
                emptyText: 'Confirmar Contraseña...',
                vtype: 'password',
                initialPassField: 'pass'
            }],
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-add',
                        itemId: 'create',
                        text: '<span class="btn-boton">Crear</span>',
                        scope: this,
                        tooltip: '<span class="tooltip">Crear Registro</span>',
                        handler: onCreateUser,
                    }, {
                        iconCls: 'icon-updat',
                        itemId: 'update',
                        text: '<span class="btn-boton">Actualizar</span>',
                        scope: this,
                        tooltip: '<span class="tooltip">Actualizar Registro</span>',
                        handler: onUpdateUser,
                    }, {
                        iconCls: 'icon-reset',
                        itemId: 'delete',
                        scope: this,
                        tooltip: '<span class="tooltip">Eliminar Registro</span>',
                        handler: onDeleteUser
                    }, {
                        iconCls: 'limpiar',
                        tooltip: '<span class="tooltip">Limpiar Campos</span>',
                        scope: this,
                        handler: onResetUser
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: '<span class="tooltip">Cancelar</span>',
                        scope: this,
                        handler: function () {
                            winAdminUser.hide();
                        }}
                ]
            }]
    });
});

function showWinAdminPerson() {
    if (!winAdminUser) {
        winAdminUser = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Administración de Usuarios</div>',
            resizable: false,
            width: anchoEdicionUsuario(),
            height: altoEdicionUsuario(),
            closeAction: 'hide',
            plain: false,
            items: formAdminUser
        });
    }
    onResetUser();
    winAdminUser.show();
}

function setActiveRecordUser(record) {
    recordSelectedUser = record;
    formAdminUser.getForm().loadRecord(record);
    formAdminUser.down('#update').enable();
    formAdminUser.down('#create').disable();
    formAdminUser.down('#delete').enable();
}

function onUpdateUser() {
    var form = formAdminUser.getForm();
    if (form.isValid()) {
        form.updateRecord(formAdminUser.activeRecord);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateUser() {
    var form = formAdminUser.getForm();
    if (form.isValid()) {
        storeDataUser.insert(0, form.getValues());
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetUser() {
    formAdminUser.getForm().reset();
    formAdminUser.down('#update').disable();
    formAdminUser.down('#create').enable();
    formAdminUser.down('#delete').disable();
}

function onDeleteUser() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el usuario', function (choice) {
        if (choice === 'yes') {
            storeDataUser.remove(recordSelectedUser);
        }
    });
}