<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

                    {
                        xtype: 'panel',
                        layout: 'border',
                        border : false,
                        title : '요청목록',
                        items : [
                            {
                                region: 'north',
                                title: '요청 검색조건',
                                height : 50+(24*4),
                                xtype : 'formPanel_ux',
                                collapsible : true,
                                id : 'tableForm',
                                border : false,
                                bbar : ['->',
                                        <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    // sendMessage("socket... 검색.........");
                                                    if( this.up('form').getForm().isValid() ) {
                                                        var me = this;
                                                        var store = Ext.getStore("entityListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
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
                                                        var store = Ext.getStore("entityListStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                    }
                                                });
                                            },
                                        }
                                    </tagErd:itemText>
                                    <tagErd:itemCheckbox type="checkbox_ux" name="EXACT_YN" boxLabel="정확히 일치하는 테이블만 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <tagErd:itemCheckbox type="checkbox_ux" name="FAVOR_YN" boxLabel="자주찾는 테이블 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                    <!--  tagErd:itemCode type="ext-js-combobox" label="관리상태" name="TABL_SCD" id="TABLE_TABL_SCD" cdGrp="TABL_SCD" firstText="전체" value="" --><!--/tagErd:itemCode  -->
                                    <tagErd:itemCode type="ext-js-combobox" label="테이블 관리상태" name="TABL_SCD" id="TABLE_TABL_SCD" cdGrp="TABL_SCD" firstText="전체" value="" usedef1="Y"  usedef4="Y"></tagErd:itemCode>
                                ]
                           }, 
                           {   xtype : 'gridpanel',
                               region: 'center',
                               columnLines: true,
                               title : '테이블',
                               <tagErd:store type="store" id="entityListStore" idProperty="ENTITY_ID" url="/entity/data/list.do" rootProperty="data" expanded="true" params="PROJECT_ID : 'PROJECT'">
                                    // fields: store.tag로 이동
                               </tagErd:store>
                               columns: [
                                   { xtype: 'rownumberer'},
                                   { header: '<div style="text-align:center;width:100%;">요청구분</div>', dataIndex: 'REQ_GBN_NM', minWidth : 50, },
                                   { header: '<div style="text-align:center;width:100%;">대상 테이블 논리 명</div>', dataIndex: 'TABL_NM', flex: 1, minWidth : 120,
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
                                               
                                                var subjectActiveId = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
                                                
                                                var subjects = new Array();
                                                // 테이블이 현재 보이는 업무영역에 있는지 확인.
                                                var existsEntityOnSubject = false;
                                                var entitySubject = drawDataLoad.getTableOnSubjectAreaDatas()
                                                for( var i=0;i < entitySubject.length; i++) {
                                                    if(entitySubject[i].ENTITY_ID == record.get("ENTITY_ID") ) {
                                                        subjects.push( entitySubject[i] );
                                                    }
                                                    if(entitySubject[i].SUBJECT_ID == subjectActiveId 
                                                        && entitySubject[i].ENTITY_ID == record.get("ENTITY_ID") ) {
                                                        existsEntityOnSubject = true;
                                                    }
                                                }
                                                
                                                var items = new Array;

                                                items.push(Ext.create('Ext.Action', {
                                                    // iconCls : 'btn-icon-tree-add-first-level',
                                                    text: '['+record.data.TABL_NM+'] 테이블 상세 정보 조회',
                                                    disabled : false,
                                                    handler : function() {
                                                        ErdDrawFunction.loadTableInfo(record.get("ENTITY_ID"), true);
                                                        
                                                        Ext.getCmp('SELECTED-TABLE-DETAIL').expand();
                                                    }
                                                }));
                                                 
                                                 items.push({
                                                     xtype: 'menuseparator'
                                                 });
                                            }
                                       }
                                   },
                                   { header: '<div style="text-align:center;width:100%;">대상 테이블 물리 명</div>', dataIndex: 'ENTITY_NM', flex: 1, minWidth : 120, },
                                   { header: '<div style="text-align:center;width:100%;">신청일자</div>', align:'center',  dataIndex: 'REQ_DT', width:65, },
                                   { header: '<div style="text-align:center;width:100%;">처리상태</div>', align:'center',  dataIndex: 'TRT_SCD_NM', width:66, },
                                   { header: '<div style="text-align:center;width:100%;">처리일자</div>', align:'center',  dataIndex: 'TRT_DT', width:65, },
                               ]
                           }
                         ]
                      },