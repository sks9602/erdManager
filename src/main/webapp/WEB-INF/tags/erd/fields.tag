<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ include file="../_include.tag" %>

<%@attribute name="id"           type="java.lang.String" required="true"%>
<% getField(request, id); %>

                                fields: [
                                    <c:forEach items="${fields }" var="field">
                                    { name : '${field.NM}', type : '${field.TYPE}', format : '${field.FMT}' },
                                    </c:forEach>
                                ],