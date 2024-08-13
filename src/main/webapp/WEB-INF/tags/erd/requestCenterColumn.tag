<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

                {   xtype : 'gridpanel',
                    region: 'center',
                    columnLines: true,
                    //enableDragDrop: true,
                    enableLocking:true,
                    selType: 'checkboxmodel',
                    height : Ext.getBody().getViewSize().height - (53+(23*3))-32,
                    id : 'centerRightTableColumn_gridpanel',
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
                    // scrollable:true,
                    title: '컬럼목록',
                    <tagErd:store type="store" id="columnListStore" idProperty="COLMN_ID" url="/entity/data/columnList.do" rootProperty="data" expanded="false" params="PROJECT_ID : 'PROJECT', ENTITY_ID : ''" autoLoad="true">
                      // fields: store.tag로 이동
                    </tagErd:store>
                    // reference: 'grid1',
                    tbar : ['->',
                        <tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
                            listeners : {
                                click : function(_this, e, eOpts) { 
                                    var store = Ext.getStore("columnListStore");
                                    store.reload();
                                }
                            }
                        </tagErd:button>
                        <tagErd:button type="splitbutton" label="컬럼 추가" iconCls="search" cls="btn_segmentedbutton" id="btn_tableColumnAdd">
                            disabled : false ,
                            listeners : {
                                click : function(_this, e, eOpts) { 
                                    
                                    var store = Ext.getStore("columnListStore");
                                    var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
                                    /*
                                    store.insert(0, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y" });
                                    */
                                    
                                    var grid = Ext.getCmp("centerRightTableColumn_gridpanel");
                                    var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                    
                                    var row = grid.store.indexOf(selectedRecord);
                                    
                                    var store = Ext.getStore("columnListStore");
                                    if( row < 0 ) {
                                        row = store.getTotalCount();
                                        if( row < 0 ) {
                                           row = 0;
                                        }
                                    }
                                    store.insert(row+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
                                }
                            },
                            menu: {
                                plain: true,
                                items: [ 
                                        {text: '3건 추가', id : 'erdCenterRightColumn_addColumn3',
                                            disabled : false ,
                                            handler : function(_this, ev) {
                                                 // console.log( Ext.getCmp("centerRightTableColumn_gridpanel").getSelection() );
                                                 var grid = Ext.getCmp("centerRightTableColumn_gridpanel");
                                                 var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                 var row = grid.store.indexOf(selectedRecord);
                                                 
                                                 var store = Ext.getStore("columnListStore");
                                                 if( row < 0 ) {
                                                     row = store.getTotalCount();
                                                     if( row < 0 ) {
                                                        row = 0;
                                                     }
                                                 }

                                                 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
                                                 for(var i=0; i < 3 ; i++){
                                                     store.insert(row+i+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
                                                 }
                                            }
                                        },
                                        {text: '5건 추가', id : 'erdCenterRightColumn_addColumn5',
                                            disabled : false ,
                                            handler : function(_this, ev) {
                                                 var grid = Ext.getCmp("centerRightTableColumn_gridpanel");
                                                 var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                 var row = grid.store.indexOf(selectedRecord);
                                                 
                                                 var store = Ext.getStore("columnListStore");
                                                 if( row < 0 ) {
                                                     row = store.getTotalCount();
                                                     if( row < 0 ) {
                                                        row = 0;
                                                     }
                                                 }
                                                 
                                                 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
                                                 for(var i=0; i < 5 ; i++){
                                                     store.insert(row+i+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
                                                 }
                                            }
                                        },
                                        {text: '10건 추가', id : 'erdCenterRightColumn_addColumn10',
                                            disabled : false ,
                                            handler : function(_this, ev) {
                                                 var grid = Ext.getCmp("centerRightTableColumn_gridpanel");
                                                 var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                 var row = grid.store.indexOf(selectedRecord);
                                                 
                                                 var store = Ext.getStore("columnListStore");
                                                 if( row < 0 ) {
                                                     row = store.getTotalCount();
                                                     if( row < 0 ) {
                                                        row = 0;
                                                     }
                                                 }
                                                 
                                                 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
                                                 for(var i=0; i < 10 ; i++){
                                                     store.insert(row+i+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
                                                 }
                                            }
                                        },
                                        {text: '다건 추가', id : 'erdCenterRightColumn_addColumnMulti',
                                            disabled : false ,
                                            handler : function(_this, ev) {
                                                /*
                                                console.log( arguments );
                                                
                                                Ext.MessageBox.show({
                                                   title: 'Please wait',
                                                   msg: 'File Uploading...',
                                                   animateTarget: _this,
                                                   prompt: { xtype: 'numberfield', }
                                                })
                                                */
                                                Ext.MessageBox.prompt('입력', '추가 할 컬럼 수(숫자만입력, 1~15사이 숫자):', function(btn, text) {
                                                        var rowCnt = text.replace(/[^0-9]/g,'');
                                                        
                                                        if( btn == 'ok') {
                                                            if( rowCnt > 15 || rowCnt < 1) {
                                                                Ext.MessageBox.alert('알림', '숫자는 1~15사이의 숫자를 입력하세요.')
                                                            } else {
                                                                
                                                                 var grid = Ext.getCmp("centerRightTableColumn_gridpanel");
                                                                 var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                                 var row = grid.store.indexOf(selectedRecord);
                                                                 
                                                                 var store = Ext.getStore("columnListStore");
                                                                 if( row < 0 ) {
                                                                     row = store.getTotalCount()-1;
                                                                     if( row < 0 ) {
                                                                        row = 0;
                                                                     }
                                                                 }
                                                                 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
                                                                
                                                                 for(var i=0; i < rowCnt ; i++){
                                                                     store.insert(row+i+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
                                                                 }
                                                            }
                                                        }
                                                    }, this, false, '10', {
                                                        prompt : { xtype: 'numberfield',
                                                                   minValue: 0, 
                                                                   maxValue: 100 
                                                                 }
                                                    }
                                                );
                                                
                                            }
                                        },
                                        {text: '공통컬럼 추가', id : 'erdCenterRightColumn_addColumnCommon',
                                            disabled : false ,
                                            handler : function(_this, ev) {
                                                 var store = Ext.getStore("columnListStore");
                                                 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
                                                 
                                                 var commonColumnListStore = Ext.getStore("commonColumnListStore"); 
                                                 
                                                 for( var i=0; i < commonColumnListStore.getCount() ; i++) {
                                                    var row = store.getCount();
                                                    var record = commonColumnListStore.getAt(i);
                                                    if( store.find("COLMN_ID", record.get("COLMN_ID")) > 0 ) {
                                                        continue;
                                                    }
                                                    store.insert(row+i+1, {"ENTITY_ID": entity_id, "ATTR_NM" : record.get("ATTR_NM"), "COLMN_NM" : record.get("COLMN_NM"), "COLMN_ID" : record.get("COLMN_ID"), "DOMAIN_NM" : record.get("DOMAIN_NM"), "DOMAIN_DATA_TYPE" : record.get("DOMAIN_DATA_TYPE"), "DATA_TYPE" : record.get("DOMAIN_DATA_TYPE"), "DOMAIN_ID" : record.get("DOMAIN_ID"), "DEFAULT_VAL" : record.get("DEFAULT_VAL"), "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
                                                 }
                                            }
                                        },
                                ],
                                /*
                                listeners: {
                                    click: function (menu, item) {


                                    }
                                }
                                */
                            },
                        </tagErd:button>
                        <tagErd:button type="splitbutton" label="컬럼 삭제" iconCls="search" cls="btn_segmentedbutton"  id="btn_tableColumnDelete">
                            disabled : false ,
                            listeners : {
                                click : function(_this, e, eOpts) { 
                                    var grid = Ext.getCmp("centerRightTableColumn_gridpanel");
                                    var selectedRecords = grid.getSelectionModel().getSelection();
                                   
                                    var isFK = false;
                                   
                                    for( var i=0; i < selectedRecords.length; i++) {
                                        console.log( i, selectedRecords[i]['crudState']);
                                        if( selectedRecords[i].get("COLMN_ID") == null || selectedRecords[i].get("COLMN_ID") == ""){
                                            /*
                                            var row = grid.store.indexOf(selectedRecords[i]);
                                            */
                                            grid.getStore().remove(selectedRecords[i]);
                                        } else {
                                            if( ( selectedRecords[i].get("FK_COLMN_ID") != null && selectedRecords[i].get("FK_COLMN_ID") != '' )
                                                || ( selectedRecords[i].get("FK_ENTITY_ID") != null && selectedRecords[i].get("FK_ENTITY_ID") != '' ) ) {
                                                isFK = true;
                                            } else {
                                                selectedRecords[i].set("USE_YN", "N");
                                                
                                                selectedRecords[i].set("DML_TCD", selectedRecords[i].get("DML_TCD")+"_D");
                                                selectedRecords[i].set("DML_TCD_NM", "삭제");
                                                selectedRecords[i].set("DML_DT_FMT", "");
                                            }
                                        }
                                    }
                                
                                    if( isFK ) {
                                        Ext.Msg.alert('안내', 'FK는 삭제할 수 없습니다.');
                                    }
                                }
                            },
                            menu: {
                                disabled : false ,
                                plain: true,
                                items: [ 
                                        {text: '삭제 취소', id : 'erdCenterRightColumn_cancelDeleteColumn',
                                            handler : function(_this, ev) {
                                                var grid = Ext.getCmp("centerRightTableColumn_gridpanel");
                                                var selectedRecords = grid.getSelectionModel().getSelection();
                                               
                                                for( var i=0; i < selectedRecords.length; i++) {
                                                    selectedRecords[i].set("USE_YN", "Y");
                                                
                                                    var dmlTcd = selectedRecords[i].get("DML_TCD").replace(/_D/ig, '');
                                                    selectedRecords[i].set("DML_TCD", dmlTcd);
                                                    selectedRecords[i].set("DML_TCD_NM", dmlTcd == 'DML_TCD_C' ? '추가' : '수정');
                                                    selectedRecords[i].set("DML_DT_FMT", "");
                                                }
                                            }
                                        }
                                ]
                            }
                        </tagErd:button>
                        <tagErd:button type="button" label="글자색 변경" iconCls="search" cls="btn_segmentedbutton" id="btn_tableColumnChangeColor">
                            disabled : false ,
                            listeners : {
                                click : function(_this, e, eOpts) { 
                                     Ext.create('Ext.menu.ColorPicker', {
                                           listeners : {
                                               select : function ( _this, color, eOpts ) {
                                                   var grid = Ext.getCmp("centerRightTableColumn_gridpanel");
                                                   var selectedRecords = grid.getSelectionModel().getSelection();
                                                   for( var i=0; i < selectedRecords.length; i++) {
                                                       selectedRecords[i].set("COLOR", color);
                                                       /*
                                                        var row = grid.store.indexOf(selectedRecords[i]);
                                                        // console.log( row, selectedRecords[i]);
                                                        grid.getStore().remove(selectedRecords[i]);
                                                        */
                                                   }
                                               }
                                           }
                                                 
                                      }).showAt([_this.getBox().x, _this.getBox().y+_this.getBox().height]);
                                  

                                }
                            }
                        </tagErd:button>
                        <tagErd:button type="none" label="사전 적용" iconCls="search" cls="btn_segmentedbutton"  id="btn_tableColumnApplyWord">
                        
                            disabled : false ,
                            /*
                            listeners : {
                                click : function(_this, e, eOpts) { 
                                    var gridColumn = Ext.getCmp("centerRightTableColumn_gridpanel");
                                    gridColumn.submit('all', '/column/data/updateEntityNameByWord.do', {
                                        showSaving : true,
                                        msgConfirm : '단어사전을 적용하시겠습니까?',
                                        callback : function(form, success, response) {
                                            
                                            var res = Ext.decode(response.responseText);
                                            
                                            var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
                                            var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;

                                            var entityList = res.ENTITY_LIST;
                                            var entityColumnList = res.ENTITY_COLUMN_LIST;

                                            drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
                                        
                                            var store = Ext.getStore("columnListStore");
                                            store.reload();
                                            
                                        },
                                        success : function(batch, option) {
                                            Ext.MessageBox.hide();
                                            // alert('성공');
                                        },
                                        failure : function() {
                                            Ext.MessageBox.hide();
                                            // alert('실패');
                                        }
                                    });
                                    
                                }
                            },
                            */
                            menu: {
                                plain: true,
                                disabled : false ,
                                items: [ 
                                        {text: '테이블+컬럼 사전적용', 
                                            handler : function(_this, ev) {
                                                var gridColumn = Ext.getCmp("centerRightTableColumn_gridpanel");
                                                gridColumn.submit('all', '/column/data/updateEntityNameByWord.do', {
                                                    showSaving : true,
                                                    msgConfirm : '단어사전을 적용하시겠습니까?',
                                                    params : {"TARGET" : "ALL"} ,
                                                    callback : function(form, success, response) {
                                                        
                                                        var res = Ext.decode(response.responseText);
                                                        
                                                        var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
                                                        var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;
            
                                                        var entityList = res.ENTITY_LIST;
                                                        var entityColumnList = res.ENTITY_COLUMN_LIST;
            
                                                        drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
                                                        
                                                        var entity_id = Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue();
                                                        ErdDrawFunction.loadTableInfo(entity_id, true);
                                                        Ext.getStore("columnChangeLogStore").load({page : 1, limit : 999999 , params: { 'PROJECT_ID' : 'PROJECT', 'ENTITY_ID' : Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue()}});
                                                        
                                                    },
                                                    success : function(batch, option) {
                                                        Ext.MessageBox.hide();
                                                        
                                                        // alert('성공');
                                                    },
                                                    failure : function() {
                                                        Ext.MessageBox.hide();
                                                        // alert('실패');
                                                    }
                                                });
                                            }
                                        },
                                        {text: '컬럼 사전적용', 
                                            disabled : false ,
                                            handler : function(_this, ev) {
                                                var gridColumn = Ext.getCmp("centerRightTableColumn_gridpanel");
                                                gridColumn.submit('all', '/column/data/updateEntityNameByWord.do', {
                                                    showSaving : true,
                                                    msgConfirm : '단어사전을 적용하시겠습니까?',
                                                    callback : function(form, success, response) {
                                                        
                                                        var res = Ext.decode(response.responseText);
                                                        
                                                        var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
                                                        var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;
            
                                                        var entityList = res.ENTITY_LIST;
                                                        var entityColumnList = res.ENTITY_COLUMN_LIST;
            
                                                        drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
                                                    
                                                        var store = Ext.getStore("columnListStore");
                                                        store.reload();
                                                        Ext.getStore("columnChangeLogStore").load({page : 1, limit : 999999 , params: { 'PROJECT_ID' : 'PROJECT', 'ENTITY_ID' : Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue()}});
                                                        
                                                    },
                                                    success : function(batch, option) {
                                                        Ext.MessageBox.hide();
                                                        // alert('성공');
                                                    },
                                                    failure : function() {
                                                        Ext.MessageBox.hide();
                                                        // alert('실패');
                                                    }
                                                });
                                            }
                                        }
                                
                                
                                ]
                            }
                        </tagErd:button>
                        <tagErd:button type="button" label="저장" iconCls="search" cls="btn_segmentedbutton"  id="btn_tableColumnSave">
                            disabled : false ,
                            listeners : {
                                click : function(_this, e, eOpts) { 
                                    var gridColumn = Ext.getCmp("centerRightTableColumn_gridpanel");
                                    gridColumn.submit('all', '/entity/data/columnSave.do', {
                                        showSaving : true,
                                        callback : function(form, success, response) {
                                            
                                            var res = Ext.decode(response.responseText);
                                            
                                            var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
                                            var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;

                                            var entityList = res.ENTITY_LIST;
                                            var entityColumnList = res.ENTITY_COLUMN_LIST;

                                            drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
                                        
                                            var store = Ext.getStore("columnListStore");
                                            store.reload();
                                            Ext.getStore("columnChangeLogStore").load({page : 1, limit : 999999 , params: { 'PROJECT_ID' : 'PROJECT', 'ENTITY_ID' : Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue()}});
                                            
                                        },
                                        success : function(batch, option) {
                                            Ext.MessageBox.hide();
                                            // alert('성공');
                                        },
                                        failure : function() {
                                            Ext.MessageBox.hide();
                                            // alert('실패');
                                        }
                                    });
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
                                //ddGroup: 'destination1',
                            }
                        },
                        listeners: {
                            beforedrop : function ( node, data, overModel, dropPosition, dropHandlers, eOpts )  {
                                for( var i=0; i < data.records.length; i++) {
                                    var dropRec = data.records[i];
                                    dropRec.set("ENTITY_ID", Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue());
                                    
                                    if( !dropRec.get("ATTR_NM") && dropRec.get("DOMAIN_NM") ) {
                                        dropRec.set("ATTR_NM",dropRec.get("DOMAIN_NM"));
                                        
                                        ErdAppFunction.getWord( dropRec.get("DOMAIN_NM"), 'COLUMN', function(_value) {
                                            dropRec.set('COLMN_NM', _value);// getSelection()[0]
                                        });
                                    }
                                    if( !dropRec.get("DOMAIN_DATA_TYPE")) {
                                        dropRec.set("DOMAIN_DATA_TYPE",dropRec.get("DATA_TYPE"));
                                    }
                                    
                                    if( typeof(dropRec.get("PK_YN_BOOL")) == 'string') {
                                        if( dropRec.get("PK_YN_BOOL") == "true") {
                                            dropRec.set("PK_YN_BOOL", true) 
                                        } else {
                                            dropRec.set("PK_YN_BOOL", false) 
                                        }
                                    }
                                    if( typeof(dropRec.get("NOTNOLL_YN_BOOL")) == 'string') {
                                        if( dropRec.get("NOTNOLL_YN_BOOL") == "true") {
                                            dropRec.set("NOTNOLL_YN_BOOL", true) 
                                        } else {
                                            dropRec.set("NOTNOLL_YN_BOOL", false) 
                                        }
                                    }
                                    dropRec.set("DML_TCD", "DML_TCD_C");
                                    dropRec.set("DML_TCD_NM", "추가");
                                }
                            },
                            drop: function(node, data, dropRec, dropPosition) {
                                console.log( arguments )
                            }
                        }
                    },
                    columns: [
                        { xtype: 'rownumberer', },
                        { text: 'PK', dataIndex: 'PK_YN_BOOL', xtype: 'checkcolumn', width : 28, menuDisabled : true,  locked : true, resizable : false, sort : false,
                              listeners : {
                                  checkchange : function( _this, rowIndex, checked, record, e, eOpts ) {
                                      record.set("NOTNULL_YN_BOOL", checked);
                                  }
                              }
                        },
                        
                        /*
                        { text: 'PK', dataIndex: 'PK_YN', align: "center", width : 40, resizable : false, menuDisabled : true,  locked : true,  sort : false,
                              editor: {
                                 xtype: 'combo',
                                 typeAhead: true,
                                 triggerAction: 'all',
                                 selectOnFocus: false,
                                 store: [
                                     ['Y', 'Y'],
                                     ['', 'N'],
                                 ]
                              }
                        },
                        */
                        { text: '컬럼 논리 명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 논리 명</div>', dataIndex: 'ATTR_NM', width : 120, minWidth : 100, locked : true, sort : false,
                            editor: {
                                allowBlank: false,
                                selectOnFocus: false,
                                listeners : {
                                    focusleave : function( _this, event, eOpts ) {
                                        var newValue = _this.getValue();
                                    //change : function( _this, newValue, oldValue, eOpts ) {   
                                        var record = Ext.getCmp("centerRightTableColumn_gridpanel").getSelectionModel().getLastSelected();

                                        if( record.get("COLMN_ID") != "" && record.get("DML_TCD").indexOf("_D") < 0 ) {
                                            record.set("DML_TCD", "DML_TCD_U");
                                            record.set("DML_TCD_NM", '수정');
                                            record.set("DML_DT_FMT", "");
                                        }
                                        ErdAppFunction.getWord( newValue, 'COLUMN', function(_value) {
                                            record.set('COLMN_NM', _value);// getSelection()[0]
                                        });
                                    }
                                }
                            },
                            renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                var link = new Array();
                                if( record.get("USE_YN") == "N") {
                                    link.push('<span style="color:'+record.get("COLOR")+'"><del>'+ value +'</del></span>');
                                } else {
                                    link.push('<span style="color:'+record.get("COLOR")+'">'+ value +'</span>');
                                }
                                return link.join(' ');
                            }
                        },
                        { text: '컬럼 물리 명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 명</div>', width : 120, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100,  locked : true, sort : false,
                            renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                var link = new Array();
                                if( record.get("USE_YN") == "N") {
                                    link.push('<span id="column_'+ record.data.COLMN_NM +'"><del>'+ record.data.COLMN_NM +'</del></span>');
                                } else {
                                    link.push('<span id="column_'+ record.data.COLMN_NM +'">'+ record.data.COLMN_NM +'</span>');
                                }
                                
                                return link.join(' ');
                            },
                            editor: {
                                allowBlank: false,
                                selectOnFocus: false,
                                listeners : {
                                    change : function( _this, newValue, oldValue, eOpts ) {
                                        var record = Ext.getCmp("centerRightTableColumn_gridpanel").getSelectionModel().getLastSelected();
                                        console.log( newValue != oldValue, record.get("COLMN_ID"), record.get("DML_TCD").indexOf("_D") < 0 );
                                        _this.setValue( _this.getValue().toUpperCase().replace(/ /ig, "") )
                                        if( newValue != oldValue && record.get("COLMN_ID") && record.get("DML_TCD").indexOf("_D") < 0 ) {
                                            record.set("DML_TCD", "DML_TCD_U");
                                            record.set("DML_TCD_NM", '수정');
                                            record.set("DML_DT_FMT", "");
                                        }
                                    },
                                    keyup : function(_this, e, eOpts) {
                                        console.log(_this)
                                        _this.setValue( _this.getValue().toUpperCase().replace(/ /ig, "") )
                                    }
                                }
                            },
                        },
                        { text: '도메인', header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>도메인</div>', dataIndex: 'DOMAIN_NM', width : 90, sort : false,
                             editor: {
                                        xtype: 'combotreegrid_domain',
                                        id : 'centerRight_combotreegrid_domain_picker',
                                        listeners :{
                                            change : function(_this, newValue, oldValue, eOpts) {
                                                console.log( _this )
                                                var recordSelected = Ext.getCmp("centerRightTableColumn_gridpanel").getSelectionModel().getLastSelected();
                                                if( !recordSelected.get("ATTR_NM") ) {
                                                    recordSelected.set('ATTR_NM', _this.getRawValue());
                                                }
                                                if( !recordSelected.get("COLMN_NM") ) {
                                                    recordSelected.set('COLMN_NM', ErdAppFunction.getWord(_this.getRawValue(), 'DOMAIN'));
                                                }
                                                recordSelected.set('DOMAIN_ID',_this.getDomainId());// getSelection()[0]
                                                recordSelected.set('DOMAIN_DATA_TYPE',_this.getDataType());// getSelection()[0]
                                                recordSelected.set('DATA_TYPE',_this.getDataType());// getSelection()[0]
                                                recordSelected.set('DEFAULT_VAL',_this.getDefaultVal());// getSelection()[0]
                                                
                                            },
                                        }
                              },
                          },
                        { text: '도메인 데이터 타입', dataIndex: 'DOMAIN_DATA_TYPE', width : 110, hidden : true,  sort : false,},
                        { text: '데이터 타입', header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>데이터 타입</div>', dataIndex: 'DATA_TYPE', width : 90,  sort : false, 
                            renderer : function (value, metaData, record , rowIndex, colIndex, store, view ){
                                /*
                                var store = Ext.getStore('combotreegrid_dataType_store');
                                if( store ) {
                                    var index = store.findExact('DOMAIN_ID',value);
                                     
                                    if (index != -1){
                                        rs = store.getAt(index).data; 
                                        console.log( rs );
                                        console.log( value );
                                        
                                        return rs.DOMAIN_NM; 
                                    } else {
                                        return value;
                                    }
                                } else {
                                    return value;
                                }
                                */
                                
                                if( record.get("DOMAIN_ID") && record.get("DOMAIN_DATA_TYPE") != value) {
                                    return '<span style="color:red;" id="column_data_type'+ record.get("COLMN_NM") +'">'+ value +'</span>';
                                } else {
                                    return value;
                                }
                            },
                            editor: {
                                xtype: 'combotreegrid_dataType',
                                id : 'combotreegrid_dataType_picker',
                                vtype : '${sessionScope._sessionVO.dbase}DataTypeScale', // 'MariaDBDataTypeScale',
                                
                                listeners :{
                                    /*
                                    change : function(_this, newValue, oldValue, eOpts) {
                                        if( newValue != oldValue && Ext.getCmp("centerRightTableColumn_gridpanel").getSelectionModel().getLastSelected().get('COLMN_ID') ) {
                                            Ext.getCmp("centerRightTableColumn_gridpanel").getSelectionModel().getLastSelected().set('DML_TCD', "DML_TCD_U");// getSelection()[0]
                                            Ext.getCmp("centerRightTableColumn_gridpanel").getSelectionModel().getLastSelected().set('DML_TCD_NM', "수정");// getSelection()[0]
                                        }
                                    }
                                    */
                                    keyup : function(_this, e, eOpts) {
                                        _this.setValue( _this.getValue().toUpperCase().replace(/ /ig, "") )
                                    }
                                }
                                
                            }
                        },
                        { text: 'Not널', dataIndex: 'NOTNULL_YN_BOOL', xtype: 'checkcolumn', align: "center", width : 50, menuDisabled : true, resizable : false,  sort : false,
                              listeners : {
                                  checkchange : function( _this, rowIndex, checked, record, e, eOpts ) {
                                      if( record.get("PK_YN_BOOL")==true ) {
                                          record.set("NOTNULL_YN", record.get("PK_YN_BOOL" ));
                                      }
                                      
                                  }
                              }
                        },
                        {
                            text: '기본값', dataIndex: 'DEFAULT_VAL', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>기본값</div>', width : 100, menuDisabled : true,  sort : false,
                            editor: {
                                xtype: 'textfield',
                            },
                            renderer : function (value, metaData, record , rowIndex, colIndex, store, view ){
                                return value;
                            }
                        },
                        { text: 'Foreign Key', header: '<div style="text-align:center;width:100%;">Foreign Key</div>',  dataIndex: 'FK', align: "left", width : 100,  sort : false,
                           renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
                              if( record.data.FK_ENTITY_NM && record.data.FK_COLMN_NM) {
                                  return  record.data.FK_ENTITY_NM+"."+record.data.FK_COLMN_NM;
                              } else {
                                  return "";
                              }
                          }},
                        { text: '[코드]/채번방식',  header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>코드/채번방식</div>',dataIndex: 'NUMB_MTH', width : 120, visible : false, align : 'left', sort : false,
                           renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
                              if( !record.data.USE_CD && record.data.NUMB_MTH ) {
                                  return record.data.NUMB_MTH;
                              } else if( record.data.USE_CD && !record.data.NUMB_MTH ) {
                                  return "["+record.data.USE_CD+"]";
                              } else if( record.data.USE_CD && record.data.NUMB_MTH ) {
                                  return "["+record.data.USE_CD+"]/" + record.data.NUMB_MTH;
                              } else {
                                  return "";
                              }
                            },
                            editor: {
                                xtype: 'textarea',
                                grow : true,
                                // selectOnFocus: false
                            },
                        },
                        { text: 'NOTE',  header: '<div style="text-align:center;width:100%;"><div class="grid-header-textarea"></div>Note</div>',dataIndex: 'COLMN_DESC', flex: 1, minWidth :100, width : 100, visible : false, sort : false, cellWrap: true, 
                           editor :  {
                                xtype: 'textarea', // 'htmleditor',
                                grow : true,
                                enableColors: true,
                                enableAlignments: false
                           }   
                        },
                         <c:forEach var="item" items="${data}">
                        { text: '${item.CD_NM}', dataIndex: '${item.CD}', headerCheckbox: true, xtype: 'checkcolumn', align: "center", width : 65, menuDisabled : true, resizable : false,  sort : true,
                              listeners : {
                                  headercheckchange: function(checkColumn, checked) {
                                       console.log("Header Checkbox change event: ", checked);
                                       
                                       var store = Ext.getStore("columnListStore");
                                       
                                       for(var i=0; i < store.getCount() ; i++ ) {
                                            store.getAt(i).set("${item.CD}", checked );
                                            
                                            console.log( i, '${item.CD}', store.getAt(i).get("${item.CD}") );
                                       }
                                  },
                                  checkchange : function( _this, rowIndex, checked, record, e, eOpts ) {
                                      //if( record.get("PK_YN_BOOL")==true ) {
                                      //    record.set("NOTNULL_YN", record.get("PK_YN_BOOL" ));
                                      //}
                                      
                                  }
                              }
                        },
                         </c:forEach>
                    ]
                }, 