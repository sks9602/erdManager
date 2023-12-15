package com.common.login.service;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.support.SessionStatus;

import com.common.login.vo.LoginVo;
import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.HttpUtil;
import com.myframework.vo.MyFrameworkLoginVO;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;
import com.myframework.was.session.MyFrameworkHttpSessionBindingListener;
//import com.dao.login.LoginDao;

import lombok.extern.slf4j.Slf4j;

@Service("loginService")
@Slf4j
public class LoginService {

	@Autowired
	private MyFrameworkSqlDao sqlDao;

	/**
	 * 로그인 수행.
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@Transactional
	public MyFrameworkResponseData login(ModelMap model, RequestParamMap paramMap, HttpServletRequest request, SessionStatus status) {
		MyFrameworkResponseData myFrameworkResponseData = MyFrameworkResponseData.builder().modelMap(model).build();

		HttpSession session = request.getSession(false);

		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		
		sqlParamMap.put("LOGIN_IP", HttpUtil.getClientIP(request));
		
		sqlParamMap.put("OS_INFO", HttpUtil.getConnOs(request));
		
		Integer result = sqlDao.insert("com.dao.login.LoginDao.insertSysUsrLoginHist", sqlParamMap);
		
		boolean isError = false;
		
		SqlResultMap<String, Object> loginInfo = null;
		
		try {
			loginInfo = sqlDao.select("com.dao.login.LoginDao.selectLoginUser", sqlParamMap);
		} catch(Exception e) {
			isError = true;
			
			e.printStackTrace();
			
			myFrameworkResponseData.put("success", false);
			
			sqlParamMap.put("LOGIN_YN", "N");
			sqlParamMap.put("LOGIN_FAIL_DESC", e.getMessage());
			
			result = sqlDao.update("com.dao.login.LoginDao.updateSysUsrLoginHist", sqlParamMap); 

		}
		
		// 사용자 정보 조회.
		LoginVo loginUser = null;
		
		if( isError == false ) {
			if( loginInfo != null ) {
				loginUser = new LoginVo(); 

				loginUser.setProjectId(loginInfo.getString("PROJECT_ID"));
				loginUser.setProjectNm(loginInfo.getString("PROJECT_NM"));
				loginUser.setUsrNm(loginInfo.getString("USR_NM"));
				loginUser.setUsrUid(loginInfo.getString("USR_UID"));
				loginUser.setLoginId(loginInfo.getString("LOGIN_ID"));
				loginUser.setEntityDisplayDaycnt(loginInfo.getString("ENTITY_DISPLAY_DAYCNT"));
				loginUser.setColumnDisplayDaycnt(loginInfo.getString("COLMN_DISPLAY_DAYCNT"));
				loginUser.setVersion(loginInfo.getString("VERSN"));
				loginUser.setAuth(loginInfo.getString("AUTH_CD")); // MANAGER > MODELER > VIEWER
			}
			
			if(loginUser!=null) {
				
				// 역할 정보 조회
				LoginVo loginVo = loginProcess(request, status, loginUser, loginInfo);
				
				log.info( loginVo.toString() );
				
				// 사용자 및 역할 모두 있을 경우 - 성공
				if( loginVo.getSuccess() == true) {
					
					// 세션 설정.
					session.setAttribute(LoginVo.MY_FRAMEWORK_LOGIN_SESSION_KEY, loginVo);
					
					// 로그인 성공
					myFrameworkResponseData.put("success", true);
					
					myFrameworkResponseData.put("USR_NM", loginVo.getUsrNm());
					myFrameworkResponseData.put("PROJECT_NM", loginVo.getProjectNm());
					// 로그인 시간 등록
					loginVo.setLoginYmdhms(sqlParamMap.get("LOGIN_YMDHMS").toString());
					sqlParamMap.put("LOGIN_YN", "Y");
					sqlParamMap.put("LOGIN_FAIL_DESC", "로그인 성공");
					
					// 사용자 로그인 실패 및 성공 사유 등록
					result = sqlDao.update("com.dao.login.LoginDao.updateSysUsrLoginHist", sqlParamMap); 
					
					// 사용자 최종 로그인 일시 저장.
					result = 1; // oginDao.mergeSysUsrLoginFinalDt(loginVo);
	
					// IP 등록/수정을 위해 사용자 KEY세션 저장.
					request.getSession().setAttribute( MyFrameworkLoginVO.MY_FRAMEWORK_USER_KEY_FOR_IP, loginVo.getUsrUid());
	
					log.info(LoginVo.MY_FRAMEWORK_LOGIN_SESSION_KEY  + ":" + session.getAttribute(LoginVo.MY_FRAMEWORK_LOGIN_SESSION_KEY)  );
	
					myFrameworkResponseData.put("forwardUrl", "/extjs/erd/erd.do");
				} 
				// 역할 없을 경우 실패.
				else {
					sqlParamMap.put("LOGIN_YN", "N");
					// 접근 가능 IP에 해당하는 IP없을 경우. 실패
					if( "IP-NOT-MATCH".equals(loginVo.getErrorCd()) ) {
						sqlParamMap.put("LOGIN_FAIL_DESC", "등록된 IP가 아닙니다.");
					} 
					// IP가 등록 되지 않은 경우. -> IP등록 팝업
					else if( "IP-NOT-REGIST".equals(loginVo.getErrorCd()) ) {			
						// IP 등록 팝업 생성.
						myFrameworkResponseData.put("ipNeed", true);
						
						sqlParamMap.put("LOGIN_FAIL_DESC", "IP가 등록되어 있지 않습니다.");
						myFrameworkResponseData.put("forwardUrl", "/staff/system/system/user/popupIpView.do");
						myFrameworkResponseData.put("menu", "ADM000");
						
						// IP 등록/수정을 위해 사용자 KEY세션 저장.
						request.getSession().setAttribute( MyFrameworkLoginVO.MY_FRAMEWORK_USER_KEY_FOR_IP, loginVo.getUsrUid());	
					} 
					//  실패
					else {
						sqlParamMap.put("LOGIN_FAIL_DESC", "등록된 권한 정보가 없습니다.");
					}
					
					result = sqlDao.update("com.dao.login.LoginDao.updateSysUsrLoginHist", sqlParamMap); 
					
					myFrameworkResponseData.put("success", false);
				}
			} else {
				sqlParamMap.put("LOGIN_YN", "N");
				sqlParamMap.put("LOGIN_FAIL_DESC", "사용자 정보가 없습니다.(id/pwd오류)");
				
				result = sqlDao.update("com.dao.login.LoginDao.updateSysUsrLoginHist", sqlParamMap); 
				
				// 로그인 실패
				myFrameworkResponseData.put("success", false);
				
			}
		}
		
		return myFrameworkResponseData; 
		
	}
	
	@Transactional
	public MyFrameworkResponseData logout(ModelMap model, RequestParamMap paramMap, HttpServletRequest request, SessionStatus status) {
		MyFrameworkResponseData myFrameworkResponseData = MyFrameworkResponseData.builder().modelMap(model).build();
		
		HttpSession session = request.getSession();
		
		LoginVo loginVo = (LoginVo) session.getAttribute( MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY);
		
		
		// 로그아웃 이력
		Integer result = 1; //loginDao.updateSysUsrLogout(loginVo);
		
		// 로그아웃 처리.
		session.invalidate();
		
		myFrameworkResponseData.put("forwardUrl", "/common/login/loginView.do");
		myFrameworkResponseData.put("success", true);
		
		return myFrameworkResponseData;
	}
	
	/**
	 * 로그인 후속 조치
	 * @param request
	 * @param status
	 * @param loginVo
	 */
	protected LoginVo loginProcess(HttpServletRequest request, SessionStatus status, LoginVo loginVo, SqlResultMap<String, Object> loginInfo) {		
		// 로그인 IP점검
		String  clientIp = HttpUtil.getClientIP(request);
		
		loginVo.setLoginIp(clientIp);
		
		// 역할 목록 조회ㅣ
		SqlResultList<SqlResultMap<String, Object>> roleList = sqlDao.selectList("com.dao.login.LoginDao.selectLoginUser", loginInfo);  
		
		// 역할이 없을 경우.
		if(roleList==null) {
			loginVo.setSuccess( false );
			loginVo.setErrorCd("NO-ROLES");

			return loginVo;
		} else {
			List<String> roles = new ArrayList<String>();
			for( SqlResultMap<String, Object> role : roleList ) {
				roles.add(role.getString("ROLE"));
			}
			// 사용자 역할 등록.
			loginVo.setRoles(roles);
		}
		
		
		// 중복 로그인 방지
		if( !"Y".equals(loginVo.getMultiLoginUseYn())) {
			HttpSession session = request.getSession();

			// 중복 로그인 방지
			MyFrameworkHttpSessionBindingListener listener = new MyFrameworkHttpSessionBindingListener();
			session.setAttribute(loginVo.getUsrUid(), listener);
		}

		loginVo.setSuccess( true );
		return loginVo;
	}

}
