package com.myframework.was.response;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.ui.ModelMap;

import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.MapHasList;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Setter
@Getter
@ToString
@Builder
@Slf4j
public class MyFrameworkResponseTree {
	private ModelMap modelMap;

	@Builder.Default
	private Boolean success = true;
	
	@Builder.Default
	private String code = "0";
	
	private String errorMessage;

	JSONArray data;

	public void setData(JSONArray datas) {
		modelMap.addAttribute("data", datas);
	}
}
