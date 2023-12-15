package com.myframework.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ExcelUtil {

	/**
	 * 다운로드용 엑셀 파일로 응답값을 전달한다.
	 *
	 * @param response
	 * @param fileName : 다운로드될 파일 명
	 * @param field : Excel 의 Cell 로 입력될 필드 목록
	 * @param data : 생성될 데이터
	 * @param labelMapper : 헤더의 필드명이 실제 data row 와 맵핑되지 않을 경우 사용되는 맵퍼
	 * @throws IOException
	 */
	public static void createDownloadExcel(HttpServletResponse response, String fileName,
			List<String> field, List<Map<String, Object>> data, Map<String, String> labelMapper)
			throws IOException {
		response.setContentType("application/vnd.ms-excel");

		// creates mock data
		String headerKey = "Content-Disposition";
		String headerValue = String.format("attachment; filename=\"%s\"", fileName);
		response.setHeader(headerKey, headerValue);
		createExcelFile(response.getOutputStream(), field, data, labelMapper);
	}

	// 공용기술개발실적 엑셀다운로드
	public static void createDownloadExcel2(HttpServletResponse response, String fileName,
			List<String> field, List<Map<String, Object>> data, Map<String, String> labelMapper)
			throws IOException {
		response.setContentType("application/vnd.ms-excel");

		// creates mock data
		String headerKey = "Content-Disposition";
		String headerValue = String.format("attachment; filename=\"%s\"", fileName);
		response.setHeader(headerKey, headerValue);
		createExcelFile2(response.getOutputStream(), field, data, labelMapper);
	}

	// 학교기업운영현황 엑셀다운로드
	public static void createDownloadExcel3(HttpServletResponse response, String fileName,
			List<String> field, List<Map<String, Object>> data, Map<String, String> labelMapper)
			throws IOException {
		response.setContentType("application/vnd.ms-excel");

		// creates mock data
		String headerKey = "Content-Disposition";
		String headerValue = String.format("attachment; filename=\"%s\"", fileName);
		response.setHeader(headerKey, headerValue);
		createExcelFile3(response.getOutputStream(), field, data, labelMapper);
	}

	/**
	 * 다운로드용 엑셀 파일로 응답값을 전달한다.
	 *
	 * @param request
	 * @param fileName : 다운로드될 파일 명
	 * @param field : Excel 의 Cell 로 입력될 필드 목록
	 * @param data : 생성될 데이터
	 * @param labelMapper : 헤더의 필드명이 실제 data row 와 맵핑되지 않을 경우 사용되는 맵퍼
	 * @throws IOException
	 */
	public static String createDownloadExcel(HttpServletRequest request, String fileName,
			List<String> field, List<Map<String, Object>> data, Map<String, String> labelMapper)
			throws IOException {
		String uploadRealPath = request.getSession().getServletContext().getRealPath("")
				+ "/errorFile";
		// 경로
		File fileData = new File(uploadRealPath);

		// 해당 디렉토리의 존재여부를 확인
		if (!fileData.exists()) {
			// 없다면 생성
			fileData.mkdirs();
		}

		FileOutputStream out = new FileOutputStream(uploadRealPath + "/" + fileName);
		createExcelFile(out, field, data, labelMapper);
		out.close();
		
		return fileName;
	}

	// 공용기술개발실적 엑셀 다운로드
	private static void createExcelFile2(OutputStream output, List<String> field,
			List<Map<String, Object>> data, Map<String, String> labelMapper) throws IOException {
		// WorkBook 생성
		Workbook xlsxWb = new XSSFWorkbook(); // Excel 2007 이후버젼

		// WorkSheet 생성
		XSSFSheet sheet = (XSSFSheet) xlsxWb.createSheet("Sheet1");

		// 쎌 스타일
		CellStyle headerStyle = xlsxWb.createCellStyle();
		headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
		headerStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headerStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);

		CellStyle bodyStyle = xlsxWb.createCellStyle();
		bodyStyle.setAlignment(CellStyle.ALIGN_CENTER);
		bodyStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		Row row = null;
		Cell cell = null;

		try {
			// 헤더
			int numField = field.size();
			row = sheet.createRow(0);
			for (int i = 0; i < 8; i++) {
				String l = null;
				if (labelMapper != null) {
					l = labelMapper.get(field.get(i));
				} else {
					l = field.get(i);
				}

				cell = row.createCell(i);
				cell.setCellValue(l);
				// addMergedRegion 셀병합
				sheet.addMergedRegion(new CellRangeAddress(0, 1, i, i));
				cell.setCellStyle(headerStyle);
			}
			cell = row.createCell(8);
			cell.setCellValue(new XSSFRichTextString("연구비 금액"));
			cell.setCellStyle(headerStyle);
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 8, 13));

			for (int i = 14; i < 17; i++) {
				String l = null;
				if (labelMapper != null) {
					l = labelMapper.get(field.get(i));
				} else {
					l = field.get(i);
				}

				cell = row.createCell(i);
				cell.setCellValue(l);
				// addMergedRegion 셀병합
				sheet.addMergedRegion(new CellRangeAddress(0, 1, i, i));
				cell.setCellStyle(headerStyle);
			}

			row = sheet.createRow(1);
			for (int i = 8; i < 14; i++) {
				String l = null;
				if (labelMapper != null) {
					l = labelMapper.get(field.get(i));
				} else {
					l = field.get(i);
				}

				cell = row.createCell(i);
				cell.setCellValue(l);
				cell.setCellStyle(headerStyle);
			}
			int numData = data.size();
			for (int i = 0; i < numData; i++) {
				Map<String, Object> tem = data.get(i);

				row = sheet.createRow(i + 2);
				for (int j = 0; j < numField; j++) {
					Object value = tem.get(field.get(j));
					if (value == null || value.equals("null")) {
						value = "";
					}
					cell = row.createCell(j);
					cell.setCellValue(String.valueOf(value));
					cell.setCellStyle(bodyStyle);
					cell.setCellType(Cell.CELL_TYPE_STRING);
				}
			}
			// 컬럼 사이즈 조정
			for (int i = 0; i < numField; i++) {
				// 열넓이 설정 (열 위치, 넓이)
				sheet.autoSizeColumn(i);
				// cell is 255 chararcters 에러 원인
				sheet.setColumnWidth(i, (sheet.getColumnWidth(i)) + 2048); // 윗줄만으로는
																			// 컬럼의
																			// width
																			// 가
																			// 부족하여
																			// 더
																			// 늘려야
																			// 함.
			}
			// WorkSheet 쓰기
			xlsxWb.write(output);

		} catch (Exception e) {
			log.error("{}", e);
		} finally {
			output.close();
			// xlsxWb.close();
		}

	}

	// 학교기업운영현황 엑셀 다운로드
	private static void createExcelFile3(OutputStream output, List<String> field,
			List<Map<String, Object>> data, Map<String, String> labelMapper) throws IOException {
		// WorkBook 생성
		Workbook xlsxWb = new XSSFWorkbook(); // Excel 2007 이후버젼

		// WorkSheet 생성
		XSSFSheet sheet = (XSSFSheet) xlsxWb.createSheet("Sheet1");

		// 쎌 스타일
		CellStyle headerStyle = xlsxWb.createCellStyle();
		headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
		headerStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headerStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);

		CellStyle bodyStyle = xlsxWb.createCellStyle();
		bodyStyle.setAlignment(CellStyle.ALIGN_CENTER);
		bodyStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		Row row = null;
		Cell cell = null;

		try {
			// 헤더
			int numField = field.size();
			row = sheet.createRow(0);
			for (int i = 0; i < 8; i++) {
				String l = null;
				if (labelMapper != null) {
					l = labelMapper.get(field.get(i));
				} else {
					l = field.get(i);
				}

				cell = row.createCell(i);
				cell.setCellValue(l);
				// addMergedRegion 셀병합
				sheet.addMergedRegion(new CellRangeAddress(0, 1, i, i));
				cell.setCellStyle(headerStyle);
			}
			cell = row.createCell(8);
			cell.setCellValue(new XSSFRichTextString("연간투자액(원)"));
			cell.setCellStyle(headerStyle);
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 8, 9));

			cell = row.createCell(10);
			cell.setCellValue(new XSSFRichTextString("자산(원)"));
			cell.setCellStyle(headerStyle);
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 10, 12));

			row = sheet.createRow(1);
			for (int i = 8; i < 13; i++) {
				String l = null;
				if (labelMapper != null) {
					l = labelMapper.get(field.get(i));
				} else {
					l = field.get(i);
				}

				cell = row.createCell(i);
				cell.setCellValue(l);
				cell.setCellStyle(headerStyle);
			}
			int numData = data.size();
			for (int i = 0; i < numData; i++) {
				Map<String, Object> tem = data.get(i);

				row = sheet.createRow(i + 2);
				for (int j = 0; j < numField; j++) {
					Object value = tem.get(field.get(j));
					if (value == null || value.equals("null")) {
						value = "";
					}
					cell = row.createCell(j);
					cell.setCellValue(String.valueOf(value));
					cell.setCellStyle(bodyStyle);
					cell.setCellType(Cell.CELL_TYPE_STRING);
				}
			}
			// 컬럼 사이즈 조정
			for (int i = 0; i < numField; i++) {
				// 열넓이 설정 (열 위치, 넓이)
				sheet.autoSizeColumn(i);
				// cell is 255 chararcters 에러 원인
				sheet.setColumnWidth(i, (sheet.getColumnWidth(i)) + 2048); // 윗줄만으로는
																			// 컬럼의
																			// width
																			// 가
																			// 부족하여
																			// 더
																			// 늘려야
																			// 함.
			}
			// WorkSheet 쓰기
			xlsxWb.write(output);

		} catch (Exception e) {
			log.error("{}", e);
		} finally {
			output.close();
			// xlsxWb.close();
		}

	}



	/**
	 * @param output
	 * @param field
	 * @param data
	 * @param labelMapper
	 * @throws IOException
	 */
	private static void createExcelFile(OutputStream output, List<String> field,
			List<Map<String, Object>> data, Map<String, String> labelMapper) throws IOException {
		// WorkBook 생성
		Workbook xlsxWb = new XSSFWorkbook(); // Excel 2007 이후버젼
		// WorkSheet 생성
		XSSFSheet sheet = (XSSFSheet) xlsxWb.createSheet("Sheet1");

		// 쎌 스타일
		CellStyle headerStyle = xlsxWb.createCellStyle();
		headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
		headerStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headerStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);

		CellStyle bodyStyle = xlsxWb.createCellStyle();
		bodyStyle.setAlignment(CellStyle.ALIGN_CENTER);
		bodyStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		Row row = null;
		Cell cell = null;

		try {
			// 헤더
			int numField = field.size();
			row = sheet.createRow(0);
			for (int i = 0; i < numField; i++) {
				String l = null;
				if (labelMapper != null) {
					l = labelMapper.get(field.get(i));
				} else {
					l = field.get(i);
				}

				cell = row.createCell(i);
				cell.setCellValue(l);
				cell.setCellStyle(headerStyle);

			}

			int numData = data.size();
			for (int i = 0; i < numData; i++) {
				Map<String, Object> tem = data.get(i);

				row = sheet.createRow(i + 1);
				for (int j = 0; j < numField; j++) {
					Object value = tem.get(field.get(j));
					if (value == null || value.equals("null")) {
						value = "";
					}
					cell = row.createCell(j);
					cell.setCellValue(String.valueOf(value));
					cell.setCellStyle(bodyStyle);
					cell.setCellType(Cell.CELL_TYPE_STRING);
				}
			}
			// 컬럼 사이즈 조정
			for (int i = 0; i < numField; i++) {
				// 열넓이 설정 (열 위치, 넓이)
				sheet.autoSizeColumn(i);
				// cell is 255 chararcters 에러 원인
				// sheet.setColumnWidth( i, (sheet.getColumnWidth(i))+1024 ); //
				// 윗줄만으로는 컬럼의 width 가 부족하여 더 늘려야 함.
			}
			// WorkSheet 쓰기
			xlsxWb.write(output);

		} catch (Exception e) {
			log.error("{}", e);
		} finally {
			// xlsxWb.close();
		}

	}

	/**
	 * 입력된 데이터를 Java 객체화 한다.
	 *
	 * @param input
	 * @param field 반환되는 리스트 원소 객체의 필드명에 맵핑
	 * @param labelMapper 헤더의 필드명이 반환 객체의 필드명과 일치하지 않을 경우 참조할 맵퍼
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String, Object>> parseDataFromUploadFile(InputStream input,
			List<String> field, Map<String, String> labelMapper) throws Exception {
		// NPOIFSFileSystem fs = new NPOIFSFileSystem(input);
		// Workbook workbook = new HSSFWorkbook(fs.getRoot(), true);
		Workbook workbook = new XSSFWorkbook(input);
		Sheet sheet = workbook.getSheetAt(0);

		int numRow = sheet.getLastRowNum();

		// 필드에 맵핑되는 인덱스를 정리
		Iterator<String> keys = null;
		List<Integer> indexer = null;
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

		try {
			Row row = null;
			Cell cell = null;
			for (int i = 0; i <= numRow; i++) {
				row = sheet.getRow(i);
				if (keys == null) {
					// 헤더 파싱
					if (labelMapper != null) {
						// 라벨에 맵핑이 되어 있다면, 맵핑된 텍스트를 기준으로 인덱스를 탐색한다 .
						keys = labelMapper.values().iterator();
					} else {
						keys = field.iterator();
					}

					indexer = new ArrayList<Integer>();

					while (keys.hasNext()) {
						String fieldLabel = keys.next();
						for (int j = 0; j <= row.getLastCellNum(); j++) {
							cell = row.getCell(j, Row.RETURN_BLANK_AS_NULL);
							if (cell != null && fieldLabel.equals(cell.getStringCellValue())) {
								indexer.add(j);
								break;
							}
						}
					}
				} else {
					// 바디 파싱
					Map<String, Object> map = new HashMap<String, Object>();
					for (int j = 0; j < indexer.size(); j++) {
						cell = row.getCell(j, Row.RETURN_BLANK_AS_NULL);
						String fn = field.get(j);
						System.out.println("################# field.get(j)  = " + field.get(j));
						if (cell != null) {
							Object v = null;



							switch (cell.getCellType()) {
							case Cell.CELL_TYPE_STRING:
								v = cell.getStringCellValue();
								break;
							case Cell.CELL_TYPE_NUMERIC:
								if (DateUtil.isCellDateFormatted(cell)) {
									Date date = cell.getDateCellValue();
									v = String.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(date));
									System.out.println("################# date  = " + date);
									System.out.println("################# v  = " + v);
								} else {
									double numericValue = cell.getNumericCellValue();
									System.out.println("################# numericValue = " + numericValue);
									double fp = numericValue - (int) numericValue;
									System.out.println("################# fp = " + fp);
									// 소수의 소수부만 추출한다. 여기서 .00이라면 int형으로 아니면 double로 처리 한다.
									if ( fp != 0 ){
										v = numericValue;
									}else{
										int temp = (int)numericValue;
										v = String.valueOf(temp);
									}
								}
								break;
							case Cell.CELL_TYPE_BLANK:
								v = "";
								break;
							case Cell.CELL_TYPE_BOOLEAN:
								v = cell.getBooleanCellValue();
								break;
							case Cell.CELL_TYPE_ERROR:
								v = cell.getErrorCellValue();
								break;
							case Cell.CELL_TYPE_FORMULA:
								v = cell.getCellFormula();
								break;
							}
							map.put(fn, v);
						} else {
							map.put(fn, "");
						}
					}
					result.add(map);
				}
			}
		} finally {
			input.close();
			// workbook.close();
		}

		return result;
	}

	// *****************************************************************************************************************************************
	// 엑셀 다운로드 시트 추가하기_동아리관리 엑셀다운에서 사용
	public static void createDownloadExcelSheet(HttpServletResponse response, String fileName,
			List<List<String>> fieldAll, List<List<Map<String, Object>>> dataAll,
			List<Map<String, String>> labelMapperAll, List<String> sheetName) throws IOException {
		response.setContentType("application/vnd.ms-excel");

		// creates mock data
		String headerKey = "Content-Disposition";
		String headerValue = String.format("attachment; filename=\"%s\"", fileName);
		response.setHeader(headerKey, headerValue);
		// createExcelFile( response.getOutputStream(), field, data,
		// labelMapper);
		createExcelFileSheet(response.getOutputStream(), fieldAll, dataAll, labelMapperAll,
				sheetName);
	}

	// 엑셀 다운로드 시트 추가하기_동아리관리 엑셀다운에서 사용
	private static void createExcelFileSheet(OutputStream output, List<List<String>> fieldAll,
			List<List<Map<String, Object>>> dataAll, List<Map<String, String>> labelMapperAll,
			List<String> sheetName) throws IOException {
		// WorkBook 생성
		Workbook xlsxWb = new XSSFWorkbook(); // Excel 2007 이후버젼

		// 쎌 스타일
		CellStyle headerStyle = xlsxWb.createCellStyle();
		headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
		headerStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headerStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);

		CellStyle bodyStyle = xlsxWb.createCellStyle();
		bodyStyle.setAlignment(CellStyle.ALIGN_CENTER);
		bodyStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		Row row = null;
		Cell cell = null;

		try {
			// 헤더
			for (int a = 0; a < fieldAll.size(); a++) {

				// WorkSheet 생성
				XSSFSheet sheet = (XSSFSheet) xlsxWb.createSheet(sheetName.get(a));
				// field 리스트에서 field 하나를 가지고 온다
				List<String> field = fieldAll.get(a);
				// labelMapper 리스트에서 labelMapper 하나를 가지고 온다
				Map<String, String> labelMapper = labelMapperAll.get(a);
				// data 리스트에서 data 하나를 가지고 온다
				List<Map<String, Object>> data = dataAll.get(a);

				int numField = field.size();
				row = sheet.createRow(0);
				for (int i = 0; i < numField; i++) {
					String l = null;
					if (labelMapper != null) {
						l = labelMapper.get(field.get(i));
					} else {
						l = field.get(i);
					}

					cell = row.createCell(i);
					cell.setCellValue(l);
					cell.setCellStyle(headerStyle);
				}
				int numData = data.size();
				for (int i = 0; i < numData; i++) {
					Map<String, Object> tem = data.get(i);

					row = sheet.createRow(i + 1);
					for (int j = 0; j < numField; j++) {
						Object value = tem.get(field.get(j));
						if (value == null || value.equals("null")) {
							value = "";
						}
						cell = row.createCell(j);
						cell.setCellValue(String.valueOf(value));
						cell.setCellStyle(bodyStyle);
						cell.setCellType(Cell.CELL_TYPE_STRING);
					}
				}
				// 컬럼 사이즈 조정
				for (int i = 0; i < numField; i++) {
					// 열넓이 설정 (열 위치, 넓이)
					sheet.autoSizeColumn(i);
					// cell is 255 chararcters 에러 원인
					sheet.setColumnWidth(i, (sheet.getColumnWidth(i)) + 1024); // 윗줄만으로는
																				// 컬럼의
																				// width
																				// 가
																				// 부족하여
																				// 더
																				// 늘려야
																				// 함.
				}

			} // for a

			// WorkSheet 쓰기
			xlsxWb.write(output);

		} catch (Exception e) {
			log.error("{}", e);
		} finally {
			output.close();
			// xlsxWb.close();
		}

	}

	/**
	 * [ 학생 지원 관리 > 동아리 현황 ] - 엑셀 샘플다운로드 xls로
	 */
	public static void createDownloadExcelSheetXls(HttpServletResponse response, String fileName,
			List<List<String>> fieldAll, List<List<Map<String, Object>>> dataAll,
			List<Map<String, String>> labelMapperAll, List<String> sheetName) throws IOException {

		response.setContentType("application/vnd.ms-excel");

		// creates mock data
		String headerKey = "Content-Disposition";
		String headerValue = String.format("attachment; filename=\"%s\"", fileName);
		response.setHeader(headerKey, headerValue);
		// createExcelFile( response.getOutputStream(), field, data,
		// labelMapper);
		createExcelFileSheetXls(response.getOutputStream(), fieldAll, dataAll, labelMapperAll,
				sheetName);

	}

	/**
	 * [ 학생 지원 관리 > 동아리 현황 ] - 엑셀 샘플 다운로드 xls로
	 */
	public static void createExcelFileSheetXls(OutputStream output, List<List<String>> fieldAll,
			List<List<Map<String, Object>>> dataAll, List<Map<String, String>> labelMapperAll,
			List<String> sheetName) throws IOException {

		// WorkBook 생성
		Workbook xlsWb = new HSSFWorkbook(); // Excel 2007 이전 버전

		// 쎌 스타일
		CellStyle headerStyle = xlsWb.createCellStyle();
		headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
		headerStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headerStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);

		CellStyle bodyStyle = xlsWb.createCellStyle();
		bodyStyle.setAlignment(CellStyle.ALIGN_CENTER);
		bodyStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		Row row = null;
		Cell cell = null;

		try {
			// 헤더
			for (int a = 0; a < fieldAll.size(); a++) {

				// WorkSheet 생성
				// XSSFSheet sheet = (XSSFSheet) xlsWb.createSheet(sheetName.get(a));

				HSSFSheet sheet = (HSSFSheet) xlsWb.createSheet(sheetName.get(a));
				// field 리스트에서 field 하나를 가지고 온다
				List<String> field = fieldAll.get(a);
				// labelMapper 리스트에서 labelMapper 하나를 가지고 온다
				Map<String, String> labelMapper = labelMapperAll.get(a);
				// data 리스트에서 data 하나를 가지고 온다
				List<Map<String, Object>> data = dataAll.get(a);

				int numField = field.size();
				row = sheet.createRow(0);
				for (int i = 0; i < numField; i++) {
					String l = null;
					if (labelMapper != null) {
						l = labelMapper.get(field.get(i));
					} else {
						l = field.get(i);
					}

					cell = row.createCell(i);
					cell.setCellValue(l);
					cell.setCellStyle(headerStyle);
				}
				int numData = data.size();
				for (int i = 0; i < numData; i++) {
					Map<String, Object> tem = data.get(i);

					row = sheet.createRow(i + 1);
					for (int j = 0; j < numField; j++) {
						Object value = tem.get(field.get(j));
						if (value == null || value.equals("null")) {
							value = "";
						}
						cell = row.createCell(j);
						cell.setCellValue(String.valueOf(value));
						cell.setCellStyle(bodyStyle);
						cell.setCellType(Cell.CELL_TYPE_STRING);
					}
				}
				// 컬럼 사이즈 조정
				for (int i = 0; i < numField; i++) {
					// 열넓이 설정 (열 위치, 넓이)
					sheet.autoSizeColumn(i);
					// cell is 255 chararcters 에러 원인
					sheet.setColumnWidth(i, (sheet.getColumnWidth(i)) + 1024); // 윗줄만으로는
																				// 컬럼의
																				// width
																				// 가
																				// 부족하여
																				// 더
																				// 늘려야
																				// 함.
				}

			} // for a

			// WorkSheet 쓰기
			xlsWb.write(output);

		} catch (Exception e) {
			log.error("{}", e);
		} finally {
			output.close();
			// xlsWb.close();
		}

	}

	/**
	 * 엑셀 샘플다운로드 xlsx로
	 */
	public static void createDownloadExcelSheetXlsx(HttpServletResponse response, String fileName,
			List<List<String>> fieldAll, List<List<Map<String, Object>>> dataAll,
			List<Map<String, String>> labelMapperAll, List<String> sheetName) throws IOException {

		response.setContentType("application/vnd.ms-excel");

		// creates mock data
		String headerKey = "Content-Disposition";
		String headerValue = String.format("attachment; filename=\"%s\"", fileName);
		response.setHeader(headerKey, headerValue);
		// createExcelFile( response.getOutputStream(), field, data,
		// labelMapper);
		createExcelFileSheetXlsx(response.getOutputStream(), fieldAll, dataAll, labelMapperAll,
				sheetName);

	}

	/**
	 * 엑셀 샘플 다운로드 xlsx로
	 */
	public static void createExcelFileSheetXlsx(OutputStream output, List<List<String>> fieldAll,
			List<List<Map<String, Object>>> dataAll, List<Map<String, String>> labelMapperAll,
			List<String> sheetName) throws IOException {

		// WorkBook 생성
		Workbook xlsxWb = new XSSFWorkbook(); // Excel 2007 이후버젼

		// 쎌 스타일
		CellStyle headerStyle = xlsxWb.createCellStyle();
		headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
		headerStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headerStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);

		CellStyle bodyStyle = xlsxWb.createCellStyle();
		bodyStyle.setAlignment(CellStyle.ALIGN_CENTER);
		bodyStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

		Row row = null;
		Cell cell = null;

		try {
			// 헤더
			for (int a = 0; a < fieldAll.size(); a++) {

				// WorkSheet 생성
				XSSFSheet sheet = (XSSFSheet) xlsxWb.createSheet(sheetName.get(a));

				// HSSFSheet sheet = (HSSFSheet) xlsWb.createSheet(sheetName.get(a));
				// field 리스트에서 field 하나를 가지고 온다
				List<String> field = fieldAll.get(a);
				// labelMapper 리스트에서 labelMapper 하나를 가지고 온다
				Map<String, String> labelMapper = labelMapperAll.get(a);
				// data 리스트에서 data 하나를 가지고 온다
				List<Map<String, Object>> data = dataAll.get(a);

				int numField = field.size();
				row = sheet.createRow(0);
				for (int i = 0; i < numField; i++) {
					String l = null;
					if (labelMapper != null) {
						l = labelMapper.get(field.get(i));
					} else {
						l = field.get(i);
					}

					cell = row.createCell(i);
					cell.setCellValue(l);
					cell.setCellStyle(headerStyle);
				}
				int numData = data.size();
				for (int i = 0; i < numData; i++) {
					Map<String, Object> tem = data.get(i);

					row = sheet.createRow(i + 1);
					for (int j = 0; j < numField; j++) {
						Object value = tem.get(field.get(j));
						if (value == null || value.equals("null")) {
							value = "";
						}
						cell = row.createCell(j);
						cell.setCellValue(String.valueOf(value));
						cell.setCellStyle(bodyStyle);
						cell.setCellType(Cell.CELL_TYPE_STRING);
					}
				}
				// 컬럼 사이즈 조정
				for (int i = 0; i < numField; i++) {
					// 열넓이 설정 (열 위치, 넓이)
					sheet.autoSizeColumn(i);
					// cell is 255 chararcters 에러 원인
					// 윗줄만으로는 컬럼의 width가 부족하여 더 늘려야함.
					sheet.setColumnWidth(i, (sheet.getColumnWidth(i)) + 1024);
				}
				
				// 자격증,어학,동아리 양식다운로드 엑셀에 메모 추가
				if (sheetName.contains("certi_form_") || sheetName.contains("lang_form_") || sheetName.contains("club_form_")) {
					// 메모 (첫번째 sheet에만 메모 추가)
					if(a == 0) {
						Drawing drawing = cell.getSheet().createDrawingPatriarch();
						ClientAnchor anchor = null;

						// 메모크기(0,0,0,0,col,row,col,row)
						if (sheetName.contains("certi_form_") || sheetName.contains("lang_form_")) {
							anchor = drawing.createAnchor(0, 0, 0, 0, 7, 0, 17, 34);
						} else if (sheetName.contains("club_form_")) {
							anchor = drawing.createAnchor(0, 0, 0, 0, 9, 0, 18, 34);
						}
						Comment comment = drawing.createCellComment(anchor);
						comment.setVisible(true);

						// 메모내용
						RichTextString textString
						= new XSSFRichTextString("※ 신규로 자격증/어학을 등록하는 경우\n-. 자격증/어학 코드는 반드시 빈칸으로, '필수입력'으로 표시한 항목은 반드시 기재\n\n"
								+ "※ 등록한 자격증/어학을 수정하는 경우\n-. 수정하려는 자격증/어학의 '자격증코드/어학코드'를 '자격증 코드 sheet/어학 코드 sheet'에서 참조하여 반드시 기재, "
								+ "'필수입력'으로 표시한 항목 역시 반드시 기재\n\n"
								+ "※ 상기 조건을 만족한다면, 신규 등록 및 수정작업을 하나의 엑셀 파일에서 동시에 업로드 가능\n\n"
								+ "* 구분\n-. 자격증 : CERTI\n-. 어학 : LANG\n\n* ");
						comment.setString(textString);
					}
				// 수상실적 샘플 다운로드 엑셀에 메모 추가
				}
			} // for a

			// WorkSheet 쓰기
			xlsxWb.write(output);

		} catch (Exception e) {
			log.error("{}", e);
		} finally {
			output.close();
			// xlsxWb.close();
		}

	}
	
}
