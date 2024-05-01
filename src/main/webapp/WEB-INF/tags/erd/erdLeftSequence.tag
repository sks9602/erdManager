<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

                    {
                        xtype: 'panel',
                        layout: 'border',
                        border : false,
                        title : '시퀀스',
                        items : [
                            {
                                region: 'north',
                                title: '시퀀스 검색조건',
                                height : 50+(24*4),
                                xtype : 'formPanel_ux',
                                collapsible : true,
                                id : 'sequenceForm',
                                border : false,
                                bbar : ['->',
                                        <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    if( this.up('form').getForm().isValid() ) {
                                                        var me = this;
                                                        var store = Ext.getStore("sequenceListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                                    }
                                                }
                                            }
                                        </tagErd:button>
                                ],
                                items : [
                                    <tagErd:itemText type="textfield_ux" label="시퀀스" name="SEQNC_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                        var me = this;
                                                        var store = Ext.getStore("entityListStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                    }
                                                });
                                            },
                                        }
                                    </tagErd:itemText>
                                    <tagErd:itemCheckbox type="checkbox_ux" name="EXACT_YN" boxLabel="정확히 일치하는 시퀀스만 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemCheckbox type="checkbox_ux" name="USE_YN_ALL" boxLabel="삭제된 시퀀스 포함 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemCode type="ext-js-combobox" label="관리상태" name="TABL_SCD" cdGrp="TABL_SCD" firstText="전체" value=""></tagErd:itemCode>
                                ]
                           }, 
                           {   xtype : 'gridpanel',
                               region: 'center',
                               columnLines: true,
                               id : 'leftSequence_gridpanel',
                               title : '시퀀스',
                               
                               tbar : ['->',
                                        <tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    var store = Ext.getStore("sequenceListStore").load({page : 1, limit : 999999 }); 
                                                }
                                            }
                                        </tagErd:button>
                                        <tagErd:button type="button" label="시퀀스 추가" iconCls="search" id="erdLeftSequenceAdd" cls="btn_segmentedbutton">
                                            disabled : ${sessionScope._sessionVO.notModelerRole} ,
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    ErdAppFunction.addSequenceWindow('', 'erdLeftSequenceAdd');
                                                }
                                            }
                                        </tagErd:button>
                                        <tagErd:button type="splitbutton" label="시퀀스 삭제" iconCls="search" id="erdLeftSequenceDelete" cls="btn_segmentedbutton">
                                            disabled : ${sessionScope._sessionVO.notModelerRole} ,
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    var grid = Ext.getCmp("leftSequence_gridpanel");
                                                    var selectedRecords = grid.getSelectionModel().getSelection();
                                                
                                                    for( var i=0; i < selectedRecords.length; i++) {
                                                        if( selectedRecords[i].get("SEQNC_ID") == null || selectedRecords[i].get("SEQNC_ID") == ""){
                                                            grid.getStore().remove(selectedRecords[i]);
                                                        } else {
                                                            selectedRecords[i].set("USE_YN", "N");
                                                        }
                                                    }
                                                }
                                            },
                                            menu: {
                                                plain: true,
                                                disabled : ${sessionScope._sessionVO.notModelerRole} ,
                                                items: [ 
                                                        {text: '삭제 취소', id : 'erdLeftSequenceDeleteCancel',
                                                            handler : function(_this, ev) {
                                                                var grid = Ext.getCmp("leftSequence_gridpanel");
                                                                var selectedRecords = grid.getSelectionModel().getSelection();
                                                               
                                                                for( var i=0; i < selectedRecords.length; i++) {
                                                                    selectedRecords[i].set("USE_YN", "Y");
                                                                }
                                                            }
                                                        }
                                                ]
                                            }
                                        </tagErd:button>
                                        <tagErd:button type="button" label="저장" iconCls="search" id="erdLeftSequenceSave"  cls="btn_segmentedbutton">
                                            disabled : ${sessionScope._sessionVO.notModelerRole} ,
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    var gridColumn = Ext.getCmp("leftSequence_gridpanel");
                                                    gridColumn.submit('changed', '/sequence/data/saveUseYn.do', {
                                                        showSaving : true,
                                                        callback : function(form, success, response) {
                                                            var store = Ext.getStore("sequenceListStore").load({page : 1, limit : 999999 }); 
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
                               <tagErd:store type="store" id="sequenceListStore" idProperty="SEQNC_NM" url="/sequence/data/list.do" rootProperty="data" expanded="true" params="">
                                    // fields: store.tag로 이동
                               </tagErd:store>
                               columns: [
                                   { xtype: 'rownumberer'},
                                   { header: '<div style="text-align:center;width:100%;">시퀀스 명</div>', dataIndex: 'SEQNC_NM', flex: 1, 
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                           var link = new Array();
                                           if( record.get("USE_YN") == "N") {
                                                link.push('<span class="link" id="sequence_'+ record.data.SEQNC_NM +'"><del>'+ record.data.SEQNC_NM +'</del></span>');
                                           } else {
                                                link.push('<span class="link" id="sequence_'+ record.data.SEQNC_NM +'">'+ record.data.SEQNC_NM +'</span>');
                                           }
                            
                                           return link.join(' ');
                                       },
                                       listeners : {
                                           click : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                                e.stopEvent();
                                               
                                                
                                                var items = new Array;

                                                items.push(Ext.create('Ext.Action', {
                                                    // iconCls : 'btn-icon-tree-add-first-level',
                                                    text: '['+record.data.SEQNC_NM+'] 시퀀스 상세 정보 조회',
                                                    disabled : false,
                                                    handler : function() {
                                                        ErdAppFunction.addSequenceWindow(record.get("SEQNC_ID"), 'sequence_'+record.get("SEQNC_NM"));
                                                     }
                                                }));
                                                 
                                                         
                                                 var contextMenu = Ext.create('Ext.menu.Menu', {
                                                     items: items
                                                 });
                                                 contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                                         
                                            }
                                       }
                                   },
                                   { header: '<div style="text-align:center;width:100%;">시작 값</div>', dataIndex: 'BGN_VAL', align:'right', minWidth : 58, width : 58, menuDisabled : true, sortable : false,},
                                   { header: '<div style="text-align:center;width:100%;">종료 값</div>', dataIndex: 'END_VAL', align:'right', minWidth : 58, width : 58, menuDisabled : true, sortable : false, },
                                   { header: '<div style="text-align:center;width:100%;">증가 값</div>', dataIndex: 'INC_VAL', align:'right', minWidth : 58, width : 58, menuDisabled : true, sortable : false, },
                                   { header: '관리상태', dataIndex: 'TABL_SCD_NM', align:'center', width : 60, },
                               ]
                           }
                         ]
                      },