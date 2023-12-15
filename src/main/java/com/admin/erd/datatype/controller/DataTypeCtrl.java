package com.admin.erd.datatype.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.datatype.service.DataTypeSvc;
import com.myframework.was.param.RequestParamMap;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class DataTypeCtrl {


	@Resource(name = "dataTypeSvc")
	private DataTypeSvc dataTypeSvc;
/*
	@RequestMapping(value="/datatype/data/list.do")
	public String damainList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		dataTypeSvc.dataTypeList(model, paramMap);
		
		return "/data/list/data";
	}
*/
	@RequestMapping(value="/datatype/data/list.do")
	public ResponseEntity damainList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		dataTypeSvc.dataTypeList(model, paramMap);
		
		return ResponseEntity.ok(model.getAttribute("dataList"));
	}
	
	@RequestMapping(value="/datatype/data/tree.do")
	public String datatypeTree(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		dataTypeSvc.datatypeTree(model, paramMap);
		
		return "/data/tree/data";
	}


}
