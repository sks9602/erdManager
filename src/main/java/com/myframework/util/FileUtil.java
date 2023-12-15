package com.myframework.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.FileCopyUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileUtil {

	public static String download(HttpServletRequest request, HttpServletResponse response, String originalFileName, String uploadedRealPath, String saveFileName) throws Exception {

		response.setContentType(request.getSession().getServletContext().getMimeType(uploadedRealPath));
		String fileName = setDisposition(originalFileName, request, response);

		uploadedRealPath = uploadedRealPath + File.separator + saveFileName;
		
		File file = new File(uploadedRealPath);
		FileInputStream fileIn = null;
		ServletOutputStream out = response.getOutputStream();

		try {
			fileIn = new FileInputStream(file);

			FileCopyUtils.copy(fileIn, out);
		} catch (Exception e) {
			e.printStackTrace();
		}  finally {
			if (fileIn != null) {
				fileIn.close();
			}
			out.flush();
			out.close();
		}

		return fileName;
	}

	private static String getBrowser(HttpServletRequest request) {
		String header = request.getHeader("User-Agent");
		if (header.indexOf("MSIE") > -1) {
			return "MSIE";
		} else if (header.indexOf("Trident") > -1) { // IE11 문자열 깨짐 방지
			return "Trident";
		} else if (header.indexOf("Chrome") > -1) {
			return "Chrome";
		} else if (header.indexOf("Opera") > -1) {
			return "Opera";
		}
		return "Firefox";
	}

	private static String setDisposition(String filename, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String browser = getBrowser(request);

		String dispositionPrefix = "attachment; filename=";
		String encodedFilename = null;

		if (browser.equals("MSIE")) {
			encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
		} else if (browser.equals("Trident")) { // IE11 문자열 깨짐 방지
			encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
		} else if (browser.equals("Firefox")) {
			encodedFilename = "\"" + new String(filename.getBytes("UTF-8"), "8859_1") + "\"";
		} else if (browser.equals("Opera")) {
			encodedFilename = "\"" + new String(filename.getBytes("UTF-8"), "8859_1") + "\"";
		} else if (browser.equals("Chrome")) {
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < filename.length(); i++) {
				char c = filename.charAt(i);
				if (c > '~') {
					sb.append(URLEncoder.encode("" + c, "UTF-8"));
				} else {
					sb.append(c);
				}
			}
			encodedFilename = sb.toString();
		} else {
			throw new IOException("Not supported browser");
		}

		response.setHeader("Content-Disposition", dispositionPrefix + encodedFilename);

		if ("Opera".equals(browser)) {
			response.setContentType("application/octet-stream;charset=UTF-8");
		}

		return encodedFilename;
	}



	public static void delete(String deleteRealPath) {
		// 경로
		File fileData = new File(deleteRealPath);

		// 파일 존재 여부
		if (fileData.exists()) {
			fileData.delete();
		}
	}


}