package com.admin.erd.sequence.service;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseData;
import com.myframework.was.response.MyFrameworkResponseGrid;

import lombok.extern.slf4j.Slf4j;

@Service("sequenceSvc")
@Slf4j
public class SequenceSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;
	
	
	public void sequenceList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		if(StringUtils.isNotEmpty(paramMap.get("SEQNC_NMS"))) {
			sqlParamMap.put("SEQNC_NM", paramMap.get("SEQNC_NMS").split(";"));
		}
		
		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.sequence.selectSequenceList", sqlParamMap);
	
		myFrameworkResponseGrid.setData(list);
	
	}
	
	
	@Transactional
	public MyFrameworkResponseCud sequenceSave(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			// 로그ID조회
			String log_id = RandomStringUtils.random(10, true, true);

			String sequence_id = paramMap.get("SEQNC_ID");
			sqlParamMap.put("LOG_ID", log_id);
			
			if( StringUtils.isEmpty(sequence_id)) {
				// UID조회
				SqlResultMap<String, Object> entityUid = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
				sequence_id = entityUid.getString("UID");
				sqlParamMap.put("SEQNC_ID", sequence_id);
			}
			Integer result = sqlDao.insert("mapper.erd.sequence.saveSequence", sqlParamMap);
	
			// 변경 로그 반영
			sqlDao.insert("mapper.erd.project.projectChgLog", sqlParamMap);

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

	public MyFrameworkResponseData sequenceDetail(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseData myFrameworkResponseData = MyFrameworkResponseData.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultMap<String, Object> detail = sqlDao.select("mapper.erd.sequence.selectSequenceDetail", sqlParamMap);
		
		myFrameworkResponseData.put("detail", detail);
		myFrameworkResponseData.put("totalCount", 0);
		
		return myFrameworkResponseData;
	}
	
	@Transactional
	public MyFrameworkResponseCud sequenceSaveUseYn(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		// sqlParamMap.putAll(paramMap.getMap());
		try {
			
			String [] seqnc_ids= paramMap.getValues("SEQNC_ID");
	
			String log_id = RandomStringUtils.random(10, true, true);
			
			String entity_id = null;
			for( int i=0; i<seqnc_ids.length; i++ ) {
				
				sqlParamMap = new SqlParamMap<String, Object>();
				
				sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
				sqlParamMap.put("SESSION_VERSN", paramMap.get("SESSION_VERSN"));

				sqlParamMap.put("LOG_ID", log_id);
				sqlParamMap.put("SEQNC_ID", seqnc_ids[i]);
				sqlParamMap.put("USE_YN", paramMap.getValues("USE_YN")[i]);

				Integer result = sqlDao.update("mapper.erd.sequence.updateSequenceUseYn", sqlParamMap);

				myFrameworkResponseCud.setCudCount(seqnc_ids.length);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");

			}
			
			sqlParamMap = new SqlParamMap<String, Object>();
			sqlParamMap.put("LOG_ID", log_id);
			// 변경 로그 반영
			sqlDao.insert("mapper.erd.project.projectChgLog", sqlParamMap);

		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			
			throw e;
		}
		return myFrameworkResponseCud;
	}	
}
