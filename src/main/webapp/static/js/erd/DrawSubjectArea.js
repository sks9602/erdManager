/**
 * Subject Area 그리기. 
 */
var DrawSubjectArea = function(subjectAreaDatas, index, drawDataLoad) {
    var _this = this;
    this.subjectAreaData = subjectAreaDatas[index];
    this.drawDataLoad = drawDataLoad;
    this.area = { width : this.subjectAreaData["WIDTH"]||4000, height : this.subjectAreaData["HEIGHT"]||3000 };
    // TODO jQuery로 div 추가.. 
    // console.log( this.subjectAreaData, this.area )
    this.draw = SVG().addTo( "#"+this.subjectAreaData["SUBJECT_ID"] ).size( this.area.width , this.area.height );
    
    this.verticalText = new Array();
    this.horizontalText = new Array();
    
    this.phantomTableRect = _this.draw.rect(10, 10).attr({stroke: 'black', 'stroke-width': 0.5, fill: '#fff'}).hide();
    this.phantomTableText = this.draw.text("").hide();
    this.phantomViewRect = _this.draw.rect(10, 10).attr({stroke: 'black', 'stroke-width': 0.5, fill: '#fff', 'stroke-dasharray' : "2,2"}).hide();
    this.phantomViewText = this.draw.text("").hide();
    this.phantomRelation1toNPath = " l 0 4 l 4 0 l 0 5 m 0 -3 l 3 3 m -3 -3 l -3 3 m 3 0";
    this.phantomRelation1to1Path = " l 0 4 l 4 0 l 0 5";
    this.phantomRelation1to0_1Path = " l 0 4 l 4 0 l 0 5 m -2 0 m 0 -3 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0 m -2 0";
    this.phantomRelation1toN = _this.draw.path("M 0 0"+this.phantomRelation1toNPath).attr({stroke: 'black', 'stroke-width': 0.5, fill: '#fff'}).hide();
    this.phantomRelation1to1 = _this.draw.path("M 0 0"+this.phantomRelation1to1Path).attr({stroke: 'red', 'stroke-width': 0.5, fill: '#fff'}).hide();
    this.phantomRelation1to0_1 = _this.draw.path("M 0 0"+this.phantomRelation1to0_1Path).attr({stroke: 'red', 'stroke-width': 0.5, fill: '#fff'}).hide();
    this.phantomRelationNonIden = _this.draw.path("M 0 0"+this.phantomRelation1toNPath).attr({stroke: 'red', 'stroke-width': 0.5, fill: '#fff', 'stroke-dasharray' : '1,1'}).hide();
    
    this.areaRect = this.draw.rect( 0 , 0).attr({stroke: 'black', 'stroke-width': 0.3, fill: "none", 'stroke-dasharray' : '1,1'}).hide();
    
    _this.draw.mouseout(function(ev){
         _this.phantomTableRect.hide();
         _this.phantomTableText.hide();
         _this.phantomViewRect.hide();
         _this.phantomViewText.hide();
         _this.phantomRelation1toN.hide();
         _this.phantomRelation1to1.hide();
         _this.phantomRelation1to0_1.hide();
         _this.phantomRelationNonIden.hide();
    });
    
    _this.draw.mousedown(function(ev) {
        var subjectAreaInfo = subjectAreaDatas[index];
        
        var scroll = { top : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollTop() , left : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollLeft()};

        _this.drawDataLoad.setSelectRectangular('subject', {INIT_X : ev.layerX+scroll.left, INIT_Y:ev.layerY+scroll.top, X : ev.layerX+scroll.left, Y:ev.layerY+scroll.top});
        console.log( "mousedown")
        if( Ext.getCmp('DRAW_BUTTON').getValue() == 'pointer' && _this.drawDataLoad.getSelectRectangular()["OBJECT"] != "table") {
            _this.drawDataLoad.setSelectedTables( null, null, false);
            
            var areaSelect = _this.drawDataLoad.getSelectRectangular();
            
            _this.areaRect.transform({
                    translate: [areaSelect["X"], areaSelect["Y"]], // [4, 12+4]
                }).front().show();
        }
        
    })

    _this.draw.mouseup(function(ev) {
        console.log( "mouseup")
 
        _this.areaRect.size(0,0).hide();
    });

    _this.draw.mousemove(function(ev) {
        // console.log( "mousemove")
        
        var subjectAreaInfo = subjectAreaDatas[index];
        
        var scroll = { top : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollTop() , left : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollLeft()};
        if( Ext.getCmp('DRAW_BUTTON').getValue() == 'pointer' &&  _this.drawDataLoad.getSelectRectangular()["OBJECT"] == 'subject') {
            var areaSelect = _this.drawDataLoad.getSelectRectangular();
            
            var rectInfo = {   translateX : Math.min( ev.layerX+scroll.left, areaSelect["INIT_X"])
                              ,translateY : Math.min( ev.layerY+scroll.top, areaSelect["INIT_Y"])
                              ,sizeX : Math.max(ev.layerX+scroll.left-areaSelect["INIT_X"], areaSelect["INIT_X"]-ev.layerX-scroll.left)
                              ,sizeY : Math.max(ev.layerY+scroll.top-areaSelect["INIT_Y"], areaSelect["INIT_Y"]-ev.layerY-scroll.top)
                            };

            _this.drawDataLoad.setSelectRectangular('subject', {X : rectInfo.translateX, 
                                                                Y :  rectInfo.translateY, 
                                                                WIDTH : rectInfo.sizeX, 
                                                                HEIGHT : rectInfo.sizeY });

            _this.areaRect.transform({
                translate: [rectInfo.translateX, rectInfo.translateY], // [4, 12+4]
            }).size( rectInfo.sizeX, rectInfo.sizeY );
            
            return;
        }

 
         if( _this.drawDataLoad.getCursorStatus() != null ) {
           _this.draw.attr({"cursor": _this.drawDataLoad.getCursorStatus() })
           return;
         }
      
         if( Ext.getCmp('DRAW_BUTTON').getValue() == 'table' ) {
             
           
           _this.phantomTableRect.show();
           _this.phantomTableText.remove();
           // 이미 등록된 테이블을 추가할 경우 테이블명을 표시..
           if( drawDataLoad.getEntityForAddSubject().ENTITY_ID && drawDataLoad.getEntityForAddSubject().ENTITY_TCD == "TABLE" ) {
                _this.phantomTableText = _this.draw.text(drawDataLoad.getEntityForAddSubject().TABL_NM);
                _this.phantomTableText.show();
           }
           _this.phantomTableText.show();
           _this.phantomViewRect.hide();
           _this.phantomViewText.hide();
           _this.phantomRelation1toN.hide();
           _this.phantomRelation1to1.hide();
           _this.phantomRelation1to0_1.hide();
           _this.phantomRelationNonIden.hide();
           _this.phantomTableRect.transform({
              translate: [scroll.left + ev.layerX+5, scroll.top + ev.layerY+5],
            });
            // _this.phantomTableText.amove(scroll.left + ev.layerX+15, scroll.top + ev.layerY+5);
            
            _this.phantomTableText.transform({
              translate: [scroll.left + ev.layerX+17, scroll.top + ev.layerY],
            });
            
           _this.draw.attr({"cursor": "crosshair"}).front().front();
         } 
         else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'view' ) {
           _this.phantomTableRect.hide();
           _this.phantomTableText.remove();
           _this.phantomViewRect.show();
           _this.phantomViewText.remove();
           
           // 이미 등록된 테이블을 추가할 경우 테이블명을 표시..
           if( drawDataLoad.getEntityForAddSubject().ENTITY_ID 
                    && (drawDataLoad.getEntityForAddSubject().ENTITY_TCD == "VIEW" || drawDataLoad.getEntityForAddSubject().ENTITY_TCD == "MVIEW"))  {
                _this.phantomViewText = _this.draw.text(drawDataLoad.getEntityForAddSubject().TABL_NM);
                _this.phantomViewText.show();
           }
           _this.phantomViewText.show();
           _this.phantomRelation1toN.hide();
           _this.phantomRelation1to1.hide();
           _this.phantomRelation1to0_1.hide();
           _this.phantomRelationNonIden.hide();
           _this.phantomViewRect.transform({
              translate: [scroll.left + ev.layerX+5, scroll.top + ev.layerY+5],
            });
            _this.phantomViewText.transform({
              translate: [scroll.left + ev.layerX+17, scroll.top + ev.layerY],
            });
           _this.draw.attr({"cursor": "crosshair"}).front().front();
         }          // 1:N관계선
         else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1toN' ) {
           _this.phantomTableRect.hide();
           _this.phantomTableText.remove();
           drawDataLoad.initEntityForAddSubject();
           _this.phantomViewRect.hide();
           _this.phantomViewText.remove();
           _this.phantomRelation1to1.hide();
           _this.phantomRelation1to0_1.hide();
           _this.phantomRelationNonIden.hide();
           _this.phantomRelation1toN.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + _this.phantomRelation1toNPath ).attr({stroke: 'red'}).show().front();
            
           _this.draw.attr({"cursor": "crosshair"});
         } 
         // 1:1관계선
         else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to1' ) {
           _this.phantomTableRect.hide();
           _this.phantomTableText.remove();
           drawDataLoad.initEntityForAddSubject();
           _this.phantomViewRect.hide();
           _this.phantomViewText.remove();
           _this.phantomRelation1toN.hide();
           _this.phantomRelation1to0_1.hide();
           _this.phantomRelationNonIden.hide();
           _this.phantomRelation1to1.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + _this.phantomRelation1to1Path ).show().front();
            
           _this.draw.attr({"cursor": "crosshair"});
         } 
         // 1:0or1관계선
         else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'rel1to0_1' ) {
           _this.phantomTableRect.hide();
           _this.phantomTableText.remove();
           _this.phantomViewText.remove();
           drawDataLoad.initEntityForAddSubject();
           _this.phantomViewRect.hide();
           _this.phantomRelation1toN.hide();
           _this.phantomRelationNonIden.hide();
           _this.phantomRelation1to0_1.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + _this.phantomRelation1to0_1Path ).show().front();
            
           _this.draw.attr({"cursor": "crosshair"});
         } 
         // 1:0or1관계선
         else if( Ext.getCmp('DRAW_BUTTON').getValue() == 'relNonIden' ) {
           _this.phantomTableRect.hide();
           _this.phantomTableText.remove();
           drawDataLoad.initEntityForAddSubject();
           _this.phantomViewRect.hide();
           _this.phantomViewText.remove();
           _this.phantomRelation1toN.hide();
           _this.phantomRelation1to0_1.hide();
           _this.phantomRelationNonIden.plot("M " + (scroll.left + ev.layerX+5) + " " + (scroll.top + ev.layerY+5) + _this.phantomRelation1toNPath ).show().front();
            
           _this.draw.attr({"cursor": "crosshair"});
         } 
         else {
           _this.phantomTableRect.hide();
           _this.phantomTableText.remove();
           drawDataLoad.initEntityForAddSubject();
           _this.phantomViewRect.hide();
           _this.phantomViewText.remove();
           _this.phantomRelation1toN.hide();
           _this.phantomRelation1to1.hide();
           _this.phantomRelation1to0_1.hide();
           _this.phantomRelationNonIden.hide();
           _this.draw.attr({"cursor": "default"});
           // _this.draw.style("cursor", "default");
         }
    });
    
    this.draw.click(function(ev) {

        console.log( "click", _this.drawDataLoad.getSelectRectangular()["OBJECT"]);
        // _this.drawDataLoad.setSelectRectangular('init', ev);
        
        console.log( _this.drawDataLoad.getProjectBuyInfo() );
        
        _this.drawDataLoad.setSelectedRelation(null, null);
        
        var projectBuyInfo = _this.drawDataLoad.getProjectBuyInfo();
        
        
          if( Ext.getCmp('DRAW_BUTTON').getValue() == 'pointer' && _this.drawDataLoad.getSelectRectangular()["OBJECT"] == 'subject') {
             var areaSelect =  _this.drawDataLoad.getSelectRectangular();
             
             _this.drawDataLoad.getTableOnSubjectAreaDatas().forEach(function(item) {
               /*
               console.log( item["ENTITY_ID"]
                    , areaSelect["X"] <= item["X"], areaSelect["Y"] <= item["Y"]
                    , ( areaSelect["X"] + areaSelect["WIDTH"]) >= (item["X"] + item["WIDTH"]||100) 
                    , ( areaSelect["Y"] + areaSelect["HEIGHT"]) >= (item["Y"] + item["HEIGHT"]||100) 
                    );
                 */
                console.log( _this.subjectAreaData )
               if( _this.subjectAreaData["SUBJECT_ID"] == item["SUBJECT_ID"]
                    && areaSelect["X"] <= item["X"] && areaSelect["Y"] <= item["Y"]
                    && ( areaSelect["X"] + areaSelect["WIDTH"]) >= (item["X"] + item["WIDTH"]||100) 
                    && ( areaSelect["Y"] + areaSelect["HEIGHT"]) >= (item["Y"] + item["HEIGHT"]||100) ) {
                        console.log( item["SUBJECT_ID"], item["ENTITY_ID"] );
                        
                        _this.drawDataLoad.getDrawedTable(item["SUBJECT_ID"], item["ENTITY_ID"]).tableGrp.draggable(true);
                        _this.drawDataLoad.setSelectedTables( item["SUBJECT_ID"], item["ENTITY_ID"], true);
                    }
            });
            
            _this.drawDataLoad.setSelectRectangular('init', ev);
 
            _this.areaRect.size(0,0).hide();
   
            return;
          }

          for( var i=1;_this.drawDataLoad.hasUserAuthOfModeler() && i<=3; i++ ) {
              Ext.getCmp("COLOR_BUTTON").items.items[i].setDisabled(false);
          }
                    
          _this.drawDataLoad.setSelectedRelation(null, null);
          _this.drawDataLoad.setSelectedTables( _this.subjectAreaData["SUBJECT_ID"], null  );
           var subjectAreaInfo = subjectAreaDatas[index];
           
           var scroll = { top : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollTop() , left : Ext.getCmp(subjectAreaInfo["SUBJECT_ID"]).getEl().getScrollLeft()};
          
           var point = _this.draw.point(ev.layerX, ev.layerY);
          
          
           // 테이블 추가 일 경우
           if( Ext.getCmp('DRAW_BUTTON').getValue() == 'table' || Ext.getCmp('DRAW_BUTTON').getValue() == 'view') {
                if( !drawDataLoad.getEntityForAddSubject().ENTITY_ID 
                     && projectBuyInfo.ENTITY_CNT >= projectBuyInfo.BUY_ENTITY_CNT ) {
                    Ext.Msg.alert(
                        '오류',
                        '이 프로젝트는 최대 '+projectBuyInfo.BUY_ENTITY_CNT+'개의 ENTITY를 설계가능합니다.'
                    ); 
                    
                    Ext.getCmp('DRAW_BUTTON').setValue('pointer');
                    
                    return;
                }
                
                if( drawDataLoad.getEntityForAddSubject().ENTITY_ID ) {
                    var entity_id = drawDataLoad.getEntityForAddSubject().ENTITY_ID;
                    var tableInfo = drawDataLoad.getTable(subjectAreaInfo["SUBJECT_ID"], entity_id);
                    
                    if( tableInfo == null ) {
                        // alert(tableInfo);
                        
                        tableInfo = drawDataLoad.getEntityById(entity_id);
                        tableInfo["SUBJECT_ID"] = subjectAreaInfo["SUBJECT_ID"];
                        tableInfo["DEL_YN"] = "N";
                        tableInfo["X"] = scroll.left + ev.layerX;
                        tableInfo["Y"] = scroll.top + ev.layerY;
                        Ext.Ajax.request({
                             url: '/entity/data/addToSubject.do',
                             params: tableInfo,
                             success: function(response, opts) {
                                 // 테이블 정보 추가.
                                 drawDataLoad.addTable( tableInfo );
                                 
                                 _this.draw.attr({"cursor": "default"});
                                 
                                 // 상세 테이블 조회 영역 표시..
                                 ErdDrawFunction.loadTableInfo(entity_id, true);
                             },   
                             failure: function(response, opts) {
                                 Ext.Msg.alert(
                                     '오류',
                                     '처리에 실패했습니다.'
                                 );
                             }
                        })
                        
                        
                    } else {
                        tableInfo["DEL_YN"] = "N";
                        tableInfo["X"] = scroll.left + ev.layerX;
                        tableInfo["Y"] = scroll.top + ev.layerY;
                    }
                    
                    // 상태변경
                    var result = drawDataLoad.addEntityToSubject("updateDmlTcd", {"SUBJECT_ID" : subjectAreaInfo["SUBJECT_ID"] , "ENTITY_ID": entity_id, "DML_TCD" : "DML_TCD_D", "X" : tableInfo["X"], "Y" : tableInfo["Y"]})
                    if( result.success ) {
                        
                        drawDataLoad.setDrawedTable(subjectAreaInfo["SUBJECT_ID"], entity_id, new DrawTable( _this.draw, subjectAreaInfo, tableInfo, drawDataLoad ));
                        
                        drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], entity_id).drawTable();
                                
                        drawDataLoad.initEntityForAddSubject(true);

                        var tableGrp = drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], entity_id).getTableGrp();
                        // var tableRelations = drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], entity_id);
                        
                        var tableRelations = drawDataLoad.getTableRelationsInMaster(subjectAreaInfo["SUBJECT_ID"], entity_id);
                        
                        
                        for( var i=0; i<tableRelations.length; i++ ) {
                            var relationInfo = tableRelations[i] ;
                            // relationInfo["DEL_YN"] != "Y" 
                            if( drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["START_ENTITY_ID"])
                                && drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["END_ENTITY_ID"])
                              ) {
                                var boxOfStart = drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["START_ENTITY_ID"]).getTableBox();
                                var boxOfEnd = drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["END_ENTITY_ID"]).getTableBox();
                                
                                var start = {x:50, y:50};
                                
                                relationInfo["START_X"] = start.x;
                                relationInfo["START_Y"] = start.y;
                                
                                if( boxOfStart.right < boxOfEnd.left ) {
                                    relationInfo["START_POSITION"] = "r";
                                    relationInfo["START_X"] = 0;
                                    relationInfo["START_Y"] = (boxOfStart.bottom - boxOfStart.top)/2;
                                    
                                    if( boxOfStart.top > boxOfEnd.bottom ) {
                                        relationInfo["END_POSITION"] = "b";
                                        relationInfo["END_X"] = (boxOfEnd.right - boxOfEnd.left)/2;
                                        relationInfo["END_Y"] = 0;
                                    } else if ( boxOfStart.bottom < boxOfEnd.top ) {
                                        relationInfo["END_POSITION"] = "t";
                                        relationInfo["END_X"] = (boxOfEnd.right - boxOfEnd.left)/2;
                                        relationInfo["END_Y"] = 0;
                                    } else {
                                        relationInfo["END_POSITION"] = "l";
                                        relationInfo["END_X"] = 0;
                                        relationInfo["END_Y"] = (boxOfEnd.bottom - boxOfEnd.top)/2;
                                    }
                                } else if( boxOfStart.left > boxOfEnd.right ) {
                                    relationInfo["START_POSITION"] = "l";
                                    relationInfo["START_X"] = 0;
                                    relationInfo["START_Y"] = (boxOfStart.bottom - boxOfStart.top)/2;
                                    if( boxOfStart.top > boxOfEnd.bottom ) {
                                        relationInfo["END_POSITION"] = "b";
                                        relationInfo["END_X"] = (boxOfEnd.right - boxOfEnd.left)/2;
                                        relationInfo["END_Y"] = 0;
                                    } else if ( boxOfStart.bottom < boxOfEnd.top ) {
                                        relationInfo["END_POSITION"] = "t";
                                        relationInfo["END_X"] = (boxOfEnd.right - boxOfEnd.left)/2;
                                        relationInfo["END_Y"] = 0;
                                    } else {
                                        relationInfo["END_POSITION"] = "r";
                                        relationInfo["START_X"] = 0;
                                        relationInfo["END_X"] = 0;
                                        relationInfo["END_Y"] = (boxOfEnd.bottom - boxOfEnd.top)/2;
                                    }
                                } else {
                                    if( boxOfStart.top > boxOfEnd.bottom ) {
                                        relationInfo["START_POSITION"] = "t";
                                        relationInfo["START_X"] = (boxOfStart.right - boxOfStart.left)/2;
                                        relationInfo["START_Y"] = 0;
                                        relationInfo["END_POSITION"] = "b";
                                        relationInfo["END_X"] = (boxOfEnd.right - boxOfEnd.left)/2;
                                        relationInfo["END_Y"] = 0;
                                    } else if ( boxOfStart.bottom < boxOfEnd.top ) {
                                        relationInfo["START_POSITION"] = "b";
                                        relationInfo["START_X"] = (boxOfStart.right - boxOfStart.left)/2;
                                        relationInfo["START_Y"] = 0;
                                        relationInfo["END_POSITION"] = "t";
                                        relationInfo["END_X"] = (boxOfEnd.right - boxOfEnd.left)/2;
                                        relationInfo["END_Y"] = 0;
                                    }
                                }
                                relationInfo["SUBJECT_ID"] = subjectAreaInfo["SUBJECT_ID"];
                                drawDataLoad.setDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"], new DrawRelation( _this.draw, subjectAreaInfo, tableInfo, drawDataLoad, tableGrp, relationInfo ));
                                drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]).initPath();
                                drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]).drawRelation('init');
                                // 시작, 종료 relation 등록
                                drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["START_ENTITY_ID"]).addRelationStart( drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]));
                                drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["END_ENTITY_ID"]).addRelationEnd( drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]));
                                // 연결선 정보 저장,
                                drawDataLoad.updateRelationInfo("addToSubject", relationInfo); 
                                Ext.getStore("subjectEntityListStore").reload();
                                // console.log( relationInfo );
                            }
                        }


                    }
                } else {
                    ErdAppFunction.addTableWindow( Ext.getCmp('DRAW_BUTTON').getValue().toUpperCase(), _this.draw, _this.drawDataLoad, subjectAreaInfo, scroll, ev);
                }
                /*
                Ext.MessageBox.prompt ( '신규 테이블명 생성', '테이블명', function(buttonId, value) {
                    if( value != "" ) {
                        var tableInfo = { "SUBJECT_ID" : _this.subjectAreaData["SUBJECT_ID"],  "ENTITY_ID" : "id_"+Math.floor( ( Math.random() * (100000 - 1) + 1 ) ) , "TABLE_NM" : "임시테이블", "ENTITY_NM": value, "IS_SUB_TABLE" : false, "X" : scroll.left + ev.layerX, "Y" : scroll.top + ev.layerY, "HEIGHT" : 100, "HAS_PK" : false };
                        
                      _this.drawDataLoad.setDrawedTable(_this.subjectAreaData["SUBJECT_ID"], tableInfo["ENTITY_ID"], new DrawTable( _this.draw, _this.subjectAreaData, tableInfo, _this.drawDataLoad ));
                      
                      _this.drawDataLoad.getDrawedTable(_this.subjectAreaData["SUBJECT_ID"], tableInfo["ENTITY_ID"]).drawTable();
                        
                          _this.drawDataLoad.addTable( tableInfo );
                          
                           Ext.getCmp('DRAW_BUTTON').setValue('pointer');
                           
                           $( "#minimap" ).html('');
                           $( "#minimap" ).minimap( $("#"+ _this.subjectAreaData["SUBJECT_ID"] ) );
                      } else {
                      Ext.MessageBox.alert("안내","테이블명을 입력하세요.");
                    }
                });
                */
            } else if(Ext.getCmp('DRAW_BUTTON').getValue().substring(0, 3) == "rel") {
                var doms = Ext.dom.Query.select('div.x-window');
                if( !doms || doms.length == 0 ) {
                    Ext.MessageBox.alert("안내","관계를 연결할 테이블을 선택하세요.");
                }
                
            }
            
            for(var x in _this.drawDataLoad.getDrawedRelation( _this.subjectAreaData["SUBJECT_ID"])) {
                _this.drawDataLoad.getDrawedRelation( _this.subjectAreaData["SUBJECT_ID"], x).removeMover();
            }
            
            for(var x in _this.drawDataLoad.getDrawedTable( _this.subjectAreaData["SUBJECT_ID"])) {
                // _this.drawDataLoad.getDrawedTable( _this.subjectAreaData["SUBJECT_ID"], x).hideResizer();
            }
            /*
            for(var x in _this.drawDataLoad.getDrawedRelation( _this.subjectAreaData["SUBJECT_ID"])) {
                _this.drawDataLoad.getDrawedRelation( _this.subjectAreaData["SUBJECT_ID"], x).removeMover();
            }
            */

          // ok
          Ext.getCmp('ERD-SUBJECTS').scrollTo(500, 500, true);
          
          Ext.getDoc(subjectAreaInfo["SUBJECT_ID"]).scrollTo(1000, 1000);
          Ext.get('ERD-SUBJECTS-body').scrollTo('top', 1000);
          Ext.get('ERD-SUBJECTS-body').scrollTo('left', 1000);
    });
    
    this.resizeSubjectArea = function(width, height) {
        var _this = this;
        
        // _this.draw.viewbox(0, 0, width, height);
        _this.draw.size(width, height);

        var pattern10 = _this.draw.defs().pattern(10, 10, function(add) {
            add.path("M 10 0 L 0 0 0 10").attr({ fill: 'none', stroke: 'gray', 'stroke-width': 0.1 });
        })
    
        var pattern100 = _this.draw.defs().pattern(100, 100, function(add) {
            add.rect(100, 100).attr({ fill: 'url(#smallGrid)'});
            add.path("M 100 0 L 0 0 0 100").attr({ fill: 'none', stroke: 'gray', 'stroke-width': 0.2 });
        })
      
        _this.rect10.remove();
        _this.rect100.remove();
        
        _this.rect10 =  _this.draw.rect(width, height).fill(pattern10);
        _this.rect100 = _this.draw.rect(width, height).fill(pattern100);

        for( var i=0; i<_this.horizontalText.length; i++) {
            _this.horizontalText[i].remove();
        }
        for( var i=0; i<_this.verticalText.length; i++) {
            _this.verticalText[i].remove();
        }
        _this.horizontalText = new Array();
        _this.verticalText = new Array();
        for( var i=1; i<width/100; i++ ) {
            _this.horizontalText.push(_this.draw.text(function(t) {t.tspan(i*100).dx(i*100).dy(0)} ).font({anchor: 'middle'}).attr({ "font-size": "9px", "dominant-baseline" : "hanging", "text-anchor" : "middle" })); // .addClass("pattern_hori_sign"));
        }

        for( var i=0; i<height/100; i++ ) {
            _this.verticalText.push(_this.draw.text(function(t) {t.tspan(i*100).dx(0).dy(i*100)} ).attr({ "font-size": "9px", "dominant-baseline" : (i==0 ? "hanging" : "middle") })); // .addClass(i==0 ? "pattern_base_sign" : "pattern_verti_sign"));
            if( i == 0 ) {
                
            } else {
                
            }
        }
    }
    
    /**
     * draw 구하기.
     */
    this.getDraw = function() {
        var _this = this;
        
        _this.drawDataLoad.setSubjectArea( _this.subjectAreaData["SUBJECT_ID"], _this);
        /*
        _this.baseRect =  _this.draw.rect(8000, 5000).attr({ 
              fill: 'none'
            })
            .opacity(0.0);
        */
      
    
        var pattern10 = _this.draw.defs().pattern(10, 10, function(add) {
            add.path("M 10 0 L 0 0 0 10").attr({ fill: 'none', stroke: 'gray', 'stroke-width': 0.1 });
        })
    
        var pattern100 = _this.draw.defs().pattern(100, 100, function(add) {
            add.rect(100, 100).attr({ fill: 'url(#smallGrid)'});
            add.path("M 100 0 L 0 0 0 100").attr({ fill: 'none', stroke: 'gray', 'stroke-width': 0.2 });
        })
      
        _this.rect10 =  _this.draw.rect(_this.area.width, _this.area.height).fill(pattern10);
        _this.rect100 = _this.draw.rect(_this.area.width, _this.area.height).fill(pattern100);
      
        _this.draw.svg();
    
        for( var i=1; i<_this.area.width/100; i++ ) {
            _this.horizontalText.push(_this.draw.text(function(t) {t.tspan(i*100).dx(i*100).dy(0)} ).font({anchor: 'middle'}).attr({ "font-size": "9px", anchor: 'middle', "dominant-baseline" : "hanging", "text-anchor" : "middle" })); // .addClass("pattern_hori_sign"));
        }

        for( var i=0; i<_this.area.height/100; i++ ) {
            _this.verticalText.push(_this.draw.text(function(t) {t.tspan(i*100).dx(0).dy(i*100)} ).attr({ "font-size": "9px", "dominant-baseline" : (i==0 ? "hanging" : "middle") })); // .addClass(i==0 ? "pattern_base_sign" : "pattern_verti_sign"));
        }

      /*
        for( var i=0; i<this.area.width/50; i++ ) {
            _this.draw.path("M " + (i*50) + " 0 l 0 "+ this.area.height).attr({ 
                fill: 'none',
                stroke: '#000', 
                'stroke-width': i%2==0 ? 0.5 : 0.1
            });
        }


        for( var i=0; i<this.area.height/50; i++ ) {
            _this.draw.path("M 0 " + (i*50) + " l "+this.area.width+" 0").attr({ 
                    fill: 'none',
                    stroke: '#000', 
                'stroke-width': i%2==0 ? 0.5 : 0.1
                });
        }
        */
        
        // SVG resize 샘플
        // _this.resizeSubjectArea(5000, 5000);

        return _this.draw;
    }
    

}