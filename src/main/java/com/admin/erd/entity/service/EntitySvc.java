package com.admin.erd.entity.service;

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

import com.admin.erd.relation.service.RelationSvc;
import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.ListToTree;
import com.myframework.util.MapHasList;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseGrid;

import lombok.extern.slf4j.Slf4j;

@Service("entitySvc")
@Slf4j
public class EntitySvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;

	@Resource(name = "relationSvc")
	private RelationSvc relationSvc;

	public void erdEntityList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.entity.selectErdEntityList", sqlParamMap);
	
		myFrameworkResponseGrid.setData(list);
	
	}
	
	public void entityList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		
		if(StringUtils.isNotEmpty(paramMap.get("ENTITY_NMS"))) {
			sqlParamMap.put("ENTITY_NM", paramMap.get("ENTITY_NMS").split(";"));
		}
		
		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.entity.selectEntityList", sqlParamMap);
		
		myFrameworkResponseGrid.setData(list);
	}
	
	public void entityColumnTree(ModelMap model, RequestParamMap paramMap) {

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		if(StringUtils.isNotEmpty(paramMap.get("ENTITY_NMS"))) {
			sqlParamMap.put("ENTITY_NM", paramMap.get("ENTITY_NMS").split(";"));
		}
		if(StringUtils.isNotEmpty(paramMap.get("COLUMN_NMS"))) {
			sqlParamMap.put("COLUMN_NM", paramMap.get("COLUMN_NMS").split(";"));
		}

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.entity.selectEntityColumnTree", sqlParamMap);

		ListToTree listToTree = new ListToTree();
		model.addAttribute("treeList", listToTree.toTreeJson("TOP", "UP_ENTITY_ID", list));
	}
	
	
	
	public void columnList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		
		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.entity.selectColumnList", sqlParamMap);
		
		myFrameworkResponseGrid.setData(list);
	}

	public void entityColumList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		if(StringUtils.isNotEmpty(paramMap.get("ENTITY_NMS"))) {
			sqlParamMap.put("ENTITY_NM", paramMap.get("ENTITY_NMS").split(";"));
		}
		if(StringUtils.isNotEmpty(paramMap.get("COLUMN_NMS"))) {
			sqlParamMap.put("COLUMN_NM", paramMap.get("COLUMN_NMS").split(";"));
		}
		
		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.entity.selectEntityColumList", sqlParamMap);
		
		myFrameworkResponseGrid.setData(list);
	}
	
	public void detail(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> entityInfo = sqlDao.selectList("mapper.erd.entity.selectEntityInfo", sqlParamMap);
		
		myFrameworkResponseGrid.setData(entityInfo);
	}
	
	@Transactional
	public MyFrameworkResponseCud entitySave(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			String entity_id = paramMap.get("ENTITY_ID");
			log.info( paramMap.toString() );
			
			// 로그ID조회
			String log_id = RandomStringUtils.random(10, true, true);
			sqlParamMap.put("LOG_ID", log_id);
			
			log.info( "entity_id : " + entity_id );
			log.info( "entity_id : " + StringUtils.isEmpty(entity_id) );
			if( StringUtils.isEmpty(entity_id)) {
				// UID조회
				SqlResultMap<String, Object> entityUid = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
				entity_id = entityUid.getString("UID");
				sqlParamMap.put("ENTITY_ID", entity_id);
			}
			log.info( sqlParamMap.toString() );
			
			Integer result = sqlDao.insert("mapper.erd.entity.saveEntity", sqlParamMap);
	
			SqlResultMap<String, Object> entityInfo = sqlDao.select("mapper.erd.entity.selectEntityInfo", sqlParamMap);

			sqlDao.insert("mapper.erd.entity.saveSubjectEntity", sqlParamMap);

			List<String> entityList = new ArrayList<String>();

			entityList.add(entity_id);
			
			sqlParamMap.put("ENTITY_LIST", entityList);
			SqlResultList<SqlResultMap<String, Object>> subjectEntityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			// 변경 로그 반영
			sqlDao.insert("mapper.erd.project.projectChgLog", sqlParamMap);
			
			if( result == 1 || result == 2 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
				myFrameworkResponseCud.put("ENTITY_ID", entity_id);
				myFrameworkResponseCud.put("ENTITY", entityInfo);
				myFrameworkResponseCud.put("ENTITY_LIST", subjectEntityList);
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
	public MyFrameworkResponseCud entityDelete(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			String entity_id = paramMap.get("ENTITY_ID");
			
			// 전체삭제 
			String all_delete_yn = paramMap.get("ALL_YN");

			
			String subjectEntityDeleteYn  = "N";
			sqlParamMap.put("USE_YN", "N");
			if( "Y".equals(all_delete_yn)) {
				// entity 미사용처리
				sqlDao.insert("mapper.erd.entity.updateEntityUseYn", sqlParamMap);

				// 관계 미사용처리
				sqlDao.insert("mapper.erd.entity.deleteSubjectRelationOfEntity", sqlParamMap);
				// 관계 미사용처리
				sqlDao.insert("mapper.erd.entity.deleteRelationOfEntity", sqlParamMap);
				
				// FK 컬럼 미사용처리..
				sqlDao.insert("mapper.erd.entity.updateFKColumnUseYn", sqlParamMap);
			} else {
				
				subjectEntityDeleteYn = "Y";
				//  SUBJECT영역 관계선 미사용 처리.
				sqlDao.update("mapper.erd.entity.updateSubjectRelationOfEntityUseYn", sqlParamMap);
			}
			
			// 업무영역 entity삭제
			Integer result = sqlDao.insert("mapper.erd.entity.updateSubjectEntityUseYn", sqlParamMap);
			// 업무영역 관계 삭제  TABL_SCD_070 
			if( "TABL_SCD_040".equals(paramMap.get("TABL_SCD")) ||  "TABL_SCD_050".equals(paramMap.get("TABL_SCD"))
				|| "TABL_SCD_060".equals(paramMap.get("TABL_SCD"))|| "TABL_SCD_070".equals(paramMap.get("TABL_SCD"))) {
					sqlDao.insert("mapper.erd.entity.updateSubjectRelationOfEntityUseYn", sqlParamMap);
			}
			// RELATION에 따라 변경되는 테이블 목록
			Set<String> pkEntitySet = new HashSet<String>();
			
			List<String> pkEntityList = new ArrayList<String>();

			List<SqlResultMap<String, Object>> entityHaveFKColumnList = sqlDao.selectList("mapper.erd.entity.selectEntityHaveFKColumn", sqlParamMap);

			// entity를 기준으로 시작 relation조회.
			List<SqlResultMap<String, Object>> relationListByStartEntity = sqlDao.selectList("mapper.erd.relation.selectRelationListByStartEntity", sqlParamMap); 

			Set<String> pkInsertEntityList = new HashSet<String>();
			Set<String> pkDeleteEntityList = new HashSet<String>();
			pkDeleteEntityList.add(entity_id);

			// 다시 조회.	
			SqlResultList<SqlResultMap<String, Object>> entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);

			for(SqlResultMap<String, Object> entityHaveFKColumn :  entityHaveFKColumnList) {
				pkDeleteEntityList.add(entityHaveFKColumn.getString("ENTITY_ID"));
			}
			
			pkEntitySet.addAll(pkInsertEntityList);
			pkEntitySet.addAll(pkDeleteEntityList);

			pkEntityList.addAll(pkEntitySet);
			sqlParamMap.put("ENTITY_LIST", pkEntityList);

			SqlResultList<SqlResultMap<String, Object>> entityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			if( "Y".equals(all_delete_yn)) {
	
				for( SqlResultMap<String, Object> relation : relationListByStartEntity ) {
					
					paramMap.put("RELATION_ID", relation.getString("RELATION_ID"));
					MyFrameworkResponseCud relationDelete = relationSvc.relationDelete(model, paramMap);
					
					pkInsertEntityList.addAll((HashSet<String>)relationDelete.get("PK_INSERT_ENTITY_LIST"));
					pkDeleteEntityList.addAll((HashSet<String>)relationDelete.get("PK_DELETE_ENTITY_LIST"));
					
					entityList.addAll((SqlResultList<SqlResultMap<String, Object>>)relationDelete.get("ENTITY_LIST"));
					entityColumnList.addAll((SqlResultList<SqlResultMap<String, Object>>)relationDelete.get("ENTITY_COLUMN_LIST"));
				}
			}
			if( result > 0 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("삭제되었습니다.");
				myFrameworkResponseCud.put("ENTITY_ID", entity_id);

				myFrameworkResponseCud.put("PK_INSERT_ENTITY_LIST", pkInsertEntityList);
				myFrameworkResponseCud.put("PK_DELETE_ENTITY_LIST", pkDeleteEntityList);
				myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
				myFrameworkResponseCud.put("ENTITY_LIST", entityList);
				
				myFrameworkResponseCud.put("SUBJECT_ENTITY_DELETE_YN", subjectEntityDeleteYn);

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
	
	@Transactional
	public MyFrameworkResponseCud updateAttr(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			Integer result = sqlDao.insert("mapper.erd.entity.saveSubjectEntity", sqlParamMap);
			
			sqlDao.insert("mapper.erd.entity.updateEntityWidthHeight", sqlParamMap);
				
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
	public MyFrameworkResponseCud entityUpdateScd(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			String entity_id = paramMap.get("ENTITY_ID");
			
			// 로그ID조회
			String log_id = RandomStringUtils.random(10, true, true);
			sqlParamMap.put("LOG_ID", log_id);
			
			Integer result = sqlDao.update("mapper.erd.entity.updateEntityScd", sqlParamMap);
			
			SqlResultMap<String, Object> entityInfo = sqlDao.select("mapper.erd.entity.selectEntityInfo", sqlParamMap);

			List<String> pkEntityList = new ArrayList<String>();

			pkEntityList.add(entity_id);
			
			sqlParamMap.put("ENTITY_LIST", pkEntityList);
			SqlResultList<SqlResultMap<String, Object>> subjectEntityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			Set<String> pkInsertEntityList = new HashSet<String>();
			Set<String> pkDeleteEntityList = new HashSet<String>();
			pkInsertEntityList.add(entity_id);

			// RELATION에 따라 변경되는 테이블 목록
			Set<String> pkEntitySet = new HashSet<String>();
			
			List<SqlResultMap<String, Object>> entityHaveFKColumnList = sqlDao.selectList("mapper.erd.entity.selectEntityHaveFKColumn", sqlParamMap);
			
			
			for(SqlResultMap<String, Object> entityHaveFKColumn :  entityHaveFKColumnList) {
				pkInsertEntityList.add(entityHaveFKColumn.getString("ENTITY_ID"));
			}
			pkEntitySet.addAll(pkInsertEntityList);
			pkEntitySet.addAll(pkDeleteEntityList);
			
			pkEntityList.addAll(pkEntitySet);
			sqlParamMap.put("ENTITY_LIST", pkEntityList);
			// 다시 조회.	
			SqlResultList<SqlResultMap<String, Object>> entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);

			SqlResultList<SqlResultMap<String, Object>> entityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			// 변경 로그 반영
			sqlDao.insert("mapper.erd.project.projectChgLog", sqlParamMap);
			
			if( result == 1 || result == 2 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
				myFrameworkResponseCud.put("ENTITY", entityInfo);
				myFrameworkResponseCud.put("ENTITY_LIST", subjectEntityList);

				myFrameworkResponseCud.put("PK_INSERT_ENTITY_LIST", pkInsertEntityList);
				myFrameworkResponseCud.put("PK_DELETE_ENTITY_LIST", pkDeleteEntityList);
				myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
				myFrameworkResponseCud.put("ENTITY_LIST", entityList);

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
	public MyFrameworkResponseCud entityColumnSave(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		// sqlParamMap.putAll(paramMap.getMap());

		try {
			
			String [] colmn_ids= paramMap.getValues("COLMN_ID");
			
			Set<String> pkEntitySet = new HashSet<String>();
			Set<String> pkInsertEntityList = new HashSet<String>();

			// 로그ID조회
			String log_id = RandomStringUtils.random(10, true, true);
			sqlParamMap.put("LOG_ID", log_id);
			
			String entity_id = null;
			for( int i=0; i<colmn_ids.length; i++ ) {

				sqlParamMap = new SqlParamMap<String, Object>();
				sqlParamMap.put("LOG_ID", log_id);
				
				pkInsertEntityList.add(paramMap.getValues("ENTITY_ID")[i]);
				
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

				sqlParamMap.put("ENTITY_ID", paramMap.getValues("ENTITY_ID")[i]);
				sqlParamMap.put("APLY_DT", paramMap.getValues("APLY_DT")[i]);
				sqlParamMap.put("APLY_USR_UID", paramMap.getValues("APLY_USR_UID")[i]);
				sqlParamMap.put("ATTR_NM", paramMap.getValues("ATTR_NM")[i]);
				sqlParamMap.put("COLMN_DESC", paramMap.getValues("COLMN_DESC")[i]);
				sqlParamMap.put("COLMN_NM", paramMap.getValues("COLMN_NM")[i]);
				sqlParamMap.put("COLMN_SCD", paramMap.getValues("COLMN_SCD")[i]);
				sqlParamMap.put("COLMN_SCD_NM", paramMap.getValues("COLMN_SCD_NM")[i]);
				sqlParamMap.put("DATA_TYPE", paramMap.getValues("DATA_TYPE")[i]);
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
			List<String> pkEntityList = new ArrayList<String>();
			pkInsertEntityList.add(entity_id);

			if(StringUtils.isNotEmpty(entity_id)) {
				sqlParamMap = new SqlParamMap<String, Object>();
				
				pkEntitySet.addAll(pkInsertEntityList);
				pkEntityList.addAll(pkEntitySet);
				
	
				sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
				sqlParamMap.put("SESSION_VERSN", paramMap.get("SESSION_VERSN"));
	
				Set<String> pkDeleteEntityList = new HashSet<String>();
				
				List<SqlResultMap<String, Object>> relationList = sqlDao.selectList("mapper.erd.relation.selectRelationList", sqlParamMap);
	
				MapHasList<String, ArrayList<SqlResultMap<String, Object>>> mapHasList = new MapHasList("START_ENTITY_ID", relationList);
	
				sqlParamMap.put("ENTITY_ID", entity_id);
				
				
				// entity를 기준으로 시작 relation조회.
				List<SqlResultMap<String, Object>> relationListByStartEntity = sqlDao.selectList("mapper.erd.relation.selectRelationListByStartEntity", sqlParamMap); 
	
				for( SqlResultMap<String, Object> relation : relationListByStartEntity ) {
	
					int index = 0;
					relationSvc.insertColumnPK(pkInsertEntityList, pkDeleteEntityList, relation.getString("END_ENTITY_ID"), relation.getString("START_ENTITY_ID"), mapHasList, paramMap, relation.getString("NON_IDEN_YN"), index);
					
					pkEntitySet.addAll(pkInsertEntityList);
					pkEntitySet.addAll(pkDeleteEntityList);
					
					pkEntityList.addAll(pkEntitySet);
					
				}
			} 
			sqlParamMap.put("ENTITY_LIST", pkEntityList);
			log.info(" ENTITY_LIST : " + sqlParamMap.get("ENTITY_LIST").toString() );
			
			SqlResultList<SqlResultMap<String, Object>> entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);
			SqlResultList<SqlResultMap<String, Object>> entityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			sqlParamMap = new SqlParamMap<String, Object>();
			sqlParamMap.put("LOG_ID", log_id);
			sqlParamMap.put("SESSION_PROJECT_ID", paramMap.get("SESSION_PROJECT_ID"));
			sqlParamMap.put("SESSION_USR_UID", paramMap.get("SESSION_USR_UID"));

			// 변경 로그 반영
			sqlDao.insert("mapper.erd.project.projectChgLog", sqlParamMap);
		
			myFrameworkResponseCud.setCudCount(colmn_ids.length);
			myFrameworkResponseCud.setSuccess(true);
			myFrameworkResponseCud.setMessage("저장되었습니다.");

			myFrameworkResponseCud.put("PK_INSERT_ENTITY_LIST", pkInsertEntityList);
			myFrameworkResponseCud.put("PK_DELETE_ENTITY_LIST", new HashSet<String>());
			myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
			myFrameworkResponseCud.put("ENTITY_LIST", entityList);

		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
			
			throw e;
		}
		return myFrameworkResponseCud;
	}


	@Transactional
	public MyFrameworkResponseCud updateDmlTcd(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			String entity_id = paramMap.get("ENTITY_ID");
			int result = 0;
			// '삭제'인 경우 '삭제취소'
			if( "DML_TCD_D".equals(paramMap.get("DML_TCD")) || "DML_TCD_C_D".equals(paramMap.get("DML_TCD")) || "DML_TCD_U_D".equals(paramMap.get("DML_TCD"))) {
				sqlParamMap.put("USE_YN", "Y");
			} 
			// '삭제취소'인 경우 '삭제'
			else {
				sqlParamMap.put("USE_YN", "N");
			}
			// entity 미사용처리
			result = sqlDao.insert("mapper.erd.entity.updateEntityUseYn", sqlParamMap);
			sqlDao.insert("mapper.erd.entity.updateSubjectEntityUseYn", sqlParamMap);
			// 관계 미사용처리
			sqlDao.insert("mapper.erd.entity.updateRelationOfEntityUseYn", sqlParamMap);
			
			
			// FK 컬럼 미사용처리..
			sqlDao.insert("mapper.erd.entity.updateFKColumnUseYn", sqlParamMap);
			
			SqlResultMap<String, Object> entityInfo = sqlDao.select("mapper.erd.entity.selectEntityInfo", sqlParamMap);

			List<String> pkEntityList = new ArrayList<String>();

			pkEntityList.add(entity_id);
			
			sqlParamMap.put("ENTITY_LIST", pkEntityList);
			SqlResultList<SqlResultMap<String, Object>> subjectEntityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			Set<String> pkInsertEntityList = new HashSet<String>();
			Set<String> pkDeleteEntityList = new HashSet<String>();
			pkInsertEntityList.add(entity_id);

			// RELATION에 따라 변경되는 테이블 목록
			Set<String> pkEntitySet = new HashSet<String>();
			
			List<SqlResultMap<String, Object>> entityHaveFKColumnList = sqlDao.selectList("mapper.erd.entity.selectEntityHaveFKColumn", sqlParamMap);
			
			
			for(SqlResultMap<String, Object> entityHaveFKColumn :  entityHaveFKColumnList) {
				pkInsertEntityList.add(entityHaveFKColumn.getString("ENTITY_ID"));
			}
			pkEntitySet.addAll(pkInsertEntityList);
			pkEntitySet.addAll(pkDeleteEntityList);
			
			pkEntityList.addAll(pkEntitySet);
			sqlParamMap.put("ENTITY_LIST", pkEntityList);
			// 다시 조회.	
			SqlResultList<SqlResultMap<String, Object>> entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);

			SqlResultList<SqlResultMap<String, Object>> entityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			
			if( result == 1 || result == 2 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
				myFrameworkResponseCud.put("ENTITY", entityInfo);
				myFrameworkResponseCud.put("ENTITY_LIST", subjectEntityList);

				myFrameworkResponseCud.put("PK_INSERT_ENTITY_LIST", pkInsertEntityList);
				myFrameworkResponseCud.put("PK_DELETE_ENTITY_LIST", pkDeleteEntityList);
				myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
				myFrameworkResponseCud.put("ENTITY_LIST", entityList);

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

	public void entitySubjectList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		
		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.entity.selectEntitySubjectList", sqlParamMap);
		
		myFrameworkResponseGrid.setData(list);
	}

	@Transactional
	public MyFrameworkResponseCud addEntityToSubject(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			int result = 0;

			result = sqlDao.insert("mapper.erd.entity.saveSubjectEntity", sqlParamMap);

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
				result = sqlDao.insert("mapper.erd.entity.addEntityFavorite", sqlParamMap);
			} 
			// 즐겨찾기 삭제
			else {
				result = sqlDao.insert("mapper.erd.entity.deleteEntityFavorite", sqlParamMap);
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
}
