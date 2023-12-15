<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

                            {
                                region: 'north',
                                title: '검색조건',
                                height : 122,
                                border : false,
                                xtype : 'formPanel_ux',
                                collapsible : true,
                                id : 'tableLayoutForm',
                                layout: { type: 'table' , columns: 3 },
                                bbar : ['->',
                                    <tagErd:button type="button" label="모두 펼치기" iconCls="expandAll" cls="btn_segmentedbutton">
                                         listeners : {
                                            click : function(_button, e, eOpts) {
                                                 var tree = Ext.getCmp('tableLayoutList');
                                                 tree.expandAll();
                                            }
                                         }
                                    </tagErd:button>
                                    <tagErd:button type="button" label="모두 접기" iconCls="collapseAll" cls="btn_segmentedbutton">
                                        listeners : {
                                           click : function(_button, e, eOpts) {
                                               var tree = Ext.getCmp('tableLayoutList');
                                               tree.collapseAll();
                                           }
                                        }
                                   </tagErd:button>
                                   <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
                                       listeners : { 
                                           click : function(_this, e, eOpts) { 
                                               if( this.up('form').getForm().isValid() ) {
                                                   var me = this;
                                                   //console.log( me.up('form').getValues )
                                                   var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                               }
                                           }
                                        }
                                  </tagErd:button>
                                ],
                                items : [
                                    <tagErd:itemText type="textfield_ux" label="테이블" name="ENTITY_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                        var me = this;
                                                        var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                    }
                                                });
                                            },
                                        }
                                    </tagErd:itemText>
                                    <tagErd:itemCheckbox type="checkbox_ux" name="EXACT_YN" boxLabel="정확히 일치하는 테이블" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemCode type="ext-js-combobox" label="테이블 관리상태" name="TABL_SCD" id="TABLE_TABL_SCD_ALL" cdGrp="TABL_SCD" firstText="전체" value=""></tagErd:itemCode>
                                    <tagErd:itemText type="textfield_ux" label="컬럼 명" name="COLUMN_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                        var me = this;
                                                        var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                    }
                                                });
                                            },
                                        },
                                    </tagErd:itemText>
                                    <tagErd:itemCheckbox type="checkbox_ux" name="EXACT_COLUMN_YN" boxLabel="정확히 일치하는 컬럼" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemCode type="ext-js-combobox" label="컬럼 관리상태" name="COLMN_SCD" id="TABLE_COLMN_SCD_ALL" cdGrp="TABL_SCD" firstText="전체" value=""></tagErd:itemCode>
                                   {
                                        xtype: 'combotreegrid_domain',
                                        value : '',
                                        valueText : '전체',
                                        name : 'DOMAIN_ID',
                                        fieldLabel: '도메인',
                                        labelSeparator : '',
                                        width : 300,
                                        style : {padding : "0 3 0 1"},
                                        rootVisible: false,
                                        autoLoad: true,
                                        <tagErd:fields id="DOMAIN"></tagErd:fields>
                                        <tagErd:proxy url="/domain/data/tree.do" rootProperty="CHILDREN" params="PROJECT_ID : 'PROJECT', FIRST : 'ALL'" expanded="true"></tagErd:proxy>
                                     },
                                ]
                            }, 
                            {   xtype : 'gridpanel',
                                columnLines: true,
                                region: 'south',
                                enableDragDrop: true,
                                selType: 'checkboxmodel',
                                selModel: {
                                    checkOnly: false,
                                    injectCheckbox: 1,
                                    mode: 'MULTI'
                                },
                                scrollable:true,
                                title: '컬럼목록',
                                <tagErd:store type="store" id="tableLayoutStore" idProperty="COLMN_ID" groupField="ENTITY_ID" url="/entity/data/columnList.do" rootProperty="data" expanded="false" params="PROJECT_ID : 'PROJECT', ENTITY_ID : 'id_EMP'" autoLoad="true">
                                  // fields: store.tag로 이동
                                </tagErd:store>
                                features: [{
                                    id: 'group',
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: '{name}',
                                    hideGroupedHeader: true,
                                    enableGroupingMenu: false
                                }],
                                /*
                                viewConfig: {
                                    plugins: {
                                        gridviewdragdrop: {
                                            containerScroll: true,
                                            dragGroup: 'dd-grid-to-grid-group2',
                                            dropGroup: 'dd-grid-to-grid-group2'
                                        }
                                    },
                                    listeners: {
                                        drop: function(node, data, dropRec, dropPosition) {
                                            console.log( arguments )
                                        }
                                    }
                                },
                                */
                                columns: [
                                    // { xtype: 'checkcolumn', stopSelection: false, width : 28, menuDisabled : true,},
                                    {
                                        text: 'ENTITY_ID',
                                        flex: 1,
                                        sortable: true,
                                        dataIndex: 'ENTITY_ID',
                                        hideable: false,
                                        summaryType: 'count',
                                        summaryRenderer: function(value, summaryData, dataIndex) {
                                            return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
                                        }
                                    },
                                    { text: 'PK', dataIndex: 'PK_YN', align: "center", width : 28, resizable : false, menuDisabled : true, },
                                    { text: '컬럼 ID', header: '<div style="text-align:center;width:100%;">컬럼 ID</div>', flex: 1, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100, 
                                        renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            var link = new Array();
                                            link.push('<span class="link" id="column_'+ record.data.COLMN_NM +'">'+ record.data.COLMN_NM +'</span>');
                                            return link.join(' ');
                                        },
                                    },
                                    { text: '컬럼 명', header: '<div style="text-align:center;width:100%;">컬럼 명</div>', dataIndex: 'ATTR_NM', flex : 1, minWidth : 100, },
                                    { text: '데이터 타입', header: '<div style="text-align:center;width:100%;">데이터 타입</div>', dataIndex: 'DTYPE', width : 90,  },
                                    { text: '도메인', header: '<div style="text-align:center;width:100%;">도메인</div>', dataIndex: 'DOMAIN', width : 90  },
                                    { text: 'Not널', dataIndex: 'IS_NULL', align: "center", width : 45, },
                                    { text: 'Foreign Key', dataIndex: 'FK', align: "center", width : 100, 
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
                                          if( record.data.FK_ENTITY_NM && record.data.FK_COLMN_ID) {
                                              return  record.data.FK_ENTITY_NM+"."+record.data.FK_COLMN_ID;
                                          } else {
                                              return "";
                                          }
                                      }},
                                    { text: '[코드]/채번방식',  header: '<div style="text-align:center;width:100%;">코드/채번방식</div>',dataIndex: 'NUMB_MTH', width : 120, visible : false, align : 'center',
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
                                       }
                                    },
                                    { text: '상태',  header: '<div style="text-align:center;width:100%;">상태</div>',dataIndex: 'COLMN_SCD_NM', width : 60, visible : false,  },
                                ]
                            }, 

                            {   xtype : 'treepanel',
                                title: '전체 테이블목록',
                                region: 'center',
                                columnLines: true,
                                rowLines : true,
                                id : 'tableLayoutList',
                                border : true,
                                collapsible: false,
                                useArrows: true,
                                title : '테이블/컬럼 목록',
                                rootVisible: false,
                                multiSelect: true,
                                selType: 'checkboxmodel',
                                selModel: {
                                    checkOnly: false,
                                    injectCheckbox: 1,
                                    mode: 'MULTI'
                                },
                                <tagErd:store type="treestore" id="tableLayoutTreeStore" idProperty="ENTITY_ID" url="/entity/data/entityColumnTree.do" rootProperty="CHILDREN" expanded="false" params="PROJECT_ID : 'PROJECT'">
                                      // fields: store.tag로 이동
                                </tagErd:store>
                                viewConfig: {
                                    plugins: {
                                        gridviewdragdrop: {
                                            containerScroll: true,
                                            dragGroup: 'dd-grid-to-grid-group3',
                                            dropGroup: 'dd-grid-to-grid-group3'
                                        }
                                    },
                                    listeners: {
                                        drop: function(node, data, dropRec, dropPosition) {
                                            console.log( arguments )
                                        }
                                    }
                                },
                                columns: [
                                    { text: 'NO', header: '<div style="text-align:center;width:100%;">NO</div>', align: "right", dataIndex: 'RNUM', width : 40, resizeable : false, sortable : false, menuDisabled: true, },
                                    { text: 'PK', dataIndex: 'PK_YN', align: "center", width : 28, resizable : false, menuDisabled : true },
                                    { xtype: 'treecolumn',  text: '테이블/컬럼 ID', header: '<div style="text-align:center;width:100%;">테이블/컬럼 ID</div>', flex: 1, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100,
                                        renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            var link = new Array();
                                            link.push('<span class="link" id="table_column_'+ record.data.COLMN_NM +'">'+ record.data.COLMN_NM +'</span>');
                                            return link.join(' ');
                                        },
                                    },
                                    { text: '테이블/컬럼 명', header: '<div style="text-align:center;width:100%;">테이블/컬럼 명</div>', dataIndex: 'ATTR_NM', flex : 1, minWidth : 100, },
                                    { text: '데이터 타입', header: '<div style="text-align:center;width:100%;">데이터 타입</div>', dataIndex: 'DTYPE', width : 90  },
                                    { text: '도메인', header: '<div style="text-align:center;width:100%;">도메인</div>', dataIndex: 'DOMAIN', width : 90  },
                                    { text: 'Not널', dataIndex: 'IS_NULL', align: "center", width : 45 },
                                    { text: 'Foreign Key', dataIndex: 'FK', align: "center", width : 100, 
                                        renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
                                           if( record.data.FK_ENTITY_NM && record.data.FK_COLMN_ID) {
                                               return  record.data.FK_ENTITY_NM+"."+record.data.FK_COLMN_ID;
                                           } else {
                                               return "";
                                           }
                                       }},
                                     { text: '[코드]/채번방식',  header: '<div style="text-align:center;width:100%;">코드/채번방식</div>',dataIndex: 'NUMB_MTH', width : 120, visible : false, align:'center',
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
                                        }
                                     },
                                     { text: '상태',  header: '<div style="text-align:center;width:100%;">상태</div>',dataIndex: 'COLMN_SCD_NM', width : 60, visible : false,  },
                                ]
                            }
                            
                        ]
                    },