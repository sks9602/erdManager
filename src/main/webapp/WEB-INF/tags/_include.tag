<%@ tag language="java" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%@tag import="java.util.List"%>
<%@tag import="java.util.Map"%>
<%@tag import="org.apache.commons.lang3.StringUtils"%>

<%@tag import="org.springframework.web.servlet.FrameworkServlet"%>
<%@tag import="org.springframework.web.context.WebApplicationContext"%>
<%@tag import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@tag import="com.myframework.sql.SqlParamMap"%>
<%@tag import="com.myframework.sql.SqlResultMap"%>
<%@tag import="com.myframework.sql.SqlResultList"%>
<%@tag import="com.myframework.util.MapHasList"%>
<%@tag import="com.myframework.dao.MyFrameworkSqlDao"%>
<%@tag import="com.common.login.vo.LoginVo"%>
<%@tag import="com.myframework.vo.MyFrameworkLoginVO"%>

	
<%!
	/**
	 * Spring Bean 조회.
	 */
	public Object getDao(ServletContext application, String daoNm) {

		WebApplicationContext ac = WebApplicationContextUtils.getWebApplicationContext(application, WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);

		return ac.getBean(daoNm);
	}

	public void getField(HttpServletRequest request, String id) throws Exception {
        MyFrameworkSqlDao sqlDao = (MyFrameworkSqlDao) getDao( request.getServletContext(), "myFrameworkSqlDao");

        SqlResultList<SqlResultMap<String, Object>> fieldList = null;

        if( request.getAttribute("FIELD_"+id) == null ){
            SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
            sqlParamMap.put("ID", id );
            
            fieldList = sqlDao.selectList("Cmmn.selectFieldList", sqlParamMap);
            
            request.setAttribute("FIELD_"+id, fieldList);
        } else {
        	fieldList = (SqlResultList<SqlResultMap<String, Object>>) request.getAttribute("FIELD_"+id);
        }
        
        request.setAttribute("fields", fieldList );
	}
	/**
	 * 공콩 코드 목록 조회.
	 */
	public void getCodeList(HttpServletRequest request, Object cdGrp, String usedef1, String usedef2, String usedef3, String usedef4) throws Exception {
	
		MyFrameworkSqlDao sqlDao = (MyFrameworkSqlDao) getDao( request.getServletContext(), "myFrameworkSqlDao");
		
		SqlResultList<SqlResultMap<String, Object>> cdGrpList = null;
		
		String code = "CODE_"+cdGrp;
        if( StringUtils.isNotEmpty(usedef1)) {
        	code += ("_"+usedef1);
        }
		
		if( request.getAttribute(code) == null ){
			SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
			sqlParamMap.put("CD_GRP", cdGrp );
	        if( StringUtils.isNotEmpty(usedef1)) {
	        	sqlParamMap.put("USEDEF1", usedef1 );
	        }
			
			LoginVo loginVo = (LoginVo) request.getSession().getAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY);
			
			sqlParamMap.put("SESSION_COMPANY_ID", loginVo.getCompanyId());
			sqlParamMap.put("SESSION_PROJECT_ID", loginVo.getProjectId());
			sqlParamMap.put("SESSION_VERSN", loginVo.getVersion());
			
			if( "DATA_TYPE".equals(cdGrp) ) {
                cdGrpList = sqlDao.selectList("mapper.erd.dataType.selectDataTypeList", sqlParamMap);
			} else {
	            cdGrpList = sqlDao.selectList("com.dao.system.CodeDao.selectCodeProjectList", sqlParamMap);
			}
			
			
			
			request.setAttribute(code, cdGrpList);
		} else {
			cdGrpList = (SqlResultList<SqlResultMap<String, Object>>) request.getAttribute(code);
		}
		
		for( java.util.Iterator<SqlResultMap<String, Object>> iter = cdGrpList.iterator(); iter.hasNext(); ) { 
			SqlResultMap<String, Object> result = iter.next(); 
			
			if( usedef1 != null ){
				if( !usedef1.equals( result.getString("CD_VAL_A"))) {
					iter.remove(); 
				}
			} 
			if( usedef2 != null ){
				if( !usedef2.equals( result.getString("CD_VAL_B"))) {
					iter.remove(); 
				}
			} 
            if( usedef3 != null ){
                if( !usedef3.equals( result.getString("CD_VAL_C"))) {
                    iter.remove(); 
                }
            }
            if( usedef4 != null ){
                if( !usedef4.equals( result.getString("CD_VAL_D"))) {
                    iter.remove(); 
                }
            }
		}
		
		request.setAttribute("codeList", cdGrpList );
	}
	
%>
