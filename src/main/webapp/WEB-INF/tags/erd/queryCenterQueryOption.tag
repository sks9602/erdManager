<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

               {
                   xtype: 'panel',
                   layout: 'border',
                   border : false,
                   items : [
                            {
                                region: 'north',
                                title: '쿼리 구성 조건',
                                height : 32+(23*3),
                                
                                border : false,
                                xtype : 'formPanel_ux',
                                collapsible : true,
                                id : 'queryOptionLayoutForm',
                                layout: { type: 'table' , columns: 2 },
                                items : [
								            {
								                xtype      : 'combo_ux',
								                fieldLabel : 'SQL유형',
								                labelWidth : 80,
								                name : 'SQL_SYNTAX',
								                msgTarget: 'side',
								                anchor: '100%',
								                width: '100%',
								                queryMode: 'local',
								                displayField: 'SQL_SYNTAX_NM',
								                valueField: 'SQL_SYNTAX_ID',
								                colspan : 2,
								                value : '',
								                style : {padding : "0 3 0 1"},
								                id : "queryCenterQueryOption_SQL_SYNTAX",
								                store : Ext.create('Ext.data.Store', {
								                    fields: [
								                        { name : "SQL_SYNTAX_ID"    , type : "string"},        
								                        { name : "SQL_SYNTAX_NM"     , type : "string"},   
								                    ],
								                    data : [
								                        {SQL_SYNTAX_ID : "", SQL_SYNTAX_NM : "선택" },
                                                        {SQL_SYNTAX_ID : "INSERT-VALUE", SQL_SYNTAX_NM : "[DML] INSERT-VALUE" },
                                                        {SQL_SYNTAX_ID : "INSERT-SELECT", SQL_SYNTAX_NM : "[DML] INSERT-SELECT" },
                                                        {SQL_SYNTAX_ID : "UPDATE", SQL_SYNTAX_NM : "[DML] UPDATE" },
                                                        {SQL_SYNTAX_ID : "MERGE", SQL_SYNTAX_NM : "[DML] MERGE" },
                                                        {SQL_SYNTAX_ID : "DELETE", SQL_SYNTAX_NM : "[DML] DELETE" },
                                                        {SQL_SYNTAX_ID : "SELECT", SQL_SYNTAX_NM : "[DML] SELECT" },
                                                        {SQL_SYNTAX_ID : "SELECT-JOIN", SQL_SYNTAX_NM : "[DML] SELECT-JOIN" },
                                                        {SQL_SYNTAX_ID : "Value-Object_LOMBOK", SQL_SYNTAX_NM : "[JAVA] Value Object(LOMBOK)" },
                                                        {SQL_SYNTAX_ID : "Value-Object_GETTER_SETTER", SQL_SYNTAX_NM : "[JAVA] Value Object(GETTER/SETTER)" },
                                                        {SQL_SYNTAX_ID : "CREATE TABLE", SQL_SYNTAX_NM : "[DDL] CREATE TABLE" },
                                                        {SQL_SYNTAX_ID : "ALTER TABLE", SQL_SYNTAX_NM : "[DDL] ALTER TABLE" },
                                                        {SQL_SYNTAX_ID : "DROP TABLE", SQL_SYNTAX_NM : "[DDL] DROP TABLE" },
                                                        {SQL_SYNTAX_ID : "RENAME TABLE", SQL_SYNTAX_NM : "[DDL] RENAME TABLE" },
								                    ]
								                })
								            },
                                            {
                                                xtype      : 'combo_ux',
                                                fieldLabel : '변수 유형',
                                                labelWidth : 80,
                                                name : 'VAR_TYPE',
                                                msgTarget: 'side',
                                                anchor: '100%',
                                                width: '100%',
                                                queryMode: 'local',
                                                displayField: 'VAR_TYPE_NM',
                                                valueField: 'VAR_TYPE_ID',
                                                value : 'CAMEL_CASE',
                                                style : {padding : "0 3 0 1"},
                                                id : "queryCenterQueryOption_VAR_TYPE",
                                                store : Ext.create('Ext.data.Store', {
                                                    fields: [
                                                        { name : "VAR_TYPE_ID"    , type : "string"},        
                                                        { name : "VAR_TYPE_NM"     , type : "string"},   
                                                    ],
                                                    data : [
                                                        {VAR_TYPE_ID : "CAMEL_CASE", VAR_TYPE_NM : "CAMEL_CASE" },
                                                        {VAR_TYPE_ID : "SNAKE_CASE_UPPER", VAR_TYPE_NM : "SNAKE_CASE_UPPER" },
                                                        {VAR_TYPE_ID : "SNAKE_CASE_LOWER", VAR_TYPE_NM : "SNAKE_CASE_LOWER" },
                                                    ]
                                                })
                                            },
                                            {
                                                xtype      : 'combo_ux',
                                                fieldLabel : '주석 유형',
                                                labelWidth : 80,
                                                name : 'COMMENT_TYPE',
                                                msgTarget: 'side',
                                                anchor: '100%',
                                                width: '100%',
                                                queryMode: 'local',
                                                displayField: 'COMMENT_TYPE_NM',
                                                valueField: 'COMMENT_TYPE_ID',
                                                value : 'BLOCK',
                                                style : {padding : "0 3 0 1"},
                                                id : "queryCenterQueryOption_COMMENT_TYPE",
                                                store : Ext.create('Ext.data.Store', {
                                                    fields: [
                                                        { name : "COMMENT_TYPE_ID"    , type : "string"},        
                                                        { name : "COMMENT_TYPE_NM"     , type : "string"},   
                                                    ],
                                                    data : [
                                                        {COMMENT_TYPE_ID : "BLOCK", COMMENT_TYPE_NM : "BLOCK" },
                                                        {COMMENT_TYPE_ID : "LINE", COMMENT_TYPE_NM : "LINE" },
                                                    ]
                                                })
                                            },
                                            {
                                                xtype      : 'combo_ux',
                                                fieldLabel : '라인당 컬럼수',
                                                labelWidth : 80,
                                                name : 'COLMN_CNT',
                                                msgTarget: 'side',
                                                anchor: '100%',
                                                width: '100%',
                                                queryMode: 'local',
                                                displayField: 'COLMN_CNT_NM',
                                                valueField: 'COLMN_CNT_ID',
                                                value : '1',
                                                style : {padding : "0 3 0 1"},
                                                id : "queryCenterQueryOption_COLMN_CNT",
                                                store : Ext.create('Ext.data.Store', {
                                                    fields: [
                                                        { name : "COLMN_CNT_ID"    , type : "string"},        
                                                        { name : "COLMN_CNT_NM"     , type : "string"},   
                                                    ],
                                                    data : [
                                                        {COLMN_CNT_ID : "1", COLMN_CNT_NM : "1" },
                                                        {COLMN_CNT_ID : "2", COLMN_CNT_NM : "2" },
                                                        {COLMN_CNT_ID : "3", COLMN_CNT_NM : "3" },
                                                        {COLMN_CNT_ID : "4", COLMN_CNT_NM : "4" },
                                                        {COLMN_CNT_ID : "5", COLMN_CNT_NM : "5" },
                                                        {COLMN_CNT_ID : "10", COLMN_CNT_NM : "10" },
                                                    ]
                                                })
                                            },
                                     ]
                            },
                                                                
                           {   xtype : 'gridpanel',
                               // region: 'south',
                               columnLines: true,
                                region: 'center',
                               rowLines : true,
                               title : '쿼리 설정',
                               selType: 'checkboxmodel',
                               autoScroll: true, 
                               scrollable: true,
                               id : "queryCenterQueryOption_gridpanel",
                               // height : Ext.getBody().getViewSize().height-(32+(23*3)+30),
			                    selModel: {
			                        checkOnly: false,
			                        injectCheckbox: 0,
			                        mode: 'MULTI'
			                    },
			                    plugins: {
			                        cellediting: {
			                            editing : true,
			                            clicksToEdit: 1
			                        }
			                    },
				                store : Ext.create('Ext.data.Store', {
				                    id : "queryCenterQueryOption_store",
				                    fields: [
				                        { name : "INDENT"     , type : "string"},        
				                        { name : "SYNTAX"     , type : "string"},       
				                        { name : "ENTITY_NM"  , type : "string"},   
				                        { name : "ENTITY_NM_ALIAS_NM"  , type : "string"},        
                                        { name : "COLMN_NM"   , type : "string"},         
                                        { name : "COLMN_NM_ALIAS_NM"   , type : "string"},        
				                    ],
				                    data : [
				                        /*
				                            {"INDENT": "" , "SYNTAX":"" , "CD_NM":"전체", "CD_VAL_A":"", "CD_VAL_B":"", "CD_VAL_A":"", "CD_VAL_1":"", "CD_VAL_2":"", "CD_VAL_3":"" },
				                        
				                        
				                            {"INDENT": "TABL_SCD_030" , "SYNTAX":"SELECT" , "CD_NM":"설계반영", "CD_VAL_A":"설계", "CD_VAL_B":"", "CD_VAL_A":"", "CD_VAL_1":"", "CD_VAL_2":"", "CD_VAL_3":"" },
				                        
				                            {"INDENT": "TABL_SCD_040" , "SYNTAX":"FROM" , "CD_NM":"개발반영", "CD_VAL_A":"개발", "CD_VAL_B":"", "CD_VAL_A":"", "CD_VAL_1":"", "CD_VAL_2":"", "CD_VAL_3":"" },
				                        
				                            {"INDENT": "TABL_SCD_050" , "SYNTAX":"WHERE" , "CD_NM":"테스트반영", "CD_VAL_A":"테스트", "CD_VAL_B":"", "CD_VAL_A":"", "CD_VAL_1":"", "CD_VAL_2":"", "CD_VAL_3":"" },
				                        
				                            {"INDENT": "TABL_SCD_070" , "SYNTAX":"" , "CD_NM":"운영반영", "CD_VAL_A":"운영", "CD_VAL_B":"", "CD_VAL_A":"", "CD_VAL_1":"", "CD_VAL_2":"", "CD_VAL_3":"" },
				                        */
				                    ]
				               }),
                                tbar : [
                                   '->',
                                   <tagErd:button type="button" label="행 삭제" iconCls="search" cls="btn_segmentedbutton">
                                       listeners : {
                                           click : function(_this, e, eOpts) { 
                                                var grid = Ext.getCmp("queryCenterQueryOption_gridpanel");
                                                var selectedRecords = grid.getSelectionModel().getSelection();
                                                
                                                for( var i=0; i < selectedRecords.length; i++) {
                                                    grid.getStore().remove(selectedRecords[i]);
                                                }
                                           }
                                       }
                                   </tagErd:button>
                                   <tagErd:button type="button" label="쿼리 생성" iconCls="search" cls="btn_segmentedbutton" id="queryCenterQueryOption_btnMakeQuery">
                                       listeners : {
                                           click : function(_this, e, eOpts) { 
                                                var store = Ext.getStore("queryCenterQueryOption_store");
                                                
                                                
                                                QueryMakeFunction.makeQuery(Ext.getCmp("queryCenterQueryOption_SQL_SYNTAX").getValue(), store.getData().items);
                                                
                                                Ext.getCmp("TABLE_PANEL").setWidth(200)
                                                Ext.getCmp("TABLE_COLUMN_PANEL").setWidth(200)
                                                Ext.getCmp("rightSqlArea-PANEL").setWidth(800)
                                                
                                                /*
                                                console.log( store.getData())
                                                
                                                for( var i=0; i < store.getData().items.length; i++) {
                                                    console.log( store.getData().items[i])
                                                }
                                                */
                                           }
                                       }
                                   </tagErd:button>
                                ],
			                   viewConfig: {
			                        plugins: {
			                            gridviewdragdrop: {
			                                containerScroll: true,
			                                copy : true,
			                                allowCopy : true,
			                                autoGenId : true,
			                                dragGroup: 'dd-grid-to-grid-group1',
			                                dropGroup: 'dd-grid-to-grid-group1',
			                            }
			                        },
			                        listeners: {
			                            beforedrop : function ( node, data, overModel, dropPosition, dropHandlers, eOpts )  {

			                                for( var i=0; i < data.records.length; i++) {
			                                    var dropRec = data.records[i];
                                                
                                                
                                                dropRec.set("INDENT", "1");
                                                dropRec.set("SYNTAX", "");
                                                dropRec.set("ALIAS_NM", dropRec.get("COLMN_NM"));
                                                
                                            
                                                
			                                }
			                            },
			                            drop: function(node, data, dropRec, dropPosition) {

                                            var store = Ext.getStore("queryCenterQueryOption_store");
                                            var entityListStore  = Ext.getStore("entityListStore");
                                            
                                            for( var i=0; i < data.records.length; i++) {
                                                /*
                                                var entityIdx = entityListStore.find( "ENTITY_NM", data.records[i].get("ENTITY_NM"))
                                                
                                                console.log( entityListStore.getAt(entityIdx).get("ALIAS_NM"), entityListStore.getAt(entityIdx).get("ENTITY_NM"));
                                                store.getAt(i).set("ENTITY_NM_ALIAS", entityListStore.getAt(entityIdx).get("ALIAS_NM") ? entityListStore.getAt(entityIdx).get("ALIAS_NM") : entityListStore.getAt(entityIdx).get("ENTITY_NM"))
                                                */
                                                /*
                                                var idx = store.find( "ENTITY_NM", data.records[i].get("ENTITY_NM"))
                                                if( idx == -1 ) {
                                                     // store.add({"SYNTAX" : "FROM", "INDENT": "3" , "ENTITY_NM": data.records[i].get("ENTITY_NM") ,});
                                                }
                                                */
 			                                }
 			                                
 			                                // store.add({"SYNTAX" : "FROM", "INDENT": "3" , "ENTITY_NM": "",});
			                            }
			                        }
			                    },
			                    scrollable: true,
                               columns: [
                                   /* 
                                   { header: '<div style="text-align:center;width:100%;"><div class="grid-header-numberfield"></div>INDENT</div>', dataIndex: 'INDENT', width : 60, locked : true, 
                                         editor: {
                                            xtype: 'numberfield',
                                            minValue : 0,
                                            maxValue : 10,
                                         },
                                   },
                                   */
                                   /*
                                   { header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>Syntax</div>', dataIndex: 'SYNTAX', flex: 1, minWidth : 100, 
                                         editor: {
                                            xtype: 'combobox',
                                            forceSelection: true,
                                            editable: false,
                                            triggerAction: 'all',
                                            allowBlank: false,
                                            valueField: 'SCRIPT_DATA',
                                            displayField: 'SCRIPT_TEXT',
                                            store: Ext.create('Ext.data.Store', {
                                                id : 'CENTER_QUERY_SYNTAX_STORE',
                                                fields: ['SCRIPT_TEXT', 'SCRIPT_DATA'],
                                                data: [
                                                        {SCRIPT_TEXT: '', SCRIPT_DATA: '' },
                                                        {SCRIPT_TEXT: 'SELECT', SCRIPT_DATA: 'SELECT' },
                                                        {SCRIPT_TEXT: 'INSERT INTO', SCRIPT_DATA: 'INSERT INTO' },
                                                        {SCRIPT_TEXT: 'UPDATE', SCRIPT_DATA: 'UPDATE' },
                                                        {SCRIPT_TEXT: 'SET', SCRIPT_DATA: 'SET' },
                                                        {SCRIPT_TEXT: 'DELETE', SCRIPT_DATA: 'DELETE' },
                                                        {SCRIPT_TEXT: 'FROM', SCRIPT_DATA: 'FROM' },
                                                        {SCRIPT_TEXT: ',', SCRIPT_DATA: ',' },
                                                        {SCRIPT_TEXT: 'LEFT OUTER JOIN', SCRIPT_DATA: 'LEFT OUTER JOIN' },
                                                        {SCRIPT_TEXT: 'JOIN', SCRIPT_DATA: 'JOIN' },
                                                        {SCRIPT_TEXT: 'WHERE', SCRIPT_DATA: 'WHERE' },
                                                        {SCRIPT_TEXT: 'AND', SCRIPT_DATA: 'AND' },
                                                        
                                                ]
                                            }),
                                        },
                                        renderer: function(value, metaData, record) {
									        var store = Ext.getStore('CENTER_QUERY_SYNTAX_STORE');
									        return store.getAt(store.findExact ( 'SCRIPT_DATA', value )).get("SCRIPT_TEXT");
									    }
                                   },
                                   */
                                   { header: '<div style="text-align:center;width:100%;">테이블</div>', dataIndex: 'ENTITY_NM', flex: 1, minWidth : 100, 
                                         /*
                                         editor: {
                                            xtype: 'combobox',
                                            forceSelection: true,
                                            editable: false,
                                            triggerAction: 'all',
                                            allowBlank: false,
                                            valueField: 'ENTITY_NM',
                                            displayField: 'ENTITY_NM',
                                            <tagErd:store type="store" id="queryCenterQueryOption_entityStore" idProperty="ENTITY_ID" url="/entity/data/list.do" rootProperty="data" expanded="true" params="PROJECT_ID : 'PROJECT'">
			                                    // fields: store.tag로 이동
			                                </tagErd:store>
			                                listeners : {
			                                     expand : function( field, eOpts ) {
			                                         var tableStore = Ext.getStore("queryCenterQueryOption_entityStore");
			                                         
			                                         tableStore.filterBy(function(record) {
			                                             var columnStore = Ext.getStore("queryCenterQueryOption_store");
			                                         
			                                             if( columnStore.find("ENTITY_NM", record.get("ENTITY_NM")) >= 0) {
			                                                 return true;
			                                             } else {
			                                                 return false;
			                                             }
			                                             
			                                         });
			                                     }
			                                
			                                },
			                                
			                                
                                        },
                                        */
                                   },
                                   { header: '<div style="text-align:center;width:100%;">테이블 ALIAS</div>', align:'left',  dataIndex: 'ENTITY_NM_ALIAS', minWidth: 80, },
                                   { header: '<div style="text-align:center;width:100%;">컬럼</div>', align:'left',  dataIndex: 'COLMN_NM', flex: 1, minWidth: 100, },
                                   { header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 ALIAS</div>', dataIndex: 'COLMN_NM_ALIAS_NM', align:'left', flex: 1, minWidth : 100, 
                                        editor: {
                                           xtype : 'textfield',
                                        }
                                   },
                               ]
                           },
                       ]
                   }