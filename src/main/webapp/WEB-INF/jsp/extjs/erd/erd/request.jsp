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
    var relationFieldcontainerIdx = 0;
    
    function fieldcontainerRelationObject(idx) { 
    	relationFieldcontainerIdx ++;
	    var fieldcontainerRelationObject = {
	        xtype: 'fieldcontainer',
	        fieldLabel: '상위테이블/관계',
	        labelSeparator : '',
	        layout: 'hbox',
	        combineErrors: true,
	        defaultType: 'textfield',
	        colspan : relationFieldcontainerIdx <=  4 ? 2 : 3,
	        id : 'relationFieldcontainerIdx'+relationFieldcontainerIdx,
	        defaults: {
	            hideLabel: 'true'
	        },
	    
	        items: [                            
	                {  
	                    fieldLabel : '테이블명',
	                    xtype: 'combo_ux', // '', // combotipple_ux, tagfield
	                    labelCls : 'x-form-item-label x-form-item-label-required',
	                    name: 'DTYPE',
	                    msgTarget: 'side',
	                    allowBlank: true,
	                    queryMode: 'local', // remote
	                    anyMatch: true,
	                    minChar : 2,
	                    anchor: '100%',
	                    value : '',
	                    width : 350,
	                    flex: 5,
	                    valueField : 'ENTITY_NM',
	                    displayField: 'TABL_NM',
	                    forceSelection: true,
	                    editable: true,
	                    autocomplete: false,
	                    displayTpl: '{TABL_NM} ({ENTITY_NM})',
	                    filterPickList: true,
	                    listConfig: {
	                        itemTpl: new Ext.XTemplate(
	                            '<div>',
	                            '{ENTITY_NM} -- {TABL_NM}',
	                            '</div>'
	                        )
	                    },
	                    store : {
	                        xtype : 'store',
	                        storeId: 'requestEntityListStore',
	                        idProperty : 'data',
	                       
	                        fields: [
	                            
	                            { name : 'ALIAS_NM', type : 'string', format : '' },
	                            
	                            { name : 'APLY_DT', type : 'string', format : '' },
	                            
	                            { name : 'APLY_USR_UID', type : 'string', format : '' },
	                            
	                            { name : 'COLUMN_CNT', type : 'int', format : '' },
	                            
	                            { name : 'DML_DT', type : 'string', format : '' },
	                            
	                            { name : 'DML_TCD', type : 'string', format : '' },
	                            
	                            { name : 'DML_TCD_NM', type : 'string', format : '' },
	                            
	                            { name : 'ENTITY_ID', type : 'string', format : '' },
	                            
	                            { name : 'ENTITY_NM', type : 'string', format : '' },
	                            
	                            { name : 'ENTITY_TCD', type : 'string', format : '' },
	                            
	                            { name : 'FAVOR_YN', type : 'string', format : '' },
	                            
	                            { name : 'PROJECT_ID', type : 'string', format : '' },
	                            
	                            { name : 'TABL_DESC', type : 'string', format : '' },
	                            
	                            { name : 'TABL_NM', type : 'string', format : '' },
	                            
	                            { name : 'TABL_SCD', type : 'string', format : '' },
	                            
	                            { name : 'TABL_SCD_030', type : 'bool', format : '' },
	                            
	                            { name : 'TABL_SCD_030_COL_CNT', type : 'int', format : '' },
	                            
	                            { name : 'TABL_SCD_040', type : 'bool', format : '' },
	                            
	                            { name : 'TABL_SCD_040_COL_CNT', type : 'int', format : '' },
	                            
	                            { name : 'TABL_SCD_050', type : 'bool', format : '' },
	                            
	                            { name : 'TABL_SCD_050_COL_CNT', type : 'int', format : '' },
	                            
	                            { name : 'TABL_SCD_060', type : 'bool', format : '' },
	                            
	                            { name : 'TABL_SCD_060_COL_CNT', type : 'int', format : '' },
	                            
	                            { name : 'TABL_SCD_070', type : 'bool', format : '' },
	                            
	                            { name : 'TABL_SCD_070_COL_CNT', type : 'int', format : '' },
	                            
	                            { name : 'TABL_SCD_ALL', type : 'string', format : '' },
	                            
	                            { name : 'TABL_SCD_NM', type : 'string', format : '' },
	                            
	                            { name : 'TRT_DT', type : 'string', format : '' },
	                            
	                            { name : 'TRT_USR_UID', type : 'string', format : '' },
	                            
	                            { name : 'USE_YN', type : 'string', format : '' },
	                            
	                        ],
	                        
	                        autoLoad:  true ,
	                        proxy : {
	                               type : 'ajax',
	                               url : '/entity/data/list.do',
	                               reader : {
	                                   type : 'json',
	                                   rootProperty : 'data',
	                                   totalProperty: 'totalCount' 
	                               },
	                               extraParams: {
	                                   PROJECT_ID : 'PROJECT'
	                               }
	                           },
	                           root: {
	                                expanded:  true ,
	                        },
	                    },
	                },  
	                {   
	                    xtype: 'combo_ux',
	                    name: 'REL_TYPE',
	                    allowBlank: true,
	                    width : '100',
	                    style : {padding : "0 0 0 0"},
	                    flex: 1,
	                    value : 'rel1toN',
	                    valueField : 'VALUE',
	                    displayField: 'NAME',
	                    store : Ext.create('Ext.data.Store', {
	                        fields: ['VALUE', 'NAME'],
	                        data : [
	                            {"VALUE":"rel1toN", "NAME":"1:N"},
	                            {"VALUE":"rel1to1", "NAME":"1:1"},
	                            {"VALUE":"rel1to0_1", "NAME":"1:1/0"},
	                            {"VALUE":"relNonIden", "NAME":"Non-identifing"},
	                        ]
	                    }),
	                },
	                {
	                    xtype: 'button',
	                    text: '+',
	                    handler: addFieldcontainerRelationObject
	                },
                    {
                        xtype: 'button',
                        text: '-',
                        disabled : relationFieldcontainerIdx <=  4 ? true : false,
                        visible : relationFieldcontainerIdx <=  4 ? false : true,
                        handler: removeFieldcontainerRelationObject
                    },
	                
	                ]
	            };
	    return  fieldcontainerRelationObject;
    }
    
    function addFieldcontainerRelationObject(btn) {
        var form = btn.up('form'); // this is a better approach

        var xtypeCounts = {};
        
        form.items.each(function(item) {
            var xtype = item.xtype;
            if (!xtypeCounts[xtype]) {
                xtypeCounts[xtype] = 0;
            }
            xtypeCounts[xtype]++;
        });
        
        // form.setHeight(53+(23*3) + (xtypeCounts.fieldcontainer*23))
        form.add(fieldcontainerRelationObject());
    	
    }
    
    function removeFieldcontainerRelationObject(btn) {
        var form = btn.up('form'); // this is a better approach
        
        var fieldcontainer = btn.up('fieldcontainer');
        
        if( fieldcontainer.id == relationFieldcontainerIdx1 ) {
        	return ;
        }
        
        form.remove(fieldcontainer.id, false);
       
        var xtypeCounts = {};

        form.items.each(function(item) {
            var xtype = item.xtype;
            if (!xtypeCounts[xtype]) {
                xtypeCounts[xtype] = 0;
            }
            xtypeCounts[xtype]++;
        });
        
        // form.setHeight(53+(23*3) + (xtypeCounts.fieldcontainer*23))	
    }
            
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
	                title: '테이블 신규/변경/삭제 신청 목록',
	                xtype: 'panel',  // TabPanel itself has no title
	                layout: 'card',
	                // layout: 'accordion',
	                id : "TABLE_PANEL",
	                split: true,
	                border: true,
	                width: 600,      // First tab active by default
	                    
	                items: [
	                    <%-- 요청목록 --%>
	                    <tagErd:requestLeftList></tagErd:requestLeftList>
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
                     title: '신규/변경/삭제 신청',
                     id : "rightSqlArea-PANEL",
                     layout: 'fit',
                     items : [
                    	 
                         {
                             xtype: 'panel', 
                             region: 'center',
                             border : true,
                             // layout: 'border',
                             flex:1,
                             // height: viewSize.height-86,
                             
                             id : 'ERD-SUBJECTS-PANEL',
                             layout: 'fit',
                             items : [
                            	 <tagErd:requestCenterTable></tagErd:requestCenterTable>
                             ]
                         }
                     ]
                 },
                 {
                     region: 'east',
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
        
        Ext.get('centerRightTableColumn_gridpanel').setHeight(viewSize.height - (53+(23*3))-32);

        //Ext.get('rightSqlArea-PANEL').setHeight(viewSize.height - (53+(23*3))-32);
        //Ext.get('rightSqlArea').setHeight(viewSize.height-53+(23*3)-32);

    });
    </script>