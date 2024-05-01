<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

                    {
                        xtype: 'panel',
                        layout: 'border',
                        border : false,
                        title : '테이블',
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
                                        <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
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
                                                 
                                                 items.push(Ext.create('Ext.Action', {
                                                     // iconCls : 'btn-icon-tree-add-first-level',
                                                     text: '['+record.data.TABL_NM+'] 테이블로 이동',
                                                     disabled : false,
                                                     handler : function() {
                                                        Ext.getCmp('SELECTED-TABLE-DETAIL').collapse();
                                                     
                                                         drawDataLoad.initEntityForAddSubject(true);
                                                         
                                                         var tableGrp = SVG(".table_"+Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId()+"_"+record.data.ENTITY_ID);
                                                         var tableRect = SVG(".rect_"+Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId()+"_"+record.data.ENTITY_ID);
                                                         var tableGrpBox = { 
                                                                            left : Math.ceil(tableGrp.transform().translateX)
                                                                          , top : Math.ceil(tableGrp.transform().translateY)
                                                                          , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
                                                                          , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 15
                                                                         };
                                                         
                                                         var wh =  Ext.get('ERD-SUBJECTS').getSize();
                                                         
                                                         Ext.get(Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId()).scrollTo('top', tableGrpBox.top+tableRect.height()/2-wh.height/2, true)
                                                         Ext.get(Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId()).scrollTo('left',  tableGrpBox.left+tableRect.width()/2-wh.width/2, true);
                                                         
                                                         tableRect.animate({duration: 1000, delay: 10, when: 'now'}).attr({'stroke-width': 3});
                                                         tableRect.animate(1000, 1000, 'now').attr({'stroke-width': 0.7});
                                                     }
                                                 }));

                                                 if( record.get("USE_YN") == "N" ) {
                                                     // 삭제취소
                                                     items.push(Ext.create('Ext.Action', {
                                                         text: '['+record.data.TABL_NM+'] 테이블(뷰)을 삭제 취소',
                                                         disabled : false,
                                                         handler : function() {
                                                            Ext.Ajax.request({
                                                                 url: '/entity/data/restore.do',
                                                                 params: {
                                                                     ENTITY_ID : record.get("ENTITY_ID"),
                                                                     USE_YN : "Y"
                                                                 },
                                                                 success: function(response, opts) {
                                                                    record.set("USE_YN", "Y");
                                                                    
                                                                    // ENTITY_수 증가
                                                                    drawDataLoad.projectBuyInfo.ENTITY_CNT +=1;
                                                                 },
                                                            
                                                                 failure: function(response, opts) {
                                                                     Ext.Msg.alert(
                                                                         '오류',
                                                                         '처리에 실패했습니다.'
                                                                     );
                                                                 }
                                                             });
                                                         }
                                                     }));
                                                 }
                                                                                                 
                                                items.push({
                                                    xtype: 'menuseparator'
                                                });
                                                if( subjects.length > 0 ) {
                                                    
                                                    for( var i=0;i < subjects.length; i++) {
                                                          items.push(Ext.create('Ext.Action', {
                                                              // iconCls : 'btn-icon-tree-add-first-level',
                                                              text: '업무역영 ['+subjects[i].SUBJECT_NM+'] 열기',
                                                              subjectId : subjects[i].SUBJECT_ID,
                                                              subjectIdx : i,
                                                              disabled : Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId() == subjects[i].SUBJECT_ID,
                                                              handler : function(_this, e) {
                                                                 
                                                                 for(var j=0; j < Ext.getCmp("ERD-SUBJECTS").items.keys.length;j++) {
                                                                    // 이미 탭이 생성된 경우.
                                                                    if(Ext.getCmp(_this.subjectId)) {
                                                                         Ext.getCmp("ERD-SUBJECTS").setActiveTab(_this.subjectId);
                                                                    } else {
                                                                         ErdDrawFunction.drawErdPage(drawDataLoad.getSubjectAreaData(), _this.subjectIdx, drawDataLoad);
                                                                    }
                                                                 }
                                                                 
                                                              }
                                                          }));
                                                      }
	                                             } else {
                                                      items.push(Ext.create('Ext.Action', {
                                                          // iconCls : 'btn-icon-tree-add-first-level',
                                                          text: '['+record.data.TABL_NM+'] 테이블(뷰)이 등록된 업무영역이 없습니다.',
                                                          disabled : true
                                                      }));
	                                             }
	                                             
                                                 items.push({
                                                     xtype: 'menuseparator'
                                                 });


                                                 if( !existsEntityOnSubject ) {
	                                                 items.push(Ext.create('Ext.Action', {
	                                                     // iconCls : 'btn-icon-tree-add-first-level',
	                                                     text: '['+record.data.TABL_NM+'] 테이블(뷰)을 업무영역 ['+ Ext.getCmp("ERD-SUBJECTS").getActiveTab().title + ']에  추가',
	                                                     disabled : !erdAuth.isEditable(),
	                                                     handler : function() {
	                                                         // Entity를 추가하기위해 entity_id설정.
	                                                         drawDataLoad.setEntityForAddSubject(record.data.ENTITY_ID, record.data.TABL_NM, record.data.ENTITY_TCD )
	                                                     }
	                                                 }));
                                                 }
                                                 
                                                 // 즐겨찾기
                                                 items.push(Ext.create('Ext.Action', {
                                                     text: '['+record.data.TABL_NM+'] 테이블(뷰)을 자주찾는 ' + ((record.get("FAVOR_YN") == "Y") ? '테이블(뷰)에서 삭제' : '테이블(뷰)에 추가'),
                                                     disabled : false,
                                                     handler : function() {
                                                        Ext.Ajax.request({
                                                             url: '/entity/data/saveFavorite.do',
                                                             params: {
                                                                 ENTITY_ID : record.get("ENTITY_ID"),
                                                                 FAVOR_YN : (record.get("FAVOR_YN") == "Y" ? "N" : "Y"),
                                                             },
                                                             success: function(response, opts) {
                                                                record.set("FAVOR_YN", (record.get("FAVOR_YN") == "Y" ? "N" : "Y"));
                                                             },
                                                        
                                                             failure: function(response, opts) {
                                                                 Ext.Msg.alert(
                                                                     '오류',
                                                                     '처리에 실패했습니다.'
                                                                 );
                                                             }
                                                         });
                                                     }
                                                 }));

                                                 var contextMenu = Ext.create('Ext.menu.Menu', {
                                                     items: items
                                                 });
                                                 contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                                         
                                            }
                                       }
                                   },
                                   { header: '<div style="text-align:center;width:100%;">테이블 물리 명</div>', dataIndex: 'ENTITY_NM', flex: 1, minWidth : 120, },
                                   { header: '<div style="text-align:center;width:100%;">객체유형</div>', align:'center',  dataIndex: 'ENTITY_TCD', width:55, },
                                   { header: '<div style="text-align:center;width:100%;">컬럼수</div>', align:'center',  dataIndex: 'COLUMN_CNT', width:55, },
                                   // { header: '<div style="text-align:center;width:100%;">반영상태</div>', dataIndex: 'TABL_SCD_NM', align:'left', width : 100, },
                                    
                                    { header: '<div style="text-align:center;width:100%;">반영상태 / 반영컬럼수</div>', columns: [
		                                    <c:forEach var="item" items="${data}">
		                                    { text: '${item.CD_NM}', dataIndex: '${item.CD}', align: "center", width : 65, menuDisabled : true, resizable : false,
		                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
		                                          return (value ? "Y" : "<span style='color:red'>N</span>") + " / <span " + ( record.get("${item.CD}_COL_CNT") != record.get("COLUMN_CNT") ? "style='color:red'>" : ">" ) +( record.get("${item.CD}_COL_CNT") ? record.get("${item.CD}_COL_CNT") : "") + "</span>";
		                                       },
		                                    },
		                                    </c:forEach>
	                                    ]
                                    }
                               ]
                           }
                         ]
                      },