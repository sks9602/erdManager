package com.myframework.was.session;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

public class MyFrameworkHttpSessionBindingListener implements HttpSessionBindingListener {

	@Override
	public void valueBound(HttpSessionBindingEvent event) {
		if (MyFrameworkMultiLoginPreventor.findByLoginId(event.getName())) {
			MyFrameworkMultiLoginPreventor.invalidateByLoginId(event.getName());
		}
		MyFrameworkMultiLoginPreventor.loginUserMap.put(event.getName(), event.getSession());
	}

	/**
	 *
	 * 로그아웃 혹은 세션타임아웃 설정에 따라 사용자 세션으로부터 EgovHttpSessionBindingListener가 제거될 때 자동 호출되는 메소드로, 사용자의 로그인
	 * 아이디에 해당하는 세션을 ConcurrentHashMap에서 모두 제거한다
	 */
	@Override
	public void valueUnbound(HttpSessionBindingEvent event) {
		MyFrameworkMultiLoginPreventor.loginUserMap.remove(event.getName(), event.getSession());
	}
	
}
