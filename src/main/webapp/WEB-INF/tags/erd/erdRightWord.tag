<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>
	
					{
						xtype: 'panel',
						layout: 'border',
						border : false,
						title : '단어사전',
						items : [
							{
								region: 'north',
								title: '검색조건',
								height : (27*2) + 22,
								border : false,
								xtype : 'formPanel_ux',
								id : 'wordForm',
								layout: { type: 'table' , columns: 2 },
								items : [
									<tagErd:itemText type="textfield_ux" label="단어" name="WORDS" value="" placeholder="';'로 구분하면 다건조회 가능">
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
								],
								bbar : ['->',
								   <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
									   listeners : { 
										   click : function(_this, e, eOpts) { 
											   if( this.up('form').getForm().isValid() ) {
												   var me = this;
												   //console.log( me.up('form').getValues )
												   var store = Ext.getStore("wordListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
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
								id : 'wordList',
								collapsible: false,
								id : 'rightWord_gridpanel',
								title : '단어 목록',
								plugins: {
									cellediting: {
										editing : true,
										clicksToEdit: 1
									}
								},
								scrollable:true,
								<tagErd:store type="store" id="wordListStore" idProperty="WORD" url="/word/data/list.do" rootProperty="data" params="" autoLoad="true">

								</tagErd:store>
								tbar : ['->',
									<tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
										listeners : {
											click : function(_this, e, eOpts) { 
												var store = Ext.getStore("wordListStore");
												store.reload();
											}
										}
									</tagErd:button>
									<tagErd:button type="button" label="단어 삭제" iconCls="search" cls="btn_segmentedbutton">
										disabled : ${sessionScope._sessionVO.notModelerRole} ,
										listeners : {
											click : function(_this, e, eOpts) { 
												var grid = Ext.getCmp("rightWord_gridpanel");
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
									<tagErd:button type="splitbutton" label="컬럼 추가" iconCls="search" cls="btn_segmentedbutton">
										disabled : ${sessionScope._sessionVO.notModelerRole} ,
										listeners : {
											click : function(_this, e, eOpts) { 
												
												var store = Ext.getStore("wordListStore");
												
												var grid = Ext.getCmp("rightWord_gridpanel");
												var selectedRecord = grid.getSelectionModel().getSelection()[0];
												
												var row = -1 ; // grid.store.indexOf(selectedRecord);
												/*
												var store = Ext.getStore("wordListStore");
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

										menu: {
											plain: true,
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											items: [ 
													{text: '3건 추가', id : 'rightWord_addColumn3',
														disabled : ${sessionScope._sessionVO.notModelerRole} ,
														handler : function(_this, ev) {
															 var grid = Ext.getCmp("rightWord_gridpanel");
															 var selectedRecord = grid.getSelectionModel().getSelection()[0];
															 var row = -1 ; // grid.store.indexOf(selectedRecord);
															 
															 var store = Ext.getStore("wordListStore");
															 /*
															 if( row < 0 ) {
																 row = store.getTotalCount();
																 if( row < 0 ) {
																	row = 0;
																 }
															 }
															 */
															 for(var i=0; i < 3 ; i++){
																 store.insert(row+i+1, { });
															 }
														}
													},
													{text: '5건 추가', id : 'rightWord_addColumn5',
														disabled : ${sessionScope._sessionVO.notModelerRole} ,
														handler : function(_this, ev) {
															 var grid = Ext.getCmp("rightWord_gridpanel");
															 var selectedRecord = grid.getSelectionModel().getSelection()[0];
															 var row = -1 ; // grid.store.indexOf(selectedRecord);
															 
															 var store = Ext.getStore("wordListStore");
															 /*
															 if( row < 0 ) {
																 row = store.getTotalCount();
																 if( row < 0 ) {
																	row = 0;
																 }
															 }
															 */
															 for(var i=0; i < 5 ; i++){
																 store.insert(row+i+1, { });
															 }
														}
													},
													{text: '10건 추가', id : 'rightWord_addColumn10',
														disabled : ${sessionScope._sessionVO.notModelerRole} ,
														handler : function(_this, ev) {
															 var grid = Ext.getCmp("rightWord_gridpanel");
															 var selectedRecord = grid.getSelectionModel().getSelection()[0];
															 var row = -1 ; //grid.store.indexOf(selectedRecord);
															 
															 var store = Ext.getStore("wordListStore");
															 /*
															 if( row < 0 ) {
																 row = store.getTotalCount();
																 if( row < 0 ) {
																	row = 0;
																 }
															 }
															 */
															 for(var i=0; i < 10 ; i++){
																 store.insert(row+i+1, { });
															 }
														}
													},
													{text: '다건 추가', id : 'rightWord_addColumnMulti',
														disabled : ${sessionScope._sessionVO.notModelerRole} ,
														handler : function(_this, ev) {
															Ext.MessageBox.prompt('입력', '추가 할 컬럼 수(숫자만입력, 1~15사이 숫자):', function(btn, text) {
																	var rowCnt = text.replace(/[^0-9]/g,'');
																	
																	if( btn == 'ok') {
																		if( rowCnt > 15 || rowCnt < 1) {
																			Ext.MessageBox.alert('알림', '숫자는 1~15사이의 숫자를 입력하세요.')
																		} else {
																			
																			 var grid = Ext.getCmp("rightWord_gridpanel");
																			 var selectedRecord = grid.getSelectionModel().getSelection()[0];
																			 var row = -1 ; //grid.store.indexOf(selectedRecord);
																			 
																			 var store = Ext.getStore("wordListStore");
																			 /*
																			 if( row < 0 ) {
																				 row = store.getTotalCount()-1;
																				 if( row < 0 ) {
																					row = 0;
																				 }
																			 }
																			 */
																			 for(var i=0; i < rowCnt ; i++){
																				 store.insert(row+i+1, { });
																			 }
																		}
																	}
																}, this, false, '10', {
																	prompt : { xtype: 'numberfield',
																			   minValue: 0, 
																			   maxValue: 100 
																			 }
																}
															);
															
														}
													},
													{text: '공통컬럼 추가', id : 'rightWord_addColumnCommon',
														disabled : ${sessionScope._sessionVO.notModelerRole} ,
														handler : function(_this, ev) {
															 var store = Ext.getStore("wordListStore");
															 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
															 
														}
													},
											   ]   
										  },
									</tagErd:button>
									
									<tagErd:button type="none" label="사전 적용" iconCls="search" cls="btn_segmentedbutton">
										menu: {
											plain: true,
											items: [ 
													{text: '테이블+컬럼 사전적용', 
														disabled : ${sessionScope._sessionVO.notModelerRole} ,
														handler : function(_this, ev) {
															var gridColumn = Ext.getCmp("rightWord_gridpanel");
															gridColumn.submit('changed', '/word/data/save.do', {
																showSaving : true,
																forceSave : true,
																params : {"WORD_TARGET" : "ALL"} ,
																callback : function(form, success, response) {
																	
																	var res = Ext.decode(response.responseText);
																	
																	var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
																	var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;
						
																	var entityList = res.ENTITY_LIST;
																	var entityColumnList = res.ENTITY_COLUMN_LIST;
						
																	drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
																	
																	var entity_id = Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue();
																	ErdDrawFunction.loadTableInfo(entity_id, true);
																	
																},
																success : function(batch, option) {
																	Ext.MessageBox.hide();
																	var store = Ext.getStore("wordListStore");
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
													},
													{text: '컬럼 사전적용', 
														disabled : ${sessionScope._sessionVO.notModelerRole} ,
														handler : function(_this, ev) {
															var gridColumn = Ext.getCmp("rightWord_gridpanel");
															gridColumn.submit('changed', '/word/data/save.do', {
																showSaving : true,
																forceSave : true,
																params : {"WORD_TARGET" : "COLUMN"} ,
																callback : function(form, success, response) {
																	
																	var res = Ext.decode(response.responseText);
																	
																	var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
																	var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;
						
																	var entityList = res.ENTITY_LIST;
																	var entityColumnList = res.ENTITY_COLUMN_LIST;
						
																	drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
																	
																	var entity_id = Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue();
																	ErdDrawFunction.loadTableInfo(entity_id, true);
																	
																},
																success : function(batch, option) {
																	Ext.MessageBox.hide();
																	var store = Ext.getStore("wordListStore");
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
											]
										}
									</tagErd:button>
									
									
									<tagErd:button type="button" label="저장" iconCls="search" cls="btn_segmentedbutton">
										disabled : ${sessionScope._sessionVO.notModelerRole} ,
										listeners : {
											click : function(_this, e, eOpts) { 
												var gridColumn = Ext.getCmp("rightWord_gridpanel");
												gridColumn.submit('changed', '/word/data/save.do', {
													showSaving : true,
													callback : function(form, success, response) {
														
														var res = Ext.decode(response.responseText);
														
													},
													success : function(batch, option) {
														Ext.MessageBox.hide();
														var store = Ext.getStore("wordListStore");
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
									{ text: '단어', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>단어</div>', dataIndex: 'WORD', width : 120, minWidth : 100, locked : true, 
										editor: {
											allowBlank: false,
											selectOnFocus: false
										},
										renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
											var link = new Array();
											if( record.get("USE_YN") == "N") {
												link.push('<del>'+ value +'</del>');
											} else {
												link.push(value);
											}
											return link.join(' ');
										},
									},
									{ text: '약어', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>약어</div>', dataIndex: 'ABBR', width : 120, minWidth : 100, locked : true, 
										editor: {
											allowBlank: true,
											selectOnFocus: false
										},
									},
									{ text: '단어', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>ENGLISH</div>', dataIndex: 'ENGLISH', width : 120, minWidth : 100, locked : false, 
										editor: {
											allowBlank: true,
											selectOnFocus: false
										},
									},
									{ text: '설명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>설명</div>', dataIndex: 'WORD_DESC', flex : 1, width : 120, minWidth : 100,
										editor: {
											allowBlank: true,
											selectOnFocus: false
										},
									},
									{ text: '수정일', header: '<div style="text-align:center;width:100%;">수정일</div>', dataIndex: 'LAST_UPD_DT_FMT', resizeble : false, width : 120, minWidth : 120, },
								
								]
							}
						]
					},