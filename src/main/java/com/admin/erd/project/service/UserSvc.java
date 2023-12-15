package com.admin.erd.project.service;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.common.login.vo.LoginVo;
import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultMap;
import com.myframework.vo.MyFrameworkLoginVO;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;

import lombok.extern.slf4j.Slf4j;

@Service("userSvc")
@Slf4j
public class UserSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;


	@Transactional
	public MyFrameworkResponseCud userInsert(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			SqlResultMap<String, Object> userInfo = sqlDao.select("mapper.erd.user.selectUserByLoginId", sqlParamMap);
			SqlResultMap<String, Object> uidProject = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
			
			if( userInfo.getInt("CNT")>0) {
				myFrameworkResponseCud.setSuccess(false);
				myFrameworkResponseCud.setErrorMessage("입력한 아이디(ID)는 이미 사용중입니다.");
			} else {
				//UID조회.
				SqlResultMap<String, Object> uidUser = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
				sqlParamMap.put("USR_UID", uidUser.getString("UID"));
				sqlParamMap.put("PROJECT_ID", "P"+uidProject.getString("UID"));
				
				// 사용자 등록
				Integer result = sqlDao.insert("mapper.erd.user.saveUser", sqlParamMap);
		
				
				log.info(" saveUser : " + result);
				
				if( result == 1 ) {
					String versn = "1.0";
					// UID조회
					SqlResultMap<String, Object> uidSubject = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
					
					sqlParamMap.put("SESSION_USR_UID", uidUser.getString("UID"));
					sqlParamMap.put("PROJECT_ID", "P"+uidProject.getString("UID"));
					sqlParamMap.put("SUBJECT_ID", "S"+uidSubject.getString("UID"));
					sqlParamMap.put("VERSN", versn );
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
					
					sqlParamMap.put("DBASE", "mariaDB");
					sqlParamMap.put("START_DT", sdf.format(new Date()));
					
					sqlParamMap.put("PROJECT_NM", "빈(기본) 프로젝트");
					sqlParamMap.put("DEFAULT_YN", "Y"); // DEFAULT생성.
					
					// 프로젝트 등록
					sqlDao.insert("mapper.erd.project.saveProject", sqlParamMap);
					// 사용자 프로젝트 등록
					// sqlDao.update("mapper.erd.project.updateUserProject", sqlParamMap);

					sqlParamMap.put("USR_UID", uidUser.getString("UID"));
					sqlParamMap.put("AUTH_CD", "MANAGER");
					sqlParamMap.put("BASE_YN", "Y");
					sqlParamMap.put("APPR_SCD", "APPR_SCD_APP"); // 승인
					
					sqlDao.update("mapper.erd.project.saveUserProject", sqlParamMap );

					
					if( StringUtils.isNotEmpty(paramMap.get("REQ_PROJECT_SHARE_ID"))) {
						SqlParamMap<String, Object> sqlParamMapReq = new SqlParamMap<String, Object>();
						sqlParamMapReq.put("PROJECT_SHARE_ID", paramMap.get("REQ_PROJECT_SHARE_ID"));
						
						SqlResultMap<String, Object> projectInfo = sqlDao.select("mapper.erd.project.selectProjectByShareId", sqlParamMap);

						if( projectInfo!=null && !StringUtils.isEmpty(projectInfo.getString("PROJECT_ID"))) {
							sqlParamMap.put("PROJECT_ID", projectInfo.get("PROJECT_ID"));
							Integer result1 = sqlDao.insert("mapper.erd.project.applyProject", sqlParamMap);
						}
					}
					
					// 업무영역 정보 등록
					sqlParamMap.put("SESSION_PROJECT_ID", "P"+uidProject.getString("UID"));
					sqlParamMap.put("SESSION_VERSN", versn);
					sqlParamMap.put("SUBJECT_NM", "기본업무영역");
					sqlParamMap.put("WIDTH", 2500);
					sqlParamMap.put("HEIGHT", 2500);
					
					sqlDao.insert("mapper.erd.subject.saveSubject", sqlParamMap);
					
					
					myFrameworkResponseCud.setCudCount(result);
					myFrameworkResponseCud.setSuccess(true);
					myFrameworkResponseCud.setMessage("저장되었습니다.");
					
					LoginVo loginVo = new LoginVo();
					loginVo.setProjectId("P"+uidProject.getString("UID"));
					loginVo.setProjectNm("빈(기본) 프로젝트");
					loginVo.setUsrNm(sqlParamMap.getString("USR_NM"));
					loginVo.setUsrUid(uidUser.getString("UID"));
					loginVo.setLoginId(sqlParamMap.getString("LOGIN_ID"));
					loginVo.setEntityDisplayDaycnt("-7");
					loginVo.setColumnDisplayDaycnt("-7");
					loginVo.setVersion(versn);
					loginVo.setAuth("MANAGER"); // MANAGER > MODELER > VIEWER

					request.getSession().setAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY, loginVo);
					
					// 기본 도메인 정보 등록
					// sqlDao.insert("mapper.erd.domain.insertDomainByDB", sqlParamMap);
				} else {
					myFrameworkResponseCud.setSuccess(false);
					myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
				}
			}
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			
			throw e;
		}
		return myFrameworkResponseCud;
	}
	
}
