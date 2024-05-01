package com.common.login.controller;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.support.SessionStatus;

import com.admin.erd.project.service.EmailSvc;
import com.admin.erd.project.service.ProjectSvc;
import com.common.login.service.LoginService;
import com.common.login.vo.LoginVo;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultMap;
import com.myframework.vo.MyFrameworkLoginVO;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseData;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class LoginController {

	@Resource(name = "loginService")
	private LoginService loginService;

	@Resource(name = "projectSvc")
	private ProjectSvc projectSvc;

	/**
	 * 로그인 페이지로 이동
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/{path}/erd/erd.do")
	public String erd(@PathVariable String path, ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
		
		LoginVo loginVo = (LoginVo) request.getSession().getAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY);
		
		
		if( loginVo == null ) {
			loginVo = new LoginVo();
						
			if( StringUtils.isEmpty(loginVo.getProjectId())) {
				loginVo.setProjectId("DEFAULT-PROJECT");
				loginVo.setProjectNm("빈 프로젝트");
				loginVo.setVersion("1.0");
				loginVo.setUsrNm("Guest");
				loginVo.setUsrUid("GUEST");
				loginVo.setEntityDisplayDaycnt("7");
				loginVo.setColumnDisplayDaycnt("7");
				loginVo.setAuth("MODELER"); // MANAGER > MODELER > VIEWER
				loginVo.setDbase("MariaDB");
			}
			
			request.getSession().setAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY, loginVo);
		}
		
		if( StringUtils.isNotEmpty(paramMap.get("PROJECT_ID"))) {
			MyFrameworkResponseData myFrameworkResponseData = projectSvc.projectDetail(model, paramMap);
			
			SqlResultMap<String, Object> detail = (SqlResultMap<String, Object>) myFrameworkResponseData.getModelMap().get("detail");
			
			loginVo.setProjectId(detail.getString("PROJECT_ID"));
			loginVo.setProjectNm(detail.getString("PROJECT_NM"));
			loginVo.setVersion(detail.getString("VERSN"));
			loginVo.setDbase(detail.getString("DBASE"));
			
			request.getSession().setAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY, loginVo);
		}

		
		
		paramMap.put("SESSION_PROJECT_ID", loginVo.getProjectId());
		projectSvc.selectProjectCdList(model, paramMap);
		return path+"/erd/erd/erd";
	}
	
	@RequestMapping(value="/{path}/erd/query.do")
	public String query(@PathVariable String path, ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		
		return path+"/erd/erd/query";
	}
	
	/**
	 * 로그인 페이지로 이동
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/common/login/loginView.do")
	public String loginView(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
			
		return "common/login/login.loginView";
	}
	
	/**
	 * 로그인 처리
	 */
	@RequestMapping(value="/common/login/login.do")
	public String login(ModelMap model, RequestParamMap paramMap, HttpServletRequest request, HttpServletResponse response, SessionStatus status) {
		
		MyFrameworkResponseData myFrameworkResponseData = loginService.login( model, paramMap, request, status);
		
		return "jsonView";
	}
	

	/**
	 * 로그아웃 처리
	 */
	@RequestMapping(value="/common/login/logout.do")
	public String logout(ModelMap model, RequestParamMap paramMap, HttpServletRequest request, SessionStatus status) {
		
		MyFrameworkResponseData myFrameworkResponseData = loginService.logout( model, paramMap, request, status);
		
		return "jsonView";
	}
	
	/**
	 * [화면] IP등록 팝업 조회.
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/staff/system/system/user/popupIpView.do")
	public String popupIpView(ModelMap model, RequestParamMap paramMap) {
		
		return "staff/popup/system/user.popupIpView";
	}	
	
}
