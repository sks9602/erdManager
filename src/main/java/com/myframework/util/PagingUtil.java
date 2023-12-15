package com.myframework.util;

import java.util.Map;

public class PagingUtil {

	/**
	 * CurrentPageNo = 1 setPageSize = 5 totalRecordCount 셋팅 필요
	 *
	 * @param params
	 * @param recordCountPerpage 페이지내 리스트의 record 수
	 * @return
	 */
	public PaginationInfo setByMap(Map<String, Object> params, int recordCountPerpage) {

		PaginationInfo paginationInfo = new PaginationInfo();
		
		if (recordCountPerpage > 0) {
			paginationInfo.setRecordCountPerPage(recordCountPerpage);
		} else {
			paginationInfo.setRecordCountPerPage(20);
		}
		paginationInfo.setCurrentPageNo(params.get("pageIndex") == null ? 1 : Integer.parseInt(String.valueOf(params.get("pageIndex"))));
		paginationInfo.setPageSize(5);

		params.put("firstIndex", paginationInfo.getFirstRecordIndex() + 1);
		params.put("lastIndex", paginationInfo.getLastRecordIndex());
		params.put("recordCountPerPage", paginationInfo.getRecordCountPerPage());

		return paginationInfo;
	}
}
