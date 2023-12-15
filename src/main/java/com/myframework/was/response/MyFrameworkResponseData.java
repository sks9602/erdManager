package com.myframework.was.response;

import org.springframework.ui.ModelMap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@ToString
@SuperBuilder
@AllArgsConstructor 
public class MyFrameworkResponseData {

	private ModelMap modelMap;
	
	@Builder.Default
	private Boolean success = true;
	
	@Builder.Default
	private String code = "0";
	
	private String errorMessage;
	
	public void put(String key, Object value) {		
		modelMap.addAttribute(key, value);
	}
	
}
