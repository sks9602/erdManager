package com.myframework.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.myframework.sql.SqlResultMap;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MapHasList<T, E> extends HashMap<String, ArrayList<SqlResultMap<String, Object>>>{

	private static final long serialVersionUID = 5669727369196649416L;

	public MapHasList(String keyColName, List<Map<String, Object>> list) {
		super();

		for (int i = 0; i < list.size(); i++) {
			this.setValue(list.get(i).get(keyColName).toString(), (SqlResultMap<String, Object>)list.get(i));
		}
	}

	public void setValue(String keyColName, SqlResultMap<String, Object> obj) {
		ArrayList<SqlResultMap<String, Object>> mapedList = (ArrayList<SqlResultMap<String, Object>>) super.get(keyColName);
		if (mapedList == null) {
			mapedList = new ArrayList<SqlResultMap<String, Object>>();
		}
		mapedList.add(obj);
		super.put(keyColName, (ArrayList<SqlResultMap<String, Object>>) mapedList);
	}

	public List<SqlResultMap<String, Object>> getList(String key) {
		if( super.containsKey(key)) {
			return (ArrayList<SqlResultMap<String, Object>>) super.get(key);
		} else {
			return null;
		}
	}
}
