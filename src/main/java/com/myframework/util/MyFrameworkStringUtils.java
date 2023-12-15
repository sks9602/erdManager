package com.myframework.util;

public class MyFrameworkStringUtils {

	/**
	 * 
	 * @param val
	 * @param replaceVal
	 * @return
	 */
	public static String nullToString(String val, String replaceVal) {
		if(val == null) {
			return replaceVal;
		} else {
			return val;
		}
	}
	
	/**
	 * 
	 * @param val
	 * @param replaceVal
	 * @return
	 */
	public static String emptyToString(String val, String replaceVal) {
		if(val == null || "".equals(val)) {
			return replaceVal;
		} else {
			return val;
		}
	}
	
	public static String toProperCase(String s, boolean isCapital) {

		String rtnValue = "";

		if(isCapital){
			rtnValue = s.substring(0, 1).toUpperCase() +
					s.substring(1).toLowerCase();
		}else{
			rtnValue = s.toLowerCase();
		}
		return rtnValue;
	}

	public static String toSnakeCase(String s) {
		String result = "";

		char c = s.charAt(0);
		result = result + Character.toLowerCase(c);
		for (int i = 1; i < s.length(); i++) {
  
			char ch = s.charAt(i);
			if (Character.isUpperCase(ch)) {
				result = result + '_';
				result = result + Character.toLowerCase(ch);
			}
			else {
				result = result + ch;
			}
		}
		return result;
	}
	
	/**
	 * snake_case를  camelCase로
	 * @param s
	 * @return
	 */
	public static String toCamelCase(String s){
		String[] parts = s.split("_");
		StringBuilder camelCaseString = new StringBuilder();

		for (int i = 0; i < parts.length ; i++) {
			String part = parts[i];
			camelCaseString.append(MyFrameworkStringUtils.toProperCase(part, (i != 0 ? true : false))) ;
		}

		return camelCaseString.toString();
	}
	
	   /**
	 * snake_case를  PascalCase로
	 * @param s
	 * @return
	 */
	public static String toPascalCase(String s) {
		String[] parts = s.split("_");
		StringBuilder pascalCaseString = new StringBuilder();

		for (int i = 0; i < parts.length ; i++) {
			String part = parts[i];
			if( "T".equalsIgnoreCase(part) ||  "V".equalsIgnoreCase(part)) {
				continue;
			}
			pascalCaseString.append(MyFrameworkStringUtils.toProperCase(part, true)) ;
		}

		return pascalCaseString.toString();
	}

	public static boolean isEmpty(String val) {
		if(val == null || "".equals(val)) {
			return true;
		} else {
			return false;
		}
	}
}
