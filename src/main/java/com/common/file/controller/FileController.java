package com.common.file.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.common.file.service.FileService;
import com.myframework.was.param.RequestParamMap;


@Controller
public class FileController {

	@Resource(name = "fileService")
	private FileService fileService;
	
	/**
	 * 파일 다운로드
	 * @param model
	 * @param paramMap
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping(value="/common/file/file/download.do")
	public void download(HttpServletRequest request, HttpServletResponse response,   RequestParamMap paramMap) throws Exception {
		
		fileService.download(paramMap, request, response);
	}
	
	
	@RequestMapping(value="/common/file/file/downloadZip.do") 
	public void downloadZip(HttpServletRequest request, HttpServletResponse response, RequestParamMap paramMap) throws Exception {
	
		fileService.downloadZip(paramMap, request, response, "board.zip"); 
	}
	
}
