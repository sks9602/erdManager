package com.myframework.was.response;

import java.util.HashMap;

import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@Builder
public class MyFrameworkResponse {

	@Builder.Default
	private Boolean success = true;
	
	@Builder.Default
	private String code = "0";
	
	private String errorMessage;

	@Builder.Default
	private Integer totalCount = 0;
	
	@Builder.Default
	private Integer cudCount = 0;
	
	@Builder.Default
	private SqlResultList<SqlResultMap<String, Object>> datas = null;

	@Builder.Default
	private SqlResultMap<String, Object> data = null;
	
	@Builder.Default
	private HashMap<String, Object> result = new HashMap<String, Object>();
	
	public void put(String key, Object value) {		
		result.put(key, value);
	}
	
}
