
var DrawRelations = function(draw, subjectAreaInfo, tableInfo, drawDataLoad, tableGrp) {
	this.draw = draw;
	this.subjectAreaInfo = subjectAreaInfo;
	this.tableInfo = tableInfo;
	this.drawDataLoad = drawDataLoad;
	this.tableGrp = tableGrp;
	this.tableGrpTransform = { translateX : this.tableGrp.transform('translateX') , translateY : this.tableGrp.transform('translateY') };
	
	this.tableRelations = new Array();
	
	/*
	 * 관계선들 조회.
	 */
	this.drawRelations = function() {
		var _this = this;
		
		_this.tableRelations = _this.drawDataLoad.getTableRelations(_this.subjectAreaInfo["subject_id"], _this.tableInfo["entity_id"]);
		for( var i=0; i<_this.tableRelations.length; i++ ) {
			if( _this.drawDataLoad.isDrawedRelation(_this.subjectAreaInfo["subject_id"], _this.tableRelations[i]["relation_id"]) == false ) {
				this.drawRelation( _this.tableRelations[i] );
			}
		}
	}
	
	/*
	 * 관계선을 그리니다.
	 */
	this.drawRelation = function(relationInfo) {
		var _this = this;
		_this.relationInfo = relationInfo;
		
		_this.drawDataLoad.setDrawedRelation(_this.subjectAreaInfo["subject_id"], _this.relationInfo["relation_id"], new DrawRelation( _this.draw, _this.subjectAreaInfo, _this.tableInfo, _this.drawDataLoad, tableGrp, relationInfo ));
			
		_this.drawDataLoad.getDrawedRelation(_this.subjectAreaInfo["subject_id"], _this.relationInfo["relation_id"]).drawRelation();
		// console.log(_this.drawDataLoad.getDrawedRelation(_this.subjectAreaInfo["subject_id"], _this.relationInfo["relation_id"]));
	}
	
	/*
	 * Table Drag시 관계선 시작 테이블 .. 다시 그린다.
	 */
	this.redrawRelationsStart = function(ev) {
		var _this = this;
		
		_this.tableRelations = _this.drawDataLoad.getTableRelations(_this.subjectAreaInfo["subject_id"], _this.tableInfo["entity_id"]);

		// console.log(  _this.tableRelations   );
		// console.log(_this.tableGrp,  ev.detail.box.x, ev.detail.box.y );
		
		var trans = { x : _this.tableGrp.transform('translateX') - _this.tableGrpTransform.translateX, y : _this.tableGrp.transform('translateY')-_this.tableGrpTransform.translateY };
		
		for( var i=0; i<_this.tableRelations.length ; i++ ) {
			_this.drawDataLoad.getDrawedRelation(_this.subjectAreaInfo["subject_id"], _this.tableRelations[i]["relation_id"]).redrawRelationStart(trans);
			console.log( _this.drawDataLoad.getDrawedRelation(_this.subjectAreaInfo["subject_id"], _this.tableRelations[i]["relation_id"]).pathRelation['paths'] )
		}
		
	}

	/*
	 * Table Drag시 관계선 종료 테이블 .. 다시 그린다.
	 */
	this.redrawRelationsEnd  = function(ev) {
		var _this = this;

		_this.tableRelations = _this.drawDataLoad.getTableRelations(_this.subjectAreaInfo["subject_id"], _this.tableInfo["entity_id"]);

		var trans = { x : _this.tableGrp.transform('translateX') - _this.tableGrpTransform.translateX, y : _this.tableGrp.transform('translateY')-_this.tableGrpTransform.translateY };

		for( var i=0; i<_this.tableRelations.length ; i++ ) {
			_this.drawDataLoad.getDrawedRelation(_this.subjectAreaInfo["subject_id"], _this.tableRelations[i]["relation_id"]).redrawRelationEnd(trans);
		}
	}
	
}





	/**
	 * 그려진 Relation 관리
	 */
	this.setDrawedRelations = function( subject_id, entity_id, DrawRelations ) {
		if( this.drawedRelations[subject_id]  == null || this.drawedRelations[subject_id] == undefined ) {
			this.drawedRelations[subject_id] = {};
		}
		this.drawedRelations[subject_id][entity_id] = DrawRelations;

		if( this.drawedRelationsEnd[subject_id]  == null || this.drawedRelationsEnd[subject_id] == undefined ) {
			this.drawedRelationsEnd[subject_id] = {};
		}
		
	}
	
	/**
	 * 그려진 Relation 조회
	 */
	this.getDrawedRelations = function( subject_id, entity_id ) {
		if( subject_id  == null || subject_id == undefined ) {
			return this.drawedRelations;
		} else {
			if( entity_id ) {
				return this.drawedRelations[subject_id][entity_id];
			} else {
				return this.drawedRelations[subject_id];
			}
		}
	}
	
	/**
	 * 그려진 Relation 확인.
	 */
	this.isDrawedRelations = function( subject_id, entity_id ) {
		if( subject_id  == null || subject_id == undefined ) {
			return false;
		} else {
			if( this.drawedRelations[subject_id]  == null || this.drawedRelations[subject_id] == undefined ) {
				return false;
			} else if( this.drawedRelations[subject_id][entity_id] == null || this.drawedRelations[subject_id][entity_id] == undefined ) {
				return false;
			} else {
				return true;
			}
		}
	}