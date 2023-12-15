package com.admin.erd.word.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.word.service.WordSvc;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;
import com.myframework.was.response.MyFrameworkResponseGrid;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class WordCtrl {

	@Resource(name = "wordSvc")
	private WordSvc wordSvc;
	
	@RequestMapping(value="/word/data/detail.do")
	public String wordDetail(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseData myFrameworkResponseData = wordSvc.wordDetail(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/word/data/list.do")
	public String wordList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		MyFrameworkResponseGrid myFrameworkResponseGrid = wordSvc.wordList(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/word/data/save.do")
	public String wordSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {
	
		MyFrameworkResponseCud myFrameworkResponseGrid = wordSvc.wordSave(model, paramMap);
		
		return "jsonView";
	}
	
}
