package com.admin.erd.column.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.admin.erd.entity.service.EntitySvc;
import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.MapHasList;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseGrid;

import lombok.extern.slf4j.Slf4j;

@Service("columnSvc")
@Slf4j
public class ColumnSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;

	public void erdColumnList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);

		myFrameworkResponseGrid.setData(list);
	}
	
	@Transactional
	public MyFrameworkResponseCud updateEntityNameByWord(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		// 로그ID조회
		String log_id = RandomStringUtils.random(10, true, true);
		sqlParamMap.put("LOG_ID", log_id);

		try {
			
			String [] colmn_ids= paramMap.getValues("COLMN_ID");
			
			
			String entity_id = null;
			for( int i=0; i<colmn_ids.length; i++ ) {

				sqlParamMap = new SqlParamMap<String, Object>();
				
				sqlParamMap.put("LOG_ID", log_id);
				
				sqlParamMap.put("PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
				sqlParamMap.put("VERSN", paramMap.get("SESSION_VERSN"));

				if( StringUtils.isEmpty(colmn_ids[i])) {
					// UID조회
					SqlResultMap<String, Object> entityUid = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
					String colmn_id = entityUid.getString("UID");
					sqlParamMap.put("COLMN_ID", colmn_id);
				} else {
					sqlParamMap.put("COLMN_ID", colmn_ids[i]);
				}
				if( i==0) {
					entity_id = paramMap.getValues("ENTITY_ID")[i];
				}
				
				sqlParamMap.put("ENTITY_ID", paramMap.getValues("ENTITY_ID")[i]);
				sqlParamMap.put("APLY_DT", paramMap.getValues("APLY_DT")[i]);
				sqlParamMap.put("APLY_USR_UID", paramMap.getValues("APLY_USR_UID")[i]);
				sqlParamMap.put("ATTR_NM", paramMap.getValues("ATTR_NM")[i]);
				sqlParamMap.put("COLMN_DESC", paramMap.getValues("COLMN_DESC")[i]);
				sqlParamMap.put("COLMN_NM", paramMap.getValues("COLMN_NM")[i]);
				sqlParamMap.put("COLMN_SCD", paramMap.getValues("COLMN_SCD")[i]);
				sqlParamMap.put("COLMN_SCD_NM", paramMap.getValues("COLMN_SCD_NM")[i]);
				sqlParamMap.put("DATA_TYPE", paramMap.getValues("DATA_TYPE")[i]);
				
				String dataType = paramMap.getValues("DATA_TYPE")[i];
				if( StringUtils.isEmpty(dataType)) {
					sqlParamMap.put("DTYPE", dataType);
					sqlParamMap.put("LEN1", null);
					sqlParamMap.put("LEN2", null);
				} else {
					if( dataType.indexOf("(") > 0 && dataType.indexOf(")") > 0 ) {
						String [] values = dataType.split("\\(");

						sqlParamMap.put("DTYPE", values[0]);
						if( StringUtils.isEmpty(values[1]) ) {
							sqlParamMap.put("LEN1", null);
							sqlParamMap.put("LEN2", null);
						} else {
							if( values[1].indexOf(",") > 0) {
								String [] lens = values[1].split(",");
								sqlParamMap.put("LEN1", lens[0].replaceAll("[^0-9]", ""));
								sqlParamMap.put("LEN2", lens[1].replaceAll("[^0-9]", ""));
							} else {
								sqlParamMap.put("LEN1", values[1].replaceAll("[^0-9]", ""));
								sqlParamMap.put("LEN2", null);
							}
						}
						
					} else {
						sqlParamMap.put("DTYPE", dataType);
						sqlParamMap.put("LEN1", null);
						sqlParamMap.put("LEN2", null);
					}
				}
				
				
				sqlParamMap.put("DML_DT", paramMap.getValues("DML_DT")[i]);
				sqlParamMap.put("DML_TCD", paramMap.getValues("DML_TCD")[i]);
				sqlParamMap.put("DML_TCD_NM", paramMap.getValues("DML_TCD_NM")[i]);
				sqlParamMap.put("DOMAIN_ID", paramMap.getValues("DOMAIN_ID")[i]);
				sqlParamMap.put("FK_COLMN_ID", paramMap.getValues("FK_COLMN_ID")[i]);
				sqlParamMap.put("FK_ENTITY_ID", paramMap.getValues("FK_ENTITY_ID")[i]);
				sqlParamMap.put("FK_ENTITY_NM", paramMap.getValues("FK_ENTITY_NM")[i]);
				sqlParamMap.put("ID", paramMap.getValues("ID")[i]);
				sqlParamMap.put("NOTNULL_YN", "true".equals(paramMap.getValues("NOTNULL_YN_BOOL")[i]) ? "Y" : "" );
				sqlParamMap.put("NUMB_MTH", paramMap.getValues("NUMB_MTH")[i]);
				sqlParamMap.put("COLOR", paramMap.getValues("COLOR")[i]);
				sqlParamMap.put("PK_YN", "true".equals(paramMap.getValues("PK_YN_BOOL")[i]) ? "Y" : "");
				sqlParamMap.put("SEQ", i);
				sqlParamMap.put("USE_YN", paramMap.getValues("USE_YN")[i]);
				sqlParamMap.put("TRT_DT", paramMap.getValues("TRT_DT")[i]);
				sqlParamMap.put("TRT_USR_UID", paramMap.getValues("TRT_USR_UID")[i]);
				sqlParamMap.put("UP_ENTITY_ID", paramMap.getValues("UP_ENTITY_ID")[i]);
				
				Integer result = sqlDao.update("mapper.erd.column.saveEntityColumn", sqlParamMap);

			}

			sqlParamMap = new SqlParamMap<String, Object>();
			sqlParamMap.put("LOG_ID", log_id);
			sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
			sqlParamMap.put("SESSION_USR_UID", paramMap.get("SESSION_USR_UID"));

			// 변경 로그 반영
			sqlDao.insert("mapper.erd.project.projectChgLog", sqlParamMap);

			
			sqlParamMap = new SqlParamMap();
			
			log_id = RandomStringUtils.random(10, true, true);
			sqlParamMap.put("LOG_ID", log_id);
			sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
			sqlParamMap.put("SESSION_VERSN", paramMap.get("SESSION_VERSN"));
			sqlParamMap.put("ENTITY_ID", entity_id);
			
			if( "ALL".equals(paramMap.get("TARGET"))) {
				sqlDao.insert("mapper.erd.entity.updateTableNameByWord", sqlParamMap);
			}
			
			Integer result =  sqlDao.insert("mapper.erd.column.updateColmnNameByWord", sqlParamMap);

			// 변경 로그 반영
			sqlDao.insert("mapper.erd.project.projectChgLog", sqlParamMap);

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
			
			myFrameworkResponseCud.setCudCount(result);
			myFrameworkResponseCud.setSuccess(true);
			myFrameworkResponseCud.setMessage("저장되었습니다.");
			
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			throw e;
		}
		return myFrameworkResponseCud;
	}


	/**
	 * 공통 컬럼 조회
	 * @param model
	 * @param paramMap
	 */
	public void commonColumnList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.column.selectCommonColumnList", sqlParamMap);

		myFrameworkResponseGrid.setData(list);
	}

	/**
	 * 공통컬럼 저장
	 * @param model
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public MyFrameworkResponseCud columnCommonColumnSave(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		// sqlParamMap.putAll(paramMap.getMap());

		Integer result = 0;
		try {
			
			String [] colmn_ids= paramMap.getValues("COLMN_ID");
			
			for( int i=0; i<colmn_ids.length; i++ ) {

				sqlParamMap = new SqlParamMap<String, Object>();

				
				sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
				sqlParamMap.put("SESSION_VERSN", paramMap.get("SESSION_VERSN"));

				if( StringUtils.isEmpty(colmn_ids[i])) {
					// UID조회
					SqlResultMap<String, Object> entityUid = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
					String colmn_id = entityUid.getString("UID");
					sqlParamMap.put("COLMN_ID", colmn_id);
				} else {
					sqlParamMap.put("COLMN_ID", colmn_ids[i]);
				}
				sqlParamMap.put("DOMAIN_ID", paramMap.getValues("DOMAIN_ID")[i]);
				sqlParamMap.put("COLMN_NM", paramMap.getValues("COLMN_NM")[i]);
				sqlParamMap.put("ATTR_NM", paramMap.getValues("ATTR_NM")[i]);

				sqlParamMap.put("USE_YN", paramMap.getValues("USE_YN")[i]);
				
				sqlParamMap.put("SEQ", i);
				
				result += sqlDao.update("mapper.erd.column.saveCommonColumn", sqlParamMap);
			}

			myFrameworkResponseCud.setCudCount(colmn_ids.length);
			myFrameworkResponseCud.setSuccess(true);
			myFrameworkResponseCud.setMessage("저장되었습니다.");

		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			
			throw e;
		}
		return myFrameworkResponseCud;
	}


	/**
	 * 공통컬럼 저장 및 테이블에 추가
	 * @param model
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public MyFrameworkResponseCud commonColumnSaveAndAddToAllTable(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		// sqlParamMap.putAll(paramMap.getMap());

		Integer result = 0;
		try {
			
			String [] colmn_ids= paramMap.getValues("COLMN_ID");
			
			for( int i=0; i<colmn_ids.length; i++ ) {

				sqlParamMap = new SqlParamMap<String, Object>();

				
				sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
				sqlParamMap.put("SESSION_VERSN", paramMap.get("SESSION_VERSN"));

				if( StringUtils.isEmpty(colmn_ids[i])) {
					// UID조회
					SqlResultMap<String, Object> entityUid = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
					String colmn_id = entityUid.getString("UID");
					sqlParamMap.put("COLMN_ID", colmn_id);
				} else {
					sqlParamMap.put("COLMN_ID", colmn_ids[i]);
				}
				sqlParamMap.put("DOMAIN_ID", paramMap.getValues("DOMAIN_ID")[i]);
				sqlParamMap.put("COLMN_NM", paramMap.getValues("COLMN_NM")[i]);
				sqlParamMap.put("ATTR_NM", paramMap.getValues("ATTR_NM")[i]);

				sqlParamMap.put("USE_YN", paramMap.getValues("USE_YN")[i]);
				
				sqlParamMap.put("SEQ", i);
				
				result += sqlDao.update("mapper.erd.column.saveCommonColumn", sqlParamMap);
			}
			
			// 공통컬럼에 해당하는 컬럼명이 있을 경우 COLUMN_ID UPDATE
			sqlDao.update("mapper.erd.column.updateCommonColumnToTable", sqlParamMap);
			
			// 공통컬럼에 해당하는 컬럼명이 있을 경우 COLUMN_ID INSERT
			sqlDao.update("mapper.erd.column.insertCommonColumnToTable", sqlParamMap);

			SqlResultList<SqlResultMap<String, Object>> entityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);
			SqlResultList<SqlResultMap<String, Object>> entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);
			
			Set<String> pkInsertEntityList = new HashSet<String>();
			
			for( SqlResultMap<String, Object> entity : entityList) {
				pkInsertEntityList.add(entity.getString("ENTITY_ID"));
			}
			myFrameworkResponseCud.put("ENTITY_LIST", entityList);
			myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
			myFrameworkResponseCud.put("PK_INSERT_ENTITY_LIST", pkInsertEntityList);
			myFrameworkResponseCud.setCudCount(colmn_ids.length);
			myFrameworkResponseCud.setSuccess(true);
			myFrameworkResponseCud.setMessage("저장되었습니다.");

		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			
			throw e;
		}
		return myFrameworkResponseCud;
	}
}
