package com.myframework.util;

import java.security.MessageDigest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.RandomStringUtils;

public class StringUtil {

	public static String nvl(String val, String newVal) {
		if( StringUtils.isEmpty(val) ) {
			return newVal;
		} else {
			return val;
		}
	}
	
	public static String tagAttr(String tag, String val) {
		StringBuilder sb = new StringBuilder();
		
		if( !StringUtils.isEmpty(val) ) {
			sb.append( tag ).append(" : ").append("\"").append(val).append("\"").append(",");
		}
		
		return sb.toString();
	}
	
	public static String tagAttrInt(String tag, String val) {
		StringBuilder sb = new StringBuilder();
		
		if( !StringUtils.isEmpty(val) ) {
			sb.append( tag ).append(" : ").append(val).append(",");
		}
		
		return sb.toString();
	}


	public static String getRandomAlphanumeric() {
		 
	    int length = 10;
	    boolean useLetters = true;
	    boolean useNumbers = true;
	    String generatedString = RandomStringUtils.random(length, useLetters, useNumbers);

	    return generatedString;
	}
	
    public static String encSHA256(String pwd) { 
		try{ 
			MessageDigest digest = MessageDigest.getInstance("SHA-256"); 
	        
			byte[] hash = digest.digest(pwd.getBytes("UTF-8")); 
			StringBuffer hexString = new StringBuffer(); 
			for (int i = 0; i < hash.length; i++) { 
				String hex = Integer.toHexString(0xff & hash[i]); 
				if(hex.length() == 1) {
					hexString.append('0'); 
				}
				hexString.append(hex); 
			}
			return hexString.toString(); 
		} catch(Exception ex){ 
			throw new RuntimeException(ex); 
		} 
    } 
}
