package com.myframework.sql;

import java.util.ArrayList;
import java.util.List;

public class SqlResultList<E> extends ArrayList<E> {

    /**
     * 
     */
    private static final long serialVersionUID = -4284579944844310084L;

    public SqlResultList(List list) {
    	super(list);
    }
}
