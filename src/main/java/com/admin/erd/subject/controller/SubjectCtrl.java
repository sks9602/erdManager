package com.admin.erd.subject.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.subject.service.SubjectSvc;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class SubjectCtrl {

	@Resource(name = "subjectSvc")
	private SubjectSvc subjectSvc;
	
	@RequestMapping(value="/subject/data/tree.do")
	public String subjectTree(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		subjectSvc.subjectTree(model, paramMap);
		
		return "/data/tree/data";
	}
	
	@RequestMapping(value="/subject/data/list.do")
	public String subjectList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		subjectSvc.subjectList(model, paramMap);
		
		return "jsonView";
	}

	
	@RequestMapping(value="/subject/data/erdSubjectEntityList.do")
	public String subjectEntityList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		subjectSvc.erdSubjectEntityList(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/subject/data/save.do")
	public String subjectSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseCud myFrameworkResponseCud = subjectSvc.subjectSave(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/subject/data/delete.do")
	public String subjectDelete(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseCud myFrameworkResponseCud = subjectSvc.subjectDelete(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/subject/data/detail.do")
	public String damainDetail(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseData myFrameworkResponseData = subjectSvc.projectDetail(model, paramMap);
		
		return "jsonView";
	}


	@RequestMapping(value="/subject/data/startOrCheckEditInfo.do")
	public String subjectSubjectStartEditInfo(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseCud myFrameworkResponseCud = subjectSvc.subjectSubjectStartEditInfo(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/subject/data/endEditInfo.do")
	public String subjectEndEditInfo(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseCud myFrameworkResponseCud = subjectSvc.subjectEndEditInfo(model, paramMap);
		
		return "jsonView";
	}

	/**
	 * 업무영역 즐겨찾기
	 * @param model
	 * @param paramMap
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/subject/data/saveFavorite.do")
	public String saveFavorite(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = subjectSvc.saveFavorite(model, paramMap);
		
		return "jsonView";
	}
}
