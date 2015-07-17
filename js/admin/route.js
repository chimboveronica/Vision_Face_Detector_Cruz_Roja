var winAdminRoute;
var formAdminRoute;
var gridAdminRoute;
var gridStore;
var datos;
var paradasAsignadas = [];
var dibujar = true;
var idRuta;
var gridHoras;
var dataPrueba = [];
var formAdminhoras;
var grid;
var winAdminHoras;
var storeHoras;
var aux = ',';
var recordSelectRoute;
Ext.onReady(function () {

    Ext.define('DataRoute', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idRoute', type: 'int'},
            {name: 'nombreRoute', type: 'string'},
            {name: 'tipoRoute', type: 'string'},
            {name: 'verticesRoute', type: 'string'},
            {name: 'coordenadas', type: 'string'},
            {name: 'paradas', type: 'string'},
            {name: 'horaRoutes', type: 'string'}
        ]
    });
    gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataRoute',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/route/read.php',
                create: 'php/admin/route/create.php',
                update: 'php/admin/route/update.php',
                destroy: 'php/admin/route/destroy.php'
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
                onResetRoute();
                if (operation.getRequest().getInitialConfig(['action']) === 'create') {
                    gridStore.reload();
                    storeHoras.removeAll();
                    limpiarMapa();
                    removeLine();
                    dibujar = true;
                    Ext.getCmp('btn-eliminar').disable();
                    winAdminHoras.hide();
                }
                Ext.example.msg("Mensaje", operation._resultSet.message);

            }
        }
    });
    var tipos = Ext.create('Ext.data.Store', {
        fields: ['tipo', 'text'],
        data: [
            {tipo: "R", text: 'Sube'},
            {tipo: "B", text: 'Baja'},
            {tipo: "RB", text: 'Sube y Baja'}
        ]
    });
    formAdminRoute = Ext.create('Ext.form.Panel', {
        region: 'center',
        width: '100%',
        bodyPadding: '10 10 10 10',
        items: [{
                fieldLabel: '<FONT FACE="Gotham Medium" SIZE=3 COLOR="BLUE">Coordenadas</FONT>',
                xtype: 'textfield',
                name: 'coordenadas',
                id: 'coordenadas',
                itemId: 'coordenadas',
                hidden: true
            }, {
                fieldLabel: 'listEvt',
                xtype: 'textfield',
                name: 'paradas',
                id: 'paradas',
                itemId: 'paradas',
                hidden: true
            },
            {
                xtype: 'textfield',
                name: 'nombreRoute',
                hidden: true
            }, {
                xtype: 'combobox',
                fieldLabel: '<div id="camposForm">Ruta: ' + required + '</div>',
                name: 'idRoute',
                labelSeparator: '',
                width: 400,
                allowOnlyWhitespace: false,
                store: gridStore,
                valueField: 'id',
                displayField: 'nombreRoute',
                queryMode: 'local',
                blankText: 'Este campo es obligaorio',
                emptyText: 'Ingrese nombre de ruta',
                listeners: {
                    select: function (combo, record, eOpts) {
                        //para cargar datos en el eform
                        setActiveRecordsRoute(record);
                    },
                    change: function (thisObj, newValue, oldValue, eOpts) {
                        formAdminRoute.down('[name=nombreRoute]').setValue(newValue);
                    }
                }
            }, {
                xtype: 'combobox',
                fieldLabel: '<div id="camposForm">Tipo: ' + required + '</div>',
                name: 'tipoRoute',
                labelSeparator: '',
                width: 300,
                allowBlank: false,
                allowOnlyWhitespace: false,
                store: tipos,
                editable: false,
                valueField: 'tipo',
                displayField: 'text', queryMode: 'local',
                blankText: 'Este campo es obligaorio',
                emptyText: 'Seleccionar tipo de ruta'
            },
            {
                xtype: 'panel',
                layout: 'hbox',
                items: [{
                        id: 'selector',
                        xtype: 'textfield',
                        fieldLabel: '<div id="camposForm">Cant. Puntos: ' + required + '</div>',
                        labelSeparator: '',
                        editable: false,
                        blankText: 'Este campo es obligaorio',
                        name: 'countPointsRoute',
                        emptyText: 'Cant. Puntos',
                        width: 250
                    }, {
                        id: 'btn-draw-edit-route',
                        iconCls: 'icon-trazar',
                        xtype: 'button',
                        value: 0,
                        handler: function () {
                            //para dibujar ruta y modificar
                            if (dibujar) {
                                dibujarRuta();
                                winAdminRoute.hide();
                            } else {
                                limpiarMapa();
                                removeLine();
                                editarRuta(datos);
                                finishDrawRoute.show();
                                winAdminRoute.hide();
                            }
                        }
                    },
                    {
                        id: 'btn-eliminar',
                        iconCls: 'icon-reset ',
                        xtype: 'button',
                        tooltip: 'Eliminar ruta',
                        disabled: true,
                        handler: function () {
                            Ext.MessageBox.confirm('Atención!', 'Desea eliminar trazado de ruta', function (choice) {
                                if (choice === 'yes') {
                                    //eliminar ruta trazada
                                    removeLine();
                                    Ext.getCmp('selector').reset();
                                    Ext.getCmp('btn-eliminar').disable();
                                    Ext.getCmp('coordenadas').setValue('');
                                    //habilito la opcion dibujar
                                    dibujar = true;
                                    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-trazar");
                                    coordenadas = ',';
                                }
                            });

                        }
                    }]
            }, {
                xtype: 'textfield',
                name: 'horaRoutes',
                id: 'horaRoutes',
                hidden: true
            }, {
                id: 'agregar',
                margin: '0 0 10 0',
                text: '<span class="btn-boton">Asignar Horario</span>', iconCls: 'icon-horario',
                tooltip: '<span class="tooltip">Asignar Horario</span>',
                xtype: 'button',
                handler: function () {
                    winAdminHoras.show();
                }
            }
            , {
                xtype: 'fieldset',
                title: '<b><div id="camposForm">Paradas Asociadas</b></div>',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'itemselector',
                        name: 'listEvt',
                        id: 'listEvt',
                        height: 180,
                        store: storeParadasTotales,
                        displayField: 'direccion',
                        valueField: 'id',
                        value: paradasAsignadas,
                        msgTarget: 'side',
                        fromTitle: '<div id="titulosForm">Paradas</div>',
                        toTitle: '<div id="titulosForm">Paradas en Ruta</div>'}
                ]
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
                        tooltip: '<span class="tooltip">Crear Ruta</span>',
                        handler: onCreateRoute,
                    }, {
                        iconCls: 'icon-updat',
                        itemId: 'update',
                        text: '<span class="btn-boton">Actualizar</span>',
                        scope: this,
                        tooltip: '<span class="tooltip">Actualizar Datos</span>',
                        handler: onUpdateRoute,
                    }, {
                        iconCls: 'icon-reset',
                        itemId: 'delete',
                        text: '<span class="btn-boton">Eliminar</span>',
                        scope: this,
                        tooltip: '<span class="tooltip">Eliminar Ruta</span>', handler: onDeleteRoute,
                    }, {
                        iconCls: 'limpiar', text: '<span class="btn-menu">Limpiar</span>',
                        tooltip: '<span class="tooltip">Limpiar Campos</span>',
                        scope: this,
                        handler: onResetRoute,
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: '<span class="tooltip">Cancelar</span>',
                        scope: this,
                        handler: function () {
                            winAdminRoute.hide();
                        }
                    }]
            }]
    });
});
function showWinAdminRoute() {
    if (!winAdminRoute) {
        winAdminRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<div id="titulosForm">Administración de Rutas</div>',
            resizable: false,
            width: anchoRoute(),
            height: altoRoute(),
            closeAction: 'hide',
            plain: false,
            items: formAdminRoute
        });
    }
    onResetRoute();
    winAdminRoute.show();
    limpiarMapa();
    formAdminRoute.down('#update').disable();


}
//Tabla de horarios
Ext.define('Employee', {
    extend: 'Ext.data.Model',
    fields: [{name: 'text', type: 'date', dateFormat: 'H:i:s'}
    ]
});
storeHoras = Ext.create('Ext.data.Store', {// destroy the store if the grid is destroyed
    autoDestroy: true,
    model: 'Employee',
    proxy: {
        type: 'memory'
    },
    data: dataPrueba,
    sorters: [{
            property: 'start',
            direction: 'ASC'}]
});
var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToMoveEditor: 1,
    autoCancel: false,
    listeners: {
        edit: function (editor, context, eOpts) {
            storeHoras.commitChanges();
        }}
});
grid = Ext.create('Ext.grid.Panel', {
    store: storeHoras,
    name: 'Horario',
    columns: [
        {header: '<center><b>Hora</b><center>', xtype: 'datecolumn', dataIndex: 'text', flex: 1, format: 'H:i:s',
            editor: {
                xtype: 'timefield',
                allowBlank: false,
                name: 'text',
                labelSeparator: '',
                format: 'H:i:s',
                minValue: '07:00:00', maxValue: '23:59:59',
                increment: 30,
                invalidText: 'El formato de la hora no es válido'

            }}
    ],
    width: 100,
    height: 300,
    tbar: [{
            text: '<b>Agregar</b>',
            iconCls: 'icon-telAdd',
            handler: function () {
                rowEditing.cancelEdit();
                var r = Ext.create('Employee', {
                    text: '07:00:00'
                });
                storeHoras.insert(0, r);
                rowEditing.startEdit(0, 0);
            }
        }, {
            itemId: 'removeEmployee',
            text: '<b>Remover</b>',
            iconCls: 'icon-telRemove',
            handler: function () {
                var sm = grid.getSelectionModel();
                rowEditing.cancelEdit();
                storeHoras.remove(sm.getSelection());
                if (storeHoras.getCount() > 0) {
                    sm.select(0);
                }
            },
            disabled: true
        }],
    plugins: [rowEditing],
    listeners: {
        'selectionchange': function (view, records) {
            grid.down('#removeEmployee').setDisabled(!records.length);
        }
    }
});
formAdminhoras = Ext.create('Ext.form.Panel', {
    region: 'center',
    autoScroll: true, activeRecord: null,
    bodyPadding: '0 0 0 0',
    width: 250,
    height: 350,
    defaults: {
        xtype: 'fieldset',
        anchor: '100%',
        layout: 'anchor',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        }
    }, items: [
        grid
    ]
});

winAdminHoras = Ext.create('Ext.window.Window', {
    layout: 'fit',
    title: '<div id="titulosForm">Administración de Horarios</div>', resizable: false,
    width: 260,
    height: 390,
    closeAction: 'hide',
    plain: false,
    items: formAdminhoras
});


//operaciones
function setActiveRecordsRoute(record) {
    recordSelectRoute = record;
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-updat");
    formAdminRoute.down('#update').enable();
    formAdminRoute.down('#create').disable();
    formAdminRoute.down('#delete').enable();
    formAdminRoute.down('#btn-eliminar').enable();
    formAdminRoute.getForm().loadRecord(record);
    idRuta = record.data.idRoute;
    //para limpiar datos del store de horas
    storeHoras.removeAll();
    while (dataPrueba.length > 0)
    {
        dataPrueba.pop();
    }
    //llenar datos del seleccionado
    var data = record.data.horaRoutes.split(',');
    for (var i = 0; i < data.length; i++) {
        if (data[i] !== '') {
            dataPrueba.push({
                text: data[i]
            });
        }
    }
    storeHoras.setData(dataPrueba);
    storeHoras.reload();
    //para paradas
    storeParadasAsignadas.load({
        params: {
            tipo: record.data.tipoRoute,
            id_ruta: record.data.idRoute
        }
    });
    storeParadasAsignadas.reload();
    //para obtener coordenadas de la ruta seleccionada
    if (record.data.tipoRoute !== null) {
        limpiarMapa();
        removeLine();
        var form = formAdminRoute.getForm();
        if (form.isValid()) {
            form.submit({
                url: 'php/getCordenadas.php',
                waitTitle: 'Procesando...',
                waitMsg: 'Obteniendo Información',
                params: {
                    id_Ruta: record.data.idRoute
                },
                success: function (form, action) {
                    //limpiar datos de paradas
                    Ext.getCmp('selector').reset();
                    //desabilitar la opcion dibujar
                    dibujar = false;
                    //dibujar ruta seleccionada
                    calcRoute(action.result.data);
                    Ext.example.msg("<center>Mensaje</center>", '<center>Ruta Graficada</center>');
                    datos = action.result.data;
                    //colocar la cantidad de puntos de la ruta
                    Ext.getCmp('selector').setValue(action.result.data.length);
                    formAdminRoute.down('[name=countPointsRoute]').setValue(action.result.data.length);
                    //optener paradas
                    form.submit({
                        url: 'php/getParadasRutas.php',
                        method: 'POST',
                        params: {
                            tipo: record.data.tipoRoute,
                            id_ruta: record.data.idRoute
                        },
                        success: function (form, action) {
                            //dibujar paradas y asignar en el selector
                            paradasRutas(action.result.data);
                            for (var i = 0; i < action.result.data.length; i++) {
                                paradasAsignadas[i] = action.result.data[i].id;
                            }
                            Ext.getCmp('paradas').setValue(paradasAsignadas);
                            Ext.getCmp('listEvt').setValue(paradasAsignadas);
                        },
                        failure: function (form, action) {
                        }
                    });
                },
                failure: function (form, action) {
                }
            });
            //asigar vacios en seleccionado
            paradasAsignadas = [];
            Ext.getCmp('listEvt').setValue(paradasAsignadas);
        }
    }
}

function onUpdateRoute() {
    //para optener horarios
    var form = formAdminRoute.getForm();
    aux = ',';
    for (var i = 0; i < storeHoras.data.length; i++) {
        aux = aux + Ext.Date.format(storeHoras.getAt(i).data.text, 'H:i:s') + ',';
    }
    formAdminRoute.down('#horaRoutes').setValue(aux);
    var d = Ext.getCmp('listEvt').getValue();
    var mensaje = '';
    //para optener paradas
    for (var i = 0; i < d.length; i++) {
        mensaje = mensaje + d[i] + ',';
    }
    Ext.getCmp('paradas').setValue(mensaje);
    if (form.isValid()) {
        var d = Ext.getCmp('selector').getValue();
        if (d > 0) {
            var d = Ext.getCmp('listEvt').getValue();
            if (aux !== ',') {
                //para comprobar repetidos en horarios
                var bandera = 0;
                for (var j = 0; j < storeHoras.data.length; j++) {
                    for (var i = 0; i < storeHoras.data.length; i++) {
                        if (i !== j) {
                            if (Ext.Date.format(storeHoras.getAt(i).data.text, 'H:i:s') === Ext.Date.format(storeHoras.getAt(j).data.text, 'H:i:s')) {
                                bandera = 1;
                            }
                        }
                    }
                }
                if (bandera === 0) {
                    if (d.length > 0) {
                        storeHoras.removeAll();
                        form.updateRecord(formAdminRoute.activeRecord);
                        Ext.getCmp('btn-draw-edit-route').setIconCls("icon-trazar");
                        formAdminRoute.down('#update').disable();
                        formAdminRoute.down('#create').enable();
                        formAdminRoute.down('#delete').disable();
                        dibujar = true;
                    } else {
                        Ext.example.msg("Alerta", 'Debe de ingresar paradas');
                    }
                } else {
                    Ext.example.msg("Alerta", 'No debe de ingresar horas repetidas');
                }
            } else {
                Ext.example.msg("Alerta", 'Debe de ingresar horario');
            }
        } else {
            Ext.example.msg("Alerta", 'Debe trazar una ruta');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
    }
}
function onCreateRoute() {
//para obtener horarios
    for (var i = 0; i < storeHoras.data.length; i++) {
        aux = aux + Ext.Date.format(storeHoras.getAt(i).data.text, 'H:i:s') + ',';
    }
    formAdminRoute.down('#horaRoutes').setValue(aux);
    var form = formAdminRoute.getForm();
    if (form.isValid()) {
        var d = Ext.getCmp('selector').getValue();
        if (d > 0) {
            var d = Ext.getCmp('listEvt').getValue();
            if (aux !== ',') {
                //para comprobar repetidos
                var bandera = 0;
                for (var j = 0; j < storeHoras.data.length; j++) {
                    for (var i = 0; i < storeHoras.data.length; i++) {
                        if (i !== j) {
                            if (Ext.Date.format(storeHoras.getAt(i).data.text, 'H:i:s') === Ext.Date.format(storeHoras.getAt(j).data.text, 'H:i:s')) {
                                bandera = 1;
                            }
                        }
                    }
                }
                if (bandera === 0) {
                    if (d.length > 0) {
                        storeHoras.removeAll();
                        gridStore.insert(0, form.getValues());
                        //formAdminRoute.fireEvent('create', formAdminRoute, form.getValues());
                        formAdminRoute.down('#update').disable();
                        gridStore.reload();
                        limpiarMapa();
                        removeLine();
                    } else {
                        Ext.example.msg("Alerta", 'Debe de ingresar paradas');
                    }
                } else {
                    Ext.example.msg("Alerta", 'No debe de ingresar horas repetidas');
                }
            } else {
                Ext.example.msg("Alerta", 'Debe de ingresar horario');
            }
        } else {
            Ext.example.msg("Alerta", 'Debe trazar una ruta');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
    }
}

function onResetRoute() {
    limpiarMapa();
    removeLine();
    Ext.getCmp('btn-eliminar').disable();
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-trazar");
    dibujar = true;
    storeHoras.removeAll();
    formAdminRoute.down('#delete').disable();
    formAdminRoute.down('#create').enable();
    formAdminRoute.down('#update').disable();
    formAdminRoute.getForm().reset();
}
function onDeleteRoute() {
    //eliminar ruta
    Ext.getCmp('selector').setValue('');
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el Ruta', function (choice) {
        if (choice === 'yes') {
            gridStore.remove(recordSelectRoute);
        }
    });
}
