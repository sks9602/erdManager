<%@ tag language="java" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@attribute name="type"         type="java.lang.String" required="true"  rtexprvalue="true"  description="text, label(테두리 없이 값만 나오는 형태 - 파라미터로는 전송됨), hidden, password "%>
<%@attribute name="label"        type="java.lang.String" %>
<%@attribute name="name"         type="java.lang.String" required="true"%>
<%@attribute name="id"         type="java.lang.String" %>
<%@attribute name="boxLabel"        type="java.lang.String" %>
<%@attribute name="value"        type="java.lang.String" %>
<%@attribute name="checked"        type="java.lang.Boolean" required="true"%>

                                    {
                                        xtype: '${type}',
                                        name : '${name}',
                                        boxLabel: '${boxLabel}', 
                                        style : {padding : "0 3 0 1"},
                                        inputValue: '${value}',
                                        anchor: '100%',
                                        checked: ${checked},
                                        <c:if test="${not empty id}">id : '${id}', </c:if> 
                                        <jsp:doBody></jsp:doBody>
                                    },
