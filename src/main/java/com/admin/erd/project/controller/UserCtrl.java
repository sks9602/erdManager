package com.admin.erd.project.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.project.service.UserSvc;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class UserCtrl {

	@Resource(name = "userSvc")
	private UserSvc userSvc;
	
	@RequestMapping(value="/user/data/insert.do")
	public String userInsert(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {
	
		MyFrameworkResponseCud myFrameworkResponseCud = userSvc.userInsert(model, paramMap, request);
		
		return "jsonView";
	}

	@RequestMapping(value="/user/data/initPassword.do")
	public String userInitPassword(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {
	
		MyFrameworkResponseCud myFrameworkResponseCud = userSvc.userInitPassword(model, paramMap, request);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/user/data/confirm.do")
	public String userConfirm(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {
	
		MyFrameworkResponseCud myFrameworkResponseCud = userSvc.userConfirm(model, paramMap, request);
		
		return "jsonView";
	}
	@RequestMapping(value="/user/data/update.do")
	public String userUpdate(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {
	
		MyFrameworkResponseCud myFrameworkResponseCud = userSvc.userUpdate(model, paramMap, request);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/user/data/detail.do")
	public String userDetail(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {
	
		MyFrameworkResponseData myFrameworkResponseData = userSvc.userDetail(model, paramMap);
		
		return "jsonView";
	}
	
}
