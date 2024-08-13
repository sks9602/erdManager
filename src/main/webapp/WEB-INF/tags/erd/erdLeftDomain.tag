<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

                         {
                            xtype : 'treepanel',
                            collapsible: true,
                            // useArrows: true,
                            title : '도메인',
                            rootVisible: false,
                            columnLines: true,
                            rowLines : true,
                            enableDragDrop: true,
                            id : 'domainTreePanel',
                            viewConfig: {
                                    plugins: {
                                        gridviewdragdrop: {
                                            containerScroll: true,
                                            copy : true,
                                            allowCopy : true,
                                            autoGenId : true,
                                            enableDrag: true,
                                            enableDrop: false,
                                            dragGroup: 'dd-grid-to-grid-group1',
                                            dropGroup: 'dd-grid-to-grid-group1',
                                            //ddGroup: 'destination1',
                                        }
                                    },
                            },
                            tbar: ['->',
                               <tagErd:button type="button" label="리로드" iconCls="reload" cls="btn_segmentedbutton">
                                   listeners : {
                                      click : function(_button, e, eOpts) {
                                          Ext.getStore('domainTreeStore').getProxy().extraParams.PROJECT_ID = '';
                                          Ext.getStore('domainTreeStore').reload();
                                          
                                          // sendMessage();
                                      }
                                   }
                               </tagErd:button>
                                <tagErd:button type="button" label="모두 펼치기" iconCls="expandAll" cls="btn_segmentedbutton">
                                     listeners : {
                                        click : function(_button, e, eOpts) {
                                             var tree = Ext.getCmp('domainTreePanel');
                                             tree.expandAll();
                                        }
                                     }
                                </tagErd:button>
                                <tagErd:button type="button" label="모두 접기" iconCls="collapseAll" cls="btn_segmentedbutton">
                                    listeners : {
                                       click : function(_button, e, eOpts) {
                                           var tree = Ext.getCmp('domainTreePanel');
                                           tree.collapseAll();
                                       }
                                    }
                               </tagErd:button>
                            ],
                            <tagErd:store type="treestore" id="domainTreeStore" idProperty="DOMAIN_ID" url="/domain/data/tree.do" rootProperty="CHILDREN" expanded="true" params="">
                                // fields: store.tag로 이동
                            </tagErd:store>
                            // folderSort: true,
                            multiSelect: true,
                            // singleExpand: true,
                            columns: [{
                                xtype: 'treecolumn', //this is so we know which column will show the tree
                                text: '도메인명',
                                flex: 1,
                                sortable: true,
                                dataIndex: 'DOMAIN_NM',
                                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                    
                                    var link = new Array();
                                    //if( record.data.LEVEL == 1 ) {
                                    //    link.push( record.data.DOMAIN_NM );
                                    //} else if( record.data.LEVEL > 1) {
                                        /*
                                        var param = "{";
                                        for(var x in record.data ) {
                                            param += ("'"+ x + "' : '" + record.data[x]+"',");
                                        }
                                        param += "}";
                                        console.log( param );
                                        */
                                        // link.push('<span class="link" onclick="ErdAppFunction.editDomainWindow(\''+ record.data.DOMAIN_ID +'\',\''+ record.data.DOMAIN_NM +'\',\''+ record.data.TOP_DOMAIN_NM +'\')" id="domain_edit_'+ record.data.DOMAIN_ID +'">'+record.data.DOMAIN_NM+'</span>');
                                        if( record.data.DTYPE == "COMMENTS" || record.data.DTYPE == "COMMENT" ) {
                                            link.push( record.data.DOMAIN_NM );
                                        } else {
                                            link.push('<span class="link" id="domain_'+ record.data.DOMAIN_ID +'">'+record.data.DOMAIN_NM+'</span>');
                                        }
                                    //}
                                    return link.join(' ');
                                },
                                listeners : {
                                    click : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                    // contextmenu : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                        e.stopEvent();
                                        var items = new Array;
                                        if( record.data.DTYPE != "COMMENTS" && record.data.DTYPE != "COMMENT" ) {
                                            items.push(Ext.create('Ext.Action', {
                                                // iconCls : 'btn-icon-tree-add-first-level',
                                                text: '['+record.data.DOMAIN_NM+']의 하위도메인 등록',
                                                disabled : ErdAppFunction.getButtonDisabled(), // ${sessionScope._sessionVO.notModelerRole} ,
                                                handler : function() {
                                                    ErdAppFunction.addDomainWindow(record.data.DOMAIN_ID, record.data.DOMAIN_NM, record.data.TOP_DOMAIN_NM, record );
                                                }
                                            }));
                                        }
                                        if( record.data.LEVEL > 1) {
                                            items.push(Ext.create('Ext.Action', {
                                                // iconCls : 'btn-icon-tree-add-first-level',
                                                text: '['+record.data.DOMAIN_NM+']도메인 수정',
                                                disabled : ErdAppFunction.getButtonDisabled(), // ${sessionScope._sessionVO.notModelerRole} ,
                                                handler : function() {
                                                    ErdAppFunction.editDomainWindow(record.data.DOMAIN_ID, record.data.DOMAIN_NM, record.data.TOP_DOMAIN_NM );
                                                }
                                            }));
                                        }
                                        
                                        if( items.length > 0 ) {
                                            var contextMenu = Ext.create('Ext.menu.Menu', {
                                                                items: items
                                                            });
                                            console.log( e.getXY() )
                                            contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                        }
                                        return false;
                                    }
                                    
                                }
                                
                            },
                            {
                                text: '<div style="text-align:center;width:100%;">데이터 타입</div>',
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
                            }
                            ,{
                                header: '기본값',
                                width: 80,
                                dataIndex: 'DEFAULT_VAL',
                                align: 'center'
                                //add in the custom tpl for the rows
                            },
                        ]
                    },