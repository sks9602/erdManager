var DrawDataLoad = function() {
	 this.drawedSubectArea = {};
	this.drawedTable = {};
	this.drawedRelations = {};
	this.drawedRelationsEnd = {};
	this.drawedRelation = {};
	this.relationPath = {};
	this.selectTables = {SUBJECT_ID : "", ENTITY_IDS : new Set() };
	this.selectedRelation = {SUBJECT_ID : "", RELATION_ID : ""};;
	this.relationByButtonBegin = false; 
	this.cursorStatus = null;
	this.selectRectangular = {AREA_SELECT : false , X : 0, Y : 0, WIDTH : 0 , HEIGHT : 0};
	this.entityForAddSubject = {ENTITY_ID : "", TABL_NM : "" };
	
	this.relationMarker = { };

	/* 
	 * Project정보 조회.
	 */
	this.getProjectData = function() {
		
		return this.projectData;
		/*
		[
				{"SUBJECT_ID" : "SUBJ-0001", "SUBJECT_NM" : "Subj1", "WIDTH" : 3000, "HEIGHT" : 2000 }
				// , {"SUBJECT_ID" : "id_subj_2", "SUBJECT_NM" : "Subj2" }
		];
		*/
	}


	/* 
	 * SubjectArea정보 조회.
	 */
	this.getSubjectAreaData = function() {
		
		return this.subjectAreaDatas;
		/*
		[
				{"SUBJECT_ID" : "SUBJ-0001", "SUBJECT_NM" : "Subj1", "WIDTH" : 3000, "HEIGHT" : 2000 }
				// , {"SUBJECT_ID" : "id_subj_2", "SUBJECT_NM" : "Subj2" }
		];
		*/
	}
	this.entityDatas  = [
		/*
				{  "ENTITY_ID" : "id_EMP", "TABLE_NM" : "사원", "ENTITY_NM": "EMP", "IS_SUB_TABLE" : "N", "LINE_COLOR" : "", "COLOR" : "" , "BACKGROUND_COLOR" : "", "X" : 0, "Y" : 0, "WIDTH":  100, "HEIGHT" : 100, "HAS_PK" : true}
			, {  "ENTITY_ID" : "ENTT-0002", "TABLE_NM" : "급여테이블", "ENTITY_NM": "SALARY", "IS_SUB_TABLE" : "Y","COLOR" : "" ,  "X" : 0, "Y" : 0, "WIDTH":  100, "HEIGHT" : 100, "HAS_PK" : true }

		*/
	]
	//영역별 테이블 
	this.tableOnSubjectAreaDatas = [
		/*
				{ "SUBJECT_ID" : "SUBJ-0001",  "ENTITY_ID" : "id_EMP", "TABLE_NM" : "사원", "ENTITY_NM": "EMP", "IS_SUB_TABLE" : "N", "LINE_COLOR" : "orange", "COLOR" : "red" , "BACKGROUND_COLOR" : "yellow", "X" : 100, "Y" : 100, "HEIGHT" : 100, "HAS_PK" : true}
			, { "SUBJECT_ID" : "SUBJ-0001", "ENTITY_ID" : "ENTT-0002", "TABLE_NM" : "급여테이블", "ENTITY_NM": "SALARY", "IS_SUB_TABLE" : "Y","COLOR" : "" ,  "X" : 800, "Y" : 600, "WIDTH": 150 , "HEIGHT" : 100, "HAS_PK" : true }
			, { "SUBJECT_ID" : "SUBJ-0001",  "ENTITY_ID" : "id_DEPT",  "TABLE_NM" : "부서", "ENTITY_NM": "DEPT", "IS_SUB_TABLE" : "N", "COLOR" : "" , "X" : 400, "Y" : 300, "WIDTH": 100 , "HEIGHT" : 200, "HAS_PK" : false }
			, { "SUBJECT_ID" : "SUBJ-0001",  "ENTITY_ID" : "id_FAMILY",  "TABLE_NM" : "가족", "ENTITY_NM": "FAMILY", "IS_SUB_TABLE" : "Y", "TABLE_BACKGROUND_COLOR" : "red", "COLOR" : "" , "X" : 100, "Y" : 600, "WIDTH": 150 , "HEIGHT" : 100 }
			, { "SUBJECT_ID" : "SUBJ-0001",  "ENTITY_ID" : "id_TEAM",  "TABLE_NM" : "팀", "ENTITY_NM": "TEAM", "IS_SUB_TABLE" : "Y", "COLOR" : "" , "X" : 800, "Y" : 100, "WIDTH": 100 , "HEIGHT" : 100  }
		*/
		];
	// 테이블별 컬럼
	this.tableColumnDatas = [
		/*
				  { "ENTITY_ID" : "id_EMP", "COLUMN_ID" : "id_EMP_aaa", "id": 3, "COLUMN_NM": "aaa", "ATTRIBUTE_NM" : "한글명", "DATA_TYPE": "Sun May 05 2013", "amount": 12000 , "PK" : true, "FK" : false, "IS_LAST_PK" : false}
				, { "ENTITY_ID" : "id_EMP", "COLUMN_ID" : "id_EMP_aaaa", "id": 1, "COLUMN_NM": "aaaa", "ATTRIBUTE_NM" : "새로운이름", "DATA_TYPE": "Mon May 13 2013", "amount": 2000, "PK" : true, "FK" : true, "IS_LAST_PK" : false}
				, { "ENTITY_ID" : "id_EMP", "COLUMN_ID" : "id_EMP_aaaaa", "id": 2, "COLUMN_NM": "aaaaa", "ATTRIBUTE_NM" : "한글명", "DATA_TYPE": "Thu Jun 06 2013", "amount": 17000, "PK" : true, "FK" : false, "IS_LAST_PK" : false}
				, { "ENTITY_ID" : "id_EMP", "COLUMN_ID" : "id_EMP_aaaaaa", "id": 4, "COLUMN_NM": "aaaaaa", "ATTRIBUTE_NM" : "한글명", "DATA_TYPE": "Thu May 09 2013", "amount": 15000, "PK" : true, "FK" : false, "IS_LAST_PK" : true}
				, { "ENTITY_ID" : "id_EMP", "COLUMN_ID" : "id_EMP_pppppp", "id": 5, "COLUMN_NM": "pppppp", "ATTRIBUTE_NM" : "새로운이름", "DATA_TYPE": "Mon Jul 01 2013", "amount": 16000, "PK" : false, "FK" : true }
				, { "ENTITY_ID" : "id_EMP", "COLUMN_ID" : "id_EMP_rrrrrr", "id": 6, "COLUMN_NM": "rrrrrr", "ATTRIBUTE_NM" : "새로운이름", "DATA_TYPE": "Mon Jul 01 2013", "amount": 16000, "PK" : false, "FK" : false}
				, { "ENTITY_ID" : "id_EMP", "COLUMN_ID" : "id_EMP_334534", "id": 7, "COLUMN_NM": "334534", "ATTRIBUTE_NM" : "새로운이름", "DATA_TYPE": "Mon Jul 01 2013", "amount": 16000, "PK" : false, "FK" : false}
				, { "ENTITY_ID" : "id_EMP", "COLUMN_ID" : "id_EMP_123fdg345", "id": 8, "COLUMN_NM": "123fdg345", "ATTRIBUTE_NM" : "새로운이름", "DATA_TYPE": "Mon Jul 01 2013", "amount": 16000, "PK" : false, "FK" : false}
				

				, { "ENTITY_ID" : "ENTT-0002", "COLUMN_ID" : "ENTT-0002_Richy", "id": 3, "COLUMN_NM": "Richy", "ATTRIBUTE_NM" : "한글명", "DATA_TYPE": "Sun May 05 2013", "amount": 12000, "PK" : true, "FK" : false, "IS_LAST_PK" : true}
				, { "ENTITY_ID" : "ENTT-0002", "COLUMN_ID" : "ENTT-0002_Susi", "id": 1, "COLUMN_NM": "Susi", "ATTRIBUTE_NM" : "새로운이름", "DATA_TYPE": "Mon May 13 2013", "amount": 2000, "PK" : false, "FK" : false}
				, { "ENTITY_ID" : "ENTT-0002", "COLUMN_ID" : "ENTT-0002_Patrick", "id": 2, "COLUMN_NM": "Patrick", "ATTRIBUTE_NM" : "한글명", "DATA_TYPE": "Thu Jun 06 2013", "amount": 17000, "PK" : false, "FK" : false}
				, { "ENTITY_ID" : "ENTT-0002", "COLUMN_ID" : "ENTT-0002_Lorenz", "id": 4, "COLUMN_NM": "Lorenz", "ATTRIBUTE_NM" : "한글명", "DATA_TYPE": "Thu May 09 2013", "amount": 15000, "PK" : false, "FK" : false}
				, { "ENTITY_ID" : "ENTT-0002", "COLUMN_ID" : "ENTT-0002_Christina", "id": 5, "COLUMN_NM": "Christina", "ATTRIBUTE_NM" : "새로운이름", "DATA_TYPE": "Mon Jul 01 2013", "amount": 16000, "PK" : false, "FK" : false}

				, { "ENTITY_ID" : "id_DEPT", "COLUMN_ID" : "id_DEPT_Richy", "id": 3, "COLUMN_NM": "Richy", "ATTRIBUTE_NM" : "한글명", "DATA_TYPE": "Sun May 05 2013", "amount": 12000, "PK" : false}
				, { "ENTITY_ID" : "id_DEPT", "COLUMN_ID" : "id_DEPT_Susi", "id": 1, "COLUMN_NM": "Susi", "ATTRIBUTE_NM" : "새로운이름", "DATA_TYPE": "Mon May 13 2013", "amount": 2000, "PK" : false}
				, { "ENTITY_ID" : "id_DEPT", "COLUMN_ID" : "id_DEPT_Patrick", "id": 2, "COLUMN_NM": "Patrick", "ATTRIBUTE_NM" : "한글명", "DATA_TYPE": "Thu Jun 06 2013", "amount": 17000, "PK" : false}
		*/
		];
	// RELATION
	this.relationOnSubjectAreaDatas = [
					/*
				,	 { "SUBJECT_ID" : "SUBJ-0001",  "RELATION_ID" : "rel_EMP_SALARY", "RELATION" : "EMP_SALARY", "RELATION_NAME" : "회원부서"
						, "none_identity" : "N"
						, "START_ENTITY_ID" : "id_EMP", "START_ENTITY_NM" : "EMP", "START_POSITION" : "r", "START_X" : 0, "START_Y" : 200
						, "END_ENTITY_ID" : "ENTT-0002",  "END_ENTITY_NM" : "SALARY", "END_POSITION" : "l", "END_X" : 0, "END_Y" : 100
						, "PATHS" : ""
					}
					
					{ "SUBJECT_ID" : "SUBJ-0001", "RELATION_ID" : "rel_DEPT_DEPT", "RELATION" : "DEPT_EMP", "RELATION_NAME" : "회원부서", "RELATION_TYPE" : "rel1toN", "COLOR" : "red", "RECURSIVE" : "Y"
						, "START_ENTITY_ID" : "id_DEPT", "START_ENTITY_NM" : "DEPT", "START_POSITION" : "r", "START_X" : 100, "START_Y" : 150
						, "END_ENTITY_ID" : "id_DEPT", "END_ENTITY_NM" : "DEPT", "END_POSITION" : "b", "END_X" : 80, "END_Y" : 50
						, "PATHS" : ""
					}
				,	{ "SUBJECT_ID" : "SUBJ-0001", "RELATION_ID" : "rel_DEPT_EMP", "RELATION" : "DEPT_EMP", "RELATION_NAME" : "회원부서", "RELATION_TYPE" : "rel1to1"
						, "START_ENTITY_ID" : "id_DEPT", "START_ENTITY_NM" : "DEPT", "START_POSITION" : "l", "START_X" : 40, "START_Y" : 50
						, "END_ENTITY_ID" : "id_EMP", "END_ENTITY_NM" : "EMP", "END_POSITION" : "t", "END_X" : 50, "END_Y" : 50
						, "PATHS" : ""
					}
				,	{ "SUBJECT_ID" : "SUBJ-0001", "RELATION_ID" : "rel_DEPT_TEAM", "RELATION" : "DEPT_TEAM", "RELATION_NAME" : "부서팀", "RELATION_TYPE" : "rel1to0_1"
						, "NON_IDEN_YN" : "N"
						, "START_ENTITY_ID" : "id_DEPT", "START_ENTITY_NM" : "DEPT", "START_POSITION" : "t", "START_X" : 60, "START_Y" : 70
						, "END_ENTITY_ID" : "id_TEAM",  "END_ENTITY_TEAM" : "SALARY", "END_POSITION" : "b", "END_X" : 50, "END_Y" : 50
						, "PATHS" : ""
					}
				,	{ "SUBJECT_ID" : "SUBJ-0001", "RELATION_ID" : "rel_TEAM_SALARY", "RELATION" : "TEAM_SALARY", "RELATION_NAME" : "부서급여" // , "DEL_YN" : "Y"
						, "NON_IDEN_YN" : "N"
						, "START_ENTITY_ID" : "id_TEAM", "START_ENTITY_NM" : "TEAM", "START_POSITION" : "b", "START_X" : 80, "START_Y" : 100
						, "END_ENTITY_ID" : "ENTT-0002",  "END_ENTITY_NM" : "SALARY", "END_POSITION" : "t", "END_X" : 50, "END_Y" : 50
						, "PATHS" : ""
					}
					
				,	{ "SUBJECT_ID" : "SUBJ-0001", "RELATION_ID" : "rel_DEPT_FAMILY", "RELATION" : "DEPT_FAMILY", "RELATION_NAME" : "부서가족"
						, "NON_IDEN_YN" : "Y"
						, "START_ENTITY_ID" : "id_DEPT", "START_ENTITY_NM" : "DEPT", "START_POSITION" : "b", "START_X" : 20, "START_Y" : 150
						, "END_ENTITY_ID" : "id_FAMILY",  "END_ENTITY_NM" : "FAMILY", "END_POSITION" : "l", "END_X" : 50, "END_Y" : 50
						, "PATHS" : ""
					}
					*/
				];
	this.relationDatas  = [];
				
	this.loadData = function() {
		var response = Ext.Ajax.request({
			async: false,
			url: '/project/data/detail.do',
			params: {
					'SESSION_YN' : 'Y'
			}
		});
		this.projectData = Ext.decode(response.responseText).data;

		var response = Ext.Ajax.request({
			async: false,
			url: '/subject/data/list.do',
			params: {
					
			}
		});
		this.subjectAreaDatas = Ext.decode(response.responseText).data;
	
		var response = Ext.Ajax.request({
			async: false,
			url: '/subject/data/erdSubjectEntityList.do',
			params: {
					
			}
		});
		
		this.tableOnSubjectAreaDatas = Ext.decode(response.responseText).data;

		var response = Ext.Ajax.request({
			async: false,
			url: '/entity/data/erdEntityList.do',
			params: {
					
			}
		});
		
		this.entityDatas = Ext.decode(response.responseText).data;
		
		console.log( this.entityDatas );

		var response = Ext.Ajax.request({
			async: false,
			url: '/column/data/erdColumnList.do',
			params: {
					
			}
		});
		this.tableColumnDatas = Ext.decode(response.responseText).data;

		var response = Ext.Ajax.request({
			async: false,
			url: '/relation/data/erdSubjectRelationList.do',
			params: {
					
			}
		});
		this.relationOnSubjectAreaDatas = Ext.decode(response.responseText).data;

		var response = Ext.Ajax.request({
			async: false,
			url: '/relation/data/erdRelationList.do',
			params: {
					
			}
		});
		this.relationDatas = Ext.decode(response.responseText).data;

        var response = Ext.Ajax.request({
            async: false,
            url: '/project/data/loginUser.do',
            params: {

            }
        });
        this.projectUserDatas = Ext.decode(response.responseText).data;

        console.log( this.projectUserDatas )
		
	}

    /**
     * 모델링 권한 있는지..
     */
    this.hasUserAuthOfModeler = function() {
        return this.projectUserDatas.AUTH== 'MODELER' || this.projectUserDatas.AUTH== 'MANAGER';
    }

    /**
     * 모델링 권한 있는지..
     */
    this.isLogined = function() {
        return this.projectUserDatas.LOGINED_YN == 'Y';
    }
    
    /**
     * 관리자 권한 있는지..
     */
    this.hasUserAuthOfManager = function() {
        return this.projectUserDatas.AUTH== 'MANAGER';
    }
    
    this.getUserInfo = function( ) {
        return this.projectUserDatas;
    }
    
	/**
	 * SubjectArea별 테이블 목록 조회.
	 */
	this.getTableOnSubjectAreaDatas = function() {
		console.log( this.tableOnSubjectAreaDatas );
		return this.tableOnSubjectAreaDatas;
	}

	/**
	 * Entity목록..
	 */
	this.getEntityDatas = function() {
		return this.entityDatas;
	}
	
	this.getEntityById = function( entity_id) {
		var _this = this;
		for( var i=0 ; i<_this.entityDatas.length; i++ ) {
			if( _this.entityDatas[i].ENTITY_ID == entity_id ) {
				return  _this.entityDatas[i];
			}
		}
		return null;
	}
	
	/**
	 * Table전체 컬럼 목록
	 */
	this.getTableColumnDatas = function() {
		// console.log( this.tableColumnDatas );
		return this.tableColumnDatas;

	}
	
	this.setSubjectArea = function(subject_id, subject_object ) {
		this.drawedSubectArea[subject_id] = subject_object;
	}
	
	this.getSubjectArea = function(subject_id ) {
		return this.drawedSubectArea[subject_id];
	}
	/**
	 * SubjctArea내 테이블 목록 조회
	 */
	this.getTables = function(subject_id) {
		var tables = this.getTableOnSubjectAreaDatas().filter(function(item) {
								if (item.SUBJECT_ID == subject_id) {
									return true;
								} else {
									return false;
								}
							});

		return tables;
	}

	this.addTable = function( table ) {
		this.tableOnSubjectAreaDatas.push(table);
	}
	
	/**
	 * 테이블 조회
	 */
	this.getTable = function(subject_id, entity_id) {
		var table = this.getTableOnSubjectAreaDatas().filter(function(item) {
								if (item.SUBJECT_ID == subject_id && item.ENTITY_ID == entity_id ) {
									return true;
								} else {
									return false;
								}
							});
		if( table.length == 1 ) {
			return table[0];
		} else {
			return null;
		}
	}

	
	/**
	 * Table의 컬럼 목록
	 */
	this.getTableColumns = function(entity_id) {
		var tableColumns = this.getTableColumnDatas().filter(function(item) {
								if (item.ENTITY_ID == entity_id) {
									return true;
								} else {
									return false;
								}
							});

		return tableColumns;
	}
	
	/**
	 * SubjectArea별 관계 목록 조회.
	 */
	this.getRelationOnSubjectAreaDatas = function() {
		return this.relationOnSubjectAreaDatas;
	}
	
	this.getRelationDatas = function() {
		return this.relationDatas;
	}
	
	
	/**
	 * 테이블의 위치 정보 조정 
	 * translate = { x : 값, y :값 };
	 */
	this.setTableTranslate = function( subject_id, entity_id, translate ) {
		var _this = this;
		
		for( var i=0; i<_this.tableOnSubjectAreaDatas.length ; i++ ) {
			if( _this.tableOnSubjectAreaDatas[i]["SUBJECT_ID"] == subject_id  && _this.tableOnSubjectAreaDatas[i]["ENTITY_ID"] == entity_id ) {
				_this.tableOnSubjectAreaDatas[i]["x"] = translate["x"];
				_this.tableOnSubjectAreaDatas[i]["y"] = translate["y"];
			}
		}
		
	}
	
	/*
	 * 관계선의 시작점의 정보를 변경한다.
	 * value = { START_POSITION : 't' or 'l' or 'r' or 'b', start.x : 0, start.y }
	 */ 
	this.setRelationStartValue = function( subject_id, relation_id, value, linePath ) {
		var _this = this;
		for( var i=0; i<_this.relationOnSubjectAreaDatas.length ; i++ ) {
			if( _this.relationOnSubjectAreaDatas[i]["SUBJECT_ID"] == subject_id  && _this.relationOnSubjectAreaDatas[i]["RELATION_ID"] == relation_id ) {
				if( value && value["START_POSITION"]!= undefined && value["START_POSITION"]!="") {
					_this.relationOnSubjectAreaDatas[i]["START_POSITION"] = value["START_POSITION"];
				}
				if( value && value["START_X"]!= undefined && value["START_X"] > 0 ) {
					_this.relationOnSubjectAreaDatas[i]["START_X"] = value["START_X"];
				}
				if( value && value["START_Y"]!= undefined && value["START_Y"] > 0 ) {
					_this.relationOnSubjectAreaDatas[i]["START_Y"] = value["START_Y"];
				}
				
				value["SUBJECT_ID"] = subject_id;
				value["RELATION_ID"] = relation_id;
				value["LINE_PATH"] = linePath.join(' ');
				
				console.log( "setRelationStartValue")
				_this.updateRelationInfo("moverStart", value );
			}
		}
	}
	/*
	 * 관계선의 종료점의 정보를 변경한다.
	 * value = { END_POSITION : 't' or 'l' or 'r' or 'b', end.x : 0, end.y }
	 */ 
	this.setRelationEndValue = function( subject_id, relation_id, value, linePath ) {
		var _this = this;
		for( var i=0; i<_this.relationOnSubjectAreaDatas.length ; i++ ) {
			if( _this.relationOnSubjectAreaDatas[i]["SUBJECT_ID"] == subject_id  && _this.relationOnSubjectAreaDatas[i]["RELATION_ID"] == relation_id ) {
				if( value && value["END_POSITION"]!= undefined && value["END_POSITION"]!="") {
					_this.relationOnSubjectAreaDatas[i]["END_POSITION"] = value["END_POSITION"];
				}
				if( value && value["END_X"]!= undefined && value["END_X"] > 0 ) {
					_this.relationOnSubjectAreaDatas[i]["END_X"] = value["END_X"];
				}
				if( value && value["END_Y"]!= undefined && value["END_Y"] > 0 ) {
					_this.relationOnSubjectAreaDatas[i]["END_Y"] = value["END_Y"];
				}
				
				value["SUBJECT_ID"] = subject_id;
				value["RELATION_ID"] = relation_id;
				value["LINE_PATH"] = linePath.join(' ');
				
				console.log( "setRelationEndValue")
				_this.updateRelationInfo("moverEnd", value );
			}
		}
	}
	
	
	this.setRelationPathValue  = function( subject_id, relation_id, linePath ) {
		var _this = this;
		var value = {};
		console.log(  linePath )
		value["SUBJECT_ID"] = subject_id;
		value["RELATION_ID"] = relation_id;
		value["LINE_PATH"] = linePath.join(' ');
		console.log( "setRelationPathValue")
		_this.updateRelationInfo("moverMiddle", value );
	}
	/*
	 * 테이블 이동 / resize시 정보 수정 
	 */
	this.setTableInfo = function(subject_id, entity_id, tableGrp, columsAroundRect ) {
		var _this = this;

		// { "IS_SUB_TABLE" : true, "x" : 400, "y" : 150, "WIDTH": 150 , "HEIGHT" : 200, "attrs" :  { "line_color" : "red" } }

		for( var i=0; i<_this.tableOnSubjectAreaDatas.length ; i++ ) {
			if( _this.tableOnSubjectAreaDatas[i]["SUBJECT_ID"] == subject_id  && _this.tableOnSubjectAreaDatas[i]["ENTITY_ID"] == entity_id ) {
				_this.tableOnSubjectAreaDatas[i]["X"] = tableGrp.transform('translateX');
				_this.tableOnSubjectAreaDatas[i]["Y"] = tableGrp.transform('translateY');
				_this.tableOnSubjectAreaDatas[i]["WIDTH"] = columsAroundRect.width();
				_this.tableOnSubjectAreaDatas[i]["HEIGHT"] = columsAroundRect.height();
				console.log( _this.tableOnSubjectAreaDatas[i]["HEIGHT"] )
			}
		}

	}
	
	/**
	 * 관계 경로 저장.
	 */
	this.setRelationPath = function( subject_id, relation_id, path ) {
		var _this = this;
		for( var i=0; i<_this.relationOnSubjectAreaDatas.length ; i++ ) {
			if( _this.relationOnSubjectAreaDatas[i]["SUBJECT_ID"] == subject_id  && _this.relationOnSubjectAreaDatas[i]["RELATION_ID"] == relation_id ) {
				if( typeof( path ) == 'object' ) {
					_this.relationOnSubjectAreaDatas[i]["paths"] = path.join(' ');
				} else {
					_this.relationOnSubjectAreaDatas[i]["paths"] = path;
				}
			}
		}
	}

	this.getRelationPath = function( subject_id, relation_id ) {
		var _this = this; 
		for( var i=0; i<_this.relationOnSubjectAreaDatas.length ; i++ ) {
			if( _this.relationOnSubjectAreaDatas[i]["SUBJECT_ID"] == subject_id  && _this.relationOnSubjectAreaDatas[i]["RELATION_ID"] == relation_id ) {
				//console.log(_this.relationOnSubjectAreaDatas[i]["paths"]);
				return _this.relationOnSubjectAreaDatas[i]["paths"];
			}
		}
	}
	
	/**
	 * 관계 목록 조회
	 */
	this.getTableRelations = function(subject_id, entity_id) {
		var relationOnSubjectAreaDatas = this.getRelationOnSubjectAreaDatas().filter(function(item) {
								if (item.SUBJECT_ID == subject_id && item["START_ENTITY_ID"] == entity_id) {
									return true;
								} else {
									return false;
								}
							});

		return relationOnSubjectAreaDatas;
	}

	this.addTableRelationsInMasterToSubject = function(subject_id, entity_id)  {
		var _this = this;
		
		var tableRelation = _this.getTableRelationsInMaster(subject_id, entity_id);

		var table = {};
		var rect = {}
		
		for( var i=0; i<tableRelation.length; i++) {
			var relation = tableRelation[i];
			
			console.log( relation );
			
			table["start"]  = SVG(".table_"+subject_id+"_"+ relation["START_ENTITY_ID"]);
			rect["start"] = table["start"].findOne(".rect_"+subject_id+"_"+relation["START_ENTITY_ID"]);
			table["end"]  = SVG(".table_"+subject_id+"_"+ relation["END_ENTITY_ID"]);
			rect["end"] = table["end"].findOne(".rect_"+subject_id+"_"+relation["END_ENTITY_ID"]);
			var end = {x:50, y:50};

			var boxOfStart = { 
								left : Math.ceil(table["start"].transform().translateX)
							 , top : Math.ceil(table["start"].transform().translateY)
							 , right : Math.ceil(table["start"].transform().translateX + rect["start"].width())
							 , bottom : Math.ceil(table["start"].transform().translateY + rect["start"].height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
							};

			var boxOfEnd = { 
								left : Math.ceil(table["end"].transform().translateX)
							 , top : Math.ceil(table["end"].transform().translateY)
							 , right : Math.ceil(table["end"].transform().translateX + rect["end"].width())
							 , bottom : Math.ceil(table["end"].transform().translateY + rect["end"].height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
							};

				if( boxOfStart.right < boxOfEnd.left ) {
					relation["START_POSITION"] = "r";
					if( boxOfStart.top > boxOfEnd.bottom ) {
						relation["END_POSITION"] = "b";
					} else if ( boxOfStart.bottom < boxOfEnd.top ) {
						relation["END_POSITION"] = "t";
					} else {
						relation["END_POSITION"] = "l";
					}
				} else if( boxOfStart.left > boxOfEnd.right ) {
					relation["START_POSITION"] = "l";
					if( boxOfStart.top > boxOfEnd.bottom ) {
						relation["END_POSITION"] = "b";
					} else if ( boxOfStart.bottom < boxOfEnd.top ) {
						relation["END_POSITION"] = "t";
					} else {
						relation["END_POSITION"] = "r";
					}
				} else {
					if( boxOfStart.top > boxOfEnd.bottom ) {
						relation["START_POSITION"] = "t";
						relation["END_POSITION"] = "b";
					} else if ( boxOfStart.bottom < boxOfEnd.top ) {
						relation["START_POSITION"] = "b";
						relation["END_POSITION"] = "t";
					}
				}

			rect["start"].attr({'stroke-width':0.7});
			rect["end"].attr({'stroke-width':0.7});
			rect["end"].attr({rx:4});
			
			relation["SUBJECT_ID"] = subject_id;
			relation["START_X"] = rect["start"].width()/2;
			relation["START_Y"] = rect["start"].height()/2;
			relation["END_X"] = rect["end"].width()/2;
			relation["END_Y"] = rect["end"].height()/2;
			
			// 업무영역에 relation추가
			_this.addRelationSubjectInfo('relationAddToSubject', relation);
			
			_this.relationOnSubjectAreaDatas.push(relation);
		}
	}
	
	
	/**
	 * 관계 목록 조회
	 */
	this.getTableRelationsInMaster = function(subject_id, entity_id) {
		var _this = this;
		var relationOnSubjectAreaDatas = _this.getRelationOnSubjectAreaDatas().filter(function(item) {
								if (item.SUBJECT_ID == subject_id) {
									return true;
								} else {
									return false;
								}
							});

		
		var relationSet = new Set();
		for( var i=0; i<relationOnSubjectAreaDatas.length; i++) {
			relationSet.add(relationOnSubjectAreaDatas[i]["RELATION_ID"]);
		}
		
		//console.log( relationSet );
		
		var tableRelation = this.getRelationDatas().filter(function(item) {
								if ( !relationSet.has(item["RELATION_ID"]) && 
									((item["START_ENTITY_ID"] == entity_id && _this.getDrawedTable(subject_id, item["END_ENTITY_ID"]))
									 || (item["END_ENTITY_ID"] == entity_id && _this.getDrawedTable(subject_id, item["START_ENTITY_ID"])))) {
									return true;
								} else {
									return false;
								}
							});
							
		//console.log('>>>>>>>>', entity_id, tableRelation);
		
		return tableRelation;
	}
	
	this.changeRelationType = function(subject_id, relation_id, relation_type) {
		var _this = this;
		for( var i=0; i<this.getRelationOnSubjectAreaDatas().length ; i++ ) {
			if(this.getRelationOnSubjectAreaDatas()[i]["SUBJECT_ID"] == subject_id && this.getRelationOnSubjectAreaDatas()[i]["RELATION_ID"] == relation_id ) {
				var params = { "SUBJECT_ID" : subject_id , "RELATION_ID" : relation_id};
				
				params["START_ENTITY_ID"] = this.getRelationOnSubjectAreaDatas()[i]["START_ENTITY_ID"]; 
				params["END_ENTITY_ID"] = this.getRelationOnSubjectAreaDatas()[i]["END_ENTITY_ID"]; 
				// 1:0or1관계선
				if( relation_type == "relNonIden" ) {
					this.getRelationOnSubjectAreaDatas()[i]["RELATION_TYPE"] = "rel1toN";
					this.getRelationOnSubjectAreaDatas()[i]["NON_IDEN_YN"] = "Y";
					params["RELATION_TYPE"] = "rel1toN";
					params["NON_IDEN_YN"] = "Y";
				} 
				// 1:N
				// 1:1관계선
				// 1:0or1관계선
				else {
					this.getRelationOnSubjectAreaDatas()[i]["RELATION_TYPE"] = relation_type;
					this.getRelationOnSubjectAreaDatas()[i]["NON_IDEN_YN"] = "N";
					params["RELATION_TYPE"] = relation_type;
					params["NON_IDEN_YN"] = "N";
				}
				
				_this.updateRelationInfo("relType", params );
			}
		}
		/*
		this.getRelationOnSubjectAreaDatas().filter(function(item) {
								if (item.SUBJECT_ID == subject_id && item.RELATION_ID == relation_id ) {
									return true;
								} else {
									return false;
								}
							});
							*/
	}
	
	/**
	 * 연관 관계 시작 취소.
	 */
	this.cancelRelationByButton = function() {
		if(this.relationByButtonInfo && this.relationByButtonInfo["START_ENTITY_ID"] ) {
			var table_start  = SVG(".table_"+ this.relationByButtonInfo["START_ENTITY_ID"]);
			var rect_start = table_start.findOne(".rect_"+this.relationByButtonInfo["SUBJECT_ID"]+"_"+this.relationByButtonInfo["START_ENTITY_ID"]).attr({'stroke-width':0.7});
			this.getDrawedTable(this.relationByButtonInfo["SUBJECT_ID"], this.relationByButtonInfo["START_ENTITY_ID"]).relationByButtonBegin = false;
		}
		this.relationByButtonBegin = false;
		this.initEntityForAddSubject();
	}
	
	/*
	 * 상단 버튼 클릭으로 relation 
	 */ 
	this.setRelationByButton = function(relation_type, draw, tableGrp, subjectAreaInfo, tableInfo, ev) {
		var table = {};
		var rect = {}
		// 시작 테이블 선택 된 경우.
		if( this.relationByButtonBegin == false ) {
			table["start"]  = SVG(".table_"+subjectAreaInfo["SUBJECT_ID"]+"_"+ tableInfo["ENTITY_ID"]);
			rect["start"] = table["start"].findOne(".rect_"+subjectAreaInfo["SUBJECT_ID"]+"_"+tableInfo["ENTITY_ID"]);
			
			var start = {x:50, y:50};
			start.x = ev.offsetX - table["start"].transform('translateX');
			start.y = ev.offsetY - table["start"].transform('translateY');

			this.relationByButtonInfo = { "SUBJECT_ID" : subjectAreaInfo["SUBJECT_ID"], "RELATION_ID" : "", "RELATION" : "", "RELATION_NAME" : "", "RELATION_TYPE" : relation_type
						, "START_ENTITY_ID" : tableInfo["ENTITY_ID"], "START_ENTITY_NM" : tableInfo["ENTITY_NM"], "START_POSITION" : "r", "START_X" : start.x, "START_Y" : start.y
						, "END_ENTITY_ID" : "", "END_ENTITY_NM" : "", "END_POSITION" : "l", "END_X" : 80, "END_Y" : 50
						, "paths" : ""
					};
			
			this.relationByButtonBegin = true;
			
			rect["start"].attr({'stroke-width':1.7});
		}
		// 종료 테이블 선택 된 경우.
		else {
			 
			 table["start"]  = SVG(".table_"+subjectAreaInfo["SUBJECT_ID"]+"_"+ this.relationByButtonInfo["START_ENTITY_ID"]);
			 rect["start"] = table["start"].findOne(".rect_"+subjectAreaInfo["SUBJECT_ID"]+"_"+this.relationByButtonInfo["START_ENTITY_ID"]);
			 table["end"]  = SVG(".table_"+subjectAreaInfo["SUBJECT_ID"]+"_"+ tableInfo["ENTITY_ID"]);
			 rect["end"] = table["end"].findOne(".rect_"+subjectAreaInfo["SUBJECT_ID"]+"_"+tableInfo["ENTITY_ID"]);
			var end = {x:50, y:50};
			end.x = ev.offsetX - table["end"].transform('translateX');
			end.y = ev.offsetY - table["end"].transform('translateY');
						
			var boxOfStart = { 
								left : Math.ceil(table["start"].transform().translateX)
							 , top : Math.ceil(table["start"].transform().translateY)
							 , right : Math.ceil(table["start"].transform().translateX + rect["start"].width())
							 , bottom : Math.ceil(table["start"].transform().translateY + rect["start"].height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
							};

			var boxOfEnd = { 
								left : Math.ceil(table["end"].transform().translateX)
							 , top : Math.ceil(table["end"].transform().translateY)
							 , right : Math.ceil(table["end"].transform().translateX + rect["end"].width())
							 , bottom : Math.ceil(table["end"].transform().translateY + rect["end"].height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
							};

			console.log( this.relationByButtonInfo["START_ENTITY_ID"], tableInfo["ENTITY_ID"]);
			
			if( this.relationByButtonInfo["START_ENTITY_ID"] == tableInfo["ENTITY_ID"] ) {
				this.relationByButtonInfo["START_POSITION"] = "r";
				this.relationByButtonInfo["START_Y"] = rect["start"].height() - 15;

				end.x = rect["end"].width()-15;
				this.relationByButtonInfo["END_POSITION"] = "b";
				
				this.relationByButtonInfo["RECURSIVE"] = "Y";
			} else {
				if( boxOfStart.right < boxOfEnd.left ) {
					this.relationByButtonInfo["START_POSITION"] = "r";
					if( boxOfStart.top > boxOfEnd.bottom ) {
						this.relationByButtonInfo["END_POSITION"] = "b";
					} else if ( boxOfStart.bottom < boxOfEnd.top ) {
						this.relationByButtonInfo["END_POSITION"] = "t";
					} else {
						this.relationByButtonInfo["END_POSITION"] = "l";
					}
				} else if( boxOfStart.left > boxOfEnd.right ) {
					this.relationByButtonInfo["START_POSITION"] = "l";
					if( boxOfStart.top > boxOfEnd.bottom ) {
						this.relationByButtonInfo["END_POSITION"] = "b";
					} else if ( boxOfStart.bottom < boxOfEnd.top ) {
						this.relationByButtonInfo["END_POSITION"] = "t";
					} else {
						this.relationByButtonInfo["END_POSITION"] = "r";
					}
				} else {
					if( boxOfStart.top > boxOfEnd.bottom ) {
						this.relationByButtonInfo["START_POSITION"] = "t";
						this.relationByButtonInfo["END_POSITION"] = "b";
					} else if ( boxOfStart.bottom < boxOfEnd.top ) {
						this.relationByButtonInfo["START_POSITION"] = "b";
						this.relationByButtonInfo["END_POSITION"] = "t";
					}
				}

				for( var i=0; i< this.tableOnSubjectAreaDatas.length; i++ ) {
					if( this.tableOnSubjectAreaDatas[i]["ENTITY_ID"] == tableInfo["ENTITY_ID"] ) {
						this.tableOnSubjectAreaDatas[i]["IS_SUB_TABLE"] = "Y";
					}
				}
			}
			

			rect["start"].attr({'stroke-width':0.7});
			rect["end"].attr({'stroke-width':0.7});
			rect["end"].attr({rx:4});

			// this.relationByButtonInfo["RELATION_ID"] = "id_"+this.relationByButtonInfo["START_ENTITY_ID"]+"_"+tableInfo["ENTITY_ID"];
			this.relationByButtonInfo["RELATION"] = this.relationByButtonInfo["START_ENTITY_ID"]+"_"+tableInfo["ENTITY_ID"];
			this.relationByButtonInfo["RELATION_NAME"] = tableInfo["ENTITY_ID"];
			
			this.relationByButtonInfo["END_ENTITY_ID"] = tableInfo["ENTITY_ID"];
			this.relationByButtonInfo["END_ENTITY_NM"] = tableInfo["ENTITY_NM"];
			this.relationByButtonInfo["END_X"] = end.x;
			this.relationByButtonInfo["END_Y"] = end.y;
			
			if( relation_type == "relNonIden" ) {
				this.relationByButtonInfo["NON_IDEN_YN"] = "Y";
			} else {
				this.relationByButtonInfo["NON_IDEN_YN"] = "N";
			}
			this.relationByButtonInfo["RELATION_TYPE"] = relation_type;
			
			// relation정보 db저장
			var relation_id = this.saveRelationInfo('relSave', this.relationByButtonInfo);
			this.relationByButtonInfo["RELATION_ID"] = relation_id;
			
			console.log(this.relationOnSubjectAreaDatas);
			console.log(this.relationByButtonInfo);
			
			this.relationOnSubjectAreaDatas.push(this.relationByButtonInfo);
	
			console.log(this.relationOnSubjectAreaDatas);
			

			this.setDrawedRelation(subjectAreaInfo["SUBJECT_ID"], this.relationByButtonInfo["RELATION_ID"], new DrawRelation( draw, subjectAreaInfo, tableInfo, this, tableGrp, this.relationByButtonInfo ));

			console.log(this.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], this.relationByButtonInfo["RELATION_ID"]));
			this.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], this.relationByButtonInfo["RELATION_ID"]).initPath();
			this.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], this.relationByButtonInfo["RELATION_ID"]).drawRelation('init');
			// 시작, 종료 relation 등록
			this.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], this.relationByButtonInfo["START_ENTITY_ID"]).addRelationStart( this.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], this.relationByButtonInfo["RELATION_ID"]));
			this.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], this.relationByButtonInfo["END_ENTITY_ID"]).addRelationEnd( this.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], this.relationByButtonInfo["RELATION_ID"]));
			
			this.relationByButtonBegin = false;
			Ext.getCmp('DRAW_BUTTON').setValue('pointer');
			draw.attr({"cursor": "default"});
			tableGrp.attr({"cursor": "default"});
		}

	}
	
	
	this.getTableRelationsOfSuper = function(subject_id, entity_id) {
		var _this = this;
		var tableRelations = this.getRelationOnSubjectAreaDatas().filter(function(item) {
								if (item.SUBJECT_ID == subject_id && item["END_ENTITY_ID"] == entity_id) {
									return true;
								} else {
									return false;
								}
							});

		return tableRelations;
	}
	
	/**
	 * 그려진 테이블 관리
	 */
	this.setDrawedTable = function( subject_id, entity_id, DrawTable ) {
		if( this.drawedTable[subject_id]  == null || this.drawedTable[subject_id] == undefined ) {
			this.drawedTable[subject_id] = {};
		}
		this.drawedTable[subject_id][entity_id] = DrawTable;
	}
	
	/**
	 * 그려진 테이블 조회
	 */
	this.getDrawedTable = function( subject_id, entity_id ) {
		if( subject_id  == null || subject_id == undefined ) {
			return this.drawedTable;
		} else {
			if( entity_id ) {
				return this.drawedTable[subject_id][entity_id];
			} else {
				return this.drawedTable[subject_id];
			}
		}
	}
	
	/**
	 * 그려진 인지 확인.
	 */
	this.isDrawedTable = function( subject_id, entity_id ) {
		if( subject_id  == null || subject_id == undefined ) {
			return false;
		} else {
			if( this.drawedTable[subject_id]  == null || this.drawedTable[subject_id] == undefined ) {
				return false;
			} else if( this.drawedTable[subject_id][entity_id] == null || this.drawedTable[subject_id][entity_id] == undefined ) {
				return false;
			} else {
				return true;
			}
		}
	}
	
	
	/**
	 * 그려진 Relation 관리
	 */
	this.setDrawedRelation = function( subject_id, relation_id, DrawRelation ) {
		if( this.drawedRelation[subject_id]  == null || this.drawedRelation[subject_id] == undefined ) {
			this.drawedRelation[subject_id] = {};
		}
		this.drawedRelation[subject_id][relation_id] = DrawRelation;

		this.drawedRelation[relation_id] = DrawRelation;
	}
	
	/**
	 * 그려진 Relation 조회
	 */
	this.getDrawedRelation = function( subject_id, relation_id ) {
		if( subject_id  == null || subject_id == undefined ) {
			return this.drawedRelation;
		} else {
			if( relation_id ) {
				return this.drawedRelation[subject_id][relation_id];
			} else {
				return this.drawedRelation[subject_id];
			}
		}
	}
	
	/**
	 * 그려진 Relation 확인.
	 */
	this.isDrawedRelation = function( subject_id, relation_id ) {
		if( subject_id  == null || subject_id == undefined ) {
			return false;
		} else {
			if( this.drawedRelation[subject_id]  == null || this.drawedRelation[relation_id] == undefined ) {
				return false;
			} else if( this.drawedRelation[subject_id][relation_id] == null || this.drawedRelation[subject_id][relation_id] == undefined ) {
				return false;
			} else {
				return true;
			}
		}
	}
	
	this.setSelectedTables = function( subject_id, entity_id, _multiSelect ) {
		var _this = this;
		var multiSelect = (_multiSelect == undefined || _multiSelect == null) ? false : _multiSelect;

		console.log( this.selectTables["SUBJECT_ID"] , subject_id, entity_id, _multiSelect )


		if( this.selectTables["SUBJECT_ID"] != subject_id || multiSelect == false) {
			console.log( "DrawDataLoad.setSelectedTables" );
			this.selectTables["ENTITY_IDS"].forEach(function(selected_entity_id, selected_entity_id2, set) {
				if( selected_entity_id != entity_id ) {
					_this.getDrawedTable(_this.selectTables["SUBJECT_ID"], selected_entity_id).hideResizer();
					_this.getDrawedTable(_this.selectTables["SUBJECT_ID"], selected_entity_id).getTableGrp().draggable(false);
				}
			});
			
			this.selectTables = {SUBJECT_ID : "", ENTITY_IDS : new Set() };
		}
		
		this.selectTables["SUBJECT_ID"] = subject_id;
		
		if( entity_id == null || entity_id == undefined || entity_id == "" ) {
			return;
		}

		if( !this.selectTables["ENTITY_IDS"].has(entity_id)) {
			this.selectTables["ENTITY_IDS"].add(entity_id);
		}
		console.log( entity_id, this.selectTables["ENTITY_IDS"] )
				
		this.selectTables["ENTITY_IDS"].forEach(function(selected_entity_id, selected_entity_id2, set) {
			console.log( subject_id, selected_entity_id );
			_this.getDrawedTable(subject_id, selected_entity_id).showResizer();
		});
		// 업무영역에 테이블 추가 초기화.
		this.initEntityForAddSubject();
	}
	
	this.getSelectedTables = function() {
		return this.selectTables;
	}
	
	this.getSelectedTablesIfNotSelectedThenAll = function() {
		var _this = this;
		var entities = drawDataLoad.getSelectedTables();
		
		if( entities == null || entities["ENTITY_IDS"] == null || entities["ENTITY_IDS"].size == 0) {
			var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
			
			var tables = _this.getTables(subject_id);
			entities = {SUBJECT_ID: subject_id, ENTITY_IDS : new Set() };
			
			for( var i=0;i < tables.length; i++) {
				entities["ENTITY_IDS"].add( tables[i].ENTITY_ID );
				
			}
		}
		
		return entities;
	}
	
	this.setSelectedRelation = function(subject_id, relation_id){
		if( relation_id == null || relation_id == "" ) {
			if( this.getDrawedRelation( this.selectedRelation["SUBJECT_ID"], this.selectedRelation["RELATION_ID"]) ) {
				this.getDrawedRelation( this.selectedRelation["SUBJECT_ID"], this.selectedRelation["RELATION_ID"]).removeMover();
			}
			this.selectedRelation = {SUBJECT_ID : "", RELATION_ID : ""}
		} else {
			this.selectedRelation = {SUBJECT_ID : subject_id, RELATION_ID : relation_id};
			
			this.setSelectedTables(subject_id, null);
		}
		
	}
	
	this.getSelectedRelation = function() {
		return this.selectedRelation;
	}
	
	this.initMaker = function( draw ) {
		this.relationMarker["end_t"] = draw.marker(20, 20, function(add) {
			var pathRelation = new Array();
			var idx1 = 0;
			pathRelation[idx1++] = "M 0 -5";
			pathRelation[idx1++] = "l 5 5"; 
			pathRelation[idx1++] = "m -5 -5";
			pathRelation[idx1++] = "l -5 5";
			pathRelation[idx1++] = "m 5 0";
			
			// 1:1 선그리기.
			pathRelation[idx1++] = "m 0 -5";
			pathRelation[idx1++] = "m -5 0";
			pathRelation[idx1++] = "l 10 0";
			pathRelation[idx1++] = "m -5 0";
			
			// o그리기..
			pathRelation[idx1++] = "m -2.5 0";
			pathRelation[idx1++] = "m 0 -3.5";
			pathRelation[idx1++] = "a 2.5,2.5 0 1,0 5,0";
			pathRelation[idx1++] = "a 2.5,2.5 0 1,0 -5,0";
			pathRelation[idx1++] = "m -2.5 0";

		  const path = add.path( pathRelation.join(' '));
		  // const path = add.path('M 0 0 L 10 5 L 0 10');
		  
		  // Customize the marker's appearance
		  path.stroke({ color: 'red', width: 1 });
		}).ref(0, 0);
	
		this.relationMarker["end_l"] = "";
		this.relationMarker["end_r"] = "";
		this.relationMarker["end_b"] = draw.marker(20, 20, function(add) {
			/*
			var pathRelation = new Array();
			var idx1 = 0;
			pathRelation[idx1++] = "M 0 5";
			pathRelation[idx1++] = "l -5 -5"; 
			pathRelation[idx1++] = "m 5 5";
			pathRelation[idx1++] = "l 5 -5";
			pathRelation[idx1++] = "m -5 0";
			
			// 1:1 선그리기.
			pathRelation[idx1++] = "m 0 5";
			pathRelation[idx1++] = "m -5 0";
			pathRelation[idx1++] = "l 10 0";
			pathRelation[idx1++] = "m -5 0";
			
			// o그리기..
			pathRelation[idx1++] = "m -2.5 0";
			pathRelation[idx1++] = "m 0 3.5";
			pathRelation[idx1++] = "a 2.5,2.5 0 1,0 5,0";
			pathRelation[idx1++] = "a 2.5,2.5 0 1,0 -5,0"
			pathRelation[idx1++] = "m -5 0"

		  const path = add.path( pathRelation.join(' '));
		  // const path = add.path('M 0 0 L 10 5 L 0 10');
		  
		  // Customize the marker's appearance
		  path.stroke({ color: 'red', width: 1 });
		  */
			// add.circle(10).attr({ color: 'black', stroke : 0.7, fill : "white" });
			// add.circle(10).attr({stroke: '#000', 'stroke-width': 0.7, fill:'white'});
			add.path('M 0 0 l 0 15').attr({stroke: '#000', 'stroke-width': 0.7});
		}).ref(20, 20);
	}
		
	this.getRelationMarker = function( type ) {
		return this.relationMarker[type] ;
	}

	this.setRelationLineColor  = function(color) {
		var _this = this;
		for( var i=0; _this.selectedRelation["RELATION_ID"] != "" && i<_this.getRelationOnSubjectAreaDatas().length; i++) {
			
			if( _this.getRelationOnSubjectAreaDatas()[i]["RELATION_ID"] == _this.getSelectedRelation()["RELATION_ID"] ) {
				var relation = _this.getDrawedRelation(_this.getRelationOnSubjectAreaDatas()[i]["SUBJECT_ID"], _this.getRelationOnSubjectAreaDatas()[i]["RELATION_ID"])

				// 백그라운드속성변경
				_this.updateRelationInfo("relationColor", {"SUBJECT_ID": _this.getRelationOnSubjectAreaDatas()[i]["SUBJECT_ID"], "RELATION_ID" : _this.getSelectedRelation()["RELATION_ID"], "ATTR":"LINE_COLOR", "VAL" : '#'+ color , "LINE_COLOR" : '#'+ color } );

				relation.relationPath.attr({stroke:'#'+color});
				relation.relationPathEnd.attr({stroke:'#'+color});
				
				_this.getRelationOnSubjectAreaDatas()[i]["COLOR"] = '#'+color;
			}
		}
	}
	/**
	 * 테이블선 색변경
	 */
	this.setTableLineColor = function(color) {
		var _this = this;
		_this.getSelectedTables()["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
			var table = _this.getDrawedTable(_this.getSelectedTables()["SUBJECT_ID"], entity_id);
				
			table.columsAroundRect.attr({stroke : '#'+color });
			table.pkLine.attr({stroke : '#'+color });

			// 백그라운드속성변경
			_this.updateTableInfo("lineColor", {"SUBJECT_ID": _this.getSelectedTables()["SUBJECT_ID"], "ENTITY_ID" : entity_id, "LINE_COLOR" : '#'+ color } );

			for( var i=0;i<_this.getTableOnSubjectAreaDatas().length; i++) {
				
				if( _this.getTableOnSubjectAreaDatas()[i]["ENTITY_ID"] == entity_id ) {
					_this.getTableOnSubjectAreaDatas()[i]["LINE_COLOR"] = '#'+color;
				}
			}
		});

		

		Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);
	}

	/**
	 * 테이블 백그라운드 색변경
	 */
	this.setTableBackgroundColor = function(color) {
		var _this = this;
		_this.getSelectedTables()["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
			var table = _this.getDrawedTable(_this.getSelectedTables()["SUBJECT_ID"], entity_id);
				
			table.columsAroundRect.fill('#'+ color);
			
			// 백그라운드속성변경
			_this.updateTableInfo("bgColor", {"SUBJECT_ID": _this.getSelectedTables()["SUBJECT_ID"], "ENTITY_ID" : entity_id, "BG_COLOR" : '#'+ color } );
			
			for( var i=0;i<_this.getTableOnSubjectAreaDatas().length; i++) {
				if( _this.getTableOnSubjectAreaDatas()[i]["ENTITY_ID"] == entity_id ) {
					_this.getTableOnSubjectAreaDatas()[i]["BACKGROUND_COLOR"] = '#'+color;
				}
			}
		});



		Ext.getCmp("COLOR_BUTTON").items.items[1].setPressed(false);
	}

	/**
	 * 테이블명 색변경
	 */
	this.setTableNameColor = function(color) {
		var _this = this;
		_this.getSelectedTables()["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
			var table = _this.getDrawedTable(_this.getSelectedTables()["SUBJECT_ID"], entity_id);

			table.tableNameText.findOne('tspan').fill('#'+color);

			// 백그라운드속성변경
			_this.updateTableInfo("tnColor", {"SUBJECT_ID": _this.getSelectedTables()["SUBJECT_ID"], "ENTITY_ID" : entity_id, "COLOR" : '#'+ color } );

			for( var i=0;i<_this.getTableOnSubjectAreaDatas().length; i++) {
				
				if( _this.getTableOnSubjectAreaDatas()[i]["ENTITY_ID"] == entity_id ) {
					_this.getTableOnSubjectAreaDatas()[i]["COLOR"] = '#'+color;
				}
			}

		});
		


		Ext.getCmp("COLOR_BUTTON").items.items[2].setPressed(false);
	}

	/**
	 * 테이블명 백그라운드 색변경
	 */
	this.setTableNameBackgroundColor = function(color) {
		var _this = this;
		_this.getSelectedTables()["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
			var table = _this.getDrawedTable(_this.getSelectedTables()["SUBJECT_ID"], entity_id);
			
			table.rectHeader.attr({"fill" : "#"+color} );

			// 백그라운드속성변경
			_this.updateTableInfo("tnbgColor", {"SUBJECT_ID": _this.getSelectedTables()["SUBJECT_ID"], "ENTITY_ID" : entity_id, "NM_BG_COLOR" : '#'+ color } );

			for( var i=0;i<_this.getTableOnSubjectAreaDatas().length; i++) {
				
				if( _this.getTableOnSubjectAreaDatas()[i]["ENTITY_ID"] == entity_id ) {
					_this.getTableOnSubjectAreaDatas()[i]["TABLE_BACKGROUND_COLOR"] = '#'+color;
				}
			}
		});

		Ext.getCmp("COLOR_BUTTON").items.items[3].setPressed(false);
	}	
	
	this.setCursorStatus = function (cursorStatus) {
		this.cursorStatus = cursorStatus;
	}
	
	this.getCursorStatus = function() {
		return this.cursorStatus;
	}
	
	this.deleteSelectedObjects = function() {
		var _this = this;

		// 업무영역에 테이블 추가 초기화.
		this.initEntityForAddSubject();
		
		var relation = _this.getDrawedRelation(this.getSelectedRelation()["SUBJECT_ID"], this.getSelectedRelation()["RELATION_ID"]);
		
		if( _this.getSelectedTables()["ENTITY_IDS"].size == 0  &&  !relation) {
			Ext.MessageBox.show({title:'안내', msg: '삭제할 테이블 또는 관계를 선택 후 삭제하세요.', icon: Ext.MessageBox.INFO});
			
			Ext.getCmp('DRAW_BUTTON').setValue('pointer');
			
			return;
		}
		 
		if( _this.getSelectedTables()["ENTITY_IDS"] && _this.getSelectedTables()["ENTITY_IDS"].size > 0 ) {
			
			ErdAppFunction.deleteTableWindow(_this, 'deleteSelectedObjects');
			/*
			Ext.MessageBox.show({
				msg: '선택된 ' + size+'개의 테이블을 삭제하시겠습니까?',
				title: '확인',
				icon: Ext.MessageBox.CONFIRM,
				buttonText:{
				  ok: '프로젝트에서 완전히 삭제',
				  yes: '업무영역에서만 삭제',
				  cancel: '취소'
				},
				fn: function(btn){
					if( btn == 'ok' || btn == 'yes') {
						var delType = 'deleteTable';
						
						if( btn == 'ok' ) {
							delType = 'deleteTableInProject'
						}

						// 테이블 삭제..
						 _this.getSelectedTables()["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
							var table = _this.getDrawedTable(_this.getSelectedTables()["SUBJECT_ID"], entity_id);
							
							// 테이블 삭제
							var result = _this.deleteTableInfo(delType, { "SUBJECT_ID" : _this.getSelectedTables()["SUBJECT_ID"], "ENTITY_ID" : entity_id} )
							
							if( result.success ){
								if( result.SUBJECT_ENTITY_DELETE_YN == "Y" ) {
									table.deleteTable();
								}
								var pkInsertEntityList = result.PK_INSERT_ENTITY_LIST;
								var pkDeleteEntityList = result.PK_DELETE_ENTITY_LIST;
								
								var entityList = result.ENTITY_LIST;
								var entityColumnList = result.ENTITY_COLUMN_LIST;
								
								_this.drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
							}

						});
						
						_this.setSelectedTables( null, null, null);
						Ext.getCmp('DRAW_BUTTON').setValue('pointer');
					}else {
						_this.setSelectedTables( null, null, null);
						Ext.getCmp('DRAW_BUTTON').setValue('pointer');
					}
				}
			});
			*/
		}
		/*
		for(var i=0; i< this.getTableOnSubjectAreaDatas().length; i++ ) {
			var table = this.getTableOnSubjectAreaDatas()[i];
			
			if( table["SUBJECT_ID"] == _this.getSelectedTables()["SUBJECT_ID"] 
				&& _this.getSelectedTables()["ENTITY_IDS"].has(table["ENTITY_ID"])) {
				  this.getTableOnSubjectAreaDatas()[i]["DEL_YN"] = "Y";  
			}
		}
		
		for(var i=0; i< this.getRelationOnSubjectAreaDatas().length; i++ ) {
			var relation = this.getRelationOnSubjectAreaDatas()[i];
			
			if( relation["SUBJECT_ID"] == _this.getSelectedTables()["SUBJECT_ID"] 
				&& ( _this.getSelectedTables()["ENTITY_IDS"].has(relation["START_ENTITY_ID"]) 
					 ||  _this.getSelectedTables()["ENTITY_IDS"].has(relation["END_ENTITY_ID"]))) {
				  this.getRelationOnSubjectAreaDatas()[i]["DEL_YN"] = "Y";  
			}
		}
		*/
		
		if( relation ) {
			Ext.Msg.confirm('확인', '선택한 관계를 삭제하시겠습니까?', function(btn) {
				if( btn == 'yes') {
					var result = _this.deleteRelationInfo('deleteRelation', {"SUBJECT_ID" : _this.getSelectedRelation()["SUBJECT_ID"], "RELATION_ID" : _this.getSelectedRelation()["RELATION_ID"]});
					if(result) {
						// 관계삭제.
						relation.deleteRelation();
					}
					_this.setSelectedRelation( null, null);
					Ext.getCmp('DRAW_BUTTON').setValue('pointer');
				}else {
					_this.setSelectedRelation( null, null);
					Ext.getCmp('DRAW_BUTTON').setValue('pointer');
				}
			});
		};
		
	}
	
	
	/**
	 * 
	 */
	this.setSelectRectangular = function(object_type, data) {
		var _this = this;
		// console.log( object_type, _this.selectRectangular["OBJECT"] );
		if( object_type == 'init' ) {
			_this.selectRectangular = {OBJECT : 'init', AREA_SELECT : false , INIT_X : 0 , INIT_Y : 0, X : 0, Y : 0, WIDTH : 0 , HEIGHT : 0};
		} else if( object_type == 'table' ) {
			_this.selectRectangular = {OBJECT : 'table', AREA_SELECT : false , INIT_X : 0 , INIT_Y : 0, X : 0, Y : 0, WIDTH : 0 , HEIGHT : 0};
		} else if( object_type == 'subject' ) {
			if( _this.selectRectangular["OBJECT"] == 'table') {
				return ;
			}
			_this.selectRectangular["OBJECT"] = 'subject' ;
			_this.selectRectangular["AREA_SELECT"] = true ;
			
			for( var x in data) {
				_this.selectRectangular[x] = data[x];
			}
		} 
		
	}
	
	this.getSelectRectangular = function() {
		var _this = this;
		return _this.selectRectangular;
	}
	
	/**
	 * 테이블 정보 db저장
	 * infoType : move(이동)
	 */
	this.saveTableInfo = function(infoType, params ) {
		// 아래에서 수행
		// ErdAppFunction.addTableWindow()
		// /entity/data/save.do 
	}
	
	/**
	 * 테이블 정보 변경 db저장
	 * infoType : move(이동)
	 */
	this.updateTableInfo = function(infoType, params ) {
		params["ACTION"] = infoType;
		// console.log(infoType, params);

		var response = Ext.Ajax.request({
			async: false,
			url: '/entity/data/updateAttr.do',
			params: params
		});
		var result =  Ext.decode(response.responseText).success;
		
		this.tableOnSubjectAreaDatas.forEach(function(table) {
			if( table["SUBJECT_ID"] == params["SUBJECT_ID"] && table["ENTITY_ID"] == params["ENTITY_ID"] ) {
				for( var x in params ) {
					if( table[x] && params[x] != null) {
						table[x] = params[x];
					}
				}
			 }
		});
	}
	
	/**
	 * 테이블 삭제
	 */
	this.deleteTableInfo = function(infoType, params){
		params["ACTION"] = infoType;
		// console.log(infoType, params);

		// 프로젝트에서 완전히 삭제인 경우.
		if( infoType == 'deleteTableInProject' ){
			params['ALL_YN'] = 'Y';
		}
							
		var response = Ext.Ajax.request({
			async: false,
			url: '/entity/data/delete.do',
			params: params
		});
		var result =  Ext.decode(response.responseText);
		
		return result;
	}
	
	/**
	 * 업무영역에 relation추가
	 */
	this.addRelationSubjectInfo= function(infoType, params ){
		params["ACTION"] = infoType;

		/*
		relation["SUBJECT_ID"] = subject_id;
		relation["START_X"] = rect["start"].width()/2;
		relation["START_Y"] = rect["start"].height()/2;
		relation["END_X"] = rect["end"].width()/2;
		relation["END_Y"] = rect["end"].height()/2;
		relation["START_POSITION"] = "t";
		relation["END_POSITION"] = "b";
		*/
		
		var response = Ext.Ajax.request({
			async: false,
			url: '/relation/data/addToSubject.do',
			params: params
		});	
		
		var res = Ext.decode(response.responseText);
		
		return res;	
	}
	
	
	
	/**
	 * 관계 등록
	 */
	this.saveRelationInfo= function(infoType, params ) {
		params["ACTION"] = infoType;
		// console.log(infoType, params);

		if( params["START_ENTITY_ID"] == params["END_ENTITY_ID"] ) {
			params["NON_IDEN_YN"] = "Y";
		}
		var response = Ext.Ajax.request({
			async: false,
			url: '/relation/data/save.do',
			params: params
		});
		
		var res = Ext.decode(response.responseText);
		var result =  res.success;
		var relationId = res.RELATION_ID;
		
		var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
		var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;
		
		var entityColumnList = res.ENTITY_COLUMN_LIST;

		//console.log( typeof(pkInsertEntityList), pkInsertEntityList );
		//console.log( typeof(pkDeleteEntityList), pkDeleteEntityList );
		
		var entityList = res.ENTITY_LIST;
		var entityColumnList = res.ENTITY_COLUMN_LIST;
		
		this.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
		
		/*
		
		//console.log(pkInsertEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271'));
		//console.log(pkInsertEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271111'));
		//console.log(pkDeleteEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271'));
		//console.log(pkDeleteEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271111'));
		
		this.tableColumnDatas.filter(x => pkInsertEntityList.includes(x.ENTITY_ID)||pkDeleteEntityList.includes(x.ENTITY_ID)).forEach(x => this.tableColumnDatas.splice(this.tableColumnDatas.indexOf(x), 1));

		//console.log( this.tableColumnDatas )

		this.tableColumnDatas = this.tableColumnDatas.concat(entityColumnList);
		console.log( this.tableColumnDatas )
		*/
		return relationId;
	}

	/**
	 * relation path 수정
	 */
	this.updateRelationPath = function(infoType, params ) {
		
		var response = Ext.Ajax.request({
			async: false,
			url: '/relation/data/updatePath.do',
			params: params
		});
		var res = Ext.decode(response.responseText);

		var result =  res.success;
		
	}

	/**
	 * 관계정보 수정
	 */
	this.updateRelationInfo= function(infoType, params ) {
		params["ACTION"] = infoType;
		// console.log(infoType, params);

		var response = Ext.Ajax.request({
			async: false,
			url: '/relation/data/update.do',
			params: params
		});
		var res = Ext.decode(response.responseText);

		var result =  res.success;
		
		var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
		var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;
		
		//console.log( typeof(pkInsertEntityList), pkInsertEntityList );
		//console.log( typeof(pkDeleteEntityList), pkDeleteEntityList );
		
		var entityList = res.ENTITY_LIST;
		var entityColumnList = res.ENTITY_COLUMN_LIST;
		
		this.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
		
		/*
		//console.log(pkInsertEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271'));
		//console.log(pkInsertEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271111'));
		//console.log(pkDeleteEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271'));
		//console.log(pkDeleteEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271111'));
		
		this.tableColumnDatas.filter(x => pkInsertEntityList.includes(x.ENTITY_ID)||pkDeleteEntityList.includes(x.ENTITY_ID)).forEach(x => this.tableColumnDatas.splice(this.tableColumnDatas.indexOf(x), 1));

		//console.log( this.tableColumnDatas )

		this.tableColumnDatas = this.tableColumnDatas.concat(entityColumnList);
		console.log( this.tableColumnDatas );
		
		
		for( var x in this.drawedSubectArea ) {
			for( var i=0;pkInsertEntityList && i<pkInsertEntityList.length; i++) {
				console.log(x, pkInsertEntityList[i], this.getDrawedTable(x, pkInsertEntityList[i]) );
				// 컬럼 및 pk라인을 다시 그린다.
				this.getDrawedTable(x, pkInsertEntityList[i]).redrawColumns()
			}
			for( var i=0;pkDeleteEntityList && i<pkDeleteEntityList.length; i++) {
				console.log(x, pkDeleteEntityList[i], this.getDrawedTable(x, pkDeleteEntityList[i]) );
				// 컬럼 및 pk라인을 다시 그린다.
				this.getDrawedTable(x, pkDeleteEntityList[i]).redrawColumns()
			}
		}
		*/
	}
	
	/**
	 * 관계 삭제
	*/
	this.deleteRelationInfo= function(infoType, params ) {
		params["ACTION"] = infoType;
		// console.log(infoType, params);

		var response = Ext.Ajax.request({
			async: false,
			url: '/relation/data/delete.do',
			params: params
		});
		var res = Ext.decode(response.responseText);

		var result =  res.success;
		
		var pkInsertEntityList = res.PK_INSERT_ENTITY_LIST;
		var pkDeleteEntityList = res.PK_DELETE_ENTITY_LIST;
		
		var entityList = res.ENTITY_LIST;
		var entityColumnList = res.ENTITY_COLUMN_LIST;
		//console.log( typeof(pkInsertEntityList), pkInsertEntityList );
		//console.log( typeof(pkDeleteEntityList), pkDeleteEntityList );
		
		this.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
		
		/*
		console.log( this.tableColumnDatas )
		
		//console.log(pkInsertEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271'));
		//console.log(pkInsertEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271111'));
		//console.log(pkDeleteEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271'));
		//console.log(pkDeleteEntityList.includes('4e839f0d-530b-11ee-b4e6-6c2408968271111'));
		
		this.tableColumnDatas.filter(x => pkInsertEntityList.includes(x.ENTITY_ID)||pkDeleteEntityList.includes(x.ENTITY_ID)).forEach(x => this.tableColumnDatas.splice(this.tableColumnDatas.indexOf(x), 1));

		//console.log( this.tableColumnDatas )

		this.tableColumnDatas = this.tableColumnDatas.concat(entityColumnList);
		console.log( this.tableColumnDatas )
		*/
		
		return result;
	}
	
	this.restoreEntityInfo = function(entity, subjectEntityList) {
		
		this.tableOnSubjectAreaDatas.filter(x => entity.ENTITY_ID == x.ENTITY_ID ).forEach(x => this.tableOnSubjectAreaDatas.splice(this.tableOnSubjectAreaDatas.indexOf(x), 1));
		
		this.tableOnSubjectAreaDatas = this.tableOnSubjectAreaDatas.concat(subjectEntityList);
		
		for( var x in this.drawedSubectArea ) {
			for( var i=0;subjectEntityList && i<subjectEntityList.length; i++) {
				var table = this.tableOnSubjectAreaDatas.find(function(_table) {
					 return (_table.SUBJECT_ID ==x && _table.ENTITY_ID == subjectEntityList[i].ENTITY_ID);
				});
				console.log( table );
				if( table ) {
					this.getDrawedTable(x, subjectEntityList[i].ENTITY_ID).setTableInfo(table);
					this.getDrawedTable(x, subjectEntityList[i].ENTITY_ID).setTableNameText();
				}
			}
		}
		
	}
	
	
	this.restoreEntityAndColumn = function (pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList) {

		console.log( this.tableOnSubjectAreaDatas );
		pkInsertEntityList = pkInsertEntityList||[]
		this.tableOnSubjectAreaDatas.filter(x => pkInsertEntityList.includes(x.ENTITY_ID)||pkDeleteEntityList.includes(x.ENTITY_ID)).forEach(x => this.tableOnSubjectAreaDatas.splice(this.tableOnSubjectAreaDatas.indexOf(x), 1));
		this.tableOnSubjectAreaDatas = this.tableOnSubjectAreaDatas.concat(entityList);
		console.log( this.tableOnSubjectAreaDatas )

		for( var x in this.drawedSubectArea ) {
			for( var i=0;pkInsertEntityList && i<pkInsertEntityList.length; i++) {
				//console.log(x, pkInsertEntityList[i], this.getDrawedTable(x, pkInsertEntityList[i]) );
				
				// var table = this.tableOnSubjectAreaDatas.find((_table) => ( _table.SUBJECT_ID ==x && _table.ENTITY_ID == pkInsertEntityList[i]));
				
				var table = this.tableOnSubjectAreaDatas.find(function(_table) {
					console.log(_table.SUBJECT_ID ==x && _table.ENTITY_ID == pkInsertEntityList[i],  _table.SUBJECT_ID, x, _table.ENTITY_ID,  pkInsertEntityList[i] );
					return (_table.SUBJECT_ID ==x && _table.ENTITY_ID == pkInsertEntityList[i]);
				});
				
				console.log( table );
				if( table ) {
					 this.getDrawedTable(x, pkInsertEntityList[i]).setTableInfo(table);
					 this.getDrawedTable(x, pkInsertEntityList[i]).setTableNameText();
					// this.getDrawedTable(x, pkInsertEntityList[i]).setTableInfo(table);
				}

				
			}
			for( var i=0;pkDeleteEntityList && i<pkDeleteEntityList.length; i++) {
				//console.log(x, pkDeleteEntityList[i], this.getDrawedTable(x, pkDeleteEntityList[i]) );

				// var table = this.tableOnSubjectAreaDatas.find((_table) => (_table.SUBJECT_ID ==x  && _table.ENTITY_ID == pkDeleteEntityList[i]));

				var table = this.tableOnSubjectAreaDatas.find(function(_table) {
					console.log( _table.SUBJECT_ID ==x && _table.ENTITY_ID == pkDeleteEntityList[i], _table.SUBJECT_ID, x,_table.ENTITY_ID, x, pkDeleteEntityList[i] );
					return (_table.SUBJECT_ID ==x && _table.ENTITY_ID == pkDeleteEntityList[i]);
				});

				console.log( table );
				if( table ) {
					// 컬럼 및 pk라인을 다시 그린다.
					this.getDrawedTable(x, pkDeleteEntityList[i]).setTableInfo(table);
					this.getDrawedTable(x, pkDeleteEntityList[i]).setTableNameText();
				}
			}
		}
		
		this.tableColumnDatas.filter(x => pkInsertEntityList.includes(x.ENTITY_ID)||pkDeleteEntityList.includes(x.ENTITY_ID)).forEach(x => this.tableColumnDatas.splice(this.tableColumnDatas.indexOf(x), 1));
		this.tableColumnDatas = this.tableColumnDatas.concat(entityColumnList);
		console.log( this.tableColumnDatas )

		for( var x in this.drawedSubectArea ) {
			for( var i=0;pkInsertEntityList && i<pkInsertEntityList.length; i++) {
				console.log(x, pkInsertEntityList[i], this.getDrawedTable(x, pkInsertEntityList[i]) );
				if( pkInsertEntityList[i] && this.getDrawedTable(x, pkInsertEntityList[i]) ) {
					// 컬럼 및 pk라인을 다시 그린다.
					this.getDrawedTable(x, pkInsertEntityList[i]).redrawColumns();
					
				}
			}
			for( var i=0;pkDeleteEntityList && i<pkDeleteEntityList.length; i++) {
				console.log(x, pkDeleteEntityList[i], this.getDrawedTable(x, pkDeleteEntityList[i]) );
				if(pkDeleteEntityList[i] && this.getDrawedTable(x, pkDeleteEntityList[i])) {
					// 컬럼 및 pk라인을 다시 그린다.
					this.getDrawedTable(x, pkDeleteEntityList[i]).redrawColumns();
				}
			}
		}
		

	}
	
	this.setEntityForAddSubject = function(entity_id, table_nm) {
		this.entityForAddSubject = {ENTITY_ID : entity_id, TABL_NM : table_nm };
		// '테이블 생성'선택
		Ext.getCmp('DRAW_BUTTON').setValue('table');
		
		console.log( this.entityForAddSubject );
	}

	this.getEntityForAddSubject = function() {
		return this.entityForAddSubject;;
	}
	
	this.initEntityForAddSubject = function(isButtonInit) {
		isButtonInit = isButtonInit||false;
		this.entityForAddSubject = {ENTITY_ID : "", TABL_NM : "" };
		if( isButtonInit ) {
			Ext.getCmp('DRAW_BUTTON').setValue('pointer');
		}
	}
	
	 this.addEntityToSubject= function(infoType, params ) {
		params["ACTION"] = infoType;
		// console.log(infoType, params);

		var response = Ext.Ajax.request({
			async: false,
			url: '/entity/data/updateDmlTcd.do',
			params: params
		});
		var res = Ext.decode(response.responseText);

		return  res;
	}
	/*
	this.setRelationPath = function( subject_id, relation_id, Path ) {
		if( this.relationPath[subject_id]  == null || this.relationPath[subject_id] == undefined ) {
			this.relationPath[subject_id] = {};
		}
		this.relationPath[subject_id][relation_id] = Path;
	}
	
	
	this.getRelationPath = function( subject_id, relation_id ) {
		if( subject_id  == null || subject_id == undefined ) {
			return this.relationPath;
		} else {
			if( relation_id ) {
				return this.relationPath[subject_id][relation_id];
			} else {
				return this.relationPath[subject_id];
			}
		}
	}
	*/
}