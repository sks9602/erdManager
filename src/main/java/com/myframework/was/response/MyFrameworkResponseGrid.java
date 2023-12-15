package com.myframework.was.response;

import org.springframework.ui.ModelMap;

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
public class MyFrameworkResponseGrid {

	private ModelMap modelMap;

	@Builder.Default
	private Boolean success = true;
	
	@Builder.Default
	private String code = "0";
	
	@Builder.Default
	private Integer totalCount = 0;
	
	private String errorMessage;

	SqlResultList<SqlResultMap<String, Object>> data;
	
	public void setData(SqlResultList<SqlResultMap<String, Object>> datas) {
		modelMap.addAttribute("data", datas);
		if( datas.size()>0) {
			modelMap.addAttribute("recordsTotal",  datas.get(0).get("TOTAL_COUNT"));
			modelMap.addAttribute("recordsFiltered",   datas.get(0).get("TOTAL_COUNT")); 
		} else {
			modelMap.addAttribute("recordsTotal", 0);
			modelMap.addAttribute("recordsFiltered",  0); 
		}
	}

}
