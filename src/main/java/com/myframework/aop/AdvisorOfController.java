package com.myframework.aop;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.LocaleResolver;

import com.common.login.vo.LoginVo;
import com.myframework.exception.MyFrameworkException;
import com.myframework.sql.SqlParamMap;
import com.myframework.util.HttpUtil;
import com.myframework.vo.MyFrameworkLoginVO;
//import com.dao.system.SysMenuDao;
//import com.dao.system.SysMenuFncDao;
//import com.dao.system.SysUsrCnntMenuFncDao;

import lombok.extern.slf4j.Slf4j;

 
@Aspect
@Component 
@Slf4j
public class AdvisorOfController {
 
	//@Autowired
	//private SysMenuFncDao sysMenuFncDao;
	
	//@Autowired
	//private SysMenuDao sysMenuDao;

	//@Autowired
	//private SysUsrCnntMenuFncDao sysUsrCnntMenuFncDao;

	@Autowired
	LocaleResolver localeResolver;

	@Pointcut("within(com.*.*.**.controller..*)") // 3
	public void onRequest() {}
	
	@Around("com.myframework.aop.AdvisorOfController.onRequest()")
	public Object doLogging(ProceedingJoinPoint joinPoint) throws Throwable {
		log.info("Controller Called : " + joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName()+"(...)" );

		HttpServletRequest request =  (HttpServletRequest) ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();		


		//log.info(" localeResolver.resolveLocale(request) :  " + localeResolver.resolveLocale(request) );
		
		HttpSession session = request.getSession(false) ;

		//session.setAttribute("lang", localeResolver.resolveLocale(request));
		
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		
		ModelMap modelMap = null;

		Object [] args = joinPoint.getArgs();

		if( args !=null) {
			for(int i=0; i< args.length ; i++) {
				Object arg = args[i];

				if( arg !=null && arg instanceof ModelMap ) {
					modelMap = (ModelMap) arg;
				} 
			}
		}

		sqlParamMap.put("url", request.getRequestURI());
		sqlParamMap.put("menu", request.getParameter("menu"));
		
		// 로그인 필요 여부 확인.
		String loginNeedYn = "N"; // sysMenuFncDao.selectLoginNeedYnByUrl(sqlParamMap);

		// 로그인이 필요하지만 로그인 되지 않은 경우.
		/*
		if( session.getAttribute(LoginVo.MY_FRAMEWORK_LOGIN_SESSION_KEY) == null ) {
			if( modelMap !=null) {
				modelMap.addAttribute("success", false);
				modelMap.addAttribute("errorCode", "SESSION-ERROR");
				modelMap.addAttribute("message", "로그인 후 사용가능합니다.(1)");
				modelMap.addAttribute("redirectUrl", "/common/login/loginView.do");
			} else {
				request.setAttribute("success", false);
				request.setAttribute("errorCode", "SESSION-ERROR");
				request.setAttribute("message", "로그인 후 사용가능합니다.(2)");
				request.setAttribute("redirectUrl", "/common/login/loginView.do");
			}			
			
			if( "XMLHttpRequest".equalsIgnoreCase( request.getHeader("X-Requested-With") ) ) {
				return "jsonView";
			} else {
				return  "common/view/error/error.alert";			
			}
		}
		*/
		// String typeName=  joinPoint.getSignature().getDeclaringType().getName();
		
		String resultType = "jsp";

		
		// Map<String, String[]> paramMap = request.getParameterMap();
		// log.info( paramMap.toString() );
		Object result = null;
		try {

			result = joinPoint.proceed(joinPoint.getArgs());
			
			if( result == null ) {
				resultType = "download";
			} else if( "jsonView".equals(result)) {
				resultType = "jsonView";
				
				if( modelMap !=null) {
					if( modelMap.getAttribute("success")  == null) {
						modelMap.addAttribute("success", true);
					}
				} else {
					if( request.getAttribute("success")  == null) {
						request.setAttribute("success", true);
					}
				}			
				
				
			} 
			
			if( "jsp".equals(resultType) ) {
				String jspNm = result.toString();
				request.setAttribute("requestUri", jspNm.substring(jspNm.lastIndexOf("/")+1).replaceAll("[\\./]","_"));
				request.setAttribute("TargetJsp", result +".jsp");
			} else {
				log.info(" result : " + resultType);
			}
			
		} catch(IOException|MyFrameworkException|RuntimeException e) {
			// TODO  e.printStackTrace(); (오픈전  삭제) 
			e.printStackTrace();

			log.error(e.getMessage() + ":"+ e.toString());

			if( "XMLHttpRequest".equalsIgnoreCase( request.getHeader("X-Requested-With") ) ) {
				if( modelMap !=null) {
					if( modelMap.getAttribute("success")  == null) {
						modelMap.addAttribute("success", true);
					}
				} else {
					if( request.getAttribute("success")  == null) {
						request.setAttribute("success", true);
					}
				}			
				result = "jsonView";
			} else if( "jsp".equals(resultType)  ) {
				result = "common/view/error/error.view";
			} 
		} finally {
			if(  "jsp".equals(resultType) ) {
				log.info("Controller Finished [VIEW] Target jsp : " + result +".jsp" );
			} else {
				log.info("Controller Finished [VIEW] Target : " + result  );
			}
		}
		return result;
	}
	
//	@Before("execution(* com.myFramework*.**.controller.*Controller.*(..))")
//	public void logBeforeControllerMethods(JoinPoint joinPoint) {
//		log.info( joinPoint.toLongString() );
//	}
//	
//	@AfterThrowing(pointcut = "execution(* com.myFramework*.**.controller.*Controller.*(..))", throwing = "ex")
//	public void logAfterThrowControllerMethods(JoinPoint joinPoint, Throwable ex) {
//		log.error( joinPoint.toLongString() );
//		log.error( ex.toString() );
//	}
}
