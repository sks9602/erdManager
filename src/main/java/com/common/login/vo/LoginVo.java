package com.common.login.vo;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.web.context.WebApplicationContext;

import com.myframework.aop.AdvisorOfDao;
import com.myframework.vo.MyFrameworkLoginVO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Setter
@Getter
@NoArgsConstructor
@ToString
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Slf4j
public class LoginVo extends MyFrameworkLoginVO {

	/**
	 * 
	 */
	public final static String ERD_LOGIN_SESSION_KEY = "ERD_LOGIN_SESSION_KEY.sessionVO";
	private static final long serialVersionUID = 7885774821781028800L;

	private String usrUid;
	
	private String loginId;
	
	private String usrNm;

	private String userDiv;
	
	private String loginIp;

	private String dept;
	
	private String deptNm;
	
	private String email;
	
	private String telNo;
	
	/**** erd ****/
	// 회사
	private String companyId;
	// 프로젝트
	private String projectId;
	// 프로젝트
	private String projectNm;
	// 버젼
	private String version;
	
	private String entityDisplayDaycnt;
	private String columnDisplayDaycnt;
	private String auth; // MANAGER > MODELER > VIEWER
	
	/**** erd ****/
	
	// 다중로그인 사용 여부
	private String multiLoginUseYn;
	
	// IP접근 제한 사용 여부
	private String ipAcesUseYn; 

	private String finalLoginDt;
	
	private String loginYmdhms;
	
	private List<String> roles;
	
	private Set<String> roleSet;

	private Boolean success;
	
	private String errorCd;
	
	private String dbase;
	
	private String currentErdYn;
	
	/**
	 * 모델러 권한 있는 지 확인.
	 * @return
	 */
	public boolean isModelerRole() {
		if( "MANAGER".equals(auth) || "MODELER".equals(auth) ) {
			return true;
		}
		
		return false;
	}

	/**
	 * 모델러 권한이 없을 경우
	 * @return
	 */
	public boolean isNotModelerRole() {
		if( "MANAGER".equals(auth) || "MODELER".equals(auth) ) {
			return false;
		}
		
		return true;
	}
	
	/**
	 * 권한 있는 지 확인.
	 * @return
	 */
	public boolean hasRole(String role) {
		Boolean hasRole = false;
		if( (roleSet == null || roleSet.isEmpty()) && roles !=null ) {
			roleSet = new HashSet<String>(roles);
		}
		
		if( roleSet != null && roleSet.contains(role) ) {
			hasRole = true; 
		}
		
		return hasRole;
	}
}
