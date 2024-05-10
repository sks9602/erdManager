var DrawTable = function(draw, subjectAreaInfo, tableInfo, drawDataLoad) {
	this.draw = draw;
	this.subjectAreaInfo = subjectAreaInfo;
	this.tableInfo = tableInfo;
	this.drawDataLoad = drawDataLoad;
	this.tableResizerCircleList = new Array();
	this.isSelected = false;
	this.tableColumnDataList = new Array();
	this.tablePostion = { x : tableInfo["x"], y : tableInfo["y"] };
	this.columnRectList = new Array();
	
	this.TABLE_INFO = {"width": 150, "height": 200, "resizerRadius" : 8};

	this.CONSTANT = { STROKE_WIDTH : 0.7, POINT_RADIUS : 6,  HEADER_HIGHT : 15, HEADER_HIGHT_GAP : 9, PAD_TEXT_LEFT:3, PK_LINE : 0, COLUMN_HIGHT : 12 };  //  HEADER_HIGHT_GAP = HEADER_HIGHT - POINT_RADIUS/2
	
	this.pathRelation = {};
	this.tableGrpTransform = { translateX : 0, translateY : 0 };
	
	this.relationStart = new Array();
	this.relationEnd = new Array();
	this.tableGrpClickCount = 0;
	this.tableGrpPreClickDate = new Date();
	
	this.relationByButtonBegin = false;
	
	this.pointsList = {
		tl: [ 0, 0, "nw-resize", 'all' ],
		t: [ 'width', 0, "n-resize", 'v' ],
		tr: [ 'width', 0, "ne-resize", 'all' ],
		l: [ 0, 'height', "w-resize" , 'h'],
		r: [ 'width', 'height', "e-resize", 'h'],
		bl: [ 0, 'height', "sw-resize" , 'all'],
		b: [ 'width', 'height', "s-resize" , 'v'],
		br: [ 'width', 'height', "se-resize" , 'all']
	};
		
	this.setTableInfo = function(tableInfo) {
		this.tableInfo = tableInfo;
	}
	
	/*
	 * 테이블 명 변경
	 */
	this.setTableNameText= function( ) {
		var _this = this;
		var tableInfo = this.tableInfo;
		
		this.tableNameText.remove();

		//테이블 명
		var tableFullNm = ""; // tableInfo["TABLE_NM"]+"/"+tableInfo["ENTITY_NM"]+" [" + tableInfo["TABL_SCD_NM"] +"]";
		
		console.log( Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue() )
		if( Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue() == 'LOGICAL' ) {
			tableFullNm = (tableInfo["DML_TCD"]=="" ? "" : tableInfo["DML_TCD"]) + tableInfo["TABLE_NM"]+ " [" + tableInfo["TABL_SCD_NM"] +"]";
		} else if( Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue() == 'PHYSICAL' )  {
			tableFullNm = (tableInfo["DML_TCD"]=="" ? "" : tableInfo["DML_TCD"]) + tableInfo["ENTITY_NM"]+ " [" + tableInfo["TABL_SCD_NM"] +"]";
		} else {
			tableFullNm = (tableInfo["DML_TCD"]=="" ? "" : tableInfo["DML_TCD"]) + tableInfo["TABLE_NM"]+"/"+tableInfo["ENTITY_NM"]+ " [" + tableInfo["TABL_SCD_NM"] +"]";
		}
		
		// console.log( Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue(), tableFullNm);
		
		this.tableNameText = _this.draw.text(function(t) {
			for( var i=0; i<tableFullNm.length; i++) {
				if( i==0 ) {
					t.tspan(tableFullNm[i]).fill(_this.getTableNameColor(_this.tableInfo)).dx(2).dy(2);
				} else {
					t.tspan(tableFullNm[i]).fill(_this.getTableNameColor(_this.tableInfo));
				}
				
			}
		});
		// this.tableNameText = this.draw.text(function(t) {t.tspan(tableInfo["TABLE_NM"]+"/"+tableInfo["ENTITY_NM"]+" [" + tableInfo["TABL_SCD_NM"] +"]").fill(_this.getTableNameColor(_this.tableInfo)).dx(2).dy(2)} ); // _this.getTableNameColor(_this.tableInfo)
	
		// 삭제건은 취소선 처리.
		if(tableInfo["USE_YN"] == 'N') {
			this.tableNameText.attr({"text-decoration":"line-through"});
		}
			
		this.tableHeader.add(this.tableNameText);
		this.columsAroundRect.attr({rx: tableInfo["IS_SUB_TABLE"] == "Y" ? 5 : 0});
	}
	
	
	// 테이블 그리기.
	this.drawTable = function() {
		// console.log( this.tableInfo );
		var _this = this;
		var tableInfo = this.tableInfo;
		this.tableGrp = draw.group().addClass( "table_" +_this.subjectAreaInfo["SUBJECT_ID"]+"_"+ tableInfo["ENTITY_ID"] ).transform({
			translate: [tableInfo["X"], tableInfo["Y"]],
		}).remember("X", tableInfo["X"]).remember("Y", tableInfo["Y"]) ;
		
		_this.tableGrpTransform = { translateX : this.tableGrp.transform('translateX') , translateY : this.tableGrp.transform('translateY') };
		
		// 테이블 명 영역
		this.tableHeader = this.draw.group().addClass("header").addClass("header_" + tableInfo["ENTITY_ID"]).transform({translate: [0, 0]}); // [3, 2]
		this.tableGrp.add(this.tableHeader);
		
		this.rectHeader = this.draw.rect( this.getTableWidth(tableInfo) , this.CONSTANT.HEADER_HIGHT).attr({"fill": tableInfo["TABLE_BACKGROUND_COLOR"]||"#FFFFFF"}); // 0099FF
		
		//테이블 명
		var tableFullNm = ""; // tableInfo["TABLE_NM"]+"/"+tableInfo["ENTITY_NM"]+" [" + tableInfo["TABL_SCD_NM"] +"]";

		if( Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue() == 'LOGICAL' ) {
			tableFullNm = (!tableInfo["DML_TCD"] ? "" : tableInfo["DML_TCD"]) + tableInfo["TABLE_NM"] + " [" + tableInfo["TABL_SCD_NM"] +"]";
		} else if( Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue() == 'PHYSICAL' )  {
			tableFullNm = (!tableInfo["DML_TCD"] ? "" : tableInfo["DML_TCD"]) + tableInfo["ENTITY_NM"] + " [" + tableInfo["TABL_SCD_NM"] +"]";
		} else {
			tableFullNm = (!tableInfo["DML_TCD"] ? "" : tableInfo["DML_TCD"]) + tableInfo["TABLE_NM"]+"/"+tableInfo["ENTITY_NM"] + " [" + tableInfo["TABL_SCD_NM"] +"]";
		}
		
		this.tableNameText = _this.draw.text(function(t) {
			for( var i=0; i<tableFullNm.length; i++) {
				if( i==0 ) {
					t.tspan(tableFullNm[i]).fill(_this.getTableNameColor(_this.tableInfo)).dx(2).dy(2);
				} else {
					t.tspan(tableFullNm[i]).fill(_this.getTableNameColor(_this.tableInfo));
				}
				
			}
		});
		// this.tableNameText = this.draw.text(function(t) {t.tspan(tableInfo["TABLE_NM"]+"/"+tableInfo["ENTITY_NM"]+" [" + tableInfo["TABL_SCD_NM"] +"]").fill(_this.getTableNameColor(_this.tableInfo)).dx(2).dy(2)} ); // _this.getTableNameColor(_this.tableInfo)

		// 테이블 삭제건은 취소선 처리.
		if(tableInfo["USE_YN"] == 'N') {
			this.tableNameText.attr({"text-decoration":"line-through", "text-decoration-color":"red"});
		}
		this.tableHeader.add(this.rectHeader);
		this.tableHeader.add(this.tableNameText);
		
		this.tableColumns = this.draw.group().addClass("columns");
		this.tableGrp.add(this.tableColumns);
		
		// 숨겨진 컬럼이 있을 경우.
		this.tableGroupHasHidden = this.draw.group().addClass("has-hidden").transform({translateY:_this.getTableHeight(_this.tableInfo)-4});
		this.tableGrp.add(this.tableGroupHasHidden);
		this.columnsHasHidden = _this.draw.rect(_this.getTableWidth(_this.tableInfo)-4, _this.CONSTANT.COLUMN_HIGHT ).opacity(0.0);
		this.tableGroupHasHidden.add(this.columnsHasHidden);
		this.columnsHasHiddenText = _this.draw.text('...').dy(0).dx(3);
		this.tableGroupHasHidden.add(this.columnsHasHiddenText);
		this.tableGroupHasHidden.hide();
		
		// 컬럼 감싸는 영역
		this.columsAroundRect = this.draw.rect(this.getTableWidth(tableInfo), this.getTableHeight(tableInfo)).addClass("rect_" +_this.subjectAreaInfo["SUBJECT_ID"]+"_"+ tableInfo["ENTITY_ID"])
			.attr({
				  stroke: _this.getTableLineColor(_this.tableInfo)
				, 'stroke-width': this.CONSTANT.STROKE_WIDTH
				, rx : tableInfo["IS_SUB_TABLE"] =="Y" ? 5 : 0
				, fill : this.getTableBackgroundColor(_this.tableInfo)
				, 'stroke-dasharray' : (tableInfo["ENTITY_TCD"] == "MVIEW" || tableInfo["ENTITY_TCD"] == "VIEW") ?  '5,5' : ""  
				//, fill: '#f06'
				//, 'fill-opacity': 0.5
			}).transform({
				translate: [0, 14], // [4, 12+4]
			}); // todo  .selectize()
		this.tableColumns.add(this.columsAroundRect);
		
		// 컬럼 그리기.
		this.drawColumns();
		
		this.tableGrp.draggable(false);
		// this.tableGrp.off('dragstart');
		
		this.tableGrp.mousedown(function(ev) {
			console.log("mousedown", ev.ctrlKey);
			_this.drawDataLoad.setSelectRectangular('table', ev);
		});

		this.tableGrp.mouseup(function(ev) {
			console.log("mouseup", ev.ctrlKey);
		});
		
		this.tableGrp.click(function(ev) {
			console.log("click", ev.ctrlKey);
			// console.log(_this.subjectAreaInfo["SUBJECT_ID"],  _this.tableInfo["ENTITY_ID"], ev );

			for( var i=1; _this.drawDataLoad.hasUserAuthOfModeler() && i<=3; i++ ) {
				Ext.getCmp("COLOR_BUTTON").items.items[i].setDisabled(false);
			}
			
			_this.drawDataLoad.setSelectedRelation(null, null);
		
			if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
				_this.relationByButtonBegin = true;
				_this.drawDataLoad.setRelationByButton( Ext.getCmp('DRAW_BUTTON').getValue(), _this.draw, _this.tableGrp, _this.subjectAreaInfo,  _this.tableInfo, ev  );
			} 
			// 1:1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
				_this.relationByButtonBegin = true;
				_this.drawDataLoad.setRelationByButton( Ext.getCmp('DRAW_BUTTON').getValue(), _this.draw, _this.tableGrp, _this.subjectAreaInfo,  _this.tableInfo, ev  );
			} 
			// 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
				_this.relationByButtonBegin = true;
				_this.drawDataLoad.setRelationByButton( Ext.getCmp('DRAW_BUTTON').getValue(), _this.draw, _this.tableGrp, _this.subjectAreaInfo,  _this.tableInfo, ev  );
			} 
		    // 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
				_this.relationByButtonBegin = true;
				_this.drawDataLoad.setRelationByButton( Ext.getCmp('DRAW_BUTTON').getValue(), _this.draw, _this.tableGrp, _this.subjectAreaInfo,  _this.tableInfo, ev  );
			}
			// 기타..
			else {
				_this.tableGrp.draggable(true);
		
				console.log(">>", _this.subjectAreaInfo["SUBJECT_ID"],  _this.tableInfo["ENTITY_ID"], ev.ctrlKey )

				_this.drawDataLoad.setSelectedTables( _this.subjectAreaInfo["SUBJECT_ID"],  _this.tableInfo["ENTITY_ID"], ev.ctrlKey );
			}
			
			_this.drawDataLoad.setSelectRectangular('init', ev);
			ev.stopPropagation();
		});
		
		// 마우스 이동..
		this.onmousemove = function(ev) {
			var scroll = { top : Ext.getCmp(_this.subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollTop() , left : Ext.getCmp(_this.subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollLeft()};
			var subject = _this.drawDataLoad.getSubjectArea( _this.subjectAreaInfo["SUBJECT_ID"]);
			
			if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
				_this.columsAroundRect.attr({'stroke-width':1.7})
				_this.tableGrp.attr({"cursor": "crosshair"});
				subject.phantomRelation1toN.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + subject.phantomRelation1toNPath ).attr({stroke: 'black'}).show().front();
			} 
			// 1:1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
				_this.columsAroundRect.attr({'stroke-width':1.7})
				_this.tableGrp.attr({"cursor": "crosshair"});
				subject.phantomRelation1to1.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + subject.phantomRelation1toNPath ).attr({stroke: 'black'}).show().front();
			} 
			// 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
				_this.columsAroundRect.attr({'stroke-width':1.7})
				_this.tableGrp.attr({"cursor": "crosshair"});
				subject.phantomRelation1to0_1.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + subject.phantomRelation1toNPath ).attr({stroke: 'black'}).show().front();
			} 
		  // 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
				_this.columsAroundRect.attr({'stroke-width':1.7});
				_this.tableGrp.attr({"cursor": "crosshair"});
				subject.phantomRelationNonIden.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + subject.phantomRelation1toNPath ).attr({stroke: 'black'}).show().front();
			} 
			else {
				if( _this.drawDataLoad.getCursorStatus() == null ) {
					if( _this.isSelected == true ) {
						_this.tableGrp.attr({"cursor": "move"});
					} else {
						_this.tableGrp.attr({"cursor": "default"});
					}
				}
			}
			if( _this.drawDataLoad.getSelectRectangular()["AREA_SELECT"] == false) {
				ev.stopPropagation();
			}
		}
		
		var onmouseout = function(ev) {
			if( _this.relationByButtonBegin == true )  {
				return;
			}
			if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
				_this.columsAroundRect.attr({'stroke-width':0.7})
			} 
			// 1:1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
				_this.columsAroundRect.attr({'stroke-width':0.7})
			} 
			// 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
				_this.columsAroundRect.attr({'stroke-width':0.7})
			} 
		  // 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
				_this.columsAroundRect.attr({'stroke-width':0.7})
			} 

		} 
		this.tableGrp.on('mousemove', this.onmousemove);
		this.tableGrp.on('mouseout', onmouseout);
			
		this.tableGrp.on("beforedrag", function(ev) {
			var elapsedMS = new Date().getTime() - _this.tableGrpPreClickDate.getTime(); 
				
			if( elapsedMS <= 400 ) {
				console.log("double click");
				ev.stopPropagation();
				_this.loadTableInfo(_this.tableInfo["ENTITY_ID"]);
				// Ext.getCmp('SELECTED-TABLE-DETAIL').collapse();
				Ext.getCmp('SELECTED-TABLE-DETAIL').expand();
				console.log( _this.tableInfo )
			} else {
				_this.tableGrpPreClickDate = new Date();
			}
			
		});
		
		this.tableGrp.on("mouseover", function(ev) {
			// 테이블 draggable
			if( erdAuth.isEditable()  ) {
                _this.tableGrp.attr("cursor", _this.isSelected ? "move" : "default");
            } else {
                _this.tableGrp.attr("cursor", "default");
            }
			
		});
		this.tableGrp.on("dragstart", function(ev) { 
			console.log("dragstart", ev.ctrlKey);
			_this.tableGrp.off("mousemove", this.onmousemove)
			_this.tableGrp.off("mouseout", onmouseout)
			_this.dragEvent = "dragstart";
			_this.tableGrp.front();
			for( var point in _this.pointsList ) {
				_this.tableResizerCircleList[point].front();
			}
			
			console.log(_this.relationStart)
			for( var i=0; i<_this.relationStart.length ; i++ ) {
				console.log(_this.relationStart[i])
				_this.relationStart[i].front();
			}
			for( var i=0; i<_this.relationEnd.length ; i++ ) {
				_this.relationEnd[i].front();
			}
			
			_this.drawDataLoad.setSelectedTables( _this.subjectAreaInfo["SUBJECT_ID"],  _this.tableInfo["ENTITY_ID"], ev.detail.event.ctrlKey );
			
			// 이 테이블을 시작으로 하는 관계의 path수정
			for( var i=0; i<_this.relationStart.length ; i++ ) {
				var path = _this.drawDataLoad.getRelationPath( _this.subjectAreaInfo["SUBJECT_ID"] , _this.relationStart[i].relationInfo["RELATION_ID"]);
				// console.log("dragstart-start",  _this.relationStart[i].relationInfo["RELATION_ID"], path, path.length );
				
				_this.relationStart[i].log();
				
				_this.relationStart[i].removeMover();
				if( path && path.length > 3 ) {
					// _this.relationStart[i].setPathRelation(path);
				}
			}
			// 이 테이블을 종료로 하는 관계의 path수정
			for( var i=0; i<_this.relationEnd.length ; i++ ) {
				var path = _this.drawDataLoad.getRelationPath( _this.subjectAreaInfo["SUBJECT_ID"] , _this.relationEnd[i].relationInfo["RELATION_ID"]);
				
				// console.log("dragstart-end",  _this.relationEnd[i].relationInfo["RELATION_ID"], path );
				_this.relationEnd[i].removeMover();
				if( path && path.length > 3 ) {
					//_this.relationEnd[i].setPathRelation(path);
				}
			}
			
			// resizer 보이기
			_this.showResizer();
			// 다른테이블의 resizer 숨기기
			// _this.hideResizerOtherTable();
			

		});
		
		this.tableGrp.on("dragmove", function(ev) { 
			
			console.log( "dragmove" )
			_this.dragEvent = "dragmove";
			_this.tableGrpClickCount = 0;
			// resizer 위치 조정..
			_this.relocateResizerPointCoordsTableGroup(ev); 
			
			// console.log( _this.tableGrp.transform('translateX') , '|', _this.tableGrpTransform.translateX , '|',  _this.tableGrp.transform('translateY') , '|',  _this.tableGrpTransform.translateY);
			
			var trans = { x : _this.tableGrp.transform('translateX') - _this.tableGrpTransform.translateX, y : _this.tableGrp.transform('translateY')-_this.tableGrpTransform.translateY };
			var scroll = { top : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollTop() , left : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollLeft()};
			var region = { height : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getRegion().height, width : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getRegion().width};
			var tableGrpBox = { 
					left : Math.ceil(_this.tableGrp.transform().translateX)
				, top : Math.ceil(_this.tableGrp.transform().translateY)
				, right : Math.ceil(_this.tableGrp.transform().translateX + _this.columsAroundRect.width())
				, bottom : Math.ceil(_this.tableGrp.transform().translateY + _this.columsAroundRect.height()) + 15
				};
				
			//console.log( tableGrpBox )
			//console.log( scroll )
			//console.log( region  )
			//console.log( region.width + scroll.left , region.height + scroll.top  )
			
			/* 화면 스크롤. 안됨..
			if( region.width + scroll.left < tableGrpBox.right ) {
				Ext.get(_this.tableInfo["SUBJECT_ID"]).scrollTo('left', tableGrpBox.right - (region.width + scroll.left), true);
			}
			if( region.height + scroll.top  < tableGrpBox.bottom ) {
				Ext.get(_this.tableInfo["SUBJECT_ID"]).scrollTo('top', tableGrpBox.bottom - (region.height + scroll.top) , true);
			}
			*/
			
			for( var i=0; i<_this.relationStart.length ; i++ ) {
				//_this.relationStart[i].redrawRelationOfStart(trans);
				_this.relationStart[i].drawRelation('table_move');
			}
			
			for( var i=0; i<_this.relationEnd.length ; i++ ) {
				//_this.relationEnd[i].redrawRelationOfEnd(trans);
				_this.relationEnd[i].drawRelation('table_move');
			}

			function moveSelectedTable( _trans ) {
				_this.drawDataLoad.selectTables["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
					if( entity_id != _this.tableInfo["ENTITY_ID"]) {
						var table = _this.drawDataLoad.getDrawedTable(_this.tableInfo["SUBJECT_ID"], entity_id);
						var baseX = table.tableGrpTransform.translateX;
						var baseY = table.tableGrpTransform.translateY;
						table.tableGrp.transform({ translateX : baseX+_trans.x, translateY : baseY+_trans.y });
						
						table.relocateResizerPointCoordsTableGroup(ev); 
						for( var i=0; i<table.relationStart.length ; i++ ) {
							//_this.relationStart[i].redrawRelationOfStart(trans);
							table.relationStart[i].drawRelation('table_move');
						}
						
						for( var i=0; i<table.relationEnd.length ; i++ ) {
							//_this.relationEnd[i].redrawRelationOfEnd(trans);
							table.relationEnd[i].drawRelation('table_move');
						}
					}
				});
			}
			moveSelectedTable(trans);
		});
		
		this.tableGrp.on("dragend", function(ev) { 
			console.log( "dragend" )
			var elapsedMS = new Date().getTime() - _this.tableGrpPreClickDate.getTime(); 
				
			if( elapsedMS <= 400 ) {
				console.log( "dragend end - ", elapsedMS )
				return ;
			}
			_this.dragEvent = "";
			_this.tableGrp.on('mousemove', _this.onmousemove);
			_this.tableGrpClickCount += 1;
			
			_this.tableGrp.transform({translateX:Math.ceil(_this.tableGrp.transform('translateX')), translateY : Math.ceil(_this.tableGrp.transform('translateY'))});
			// 테이블 위치 이동 저장.
			_this.drawDataLoad.setTableTranslate( _this.subjectAreaInfo["SUBJECT_ID"] , _this.tableInfo["ENTITY_ID"], { x : _this.tableGrp.transform('translateX'), y : _this.tableGrp.transform('translateY')});

			// 이 테이블을 시작으로 하는 관계의 path수정
			for( var i=0; i<_this.relationStart.length ; i++ ) {
				//console.log("dragend-start ",  _this.relationStart[i].relationInfo["RELATION_ID"], _this.relationStart[i].getPathRelation() );
				//_this.drawDataLoad.setRelationPath( _this.subjectAreaInfo["SUBJECT_ID"] , _this.relationStart[i].relationInfo["RELATION_ID"], _this.relationStart[i].getPathRelation());
				_this.relationStart[i].drawRelation('table_move_dragend');
				_this.relationStart[i].drawMover();
			}
			// 이 테이블을 종료로 하는 관계의 path수정
			for( var i=0; i<_this.relationEnd.length ; i++ ) {
				//console.log("dragend-end", _this.relationEnd[i].relationInfo["RELATION_ID"], _this.relationEnd[i].getPathRelation());
				//_this.drawDataLoad.setRelationPath( _this.subjectAreaInfo["SUBJECT_ID"] , _this.relationEnd[i].relationInfo["RELATION_ID"], _this.relationEnd[i].getPathRelation());
				_this.relationEnd[i].drawRelation('table_move_dragend');
				_this.relationEnd[i].drawMover();
			}
			_this.tableGrpTransform = { translateX : _this.tableGrp.transform('translateX') , translateY : _this.tableGrp.transform('translateY') };
			
			_this.drawDataLoad.setTableInfo( _this.subjectAreaInfo["SUBJECT_ID"] , _this.tableInfo["ENTITY_ID"], _this.tableGrp, _this.columsAroundRect );

			// DB저장
			_this.drawDataLoad.updateTableInfo("move", {"SUBJECT_ID": _this.tableInfo["SUBJECT_ID"], "ENTITY_ID" : _this.tableInfo["ENTITY_ID"], "X" : _this.tableGrp.transform('translateX'), "Y" : _this.tableGrp.transform('translateY') } );

			function endSelectedTable( ) {
				_this.drawDataLoad.selectTables["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
					if( entity_id != _this.tableInfo["ENTITY_ID"]) {
						var table = _this.drawDataLoad.getDrawedTable(_this.tableInfo["SUBJECT_ID"], entity_id);
						table.tableGrpTransform = { translateX : table.tableGrp.transform('translateX') , translateY : table.tableGrp.transform('translateY') };

						
						// DB저장
						_this.drawDataLoad.updateTableInfo("move", {"SUBJECT_ID": _this.tableInfo["SUBJECT_ID"], "ENTITY_ID" : entity_id, "X" : table.tableGrp.transform('translateX'), "Y" : table.tableGrp.transform('translateY') } );

					}
				});
			}
			endSelectedTable();
			
			// 테이블 draggable
			_this.tableGrp.attr("cursor", _this.isSelected ? "move" : "pointer");
			_this.drawDataLoad.setSelectRectangular('init', ev);
			_this.tableGrp.draggable(false);

			$( "#minimap-"+_this.subjectAreaInfo["SUBJECT_ID"] ).html('');
			$( "#minimap-"+_this.subjectAreaInfo["SUBJECT_ID"] ).minimap( $("#"+_this.subjectAreaInfo["SUBJECT_ID"]) );

		});
		
		// 사이즈 조절용 circle생성.
		this.drawResizer(_this.tableInfo);
	}
	
	this.loadTableInfo = function(entity_id, isForceLoad) {
		ErdDrawFunction.loadTableInfo(entity_id, isForceLoad);
	}
	this.getTableGrp = function() {
		
		return this.tableGrp;
	}
	
	this.addRelationStart = function(DrawRelation) {
		
		this.relationStart.push(DrawRelation);
		
		// console.log( this.tableInfo["ENTITY_ID"], this.relationStart );
	}
	
	this.addRelationEnd = function(DrawRelation) {
		
		this.relationEnd.push(DrawRelation);
		
		// console.log( this.tableInfo["ENTITY_ID"], this.relationEnd );
	}
	
	/**
	 * 관계된 테이블 목록 조회ㅣ
	 */
	this.getRelations = function() {
		var _this = this;
		return this.drawDataLoad.getTableRelations(_this.subjectAreaInfo["SUBJECT_ID"], _this.tableInfo["ENTITY_ID"]);
	}
	
	/**
	 * 컬럼 및 pk라인을 다시 그린다.
	 * 
	 */
	this.redrawColumns = function() {
		var _this = this;
		
		// 컬럼 삭제.
		for( var i=0; i<_this.tableColumnDataList.length; i++) {
			_this.tableColumnDataList[i].remove();
		}
		console.log( _this.pkLine );
		if( _this.pkLine ) {
    		// pk라인 삭제
    		_this.pkLine.remove();
		}
		// 컬럼 그리기
		_this.drawColumns()
	}
	/*
	 * 컬럼 그리기.
	 */
	this.drawColumns = function() {
		var _this = this;
		// pk가 없을 경우
		var colIdx = 0;
		var pkLineGap = 0;
		var pkGap = 3;
		console.log( _this.tableInfo );
		if( !_this.tableInfo["HAS_PK"] ) {
			_this.drawPkLine(colIdx);
			colIdx +=2;
			pkLineGap = 8;
			pkGap = 0;
		}

		// 컬럼
		var columns = _this.drawDataLoad.getTableColumns(_this.tableInfo['ENTITY_ID']);
		
		var columnName = null, columnType = null, maxColumnLength = 0;
		_this.tableColumnDataList = new Array();

		var isLgcDsply = Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue()==null||Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue().indexOf("LOGICAL")>=0 ;
		var isPscDsply = Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue()==null||Ext.getCmp('LOGICAL_PHYSICAL_VIEW_BUTTON').getValue().indexOf("PHYSICAL")>=0 ;
		
		// 컬럼 명 추가..
		for( var idxCol=0 ;idxCol<columns.length;idxCol++) {
			var columnInfo = columns[idxCol];

			_this.tableColumnDataList[idxCol] = _this.draw.group().addClass("column").transform({
										translate: [_this.CONSTANT.PAD_TEXT_LEFT, pkGap + pkLineGap+(colIdx+(!_this.tableInfo["HAS_PK"] ? 0 : 1))* this.CONSTANT.COLUMN_HIGHT],
									});

			if( _this.tableColumnDataList[idxCol].transform().translateY + _this.CONSTANT.COLUMN_HIGHT > this.columsAroundRect.height() - _this.CONSTANT.HEADER_HIGHT_HIGHT) {
				_this.tableColumnDataList[idxCol].hide();
			}
			
			_this.columnRectList[idxCol] = _this.draw.rect(_this.getTableWidth(_this.tableInfo)-4, _this.CONSTANT.COLUMN_HIGHT ).opacity(0.0);

			if( isLgcDsply == true ) {
				// 논리 컬럼명
				var attrNm = ""; // columnInfo["CUD_TYPE"] + columnInfo["ATTRIBUTE_NM"] + (columnInfo["FK_YN"]=="Y" ? "(FK)" : "" );

				if( columnInfo["DATA_TYPE"] == "COMMENT") {
					attrNm = "<< "+ columns[idxCol]["COLUMN_NM"] +" >>";
				} else {
					attrNm = columnInfo["CUD_TYPE"] +  columnInfo["ATTRIBUTE_NM"] + (columnInfo["FK_YN"]=="Y" ? "(FK)" : "" );
				}
				columnName = _this.draw.text(function(t) {
					for( var i=0; i<attrNm.length; i++) {
						t.tspan(attrNm[i]).fill('#' + columnInfo["COLOR"]);
					}
				});
				
				// columnName = _this.draw.text(function(t) {t.tspan(columnInfo["ATTRIBUTE_NM"] + (columnInfo["FK_YN"]=="Y" ? "(FK)" : "" )).fill('#' + columnInfo["COLOR"]).dy(0)} );
			} else {
				columnName = _this.draw.text('');
			}
			
			// 삭제건은 취소선 처리.
			if(columnInfo["USE_YN"] == 'N' && columnInfo["PK_YN"] == "Y") {
			     columnName.attr({"text-decoration":"line-through", "text-decoration-color":"red"});
			}
			
			if( columnInfo["DATA_TYPE"] != "COMMENT") {
				maxColumnLength = Math.max( Math.ceil(maxColumnLength),  Math.ceil(columnName.bbox().w)-5 );
			}
			_this.tableColumnDataList[idxCol].add(_this.columnRectList[idxCol]);
			_this.tableColumnDataList[idxCol].add(columnName);
			colIdx++;
			
			// 마지막 pk일 경우
			if( columnInfo["IS_LAST_PK_YN"] == "Y" ) {
				_this.drawPkLine(colIdx);
				if( this.tableInfo["ENTITY_TCD"] != "VIEW") {
                    pkLineGap = 2;
                } else {
                    pkLineGap = 0;
                }
				
			}
		}

		// DATA_TYPE 추가
		var maxLen =  0;
		
		for( var idxCol=0 ;idxCol<columns.length;idxCol++) {
			// console.log( columns[idxCol]["COLUMN_NM"], columns[idxCol]["DATA_TYPE"] );
			if( columns[idxCol]["DATA_TYPE"] == "COMMENT") {
				continue;
			}
			maxLen = Math.max(maxLen, columns[idxCol]["COLUMN_NM"].length+ (isLgcDsply==false ? 7 : 3));
		}

		var padding_x = 0;
		var padding_width = 0;
		var paddingArr = new Array();
		
		// 물리 컬럼명
		if(isPscDsply == true) {
			for( var idxCol=0 ;idxCol<columns.length;idxCol++) {
				var columnInfo = columns[idxCol];
				paddingArr[idxCol] = 0;
				var textMaxLen = maxLen;
				var columnNm = "";
				if( columnInfo["DATA_TYPE"] == "COMMENT") {
					if( isLgcDsply ) {
						 columnNm = "";
					} else {
						columnNm = "<< "+ columns[idxCol]["COLUMN_NM"] +" >>";
						textMaxLen = columnNm.length;
					}
				} else {
					columnNm = (isLgcDsply==false ? columnInfo["CUD_TYPE"] : "") + columns[idxCol]["COLUMN_NM"]+((columnInfo["FK_YN"]=="Y"&&isLgcDsply==false) ? "(FK)" : "");
				}
				columnType = _this.draw.text(function(t) {
					var tspan = null;
					var txt = " "
					for( var i=0; i<textMaxLen; i++ ) {
						if( i > columnNm.length-1) {
							txt = "";
						} else {
							txt = columnNm[i];
						}
						if( i==0 ) {
							tspan = t.tspan(txt).fill('#' + columnInfo["COLOR"]).dx( maxColumnLength + (isLgcDsply?5:0)).dy(0);
						} else {
							tspan = t.tspan(txt).fill('#' + columnInfo["COLOR"]);
						}
						if( columnInfo["DATA_TYPE"] != "COMMENT") {
							padding_x = Math.max( padding_x, tspan.bbox().x + tspan.bbox().width );
							padding_width = Math.max( padding_width, tspan.bbox().width );
							paddingArr[idxCol] = Math.max(paddingArr[idxCol], tspan.bbox().x+ tspan.bbox().width );
						}
					}
				});
				// 삭제건은 취소선 처리.
				if(columnInfo["USE_YN"] == 'N') {
					// columnType.attr({"text-decoration":"line-through", "text-decoration-color":"red"});
				}
				_this.tableColumnDataList[idxCol].add(columnType);
			}
		} 
		
		if( padding_x == 0 ) {
			padding_x = maxColumnLength;
		} 
		for( var idxCol=0 ;idxCol<columns.length;idxCol++) {
			
			// console.log( padding_x, paddingArr[idxCol]);
			
			var columnInfo = columns[idxCol];
			var dataType = "";
			if( columnInfo["DATA_TYPE"] == "COMMENT") {
				dataType = "";
			} else {
				dataType = columnInfo["DATA_TYPE"];
			}
			columnType = _this.draw.text(function(t) {
				var tspan = null;
				var txt = " "
				
				for( var i=0; dataType && i<dataType.length; i++ ) {
					if( i==0 ) {
						tspan = t.tspan(dataType[i]).dx( padding_x ).dy(0);
					} else {
						tspan = t.tspan(dataType[i]);
					}
				}
			} );
			_this.tableColumnDataList[idxCol].add(columnType);
		}
		
		// column 추가.(컬럼명 + 데이터타입)
		for( var idxCol=0;idxCol<_this.tableColumnDataList.length; idxCol++ ) {
			_this.tableColumns.add(_this.tableColumnDataList[idxCol]);
		}
		
		_this.setColumnVisible();
	}
	
	/*
	 * 수직 resize시 컬럼 숨기기
	 */
	this.setColumnVisible = function() {
		var _this = this;
		
		// 테이블 명 보이기 조정하기..
		var titleList = _this.tableNameText.find('tspan');
		for( var t=titleList.length-1; t>=1; t-- ) {
			titleList[t].show();
		}

		// 숨겨진 컬럼보여주는 group;
		this.tableGroupHasHidden.transform({translateY:_this.columsAroundRect.height()-4});

		for( var t=titleList.length-1; t>=1; t-- ) {
			// console.log(idxCol, t, tspanList[t].node.textContent, tspanList[t].bbox().x, _this.columsAroundRect.width()-8)
			if( titleList[t].bbox().x > _this.columsAroundRect.width()- 10 ) {
				titleList[t].hide();
			} else {
				titleList[t].show();
			}
		}
			
		var columns = _this.drawDataLoad.getTableColumns(_this.tableInfo['ENTITY_ID']);
		for( var idxCol=0 ;idxCol<columns.length;idxCol++) {
			_this.columnRectList[idxCol].width(_this.columsAroundRect.width()-4);

			if( _this.tableColumnDataList[idxCol].transform().translateY > _this.columsAroundRect.height() ) {
				_this.tableColumnDataList[idxCol].hide();
				_this.tableGroupHasHidden.show();
			} else {
				_this.tableColumnDataList[idxCol].show();
				_this.tableGroupHasHidden.hide();
			}
			
			var tspanList = _this.tableColumnDataList[idxCol].find('tspan');
			for( var t=tspanList.length-1; t>=1; t-- ) {
				tspanList[t].show();
			}
			for( var t=tspanList.length-1; t>=1; t-- ) {
				// console.log(idxCol, t, tspanList[t].node.textContent, tspanList[t].bbox().x, _this.columsAroundRect.width()-8)
				if( tspanList[t].bbox().x > _this.columsAroundRect.width()- 10 ) {
					tspanList[t].hide();
				} else {
					tspanList[t].show();
				}
			}
		}
	}
	
	/* 
	 * pk구분선 그리기.
	 */
	this.drawPkLine = function( colIdx ) {
		var _this = this;
		if( this.tableInfo["ENTITY_TCD"] != "VIEW") {
    		if( colIdx == 0 ) {
    			this.pkLine = this.draw.path('M 0 '+ 28+' H'+(this.getTableWidth(_this.tableInfo))).attr({ 'stroke-width':this.CONSTANT.STROKE_WIDTH , stroke: this.getTableLineColor(_this.tableInfo)});
    		} else {
    			this.pkLine = this.draw.path('M 0 '+ (28+((colIdx-1)*12))+' H'+(this.getTableWidth(_this.tableInfo))).attr({'stroke-width':this.CONSTANT.STROKE_WIDTH , stroke: this.getTableLineColor(_this.tableInfo)});
    		}
        }
        
		if( this.tableInfo["ENTITY_TCD"] == "MVIEW") {
            this.pkLine.attr({
                'stroke-dasharray' : '5,5',
            })
        } 
		// console.log("this.pkLine", this.tableInfo , this.pkLine);
		this.tableColumns.add(this.pkLine);
	}
	
	/*
	 * PK를 구분하는 선을 
	 */
	this.redrawPkLine = function(width) {
        if( this.tableInfo["ENTITY_TCD"] != "VIEW") {
    		var pathArr = this.pkLine.array();
    		var path = pathArr[0][0]+ pathArr[0][1] + " " + pathArr[0][2] + " H "+ width;
    		this.pkLine.plot(path);
    	}
	}
	
	/*
	 *테이블 width조회
	 */ 
	this.getTableWidth = function(tableInfo) {
		return (tableInfo["WIDTH"] ? tableInfo["WIDTH"]  : this.TABLE_INFO["width"] );
	}
	
	/*
	 *테이블 height조회
	 */ 
	this.getTableHeight = function(tableInfo) {
		return (tableInfo["HEIGHT"] ? tableInfo["HEIGHT"]  : this.TABLE_INFO["height"] );
	}
	
	this.getTableLineColor = function(tableInfo) {
		return tableInfo["LINE_COLOR"] ? tableInfo["LINE_COLOR"] : "black";
	}
	
	this.getTableNameColor = function( tableInfo ) {
		return tableInfo["COLOR"] ? tableInfo["COLOR"] : "BLACK";  // white
	}

	this.getTableBackgroundColor = function( tableInfo ) {
		return tableInfo["BACKGROUND_COLOR"] ? tableInfo["BACKGROUND_COLOR"] : "white";
	}
	
	this.toggleResizer = function() {
		var _this = this;
		
		if( _this.isSelected == true ) {
			_this.hideResizer();
		} else {
			_this.showResizer();
		}
		
		_this.isSelected = !_this.isSelected;
	}
	
	this.showResizer = function() {
		var _this = this;
		
		for( var point in _this.pointsList ) {
			_this.tableResizerCircleList[point].show();
		}
		_this.isSelected = true;
	}

	this.hideResizer = function() {
		var _this = this;
		for( var point in _this.pointsList ) {
			_this.tableResizerCircleList[point].hide();
		}
		_this.isSelected = false;
	}
	
	/**
	 * 다른 테이블의 resizer숨기기
	 */
	this.hideResizerOtherTable = function() {
		var _this = this;
		for(var x in _this.drawDataLoad.getDrawedTable( _this.subjectAreaInfo["SUBJECT_ID"])) {
			if( x != _this.tableInfo["ENTITY_ID"] ) {
				_this.drawDataLoad.getDrawedTable( _this.subjectAreaInfo["SUBJECT_ID"], x).hideResizer();
			}
		}
	}


	/*
	 *resizer 그리기..
	 */ 
	this.drawResizer = function(tableInfo) {
		var _this = this;
		
		// resizer 그룹
		/*
		this.tableResizer = this.draw.group().addClass("resizer").addClass("resizer_"+tableInfo["ENTITY_NM"]).transform({
					translate: [tableInfo["x"], tableInfo["y"]],
				});
		*/
		
		
		// resizer (상->하, 좌->우)
		for( var point in this.pointsList ) {
			
			this.tableResizerCircleList[point] = this.draw.circle(this.CONSTANT.POINT_RADIUS).fill('#f06').addClass("resizer_"+_this.tableInfo["ENTITY_ID"]).addClass(point)// .move(coord.x, coord.y)
											.attr("cursor", this.pointsList[point][2]).remember('cursor', this.pointsList[point][2]).remember('position', point)
											.draggableResizer(true, this.pointsList[point][3], _this.tableInfo);
			
			this.locateResizer( this.tableResizerCircleList[point], point );
			
			// resizer 드래그 시작
			this.tableResizerCircleList[point].on("dragstart", function(ev) {
				_this.tableGrp.off('mousemove', this.onmousemove);
				_this.drawDataLoad.setCursorStatus( ev.target.instance.remember('cursor') );
			});
			
			// resizer 드래그
			this.tableResizerCircleList[point].on("dragmove", function(ev) { 
				_this.redrawTableGroup(ev);
			});
			
			// resizer 드래그 종료
			this.tableResizerCircleList[point].on("dragend", function(ev) { 
				_this.drawDataLoad.setTableInfo( _this.subjectAreaInfo["SUBJECT_ID"] , _this.tableInfo["ENTITY_ID"], _this.tableGrp, _this.columsAroundRect );
				_this.tableGrp.on('mousemove', _this.onmousemove);
				_this.draw.attr({"cursor": "default"});
				_this.drawDataLoad.setCursorStatus(null);
				_this.tableInfo["X"] = _this.tableGrp.transform('translateX');
				_this.tableInfo["Y"] = _this.tableGrp.transform('translateY');
				_this.tableInfo["WIDTH"] = _this.columsAroundRect.width();
				_this.tableInfo["HEIGHT"] = _this.columsAroundRect.height();

				// DB저장
				_this.drawDataLoad.updateTableInfo(point, {"SUBJECT_ID": _this.tableInfo["SUBJECT_ID"], "ENTITY_ID" : _this.tableInfo["ENTITY_ID"], "X" : _this.tableInfo["X"], "Y" : _this.tableInfo["Y"], "WIDTH" : _this.tableInfo["WIDTH"], "HEIGHT" : _this.tableInfo["HEIGHT"] }  );

				for( var i=0; i<_this.relationStart.length ; i++ ) {
					//_this.relationStart[i].redrawRelationOfStart(trans);
					_this.relationStart[i].drawRelation('resizer_move_dragend');
				}
				
				for( var i=0; i<_this.relationEnd.length ; i++ ) {
					//_this.relationEnd[i].redrawRelationOfEnd(trans);
					_this.relationEnd[i].drawRelation('resizer_move_dragend');
				}
		
				$( "#minimap_"+_this.subjectAreaInfo["SUBJECT_ID"] ).html('');
				$( "#minimap_"+_this.subjectAreaInfo["SUBJECT_ID"] ).minimap( $("#"+_this.subjectAreaInfo["SUBJECT_ID"]) );
			});
		}
		
		_this.hideResizer();
	}

	this.locateResizer = function( circle , point ) {
		var coord = this.resizerPointCoords( point, this.columsAroundRect.bbox() );
		this.tableResizerCircleList[point].move(coord.x, coord.y);
	}
	
	
	this.resizerPointCoord = function (setting, object, isPointCentered) {
		var coord = typeof setting !== 'string' ? setting : object[setting];
		return isPointCentered ? coord / 2 : coord
	}
	
	/**
	* resizer의 위치 계산
	*/
	this.resizerPointCoords = function (point, object) {
		var settings = this.pointsList[point];
		var gx = this.tableGrp.transform('translateX');
		var gy = this.tableGrp.transform('translateY');
		
		return {
			x: gx+this.resizerPointCoord(settings[0], object, (point === 't' || point === 'b'))-(this.CONSTANT.POINT_RADIUS/2) ,
			y: gy+this.resizerPointCoord(settings[1], object, (point === 'r' || point === 'l')) + this.CONSTANT.HEADER_HIGHT_GAP+1.5
		}
	}


	this.tableGroupPosition = function(ev) {
		var _this = this;

		var tableGrpBox = ev.detail.box;
		
		var gx = _this.tableGrp.transform('translateX')+tableGrpBox.x; //-(_this.CONSTANT.POINT_RADIUS/2);
		var gy = _this.tableGrp.transform('translateY')+tableGrpBox.y;
		
		_this.tableInfo["X"] = gx;
		_this.tableInfo["y"] = gy;
		
		_this.tableGrp.transform({translateX:gx, translateY:gy});
		
		// console.log( _this.tableInfo["x"], _this.tableInfo["y"] );
		
		return {gx : gx, gy : gy};
	}
	/*
	Resizer 위치조정 (테이블 Drag시)
	*/
	this.relocateResizerPointCoordsTableGroup  = function (ev) {
		var _this = this;
		var circle = ev.target.instance;
		var tableGrpBox = ev.detail.box;
		
		var gap = {x : 0 , y : 0 };
		
		var tableGroupPos = _this.tableGroupPosition(ev);
		function tableGrpPointCoords(point, object) {
			var settings = _this.pointsList[point];
			var gx = tableGroupPos.gx; // _this.tableGrp.transform('translateX')+tableGrpBox.x-3;
			var gy = tableGroupPos.gy; // _this.tableGrp.transform('translateY')+tableGrpBox.y;
			
			return {
				x: gx+_this.resizerPointCoord(settings[0], object, (point === 't' || point === 'b')) -(_this.CONSTANT.POINT_RADIUS/2),
				y: gy+_this.resizerPointCoord(settings[1], object, (point === 'r' || point === 'l')) + _this.CONSTANT.HEADER_HIGHT_GAP+1.5
			}
		}
		
		for( var pos in _this.pointsList ) {
			if( circle.remember("position") == undefined || pos != circle.remember("position") ) {
				var coord = tableGrpPointCoords( pos, _this.columsAroundRect.bbox() );
				_this.tableResizerCircleList[pos].move(coord.x+gap.x, coord.y+gap.y);
			}
		}
	}
	
	
	/*
	Resizer 위치조정 (resizer Drag시)
	*/
	this.relocateResizerPointCoordsResier  = function (ev) {
		var _this = this;
		var circle = ev.target.instance;
		
		var gap = {x : 0 , y : 0 };
		
		
		for( var pos in _this.pointsList ) {
			if( pos != circle.remember("position") ) {
				var coord = _this.resizerPointCoords( pos, _this.columsAroundRect.bbox() );
				_this.tableResizerCircleList[pos].move(coord.x+gap.x , coord.y+gap.y);
			}
		}
	}
	/*
	 테이블 위치(x,y)와 폭,높이(w,h) 조정
	*/
	this.redrawTableGroup  = function (ev) {
		var _this = this;
		
		var el = ev.target.instance;
		var _resizer = ev.detail.box;
		var resizer = {x:Math.ceil(_resizer.x), y:Math.ceil(_resizer.y)};

		var gx = _this.tableInfo["X"]; // this.tableGrp.transform('translateX');
		var gy = _this.tableInfo["Y"]; // this.tableGrp.transform('translateY');
		
		var circle = ev.target.instance;
		var rectOriBox = { width : this.columsAroundRect.width(), height : this.columsAroundRect.height() };
		// console.log( this.columsAroundRect.x(), this.columsAroundRect.y(), this.columsAroundRect.width(), this.columsAroundRect.height() );
			console.log( circle.remember("position") )
		if( circle.remember("position") == "tl" ) { 
			if(  this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x < 50 || this.getTableHeight(tableInfo) + tableInfo["Y"] - resizer.y+this.CONSTANT.HEADER_HIGHT  < 50 ) {
				return;
			}
			_this.tableGrp.transform({translateX: resizer.x, translateY : resizer.y-this.CONSTANT.HEADER_HIGHT});
			_this.rectHeader.attr({width : this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x} );
			_this.columsAroundRect.size( this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x, this.getTableHeight(tableInfo) + tableInfo["Y"] - resizer.y+this.CONSTANT.HEADER_HIGHT) ;
			_this.redrawPkLine(this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x);
			

		} else if( circle.remember("position") == "t" ) { 
			if(  this.getTableHeight(tableInfo) + this.tableInfo["Y"] - resizer.y+this.CONSTANT.HEADER_HIGHT  < 50 ) {
				return;
			}
			_this.tableGrp.transform({translateX : gx, translateY : resizer.y -this.CONSTANT.HEADER_HIGHT});
			_this.columsAroundRect.height(this.getTableHeight(tableInfo) + gy- resizer.y+this.CONSTANT.HEADER_HIGHT);

		} else if( circle.remember("position") == "tr" ) { 
			if(  resizer.x - gx < 50 || this.getTableHeight(tableInfo) + tableInfo["Y"] - resizer.y+this.CONSTANT.HEADER_HIGHT  < 50 ) {
				return;
			}
			_this.tableGrp.transform({translateX : gx, translateY : resizer.y -this.CONSTANT.HEADER_HIGHT});
			_this.rectHeader.attr({width : resizer.x - gx} );
			_this.columsAroundRect.size( resizer.x - gx, this.getTableHeight(tableInfo) +gy - resizer.y +this.CONSTANT.HEADER_HIGHT);
			_this.redrawPkLine(resizer.x - gx);

		} else if( circle.remember("position") == "l" ) { 
			if( this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x  < 50 ) {
				return;
			}
			_this.tableGrp.transform({translateX : resizer.x, translateY : gy});
			_this.rectHeader.attr({width : this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x} );
			
			_this.columsAroundRect.attr({width : this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x} );
			_this.redrawPkLine(this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x);
		} else if( circle.remember("position") == "r" ) {
			if( resizer.x - gx < 50 ) {
				return;
			}
			_this.rectHeader.attr({width : resizer.x - gx} );
			
			_this.columsAroundRect.attr({width : resizer.x - gx} );
			_this.redrawPkLine(resizer.x - gx);
		} else if( circle.remember("position") == "bl" ) { 
			if( this.getTableWidth(tableInfo)+ tableInfo["X"]-resizer.x < 50 ) {
				return;
			}
			
			_this.tableGrp.transform({translateX : resizer.x, translateY : gy});
			_this.rectHeader.attr({width : this.getTableWidth(tableInfo)+ tableInfo["X"]-resizer.x} );
			_this.columsAroundRect.size( this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x, resizer.y-tableInfo["Y"]-this.CONSTANT.HEADER_HIGHT ) ;
			_this.redrawPkLine(this.getTableWidth(tableInfo)+tableInfo["X"]-resizer.x);
			
			
		} else if( circle.remember("position") == "b" ) { 
			if( resizer.y-gy-this.CONSTANT.HEADER_HIGHT < 50 ) {
				return;
			}
			_this.columsAroundRect.attr({height : resizer.y-gy-this.CONSTANT.HEADER_HIGHT});
			
			
		} else if( circle.remember("position") == "br" ) {
			if( resizer.x - gx < 50 ) {
				return;
			}
			_this.rectHeader.attr({width : resizer.x - gx} );
			_this.columsAroundRect.size( resizer.x - gx, resizer.y-gy-this.CONSTANT.HEADER_HIGHT ) ;
			_this.redrawPkLine(resizer.x - gx);
			
			
		}
		
		// 높이, 넓이 따라  컬럼 보기 조정.
		_this.setColumnVisible();
		// Resizer 위치조정
		this.relocateResizerPointCoordsResier(ev);

		for( var i=0; i<_this.relationStart.length ; i++ ) {
			//_this.relationStart[i].redrawRelationOfStart(trans);
			_this.relationStart[i].drawRelation('resizer_move');
		}
		
		for( var i=0; i<_this.relationEnd.length ; i++ ) {
			//_this.relationEnd[i].redrawRelationOfEnd(trans);
			_this.relationEnd[i].drawRelation('resizer_move');
		}

	}
	
	
	this.storeFinalTableGroupPosition  = function (ev) {
		var _this = this;
		_this.tableInfo["X"] = _this.tableGrp.transform('translateX');
		_this.tableInfo["Y"] = _this.tableGrp.transform('translateY');
		
		_this.tableInfo["WIDTH"] = _this.columsAroundRect.width();
		_this.tableInfo["HEIGHT"] = _this.columsAroundRect.height();
	}
			
	
	this.getTableRect = function(tableInfo) {
		return SVG('rect.'+"rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_" + tableInfo["entity_if"]);
	}
	

	this.remove = function() {
		this.tableGrp.remove();
		
		for( var point in this.pointsList ) {
			var _this = this;
			
			_this.tableResizerCircleList[point].remove();
		}
		
		for( var i=0; i<_this.relationStart.length ; i++ ) {
			_this.relationStart[i].remove();
		}
	}
	
	this.getTableBox = function() {
		var _this = this;
		
		return { 
				left : Math.floor(_this.tableGrp.transform().translateX)
			 , top : Math.floor(_this.tableGrp.transform().translateY)
			 , right : Math.floor(_this.tableGrp.transform().translateX + _this.columsAroundRect.width())
			 , bottom : Math.floor(_this.tableGrp.transform().translateY + _this.columsAroundRect.height()) + _this.CONSTANT.COLUMN_HIGHT
			 , cy : Math.round(_this.tableGrp.transform().translateY + _this.tableGrp.transform().translateY + _this.columsAroundRect.height() + _this.CONSTANT.COLUMN_HIGHT)/2
			 , cx : Math.round(_this.tableGrp.transform().translateX + _this.tableGrp.transform().translateX + _this.columsAroundRect.width())/2
		};
	}
	
	this.deleteTableRelation = function(start_entity_id, end_entity_id) {
		var _this = this;

		var idx1 = new Array();
		for( var i=0; i<_this.relationStart.length ; i++ ) {
			var relation = _this.relationStart[i];
			if( relation.relationInfo["START_ENTITY_ID"] == start_entity_id && relation.relationInfo["END_ENTITY_ID"] == end_entity_id ) {
				relation.relationInfo["PATHS"] = "";
				idx1.push(i);
			}
		}
		for( var i=idx1.length-1; i>=0; i-- ) {
			_this.relationStart.splice(idx1[i], 1);
		}
		
		var idx2 = new Array();
		for( var i=0; i<_this.relationEnd.length ; i++ ) {
			var relation = _this.relationEnd[i];
			if( relation.relationInfo["START_ENTITY_ID"] == start_entity_id && relation.relationInfo["END_ENTITY_ID"] == end_entity_id ) {
				relation.relationInfo["PATHS"] = "";
				idx2.push(i);
			}
		}
		for( var i=idx2.length-1; i>=0; i-- ) {
			_this.relationStart.splice(idx2[i], 1);
		}
		
	}
	
	this.deleteTable = function() {
		var _this = this;
		_this.tableGrp.remove();
		for( var point in _this.pointsList ) {
			_this.tableResizerCircleList[point].remove();
		}
		
		_this.drawDataLoad.selectTables["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
			if( entity_id == _this.tableInfo["ENTITY_ID"]) {
				var table = _this.drawDataLoad.getDrawedTable(_this.tableInfo["SUBJECT_ID"], entity_id);

				//var idx1 = new Array();
				for( var i=table.relationStart.length-1; i>=0 ; i-- ) {
					//_this.relationStart[i].redrawRelationOfStart(trans);
					
					var relation = table.relationStart[i];
					relation.deleteRelation();

					_this.drawDataLoad.getDrawedTable(relation.relationInfo["SUBJECT_ID"], relation.relationInfo["START_ENTITY_ID"]).deleteTableRelation(relation.relationInfo["START_ENTITY_ID"], relation.relationInfo["END_ENTITY_ID"]);
					_this.drawDataLoad.getDrawedTable(relation.relationInfo["SUBJECT_ID"], relation.relationInfo["END_ENTITY_ID"]).deleteTableRelation(relation.relationInfo["START_ENTITY_ID"], relation.relationInfo["END_ENTITY_ID"]);
					
					/*
					if( relation.relationInfo["SUBJECT_ID"] ==  _this.drawDataLoad.selectTables["SUBJECT_ID"] 
						&& relation.relationInfo["START_ENTITY_ID"] == entity_id ) {
						idx1.push(i);
						_this.drawDataLoad.getDrawedTable(relation.relationInfo["SUBJECT_ID"], relation.relationInfo["END_ENTITY_ID"]).deleteTableRelation(relation.relationInfo["START_ENTITY_ID"], relation.relationInfo["END_ENTITY_ID"]);
					}
					*/
				}
				/*
				for( var i=idx1.length-1; i>=0; i-- ) {
					table.relationStart.splice(idx1[i], 1);
				}
				*/

				//var idx2 = new Array();
				for( var i=table.relationEnd.length-1; i>=0 ; i-- ) {
					//_this.relationEnd[i].redrawRelationOfEnd(trans);
					var relation = table.relationEnd[i];
					relation.deleteRelation();

					_this.drawDataLoad.getDrawedTable(relation.relationInfo["SUBJECT_ID"], relation.relationInfo["START_ENTITY_ID"]).deleteTableRelation(relation.relationInfo["START_ENTITY_ID"], relation.relationInfo["END_ENTITY_ID"]);
					_this.drawDataLoad.getDrawedTable(relation.relationInfo["SUBJECT_ID"], relation.relationInfo["END_ENTITY_ID"]).deleteTableRelation(relation.relationInfo["START_ENTITY_ID"], relation.relationInfo["END_ENTITY_ID"]);

					/*
					if( relation.relationInfo["SUBJECT_ID"] ==  _this.drawDataLoad.selectTables["SUBJECT_ID"] 
						&& relation.relationInfo["END_ENTITY_ID"] == entity_id) {
						idx2.push(i);
						_this.drawDataLoad.getDrawedTable(relation.relationInfo["SUBJECT_ID"], relation.relationInfo["START_ENTITY_ID"]).deleteTableRelation(relation.relationInfo["START_ENTITY_ID"], relation.relationInfo["END_ENTITY_ID"]);
					}
					*/
				}
				/*
				for( var i=idx2.length-1; i>=0; i-- ) {
					table.relationEnd.splice(idx2[i], 1);
				}
				*/
			}
		});
		// _this.columsAroundRect.remove();
	}
	/*
	this.setTableLineColor = function(color) {
		var _this = this;
		_this.columsAroundRect.attr({stroke : '#'+color });
		_this.pkLine.attr({stroke : '#'+color });
		
		_this.drawDataLoad.setTableLineColor( _this.tableInfo["SUBJECT_ID"] ,  _this.tableInfo["ENTITY_ID"] , '#'+color);
	}

	this.setTableBackgroundColor = function(color) {
		var _this = this;
		_this.columsAroundRect.fill('#'+ color);
		
		_this.drawDataLoad.setTableBackgroundColor(_this.tableInfo["SUBJECT_ID"] , _this.tableInfo["ENTITY_ID"] , '#'+color);
	}
	
	this.setTableNameColor = function(color) {
		var _this = this;
		_this.tableNameText.findOne('tspan').fill('#'+color);
		_this.drawDataLoad.setTableNameColor(_this.tableInfo["SUBJECT_ID"] , _this.tableInfo["ENTITY_ID"] , '#'+color);
	}

	this.setTableNameBackgroundColor = function(color) {
		var _this = this;
		_this.rectHeader.attr({fill : "#"+color} );
		_this.drawDataLoad.setTableNameBackgroundColor(_this.tableInfo["SUBJECT_ID"] , _this.tableInfo["ENTITY_ID"] , '#'+color);
	}
	*/
}