package com.admin.erd.relation.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.relation.service.RelationSvc;
import com.common.login.vo.LoginVo;
import com.myframework.vo.MyFrameworkLoginVO;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class RelationCtrl {

	@Resource(name = "relationSvc")
	private RelationSvc relationSvc;
	
	@RequestMapping(value="/relation/data/erdSubjectRelationList.do")
	public String erdSubjectRelationList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		relationSvc.erdSubjectRelationList(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/relation/data/erdRelationList.do")
	public String erdRelationList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		relationSvc.erdRelationList(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/relation/data/save.do")
	public String relationSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {

		MyFrameworkResponseCud myFrameworkResponseCud = relationSvc.relationSave(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/relation/data/update.do")
	public String relationUpdate(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {

		MyFrameworkResponseCud myFrameworkResponseCud = relationSvc.relationUpdate(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/relation/data/delete.do")
	public String relationDelete(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {

		LoginVo loginVo = (LoginVo) request.getSession().getAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY);
		
		if(loginVo.isModelerRole()) {
			MyFrameworkResponseCud myFrameworkResponseCud = relationSvc.relationDelete(model, paramMap);
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/relation/data/updatePath.do")
	public String relationUpdatePath(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {

		LoginVo loginVo = (LoginVo) request.getSession().getAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY);
		
		if(loginVo.isModelerRole()) {
			MyFrameworkResponseCud myFrameworkResponseCud = relationSvc.relationUpdatePath(model, paramMap);
		}
		return "jsonView";
	}
	
	@RequestMapping(value="/relation/data/addToSubject.do")
	public String relationAddToSubject(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {

		MyFrameworkResponseCud myFrameworkResponseCud = relationSvc.relationAddToSubject(model, paramMap);
		
		return "jsonView";
	}
	
}
