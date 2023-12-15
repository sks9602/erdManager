<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

               {
                   xtype: 'panel',
                   layout: 'border',
                   title : '테이블 목록',
                   border : false,
                   items : [
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
                                    injectCheckbox: 1,
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
                                ],
                                <tagErd:store type="store" id="tableLayoutStore" idProperty="COLMN_ID" groupField="ENTITY_NM" url="/entity/data/entityColumList.do" rootProperty="data" expanded="false" params="PROJECT_ID : 'PROJECT'" autoLoad="true">
                                     // fields: store.tag로 이동
                                     grouper: {
                                         groupFn: function(item) {
                                             return 'Month: ' + item.get('month') + ', Year: ' + item.get('year');
                                         }
                                     },
                                     listeners : {
                                        datachanged : function( _this, eOpts) {
                                            console.log( _this )
                                        
                                        },
                                        update : function( _this, record, operation, modifiedFieldNames, details, eOpts ) {
                                            console.log( _this )
                                            console.log( record )
                                        } 
                                     },
                                </tagErd:store>
                                features: [{
                                    id: 'group',
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: ['{name:this.formatName}',
                                                        {
                                                            formatName: function(name) {
                                                                return name.substring(name.indexOf('@')+1);
                                                            }
                                                        }
                                                     ],
                                    hideGroupedHeader: true,
                                    enableGroupingMenu: false,
                                    showSummaryRow : false,
                                }],
                                plugins: {
                                    cellediting: {
                                        editing : true,
                                        clicksToEdit: 1
                                    }
                                },
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
                                        /*
                                        groupclick: function (view, node, group, e, eOpts) {
                                            console.log( view.features[0].expand )
                                            view.features[0].collapseAll();
                                            view.features[0].expand(group);
                                        },
                                        */
                                        beforeedit : function( sender, location, eOpts )  {
                                            console.log( sender )
                                            console.log( location )
                                        },
                                        edit : function( sender, location, eOpts )  {
                                            console.log( sender )
                                            console.log( location )
                                        },
                                        beforedrop : function ( node, data, overModel, dropPosition, dropHandlers, eOpts )  {
                                            
                                            console.log(node)
                                            console.log(data)
                                            console.log(overModel)
                                            console.log(dropPosition);
                                            console.log(dropHandlers);
                                            /*
                                            for( var i=0; i < data.records.length; i++ ) {
                                                data.records[i].set("ENTITY_ID", overModel.data["ENTITY_ID"]);
                                                data.records[i].set("ENTITY_NM", overModel.data["ENTITY_NM"]);
                                                data.records[i].set("COLMN_ID", "COL-"+Math.floor(Math.random() * 100000));
                                                if( overModel.data["PK_YN"]=="Y" && data.records[i].get("PK_YN") == "Y" ) {
                                                   data.records[i].set("PK_YN", "Y");
                                                } else {
                                                   data.records[i].set("PK_YN", ""  );
                                                }
                                                data.records[i].set("RNUM", "추가");
                                                data.records[i].set("id", Ext.id());
                                                
                                                var rowNum = Ext.getStore("tableLayoutStore").findBy ( function(record){
                                                   console.log(record.get("ENTITY_NM"), data.records[i].get("ENTITY_NM"), record.get("COLMN_NM"), data.records[i].get("COLMN_NM")  );
                                                   if( record.get("ENTITY_NM") == data.records[i].get("ENTITY_NM") 
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
                                            
                                            console.log(node)
                                            console.log(data)
                                            console.log(dropRec)
                                            console.log(dropPosition);
                                            console.log(Ext.getStore("tableLayoutStore"));
                                            
                                            for( var i=0; i < data.records.length; i++ ) {
                                                data.records[i].set("RNUM", (parseInt(dropRec.data["RNUM"]) + ( dropPosition == 'after' ? 1 : -1)));
                                            
                                                if( data.records[i].get("ENTITY_ID") == dropRec.data["ENTITY_ID"] ) {
                                                    continue;
                                                }
                                                data.records[i].set("ENTITY_ID", dropRec.data["ENTITY_ID"]);
                                                data.records[i].set("ENTITY_NM", dropRec.data["ENTITY_NM"]);
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
                                                   // console.log(record.get("ENTITY_NM"), data.records[i].get("ENTITY_NM"), record.get("COLMN_NM"), data.records[i].get("COLMN_NM")  );
                                                   if( record.get("ENTITY_NM") == data.records[i].get("ENTITY_NM") 
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
                                                property : 'ENTITY_NM',
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
                                    { text: 'NO', header: '<div style="text-align:center;width:100%;">NO</div>', align: "right", dataIndex: 'RNUM', width : 38, resizeable : false, sortable : false, menuDisabled: true, locked : true, 
                                        renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            return record.data.RNUM; // (record.data.DML_TCD ? record.data.DML_TCD : "")  + ""+ record.data.RNUM;
                                        },
                                    },
                                    {
                                        text: 'ENTITY_NM',
                                        flex: 1,
                                        sortable: true,
                                        dataIndex: 'ENTITY_NM',
                                        hideable: false,
                                        locked : true,
                                        summaryType: 'count',
                                        summaryRenderer: function(value, summaryData, dataIndex) {
                                            return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
                                        }
                                    },
                                    { text: 'PK', dataIndex: 'PK_YN_BOOL', xtype: 'checkcolumn', width : 28, menuDisabled : true,  locked : true, resizable : false,
                                          listeners : {
                                              checkchange : function( _this, rowIndex, checked, record, e, eOpts ) {
                                                  record.set("NOTNULL_YN_BOOL", checked);
                                              }
                                          }
                                    },
                                    /*
                                    { text: '<div class="grid-header-combogrid"></div>PK', dataIndex: 'PK_YN', align: "center", width : 40, resizable : false, menuDisabled : true, locked : true,
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
                                    // { text: '컬럼 ID', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 ID</div>', width : 150, sortable: true, dataIndex: 'COLMN_ID' , minWidth : 100, locked : true, },
                                    { text: '컬럼 논리 명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 명</div>', dataIndex: 'ATTR_NM', width : 120, minWidth : 100, locked : true, 
                                        editor: {
                                            allowBlank: false,
                                            selectOnFocus: false
                                        },
                                    },
                                    { text: '컬럼 물리 명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼</div>', width : 150, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100, locked : true, 
                                        
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
                                        /*
                                        summaryType: 'count',
                                        summaryRenderer: function(value, summaryData, dataIndex) {
                                            return '(' + value + ' Columns)';
                                        }
                                        */
                                    },
                                    { text: '도메인', header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>도메인</div>', dataIndex: 'DOMAIN_NM', width : 90,
                                         editor: {
                                                    xtype: 'combotreegrid_domain',
                                                    id : 'rightAll_combotreegrid_domain_picker',
                                                    listeners :{
                                                      change : function(_this, newValue, oldValue, eOpts) {
                                                        Ext.getCmp("tableLayoutList").getSelectionModel().getLastSelected().set('DOMAIN_ID',_this.getDomainId());// getSelection()[0]
                                                        Ext.getCmp("tableLayoutList").getSelectionModel().getLastSelected().set('DOMAIN_DATA_TYPE',_this.getDataType());// getSelection()[0]
                                                        Ext.getCmp("tableLayoutList").getSelectionModel().getLastSelected().set('DATA_TYPE',_this.getDataType());// getSelection()[0]
                                                        console.log( _this.getValue(), _this.getDomainId(), _this.getDataType() );
                                                        console.log( newValue );
                                                      }
                                                    }
                                                 },
                                    
                                    },
                                    { text: '데이터 타입', dataIndex: 'DOMAIN_DATA_TYPE', width : 110, hidden : true, },
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
                                                    vtype : 'MariaDBDataTypeScale',
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
                                            return '<div style="width:10px;height:10px;background-color:'+value+'"> </div>';
                                        }
                                    },
                                    /*
                                    { text: 'Foreign Key', header: '<div style="text-align:center;width:100%;">Foreign Key</div>', dataIndex: 'FK', align: "left", width : 100, 
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
                                          if( record.data.FK_ENTITY_NM && record.data.FK_COLMN_ID) {
                                              return  record.data.FK_ENTITY_NM+"."+record.data.FK_COLMN_ID;
                                          } else {
                                              return "";
                                          }
                                      }
                                    },
                                    */
                                    { text: '코드/채번방식',  header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>코드/채번방식</div>',dataIndex: 'NUMB_MTH', width : 120, visible : false, align : 'center',
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
                                          return record.data.NUMB_MTH;
                                       },
                                        editor: {
                                            selectOnFocus: false
                                        },
                                    },
                                    { text: 'CUD',  header: '<div style="text-align:center;width:100%;">CUD</div>',dataIndex: 'DML_TCD_NM', width : 40, visible : false,  },
                                    { text: 'CUD일자',  header: '<div style="text-align:center;width:100%;">CUD일자</div>',dataIndex: 'DML_DT_FMT', width : 80, visible : false,  },
                                    { text: 'NOTE',  header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>Note</div>',dataIndex: 'COLMN_DESC', flex: 1, minWidth :100, width : 100, visible : false, 
                                       editor :  {
                                            xtype: 'textarea', // 'htmleditor',
                                            grow : true,
                                            enableColors: false,
                                            enableAlignments: false
                                       }                              
                                    },
                                    { text: '상태',  header: '<div style="text-align:center;width:100%;">상태</div>',dataIndex: 'COLMN_SCD_NM', width : 60, visible : false,  },
                                ]
                            }, 
                        ]
                    },