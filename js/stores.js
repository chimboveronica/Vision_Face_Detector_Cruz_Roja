var storeUser = Ext.create('Ext.data.Store', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxUsuario.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});

var storeParadas = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/getparadas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: [
        {name: 'idParada', type: 'int'},
        {name: 'latitudParada', type: 'number'},
        {name: 'longitudParada', type: 'number'},
        {name: 'referenciaParada', type: 'string'},
        {name: 'direccionParada', type: 'string'},
        {name: 'barrioParada', type: 'string'},
        {name: 'rumboParada', type: 'string'},
        {name: 'imagenParada', type: 'string'},
        {name: 'imagenVisibleParada', type: 'int'}
    ]
});

var storeParadas1 = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxParadas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'lon', 'lat', 'referencia', 'barrio', 'direccion', 'dir_img']
});

var storeRutas = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxRutas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'text']
});

var storeRuta = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxRuta.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'text', 'tipo']
});

var storeRutaParadas = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxRuta.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'text', 'tipo']
});

var storeHorariosRutas = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxHorariosRutas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'text']
});

var storeParadasAsignadas = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxParadasAsignadas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'nombre', 'lon', 'lat', 'referencia', 'direccion', 'dir_img']
});
var storeParadasTotales = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxParadas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'nombre', 'lon', 'lat', 'referencia', 'direccion', 'dir_img']
});

var storeHorariosRuta = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxHorarios.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: [{name: 'text', type: 'date', dateFormat: 'H:i:s'}]
});