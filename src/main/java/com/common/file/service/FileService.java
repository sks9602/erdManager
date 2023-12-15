package com.common.file.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.common.bean.MyCommonEnvBean;
//import com.dao.file.MyCommonFileMngDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.FileUtil;
import com.myframework.util.MakeZip;
import com.myframework.was.param.RequestParamMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Service("fileService")
@Slf4j
public class FileService {

	//@Autowired
	//private MyCommonFileMngDao cpsFileMngDao;
	@Autowired
	MyCommonEnvBean myFrameworkEnvBean;
	/**
	 * 파일 다운로드
	 * @param paramMap
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public void download(RequestParamMap paramMap, HttpServletRequest request, HttpServletResponse response) throws Exception {

		
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
	
		// 파일 정보 조회.
		//SqlResultMap<String, Object>  fileInfo = cpsFileMngDao.selectCpsFileMng(sqlParamMap);
		
		//String fileOrgName = fileInfo.getString("fimFileOrgName");
		//String uploadedRealPath = fileInfo.getString("fimFilePath");
		//String saveFileName = fileInfo.getString("fimFileName");

		//String fileName = FileUtil.download(request, response, fileOrgName, uploadedRealPath, saveFileName);

	}
	/**
	 * Zip으로 여러개 파일 다운로드
	 * @param paramMap
	 * @param request
	 * @param response
	 * @param zipFileNm
	 * @throws Exception
	 */
	public void downloadZip(RequestParamMap paramMap, HttpServletRequest request, HttpServletResponse response, String zipFileNm) throws Exception {
		//sqlParamMap 생성
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		
		//SqlResultList<SqlResultMap<String,Object>> fileList = cpsFileMngDao.selectListCpsFileMng(sqlParamMap);
		MakeZip makeZip = new MakeZip(); 
		String fileStorePath = myFrameworkEnvBean.getFileStorePath(); 
		String uploadedRealPath = fileStorePath + sqlParamMap.get("ssnUserId"); 
		String saveFileName = zipFileNm; 
		String fileOrgName = zipFileNm; 
		
		//makeZip.setFilesList(fileList);
		makeZip.zip(uploadedRealPath, saveFileName);
		String fileName = FileUtil.download(request, response, fileOrgName, uploadedRealPath, saveFileName);
	}
	
}
