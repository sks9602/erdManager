package com.admin.erd.datatype.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import com.admin.erd.domain.service.DomainSvc;
import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.ListToTree;
import com.myframework.was.param.RequestParamMap;

import lombok.extern.slf4j.Slf4j;

@Service("dataTypeSvc")
@Slf4j
public class DataTypeSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;

	public void dataTypeList(ModelMap model, RequestParamMap paramMap) {
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.dataType.selectDataTypeList", sqlParamMap);

		model.addAttribute("dataList", list);
	}

	public void datatypeTree(ModelMap model, RequestParamMap paramMap) {

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.dataType.selectDataTypeTree", sqlParamMap);

		ListToTree listToTree = new ListToTree();
		log.info(listToTree.toTreeJson("TOP", "UP_DTYPE", list).toString());
		model.addAttribute("treeList", listToTree.toTreeJson("TOP", "UP_DTYPE", list));

	}

}
