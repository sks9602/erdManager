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


     html, body {
         margin: 0;
     }

     #ID_SUBJ_1 {
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
                        //setTimeout(function() {
                        //    console.log( _this )
                        //    console.log( _this.getWidth() , Ext.getCmp('LEFT-PANEL').getWidth());
                            Ext.get('minimap').setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+25);
                        //}, 1000);
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
                            width: 500,
                            height: 300,
                            collapsible: true,
                            useArrows: true,
                            title : '도메인',
                            rootVisible: false,
                            tbar: ['->', {
                                xtype: 'segmentedbutton',
                                padding: 3,
                                forceSelection : true,
                                items: [
                                    {
                                        xtype: 'button', text: 'Pointer', iconCls: 'add', cls : 'btn_segmentedbutton'
                                    },{
                                        xtype: 'button', text: 'Table',iconCls: 'add', cls : 'btn_segmentedbutton'
                                    },{
                                        xtype: 'button', text: 'View', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                        , listeners : {
                                            click: function(el, opt, event){
                                                console.log(arguments);
                                            },
                                        }
                                    }
                                ]
                            }],
                            store: Ext.create('Ext.data.TreeStore', {
                                fields: [
                                    { name: 'task', type: 'string' },
                                    { name: 'user', type: 'string' },
                                    { name: 'duration', type: 'string' },
                                    { name: 'done', type: 'boolean' }
                                ],
                                data : {"text":".","children": [
                                    {
                                        task:'Project: Shopping',
                                        duration:13.25,
                                        user:'Tommy Maintz',
                                        iconCls:'task-folder',
                                        expanded: true,
                                        children:[{
                                            task:'Housewares',
                                            duration:1.25,
                                            user:'Tommy Maintz',
                                            iconCls:'task-folder',
                                            children:[{
                                                task:'Kitchen supplies',
                                                duration:0.25,
                                                user:'Tommy Maintz',
                                                leaf:true,
                                                iconCls:'task'
                                            },{
                                                task:'Groceries',
                                                duration:.4,
                                                user:'Tommy Maintz',
                                                leaf:true,
                                                iconCls:'task',
                                                done: true
                                            },{
                                                task:'Cleaning supplies',
                                                duration:.4,
                                                user:'Tommy Maintz',
                                                leaf:true,
                                                iconCls:'task'
                                            },{
                                                task: 'Office supplies',
                                                duration: .2,
                                                user: 'Tommy Maintz',
                                                leaf: true,
                                                iconCls: 'task'
                                            }]
                                        }, {
                                            task:'Remodeling',
                                            duration:12,
                                            user:'Tommy Maintz',
                                            iconCls:'task-folder',
                                            expanded: true,
                                            children:[{
                                                task:'Retile kitchen',
                                                duration:6.5,
                                                user:'Tommy Maintz',
                                                leaf:true,
                                                iconCls:'task'
                                            },{
                                                task:'Paint bedroom',
                                                duration: 2.75,
                                                user:'Tommy Maintz',
                                                iconCls:'task-folder',
                                                children: [{
                                                    task: 'Ceiling',
                                                    duration: 1.25,
                                                    user: 'Tommy Maintz',
                                                    iconCls: 'task',
                                                    leaf: true
                                                }, {
                                                    task: 'Walls',
                                                    duration: 1.5,
                                                    user: 'Tommy Maintz',
                                                    iconCls: 'task',
                                                    leaf: true
                                                }]
                                            },{
                                                task:'Decorate living room',
                                                duration:2.75,
                                                user:'Tommy Maintz',
                                                leaf:true,
                                                iconCls:'task',
                                                done: true
                                            },{
                                                task: 'Fix lights',
                                                duration: .75,
                                                user: 'Tommy Maintz',
                                                leaf: true,
                                                iconCls: 'task',
                                                done: true
                                            }, {
                                                task: 'Reattach screen door',
                                                duration: 2,
                                                user: 'Tommy Maintz',
                                                leaf: true,
                                                iconCls: 'task'
                                            }]
                                        }]
                                    },{
                                        task:'Project: Testing',
                                        duration:2,
                                        user:'Core Team',
                                        iconCls:'task-folder',
                                        children:[{
                                            task: 'Mac OSX',
                                            duration: 0.75,
                                            user: 'Tommy Maintz',
                                            iconCls: 'task-folder',
                                            children: [{
                                                task: 'FireFox',
                                                duration: 0.25,
                                                user: 'Tommy Maintz',
                                                iconCls: 'task',
                                                leaf: true
                                            }, {
                                                task: 'Safari',
                                                duration: 0.25,
                                                user: 'Tommy Maintz',
                                                iconCls: 'task',
                                                leaf: true
                                            }, {
                                                task: 'Chrome',
                                                duration: 0.25,
                                                user: 'Tommy Maintz',
                                                iconCls: 'task',
                                                leaf: true
                                            }]
                                        },{
                                            task: 'Windows',
                                            duration: 3.75,
                                            user: 'Darrell Meyer',
                                            iconCls: 'task-folder',
                                            children: [{
                                                task: 'FireFox',
                                                duration: 0.25,
                                                user: 'Darrell Meyer',
                                                iconCls: 'task',
                                                leaf: true
                                            }, {
                                                task: 'Safari',
                                                duration: 0.25,
                                                user: 'Darrell Meyer',
                                                iconCls: 'task',
                                                leaf: true
                                            }, {
                                                task: 'Chrome',
                                                duration: 0.25,
                                                user: 'Darrell Meyer',
                                                iconCls: 'task',
                                                leaf: true
                                            },{
                                                task: 'Internet Exploder',
                                                duration: 3,
                                                user: 'Darrell Meyer',
                                                iconCls: 'task',
                                                leaf: true
                                            }]
                                        },{
                                            task: 'Linux',
                                            duration: 0.5,
                                            user: 'Aaron Conran',
                                            iconCls: 'task-folder',
                                            children: [{
                                                task: 'FireFox',
                                                duration: 0.25,
                                                user: 'Aaron Conran',
                                                iconCls: 'task',
                                                leaf: true
                                            }, {
                                                task: 'Chrome',
                                                duration: 0.25,
                                                user: 'Aaron Conran',
                                                iconCls: 'task',
                                                leaf: true
                                            }]
                                        }]
                                    }
                                ]},
                                folderSort: true
                            }),
                            multiSelect: true,
                            // singleExpand: true,
                            columns: [{
                                xtype: 'treecolumn', //this is so we know which column will show the tree
                                text: '도메인명',
                                flex: 2,
                                sortable: true,
                                dataIndex: 'task'
                            },{
                                //we must use the templateheader component so we can use a custom tpl
                                xtype: 'templatecolumn',
                                text: 'DataType',
                                flex: 1,
                                sortable: true,
                                dataIndex: 'duration',
                                align: 'center',
                                //add in the custom tpl for the rows
                                tpl: Ext.create('Ext.XTemplate', '{duration:this.formatHours}', {
                                    formatHours: function(v) {
                                        if (v < 1) {
                                            return Math.round(v * 60) + ' mins';
                                        } else if (Math.floor(v) !== v) {
                                            var min = v - Math.floor(v);
                                            return Math.floor(v) + 'h ' + Math.round(min * 60) + 'm';
                                        } else {
                                            return v + ' hour' + (v === 1 ? '' : 's');
                                        }
                                    }
                                })
                            },{
                                text: '길이',
                                flex: 1,
                                dataIndex: 'user',
                                sortable: true
                            }, {
                                header: '+',
                                width: 40
                            }/*, {
                                xtype: 'checkcolumn',
                                header: 'Done',
                                dataIndex: 'done',
                                width: 40,
                                stopSelection: false
                            }, {
                                text: 'Edit',
                                width: 40,
                                menuDisabled: true,
                                xtype: 'actioncolumn',
                                tooltip: 'Edit task',
                                align: 'center',
                                icon: '../simple-tasks/resources/images/edit_task.png',
                                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                                    Ext.Msg.alert('Editing' + (record.get('done') ? ' completed task' : '') , record.get('task'));
                                }
                            }*/]
                        }
                      
                    , 
                       {    xtype : 'gridpanel',
                           title: 'Simpsons',
                           columnLines: true,
                           title : '테이블',
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
                               { text: 'Name', dataIndex: 'name' },
                               { text: 'Email', dataIndex: 'email', flex: 1 },
                               { text: 'Phone', dataIndex: 'phone' }
                           ]
                       }
                     , 
                     
                      {
                    	        xtype : 'treepanel',
                                width: 500,
                                height: 300,
                                collapsible: true,
                                useArrows: true,
                                title : '주제영역',
                                rootVisible: false,
                                store: Ext.create('Ext.data.TreeStore', {
                                    fields: [
                                        { name: 'task', type: 'string' },
                                        { name: 'user', type: 'string' },
                                        { name: 'duration', type: 'string' },
                                        { name: 'done', type: 'boolean' }
                                    ],
                                    data : {"text":".","children": [
                                        {
                                            task:'Project: Shopping',
                                            duration:13.25,
                                            user:'Tommy Maintz',
                                            iconCls:'task-folder',
                                            expanded: true,
                                            children:[{
                                                task:'Housewares',
                                                duration:1.25,
                                                user:'Tommy Maintz',
                                                iconCls:'task-folder',
                                                children:[{
                                                    task:'Kitchen supplies',
                                                    duration:0.25,
                                                    user:'Tommy Maintz',
                                                    leaf:true,
                                                    iconCls:'task'
                                                },{
                                                    task:'Groceries',
                                                    duration:.4,
                                                    user:'Tommy Maintz',
                                                    leaf:true,
                                                    iconCls:'task',
                                                    done: true
                                                }]
                                            }, {
                                                task:'Remodeling',
                                                duration:12,
                                                user:'Tommy Maintz',
                                                iconCls:'task-folder',
                                                expanded: true,
                                                children:[{
                                                    task:'Retile kitchen',
                                                    duration:6.5,
                                                    user:'Tommy Maintz',
                                                    leaf:true,
                                                    iconCls:'task'
                                                },{
                                                    task:'Paint bedroom',
                                                    duration: 2.75,
                                                    user:'Tommy Maintz',
                                                    iconCls:'task-folder',
                                                    children: [{
                                                        task: 'Ceiling',
                                                        duration: 1.25,
                                                        user: 'Tommy Maintz',
                                                        iconCls: 'task',
                                                        leaf: true
                                                    }, {
                                                        task: 'Walls',
                                                        duration: 1.5,
                                                        user: 'Tommy Maintz',
                                                        iconCls: 'task',
                                                        leaf: true
                                                    }]
                                                },{
                                                    task:'Decorate living room',
                                                    duration:2.75,
                                                    user:'Tommy Maintz',
                                                    leaf:true,
                                                    iconCls:'task',
                                                    done: true
                                                },{
                                                    task: 'Fix lights',
                                                    duration: .75,
                                                    user: 'Tommy Maintz',
                                                    leaf: true,
                                                    iconCls: 'task',
                                                    done: true
                                                }, {
                                                    task: 'Reattach screen door',
                                                    duration: 2,
                                                    user: 'Tommy Maintz',
                                                    leaf: true,
                                                    iconCls: 'task'
                                                }]
                                            }]
                                        },{
                                            task:'Project: Testing',
                                            duration:2,
                                            user:'Core Team',
                                            iconCls:'task-folder',
                                            children:[{
                                                task: 'Mac OSX',
                                                duration: 0.75,
                                                user: 'Tommy Maintz',
                                                iconCls: 'task-folder',
                                                children: [{
                                                    task: 'FireFox',
                                                    duration: 0.25,
                                                    user: 'Tommy Maintz',
                                                    iconCls: 'task',
                                                    leaf: true
                                                }]
                                            },{
                                                task: 'Windows',
                                                duration: 3.75,
                                                user: 'Darrell Meyer',
                                                iconCls: 'task-folder',
                                                children: [{
                                                    task: 'FireFox',
                                                    duration: 0.25,
                                                    user: 'Darrell Meyer',
                                                    iconCls: 'task',
                                                    leaf: true
                                                }, {
                                                    task: 'Safari',
                                                    duration: 0.25,
                                                    user: 'Darrell Meyer',
                                                    iconCls: 'task',
                                                    leaf: true
                                                }, {
                                                    task: 'Chrome',
                                                    duration: 0.25,
                                                    user: 'Darrell Meyer',
                                                    iconCls: 'task',
                                                    leaf: true
                                                },{
                                                    task: 'Internet Exploder',
                                                    duration: 3,
                                                    user: 'Darrell Meyer',
                                                    iconCls: 'task',
                                                    leaf: true
                                                }]
                                            },{
                                                task: 'Linux',
                                                duration: 0.5,
                                                user: 'Aaron Conran',
                                                iconCls: 'task-folder',
                                                children: [{
                                                    task: 'FireFox',
                                                    duration: 0.25,
                                                    user: 'Aaron Conran',
                                                    iconCls: 'task',
                                                    leaf: true
                                                }, {
                                                    task: 'Chrome',
                                                    duration: 0.25,
                                                    user: 'Aaron Conran',
                                                    iconCls: 'task',
                                                    leaf: true
                                                }]
                                            }]
                                        }
                                    ]},
                                    folderSort: true
                                }),
                                multiSelect: true,
                                // singleExpand: true,
                                columns: [{
                                    xtype: 'treecolumn', //this is so we know which column will show the tree
                                    text: '도메인명',
                                    flex: 2,
                                    sortable: true,
                                    dataIndex: 'task'
                                },{
                                    //we must use the templateheader component so we can use a custom tpl
                                    xtype: 'templatecolumn',
                                    text: 'DataType',
                                    flex: 1,
                                    sortable: true,
                                    dataIndex: 'duration',
                                    align: 'center',
                                    //add in the custom tpl for the rows
                                    tpl: Ext.create('Ext.XTemplate', '{duration:this.formatHours}', {
                                        formatHours: function(v) {
                                            if (v < 1) {
                                                return Math.round(v * 60) + ' mins';
                                            } else if (Math.floor(v) !== v) {
                                                var min = v - Math.floor(v);
                                                return Math.floor(v) + 'h ' + Math.round(min * 60) + 'm';
                                            } else {
                                                return v + ' hour' + (v === 1 ? '' : 's');
                                            }
                                        }
                                    })
                                },{
                                    text: '길이',
                                    flex: 1,
                                    dataIndex: 'user',
                                    sortable: true
                                }]
                            }
                ]
            }, {
                region: 'east',
                title: '테이블 정보/단어사전',
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
                        title : '단어사전',
                        items : [
                            {
                                region: 'north',
                                title: '검색조건',
                                height : 100,
                                border : false,
                                items : [
                                    
                                ]
                            }, 
                            {   xtype : 'gridpanel',
		                        title: '전체 테이블목록',
		                        region: 'center',
		                        columnLines: true,
		                        border : false,
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
		                            { text: '테이블명', dataIndex: 'name' },
		                            { text: '컬럼No', dataIndex: 'phone' },
		                            { text: 'Pk', dataIndex: 'phone' },
		                            { text: '컬럼명', dataIndex: 'email', flex: 1 },
		                            { text: '데이터타입', dataIndex: 'phone' },
		                            { text: 'Null?', dataIndex: 'phone' },
		                            { text: 'Fk?', dataIndex: 'phone' },
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
                                                    	drawDataLoad.setSelectedTables( "ID_SUBJ_1",  null, false);
                                                    }
                                             }
                                        },{
                                            xtype: 'button', text: '1:1', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : 'rel1to1'
                                                ,listeners : {
                                                      click: function(el, opt, event){
                                                          // 테이블 선택 해제..
                                                           drawDataLoad.setSelectedTables( "ID_SUBJ_1",  null, false);
                                                       }
                                                }
                                        },{
                                            xtype: 'button', text: '1:1/0', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : 'rel1to0_1'
                                                ,listeners : {
                                                    click: function(el, opt, event){
                                                        // 테이블 선택 해제..
                                                         drawDataLoad.setSelectedTables( "ID_SUBJ_1",  null, false);
                                                     }
                                              }
                                        },{
                                            xtype: 'button', text: 'Non-identifing', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : 'relNonIden'
                                                ,listeners : {
                                                    click: function(el, opt, event){
                                                         // 테이블 선택 해제..
                                                         drawDataLoad.setSelectedTables( "ID_SUBJ_1",  null, false);
                                                     }
                                              }
                                        },{
                                            xtype: 'button', text: '삭제', iconCls: 'add16', cls : 'btn_segmentedbutton'
                                                , value : 'delete'
                                                ,listeners : {
                                                    click: function(el, opt, event){
                                                         // 테이블 선택 해제..
                                                         drawDataLoad.deleteSelectedObjects( "ID_SUBJ_1" );
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
		                                    id : 'ID_SUBJ_1',
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
		                                                var container = Ext.getDoc('ID_SUBJ_1');
		                                                container.scrollTo(0, 1000); // Scroll to X: 0, Y: 500
		                                            }, 1000);
		                                            // Ext.getDoc('ID_SUBJ_1').scroll( 't',  1500 );
		                                            // Ext.getDoc('ID_SUBJ_1').scrollBy( 1500,  1500 );
		                                            // Ext.getDoc('ID_SUBJ_1').scrollTo( 1500,  1500 );
		                                            
		                                            
		                                            $( "#minimap" ).minimap( $("#ID_SUBJ_1") );
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
            id : 'ID_SUBJ_1',
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
                        target: Ext.getDoc('ID_SUBJ_1') // Ext.getBody()
                      , binding: {
                          key: Ext.event.Event.DELETE,
                          handler: function(keyCode, e) {
                        	  drawDataLoad.deleteSelectedObjects( "ID_SUBJ_1" );
                          }
                      }
                    });
                    
                    Ext.defer(function () {
                        var container = Ext.getDoc('ID_SUBJ_1');
                        container.scrollTo(0, 1000); // Scroll to X: 0, Y: 500
                    }, 1000);
                    // Ext.getDoc('ID_SUBJ_1').scroll( 't',  1500 );
                    // Ext.getDoc('ID_SUBJ_1').scrollBy( 1500,  1500 );
                    // Ext.getDoc('ID_SUBJ_1').scrollTo( 1500,  1500 );
                    
                    
                    $( "#minimap" ).minimap( $("#ID_SUBJ_1") );
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
        Ext.get('ID_SUBJ_1').setHeight(viewSize.height-83+24);
        Ext.get('minimap').setTop(viewSize.height-83+24-70-24);
        Ext.get('minimap').setLeft(Ext.getCmp('LEFT-PANEL').getWidth()+25);
        /*
        Ext.get('ERD-SUBJECTS-body').setHeight(viewSize.height-83);
        Ext.get('ERD-SUBJECTS-body').setHeight(viewSize.height-83);
        */
        Ext.getCmp('ERD-SUBJECTS-PANEL').setHeight(viewSize.height-83+24);
        Ext.getCmp('ERD-SUBJECTS').setHeight(viewSize.height-83+24);
        Ext.getCmp('ID_SUBJ_1').setHeight(viewSize.height-83+24);

    });
    
    

    </script>
</head>
<body>
    <div style="display:none;">
        <div id="subj_1" style="width:8000px;height:5000px;">
        </div>
    </div>

</body>
</html>