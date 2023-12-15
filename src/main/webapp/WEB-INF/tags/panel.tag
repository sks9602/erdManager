<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ tag import="com.myframework.util.StringUtil"%>
<%@ attribute name="title"     type="java.lang.String" rtexprvalue="true"%>
<%@ attribute name="region"    type="java.lang.String" rtexprvalue="true"%>
<%@ attribute name="layout"    type="java.lang.String" rtexprvalue="true"%>
<%@ attribute name="xtype"     type="java.lang.String" rtexprvalue="true"%>
<%@ attribute name="id"        type="java.lang.String" rtexprvalue="true"%>
<%@ attribute name="width"     type="java.lang.String" rtexprvalue="true"%>
<%@ attribute name="height"    type="java.lang.String" rtexprvalue="true"%>

            {
                xtype: '<%= xtype %>',
                collapsible: true,
                split: true,
                border: true,
                <%= StringUtil.tagAttr("region", region) %>
                <%= StringUtil.tagAttr("layout", layout) %>
                <%= StringUtil.tagAttr("title", title) %>
                <%= StringUtil.tagAttr("id", id) %>
                <%= StringUtil.tagAttrInt("width", width) %>
                <%= StringUtil.tagAttrInt("height", height) %>
                <jsp:doBody></jsp:doBody>
             },