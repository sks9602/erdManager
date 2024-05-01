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
                                        
                                        <tagErd:button type="button" label="적용" iconCls="search" cls="btn_segmentedbutton">
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    var store = Ext.getStore("tableLayoutStore");
                                                
                                                    store.clearFilter();
                                                    var temp1 = store.getAt ( 20 );
                                                    var temp2 = store.getAt ( 21 );
                                                    var temp3 = store.getAt ( 22 );
                                                    
	                                                store.filterBy(function(record) {
	                                                    var grid = Ext.getCmp("queryLeftTableGrid");
	                                                    var selectedRecords = grid.getSelectionModel().getSelection();
	                                   
	                                                    var isFilterd = false;
	                                                    for( var i=0; i < selectedRecords.length; i++) {
	                                                         if( record.get("ENTITY_ID") == selectedRecords[i].get("ENTITY_ID") ) {
	                                                             isFilterd =true;
	                                                             
	                                                             break;
	                                                         }
	                                                    
	                                                    }
	                                                    
	                                                    return isFilterd;
	                                                });
	                                                console.log( temp1 )
	                                                store.add(temp1);
                                                    store.add(temp2);
                                                    store.add(temp3);
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
                               selType: 'checkboxmodel',
                               id : 'queryLeftTableGrid',
                               selModel: {
                                    checkOnly: false,
                                    injectCheckbox: 0,
                                    mode: 'MULTI'
                               },
                               title : '테이블',
                               <tagErd:store type="store" id="entityListStore" idProperty="ENTITY_ID" url="/entity/data/list.do" rootProperty="data" expanded="true" params="PROJECT_ID : 'PROJECT'">
                                    // fields: store.tag로 이동
                               </tagErd:store>
                               columns: [
                                   { xtype: 'rownumberer'},
                                   { header: '<div style="text-align:center;width:100%;">테이블 논리 명</div>', dataIndex: 'TABL_NM', flex: 1, minWidth : 120,
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                           var link = new Array();
                                           /*
                                           if( record.get("USE_YN") == "N") {
                                                link.push('<span class="link" id="entity_'+ record.data.ENTITY_NM +'"><del>'+ record.data.TABL_NM +'</del></span>');
                                           } else {
                                                link.push('<span class="link" id="entity_'+ record.data.ENTITY_NM +'">'+ (record.get("FAVOR_YN") == "Y" ? "*" : "") + record.data.TABL_NM +'</span>');
                                           }
                                            
                                           return link.join(' ');
                                           */
                                           return (record.get("FAVOR_YN") == "Y" ? "*" : "") + record.data.TABL_NM;
                                       },
                                       listeners : {
                                           click : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                                e.stopEvent();
                                                

                                            }
                                       }
                                   },
                                   { header: '<div style="text-align:center;width:100%;">테이블 물리 명</div>', dataIndex: 'ENTITY_NM', flex: 1, minWidth : 120, },
                                   { header: '<div style="text-align:center;width:100%;">객체유형</div>', align:'center',  dataIndex: 'ENTITY_TCD', width:55, },
                                   { header: '<div style="text-align:center;width:100%;">반영상태</div>', dataIndex: 'TABL_SCD_NM', align:'left', width : 100, },
                               ]
                           }
                         ]
                      },