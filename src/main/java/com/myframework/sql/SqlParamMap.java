package com.myframework.sql;

import java.util.HashMap;
import java.util.Map;

public class SqlParamMap <K, V> extends HashMap<K, V> {

    /**
     * 
     */
    private static final long serialVersionUID = 4281088025352054567L;

    public V put(K key, V value) {
    	return super.put((K) key.toString().toUpperCase(), value);
    }
    
    public void putAll(Map<? extends K, ? extends V> values) {
    	for(K key : values.keySet()) {
    		this.put(key, values.get(key));
    	}
    }
    
    public String getString(String key) {
    	
    	if( super.get(key) != null ) {
    		return  super.get(key).toString();
    	} else {
    		return "";
    	}
    }
}
