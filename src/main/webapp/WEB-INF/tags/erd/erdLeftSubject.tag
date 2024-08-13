<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

                    {
                         xtype: 'panel',
                         layout: 'border',
                         border : false,
                         title : '업무영역',
                         items : [
                             {
                                 region: 'north',
                                 title: '업무영역/테이블 검색조건',
                                 height : 50+(24*4),
                                 xtype : 'formPanel_ux',
                                 collapsible : true,
                                 id : 'subjectAreaForm',
                                 border : false,
                                 bbar : ['->',
                                         <tagErd:button type="button" label="모두 펼치기" iconCls="expandAll" cls="btn_segmentedbutton">
                                             listeners : {
                                                click : function(_button, e, eOpts) {
                                                     var tree = Ext.getCmp('subjectEntityList');
                                                     tree.expandAll();
                                                }
                                             }
                                        </tagErd:button>
                                        <tagErd:button type="button" label="모두 접기" iconCls="collapseAll" cls="btn_segmentedbutton">
                                            listeners : {
                                               click : function(_button, e, eOpts) {
                                                   var tree = Ext.getCmp('subjectEntityList');
                                                   tree.collapseAll();
                                               }
                                            }
                                       </tagErd:button>
                                       <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
                                           listeners : {
                                              click : function(_button, e, eOpts) {
                                                  var me = this;
                                                  var store = Ext.getStore("subjectEntityListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                              }
                                           }
                                       </tagErd:button>
                                       <tagErd:button type="button" label="업무영역 추가" id="leftSubjectSubjectAddBtn" iconCls="search" cls="btn_segmentedbutton">
                                           disabled : ${sessionScope._sessionVO.notModelerRole} ,
                                           listeners : {
                                              click : function(_button, e, eOpts) {
                                                  var me = this;
                                                  // 업무영역등록 팝업
                                                  ErdAppFunction.addSubjectWindow('', '');
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
                                                         var store = Ext.getStore("subjectEntityListStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                     }
                                                 });
                                             },
                                         }
                                     </tagErd:itemText>
                                     <tagErd:itemCheckbox type="checkbox_ux" name="EXACT_YN" boxLabel="정확히 일치하는 업무영역/테이블만 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                     <tagErd:itemCheckbox type="checkbox_ux" name="SUBJECT_FAVOR_YN" boxLabel="자주찾는 업무영역 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                     <tagErd:itemCheckbox type="checkbox_ux" name="FAVOR_YN" boxLabel="자주찾는 테이블 조회" value="Y" checked="false"></tagErd:itemCheckbox>
                                     <tagErd:itemCode type="ext-js-combobox" label="테이블 관리상태" name="TABL_SCD" id="TABLE_TABL_SCD_SUBJECT" cdGrp="TABL_SCD" firstText="전체" value=""></tagErd:itemCode>
                                 ]
                             }, 
                              {
                                        xtype : 'treepanel',
                                        region: 'center',
                                        width: 500,
                                        height: 300,
                                        id : 'subjectEntityList',
                                        collapsible: false,  // true,
                                        useArrows: true,
                                        title : '업무영역&테이블 ',
                                        rootVisible: false,
                                        multiSelect: false,
                                        columnLines: true,
                                        rowLines : true,
                                        <tagErd:store type="treestore" id="subjectEntityListStore" idProperty="SUBJECT_ID" url="/subject/data/tree.do" rootProperty="CHILDREN" expanded="false" params="PROJECT_ID : 'PROJECT'">
                                             // fields: store.tag로 이동
                                       </tagErd:store>
                                       columns : [
                                               {
                                                   xtype: 'treecolumn',  text: '업무영역/테이블 논리 명', flex: 1, sortable: true, dataIndex: 'SUBJECT_NM' ,
                                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                                           var link = new Array();
                                                           link.push('<span class="link" id="subject_'+ record.data.SUBJECT_ID +'">'+ (record.get("FAVOR_YN") == "Y" ? "*" : "") +record.data.SUBJECT_NM +'</span>');
                                                           return link.join(' ');
                                                       },
                                                       listeners : {
                                                           //contextmenu : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                                           click : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                                               // e.stopEvent();
                                                               console.log( record )
                                                               if(record.data.expanded) {
                                                                   record.collapse();
                                                               } else {
                                                                   record.expand();
                                                               }
                                                               var items = new Array;
                                                               if( record.data.ORD == 1 ) {
                                                                    items.push(Ext.create('Ext.Action', {
                                                                        // iconCls : 'btn-icon-tree-add-first-level',
                                                                        text: '업무역영 ['+record.data.SUBJECT_NM+'] 열기',
                                                                        handler : function() {
                                                                            var subjectIdx = 0;
                                                                            var isTabCreated = false;
                                                                            
                                                                            var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
                                                                            if( subject_id == record.get("SUBJECT_ID") ) {
                                                                                return;
                                                                            }
                                                                            
                                                                            if( Ext.getCmp("ERD-SUBJECTS").items.keys.length > 4) {
                                                                                Ext.Msg.alert('안내', '업무영역은 5개까지 열 수 있습니다. 업무영역을 닫은 후 다시 열여주십시오.');
                                                                                
                                                                                return;
                                                                            }
                                                                            
                                                                            for(var i=0; i < Ext.getCmp("ERD-SUBJECTS").items.keys.length;i++) {
                                                                                if( record.get("SUBJECT_ID") == Ext.getCmp("ERD-SUBJECTS").items.keys[i]) {
                                                                                    Ext.getCmp("ERD-SUBJECTS").setActiveTab(i);
                                                                                    isTabCreated = true;
                                                                                }
                                                                            }
                                                                            
                                                                            if( isTabCreated ) {
                                                                                return;
                                                                            }
                                                                            for(var i=0; !isTabCreated && i < drawDataLoad.subjectAreaDatas.length ;i++) {
                                                                                console.log( i, record.get("SUBJECT_ID"), drawDataLoad.getSubjectAreaData()[i]["SUBJECT_ID"], record.get("SUBJECT_ID") == drawDataLoad.getSubjectAreaData()[i]["SUBJECT_ID"])
                                                                                if(record.get("SUBJECT_ID") == drawDataLoad.getSubjectAreaData()[i]["SUBJECT_ID"]) {
                                                                                    subjectIdx = i;
                                                                                    
                                                                                    break;
                                                                                }
                                                                            }
                                                                            
                                                                            ErdDrawFunction.drawErdPage(drawDataLoad.getSubjectAreaData(), subjectIdx, drawDataLoad);
                                                                            
                                                                            Ext.getCmp("ERD-SUBJECTS").setActiveTab(record.get("SUBJECT_ID"));
                                                                        }
                                                                    }));
                                                                    
			                                                        items.push({
			                                                            xtype: 'menuseparator'
			                                                        }); 
			                                                         
                                                                    items.push(Ext.create('Ext.Action', {
                                                                        // iconCls : 'btn-icon-tree-add-first-level',
                                                                        disabled : ErdAppFunction.getButtonDisabled(), // ${sessionScope._sessionVO.notModelerRole} ,
                                                                        text: '업무역영 ['+record.data.SUBJECT_NM+'] 수정',
                                                                        handler : function() {
                                                                            ErdAppFunction.addSubjectWindow(record.data.SUBJECT_ID, record.data.SUBJECT_NM, 'subject_'+ record.data.SUBJECT_ID );
                                                                        }
                                                                    }));
                                                                    
                                                                     // 즐겨찾기
                                                                     items.push(Ext.create('Ext.Action', {
                                                                         text: '업무역영 ['+record.data.SUBJECT_NM+']를 자주찾는 ' + ((record.get("FAVOR_YN") == "Y") ? '업무영역에 삭제' : '업무영역에 추가'),
                                                                         disabled : false,
                                                                         handler : function() {
                                                                            Ext.Ajax.request({
                                                                                 url: '/subject/data/saveFavorite.do',
                                                                                 params: {
                                                                                     SUBJECT_ID : record.get("SUBJECT_ID"),
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
                                                               } else if( record.data.ORD == 2 ) {
                                                                   items.push(Ext.create('Ext.Action', {
                                                                       // iconCls : 'btn-icon-tree-add-first-level',
                                                                       text: '테이블 ['+record.data.SUBJECT_NM+']로 이동',
                                                                       disabled : false,
                                                                       handler : function() {

                                                                            var subjectIdx = 0;
                                                                            var isTabCreated = false;
                                                                            
                                                                            var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
                                                                            if( subject_id == record.get("UP_SUBJECT_ID") ) {
                                                                                return;
                                                                            }
                                                                            
                                                                            for(var i=0; i < Ext.getCmp("ERD-SUBJECTS").items.keys.length;i++) {
                                                                                if( record.get("UP_SUBJECT_ID") == Ext.getCmp("ERD-SUBJECTS").items.keys[i]) {
                                                                                    Ext.getCmp("ERD-SUBJECTS").setActiveTab(i);
                                                                                    isTabCreated = true;
                                                                                }
                                                                            }
                                                                            if( isTabCreated ) {
                                                                                return;
                                                                            }
                                                                            for(var i=0; !isTabCreated && i < drawDataLoad.subjectAreaDatas.length ;i++) {
                                                                                if(record.get("UP_SUBJECT_ID") == drawDataLoad.getSubjectAreaData()[i]["SUBJECT_ID"]) {
                                                                                    subjectIdx = i;
                                                                                    
                                                                                    break;
                                                                                }
                                                                            }
                                                                            
                                                                            ErdDrawFunction.drawErdPage(drawDataLoad.getSubjectAreaData(), subjectIdx, drawDataLoad);

                                                                            var interval = setInterval(function() {
	                                                                            var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
	                                                                            
	                                                                            if( subject_id == record.get("UP_SUBJECT_ID") ) {
	                                                                            
	                                                                                clearInterval(interval);
	                                                                               
	                                                                                var tableGrp = SVG(".table_"+record.data.UP_SUBJECT_ID+"_"+record.data.SUBJECT_ID);
	                                                                                var tableRect = SVG(".rect_"+record.data.UP_SUBJECT_ID+"_"+record.data.SUBJECT_ID);
	                                                                                var tableGrpBox = { 
	                                                                                                    left : Math.ceil(tableGrp.transform().translateX)
	                                                                                                 , top : Math.ceil(tableGrp.transform().translateY)
	                                                                                                 , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
	                                                                                                 , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 15
	                                                                                                };
	                                                                                
	                                                                                var wh =  Ext.get('ERD-SUBJECTS').getSize();
	                                                                                
	                                                                                Ext.get(record.data.UP_SUBJECT_ID).scrollTo('top', tableGrpBox.top+tableRect.height()/2-wh.height/2, true)
	                                                                                Ext.get(record.data.UP_SUBJECT_ID).scrollTo('left',  tableGrpBox.left+tableRect.width()/2-wh.width/2, true);
	                                                                                
	                                                                                tableRect.animate({duration: 1000, delay: 10, when: 'now'}).attr({'stroke-width': 3});
	                                                                                tableRect.animate(1000, 1000, 'now').attr({'stroke-width': 0.7});
	                                                                            }
	                                                                            
	                                                                            for(var i=0; i < Ext.getCmp("ERD-SUBJECTS").items.keys.length;i++) {
	                                                                                if( record.get("UP_SUBJECT_ID") == Ext.getCmp("ERD-SUBJECTS").items.keys[i]) {
	                                                                                    Ext.getCmp("ERD-SUBJECTS").setActiveTab(i);
	                                                                                }
	                                                                            }

                                                                            }, 500);
                                                                        }
                                                                   }));
                                                                   // Ext.Msg.alert('안내', '테이블이 등록된 업무영역이 없습니다.');
                                                                   
                                                               }
                                                               var contextMenu = Ext.create('Ext.menu.Menu', {
                                                                   items: items
                                                               });
                                                               contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                                               return false;
                                                           }
                                                           
                                                       }
                                           },
                                           { header: '<div style="text-align:center;width:100%;">테이블 물리 명</div>', dataIndex: 'ENTITY_NM', flex: 1,
                                                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                                  return (record.get("ORD") == 2 &&record.get("FAVOR_YN") == "Y" ? "*" : "") + record.data.ENTITY_NM
                                                }
                                            },
                                       ]
                                  }
                             ]
                         },