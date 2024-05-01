package com.admin.erd.relation.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.myframework.dao.MyFrameworkSqlDao;
import com.myframework.sql.SqlParamMap;
import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;
import com.myframework.util.MapHasList;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;
import com.myframework.was.response.MyFrameworkResponseGrid;

import lombok.extern.slf4j.Slf4j;

@Service("relationSvc")
@Slf4j
public class RelationSvc {

	@Autowired
	private MyFrameworkSqlDao sqlDao;


	public void erdSubjectRelationList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.relation.selectSubjectRelationErdList", sqlParamMap);

		myFrameworkResponseGrid.setData(list);
	}

	public void erdRelationList(ModelMap model, RequestParamMap paramMap) {
		MyFrameworkResponseGrid myFrameworkResponseGrid = MyFrameworkResponseGrid.builder().modelMap(model).build();

		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		SqlResultList<SqlResultMap<String, Object>> list = sqlDao.selectList("mapper.erd.relation.selectRelationList", sqlParamMap);

		myFrameworkResponseGrid.setData(list);
	}

	
	/**
	 * 관계 저장
	 * @param model
	 * @param paramMap
	 * @return
	 * @throws Exception 
	 */
	@Transactional
	public MyFrameworkResponseCud relationSave(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			// UID조회
			String relationUid = null;
			try {
				SqlResultMap<String, Object> relation = sqlDao.select("mapper.erd.relation.selectRelationByStartEndEntity", sqlParamMap);
			
				relationUid = relation.getString("RELATION_ID");
			} catch(Exception e) {
				SqlResultMap<String, Object> uid = sqlDao.select("mapper.erd.user.selectUid", sqlParamMap);
				relationUid = uid.getString("UID");
			}
				
			sqlParamMap.put("RELATION_ID", relationUid);
			
			Integer result = sqlDao.insert("mapper.erd.relation.saveRelation", sqlParamMap);
			
			List<SqlResultMap<String, Object>> relationList = sqlDao.selectList("mapper.erd.relation.selectRelationList", sqlParamMap);

			sqlDao.insert("mapper.erd.relation.updateRelationColumnFK", sqlParamMap);
			sqlDao.insert("mapper.erd.relation.saveRelationColumnFK", sqlParamMap);
			
			MapHasList<String, ArrayList<SqlResultMap<String, Object>>> mapHasList = new MapHasList("START_ENTITY_ID", relationList);

			Set<String> pkInsertEntityList = new HashSet<String>();
			Set<String> pkDeleteEntityList = new HashSet<String>();
			
			int index = 0;
			insertColumnPK(pkInsertEntityList, pkDeleteEntityList, paramMap.get("END_ENTITY_ID"), paramMap.get("START_ENTITY_ID"), mapHasList, paramMap, "N", index );
			
			log.info("pkInsertEntityList : {} ", pkInsertEntityList );
			
			sqlDao.insert("mapper.erd.relation.saveSubjectRelation", sqlParamMap);

			// RELATION에 따라 변경되는 테이블 목록
			Set<String> pkEntitySet = new HashSet<String>();
			
			pkEntitySet.addAll(pkInsertEntityList);
			pkEntitySet.addAll(pkDeleteEntityList);
			
			List<String> pkEntityList = new ArrayList<String>();
			pkEntityList.addAll(pkEntitySet);
			sqlParamMap.put("ENTITY_LIST", pkEntityList);
			// 다시 조회.	
			SqlResultList<SqlResultMap<String, Object>> entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);

			SqlResultList<SqlResultMap<String, Object>> entityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			if( result >= 0 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
				myFrameworkResponseCud.put("RELATION_ID", relationUid);
				myFrameworkResponseCud.put("PK_INSERT_ENTITY_LIST", pkInsertEntityList);
				myFrameworkResponseCud.put("PK_DELETE_ENTITY_LIST", pkDeleteEntityList);
				myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
				myFrameworkResponseCud.put("ENTITY_LIST", entityList);
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
	
	@Transactional
	public void insertColumnPK(Set<String> pkInsertEntityList, Set<String> pkDeleteEntityList, String endEntityId, String startEntityId,  MapHasList<String, ArrayList<SqlResultMap<String, Object>>> mapHasList, RequestParamMap paramMap, String nonIdenYn, int index ) {

		log.info("endEntityId : {} ", endEntityId );
		pkInsertEntityList.add(endEntityId);
		
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		sqlParamMap.put("END_ENTITY_ID", endEntityId);
		sqlParamMap.put("START_ENTITY_ID", startEntityId);
		sqlParamMap.put("ORIGIN_START_ENTITY_ID", paramMap.get("START_ENTITY_ID"));
		sqlParamMap.put("INDEX", index);
		if(!"Y".equals(nonIdenYn) ) {
			sqlDao.insert("mapper.erd.relation.updateRelationColumnFK", sqlParamMap);
			sqlDao.insert("mapper.erd.relation.saveRelationColumnFK", sqlParamMap);
		} 
		
		List<SqlResultMap<String, Object>> list = mapHasList.getList(endEntityId);
		log.info("list : {} ", list );
		if( list != null ) {
			for( SqlResultMap<String, Object> map : list) {				
				if( !map.getString("END_ENTITY_ID").equals(map.getString("START_ENTITY_ID"))) {
					if("Y".equals(map.getString("NON_IDEN_YN")) || "Y".equals(nonIdenYn) ) {
						Integer cnt = 0;
						deleteColumnPK(cnt, pkDeleteEntityList, map.getString("END_ENTITY_ID"), map.getString("START_ENTITY_ID"), mapHasList, paramMap );
					} else {
						log.info("NEXT endEntityId : {} ", map.getString("END_ENTITY_ID") );
						index ++;
						insertColumnPK(pkInsertEntityList, pkDeleteEntityList, map.getString("END_ENTITY_ID"), map.getString("START_ENTITY_ID"), mapHasList, paramMap, "N", index);
					}
				}
			}
		}
	}
	
	@Transactional
	public MyFrameworkResponseCud relationUpdate(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			Integer result = sqlDao.insert("mapper.erd.relation.saveRelation", sqlParamMap);

			Set<String> pkInsertEntityList = new HashSet<String>();
			Set<String> pkDeleteEntityList = new HashSet<String>();

			SqlResultList<SqlResultMap<String, Object>> entityColumnList = null;
			SqlResultList<SqlResultMap<String, Object>> entityList = null;
			
			if("Y".equals(paramMap.get("MANAGER_YN"))) {
				sqlDao.insert("mapper.erd.relation.saveSubjectRelation", sqlParamMap);
				// Non-identifing Relation일 경우.
				sqlDao.insert("mapper.erd.relation.updateRelationNonIdenYN", sqlParamMap);
				
				List<SqlResultMap<String, Object>> relationList = sqlDao.selectList("mapper.erd.relation.selectRelationList", sqlParamMap);

				MapHasList<String, ArrayList<SqlResultMap<String, Object>>> mapHasList = new MapHasList("START_ENTITY_ID", relationList);

				int index = 0;
				insertColumnPK(pkInsertEntityList, pkDeleteEntityList, paramMap.get("END_ENTITY_ID"), paramMap.get("START_ENTITY_ID"), mapHasList, paramMap, paramMap.get("NON_IDEN_YN"), index);
				
				if( StringUtils.isNotEmpty(paramMap.get("ATTR")) && StringUtils.isNotEmpty(paramMap.get("VAL"))) {
					sqlDao.insert("mapper.erd.relation.saveRelationAttr", sqlParamMap);
				}

				// RELATION에 따라 변경되는 테이블 목록
				Set<String> pkEntitySet = new HashSet<String>();
				
				pkEntitySet.addAll(pkInsertEntityList);
				pkEntitySet.addAll(pkDeleteEntityList);
				
				List<String> pkEntityList = new ArrayList<String>();
				pkEntityList.addAll(pkEntitySet);
				sqlParamMap.put("ENTITY_LIST", pkEntityList);
				
				log.info(" ENTITY_LIST : " + sqlParamMap.get("ENTITY_LIST").toString() );
				// 다시 조회.	
				entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);

				entityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);

			} else {
				sqlDao.insert("mapper.erd.relation.saveSubjectRelationUsr", sqlParamMap);
			}
			if( result == 1 || result == 2) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("저장되었습니다.");
				myFrameworkResponseCud.put("PK_INSERT_ENTITY_LIST", pkInsertEntityList);
				myFrameworkResponseCud.put("PK_DELETE_ENTITY_LIST", pkDeleteEntityList);
				myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
				myFrameworkResponseCud.put("ENTITY_LIST", entityList);
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
	
	@Transactional
	public MyFrameworkResponseCud relationUpdatePath(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			Integer result =  sqlDao.insert("mapper.erd.relation.updateRelationPath", sqlParamMap);
			
			if( result == 1 || result == 2) {
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

	@Transactional
	public MyFrameworkResponseCud relationDelete(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {
			
			// Integer result = sqlDao.insert("mapper.erd.relation.deleteRelation", sqlParamMap);

			SqlResultMap<String, Object> relation = sqlDao.select("mapper.erd.relation.selectRelation", sqlParamMap);
			
			List<SqlResultMap<String, Object>> relationList = sqlDao.selectList("mapper.erd.relation.selectRelationList", sqlParamMap);

			MapHasList<String, ArrayList<SqlResultMap<String, Object>>> mapHasList = new MapHasList("START_ENTITY_ID", relationList);

			Set<String> pkDeleteEntityList = new HashSet<String>();
			Integer cnt = 0;
			
			Integer result = deleteColumnPK(cnt, pkDeleteEntityList, relation.getString("END_ENTITY_ID"), relation.getString("START_ENTITY_ID"), mapHasList, paramMap );

			log.info("result : {} ", result );
			
			sqlDao.insert("mapper.erd.relation.deleteRelation", sqlParamMap);
			
			sqlDao.insert("mapper.erd.relation.deleteSubjectRelation", sqlParamMap);
			
			sqlDao.insert("mapper.erd.relation.deleteRelationAttr", sqlParamMap);

			// RELATION에 따라 변경되는 테이블 목록
			Set<String> pkEntitySet = new HashSet<String>();
			
			pkEntitySet.addAll(pkDeleteEntityList);
			
			List<String> pkEntityList = new ArrayList<String>();
			pkEntityList.addAll(pkEntitySet);
			sqlParamMap.put("ENTITY_LIST", pkEntityList);
			// 다시 조회.	
			SqlResultList<SqlResultMap<String, Object>> entityColumnList = sqlDao.selectList("mapper.erd.column.selectColumnErdList", sqlParamMap);

			SqlResultList<SqlResultMap<String, Object>> entityList = sqlDao.selectList("mapper.erd.subject.selectSubjectEntityList", sqlParamMap);
			
			// TODO-CHECK
			//if( result > 0 ) {
				myFrameworkResponseCud.setCudCount(result);
				myFrameworkResponseCud.setSuccess(true);
				myFrameworkResponseCud.setMessage("삭제되었습니다.");
				myFrameworkResponseCud.put("PK_DELETE_ENTITY_LIST", pkDeleteEntityList);
				myFrameworkResponseCud.put("ENTITY_COLUMN_LIST", entityColumnList);
				myFrameworkResponseCud.put("ENTITY_LIST", entityList);
			//} else {
			//	myFrameworkResponseCud.setSuccess(false);
			//	myFrameworkResponseCud.setErrorMessage("저장시 오류가 발생했습니다.");
				
			//	throw new Exception("저장시 오류가 발생했습니다.");
			//}
		} catch(Exception e) {
			e.printStackTrace();
			myFrameworkResponseCud.setSuccess(false);
			myFrameworkResponseCud.setErrorMessage("삭제시 오류가 발생했습니다.");
			throw e;
		}
		return myFrameworkResponseCud;
	}
	
	@Transactional
	private Integer deleteColumnPK(Integer cnt, Set<String> pkDeleteEntityList, String endEntityId, String startEntityId,  MapHasList<String, ArrayList<SqlResultMap<String, Object>>> mapHasList, RequestParamMap paramMap ) {
		Integer result = 0;
		log.info("endEntityId : {} ", endEntityId );
		pkDeleteEntityList.add(endEntityId);
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());
		sqlParamMap.put("END_ENTITY_ID", endEntityId);
		sqlParamMap.put("START_ENTITY_ID", startEntityId);
		
		cnt += sqlDao.delete("mapper.erd.relation.deleteRelationColumnFK", sqlParamMap);

		List<SqlResultMap<String, Object>> list = mapHasList.getList(endEntityId);
		log.info("list : {} ", list );
		
		
		if( list != null ) {
			for( SqlResultMap<String, Object> map : list) {				
				if( !map.getString("END_ENTITY_ID").equals(map.getString("START_ENTITY_ID"))
					&& !"Y".equals(map.getString("NON_IDEN_YN"))) {
					log.info("NEXT endEntityId : {} ", map.getString("END_ENTITY_ID") );
					cnt += deleteColumnPK(cnt, pkDeleteEntityList, map.getString("END_ENTITY_ID"), startEntityId, mapHasList, paramMap);
				}
			}
		}
		
		log.info(">>>> result : {} ", cnt );
		
		return cnt;
	}
	/**
	 * 업무영역에 relation추가
	 * @param model
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public MyFrameworkResponseCud relationAddToSubject(ModelMap model, RequestParamMap paramMap) throws Exception {
		MyFrameworkResponseCud myFrameworkResponseCud = MyFrameworkResponseCud.builder().modelMap(model).build();
		
		// request파라미터 -> sql파라미터 
		SqlParamMap<String, Object> sqlParamMap = new SqlParamMap<String, Object>();
		sqlParamMap.putAll(paramMap.getMap());

		try {

			
			Integer result = sqlDao.insert("mapper.erd.relation.saveSubjectRelation", sqlParamMap);

			if( result == 1 ) {
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
