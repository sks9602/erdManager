<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

 {
	  region: 'north',
	  height : 27,
	  border : false,
	  layout : 'hbox',
	  items : [
		 {
			 xtype: 'segmentedbutton',
			 id : 'EDIT_BUTTON',
			 padding: 3,
			 forceSelection : false,
			 items: [
				 {
					 xtype: 'button', text: '편집시작'//, iconCls: 'add', cls : 'btn_segmentedbutton'
					 , value : 'editStartSubject'
					 , id : 'centerTop_EditStartButton'
					 , pressed : false
					 ,listeners : {
						  click: function(el, opt, event){
								<c:choose>
									<c:when test="${sessionScope._sessionVO.usrUid == null || sessionScope._sessionVO.usrUid == 'GUEST' }">
										Ext.Msg.confirm('안내', 'ERD편집은 로그인 후 사용 가능합니다.<br/>로그인 하시겠습니까?', function(btn) {
											if( btn == 'yes') {
												ErdAppFunction.loginWindow(false);
											}
										});
									</c:when>
									<c:otherwise>
										erdAuth.startOrCheckSubjectEditInfo(Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId(), true);
										var form = Ext.getCmp("subjectAreaForm");
										var store = Ext.getStore("subjectEntityListStore").load({page : 1, limit : 999999 , params: form.getValues(false, false, false, false)}); store.currentPage = 1; store.params = form.getForm().getFieldValues(false);
									</c:otherwise>
								</c:choose>
						  }
					  }										
				 },
				 {
					 xtype: 'button', text: '편집종료'//, iconCls: 'add', cls : 'btn_segmentedbutton'
					 , value : 'editStopSubject'
					 , id : 'centerTop_EditEndButton'
					 , disabled : true
					 , pressed : false
					 ,listeners : {
						  click: function(el, opt, event){
								erdAuth.endSubjectEditInfo(Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId(), true);
								Ext.getCmp('DRAW_BUTTON').setValue('pointer');
								drawDataLoad.cancelRelationByButton();
								var form = Ext.getCmp("subjectAreaForm");
								var store = Ext.getStore("subjectEntityListStore").load({page : 1, limit : 999999 , params: form.getValues(false, false, false, false)}); store.currentPage = 1; store.params = form.getForm().getFieldValues(false);
						  }
					  }										
				 },
				 {
					 xtype: 'button', text: '편집상태확인'//, iconCls: 'add', cls : 'btn_segmentedbutton'
					 , value : 'editStatusCheck'
					 , id : 'centerTop_EditStatusCheckButton'
					 , pressed : false
					 ,listeners : {
						  click: function(el, opt, event){
								<c:choose>
									<c:when test="${sessionScope._sessionVO.usrUid == null || sessionScope._sessionVO.usrUid == 'GUEST' }">
										Ext.Msg.confirm('안내', '편집상태확인은 로그인 후 사용 가능합니다.<br/>로그인 하시겠습니까?', function(btn) {
											if( btn == 'yes') {
												ErdAppFunction.loginWindow(false);
											}
										});
									</c:when>
									<c:otherwise>
								erdAuth.startOrCheckSubjectEditInfo(Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId(), false, true);
									</c:otherwise>
								</c:choose>						  }
					  }										
				 },
			 ]
		 },
		 {
			 xtype: 'segmentedbutton',
			 id : 'DRAW_BUTTON',
			 padding: 3,
			 forceSelection : false,
			 items: [
				 {
					 xtype: 'button', text: 'Pointer'//, iconCls: 'add', cls : 'btn_segmentedbutton'
					 , value : 'pointer'
					 , pressed : true
					 ,listeners : {
							 click: function(el, opt, event){
								 // 업무영역에 테이블 추가 초기화.
								 drawDataLoad.cancelRelationByButton();
							 }
					  }										
				 },{
					 xtype: 'button', text: '테이블 생성'//,iconCls: 'add', cls : 'btn_segmentedbutton'
					 , value : 'table', disabled : ${sessionScope._sessionVO.notModelerRole}, id : 'DRAW_BUTTON_TABLE'
					 , listeners : {
						 click: function(el, opt, event){
							 console.log(arguments);
						 },
					 }
				 },{
					 xtype: 'button', text: '뷰 생성'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
					 , value : 'view', disabled : ${sessionScope._sessionVO.notModelerRole}, id : 'DRAW_BUTTON_VIEW'
					 , listeners : {
						 click: function(el, opt, event){
							 console.log(arguments);
							 drawDataLoad.initEntityForAddSubject();
						 },
					 }
				 },{
					 xtype: 'button', text: '1:N'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
					  , value : 'rel1toN', disabled : ${sessionScope._sessionVO.notModelerRole}, id : 'DRAW_BUTTON_1TON'
					  ,listeners : {
							click: function(el, opt, event){
								 var subjectId = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
								// 테이블 선택 해제..& 업무영역에 테이블 추가 초기화.
								 drawDataLoad.setSelectedTables( subjectId ,  null, false);
							 }
					  }
				 },{
					 xtype: 'button', text: '1:1'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'rel1to1', disabled : ${sessionScope._sessionVO.notModelerRole}, id : 'DRAW_BUTTON_1TO1'
						 ,listeners : {
							   click: function(el, opt, event){
								   var subjectId = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
								   // 테이블 선택 해제.. & 업무영역에 테이블 추가 초기화.
									drawDataLoad.setSelectedTables( subjectId,  null, false);
								}
						 }
				 },{
					 xtype: 'button', text: '1:1/0'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'rel1to0_1', disabled : ${sessionScope._sessionVO.notModelerRole}, id : 'DRAW_BUTTON_1TO0'
						 ,listeners : {
							 click: function(el, opt, event){
								 var subjectId = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
								 // 테이블 선택 해제.. & 업무영역에 테이블 추가 초기화.
								  drawDataLoad.setSelectedTables( subjectId,  null, false);
							  }
					   }
				 },{
					 xtype: 'button', text: 'Non-identifing'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'relNonIden', disabled : ${sessionScope._sessionVO.notModelerRole}, id : 'DRAW_BUTTON_NON_IDEN'
						 ,listeners : {
							 click: function(el, opt, event){
								  var subjectId = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
								  // 테이블 선택 해제.. & 업무영역에 테이블 추가 초기화.
								  drawDataLoad.setSelectedTables( subjectId,  null, false);
							  }
					   }
				 },{
					 xtype: 'button', text: '선택된 객체 삭제'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'delete', disabled : ${sessionScope._sessionVO.notModelerRole}, id : 'DRAW_BUTTON_DELETE'
						 ,listeners : {
							 click: function(el, opt, event){
								  var subjectId = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
								  // 테이블 선택 해제.. & 업무영역에 테이블 추가 초기화.
								  drawDataLoad.deleteSelectedObjects( subjectId );
							  }
					   }
				 }
			 ]
		 },
		 /*
		 {
			xtype : 'splitbutton',
			padding: 3,
			id : 'COLOR_SPLIT_BUTTON',
			text : '색변경',
			disabled : true,
			menu: {
				plain: true,
				items: [ 
					{text: '라인색변경', id : 'split_line_color',   disabled : true, id : 'COLOR_SPLIT_BUTTON_LINE', },
					{text: '테이블 글자색 변경', id : 'split_table_text_color', disabled : true, id : 'COLOR_SPLIT_BUTTON_TEXT', },
					{text: '컬럼목록 배경색 변경', id : 'split_background_color', disabled : true, id : 'COLOR_SPLIT_BUTTON_BACKGROUND', },
					{text: '테이블 영역 배경색 변경', id : 'split_table_background_color', disabled : true, id : 'COLOR_SPLIT_BUTTON_TABLE_BACKGROUND', },
				]
			}
					
		 },
		 */
		 {
			 xtype: 'segmentedbutton',
			 id : 'COLOR_BUTTON',
			 padding: 3,
			 forceSelection : false,
			 items: [
				 {
					 xtype: 'button', text: '라인색'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : "line_color"
						 // , disabled : ${sessionScope._sessionVO.notModelerRole}
						 , id : 'COLOR_SPLIT_BUTTON_LINE'
						 , listeners : {
							 click: function(el, opt, event){
								// 업무영역에 테이블 추가 초기화.
								drawDataLoad.initEntityForAddSubject();
							 
								 Ext.getCmp('DRAW_BUTTON').setValue('pointer') 
								 var colorPicker = Ext.create('Ext.menu.ColorPicker', {
											 listeners : {
												 select : function ( _this, color, eOpts ) {
													 drawDataLoad.setTableLineColor(color); 
													 drawDataLoad.setRelationLineColor(color); 
													 /*
													 drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(key, val){
														 
														 drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], key).setTableLineColor(color); 
														 
													 });
													 */
												 }
											 }
											 
								  }).showAt([el.getBox().x, el.getBox().y+el.getBox().height]);
								  /*
								  colorPicker.picker.colors = ['FFFFFF', '993300', '333300', '003300', '003366', '000080', '333399', '333333', 
														  '800000', 'FF6600', '808000', '008000', '008080', '0000FF', '666699', '808080', 
														  'FF0000', 'FF9900', '99CC00', '339966', '33CCCC', '0099FF', '800080', '969696',  // 0099FF '3366FF'
														  'FF00FF', 'FFCC00', 'FFFF00', '00FF00', '00FFFF', '00CCFF', '993366', 'C0C0C0', 
														  'FF99CC', 'FFCC99', 'FFFF99', 'CCFFCC', 'CCFFFF', '99CCFF', 'CC99FF', 'FFFFFF'];
								  */
							 
							 },
						 }
				 },{
					 xtype: 'button', text: '배경색'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : "background_color" 
						 // , disabled : ${sessionScope._sessionVO.notModelerRole}
						 , id : 'COLOR_SPLIT_BUTTON_BACKGROUND'
						 , listeners : {
							 click: function(el, opt, event){
								 // 업무영역에 테이블 추가 초기화.
								 drawDataLoad.initEntityForAddSubject();
								
								 Ext.getCmp('DRAW_BUTTON').setValue('pointer') 
								 Ext.create('Ext.menu.ColorPicker', {
											 listeners : {
												 select : function ( _this, color, eOpts ) { 
													 drawDataLoad.setTableBackgroundColor(color);
													 /*
													 drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(key, val){
														 
														 drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], key).setTableBackgroundColor(color);
														 
													 });
													 */
												 }
											 }
											 
								  }).showAt([el.getBox().x, el.getBox().y+el.getBox().height]);

							 },
						 }
				 },{
					 xtype: 'button', text: '테이블명 글자색'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : "table_name_color" 
						 // , disabled : ${sessionScope._sessionVO.notModelerRole}
						 , id : 'COLOR_SPLIT_BUTTON_TEXT'
						 , listeners : {
							 click: function(el, opt, event){
								 // 업무영역에 테이블 추가 초기화.
								 drawDataLoad.initEntityForAddSubject();
								
								 Ext.getCmp('DRAW_BUTTON').setValue('pointer') 
								 Ext.create('Ext.menu.ColorPicker', {
											 listeners : {
												 select : function ( _this, color, eOpts ) {
													 drawDataLoad.setTableNameColor(color);
													 /*
													 drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(key, val){
														 
														 drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], key).setTableNameColor(color);
														 
													 });
													 */
												 }
											 }
											 
								  }).showAt([el.getBox().x, el.getBox().y+el.getBox().height]);

							 },
						 }
				 },{
					 xtype: 'button', text: '테이블명 배경색'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : "table_background_color" 
						 // , disabled : ${sessionScope._sessionVO.notModelerRole}
						 , id : 'COLOR_SPLIT_BUTTON_TABLE_BACKGROUND'
						 , listeners : {
							 click: function(el, opt, event){
								 // 업무영역에 테이블 추가 초기화.
								 drawDataLoad.initEntityForAddSubject();
								
								 Ext.getCmp('DRAW_BUTTON').setValue('pointer') 
								 Ext.create('Ext.menu.ColorPicker', {
											 listeners : {
												 select : function ( _this, color, eOpts ) {
													 drawDataLoad.setTableNameBackgroundColor(color);
													 /*
													 drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(key, val){
														 
														 drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], key).setTableNameBackgroundColor(color);
														 
													 });
													 */
												 }
											 }
											 
								  }).showAt([el.getBox().x, el.getBox().y+el.getBox().height]);

							 },
						 }
				 }
			]
		 },
		 /*
		 {
			 xtype: 'segmentedbutton',
			 padding: 3,
			 items: [
				 {
					 xtype: 'button', text: '네모', iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , listeners : {
							 click: function(el, opt, event){
								 
								 // 업무영역에 테이블 추가 초기화.
								 drawDataLoad.initEntityForAddSubject(); 
								
								 Ext.getCmp("DRAW_BUTTON").items.items[0].setPressed(false);
								 Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);

							 },
						 }
				 },{
					 xtype: 'button', text: '동그라미', iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , listeners : {
							 click: function(el, opt, event){
								 // 업무영역에 테이블 추가 초기화.
								 drawDataLoad.initEntityForAddSubject();
								
								 Ext.getCmp("DRAW_BUTTON").items.items[0].setPressed(false);
								 Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);
								 
							 },
						 }
				 },{
					 xtype: 'button', text: 'Text', iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , listeners : {
							 click: function(el, opt, event){
								 // 업무영역에 테이블 추가 초기화.
								 drawDataLoad.initEntityForAddSubject();
								
								 Ext.getCmp("DRAW_BUTTON").items.items[0].setPressed(false);
								 Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);
								 
							 },
						 }
				 }
			]
		 },
		 */
		 {
			 xtype: 'segmentedbutton',
			 id : 'LOGICAL_PHYSICAL_VIEW_BUTTON',
			 padding: 3,
			 items: [
				 {
					 xtype: 'button', text: '논리모델'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'LOGICAL'
						 , listeners : {
							 click: function(el, opt, event){
								var entities = drawDataLoad.getSelectedTablesIfNotSelectedThenAll();
								 
								/*
								entities["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
									 var table = drawDataLoad.getDrawedTable(entities["SUBJECT_ID"], entity_id);
									 table.setTableNameText();
									 table.redrawColumns();
								});
								 
								 
								// 업무영역에 테이블 추가 초기화.
								drawDataLoad.initEntityForAddSubject(); 
								
								Ext.getCmp("DRAW_BUTTON").items.items[0].setPressed(true);
								Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);
								*/
							 },
						 }
				 },{
					 xtype: 'button', text: '물리모델'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'PHYSICAL'
						 , listeners : {
							 click: function(el, opt, event){
								 
								 var entities = drawDataLoad.getSelectedTablesIfNotSelectedThenAll();
								/*
								 entities["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
									 var table = drawDataLoad.getDrawedTable(entities["SUBJECT_ID"], entity_id);
									 table.setTableNameText();
									 table.redrawColumns();
								 });
								 
								 // 업무영역에 테이블 추가 초기화.
								 drawDataLoad.initEntityForAddSubject();
								
								 Ext.getCmp("DRAW_BUTTON").items.items[0].setPressed(true);
								 Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);
								*/
							 },
						 }
				 },{
					 xtype: 'button', text: '논리+물리모델'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'LOGICAL_PHYSICAL'
						 , pressed : true
						 , listeners : {
							 click: function(el, opt, event){
								var entities = drawDataLoad.getSelectedTablesIfNotSelectedThenAll();
									
							 },
						 }
				 }
			]
		 },
		 /*
		 {
			 xtype: 'segmentedbutton',
			 id : 'DOWNLOAD_BUTTON',
			 padding: 3,
			 items: [
				 {
					 xtype: 'button', text: '+'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'SIZE_UP'
						 , listeners : {
							 click: function(el, opt, event){
								
							 }
						  }
				  }, 
				  {
					 xtype: 'button', text: '-'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						 , value : 'SIZE_DOWN'
						 , listeners : {
							 click: function(el, opt, event){
							 
							 }
						  }
				  }, 
			 ]
		  },
		  */
		{
			xtype: 'segmentedbutton',
			id : 'DOWNLOAD_BUTTON',
			padding: 3,
			items: [
				{
					xtype: 'button', text: '이미지다운로드'//, iconCls: 'add16', cls : 'btn_segmentedbutton'
						, value : 'DOWNLOAD'
						, listeners : {
							click: function(el, opt, event){
							 
								var activeTab = Ext.getCmp("ERD-SUBJECTS").getActiveTab();

								let triggerDownload = (imgURI, fileName) => {
									let a = document.createElement('a')
								
									a.setAttribute('download', activeTab.title + '.svg')
									a.setAttribute('href', imgURI)
									a.setAttribute('target', '_blank')
								
									a.click();
									
									Ext.getCmp("DOWNLOAD_BUTTON").items.items[0].setPressed(false);
								}
								var subject_id = activeTab.getId();
								 
								var svg = document.querySelector('#'+subject_id+">svg")

								var data = (new XMLSerializer()).serializeToString(svg)
								const blob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});

								var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'})
								var url = URL.createObjectURL(blob)
	
								triggerDownload(url);
								 
							},
						}
				}
			]
		},
		{
			xtype: 'segmentedbutton',
			id : 'ERD_CURRENT_BUTTON',
			padding: 3,
			items: [
				{
					xtype: 'button'
					    <c:choose>
					       <c:when test="${sessionScope._sessionVO.currentErdYn != 'Y' }">
					       , text: '현재 기준 조회'
					       </c:when>
					       <c:otherwise>
					       , text: '프로젝트 기준 조회'
					       </c:otherwise>
					    </c:choose>
					    //, iconCls: 'add16', cls : 'btn_segmentedbutton'
						, value : 'ERD_CURRENT'
						, listeners : {
							click: function(el, opt, event){
							
								var doc1= document.projectForm;
								
								doc1.action = "/extjs/erd/erd.do";
								
                        <c:choose>
	                           <c:when test="${sessionScope._sessionVO.currentErdYn != 'Y' }">
	                           doc1.CURRENT_ERD_YN.value = "Y";
	                           </c:when>
	                           <c:otherwise>
	                           doc1.CURRENT_ERD_YN.value = "N";
	                           </c:otherwise>
                        </c:choose>
								
								doc1.submit();
							},
						}
				}
			]
		},
	]
},