                            /*
                            {
                                xtype: 'tagfield',
                                fieldLabel: '테이블명',
                                labelCls    : 'x-form-item-label x-form-item-label-required',
                                name: 'DTYPE',
                                msgTarget: 'side',
                                allowBlank: false,
                                labelWidth : 100,
                                width : 500,
                                colspan : 2,
                                store: {
                                        xtype : 'store',
                                        storeId: 'requestEntityListStore',
                                        idProperty : 'data',
                                        fields: [
                                            
                                            { name : 'ALIAS_NM', type : 'string', format : '' },
                                            
                                            { name : 'APLY_DT', type : 'string', format : '' },
                                            
                                            { name : 'APLY_USR_UID', type : 'string', format : '' },
                                            
                                            { name : 'COLUMN_CNT', type : 'int', format : '' },
                                            
                                            { name : 'DML_DT', type : 'string', format : '' },
                                            
                                            { name : 'DML_TCD', type : 'string', format : '' },
                                            
                                            { name : 'DML_TCD_NM', type : 'string', format : '' },
                                            
                                            { name : 'ENTITY_ID', type : 'string', format : '' },
                                            
                                            { name : 'ENTITY_NM', type : 'string', format : '' },
                                            
                                            { name : 'ENTITY_TCD', type : 'string', format : '' },
                                            
                                            { name : 'FAVOR_YN', type : 'string', format : '' },
                                            
                                            { name : 'PROJECT_ID', type : 'string', format : '' },
                                            
                                            { name : 'TABL_DESC', type : 'string', format : '' },
                                            
                                            { name : 'TABL_NM', type : 'string', format : '' },
                                            
                                            { name : 'TABL_SCD', type : 'string', format : '' },
                                            
                                            { name : 'TABL_SCD_030', type : 'bool', format : '' },
                                            
                                            { name : 'TABL_SCD_030_COL_CNT', type : 'int', format : '' },
                                            
                                            { name : 'TABL_SCD_040', type : 'bool', format : '' },
                                            
                                            { name : 'TABL_SCD_040_COL_CNT', type : 'int', format : '' },
                                            
                                            { name : 'TABL_SCD_050', type : 'bool', format : '' },
                                            
                                            { name : 'TABL_SCD_050_COL_CNT', type : 'int', format : '' },
                                            
                                            { name : 'TABL_SCD_060', type : 'bool', format : '' },
                                            
                                            { name : 'TABL_SCD_060_COL_CNT', type : 'int', format : '' },
                                            
                                            { name : 'TABL_SCD_070', type : 'bool', format : '' },
                                            
                                            { name : 'TABL_SCD_070_COL_CNT', type : 'int', format : '' },
                                            
                                            { name : 'TABL_SCD_ALL', type : 'string', format : '' },
                                            
                                            { name : 'TABL_SCD_NM', type : 'string', format : '' },
                                            
                                            { name : 'TRT_DT', type : 'string', format : '' },
                                            
                                            { name : 'TRT_USR_UID', type : 'string', format : '' },
                                            
                                            { name : 'USE_YN', type : 'string', format : '' },
                                            
                                        ],
                                        
                                        autoLoad:  true ,
                                        proxy : {
                                               type : 'ajax',
                                               url : '/entity/data/list.do',
                                               reader : {
                                                   type : 'json',
                                                   rootProperty : 'data',
                                                   totalProperty: 'totalCount' 
                                               },
                                               extraParams: {
                                                   PROJECT_ID : 'PROJECT'
                                               }
                                           },
                                           root: {
                                                expanded:  true ,
                                        },
                                    },
                                    value: [],
                                    valueField : 'ENTITY_NM',
                                    displayField: 'TABL_NM',
                                    filterPickList: true,
                                    queryMode: 'local',
                                    publishes: 'value'
                                },
                                */