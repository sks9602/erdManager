<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ page import="java.util.Locale" %>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, height=device-height, viewport-fit=cover, shrink-to-fit=no">
    <meta name="title" content="">
    <meta name="description" content="">
    <meta name="copyrigt" content="">
    <meta name="keywords" content="">

	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>


    <script type="text/javascript">window.fiddleSessionId="16191347856604893430";</script><!-- hasCodeToTransform: false --><!-- framework css -->
    <!-- link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-neptune/resources/theme-neptune-all-debug.css" -->
    <!-- link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-crisp/resources/theme-crisp-all-debug.css" -->
    <link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-classic/resources/theme-classic-all-debug.css">
    <script type="text/javascript" src="https://cdn.sencha.com/ext/commercial/7.3.0/build/ext-all-debug.js"></script>
    <script type="text/javascript" src="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-neptune/theme-neptune-debug.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>

    <link href="https://cdn.jsdelivr.net/npm/svg.select.js@3.0.1/dist/svg.select.min.css" rel="stylesheet"/>

    <script src="//code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g="  crossorigin="anonymous"></script>
  
    <script src="/static/js/svg/svg.draggable.js"></script>

    <script src="/static/js/erd/DrawDataLoad.js"></script>
    <script src="/static/js/erd/DrawSubjectArea.js"></script>
    <script src="/static/js/erd/DrawTable.js"></script>
    <script src="/static/js/erd/DrawRelation.js"></script>
    
    <style>

    svg {
        vertical-align: middle;
        background: rgba(255,255,255, 0.2);
        box-shadow: inset 0 0 3px 0px #CECECE;
    }

    .header rect{
        fill: #0099FF;
    }

    .header tspan{
        fill: white;
        font: 10px sans-serif;
        text-anchor: start;
        dominant-baseline: hanging;
    }

    .columns{
        fill: #FFFFFF;
    }

    .columns text{
        fill: white;
        font: 10px sans-serif;
        text-anchor: start;
        dominant-baseline: hanging;
    }

    .column rect{
        fill: #FFFFFF;
    }

    .column text{
        fill: #000;
        font: 10px sans-serif;
        text-anchor: start;
        dominant-baseline: hanging;
    }

    .column tspan{
        fill: #000;
        font: 10px sans-serif;
        text-anchor: start;
        dominant-baseline: hanging;
    }
    
    .white-page .columns{
        fill: #EEFFFF;
    }
    </style>
    
    <script type="text/javascript">
        if (Ext.Loader) {
            Ext.Loader.setPath({
                'Ext.ux' : 'https://cdn.sencha.com/ext/commercial/7.3.0/packages/ux/src',
                // 'Ext.field' : 'http://127.0.0.1:9081/contents/extjs/field'
            });
        }
    </script>
    
    <script>

    </script>
</head>
<body>
        <div>
            <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">
              <i class="material-icons">mood</i>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">
              <i class="material-icons">mood</i>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onclick="alert(2)">
              <i class="material-icons">mood</i>
            </button>
		</div>
		<div id="erd-subject-area" class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
		  <div id="tab-subject-area"  class="mdl-tabs__tab-bar">
		      <a href="#id_subj_1" class="mdl-tabs__tab is-active">Starks</a>
		      <a href="#lannisters-panel" class="mdl-tabs__tab">Lannisters</a>
		      <a href="#targaryens-panel" class="mdl-tabs__tab">Targaryens</a>
		  </div>
		
		  <div class="mdl-tabs__panel is-active" id="id_subj_1" style="overflow:scroll;">
		  </div>
		  
		  <div class="mdl-tabs__panel" id="lannisters-panel" id="id_subj_2" style="overflow:scroll;">
		    erd2
		  </div>
		  
		  <div class="mdl-tabs__panel" id="targaryens-panel" id="id_subj_3" style="overflow:scroll;">
		    erd3
		  </div>
		</div>
		
		<div>
		  <!-- tiles:insertAttribute name="body" flush="true"/ -->
		</div>

        <script>
                
        $("#id_subj_1").css("width", window.innerWidth+"px"); 
        $("#id_subj_1").css("height", (window.innerHeight-48-2)+"px"); 
        
        $("#tab-subject-area").append("<a href='#tap4' class='mdl-tabs__tab'>tap4</a>"); // 태그 추가
        $("#erd-subject-area").append("<div class='mdl-tabs__panel' id='tap4'>erd4</div>"); // 태그 추가
        
            var drawDataLoad = new DrawDataLoad();
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
                    console.log(">>> tableInfo", tableInfo["ENTITY_ID"], tableInfo["ENTITY_TCD"] );
                    drawDataLoad.setDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"], new DrawTable( draw, subjectAreaInfo, tableInfo, drawDataLoad ));
                    
                    drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).drawTable();
                    /*
                    drawedTable[tableInfo["ENTITY_ID"]] = new DrawTable( draw, subjectAreaInfo, tableInfo, drawDataLoad );
                    
                    // console.log( drawDataLoad.getTableColumns(tableInfo["ENTITY_ID"]));
                    drawedTable[tableInfo["ENTITY_ID"]].drawTable();
                    */
                }
                
                
                // relation 그리기.
                for( var idxTbl=0; idxTbl<tables.length; idxTbl++) {
                
                    var tableInfo = tables[idxTbl];
                    console.log(drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]));
                    
                    var tableGrp = drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).getTableGrp();
                    var tableRelations = drawDataLoad.getTableRelations(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]);
                    for( var i=0; i<tableRelations.length; i++ ) {
                        var relationInfo = tableRelations[i] ;
                        drawDataLoad.setDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"], new DrawRelation( draw, subjectAreaInfo, tableInfo, drawDataLoad, tableGrp, relationInfo ));
                        drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]).initPath();
                        drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]).drawRelation('init');
                        // 시작, 종료 relation 등록
                        drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["START_ENTITY_ID"]).addRelationStart( drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]));
                        drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], relationInfo["END_ENTITY_ID"]).addRelationEnd( drawDataLoad.getDrawedRelation(subjectAreaInfo["SUBJECT_ID"], relationInfo["RELATION_ID"]));
                        
                        console.log( relationInfo );
                    }
                    
                    /*
                    var tableInfo = tableOnSubjectAreaDatas[subjectAreaInfo["SUBJECT_ID"]][idxTbl];
                
                    drawedRelation[subjectAreaInfo["SUBJECT_ID"]+"_"+tableInfo["ENTITY_ID"]] = new Array(); 
                
                    drawedRelation[subjectAreaInfo["SUBJECT_ID"]+"_"+tableInfo["ENTITY_ID"]] = new DrawRelation( draw, subjectAreaInfo, tableInfo, drawDataLoad );
                    
                    drawedRelation[subjectAreaInfo["SUBJECT_ID"]+"_"+tableInfo["ENTITY_ID"]].drawRelation();
                    */
                }
            }
            
            // console.log( drawDataLoad.getDrawedTable() );
            // console.log( drawDataLoad.getDrawedRelations() );
            
        </script>
</body>
</html>