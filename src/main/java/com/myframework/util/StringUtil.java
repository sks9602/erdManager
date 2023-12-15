package com.myframework.util;

import org.apache.commons.lang.StringUtils;

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
}
