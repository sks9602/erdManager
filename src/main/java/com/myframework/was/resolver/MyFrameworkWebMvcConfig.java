package com.myframework.was.resolver;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.MethodParameter;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.common.login.vo.LoginVo;
import com.myframework.util.MyFrameworkStringUtils;
import com.myframework.util.HttpUtil;
import com.myframework.vo.MyFrameworkLoginVO;
import com.myframework.was.param.RequestParamMap;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class MyFrameworkWebMvcConfig  implements WebMvcConfigurer {

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(requestParamMapResolver());
	}

	public HandlerMethodArgumentResolver requestParamMapResolver() {
		return new HandlerMethodArgumentResolver() {

			/**
			 * method="get" form submit CharacterSet
			 */
			private String charSetGet = ""; // "ISO-8859-1";
			/**
			 *
			 */
			private String charSetConvert = "utf-8";

			@Override
			public boolean supportsParameter(MethodParameter parameter) {
				return RequestParamMap.class.isAssignableFrom(parameter.getParameterType()); 
			}

			@SuppressWarnings("rawtypes")
			@Override
			public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
					NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
				

				Iterator<String> paramNames = webRequest.getParameterNames();
				
				RequestParamMap paramMap = new RequestParamMap();
				
				HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();

				String key = null;
				
				String orgCharsetName = this.charSetGet;
				String newCharsetName = this.charSetConvert;
					
				// Request Body
				try {
					StringBuilder stringBuilder = new StringBuilder();			
					BufferedReader bufferedReader = null;

					InputStream inputStream = request.getInputStream();
					
					if( inputStream !=null ) {
						bufferedReader = new BufferedReader(new InputStreamReader(inputStream));

						char[] charBuffer = new char[128];
						int bytesRead = -1;
						while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
							stringBuilder.append(charBuffer, 0, bytesRead);
						}
					}
					
					if( stringBuilder.length()>0) {
						JSONObject jsonObject = new JSONObject(stringBuilder.toString());
					
						Iterator<String> itKey = jsonObject.keys();
						
						while( itKey.hasNext() ) {
							String jsonKey = itKey.next();
							
							Object jsonValue =  jsonObject.get(jsonKey);
												
							if( jsonKey.endsWith("[]")) {
								String [] jsonStrVals =  null;
														
								//
								if( JSONArray.class.isAssignableFrom(jsonValue.getClass()) ) {
									JSONArray jsonArray = (JSONArray)jsonValue;
									
									jsonStrVals = new String[jsonArray.length()];
																
									Iterator<Object> itValue =  jsonArray.iterator();
									
									for(int i=0; itValue.hasNext() && i<jsonStrVals.length ;i++) {
										jsonStrVals[i] = itValue.next().toString();
									}
								} 
								// 
								else {
									jsonStrVals = new String[]{ jsonValue.toString() };
								}
								paramMap.put(jsonKey.replaceAll("\\[\\]", ""),  jsonStrVals);
							} else {
								paramMap.put(jsonKey,  jsonValue.toString());
							}
						}
					}

				} catch(RuntimeException re) {
					log.error( re.toString() );
				}
				Boolean isSortExists = false;
				while(paramNames.hasNext()) {
					String paramName = paramNames.next();
					
					if(paramName.endsWith("[]")) {
						// METHOD=GET encoding
						if("GET".equals(request.getMethod().toUpperCase())) {
							paramMap.put(paramName.replaceAll("\\[\\]", ""),  charsetEncode(webRequest.getParameterValues(paramName), orgCharsetName, newCharsetName));
						} else {
							paramMap.put(paramName.replaceAll("\\[\\]", ""),  webRequest.getParameterValues(paramName));
						}
						
					} else {
						if( paramName !=null && paramName.startsWith("iSortCol")) {
							continue;
						}
						
						// METHOD=GET encoding
						if("GET".equals(request.getMethod().toUpperCase())) {
							paramMap.put(paramName,  charsetEncode(webRequest.getParameter(paramName), orgCharsetName, newCharsetName));
						} else {					
							paramMap.put(paramName,  webRequest.getParameter(paramName));
						}
					}
				}
				
				List<String> sSortCol = new ArrayList<String>();
				List<String> sSortDir = new ArrayList<String>();
				
				for( int i=0;i<5; i++) {
					if( webRequest.getParameter("iSortCol_" + i) !=null ) {
						sSortCol.add(MyFrameworkStringUtils.toSnakeCase(webRequest.getParameter("mDataProp_" + webRequest.getParameter("iSortCol_"+i))));
						sSortDir.add(webRequest.getParameter("sSortDir_"+i));
					}
				}
				
				if( sSortCol.size() > 0 ) {
					paramMap.put("sSortCol",  (String[]) sSortCol.toArray(new String[sSortCol.size()]) );
					paramMap.put("sSortDir",  (String[]) sSortDir.toArray(new String[sSortDir.size()]) );
				}

				if( request.getSession().getAttribute("SESSION_USER") != null ) {
					paramMap.put("SESSION_USER",  request.getSession().getAttribute("SESSION_USER").toString() );
				} else {
					paramMap.put("SESSION_USER", "UNKNOWN");
				}

				// 
				if (request.getContentType() != null && request.getContentType().toLowerCase().contains("multipart/form-data")) {

					MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest)request;

					Iterator<String> iterator = multipartHttpServletRequest.getFileNames();

					List<MultipartFile> multipartFiles = null;

					while(iterator.hasNext()){
						key = iterator.next();

						multipartFiles = multipartHttpServletRequest.getFiles(key);
						
						List<MultipartFile> realFileList = new ArrayList<MultipartFile>();
						
						
						for( MultipartFile multipartFile : multipartFiles ) {
							// 
							if( ! StringUtils.isEmpty(multipartFile.getOriginalFilename()) ) {
								realFileList.add(multipartFile);
							}
							
						}
						
						// MultipartFile[]
						paramMap.put(key, realFileList.toArray( new MultipartFile[realFileList.size()] ) );
					}
					
				}

				// 
				LoginVo loginVo = (LoginVo) request.getSession().getAttribute(MyFrameworkLoginVO.MY_FRAMEWORK_LOGIN_SESSION_KEY);
				
				//  RequestParamMap
				if( loginVo!=null ) {

					// UserKey
					paramMap.put("SESSION_USR_UID",  loginVo.getUsrUid());
					// ID
					paramMap.put("SESSION_LOGIN_ID",  loginVo.getLoginId());
					// 사용자 명
					paramMap.put("SESSION_USR_NM",  loginVo.getUsrNm());

					paramMap.put("SESSION_LOGIN_IP", loginVo.getLoginIp());
					
					paramMap.put("SESSION_DEPT", loginVo.getDept());
					
					paramMap.put("SESSION_DEPT_NM", loginVo.getDeptNm());
					paramMap.put("SESSION_USER_AUTH", loginVo.getAuth());

					paramMap.put("SESSION_COMPANY_ID", loginVo.getCompanyId());
					paramMap.put("SESSION_PROJECT_ID", loginVo.getProjectId());
					paramMap.put("SESSION_VERSN", loginVo.getVersion());
					paramMap.put("SESSION_VERSN", loginVo.getVersion());
					paramMap.put("SESSION_ENTITY_DISPLAY_DAYCNT", loginVo.getEntityDisplayDaycnt());
					paramMap.put("SESSION_COLUMN_DISPLAY_DAYCNT", loginVo.getColumnDisplayDaycnt());
					paramMap.put("SESSION_CURRENT_ERD_YN", loginVo.getCurrentErdYn());
					
					paramMap.put("INNER_IP", HttpUtil.getCurrentEnvironmentNetworkIp());
					
					paramMap.put("FNC_FNM", request.getRequestURI());
					
				}
				
				webRequest.setAttribute("paramMap", paramMap, NativeWebRequest.SCOPE_REQUEST);
				
				return paramMap;
			}
			
			public String[] charsetEncode(String [] paramValues, String orgCharsetName, String newCharsetName) {
				if( paramValues == null ) {
					return null;
				}
				String [] values = new String[paramValues.length];
				
				for(int i=0; i<paramValues.length; i++) {
					values[i] = charsetEncode( paramValues[i], orgCharsetName, newCharsetName);
				}
				
				return values;
			}

			public String charsetEncode( String str, String orgCharsetName, String newCharsetName )
			{
				if( str == null ) {
					return null;
				}
				try {
					
					if( orgCharsetName == null || orgCharsetName.length() == 0 ) {
						return new String(str.getBytes(), newCharsetName);
					} else {
						return new String(str.getBytes(orgCharsetName), newCharsetName);
					}
				} catch(UnsupportedEncodingException e) {
					e.printStackTrace();
					return str + " [E]";
				}
			}


		};
	}	
}
