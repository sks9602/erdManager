class  ErdDrawFunction{
    
    static sqlEditionList = {};
    
    static makeOptionalQuery(snippet_cd, snippet, indent) {
        var text = "";
        if( snippet_cd == 'SELECT' ) {
            text += "  , ";
        } else if ( snippet_cd == 'WHERE' ) {
            text += "";
        } 
        text += snippet;
        
        var text = text.replace(/</ig, '&lt;');
        text = text.replace(/>/ig, '&gt;');
        text = text.replace(/\n/ig, "<br/>" + indent+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    
        return QueryMakeFunction.toHtml(text); 
    }

    static makeAdditionQuery(sql_type, field, snippet_cd, indent, params) {
        if( (sql_type == "SELECT" || sql_type == "INSERT") && field == "DEFAULT_VAL" ) {
            var html = " , ";
            if( params["DTYPE"].indexOf("CHAR") >= 0 ) {
                html += ("'" + params["DEFAULT_VAL"] + "'"); 
            } else {
                html += params["DEFAULT_VAL"]
            }
            
            var space = parseInt( params["ENTITY_ALIAS_MAX_LEN"] ? params["ENTITY_ALIAS_MAX_LEN"] : 0)+3;
            space +=parseInt(params["COL_LEN"]);
            var aliasSyntax = "";
            if( sql_type == "SELECT" ) {
                aliasSyntax+= QueryMakeFunction.toHtml("AS  "+params["COLMN_NM"], parseInt(params["COL_LEN"])+5)  ;
            }
            return indent + QueryMakeFunction.toHtml(html, space) + aliasSyntax + QueryMakeFunction.getCommentString(params["ATTR_NM"], params["ATTR_LEN"] ) ;
        } else if( (sql_type == "SELECT" || sql_type == "INSERT") && field == "NUMB_MTH" ) {
            var html = " , ";
            html += params["NUMB_MTH"];
            return indent + QueryMakeFunction.toHtml(html, space) + QueryMakeFunction.getCommentString(params["ATTR_NM"], params["ATTR_LEN"] ) ;

        }
    }

    static contextAddQueryRemove(sql_type, e, snippet_cd, entity_id, column_id, indent, params) {
        var items = [];

        items.push(Ext.create('Ext.Action', {
             text: '컬럼 삭제',
             handler : function(_this, e) {
                 Ext.get('col_'+snippet_cd+ '_'+entity_id + '_'+column_id).remove();
                 if(Ext.get('col_VALUES_'+entity_id + '_'+column_id)) {
                     Ext.get('col_VALUES_'+entity_id + '_'+column_id).remove();
                 }else if(Ext.get('col_SELECT_'+entity_id + '_'+column_id)) {
                     Ext.get('col_SELECT_'+entity_id + '_'+column_id).remove();
                 }
                 
             }
        }));
        
        var contextMenu = Ext.create('Ext.menu.Menu', {
             items: items
         });
         contextMenu.showAt([e.clientX+10, e.clientY]);
    }    
   static contextAddQuery(sql_type, e, snippet_cd, entity_id, column_id, indent, params) {
        
        if( ErdDrawFunction.sqlEditionList[snippet_cd] == null ) {
            
            var response = Ext.Ajax.request({
                async: false,
                url: '/project/data/snippetList.do',
                params: {
                        'SNIPPET_CD' : snippet_cd
                }
            });
            ErdDrawFunction.sqlEditionList[snippet_cd] = Ext.decode(response.responseText);
        
            /*
            ErdDrawFunction.sqlEditionList = [
                {SNIPPET_NM : "코드", SNIPPET : "(SELECT CD_NM <br/>  FROM CD<br/> WHERE CD_GRP = '#NUMB_MTH#'<br/>   AND CD     = #ENTITY_NM_ALIAS#.#COLMN_NM#) AS #COLMN_NM#_NM" },
                {SNIPPET_NM : "CASE WHEN ~ WHEN END", SNIPPET : "CASE WHEN THEN<br/>    WHEN THEN<br/>    ELSE END AS #COLMN_NM#_X" },
                {SNIPPET_NM : "CHAR_TO_DATE(YMDHMS)", SNIPPET : "TO_DATE(#COLMN_NM#, 'YYYYMMDDHH24MISS') AS #COLMN_NM#_DT" },
                {SNIPPET_NM : "CHAR_TO_DATE(YMD)", SNIPPET : "TO_DATE(#COLMN_NM#, 'YYYYMMDD') AS #COLMN_NM#_DT" },
                {SNIPPET_NM : "DATE_TO_CHAR(YMDHMS)", SNIPPET : "TO_CHAR(#COLMN_NM#, 'YYYY-MM-DD HH24:MI:SS') AS #COLMN_NM#_YMDHMS" },
                {SNIPPET_NM : "DATE_TO_CHAR(YMD)", SNIPPET : "TO_CHAR(#COLMN_NM#, 'YYYY-MM-DD') AS #COLMN_NM#_YMD" },
            ];
            */
        }
        
        var items = [];
        
        var isFirstAstar = true;
        for( var i=0; i<ErdDrawFunction.sqlEditionList[snippet_cd].length; i++) {
            var snippet = ErdDrawFunction.sqlEditionList[snippet_cd][i].SNIPPET;
            
            for( var param in params ) {
                // console.log( ", { 'VAR_CD' : '"+ param + "', 'VAR_NM':''}" )
                if( snippet.indexOf('#'+param) >=0 ) {
                    var regexAllCase = null;
                    // CamelCase
                    var value = params[param];
                    if( param == 'ENTITY_NM_ALIAS' && value == "" ) {
                        value = params['ENTITY_NM']
                    }
                    if( snippet.indexOf('#'+param+".camelCase#") >=0) {
                        regexAllCase = new RegExp('#'+param+'.camelCase#', "gi");
                        snippet = snippet.replace(regexAllCase, QueryMakeFunction.getVarName(value, 'CAMEL_CASE' ));
                    } 
                    if( snippet.indexOf('#'+param+".snake_case#") >=0) {
                        regexAllCase = new RegExp('#'+param+'.snake_case#', "g");
                        snippet = snippet.replace(regexAllCase, QueryMakeFunction.getVarName(value, 'SNAKE_CASE_LOWER' ));
                    } 
                    if( snippet.indexOf('#'+param+".SNAKE_CASE#") >=0) {
                        regexAllCase = new RegExp('#'+param+'.SNAKE_CASE#', "g");
                        snippet = snippet.replace(regexAllCase, QueryMakeFunction.getVarName(value, 'SNAKE_CASE_UPPER' ));
                    } 
                    if( snippet.indexOf('#'+param+"#") >=0) {
                        regexAllCase = new RegExp('#'+param+'#', "gi")
                        snippet = snippet.replace(regexAllCase, value);
                    }
                    
                }
                
            }

            if( ErdDrawFunction.sqlEditionList[snippet_cd][i].USR_UID  == '*' && isFirstAstar ){
                items.push({
                    xtype: 'menuseparator'
                });
                
                isFirstAstar = false;
            }
            items.push(Ext.create('Ext.Action', {
                 text: ErdDrawFunction.sqlEditionList[snippet_cd][i].SNIPPET_NM,
                 snippet : snippet ,
                 handler : function(_this, e) {
                     Ext.DomHelper.append(Ext.get('col_'+snippet_cd+ '_'+entity_id + '_'+column_id), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: indent + ErdDrawFunction.makeOptionalQuery(snippet_cd, _this.snippet, indent)
                    });
                 }
            }));
        }

        items.push({
            xtype: 'menuseparator'
        });
        
        if( (sql_type == "SELECT" || sql_type == "INSERT") && params["DEFAULT_VAL"] ) {
            items.push(Ext.create('Ext.Action', {
                 text: "기본값으로 변경",
                 handler : function(_this, e) {
                     Ext.DomHelper.overwrite(Ext.get('col_'+snippet_cd+ '_'+entity_id + '_'+column_id), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: ErdDrawFunction.makeAdditionQuery(sql_type, "DEFAULT_VAL", snippet_cd, indent, params) 
                    });
                 }
             }));
        } else if ( (sql_type == "SELECT" || sql_type == "INSERT") && params["NUMB_MTH"] ) {
            items.push(Ext.create('Ext.Action', {
                 text: "채번방식으로 변경",
                 handler : function(_this, e) {
                     Ext.DomHelper.overwrite(Ext.get('col_'+snippet_cd+ '_'+entity_id + '_'+column_id), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: ErdDrawFunction.makeAdditionQuery(sql_type, "NUMB_MTH", snippet_cd, indent, params) 
                    });
                 }
             }));
            
            
        }
        
        
        
        items.push({
            xtype: 'menuseparator'
        });                                      
        items.push(Ext.create('Ext.Action', {
                 text: "스니핏 관리",
                 handler : function(_this, e) {
                     ErdAppFunction.snippetWindow("SELECT");
                 }
             }));
                 
        var contextMenu = Ext.create('Ext.menu.Menu', {
             items: items
         });
         contextMenu.showAt([e.clientX+10, e.clientY]);
    }
    

    
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
                        //if( tableInfo["DEL_YN"] != "Y") {
                            
                            drawDataLoad.setDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"], new DrawTable( draw, subjectAreaInfo, tableInfo, drawDataLoad ));
                            
                            drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).drawTable();
                        //}
                    }
    
                    // relation 그리기.
                    for( var idxTbl=0; tables && idxTbl<tables.length; idxTbl++) {
                    
                        var tableInfo = tables[idxTbl];
                        if( tableInfo["DEL_YN"] != "Y" ) {
                            console.log(drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]));

                            drawDataLoad.addTableRelationsInMasterToSubject(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]);
                            
                            var tableGrp = drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).getTableGrp();
                            var tableRelations = drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]);
                            console.log(tableInfo["ENTITY_ID"], tableRelations.length, tableRelations);
                            
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
                              if( Ext.getCmp("DRAW_BUTTON_DELETE").disabled == false ) {
                                  drawDataLoad.deleteSelectedObjects(subjectAreaInfo["SUBJECT_ID"]);
                              }
                          }
                      }
                    });
                    
                    
                    Ext.defer(function () {
    
                    }, 1000);
                    $( "#minimap-"+subjectAreaInfo["SUBJECT_ID"] ).minimap( $("#"+subjectAreaInfo["SUBJECT_ID"]) );
                    
                    // erdAuth.startOrCheckSubjectEditInfo(subjectAreaInfo["SUBJECT_ID"], false);
                }
            }
    
    
        });
        
        // Tab 선택
        erdSujects.setActiveTab(idxSa);
    }
    
    static loadTableInfo(entity_id, isForceLoad) {
        
        if( Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue()!=entity_id || isForceLoad == true) {
            Ext.getStore("columnListStore").load({page : 1, limit : 999999 , params: { 'ENTITY_ID' : entity_id}});
            Ext.getStore("viewColumnListStore").load({page : 1, limit : 999999 , params: { 'ENTITY_ID' : entity_id}});
            
            // Ext.getCmp('centerRightViewColumn').setVisible(true);
            // Ext.getCmp('centerRightViewColumn').hide();
            
            Ext.getStore("indexTreeListStore").load({page : 1, limit : 999999 , params: {  'ENTITY_ID' : entity_id}});
            Ext.getStore("columnChangeLogStore").load({page : 1, limit : 999999 , params: {  'ENTITY_ID' : entity_id}});
            Ext.getStore("entityMemoListStore").load({page : 1, limit : 999999 , params: {  'ENTITY_ID' : entity_id}});
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
                   { name : "EDITABLE_YN"      , type : "string"},
                   { name : "VIEW_CLAUSE"      , type : "string"},
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
                
                Ext.getCmp("VIEW_CLAUSE").setValue( _records[0].get("VIEW_CLAUSE"));
                Ext.getCmp("CENTER_RIGHT_VIEW_ENTITY_ID").setValue(_records[0].get("ENTITY_ID"));
                
                if( _records[0].get("ENTITY_TCD") == "TABLE" ) {
                    Ext.getCmp("entityDetailTabPanel").setActiveTab(0);
                    Ext.getCmp('centerRightTableColumn_gridpanel').setDisabled(false); 
                    Ext.getCmp('centerRightViewColumn').setDisabled(true);
                } else {
                    Ext.getCmp("entityDetailTabPanel").setActiveTab(1);
                    Ext.getCmp('centerRightTableColumn_gridpanel').setDisabled(true); 
                    Ext.getCmp('centerRightViewColumn').setDisabled(false);
                }
                
                // 삭제버튼 
                if( _records[0].get("DML_TCD") == "DML_TCD_I_D" || _records[0].get("DML_TCD") == "DML_TCD_U_D" ) {
                    Ext.getCmp("btn_tableDelete").setText("삭제 취소");
                } else {
                    Ext.getCmp("btn_tableDelete").setText("삭제");
                }
                Ext.getCmp("btn_tableDelete").setHidden(false);
                Ext.getCmp('SELECTED-TABLE-DETAIL').expand();
                
                if( _records[0].get("EDITABLE_YN") == "Y") {
                    // 테이블 관련 버튼 
                    Ext.getCmp("btn_tableDelete").setDisabled(false);
                    Ext.getCmp("btn_tableSaveStatus").setDisabled(false);
                    Ext.getCmp("btn_tableManagement").setDisabled(false);
                    // 컬럼 관련 버튼 
                    Ext.getCmp("btn_tableColumnAdd").setDisabled(false);
                    Ext.getCmp("btn_tableColumnDelete").setDisabled(false);
                    Ext.getCmp("btn_tableColumnChangeColor").setDisabled(false);
                    Ext.getCmp("btn_tableColumnApplyWord").setDisabled(false);
                    Ext.getCmp("btn_tableColumnSave").setDisabled(false);
                    // 인덱스 관련 버튼
                    Ext.getCmp("btn_addTableIndexWindow").setDisabled(false);
                } else {
                    // 테이블 관련 버튼 
                    Ext.getCmp("btn_tableDelete").setDisabled(true);
                    Ext.getCmp("btn_tableSaveStatus").setDisabled(true);
                    Ext.getCmp("btn_tableManagement").setDisabled(true);
                    // 컬럼 관련 버튼 
                    Ext.getCmp("btn_tableColumnAdd").setDisabled(true);
                    Ext.getCmp("btn_tableColumnDelete").setDisabled(true);
                    Ext.getCmp("btn_tableColumnChangeColor").setDisabled(true);
                    Ext.getCmp("btn_tableColumnApplyWord").setDisabled(true);
                    Ext.getCmp("btn_tableColumnSave").setDisabled(true);
                    // 인덱스 관련 버튼
                    Ext.getCmp("btn_addTableIndexWindow").setDisabled(true);
                }
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