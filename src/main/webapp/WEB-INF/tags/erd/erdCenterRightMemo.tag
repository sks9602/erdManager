<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>
	
					{
						xtype: 'panel',
						layout: 'border',
						border : false,
						title : '메모',
						items : [
							{
								region: 'north',
								title: '검색조건',
								height : (27*2) + 22,
								border : false,
								xtype : 'formPanel_ux',
								id : 'entityMemoForm',
								layout: { type: 'table' , columns: 2 },
								items : [
									<tagErd:itemText type="textfield_ux" label="메모" name="MEMO" value="" placeholder="';'로 구분하면 다건조회 가능">
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
								],
								bbar : ['->',
								   <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
									   listeners : { 
										   click : function(_this, e, eOpts) { 
											   if( this.up('form').getForm().isValid() ) {
												   var me = this;
												   //console.log( me.up('form').getValues )
												   var store = Ext.getStore("entityMemoListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
											   }
										   }
										}
								  </tagErd:button>
								]
							}, {
								xtype : 'gridpanel',
								columnLines: true,
								region: 'center',
								rowLines : true,
								collapsible: false,
								id : 'rightEntityMemo_gridpanel',
								title : '메모 목록',
								plugins: [
									{
										ptype: 'cellediting',
										clicksToEdit: 1
									},
									'gridfilters'
								],
								scrollable:true,
								<tagErd:store type="store" id="entityMemoListStore" idProperty="MEMO_KEY" url="/entity/data/memoList.do" rootProperty="data" params="" autoLoad="true">

								</tagErd:store>
								tbar : ['->',
									<tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
										listeners : {
											click : function(_this, e, eOpts) { 
												var store = Ext.getStore("entityMemoListStore");
												store.reload();
											}
										}
									</tagErd:button>
									<tagErd:button type="button" label="메모 삭제" iconCls="search" id="erdRightEntityMemoDelete" cls="btn_segmentedbutton">
										disabled : ${sessionScope._sessionVO.notModelerRole} ,
										listeners : {
											click : function(_this, e, eOpts) { 
												var grid = Ext.getCmp("rightEntityMemo_gridpanel");
												var selectedRecords = grid.getSelectionModel().getSelection();
												for( var i=0; i < selectedRecords.length; i++) {
													if( selectedRecords[i].get("WORD_ID") == null || selectedRecords[i].get("WORD_ID") == ""){
														grid.getStore().remove(selectedRecords[i]);
													} else {
														selectedRecords[i].set("USE_YN", "N");
													}
												}
											}
										}
									</tagErd:button>
									<tagErd:button type="button" label="메모 추가" iconCls="search" id="erdRightEntityMemoAdd" cls="btn_segmentedbutton">
										disabled : ${sessionScope._sessionVO.notModelerRole} ,
										listeners : {
											click : function(_this, e, eOpts) { 
												
												var store = Ext.getStore("entityMemoListStore");
												
												var grid = Ext.getCmp("rightEntityMemo_gridpanel");
												var selectedRecord = grid.getSelectionModel().getSelection()[0];
												
												var row = -1 ; // grid.store.indexOf(selectedRecord);
												/*
												var store = Ext.getStore("entityMemoListStore");
												if( row < 0 ) {
													row = store.getTotalCount();
													if( row < 0 ) {
													   row = 0;
													}
												}
												*/
												store.insert(row+1, { });
			
											}
										},
									</tagErd:button>
									
									
									<tagErd:button type="button" label="저장" iconCls="search" id="erdRightEntityMemoSave" cls="btn_segmentedbutton">
										disabled : ${sessionScope._sessionVO.notModelerRole} ,
										listeners : {
											click : function(_this, e, eOpts) { 
												var gridColumn = Ext.getCmp("rightEntityMemo_gridpanel");
												gridColumn.submit('changed', '/entityMemo/data/save.do', {
													showSaving : true,
													callback : function(form, success, response) {
														
														var res = Ext.decode(response.responseText);
														
													},
													success : function(batch, option) {
														Ext.MessageBox.hide();
														var store = Ext.getStore("entityMemoListStore");
														store.reload();
														// store.commitChanges();
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
								columns: [
									{ xtype: 'rownumberer', },
                                    { text: '등록일', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div><div class="grid-header-filter"></div>등록일</div>', dataIndex: 'TRT_DT', width : 120, minWidth : 100, align:'center', filter: {type: 'date', dataIndex: 'TRT_DT'},
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
                                          if(Ext.util.Format.date(new Date(),"Y-m-d") == Ext.util.Format.date(value,"Y-m-d")) {
                                               return Ext.util.Format.date(value,"H:i:s");
                                          } else {
                                               return Ext.util.Format.date(value,"Y-m-d");
                                          }
                                       }
                                    },
                                    { text: '등록자', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div><div class="grid-header-filter"></div>등록자</div>', dataIndex: 'USR_NM', width : 120, minWidth : 100, align:'center', filter: {type: 'string', dataIndex: 'USR_NM'},
                                    },
									{ text: '메모', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div><div class="grid-header-filter"></div>메모</div>', dataIndex: 'TABL_DESC', flex : 1, width : 120, minWidth : 100, filter: {type: 'string', dataIndex: 'TABL_DESC'}, cellWrap: true,
										editor :  {
											xtype: 'textarea', // 'htmleditor',
											grow : true,
											enableColors: true,
											enableAlignments: false
										},
										renderer: function(value) {
										    return '<div style="white-space: pre-wrap;">' + (value ? value : '') + '</div>';
											// return '<div style="white-space: normal;"><pre>' + value||'' + '</pre></div>';
										}
									},
								]
							}
						]
					},