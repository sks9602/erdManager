<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

                       {
                           xtype: 'panel',
                           items: [
                                   {
	                                    region: 'center',
	                                    xtype: 'formPanel_ux',
	                                    height : 70+(23*5),
	                                    id : 'requestCenterTable_topForm',
	                                    border : false,
	                                    scrollable : true,
	                                    autoScroll : true,
	                                    layout: { type: 'table' , columns: 3 },
	                                    items : [
	                                        <tagErd:itemCode type="ext-js-combobox" label="요청구분" name="ERD_REQUEST_CD" id="REQEUST_ERD_REQUEST" cdGrp="ERD_REQUEST_CD" firstText="선택" value="" width="263"></tagErd:itemCode>
	                                        <tagErd:itemText type="displayfield_ux" label="처리상태" name="DML_TCD_NM" value="" width="200"></tagErd:itemText>
	                                        <tagErd:itemText type="textarea" label="요청 메모" id="ERD_REQUEST_MEMO" name="ERD_REQUEST_MEMO" rowspan="3" ></tagErd:itemText>
                    {  
                        fieldLabel : '업무영역',
                        xtype: 'tagfield', // '', // combotipple_ux, 
                        labelCls : 'x-form-item-label', //  x-form-item-label-required
                        name: 'DTYPE',
                        msgTarget: 'side',
                        allowBlank: true,
                        colspan : 2,
                        labelSeparator : '',
                        queryMode: 'local', // remote
                        anyMatch: true,
                        minChar : 2,
                        anchor: '100%',
                        value : '',
                        labelWidth : 104,
                        width : 450,
                        style : {padding : "0 3 0 1"},
                        flex: 5,
                        valueField : 'SUBJECT_ID',
                        displayField: 'SUBJECT_NM',
                        forceSelection: true,
                        editable: true,
                        autocomplete: false,
                        filterPickList: true,
                        store : {
                            xtype : 'store',
                            storeId: 'requestSubjectListStore',
                            idProperty : 'data',
                           
                            fields: [
                                { name : 'SUBJECT_NM', type : 'string', format : '' },
                                { name : 'SUBJECT_ID', type : 'string', format : '' },
                                
                            ],
                            
                            autoLoad:  true ,
                            proxy : {
                                   type : 'ajax',
                                   url : '/subject/data/list.do',
                                   reader : {
                                       type : 'json',
                                       rootProperty : 'data',
                                       totalProperty: 'totalCount' 
                                   },
                                   extraParams: {
                                       PROJECT_ID : 'PROJECT'
                                   }
                               },
                               root: {
                                    expanded:  true ,
                            },
                        },
                    }, 

	                                        <tagErd:itemText type="textfield_ux" label="테이블 논리 명" name="TABL_NM" id="REQEUST_TABL_NM" value="" width="200"></tagErd:itemText>
	                                        <tagErd:itemText type="textfield_ux" label="테이블 물리 명" name="ENTITY_NM" id="REQEUST_ENTITY_NM" value="" width="200"></tagErd:itemText>
	                                        // request.jsp에 선언됨
	                                        fieldcontainerRelationObject(0),
                                            <tagErd:itemText type="textarea" label="처리 메모" id="ERD_RESPONSE_MEMO" name="ERD_RESPONSE_MEMO" rowspan="4" ></tagErd:itemText>
                                            fieldcontainerRelationObject(1),
                                            fieldcontainerRelationObject(2),
                                            fieldcontainerRelationObject(3),
                                            <tagErd:itemText type="hiddenfield" label="ENTITY" id="CENTER_RIGHT_TABLE_ENTITY_ID" name="ENTITY_ID" value=""></tagErd:itemText>
	                
	                                    ]
	                                },
                                     <tagErd:requestCenterColumn></tagErd:requestCenterColumn>
                            ]
                        }
