package com.myframework.util;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ListToTree {
	public JSONArray toTreeJson(String rootValue, String columnId, SqlResultList<SqlResultMap<String, Object>> data) {
		
		MapHasList<String, List<SqlResultMap<String, Object>>> mapHasList = new MapHasList(columnId, data);

		JSONArray jsonArray = toTreeJson( rootValue, columnId, mapHasList, 0);

		return jsonArray;
	}
	 
	public JSONArray toTreeJson(String parentValue, String columnId, MapHasList<String, List<SqlResultMap<String, Object>>> mapHasList, int level) {
				
		JSONArray jsonArray = new JSONArray();
		
		List<SqlResultMap<String, Object>> myList = mapHasList.getList(parentValue);

		if( myList!=null && myList.size() > 0 ) {
			level ++;
			for( int i=0; myList!=null && i<myList.size() ;i++) {
					
				List<SqlResultMap<String, Object>> childList = mapHasList.getList( myList.get(i).get("ID").toString() );
				
				JSONObject jsonObject = mapToJson(myList.get(i), childList, level);
				JSONArray childArray = toTreeJson( myList.get(i).get("ID").toString(), columnId, mapHasList, level);
				
				if( !childArray.isEmpty()) {
					jsonObject.put("CHILDREN",childArray );
				} else {
					jsonObject.put("leaf", true);
				}
				jsonArray.put(jsonObject) ;
				
			}
			level--;
		}

		
		return jsonArray;
	}
	
	public JSONObject mapToJson(SqlResultMap<String, Object> map, List<SqlResultMap<String, Object>> childList, int level) {
		JSONObject jsonObject = new JSONObject();
		
		Set<String> keySet = map.keySet();
		Iterator<String> it = keySet.iterator();

		while(it.hasNext()) {
			String key = it.next().toString();
			jsonObject.put(key, map.get(key) ==null ? "" : map.get(key).toString());
		}
		if( map.get("EXPAND_YN")!=null && "N".equals(map.get("EXPAND_YN").toString()) ) {
			jsonObject.put("expanded", false);
		} else {
			jsonObject.put("expanded", true);
		}
		if( map.get("ICON_CLS")!=null) {
			jsonObject.put("iconCls", map.get("ICON_CLS").toString()); // myList.get(i).get("ICON_CLS").toString()
		}
		jsonObject.put("LEVEL", level);

		if( childList!=null) {
			JSONObject child = new JSONObject();
			
			child.put("OPENED", true);
			child.put("expanded", true);
			
			if( map.get("SELECTED_YN") !=null && "Y".equals(map.get("SELECTED_YN").toString()) ) {
				child.put("selected", true);
			}
			
			jsonObject.put("state", child );
			
		} else {
			if( map.get("SELECTED_YN") !=null && "Y".equals(map.get("SELECTED_YN").toString()) ) {
				JSONObject child = new JSONObject();
				child.put("selected", true);
			
				jsonObject.put("state", child );
			}
		}
		
		return jsonObject;
	}

	public String toTreeJsonString(String rootValue, String columnId, SqlResultList<SqlResultMap<String, Object>> data) {
		StringBuilder sb = new StringBuilder();
		
		MapHasList<String, List<SqlResultMap<String, Object>>> mapHasList = new MapHasList(columnId, data);
		
		sb.append( toTreeJson( rootValue, columnId, mapHasList, 0));
		
		log.info(sb.toString() );
		return sb.toString();
	}

	
	public String toTreeJsonString(String parentValue, String columnId, MapHasList<String, List<SqlResultMap<String, Object>>> mapHasList, int level) {
		
		StringBuilder sb = new StringBuilder();
		
		List<SqlResultMap<String, Object>> myList = mapHasList.getList(parentValue);

		if( myList.size() > 0 ) {
			sb.append("[");
			
			for( int i=0; i<myList.size() ;i++) {
					
				
				List<SqlResultMap<String, Object>> childList = mapHasList.getList( myList.get(i).get("id").toString() );
				if( i > 0) {
					sb.append(", ") ;
				}
				
				sb.append("{");
				sb.append(mapToJson(myList.get(i), childList, level)) ;
				
				if( childList!=null) {
					
					sb.append( toTreeJson( myList.get(i).get("id").toString(), columnId, mapHasList, level++) );
				}

				sb.append("}");		
			}		

			sb.append("]");
		}
		
		return sb.toString();
	}
	
	public String mapToStriong(SqlResultMap<String, Object> map, List<SqlResultMap<String, Object>> childList) {
		StringBuilder sb = new StringBuilder();
		
		Set keySet = map.keySet();
		Iterator it = keySet.iterator();
		
		int mapIdx = 0;

		while(it.hasNext()) {
			String key = it.next().toString();
			
			if( mapIdx > 0 ) {
				sb.append(",");
			}
			sb.append(key).append(": '").append(map.get(key) ==null ? "" : map.get(key).toString()).append("'");
			mapIdx++;
		}
		if( childList!=null) {
			sb.append(", state : { 'opened' : true }, 'children' : ");
		}
		return sb.toString();
	}
}
