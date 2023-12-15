package com.myframework.sql;

import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedHashMap;

import com.myframework.util.MyFrameworkStringUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SqlResultMap<String, V> extends LinkedHashMap<String, V> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2015665359668381676L;


	@Override
	public V put(String key, V value) {
		// return super.put((String) MyFrameworkStringUtils.toCamelCase(key.toString()), value);
		return super.put((String) key.toString().toUpperCase(), value);
		/*
		if( value != null && value instanceof CLOB) {
			return super.put((String) MyFrameworkStringUtils.toCamelCase(key.toString()), (V) ClobToString.getClob((CLOB) value) );
		} else {
			return super.put((String) MyFrameworkStringUtils.toCamelCase(key.toString()), value);
		}
		*/
	}
	
	@SuppressWarnings("unchecked")
	public String getString(String key) {
		if( this.containsKey(key)) {
			if( this.get(key) == null) {
				return null;
			} else {
				return  (String) this.get(key).toString();
			}
		} else {
			return (String) "";
		}
	}
	
	@SuppressWarnings("unchecked")
	public int getInt(String key) {
		if( this.containsKey(key)) {
			try {
				return Integer.parseInt( this.get(key).toString());
			} catch(NullPointerException | NumberFormatException e) {
				return 0;
			}
		} else {
			return 0;
		}
	}


}
