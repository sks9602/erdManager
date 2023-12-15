<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ include file="../_include.tag" %>
<%@tag import="java.util.List"%>
<%@tag import="java.util.Map"%>
<%@tag import="org.apache.commons.lang3.StringUtils"%>
<%@tag import="org.springframework.web.servlet.FrameworkServlet"%>
<%@tag import="org.springframework.web.context.WebApplicationContext"%>
<%@tag import="org.springframework.web.context.support.WebApplicationContextUtils"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>


<%@attribute name="type"         type="java.lang.String" required="true"  rtexprvalue="true"  description="text, label(테두리 없이 값만 나오는 형태 - 파라미터로는 전송됨), hidden, password "%>
<%@attribute name="tag"           type="java.lang.String" %>
<%@attribute name="label"        type="java.lang.String" %>
<%@attribute name="name"         type="java.lang.String" required="true"%>
<%@attribute name="id"         type="java.lang.String" %>
<%@attribute name="cdGrp"         type="java.lang.String" required="true"%>
<%@attribute name="require"      type="java.lang.Boolean" %>
<%@attribute name="value"         type="java.lang.String"  rtexprvalue="true" %>
<%@attribute name="unit"         type="java.lang.String" %>
<%@attribute name="cls"          type="java.lang.String" %>
<%@attribute name="style"          type="java.lang.String" %>
<%@attribute name="width"        type="java.lang.String" %>
<%@attribute name="colspan"      type="java.lang.String" %>
<%@attribute name="rowspan"      type="java.lang.String" %>
<%@attribute name="events"  type="java.lang.String"  rtexprvalue="true" %>
<%@attribute name="firstText"  type="java.lang.String" %>
<%@attribute name="firstValue"  type="java.lang.String" %>
<%@attribute name="firstEvent"  type="java.lang.String" %>
<%@attribute name="validation"      type="java.lang.String" %>
<%@attribute name="cdCol"      type="java.lang.String" %>
<%@attribute name="usedef1"      type="java.lang.String" %>
<%@attribute name="usedef2"      type="java.lang.String" %>
<%@attribute name="usedef3"      type="java.lang.String" %>
<%@attribute name="usedef4"      type="java.lang.String" %>
<%@attribute name="modifyFalse"    type="java.lang.Boolean" rtexprvalue="true" %>

<c:if test="${ type != 'combo' && type != 'select' && width == null }" >
    <c:set var="width" value="200" />
</c:if>
<c:if test="${ cdCol  == null }" >
    <c:set var="cdCol" value="CD" />
</c:if>

<% getCodeList(request, cdGrp, usedef1, usedef2, usedef3, usedef4); %>

<c:choose>
    <c:when test="${ type == 'radio'}">
        <c:choose>
            <c:when test="${tag == 'none'}">
                <c:if test="${firstText !=null && firstValue !=null}">
                    <p class="ad_input_row">
                        <input type="radio" name="${name}" value="${firstValue}" id="${name}" class="radio ${cls}" style="${style}" title="${firstText}" ${firstEvent} <c:if test="${firstValue != value && modifyFalse == true}">disabled</c:if> /> <c:if test="${firstValue == value}">checked="checked"</c:if> <label for="${name}" class="radio_label" style="width:${width}px"> ${firstText} </label>
                    </p>
                </c:if>
                <c:forEach items="${codeList }" var="code">
                    <p class="ad_input_row">
                        <input type="radio" name="${name}" value="${code[cdCol]}" id="${name}_${code[cdCol]}" class="radio ${cls}" style="${style}" title="${code.cdNm}" <c:if test="${code[cdCol] == value}">checked="checked"</c:if> <c:if test="${code[cdCol] != value && modifyFalse == true}">disabled</c:if> data-validation='${validation}' ${events} <jsp:doBody/> /> <label for="${name}_${code[cdCol]}" class="radio_label" style="width:${width}px"> ${code.cdNm} </label>
                    </p>
                </c:forEach>
            </c:when>
            <c:otherwise>
                <th  scope="row" id="${name}-th" <c:if test="${require}">class="data_required"</c:if>>
                    ${label}
                </th>
                <td  <c:if test="${not empty colspan}">colspan="${colspan}"</c:if>>
                    <c:if test="${firstText !=null && firstValue !=null}">
                        <p class="ad_input_row">
                            <input type="radio" name="${name}" value="${firstValue}" id="${name}" class="radio ${cls}" style="${style}" title="${firstText}"  ${firstEvent} <c:if test="${firstValue != value && modifyFalse == true}">disabled</c:if> /> <c:if test="${firstValue == value}">checked="checked"</c:if> <label for="${name}" class="radio_label" style="width:${width}px"> ${firstText} </label>
                        </p>
                    </c:if>
                    <c:forEach items="${codeList }" var="code">
                        <p class="ad_input_row">
                            <input type="radio" name="${name}" value="${code[cdCol]}" id="${name}_${code[cdCol]}" class="radio ${cls}" style="${style}" title="${code.cdNm}" <c:if test="${code[cdCol] == value}">checked="checked"</c:if> <c:if test="${code[cdCol] != value && modifyFalse == true}">disabled</c:if> data-validation='${validation}' ${events} <jsp:doBody/> />  <label for="${name}_${code[cdCol]}" class="radio_label" style="width:${width}px"> ${code.cdNm} </label>
                        </p>
                    </c:forEach>
                </td>
            </c:otherwise>
        </c:choose>
    </c:when>
    <c:when test="${type == 'checkbox'}">
        <c:choose>
            <c:when test="${tag == 'none'}">
                <c:if test="${firstText !=null && firstValue !=null}">
                    <p class="ad_input_row">
                        <input type="checkbox" name="${name}" value="${firstValue}" id="${name}" class="check ${cls}" style="${style}" title="${firstText}"  ${firstEvent} /> <c:if test="${firstValue == value}">checked="checked"</c:if> <label for="${name}" class="check_label" style="width:${width}px"> ${firstText} </label>
                    </p>
                </c:if>
                <c:forEach items="${codeList }" var="code">
                    <p class="ad_input_row">
                        <input type="checkbox" name="${name}" value="${code[cdCol]}" id="${name}_${code[cdCol]}" class="check ${cls}" style="${style}" title="${code.cdNm}" <c:if test="${code[cdCol] == value}">checked="checked"</c:if> data-validation='${validation}' ${events} <jsp:doBody/> />   <label for="${name}_${code[cdCol]}" class="check_label" style="width:${width}px"> ${code.cdNm} </label>
                    </p>
                </c:forEach>
            </c:when>
            <c:otherwise>
                <th  scope="row" id="${name}-th" <c:if test="${require}">class="data_required"</c:if>>
                    ${label}
                </th>
                <td <c:if test="${not empty colspan}">colspan="${colspan}"</c:if>>
                    <c:if test="${firstText !=null && firstValue !=null}">
                        <p class="ad_input_row">
                            <input type="checkbox" name="${name}" value="${firstValue}" id="${name}" class="check ${cls}" style="${style}" title="${firstText}" <c:if test="${firstValue == value}">checked="checked"</c:if> ${firstEvent} />  <label for="${name}" class="check_label" style="width:${width}px"> ${firstText} </label>
                        </p>
                    </c:if>
                    <c:forEach items="${codeList }" var="code">
                        <p class="ad_input_row">
                            <input type="checkbox" name="${name}" value="${code[cdCol]}" id="${name}_${code[cdCol]}" class="check ${cls}" style="${style}" title="${code.cdNm}" <c:if test="${code[cdCol] == value}">checked="checked"</c:if> data-validation='${validation}' ${events} <jsp:doBody/> />  <label for="${name}_${code[cdCol]}" class="check_label" style="width:${width}px"> ${code.cdNm} </label>
                        </p>
                    </c:forEach>
                </td>
            </c:otherwise>
        </c:choose>
    </c:when>
    <c:when test="${type == 'ext-js-combobox'}">
            {
                xtype      : 'combo_ux',
                fieldLabel : '<%= label %>', <%= "Y".equals(require) ? "allowBlank : false, labelCls   : 'x-form-item-label x-form-item-label-required'," : "" %>
                id : "${not empty id ? id : name}",
                name : '<%= name %>',
                msgTarget: 'side',
                anchor: '100%',
                width:${width},
                aqtip : '<%= label %>',
                queryMode: 'local',
                displayField: 'CD_NM',
                valueField: '${cdCol}',
                value : '${value}',
                style : {padding : "0 3 0 1"},
                <jsp:doBody></jsp:doBody>
                store : Ext.create('Ext.data.Store', {
                    id : "store_${not empty id ? id : name}",
                    fields: [
                        { name : "CD"         , type : "string"},        
                        { name : "CD_GRP"     , type : "string"},        
                        { name : "CD_NM"      , type : "string"},        
                        { name : "CD_VAL_A"   , type : "string"},        
                        { name : "CD_VAL_B"   , type : "string"},        
                        { name : "CD_VAL_C"   , type : "string"},        
                        { name : "CD_VAL_1"   , type : "number"},        
                        { name : "CD_VAL_2"   , type : "number"},        
                        { name : "CD_VAL_3"   , type : "number"},        
                        { name : "ORD_TRN"    , type : "string"},        
                    ],
                    data : [
				        <c:if test="${ firstText !=null }" >
				            {"CD": "${firstValue}" , "CD_GRP":"${cdGrp}" , "CD_NM":"${firstText}", "CD_VAL_A":"", "CD_VAL_B":"", "CD_VAL_A":"", "CD_VAL_1":"", "CD_VAL_2":"", "CD_VAL_3":"" },
				        </c:if>
                        <c:forEach items="${codeList }" var="code">
                            {"CD": "${code.CD}" , "CD_GRP":"${code.CD_GRP}" , "CD_NM":"${code.CD_NM}", "CD_VAL_A":"${code.CD_VAL_A}", "CD_VAL_B":"${code.CD_VAL_B}", "CD_VAL_A":"${code.CD_VAL_C}", "CD_VAL_1":"${code.CD_VAL_1}", "CD_VAL_2":"${code.CD_VAL_2}", "CD_VAL_3":"${code.CD_VAL_3}" },
                        </c:forEach>
                    ]
                })
            },
    </c:when>
    <c:when test="${type == 'combo-script'}">

    </c:when>
    <c:when test="${type == 'js-array'}">
        var ${name} = [];

        <c:if test="${ firstText !=null }" >
            ${name}.push({ cd : '${firstValue}', cdNm :  '${firstText}' });
        </c:if>


        <c:forEach var="code" items="${codeList}" varStatus="status">
            ${name}.push({ cd : '${code[cdCol]}', cdNm :  '${code.cdNm}' });
        </c:forEach>

    </c:when>
    <c:otherwise>
        <c:choose>
            <c:when test="${tag == 'none'}">
                <select  <c:choose><c:when test="${cls == 'select2'}">class="${cls}"</c:when><c:otherwise>class="form-control input-sm ${cls}"</c:otherwise></c:choose> id="${not empty id ? id : name}" name="${name}" title=" ${label}" style="width:${width}px" ${events} data-validation='${validation}' <c:if test="${modifyFalse}">disabled</c:if> >
                    <c:if test="${ firstText !=null }" >
                        <option value="${firstValue}">${firstText}</option>
                    </c:if>
                    <c:forEach var="code" items="${codeList}" varStatus="status">
                        <option value="${code[cdCol]}" <c:if test="${code[cdCol] == value}">selected="selected"</c:if> >${code.cdNm}</option>
                    </c:forEach>
                </select>
            </c:when>
            <c:otherwise>
                <th scope="row" id="${name}-th" <c:if test="${require}">class="data_required"</c:if>><label for="${name}"> ${label} </label></th>
                <td  class="td_input" <c:if test="${not empty colspan}">colspan="${colspan}"</c:if>>
<%--                 <td class="td_input" <c:if test="${not empty colspan}">colspan="${colspan}"</c:if>> --%>
                    <select <c:choose><c:when test="${cls == 'select2'}">class="${cls}"</c:when><c:otherwise>class="form-control input-sm ${cls}"</c:otherwise></c:choose> id="${not empty id ? id : name}" name="${name}" title=" ${label}" style="width:${width}px" ${events}  data-validation='${validation}' <c:if test="${modifyFalse}">disabled</c:if> >
                        <c:if test="${ firstText !=null }" >
                            <option value="${firstValue}">${firstText}</option>
                        </c:if>
                        <c:forEach var="code" items="${codeList}" varStatus="status">
                            <option value="${code[cdCol]}" <c:if test="${code[cdCol] == value}">selected="selected"</c:if> >${code.cdNm}</option>
                        </c:forEach>
                    </select>
                </td>
            </c:otherwise>
        </c:choose>
    </c:otherwise>
</c:choose>

<%!
    public void getCode(Object code, String cdCol) {
    System.out.println(code);
    System.out.println(cdCol);

    }

%>
