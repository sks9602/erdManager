<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

    <script>
    var drawDataLoad = new DrawDataLoad();
    var erdAuth      = new ErdAuth();
    drawDataLoad.loadData();
    erdAuth.loadData();

    <tagErd:itemCode type="ext-js-store" name="DATA_TYPE" cdGrp="DATA_TYPE" firstText="" value=""></tagErd:itemCode>
    
    Ext.onReady(function() {
    	<%-- 로그인 하지 않은 경우 로그인 창 --%>
        <c:if test="${sessionScope._sessionVO.usrUid == null || sessionScope._sessionVO.usrUid == 'GUEST' }">
            ErdAppFunction.loginWindow(true);
        </c:if>
        
        var viewSize = Ext.getBody().getViewSize();        
        
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            margins: '0 0 0 0',
            style : {padding : "0 5 0 5"},
            items: [{
                region: 'north',
                
                border: false,
                margin: '0 0 0 0', // '5 5 5 5',
                items: [
                    {   xtype : 'panel',
                        html: '<h3 id="erd-title" class="x-panel-header"><c:if test="${sessionScope._sessionVO.projectNm != null }">${sessionScope._sessionVO.projectNm}</c:if></h3>',
                        dock: 'bottom',
                        bbar : [
                                {text: '프로제트 등록', id: 'topAddProject',
                                    handler : function() {
                                        var project_id = ''; 
                                        var _animateTarget = 'topAddProject';
                                        ErdAppFunction.addProjectWindow(project_id, _animateTarget);
                                    }
                                 },'|',
                                 <c:if test="${sessionScope._sessionVO.usrUid != null && sessionScope._sessionVO.usrUid != 'GUEST' }">
                                 {text: '프로젝트 수정', id: 'topEditProject', 
                                     handler : function() {
                                    	 ErdAppFunction.editProjectWindow('${sessionScope._sessionVO.projectId}', 'topEditProject');
                                     },
                                  },'|',
                                  </c:if>
                                 {text: '프로젝트 목록 열기', id: 'topListProject', 
                                    handler : function() {
                                        ErdAppFunction.listProjectWindow();
                                    },
                                 },'|',
                                 {text: '프로젝트 공유신청', id: 'topApplyProject', 
                                     handler : function() {
                                         var _animateTarget = 'topApplyProject';
                                         ErdAppFunction.applyProjectWindow(_animateTarget);
                                     },
                                  },
                                  <%-- 로그인 한 경우 로그인 창 --%>
                                  '|',
                                  {text: '프로젝트 참여자 관리', id: 'topManagerUserList', 
                                     handler : function() {
                                         var _animateTarget = 'topManagerUserList';
                                         ErdAppFunction.managerUserListWindow(_animateTarget);
                                     },
                                  },
                                  '|',
                                  {text: '쿼리 Maker', id: 'topSqlQueryMaker', 
                                     handler : function() {
                                    	 window.open('/extjs/erd/query.do', '_blank');
                                     },
                                  },
                                  '->',
                                  <c:if test="${sessionScope._sessionVO.usrUid == null || sessionScope._sessionVO.usrUid == 'GUEST' }">
                                  {text: '회원가입', id: 'topRegistUser', 
                                      handler : function() {
                                    	  ErdAppFunction.addUserWindow();
                                      },
                                  },'|',
                                  {text: 'Login', id: 'topLogin', 
                                      handler : function() {
                                          ErdAppFunction.loginWindow(false);
                                      },
                                  },'|',                                
                                  '${sessionScope._sessionVO.usrNm}님, 반갑습니다.',
                                  </c:if>
                                  <%-- 로그인 한 경우 로그인 창 --%>
                                  <c:if test="${sessionScope._sessionVO.usrUid != null && sessionScope._sessionVO.usrUid != 'GUEST' }">
                                  {text: '${sessionScope._sessionVO.usrNm}님의 로그인 정보 변경', id: 'loginUsrNm', 
                                      handler : function() {
                                          alert('사용자정보 변경 팝업');
                                      },
                                  },
                                  '|',
                                  {text: 'Logout', id: 'topLogout', 
                                     handler : function() {

                                         Ext.Msg.confirm('확인', '로그아웃하시겠습니까?', function(btn) {
                                             if( btn == 'yes') {
                                             	 var response = Ext.Ajax.request({
                                                      async: false,
                                                      url: '/common/login/logout.do',
                                                      params: {
                                                              
                                                      }
                                                  });
                                             	 
                                             	  console.log( Ext.decode(response.responseText) )
                                             	  if( Ext.decode(response.responseText).success == true ) {
                                             		  Ext.Msg.alert('성공', '로그아웃되었습니다.', function() {
                                             		      self.location.href = '/extjs/erd/erd.do';
                                                      });
                                             		  
                                             		  
                                                  }
                                                  
                                             }
                                         });
                                     },
                                  },
                                  </c:if>
                        ]
                    }
                ]
            }, {
                region: 'west',
                collapsible: true,
                title: '도메인/테이블/업무영역',
                xtype: 'tabpanel', // TabPanel itself has no title
                // layout: 'accordion',
                id : "LEFT-PANEL",
                split: true,
                border: true,
                width: 350,      // First tab active by default
                listeners : {
                    collapse : function ( _this, eOpts ) {
                        var minimaps = Ext.dom.Query.select("div[id^=minimap]");
                        for(var i=0; i<minimaps.length; i++) {
                            Ext.get(minimaps[i].id).setLeft(30+35);
                        }
                        // Ext.get('minimap').setLeft(30+25);
                    },
                    expand : function( _this, eOpts) {
                        var minimaps = Ext.dom.Query.select("div[id^=minimap]");
                        for(var i=0; i<minimaps.length; i++) {
                            Ext.get(minimaps[i].id).setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+35);
                        }
                            // Ext.get('minimap').setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+25);
                    },
                    resize : function( element, info, eOpts ) {
                        var minimaps = Ext.dom.Query.select("div[id^=minimap]");
                        for(var i=0; i<minimaps.length; i++) {
                            Ext.get(minimaps[i].id).setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+35);
                        }
                        // if( element && Ext.get('minimap') ) {
                            // Ext.get('minimap').setLeft(element.getWidth()+25);
                        // }
                    }
                },
                    
                items: [
                    <%-- 도메인 --%>
                    <tagErd:erdLeftDomain></tagErd:erdLeftDomain>
                    <%-- 업무영역 --%>
                    <tagErd:erdLeftSubject></tagErd:erdLeftSubject>
                    <%-- 공통컬럼 --%>
                    <tagErd:erdLeftCommonColumn></tagErd:erdLeftCommonColumn>
                    <%-- 테이블 --%>
                    <tagErd:erdLeftTable></tagErd:erdLeftTable>
                    <%-- 시퀀스 --%>
                    <tagErd:erdLeftSequence></tagErd:erdLeftSequence>
                ]
            }, 
            {
                region: 'east',
                title: '전체 테이블 레이아웃/단어사전',
                xtype: 'tabpanel', // TabPanel itself has no title
                split: true,
                collapsible: true,
                collapsed : true,
                activeTab: 0,      // First tab active by default
                width: 650,      // First tab active by default
                margin: '0 0 0 -2',
                border : true,
                id : "RIGHT-PANEL",
                items: [
                       <%-- 전체테이블 --%>
                       <tagErd:erdRightAllTable></tagErd:erdRightAllTable>
                       <%-- 단어사전 --%>
                       <tagErd:erdRightWord></tagErd:erdRightWord>
                ]   
             }, 
             {
                 region: 'center',
                 xtype: 'panel', // TabPanel itself has no title
                 border: true,
                 margin: '0 0 0 -2',
                 items: [
                         <%-- 버튼 영역 --%>
                         <tagErd:erdCenterTopButton></tagErd:erdCenterTopButton>
                         {
                             xtype: 'panel', 
                             region: 'center',
                             border : true,
                             layout: 'border',
                             flex:1,
                             height: viewSize.height-86,
                             id : 'ERD-SUBJECTS-PANEL',
                             items : [
                                 {
                                     xtype: 'tabpanel', // TabPanel itself has no title
                                     region: 'center',
                                     // scrollable  : true,
                                     id : 'ERD-SUBJECTS',
                                     border : false,
                                     listeners : {
                                    	 tabchange : function ( tabPanel, newCard, oldCard, eOpts ) {
                                    		 console.log( newCard, oldCard);
                                    		 erdAuth.startOrCheckSubjectEditInfo(newCard.getId(), false);
                                    	 }
                                     },
                                     items : [
         
                                     ]
                                 }, 
                                 <%-- 선택된 테이블 정보 --%>
                                 <tagErd:erdCenterRightTable></tagErd:erdCenterRightTable>
                                 
                             ]
                         }
         
                 ]
             }/*, {
                 region: 'south',
                 html: '',
                 border: false,
                 margin: '0 0 5 0'
             }*/
        ]
  });

    /* 첫번째 업무영역 그리기 */
    var subjectAreaDatas = drawDataLoad.getSubjectAreaData();
    
    ErdDrawFunction.drawErdPage(subjectAreaDatas, 0, drawDataLoad);

       
        // var draw = SVG().addTo("#subj_1").size( 8000 , viewSize.height-98 ); // 
        /*
        var draw = SVG().addTo("#subj_1-innerCt").size( 8000 , viewSize.height-98 ); //  5000 

        for( var i=0; i<8000/50; i++ ) {
            draw.path("M " + (i*50) + " 0 l 0 5000").attr({ 
                fill: 'none',
                stroke: '#000', 
                'stroke-width': i%2==0 ? 0.5 : 0.1
            });
            draw.text(function(t) {t.tspan(i*50).dx(i*50).dy(10)} );
        }


        for( var i=0; i<5000/50; i++ ) {
            draw.path("M 0 " + (i*50) + " l 8000 0").attr({ 
                    fill: 'none',
                    stroke: '#000', 
                'stroke-width': i%2==0 ? 0.5 : 0.1
                });
            draw.text(function(t) {t.tspan(i*50).dx(0).dy(i*50)} );
        }
        */
        // draw.size(8000, 5000);
    

    });

    Ext.on('resize', function() { 
        var viewSize = Ext.getBody().getViewSize();
        
        Ext.get('ERD-SUBJECTS-PANEL').setHeight(viewSize.height-86+26-26);
        Ext.get('ERD-SUBJECTS').setHeight(viewSize.height-86+26-26);

        Ext.getCmp('ERD-SUBJECTS-PANEL').setHeight(viewSize.height-86+26-26);
        Ext.getCmp('ERD-SUBJECTS').setHeight(viewSize.height-86+26-26);
        
        var subjectAreaDatas = drawDataLoad.getSubjectAreaData();
        for( var i=0;i<subjectAreaDatas.length ; i++) {
            if( Ext.get(subjectAreaDatas[i]) ) {
                Ext.get(subjectAreaDatas[i]["SUBJECT_ID"]).setHeight(viewSize.height-83+24-16);
                Ext.getCmp(subjectAreaDatas[i]["SUBJECT_ID"]).setHeight(viewSize.height-83+24-16);
            }
        }

        var minimaps = Ext.dom.Query.select("div[id^=minimap]");
        for(var i=0; i<minimaps.length; i++) {
            Ext.get(minimaps[i].id).setTop(viewSize.height-83+24-70-24);
            Ext.get(minimaps[i].id).setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+25);
        }
        //Ext.get('minimap').setTop(viewSize.height-83+24-70-24);
        //Ext.get('minimap').setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+25);
        
        /*
        Ext.get('ERD-SUBJECTS-body').setHeight(viewSize.height-83);
        Ext.get('ERD-SUBJECTS-body').setHeight(viewSize.height-83);
        */


    });
    
    /*
    window.onbeforeunload = function() {
        return "사이트를 나가시겠습니까?"; 
    };
    */
    </script>