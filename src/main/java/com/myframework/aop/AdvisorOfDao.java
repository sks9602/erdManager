package com.myframework.aop;

import java.util.List;
import java.util.Map;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.myframework.sql.SqlParamMap;
// import com.dao.system.SysSqlDiffDao;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component 
@Slf4j
public class AdvisorOfDao {

	//@Autowired
	//private SysSqlDiffDao sysSqlDiffDao;
	
	@Before("execution(* com.dao.*.*Dao.*(..))")
	public void logBeforeDaoMethods(JoinPoint joinPoint) {
		log.info("DAO Called : " + joinPoint.getSignature().getDeclaringTypeName() +"."+ joinPoint.getSignature().getName()+"(...)" );
		// log.info( joinPoint.toLongString() );
	}
	
	// @Around("execution(* com.dao.*.*Dao.*(..)) and !target(com.dao.system.SysSqlDiffDao)  and !target(com.dao.system.SysMenuDao) and !target(com.dao.system.SysMenuFncDao) ")
	@Around("execution(* com.dao.*.*Dao.*(..))")
	public Object aroundDaoMethods(ProceedingJoinPoint joinPoint)  throws Throwable {
	
		Object result = null;
		
		try {
			
			result = joinPoint.proceed(joinPoint.getArgs());
			
		} catch (Throwable e) {
			e.printStackTrace();
			
			throw e;
		}
		
		return result;
	}
	
	@AfterReturning(pointcut="execution(* com.dao.*.*Dao.*(..))", returning="rVal")
	public void logAfterDaoMethods(JoinPoint joinPoint, Object rVal) {
		log.info("DAO Finished : " + joinPoint.getSignature().getDeclaringTypeName() +"."+ joinPoint.getSignature().getName()+"(...)" );
		
		if( rVal == null ) {
			log.info("DAO return : null");
		} else if( rVal instanceof List) {
			log.info("DAO return : " + rVal.getClass().getName() + " : Size is [" + ((List)rVal).size() +"]");
		} else if( rVal instanceof Map) {
			log.info("DAO return : " + rVal.getClass().getName() + " : Value is [" + ((Map)rVal).toString() +"]");
		} else {
			log.info("DAO return : " + rVal.getClass().getName() + " : [" + rVal.toString() +"]");
		}
	}

	@AfterThrowing( pointcut = "execution(* com.*.*.**.service.*Dao.*(..))", throwing = "ex")
	public void logAfterThrowDaoMethods(JoinPoint joinPoint, Throwable ex) {	
		log.error("DAO Exception : " + joinPoint.getSignature().getDeclaringTypeName() + joinPoint.getSignature().toShortString() + " -> " +  ex.toString()  );
		// log.error( joinPoint.toLongString() );
		// TODO  e.printStackTrace(); (오픈전  삭제) 
		ex.printStackTrace();
	}
}
