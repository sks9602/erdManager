package com.admin.erd.project.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.common.login.vo.LoginVo;
import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.MapHasList;
import com.myframework.vo.MyFrameworkLoginVO;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;

import lombok.extern.slf4j.Slf4j;

@Service("projectSvc")
@Slf4j
public class ProjectSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;

	public void dbaseList(ModelMap model, RequestParamMap paramMap) {
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.project.selectDbaseList", sqlParamMap);

		model.addAttribute("dataList", list);
	}


	@Transactional
	public MyFrameworkResponseCud projectInsert(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			SqlResultMap<String, Object> uidProject = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
			sqlParamMap.put("PROJECT_ID", "P"+uidProject.getString("UID"));
			sqlParamMap.put("VERSN", 1);
			
			SqlResultMap<String, Object> uidSubject  = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
			sqlParamMap.put("SUBJECT_ID", "S"+uidSubject.getString("UID"));
			
			Integer result = sqlDao.insert("mapper.erd.project.saveProject", sqlParamMap);
	
			sqlParamMap.put("CD_GRP", "TABL_SCD");
			sqlDao.update("mapper.erd.project.updateUserProject", sqlParamMap);
			log.info(" projectSave : " + result);
			
			sqlDao.insert("com.dao.system.CodeDao.deleteCodeProject", sqlParamMap);
			
			String [] tablScds = paramMap.getValues("TABL_SCD");
			for( String tablScd : tablScds) {
				SqlParamMap<String, Object> sqlParamMapTablScd = new SqlParamMap<String, Object>();
				
				sqlParamMapTablScd.put("PROJECT_ID", sqlParamMap.getString("PROJECT_ID"));
				sqlParamMapTablScd.put("CD_GRP", "TABL_SCD");
				sqlParamMapTablScd.put("CD", tablScd);
				
				sqlDao.insert("com.dao.system.CodeDao.insertCodeProject", sqlParamMapTablScd);
			}

			// 업무영역 정보 등록
			sqlParamMap.put("SESSION_PROJECT_ID", "P"+uidProject.getString("UID"));
			sqlParamMap.put("SESSION_VERSN", 1);
			
			sqlDao.insert("mapper.erd.subject.saveSubject", sqlParamMap);
			
			// 기본 도메인 정보 등록 
			// TODO - DB변경시 도메인 변경..
			if( !paramMap.get("DBASE_ORI").equals(paramMap.get("DBASE")) ) {
				sqlDao.insert("mapper.erd.domain.deleteDomainOfProject", sqlParamMap);
				sqlDao.insert("mapper.erd.domain.insertDomainByDB", sqlParamMap);
			}
			if( result == 1 || result == 2 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
			} else {
				myFrameworkResponseCud.setSuccess(false);
				myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			}
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
		}
		return myFrameworkResponseCud;
	}

	@Transactional
	public MyFrameworkResponseCud projectUpdate(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			Integer result = sqlDao.insert("mapper.erd.project.saveProject", sqlParamMap);
	
			sqlParamMap.put("CD_GRP", "TABL_SCD");
			sqlDao.update("mapper.erd.project.updateUserProject", sqlParamMap);
			log.info(" projectSave : " + result);

			
			sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("PROJECT_ID"));
			sqlParamMap.put("SESSION_VERSN", paramMap.get("VERSN"));
			
			sqlDao.insert("mapper.erd.subject.saveSubject", sqlParamMap);
			
			sqlDao.insert("com.dao.system.CodeDao.deleteCodeProject", sqlParamMap);
			
			String [] tablScds = paramMap.getValues("TABL_SCD");
			for( String tablScd : tablScds) {
				SqlParamMap<String, Object> sqlParamMapTablScd = new SqlParamMap<String, Object>();
				
				sqlParamMapTablScd.put("PROJECT_ID", sqlParamMap.getString("PROJECT_ID"));
				sqlParamMapTablScd.put("CD_GRP", "TABL_SCD");
				sqlParamMapTablScd.put("CD", tablScd);
				
				sqlDao.insert("com.dao.system.CodeDao.insertCodeProject", sqlParamMapTablScd);
			}
			
			if( result == 1 || result == 2 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
			} else {
				myFrameworkResponseCud.setSuccess(false);
				myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			}
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
		}
		return myFrameworkResponseCud;
	}
	
	public void projectList(ModelMap model, RequestParamMap paramMap) {
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.project.selectProjectList", sqlParamMap);

		model.addAttribute("dataList", list);
	}
	
	public MyFrameworkResponseData projectDetail(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseData myFrameworkResponseData = MyFrameworkResponseData.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultMap<String, Object> detail = null;
		
		// 세션기준 프로젝트 정보.
		if( "Y".equals( sqlParamMap.getString("SESSION_YN"))) {
			detail = sqlDao.select("mapper.erd.project.selectProjectDetailBySession", sqlParamMap);
		} else {
			detail = sqlDao.select("mapper.erd.project.selectProjectDetail", sqlParamMap);
		}
		
		myFrameworkResponseData.put("detail", detail);
		myFrameworkResponseData.put("totalCount", 0);
		
		return myFrameworkResponseData;
	}
	
	public void projectSubjectList(ModelMap model, RequestParamMap paramMap) {
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.project.selectProjectSubjecList", sqlParamMap);

		model.addAttribute("dataList", list);
	}

	public void projectLoingUser(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
		LoginVo loginVo = (LoginVo) request.getSession().getAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY);

		Map<String, String> loginUser = new HashMap<String, String>();
		loginUser.put("AUTH",  loginVo.getAuth());
		loginUser.put("USER_ID",  loginVo.getUsrUid());
		loginUser.put("LOGINED_YN",  "GUEST".equals(loginVo.getUsrUid()) ? "N" : "Y");
		
		model.addAttribute("data", loginUser);
	}

	@Transactional
	public MyFrameworkResponseCud projectApply(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			
			SqlResultMap<String, Object> projectInfo = sqlDao.select("mapper.erd.project.selectProjectByShareId", sqlParamMap);
			
			if( projectInfo!=null && !StringUtils.isEmpty(projectInfo.getString("PROJECT_ID"))) {
				sqlParamMap.put("PROJECT_ID", projectInfo.get("PROJECT_ID"));
				Integer result = sqlDao.insert("mapper.erd.project.applyProject", sqlParamMap);

				if( result == 1 || result == 2 ) {
					myFrameworkResponseCud.setCudCount(result);
					myFrameworkResponseCud.setSuccess(true);
					myFrameworkResponseCud.setMessage("저장되었습니다.");
				}
			} else {
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setErrorMessage("프로젝트 신청결과는 '프로젝트 열기'메뉴에서 확인하시기 바랍니다.<br/>프로젝트 공유코드가 정확하지 않을 경우 신청되지 않습니다.");
			}
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
		}
		return myFrameworkResponseCud;
	}
	
	public void userList(ModelMap model, RequestParamMap paramMap) {
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		if(StringUtils.isNotEmpty(paramMap.get("USR_NM"))) {
			sqlParamMap.put("USR_NMS", paramMap.get("USR_NM").split("\\;"));
		}
		if(StringUtils.isNotEmpty(paramMap.get("LOGIN_ID"))) {
			sqlParamMap.put("LOGIN_IDS", paramMap.get("LOGIN_ID").split("\\;"));
		}		
		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.project.selectUserList", sqlParamMap);

		model.addAttribute("dataList", list);
	}

	@Transactional
	public MyFrameworkResponseCud userStatusSave(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		// sqlParamMap.putAll(paramMap.getMap());

		try {
			
			String [] usr_uids= paramMap.getValues("USR_UID");
			
			for( int i=0; i<usr_uids.length; i++ ) {

				sqlParamMap = new SqlParamMap<String, Object>();

				sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
				sqlParamMap.put("LOGIN_ID", paramMap.getValues("LOGIN_ID")[i]);
				
				String usr_uid = usr_uids[i];
				log.info("usr_uid : [" + usr_uid +"], {}", StringUtils.isEmpty(usr_uid));
				
				if( StringUtils.isEmpty(usr_uid)) {
					SqlResultMap<String, Object> userInfo = sqlDao.select("mapper.erd.project.selectUserUidByLoginId", sqlParamMap);
					
					if( userInfo == null ) {
						continue;
					}
					usr_uid = userInfo.getString("USR_UID");
				}
				if( StringUtils.isEmpty(usr_uid)) {
					continue;
				}
				sqlParamMap.put("USR_UID", usr_uid);
				sqlParamMap.put("AUTH_CD", paramMap.getValues("AUTH_CD")[i]);
				sqlParamMap.put("APPR_SCD", paramMap.getValues("APPR_SCD")[i]);
				
				Integer result = sqlDao.update("mapper.erd.project.saveUserStatus", sqlParamMap);

			}

		
			myFrameworkResponseCud.setCudCount(usr_uids.length);
			myFrameworkResponseCud.setSuccess(true);
			myFrameworkResponseCud.setMessage("저장되었습니다.");

		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			
			throw e;
		}
		return myFrameworkResponseCud;
	}
}
