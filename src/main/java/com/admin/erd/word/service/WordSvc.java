package com.admin.erd.word.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

@Service("wordSvc")
@Slf4j
public class WordSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;
	
	public MyFrameworkResponseData wordDetail(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseData myFrameworkResponseData = MyFrameworkResponseData.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		
		String [] values = paramMap.get("VALUE").split("( |_)");
		
		List<String> words = new ArrayList<String>();
		List<String> columns = new ArrayList<String>();
		for( String value : values ) {
			String word = value.replaceAll("[0-9]*", "");
			
			if( word.length() != value.length()) {
				
				StringBuilder sb = new StringBuilder();
				
				boolean isChar = false, isNum = false;
				for( int i=0;i<value.length(); i++ ) {
					if( ((int)value.charAt(i)) >= 48 && ((int)value.charAt(i)) <= 57) {
						if( isChar == true) {
							columns.add("@"+sb.toString());
							sb.setLength(0);
						}
						isChar = false;
						isNum = true;
						sb.append(value.charAt(i));
					} else {
						if( isNum == true) {
							columns.add("@"+sb.toString());
							sb.setLength(0);
						}
						isChar = true;
						isNum = false;
						
						sb.append(value.charAt(i));
					}
				}
				if( isNum == true) {
					columns.add("@"+sb.toString());
				} else {
					columns.add(sb.toString());
				}
			} else {
				columns.add(value);
			}
			
			words.add(value.replaceAll("[0-9]*", ""));
		}
		sqlParamMap.putAll(paramMap.getMap());
		sqlParamMap.put("WORDS", words );
		sqlParamMap.put("VALUES", columns );
		
		sqlDao.select("mapper.erd.word.insertWord", sqlParamMap);

		SqlResultMap<String, Object> detail = sqlDao.select("mapper.erd.word.selectWordDetail", sqlParamMap);

		myFrameworkResponseData.put("detail", detail);
		
		return myFrameworkResponseData;
	}
	
	public MyFrameworkResponseGrid wordList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		if(StringUtils.isNotEmpty(paramMap.get("WORDS"))) {
			sqlParamMap.put("WORD", paramMap.get("WORDS").split(";"));
		}
		
		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.word.selectWordList", sqlParamMap);
		
		myFrameworkResponseGrid.setData(list);
		
		return myFrameworkResponseGrid;
	}
	
	@Transactional
	public MyFrameworkResponseCud wordSave(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();

		// 로그ID조회
		String log_id = RandomStringUtils.random(10, true, true);

		try {
			String [] wordIds= paramMap.getValues("WORD_ID");
			
			Integer result = 0;
			for( int i=0;wordIds!=null && i<wordIds.length; i++) {
				sqlParamMap = new SqlParamMap<String, Object>();
				
				sqlParamMap.put("LOG_ID", log_id);
				
				sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
				sqlParamMap.put("WORD_ID", wordIds[i]);
				sqlParamMap.put("WORD", paramMap.getValues("WORD")[i]);
				sqlParamMap.put("ABBR", paramMap.getValues("ABBR")[i]);
				sqlParamMap.put("ENGLISH", paramMap.getValues("ENGLISH")[i]);
				sqlParamMap.put("WORD_DESC", paramMap.getValues("WORD_DESC")[i]);
				if( "N".equals(paramMap.getValues("USE_YN")[i])) {
					result +=  sqlDao.insert("mapper.erd.word.deleteWord", sqlParamMap);
				} else {
					if( StringUtils.isEmpty(wordIds[i]) ) {
						result +=  sqlDao.insert("mapper.erd.word.insertNewWord", sqlParamMap);
					} else {
						result +=  sqlDao.insert("mapper.erd.word.updateWord", sqlParamMap);
					}
				}
			}
			
			
			if("COLUMN".equals(paramMap.get("WORD_TARGET")) ||  "ALL".equals(paramMap.get("WORD_TARGET"))) {
				sqlParamMap = new SqlParamMap<String, Object>();
				sqlParamMap.put("LOG_ID", log_id);

				sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
				sqlParamMap.put("SESSION_VERSN", paramMap.get("SESSION_VERSN"));
				
				if( "COLUMN".equals(paramMap.get("WORD_TARGET"))) {
					sqlDao.insert("mapper.erd.column.updateColmnNameByWord", sqlParamMap);				
				} else if( "ALL".equals(paramMap.get("WORD_TARGET"))) {
					sqlDao.insert("mapper.erd.entity.updateTableNameByWord", sqlParamMap);
					sqlDao.insert("mapper.erd.column.updateColmnNameByWord", sqlParamMap);
				} 
				
				SqlResultList<SqlResultMap<String, Object>> entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);

				SqlResultList<SqlResultMap<String, Object>> subjectEntityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

				SqlResultList<SqlResultMap<String, Object>> entityList = sqlDao.selectList("mapper.erd.entity.selectEntityList", sqlParamMap);

				Set<String> pkInsertEntityList = new HashSet<String>();
				Set<String> pkDeleteEntityList = new HashSet<String>();
				
				for( SqlResultMap<String, Object> entity : entityList) {
					pkInsertEntityList.add(entity.getString("ENTITY_ID"));
				}
				
				myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
				myFrameworkResponseCud.put("PK_INSERT_ENTITY_LIST", pkInsertEntityList);
				myFrameworkResponseCud.put("PK_DELETE_ENTITY_LIST", pkDeleteEntityList);
				myFrameworkResponseCud.put("ENTITY_LIST", subjectEntityList);
			}

			sqlParamMap = new SqlParamMap<String, Object>();
			sqlParamMap.put("LOG_ID", log_id);

			// 변경 로그 반영
			sqlDao.insert("mapper.erd.project.projectChgLog", sqlParamMap);

			if( result >= 0 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
			} else {
				myFrameworkResponseCud.setSuccess(false);
				myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
				
				throw new Exception("저장시 오류가 발생했습니다.");
			}
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			throw e;
		}
		return myFrameworkResponseCud;
	}
}
