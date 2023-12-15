<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>
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

    <script type="text/javascript">window.fiddleSessionId="16191347856604893430";</script><!-- hasCodeToTransform: false --><!-- framework css -->
    <!-- link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-neptune/resources/theme-neptune-all-debug.css" -->
    <!-- link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-crisp/resources/theme-crisp-all-debug.css" -->
    <link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-classic/resources/theme-classic-all-debug.css">
    
    <script type="text/javascript" src="https://cdn.sencha.com/ext/commercial/7.3.0/build/ext-all-debug.js"></script>
    <script type="text/javascript" src="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-neptune/theme-neptune-debug.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>

    <link href="https://cdn.jsdelivr.net/npm/svg.select.js@3.0.1/dist/svg.select.min.css" rel="stylesheet"/>

    <script src="//code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g="  crossorigin="anonymous"></script>
    <script src="//code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
    
    <script src="/static/js/jQuery/plugin/jquery-minimap.js"></script>
    
    <script src="/static/js/svg/svg.draggable-table.js"></script>
    <script src="/static/js/svg/svg.draggable-resizer.js"></script>

    <script src="/static/js/erd/DrawDataLoad.js"></script>
    <script src="/static/js/erd/DrawSubjectArea.js"></script>
    <script src="/static/js/erd/DrawTable.js"></script>
    <script src="/static/js/erd/DrawRelation.js"></script>
    <script src="/static/js/erd/ErdAppFunction.js"></script>
    
    <script src="/static/js/ext-ux/HoMessage.js"></script>
    <script src="/static/js/ext-ux/VType.js"></script>
    <script src="/static/js/ext-ux/ComboTreeGrid-erd.js"></script>
    <script src="/static/js/ext-ux/ComboTree.js"></script>
    <script src="/static/js/ext-ux/ComboTripple.js"></script>
    <script src="/static/js/ext-ux/ComboUx.js"></script>
    <script src="/static/js/ext-ux/FormFieldUx.js"></script>
    <script src="/static/js/ext-ux/FormPanel.js"></script>
    
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet"  -->
    <!--  https://fontawesome.com/search  -->
    <style>

    svg {
        vertical-align: middle;
        background: rgba(255,255,255, 0.2);
        box-shadow: inset 0 0 3px 0px #CECECE;
    }
    svg text {
        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
    }
    svg text::selection {
        background: none;
    }

    .header rect{
        /* fill: #3366FF */
        /* fill: #0099FF */ ;
    }

    .header tspan{
        /* fill: white; */
        font: 10px sans-serif;
        text-anchor: start;
        dominant-baseline: hanging;
    }

    .pattern_hori_sign{
        fill: #000;
        font: 9px sans-serif;
        text-anchor: middle;
        dominant-baseline: hanging;
    }
    .pattern_base_sign{
        fill: #000;
        font: 9px sans-serif;
        text-anchor: start;
        dominant-baseline: hanging;
    }
    
    .pattern_verti_sign{
        fill: #000;
        font: 9px sans-serif;
        text-anchor: start;
        dominant-baseline: middle;
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
    
    .btn_segmentedbutton {
        border-color: #81a4d0;
    }

.link {
    color : blue;
}

.x-autocontainer-form-item,
.x-anchor-form-item,
.x-vbox-form-item,
.x-table-form-item {
    margin-top: 1px;
    margin-bottom: 0px;
}
.x-form-item-label-required {
    /* color: red !important; */
    background:transparent url(/static/ext/ux/image/icons/field_required.gif) no-repeat right;  height:22px;  /* float:left; 9 * 8 */
    background-position: right 3px center;
}

.x-form-item-label {
    background-color : #ddd;
    height : 22px;
    vertical-align: middle;
    margin-top : 0px;
    padding : 0px 0 0 4px;
    line-height : 22px;
}

.x-form-display-field-default {
    min-height : 0px;
}
.x-form-trigger-wrap, .x-form-display-field {
    margin-left: 2px;
}
     html, body {
         margin: 0;
     }

     #SUBJ-0001 {
         position: absolute;
         height: 100%;
         width: 100%;
         overflow: auto;
     }
     #ERD-SUBJECTS {
         position: absolute;
         height: 100%;
         width: 100%;
         overflow: auto;
     }

    .child {
        position: absolute;
        height: 200px;
        width: 100px;
        background-color: #AFBBC6;
        cursor: move;
    }
    #minimap {
        position: fixed;
        width: 125px;
        height: 125px;
        /* top: 820px;
        left: 220px; */
        background-color: #EEE;
        border: 1px solid #AAA;
        opacity: 0.9;
        z-index: 1;
    }

    .minimap-node {
        position: absolute;
        background-color: #db1051;
    }

    .minimap-viewport {
        position: absolute;
        box-sizing: border-box;
        background-color: rgba(79, 111, 126, 0.4);
        z-index: 1;
        cursor: move;
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
    
    var drawDataLoad = new DrawDataLoad();
    
    Ext.onReady(function() {

        var viewSize = Ext.getBody().getViewSize();
        console.log( viewSize ) 
        
        
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            margins: '0 0 0 0',
            items: [{
                region: 'north',
                // html: '<h1 class="x-panel-header">Page Title</h1>',
                border: false,
                margin: '0 0 0 0',
                items: [
                    {   xtype : 'panel',
                        dock: 'bottom',
                        bbar : [
                                {
                                    text: '메뉴1',
                                    menu: [
                                         {
                                             text: '메뉴1-1'
                                         },
                                         {
                                             text: '메뉴1-2'
                                         }
                                   ]
                                },
                                {
                                    text: '메뉴2',
                                    menu: [
                                         {
                                             text: '메뉴2-1'
                                         },
                                         {
                                             text: '메뉴2-2'
                                         }
                                   ]
                                }
                        ]
                    }
                ]
            }, {
                region: 'west',
                collapsible: true,
                title: '도메인/테이블/주제영역',
                xtype: 'panel', // TabPanel itself has no title
                layout: 'accordion',
                id : "LEFT-PANEL",
                split: true,
                border: true,
                width: 300,      // First tab active by default
                listeners : {
                    collapse : function ( _this, eOpts ) {
                        Ext.get('minimap').setLeft(30+25);
                    },
                    expand : function( _this, eOpts) {
                            Ext.get('minimap').setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+25);
                    },
                    resize : function( element, info, eOpts ) {
                        if( element && Ext.get('minimap') ) {
                            Ext.get('minimap').setLeft(element.getWidth()+25);
                        }
                    }
                },
                    
                items: [
                        {
                            xtype : 'treepanel',
                            collapsible: true,
                            // useArrows: true,
                            title : '도메인',
                            rootVisible: false,
                            columnLines: true,
                            id : 'domainTreePanel',
                            tbar: ['->',
                                <tagErd:button type="button" label="모두 펼치기" iconCls="expandAll" cls="btn_segmentedbutton">
                                     listeners : {
                                        click : function(_button, e, eOpts) {
                                             var tree = Ext.getCmp('domainTreePanel');
                                             tree.expandAll();
                                        }
                                     }
                                </tagErd:button>
                                <tagErd:button type="button" label="모두 접기" iconCls="collapseAll" cls="btn_segmentedbutton">
                                    listeners : {
                                       click : function(_button, e, eOpts) {
                                           var tree = Ext.getCmp('domainTreePanel');
                                           tree.collapseAll();
                                       }
                                    }
                               </tagErd:button>
                               <tagErd:button type="button" label="다시 조회" iconCls="reload" cls="btn_segmentedbutton">
                                   listeners : {
                                      click : function(_button, e, eOpts) {
                                          Ext.getStore('domainTreeStore').getProxy().extraParams.PROJECT_ID = 'PROJECT';
                                          Ext.getStore('domainTreeStore').reload();
                                      }
                                   }
                               </tagErd:button>
                            ],
                            <tagErd:store type="treestore" id="domainTreeStore" idProperty="DOMAIN_ID" url="/domain/data/tree.do" rootProperty="CHILDREN" expanded="true" params="PROJECT_ID : 'PROJECT'">
                                fields: [
                                    { name: 'DOMAIN_ID', type: 'string' },
                                    { name: 'DOMAIN_NM', type: 'string' },
                                    { name: 'UP_DOMAIN_ID', type: 'string' },
                                    { name: 'TOP_DOMAIN_NM', type: 'string' },
                                    { name: 'DTYPE', type: 'string' },
                                    { name: 'PROJECT_ID', type: 'string' },
                                    { name: 'LEN1', type: 'string' },
                                    { name: 'LEN2', type: 'string' },
                                    { name: 'DEFAULT_VAL', type: 'string' },
                                    { name: 'ICON_CLS', type: 'string' },
                                    { name: 'iconCls', type: 'string' },
                                    { name: 'COLUMN_CNT', type: 'number' },
                                    { name: 'LAST_UPD_DT', type: 'string' },
                                    { name: 'LAST_UPD_USR_UID', type: 'string' }
                                ],
                            </tagErd:store>
                            folderSort: true,
                            multiSelect: true,
                            // singleExpand: true,
                            columns: [{
                                xtype: 'treecolumn', //this is so we know which column will show the tree
                                text: '도메인명',
                                flex: 1,
                                sortable: true,
                                dataIndex: 'DOMAIN_NM',
                                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                    
                                    var link = new Array();
                                    //if( record.data.LEVEL == 1 ) {
                                    //    link.push( record.data.DOMAIN_NM );
                                    //} else if( record.data.LEVEL > 1) {
                                        /*
                                        var param = "{";
                                        for(var x in record.data ) {
                                            param += ("'"+ x + "' : '" + record.data[x]+"',");
                                        }
                                        param += "}";
                                        console.log( param );
                                        */
                                        // link.push('<span class="link" onclick="ErdAppFunction.editDomainWindow(\''+ record.data.DOMAIN_ID +'\',\''+ record.data.DOMAIN_NM +'\',\''+ record.data.TOP_DOMAIN_NM +'\')" id="domain_edit_'+ record.data.DOMAIN_ID +'">'+record.data.DOMAIN_NM+'</span>');
                                        if( record.data.DTYPE == "COMMENTS" ) {
                                            link.push( record.data.DOMAIN_NM );
                                        } else {
                                            link.push('<span class="link" id="domain_'+ record.data.DOMAIN_ID +'">'+record.data.DOMAIN_NM+'</span>');
                                        }
                                    //}
                                    return link.join(' ');
                                },
                                listeners : {
                                    contextmenu : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                        e.stopEvent();
                                        var items = new Array;
                                        if( record.data.DTYPE != "COMMENTS" ) {
                                            items.push(Ext.create('Ext.Action', {
                                                // iconCls : 'btn-icon-tree-add-first-level',
                                                text: '['+record.data.DOMAIN_NM+']의 하위도메인 등록',
                                                handler : function() {
                                                    ErdAppFunction.addDomainWindow(record.data.DOMAIN_ID, record.data.DOMAIN_NM, record.data.TOP_DOMAIN_NM );
                                                }
                                            }));
                                        }
                                        if( record.data.LEVEL > 1) {
                                            items.push(Ext.create('Ext.Action', {
                                                // iconCls : 'btn-icon-tree-add-first-level',
                                                text: '['+record.data.DOMAIN_NM+']도메인 수정',
                                                handler : function() {
                                                    ErdAppFunction.editDomainWindow(record.data.DOMAIN_ID, record.data.DOMAIN_NM, record.data.TOP_DOMAIN_NM );
                                                }
                                            }));
                                        }
                                        
                                        if( items.length > 0 ) {
                                            var contextMenu = Ext.create('Ext.menu.Menu', {
                                                                items: items
                                                            });
                                            console.log( e.getXY() )
                                            contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                        }
                                        return false;
                                    }
                                    
                                }
                                
                            },
                            {
                                text: '<div style="text-align:center;width:100%;">데이터 타입</div>',
                                width: 90,
                                dataIndex: 'LEN1',
                                align : 'left',
                                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                    
                                    if( record.data.LEVEL == 1) {
                                        return record.data.DTYPE;
                                    } else if( record.data.DTYPE == 'DATE' || record.data.DTYPE == 'DATETIME'|| record.data.DTYPE == 'CLOB' ) {
                                        return record.data.DTYPE;
                                    } else if( record.data.DTYPE == 'VARCHAR' || record.data.DTYPE == 'VARCHAR2' 
                                           || record.data.DTYPE == 'INTEGER' || record.data.DTYPE == 'LONG' ) {
                                        return record.data.DTYPE+'('+record.data.LEN1+')';
                                    } else if( record.data.DTYPE == 'NUMBER' || record.data.DTYPE == 'FLOAT' || record.data.DTYPE == 'DOUBLE'  ) {
                                        if( record.data.LEN2 != null && record.data.LEN2 != '' && record.data.LEN2 != '0' ) {
                                            return record.data.DTYPE+'('+record.data.LEN1 + "," + record.data.LEN2+')';
                                        } else {
                                            return record.data.DTYPE+'('+record.data.LEN1 +')';
                                        }
                                    } else {
                                        return record.data.DTYPE+'('+record.data.LEN1+')';
                                    }
                                }
                            }
                            ,{
                                header: '기본값',
                                width: 50,
                                dataIndex: 'DEFAULT_VAL',
                                align: 'center'
                                //add in the custom tpl for the rows
                            },
                        ]
                    }, 
                    {
                        xtype: 'panel',
                        layout: 'border',
                        border : false,
                        title : '테이블',
                        items : [
                            {
                                region: 'north',
                                title: '테이블 검색조건',
                                height : 124,
                                xtype : 'formPanel_ux',
                                collapsible : true,
                                id : 'tableForm',
                                border : false,
                                bbar : ['->',
                                        <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
                                            listeners : {
                                                click : function(_this, e, eOpts) { 
                                                    if( this.up('form').getForm().isValid() ) {
                                                        var me = this;
                                                        var store = Ext.getStore("entityListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                                    }
                                                }
                                            }
                                        </tagErd:button>
                                ],
                                items : [
                                    <tagErd:itemText type="textfield_ux" label="테이블" name="ENTITY_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                        var me = this;
                                                        var store = Ext.getStore("entityListStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                    }
                                                });
                                            },
                                        }
                                    </tagErd:itemText>
                                    /*
                                    {   
                                        fieldLabel : '테이블',
                                        xtype: 'textfield_ux',
                                        // labelCls   : 'x-form-item-label x-form-item-label-required',
                                        name: 'ENTITY_NMS',
                                        msgTarget: 'side',
                                        allowBlank: true,
                                        anchor: '100%',
                                        // vtype: 'DB_TABLEScale',
                                        style : {padding : "0 3 0 1"},
                                        emptyText : "';'로 구분하면 다건조회 가능",
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                        var me = this;
                                                        var store = Ext.getStore("entityListStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                    }
                                                });
                                            },
                                        }
                                    },
                                    */
                                    {
                                        xtype: 'checkbox_ux',
                                        name : 'EXACT_YN',
                                        label: '정확히 일치하는 테이블만 조회',
                                        boxLabel: '정확히 일치하는 테이블만 조회', 
                                        style : {padding : "0 3 0 3"},
                                        inputValue: 'Y',
                                        checked: false
                                    },
                                    /*
                                    {
                                        xtype: 'checkboxgroup_ux',
                                        name: 'EXACT_YN',
                                        defaults : { name: 'EXACT_YN' },
                                        items: [
                                            { boxLabel: '정확히 일치하는 테이블만 조회',  inputValue: 'Y',  value: 'Y' },
                                        ]
                                    },*/
                                    <tagErd:itemCode type="ext-js-combobox" label="관리상태" name="TABL_SCD" id="TABLE_TABL_SCD" cdGrp="TABL_SCD" firstText="전체" value=""></tagErd:itemCode>
                                    /*
                                    {   
                                        fieldLabel : '관리상태',
                                        xtype: 'combo_ux', 
                                        name: 'DTYPE',
                                        msgTarget: 'side',
                                        anchor: '100%',
                                        style : {padding : "0 3 0 1"},
                                        valueField : 'DTYPE',
                                        displayField: 'DTYPE',
                                        store : Ext.create('Ext.data.Store', {
                                            storeId: 'datatypeListStore',
                                            autoLoad: true,
                                            fields: [
                                                { name: 'DTYPE', type: 'string' },
                                                { name: 'DBASE', type: 'string' },
                                                { name: 'UP_DTYPE', type: 'string' },
                                                { name: 'DTYPE_DESC', type: 'string' },
                                                { name: 'SCALE_YN', type: 'string' },
                                                { name: 'COMMA_YN', type: 'string' },
                                            ],
                                            proxy: {
                                                type: 'ajax',
                                                url : '/datatype/data/list.do',
                                                extraParams : {
                                                    PROJECT_ID : 'PROJECT'
                                                }, // , 
                                                reader: {
                                                    type: 'json',
                                                    rootProperty : 'dataList',
                                                    totalProperty: 'totalCount'
                                                },
                                            }
                                        }),
                                        listeners : {
                                            expand: function(field, eOpts) {
                                                var store1 = this.getStore();//store object
                                                store1.clearFilter();
                                                store1.filter({
                                                    property: 'UP_DTYPE',//your displayField
                                                    anyMatch: true,
                                                    value   : top_domain_nm, // this.getRawValue(),
                                                    exactMatch: false,
                                                    caseSensitive: false
                                                });
                                            }
                                        }
                                    }, 
                                    */
                                ]
                            }, 
                           {   xtype : 'gridpanel',
                               region: 'center',
                               columnLines: true,
                               title : '테이블',
                               store: Ext.create('Ext.data.Store', {
                                   storeId: 'entityListStore',
                                   fields: [
                                      {name:"ENTITY_NM"        , type : "string"},
                                      {name:"TABL_NM"          , type : "string"},
                                      {name:"TABL_SCD"         , type : "string"},
                                      {name:"TABL_SCD_NM"      , type : "string"},
                                      {name:"DML_TYPE"         , type : "string"},
                                      {name:"DML_DT"           , type : "string"},
                                      {name:"APLY_USR_UID"     , type : "string"},
                                      {name:"APLY_DT"          , type : "string"},
                                      {name:"TRT_USR_UID"      , type : "string"},
                                      {name:"TRT_DT"           , type : "string"},
                                      {name:"ENTITY_ID"        , type : "string"},
                                      {name:"TABL_DESC"        , type : "string"},
                                      {name:"FRST_INS_DT"      , type : "string"},
                                      {name:"FRST_INS_USR_UID" , type : "string"},
                                      {name:"LAST_UPD_DT"      , type : "string"},
                                      {name:"LAST_UPD_USR_UID" , type : "string"},
                                      {name:"VERSN"            , type : "string"},
                                      {name:"USE_YN"           , type : "string"},
                                      {name:"COLUMN_CNT"       , type : "string"},
                                      {name:"SUBJECT_IDS"       , type : "string"},
                                      {name:"SUBJECT_NMS"       , type : "string"}
                                   ],  
                                   autoLoad: true,
                                   proxy: {
                                       type: 'ajax',
                                       url: '/entity/data/list.do',
                                       reader: {
                                           type: 'json',
                                           rootProperty: 'data'
                                       },
                                       extraParams: {
                                          PROJECT_ID : 'PROJECT'
                                      }
                                   },
                               }),
                               columns: [
                                   { xtype: 'rownumberer'},
                                   { header: '<div style="text-align:center;width:100%;">ENTITY</div>', dataIndex: 'ENTITY_NM', flex: 1, minWidth : 120,
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                           var link = new Array();
                                           link.push('<span class="link" id="entity_'+ record.data.ENTITY_NM +'">'+ record.data.ENTITY_NM +'</span>');
                                           return link.join(' ');
                                       },
                                       listeners : {
                                           contextmenu : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                               /*
                                               for( var i=0;i<arguments.length; i++ ) {
                                                   try {
                                                        console.log(i,  arguments[i] )
                                                   } catch(e) {
                                                       console.error(e)
                                                   }
                                               }
                                               */
                                               e.stopEvent();
                                               
                                               var items = new Array;
                                               if( record.data.SUBJECT_NMS !=null &&  record.data.SUBJECT_NMS.length > 0 ) {
    
                                                   var subjects = record.data.SUBJECT_NMS.split(",");
                                                   
                                                   for( var i=0;i<subjects.length; i++) {
                                                       items.push(Ext.create('Ext.Action', {
                                                           // iconCls : 'btn-icon-tree-add-first-level',
                                                           text: '주제역영 ['+subjects[i]+']로 이동'
                                                       }));
                                                       
                                                   }
                                               } else {
                                                   items.push(Ext.create('Ext.Action', {
                                                       // iconCls : 'btn-icon-tree-add-first-level',
                                                       text: '테이블이 등록된 주제영역이 없습니다.',
                                                       disabled : true
                                                   }));
                                                   // Ext.Msg.alert('안내', '테이블이 등록된 주제영역이 없습니다.');
                                                   
                                               }
                                               var contextMenu = Ext.create('Ext.menu.Menu', {
                                                   items: items
                                               });
                                               contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                               return false;
                                           }
                                           
                                       }
                                   },
                                   { header: '<div style="text-align:center;width:100%;">테이블명</div>', dataIndex: 'TABL_NM', flex: 1 },
                                   { header: '관리상태', dataIndex: 'TABL_SCD', align:'center', width : 60, },
                                   /*
                                   { header: '<div style="text-align:center;width:100%;">컬럼수</div>', dataIndex: 'COLUMN_CNT', width : 50 , resizeable : false, sortable : false, menuDisabled: true,
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                           
                                           var link = new Array();
                                           link.push('<div style="text-align:right;width:100%;"\>'+record.data.COLUMN_CNT+'</div>');
    
                                           return link.join(' ');
                                       }
                                   }
                                   */
                               ]
                           }
                         ]
                      }
                     , {
                         xtype: 'panel',
                         layout: 'border',
                         border : false,
                         title : '주제영역',
                         items : [
                             {
                                 region: 'north',
                                 title: '주제영역/테이블 검색조건',
                                 height : 125,
                                 xtype : 'formPanel_ux',
                                 collapsible : true,
                                 id : 'subjectAreaForm',
                                 border : false,
                                 bbar : ['->'
                                     , {xtype: 'button', text: '모두 펼치기', iconCls: 'add', cls : 'btn_segmentedbutton',
                                         iconCls:'btn-icon-expand', 
                                         listeners : {
                                            click : function(_button, e, eOpts) {
                                                 var tree = Ext.getCmp('subjectEntityList');
                                                 tree.expandAll();
                                            }
                                         }
                                     }
                                     , {xtype: 'button', text: '모두 접기', iconCls: 'add', cls : 'btn_segmentedbutton',
                                         iconCls:'btn-icon-expand', 
                                         listeners : {
                                            click : function(_button, e, eOpts) {
                                                 var tree = Ext.getCmp('subjectEntityList');
                                                 tree.collapseAll();
                                            }
                                         }
                                     },
                                     {
                                         xtype: 'button', text: '검색', iconCls: 'add', cls : 'btn_segmentedbutton',
                                              listeners : { 
                                                 click : function(_this, e, eOpts) { 
                                                     if( this.up('form').getForm().isValid() ) {
                                                         var me = this;
                                                         // console.log( me.up('form').getForm().getFieldValues() );
                                                         // console.log( me.up('form').getFieldValues(false) )
                                                         console.log( me.up('form').getForm().getValues )
                                                         console.log( me.up('form').getValues )
                                                         var store = Ext.getStore("subjectEntityListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                                     }
                                                 }
                                              }
                                       } // 
                                 ],
                                 items : [
                                     {   
                                         fieldLabel : '주제영역/테이블',
                                         xtype: 'textfield_ux',
                                         // labelCls   : 'x-form-item-label x-form-item-label-required',
                                         name: 'ENTITY_NMS',
                                         msgTarget: 'side',
                                         allowBlank: true,
                                         anchor: '100%',
                                         // vtype: 'DB_TABLEScale',
                                         style : {padding : "0 3 0 1"},
                                         emptyText : "';'로 구분하면 다건조회 가능",
                                         listeners : {
                                             'render' : function(cmp) {
                                                 cmp.getEl().on('keypress', function(e) {
                                                     if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                         var me = this;
                                                         var store = Ext.getStore("subjectEntityListStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                     }
                                                 });
                                             },
                                         }
                                     },
                                     {
                                         xtype: 'checkbox_ux',
                                         name : 'EXACT_YN',
                                         label: '정확히 일치하는 주제영역/테이블만 조회',
                                         boxLabel: '정확히 일치하는 주제영역/테이블만 조회', 
                                         style : {padding : "0 3 0 3"},
                                         inputValue: 'Y',
                                         checked: false
                                     },
                                     /*
                                     {
                                         xtype: 'checkboxgroup_ux',
                                         name: 'EXACT_YN',
                                         defaults : { name: 'EXACT_YN' },
                                         items: [
                                             { boxLabel: '정확히 일치하는 테이블만 조회',  inputValue: 'Y',  value: 'Y' },
                                         ]
                                     },*/
                                     <tagErd:itemCode type="ext-js-combobox" label="테이블 관리상태" name="TABL_SCD" id="TABLE_TABL_SCD_SUBJECT" cdGrp="TABL_SCD" firstText="전체" value=""></tagErd:itemCode>
                                 ]
                             }, 
                              {
                                        xtype : 'treepanel',
                                        region: 'center',
                                        width: 500,
                                        height: 300,
                                        id : 'subjectEntityList',
                                        collapsible: true,
                                        useArrows: true,
                                        title : '주제영역',
                                        rootVisible: false,
                                        multiSelect: false,
                                        store: Ext.create('Ext.data.TreeStore', {
                                            id : "subjectEntityListStore",
                                            fields: [
                                                { name: 'ID', type: 'string' },
                                                { name: 'SUBJECT_ID', type: 'string' },
                                                { name: 'SUBJECT_NM', type: 'string' },
                                                { name: 'UP_SUBJECT_ID', type: 'string' },
                                                { name: 'TABLE_NM', type: 'string' },
                                                { name: 'ORD', type: 'number' },
                                            ],  
                                            autoLoad: true,
                                            proxy : {
                                                type : 'ajax',
                                                url : '/subject/data/tree.do',
                                                reader : {
                                                    type : 'json',
                                                    rootProperty : 'CHILDREN'
                                                },
                                                extraParams: {
                                                    PROJECT_ID : 'PROJECT'
                                                }
                                            },
                                            root: {
                                             expanded: false
                                            },
                                       }),
                                       columns: [
                                           {
                                               xtype: 'treecolumn',  text: '주제영역/테이블', flex: 1, sortable: true, dataIndex: 'SUBJECT_NM' ,
                                               renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                                   var link = new Array();
                                                   link.push('<span class="link" id="subject_'+ record.data.SUBJECT_ID +'">'+ record.data.SUBJECT_NM +'</span>');
                                                   return link.join(' ');
                                               },
                                               listeners : {
                                                   contextmenu : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                                       e.stopEvent();
                                                       var items = new Array;
                                                       if( record.data.ORD == 1 ) {
                                                            items.push(Ext.create('Ext.Action', {
                                                                // iconCls : 'btn-icon-tree-add-first-level',
                                                                text: '주제역영 ['+record.data.SUBJECT_NM+'] 열기'
                                                            }));
                                                       } else if( record.data.ORD == 2 ) {
                                                           items.push(Ext.create('Ext.Action', {
                                                               // iconCls : 'btn-icon-tree-add-first-level',
                                                               text: '테이블 ['+record.data.SUBJECT_NM+']로 이동',
                                                               disabled : false,
                                                               handler : function() {
        
                                                                   var tableGrp = SVG(".table_"+record.data.SUBJECT_ID);
                                                                   var tableRect = SVG(".rect_"+record.data.SUBJECT_ID);
                                                                   var tableGrpBox = { 
                                                                                       left : Math.ceil(tableGrp.transform().translateX)
                                                                                    , top : Math.ceil(tableGrp.transform().translateY)
                                                                                    , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
                                                                                    , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 15
                                                                                   };
                                                                   
                                                                   var wh =  Ext.get('ERD-SUBJECTS').getSize();
                                                                   
                                                                   Ext.get(record.data.UP_SUBJECT_ID).scrollTo('top', tableGrpBox.top+tableRect.height()/2-wh.height/2, true)
                                                                   Ext.get(record.data.UP_SUBJECT_ID).scrollTo('left',  tableGrpBox.left+tableRect.width()/2-wh.width/2, true);
                                                                   
                                                                   tableRect.animate({duration: 1000, delay: 10, when: 'now'}).attr({'stroke-width': 3});
                                                                   tableRect.animate(1000, 1000, 'now').attr({'stroke-width': 0.7});
                                                               }
                                                           }));
                                                           // Ext.Msg.alert('안내', '테이블이 등록된 주제영역이 없습니다.');
                                                           
                                                       }
                                                       var contextMenu = Ext.create('Ext.menu.Menu', {
                                                           items: items
                                                       });
                                                       contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                                       return false;
                                                   }
                                                   
                                               }
                                           },
                                           { header: '<div style="text-align:center;width:100%;">테이블명</div>', dataIndex: 'TABLE_NM', flex: 1 },
                                       ]
                                  }
                             ]
                         }
                     ]
            }, {
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

                    {
                        xtype: 'panel',
                        layout: 'border',
                        border : false,
                        title : '테이블 목록',
                        border : false,
                        items : [
                            {
                                region: 'north',
                                title: '검색조건',
                                height : 122,
                                border : false,
                                xtype : 'formPanel_ux',
                                collapsible : true,
                                id : 'tableLayoutForm',
                                layout: { type: 'table' , columns: 2 },
                                bbar : ['->',
                                    <tagErd:button type="button" label="모두 펼치기" iconCls="expandAll" cls="btn_segmentedbutton">
                                         listeners : {
                                            click : function(_button, e, eOpts) {
                                                 var tree = Ext.getCmp('tableLayoutList');
                                                 tree.expandAll();
                                            }
                                         }
                                    </tagErd:button>
                                    <tagErd:button type="button" label="모두 접기" iconCls="collapseAll" cls="btn_segmentedbutton">
                                        listeners : {
                                           click : function(_button, e, eOpts) {
                                               var tree = Ext.getCmp('tableLayoutList');
                                               tree.collapseAll();
                                           }
                                        }
                                   </tagErd:button>
                                   <tagErd:button type="button" label="검색" iconCls="search" cls="btn_segmentedbutton">
                                       listeners : { 
                                           click : function(_this, e, eOpts) { 
                                               if( this.up('form').getForm().isValid() ) {
                                                   var me = this;
                                                   //console.log( me.up('form').getValues )
                                                   var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                               }
                                           }
                                        }
                                  </tagErd:button>
                                ],
                                items : [
                                    <tagErd:itemText type="textfield_ux" label="테이블" name="ENTITY_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                        var me = this;
                                                        var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                    }
                                                });
                                            },
                                        }
                                    </tagErd:itemText>
                                    {
                                        xtype: 'checkbox_ux',
                                        name : 'EXACT_YN',
                                        label: '정확히 일치하는 테이블만 조회',
                                        boxLabel: '정확히 일치하는 테이블만 조회', 
                                        style : {padding : "0 3 0 3"},
                                        inputValue: 'Y',
                                        checked: false
                                    },
                                    <tagErd:itemText type="textfield_ux" label="컬럼 명" name="COLUMN_NMS" value="" placeholder="';'로 구분하면 다건조회 가능">
                                        listeners : {
                                            'render' : function(cmp) {
                                                cmp.getEl().on('keypress', function(e) {
                                                    if (cmp.value != '' && e.getKey() == e.ENTER) {
                                                        var me = this;
                                                        var store = Ext.getStore("tableLayoutStore").load({page : 1, limit : 999999 , params: cmp.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = cmp.up('form').getForm().getFieldValues(false);
                                                    }
                                                });
                                            },
                                        },
                                    </tagErd:itemText>
                                    {
                                        xtype: 'checkbox_ux',
                                        name : 'EXACT_COLUMN_YN',
                                        label: '정확히 일치하는 컬럼만 조회',
                                        boxLabel: '정확히 일치하는 컬럼만 조회', 
                                        style : {padding : "0 3 0 3"},
                                        inputValue: 'Y',
                                        checked: false
                                    },
                                    /*
                                    {
                                        xtype: 'checkboxgroup_ux',
                                        name: 'EXACT_YN',
                                        defaults : { name: 'EXACT_YN' },
                                        items: [
                                            { boxLabel: '정확히 일치하는 테이블만 조회',  inputValue: 'Y',  value: 'Y' },
                                        ]
                                    },*/
                                    <tagErd:itemCode type="ext-js-combobox" label="관리상태" name="TABL_SCD" id="TABLE_TABL_SCD_ALL" cdGrp="TABL_SCD" firstText="전체" value=""></tagErd:itemCode>
                                    {
                                        value : '',
                                        valueText : '전체',
                                        name : 'DOMAIN_ID',
                                        fieldLabel: '상위도메인',
                                        labelSeparator : '',
                                        xtype: 'combotreegrid_domain',
                                        rootVisible: false,
                                        fields: [
                                            { name: 'DOMAIN_ID', type: 'string' },
                                            { name: 'DOMAIN_NM', type: 'string' },
                                            { name: 'UP_DOMAIN_ID', type: 'string' },
                                            { name: 'DTYPE', type: 'string' },
                                            { name: 'PROJECT_ID', type: 'string' },
                                            { name: 'LEN1', type: 'string' },
                                            { name: 'LEN2', type: 'string' },
                                            { name: 'DEFAULT_VAL', type: 'string' },
                                            { name: 'ICON_CLS', type: 'string' },
                                            { name: 'iconCls', type: 'string' },
                                            { name: 'LAST_UPD_DT', type: 'string' },
                                            { name: 'LAST_UPD_USR_UID', type: 'string' }
                                        ],
                                        autoLoad: true,
                                        proxy: {
                                            type: 'ajax',
                                            url : '/domain/data/tree.do',
                                            extraParams : {
                                                PROJECT_ID : 'PROJECT',
                                                FIRST : 'ALL'
                                            }, // , 
                                            reader: {
                                                type: 'json',
                                                rootProperty : 'CHILDREN',
                                                totalProperty: 'totalCount'
                                            },
                                            root: {
                                                expanded: false
                                            },
                                        }
                                     },
                                ]
                            }, 
                            {   xtype : 'treepanel',
                                title: '전체 테이블목록',
                                region: 'center',
                                columnLines: true,
                                id : 'tableLayoutList',
                                border : true,
                                collapsible: true,
                                useArrows: true,
                                title : '주제영역',
                                rootVisible: false,
                                multiSelect: true,
                                store: Ext.create('Ext.data.TreeStore', {
                                    id : "tableLayoutStore",
                                    fields:[ 
                                        { name: 'ID', type: 'string' },
                                        { name:'ENTITY_ID'         , type:'string'},
                                        { name: 'UP_ENTITY_ID', type: 'string' },
                                        { name:'VERSN'             , type:'string'},
                                        { name:'COLMN_ID'          , type:'string'},
                                        { name:'DOMAIN_ID'         , type:'string'},
                                        { name:'COLMN_NM'          , type:'string'},
                                        { name:'ATTR_NM'           , type:'string'},
                                        { name:'DTYPE'             , type:'string'},
                                        { name:'LEN1'              , type:'string'},
                                        { name:'LEN2'              , type:'string'},
                                        { name:'DML_TYPE'          , type:'string'},
                                        { name:'DML_DT'            , type:'date'},
                                        { name:'APLY_USR_UID'      , type:'string'},
                                        { name:'APLY_DT'           , type:'date'},
                                        { name:'TRT_USR_UID'       , type:'string'},
                                        { name:'TRT_DT'            , type:'date'},
                                        { name:'COLMN_SCD'         , type:'string'},
                                        { name:'NOTNULL_YN'        , type:'string'},
                                        { name:'SEQ'               , type:'string'},
                                        { name:'PK_YN'             , type:'string'},
                                        { name:'FK_ENTITY_ID'      , type:'string'},
                                        { name:'FK_COLMN_ID'       , type:'string'},
                                        { name:'COLMN_DESC'        , type:'string'},
                                        { name:'USE_CD'            , type:'string'},
                                        { name:'NUMB_MTH'          , type:'string'},
                                        { name:'RNUM'              , type:'string'},
                                        
                                        
                                    ], 
                                    autoLoad: true,
                                    proxy : {
                                        type : 'ajax',
                                        url : '/entity/data/entityColumnTree.do',
                                        reader : {
                                            type : 'json',
                                            rootProperty : 'CHILDREN'
                                        },
                                        extraParams: {
                                            PROJECT_ID : 'PROJECT'
                                        }
                                    },
                                    root: {
                                       expanded: false
                                    },
                                }),
                                columns: [
                                    { text: 'NO', header: '<div style="text-align:center;width:100%;">NO</div>', align: "right", dataIndex: 'RNUM', width : 40, resizeable : false, sortable : false, menuDisabled: true, },
                                    { xtype: 'treecolumn',  text: '테이블/컬럼 ID', header: '<div style="text-align:center;width:100%;">테이블/컬럼 ID</div>', flex: 1, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100,
                                        renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            var link = new Array();
                                            link.push('<span class="link" id="table_column_'+ record.data.COLMN_NM +'">'+ record.data.COLMN_NM +'</span>');
                                            return link.join(' ');
                                        },
                                    },
                                    { text: '테이블/컬럼 명', header: '<div style="text-align:center;width:100%;">테이블/컬럼 명</div>', dataIndex: 'ATTR_NM', flex : 1, minWidth : 100, },
                                    { text: '데이터 타입', header: '<div style="text-align:center;width:100%;">데이터 타입</div>', dataIndex: 'DTYPE', width : 90  },
                                    { text: '도메인', header: '<div style="text-align:center;width:100%;">도메인</div>', dataIndex: 'DOMAIN', width : 90  },
                                    { text: 'PK', dataIndex: 'PK', align: "center", width : 40 },
                                    { text: 'Not널', dataIndex: 'IS_NULL', align: "center", width : 45 },
                                    { text: '상태',  header: '<div style="text-align:center;width:100%;">상태</div>',dataIndex: 'FK', width : 120, visible : false,  },
                                ]
                            }
                            
                        ]
                    },
                    {
                        xtype: 'panel',
                        layout: 'border',
                        border : false,
                        title : '단어사전',
                        items : [
                            {
                                region: 'north',
                                title: '검색조건',
                                height : 100,
                                border : false,
                                items : [
                                    
                                ]
                            }, {
                                region: 'center',
                                title: '컬럼목록',
                                border : false,
                                items : [
                                    Ext.create('Ext.grid.Panel', {
                                        columnLines: true,
                                        store: Ext.create('Ext.data.Store', {
                                            fields:[ 'name', 'email', 'phone'],
                                            data: [
                                                { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },
                                                { name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },
                                                { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' },
                                                { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }
                                            ]
                                        }),
                                        columns: [
                                            { text: 'No', dataIndex: 'phone', width:40, resizable : false },
                                            { text: 'Pk', dataIndex: 'phone' },
                                            { text: '컬럼명', dataIndex: 'email', flex: 1 },
                                            { text: '속성명', dataIndex: 'email', flex: 1 },
                                            { text: '데이터타입', dataIndex: 'phone', width:100 },
                                            { text: 'Null?', dataIndex: 'phone', width:40 },
                                            { text: 'Fk?', dataIndex: 'phone', width:40 },
                                        ]
                                    })
                                ]
                            }
                        ]
                    }
                ]
            }, {
                region: 'center',
                xtype: 'panel', // TabPanel itself has no title
                border: true,
                margin: '0 0 0 -2',
                items: [
                        {
                             region: 'north',
                             height : 27,
                             border : false,
                             layout : 'hbox',
                             items : [
                                {
                                    xtype: 'segmentedbutton',
                                    id : 'DRAW_BUTTON',
                                    padding: 3,
                                    forceSelection : false,
                                    items: [
                                        {
                                            xtype: 'button', text: 'Pointer', iconCls: 'add', cls : 'btn_segmentedbutton'
                                            , value : 'pointer'
                                            , pressed : true
                                            ,listeners : {
                                                    click: function(el, opt, event){
                                                        drawDataLoad.cancelRelationByButton();
                                                    }
                                             }                                        
                                        },{
                                            xtype: 'button', text: 'Table',iconCls: 'add', cls : 'btn_segmentedbutton'
                                            , value : 'table'
                                            , listeners : {
                                                click: function(el, opt, event){
                                                    
                                                },
                                            }
                                        },{
                                            xtype: 'button', text: 'View', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                            , value : 'view'
                                            , listeners : {
                                                click: function(el, opt, event){
                                                    console.log(arguments);
                                                },
                                            }
                                        },{
                                            xtype: 'button', text: '1:N', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                             , value : 'rel1toN'
                                             ,listeners : {
                                                   click: function(el, opt, event){
                                                       // 테이블 선택 해제..
                                                        drawDataLoad.setSelectedTables( "SUBJ-0001",  null, false);
                                                    }
                                             }
                                        },{
                                            xtype: 'button', text: '1:1', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : 'rel1to1'
                                                ,listeners : {
                                                      click: function(el, opt, event){
                                                          // 테이블 선택 해제..
                                                           drawDataLoad.setSelectedTables( "SUBJ-0001",  null, false);
                                                       }
                                                }
                                        },{
                                            xtype: 'button', text: '1:1/0', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : 'rel1to0_1'
                                                ,listeners : {
                                                    click: function(el, opt, event){
                                                        // 테이블 선택 해제..
                                                         drawDataLoad.setSelectedTables( "SUBJ-0001",  null, false);
                                                     }
                                              }
                                        },{
                                            xtype: 'button', text: 'Non-identifing', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : 'relNonIden'
                                                ,listeners : {
                                                    click: function(el, opt, event){
                                                         // 테이블 선택 해제..
                                                         drawDataLoad.setSelectedTables( "SUBJ-0001",  null, false);
                                                     }
                                              }
                                        },{
                                            xtype: 'button', text: '삭제', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : 'delete'
                                                ,listeners : {
                                                    click: function(el, opt, event){
                                                         // 테이블 선택 해제..
                                                         drawDataLoad.deleteSelectedObjects( "SUBJ-0001" );
                                                     }
                                              }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'segmentedbutton',
                                    id : 'COLOR_BUTTON',
                                    padding: 3,
                                    forceSelection : false,
                                    items: [
                                        {
                                            xtype: 'button', text: '라인색', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : "line_color" 
                                                , listeners : {
                                                    click: function(el, opt, event){
                                                        Ext.getCmp('DRAW_BUTTON').setValue('pointer') 
                                                        Ext.create('Ext.menu.ColorPicker', {
                                                                    listeners : {
                                                                        select : function ( _this, color, eOpts ) {
                                                                            drawDataLoad.setTableLineColor(color); 
                                                                            drawDataLoad.setRelationLineColor(color); 
                                                                            /*
                                                                            drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(key, val){
                                                                                
                                                                                drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], key).setTableLineColor(color); 
                                                                                
                                                                            });
                                                                            */
                                                                        }
                                                                    }
                                                                    
                                                         }).showAt([el.getBox().x, el.getBox().y+el.getBox().height]);

                                                    },
                                                }
                                        },{
                                            xtype: 'button', text: '배경색', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : "background_color"    
                                                , listeners : {
                                                    click: function(el, opt, event){
                                                        Ext.getCmp('DRAW_BUTTON').setValue('pointer') 
                                                        Ext.create('Ext.menu.ColorPicker', {
                                                                    listeners : {
                                                                        select : function ( _this, color, eOpts ) { 
                                                                            drawDataLoad.setTableBackgroundColor(color);
                                                                            /*
                                                                            drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(key, val){
                                                                                
                                                                                drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], key).setTableBackgroundColor(color);
                                                                                
                                                                            });
                                                                            */
                                                                        }
                                                                    }
                                                                    
                                                         }).showAt([el.getBox().x, el.getBox().y+el.getBox().height]);

                                                    },
                                                }
                                        },{
                                            xtype: 'button', text: '테이블 글자색', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : "table_name_color"    
                                                , listeners : {
                                                    click: function(el, opt, event){
                                                        Ext.getCmp('DRAW_BUTTON').setValue('pointer') 
                                                        Ext.create('Ext.menu.ColorPicker', {
                                                                    listeners : {
                                                                        select : function ( _this, color, eOpts ) {
                                                                            drawDataLoad.setTableNameColor(color);
                                                                            /*
                                                                            drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(key, val){
                                                                                
                                                                                drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], key).setTableNameColor(color);
                                                                                
                                                                            });
                                                                            */
                                                                        }
                                                                    }
                                                                    
                                                         }).showAt([el.getBox().x, el.getBox().y+el.getBox().height]);

                                                    },
                                                }
                                        },{
                                            xtype: 'button', text: '테이블 배경색', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : "table_background_color"    
                                                , listeners : {
                                                    click: function(el, opt, event){
                                                        Ext.getCmp('DRAW_BUTTON').setValue('pointer') 
                                                        Ext.create('Ext.menu.ColorPicker', {
                                                                    listeners : {
                                                                        select : function ( _this, color, eOpts ) {
                                                                            drawDataLoad.setTableNameBackgroundColor(color);
                                                                            /*
                                                                            drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(key, val){
                                                                                
                                                                                drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], key).setTableNameBackgroundColor(color);
                                                                                
                                                                            });
                                                                            */
                                                                        }
                                                                    }
                                                                    
                                                         }).showAt([el.getBox().x, el.getBox().y+el.getBox().height]);

                                                    },
                                                }
                                        }
                                   ]
                                },
                                {
                                    xtype: 'segmentedbutton',
                                    padding: 3,
                                    items: [
                                        {
                                            xtype: 'button', text: '네모', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , listeners : {
                                                    click: function(el, opt, event){
                                                        Ext.getCmp("DRAW_BUTTON").items.items[0].setPressed(false);
                                                        Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);

                                                    },
                                                }
                                        },{
                                            xtype: 'button', text: '', disabled : true
                                        },{
                                            xtype: 'button', text: '동그라미', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , listeners : {
                                                    click: function(el, opt, event){
                                                        Ext.getCmp("DRAW_BUTTON").items.items[0].setPressed(false);
                                                        Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);
                                                        
                                                    },
                                                }
                                        },{
                                            xtype: 'button', text: 'Text', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , listeners : {
                                                    click: function(el, opt, event){
                                                        Ext.getCmp("DRAW_BUTTON").items.items[0].setPressed(false);
                                                        Ext.getCmp("COLOR_BUTTON").items.items[0].setPressed(false);
                                                        

                                                    },
                                                }
                                        }
                                   ]
                                }

                             ]
                       },
                       {
                            xtype: 'panel', 
                            region: 'center',
                            border : true,
                            layout: 'border',
                            flex:1,
                            height: viewSize.height-58,
                            id : 'ERD-SUBJECTS-PANEL',
                            items : [
                                {
                                    xtype: 'tabpanel', // TabPanel itself has no title
                                    region: 'center',
                                    // scrollable  : true,
                                    id : 'ERD-SUBJECTS',
                                    border : false,
                                    items : [
                                        /*
                                        {
                                            title: 'First',
                                            xtype : 'component',
                                            width: 8000,
                                            height: viewSize.height-83, // 5000, //  
                                            // padding: 20,
                                            id : 'SUBJ-0001',
                                            html : "<div id='minimap'></div>",
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
                                                            
                                                            drawDataLoad.setDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"], new DrawTable( draw, subjectAreaInfo, tableInfo, drawDataLoad ));
                                                            
                                                            drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).drawTable();
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
                                                            
                                                        }
                                                        
                                                    }
                                                    
                                                    Ext.defer(function () {
                                                        var container = Ext.getDoc('SUBJ-0001');
                                                        container.scrollTo(0, 1000); // Scroll to X: 0, Y: 500
                                                    }, 1000);
                                                    // Ext.getDoc('SUBJ-0001').scroll( 't',  1500 );
                                                    // Ext.getDoc('SUBJ-0001').scrollBy( 1500,  1500 );
                                                    // Ext.getDoc('SUBJ-0001').scrollTo( 1500,  1500 );
                                                    
                                                    
                                                    $( "#minimap" ).minimap( $("#SUBJ-0001") );
                                                }
                                            }
                                        }
                                        ,{
                                            xtype : 'container',
                                            width : '100%',
                                            height : '100%',
                                            layout : {
                                                type : 'vbox',
                                                align : 'stretch'
                                            },
                                            items : [
                                                {
                                                    xtype : 'panel',
                                                    flex : 100,
                                                    autoScroll: true,
                                                    id : 'subj_2'
                                                }
                                            ]
                                        }
                                        ,
                                        Ext.create('Ext.Component', {
                                            title: 'Component',
                                            width: 300,
                                            height: 200,
                                            padding: 20,
                                            style: {
                                                color: '#FFFFFF',
                                                backgroundColor:'#000000'
                                            }, 
                                            listeners : {
                                                afterrender : function( _this, eOpts ) {
                                                    console.log( _this )
                                                }
                                            }
                                        })
                                        , {
                                            title: 'Home',
                                            xtype : 'panel',
                                            autoScroll: true,
                                            //minHeigth : '100%',
                                            //minWidth : '100%',
                                            //minWidth : 5000,
                                            //minHeight : 5000,
                                            // contentEl : 'subj_1'
                                            //id : 'subj_1'
                                        },
                                        {
                                            xtype : 'panel',
                                            title: 'Simpsons',
                                            id : 'subj_3',
                                            listeners : {
                                                added  : function(sender, container, index, eOpts) {
                                                    // 
                                                }
                                                
                                            }
                                        }*/
                                    ]
                                }, 
                                {
                                    region: 'east',
                                    title: '테이블 정보',
                                    xtype: 'tabpanel', // TabPanel itself has no title
                                    split: true,
                                    collapsible: true,
                                    collapsed : true,
                                    activeTab: 0,      // First tab active by default
                                    width: 650,      // First tab active by default
                                    margin: '0 0 0 -2',
                                    border : true,
                                    items: [
                                        {
                                            xtype: 'panel',
                                            layout: 'border',
                                            border : false,
                                            title : '선택된 테이블 상세',
                                            items : [
                                                {
                                                    region: 'north',
                                                    title: '테이블 상세',
                                                    height : 100,
                                                    border : false,
                                                    items : [
                                                        
                                                    ]
                                                }, {
                                                    region: 'center',
                                                    title: '컬럼목록',
                                                    border : false,
                                                    items : [
                                                        Ext.create('Ext.grid.Panel', {
                                                            columnLines: true,
                                                            store: Ext.create('Ext.data.Store', {
                                                                fields:[ 'name', 'email', 'phone'],
                                                                data: [
                                                                    { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224', pk : true },
                                                                    { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },
                                                                    { name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },
                                                                    { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' },
                                                                    { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }
                                                                ]
                                                            }),
                                                            columns: [
                                                                { text: 'No', dataIndex: 'phone', width:40, resizable : false },
                                                                { text: 'Pk', dataIndex: 'pk', width:30, resizable : false , renderer : function(value) {
                                                                    return value ? "Y" : "";
                                                                }},
                                                                { text: '컬럼명', dataIndex: 'email', flex: 1 },
                                                                { text: '속성명', dataIndex: 'email', flex: 1 },
                                                                { text: '도메인', dataIndex: 'phone', width:100 },
                                                                { text: '데이터타입', dataIndex: 'phone', width:100 },
                                                                { text: 'Null?', dataIndex: 'phone', width:40 },
                                                                { text: 'Fk?', dataIndex: 'phone', width:40 },
                                                            ]
                                                        })
                                                    ]
                                                }, 
                                                {
                                                    region: 'south',
                                                    title: '인덱스',
                                                    border : false,
                                                    split: true,
                                                    collapsed : true,
                                                    collapsible: true,
                                                    height : 150,
                                                    items : [
                                                        
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                       }

                ]
            }, {
                region: 'south',
                html: '',
                border: false,
                margin: '0 0 5 0'
            }]
        });

        
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
                    
                    
                    /*
                    Ext.defer(function () {
                        var container = Ext.getDoc('SUBJ-0001');
                        container.scrollTo(0, 1000); // Scroll to X: 0, Y: 500
                    }, 1000);
                    Ext.getDoc('SUBJ-0001').scroll( 't',  1500 );
                    Ext.getDoc('SUBJ-0001').scrollBy( 1500,  1500 );
                    Ext.getDoc('SUBJ-0001').scrollTo( 1500,  1500 );
                    */
                    Ext.defer(function () {

                    }, 1000);
                    $( "#minimap" ).minimap( $("#SUBJ-0001") );
                }
            }


        });
       
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
        
        Ext.get('ERD-SUBJECTS-PANEL').setHeight(viewSize.height-83+24);
        
        Ext.get('ERD-SUBJECTS').setHeight(viewSize.height-83+24);
        Ext.get('SUBJ-0001').setHeight(viewSize.height-83+24);
        Ext.get('minimap').setTop(viewSize.height-83+24-70-24);
        Ext.get('minimap').setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+25);
        /*
        Ext.get('ERD-SUBJECTS-body').setHeight(viewSize.height-83);
        Ext.get('ERD-SUBJECTS-body').setHeight(viewSize.height-83);
        */
        Ext.getCmp('ERD-SUBJECTS-PANEL').setHeight(viewSize.height-83+24);
        Ext.getCmp('ERD-SUBJECTS').setHeight(viewSize.height-83+24);
        Ext.getCmp('SUBJ-0001').setHeight(viewSize.height-83+24);

    });
    
    
    window.onbeforeunload = function() {
        return "사이트를 나가시겠습니까?"; 
    };
    </script>
</head>
<body>
    <div style="display:none;">
        <div id="subj_1" style="width:8000px;height:5000px;">
        </div>
    </div>

</body>
</html>