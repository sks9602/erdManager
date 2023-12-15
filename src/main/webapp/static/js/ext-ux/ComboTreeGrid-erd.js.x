Ext.define('Ext.form.field.ux.ComboTreeGrid', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.combotreegrid_domain',

    requires: ['Ext.grid.View', 'Ext.grid.column.Column'],

    width: 290,
    anchor: '100%',
    valueField : 'DOMAIN_NM',  // <-- TODO 설정..
    displayField : 'DOMAIN_NM',  // <-- TODO 설정..
    // fieldLabel: 'Grid Picker',

    initComponent: function() {
        var me = this;
        me.setValue( me.valueText||'' );
        me.callParent(arguments);
    },

    createPicker: function() {
        var me = this;
        alert(2)
        picker = new Ext.create('Ext.tree.Panel', {
            floating: true,
            hidden: true,
            height: 350,
            minHeight: 150,
            minWidth: 300,
            width: 300,
            header: false,
            value : me.value,
            rootVisible: me.rootVisible||false,
            store: Ext.create('Ext.data.TreeStore', {
                remoteSort: true,
                autoLoad: true,
                fields: me.fields||[],
                proxy: me.proxy||{}
            }),
            listeners : {
                cellclick : function( _this, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    me.setValue( record.get( me.valueField ));
                    me.setRawValue( record.get( me.displayField ));
                },
                celldblclick : function( _this, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    me.setValue( record.get( me.valueField ));
                    me.setRawValue( record.get( me.displayField ));
                    me.picker.hide();
                }, 
                render : function( _this,  eOpts ) {
                    try {
                        _this.store.load();
                    } catch(e) {
                    }
                }
            },
            columns: [{
                xtype: 'treecolumn',
                minWidth: 120,
                width: 120,
                flex : 1,
                text: '도메인명',
                dataIndex : 'DOMAIN_NM'
            }, {
                xtype: 'gridcolumn',
                minWidth: 80,
                width: 90,
                flex : 1,
                text: '<div style="text-align:center;width:100%;">데이터 타입</div> ',
                width: 90,
                dataIndex: 'LEN1',
                align : 'left',
                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                    if( record.data.LEVEL == 1) {
                        return record.data.DTYPE;
                    } else if( record.data.DTYPE == 'DATE' || record.data.DTYPE == 'DATETIME'|| record.data.DTYPE == 'CLOB' ) {
                        return record.data.DTYPE;
                    } else if( record.data.DTYPE == 'VARCHAR' || record.data.DTYPE == 'VARCHAR2' 
                           || record.data.DTYPE == 'INTEGER' || record.data.DTYPE == 'LONG' ) {
                        return record.data.DTYPE+'('+record.data.LEN1+')';
                    } else if( record.data.DTYPE == 'NUMBER' || record.data.DTYPE == 'FLOAT' || record.data.DTYPE == 'DOUBLE'  ) {
                        if( record.data.LEN2 != null && record.data.LEN2 != '' && record.data.LEN2 != '0' ) {
                            return record.data.DTYPE+'('+record.data.LEN1 + "," + record.data.LEN2+')';
                        } else {
                            return record.data.DTYPE+'('+record.data.LEN1 +')';
                        }
                    } else {
                        return record.data.DTYPE+'('+record.data.LEN1+')';
                    }
                }
            }, {
                header: '기본값',
                width: 50,
                dataIndex: 'DEFAULT_VAL',
                align: 'center'
            }]
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

});