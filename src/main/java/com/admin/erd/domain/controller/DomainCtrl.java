package com.admin.erd.domain.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.domain.service.DomainSvc;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class DomainCtrl {

	@Resource(name = "domainSvc")
	private DomainSvc domainSvc;

	@RequestMapping(value="/domain/data/tree.do")
	public String damainTree(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		domainSvc.domainTree(model, paramMap);
		
		return "/data/tree/data";
	}
	
	@RequestMapping(value="/domain/data/detail.do")
	public String damainDetail(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseData myFrameworkResponseData = domainSvc.damainDetail(model, paramMap);
		
		return "jsonView";
	}
	
	
	@RequestMapping(value="/domain/data/save.do")
	public String damainSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseCud myFrameworkResponseCud = domainSvc.domainSave(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/domain/data/delete.do")
	public String damainDelete(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseCud myFrameworkResponseCud = domainSvc.damainDelete(model, paramMap);
		
		return "jsonView";
	}
}
