<%@ tag language="java" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@attribute name="type"         type="java.lang.String" required="true"  rtexprvalue="true"  description="text, label(테두리 없이 값만 나오는 형태 - 파라미터로는 전송됨), hidden, password "%>
<%@attribute name="label"        type="java.lang.String" %>
<%@attribute name="iconCls"         type="java.lang.String"%>
<%@attribute name="cls"         type="java.lang.String" %>
<%@attribute name="vtype"         type="java.lang.String" %>
<%@attribute name="value"         type="java.lang.String" %>
<%@attribute name="required"         type="java.lang.Boolean" %>
<%@attribute name="placeholder"         type="java.lang.String" %>
<%@attribute name="id"         type="java.lang.String" %>


                                    {
                                      <c:if test="${type != 'none'}">xtype: '${type}',</c:if> 
                                     text: '${label}', iconCls: '${iconCls}', cls : '${cls}',
                                        <c:if test="${not empty id}">id : '${id}', </c:if> 
                                        <jsp:doBody></jsp:doBody>
                                    },