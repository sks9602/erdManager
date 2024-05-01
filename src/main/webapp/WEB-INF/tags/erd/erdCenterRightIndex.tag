<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>


                              {
                                        xtype : 'treepanel',
                                        region: 'center',
                                        width: 500,
                                        height: 300,
                                        id : 'centerRightTableIndex_treegridpanel',
                                        collapsible: false,  // true,
                                        useArrows: true,
                                        title : '인덱스',
                                        rootVisible: false,
                                        multiSelect: false,
                                        columnLines: true,
                                        rowLines : true,
					                    tbar : ['->',
                                            <tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
                                                listeners : {
                                                    click : function(_this, e, eOpts) { 
                                                        var store = Ext.getStore("indexTreeListStore");
                                                        store.reload();
                                                    }
                                                }
                                            </tagErd:button>
                                            <tagErd:button type="button" label="추가" iconCls="search" cls="btn_segmentedbutton" id="btn_addTableIndexWindow">
                                                listeners : {
                                                    click : function(_this, e, eOpts) { 
                                                        var entity_id  = Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue();
                                                        var index_id = '';
                                                        ErdAppFunction.tableIndexWindow(entity_id, index_id, 'btn_addTableIndexWindow');
                                                    }
                                                }
                                            </tagErd:button>
					                     ],
                                        <tagErd:store type="treestore" id="indexTreeListStore" idProperty="INDX_ID" url="/entity/data/indexTreeList.do" rootProperty="CHILDREN" expanded="false" params="">
                                             // fields: store.tag로 이동
                                       </tagErd:store>
                                       columns : [
                                               {
                                                   xtype: 'treecolumn',  text: '인덱스/ 컬럼 논리 명', width : 150, flex: 1, sortable: true, dataIndex: 'SUBJECT_NM' ,
                                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                                           var link = new Array();
                                                           if ( record.data.ORD == 1 ) {
                                                               if( record.get("USE_YN") == "N") {
                                                                    link.push('<span class="link" id="index_'+ record.data.INDX_ID +'"><del>'+ record.data.INDX_NM +'<del></span>');
                                                               } else {
                                                                    link.push('<span class="link" id="index_'+ record.data.INDX_ID +'">'+ record.data.INDX_NM +'</span>');
                                                               }
                                                           } else {
                                                               link.push(record.data.INDX_NM);
                                                           }
                                                           return link.join(' ');
                                                       },
                                                       listeners : {
                                                           //contextmenu : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                                           click : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                                               /*
                                                               if(record.data.expanded) {
                                                                   record.collapse();
                                                               } else {
                                                                   record.expand();
                                                               }
                                                               */
                                                               record.expand();
                                                               
                                                               var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
                                                               console.log( ErdAppFunction.getButtonDisabled() );
                                                               var items = new Array;
                                                               if( record.data.ORD == 1 ) {
                                                                    items.push(Ext.create('Ext.Action', {
                                                                        // iconCls : 'btn-icon-tree-add-first-level',
                                                                        disabled :  ErdAppFunction.getButtonDisabled(), // ${sessionScope._sessionVO.notModelerRole} ,
                                                                        text: '인덱스 ['+record.data.INDX_NM+'] 수정',
                                                                        handler : function() {
                                                                            ErdAppFunction.tableIndexWindow(entity_id, record.data.INDX_ID, "index_"+ record.data.INDX_ID)
                                                                        }
                                                                    }));
                                                                    
                                                                    
	                                                               var contextMenu = Ext.create('Ext.menu.Menu', {
	                                                                   items: items
	                                                               });
	                                                               contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
	                                                               return false;
                                                               
                                                               } else if( record.data.ORD == 2 ) {
                                                                   
                                                               }
                                                           }
                                                           
                                                       }
                                           },
                                           { header: '<div style="text-align:center;width:100%;">테이블 물리 명</div>', dataIndex: 'COLMN_NM', width : 150, flex: 1,
                                                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                                  return record.data.COLMN_NM
                                                }
                                            },
                                           { header: '<div style="text-align:center;width:100%;">정렬 순서</div>', dataIndex: 'SORT_BASE', width : 70,  },
                                           { header: '<div style="text-align:center;width:100%;">데이터 타입</div>', dataIndex: 'DATA_TYPE', width : 120,  },
                                           <c:forEach var="item" items="${data}">
                                                { text: '${item.CD_NM}', dataIndex: '${item.CD}', align: "center", width : 65, menuDisabled : true, resizable : false,  sort : false,},
                                           </c:forEach>
                                       ]
                                  },