package com.myframework.util;

public enum GlobalEnum {

	/*=== API KEY ===*/
	/** 워크넷 (채용 정보 | 공채 속보) */
	WORKNET_AUTH_KEY("WNKM1IWPDBC67LL4CLSAE2VR1HJ"),


	/*=== 진단 타입 구분값 ===*/
	/** 진단 타입_핵심역량 */
	DIAG_TYPE01("CORE"),
	/** 진단 타입_전공역량 */
	DIAG_TYPE02("MAJOR"),

	/** 역량 코드 */
	ABILTY_SCORE_0("A000"),
	ABILTY_SCORE_1("A001"),
	ABILTY_SCORE_2("A002"),
	ABILTY_SCORE_3("A003"),
	ABILTY_SCORE_4("A004"),
	ABILTY_SCORE_5("A005"),
	ABILTY_SCORE_6("A006"),

	/*=== 상담 대분류 구분값 ===*/
	/** 상담 대분류 그룹 */
	CNS_GUBUN("CNSGB00"),
	/** 사제동행 상담 */
	CNS_GUBUN_01("CNSGB01"),
	/** 심리 상담 */
	CNS_GUBUN_02("CNSGB02"),
	/** 진로 및 취창업 상담 */
	CNS_GUBUN_03("CNSGB03"),
	/** 학습 상담 */
	CNS_GUBUN_04("CNSGB04"),

	/*=== 온라인 상담 상태 ===*/
	/** 온라인 상담 상태 그룹 */
	ON_CNS_STATE("ONSTS00"),
	/** 상담대기 */
	ON_CNS_STATE1("ONSTS01"),
	/** 상담완료 */
	ON_CNS_STATE2("ONSTS02"),
	/** 학생취소 */
	ON_CNS_STATE3("ONSTS03"),
	/** 관리자취소 */
	ON_CNS_STATE4("ONSTS04"),

	/*=== 방문 상담 상태 ===*/
	/** 방문 상담 상태 그룹 */
	OFF_CNS_STATE("OFFSTS00"),
	/** 상담대기 */
	OFF_CNS_STATE1("OFFSTS01"),
	/** 상담완료 */
	OFF_CNS_STATE2("OFFSTS02"),
	/** 불참 */
	OFF_CNS_STATE3("OFFSTS03"),
	/** 학생취소 */
	OFF_CNS_STATE4("OFFSTS04"),
	/** 관리자취소 */
	OFF_CNS_STATE5("OFFSTS05"),

	/*=== 사제동행 방문 상담 구분 ===*/
	/** 사제동행 방문 상담 구분 그룹 */
	CNS_PROF_DIV00("CNS_PROF_DIV00"),
	/** 학생 신청 */
	CNS_PROF_DIV01("CNS_PROF_DIV01"),
	/** 연계 상담 */
	CNS_PROF_DIV02("CNS_PROF_DIV02"),
	/** 직접 입력 */
	CNS_PROF_DIV03("CNS_PROF_DIV03"),

	/*=== 비교과 프로그램 상태 ===*/
	/** admin 프로그램 상태 관리 */
	/** 승인대기 0 */
	NCR_T05_P00("NCR_T05_P00"),
	/** 승인완료 1 */
	NCR_T05_P01("NCR_T05_P01"),
	/** 모집중 2 */
	NCR_T05_P02("NCR_T05_P02"),
	/** 모집마감 3 */
	NCR_T05_P03("NCR_T05_P03"),
	/** 운영중 4 */
	NCR_T05_P04("NCR_T05_P04"),
	/** 운영종료 5 */
	NCR_T05_P05("NCR_T05_P05"),
	/** 취소(승인전) 6 */
	NCR_T05_P06("NCR_T05_P06"),
	/** 취소(승인후) 7 */
	NCR_T05_P07("NCR_T05_P07"),
	/** 반려 8 */
	NCR_T05_P08("NCR_T05_P08"),
	/** 등록승인 9 */
	NCR_T05_P09("NCR_T05_P09"),
	/** 폐지 10 */
	NCR_T05_P10("NCR_T05_P10"),

	/** client 학생 신청 상태 관리 */
	NCR_T07("NCR_T07"),
	/** 학생 상태(대기신청) 0 */
	NCR_T07_P00("NCR_T07_P00"),
	/** 학생 상태(승인대기) 1 */
	NCR_T07_P01("NCR_T07_P01"),
	/** 학생 상태(승인) 2 */
	NCR_T07_P02("NCR_T07_P02"),
	/** 학생 상태(학생취소) 3 */
	NCR_T07_P03("NCR_T07_P03"),
	/** 학생 상태(관리자취소) 4 */
	NCR_T07_P04("NCR_T07_P04"),
	/** 학생 상태(이수) 5 */
	NCR_T07_P05("NCR_T07_P05"),
	/** 학생 상태(미이수) 6 */
	NCR_T07_P06("NCR_T07_P06"),
	/** 학생 상태(반려) 7 */
	NCR_T07_P07("NCR_T07_P07"),

	/** client 비교과 학생 신청 리스트 상태값 */

	/*
	 * 신청 가능 상태 코드 값을 우선 순위로 한다 NCR_T06_P01 -> NCR_T06_P00 NCR_T06_P00 -> NCR_T06_P01
	 */

	/** 비교과 학생 신청 리스트 상태값 부모코드 */
	NCR_T08("NCR_T08"),
	NCR_T08_P00("NCR_T08_P00"), /** 비교과 학생 신청 리스트 상태값(신청대기) */
	NCR_T08_P01("NCR_T08_P01"), /** 비교과 학생 신청 리스트 상태값(대기신청가능) */
	NCR_T08_P02("NCR_T08_P02"), /** 비교과 학생 신청 리스트 상태값(신청가능) */
	NCR_T08_P03("NCR_T08_P03"), /** 비교과 학생 신청 리스트 상태값(신청마감) */
	NCR_T08_P04("NCR_T08_P04"), /** 비교과 학생 신청 리스트 상태값(신청불가) */
	NCR_T08_P05("NCR_T08_P05"), /** 비교과 학생 신청 리스트 상태값(운영중) */
	NCR_T08_P06("NCR_T08_P06"), /** 비교과 학생 신청 리스트 상태값(운영종료) */
	NCR_T08_P07("NCR_T08_P07"), /** 비교과 학생 신청 리스트 상태값(관리자취소) */

	/** 비교과 영역 부모 코드값 */
	NCR_T01("NCR_T01"),

	/** 비교과 글로벌 영역 > 어학 */
	NCR_T01_P02_C01("NCR_T01_P02_C01"), // TOEIC
	NCR_T01_P02_C02("NCR_T01_P02_C02"), // TOEFL
	NCR_T01_P02_C03("NCR_T01_P02_C03"), // TEPS
	NCR_T01_P02_C04("NCR_T01_P02_C04"), // HSK
	NCR_T01_P02_C05("NCR_T01_P02_C05"), // JPT/JLPT

	NPR_T01_P00("NPR_T01_P00"), /** 결과보고서 상태 - 확정대기 */
	NPR_T01_P01("NPR_T01_P01"),	/** 결과보고서 상태 - 확정 */
	NPR_T01_P02("NPR_T01_P02"), /** 결과보고서 상태 - 반려 */

	/**********************[비교과 프로그램] end **********************/



	;

	private String statusCode;

	private GlobalEnum(String s) {
		statusCode = s;
	}
	@Override
	public String toString() {
		return statusCode;
	}
}