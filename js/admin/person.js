var winAdminPerson;
var formAdminPerson;
var storeDataPerson;
var recordSelectedPerson;
var currentDate = new Date();
Ext.onReady(function () {
    Ext.define('DataPerson', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idPersona', type: 'int'},
            {name: 'cedula', type: 'string'},
            {name: 'nombres', type: 'string'},
            {name: 'apellidos', type: 'string'},
            {name: 'celular', type: 'string'},
            {name: 'fecha_nacimiento'},
            {name: 'edad', type: 'int'},
            {name: 'genero', type: 'string'},
            {name: 'direccion', type: 'string'},
            {name: 'correo', type: 'string'}
        ]
    });

    storeDataPerson = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataPerson',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/person/read.php',
                create: 'php/admin/person/create.php',
                update: 'php/admin/person/update.php',
                destroy: 'php/admin/person/destroy.php'
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
                onResetPerson();
                if (operation.getRequest().getInitialConfig(['action']) === 'create') {
                    storeDataPerson.reload();
                }
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });
    var tipos = Ext.create('Ext.data.Store', {
        fields: ['genero', 'text'],
        data: [
            {genero: "F", text: 'Femenino'},
            {genero: "M", text: 'Masculino'}

        ]
    });
    var dateAdultPerson = Ext.Date.subtract(currentDate, Ext.Date.YEAR, 18);
    formAdminPerson = Ext.create('Ext.form.Panel', {
        bodyPadding: 5,
        defaultType: 'textfield',
        fieldDefaults: {
            anchor: '100%'
        },
        items: [{
                name: 'cedula',
                hidden: true
            }, {
                xtype: 'combobox',
                fieldLabel: '<div id="camposForm">Cedula: ' + required + '</div>',
                name: 'idPersona',
                store: storeDataPerson,
                allowBlank: false,
                vtype: 'cedulaValida',
                valueField: 'id',
                displayField: 'cedula',
                queryMode: 'local',
                labelSeparator: '',
                allowOnlyWhitespace: false,
                blankText: 'Este campo es obligaorio',
                emptyText: 'Ingresar Cedula...',
                listeners: {
                    select: function (combo, record, eOpts) {
                        setActiveRecordPerson(record);
                    },
                    change: function (thisObj, newValue, oldValue, eOpts) {
                        formAdminPerson.down('[name=cedula]').setValue(newValue);
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
                fieldLabel: '<div id="camposForm">Celular: ' + required + '</div>',
                name: 'celular',
                vtype: 'numeroTelefono',
                allowBlank: false,
                allowOnlyWhitespace: false,
                labelSeparator: '',
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingresar Celular...'
            }, {
                fieldLabel: '<div id="camposForm">Correo: ' + required + '</div>',
                name: 'correo',
                vtype: 'emailNuevo',
                allowBlank: false,
                allowOnlyWhitespace: false,
                labelSeparator: '',
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingresar Correo...'
            }, {
                xtype: 'combobox',
                fieldLabel: '<div id="camposForm">Genero: ' + required + '</div>',
                name: 'genero',
                labelSeparator: '',
                width: 300,
                allowBlank: false,
                allowOnlyWhitespace: false,
                store: tipos,
                editable: false,
                valueField: 'genero',
                displayField: 'text', queryMode: 'local',
                blankText: 'Este campo es obligaorio',
                emptyText: 'Seleccionar genero'
            },
            {
                xtype: 'datefield',
                fieldLabel: '<div id="camposForm">Fecha de Nacimiento: ' + required + '</div>',
                allowBlank: false,
                labelSeparator: '',
                allowOnlyWhitespace: false,
                format: 'Y-m-d',
                editable: false,
                value: dateAdultPerson,
                maxValue: dateAdultPerson,
                name: 'fecha_nacimiento',
                emptyText: 'Ingresar Fecha...'
            },
              {
                id: 'edad',
                xtype: 'numberfield',
                 allowBlank: false,
                labelSeparator: '',
                allowOnlyWhitespace: false,
                fieldLabel: '<div id="camposForm">Edad: ' + required + '</div>',
                name: 'edad',
                minValue: 18
            },
            {
                fieldLabel: '<div id="camposForm">Dirección: ' + required + '</div>',
                name: 'direccion',
                vtype: 'direccion',
                allowBlank: false,
                allowOnlyWhitespace: false,
                labelSeparator: '',
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingresar Dirección...'
            }

        ],
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
                        handler: onCreatePerson,
                    }, {
                        iconCls: 'icon-updat',
                        itemId: 'update',
                        text: '<span class="btn-boton">Actualizar</span>',
                        scope: this,
                        tooltip: '<span class="tooltip">Actualizar Registro</span>',
                        handler: onUpdatePerson,
                    }, {
                        iconCls: 'icon-reset',
                        itemId: 'delete',
                        scope: this,
                        tooltip: '<span class="tooltip">Eliminar Registro</span>',
                        handler: onDeletePerson
                    }, {
                        iconCls: 'limpiar',
                        tooltip: '<span class="tooltip">Limpiar Campos</span>',
                        scope: this,
                        handler: onResetPerson
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: '<span class="tooltip">Cancelar</span>',
                        scope: this,
                        handler: function () {
                            winAdminPerson.hide();
                        }}
                ]
            }]
    });
});

function showWinAdminPerson() {
    if (!winAdminPerson) {
        winAdminPerson = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Administración de Personas</div>',
            resizable: false,
            width: anchoEdicionPersona(),
            height: altoEdicionPersona(),
            closeAction: 'hide',
            plain: false,
            items: formAdminPerson
        });
    }
    onResetPerson();
    winAdminPerson.show();
}

function setActiveRecordPerson(record) {
    recordSelectedPerson = record;
    formAdminPerson.getForm().loadRecord(record);
    formAdminPerson.down('#update').enable();
    formAdminPerson.down('#create').disable();
    formAdminPerson.down('#delete').enable();
}

function onUpdatePerson() {
    var form = formAdminPerson.getForm();
    if (form.isValid()) {
        form.updateRecord(formAdminPerson.activeRecord);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreatePerson() {
    var form = formAdminPerson.getForm();
    if (form.isValid()) {
        storeDataPerson.insert(0, form.getValues());
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetPerson() {
    formAdminPerson.getForm().reset();
    formAdminPerson.down('#update').disable();
    formAdminPerson.down('#create').enable();
    formAdminPerson.down('#delete').disable();
}

function onDeletePerson() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el usuario', function (choice) {
        if (choice === 'yes') {
            storeDataPerson.remove(recordSelectedPerson);
        }
    });
}