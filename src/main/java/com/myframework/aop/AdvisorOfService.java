package com.myframework.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;

import com.myframework.exception.MyFrameworkException;
import com.myframework.was.param.RequestParamMap;

import lombok.extern.slf4j.Slf4j;

 
@Aspect
@Component 
@Slf4j
public class AdvisorOfService {

	@Before("execution(* com.*.*.**.service.*Service.*(..))")
	public void logBeforeServiceMethods(JoinPoint joinPoint) {
		log.info("Service Called : " + joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName()+"(...)" );
		
		Object [] args = joinPoint.getArgs();
		
		if( args !=null) {
			for(int i=0; i< args.length ; i++) {
				Object arg = args[i];

				if( arg !=null && arg instanceof RequestParamMap ) {
					RequestParamMap paramMap = (RequestParamMap) arg;
					log.info("Service args[" +i +"] is RequestParamMap - " + paramMap.toString() );
				} else  {
					if(arg !=null ) {
						log.info("Service args[" +i +"] is " + arg.getClass().getName() );
					} else {
						log.info("Service args[" +i +"] is null " );
					}
				}
			}
		}
	}
	
	@AfterReturning(pointcut="execution(* com.*.*.**.service.*Service.*(..))", returning="rVal")
	public void logAfterServiceMethods(JoinPoint joinPoint, Object rVal) {
		log.info("Service Finished : " + joinPoint.getSignature().getDeclaringTypeName() +"."+ joinPoint.getSignature().getName()+"(...)" );
	}

	@AfterThrowing(pointcut = "execution(* com.*.*.**.service.*Service.*(..))", throwing = "ex")
	public void logAfterThrowServiceMethods(JoinPoint joinPoint, Throwable ex) {
	
		Object [] args  = joinPoint.getArgs();
		
		for( Object arg : args) {
			if( arg instanceof ModelMap) {
				ModelMap modelMap = (ModelMap) arg;
				
				modelMap.addAttribute("success", false);
				
				if( ex instanceof MyFrameworkException) {
					modelMap.addAttribute("message", ex.getMessage());
				} else {
					modelMap.addAttribute("message", "처리하는 동안에 오류가 발생했습니다." + ex.getMessage());
				}
			} else if( arg instanceof RequestParamMap ) {
				RequestParamMap paramMap = (RequestParamMap) arg;
				if( paramMap.get("ssnUser") != null ) {
					MDC.put("user", paramMap.get("ssnUser") );
				}
			} 
		}

		// error로그
		StackTraceElement[] stes = ex.getStackTrace();
		
		StringBuilder sb = new StringBuilder();
		for( StackTraceElement ste : stes ) {
			/* TODO - 메시지 잘릴 경우 이 주석 해제..
			if( ste.toString().indexOf("springframework") >= 0 || ste.toString().indexOf("reflect") >= 0 || ste.toString().indexOf("apache") >= 0 ) {
				continue;
			}
			*/
			
			sb.append(ste.toString()+">");
			
			if( sb.length() >= 3500 ) {
				break;
			}
		}
		
		log.error("Service Exception : " + joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName()+"(...) -> " +  ex.toString() + "["+ sb + "]" );

		// TODO  e.printStackTrace(); (오픈전  삭제) 
		ex.printStackTrace();
	}
}
