package com.myframework.was.file.handler.vo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@ToString
public class MultipartFileVO {

	// 첨부파일 파라미터 명
	private String name = null;
	// 첨부파일
	private String fimFileId = null;
	
	// 추가되는 private  순번 List
	private List<String> fimSubFileId = new ArrayList<String>();

	// 삭제된느 첨부파일 순번 List
	private List<String> deletedFimSubFileId = new ArrayList<String>();

	private String errorMessage;
	
	private boolean success = false;
	
	public void setFimSubFileId(String attfSno) {
		this.fimSubFileId.add(attfSno);
	}
	
	public void setDeletedFimSubFileId(String[] deletedFimSubFileId) {
		this.deletedFimSubFileId.addAll(Arrays.asList(deletedFimSubFileId));
	}

}
