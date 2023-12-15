class  ErdDrawFunction{
    /**
     * subjectAreaDatas : Subject Area datas
     * idxSa : index of Subject Area;
     */
    static drawErdPage(subjectAreaDatas, idxSa, drawDataLoad) {
        var erdSujects = Ext.getCmp('ERD-SUBJECTS');
        
        var viewSize = Ext.getBody().getViewSize();
        
        var subjectAreaInfo = subjectAreaDatas[idxSa];
        
        erdSujects.add({
            title: subjectAreaInfo["SUBJECT_NM"],
            xtype : 'component',
            closable : idxSa == 0 ? false : true,
            // width: 3000,
            height: viewSize.height-83, // 5000, //  
            // padding: 20,
            id : subjectAreaInfo["SUBJECT_ID"],
            cls : 'SUBJAREA',
            html : "<div class='minimap' id='minimap-"+subjectAreaInfo["SUBJECT_ID"]+"' style='top:"+(viewSize.height-83-50-15)+"px;left:"+ (Ext.getCmp('LEFT-PANEL').getWidth()+35) +"px'></div>",
            listeners : {
                afterrender : function( _this, eOpts ) {
                    var relationOnSubjectAreaDatas = drawDataLoad.getRelationOnSubjectAreaDatas();
                    
                    var drawedSubjectArea = new Array();
                    var drawedTable = {}
                    var drawedRelation = {}; 
    
                    drawedSubjectArea[idxSa] = new DrawSubjectArea( subjectAreaDatas, idxSa, drawDataLoad );
                    
                    var draw = drawedSubjectArea[idxSa].getDraw();
                
                    var tables = drawDataLoad.getTables(subjectAreaInfo["SUBJECT_ID"]);
                    
                    // Table 그리기..
                    for( var idxTbl=0; tables && idxTbl<tables.length; idxTbl++) {
                        
                        var tableInfo = tables[idxTbl];
                        if( tableInfo["DEL_YN"] != "Y") {
                            drawDataLoad.setDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"], new DrawTable( draw, subjectAreaInfo, tableInfo, drawDataLoad ));
                            
                            drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).drawTable();
                        }
                    }
    
                    // relation 그리기.
                    for( var idxTbl=0; tables && idxTbl<tables.length; idxTbl++) {
                    
                        var tableInfo = tables[idxTbl];
                        if( tableInfo["DEL_YN"] != "Y" ) {
                            console.log(drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]));

                            console.log(tableInfo["ENTITY_ID"], tableRelations);
                            drawDataLoad.addTableRelationsInMasterToSubject(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]);
                            
                            var tableGrp = drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).getTableGrp();
                            var tableRelations = drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]);
                            
                            
                            for( var i=0; i<tableRelations.length; i++ ) {
                                var relationInfo = tableRelations[i] ;
                                if( relationInfo["DEL_YN"] != "Y" 
                                        && drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["START_ENTITY_ID"])
                                        && drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["END_ENTITY_ID"])
                                  ) {
                                    drawDataLoad.setDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"], new DrawRelation( draw, subjectAreaInfo, tableInfo, drawDataLoad, tableGrp, relationInfo ));
                                    drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]).initPath();
                                    drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]).drawRelation('init');
                                    // 시작, 종료 relation 등록
                                    drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["START_ENTITY_ID"]).addRelationStart( drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]));
                                    drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["END_ENTITY_ID"]).addRelationEnd( drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]));
                                    
                                    // console.log( relationInfo );
                                }
                            }
                        }
                    }
    
                    var map = new Ext.util.KeyMap({
                        target: Ext.getDoc(subjectAreaInfo["SUBJECT_ID"]) // Ext.getBody()
                      , binding: {
                          key: Ext.event.Event.DELETE,
                          handler: function(keyCode, e) {
                              drawDataLoad.deleteSelectedObjects(subjectAreaInfo["SUBJECT_ID"]);
                          }
                      }
                    });
                    
                    
                    Ext.defer(function () {
    
                    }, 1000);
                    $( "#minimap-"+subjectAreaInfo["SUBJECT_ID"] ).minimap( $("#"+subjectAreaInfo["SUBJECT_ID"]) );
    
                }
            }
    
    
        });
        
        // Tab 선택
        erdSujects.setActiveTab(idxSa);
    }
    
    static loadTableInfo(entity_id, isForceLoad) {
        if( Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue()!=entity_id || isForceLoad == true) {
            Ext.getStore("columnListStore").load({page : 1, limit : 999999 , params: { 'PROJECT_ID' : 'PROJECT', 'ENTITY_ID' : entity_id}});
            var store = Ext.create('Ext.data.Store', {
                id : "entityDetailStore",
                fields: [
                   { name : "PROJECT_ID"       , type : "string"},
                   { name : "ENTITY_ID"        , type : "string"},
                   { name : "ENTITY_NM"        , type : "string"},
                   { name : "TABL_NM"          , type : "string"},
                   { name : "TABL_SCD"         , type : "string"},
                   { name : "TABL_SCD_NM"      , type : "string"},
                   { name : "DML_TCD"          , type : "string"},  
                   { name : "DML_TCD_NM"       , type : "string"},  
                   { name : "TCD_NM"           , type : "string"},
                   { name : "DML_DT_FMT"       , type : "string"},
                   { name : "DML_DT"           , type : "date", format : "yyyy-mm-dd HH:mi:ss"},
                   { name : "APLY_USR_UID"     , type : "string"},
                   { name : "APLY_DT_FMT"      , type : "string"},
                   { name : "APLY_DT"          , type : "date", format : "yyyy-mm-dd HH:mi:ss"},
                   { name : "TRT_USR_UID"      , type : "string"},
                   { name : "TRT_DT_FMT"       , type : "string"},
                   { name : "TRT_DT"           , type : "date", format : "yyyy-mm-dd HH:mi:ss"},
                   { name : "ENTITY_ID"        , type : "string"},
                   { name : "TABL_DESC"        , type : "string"},
                   { name : "FRST_INS_DT"      , type : "string"},
                   { name : "FRST_INS_USR_UID" , type : "string"},
                   { name : "LAST_UPD_DT"      , type : "string"},
                   { name : "LAST_UPD_USR_UID" , type : "string"},
                   { name : "VERSN"            , type : "string"},
                   { name : "USE_YN"           , type : "string"},
                ], 
                proxy : {
                    type : 'ajax',
                    url : '/entity/data/detail.do',
                    reader : {
                        type : 'json',
                        rootProperty : 'data',
                        totalProperty: 'totalCount' 
                    },
                    extraParams: {
                        
                    }
                }
            });
            store.load({params: { 'ENTITY_ID' : entity_id} });
            store.on("load", function(_this, _records, _successful, _eOpts ) {
                console.log( _this );
                console.log( _records[0]);
                var form = Ext.getCmp('centerRightEntityDetailForm');
                form.loadRecord(_records[0]);
                
                // 삭제버튼 
                if( _records[0].get("DML_TCD") == "DML_TCD_I_D" || _records[0].get("DML_TCD") == "DML_TCD_U_D" ) {
                    Ext.getCmp("btn_tableDelete").setText("삭제 취소");
                } else {
                    Ext.getCmp("btn_tableDelete").setText("삭제");
                }
                Ext.getCmp("btn_tableDelete").setHidden(false);
                Ext.getCmp('SELECTED-TABLE-DETAIL').expand();
            });
        }
    }
}

/*
        var erdSujects = Ext.getCmp('ERD-SUBJECTS');
        erdSujects.add({
            title: 'First',
            xtype : 'component',
            // width: 3000,
            height: viewSize.height-83, // 5000, //  
            // padding: 20,
            id : 'SUBJ-0001',
            html : "<div id='minimap' style='top:"+(viewSize.height-83-70)+"px;left:"+ (Ext.getCmp('LEFT-PANEL').getWidth()+25) +"px'></div>",
            listeners : {
                afterrender : function( _this, eOpts ) {

                    // var drawDataLoad = new DrawDataLoad();
                    // SubjectArea정보 조회.
                    var subjectAreaDatas = drawDataLoad.getSubjectAreaData();
                    
                    // SubjectArea별 관계 목록 조회.
                    var relationOnSubjectAreaDatas = drawDataLoad.getRelationOnSubjectAreaDatas();
                
                    var drawedSubjectArea = new Array();
                    var drawedTable = {}
                    var drawedRelation = {}; 
                    for( var idxSa=0; idxSa<subjectAreaDatas.length; idxSa++ ) {

                        drawedSubjectArea[idxSa] = new DrawSubjectArea( subjectAreaDatas, idxSa, drawDataLoad );
                        
                        var draw = drawedSubjectArea[idxSa].getDraw();
                        
                        var subjectAreaInfo = subjectAreaDatas[idxSa]; 
                        
                        // SubjectArea별 테이블 목록 조회.
                        var tables = drawDataLoad.getTables(subjectAreaInfo["SUBJECT_ID"]);

                        // Table 그리기..
                        for( var idxTbl=0; idxTbl<tables.length; idxTbl++) {
                            
                            var tableInfo = tables[idxTbl];
                            if( tableInfo["DEL_YN"] != "Y" ) {
                                drawDataLoad.setDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"], new DrawTable( draw, subjectAreaInfo, tableInfo, drawDataLoad ));
                                
                                drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).drawTable();
                            }
                        }
                        
                        
                        
                        // relation 그리기.
                        for( var idxTbl=0; idxTbl<tables.length; idxTbl++) {
                        
                            var tableInfo = tables[idxTbl];
                            if( tableInfo["DEL_YN"] != "Y" ) {
                                console.log(drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]));
                                
                                var tableGrp = drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).getTableGrp();
                                var tableRelations = drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]);
                                for( var i=0; i<tableRelations.length; i++ ) {
                                    var relationInfo = tableRelations[i] ;
                                    if( relationInfo["DEL_YN"] != "Y" ) {
                                        drawDataLoad.setDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"], new DrawRelation( draw, subjectAreaInfo, tableInfo, drawDataLoad, tableGrp, relationInfo ));
                                        drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]).initPath();
                                        drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]).drawRelation('init');
                                        // 시작, 종료 relation 등록
                                        drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["START_ENTITY_ID"]).addRelationStart( drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]));
                                        drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["END_ENTITY_ID"]).addRelationEnd( drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]));
                                        
                                        // console.log( relationInfo );
                                    }
                                }
                            }
                        }
                        
                    }
                    
                    var map = new Ext.util.KeyMap({
                        target: Ext.getDoc('SUBJ-0001') // Ext.getBody()
                      , binding: {
                          key: Ext.event.Event.DELETE,
                          handler: function(keyCode, e) {
                              drawDataLoad.deleteSelectedObjects( "SUBJ-0001" );
                          }
                      }
                    });
                    
                    
                    // Ext.defer(function () {
                    //     var container = Ext.getDoc('SUBJ-0001');
                    //     container.scrollTo(0, 1000); // Scroll to X: 0, Y: 500
                    // }, 1000);
                    // Ext.getDoc('SUBJ-0001').scroll( 't',  1500 );
                    // Ext.getDoc('SUBJ-0001').scrollBy( 1500,  1500 );
                    // Ext.getDoc('SUBJ-0001').scrollTo( 1500,  1500 );
                    Ext.defer(function () {

                    }, 1000);
                    $( "#minimap" ).minimap( $("#SUBJ-0001") );
                }
            }


        });
*/