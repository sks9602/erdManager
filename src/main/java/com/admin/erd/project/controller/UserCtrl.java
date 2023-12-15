package com.admin.erd.project.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.project.service.UserSvc;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class UserCtrl {

	@Resource(name = "userSvc")
	private UserSvc userSvc;
	
	@RequestMapping(value="/user/data/insert.do")
	public String userSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseCud myFrameworkResponseCud = userSvc.userInsert(model, paramMap, request);
		
		return "jsonView";
	}

}
