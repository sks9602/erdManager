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
public class MyFrameworkResponseCud  {
	private ModelMap modelMap;
	
	@Builder.Default
	private Boolean success = true;
	
	@Builder.Default
	private String code = "0";
	
	private String errorMessage;
	
	@Builder.Default
	private Integer cudCount = 0;

	public void setSuccess(Boolean success) {
		modelMap.addAttribute("success", success);
	}

	public void setCudCount(Integer cudCount) {
		modelMap.addAttribute("cudCount", cudCount);
	}

	public void setMessage(String message) {
		modelMap.addAttribute("message", message);
	}

	public void setErrorMessage(String message) {
		modelMap.addAttribute("errorMessage", message);
	}

	public void put(String key, Object value) {		
		modelMap.addAttribute(key, value);
	}
	
	public Object get(String key) {
		return modelMap.getAttribute(key);
				
	}
}
