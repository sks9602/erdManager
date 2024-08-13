package com.admin.erd.subject.service;

import org.apache.commons.lang3.StringUtils;
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
import com.myframework.was.response.MyFrameworkResponseGrid;

import lombok.extern.slf4j.Slf4j;

@Service("subjectSvc")
@Slf4j
public class SubjectSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;
	
	public void subjectTree(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		if(StringUtils.isNotEmpty(paramMap.get("ENTITY_NMS"))) {
			sqlParamMap.put("ENTITY_NM", paramMap.get("ENTITY_NMS").split(";"));
		}

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.subject.selectSubjectTree", sqlParamMap);

		ListToTree listToTree = new ListToTree();
		model.addAttribute("treeList", listToTree.toTreeJson("TOP", "UP_SUBJECT_ID", list));
	}
	
	public void subjectList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.subject.selectSubjectList", sqlParamMap);
	
		myFrameworkResponseGrid.setData(list);
	
	}
	
	
	public void erdSubjectEntityList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);
	
		myFrameworkResponseGrid.setData(list);
	
	}
	
	@Transactional
	public MyFrameworkResponseCud subjectSave(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			if( StringUtils.isEmpty(paramMap.get("SUBJECT_ID"))) {
				SqlResultMap<String, Object> subjectUid = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
				String subject_id = subjectUid.getString("UID");
				sqlParamMap.put("SUBJECT_ID", "S" + subject_id);
				
			}
			Integer result = sqlDao.insert("mapper.erd.subject.saveSubject", sqlParamMap);
	
			log.info(" subjectSave : " + result);
			
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
	public MyFrameworkResponseCud subjectDelete(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			Integer result = sqlDao.insert("mapper.erd.subject.deleteSubject", sqlParamMap);
			sqlDao.insert("mapper.erd.subject.deleteSubjectRelation", sqlParamMap);
			sqlDao.insert("mapper.erd.subject.deleteSubjectFavor", sqlParamMap);
	
			log.info(" subjectSave : " + result);
			
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
	
	public MyFrameworkResponseData projectDetail(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseData myFrameworkResponseData = MyFrameworkResponseData.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultMap<String, Object> detail = sqlDao.select("mapper.erd.subject.selectSubjectDetail", sqlParamMap);
		
		if( detail == null || StringUtils.isEmpty(detail.getString("SUBJECT_ID"))) {
			detail = new SqlResultMap<String, Object>();
			
			detail.put("WIDTH", "2500");
			detail.put("HEIGHT", "2500");
		}
		
		myFrameworkResponseData.put("detail", detail);
		myFrameworkResponseData.put("totalCount", 0);
		
		return myFrameworkResponseData;
	}

	@Transactional
	public MyFrameworkResponseCud subjectSubjectStartEditInfo(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			SqlResultMap<String, Object> detail = sqlDao.select("mapper.erd.subject.selectSubjectEditInfo", sqlParamMap);
			
			Integer result = 1;
			if( "Y".equals(paramMap.get("EDIT_START_YN"))) {
				result = sqlDao.insert("mapper.erd.subject.updateStartEditInfo", sqlParamMap);
			} 
			
			myFrameworkResponseCud.put("data", detail);
			
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
	public MyFrameworkResponseCud subjectEndEditInfo(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {

			Integer result = sqlDao.insert("mapper.erd.subject.updateEndEditInfo", sqlParamMap);

			SqlResultMap<String, Object> detail = sqlDao.select("mapper.erd.subject.selectSubjectEditInfo", sqlParamMap);

			myFrameworkResponseCud.put("data", detail);

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

	/**
	 * 테이블 즐겨찾기 처리
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@Transactional
	public MyFrameworkResponseCud saveFavorite(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			int result = 0;
			// 즐겨찾기 등록
			if( "Y".equals(paramMap.get("FAVOR_YN"))) {
				result = sqlDao.insert("mapper.erd.subject.addSubjectFavorite", sqlParamMap);
			} 
			// 즐겨찾기 삭제
			else {
				result = sqlDao.insert("mapper.erd.subject.deleteSubjectFavorite", sqlParamMap);
			}
			
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

	/**
	 * DISPLAY 형태 변경
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@Transactional
	public MyFrameworkResponseCud updateErdSubjectEntityDisplayCode(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			log.info( paramMap.toString() );
			sqlParamMap.put("ENTITY_IDS", paramMap.getValues("ENTITY_IDS"));
			Integer result = sqlDao.insert("mapper.erd.subject.updateErdSubjectEntityDisplayCode", sqlParamMap);
			
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
}
