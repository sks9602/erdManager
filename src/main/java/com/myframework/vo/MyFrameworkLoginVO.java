package com.myframework.vo;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@ToString
public class MyFrameworkLoginVO  implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6755460271407770593L;
	
	public final static String MY_FRAMEWORK_LOGIN_SESSION_KEY = "_sessionVO";
	public final static String MY_FRAMEWORK_USER_KEY_FOR_IP = "ssnUserKey";

}
