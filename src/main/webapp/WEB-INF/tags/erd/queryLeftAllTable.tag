<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

               {
                   xtype: 'panel',
                   layout: 'border',
                   border : false,
                   items : [
                            {
                                region: 'north',
                                title: '검색조건',
                                height : 55+(23*6),
                                border : false,
                                xtype : 'formPanel_ux',
                                collapsible : true,
                                id : 'tableLayoutForm',
                                layout: { type: 'table' , columns: 1 },
                                bbar : ['->',
                                   <tagErd:button type="button" label="초기화" iconCls="search" cls="btn_segmentedbutton">
                                       listeners : {
                                           click : function(_this, e, eOpts) { 
                                               Ext.getCmp("LEFT_ALL_TABLE_TABL_NMS").setValue('');
                                               Ext.getCmp("LEFT_ALL_TABLE_ENTITY_NMS").setValue('');

                                               var store = Ext.getStore("tableLayoutStore");
                                               store.clearFilter(true);
                                               
                                               store.filterBy(function(record) {
                                                   return true;
                                               })
                                           }
                                       }
                                   </tagErd:button>
                                   <tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
                                       listeners : {
                                           click : function(_this, e, eOpts) { 
                                               if( this.up('form').getForm().isValid() ) {
                                                   var me = this;
                                                   var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: {}}); 
                                               
                                                   console.log( store )
                                               }
                                           }
                                       }
                                   </tagErd:button>

                                   <tagErd:button type="button" label="검색" id="LEFT_ALL_TABLE_BTN_SEARCH" iconCls="search" cls="btn_segmentedbutton">
                                       listeners : { 
                                           click : function(_this, e, eOpts) { 
                                               if( this.up('form').getForm().isValid() ) {
                                                   var me = this;
                                                   //console.log( me.up('form').getValues )
                                                   // var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                                   var store = Ext.getStore("tableLayoutStore");
                                                   
                                                   store.clearFilter(true);

                                                   store.filterBy(function(record) {
                                                        var tablNms = Ext.getCmp("LEFT_ALL_TABLE_TABL_NMS").getValue();
                                                        var entityNms = Ext.getCmp("LEFT_ALL_TABLE_ENTITY_NMS").getValue();
                                                        var colmnNms = Ext.getCmp("LEFT_ALL_TABLE_COLUMN_NMS").getValue();
                                                        
                                                        var tablExactYn   = Ext.getCmp("LEFT_ALL_TABLE_TABL_NM_EXACT_YN").checked;
                                                        var exactYn   = Ext.getCmp("LEFT_ALL_TABLE_EXACT_YN").checked;
                                                        var colmnExactYn   = Ext.getCmp("LEFT_ALL_TABLE_EXACT_COLUMN_YN").checked;
                                                        
                                                        
                                                        var tablNmArr = tablNms.split(";");
                                                        var entityNmArr = entityNms.split(";");
                                                        var colmnNmsArr = colmnNms.split(";");
                                                        
                                                        var isFilterd = false;
                                                        
                                                        if( tablNms == "" && entityNms == "" && colmnNms == ""  ) {
                                                            return true;
                                                        }
                                                        
                                                        for( var i=0; i < tablNmArr.length; i++) {
                                                            if( tablExactYn == true) {
                                                                isFilterd = record.get('TABL_NM')==tablNmArr[i].toUpperCase();
                                                            } else {
                                                                isFilterd = record.get('TABL_NM').indexOf(tablNmArr[i].toUpperCase())>=0;
                                                            }
                                                            
                                                            if( isFilterd ) {
                                                                break;
                                                            }
                                                        }
                                                        
                                                        
                                                        if( isFilterd) {
	                                                        for( var i=0; i < entityNmArr.length; i++) {
	                                                            if( exactYn == true) {
	                                                                isFilterd = record.get('ENTITY_NM')==entityNmArr[i].toUpperCase();
	                                                            } else {
	                                                                isFilterd = record.get('ENTITY_NM').indexOf(entityNmArr[i].toUpperCase())>=0;
	                                                            }
	                                                            
	                                                            if( isFilterd ) {
	                                                                break;
	                                                            }
	                                                        }
                                                        }
                                                        
                                                        if( colmnNms != "") {
	                                                        for( var i=0; i < colmnNmsArr.length; i++) {
	                                                             if( colmnExactYn == true) {
	                                                                 isFilterd = record.get('COLMN_NM')==colmnNmsArr[i].toUpperCase()||record.get('ATTR_NM')==colmnNmsArr[i].toUpperCase();
	                                                             } else {
	                                                                 isFilterd = record.get('COLMN_NM').indexOf(colmnNmsArr[i].toUpperCase())>=0||record.get('ATTR_NM').indexOf(colmnNmsArr[i].toUpperCase())>=0;
	                                                             }
	                                                        }
	                                                    }
                                                        
                                                        return isFilterd;
                                                   })
                                               }
                                           }
                                        }
                                  </tagErd:button>
                                ],
                                items : [
                                    <tagErd:itemText type="textfield_ux" label="테이블 논리 명" id="LEFT_ALL_TABLE_TABL_NMS" name="ATTR_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
		                                                   var me = this;
		                                                   //console.log( me.up('form').getValues )
		                                                   // var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
		                                                   var store = Ext.getStore("tableLayoutStore");
		                                                   
		                                                   store.clearFilter();
		                                                   // store.load();
		                                                   
		                                                   store.filterBy(function(record) {
                                                                var tablNms = Ext.getCmp("LEFT_ALL_TABLE_TABL_NMS").getValue();
                                                                var entityNms = Ext.getCmp("LEFT_ALL_TABLE_ENTITY_NMS").getValue();
                                                                var colmnNms = Ext.getCmp("LEFT_ALL_TABLE_COLUMN_NMS").getValue();
                                                                
                                                                var tablExactYn   = Ext.getCmp("LEFT_ALL_TABLE_TABL_NM_EXACT_YN").checked;
                                                                var exactYn   = Ext.getCmp("LEFT_ALL_TABLE_EXACT_YN").checked;
                                                                var colmnExactYn   = Ext.getCmp("LEFT_ALL_TABLE_EXACT_COLUMN_YN").checked;
                                                                
                                                                
                                                                var tablNmArr = tablNms.split(";");
                                                                var entityNmArr = entityNms.split(";");
                                                                var colmnNmsArr = colmnNms.split(";");
                                                                
                                                                var isFilterd = false;
                                                                
                                                                if( tablNms.length == 0 && entityNms.length == 0 && colmnNms.length == 0  ) {
                                                                    return true;
                                                                }
                                                                for( var i=0; i < tablNmArr.length; i++) {
                                                                    if( tablExactYn == true) {
                                                                        isFilterd = record.get('TABL_NM')==tablNmArr[i].toUpperCase();
                                                                    } else {
                                                                        isFilterd = record.get('TABL_NM').indexOf(tablNmArr[i].toUpperCase())>=0;
                                                                    }
                                                                    
                                                                    if( isFilterd ) {
                                                                        break;
                                                                    }
                                                                }
                                                                if( isFilterd) {
                                                                    for( var i=0; i < entityNmArr.length; i++) {
                                                                        if( exactYn == true) {
                                                                            isFilterd = record.get('ENTITY_NM')==entityNmArr[i].toUpperCase();
                                                                        } else {
                                                                            isFilterd = record.get('ENTITY_NM').indexOf(entityNmArr[i].toUpperCase())>=0;
                                                                        }
                                                                        
                                                                        if( isFilterd ) {
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                                
                                                                if( colmnNms != "") {
                                                                    for( var i=0; i < colmnNmsArr.length; i++) {
                                                                         if( colmnExactYn == true) {
                                                                             isFilterd = record.get('COLMN_NM')==colmnNmsArr[i].toUpperCase()||record.get('ATTR_NM')==colmnNmsArr[i].toUpperCase();
                                                                         } else {
                                                                             isFilterd = record.get('COLMN_NM').indexOf(colmnNmsArr[i].toUpperCase())>=0||record.get('ATTR_NM').indexOf(colmnNmsArr[i].toUpperCase())>=0;
                                                                         }
                                                                    }
                                                                }
		                                                        return isFilterd;
		                                                   })
                                               
                                                     }
                                                });
                                            },
                                        }
                                    </tagErd:itemText>
                                    <tagErd:itemCheckbox type="checkbox_ux" id="LEFT_ALL_TABLE_TABL_NM_EXACT_YN" name="ATTR_EXACT_YN" boxLabel="정확히 일치하는 테이블" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemText type="textfield_ux" label="테이블 물리 명" id="LEFT_ALL_TABLE_ENTITY_NMS" name="ENTITY_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                           var me = this;
                                                           //console.log( me.up('form').getValues )
                                                           // var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                                           var store = Ext.getStore("tableLayoutStore");
                                                           
                                                           store.clearFilter();
                                                           store.load();
                                                           
                                                           store.filterBy(function(record) {
                                                                var tablNms = Ext.getCmp("LEFT_ALL_TABLE_TABL_NMS").getValue();
                                                                var entityNms = Ext.getCmp("LEFT_ALL_TABLE_ENTITY_NMS").getValue();
                                                                var colmnNms = Ext.getCmp("LEFT_ALL_TABLE_COLUMN_NMS").getValue();
                                                                
                                                                var tablExactYn   = Ext.getCmp("LEFT_ALL_TABLE_TABL_NM_EXACT_YN").checked;
                                                                var exactYn   = Ext.getCmp("LEFT_ALL_TABLE_EXACT_YN").checked;
                                                                var colmnExactYn   = Ext.getCmp("LEFT_ALL_TABLE_EXACT_COLUMN_YN").checked;
                                                                
                                                                
                                                                var tablNmArr = tablNms.split(";");
                                                                var entityNmArr = entityNms.split(";");
                                                                var colmnNmsArr = colmnNms.split(";");
                                                                
                                                                var isFilterd = false;
                                                                
                                                                if( tablNms.length == 0 && entityNms.length == 0 && colmnNms.length == 0  ) {
                                                                    return true;
                                                                }
                                                                for( var i=0; i < tablNmArr.length; i++) {
                                                                    if( tablExactYn == true) {
                                                                        isFilterd = record.get('TABL_NM')==tablNmArr[i].toUpperCase();
                                                                    } else {
                                                                        isFilterd = record.get('TABL_NM').indexOf(tablNmArr[i].toUpperCase())>=0;
                                                                    }
                                                                    
                                                                    if( isFilterd ) {
                                                                        break;
                                                                    }
                                                                }
                                                                if( isFilterd) {
                                                                    for( var i=0; i < entityNmArr.length; i++) {
                                                                        if( exactYn == true) {
                                                                            isFilterd = record.get('ENTITY_NM')==entityNmArr[i].toUpperCase();
                                                                        } else {
                                                                            isFilterd = record.get('ENTITY_NM').indexOf(entityNmArr[i].toUpperCase())>=0;
                                                                        }
                                                                        
                                                                        if( isFilterd ) {
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                                
                                                                if( colmnNms != "") {
                                                                    for( var i=0; i < colmnNmsArr.length; i++) {
                                                                         if( colmnExactYn == true) {
                                                                             isFilterd = record.get('COLMN_NM')==colmnNmsArr[i].toUpperCase()||record.get('ATTR_NM')==colmnNmsArr[i].toUpperCase();
                                                                         } else {
                                                                             isFilterd = record.get('COLMN_NM').indexOf(colmnNmsArr[i].toUpperCase())>=0||record.get('ATTR_NM').indexOf(colmnNmsArr[i].toUpperCase())>=0;
                                                                         }
                                                                    }
                                                                }
                                                                
                                                                return isFilterd;
                                                           })
                                                   }
                                                });
                                            },
                                        }
                                    </tagErd:itemText>
                                    <tagErd:itemCheckbox type="checkbox_ux" id="LEFT_ALL_TABLE_EXACT_YN" name="EXACT_YN" boxLabel="정확히 일치하는 테이블" value="Y" checked="true"></tagErd:itemCheckbox>
                                    <tagErd:itemText type="textfield_ux" label="컬럼 명" id="LEFT_ALL_TABLE_COLUMN_NMS"  name="COLUMN_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                           var me = this;
                                                           //console.log( me.up('form').getValues )
                                                           // var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                                           var store = Ext.getStore("tableLayoutStore");
                                                           
                                                           store.clearFilter();
                                                           store.load();
                                                           
                                                           store.filterBy(function(record) {
                                                                var tablNms = Ext.getCmp("LEFT_ALL_TABLE_TABL_NMS").getValue();
                                                                var entityNms = Ext.getCmp("LEFT_ALL_TABLE_ENTITY_NMS").getValue();
                                                                var colmnNms = Ext.getCmp("LEFT_ALL_TABLE_COLUMN_NMS").getValue();
                                                                
                                                                var tablExactYn   = Ext.getCmp("LEFT_ALL_TABLE_TABL_NM_EXACT_YN").checked;
                                                                var exactYn   = Ext.getCmp("LEFT_ALL_TABLE_EXACT_YN").checked;
                                                                var colmnExactYn   = Ext.getCmp("LEFT_ALL_TABLE_EXACT_COLUMN_YN").checked;
                                                                
                                                                
                                                                var tablNmArr = tablNms.split(";");
                                                                var entityNmArr = entityNms.split(";");
                                                                var colmnNmsArr = colmnNms.split(";");
                                                                
                                                                var isFilterd = false;
                                                                
                                                                if( tablNms.length == 0 && entityNms.length == 0 && colmnNms.length == 0  ) {
                                                                    return true;
                                                                }
                                                                for( var i=0; i < tablNmArr.length; i++) {
                                                                    if( tablExactYn == true) {
                                                                        isFilterd = record.get('TABL_NM')==tablNmArr[i].toUpperCase();
                                                                    } else {
                                                                        isFilterd = record.get('TABL_NM').indexOf(tablNmArr[i].toUpperCase())>=0;
                                                                    }
                                                                    
                                                                    if( isFilterd ) {
                                                                        break;
                                                                    }
                                                                }
                                                                if( isFilterd) {
                                                                    for( var i=0; i < entityNmArr.length; i++) {
                                                                        if( exactYn == true) {
                                                                            isFilterd = record.get('ENTITY_NM')==entityNmArr[i].toUpperCase();
                                                                        } else {
                                                                            isFilterd = record.get('ENTITY_NM').indexOf(entityNmArr[i].toUpperCase())>=0;
                                                                        }
                                                                        
                                                                        if( isFilterd ) {
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                                
                                                                if( colmnNms != "") {
                                                                    for( var i=0; i < colmnNmsArr.length; i++) {
                                                                         if( colmnExactYn == true) {
                                                                             isFilterd = record.get('COLMN_NM')==colmnNmsArr[i].toUpperCase()||record.get('ATTR_NM')==colmnNmsArr[i].toUpperCase();
                                                                         } else {
                                                                             isFilterd = record.get('COLMN_NM').indexOf(colmnNmsArr[i].toUpperCase())>=0||record.get('ATTR_NM').indexOf(colmnNmsArr[i].toUpperCase())>=0;
                                                                         }
                                                                    }
                                                                }
                                                                
                                                                return isFilterd;
                                                           })
                                                    }
                                                });
                                            },
                                        },
                                    </tagErd:itemText>
                                    <tagErd:itemCheckbox type="checkbox_ux" id="LEFT_ALL_TABLE_EXACT_COLUMN_YN" name="EXACT_COLUMN_YN" boxLabel="정확히 일치하는 컬럼" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemText type="hiddenfield" label="컬럼 명" id="LEFT_ALL_TABLE_USER_CHANGE_YN"  name="USER_CHANGE_YN" value="N">
                                    </tagErd:itemText>
                                ]
                            }, 
                            {   xtype : 'gridpanel',
                                columnLines: true,
                                region: 'center',
                                enableDragDrop: true,
                                enableLocking:true,
                                rowLines : true,
                                id : 'tableLayoutList',
                                //border : true,
                                collapsible: false,
                                title : '전체 테이블/컬럼 목록',
                                rootVisible: false,
                                multiSelect: true,
                                selType: 'checkboxmodel',
                                selModel: {
                                    checkOnly: false,
                                    injectCheckbox: 0,
                                    mode: 'MULTI'
                                },
                                scrollable:true,
                                
                                tbar : ['->',
                                    <tagErd:button type="button" label="모두 펼치기" iconCls="expandAll" cls="btn_segmentedbutton">
                                         listeners : {
                                            click : function(_button, e, eOpts) {
                                                 var grid = Ext.getCmp('tableLayoutList');
                                                 grid.getView().lockedView.features[0].expandAll();
                                            }
                                         }
                                    </tagErd:button>
                                    <tagErd:button type="button" label="모두 접기" iconCls="collapseAll" cls="btn_segmentedbutton">
                                        listeners : {
                                           click : function(_button, e, eOpts) {
                                               var grid = Ext.getCmp('tableLayoutList');
                                               console.log( grid.getView().lockedView );
                                               grid.getView().lockedView.features[0].collapseAll(); // normalView
                                           }
                                        }
                                   </tagErd:button>
                                    <tagErd:button type="button" label=">" iconCls="collapseAll" cls="btn_segmentedbutton">
                                        listeners : {
                                           click : function(_button, e, eOpts) {
			                                    var tableLayoutListGrid = Ext.getCmp("tableLayoutList");
			                                    var selectedRecords = tableLayoutListGrid.getSelectionModel().getSelection();
			
			                                    var queryCenterQueryOption_gridpanel = Ext.getCmp("queryCenterQueryOption_gridpanel");
			                                    var queryCenterQueryOption_Store = Ext.getStore("queryCenterQueryOption_store");
			                                    for( var i=0 ; i < selectedRecords.length; i++) {
			                                        if( queryCenterQueryOption_Store.find("COLUMN_ID", selectedRecords[i].get("COLUMN_ID")) < 0  ) {
			                                             selectedRecords[i].set("INDENT", 1);
			                                             queryCenterQueryOption_Store.add(selectedRecords[i]);
			                                        }
			                                        // Ext.getStore("tableColumnListStore").remove(selectedRecords[i]);
			                                    }
                                            }
                                        }
                                   </tagErd:button>
                                ],
                                <tagErd:store type="store" id="tableLayoutStore" idProperty="COLMN_ID" groupField="ENTITY_UNIQUE_NM"  url="/entity/data/entityColumList.do" rootProperty="data" params="PROJECT_ID : 'PROJECT'" autoLoad="true">
                                     // fields: store.tag로 이동
                                     groupField : 'ENTITY_UNIQUE_NM',

                                     listeners : {
                                        load : function(_this, records, successful, operation, eOpts ){
                                           /*
                                           _this.sort([{
                                                property : 'ENTITY_UNIQUE_NM',
                                                direction: 'ASC'
                                            }, {
                                                property : 'PK_YN',
                                                direction: 'DESC'
                                            }, {
                                                property : 'RNUM',
                                                direction: 'ASC'
                                            }]);
                                            */
                                        }, 
                                        datachanged : function( _this, eOpts) {
                                            // console.log( _this )
                                        
                                        },
                                        update : function( _this, record, operation, modifiedFieldNames, details, eOpts ) {
                                            // console.log( _this )
                                            // console.log( record )
                                        } 
                                     },
                                </tagErd:store>
                                features: [{
                                    id: 'group',
                                    // ftype: 'groupingsummary',
                                    ftype: 'checkboxGrouping',
                                    // collapsible : false,
                                    groupHeaderTpl: ['{name:this.formatName}',
                                                        {
                                                            formatName: function(name) {
                                                                return name.substring(0, name.indexOf('@'));
                                                            }
                                                        }
                                                     ],
                                    hideGroupedHeader: true,
                                    enableGroupingMenu: false,
                                    showSummaryRow : false,
                                }],
                                /*
                                plugins: {
                                    cellediting: {
                                        editing : true,
                                        clicksToEdit: 1
                                    }
                                },
                                */
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
                                        
                                        groupclick: function (view, node, group, e, eOpts) {
                                        // groupcontextmenu: function (view, node, group, e, eOpts) {
                                        // groupdblclick: function (view, node, group, e, eOpts) {
                                            /*
                                            console.log( view.features[0].expand )
                                            view.features[0].collapseAll();
                                            view.features[0].expand(group);
                                            */
                                            /*
                                            var store = Ext.getStore("tableLayoutStore");
                                            console.log( node);
                                            console.log( group);
                                            
                                            var selections = [];
                                            store.each(function(recordColumn){
                                                if( group == recordColumn.get("ENTITY_UNIQUE_NM")) {
                                                    selections.push(recordColumn);
                                                }
                                            });
                                            
                                            view.getSelectionModel().select( selections );
                                            */
                                        },
                                        
                                        beforeedit : function( sender, location, eOpts )  {
                                            console.log( sender )
                                            console.log( location )
                                        },
                                        edit : function( sender, location, eOpts )  {
                                            // console.log( sender )
                                            // console.log( location )
                                        },
                                        beforedrop : function ( node, data, overModel, dropPosition, dropHandlers, eOpts )  {
                                            
                                            // console.log(node)
                                            // console.log(data)
                                            // console.log(overModel)
                                            // console.log(dropPosition);
                                            // console.log(dropHandlers);
                                            /*
                                            for( var i=0; i < data.records.length; i++ ) {
                                                data.records[i].set("ENTITY_ID", overModel.data["ENTITY_ID"]);
                                                data.records[i].set("ENTITY_UNIQUE_NM", overModel.data["ENTITY_UNIQUE_NM"]);
                                                data.records[i].set("COLMN_ID", "COL-"+Math.floor(Math.random() * 100000));
                                                if( overModel.data["PK_YN"]=="Y" && data.records[i].get("PK_YN") == "Y" ) {
                                                   data.records[i].set("PK_YN", "Y");
                                                } else {
                                                   data.records[i].set("PK_YN", ""  );
                                                }
                                                data.records[i].set("RNUM", "추가");
                                                data.records[i].set("id", Ext.id());
                                                
                                                var rowNum = Ext.getStore("tableLayoutStore").findBy ( function(record){
                                                   console.log(record.get("ENTITY_UNIQUE_NM"), data.records[i].get("ENTITY_UNIQUE_NM"), record.get("COLMN_NM"), data.records[i].get("COLMN_NM")  );
                                                   if( record.get("ENTITY_UNIQUE_NM") == data.records[i].get("ENTITY_UNIQUE_NM") 
                                                       && record.get("COLMN_NM") == data.records[i].get("COLMN_NM") ){
                                                           return record.get('id');
                                                       }
                                                }); 
                                                if( rowNum > 0 ) {
                                                   console.log( "rowNum", rowNum );
                                                   return ;
                                                }
                                                // Ext.getStore("tableLayoutStore").add(data.records[i]);
                                            }
                                            */
                                        },
                                        drop: function(node, data, dropRec, dropPosition) {
                                            
                                            for( var i=0; i < data.records.length; i++ ) {
                                                data.records[i].set("RNUM", (parseInt(dropRec.data["RNUM"]) + ( dropPosition == 'after' ? 1 : -1)));
                                            
                                                if( data.records[i].get("ENTITY_ID") == dropRec.data["ENTITY_ID"] ) {
                                                    continue;
                                                }
                                                data.records[i].set("ENTITY_ID", dropRec.data["ENTITY_ID"]);
                                                data.records[i].set("ENTITY_UNIQUE_NM", dropRec.data["ENTITY_UNIQUE_NM"]);
                                                data.records[i].set("COLMN_ID", "COL-"+Math.floor(Math.random() * 100000));
                                                /*
                                                if( dropRec.data["PK_YN"]=="Y" && data.records[i].get("PK_YN") == "Y" ) {
                                                   data.records[i].set("PK_YN", "Y");
                                                } else {
                                                   data.records[i].set("PK_YN", ""  );
                                                }
                                                */
                                                
                                                data.records[i].set("DML_TCD", "+");
                                                data.records[i].set("id", Ext.id());
                                                
                                                var rowNum = Ext.getStore("tableLayoutStore").findBy ( function(record){
                                                   // console.log(record.get("ENTITY_UNIQUE_NM"), data.records[i].get("ENTITY_UNIQUE_NM"), record.get("COLMN_NM"), data.records[i].get("COLMN_NM")  );
                                                   if( record.get("ENTITY_UNIQUE_NM") == data.records[i].get("ENTITY_UNIQUE_NM") 
                                                       && record.get("COLMN_NM") == data.records[i].get("COLMN_NM")
                                                       && record.get("id")!= data.records[i].get("id") ){
                                                           return record.get('id');
                                                       }
                                                }); 
                                                if( rowNum > 0 ) {
                                                   console.log( "rowNum", rowNum );
                                                   var store = Ext.getStore("tableLayoutStore");
                                                   var record = store.getAt(rowNum);
                                                   // Ext.Msg.alert("알림",record.get("RNUM")+"행의 동일한 컬럼을 삭제합니다.");
                                                   Ext.getStore("tableLayoutStore").removeAt(rowNum);
                                                   
                                                }
                                                // Ext.getStore("tableLayoutStore").add(data.records[i]);
                                            }
                                            
                                            Ext.getStore("tableLayoutStore").sort([{
                                                property : 'ENTITY_UNIQUE_NM',
                                                direction: 'ASC'
                                            }, {
                                                property : 'PK_YN',
                                                direction: 'DESC'
                                            }, {
                                                property : 'RNUM',
                                                direction: 'ASC'
                                            }]);
                                            
                                            var records = Ext.getStore("tableLayoutStore").queryRecords ( "ENTITY_ID", dropRec.data["ENTITY_ID"] );
                                            
                                            var isChange = false;
                                            for( var i=0 ; i < records.length; i++){
                                                if( records[i].get("DML_TCD")!= "" ) {
                                                    isChange = true;
                                                }
                                                if( isChange == false ) {
                                                    continue;
                                                }
                                                records[i].set("RNUM", i+1);
                                            }
                                        }
                                    }
                                },
                                columns: [
                                    { text: 'ENTITY_NM', dataIndex: 'ENTITY_NM', width : 100, menuDisabled : true,  locked : true, resizable : false, sortable : false, 
                                         renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            return value;
                                         }
                                    },
                                    { text: 'NO', header: '<div style="text-align:center;width:100%;">NO</div>', align: "right", dataIndex: 'RNUM', width : 38, resizeable : false, sortable : false, menuDisabled: true, locked : true, 
                                        renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            return record.data.RNUM; // (record.data.DML_TCD ? record.data.DML_TCD : "")  + ""+ record.data.RNUM;
                                        },
                                    },
                                    { text: 'PK', dataIndex: 'PK_YN', width : 28, menuDisabled : true,  locked : true, resizable : false, sortable : false, 
                                         renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            return value == "Y" ? "Y" : "";
                                         }
                                    },
                                    // { text: '컬럼 ID', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 ID</div>', width : 150, sortable: true, dataIndex: 'COLMN_ID' , minWidth : 100, locked : true, },
                                    { text: '컬럼 논리 명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 논리 명</div>', dataIndex: 'ATTR_NM', width : 120, minWidth : 100, locked : true, 
                                        editor: {
                                            allowBlank: false,
                                            selectOnFocus: false
                                        },
                                    },
                                    { text: '컬럼 물리 명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 물리 명</div>', width : 150, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100, locked : true, 
                                        
                                        renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            var link = new Array();
                                            if( value ) {
                                                link.push('<span id="table_column_'+ record.data.COLMN_NM +'">'+ record.data.COLMN_NM +'</span>');
                                            } else {
                                                link.push('<span id="table_column_'+ record.data.COLMN_ID +'">(*컬럼미등록)</span>');
                                            }
                                            return link.join(' ');
                                        },
                                        editor: {
                                            allowBlank: false,
                                            selectOnFocus: false,
                                            // stripCharsRe: /[a-zA-Z0-9\_]*$/g
                                        },
                                    },
                                    { text: '데이터 타입', header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>데이터 타입</div>', dataIndex: 'DATA_TYPE', width : 110, 
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
                                            if( record.get("DOMAIN_DATA_TYPE") != value) {
                                                return '<span style="color:red;" id="column_data_type'+ record.get("COLMN_NM") +'">'+ value +'</span>';
                                            } else {
                                                return value;
                                            }
                                        },
                                        editor: {
                                                    xtype: 'combotreegrid_dataType',
                                                    id : 'combotreegrid_dataType_picker',
                                                    vtype : '${sessionScope._sessionVO.dbase}DataTypeScale', // 'MariaDBDataTypeScale',
                                                 },
                                    },
                                    { text: '<div class="grid-header-combogrid"></div>Not널', dataIndex: 'IS_NULL', align: "center", width : 45, resizable : false,
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
                                    {
                                        text: '기본값', dataIndex: 'DEFAULT_VAL', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>기본값</div>', width : 100, menuDisabled : true, 
                                        editor: {
                                            xtype: 'textfield',
                                        },
                                        renderer : function (value, metaData, record , rowIndex, colIndex, store, view ){
                                            return value;
                                        }
                                    },
                                    { text: '코드/채번방식',  header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>코드/채번방식</div>',dataIndex: 'NUMB_MTH', width : 120, visible : false, align : 'center',
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
                                          return record.data.NUMB_MTH;
                                       },
                                        editor: {
                                            selectOnFocus: false
                                        },
                                    },
                                    { text: 'NOTE',  header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>Note</div>',dataIndex: 'COLMN_DESC', flex: 1, minWidth :100, width : 100, visible : false, 
                                       editor :  {
                                            xtype: 'textarea', // 'htmleditor',
                                            grow : true,
                                            enableColors: false,
                                            enableAlignments: false
                                       }                              
                                    },
                                ]
                            }, 
                        ]
                    },