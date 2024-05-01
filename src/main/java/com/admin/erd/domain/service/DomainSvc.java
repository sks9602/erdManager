package com.admin.erd.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.ListToTree;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;

import lombok.extern.slf4j.Slf4j;

@Service("domainSvc")
@Slf4j
public class DomainSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;
	
	public void domainTree(ModelMap model, RequestParamMap paramMap) {

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.domain.selectDomainTree", sqlParamMap);

		ListToTree listToTree = new ListToTree();
		model.addAttribute("treeList", listToTree.toTreeJson("TOP", "UP_DOMAIN_ID", list));

	}

	public MyFrameworkResponseData damainDetail(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseData myFrameworkResponseData = MyFrameworkResponseData.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultMap<String, Object> detail = sqlDao.select("mapper.erd.domain.selectDomainDetail", sqlParamMap);

		myFrameworkResponseData.put("detail", detail);
		
		return myFrameworkResponseData;
	}

	public MyFrameworkResponseData damainDetailForAdd(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseData myFrameworkResponseData = MyFrameworkResponseData.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultMap<String, Object> detail = sqlDao.select("mapper.erd.domain.selectDomainDetailForAdd", sqlParamMap);

		myFrameworkResponseData.put("detail", detail);
		
		return myFrameworkResponseData;
	}
	
	@Transactional
	public MyFrameworkResponseCud domainSave(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			Integer result = sqlDao.insert("mapper.erd.domain.saveDomain", sqlParamMap);
	
			log.info(" domainSave : " + result);
			
			if( result == 1 || result == 2 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
			} else {
				myFrameworkResponseCud.setSuccess(false);
				myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			}
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
		}
		return myFrameworkResponseCud;
	}
	
	@Transactional
	public MyFrameworkResponseCud damainDelete(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			Integer result = sqlDao.insert("mapper.erd.domain.deleteDomain", sqlParamMap);
	
			log.info(" damainDelete : " + result);
			
			if( result == 1 || result == 2 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("삭제되었습니다.");
			} else {
				myFrameworkResponseCud.setSuccess(false);
				myFrameworkResponseCud.setErrorMessage("삭제시 오류가 발생했습니다.");
			}
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("삭제시 오류가 발생했습니다.");
		}
		return myFrameworkResponseCud;
	}
}
