package com.admin.erd.column.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.column.service.ColumnSvc;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class ColumnCtrl {

	@Resource(name = "columnSvc")
	private ColumnSvc columnSvc;
	
	@RequestMapping(value="/column/data/erdColumnList.do")
	public String columnErdList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		columnSvc.erdColumnList(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/column/data/updateEntityNameByWord.do")
	public String updateEntityNameByWord(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {
	
		columnSvc.updateEntityNameByWord(model, paramMap);
		
		return "jsonView";
	}

	/**
	 * 공통 컬럼 조회
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/column/data/commonColumnList.do")
	public String commonColumnList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		columnSvc.commonColumnList(model, paramMap);
		
		return "jsonView";
	}

	/**
	 * 공통컬럼 저장
	 * @param model
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/column/data/commonColumnSave.do")
	public String columnCommonColumnSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {

		MyFrameworkResponseCud myFrameworkResponseCud = columnSvc.columnCommonColumnSave(model, paramMap);
		
		return "jsonView";
	}


	/**
	 * 공통컬럼 저장
	 * @param model
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/column/data/commonColumnSaveAndAddToAllTable.do")
	public String commonColumnSaveAndAddToAllTable(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {

		MyFrameworkResponseCud myFrameworkResponseCud = columnSvc.commonColumnSaveAndAddToAllTable(model, paramMap);
		
		return "jsonView";
	}
}
