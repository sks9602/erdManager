<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>


{
	region: 'east',
	title: '선택된 테이블 정보',
	id : 'SELECTED-TABLE-DETAIL',
	xtype: 'tabpanel', // TabPanel itself has no title
	split: true,
	collapsible: true,
	collapsed : true,
	activeTab: 0,	  // First tab active by default
	width: 1350,	  // First tab active by default
	margin: '0 0 0 -2',
	border : true,
	items: [
		{
			// xtype: 'formPanel_ux',
			// id : 'centerRightEntityDetailForm',
			layout: 'border',
			border : false,
			title : '선택된 테이블 상세',
			items : [
				{
					region: 'north',
					xtype: 'formPanel_ux',
					id : 'centerRightEntityDetailForm',
					title: '테이블 상세',
					height : 53+(23*3),
					border : false,
					layout: { type: 'table' , columns: 2 },
					bbar : ['->',
						<tagErd:button type="button" label="삭제" iconCls="search" cls="btn_segmentedbutton" id="btn_tableDelete">
							hidden : true,
							disabled : ${sessionScope._sessionVO.notModelerRole} ,
							listeners : {
								click : function(_this, e, eOpts) { 
									var msg = "";
									if( Ext.getCmp("table_DML_TCD").value == "DML_TCD_I_D" || Ext.getCmp("table_DML_TCD").value == "DML_TCD_U_D" || Ext.getCmp("table_DML_TCD").value == "DML_TCD_D" ) {
										msg = '테이블 삭제를 취소하시겠습니까?';

										Ext.getCmp('centerRightEntityDetailForm').submit({
											msgConfirm : msg,
											url: '/entity/data/updateDmlTcd.do',
											success: function(form, action) {
												Ext.Msg.alert('성공', action.result.message, function() {
													var entity = action.result.ENTITY;
													
													Ext.getCmp("CENTER_RIGHT_TABLE_TRT_DT_FMT").setValue(entity.TRT_DT_FMT);
					
													var pkInsertEntityList = action.result.PK_INSERT_ENTITY_LIST;
													var pkDeleteEntityList = action.result.PK_DELETE_ENTITY_LIST;
													
													var entityList = action.result.ENTITY_LIST;
													var entityColumnList = action.result.ENTITY_COLUMN_LIST;
													
													drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
	
													var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
													
													drawDataLoad.getDrawedTable(subject_id, entity.ENTITY_ID).loadTableInfo( entity.ENTITY_ID , true);
							
												});
											},
											failure: function(form, action) {
												Ext.Msg.alert('성공', '처리되지 않았습니다. 다시 처리해주세요.');
											}
										});
									} else {
										// msg = '테이블을 삭제하시겠습니까?';
										ErdAppFunction.deleteTableWindow(drawDataLoad, 'deleteEntity');
									}

								}
							}
						</tagErd:button>
						<tagErd:button type="button" label="상태 저장" iconCls="search" cls="btn_segmentedbutton">
							disabled : ${sessionScope._sessionVO.notModelerRole} ,
							listeners : {
								click : function(_this, e, eOpts) { 
									Ext.getCmp('centerRightEntityDetailForm').submit({
										msgConfirm : '상태를 변경하시겠습니까?',
										url: '/entity/data/updateScd.do',
										success: function(form, action) {
											Ext.Msg.alert('성공', action.result.message, function() {
												// Ext.getCmp("CENTER_RIGHT_TABLE_TRT_DT_FMT").setValue(action.result.ENTITY.TRT_DT_FMT);
												
												var entity = action.result.ENTITY;
												
												Ext.getCmp("CENTER_RIGHT_TABLE_TRT_DT_FMT").setValue(entity.TRT_DT_FMT);
				
												var pkInsertEntityList = action.result.PK_INSERT_ENTITY_LIST;
												var pkDeleteEntityList = action.result.PK_DELETE_ENTITY_LIST;
												
												var entityList = action.result.ENTITY_LIST;
												var entityColumnList = action.result.ENTITY_COLUMN_LIST;
												
												drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
				
												/* 
												var subjectEntityList = action.result.ENTITY_LIST;
												drawDataLoad.restoreEntityInfo(entity, subjectEntityList);
												*/
											});
										},
										failure: function(form, action) {
										   switch (action.failureType) {
											   case Ext.form.action.Action.CLIENT_INVALID:
												   Ext.Msg.alert(
													   '오류',
													   '입력값을 확인하세요.'
												   );
												   break;
											   case Ext.form.action.Action.CONNECT_FAILURE:
												   Ext.Msg.alert('실패', '저장에 실패했습니다.');
												   break;
											   case Ext.form.action.Action.SERVER_INVALID:
												  Ext.Msg.alert('실패', action.result.errorMessage);
										  }
										}
									});
								}
							}
						</tagErd:button>
						<tagErd:button type="button" label="테이블 관리" iconCls="search" cls="btn_segmentedbutton">
							disabled : ${sessionScope._sessionVO.notModelerRole} ,
							listeners : {
								click : function(_this, e, eOpts) { 
									var me = this;
									var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
									var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
									
									ErdAppFunction.editTableWindow(subject_id, entity_id);
								}
							},
						</tagErd:button>
					],
					items : [
						<tagErd:itemText type="displayfield_ux" label="테이블 논리 명" name="TABL_NM" id="CENTER_RIGHT_TABL_NM" value="" placeholder="테이블 선택시 설정됨"></tagErd:itemText>
						<tagErd:itemText type="displayfield_ux" label="테이블 물리 명" name="ENTITY_NM" id="CENTER_RIGHT_ENTITY_NM" value="" placeholder="테이블 선택시 설정됨"></tagErd:itemText>
						<%-- tagErd:itemText type="displayfield_ux" label="테이블 관리상태" name="TABL_SCD_NM" value="" placeholder="테이블 선택시 설정됨"></tagErd:itemText --%>
						<tagErd:itemText type="displayfield_ux" label="DML유형" name="DML_TCD_NM" value=""></tagErd:itemText>
						<tagErd:itemText type="displayfield_ux" label="변경일" name="DML_DT_FMT"></tagErd:itemText>
						<tagErd:itemCode type="ext-js-combobox" label="테이블 관리상태" name="TABL_SCD" id="TABLE_DTL_TABL_SCD" cdGrp="TABL_SCD" value="" usedef4="Y"></tagErd:itemCode>
						<tagErd:itemText type="displayfield_ux" label="처리일" id="CENTER_RIGHT_TABLE_TRT_DT_FMT" name="TRT_DT_FMT"></tagErd:itemText>
						<!-- tagErd:itemCheckbox type="checkbox_ux" name="USE_YN" boxLabel="삭제컬럼포함" value="ALL" checked="false"-->
							/*
							listeners : {
								click : function() {
									alert(1);
									Ext.getStore("columnListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); 
								},
							},
							*/
						<!-- /tagErd:itemCheckbox -->
						<tagErd:itemText type="hiddenfield" label="ENTITY" id="CENTER_RIGHT_TABLE_ENTITY_ID" name="ENTITY_ID" value=""></tagErd:itemText>
						<tagErd:itemText type="hiddenfield" label="TABL_SCD" name="TABL_SCD" value=""></tagErd:itemText>
						<tagErd:itemText type="hiddenfield" label="DML_TCD" name="DML_TCD" value="" id="table_DML_TCD"></tagErd:itemText>
					]
				},
				{   xtype : 'gridpanel',
					region: 'center',
					columnLines: true,
					//enableDragDrop: true,
					enableLocking:true,
					selType: 'checkboxmodel',
					id : 'centerRightTable_gridpanel',
					selModel: {
						checkOnly: false,
						injectCheckbox: 1,
						mode: 'MULTI'
					},
					plugins: {
						cellediting: {
							editing : true,
							clicksToEdit: 1
						}
					},
					// scrollable:true,
					title: '컬럼목록',
					<tagErd:store type="store" id="columnListStore" idProperty="COLMN_ID" url="/entity/data/columnList.do" rootProperty="data" expanded="false" params="PROJECT_ID : 'PROJECT', ENTITY_ID : ''" autoLoad="true">
					  // fields: store.tag로 이동
					</tagErd:store>
					// reference: 'grid1',
					tbar : ['->',
						<tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
							listeners : {
								click : function(_this, e, eOpts) { 
									var store = Ext.getStore("columnListStore");
									store.reload();
								}
							}
						</tagErd:button>
						<tagErd:button type="splitbutton" label="컬럼 추가" iconCls="search" cls="btn_segmentedbutton">
							disabled : ${sessionScope._sessionVO.notModelerRole} ,
							listeners : {
								click : function(_this, e, eOpts) { 
									
									var store = Ext.getStore("columnListStore");
									var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
									/*
									store.insert(0, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y" });
									*/
									
									var grid = Ext.getCmp("centerRightTable_gridpanel");
									var selectedRecord = grid.getSelectionModel().getSelection()[0];
									
									var row = grid.store.indexOf(selectedRecord);
									
									var store = Ext.getStore("columnListStore");
									if( row < 0 ) {
										row = store.getTotalCount();
										if( row < 0 ) {
										   row = 0;
										}
									}
									store.insert(row+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
								}
							},
							menu: {
								plain: true,
								items: [ 
										{text: '3건 추가', id : 'erdCenterRight_addColumn3',
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											handler : function(_this, ev) {
												 // console.log( Ext.getCmp("centerRightTable_gridpanel").getSelection() );
												 var grid = Ext.getCmp("centerRightTable_gridpanel");
												 var selectedRecord = grid.getSelectionModel().getSelection()[0];
												 var row = grid.store.indexOf(selectedRecord);
												 
												 var store = Ext.getStore("columnListStore");
												 if( row < 0 ) {
													 row = store.getTotalCount();
													 if( row < 0 ) {
														row = 0;
													 }
												 }

												 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
												 for(var i=0; i < 3 ; i++){
													 store.insert(row+i+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
												 }
											}
										},
										{text: '5건 추가', id : 'erdCenterRight_addColumn5',
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											handler : function(_this, ev) {
												 var grid = Ext.getCmp("centerRightTable_gridpanel");
												 var selectedRecord = grid.getSelectionModel().getSelection()[0];
												 var row = grid.store.indexOf(selectedRecord);
												 
												 var store = Ext.getStore("columnListStore");
												 if( row < 0 ) {
													 row = store.getTotalCount();
													 if( row < 0 ) {
														row = 0;
													 }
												 }
												 
												 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
												 for(var i=0; i < 5 ; i++){
													 store.insert(row+i+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
												 }
											}
										},
										{text: '10건 추가', id : 'erdCenterRight_addColumn10',
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											handler : function(_this, ev) {
												 var grid = Ext.getCmp("centerRightTable_gridpanel");
												 var selectedRecord = grid.getSelectionModel().getSelection()[0];
												 var row = grid.store.indexOf(selectedRecord);
												 
												 var store = Ext.getStore("columnListStore");
												 if( row < 0 ) {
													 row = store.getTotalCount();
													 if( row < 0 ) {
														row = 0;
													 }
												 }
												 
												 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
												 for(var i=0; i < 10 ; i++){
													 store.insert(row+i+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
												 }
											}
										},
										{text: '다건 추가', id : 'erdCenterRight_addColumnMulti',
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											handler : function(_this, ev) {
												/*
												console.log( arguments );
												
												Ext.MessageBox.show({
												   title: 'Please wait',
												   msg: 'File Uploading...',
												   animateTarget: _this,
												   prompt: { xtype: 'numberfield', }
												})
												*/
												Ext.MessageBox.prompt('입력', '추가 할 컬럼 수(숫자만입력, 1~15사이 숫자):', function(btn, text) {
														var rowCnt = text.replace(/[^0-9]/g,'');
														
														if( btn == 'ok') {
															if( rowCnt > 15 || rowCnt < 1) {
																Ext.MessageBox.alert('알림', '숫자는 1~15사이의 숫자를 입력하세요.')
															} else {
																
																 var grid = Ext.getCmp("centerRightTable_gridpanel");
																 var selectedRecord = grid.getSelectionModel().getSelection()[0];
																 var row = grid.store.indexOf(selectedRecord);
																 
																 var store = Ext.getStore("columnListStore");
																 if( row < 0 ) {
																	 row = store.getTotalCount()-1;
																	 if( row < 0 ) {
																		row = 0;
																	 }
																 }
																 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
																
																 for(var i=0; i < rowCnt ; i++){
																	 store.insert(row+i+1, {"ENTITY_ID": entity_id, "COLMN_NM" : "", "USE_YN" : "Y", "DML_TCD" : "DML_TCD_C", "DML_TCD_NM" : "추가", "DML_DT_FMT" : "" });
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
										{text: '공통컬럼 추가', id : 'erdCenterRight_addColumnCommon',
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											handler : function(_this, ev) {
												 var store = Ext.getStore("columnListStore");
												 var entity_id = Ext.getCmp('CENTER_RIGHT_TABLE_ENTITY_ID').getValue();
												 
											}
										},
								],
								/*
								listeners: {
									click: function (menu, item) {


									}
								}
								*/
							},
						</tagErd:button>
						<tagErd:button type="splitbutton" label="컬럼 삭제" iconCls="search" cls="btn_segmentedbutton">
							disabled : ${sessionScope._sessionVO.notModelerRole} ,
							listeners : {
								click : function(_this, e, eOpts) { 
									var grid = Ext.getCmp("centerRightTable_gridpanel");
									var selectedRecords = grid.getSelectionModel().getSelection();
								   
									var isFK = false;
								   
									for( var i=0; i < selectedRecords.length; i++) {
										console.log( i, selectedRecords[i]['crudState']);
										if( selectedRecords[i].get("COLMN_ID") == null || selectedRecords[i].get("COLMN_ID") == ""){
											/*
											var row = grid.store.indexOf(selectedRecords[i]);
											*/
											grid.getStore().remove(selectedRecords[i]);
										} else {
											if( ( selectedRecords[i].get("FK_COLMN_ID") != null && selectedRecords[i].get("FK_COLMN_ID") != '' )
												|| ( selectedRecords[i].get("FK_ENTITY_ID") != null && selectedRecords[i].get("FK_ENTITY_ID") != '' ) ) {
												isFK = true;
											} else {
												selectedRecords[i].set("USE_YN", "N");
												
												selectedRecords[i].set("DML_TCD", selectedRecords[i].get("DML_TCD")+"_D");
												selectedRecords[i].set("DML_TCD_NM", "삭제");
												selectedRecords[i].set("DML_DT_FMT", "");
											}
										}
									}
								
									if( isFK ) {
										Ext.Msg.alert('안내', 'FK는 삭제할 수 없습니다.');
									}
								}
							},
							menu: {
								disabled : ${sessionScope._sessionVO.notModelerRole} ,
								plain: true,
								items: [ 
										{text: '삭제 취소', id : 'erdCenterRight_cancelDeleteColumn',
											handler : function(_this, ev) {
												var grid = Ext.getCmp("centerRightTable_gridpanel");
												var selectedRecords = grid.getSelectionModel().getSelection();
											   
												for( var i=0; i < selectedRecords.length; i++) {
													selectedRecords[i].set("USE_YN", "Y");
												
													var dmlTcd = selectedRecords[i].get("DML_TCD").replace(/_D/ig, '');
													selectedRecords[i].set("DML_TCD", dmlTcd);
													selectedRecords[i].set("DML_TCD_NM", dmlTcd == 'DML_TCD_C' ? '추가' : '수정');
													selectedRecords[i].set("DML_DT_FMT", "");
												}
											}
										}
								]
							}
						</tagErd:button>
						<tagErd:button type="button" label="글자색 변경" iconCls="search" cls="btn_segmentedbutton">
							disabled : ${sessionScope._sessionVO.notModelerRole} ,
							listeners : {
								click : function(_this, e, eOpts) { 
									 Ext.create('Ext.menu.ColorPicker', {
										   listeners : {
											   select : function ( _this, color, eOpts ) {
												   var grid = Ext.getCmp("centerRightTable_gridpanel");
												   var selectedRecords = grid.getSelectionModel().getSelection();
												   for( var i=0; i < selectedRecords.length; i++) {
													   selectedRecords[i].set("COLOR", color);
													   /*
														var row = grid.store.indexOf(selectedRecords[i]);
														// console.log( row, selectedRecords[i]);
														grid.getStore().remove(selectedRecords[i]);
														*/
												   }
											   }
										   }
												 
									  }).showAt([_this.getBox().x, _this.getBox().y+_this.getBox().height]);
								  

								}
							}
						</tagErd:button>
						<tagErd:button type="none" label="사전 적용" iconCls="search" cls="btn_segmentedbutton">
						
							disabled : ${sessionScope._sessionVO.notModelerRole} ,
							/*
							listeners : {
								click : function(_this, e, eOpts) { 
									var gridColumn = Ext.getCmp("centerRightTable_gridpanel");
									gridColumn.submit('all', '/column/data/updateEntityNameByWord.do', {
										showSaving : true,
										msgConfirm : '단어사전을 적용하시겠습니까?',
										callback : function(form, success, response) {
											
											var res = Ext.decode(response.responseText);
											
											var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
											var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;

											var entityList = res.ENTITY_LIST;
											var entityColumnList = res.ENTITY_COLUMN_LIST;

											drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
										
											var store = Ext.getStore("columnListStore");
											store.reload();
											
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
							},
							*/
							menu: {
								plain: true,
								disabled : ${sessionScope._sessionVO.notModelerRole} ,
								items: [ 
										{text: '테이블+컬럼 사전적용', 
											handler : function(_this, ev) {
												var gridColumn = Ext.getCmp("centerRightTable_gridpanel");
												gridColumn.submit('all', '/column/data/updateEntityNameByWord.do', {
													showSaving : true,
													msgConfirm : '단어사전을 적용하시겠습니까?',
													params : {"TARGET" : "ALL"} ,
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
												var gridColumn = Ext.getCmp("centerRightTable_gridpanel");
												gridColumn.submit('all', '/column/data/updateEntityNameByWord.do', {
													showSaving : true,
													msgConfirm : '단어사전을 적용하시겠습니까?',
													callback : function(form, success, response) {
														
														var res = Ext.decode(response.responseText);
														
														var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
														var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;
			
														var entityList = res.ENTITY_LIST;
														var entityColumnList = res.ENTITY_COLUMN_LIST;
			
														drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
													
														var store = Ext.getStore("columnListStore");
														store.reload();
														
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
								
								
								]
							}
						</tagErd:button>
						<tagErd:button type="button" label="저장" iconCls="search" cls="btn_segmentedbutton">
							disabled : ${sessionScope._sessionVO.notModelerRole} ,
							listeners : {
								click : function(_this, e, eOpts) { 
									var gridColumn = Ext.getCmp("centerRightTable_gridpanel");
									gridColumn.submit('all', '/entity/data/columnSave.do', {
										showSaving : true,
										callback : function(form, success, response) {
											
											var res = Ext.decode(response.responseText);
											
											var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
											var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;

											var entityList = res.ENTITY_LIST;
											var entityColumnList = res.ENTITY_COLUMN_LIST;

											drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
										
											var store = Ext.getStore("columnListStore");
											store.reload();
											
											
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
							beforedrop : function ( node, data, overModel, dropPosition, dropHandlers, eOpts )  {
								for( var i=0; i < data.records.length; i++) {
									var dropRec = data.records[i];
									dropRec.set("ENTITY_ID", Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue());
									
									if( !dropRec.get("ATTR_NM") && dropRec.get("DOMAIN_NM") ) {
										dropRec.set("ATTR_NM",dropRec.get("DOMAIN_NM"));
										
										ErdAppFunction.getWord( dropRec.get("DOMAIN_NM"), 'COLUMN', function(_value) {
											dropRec.set('COLMN_NM', _value);// getSelection()[0]
										});
									}
									if( !dropRec.get("DOMAIN_DATA_TYPE")) {
										dropRec.set("DOMAIN_DATA_TYPE",dropRec.get("DATA_TYPE"));
									}
									
									if( typeof(dropRec.get("PK_YN_BOOL")) == 'string') {
										if( dropRec.get("PK_YN_BOOL") == "true") {
											dropRec.set("PK_YN_BOOL", true) 
										} else {
											dropRec.set("PK_YN_BOOL", false) 
										}
									}
									if( typeof(dropRec.get("NOTNOLL_YN_BOOL")) == 'string') {
										if( dropRec.get("NOTNOLL_YN_BOOL") == "true") {
											dropRec.set("NOTNOLL_YN_BOOL", true) 
										} else {
											dropRec.set("NOTNOLL_YN_BOOL", false) 
										}
									}
									dropRec.set("DML_TCD", "DML_TCD_C");
									dropRec.set("DML_TCD_NM", "추가");
								}
							},
							drop: function(node, data, dropRec, dropPosition) {
								console.log( arguments )
							}
						}
					},
					columns: [
						{ xtype: 'rownumberer', },
						{ text: 'PK', dataIndex: 'PK_YN_BOOL', xtype: 'checkcolumn', width : 28, menuDisabled : true,  locked : true, resizable : false, sort : false,
							  listeners : {
								  checkchange : function( _this, rowIndex, checked, record, e, eOpts ) {
									  record.set("NOTNULL_YN_BOOL", checked);
								  }
							  }
						},
						
						/*
						{ text: 'PK', dataIndex: 'PK_YN', align: "center", width : 40, resizable : false, menuDisabled : true,  locked : true,  sort : false,
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
						{ text: '컬럼 논리 명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 논리 명</div>', dataIndex: 'ATTR_NM', width : 120, minWidth : 100, locked : true, sort : false,
							editor: {
								allowBlank: false,
								selectOnFocus: false,
								listeners : {
									focusleave : function( _this, event, eOpts ) {
										var newValue = _this.getValue();
									//change : function( _this, newValue, oldValue, eOpts ) {	
										var record = Ext.getCmp("centerRightTable_gridpanel").getSelectionModel().getLastSelected();

                                        if( record.get("COLMN_ID") != "" && record.get("DML_TCD").indexOf("_D") < 0 ) {
	                                        record.set("DML_TCD", "DML_TCD_U");
	                                        record.set("DML_TCD_NM", '수정');
	                                        record.set("DML_DT_FMT", "");
                                        }
										ErdAppFunction.getWord( newValue, 'COLUMN', function(_value) {
											record.set('COLMN_NM', _value);// getSelection()[0]
										});
									}
								}
							},
							renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
								var link = new Array();
								if( record.get("USE_YN") == "N") {
									link.push('<span style="color:'+record.get("COLOR")+'"><del>'+ value +'</del></span>');
								} else {
									link.push('<span style="color:'+record.get("COLOR")+'">'+ value +'</span>');
								}
								return link.join(' ');
							}
						},
						{ text: '컬럼 물리 명', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 명</div>', width : 120, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100,  locked : true, sort : false,
							renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
								var link = new Array();
								if( record.get("USE_YN") == "N") {
									link.push('<span id="column_'+ record.data.COLMN_NM +'"><del>'+ record.data.COLMN_NM +'</del></span>');
								} else {
									link.push('<span id="column_'+ record.data.COLMN_NM +'">'+ record.data.COLMN_NM +'</span>');
								}
								
								return link.join(' ');
							},
							editor: {
								allowBlank: false,
								selectOnFocus: false
							},
						},
						{ text: '도메인', header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>도메인</div>', dataIndex: 'DOMAIN_NM', width : 90, sort : false,
							 editor: {
										xtype: 'combotreegrid_domain',
										id : 'centerRight_combotreegrid_domain_picker',
										listeners :{
											change : function(_this, newValue, oldValue, eOpts) {
												console.log( _this )
												Ext.getCmp("centerRightTable_gridpanel").getSelectionModel().getLastSelected().set('DOMAIN_ID',_this.getDomainId());// getSelection()[0]
												Ext.getCmp("centerRightTable_gridpanel").getSelectionModel().getLastSelected().set('DOMAIN_DATA_TYPE',_this.getDataType());// getSelection()[0]
												Ext.getCmp("centerRightTable_gridpanel").getSelectionModel().getLastSelected().set('DATA_TYPE',_this.getDataType());// getSelection()[0]
											},
										}
							  },
						  },
						{ text: '도메인 데이터 타입', dataIndex: 'DOMAIN_DATA_TYPE', width : 110, hidden : true,  sort : false,},
						{ text: '데이터 타입', header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>데이터 타입</div>', dataIndex: 'DATA_TYPE', width : 90,  sort : false, 
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
								if( record.get("DOMAIN_ID")||'' !='' && record.get("DOMAIN_DATA_TYPE") != value) {
									return '<span style="color:red;" id="column_data_type'+ record.get("COLMN_NM") +'">'+ value +'</span>';
								} else {
									return value;
								}
							},
							editor: {
								xtype: 'combotreegrid_dataType',
								id : 'combotreegrid_dataType_picker',
								vtype : 'MariaDBDataTypeScale',
								/*
								listeners :{
									change : function(_this, newValue, oldValue, eOpts) {
										if( newValue != oldValue && Ext.getCmp("centerRightTable_gridpanel").getSelectionModel().getLastSelected().get('COLMN_ID') ) {
											Ext.getCmp("centerRightTable_gridpanel").getSelectionModel().getLastSelected().set('DML_TCD', "DML_TCD_U");// getSelection()[0]
											Ext.getCmp("centerRightTable_gridpanel").getSelectionModel().getLastSelected().set('DML_TCD_NM', "수정");// getSelection()[0]
										}
									}
								}
								*/
							}
						},
						{ text: 'Not널', dataIndex: 'NOTNULL_YN_BOOL', xtype: 'checkcolumn', align: "center", width : 50, menuDisabled : true, resizable : false,  sort : false,
							  listeners : {
								  checkchange : function( _this, rowIndex, checked, record, e, eOpts ) {
									  if( record.get("PK_YN_BOOL")==true ) {
										  record.set("NOTNULL_YN", record.get("PK_YN_BOOL" ));
									  }
									  
								  }
							  }
						},
						{
							text: '기본값', dataIndex: 'DEFAULT_VAL', header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>기본값</div>', width : 100, menuDisabled : true,  sort : false,
							editor: {
								xtype: 'textfield',
							},
							renderer : function (value, metaData, record , rowIndex, colIndex, store, view ){
								return value;
							}
						},
						{
							text: '글자색', dataIndex: 'COLOR', header: '<img src="/static/image/RGB_Circle.png" width="16px" height="12px"/><!-- div style="text-align:center;width:100%;">*글자색</div-->', width : 40, menuDisabled : true, align: 'center', sort : false,
							editor: {
								xtype: 'colorcombo_ux',
							},
							renderer : function (value, metaData, record , rowIndex, colIndex, store, view ){
								return '<div style="width:10px;height:10px;background-color:'+value+'"> </div>';
							}
						},
						/*
						{ text: '*Not널', dataIndex: 'NOTNULL_YN', align: "center", width : 45,  sort : false,
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
						{ text: 'Foreign Key', header: '<div style="text-align:center;width:100%;">Foreign Key</div>',  dataIndex: 'FK', align: "left", width : 100,  sort : false,
						   renderer : function(value, metaData, record , rowIndex, colIndex, store, view) {
							  if( record.data.FK_ENTITY_NM && record.data.FK_COLMN_ID) {
								  return  record.data.FK_ENTITY_NM+"."+record.data.FK_COLMN_ID;
							  } else {
								  return "";
							  }
						  }},
						{ text: '[코드]/채번방식',  header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>코드/채번방식</div>',dataIndex: 'NUMB_MTH', width : 120, visible : false, align : 'left', sort : false,
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
							},
							editor: {
								selectOnFocus: false
							},
						},
						{ text: 'CUD',  header: '<div style="text-align:center;width:100%;">CUD</div>',dataIndex: 'DML_TCD_NM', width : 40, visible : false,  sort : false, },
						{ text: 'CUD일자',  header: '<div style="text-align:center;width:100%;">CUD일자</div>',dataIndex: 'DML_DT_FMT', width : 80, visible : false, align: 'center', sort : false, },
						{ text: 'NOTE',  header: '<div style="text-align:center;width:100%;"><div class="grid-header-textarea"></div>Note</div>',dataIndex: 'COLMN_DESC', flex: 1, minWidth :100, width : 100, visible : false, sort : false,  
						   editor :  {
								xtype: 'textarea', // 'htmleditor',
								grow : true,
								enableColors: false,
								enableAlignments: false
						   }   
						},
						{ text: '상태',  header: '<div style="text-align:center;width:100%;">상태</div>',dataIndex: 'COLMN_SCD_NM', width : 60, visible : false, sort : false, },
					]
				}, 
				{
					region: 'south',
					title: '인덱스',
					border : false,
					split: true,
					collapsed : true,
					collapsible: true,
					height : 150,
					items : [
						
					]
				}
			]
		}
	]
}