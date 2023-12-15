<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ include file="../_include.tag" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@attribute name="type"         type="java.lang.String" required="true"  rtexprvalue="true"  description="text, label(테두리 없이 값만 나오는 형태 - 파라미터로는 전송됨), hidden, password "%>
<%@attribute name="id"           type="java.lang.String" required="true" rtexprvalue="true" %>
<%@attribute name="idProperty"   type="java.lang.String" required="true"%>
<%@attribute name="url"          type="java.lang.String" required="true"%>
<%@attribute name="rootProperty" type="java.lang.String"%>
<%@attribute name="expanded"     type="java.lang.Boolean"%>
<%@attribute name="params"       type="java.lang.String"%>
<%@attribute name="autoLoad"     type="java.lang.Boolean"%>
<%@attribute name="groupField"     type="java.lang.String"%>

<% getField(request, id); %>

                            store: {
                                xtype : '${type}',
                                storeId: '${id}',
                                idProperty : <c:choose><c:when test="${type=='store'}">'data'</c:when><c:otherwise>'${idProperty}'</c:otherwise></c:choose>,
                                <jsp:doBody></jsp:doBody>
                                fields: [
                                    <c:forEach items="${fields }" var="field">
                                    { name : '${field.NM}', type : '${field.TYPE}', format : '${field.FMT}' },
                                    </c:forEach>
                                ],
                                <c:if test="${not empty groupField}"> groupField : '${groupField}' ,</c:if>
                                autoLoad: <c:choose><c:when test="${autoLoad==false}"> false </c:when><c:otherwise> true </c:otherwise></c:choose>,
                                proxy : {
                                       type : 'ajax',
                                       url : '${url}',
                                       reader : {
                                           type : 'json',
                                           rootProperty : <c:if test="${not empty rootProperty}">'${rootProperty}'</c:if><c:if test="${empty rootProperty}">'CHILDREN'</c:if>,
                                           totalProperty: 'totalCount' 
                                       },
                                       extraParams: {
                                           ${params}
                                       }
                                   },
                                   root: {
                                        expanded: <c:if test="${expanded==true}"> true </c:if><c:if test="${expanded!=true}"> false </c:if>,
                                },
                            },