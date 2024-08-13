<%@ tag language="java" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@attribute name="type"         type="java.lang.String" required="true"  rtexprvalue="true"  description="text, label(테두리 없이 값만 나오는 형태 - 파라미터로는 전송됨), hidden, password "%>
<%@attribute name="label"        type="java.lang.String" %>
<%@attribute name="name"         type="java.lang.String" required="true"%>
<%@attribute name="id"         type="java.lang.String" %>
<%@attribute name="vtype"         type="java.lang.String" %>
<%@attribute name="value"         type="java.lang.String" %>
<%@attribute name="required"         type="java.lang.Boolean" %>
<%@attribute name="placeholder"         type="java.lang.String" %>
<%@attribute name="rowspan"         type="java.lang.Integer" %>
<%@attribute name="readonly"         type="java.lang.Boolean" %>
<%@attribute name="width"         type="java.lang.Integer" %>
<%@attribute name="style"         type="java.lang.String" %>


                                <c:choose>
                                    <c:when test="${type == 'textfield_ux'}">
                                    {   
                                        <c:if test="${not empty label}">
                                        fieldLabel : '${label}',
                                        </c:if>
                                        xtype: '${type}',
                                        // labelCls   : 'x-form-item-label x-form-item-label-required',
                                        name: '${name}',
                                        msgTarget: 'side',
                                        allowBlank: true,
                                        anchor: '100%',
                                        value : '${value}',
                                        <c:if test="${not empty width}">width:${width}, </c:if> 
                                        <c:if test="${not empty id}">id : '${id}', </c:if> 
                                        <c:if test="${not empty vtype}">vtype : '${vtype}', </c:if> 
                                        style : {padding : "0 3 0 1"},
                                        <c:if test="${not empty placeholder}">emptyText : "${placeholder}", </c:if> 
                                        <c:if test="${required == true}">allowBlank: false,</c:if>
                                        aqtip       : '<%= label %>',
                                        <jsp:doBody></jsp:doBody>
                                    },
                                    </c:when>
                                    <c:when test="${type == 'displayfield_ux'}">
                                     {
                                        <c:if test="${not empty label}">
                                        fieldLabel : '${label}',
                                        </c:if>
                                        <c:if test="${not empty id}">id : '${id}', </c:if> 
                                        xtype: 'displayfield_ux',
                                        
                                        name: '${name}',
                                        value : '${value}',
                                        aqtip       : '<%= label %>',
                                        <c:if test="${not empty width}">width:${width}, </c:if> 
                                        <c:if test="${not empty rowspan}">rowspan : ${rowspan},
                                        height : 22*${rowspan}+1,
                                        </c:if> 
                                        
                                     },
                                    </c:when>
                                    <c:when test="${type == 'hiddenfield' or type == 'hidden'}">
                                     {
                                        xtype : 'hiddenfield',
                                        <c:if test="${not empty id}">id : '${id}', </c:if> 
                                        name: '${name}',
                                        value : '${value}',
                                        hidden : true,
                                        aqtip       : '<%= label %>',
                                     },
                                    </c:when>
                                    <c:when test="${type == 'textarea' or type == 'textarea_ux'}">
                                     {
                                        <c:if test="${not empty label}">
                                        fieldLabel : '${label}',
                                        </c:if>
                                        xtype : 'textarea_ux',
                                        <c:if test="${not empty id}">id : '${id}', </c:if> 
                                        name: '${name}',
                                        value : '${value}',
                                        aqtip       : '<%= label %>',
                                        <c:if test="${not empty width}">width:${width}, </c:if> 
                                        <c:if test="${not empty readonly}">readOnly : ${readonly}, 
                                        fieldStyle: {"background-color" : "#eeeeee","background-image" : "url()" },
                                        </c:if> 
                                        <c:if test="${not empty style}">style: { ${style} }, </c:if> 
                                       
                                        <c:if test="${not empty rowspan}">rowspan : ${rowspan},
                                        height : 22*${rowspan}+1,
                                         </c:if> 
                                     },
                                    </c:when>
                                </c:choose>

