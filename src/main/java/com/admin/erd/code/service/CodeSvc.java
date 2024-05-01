package com.admin.erd.code.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseGrid;

import io.micrometer.core.instrument.util.StringUtils;
import lombok.extern.slf4j.Slf4j;

@Service("codeSvc")
@Slf4j
public class CodeSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;
	
	public void codeProjectList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = null;
		
		// index의 코드 반영 대상.
		if( StringUtils.isNotEmpty(paramMap.get("GBN_CD")) &&  "INDEX_ID".equals(paramMap.get("GBN_CD"))) {
			list = sqlDao.selectList("com.dao.system.CodeDao.selectIndexCodeProjectList", sqlParamMap);
		}
		// 프로젝의 코드 반영 대상
		else {
			list = sqlDao.selectList("com.dao.system.CodeDao.selectCodeProjectList", sqlParamMap);
		}
		myFrameworkResponseGrid.setData(list);
	}
}
