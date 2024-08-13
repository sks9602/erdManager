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
    
    Ext.onReady(function() {
        
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            margins: '0 0 0 0',
            style : {padding : "0 0 5 0"},
            items: [{
	                region: 'west',
	                margin: '0 0 0 -2',
	                padding : "0 0 0 5",
	                collapsible: true,
	                title: '테이블목록',
	                xtype: 'panel',  // TabPanel itself has no title
	                layout: 'card',
	                // layout: 'accordion',
	                id : "TABLE_PANEL",
	                split: true,
	                border: true,
	                width: 400,      // First tab active by default
	                    
	                items: [
	                    <%-- 테이블 --%>
	                    <tagErd:queryLeftTable></tagErd:queryLeftTable>
	                ]
	            }, 
	            {
	                region: 'west',
	                margin: '0 0 0 -2',
	                title: '테이블+컬럼',
	                xtype: 'panel', // TabPanel itself has no title
	                layout: 'card',
	                collapsible: true,
	                width: 400,      // First tab active by default
                    split: true,
	                border : true,
	                id : "TABLE_COLUMN_PANEL",
	                items: [
	                	<tagErd:queryLeftAllTable></tagErd:queryLeftAllTable>
	                ]   
	             }, 
	             {
	            	  /*
	                 region: 'center',
	                 margin: '0 0 0 -2',
	                 xtype: 'panel', // TabPanel itself has no title
	                 border: true,
	                 split: true,
	                 */
	                 title: '쿼리 생성',
	                 
	                 region: 'west',
                    margin: '0 0 0 -2',
                    xtype: 'panel', // TabPanel itself has no title
                    layout: 'card',
                    collapsible: true,
                    width: 400,      // First tab active by default
                    split: true,
                    border : true,
	                 items: [
	                	 <tagErd:queryCenterQueryOption></tagErd:queryCenterQueryOption>
	                 ]
	             }, 
                 {  /*
                     region: 'east',
                     margin: '0 0 0 -2',
                     padding : "0 5 0 0",
                     xtype: 'panel', // TabPanel itself has no title
                     collapsible: true,
                     border: true,
                     split: true,
                     autoScroll: true,
                     */

                     region: 'center',
                     margin: '0 0 0 -2',
                     xtype: 'panel', // TabPanel itself has no title
                     border: true,
                     split: true,
                     title: '생성쿼리',
                     width: 550,      // First tab active by default
                     id : "rightSqlArea-PANEL",
                     tbar : [
                         '->',
                         <tagErd:button type="button" label="클립보드로 복사" iconCls="search" cls="btn_segmentedbutton">
                             listeners : {
                                 click : function(_this, e, eOpts) { 
                                	  // Get the text field
                                	  // var rightSqlArea = document.getElementById("rightSqlArea-innerCt");
                                	  // var text = rightSqlArea.textContent;
                                	  
                                	var htmls = Ext.dom.Query.select("div[id=rightSqlArea-innerCt] > div");
                                	  
                                	var text = "";
                                	var arr = [];
                                	for( var i=0; i<htmls.length; i++ ) {
                                		arr.push( htmls[i].innerText );
                                	}
                                	text = arr.join('\r\n')
                                	navigator.clipboard.writeText(text);

                                	Ext.Msg.alert('성공', '클립보드로 복사되었습니다.', function() {
                                		  
                                		  
                                	});
                                 }
                             }
                         </tagErd:button>
                     ],
                     items: [
                    	{
                    		xtype: "container",
                    		id : "rightSqlArea",
                            autoScroll: true,
                    		html : "",
                    	}    
  
                     ]
                 }
	        ]
	  });

        if (document.all) {
            // document.all.loading.style.visibility='hidden';
            var el = Ext.get("loading"); 
            el.fadeOut({
                   duration: 1000,
                   callback: function () {
                       el.hide();
                   }
            });
            //el.setOpacity(0);
            //el.hide();
        }
        if (document.layers) {
            // document.loading.visibility='hidden';
            var el = Ext.get("loading"); 
            el.fadeOut({
                   duration: 1000,
                   callback: function () {
                       el.hide();
                   }
            });
            //el.setOpacity(0);
            //el.hide();
        }
        if (document.getElementById) {
            // document.getElementById('loading').style.visibility='hidden';
            var el = Ext.get("loading"); 
            el.fadeOut({
                   duration: 1000,
                   callback: function () {
                       el.hide();
                   }
            });
            //el.setOpacity(0);
            //el.hide();
        }

    });

    Ext.on('resize', function() { 
        var viewSize = Ext.getBody().getViewSize();
        
        Ext.get('rightSqlArea-PANEL').setHeight(viewSize.height-86+26-26);
        Ext.get('rightSqlArea').setHeight(viewSize.height-86+26-26);

    });
    </script>