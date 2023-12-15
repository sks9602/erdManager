package com.myframework.dao;

import java.util.Map;

import org.apache.ibatis.cursor.Cursor;
import org.apache.ibatis.session.RowBounds;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.myframework.sql.SqlResultList;
import com.myframework.sql.SqlResultMap;

@Component
public class MyFrameworkSqlDao {

    @Autowired
    @Qualifier("sqlSession")
    private SqlSessionTemplate sqlSession;
    
    @SuppressWarnings("unchecked")
	public SqlResultList<SqlResultMap<String, Object>> selectList(String sqlId, Map<String, Object> sqlParam) {
    	return new SqlResultList(sqlSession.selectList(sqlId, sqlParam));
    }

    @SuppressWarnings("unchecked")
	public SqlResultMap<String, Object> select(String sqlId, Map<String, Object> sqlParam) {
    	return (SqlResultMap)sqlSession.selectOne(sqlId, sqlParam);
    }
    
    public Integer insert(String sqlId, Map<String, Object> sqlParam) {
    	return sqlSession.insert(sqlId, sqlParam);
    }

    public Integer update(String sqlId, Map<String, Object> sqlParam) {
    	return sqlSession.update(sqlId, sqlParam);
    }
    
    public Integer delete(String sqlId, Map<String, Object> sqlParam) {
    	return sqlSession.delete(sqlId, sqlParam);
    }
    
    public Cursor<Object> selectCursor(String sqlId, Map<String, Object> sqlParam) {
    	return sqlSession.selectCursor(sqlId, sqlParam);
    }

    public Cursor<Object> selectCursor(String sqlId, Map<String, Object> sqlParam, RowBounds rowBounds ) {
    	return sqlSession.selectCursor(sqlId, sqlParam, rowBounds );
    }

}
