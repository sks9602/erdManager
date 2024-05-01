<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

					{
						xtype: 'panel',
						layout: 'border',
						border : false,
						title : '공통컬럼',
						items : [
							{	xtype : 'gridpanel',
								region: 'center',
								columnLines: true,
								title : '공통컬럼',
								plugins: {
									cellediting: {
										editing : true,
										clicksToEdit: 1
									}
								},
								id : 'leftCommonColumn_gridpanel',
								tbar : ['->',
										<tagErd:button type="button" label="리로드" iconCls="search" cls="btn_segmentedbutton">
											listeners : {
												click : function(_this, e, eOpts) { 
													var store = Ext.getStore("commonColumnListStore").load({page : 1, limit : 999999 }); 
												}
											}
										</tagErd:button>
										<tagErd:button type="button" label="컬럼 추가" iconCls="search" id="erdLeftCommonColumnAdd" cls="btn_segmentedbutton">
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											listeners : {
												click : function(_this, e, eOpts) { 
													var store = Ext.getStore("commonColumnListStore")
													
													var grid = Ext.getCmp("leftCommonColumn_gridpanel");
													var selectedRecord = grid.getSelectionModel().getSelection()[0];
													
													var row = grid.store.indexOf(selectedRecord);
													
													var store = Ext.getStore("commonColumnListStore");
													if( row < 0 ) {
														row = store.getTotalCount();
														if( row < 0 ) {
															row = 0;
														}
													}
													store.insert(row+1, { "USE_YN" : "Y" });
												}
											}
										</tagErd:button>
										<tagErd:button type="splitbutton" label="컬럼 삭제" iconCls="search" id="erdLeftCommonColumnDelete"  cls="btn_segmentedbutton">
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											listeners : {
												click : function(_this, e, eOpts) { 
													var grid = Ext.getCmp("leftCommonColumn_gridpanel");
													var selectedRecords = grid.getSelectionModel().getSelection();
												
													for( var i=0; i < selectedRecords.length; i++) {
														if( selectedRecords[i].get("COLMN_ID") == null || selectedRecords[i].get("COLMN_ID") == ""){
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
														{text: '삭제 취소', id : 'leftCommonColumn_cancelDeleteColumn',
															handler : function(_this, ev) {
																var grid = Ext.getCmp("leftCommonColumn_gridpanel");
																var selectedRecords = grid.getSelectionModel().getSelection();
															   
																for( var i=0; i < selectedRecords.length; i++) {
																	selectedRecords[i].set("USE_YN", "Y");
																}
															}
														}
												]
											}
										</tagErd:button>
										<tagErd:button type="splitbutton" label="저장" iconCls="search" id="erdLeftCommonColumnSave"  cls="btn_segmentedbutton">
											disabled : ${sessionScope._sessionVO.notModelerRole} ,
											listeners : {
												click : function(_this, e, eOpts) { 
													var gridColumn = Ext.getCmp("leftCommonColumn_gridpanel");
													gridColumn.submit('all', '/column/data/commonColumnSave.do', {
														showSaving : true,
														callback : function(form, success, response) {
															
															var res = Ext.decode(response.responseText);
															
															var store = Ext.getStore("commonColumnListStore");
															store.reload();
															
															
														},
														success : function(batch, option) {
															Ext.MessageBox.hide();
															var store = Ext.getStore("commonColumnListStore");
															store.reload();
															// alert('성공');
														},
														failure : function() {
															Ext.MessageBox.hide();
															// alert('실패');
														}
													});
												}
											},
											menu: {
												plain: true,
												disabled : ${sessionScope._sessionVO.notModelerRole} ,
												items: [ 
														{text: '저장&amp;테이블에 적용', id : 'leftCommonColumn_saveAndAddToAllTable',
															handler : function(_this, ev) {
																var gridColumn = Ext.getCmp("leftCommonColumn_gridpanel");
																gridColumn.submit('all', '/column/data/commonColumnSaveAndAddToAllTable.do', {
																	msgConfirm : '공통 컬럼을 저장 후 모든 테이블에 추가하시겠습니까?',
																	showSaving : true,
																	callback : function(form, success, response) {
																		
																		var res = Ext.decode(response.responseText);
																		
																		var store = Ext.getStore("commonColumnListStore");
																		store.reload();
																		
																		
																	},
																	success : function(batch, action) {
																		Ext.MessageBox.hide();
																		var store = Ext.getStore("commonColumnListStore");
																		store.reload();
																		var pkInsertEntityList = Ext.decode(batch.responseText).PK_INSERT_ENTITY_LIST;
																		var entityList = Ext.decode(batch.responseText).ENTITY_LIST;
																		var entityColumnList = Ext.decode(batch.responseText).ENTITY_COLUMN_LIST;
																		drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, [], entityList, entityColumnList);
																		
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
											},
										</tagErd:button>
								],
								<tagErd:store type="store" id="commonColumnListStore" idProperty="COLMN_ID" url="/column/data/commonColumnList.do" rootProperty="data" expanded="true" params="PROJECT_ID : 'PROJECT'">
									// fields: store.tag로 이동
								</tagErd:store>
								columns: [
									{ header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 논리 명</div>', dataIndex: 'ATTR_NM', flex: 1, 
										editor: {
											allowBlank: false,
											selectOnFocus: false,
											listeners : {
												focusleave : function( _this, event, eOpts ) {
													var newValue = _this.getValue();
													var record = Ext.getCmp("leftCommonColumn_gridpanel").getSelectionModel().getLastSelected();
													ErdAppFunction.getWord( newValue, 'COLUMN', function(_value) {
														record.set('COLMN_NM', _value);// getSelection()[0]
													});
												}
											}
										},
										renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
											var link = new Array();

											if( record.get("USE_YN") == "N") {
												link.push('<span id="cmn_column_'+ record.data.ATTR_NM +'"><del>'+ record.data.ATTR_NM +'</del></span>');
											} else {
												link.push('<span id="cmn_column_'+ record.data.ATTR_NM +'">'+ record.data.ATTR_NM +'</span>');
											}
 
											return link.join(' ');
										},
									},
									{ header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>컬럼 물리 명</div>', dataIndex: 'COLMN_NM', flex: 1, minWidth : 120, 
										editor: {
											allowBlank: false,
											selectOnFocus: false
										},
									},
									{ text: '도메인', header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>도메인</div>', dataIndex: 'DOMAIN_NM', width : 90,
										 editor: {
													xtype: 'combotreegrid_domain',
													id : 'leftCommonColumn_combotreegrid_domain_picker',
													listeners :{
														change : function(_this, newValue, oldValue, eOpts) {
															var record = Ext.getCmp("leftCommonColumn_gridpanel").getSelectionModel().getLastSelected();
															
															record.set('DOMAIN_ID',_this.getDomainId());// getSelection()[0]
															record.set('DOMAIN_DATA_TYPE',_this.getDataType());// getSelection()[0]
															if( !record.get('COLMN_ID') ) {
																record.set("ATTR_NM", newValue );
                                                                record.set("COLMN_NM", _this.getColmnNm() );
															} else {
																if( !record.get('ATTR_NM') ) {
																	record.set("ATTR_NM", newValue );
																}
																
																if( !record.get('COLMN_NM') ) {
																	record.set("COLMN_NM", _this.getColmnNm() );
																}
															}
														}
													}
										  },
									},
									{ text: '도메인 데이터 타입', dataIndex: 'DOMAIN_DATA_TYPE', width : 150, hidden : true, },

								]
							}
						 ]
					  },