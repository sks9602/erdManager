package com.myframework.was.param;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.web.multipart.MultipartFile;

public class RequestParamMap {

	private Map<String, Object> map = new HashMap<String, Object>();
	
	/**
	 * Map에 (String)값을 put
	 * @param name
	 * @param value
	 */
	public void put(String name, String value) {
		map.put(name, value);
	}
	
	/**
	 * Map에 배열(String[]) 값을 put
	 * @param name
	 * @param value
	 */
	public void put(String name, String [] values) {
		map.put(name, values);
	}
	
	/**
	 * Map에 배열(MultipartFile[]) 값을 put
	 * @param name
	 * @param multipartFiles
	 */
	public void put(String name, MultipartFile [] multipartFiles) {
		map.put(name, multipartFiles);
	}	
	
	/**
	 * 파라미터의 명을 조회(List)한다.
	 * @return
	 */
	public List<String> getNamesList() {
		Set<String> set =  new TreeSet<String>(map.keySet());
		Iterator<String> it = set.iterator();
		List<String> list = new ArrayList<String>();

		while( it.hasNext() ) {
			list.add( (String)it.next() );
		}
		
		return list;
	}
	
	/**
	 *  Map에 배열(String[]) 값을 get
	 * @param name
	 * @return
	 */
	public String[] getValues(String name) {
		Object obj = getObjectValue( name);
		
		if( obj==null ) {
			return null;
		} else {
			if( isArray(name) ) {
				return Arrays.asList((Object [])obj).toArray(new String[((Object [])obj).length]);
			} else {
				return new String[] { get(name) };
			}
		}
	}
	
	/**
	 * Map에서 (String)값을 get
	 * @param name
	 * @return
	 */
	public String get(String name) {
		return get(name, "");
	}
	
	/**
	 * Map에서  MultipartFile[] 값을 get
	 * @param name
	 * @return
	 */
	public MultipartFile[] getMultipartFile(String name) {
		Object obj = getObjectValue( name);
		if( obj==null ) {
			return null;
		} else {
			if(obj instanceof MultipartFile[]) {
				return (MultipartFile[])obj;
			} else {
				return null;
			}
		}
	}
	
	/**
	 * Map에 (String)값을 get : default값 있음.
	 * @param name
	 * @return
	 */
	public String get(String name, String deaultVal) {
		Object obj = getObjectValue( name);
		
		if( obj==null ) {
			return null;
		} else {
			if( isArray(name) ) {
				StringBuilder  sb = new StringBuilder();
				boolean isFirst = true;

				for( Object o : (Object[]) obj) {
					if( !isFirst) {
						sb.append(", ");
					} else {
						isFirst = false;
					}
					sb.append(o.toString());
					
				}
				return sb.toString();
			} else {
				return obj.toString();
			}
		}
	}
	
	/**
	 * Map에 Object 값을 get : 실제 값은 String 또는 String[] 일 수 있음.
	 * @param name
	 * @return
	 */
	public Object getObjectValue(String name) {
		return map.get(name);
	}
	
	/**
	 * Map에 값이 String[]인지 확인.
	 * @param name
	 * @return
	 */
	public boolean isArray(String name) {
		Object obj = getObjectValue(name);
		
		return  obj instanceof Object[] ;
	}
	
	/**
	 * Key, Value 형태의 map을 return
	 * @return
	 */
	public Map<String, Object> getMap() {
		return this.map;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		List<String> nameList = getNamesList();
		
		boolean isFirst = true;
		
		for( String name : nameList) {

			if( !isFirst) {
				sb.append(", ");
			} else {
				isFirst = false;
			}
			
			if( isArray(name) ) {
				sb.append(name).append(" : [").append(get(name)).append("]");
			} else {
				sb.append(name).append(" : ").append(get(name));
			}
		}
		return sb.toString();
	}
}
