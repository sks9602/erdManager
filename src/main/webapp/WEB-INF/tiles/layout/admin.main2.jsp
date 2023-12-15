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
    <link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-crisp/resources/theme-crisp-all-debug.css">
    
    <script type="text/javascript" src="https://cdn.sencha.com/ext/commercial/7.6.0/build/ext-all-debug.js"></script>
    <script type="text/javascript" src="https://cdn.sencha.com/ext/commercial/7.6.0/build/classic/theme-neptune/theme-neptune-debug.js"></script>

    <!--  link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.6.0/build/classic/theme-triton/resources/theme-triton-all-debug.css">
    <link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.6.0/build/classic/theme-triton/resources/theme-triton-all-debug_1.css">
    <link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.6.0/build/classic/theme-triton/resources/theme-triton-all-debug_2.css">

    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/build/ext-all-debug.js"></script>

    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/Component.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/container/ButtonGroup.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/form/field/HtmlEditor.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/grid/RowEditor.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/grid/column/RowNumberer.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/layout/component/Dock.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/menu/Menu.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/menu/Separator.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/panel/Panel.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/panel/Table.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/picker/Month.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/resizer/Splitter.js?_dc=1684678531811"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/toolbar/Paging.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/toolbar/Toolbar.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/Component.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/form/field/Checkbox.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/grid/column/Check.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/grid/column/Column.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/grid/column/RowNumberer.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/grid/plugin/RowExpander.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/list/TreeItem.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/menu/Item.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/menu/Menu.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/picker/Date.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/picker/Month.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/resizer/Splitter.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/selection/CheckboxModel.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/selection/SpreadsheetModel.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-triton/overrides/toolbar/Paging.js?_dc=1684678531812"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/container/ButtonGroup.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/Component.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/layout/component/Dock.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/form/field/HtmlEditor.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/menu/Menu.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/picker/Month.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/toolbar/Paging.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/panel/Panel.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/grid/RowEditor.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/grid/column/RowNumberer.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/menu/Separator.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/resizer/Splitter.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/panel/Table.js"></script>
    <script type="text/javascript" charset="UTF-8" src="/static/ext-js/classic/theme-neptune/overrides/toolbar/Toolbar.js"></script -->

    <script type="text/javascript">
	    if (Ext.Loader) {
	        Ext.Loader.setPath({
	            'Ext.ux' : 'https://cdn.sencha.com/ext/commercial/7.6.0/packages/ux/src',
	            // 'Ext.field' : 'http://127.0.0.1:9081/contents/extjs/field'
	        });
	    }
    </script>
    
    <script>

    Ext.onReady(function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [{
                region: 'north',
                html: '<h1 class="x-panel-header">Page Title</h1>',
                border: false,
                margin: '0 0 5 0'
            }, {
                region: 'west',
                collapsible: true,
                title: 'Navigation',
                split: true,
                width: 150
                // could use a TreePanel or AccordionLayout for navigational items
            }, {
                region: 'south',
                title: 'South Panel',
                collapsible: true,
                html: 'Information goes here',
                split: true,
                height: 100,
                minHeight: 100
            }, {
                region: 'east',
                title: 'East Panel',
                collapsible: true,
                split: true,
                width: 150
            }, {
                region: 'center',
                xtype: 'tabpanel', // TabPanel itself has no title
                activeTab: 0,      // First tab active by default
                items: [
                	<tiles:insertAttribute name="body"/>
                 ]
            }]
        });
        
    });


    </script>
</head>
<body>

 
	<div>
		<tiles:insertAttribute name="header" flush="true"/>

		<aside>
			<tiles:insertAttribute name="left" flush="true"/>
		</aside>

		<div>
			<tiles:insertAttribute name="body" flush="true"/>
		</div>
	</div>

	<footer class="main-footer">
		<tiles:insertAttribute name="footer" flush="true"/>
	</footer>

</body>
</html>