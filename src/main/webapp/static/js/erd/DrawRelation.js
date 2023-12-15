var DrawRelation = function(draw, subjectAreaInfo, tableInfo, drawDataLoad, tableGrp, relationInfo ) {
	
	this.draw = draw;
	this.subjectAreaInfo = subjectAreaInfo;
	this.tableInfo = tableInfo;
	this.drawDataLoad = drawDataLoad;
	this.tableGrp = tableGrp;
	this.relationInfo = relationInfo;
	this.relationType = {pre : "" , now : ""}; //  r-|-l, r-l, r|-|l
	// this.tableGrpTransform = { translateX : this.tableGrp.transform('translateX') , translateY : this.tableGrp.transform('translateY') };

	this.CONSTANT = { PADDING : 12, LINE : 5,  CIRCLE_RADIUS : 2.5, MOVER : { WIDE : 20, NARROW : 8 }, CORRECT : 3 };  //  HEADER_HIGHT_GAP = HEADER_HIGHT - POINT_RADIUS/2
	
	this.relationPath = this.draw.path().attr({ 
					fill: 'none',
					stroke: relationInfo["COLOR"]||"#000" ,
					'stroke-width': 0.7,
					'stroke-dasharray' : (relationInfo["NON_IDEN_YN"] == "Y" || relationInfo["RECURSIVE"] == "Y") ? '10,10' : ""  
				});

	this.relationPathEnd = this.draw.path().attr({ 
					fill: 'none',
					stroke:  relationInfo["COLOR"]||"#000" ,
					'stroke-width': 0.7, 
				});
	
	this.relationPathOutlint = this.draw.path().attr({ 
					fill: 'none',
					stroke: '#00f', // '00f/fff'
					'stroke-width': this.CONSTANT.LINE*2,
				})
				.opacity(0.0) // 0.4
				;
				
	this.pathRelation = {};
	this.pathRelation['start'] = new Array();
	this.pathRelation['start_info'] = new Array();
	this.pathRelation['outline_start'] = new Array();
	this.pathRelation['paths'] = new Array();
	this.pathRelation['paths_relation_move'] = new Array();
	
	this.pathRelation['paths_redraw'] = new Array();
	this.pathRelation['path_idx'] = {index : 0};
	this.pathRelation['end'] = new Array();
	this.pathRelation['end_info'] = new Array();
	this.pathRelation['outline_end'] = new Array();
	
	this.moverDisplayMode = ""; // make or relocate
	this.moverBaseStart = { line : "l", x : 0, y : 0, idx : 0, direction : "", mx:0, my:0};
	this.moverBaseEnd = { line : "l", x : 0, y : 0, idx : 0, direction : "", mx:0, my:0};
	this.moverBase = {};
	// this.pathPrePost = { "pre" : "", "post" : "" };

	this.pathChanged = false;
	this.pathXY = new Array();
	
	this.pathMover = {};
	

	this.start = {position : "", x : 0, y : 0};
	this.start_init = {position : "", x : 0, y : 0};
	this.end = {position : "", x : 0, y : 0};

	this.trans = {x:0, y:0};
	this.gap = {x:0, y:0};
	
	this.pathList = new Array();

	
	this.initPath = function() {
		var _this = this;
		// 경로가 이미 지정된 경우
		if( this.relationInfo["PATHS"] && this.relationInfo["PATHS"].length > 0 ) {
			console.log("PATHS ",  _this.relationInfo["PATHS"] )
			
			var ps = this.relationInfo["PATHS"].split(' ');
			var paths = Array();
			for( var i=0;i<ps.length/3; i++ ) {
				paths.push(ps[i*3] +" "+ ps[(i*3)+1] +" "+ ps[(i*3)+2]);
			}
			this.pathRelation['paths'] = paths.slice();
		}else {
			this.pathRelation['paths'] = new Array();
		}
		
		this.drawMover();

		this.drawDataLoad.initMaker(this.draw);
	};
	
	/*
	 * 연결선 시작점을 이동한다.
	 */
	this.redrawRelationOfStart = function(trans) {
		var _this = this;
		
		var relationPathList = _this.getRelationPathArray();
		for( var i=0; i<relationPathList.length ; i++ ) {
			_this.pathMover[i].hide();
		}
		
		var starts = _this.pathRelation['start'][0].split(" ");
		_this.pathRelation['start'][0] = starts[0]+" " + (_this.start["x"]+trans.x)+" " + (_this.start["y"]+trans.y);
		_this.pathRelation['outline_start'][0] = starts[0]+" " + (_this.start["x"]+trans.x)+" " + (_this.start["y"]+trans.y);
		
		var pathRedraws = _this.pathRelation['paths_redraw'];
		
		var p = [];
		if( _this.relationType["now"] == "r-|-l" && relationPathList.length == 3) {
			p = pathRedraws[1].split(' ');
			_this.pathRelation['paths'][1] = p[0] + " " + p[1] + " " +(parseInt(p[2]) - trans.y);
			p = pathRedraws[2].split(' ');
			_this.pathRelation['paths'][2] = p[0] + " " + (parseInt(p[1]) - trans.x) + " " +parseInt(p[2]);
		}
		
		_this.plot(_this.pathRelation['paths']);

		// console.log( _this, _this.pathRelation['paths'] );

		// var relationPath = _this.getRelationPathArray();
		// _this.pathMover[0].transform({translateX:relationPath[0][1], translateY:relationPath[0][2]});
	}
	
	
	

	/*
	 * 관계의 마직막 테이블이 이동 할 경우.
	 */
	this.redrawRelationOfEnd  = function( trans ) {
		var _this = this;
		
		var relationPathList = _this.getRelationPathArray();
		for( var i=0; i<relationPathList.length ; i++ ) {
			_this.pathMover[i].hide();
		}
	
		var pathRedraws = _this.pathRelation['paths_redraw'];

		var p = [];
		if( _this.relationType["now"] == "r-|-l" && relationPathList.length == 3) {
			p = pathRedraws[1].split(' ');
			_this.pathRelation['paths'][1] = p[0] + " " + p[1] + " " +(parseInt(p[2]) + trans.y);
			p = pathRedraws[2].split(' ');
			_this.pathRelation['paths'][2] = p[0] + " " + (parseInt(p[1]) + trans.x) + " " +parseInt(p[2]);
		}
		_this.plot(_this.pathRelation['paths']);
	}
	/*
	this.getPathRelation = function() {
		return this.pathRelation['paths'];
	}

	this.setPathRelation = function( path ) {
		var _this = this;
		
		_this.caculateAbsoluteStartEndOfTable()
		
		if( typeof(path) == 'string') {
			var ps = path.split(' ');
			var paths = Array();
			for( var i=0;i<ps.length/3; i++ ) {
				paths.push(ps[i*3] +" "+ ps[(i*3)+1] +" "+ ps[(i*3)+2]);
			}
			_this.pathRelation['paths'] = paths.slice();
			_this.pathRelation['paths_redraw'] = paths.slice();
		} else {
			_this.pathRelation['paths'] = path.slice();
			_this.pathRelation['paths_redraw'] = path.slice();
		}
		
		_this.plot(_this.pathRelation['paths']);
	}
	*/
	/*
	 * 연결선 경로를 계산하여 그린다.
	 * draw_type : init, table_move, resizer_move
	 */
	this.drawRelation = function(draw_type, moverIdx) {
		var _this = this;
		// console.log( _this.relationInfo );
		
		//_this.pathRelation['start'] = new Array();
		//_this.pathRelation['outline_start'] = new Array();
	
		// _this.relationPath.clear();
		_this.caculatePath(draw_type, moverIdx);

		// 선을 update 
		_this.plot(_this.pathRelation['paths']);

		
		if( draw_type.indexOf("_dragend") > 0 && _this.relationInfo["PATHS"] != _this.pathRelation['paths'].join(' ')) {
			var param = { SUBJECT_ID : _this.relationInfo["SUBJECT_ID"], RELATION_ID : _this.relationInfo["RELATION_ID"], PATHS : _this.pathRelation['paths'].join(' ') }
			
			_this.relationInfo["PATHS"] = _this.pathRelation['paths'].join(' ');
			_this.drawDataLoad.updateRelationPath(draw_type, param);
		}
		console.log( draw_type, _this.relationInfo  );
		

		
		
		/* 
		// 테이블 이동시. 적용... 위의 "_dragend"로 통합.
		if( draw_type == 'table_move_dragend') {
			console.log( "table_move_dragend");
			_this.drawDataLoad.setRelationPathValue(  _this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"], _this.pathRelation['paths'] );
		}	
		*/	
	}

	/*
	 * 선을 update ( arguments : 연결선 )
	 */
	this.plot = function( paths ) {
		var _this = this;
		
		
		if( typeof( paths) == 'string') {
			this.relationPath.plot(_this.pathRelation['start'].join(' ') + ' ' + paths + ' ' + _this.pathRelation['outline_end'].join(' '));
			this.relationPathOutlint.plot(_this.pathRelation['outline_start'].join(' ') + ' ' + paths + ' ' + _this.pathRelation['outline_end'].join(' '));
			//console.log( _this.pathRelation['outline_start'].join(' ') + '/' + paths + '/' + _this.pathRelation['outline_end'].join(' '));
		} else {
		// console.log( _this.pathRelation['start'].join(' ') + ' ' + paths.join(' ') + ' ' + _this.pathRelation['end'].join(' ') );
		
			this.relationPath.plot(_this.pathRelation['start'].join(' ') + ' ' + paths.join(' ') + ' ' + _this.pathRelation['outline_end'].join(' '));
			this.relationPathOutlint.plot(_this.pathRelation['outline_start'].join(' ') + ' ' + paths.join(' ') + ' ' + _this.pathRelation['outline_end'].join(' '));
			//console.log( _this.pathRelation['outline_start'].join(' ') + '|' + paths.join(' ') + '|' + _this.pathRelation['outline_end'].join(' '));
		}

		// this.relationPath.marker('end', _this.drawDataLoad.getRelationMarker("end_b")) 
		
		var arrayAll = this.getRelationPathArrayAll();
		
		_this.relationPathEnd.plot( "M " + arrayAll[arrayAll.length-2][1]+" " + arrayAll[arrayAll.length-2][2] + " " + _this.pathRelation['end'].join(' '));
		
		var _array = this.relationPathOutlint.array();
		var _ends = _array[_array.length-1];
		_this.pathRelation['end_info'] = "l "+ _ends[1] + " "+ _ends[2];
	}
	
	/*
	 * 관계의 경로를 구한다..
	 */
	this.getRelationPathArrayAll= function() {
		return this.relationPathOutlint.array();
	}
	
	/*
	 * 관계의 경로를 구한다..
	 */
	this.getRelationPathArray = function() {
		var _this = this;
		var array = this.relationPathOutlint.array();
		
		// console.log( array );
		
		var pathList = new Array();
		var axis = "";
		var pathIdx = 0;
		
		// 첫번째 연결선
		if( array[0][1] == array[1][1] ) {
			axis = "x"
		} else if( array[0][2] == array[1][2] ) {
			axis = "y"
		} 
		pathList[pathIdx] = [ axis, array[0][1] -(_this.CONSTANT.MOVER.NARROW/2), array[0][2] -(_this.CONSTANT.MOVER.NARROW/2) ];
		pathIdx++;
		
		// console.log( array );
		// 중간 연결선
		for( var i=1; i<array.length-2;i++ ) {
			if( array[i][1] == array[i+1][1] && array[i][2] == array[i+1][2] ) {
				console.log(">>",  i, array[i] );
				continue;
			}
			if( axis == "y" && array[i][2] == array[i+1][2] ) {
				console.log("+>",  i, array[i] );
				continue;
			}
			else if( axis == "y" && array[i][2] != array[i+1][2] ) {
				if( i==array.length-3 && array[i][2] != array[i+2][2] ) {
					continue;
				}
				axis = "x";

				var val1 = array[i];
				var val2 = array[i+1];
					
				pathList[pathIdx] = [ axis, (val1[1]+val2[1])/2 -(_this.CONSTANT.MOVER.NARROW/2) , (val1[2]+val2[2])/2 -(_this.CONSTANT.MOVER.NARROW/2), i-1];
				pathIdx++;
			}
			else if( axis == "x" && array[i][1] == array[i+1][1] ) {
				console.log("#>",  i, array[i] );
				continue;
			} 
			else if( axis == "x" && array[i][1] != array[i+1][1] ) {
				if( i==array.length-3 && array[i][1] != array[i+2][1] ) {
					continue;
				}
				axis = "y";
				var val1 = array[i];
				var val2 = array[i+1];
				
				pathList[pathIdx] = [ axis, (val1[1]+val2[1])/2 -(_this.CONSTANT.MOVER.NARROW/2) , (val1[2]+val2[2])/2 -(_this.CONSTANT.MOVER.NARROW/2), i-1 ];
				pathIdx++;
			}
			console.log( pathIdx-1, pathList[pathIdx-1] );
		}

		// 마지막 연결선
		/*
		console.log( array[array.length-3], array[array.length-2] );
		if( array[array.length-3][1] == array[array.length-2][1] && array[array.length-3][2] == array[array.length-2][2] ) {
			axis = pathList[pathIdx-1][0];
			console.log( axis );
		}
		else if( array[array.length-3][1] == array[array.length-2][1] ) {
			axis = "y"
		} else if( array[array.length-3][2] == array[array.length-2][2] ) {
			axis = "x"
		} 
		*/
		if( _this.end["position"] == "t" || _this.end["position"] == "b" ) {
			axis = "x";
		} else if( _this.end["position"] == "l" || _this.end["position"] == "r" ) {
			axis = "y";
		}
		// console.log( axis );
		pathList[pathIdx] = [ axis, array[array.length-1][1] -(_this.CONSTANT.MOVER.NARROW/2), array[array.length-1][2] -(_this.CONSTANT.MOVER.NARROW/2) ];

			
		// console.log( pathList );
		
		_this.getRelationLineType();
	
		return pathList;
	}
	
	/*
	 * 관계선의 유형을 구한다..
	 */
	this.getRelationLineType = function() {
		var _this = this;
		var array = this.relationPathOutlint.array();
		
		var lineType ="", last = "" ;
		lineType+= _this.start['position'];
		last = ( _this.start['position'] == 't' || _this.start['position'] == 'b' ? "|" : "-");
		lineType+= last;
		
		
		for( var i=1; i<_this.pathRelation['paths'].length ; i++ ) {
			var p = _this.pathRelation['paths'][i].split(' ');
			console.log( i, p);
			if( p[1] == '0' && p[2] == '0' ) {
				if( last == "|" ) {
					last = "-";
				} else if( last == "-" ) {
					last = "|";
				}
			} else if( p[1] == '0' && p[2] != '0' ) {
				last = "|";
			} else if( p[1] != '0' && p[2] == '0' ) {
				last = "-";
			} else {
				console.error(i, _this.pathRelation['paths'][i] );
			}
			
			lineType+= last;
		}

		lineType+= _this.end['position'];
		
		// console.log( lineType );
		if( _this.relationType["now"] != lineType ) {
			_this.relationType["now"] = lineType;
		}
	}


	/*
	 * 경로계산.
	 * draw_type : init, table_move, resizer_move
	 */
	this.caculatePath = function(draw_type, moverIdx) {
		var _this = this;

		_this.caculateAbsoluteStartEndOfTable(draw_type, moverIdx);
		// console.log( _this.start, _this.end );

		// 경로의 변경 전 후 확인용..
		/*
		_this.pathPrePost["now"] = _this.start["position"] + _this.end["position"]
								+ ( Math.round(_this.start["x"]) == Math.round(_this.end["x"]) ? "=" :  (Math.round(_this.start["x"]) > Math.round(_this.end["x"]) ? "w" : "e")) 
								+ ( Math.round(_this.start["y"]) == Math.round(_this.end["y"]) ? "=" :  (Math.round(_this.start["y"]) > Math.round(_this.end["y"]) ? "s" : "n")) ;

		if( _this.pathPrePost["now"] != _this.pathPrePost["pre"] ) {
			_this.pathPrePost["pre"] = _this.pathPrePost["now"];
			
			for( var i in _this.pathMover ) {
				_this.pathMover[i].remove();
			}
			_this.pathMover = {};
			_this.pathChanged = true;
		}
		*/
		
		// 시작점 위치 정보 및 시작용 선그리기..
		_this.setPathForStart(draw_type);
		
		// 연결선..
		_this.setPathForLink(draw_type);
		
		// 종료점 위치 정보 및 종료용 선그리기..
		_this.setPathForEnd(draw_type);

	}

	/*
	 * mover를 삭제한다.
	 */
	this.removeMover = function(mover_index) {
		var _this = this;
		//console.log("-->", mover_index, _this.pathMover );
		for(var x in _this.pathMover ) {
			//console.log(">>>", x );
			if( mover_index == undefined || x != mover_index ) {
				//console.log("++>", _this.pathMover[x] );
				_this.pathMover[x].remove();
				delete _this.pathMover[x];
			}
		}
		
		//_this.moverBaseStart["line"] = "l";
		//_this.moverBaseStart["x"] = 0;
		//_this.moverBaseStart["y"] = 0;
		//_this.moverBaseStart["idx"] = 0;
		_this.moverBaseStart["direction"] = "";

		//_this.moverBaseEnd["line"] = "l";
		//_this.moverBaseEnd["x"] = 0;
		//_this.moverBaseEnd["y"] = 0;
		//_this.moverBaseEnd["idx"] = 0;
		_this.moverBaseEnd["direction"] = "";

		//_this.moverBaseStart= { line : "l", x : 0, y : 0, idx : 0, direction : ""}; // , mx:0, my:0
		//_this.moverBaseEnd = { line : "l", x : 0, y : 0, idx : 0, direction : ""}; //, mx:0, my:0

		// console.log( _this.moverBaseStart );
		//_this.pathMover = {};
	}

					
	/*
	 *mover를 숨긴다.
	 */
	this.hideMover = function(mover_index) {
		var _this = this;
		for(var x in _this.pathMover ) {
			if( x != mover_index ) {
				_this.pathMover[x].hide();
			}
		}
	}

	/*
	 * mover를 생성한다.
	 */
	this.drawMover = function() {
		var _this = this;
		_this.relationPathOutlint.click(function(ev) {

			// 상단 색상관련 버튼 disble처리.
			for( var i=1;_this.drawDataLoad.hasUserAuthOfModeler() && i<=3; i++ ) {
				Ext.getCmp("COLOR_BUTTON").items.items[i].setDisabled(true);
			}

			_this.drawDataLoad.setSelectedRelation( _this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"] );
			if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
				_this.drawDataLoad.changeRelationType(_this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"], Ext.getCmp('DRAW_BUTTON').getValue());
				_this.relationPath.attr({'stroke-dasharray' : ''});
				_this.relationInfo["RELATION_TYPE"] = Ext.getCmp('DRAW_BUTTON').getValue();
				_this.drawRelation('relation_change');
				_this.relationPathOutlint.attr({"cursor": "default"});
				Ext.getCmp('DRAW_BUTTON').setValue('pointer');
			} 
			// 1:1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
				_this.drawDataLoad.changeRelationType(_this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"], Ext.getCmp('DRAW_BUTTON').getValue());
				_this.relationPath.attr({'stroke-dasharray' : ''});
				_this.relationInfo["RELATION_TYPE"] = Ext.getCmp('DRAW_BUTTON').getValue();
				_this.drawRelation('relation_change');
				_this.relationPathOutlint.attr({"cursor": "default"});
				Ext.getCmp('DRAW_BUTTON').setValue('pointer');
			} 
			// 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
				_this.drawDataLoad.changeRelationType(_this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"], Ext.getCmp('DRAW_BUTTON').getValue());
				_this.relationPath.attr({'stroke-dasharray' : ''});
				_this.relationInfo["RELATION_TYPE"] = Ext.getCmp('DRAW_BUTTON').getValue();
				_this.drawRelation('relation_change');
				_this.relationPathOutlint.attr({"cursor": "default"});
				Ext.getCmp('DRAW_BUTTON').setValue('pointer');
			} 
			// 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
				_this.drawDataLoad.changeRelationType(_this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"], Ext.getCmp('DRAW_BUTTON').getValue())
				_this.relationPath.attr({'stroke-dasharray' : '12,12'});
				_this.relationInfo["RELATION_TYPE"] = "rel1toN";
				_this.drawRelation('relation_change');
				_this.relationPathOutlint.attr({"cursor": "default"});
				Ext.getCmp('DRAW_BUTTON').setValue('pointer');
				
			} 
			else {
				// 다른 relation의 mover삭제
				_this.removeOtherRelationMover();
	
				// console.log( ev, _this.pathMover.length, Object.keys(_this.pathMover).length );
				if( Object.keys(_this.pathMover).length === 0 ) {
					// 연결선 이동용 mover생성 TODO
					_this.makeMover();
				} else {
					_this.relocateMover();
				}
				_this.front();
				
				// 선택된 테이블 미선택으로 변경
				_this.hideResizerOfTable();
				
			}
			
			ev.stopPropagation();
		});
		
		_this.relationPathOutlint.mousemove(function(ev) {
			  _this.relationPath.attr({'stroke-width':1.7});
			var scroll = { top : Ext.getCmp(_this.subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollTop() , left : Ext.getCmp(_this.subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollLeft()};
			var subject = _this.drawDataLoad.getSubjectArea( _this.subjectAreaInfo["SUBJECT_ID"]);

			if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
				_this.relationPathOutlint.attr({"cursor": "crosshair"});
				subject.phantomRelation1toN.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + subject.phantomRelation1toNPath ).attr({stroke: 'black'}).show().front();
			} 
			// 1:1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
				_this.relationPathOutlint.attr({"cursor": "crosshair"});
				subject.phantomRelation1to1.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + subject.phantomRelation1toNPath ).attr({stroke: 'black'}).show().front();
			} 
			// 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
				_this.relationPathOutlint.attr({"cursor": "crosshair"});
				subject.phantomRelation1to0_1.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + subject.phantomRelation1toNPath ).attr({stroke: 'black'}).show().front();
			} 
		  // 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
				_this.relationPathOutlint.attr({"cursor": "crosshair"});
				subject.phantomRelationNonIden.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + subject.phantomRelation1toNPath ).attr({stroke: 'black'}).show().front();
			} else {
				_this.relationPathOutlint.attr({"cursor": "default"});
			}
			/*
				if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
					_this.relationPath.attr({'stroke-width':1.7});
				} 
				// 1:1관계선
				else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
					_this.relationPath.attr({'stroke-width':1.7});
				} 
				// 1:0or1관계선
				else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
					_this.relationPath.attr({'stroke-width':1.7});
				} 
			  // 1:0or1관계선
				else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
					_this.relationPath.attr({'stroke-width':1.7});
				}
				*/
		});
		
		_this.relationPathOutlint.mouseout(function(ev) {
			_this.relationPath.attr({'stroke-width':0.7});

			var scroll = { top : Ext.getCmp(_this.subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollTop() , left : Ext.getCmp(_this.subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollLeft()};
			var subject = _this.drawDataLoad.getSubjectArea( _this.subjectAreaInfo["SUBJECT_ID"]);

			if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
				//_this.relationPathOutlint.attr({"cursor": "crosshair"});
				subject.phantomRelation1toN.attr({stroke: 'red'}).show().front();
			} 
			// 1:1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
				//_this.relationPathOutlint.attr({"cursor": "crosshair"});
				subject.phantomRelation1to1.attr({stroke: 'red'}).show().front();
			} 
			// 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
				//_this.relationPathOutlint.attr({"cursor": "crosshair"});
				subject.phantomRelation1to0_1.attr({stroke: 'red'}).show().front();
			} 
		  // 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
				//_this.relationPathOutlint.attr({"cursor": "crosshair"});
				subject.phantomRelationNonIden.attr({stroke: 'red'}).show().front();
			} 

			/*
			if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
				_this.relationPath.attr({'stroke-width':0.7});
			} 
			// 1:1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
				_this.relationPath.attr({'stroke-width':0.7});
			} 
			// 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
				_this.relationPath.attr({'stroke-width':0.7});
			} 
		  // 1:0or1관계선
			else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
				_this.relationPath.attr({'stroke-width':0.7});
			}
			*/
		});
	}

	/**
	 * 다른 테이블의 resizer숨기기
	 */
	this.hideResizerOfTable = function() {
		var _this = this;
		for(var x in _this.drawDataLoad.getDrawedTable( _this.subjectAreaInfo["SUBJECT_ID"])) {
			_this.drawDataLoad.getDrawedTable( _this.subjectAreaInfo["SUBJECT_ID"], x).hideResizer();
		}
	}
	
	this.relocateMover= function() {
		var _this = this;
		_this.moverDisplayMode = "relocate";
		/*
		_this.removeMover();
		_this.makeMover();
		*/
		var moversPos = _this.getRelationPathArray();
		
		if( Object.keys(_this.pathMover).length !== moversPos.length ) {
			_this.removeMover();
			_this.makeMover();
			return;
		} 
		
		for( var i=0;i<moversPos.length; i++ ) {
			var moverPos = moversPos[i];
			var _pathMover = { x : Math.ceil(_this.pathMover[i].x()), y : Math.ceil(_this.pathMover[i].y()) }
			// console.log("mover", i, moverPos, _pathMover.x, _pathMover.y );
			//if( !_this.pathMover[i].visible() ) { //.move(0, 0)
				_this.pathMover[i].transform({translateX : moverPos[1]-_pathMover.x, translateY : moverPos[2]-_pathMover.y}).show();
			//}
		}
	}
	


	/**
	 * 다른 테이블의 resizer숨기기
	 */
	this.removeOtherRelationMover = function() {
		var _this = this;
		for(var x in _this.drawDataLoad.getDrawedRelation( _this.subjectAreaInfo["SUBJECT_ID"])) {
			if( x != _this.relationInfo["RELATION_ID"] ) {
				_this.drawDataLoad.getDrawedRelation( _this.subjectAreaInfo["SUBJECT_ID"], x).removeMover();
			}
		}
	}
	
	this.log = function() {
		var _this = this;
		console.log( "log", _this.start );
	}
	
	/**
	 * relation_SorE : 'start' or 'end'
	 */ 
	this.caculateRelativeXYOfStart = function(relation_SorE, ev) {
		var _this = this;
		var table = {}, rect = {}
		if( relation_SorE == 'start' ) {
			table["start"] = SVG(".table_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["START_ENTITY_ID"]);
			rect["start"] = table["start"].findOne(".rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["START_ENTITY_ID"]);

			var _position = ev.detail.position != "" ? ev.detail.position : _this.start["position"] ; 
			// 관계선의 시작점의 정보를 변경
			var value = { "START_POSITION" : _position, "START_X" : _this.start["x"] - table["start"].transform('translateX'), "START_Y" : _this.start["y"] - table["start"].transform('translateY') }
			// console.log( "START >>>>>>>>>" , value );
			_this.drawDataLoad.setRelationStartValue( _this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"], value, _this.pathRelation['paths']);
		} else if( relation_SorE == 'end' ) {
			table["end"] = SVG(".table_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["END_ENTITY_ID"]);
			rect["end"] = table["end"].findOne(".rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["END_ENTITY_ID"]);

			var _position = ev.detail.position != "" ? ev.detail.position : _this.end["position"] ; 
			// 관계선의 시작점의 정보를 변경
			var value = { "END_POSITION" : _position, "END_X" : _this.end["x"] - table["end"].transform('translateX'), "END_Y" : _this.end["y"] - table["end"].transform('translateY') }
			// console.log( "END >>>>>>>>>" , value );
			_this.drawDataLoad.setRelationEndValue( _this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"], value, _this.pathRelation['paths']);

		}
		
		//console.log( _this.drawDataLoad.getRelationOnSubjectAreaDatas() );
	}
	
	
	/*
	 *
	 * draw_type : init, table_move, resizer_move
	 */
	this.caculateAbsoluteStartEndOfTable = function(draw_type, moverIdx) {
		var _this = this;
		if( draw_type == "mover_move" ) {
			_this.removeMover(moverIdx);
			return;
		}
		var table = {}, rect = {}
		
		table["start"] = SVG(".table_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["START_ENTITY_ID"])
		
		if( table["start"] == null ) {
			return ;
		}
		rect["start"] = table["start"].findOne(".rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["START_ENTITY_ID"])
		table["end"] = SVG(".table_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["END_ENTITY_ID"])
		rect["end"] = table["end"].findOne(".rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["END_ENTITY_ID"])

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
							
		// 시작, 종료 위치 및 xy구하기..
		_this.start["position"] = _this.relationInfo["START_POSITION"];
		if( _this.relationInfo["START_POSITION"] == "t" ) {
			_this.start["x"] = Math.ceil(table["start"].transform('translateX') + _this.relationInfo["START_X"]);
			if( _this.start["x"] > boxOfStart.right) {
				 _this.start["x"] = Math.min( _this.start["x"], boxOfStart.right);
				 _this.relationInfo["START_X"] = _this.start["x"] - table["start"].transform('translateX');
			}
			_this.start["y"] = Math.ceil(table["start"].transform('translateY')+(draw_type == "init" ? 0 : _this.CONSTANT.CORRECT-2));
		} else if( _this.relationInfo["START_POSITION"] == "l" ) {
			_this.start["x"] = Math.ceil(table["start"].transform('translateX'));
			_this.start["y"] = Math.ceil(table["start"].transform('translateY') + _this.relationInfo["START_Y"]);
			if( _this.start["y"] > boxOfStart.bottom) {
				 _this.start["y"] = Math.min( _this.start["y"], boxOfStart.bottom);
				 _this.relationInfo["START_Y"] = _this.start["y"] - table["start"].transform('translateY');
			}
			
		} else if( _this.relationInfo["START_POSITION"] == "r" ) {
			_this.start["x"] = Math.ceil(table["start"].transform('translateX') + rect["start"].width());
			_this.start["y"] = Math.ceil(table["start"].transform('translateY') + _this.relationInfo["START_Y"]);
			if( _this.start["y"] > boxOfStart.bottom) {
				 _this.start["y"] = Math.min( _this.start["y"], boxOfStart.bottom);
				 _this.relationInfo["START_Y"] = _this.start["y"] - table["start"].transform('translateY');
			}
		} else if( _this.relationInfo["START_POSITION"] == "b" ) {
			_this.start["x"] = Math.ceil(table["start"].transform('translateX') + _this.relationInfo["START_X"]);
			if( _this.start["x"] > boxOfStart.right) {
				 _this.start["x"] = Math.min( _this.start["x"], boxOfStart.right);
				 _this.relationInfo["START_X"] = _this.start["x"] - table["start"].transform('translateX');
			}
			_this.start["y"] = Math.ceil(table["start"].transform('translateY') + rect["start"].height()+15+(draw_type == "init" ? 0 : _this.CONSTANT.CORRECT-1));
		} 
		
		if( draw_type == "init") {
			_this.start_init["position"] = _this.start["position"]
			_this.start_init["x"] = Math.ceil(_this.start["x"]);
			_this.start_init["y"] = Math.ceil(_this.start["y"]);
		}
		
		_this.end["position"] = _this.relationInfo["END_POSITION"];
		if( _this.relationInfo["END_POSITION"] == "t" ) {
			_this.end["x"] = Math.ceil(table["end"].transform('translateX') + _this.relationInfo["END_X"]);
			if( _this.end["x"] > boxOfEnd.right) {
				 _this.end["x"] = Math.min( _this.end["x"], boxOfEnd.right);
				 _this.relationInfo["END_X"] = _this.end["x"] - table["end"].transform('translateX');
			}
			_this.end["y"] = Math.ceil(table["end"].transform('translateY'));
		} else if( _this.relationInfo["END_POSITION"] == "l" ) {
			_this.end["x"] = Math.ceil(table["end"].transform('translateX'));
			_this.end["y"] = Math.ceil(table["end"].transform('translateY') + _this.relationInfo["END_Y"]);
			if( _this.end["y"] > boxOfEnd.bottom) {
				 _this.end["y"] = Math.min( _this.end["y"], boxOfEnd.bottom);
				 _this.relationInfo["END_Y"] = _this.end["y"] - table["end"].transform('translateY');
			}
		} else if( _this.relationInfo["END_POSITION"] == "r" ) {
			_this.end["x"] = Math.ceil(table["end"].transform('translateX') + rect["end"].width());
			_this.end["y"] = Math.ceil(table["end"].transform('translateY') + _this.relationInfo["END_Y"]);
			if( _this.end["y"] > boxOfEnd.bottom) {
				 _this.end["y"] = Math.min( _this.end["y"], boxOfEnd.bottom);
				 _this.relationInfo["END_Y"] = _this.end["y"] - table["end"].transform('translateY');
			}
		} else if( _this.relationInfo["END_POSITION"] == "b" ) {
			_this.end["x"] = Math.ceil(table["end"].transform('translateX') + _this.relationInfo["END_X"]);
			if( _this.end["x"] > boxOfEnd.right) {
				 _this.end["x"] = Math.min( _this.end["x"], boxOfEnd.right);
				 _this.relationInfo["END_X"] = _this.end["x"] - table["end"].transform('translateX');
			}
			_this.end["y"] = Math.ceil(table["end"].transform('translateY') + rect["end"].height()+15+(draw_type == "init" ? 0 : _this.CONSTANT.CORRECT-1));
		}
		
		console.log( _this.relationInfo, _this.start, _this.end);
	}
	
	/*
	 * 시작점 위치 정보 및 시작용 선그리기..
	 * draw_type : init, table_move, resizer_move
	 */
	this.setPathForStart = function(draw_type, data) {
		var _this = this;
		//console.log( " draw_type : " + draw_type);
		//console.log( " _this.start : " , _this.start);

		// 시작점 상단 
		if( _this.start["position"] == 't') {
			if( draw_type == "init" || draw_type == "mover_move" ) {
				// 시작 점 이동.
				var idx1 = 0;
				_this.pathRelation['start'][idx1++] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				/*
				_this.pathRelation['start'][idx1++] = "m -"+_this.CONSTANT.LINE+" -"+_this.CONSTANT.LINE;
				_this.pathRelation['start'][idx1++] = "l " +(_this.CONSTANT.LINE*2) +" 0";
				_this.pathRelation['start'][idx1++] = "m -"+_this.CONSTANT.LINE+" "+_this.CONSTANT.LINE;
				*/
				_this.pathRelation['start'][idx1++] = "l 0 -" +(_this.CONSTANT.PADDING);
				
				var idx2 = 0;
				_this.pathRelation['outline_start'][idx2++] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][idx2++] = "l 0 -" +(_this.CONSTANT.PADDING);

			} else if( draw_type == "table_move" ) {
				//console.log( "table_move",  _this.start );
				_this.pathRelation['start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
			} else if( draw_type == "resizer_move" ) {
				//console.log( "resizer_move",  _this.start );
				_this.pathRelation['start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
			}
		} 
		// 시작점 좌측
		else if( _this.start["position"] == 'l') {
			if( draw_type == "init" || draw_type == "mover_move") {
				// 시작 점 이동.
				var idx1 = 0;
				_this.pathRelation['start'][idx1++] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				/*
				// drag&drop을 위한 추가 이동.
				// _this.pathRelation['start'][idx1++] = "m 0 0";
				_this.pathRelation['start'][idx1++] = "m -"+_this.CONSTANT.LINE+" -"+_this.CONSTANT.LINE;
				_this.pathRelation['start'][idx1++] = "l 0 " +(_this.CONSTANT.LINE*2);
				_this.pathRelation['start'][idx1++] = "m "+_this.CONSTANT.LINE+" -"+_this.CONSTANT.LINE;
				*/
				_this.pathRelation['start'][idx1++] = "l -" +(_this.CONSTANT.PADDING)+ " 0";
				var idx2 = 0;
				_this.pathRelation['outline_start'][idx2++] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][idx2++] = "l -" +(_this.CONSTANT.PADDING)+ " 0";

			} else if( draw_type == "table_move" ) {
				//console.log( "table_move",  _this.start );
				_this.pathRelation['start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
			} else if( draw_type == "resizer_move" ) {
				//console.log( "resizer_move",  _this.start );
				_this.pathRelation['start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
			}

		} 
		// 시작점 우측
		else if( _this.start["position"] == 'r') {
			// console.log( _this.start );
			
			if( draw_type == "init" || draw_type == "mover_move" ) {
				// 시작 점 이동.
				var idx1 = 0;
				_this.pathRelation['start'][idx1++] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				/*
				// drag&drop을 위한 추가 이동.
				// _this.pathRelation['start'][idx1++] = "m 0 0";
				_this.pathRelation['start'][idx1++] = "m "+_this.CONSTANT.LINE+" -"+_this.CONSTANT.LINE;
				_this.pathRelation['start'][idx1++] = "l 0 " +(_this.CONSTANT.LINE*2);
				_this.pathRelation['start'][idx1++] = "m -"+_this.CONSTANT.LINE+" -"+_this.CONSTANT.LINE;
				*/
				_this.pathRelation['start'][idx1++] = "l " +(_this.CONSTANT.PADDING)+ " 0";
				var idx2 = 0;
				_this.pathRelation['outline_start'][idx2++] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][idx2++] = "l " +(_this.CONSTANT.PADDING)+ " 0";

			} else if( draw_type == "table_move" ) {
				//console.log( "table_move",  _this.start );
				_this.pathRelation['start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
			} else if( draw_type == "resizer_move" ) {
				//console.log( "resizer_move",  _this.start );
				_this.pathRelation['start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
			}

			/*
			// 시작 점 이동.
			_this.pathRelation['start'].push("M " + (_this.start["x"]) + " " +  (_this.start["y"]));
			// drag&drop을 위한 추가 이동.
			_this.pathRelation['start'].push("m 0 0");
			_this.pathRelation['start'].push("m "+_this.CONSTANT.LINE+" -"+_this.CONSTANT.LINE);
			_this.pathRelation['start'].push("l 0 " +(_this.CONSTANT.LINE*2));
			_this.pathRelation['start'].push("m -"+_this.CONSTANT.LINE+" -"+_this.CONSTANT.LINE);
			_this.pathRelation['start'].push("l " +(_this.CONSTANT.PADDING)+ " 0");

			_this.pathRelation['outline_start'].push("M " + (_this.start["x"]) + " " +  (_this.start["y"]));
			_this.pathRelation['outline_start'].push("m 0 0");
			_this.pathRelation['outline_start'].push("l " +(_this.CONSTANT.PADDING)+ " 0");
			*/
		}
		// 시작점 하단
		else if( _this.start["position"] == 'b') {
			if( draw_type == "init" || draw_type == "mover_move" ) {
				// 시작 점 이동.
				var idx1 = 0;
				_this.pathRelation['start'][idx1++] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				/*
				_this.pathRelation['start'][idx1++] = "m -"+_this.CONSTANT.LINE+" "+_this.CONSTANT.LINE;
				_this.pathRelation['start'][idx1++] = "l " +(_this.CONSTANT.LINE*2) +" 0";
				_this.pathRelation['start'][idx1++] = "m -"+_this.CONSTANT.LINE+" -"+_this.CONSTANT.LINE;
				*/
				_this.pathRelation['start'][idx1++] = "l 0 " +(_this.CONSTANT.PADDING);
				var idx2 = 0;
				_this.pathRelation['outline_start'][idx2++] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][idx2++] = "l 0 " +(_this.CONSTANT.PADDING);

			} else if( draw_type == "table_move" ) {
				//console.log( "table_move",  _this.start );
				_this.pathRelation['start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
			} else if( draw_type == "resizer_move" ) {
				//console.log( "resizer_move",  _this.start );
				_this.pathRelation['start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
				_this.pathRelation['outline_start'][0] = "M " + (_this.start["x"]) + " " +  (_this.start["y"]);
			} 
			/*
			// 상단
			if( _this.end["position"] == "t" ) {
			}
			// 좌측
			else if( _this.end["position"] == "l" ) {
			}
			// 우측
			else if( _this.end["position"] == "r" ) {
			}
			// 하단
			else if( _this.end["position"] == "b" ) {
			}
			*/
		}
		
		// _this.pathRelation['outline_start'] = _this.pathRelation['start'].slice();
		
		_this.pathRelation['start_info'] = _this.pathRelation['start'][0];

	}


	/*
	 * 연결용 중간 선그리기..
	 */
	this.setPathForLink = function(draw_type) {
		var _this = this;

		if( draw_type ==  'init' && _this.pathRelation['paths'] && _this.pathRelation['paths'].length > 1 ) {
			return;
		}
		//console.log( _this.relationInfo["RELATION_ID"], _this.relationType );
		if( _this.relationType["pre"] != _this.relationType["now"] ) {
			_this.pathRelation['paths'] = new Array();
			_this.relationType["pre"]  = _this.relationType["now"];
			_this.pathRelation['end'] = new Array();
			_this.pathRelation['outline_end'] = new Array();
		}
		  
		  /*
		var str_x = "";
		if( _this.start["x"] > _this.end["x"]  ) {
			str_x = "시작(오른쪽)>종료(왼쪽)  start_x > end_x";
		} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
			str_x = "시작=종료 start_x = end_x";
		} else if( _this.start["x"] < _this.end["x"] ) {
			str_x = "시작(왼쪽)<종료(오른쪽) start_x < end_x";
		}
		var str_y = "";
		if( Math.round(_this.start["y"]) == Math.round(_this.end["y"]) ) {
			str_y = "시작=종료 start_y = end_y";
		} else if( _this.start["y"] < _this.end["y"] ) {
			str_y = "시작(위)<종료(아래) start_y < end_y";
		} else if( _this.start["y"] > _this.end["y"] ){
			str_y = "시작(아래)>종료(위) start_y > end_y";
		}
		
		console.log( "start-y:"+_this.start["y"] , "end-y:"+_this.end["y"], str_y);
		console.log( "start-x:"+_this.start["x"] , "end-x:"+_this.end["y"], str_x);
		console.log( "start", _this.start);
		console.log( "end", _this.end);
		*/
		
		// 시작점 상단 
		if( _this.start["position"] == 't') {
			// 시작점과 같을 경우
			if( Math.round(_this.start["y"]) == Math.round(_this.end["y"])+ (_this.end["position"] == 'b'? _this.CONSTANT.PADDING : 0 )+(_this.end["position"]=="l"? _this.CONSTANT.PADDING : 0) ) {
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	
						//}
					} else if( _this.start["x"] < _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	
						//}
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "t|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//}
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "t|-|r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	
						//}
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}
			} 
			// 시작점 위, 종료점 아래
			else if( _this.start["y"] - (_this.end["position"] == 'b'? _this.CONSTANT.PADDING : 0 ) < _this.end["y"] + (_this.end["position"] == 'b'? _this.CONSTANT.PADDING : 0 )+(_this.end["position"]=="l"? _this.CONSTANT.PADDING : 0) ) {
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	_this.pathRelation['paths'][0]= "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//	_this.pathRelation['paths'][1]= "l 0 " + (_this.end["y"] - _this.start["y"]);
						//}
					} else if( Math.round(_this.start["x"]) - (_this.end["position"] == 'b'? _this.CONSTANT.PADDING : 0 ) == Math.round(_this.end["x"]+ (_this.end["position"] == 'b'? _this.CONSTANT.PADDING : 0 ))	) {
					} else if( _this.start["x"]  - (_this.end["position"] == 'b'? _this.CONSTANT.PADDING : 0 ) < _this.end["x"]+ (_this.end["position"] == 'b'? _this.CONSTANT.PADDING : 0 ) ) {
						_this.relationType["now"] = "t|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//} else {
						//	_this.pathRelation['paths'][0]= "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//	_this.pathRelation['paths'][1]= "l 0 " + (_this.end["y"] - _this.start["y"]);
						//}
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"]) -_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"]) -_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "t|-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"])/2 + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])/2 -_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	var p = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"]) - parseInt(p[1]) -_this.CONSTANT.PADDING) + " 0";
						//}
						
						console.log("------------------------------", _this.pathRelation['outline_start'].join(' '));
						console.log("------------------------------", _this.pathRelation['paths'].join(' '));
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"])/2 + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	var p = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])- parseInt(p[1])+_this.CONSTANT.PADDING) + " 0";
						//}

					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {

						_this.relationType["now"] = "t|-|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//}
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])/2) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"])+_this.CONSTANT.PADDING*2);
							_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])/2) + " 0";
							_this.pathRelation['paths'][4] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"])+_this.CONSTANT.PADDING*2);
						//	_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])  - parseInt(p[1]) ) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "t|-|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])/2) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"])+_this.CONSTANT.PADDING*2);
							_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])/2) + " 0";
							_this.pathRelation['paths'][4] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"])+_this.CONSTANT.PADDING*2);
						//	_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])  - parseInt(p[1]) ) + " 0";
						//}
					}
				}
			}
			// 시작점 아래, 종료점 위
			else if( _this.start["y"] > _this.end["y"]+ (_this.end["position"] == 'b'? _this.CONSTANT.PADDING : 0 )+(_this.end["position"]=="l"? _this.CONSTANT.PADDING : 0) ){
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "t|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//}
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][3] = "l 0 0";
						// } else {
						// 	var p = _this.pathRelation['paths'][0].split(" ");
						// 	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						// 	_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"]) - parseInt(p[2])+_this.CONSTANT.PADDING);
						// }
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "t|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + ((_this.end["y"] - _this.start["y"])+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + ((_this.end["y"] - _this.start["y"])+_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//}
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + ((_this.end["y"] - _this.start["y"])+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + ((_this.end["y"] - _this.start["y"])+_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "t|-|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l 0 0";
						// } else {
						// 	var p = _this.pathRelation['paths'][0].split(" ");
						// 	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						// 	_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"]- parseInt(p[2]))+_this.CONSTANT.PADDING);
						// }
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "t|-|b";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2+_this.CONSTANT.PADDING);
						// } else {
						// 	var p = _this.pathRelation['paths'][0].split(" ");
						// 	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						// 	_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"]- parseInt(p[2]))+_this.CONSTANT.PADDING*2);
						// }
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
						_this.relationType["now"] = "t|b";
								_this.pathRelation['paths'][0] = "l 0 " + ((Math.ceil(_this.end["y"] - _this.start["y"])/2)+_this.CONSTANT.PADDING);
								_this.pathRelation['paths'][1] = "l 0 0";
								_this.pathRelation['paths'][2] = "l 0 " + ((Math.ceil(_this.end["y"] - _this.start["y"])/2)+_this.CONSTANT.PADDING);
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "t|-|b";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2+_this.CONSTANT.PADDING);
						// } else {
						// 	var p = _this.pathRelation['paths'][0].split(" ");
						// 	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						// 	_this.pathRelation['paths'][2] = "l 0 " + ((_this.end["y"] - _this.start["y"]- parseInt(p[2]))+_this.CONSTANT.PADDING*2);
						// }
					}
				}
			}
		} 
		// 시작점 좌측
		else if( _this.start["position"] == 'l') {
			// 시작점과 같을 경우
			if( Math.round(_this.start["y"]) == Math.round(_this.end["y"]) ) {
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "l-|-r";
						_this.pathRelation['paths'][0] = "l " + (((_this.end["x"] - _this.start["x"])/2)+_this.CONSTANT.PADDING) + " 0";
						_this.pathRelation['paths'][1] = "l 0 0";
						_this.pathRelation['paths'][2] = "l " + (((_this.end["x"] - _this.start["x"])/2)+_this.CONSTANT.PADDING) + " 0";
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
						_this.relationType["now"] = "l-|-r";
						_this.pathRelation['paths'][0] = "l " + (((_this.end["x"] - _this.start["x"])/2)+_this.CONSTANT.PADDING) + " 0";
						_this.pathRelation['paths'][1] = "l 0 0";
						_this.pathRelation['paths'][2] = "l " + (((_this.end["x"] - _this.start["x"])/2)+_this.CONSTANT.PADDING) + " 0";
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "l-|-r";
						_this.pathRelation['paths'][0] = "l " + (((_this.end["x"] - _this.start["x"])/2)+_this.CONSTANT.PADDING) + " 0";
						_this.pathRelation['paths'][1] = "l 0 0";
						_this.pathRelation['paths'][2] = "l " + (((_this.end["x"] - _this.start["x"])/2)+_this.CONSTANT.PADDING) + " 0";
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}
			} 
			// 시작점 위, 종료점 아래
			else if( _this.start["y"] < _this.end["y"] ) {
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "l-|t";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						// } else {
						// 	_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])+_this.CONSTANT.PADDING) + " 0";
						// 	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						// }
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "l-|-|t";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2);
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][3] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][4] = "l 0 0";
						// } else {
						// 	var p = _this.pathRelation['paths'][1].split(" ");
						// 	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						// 	_this.pathRelation['paths'][3] = "l 0 " + (_this.end["y"] - _this.start["y"] - parseInt(p[2]) -_this.CONSTANT.PADDING);
						// }
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "l-|-l";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l 0 0";
						// } else {
						// 	_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
						// 	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						// }
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "l-|-|l";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
						// } else {
						// 	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						// 	_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
						// }
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"]-_this.CONSTANT.PADDING  > _this.end["x"]+_this.CONSTANT.PADDING ) {
						_this.relationType["now"] = "l-|-r";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
						// } else {
						// 	var p = _this.pathRelation['paths'][0].split(" ");
						// 	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						// 	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p[1])+_this.CONSTANT.PADDING*2) + " 0";
						// }
					} else if( Math.round(_this.start["x"])-_this.CONSTANT.PADDING  == Math.round(_this.end["x"])+_this.CONSTANT.PADDING	) {
					} else if( _this.start["x"]-_this.CONSTANT.PADDING  < _this.end["x"]+_this.CONSTANT.PADDING ) {
						_this.relationType["now"] = "l-|-|-r";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING*2) + " 0";
							_this.pathRelation['paths'][3] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][4] = "l 0 0";
						// } else {
						// 	var p = _this.pathRelation['paths'][1].split(" ");
						// 	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING*2) + " 0";
						// 	_this.pathRelation['paths'][3] = "l 0 " + (_this.end["y"] - _this.start["y"] - parseInt(p[2]));
						// }
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "l-|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][3] = "l 0 0";
						// } else {
						// 	var p = _this.pathRelation['paths'][0].split(" ");
						// 	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						// 	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p[1])+_this.CONSTANT.PADDING*2) + " 0";
						// }
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "l-|-|b";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][3] = "l 0 0";
						// } else {
						// 	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						// 	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						// }
					}
				}
			}
			// 시작점 아래, 종료점 위
			else if( _this.start["y"] > _this.end["y"] ){
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "l-|-|t";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"])/2 + " 0";
							_this.pathRelation['paths'][3] = "l 0 0";
						// } else {
						// 	var p = _this.pathRelation['paths'][0].split(" ");
						// 	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						// 	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p[1])+_this.CONSTANT.PADDING) + " 0";
						// }
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "l-|-|t";
						// if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][3] = "l 0 0";
						// } else {
						// 	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						// 	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						// }
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "l-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "l-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//} else {
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
						//}
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"]-_this.CONSTANT.PADDING > _this.end["x"]+_this.CONSTANT.PADDING  ) {
						_this.relationType["now"] = "l-|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p[1])+_this.CONSTANT.PADDING*2) + " 0";
						//}
					} else if( Math.round(_this.start["x"])-_this.CONSTANT.PADDING == Math.round(_this.end["x"])+_this.CONSTANT.PADDING	) {
					} else if( _this.start["x"]-_this.CONSTANT.PADDING < _this.end["x"]+_this.CONSTANT.PADDING ) {
						_this.relationType["now"] = "l-|-|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING*2) + " 0";
							_this.pathRelation['paths'][3] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][4] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][1].split(" ");
						//	var p2 = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p[1])+_this.CONSTANT.PADDING*2) + " 0";
						//	_this.pathRelation['paths'][3] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p2[2]));
						//}
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "l-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//} else {
						//	_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "l-|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][3] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2+_this.CONSTANT.PADDING);
						//} else {
						//	var p = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][3] = "l 0 " + (_this.end["y"] - _this.start["y"] - parseInt(p[2])+_this.CONSTANT.PADDING);
						//}
					}
				}
			}
		} 
		// 시작점 우측
		else if( _this.start["position"] == 'r') {
			// 시작점과 같을 경우
			if( Math.round(_this.start["y"]) == Math.round(_this.end["y"]) ) {

				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "r-|-l";
						_this.pathRelation['paths'][0] = "l " + (((_this.end["x"] - _this.start["x"])/2)-_this.CONSTANT.PADDING) + " 0";
						_this.pathRelation['paths'][1] = "l 0 0";
						_this.pathRelation['paths'][2] = "l " + (((_this.end["x"] - _this.start["x"])/2)-_this.CONSTANT.PADDING) + " 0";
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
						_this.relationType["now"] = "r-|-l";
						_this.pathRelation['paths'][0] = "l " + (((_this.end["x"] - _this.start["x"])/2)-_this.CONSTANT.PADDING) + " 0";
						_this.pathRelation['paths'][1] = "l 0 0";
						_this.pathRelation['paths'][2] = "l " + (((_this.end["x"] - _this.start["x"])/2)-_this.CONSTANT.PADDING) + " 0";
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "r-|-l";
						_this.pathRelation['paths'][0] = "l " + (((_this.end["x"] - _this.start["x"])/2)-_this.CONSTANT.PADDING) + " 0";
						_this.pathRelation['paths'][1] = "l 0 0";
						_this.pathRelation['paths'][2] = "l " + (((_this.end["x"] - _this.start["x"])/2)-_this.CONSTANT.PADDING) + " 0";
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}
			} 
			// 시작점 위, 종료점 아래
			else if( _this.start["y"] < _this.end["y"] ) {
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"] ) {
						_this.relationType["now"] = "r-|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"] -_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][3] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2 -_this.CONSTANT.PADDING);
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	var p2 = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"] - parseInt(p[1]) -_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][3] = "l 0 " + (_this.end["y"] - _this.start["y"] - parseInt(p2[2]) -_this.CONSTANT.PADDING);
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"]) ) {
						
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "r-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"] -_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						//}else {
						//	_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"] -_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						//}
					}
					
				} 
				else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"]+_this.CONSTANT.PADDING > _this.end["x"]-_this.CONSTANT.PADDING  ) {
						_this.relationType["now"] = "r-|-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0" + " " + (_this.end["y"]-_this.start["y"])/2;
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"]) - _this.CONSTANT.PADDING*2) + " 0";
							_this.pathRelation['paths'][3] = "l 0" + " " + (_this.end["y"]-_this.start["y"])/2;
							_this.pathRelation['paths'][4] = "l 0 0";
						// } else {
						// 	var p = _this.pathRelation['paths'][0].split(" ");
						// 	var p2 = _this.pathRelation['paths'][1].split(" ");
						// 	_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"]- parseInt(p[1])) - _this.CONSTANT.PADDING*2) + " 0";
						// 	_this.pathRelation['paths'][3] = "l 0" + " " + (_this.end["y"]-_this.start["y"]- parseInt(p2[2]));
						// }
					}
					else if( Math.round(_this.start["x"])+_this.CONSTANT.PADDING == Math.round(_this.end["x"])-_this.CONSTANT.PADDING ) {
						_this.relationType["now"] = "r|l";
						_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])-_this.CONSTANT.PADDING*2)+ " 0";
					} 
					else if( _this.start["x"]+_this.CONSTANT.PADDING < _this.end["x"]-_this.CONSTANT.PADDING ) {
						_this.relationType["now"] = "r-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0" + " " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l 0" + " " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"]) - parseInt(p[1])-_this.CONSTANT.PADDING*2) + " 0"
						//}
					}
				}
				else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "r|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//}

					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
						
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "r-|l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							console.log( _this.start, _this.end );
							_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//} else {
						//	_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//}
					}

				}
				else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "r-|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p[1])-_this.CONSTANT.PADDING) + " 0";
						//	
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
						
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "r-|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])/2) + " 0";
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p[1])-_this.CONSTANT.PADDING) + " 0";
						//}
					}
				}
			}
			// 시작점 아래, 종료점 위
			else if( _this.start["y"] > _this.end["y"] ){
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "r|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//}
					}
					else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"]) ) {
					}
					else if( _this.start["x"] < _this.end["x"]  ) {
						_this.relationType["now"] = "r-|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"])/2 + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]-parseInt(p[1])-_this.CONSTANT.PADDING) + " 0";
						//}
					}
				} 
				else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.relationType["now"] = "r-|-|l";
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0" + " " + (_this.end["y"]-_this.start["y"])/2;
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])-_this.CONSTANT.PADDING*2) + " 0";
							_this.pathRelation['paths'][3] = "l 0" + " " + (_this.end["y"]-_this.start["y"])/2;
							_this.pathRelation['paths'][4] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	var p2 = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"] - parseInt(p[1]))-_this.CONSTANT.PADDING*2) + " 0";
						//	_this.pathRelation['paths'][3] = "l 0" + " " + (_this.end["y"]-_this.start["y"] - parseInt(p2[2]));
						//}
						
					}
					else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"]) ) {
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.relationType["now"] = "r-|-l";
							_this.pathRelation['paths'][0]= "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1]= "l 0 0";
							_this.pathRelation['paths'][2]= "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
						//} else {

						//}
					}
					else if( _this.start["x"] < _this.end["x"]  ) {
						_this.relationType["now"] = "r-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0" + " " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l 0" + " " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][2] = "l " + ((_this.end["x"] - _this.start["x"]) - parseInt(p[1])-_this.CONSTANT.PADDING*2) + " 0"
						//}
					}
				}
				else if( _this.end["position"] == 'r' ) {
					_this.relationType["now"] = "r|-l";
					if( _this.start["x"] > _this.end["x"]  ) {
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {


					} else if( _this.start["x"] < _this.end["x"] ) {
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//} else {
						//	_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]) + " 0";
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//}
					}
				}
				else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "r-|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][3] = "l 0 " + ((_this.end["y"] - _this.start["y"])/2+_this.CONSTANT.PADDING);
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	var p2 = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l " + (_this.end["x"] - _this.start["x"] - parseInt(p[1])-_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][3] = "l 0 " + (_this.end["y"] - _this.start["y"] - parseInt(p2[2])+_this.CONSTANT.PADDING);
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
						
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "r-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//} else {
						//	_this.pathRelation['paths'][0] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][1] = "l 0 " + (_this.end["y"] - _this.start["y"]+_this.CONSTANT.PADDING);
						//}
					}
				}
			}
		}
		// 시작점 하단
		else if( _this.start["position"] == 'b') {
			// 시작점과 같을 경우
			if( Math.round(_this.start["y"]) == Math.round(_this.end["y"]) ) {
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
						
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
					}
				}
			} 
			// 시작점 위, 종료점 아래
			else if( _this.start["y"] < _this.end["y"] ) {
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "b|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (((_this.end["x"] - _this.start["x"]))) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING);
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l " + (((_this.end["x"] - _this.start["x"]))) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2])-_this.CONSTANT.PADDING*2);
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
						_this.relationType["now"] = "b|t";
						_this.pathRelation['paths'][0] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING); 
						_this.pathRelation['paths'][1] = "l 0 0";
						_this.pathRelation['paths'][2] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING); 
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "b|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (((_this.end["x"] - _this.start["x"]))) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING);
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l " + (((_this.end["x"] - _this.start["x"]))) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2])-_this.CONSTANT.PADDING*2);
						//}
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]-_this.CONSTANT.PADDING  ) {
						_this.relationType["now"] = "b|-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"] - parseInt(p[2])-_this.CONSTANT.PADDING);
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])-_this.CONSTANT.PADDING	) {
					} else if( _this.start["x"] < _this.end["x"]-_this.CONSTANT.PADDING ) {
						_this.relationType["now"] = "b|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//}
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "b|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "b|-|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (((_this.end["y"] - _this.start["y"])/2)-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"])/2;
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2]));
						//}
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "b|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//else {
						// 	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "b|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
							_this.pathRelation['paths'][2] = "l 0 0";
						//} else {
						//	_this.pathRelation['paths'][0] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//	_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
						//}
					}
				}
			}
			// 시작점 아래, 종료점 위
			else if( _this.start["y"] > _this.end["y"] ){
				if( _this.end["position"] == 't' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "b|-|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (((_this.end["x"] - _this.start["x"])/2)) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING*2);
							_this.pathRelation['paths'][3] = "l " + (((_this.end["x"] - _this.start["x"])/2)) + " 0";
							_this.pathRelation['paths'][4] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	var p2 = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2])-_this.CONSTANT.PADDING*2);
						//	_this.pathRelation['paths'][3] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p2[1])) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "b|-|-|t";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (((_this.end["x"] - _this.start["x"])/2)) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING*2);
							_this.pathRelation['paths'][3] = "l " + (((_this.end["x"] - _this.start["x"])/2)) + " 0";
							_this.pathRelation['paths'][4] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	var p2 = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2])-_this.CONSTANT.PADDING*2);
						//	_this.pathRelation['paths'][3] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p2[1])) + " 0";
						//}
					}
				}else if( _this.end["position"] == 'l' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "b|-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]-_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2])-_this.CONSTANT.PADDING);
						//	
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "b|-|-l";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])/2) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])/2-_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	var p2 = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2]= "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2])-_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][3] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p2[1])-_this.CONSTANT.PADDING) + " 0";
						//}
					}
				}else if( _this.end["position"] == 'r' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "b|-|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])/2) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l " + ((_this.end["x"] - _this.start["x"])/2+_this.CONSTANT.PADDING) + " 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	var p2 = _this.pathRelation['paths'][1].split(" ");
						//	_this.pathRelation['paths'][2]= "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2])-_this.CONSTANT.PADDING);
						//	_this.pathRelation['paths'][3] = "l " + (_this.end["x"] - _this.start["x"]- parseInt(p2[1])+_this.CONSTANT.PADDING) + " 0";
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {
					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "b|-|-r";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]-_this.CONSTANT.PADDING);
							_this.pathRelation['paths'][3] = "l 0 0";
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l " + (_this.end["x"] - _this.start["x"]+_this.CONSTANT.PADDING) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[2])-_this.CONSTANT.PADDING);
						//}
					}
				}else if( _this.end["position"] == 'b' ) {
					if( _this.start["x"] > _this.end["x"]  ) {
						_this.relationType["now"] = "b|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[1]));
						//}
					} else if( Math.round(_this.start["x"]) == Math.round(_this.end["x"])	) {

					} else if( _this.start["x"] < _this.end["x"] ) {
						_this.relationType["now"] = "b|-|b";
						//if( _this.pathRelation['paths'].length == 0 ) {
							_this.pathRelation['paths'][0] = "l 0 0";
							_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
							_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]);
						//} else {
						//	var p = _this.pathRelation['paths'][0].split(" ");
						//	_this.pathRelation['paths'][1] = "l " + ((_this.end["x"] - _this.start["x"])) + " 0";
						//	_this.pathRelation['paths'][2] = "l 0 " + (_this.end["y"] - _this.start["y"]- parseInt(p[1]));
						//}
					}
				}
			}
		}
		
		
		// Table D&D를 위해 복사.
		this.pathRelation['paths_redraw'] = _this.pathRelation['paths'].slice();
		
		// 관계선을 처음 그린경우 이전=현재 동일하게
		if( draw_type == 'init') {
			_this.relationType["pre"] = _this.relationType["now"];
		}
	}
	
	
	/*
	 * 종료점 위치 정보 및 종료용 선그리기..
	 */
	this.setPathForEnd = function(draw_type) {
		var _this = this;
		
		if( draw_type == "relation_change" ) {
			_this.pathRelation['end'] = new Array();
		}
		var relation_type = _this.relationInfo["RELATION_TYPE"]||"rel1toN";
		console.log( " relation_type : " + relation_type);
		// 시작점 상단 
		if( _this.end["position"] == 't') {

			var idx1 = 0;
			// 1:n 선그리기
			_this.pathRelation['end'][idx1++] = "l 0 " + _this.CONSTANT.PADDING;
			if( relation_type == "rel1toN" ) {
				_this.pathRelation['end'][idx1++] = "m 0 -5";
				_this.pathRelation['end'][idx1++] = "l 5 5"; 
				_this.pathRelation['end'][idx1++] = "m -5 -5";
				_this.pathRelation['end'][idx1++] = "l -5 5";
				_this.pathRelation['end'][idx1++] = "m 5 0";
			}
			
			// 1:1 선그리기.
			_this.pathRelation['end'][idx1++] = "m 0 -5";
			_this.pathRelation['end'][idx1++] = "m -"+_this.CONSTANT.LINE+" 0";
			_this.pathRelation['end'][idx1++] = "l " +(_this.CONSTANT.LINE*2)+" 0";
			_this.pathRelation['end'][idx1++] = "m -"+_this.CONSTANT.LINE+" 0";
			
			if( relation_type == "rel1toN" || relation_type == "rel1to0_1" ) {
				// o그리기..
				_this.pathRelation['end'][idx1++] = "m -"+_this.CONSTANT.CIRCLE_RADIUS+ " 0";
				_this.pathRelation['end'][idx1++] = "m 0 -"+_this.CONSTANT.CIRCLE_RADIUS+1;
				_this.pathRelation['end'][idx1++] = "a "+_this.CONSTANT.CIRCLE_RADIUS+","+_this.CONSTANT.CIRCLE_RADIUS + " 0 1,0 " +(_this.CONSTANT.CIRCLE_RADIUS*2) +",0";
				_this.pathRelation['end'][idx1++] = "a "+_this.CONSTANT.CIRCLE_RADIUS+","+_this.CONSTANT.CIRCLE_RADIUS + " 0 1,0 -" +(_this.CONSTANT.CIRCLE_RADIUS*2) +",0";
				_this.pathRelation['end'][idx1++] = "m -"+_this.CONSTANT.CIRCLE_RADIUS+" 0";
			}

			var idx2 = 0;
			_this.pathRelation['outline_end'][idx2++] = "l 0 " +(_this.CONSTANT.PADDING);

		} 
		// 시작점 좌측
		else if( _this.end["position"] == 'l') {
			var idx1 = 0;
			// 1:n 선그리기
			_this.pathRelation['end'][idx1++] = "l " + _this.CONSTANT.PADDING + " 0";
			if( relation_type == "rel1toN" ) {
				_this.pathRelation['end'][idx1++] = "m -5 0";
				_this.pathRelation['end'][idx1++] = "l 5 5"; 
				_this.pathRelation['end'][idx1++] = "m -5 -5";
				_this.pathRelation['end'][idx1++] = "l 5 -5";
				_this.pathRelation['end'][idx1++] = "m 0 5";
			}
			
			// 1:1 선그리기.
			_this.pathRelation['end'][idx1++] = "m -5 0";
			_this.pathRelation['end'][idx1++] = "m 0 -"+_this.CONSTANT.LINE;
			_this.pathRelation['end'][idx1++] = "l 0 " +(_this.CONSTANT.LINE*2);
			_this.pathRelation['end'][idx1++] = "m 0 -"+_this.CONSTANT.LINE;
			
			if( relation_type == "rel1toN" || relation_type == "rel1to0_1" ) {
				// o그리기..
				_this.pathRelation['end'][idx1++] = "m -"+((_this.CONSTANT.CIRCLE_RADIUS*3)+1)+" 0";
				_this.pathRelation['end'][idx1++] = "m "+_this.CONSTANT.CIRCLE_RADIUS+" "+0;
				_this.pathRelation['end'][idx1++] = "a "+_this.CONSTANT.CIRCLE_RADIUS+","+_this.CONSTANT.CIRCLE_RADIUS + " 0 1,0 " +(_this.CONSTANT.CIRCLE_RADIUS*2) +",0";
				_this.pathRelation['end'][idx1++] = "a "+_this.CONSTANT.CIRCLE_RADIUS+","+_this.CONSTANT.CIRCLE_RADIUS + " 0 1,0 -" +(_this.CONSTANT.CIRCLE_RADIUS*2) +",0";
				_this.pathRelation['end'][idx1++] = "m 0 -"+_this.CONSTANT.CIRCLE_RADIUS;
			}
			
			var idx2 = 0;
			_this.pathRelation['outline_end'][idx2++] = "l " +(_this.CONSTANT.PADDING)+ " 0";

		} 
		// 시작점 우측
		else if( _this.end["position"] == 'r') {
			var idx1 = 0;
			// 1:n 선그리기
			_this.pathRelation['end'][idx1++] = "l -" + _this.CONSTANT.PADDING + " 0";
			_this.pathRelation['end'][idx1++] = "m 5 0";
			if( relation_type == "rel1toN" ) {
				_this.pathRelation['end'][idx1++] = "l -5 -5"; 
				_this.pathRelation['end'][idx1++] = "m 5 5";
				_this.pathRelation['end'][idx1++] = "l -5 5";
				_this.pathRelation['end'][idx1++] = "m 5 -5";
			}
			
			// 1:1 선그리기.
			_this.pathRelation['end'][idx1++] = "m 0 -"+_this.CONSTANT.LINE;
			_this.pathRelation['end'][idx1++] = "l 0 " +(_this.CONSTANT.LINE*2);
			_this.pathRelation['end'][idx1++] = "m 0 -"+_this.CONSTANT.LINE;
			
			if( relation_type == "rel1toN" || relation_type == "rel1to0_1" ) {
				// o그리기..
				_this.pathRelation['end'][idx1++] = "a "+_this.CONSTANT.CIRCLE_RADIUS+","+_this.CONSTANT.CIRCLE_RADIUS + " 0 1,0 " +(_this.CONSTANT.CIRCLE_RADIUS*2) +",0";
				_this.pathRelation['end'][idx1++] = "a "+_this.CONSTANT.CIRCLE_RADIUS+","+_this.CONSTANT.CIRCLE_RADIUS + " 0 1,0 -" +(_this.CONSTANT.CIRCLE_RADIUS*2) +",0";
				_this.pathRelation['end'][idx1++] = "m 0 -"+_this.CONSTANT.CIRCLE_RADIUS;
			}
			
			var idx2 = 0;
			_this.pathRelation['outline_end'][idx2++] = "l -" +(_this.CONSTANT.PADDING)+ " 0";


		}
		// 시작점 하단
		else if( _this.end["position"] == 'b') {
			var idx1 = 0;
			// 1:n 선그리기
			_this.pathRelation['end'][idx1++] = "l 0 -" + _this.CONSTANT.PADDING;
			if( relation_type == "rel1toN" ) {
				_this.pathRelation['end'][idx1++] = "m 0 5";
				_this.pathRelation['end'][idx1++] = "l -5 -5"; 
				_this.pathRelation['end'][idx1++] = "m 5 5";
				_this.pathRelation['end'][idx1++] = "l 5 -5";
				_this.pathRelation['end'][idx1++] = "m -5 0";
			}
			
			// 1:1 선그리기.
			_this.pathRelation['end'][idx1++] = "m 0 5";
			_this.pathRelation['end'][idx1++] = "m -"+_this.CONSTANT.LINE+" 0";
			_this.pathRelation['end'][idx1++] = "l " +(_this.CONSTANT.LINE*2)+" 0";
			_this.pathRelation['end'][idx1++] = "m -"+_this.CONSTANT.LINE+" 0";
			
			if( relation_type == "rel1toN" || relation_type == "rel1to0_1" ) {
				// o그리기..
				_this.pathRelation['end'][idx1++] = "m -"+_this.CONSTANT.CIRCLE_RADIUS+ " 0";
				_this.pathRelation['end'][idx1++] = "m 0 "+_this.CONSTANT.CIRCLE_RADIUS+1;
				_this.pathRelation['end'][idx1++] = "a "+_this.CONSTANT.CIRCLE_RADIUS+","+_this.CONSTANT.CIRCLE_RADIUS + " 0 1,0 " +(_this.CONSTANT.CIRCLE_RADIUS*2) +",0";
				_this.pathRelation['end'][idx1++] = "a "+_this.CONSTANT.CIRCLE_RADIUS+","+_this.CONSTANT.CIRCLE_RADIUS + " 0 1,0 -" +(_this.CONSTANT.CIRCLE_RADIUS*2) +",0";
				_this.pathRelation['end'][idx1++] = "m -"+_this.CONSTANT.CIRCLE_RADIUS+" 0";
			}
			
			
			var idx2 = 0;
			_this.pathRelation['outline_end'][idx2++] = "l 0 -" +(_this.CONSTANT.PADDING);

		}
	}
	
	this.front = function() {
		var _this = this;
		console.log( _this.relationPath );
		_this.relationPath.front();
		_this.relationPathOutlint.front();

		for(var x in _this.pathMover ) {
			_this.pathMover[x].front();
		}
	}
	
	/*
	 * 라인 이동용..
	 */
	this.makeMover = function(mover_index) {
		var _this = this;
		
		_this.moverDisplayMode = "make";
				
		_this.pathList = _this.pathRelation['paths'].slice(); ;

		_this.trans = {x:_this.start["x"], y:_this.start["y"]};
		_this.gap = {x:_this.start["x"], y:_this.start["y"]};
		
		var moversPos = _this.getRelationPathArray();
		
		for( var i=0;i<moversPos.length; i++ ) {
			/*
			if( mover_index != undefined && i== mover_index ) {
				continue;
			}
			*/
			var moverPos = moversPos[i];

			// console.log( moverPos );
			if( i!= 0 && i!= moversPos.length-1) {
				_this.moverBase[i] = { direction : moverPos[0], idx : moverPos[3] };
			}

			//console.log( _this.moverBaseStart );
			//console.log( _this.moverBaseEnd );
			
			_this.pathMover[i] = _this.draw.rect(_this.CONSTANT.MOVER.NARROW, _this.CONSTANT.MOVER.NARROW )
				.attr({ 
					  stroke: 'none' // #0000ff'
					, fill: '#00f'
				// , 'stroke-width': 1
				})
				.transform({
					translate: [moverPos[1], moverPos[2] ]
				})
				.addClass("rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_" + _this.tableInfo["ENTITY_ID"] + "_"+ _this.relationInfo["RELATION_ID"] )
				.remember("type", "mover")
				.remember("mover_index", i)
				.remember("relation_SorE", i==0 ? "start" : ((i == moversPos.length-1) ? "end" : ""))
				.remember("direction", moverPos[0]).remember("tx", moverPos[1]).remember("ty", moverPos[2])
				.remember("position", i==0 ? _this.start["position"] : ((i == moversPos.length-1) ? _this.end["position"] : ""))
				//.opacity(0.4)
				.draggable(true, (moverPos[0]=="x" ?  "h" : "v"), _this.relationInfo, i==0 ? "START" : ((i == moversPos.length-1) ? "END" : "") )
				.attr("cursor", (moverPos[0]=="y" ?  "s-resize" : "e-resize"));
			
			if( _this.pathMover[i].remember("relation_SorE") == "start" || _this.pathMover[i].remember("relation_SorE") == "end" ) {
				if( _this.pathMover[i].remember("direction") == "x"  ) {
					for( var idx=_this.pathRelation["paths"].length-1; idx>0; idx--) {
						var ps = _this.pathRelation["paths"][idx].split(' ');
						if( ps[1] != '0' && ps[2] == '0' ) {
							if( _this.pathMover[i].remember("relation_SorE") == "start" && _this.moverBaseStart["direction"] != "x" ){
								
								_this.moverBaseStart["line"] =  ps[0];
								_this.moverBaseStart["x"] = parseInt(ps[1]);
								_this.moverBaseStart["y"] = parseInt(ps[2]);
								_this.moverBaseStart["idx"] = idx;
								_this.moverBaseStart["direction"] = "x"; 
								// , mx : 0, my : 0
								//_this.moverBaseEnd = {line : ps[0], x : parseInt(ps[1]), y : parseInt(ps[2]), idx : idx , direction : "x"}; // , mx : 0, my : 0
							} 
							if(  _this.pathMover[i].remember("relation_SorE") == "end" && _this.moverBaseEnd["direction"] != "x" ){
								_this.moverBaseStart["line"] =  ps[0];
								_this.moverBaseStart["x"] = parseInt(ps[1]);
								_this.moverBaseStart["y"] = parseInt(ps[2]);
								_this.moverBaseStart["idx"] = idx;
								_this.moverBaseStart["direction"] = "x"; 

								// _this.moverBaseEnd = {line : ps[0], x : parseInt(ps[1]), y : parseInt(ps[2]), idx : idx , direction : "x"}; // , mx : 0, my : 0
							}
							break;
						}
					}
				} else if( _this.pathMover[i].remember("direction") == "y" ) {
					for( var idx=_this.pathRelation["paths"].length-1; idx>0; idx--) {
						var ps = _this.pathRelation["paths"][idx].split(' ');
						if( ps[1] == '0' && ps[2] != '0' ) {
							if( _this.pathMover[i].remember("relation_SorE") == "start" && _this.moverBaseStart["direction"] != "y" ){

								_this.moverBaseStart["line"] =  ps[0];
								_this.moverBaseStart["x"] = parseInt(ps[1]);
								_this.moverBaseStart["y"] = parseInt(ps[2]);
								_this.moverBaseStart["idx"] = idx;
								_this.moverBaseStart["direction"] = "y"; 
								
								// _this.moverBaseStart = {line : ps[0], x : parseInt(ps[1]), y : parseInt(ps[2]), idx : idx , direction : "y"}; // , mx : 0, my : 0
							}
							if(  _this.pathMover[i].remember("relation_SorE") == "end" && _this.moverBaseEnd["direction"] != "y" ){
								_this.moverBaseStart["line"] =  ps[0];
								_this.moverBaseStart["x"] = parseInt(ps[1]);
								_this.moverBaseStart["y"] = parseInt(ps[2]);
								_this.moverBaseStart["idx"] = idx;
								_this.moverBaseStart["direction"] = "y"; 
								
								//_this.moverBaseEnd = {line : ps[0], x : parseInt(ps[1]), y : parseInt(ps[2]), idx : idx , direction : "y"}; // , mx : 0, my : 0
							}
							break;
						}
					}
				}
			}
				
			
			_this.pathMover[i].on("dragstart", function(ev) {
				var mover_rect = ev.target.instance;
				var mover_index = mover_rect.remember("mover_index") ; 
				
				if( mover_rect.remember("relation_SorE") == "start" && _this.moverDisplayMode == "relocate") {
					var p = _this.pathRelation['start_info'].split(' ');
					_this.pathRelation['start_info'] = p[0] + " " + (parseInt(p[1])-_this.moverBaseStart["mx"]) + " " + (parseInt(p[2])-_this.moverBaseStart["my"]);
				}

				// 다른 관계 mover를 숨긴다...
				// _this.hideMover(mover_index);
				_this.removeMover(mover_index);
				_this.drawDataLoad.setCursorStatus( ev.target.instance.remember('cursor') );
				
				var tableStart = _this.drawDataLoad.getDrawedTable(_this.relationInfo["SUBJECT_ID"], _this.relationInfo["START_ENTITY_ID"]);
				var tableEnd = _this.drawDataLoad.getDrawedTable(_this.relationInfo["SUBJECT_ID"], _this.relationInfo["END_ENTITY_ID"]);
				
				tableStart.tableGrp.off('mousemove', tableStart.onmousemove);
				tableEnd.tableGrp.off('mousemove', tableEnd.onmousemove);
				
				ev.stopPropagation();
			});


			_this.pathMover[i].on("dragmove", function(ev) {
				var mover_rect = ev.target.instance;
				var mover_index = mover_rect.remember("mover_index") ; 
				var _mover_box = ev.detail.box;
				var mover_box = {};
				mover_box["x"] = Math.ceil(_mover_box.x);
				mover_box["y"] = Math.ceil(_mover_box.y);
				
				
				// 시작 mover
				if( mover_rect.remember("relation_SorE") == "start" ) {
					var pathPre = _this.pathRelation['start_info'].split(' ');
					
					mover_box["sx"] = mover_rect.transform('translateX')+mover_rect.x()+mover_rect.width()/2;
					mover_box["sy"] = mover_rect.transform('translateY')+mover_rect.y()+mover_rect.height()/2;

					//console.log( ev.detail.position, _this.start );
					//console.log( ev.detail.position, _this.end );

					_this.start = { position :  ev.detail.position, x : mover_box["sx"], y : mover_box["sy"] };
					// _this.start = { position :  ev.detail.position, x : (parseInt(pathPre[1]) + parseInt(mover_box.x)), y : (parseInt(pathPre[2]) + parseInt(mover_box.y)) };
					_this.moverBaseStart["mx"]=mover_box.x;
					_this.moverBaseStart["my"]=mover_box.y;

					var tableGrpStart = SVG(".table_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["START_ENTITY_ID"]);
					var tableRectStart = SVG(".rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["START_ENTITY_ID"]);
					var tableGrpBoxStart = { 
									left : Math.ceil(tableGrpStart.transform().translateX)
								 , top : Math.ceil(tableGrpStart.transform().translateY)
								 , right : Math.ceil(tableGrpStart.transform().translateX + tableRectStart.width())
								 , bottom : Math.ceil(tableGrpStart.transform().translateY + tableRectStart.height()) + 12  // DrawTable.CONSTANT.COLUMN_HIGHT
								};

					var tableGrpEnd = SVG(".table_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["END_ENTITY_ID"]);
					var tableRectEnd = SVG(".rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["END_ENTITY_ID"]);
					
					var tableGrpBoxEnd = { 
									left : Math.ceil(tableGrpEnd.transform().translateX)
								 , top : Math.ceil(tableGrpEnd.transform().translateY)
								 , right : Math.ceil(tableGrpEnd.transform().translateX + tableRectEnd.width())
								 , bottom : Math.ceil(tableGrpEnd.transform().translateY + tableRectEnd.height()) + 12  // DrawTable.CONSTANT.COLUMN_HIGHT
								};
					
						  console.log( ((_this.start["position"] == "t" && _this.end["position"] == "b")||(_this.start["position"] == "b" && _this.end["position"] == "t"))
						  , _this.pathRelation['paths'].length == 3 && _this.pathRelation['paths'][1] == "l 0 0" 
						  ,mover_box["sx"]>=tableGrpBoxStart.left && mover_box["sx"]<=tableGrpBoxStart.right	
						  , mover_box["sx"]>=tableGrpBoxEnd.left && mover_box["sx"]<=tableGrpBoxEnd.right  )
					
					if( ((_this.start["position"] == "l" && _this.end["position"] == "r")
						 ||(_this.start["position"] == "r" && _this.end["position"] == "l"))
						&& _this.pathRelation['paths'].length == 3 && _this.pathRelation['paths'][1] == "l 0 0"
						&& mover_box["sy"]>=tableGrpBoxStart.top && mover_box["sy"]<=tableGrpBoxStart.bottom 
						&& mover_box["sy"]>=tableGrpBoxEnd.top && mover_box["sy"]<=tableGrpBoxEnd.bottom ) {

						_this.end["y"] =  mover_box["sy"];
						
						_this.pathRelation['start'][0] = "M " + mover_box["sx"] + " " + mover_box["sy"];
						_this.pathRelation['outline_start'][0] = "M " + mover_box["sx"] + " " + mover_box["sy"];
						
						_this.plot(_this.pathRelation['paths']);
					}else if( ((_this.start["position"] == "t" && _this.end["position"] == "b")
						 ||(_this.start["position"] == "b" && _this.end["position"] == "t"))
						&& _this.pathRelation['paths'].length == 3 && _this.pathRelation['paths'][1] == "l 0 0" 
						&& mover_box["sx"]>=tableGrpBoxStart.left && mover_box["sx"]<=tableGrpBoxStart.right 
						&& mover_box["sx"]>=tableGrpBoxEnd.left && mover_box["sx"]<=tableGrpBoxEnd.right 
						 ) {
						_this.end["x"] =  mover_box["sx"];
						
						_this.pathRelation['start'][0] = "M " + mover_box["sx"] + " " + mover_box["sy"];
						_this.pathRelation['outline_start'][0] = "M " + mover_box["sx"] + " " + mover_box["sy"];
						
						_this.plot(_this.pathRelation['paths']);
					}else {
						//console.log( " >> ev.detail", ev.detail );
						_this.relationType["pre"] = "";
						_this.relationType["now"] = "init";
						_this.drawRelation('mover_move', mover_index );

						//
						_this.pathRelation['outline_start'][0] = _this.pathRelation['start'][0];
						// console.log( _this.pathRelation['outline_start'] );
						//console.log( "dragmove", _this.start_init );
						_this.start_init = JSON.parse(JSON.stringify(_this.start));
						
						_this.plot(_this.pathRelation['paths']);
					}
				} 
				// 마지막 mover
				else if( mover_rect.remember("relation_SorE") == "end" ) {
					mover_box["ex"] = Math.ceil(mover_rect.transform('translateX')+mover_rect.x()+mover_rect.width()/2);
					mover_box["ey"] = Math.ceil(mover_rect.transform('translateY')+mover_rect.y()+mover_rect.height()/2);
					
					_this.end = { position :  ev.detail.position, x : mover_box["ex"], y : mover_box["ey"] };

					_this.relationType["pre"] = "";
					_this.relationType["now"] = "init";
					_this.drawRelation('mover_move', mover_index);

					_this.plot(_this.pathRelation['paths']);
				} 
				// 중간 mover
				else {

					var drag_direction = mover_rect.remember("direction");
					console.log( drag_direction );
					
					var direction = _this.moverBase[mover_index].direction;
					var idx = _this.moverBase[mover_index].idx;
					
					_this.pathRelation['paths_relation_move'] = _this.pathRelation['paths'].slice();
					
					
					
					if( direction == "x" ) {
						var pPre = _this.pathRelation['paths'][idx-1].split(' ');
						_this.pathRelation['paths_relation_move'][idx-1] = pPre[0] + " " + (parseInt(pPre[1]) + mover_box["x"]  ) + " " + pPre[2];
						var pPost = _this.pathRelation['paths'][idx+1].split(' ');
						_this.pathRelation['paths_relation_move'][idx+1] = pPost[0] + " " + (parseInt(pPost[1]) - mover_box["x"]  ) + " " + pPost[2];
					} else if( direction == "y" ) {
						var pPre = _this.pathRelation['paths'][idx-1].split(' ');
						_this.pathRelation['paths_relation_move'][idx-1] = pPre[0] + " " + pPre[1] + " " + (parseInt(pPre[2]) + mover_box["y"]  );
						var pPost = _this.pathRelation['paths'][idx+1].split(' ');
						_this.pathRelation['paths_relation_move'][idx+1] = pPost[0] + " " + pPost[1] + " " + (parseInt(pPost[2]) - mover_box["y"]  );

					}
					
					_this.plot(_this.pathRelation['paths_relation_move']);
				}
				
				// _this.setRelationStartEndValue(ev);

				if( ev.detail.position == "t" || ev.detail.position == "b" ) {
					_this.draw.attr({"cursor": "e-resize"});
				} else if( ev.detail.position == "l" || ev.detail.position == "r" ) {
					_this.draw.attr({"cursor": "s-resize"});
				} 
				ev.stopPropagation();
			});
			
			_this.pathMover[i].on("dragend", function(ev) {
				var mover_rect = ev.target.instance;
				var mover_index = mover_rect.remember("mover_index") ; 
				var _mover_box = ev.detail.box;
				var mover_box = {x:Math.ceil(_mover_box.x), y:Math.ceil(_mover_box.y)} ;
				
				/*
				if( mover_rect.remember("relation_SorE") == "start" ) {
					if( _this.moverBaseStart["idx"] == _this.moverBaseEnd["idx"] ) {
						_this.moverBaseEnd["x"] -= _this.moverBaseEnd["mx"];
						_this.moverBaseEnd["y"] -= _this.moverBaseEnd["my"];
					}
				} 
				else if( mover_rect.remember("relation_SorE") == "end" ) {
					if( _this.moverBaseStart["idx"] == _this.moverBaseEnd["idx"] ) {
						_this.moverBaseStart["x"] += _this.moverBaseStart["mx"];
						_this.moverBaseStart["y"] += _this.moverBaseStart["my"];
					}
				}
				*/
				// 시작 mover
				if( mover_rect.remember("relation_SorE") == "start" ) {
					// x축이동(t, b일 경우)
					if( mover_rect.remember("direction") == "x" ) {
						_this.moverBaseStart["mx"]=mover_box.x;
					}
					// y축이동(l, r일 경우)
					else if (mover_rect.remember("direction") == "y") {
						_this.moverBaseStart["my"]=mover_box.y;
					}

					var tableGrp = SVG(".table_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["START_ENTITY_ID"]);
					var tableRect = SVG(".rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["START_ENTITY_ID"]);
					var tableGrpBox = { 
									left : Math.ceil(tableGrp.transform().translateX)
								 , top : Math.ceil(tableGrp.transform().translateY)
								 , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
								 , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 12  // DrawTable.CONSTANT.COLUMN_HIGHT
								};
					
					if( _this.start["position"] == "t" && _this.start["y"] != tableGrpBox.top ) {
						_this.start["y"] = tableGrpBox.top;
					}  else if( _this.start["position"] == "l" && _this.start["x"] != tableGrpBox.left ) {
						_this.start["x"] = tableGrpBox.left;
					} else if( _this.start["position"] == "r" && _this.start["x"] != tableGrpBox.right ) {
						_this.start["x"] = tableGrpBox.right;
					} else if( _this.start["position"] == "b" && _this.start["y"] != tableGrpBox.bottom ) {
						_this.start["y"] = tableGrpBox.bottom;
					}

					
					console.log( _this.moverBaseStart );
					console.log( _this.moverBaseEnd );

					_this.pathRelation['start_info'] = _this.pathRelation['start'][0];
				}
				// 마지막 mover
				else if( mover_rect.remember("relation_SorE") == "end" ) {
					// x축이동(t, b일 경우)
					if( mover_rect.remember("direction") == "x" ) {
						_this.moverBaseEnd["mx"]=mover_box.x;
					}
					// y축이동(l, r일 경우)
					else if (mover_rect.remember("direction") == "y") {
						_this.moverBaseEnd["my"]=mover_box.y;
					}
					
					var tableGrp = SVG(".table_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["END_ENTITY_ID"]);
					var tableRect = SVG(".rect_"+_this.subjectAreaInfo["SUBJECT_ID"]+"_"+_this.relationInfo["END_ENTITY_ID"]);
					
					var tableGrpBox = { 
									left : Math.ceil(tableGrp.transform().translateX)
								 , top : Math.ceil(tableGrp.transform().translateY)
								 , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
								 , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 12  // DrawTable.CONSTANT.COLUMN_HIGHT
								};
					
					if( _this.end["position"] == "t" && _this.end["y"] != tableGrpBox.top-1 ) {
						_this.end["y"] = tableGrpBox.top-1;
					}  else if( _this.end["position"] == "l" && _this.end["x"] != tableGrpBox.left ) {
						_this.end["x"] = tableGrpBox.left;
					} else if( _this.end["position"] == "r" && _this.end["x"] != tableGrpBox.right ) {
						_this.end["x"] = tableGrpBox.right;
					} else if( _this.end["position"] == "b" && _this.end["y"] != tableGrpBox.bottom ) {
						_this.end["y"] = tableGrpBox.bottom;
					}
				} else {
 					_this.pathRelation['paths'] = _this.pathRelation['paths_relation_move'].slice();
					_this.drawDataLoad.setRelationPathValue(  _this.relationInfo["SUBJECT_ID"], _this.relationInfo["RELATION_ID"], _this.pathRelation['paths'] );
					
				
				}
				//console.log( "ev.detail.position", ev.detail.position,  );
				//console.log( "_this.start_init",  _this.start_init );
				//console.log( "mover_box",  mover_box );
				
				
				//console.log( "dragend", _this.start );
				_this.plot(_this.pathRelation['paths']);
				
				_this.setRelationStartEndValue(ev);
				
				_this.removeMover();
				// 연결선 이동용 mover생성 TODO
				_this.makeMover(mover_index);
				/*
				var tableStart = _this.drawDataLoad.getDrawedTable(_this.relationInfo["SUBJECT_ID"], _this.relationInfo["START_ENTITY_ID"]);
				var tableEnd = _this.drawDataLoad.getDrawedTable(_this.relationInfo["SUBJECT_ID"], _this.relationInfo["END_ENTITY_ID"]);
				tableStart.tableGrp.on('mousemove', tableStart.onmousemove);
				tableEnd.tableGrp.on('mousemove', tableEnd.onmousemove);
				*/
				
				_this.drawDataLoad.setCursorStatus(null);
				// _this.relocateMover();
			});
		}
	}
	
	this.setRelationStartEndValue = function( ev ) {
		var _this = this;
		var mover_rect = ev.target.instance;
		var mover_index = mover_rect.remember("mover_index") ; 
		var mover_box = ev.detail.box;
		
		if( mover_rect.remember("relation_SorE") == "start" ) {
			var _position = ev.detail.position != "" ? ev.detail.position : _this.start["position"] ; 
			var pathPre = _this.pathRelation['start_info'].split(' ');
			// _this.start = { position : _position, x : parseInt(pathPre[1]) + parseInt(mover_box.x), y : parseInt(pathPre[2]) + parseInt(mover_box.y) };
			_this.start = { position : _position, x : parseInt(pathPre[1]), y : parseInt(pathPre[2]) };
		}
		else if( mover_rect.remember("relation_SorE") == "end" ) {
			var _position = ev.detail.position != "" ? ev.detail.position : _this.end["position"] ; 
			var pathPre = _this.pathRelation['end_info'].split(' ');
			//console.log( "_this.end", _this.pathRelation['end_info'] );
			
			_this.end = { position : _position, x : parseInt(pathPre[1]), y : parseInt(pathPre[2]) };
		
			//console.log( "_this.end", _this.end);
		}
		else {
			
		}

		_this.caculateRelativeXYOfStart(mover_rect.remember("relation_SorE"), ev);

	}
	
	this.deleteRelation = function(){
		this.relationPath.remove();
	
		this.relationPathEnd.remove();
		
		this.relationPathOutlint.remove();
	}
}

/*

						// 상단
						if( _this.end["position"] == "t" ) {
						
						
						}
						// 좌측
						else if( _this.end["position"] == "l" ) {

						}
						// 우측
						else if( _this.end["position"] == "r" ) {
							
						}
						// 하단
						else if( _this.end["position"] == "b" ) {
							
						}
						
*/