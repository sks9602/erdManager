package com.myframework.was.file.handler;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.common.bean.MyCommonEnvBean;
//import com.myframework.dao.MyFrameworkFileDao;
//import com.myframework.dao.MyFrameworkFileMngDao;
import com.myframework.exception.MyFrameworkException;
import com.myframework.sql.SqlParamMap;
import com.myframework.util.FileUtil;
import com.myframework.was.file.handler.vo.MultipartFileVO;
import com.myframework.was.param.RequestParamMap;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class MultipartFileHandler {


	@Autowired
	private MyCommonEnvBean myFrameworkEnvBean;

	//@Autowired
	//private MyFrameworkFileDao cpsFileDao;

	//@Autowired
	//private MyFrameworkFileMngDao cpsFileMngDao;

	private Map<String, Set<String>> extMap = null;
	
	/**
	 * 
	 * @param req
	 * @param fileParamName 파일 파일미터 명.
	 * @param fimReferKeyId 참고키
	 * @param paramMap
	 * @return
	 * @throws MyFrameworkException 
	 * @throws Exception
	 */
	public MultipartFileVO getMultipartFileList(HttpServletRequest req, String fileParamName, String fimReferKeyId, RequestParamMap paramMap ) throws MyFrameworkException {
		MultipartFileVO multipartFileVO = new MultipartFileVO();

		String fileStorePath =  myFrameworkEnvBean.getFileStorePath();

		try {

			
			SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();

			log.info(" fileStorePath : " + fileStorePath);
			
			List<HashMap<String, Object>> addedFileList = new ArrayList<HashMap<String, Object>>();
			MultipartFile[] mpFiles = (MultipartFile[]) paramMap.getMultipartFile(fileParamName+"_FILE");
				
			// 저장된 물리 파일 삭제여부.
			String pysicalDelete = paramMap.get(fileParamName+"_PYSICAL_DELETE");
	
			String dirNm = new SimpleDateFormat("yyyyMMdd").format(new Date());
	
			log.info(" dirNm : " + dirNm);

			String savePath = null;
	
			File saveFolder = null;
			
			// 파일 파라미터 명을 설정한다.
			multipartFileVO.setName(fileParamName);
	
			log.info(" fileParamName : " + fileParamName);

			// 확장자 유효성 검사.
			String errorMsg = checkFileExtension( req, fileParamName, paramMap, multipartFileVO, mpFiles ) ;
			
			// 확장자 유효성 검사 오류메시지 있을 경우 = 확장자가 유효하지 않을 경우.
			if( StringUtils.isNotEmpty(errorMsg) ) {
				multipartFileVO.setSuccess(false);
				multipartFileVO.setErrorMessage(errorMsg);
			}
				
			// 파일 업로드 실패 경우 가 있는 지확인.
			Boolean  fileResultOfAll = (Boolean) req.getAttribute("fileResultOfAll");	
	
			// 파일 업로드 실패판 경우가 있으면 아래 로직 미처리.
			if( fileResultOfAll != null && fileResultOfAll == false ) {
				//파일 등록 결과를 HttpServletRequest에 저장한다.
				setFileResultListToHttpRequest(req, multipartFileVO);
				
				return multipartFileVO;			
			}
			
			// 비교과 복사..
			Boolean isCopy = Boolean.valueOf(paramMap.get(fileParamName+"_isCopy"));
					
			if( isCopy ) {
				// 첨부파일  새번호 채번.
				String fimFileIdNext = "1"; //cpsFileDao.selectFimFileIdNext();
				multipartFileVO.setFimFileId(fimFileIdNext);
	
				// 새로 채번한 file PK를 등록.
				paramMap.put("fimFileId", multipartFileVO.getFimFileId());
	
				// 첨부파일 master merge
				log.info("paramMap.getMap() = " + paramMap.getMap());
				
				// 파라미터 설정.
				sqlParamMap.putAll(paramMap.getMap());
				sqlParamMap.put("fimReferKeyId", fimReferKeyId);
				sqlParamMap.put("fimFileCategory", getParam(paramMap, fileParamName, "fimFileCategory") );
				sqlParamMap.put("fimSectionName", getParam(paramMap, fileParamName, "fimSectionName"));
				
				int resultMerge = 1; // cpsFileDao.mergeCpsFile(sqlParamMap);
					
				String oriFimReferKeyId = paramMap.get(fileParamName+"_ORI_REFER_KEY_ID");
				
				sqlParamMap.put("fimFileId", multipartFileVO.getFimFileId());
				sqlParamMap.put("oriFimReferKeyId", oriFimReferKeyId);
				
				// 파일 복사.
				//cpsFileMngDao.copyCpsFileMng(sqlParamMap);
				
				// 이전 파일 중 미사용 처리를 위해 
				paramMap.put(fileParamName, fimReferKeyId);
			}
			
			
			// 기존 파일 번호가 있을 경우 기존 값 유지
			if( StringUtils.isNotEmpty(paramMap.get(fileParamName)) ) {
				multipartFileVO.setFimFileId(paramMap.get(fileParamName));
	
				// 삭제 파일 순번이 있을 경우  삭제처리.
				if( paramMap.getValues(fileParamName+"_DELETED") !=null ) {
					// 화면에서 삭제된 파일 목록 조회.(FormData는 배열을 concat에서 보냄)
					String [] deletedFileList = paramMap.getValues(fileParamName+"_DELETED");
					
					multipartFileVO.setDeletedFimSubFileId(deletedFileList);
	
					SqlParamMap<String, Object> deleteFileMap = null;
					for( String  deletedFimFileIdSno : multipartFileVO.getDeletedFimSubFileId() ) {
						deleteFileMap = new SqlParamMap<String, Object>();
								
						deleteFileMap.put("fimFileId", paramMap.get(fileParamName));
						deleteFileMap.put("fimSubFileId", deletedFimFileIdSno);
						deleteFileMap.put("fimFileCategory", paramMap.get(fileParamName+"_fimFileCategory"));
						deleteFileMap.put("fimSectionName", paramMap.get(fileParamName+"_fimSectionName"));
						deleteFileMap.put("ssnUser", paramMap.get("ssnUser"));
	
						// 저장된 물리 파일까지 삭제하는 경우.
						if("Y".equals(pysicalDelete)) {
							// 파일 정보 조회
							Map<String, Object> fileInfo = null ; // cpsFileMngDao.selectCpsFileMng(deleteFileMap) ;
							
							// db 삭제처리.
							int result = 1; // cpsFileMngDao.deleteCpsFileMng(deleteFileMap);
							
							log.info("Deleted File Path = " + fileInfo.get("SAVE_PATH").toString()+"/"+fileInfo.get("SAVE_FILE_NM").toString());
							
							// 물리 파일 삭제.
							FileUtil.delete(fileInfo.get("SAVE_PATH").toString()+"/"+fileInfo.get("SAVE_FILE_NM").toString());
						} else {
							// db 미사용 처리.
							int result = 1; // cpsFileMngDao.updateCpsFileMngUseYnToN(deleteFileMap);
						}
						
					}
				}
			}
			// 업을 경우 새번호 채번.
			else {
				// 첨부파일  새번호 채번.
				String fimFileIdNext = "1" ; // cpsFileDao.selectFimFileIdNext();
				multipartFileVO.setFimFileId(fimFileIdNext);
	
				// 새로 채번한 file PK를 등록.
				paramMap.put("fimFileId", multipartFileVO.getFimFileId());
	
				if( mpFiles !=null ) {
					// 첨부파일 master merge
					log.info("paramMap.getMap() = " + paramMap.getMap());
					
					// 파라미터 설정.
					sqlParamMap.putAll(paramMap.getMap());
					sqlParamMap.put("fimReferKeyId", fimReferKeyId);
					sqlParamMap.put("fimFileCategory", getParam(paramMap, fileParamName, "fimFileCategory") );
					sqlParamMap.put("fimSectionName", getParam(paramMap, fileParamName, "fimSectionName"));
					
					int resultMerge = 1; // cpsFileDao.mergeCpsFile(sqlParamMap);
				}
			}

			
			if( mpFiles !=null ) {
				HashMap<String, Object> fileMap = null;
				// 추가된 파일 번호.
				String [] addFimFileIdSnoEs = getParamValues(paramMap, fileParamName, "ATTF_SNO_ADD");
	
				log.info(" addFimFileIdSnoEs : "  + addFimFileIdSnoEs.length );
				
				for( int i=0; i<mpFiles.length ;i++ ) {
					MultipartFile mpFile = mpFiles[i];
	
					fileMap = new HashMap<String, Object>();
	
					// 파일 순번 등록
					fileMap.put("fimSubFileId", addFimFileIdSnoEs[i]);

					// 확장자 명
					String extName = "";
	
					if( mpFile.getOriginalFilename().indexOf(".")>0) {
						extName = mpFile.getOriginalFilename().substring(mpFile.getOriginalFilename().lastIndexOf(".")+1);
					}

					
					// 새로 생성될 파일명 : 시분_UUID()
					String newFileName = new SimpleDateFormat("HHmmssSSS").format(new Date()) +"_"+ String.valueOf(Double.valueOf((Math.random()*100000)).longValue()) + "."+ extName;
	
					
					// 원본 파일 명
					fileMap.put("fimFileOrgName", mpFile.getOriginalFilename());
					// 파일 크기
					fileMap.put("fimFileSize", String.valueOf(mpFile.getSize()));
					// 확장자 명
					fileMap.put("fimFileExt", extName);
					
					
					// 저장 경로.
					savePath = fileStorePath + getParam(paramMap, fileParamName, "fimFileCategory")  + "/" + dirNm;
	
					// 동영상 or 일반 파일 디렉토리 생성
					saveFolder = new File(savePath);
					// 저장 경로
					fileMap.put("fimFilePath", savePath);
	
					log.info( " savePath : " + savePath);
					
					// 저장 경로 생성.
					if (!saveFolder.exists() || saveFolder.isFile()) {
						boolean mkdir = saveFolder.mkdirs();
						
						log.info( " mkdir : " + mkdir);
					}
					
					try {
						File uploadedFile = new File(saveFolder.getPath()+"/"+newFileName);
	
						mpFile.transferTo(uploadedFile);

						fileMap.put("fimFileName", newFileName);

					} catch (IllegalStateException | IOException e) {
						log.error("multipleFileUpload e.toString() = " + e.toString());
	
						return null;
					}
					// 파일 정보 저장.
					addedFileList.add(fileMap);
				}
				
				
				// 첨부파일이 있을 경우  db저장.
				if( addedFileList!=null && addedFileList.size()>0) {
	
					// 파일 저장 처리.
					for( HashMap<String, Object> addFileInfo : addedFileList) {
						// 신규 파일 순번 설정
						multipartFileVO.setFimSubFileId(addFileInfo.get("fimSubFileId").toString());
						
						SqlParamMap<String, Object> insSqlParamMap = new SqlParamMap<String, Object>();
						
						insSqlParamMap.putAll(addFileInfo);
	
						insSqlParamMap.put("fimFileId", multipartFileVO.getFimFileId());
						insSqlParamMap.put("ssnUser", paramMap.get("ssnUser"));
						insSqlParamMap.put("fimReferKeyId", fimReferKeyId);
						insSqlParamMap.put("fimUseYn", "Y");
						insSqlParamMap.put("fimFileCategory", getParam(paramMap, fileParamName, "fimFileCategory") );
						insSqlParamMap.put("fimSectionName", getParam(paramMap, fileParamName, "fimSectionName"));
	
						int result = 1; // cpsFileMngDao.insertCpsFileMng(insSqlParamMap);
					}
				}
			}
			
			
			// 성공 처리.
			multipartFileVO.setSuccess(true);
	
			//파일 등록 결과를 HttpServletRequest에 저장한다.
			setFileResultListToHttpRequest(req, multipartFileVO);
		} catch( RuntimeException e) {
			e.printStackTrace();
			throw new MyFrameworkException(e.getMessage());
		}
		
		return multipartFileVO;
	}
	
	
	public String getParam(RequestParamMap paramMap, String fileParamName, String paramName) {
		return paramMap.get(fileParamName+"_"+ paramName);
	}
	
	public String [] getParamValues(RequestParamMap paramMap, String fileParamName, String paramName) {
		return paramMap.getValues(fileParamName+"_"+ paramName);
	}
	
	/**
	 * 확장자 유효성 검사 결과
	 * 
	 * @param req
	 * @param fileParamName
	 * @param paramMap
	 * @param multipartFileVO
	 * @param mpFiles
	 * @return - null : 확장자 유효성 검사 장상, not null : 확장자 오류
	 */
	public String checkFileExtension(HttpServletRequest req, String fileParamName, RequestParamMap paramMap, MultipartFileVO multipartFileVO, MultipartFile[] mpFiles ) {
		// 확장자 유형 명.
		String extType = paramMap.get(fileParamName+"_type");

		
		log.info(" extType : " + extType );

		
		String errorMessage = null;
		// 확장자 유형 파라미터 없을 경우 오류.
		if( StringUtils.isEmpty(extType)) {
			errorMessage = "업로드 가능한 확장자 유형이 설정되지 않았습니다.";
			
			//파일 등록 결과를 HttpServletRequest에 저장한다.
			setFileResultListToHttpRequest(req, multipartFileVO);
			
			return errorMessage;
		}
		// 확장자 검사 
		Set<String> extSet = null;
		
		if( "office".equals(extType) ) {
			extSet = new HashSet<String>(myFrameworkEnvBean.getExtListOffice());
		} else if( "zip".equals(extType) ) {
			extSet = new HashSet<String>(myFrameworkEnvBean.getExtListZip());
		} else if( "img".equals(extType) ) {
			extSet = new HashSet<String>(myFrameworkEnvBean.getExtListImg());
		} 
		
		log.info(" extType : " + extType);
		log.info(" extSet : " + extSet);

		
		// 확장자 Set 없을 경우..
		if( extSet == null ) {
			errorMessage = "업로드 가능한 확장자 유형이 설정되지 않았습니다.";
			
			//파일 등록 결과를 HttpServletRequest에 저장한다.
			setFileResultListToHttpRequest(req, multipartFileVO);

			return errorMessage;
		}

		if( mpFiles !=null ) {
			for( int i=0; i<mpFiles.length ;i++ ) {
				MultipartFile mpFile = mpFiles[i];
				
				// 확장자 명
				String extName = "";

				if( mpFile.getOriginalFilename().indexOf(".")>0) {
					extName = mpFile.getOriginalFilename().substring(mpFile.getOriginalFilename().lastIndexOf(".")+1);
				}
				
				if( !extSet.contains(extName.toLowerCase())) {
					errorMessage = "첨부파일은 ["+ extSet.toString().replaceAll("[\\[\\]]", "") +"] 확장자를 가진 파일만 업로드 가능합니다.";
					
					//파일 등록 결과를 HttpServletRequest에 저장한다.
					setFileResultListToHttpRequest(req, multipartFileVO);
					
					return errorMessage;
				}
			}
		}
		return errorMessage;
	}
	/**
	 * 파일 등록 결과를 HttpServletRequest에 저장한다.
	 * @param req
	 * @param multipartFileVO
	 */
	private void setFileResultListToHttpRequest(HttpServletRequest req, MultipartFileVO multipartFileVO) {
		List<MultipartFileVO> resultList = (List<MultipartFileVO>) req.getAttribute("fileResultList");

		// 이전 담긴 파일 정보가 없을 경우. 객체 생성.
		if( resultList == null ) {
			resultList = new ArrayList<MultipartFileVO>();
		}	
		
		// 오류가 한번이라도 있으면 .. 오류 처리..
		if( multipartFileVO.isSuccess() == false) {
			req.setAttribute("fileResultOfAll", false);	
		} else {
			Boolean fileResultOfAll = (Boolean) req.getAttribute("fileResultOfAll");
			// 정상이더라도, 이전에 등록된 값이 없을 경우에만 성공 처리.
			if( fileResultOfAll == null ) {
				req.setAttribute("fileResultOfAll", true);	
			}
		}

		
		// Request Scope에 담기.
		resultList.add(multipartFileVO);			
		req.setAttribute("fileResultList", resultList);		
	}


	public Map<String, Set<String>> getExtMap() {
		return extMap;
	}

	public void setExtMap(Map<String, Set<String>> extMap) {
		this.extMap = extMap;
	}

}
