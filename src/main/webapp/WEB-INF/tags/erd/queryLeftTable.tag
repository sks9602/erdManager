<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

                    {
                        xtype: 'panel',
                        layout: 'border',
                        border : false,
                        items : [
                            {
                                region: 'north',
                                title: '테이블 검색조건',
                                height : 50+(24*4),
                                xtype : 'formPanel_ux',
                                collapsible : true,
                                id : 'tableForm',
                                border : false,
                                bbar : ['->',
                                        <tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    if( this.up('form').getForm().isValid() ) {
                                                        var me = this;
                                                        var store = Ext.getStore("entityListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                                    }
                                                }
                                            }
                                        </tagErd:button>
                                        <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    if( this.up('form').getForm().isValid() ) {
                                                        var me = this;
                                                        var store = Ext.getStore("entityListStore");
                                                        
                                                        store.clearFilter();
                                                        // store.load();
                                                        
                                                        store.filterBy(function(record) {
                                                            var entityNms = Ext.getCmp("LEFT_TABLE_ENTITY_NMS").getValue();
                                                        
                                                            var exactYn   = Ext.getCmp("LEFT_TABLE_EXACT_YN").checked;
                                                            var favorYn   = Ext.getCmp("LEFT_TABLE_FAVOR_YN").checked;
                                                            
                                                            var tablScd = Ext.getCmp("LEFT_TABLE_TABL_SCD").getValue();
                                                            
                                                            var entityNmArr = entityNms.split(";");
                         
                                                            var isFilterd = false;
                                                            
	                                                        if( entityNms == "" && favorYn == false && tablScd == ""  ) {
	                                                            return true;
	                                                        }
	                                                        
	                                                        if(entityNms == "" ) {
	                                                            isFilterd = true;
	                                                        } else {
		                                                        for( var i=0; i < entityNmArr.length; i++) {
	                                                                if( exactYn == true) {
	                                                                    isFilterd = record.get('ENTITY_NM')==entityNmArr[i].toUpperCase() || record.get('TABL_NM')==entityNmArr[i].toUpperCase();
	                                                                } else {
	                                                                    isFilterd = record.get('ENTITY_NM').indexOf(entityNmArr[i].toUpperCase())>=0 || record.get('TABL_NM').indexOf(entityNmArr[i].toUpperCase())>=0;
	                                                                }
		                                                            if( isFilterd ) {
	                                                                    break;
	                                                                }
		                                                        }
		                                                    }
		                                                    
		                                                    if( isFilterd && favorYn == true ) {
		                                                        if( record.get('FAVOR_YN') == "Y" ) {
		                                                            isFilterd = true;
		                                                        } else {
		                                                            isFilterd = false;
		                                                        }
		                                                    }
		                                                    
		                                                    if( isFilterd && tablScd  != "") {
		                                                        if( record.get('TABL_SCD_ALL').indexOf(tablScd) >= 0 ) {
		                                                            isFilterd = true;
		                                                        } else {
                                                                    isFilterd = false;
                                                                }
		                                                    }
		                                                    return isFilterd;
                                                        });
                                                    }
                                                }
                                            }
                                        </tagErd:button>
                                ],
                                items : [
                                    <tagErd:itemText type="textfield_ux" label="테이블" id="LEFT_TABLE_ENTITY_NMS" name="ENTITY_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                        var store = Ext.getStore("entityListStore");
                                                        
                                                        store.clearFilter();
                                                        // store.load();
                                                        
                                                        store.filterBy(function(record) {
                                                            var entityNms = Ext.getCmp("LEFT_TABLE_ENTITY_NMS").getValue();
                                                        
                                                            var exactYn   = Ext.getCmp("LEFT_TABLE_EXACT_YN").checked;
                                                            var favorYn   = Ext.getCmp("LEFT_TABLE_FAVOR_YN").checked;
                                                            
                                                            var tablScd = Ext.getCmp("LEFT_TABLE_TABL_SCD").getValue();
                                                            
                                                            var entityNmArr = entityNms.split(";");
                         
                                                            var isFilterd = false;
                                                            
                                                            if( entityNms == "" && favorYn == false && tablScd == ""  ) {
                                                                return true;
                                                            }
                                                            
                                                            if(entityNms == "" ) {
                                                                isFilterd = true;
                                                            } else {
                                                                for( var i=0; i < entityNmArr.length; i++) {
                                                                    if( exactYn == true) {
                                                                        isFilterd = record.get('ENTITY_NM')==entityNmArr[i].toUpperCase() || record.get('TABL_NM')==entityNmArr[i].toUpperCase();
                                                                    } else {
                                                                        isFilterd = record.get('ENTITY_NM').indexOf(entityNmArr[i].toUpperCase())>=0 || record.get('TABL_NM').indexOf(entityNmArr[i].toUpperCase())>=0;
                                                                    }
                                                                    if( isFilterd ) {
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            
                                                            if( isFilterd && favorYn == true ) {
                                                                if( record.get('FAVOR_YN') == "Y" ) {
                                                                    isFilterd = true;
                                                                } else {
                                                                    isFilterd = false;
                                                                }
                                                            }
                                                            
                                                            if( isFilterd && tablScd  != "") {
                                                                if( record.get('TABL_SCD_ALL').indexOf(tablScd) >= 0 ) {
                                                                    isFilterd = true;
                                                                } else {
                                                                    isFilterd = false;
                                                                }
                                                            }
                                                            return isFilterd;
                                                        });
                                                    }
                                                });
                                            },
                                        }
                                    </tagErd:itemText>
                                    <tagErd:itemCheckbox type="checkbox_ux" id="LEFT_TABLE_EXACT_YN" name="EXACT_YN" boxLabel="정확히 일치하는 테이블만 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemCheckbox type="checkbox_ux" id="LEFT_TABLE_FAVOR_YN" name="FAVOR_YN" boxLabel="자주찾는 테이블 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemCode type="ext-js-combobox" label="관리상태" id="LEFT_TABLE_TABL_SCD"  name="TABL_SCD" cdGrp="TABL_SCD" firstText="전체" value=""></tagErd:itemCode>
                                ]
                           }, 
                           {   xtype : 'gridpanel',
                               region: 'center',
                               columnLines: true,
                               plugins: {
                                    cellediting: {
                                        editing : true,
                                        clicksToEdit: 1
                                    }
                               },
                               id : 'queryLeftTableColumn_gridpanel',
                               title : '테이블',
                               <tagErd:store type="store" id="entityListStore" idProperty="ENTITY_ID" url="/entity/data/list.do" rootProperty="data" expanded="true" params="PROJECT_ID : 'PROJECT'">
                                    // fields: store.tag로 이동
                               </tagErd:store>
                               tbar : [
                                   '->',
                                   <tagErd:button type="button" label="저장" iconCls="search" cls="btn_segmentedbutton"  id="btn_tableColumnSave">
			                            disabled : false ,
			                            listeners : {
			                                click : function(_this, e, eOpts) { 
			                                    var gridColumn = Ext.getCmp("queryLeftTableColumn_gridpanel");
			                                    gridColumn.submit('changed', '/entity/data/aliasSave.do', {
			                                        showSaving : true,
			                                        callback : function(form, success, response) {
			                                            
			                                        
			                                            var store = Ext.getStore("entityListStore");
			                                            store.reload();
			                                            Ext.getStore("entityListStore").load({page : 1, limit : 999999 , params: { 'PROJECT_ID' : 'PROJECT' }});
			                                            
			                                            // 테이블+컬럼 재조회 후 filter
			                                            Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: {}}); 
			                                            Ext.getCmp("LEFT_ALL_TABLE_BTN_SEARCH").fireEvent ( "click", [] ); 
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
                               columns: [
                                   { xtype: 'rownumberer'},
                                   { header: '<div style="text-align:center;width:100%;">테이블 논리 명</div>', dataIndex: 'TABL_NM', flex: 1, minWidth : 120,
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                           var link = new Array();
                                           if( record.get("USE_YN") == "N") {
                                                link.push('<span class="link" id="entity_'+ record.data.ENTITY_NM +'"><del>'+ record.data.TABL_NM +'</del></span>');
                                           } else {
                                                link.push('<span class="link" id="entity_'+ record.data.ENTITY_NM +'">'+ (record.get("FAVOR_YN") == "Y" ? "*" : "") + record.data.TABL_NM +'</span>');
                                           }
                            
                                           return link.join(' ');
                                       },
                                       listeners : {
                                           click : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                                e.stopEvent();

                                                // Ext.getCmp("TABLE_PANEL").setWidth(200)
                                                Ext.getCmp("TABLE_COLUMN_PANEL").setWidth(700)
                                                Ext.getCmp("rightSqlArea-PANEL").setWidth(400)
                                                                                                            
                                                var tablNms = Ext.getCmp("LEFT_ALL_TABLE_TABL_NMS");
                                                var entityNms = Ext.getCmp("LEFT_ALL_TABLE_ENTITY_NMS");
                                                
                                                var _valTablNms = tablNms.getValue();
                                                var _valEntityNms = entityNms.getValue();
                                                
                                                var valTablNms = _valTablNms; //  ? _valTablNms+";" : "";
                                                var valEntityNms = _valEntityNms; //  ? _valEntityNms+";" : "";
                                               
                                                if( valTablNms.indexOf(record.get("TABL_NM")+";" ) < 0) {
                                                    tablNms.setValue(valTablNms+ record.get("TABL_NM")+";");
                                                } else {
                                                    tablNms.setValue(tablNms.getValue().replace(record.get("TABL_NM")+";", ""));
                                                }
                                                if( valEntityNms.indexOf(record.get("ENTITY_NM")+";" ) < 0) {
                                                    entityNms.setValue(valEntityNms+ record.get("ENTITY_NM")+";");
                                                } else {
                                                    entityNms.setValue(entityNms.getValue().replace(record.get("ENTITY_NM")+";", ""));
                                                }
                                                Ext.getCmp("LEFT_ALL_TABLE_BTN_SEARCH").fireEvent ( "click", [] ); 
                                                
                                                var items = new Array;
                                                
                                                var events = new Array();
                                                
                                                events.push({SQL_SYNTAX_ID : "INSERT-VALUE", SQL_SYNTAX_NM : "[DML] INSERT-VALUE" }  );
                                                events.push({SQL_SYNTAX_ID : "INSERT-SELECT", SQL_SYNTAX_NM : "[DML] INSERT-SELECT" });
                                                events.push({SQL_SYNTAX_ID : "UPDATE", SQL_SYNTAX_NM : "[DML] UPDATE" }              );
                                                events.push({SQL_SYNTAX_ID : "MERGE", SQL_SYNTAX_NM : "[DML] MERGE" }                );
                                                events.push({SQL_SYNTAX_ID : "DELETE", SQL_SYNTAX_NM : "[DML] DELETE" }              );
                                                events.push({SQL_SYNTAX_ID : "SELECT", SQL_SYNTAX_NM : "[DML] SELECT" }              );
                                                events.push({SQL_SYNTAX_ID : "SELECT-JOIN", SQL_SYNTAX_NM : "[DML] SELECT-JOIN" }              );
                                                
                                                events.push({SQL_SYNTAX_ID : "Value-Object_LOMBOK", SQL_SYNTAX_NM : "[JAVA] Value Object(LOMBOK)" }              );
                                                events.push({SQL_SYNTAX_ID : "Value-Object_GETTER_SETTER", SQL_SYNTAX_NM : "[JAVA] Value Object(GETTER/SETTER)" }              );

                                                events.push({SQL_SYNTAX_ID : "INIT", SQL_SYNTAX_NM : "쿼리생성영역 초기화" }              );
                                                
                                                events.push({SQL_SYNTAX_ID : "CREATE TABLE", SQL_SYNTAX_NM : "[DDL] CREATE TABLE" }  );
                                                events.push({SQL_SYNTAX_ID : "ALTER TABLE", SQL_SYNTAX_NM : "[DDL] ALTER TABLE" }    );
                                                events.push({SQL_SYNTAX_ID : "DROP TABLE", SQL_SYNTAX_NM : "[DDL] DROP TABLE" }      );
                                                events.push({SQL_SYNTAX_ID : "RENAME TABLE", SQL_SYNTAX_NM : "[DDL] RENAME TABLE" }  );

                                                    
                                                for( var i=0; i < events.length; i++) {
                                                    if( events[i]["SQL_SYNTAX_ID"] == "Value-Object_LOMBOK" || events[i]["SQL_SYNTAX_ID"] == "CREATE TABLE" ) {
	                                                    items.push({
	                                                        xtype: 'menuseparator'
	                                                    });  
	                                                }
	                                                
	                                                items.push(Ext.create('Ext.Action', {
	                                                    text: '['+record.data.TABL_NM+'] '+events[i]["SQL_SYNTAX_NM"],
	                                                    syntaxId : events[i]["SQL_SYNTAX_ID"],
	                                                    disabled : false,
	                                                    handler : function(_this, evt) {
	                                                        Ext.getCmp("queryCenterQueryOption_SQL_SYNTAX").setValue(_this.config.syntaxId );
	                                                        
	                                                        var store = Ext.getStore("tableLayoutStore");
	                                                        
	                                                        var storeOption = Ext.getStore("queryCenterQueryOption_store");
	                                                        
	                                                        storeOption.removeAll();
	                                                        
	                                                        store.each(function(recordColumn){
	                                                           //if( recordColumn.get("ENTITY_ID") == record.get("ENTITY_ID")) {
	                                                               storeOption.add( recordColumn );
	                                                           //}
	                                                        });
                                                            
                                                            
                                                            Ext.getCmp("queryCenterQueryOption_btnMakeQuery").fireEvent ( "click", [] );
	                                                           
			                                                Ext.getCmp("TABLE_PANEL").setWidth(200)
			                                                Ext.getCmp("TABLE_COLUMN_PANEL").setWidth(200)
			                                                Ext.getCmp("rightSqlArea-PANEL").setWidth(800)

	                                                    }
	                                                }));
                                                }
                                                
                                                var contextMenu = Ext.create('Ext.menu.Menu', {
                                                     items: items
                                                });
                                                contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                                 
                                                
                                            }
                                       }
                                   },
                                   { header: '<div style="text-align:center;width:100%;">테이블 물리 명</div>', dataIndex: 'ENTITY_NM', flex: 1, minWidth : 120, },
                                   { header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>ALIAS</div>', dataIndex: 'ALIAS_NM', width : 70, 
                                        editor: {
                                           xtype : 'textfield',
                                        }
                                   },
                                   { header: '<div style="text-align:center;width:100%;">객체유형</div>', align:'center',  dataIndex: 'ENTITY_TCD', width:55, },
                                   { header: '<div style="text-align:center;width:100%;">반영상태</div>', dataIndex: 'TABL_SCD_NM', align:'left', width : 100, },
                               ]
                           }
                         ]
                      },