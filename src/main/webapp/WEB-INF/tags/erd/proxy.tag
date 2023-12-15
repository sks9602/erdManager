<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ include file="../_include.tag" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@attribute name="url"          type="java.lang.String" required="true"%>
<%@attribute name="rootProperty" type="java.lang.String"%>
<%@attribute name="expanded"     type="java.lang.Boolean"%>
<%@attribute name="params"       type="java.lang.String"%>

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