Ext.define('Ext.form.field.ux.ComboTreeGridDomain', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.combotreegrid_domain',

    requires: ['Ext.grid.View', 'Ext.grid.column.Column'],

    width: 290,
    anchor: '100%',
    valueField : 'DOMAIN_NM',  // <-- TODO 설정..
    displayField : 'DOMAIN_NM',  // <-- TODO 설정..
    // fieldLabel: 'Grid Picker',

    fields: [
        { name: 'DOMAIN_ID', type: 'string' },
        { name: 'DOMAIN_NM', type: 'string' },
        { name: 'UP_DOMAIN_ID', type: 'string' },
        { name: 'PROJECT_ID', type: 'string' },
        { name: 'DTYPE', type: 'string' },
        { name: 'LEN1', type: 'string' },
        { name: 'LEN2', type: 'string' },
        { name: 'DATA_TYPE', type: 'string' },
        { name: 'DEFAULT_VAL', type: 'string' },
        { name: 'ICON_CLS', type: 'string' },
        { name: 'iconCls', type: 'string' },
        { name: 'LAST_UPD_DT', type: 'string' },
        { name: 'LAST_UPD_USR_UID', type: 'string' },
        { name: 'COLMN_NM', type: 'string' },
        
    ],
    proxy : {
        type : 'ajax',
        url : '/domain/data/tree.do',
        reader : {
            type : 'json',
            rootProperty : 'CHILDREN'
        },
        extraParams: {
            PROJECT_ID : 'PROJECT'
        }
    },
    root: {
        expanded: false
    },
    initComponent: function() {
        var me = this;
        me.setValue( me.valueText||'' );
        me.callParent(arguments);
    },
    setDomainId : function(domainId) {
       var me = this;

       this.domainId = domainId;
    },
    setDataType : function(dataType) {
       var me = this;
       
       this.dataType = dataType;
    },
    setColmnNm : function(colmnNm) {
       var me = this;
       
       this.colmnNm = colmnNm;
    },
    setDefaultVal : function(defaultVal) {
       var me = this;
       
       this.defaultVal = defaultVal;
    },
    getDomainId : function() {
       return this.domainId;
    },
    getDataType : function() {
       return this.dataType;
    },
    getColmnNm : function() {
       return this.colmnNm;
    },
    getDefaultVal : function() {
       return this.defaultVal;
    },
    createPicker: function() {
        var me = this;
        
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
                id : 'combotreegrid_domain_store',
                remoteSort: true,
                autoLoad: true,
                fields: me.fields||[],
                proxy: me.proxy||{}
            }),
            listeners : {
                cellclick : function( _this, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    if( record.get("DOMAIN_ID") == "DMN-001" || record.get("DOMAIN_ID") == "DMN-002" || record.get("DOMAIN_ID") == "DMN-003" ) {
                        return ;
                    }
                    
                    me.setDefaultVal( record.get("DEFAULT_VAL"));
                    me.setDomainId( record.get("DOMAIN_ID"))
                    me.setDataType( record.get("DATA_TYPE"))
                    me.setColmnNm(ErdAppFunction.getWord(record.get("DOMAIN_NM"), 'DOMAIN'));                  
                    me.setValue( record.get( me.valueField ));
                    me.setRawValue( record.get( me.displayField ));

                    //console.log( " : domainTreeStore : ",  Ext.getStore("domainTreeStore").getCount() );
                    //console.log( " this " , _this.store.getCount() );
                },
                celldblclick : function( _this, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    if( record.get("DOMAIN_ID") == "DMN-001" || record.get("DOMAIN_ID") == "DMN-002" || record.get("DOMAIN_ID") == "DMN-003" ) {
                        return ;
                    }
                    
                    me.setDefaultVal( record.get("DEFAULT_VAL"));
                    me.setDomainId( record.get("DOMAIN_ID"))
                    me.setDataType( record.get("DATA_TYPE"))
                    // me.setColmnNm( record.get("COLMN_NM"))
                    me.setColmnNm(ErdAppFunction.getWord(record.get("DOMAIN_NM"), 'DOMAIN'));
                    me.setValue( record.get( me.valueField ));
                    me.setRawValue( record.get( me.displayField ));
                    me.picker.hide();
                    
                }, 
                render : function( _this,  eOpts ) {
                    try {
                        _this.store.load();
                    } catch(e) {
                    }
                },
                show : function( _this,  eOpts ) {
                    if( Ext.getStore("domainTreeStore").getCount()  != _this.store.getCount() ) {
                        _this.store.reload();
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
                dataIndex: 'DATA_TYPE',
                align : 'left',
                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                    /*
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
                    */
                   return value;
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
    listeners : {
        show : function( _this,  eOpts ) {
            console.log( " : domainTreeStore : ",  Ext.getStore("domainTreeStore").getCount() );
            console.log( " this " , Ext.getStore("combotreegrid_domain_store").getCount() );
        }
    }

});