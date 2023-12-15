Ext.define('Ext.form.field.ux.ComboTreeGridDataType', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.combotreegrid_dataType',

    requires: ['Ext.grid.View', 'Ext.grid.column.Column'],

    width: 470,
    anchor: '100%',
    valueField : 'DTYPE',  // <-- TODO 설정..
    displayField : 'DTYPE_USE',  // <-- TODO 설정..
    // fieldLabel: 'Grid Picker',
    enableKeyEvents : true,
    editable : true,

    rootVisible: false,
    width: 470,
    valueField : 'DTYPE', 
    displayField : 'DTYPE_USE', // 'DTYPE_USE', 
    fields: [
        { name: 'DTYPE', type: 'string' },
        { name: 'DTYPE_USE', type: 'string' },
        { name: 'ID', type: 'string' },
        { name: 'DBASE', type: 'string' },
        { name: 'UP_DTYPE', type: 'string' },
        { name: 'DTYPE_DESC', type: 'string' },
        { name: 'ORD_TRN', type: 'string' },
        { name: 'SYNTAX', type: 'string' },
        { name: 'SCALE_YN', type: 'string' },
        { name: 'COMMA_YN', type: 'string' },
        { name: 'ICON_CLS', type: 'string' },
        { name: 'iconCls', type: 'string' },
    ],
    proxy: {
        type: 'ajax',
        url : '/datatype/data/tree.do',
        extraParams : {
            PROJECT_ID : 'PROJECT'
        }, // , 
        reader: {
            type: 'json',
            rootProperty : 'CHILDREN',
            totalProperty: 'totalCount'
        },
        root: {
            expanded: false
        },
    },

    initComponent: function() {
        var me = this;
        me.setValue( me.valueText||'' );
        me.callParent(arguments);
    },

    createPicker: function() {
        var me = this;
        picker = new Ext.create('Ext.tree.Panel', {
            floating: true,
            hidden: true,
            height: 350,
            minHeight: 150,
            minWidth: 300,
            width: 470,
            header: false,
            value : me.value,
            rootVisible: me.rootVisible||false,
            store: Ext.create('Ext.data.TreeStore', {
                id : me.id,
                remoteSort: true,
                autoLoad: true,
                fields: me.fields||[],
                proxy: me.proxy||{}
            }),
            listeners : {
                cellclick : function( _this, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    me.setValue( record.get( me.displayField ));
                    me.setRawValue( record.get( me.displayField ));
                    me.focus();
                    
                    var newValue = record.get( me.displayField );
                    var regex = new RegExp('.*\([\s\,]*\)');
                    var idx = newValue.indexOf("(");
                    /*
                    if( regex.test(newValue) ) {
                       var idx = newValue.indexOf("(");
                       me.selectText(idx+1,idx+2);
                    } else {
                       if( idx >= 0 ) {
                           me.selectText(idx+1);
                       } else {
                          me.selectText(newValue.length+1);
                       }
                    }*/
                },
                celldblclick : function( _this, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    me.setValue( record.get( me.displayField ));
                    me.setRawValue( record.get( me.displayField ));
                    me.picker.hide();
                    me.focus();
                    
                    var newValue = record.get( me.displayField );
                    var regex = new RegExp('.*\([\s\,]*\)');
                    var idx = newValue.indexOf("(");
                    /*
                    if( regex.test(newValue) ) {
                       var idx = newValue.indexOf("(");
                       me.selectText(idx+1,idx+2);
                    } else {
                       if( idx >= 0 ) {
                           me.selectText(idx+1);
                       } else {
                          me.selectText(newValue.length+1);
                       }
                    }
                    */
                }, 
                render : function( _this,  eOpts ) {
                    try {
                        _this.store.load();
                    } catch(e) {
                    }
                },
            },
            columns: [{
                xtype: 'treecolumn',
                minWidth: 120,
                width: 120,
                flex : 1,
                text: '데이터 타입',
                dataIndex : 'DTYPE'
            }, {
                xtype: 'gridcolumn',
                minWidth: 80,
                width: 150,
                flex : 1,
                text: '<div style="text-align:center;width:100%;">SYNTAX</div> ',
                width: 90,
                dataIndex: 'SYNTAX',
                align : 'left',
                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                    
                    if( record.data.LEVEL == 2) {
                        return record.data.SYNTAX;
                    } else {
                        return record.data.SYNTAX;
                    }
                }
            }
            /*, {
                header: '설명',
                text: '<div style="text-align:center;width:100%;">설명</div> ',
                width: 200,
                dataIndex: 'DTYPE_DESC',
                align: 'left'
            }*/
            ]
        });
        
        return picker;
    },
    getValue: function() 
    {
        return this.value;
    },
    getSubmitValue: function()
    {
        return this.value;
    },
    listeners : {
       change : function(_this, newValue, oldValue, eOpts) {
           /*
           if( newValue.indexOf("(") > 0 ) {
               _this.selectText(newValue.indexOf("("));
           }
           */
       },
       keyup : function( _this, e, eOpts) {
           
           _this.setValue( e.target.value );
           _this.setRawValue( e.target.value );
           /*
           var newValue = event.target.value;
           var regex = /.*\([\s\,]*\).*$/g;
           var idx = newValue.indexOf("(");
           
           console.log( newValue, regex.test(newValue), idx )
           
           if( regex.test(newValue) ) {
               _this.selectText(idx+1,idx+1);
           } else {
               if( idx >= 0 ) {
                   _this.selectText(idx+2,idx+2);
               } else {
                  _this.selectText(newValue.length+1);
               }
           }
           */
       },
       focus  : function ( _this, event, eOpts )  {
           var newValue = event.target.value;
           var regex = new RegExp('.*\([\s\,]*\).*$', 'g');
           
           console.log( newValue, regex.test(newValue) )
           
           var idx = newValue.indexOf("(");
           if( regex.test(newValue) ) {
               _this.selectText(idx+1,idx+2);
           } else {
               /*
               if( idx >= 0 ) {
                   _this.selectText(idx+1);
               } else {
                  _this.selectText(newValue.length+1);
               }
               */
           }
       }
    },
});