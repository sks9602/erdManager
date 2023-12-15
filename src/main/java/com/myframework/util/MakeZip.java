package com.myframework.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MakeZip {
	
	
	/**
	 *
	 */
	private List<Map<String, Object>> fileMapList = null;
	
	private static final int MAX_SIZE = 1024;
	
	/**
	 * 
	 * @param fileMapList
	 */
	public void setFilesList(List<Map<String, Object>> fileMapList ) {
		this.fileMapList = fileMapList;
	}

	
	/**
	 * 
	 * @param fileMapList
	 */
	public void setFilesList(SqlResultList<SqlResultMap<String,Object>> sqlFileMapList ) {
		this.fileMapList = new ArrayList<Map<String, Object>>();
		
		for( SqlResultMap<String, Object> sqlFileMap : sqlFileMapList ) {
			this.fileMapList.add(sqlFileMap);
		}
	}
	/**
	 * 
	 * @param path 
	 * @param zipFileName
	 */
	public void zip(String path, String zipFileName) {

		zip(path, zipFileName, false);
	}
	/**
	 * 
	 * @param path 
	 * @param zipFileName
	 */
	public void zip(String path, String zipFileName, boolean isStudent) {
		ZipOutputStream outputStream = null;
		FileInputStream fileInputStream = null;
		
		byte[] buf = new byte[MAX_SIZE];

		try {
			
			File dir = new File(path);
			
			if( !dir.exists() ) {
				dir.mkdirs();
			}
			
			outputStream = new ZipOutputStream(new FileOutputStream(path+"/"+zipFileName));

			String fileName = null;
			String entryFileName = null;

			log.info(fileMapList.toString());
			
			for (Map<String, Object> fileMap : fileMapList) {

				log.info(fileMap.toString());
				
				fileName = fileMap.get("fimFilePath").toString()+"/"+fileMap.get("fimFileName").toString();
				
				File file = new File(fileName);
				log.info("file : " + fileName + ":" + file.exists());
				
				if( file.exists() ) {
					fileInputStream = new FileInputStream(fileName);
					if( isStudent ) {
						entryFileName = "[" + fileMap.get("dprtCdNm").toString() +"_"+ fileMap.get("stdtNm").toString() +"("+ fileMap.get("stdt").toString() +")]"+ fileMap.get("fimFileOrgName").toString();
					} else {
						entryFileName = fileMap.get("fimFileOrgName").toString();
					}
					outputStream.putNextEntry(new ZipEntry(entryFileName));
	
					int length = 0;
					while (((length = fileInputStream.read()) > 0)) {
						outputStream.write(buf, 0, length);
					}
					outputStream.closeEntry();
					fileInputStream.close();
				}
			}
			outputStream.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				outputStream.closeEntry();
				outputStream.close();
				fileInputStream.close();
			} catch (IOException e) {
				
			}
		}
	}
}
