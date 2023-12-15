package com.myframework.util;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

/**************************************************************
 * Filename : HttpUtil.java 
 * Function : 
 * Comment : 
 * History :
 * 
 * @version 1.0
 * @author
 *************************************************************/
public class HttpUtil {
	
	/**
	 *
	 * @param request
	 * @return
	 */
	public static String getCurrentEnvironmentNetworkIp(){

		Enumeration netInterfaces = null;
		
		try {
			netInterfaces = NetworkInterface.getNetworkInterfaces();
		} catch (SocketException e) {
			return getLocalIp();
		}

		while (netInterfaces.hasMoreElements()) {
			NetworkInterface ni = (NetworkInterface)netInterfaces.nextElement();
			Enumeration address = ni.getInetAddresses();
			if (address == null) {
				return getLocalIp();
			}
			while (address.hasMoreElements()) {
				InetAddress addr = (InetAddress)address.nextElement();
				if (!addr.isLoopbackAddress() && !addr.isSiteLocalAddress() && !addr.isAnyLocalAddress() ) {
					String ip = addr.getHostAddress();
					if( ip.indexOf(".") != -1 && ip.indexOf(":") == -1 ){
						return ip;
					}
				}
			}
		}
		return getLocalIp();
	}

	public static String getLocalIp(){
		try {
			return InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			return null;
		}
	}

	/**
	 * TODO 
	 * IPv6 형식으로 나오는 IP를 IPv4로 변환
	 *		Tomcat인 경우
	 *		$CATALINA_HOME\bin\catalina.bat(.sh) 을 찾는다.
	 *		:noJuliConfig, :noJuliManager 를 검색한다.
	 *		JAVA_OPTS에 -Djava.net.preferIPv4Stack=true 를 추가한다.
	 *
	 *	개발 환경에서 VM 속성 추가 하기
	 *		사용 중인 IDE에서 VM Options에 -Djava.net.preferIPv4Stack=true 를 추가한다.
	 */
	public static String getClientIP(HttpServletRequest request) {

		String clientIp = "";
		try {
			clientIp = request.getHeader("X-Forwarded-For");
			
			if (StringUtils.isEmpty(clientIp)|| "unknown".equalsIgnoreCase(clientIp)) {
				//Proxy 서버인 경우
				clientIp = request.getHeader("Proxy-Client-IP");
			}
			if (StringUtils.isEmpty(clientIp) || "unknown".equalsIgnoreCase(clientIp)) {
				//Weblogic 서버인 경우
				clientIp = request.getHeader("WL-Proxy-Client-IP");
			}
			if (StringUtils.isEmpty(clientIp) || "unknown".equalsIgnoreCase(clientIp)) {
				clientIp = request.getHeader("HTTP_CLIENT_IP");
			}
			if (StringUtils.isEmpty(clientIp) || "unknown".equalsIgnoreCase(clientIp)) {
				clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");
			}
			if (StringUtils.isEmpty(clientIp) || "unknown".equalsIgnoreCase(clientIp)) {
				clientIp = request.getRemoteAddr();
			}

			return clientIp;
		} catch (Exception e) {
			// logger.error( "e=" + e.getMessage());
		}
		return "";
	}

	/**
	 * �젒�냽 �꽌踰� IP �쉷�뱷
	 * @param request
	 * @return
	 */
	public static String getHostIP(HttpServletRequest request) {
		String hostAddr = "";
		try {
			hostAddr = "";
		} catch (Exception e) {
			// Logger.error(request, "e=" + e.getMessage());
		}
		return hostAddr;
	}
	
	/**
	 * 釉뚮씪�슦��/OS �젙蹂�
	 * @param request
	 * @return
	 */
	public static String getConnOs(HttpServletRequest request) {
		String userAgent = MyFrameworkStringUtils.nullToString(request.getHeader("User-Agent"), "");
		return userAgent;
	}
	
	/**
	 * 紐⑤컮�씪�뿉�꽌 �젒�냽�뿬遺� 泥댄겕
	 * @param request
	 * @return
	 */
	public static boolean isCheckMobile(HttpServletRequest request) {
		String userAgent = MyFrameworkStringUtils.nullToString(request.getHeader("User-Agent"), "");
		return userAgent.indexOf("iPhone") != -1 || userAgent.indexOf("iPad") != -1 || userAgent.indexOf("iPod") != -1 || userAgent.indexOf("Android") != -1;
	}
	
}
