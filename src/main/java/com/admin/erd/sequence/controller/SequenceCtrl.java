package com.admin.erd.sequence.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.sequence.service.SequenceSvc;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class SequenceCtrl {

	@Resource(name = "sequenceSvc")
	private SequenceSvc sequenceSvc;
		
	@RequestMapping(value="/sequence/data/list.do")
	public String subjectList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		sequenceSvc.sequenceList(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/sequence/data/save.do")
	public String sequenceSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseCud myFrameworkResponseCud = sequenceSvc.sequenceSave(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/sequence/data/detail.do")
	public String sequenceDetail(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseData myFrameworkResponseData = sequenceSvc.sequenceDetail(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/sequence/data/saveUseYn.do")
	public String sequenceSaveUseYn(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {
	
		MyFrameworkResponseCud myFrameworkResponseCud = sequenceSvc.sequenceSaveUseYn(model, paramMap);
		
		return "jsonView";
	}
	
}
