package com.admin.erd.entity.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.admin.erd.entity.service.EntitySvc;
import com.common.login.vo.LoginVo;
import com.myframework.vo.MyFrameworkLoginVO;
import com.myframework.was.param.RequestParamMap;
import com.myframework.was.response.MyFrameworkResponseCud;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class EntityCtrl {

	@Resource(name = "entitySvc")
	private EntitySvc entitySvc;
	
	
	@RequestMapping(value="/entity/data/erdEntityList.do")
	public String erdEntityList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.erdEntityList(model, paramMap);
		
		return "jsonView";
	}

	
	@RequestMapping(value="/entity/data/list.do")
	public String entityList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.entityList(model, paramMap);
		
		return "jsonView";
	}

	/**
	 * 테이블+컬럼 layout(tree)
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/entity/data/entityColumnTree.do")
	public String entityColumnTree(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.entityColumnTree(model, paramMap);
		
		return "/data/tree/data";
	}

	/**
	 * 테이블의 컬럼 상세 목록
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/entity/data/columnList.do")
	public String columnList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.columnList(model, paramMap);
		
		return "jsonView";
	}
	
	
	@RequestMapping(value="/entity/data/entityColumList.do")
	public String entityColumList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.entityColumList(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/entity/data/entityColumListTable.do")
	public String entityColumListTable(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.entityColumListTable(model, paramMap);
		
		return "jsonView";
	}

	
	@RequestMapping(value="/entity/data/detail.do")
	public String detail(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.detail(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/entity/data/save.do")
	public String entitySave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.entitySave(model, paramMap);
		
		return "jsonView";
	}
	
	/**
	 * ENTITY속성정보 변경
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/entity/data/updateAttr.do")
	public String updateAttr(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		LoginVo loginVo = (LoginVo) request.getSession().getAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY);
		
		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.updateAttr(model, paramMap);
		
		return "jsonView";
	}
	
	
	/**
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/entity/data/delete.do")
	public String entityDelete(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.entityDelete(model, paramMap);
		
		return "jsonView";
	}

	/**
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/entity/data/restore.do")
	public String entityRestore(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.entityRestore(model, paramMap);
		
		return "jsonView";
	}
	

	
	@RequestMapping(value="/entity/data/updateScd.do")
	public String entityUpdateScd(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.entityUpdateScd(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/entity/data/columnSave.do")
	public String entityColumnSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) throws Exception {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.entityColumnSave(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/entity/data/updateDmlTcd.do")
	public String updateDmlTcd(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.updateDmlTcd(model, paramMap);
		
		return "jsonView";
	}

	
	@RequestMapping(value="/entity/data/subjectList.do")
	public String entitySubjectList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		entitySvc.entitySubjectList(model, paramMap);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/entity/data/addToSubject.do")
	public String addEntityToSubject(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.addEntityToSubject(model, paramMap);
		
		return "jsonView";
	}
	/**
	 * 테이블 즐겨찾기
	 * @param model
	 * @param paramMap
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/entity/data/saveFavorite.do")
	public String saveFavorite(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.saveFavorite(model, paramMap);
		
		return "jsonView";
	}

	/**
	 * 테이블 즐겨찾기
	 * @param model
	 * @param paramMap
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/entity/data/indexInfo.do")
	public String entityIndexInfo(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		entitySvc.indexInfo(model, paramMap);
		
		return "jsonView";	}
	
	
	/**
	 * 테이블의 컬럼 상세 목록
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/entity/data/columnListNotIndexed.do")
	public String columnListNotIndexed(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.columnListNotIndexed(model, paramMap);
		
		return "jsonView";
	}
	
	/**
	 * 테이블의 컬럼 상세 목록
	 * @param model
	 * @param paramMap
	 * @return
	 */
	@RequestMapping(value="/entity/data/columnListIndexed.do")
	public String columnListIndexed(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {
	
		entitySvc.columnListIndexed(model, paramMap);
		
		return "jsonView";
	}
	
	/**
	 * 테이블 즐겨찾기
	 * @param model
	 * @param paramMap
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/entity/data/saveIndex.do")
	public String saveIndex(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.saveIndex(model, paramMap);
		
		return "jsonView";
	}
	
	/**
	 * 테이블 즐겨찾기
	 * @param model
	 * @param paramMap
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/entity/data/indexTreeList.do")
	public String indexTreeList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		entitySvc.indexTreeList(model, paramMap);
		
		return "/data/tree/data";
	}
	
	
	@RequestMapping(value="/entity/data/aliasSave.do")
	public String entityAliasSave(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		MyFrameworkResponseCud myFrameworkResponseCud = entitySvc.entityAliasSave(model, paramMap);
		
		return "jsonView";
	}

	@RequestMapping(value="/entity/data/memoList.do")
	public String memoList(ModelMap model, RequestParamMap paramMap, HttpServletRequest request) {

		entitySvc.memoList(model, paramMap);
		
		return "jsonView";
	}
}
