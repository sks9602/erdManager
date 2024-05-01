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
							disabled : false ,
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
													
													// Ext.getCmp("CENTER_RIGHT_TABLE_TRT_DT_FMT").setValue(entity.TRT_DT_FMT);
					
													var pkInsertEntityList = action.result.PK_INSERT_ENTITY_LIST;
													var pkDeleteEntityList = action.result.PK_DELETE_ENTITY_LIST;
													
													var entityList = action.result.ENTITY_LIST;
													var entityColumnList = action.result.ENTITY_COLUMN_LIST;
													
													drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
	
													var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
													
													if(drawDataLoad.getDrawedTable(subject_id, entity.ENTITY_ID)) {
													    drawDataLoad.getDrawedTable(subject_id, entity.ENTITY_ID).loadTableInfo( entity.ENTITY_ID , true);
							                        }
							                        // 좌측 테이블 영역 재조회.
							                        Ext.getStore("entityListStore").reload();
							                        
							                        Ext.getCmp("btn_tableDelete").setText("삭제");
							                        
							                        if( Ext.getCmp("table_DML_TCD").value == "DML_TCD_I_D") {
							                             Ext.getCmp("table_DML_TCD").setValue("DML_TCD_I");
							                        } else if( Ext.getCmp("table_DML_TCD").value == "DML_TCD_U_D") {
                                                         Ext.getCmp("table_DML_TCD").setValue("DML_TCD_U");
                                                    } else {
                                                         Ext.getCmp("table_DML_TCD").setValue("DML_TCD");
                                                    }
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
						<tagErd:button type="button" label="상태 저장" iconCls="search" cls="btn_segmentedbutton" id="btn_tableSaveStatus">
							disabled : false ,
							listeners : {
								click : function(_this, e, eOpts) { 
									Ext.getCmp('centerRightEntityDetailForm').submit({
										msgConfirm : '상태를 변경하시겠습니까?',
										url: '/entity/data/updateScd.do',
										success: function(form, action) {
											Ext.Msg.alert('성공', action.result.message, function() {
												// Ext.getCmp("CENTER_RIGHT_TABLE_TRT_DT_FMT").setValue(action.result.ENTITY.TRT_DT_FMT);
												
												var entity = action.result.ENTITY;
												
												// Ext.getCmp("CENTER_RIGHT_TABLE_TRT_DT_FMT").setValue(entity.TRT_DT_FMT);
				
												var pkInsertEntityList = action.result.PK_INSERT_ENTITY_LIST;
												var pkDeleteEntityList = action.result.PK_DELETE_ENTITY_LIST;
												
												var entityList = action.result.ENTITY_LIST;
												var entityColumnList = action.result.ENTITY_COLUMN_LIST;
												
												drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
				
												/* 
												var subjectEntityList = action.result.ENTITY_LIST;
												drawDataLoad.restoreEntityInfo(entity, subjectEntityList);
												*/
												Ext.getStore("columnChangeLogStore").load({page : 1, limit : 999999 , params: { 'PROJECT_ID' : 'PROJECT', 'ENTITY_ID' : Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue()}});
                                                
                                                // 좌측 테이블 영역 재조회.
                                                Ext.getStore("entityListStore").reload();
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
						<tagErd:button type="button" label="테이블 관리" iconCls="search" cls="btn_segmentedbutton" id="btn_tableManagement">
							disabled : false ,
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
                        <tagErd:itemText type="displayfield_ux" label="ENTITY 유형" name="ENTITY_TCD_NM" value=""></tagErd:itemText>
						<!-- tagErd:itemText type="displayfield_ux" label="변경일" name="DML_DT_FMT"--><!--/tagErd:itemText-->
                        <!-- tagErd:itemCode type="ext-js-combobox" label="테이블 관리상태" name="TABL_SCD" id="TABLE_DTL_TABL_SCD" cdGrp="TABL_SCD" value="" usedef4="Y"--><!-- /tagErd:itemCode -->
                        <tagErd:itemCode type="ext-js-checkbox" label="테이블 관리상태" name="TABL_SCD" id="TABLE_DTL_TABL_SCD" cdGrp="TABL_SCD" value="" usedef4="Y" colspan="2" width="500"></tagErd:itemCode>
						<!-- tagErd:itemText type="displayfield_ux" label="처리일" id="CENTER_RIGHT_TABLE_TRT_DT_FMT" name="TRT_DT_FMT"--><!--/tagErd:itemText-->
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
						<!-- tagErd:itemText type="hiddenfield" label="TABL_SCD" name="TABL_SCD" value="" --><!--  /tagErd:itemText -->
						<tagErd:itemText type="hiddenfield" label="DML_TCD" name="DML_TCD" value="" id="table_DML_TCD"></tagErd:itemText>
					]
				},
                {
	                region: 'center',
	                collapsible: false,
	                xtype: 'tabpanel', 
	                id : 'entityDetailTabPanel',
	                items: [
                       <!--  컬럼 -->
                       <tagErd:erdCenterRightColumn></tagErd:erdCenterRightColumn>
                       <!--  Index -->
                       <tagErd:erdCenterRightIndex></tagErd:erdCenterRightIndex>
                       <!--  변경이력 -->
                       <tagErd:erdCenterRightChangeHistory></tagErd:erdCenterRightChangeHistory>
	                ]
	            }
            ]
        }
	]
}