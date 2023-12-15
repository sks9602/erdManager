package com.admin.erd.project.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.project.service.ProjectSvc;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class ProjectCtrl {

	@Resource(name = "projectSvc")
	private ProjectSvc projectSvc;
	
	@RequestMapping(value="/dbase/data/list.do")
	public ResponseEntity dbaseList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		projectSvc.dbaseList(model, paramMap);
		
		return ResponseEntity.ok(model.getAttribute("dataList"));
	}

	@RequestMapping(value="/project/data/insert.do")
	public String projectSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = projectSvc.projectInsert(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/project/data/update.do")
	public String projectUpdate(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = projectSvc.projectUpdate(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/project/data/list.do")
	public ResponseEntity projectList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		projectSvc.projectList(model, paramMap);
		
		return ResponseEntity.ok(model.getAttribute("dataList"));
	}

	@RequestMapping(value="/project/data/detail.do")
	public String damainDetail(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseData myFrameworkResponseData = projectSvc.projectDetail(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/project/data/subjectList.do")
	public String subjectList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		projectSvc.projectSubjectList(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/project/data/loginUser.do")
	public String projectUser(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		projectSvc.projectLoingUser(model, paramMap, request);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/project/data/apply.do")
	public String projectApply(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = projectSvc.projectApply(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/project/data/userList.do")
	public ResponseEntity userList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		projectSvc.userList(model, paramMap);
		
		return ResponseEntity.ok(model.getAttribute("dataList"));
	}

	@RequestMapping(value="/project/data/userStatusSave.do")
	public String userStatusSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request)  throws Exception {
	
		MyFrameworkResponseCud myFrameworkResponseCud = projectSvc.userStatusSave(model, paramMap);
		
		return "jsonView";
	}
	
	
}
