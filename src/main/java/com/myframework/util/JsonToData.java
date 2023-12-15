package com.myframework.util;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import com.myframework.was.file.handler.MultipartFileHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JsonToData {

	private JSONObject json = null;
	private Map<String, Object> jsonMap = new HashMap<String, Object>();

	public JsonToData(String result) {
		json = new JSONObject(result);

		parse();
	}

	public JsonToData(JSONObject json) {
		this.json = json;

		parse();
	}

	public void parse() {
		jsonMap.putAll(parse (this.json));
	}


	public Map<String, Object> getJsonMap() {
		return jsonMap;
	}

	public List<Map<String, Object>> parse(JSONArray array) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		for(int i=0; i< array.length(); i++ ) {

			list.add(parse(array.getJSONObject(i)));
		}

		return list;
	}

	public Map<String, Object> parse(JSONObject json) {
		Map<String, Object> map = new HashMap<String, Object>();

		Set<String> keySet = json.keySet();

		Iterator<String> keyIt = keySet.iterator();

		while(keyIt.hasNext()) {
			String key = keyIt.next();

			Object entry = json.get(key);

			log.info( key + " : " + entry.getClass().getName() );
			if( entry instanceof JSONArray ) {
				map.put(key, parse(json.getJSONArray(key)) );
			} else if( entry instanceof JSONObject ) {
				map.put(key, parse(json.getJSONObject(key)));
			} else if( entry instanceof BigDecimal ) {
				map.put(key, json.getBigDecimal(key));
			} else if( entry instanceof BigInteger ) {
				map.put(key, json.getBigInteger(key));
			} else if( entry instanceof Boolean ) {
				map.put(key, json.getBoolean(key));
			} else if( entry instanceof Double ) {
				map.put(key, json.getDouble(key));
			} else if( entry instanceof Integer ) {
				map.put(key, json.getInt(key));
			} else if( entry instanceof Float ) {
				map.put(key, json.getFloat(key));
			} else if( entry instanceof Long ) {
				map.put(key, json.getLong(key));
			} else {
				map.put(key, json.getString(key));
			}
		}

		return map;
	}
}
