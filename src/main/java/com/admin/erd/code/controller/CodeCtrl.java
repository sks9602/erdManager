package com.admin.erd.code.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.code.service.CodeSvc;
import com.myframework.was.param.RequestParamMap;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class CodeCtrl {

	@Resource(name = "codeSvc")
	private CodeSvc codeSvc;
	
	@RequestMapping(value="/codeProject/data/list.do")
	public String codeList(ModelMap model, RequestParamMap paramMap) {
	
		codeSvc.codeProjectList(model, paramMap);
		
		return "jsonView";
	}
}
