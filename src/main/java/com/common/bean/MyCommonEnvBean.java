package com.common.bean;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="mycommon")
public class MyCommonEnvBean {

	private String fileStorePath;
	private String attachImgsContext;
	private List<String> extMapZip = new ArrayList<String>();
	private List<String> extMapOffice = new ArrayList<String>();
	private List<String> extMapImg = new ArrayList<String>();

	public String getAttachImgsContext() {
		return attachImgsContext;
	}

	public void setAttachImgsContext(String attachImgsContext) {
		this.attachImgsContext = attachImgsContext;
	}
	
	public void setFileStorePath(String fileStorePath) {
		 this.fileStorePath = fileStorePath;
	}
	
	public String getFileStorePath() {
		return this.fileStorePath;
	}
	
	public void setExtListZip(List<String> extMapZip) {
		this.extMapZip = extMapZip;
	}
	
	public List<String> getExtListZip() {
		return this.extMapZip;
	}

	public void setExtListOffice(List<String> extMapOffice) {
		this.extMapOffice = extMapOffice;
	}
	
	public List<String> getExtListOffice() {
		return this.extMapOffice;
	}

	public void setExtListImg(List<String> extMapImg) {
		this.extMapImg = extMapImg;
	}
	
	public List<String> getExtListImg() {
		return this.extMapImg;
	}


}
