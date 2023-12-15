package com.myframework.sql;

import java.io.IOException;
import java.sql.SQLException;

// import oracle.sql.CLOB;

public class ClobToString {

	/*
	public static String getClob(CLOB clob)  {
		try {
			int length = (int) ((CLOB)clob).length();
			char [] buffer = new char [length];
			int charactersRead = 0;
			
			try {
				charactersRead = clob.getCharacterStream().read(buffer, 0, length);
			} catch (IOException e) {
				return "Exception";
			}

			return String.valueOf(buffer, 0, charactersRead);
		} catch(SQLException e) {
			return "Exception";
		}
	}
	*/
}
