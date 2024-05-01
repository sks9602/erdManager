class  QueryMakeFunction{
    constructor(){
        this.projectData = {};
        // 공통컬럼 목록
        this.commonColumnList = [];
        this.styleSyntax = 'font-family: courier new;font-size:13;';
    }
    
    static getStyleSyntax() {
        return "font-family: 'Nanum Gothic Coding', monospace; font-size:13;" ; // font-family: 'Nanum Gothic', sans-serif;font-size:13;"; // font-family: courier new;
    }
    
    static makeQuery(queryType, records) {
        var styleSyntax = 'font-family: courier new;font-size:13;';
        var entityList = QueryMakeFunction.getEntityList(records);
        var entityColumnList = QueryMakeFunction.getEntityColumnList(records);
        
        console.log( entityList );
        // 지우기
        Ext.DomHelper.overwrite(Ext.get("rightSqlArea-innerCt"), '');
        QueryMakeFunction.getProjectData();
        
        if( queryType == "INSERT-VALUE") {
            QueryMakeFunction.makeSyntaxInsertValue(queryType, records, entityList, entityColumnList);
        }

        else if( queryType == "INSERT-SELECT") {
            QueryMakeFunction.makeSyntaxInsertSelect(queryType, records, entityList, entityColumnList);
        }

        else if( queryType == "UPDATE") {
            QueryMakeFunction.makeSyntaxUpdate(queryType, records, entityList, entityColumnList);
        }
        else if( queryType == "MERGE") {
            QueryMakeFunction.makeSyntaxMerge(queryType, records, entityList, entityColumnList);
        }
        else if( queryType == "DELETE") {
            QueryMakeFunction.makeSyntaxDelete(queryType, records, entityList, entityColumnList);
        }
        else if( queryType == "SELECT") {
            QueryMakeFunction.makeSyntaxSelect(queryType, records, entityList, entityColumnList);
        }        
        else if( queryType == "SELECT-JOIN") {
            QueryMakeFunction.makeSyntaxSelectJoin(queryType, records, entityList, entityColumnList);
        }        
        else if( queryType == "Value-Object_LOMBOK") {
            QueryMakeFunction.makeSyntaxValueObjectLombok(queryType, records, entityList, entityColumnList);
        }  
        else if( queryType == "Value-Object_GETTER_SETTER") {
            QueryMakeFunction.makeSyntaxValueObjectGetterSetter(queryType, records, entityList, entityColumnList);
        }  
        
        //create table 스크립트 생성
        else if( queryType == "CREATE TABLE") {
            QueryMakeFunction.makeSyntaxCreateTable(queryType, records, entityList, entityColumnList);
            
        }
        //
        else if( queryType == "ALTER TABLE") {
            QueryMakeFunction.makeSyntaxAlterTable(queryType, records, entityList, entityColumnList);
        }
       
         


/*
{SQL_SYNTAX_ID : "INSERT-VALUE", SQL_SYNTAX_NM : "[DML] INSERT-VALUE" },
{SQL_SYNTAX_ID : "INSERT-SELECT", SQL_SYNTAX_NM : "[DML] INSERT-SELECT" },
{SQL_SYNTAX_ID : "UPDATE", SQL_SYNTAX_NM : "[DML] UPDATE" },
{SQL_SYNTAX_ID : "MERGE", SQL_SYNTAX_NM : "[DML] MERGE" },
{SQL_SYNTAX_ID : "DELETE", SQL_SYNTAX_NM : "[DML] DELETE" },
{SQL_SYNTAX_ID : "SELECT", SQL_SYNTAX_NM : "[DML] SELECT" },
{SQL_SYNTAX_ID : "", SQL_SYNTAX_NM : "선택" },
{SQL_SYNTAX_ID : "CREATE TABLE", SQL_SYNTAX_NM : "[DDL] CREATE TABLE" },
{SQL_SYNTAX_ID : "ALTER TABLE", SQL_SYNTAX_NM : "[DDL] ALTER TABLE" },
{SQL_SYNTAX_ID : "DROP TABLE", SQL_SYNTAX_NM : "[DDL] DROP TABLE" },
{SQL_SYNTAX_ID : "RENAME TABLE", SQL_SYNTAX_NM : "[DDL] RENAME TABLE" },
*/

    }
    
    /**
     * create table 스크립트 생성
     */
    static makeSyntaxCreateTable(queryType, records, entityList, entityColumnList) {
        
        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            var indexTreeRecord = QueryMakeFunction.getIndexTreeRecord(entityList[ett]["ENTITY_ID"])

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: "DROP TABLE "+ entityList[ett]["ENTITY_NM"] + " ;<br/><br/>"
            });
            
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: "CREATE TABLE "+ entityList[ett]["ENTITY_NM"]
            });
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                syntaxs.push( QueryMakeFunction.toHtml((idx==0 ? "  " : ", ") +columnRecordList[idx].get("COLMN_NM"), columnRecordList[idx].get("COL_LEN")));
                syntaxs.push( QueryMakeFunction.toHtml( columnRecordList[idx].get("DATA_TYPE") , 16));
                
                if( columnRecordList[idx].get("NOTNULL_YN") == "Y" ) {
                    syntaxs.push("NOT NULL ");
                }

                console.log(  columnRecordList[idx].get("DEFAULT_VAL") )
                if( columnRecordList[idx].get("DEFAULT_VAL")!=null && columnRecordList[idx].get("DEFAULT_VAL")!=undefined && columnRecordList[idx].get("DEFAULT_VAL")!= "" ) {
                    syntaxs.push("DEFAULT '"+ columnRecordList[idx].get("DEFAULT_VAL") +"' ");
                }
                
                if( this.projectData["DBASE"] == "mariaDB" ) {
                    syntaxs.push(QueryMakeFunction.toHtml("comment '"+columnRecordList[idx].get("ATTR_NM")+"'"));
                } else {
                    syntaxs.push( QueryMakeFunction.toHtml("/* " +columnRecordList[idx].get("ATTR_NM") +" */", columnRecordList[idx].get("COL_LEN")));
                }
                
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
                
            }
            
            syntaxs = [];
            var syntax = ", CONSTRAINT "+QueryMakeFunction.getPkName(entityList[ett])+" PRIMARY KEY (";
            
            var pkColmn = "";
            
            for( var i=0 ; i<columnRecordList.length; i++) {
                if( columnRecordList[i].get("PK_YN") == "Y") {
                    if(pkColmn.length > 0) {
                        pkColmn += ", "
                    }
                    pkColmn += columnRecordList[i].get("COLMN_NM");
                    
                }
            }
            syntaxs.push( syntax + pkColmn + ")"  );
            syntaxs.push(") comment '"+ entityList[ett]["TABL_NM"] +"' ;");
            
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: "<br/>"
            });
            
            for( var i=0;i< indexTreeRecord.length ; i++) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "CREATE INDEX "+ indexTreeRecord[i]["INDX_NM"] + " ( "
                });
                
                for( var j=0; j< indexTreeRecord[i]["CHILDREN"].length; j++ ) {
                    Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: QueryMakeFunction.toHtml(( j>0 ? ", " : "  ") + indexTreeRecord[i]["CHILDREN"][j]["COLMN_NM"] + " " + indexTreeRecord[i]["CHILDREN"][j]["SORT_BASE"])
                    });
                }
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: ") "
                });
            }
        }
    }

    /**
     * alter table 스크립트 생성
     */
    static makeSyntaxAlterTable(queryType, records, entityList, entityColumnList) {
        
        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            var indexTreeRecord = QueryMakeFunction.getIndexTreeRecord(entityList[ett]["ENTITY_ID"])
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                syntaxs.push( QueryMakeFunction.toHtml("ALTER TABLE "+ entityList[ett]["ENTITY_NM"] + " ADD " +columnRecordList[idx].get("COLMN_NM"), columnRecordList[idx].get("COL_LEN") + 13 + entityList[ett]["ENTITY_NM"].length));
                syntaxs.push( QueryMakeFunction.toHtml( columnRecordList[idx].get("DATA_TYPE") , 16));
                
                if( columnRecordList[idx].get("NOTNULL_YN") == "Y" ) {
                    syntaxs.push("NOT NULL ");
                }

                if( columnRecordList[idx].get("DEFAULT_VAL")!=null && columnRecordList[idx].get("DEFAULT_VAL")!=undefined && columnRecordList[idx].get("DEFAULT_VAL")!= "" ) {
                    syntaxs.push("DEFAULT '"+ columnRecordList[idx].get("DEFAULT_VAL") +"' ");
                }
                
                if( idx > 0 ) {
                    syntaxs.push(" AFTER "+ columnRecordList[idx-1].get("COLMN_NM"));
                }
                syntaxs.push(" ;");
                
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: "<br/>"
            });
                
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                if( this.projectData["DBASE"] == "mariaDB" ) {
                    syntaxs.push( QueryMakeFunction.toHtml("ALTER TABLE "+ entityList[ett]["ENTITY_NM"] + " CHANGE " +columnRecordList[idx].get("COLMN_NM"), columnRecordList[idx].get("COL_LEN") + 13 + entityList[ett]["ENTITY_NM"].length));
                    syntaxs.push( QueryMakeFunction.toHtml( columnRecordList[idx].get("DATA_TYPE") , 16));
                    
                    if( columnRecordList[idx].get("NOTNULL_YN") == "Y" ) {
                        syntaxs.push("NOT NULL ");
                    }else {
                        syntaxs.push("         ");
                    }
    
                    if( columnRecordList[idx].get("DEFAULT_VAL")!=null && columnRecordList[idx].get("DEFAULT_VAL")!=undefined && columnRecordList[idx].get("DEFAULT_VAL")!= "" ) {
                        syntaxs.push("DEFAULT '"+ columnRecordList[idx].get("DEFAULT_VAL") +"' ");
                    }
                    
                    
                    syntaxs.push(QueryMakeFunction.toHtml("comment '"+columnRecordList[idx].get("ATTR_NM")+"';"));
                } else {
                    syntaxs.push( QueryMakeFunction.toHtml("/* " +columnRecordList[idx].get("ATTR_NM") +" */", columnRecordList[idx].get("COL_LEN")));
                }
                
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
                
            }
            
            
            for( var i=0;i< indexTreeRecord.length ; i++) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "CREATE INDEX "+ indexTreeRecord[i]["INDX_NM"] + " ( "
                });
                
                for( var j=0; j< indexTreeRecord[i]["CHILDREN"].length; j++ ) {
                    Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: QueryMakeFunction.toHtml(( j>0 ? ", " : "  ") + indexTreeRecord[i]["CHILDREN"][j]["COLMN_NM"] + " " + indexTreeRecord[i]["CHILDREN"][j]["SORT_BASE"])
                    });
                }
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: ")"
                });
            }
        }
    }
    static makeSyntaxValueObjectGetterSetter(queryType, records, entityList, entityColumnList) {


        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }
                        
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            var indexTreeRecord = QueryMakeFunction.getIndexTreeRecord(entityList[ett]["ENTITY_ID"])

            syntaxs.push("/* " + entityList[ett]["TABL_NM"] + " */")
            syntaxs.push("public class " + QueryMakeFunction.getVarName( entityList[ett]["ENTITY_NM"], "PASCAL_CASE") + " {");
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
            
            
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
                
                var len = columnRecordList[idx].get("COL_LEN");
               
                syntaxs = [];
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                syntaxs.push("private")
                syntaxs.push( QueryMakeFunction.getVarDataType(columnRecordList[idx]));
                syntaxs.push( QueryMakeFunction.toHtml(  QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +";" , len));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                syntaxs.push(QueryMakeFunction.toHtml("    " +QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")))); // ,  columnRecordList[idx].get("ATTR_LEN")
                syntaxs.push(QueryMakeFunction.toHtml("    pubic " + QueryMakeFunction.getVarDataType(columnRecordList[idx]) + " get" + QueryMakeFunction.getVarName( columnRecordList[idx].get("COLMN_NM"), "PASCAL_CASE") + "() {"));
                syntaxs.push(QueryMakeFunction.toHtml("        return this." + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +";"));
                syntaxs.push(QueryMakeFunction.toHtml("    }"));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('<br/>')
                });
                
                var len = columnRecordList[idx].get("COL_LEN");
               
                syntaxs = [];
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                
                syntaxs.push(QueryMakeFunction.toHtml("    " +QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")))); // ,  columnRecordList[idx].get("ATTR_LEN")
                syntaxs.push(QueryMakeFunction.toHtml("    pubic void get" + QueryMakeFunction.getVarName( columnRecordList[idx].get("COLMN_NM"), "PASCAL_CASE") + "("+ QueryMakeFunction.getVarDataType(columnRecordList[idx]) + " " + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +") {"));
                syntaxs.push(QueryMakeFunction.toHtml("        this." + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) + " = " + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +";"));
                syntaxs.push(QueryMakeFunction.toHtml("    }"));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('<br/>')
                });
            }
            
            
            
            syntaxs = [];

            syntaxs.push("}");
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });
           
        }
    }
    

    /**
     * Insert select 
     */
    static makeSyntaxValueObjectLombok(queryType, records, entityList, entityColumnList) {


        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }
                        
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            var indexTreeRecord = QueryMakeFunction.getIndexTreeRecord(entityList[ett]["ENTITY_ID"])

            syntaxs.push("@Getter");
            syntaxs.push("@Setter");
            syntaxs.push("@ToString");
            syntaxs.push("@NoArgsConstructor");
            syntaxs.push("@AllArgsConstructor");
            
            syntaxs.push("<br/>");
            syntaxs.push("@Data");
            syntaxs.push("/* " + entityList[ett]["TABL_NM"] + " */")
            syntaxs.push("public class " + QueryMakeFunction.getVarName( entityList[ett]["ENTITY_NM"], "PASCAL_CASE") + " {");
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
            
            
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
                
                var len = columnRecordList[idx].get("COL_LEN");
               
                syntaxs = [];
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                syntaxs.push("private")
                syntaxs.push( QueryMakeFunction.getVarDataType(columnRecordList[idx]));
                syntaxs.push( QueryMakeFunction.toHtml(  QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +";" , len));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
            
            syntaxs = [];

            syntaxs.push("}");
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });
           
        }
    }
    
    /**
     * Insert select 
     */
    static makeSyntaxSelectJoin(queryType, records, entityList, entityColumnList) {

        Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
            tag: 'div',
            style : QueryMakeFunction.getStyleSyntax(),
            html: " SELECT "
        });

        var entityAliasMaxLen = 0;
        for( var ett=0 ; ett<entityList.length; ett++) {
            entityAliasMaxLen = Math.max(entityAliasMaxLen, entityList[ett]["ENTITY_NM_ALIAS"] ? entityList[ett]["ENTITY_NM_ALIAS"].length : entityList[ett]["ENTITY_NM"].length)
            
        }


        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }
                        
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            var indexTreeRecord = QueryMakeFunction.getIndexTreeRecord(entityList[ett]["ENTITY_ID"])

            
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
            
            
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                
                var len = columnRecordList[idx].get("COL_LEN_TOTAL");
                console.log( columnRecordList[idx].get("COL_LEN_TOTAL") );
                syntaxs.push( QueryMakeFunction.toHtml( (ett==0 && idx==0 ? "   " : " , ") + (columnRecordList[idx].get("ENTITY_NM_ALIAS") ? columnRecordList[idx].get("ENTITY_NM_ALIAS") : columnRecordList[idx].get("ENTITY_NM"))+ "."  + columnRecordList[idx].get("COLMN_NM") ,  entityAliasMaxLen + 2 + columnRecordList[idx].get("COL_LEN_TOTAL")));
                syntaxs.push(" AS ");
                syntaxs.push( QueryMakeFunction.toHtml( columnRecordList[idx].get("COLMN_NM_ALIAS_NM"), columnRecordList[idx].get("COL_LEN_TOTAL")));

                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
        }

        for( var ett=0 ; ett<entityList.length; ett++) {
            syntaxs = [];
            if( ett==0 ) {
                syntaxs.push(QueryMakeFunction.toHtml("  FROM"));
            } else {
                syntaxs.push(QueryMakeFunction.toHtml("     ,"));
            }
            syntaxs.push(QueryMakeFunction.toHtml( entityList[ett]["ENTITY_NM"] , entityList[i]["ENTITY_LEN"]))
            syntaxs.push(QueryMakeFunction.toHtml((entityList[ett]["ENTITY_NM_ALIAS"] ? entityList[ett]["ENTITY_NM_ALIAS"] : entityList[ett]["ENTITY_NM"]), entityAliasMaxLen));
            syntaxs.push("      /* " + entityList[ett]["TABL_NM"] + " */");
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });
        }

        syntaxs = [];
        syntaxs.push(QueryMakeFunction.toHtml(" WHERE 1 = 1 "));

        Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
            tag: 'div',
            style : QueryMakeFunction.getStyleSyntax(),
            html: syntaxs.join('&nbsp')
        });

        for( var ett=0 ; ett<entityList.length-1; ett++) {
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            var columnRecordListPost = entityColumnList[entityList[ett+1]["ENTITY_NM"]];
            
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                var isCommonColumn = false;
                console.log( columnRecordList[idx].get("COLMN_NM"), this.commonColumnList )
                for( var comColIdx = 0 ; comColIdx < this.commonColumnList.length; comColIdx++) {
                    if( columnRecordList[idx].get("COLMN_NM") == this.commonColumnList[comColIdx]["COLMN_NM"] ) {
                        isCommonColumn = true;
                        break;
                    }
                }
                if( isCommonColumn == true) {
                    continue;
                }
                for( var idxNext=0; idxNext < columnRecordListPost.length; idxNext++) {
                    if( columnRecordList[idx].get("COLMN_NM") == columnRecordListPost[idxNext].get("COLMN_NM") ) {
                        syntaxs.push( QueryMakeFunction.toHtml( "   AND " + (columnRecordList[idx].get("ENTITY_NM_ALIAS") ? columnRecordList[idx].get("ENTITY_NM_ALIAS") : columnRecordList[idx].get("ENTITY_NM") ) + "." + columnRecordList[idx].get("COLMN_NM") ,  entityAliasMaxLen + 2 + columnRecordList[idx].get("COL_LEN_TOTAL")));
                        syntaxs.push("=");
                        syntaxs.push( QueryMakeFunction.toHtml((columnRecordListPost[idxNext].get("ENTITY_NM_ALIAS") ? columnRecordListPost[idxNext].get("ENTITY_NM_ALIAS") : columnRecordListPost[idxNext].get("ENTITY_NM") ) + "." + columnRecordListPost[idxNext].get("COLMN_NM") ,  entityAliasMaxLen + 2 + columnRecordListPost[idxNext].get("COL_LEN_TOTAL")));
                        syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));
                        
                        Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                            tag: 'div',
                            style : QueryMakeFunction.getStyleSyntax(),
                            html: syntaxs.join('&nbsp')
                        });
                    }
                
                }
            }
            
        }



        for( var ett=0 ; ett<entityList.length; ett++) {
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });

            
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: "<br/>"
            });

            
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                syntaxs.push( QueryMakeFunction.toHtml( "   AND " + (columnRecordList[idx].get("ENTITY_NM_ALIAS") ? columnRecordList[idx].get("ENTITY_NM_ALIAS") : columnRecordList[idx].get("ENTITY_NM") ) + "." + columnRecordList[idx].get("COLMN_NM") ,  entityAliasMaxLen + 2 + columnRecordList[idx].get("COL_LEN")));
                syntaxs.push(" =");

                var len = columnRecordList[idx].get("COL_LEN");

                if( varType == "CAMEL_CASE" ) {
                    len = columnRecordList[idx].get("COL_LEN_CAMEL");
                }
                syntaxs.push( QueryMakeFunction.toHtml( "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len));

                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
        }
    }
    
    
    /**
     * Insert select 
     */
    static makeSyntaxSelect(queryType, records, entityList, entityColumnList) {


        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }
                        
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            var indexTreeRecord = QueryMakeFunction.getIndexTreeRecord(entityList[ett]["ENTITY_ID"])

            
            syntaxs.push(" SELECT ")
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
            
            
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            var indent = "";
            var params = "";
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                indent = "";
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;");
                        indent += "&nbsp;&nbsp;&nbsp;";
                    }
                }
                
                var len = columnRecordList[idx].get("COL_LEN");
                syntaxs.push(QueryMakeFunction.toHtml( (idx==0 ? "   " : " , ") + (columnRecordList[idx].get("ENTITY_NM_ALIAS") ? columnRecordList[idx].get("ENTITY_NM_ALIAS") : columnRecordList[idx].get("ENTITY_NM") )+ "."  + columnRecordList[idx].get("COLMN_NM") ,  columnRecordList[idx].get("ENTITY_NM_ALIAS").length + 2+8 + columnRecordList[idx].get("COL_LEN")));
                syntaxs.push(" AS ");
                syntaxs.push( QueryMakeFunction.toHtml( columnRecordList[idx].get("COLMN_NM_ALIAS_NM"), columnRecordList[idx].get("COL_LEN")));
                
                
                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));
                
                params = "";
                for( var f = 0 ; f<columnRecordList[idx].fields.length; f++ ) {
                    var nm = columnRecordList[idx].fields[f].name;
                    if( f>0 ) {
                        params += ", ";
                    }
                    params += ("\"" + nm +"\" : \"" + columnRecordList[idx].get(nm) + "\"")
                }
                syntaxs.push("<span class='select' onclick='ErdDrawFunction.contextAddQuery(event, \"SELECT\", \""+columnRecordList[idx].get("ENTITY_ID")+"\", \""+columnRecordList[idx].get("COLMN_ID")+"\", \"" + indent + "\", {" + params + "} )'> </span>")
                
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    id : 'col_SELECT_'+ columnRecordList[idx].get("ENTITY_ID") + '_' +columnRecordList[idx].get("COLMN_ID"),
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
            
            syntaxs = [];

            syntaxs.push(QueryMakeFunction.toHtml("  FROM " + entityList[ett]["ENTITY_NM"] + " " + (entityList[ett]["ENTITY_NM_ALIAS"] ? entityList[ett]["ENTITY_NM_ALIAS"] : entityList[ett]["ENTITY_NM"]) + "      /* " + entityList[ett]["TABL_NM"] + " */"));
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });
            
            syntaxs = [];
            syntaxs.push(QueryMakeFunction.toHtml(" WHERE 1 = 1 "));
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });

            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                syntaxs.push( QueryMakeFunction.toHtml( "   AND " + (columnRecordList[idx].get("ENTITY_NM_ALIAS") ? columnRecordList[idx].get("ENTITY_NM_ALIAS") : columnRecordList[idx].get("ENTITY_NM") ) + "." + columnRecordList[idx].get("COLMN_NM") ,  (columnRecordList[idx].get("ENTITY_NM_ALIAS") ? columnRecordList[idx].get("ENTITY_NM_ALIAS").length : columnRecordList[idx].get("ENTITY_NM").length) + 2+8 + columnRecordList[idx].get("COL_LEN")));
                syntaxs.push(" =");

                var len = columnRecordList[idx].get("COL_LEN");

                if( varType == "CAMEL_CASE" ) {
                    len = columnRecordList[idx].get("COL_LEN_CAMEL");
                }
                syntaxs.push( QueryMakeFunction.toHtml( "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len));

                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));

                params = "";
                for( var f = 0 ; f<columnRecordList[idx].fields.length; f++ ) {
                    var nm = columnRecordList[idx].fields[f].name;
                    if( f>0 ) {
                        params += ", ";
                    }
                    params += ("\"" + nm +"\" : \"" + columnRecordList[idx].get(nm) + "\"")
                }
                syntaxs.push("<span class='select' onclick='ErdDrawFunction.contextAddQuery(event, \"WHERE\", \""+columnRecordList[idx].get("ENTITY_ID")+"\", \""+columnRecordList[idx].get("COLMN_ID")+"\", \"" + indent + "\", {" + params + "} )'> </span>")

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    id : 'col_WHERE_' +columnRecordList[idx].get("ENTITY_ID") + '_' +columnRecordList[idx].get("COLMN_ID"),
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
        }
    }
    
    
    static makeSyntaxDelete(queryType, records, entityList, entityColumnList) {
        
        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }
            
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];

            syntaxs.push( QueryMakeFunction.toHtml("DELETE /*   */"));
            syntaxs.push( QueryMakeFunction.toHtml("  FROM "+ entityList[ett]["ENTITY_NM"]) + " " + entityList[ett]["ENTITY_NM_ALIAS"] + " /* " + entityList[ett]["TABL_NM"] + " */");

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: QueryMakeFunction.toHtml(" WHERE 1 = 1")
            });
            
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                if( columnRecordList[idx].get("PK_YN") == 'Y') {
                    if( columnRecordList[idx].get("INDENT")) {
                        for( var i=1;i < columnRecordList[idx].get("INDENT") ; i++) {
                            syntaxs.push("&nbsp;&nbsp;&nbsp;")
                        }
                    }

                    syntaxs.push( QueryMakeFunction.toHtml( "   AND " + columnRecordList[idx].get("ENTITY_NM_ALIAS") + ( columnRecordList[idx].get("ENTITY_NM_ALIAS") ? "." : "")  + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")+columnRecordList[idx].get("ENTITY_NM_ALIAS").length ));
                    syntaxs.push( "=" );
                    
                    var len = columnRecordList[idx].get("COL_LEN");
                    if( varType == "CAMEL_CASE" ) {
                        len = columnRecordList[idx].get("COL_LEN_CAMEL");
                    }
                    syntaxs.push( QueryMakeFunction.toHtml( "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len));

                    syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));

                    Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: syntaxs.join('&nbsp')
                    });
                }
            }
        }
    }
    
        static makeSyntaxMerge(queryType, records, entityList, entityColumnList) {
        
        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }
            
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];

            syntaxs.push( QueryMakeFunction.toHtml("MERGE "+QueryMakeFunction.getCommentString(entityList[ett]["TABL_NM"])));
            syntaxs.push( QueryMakeFunction.toHtml(" INTO "+ entityList[ett]["ENTITY_NM"]) + " " + ( entityList[ett]["ENTITY_NM_ALIAS"] ? entityList[ett]["ENTITY_NM_ALIAS"] : entityList[ett]["ENTITY_NM"] ) + " /* " + entityList[ett]["TABL_NM"] + " */");
            syntaxs.push( QueryMakeFunction.toHtml("USING TABLE T"));
            syntaxs.push( QueryMakeFunction.toHtml("   ON ("));

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
            
            var isFirst = true;
            for( var idx=0; idx < columnRecordList.length; idx++) {
                if( columnRecordList[idx].get("PK_YN") == 'Y') {
                    syntaxs = [];
                    if( columnRecordList[idx].get("INDENT")) {
                        for( var i=1;i < columnRecordList[idx].get("INDENT") ; i++) {
                            syntaxs.push("&nbsp;&nbsp;&nbsp;")
                        }
                    }
                    var str = ""; 
                    str += QueryMakeFunction.toHtml((isFirst ? "            " : "        AND ") + ( entityList[ett]["ENTITY_NM_ALIAS"] ? columnRecordList[idx].get("ENTITY_NM_ALIAS") : entityList[ett]["ENTITY_NM"] ) + "." + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")+ ( entityList[ett]["ENTITY_NM_ALIAS"] ? columnRecordList[idx].get("ENTITY_NM_ALIAS").length  : entityList[ett]["ENTITY_NM"].length)) ;
               
                    
                    var len = columnRecordList[idx].get("COL_LEN");
                    if( varType == "CAMEL_CASE" ) {
                        len = columnRecordList[idx].get("COL_LEN_CAMEL");
                    }
                    str += " = ";
                    // str += QueryMakeFunction.toHtml( "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len);
                    str += "T." + QueryMakeFunction.toHtml(columnRecordList[idx].get("COLMN_NM"), columnRecordList[idx].get("COL_LEN") );
                    str += QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")); // "/* " + QueryMakeFunction.toHtml(columnRecordList[idx].get("ATTR_NM"),  columnRecordList[idx].get("ATTR_LEN")) + " */";
                    
                    
                    syntaxs.push(str);
                    
                    isFirst = false;
                    Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: syntaxs.join('<br/>')
                    });
                }
            }
            syntaxs = [];
            syntaxs.push( QueryMakeFunction.toHtml("        )"));
            syntaxs.push( QueryMakeFunction.toHtml("  WHEN MATCHED THEN"));
            syntaxs.push( QueryMakeFunction.toHtml("       UPDATE SET"));
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });

            var isFirst = true;
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                if( columnRecordList[idx].get("PK_YN") != 'Y') {
                    if( columnRecordList[idx].get("INDENT")) {
                        for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                            syntaxs.push("&nbsp;&nbsp;&nbsp;")
                        }
                    }

                    syntaxs.push( QueryMakeFunction.toHtml( (isFirst==0 ? "       , " : "         ") + columnRecordList[idx].get("ENTITY_NM_ALIAS") + ( columnRecordList[idx].get("ENTITY_NM_ALIAS") ? "." : "") + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")+columnRecordList[idx].get("ENTITY_NM_ALIAS").length +6 ));
                    syntaxs.push( " = " );
                    
                    var len = columnRecordList[idx].get("COL_LEN");
                    if( varType == "CAMEL_CASE" ) {
                        len = columnRecordList[idx].get("COL_LEN_CAMEL");
                    }
                    syntaxs.push( QueryMakeFunction.toHtml( "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len));

                    syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM"))); // "/* " + QueryMakeFunction.toHtml(columnRecordList[idx].get("ATTR_NM"),  columnRecordList[idx].get("ATTR_LEN")) + " */"

                    isFirst = false;

                    Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: syntaxs.join('&nbsp')
                    });
                }
           }

           syntaxs = [];
           syntaxs.push( QueryMakeFunction.toHtml("  WHEN NOT MATCHED THEN"));
           syntaxs.push( QueryMakeFunction.toHtml("       INSERT ("));

           Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
           });
           
           isFirst = true;
           for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=1;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }

                syntaxs.push( QueryMakeFunction.toHtml( (isFirst==0 ? "             , " : "               ") + columnRecordList[idx].get("ENTITY_NM_ALIAS") + ( columnRecordList[idx].get("ENTITY_NM_ALIAS") ? "." : "") + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")+columnRecordList[idx].get("ENTITY_NM_ALIAS").length ));

                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM"))); // "/* " + QueryMakeFunction.toHtml(columnRecordList[idx].get("ATTR_NM"),  columnRecordList[idx].get("ATTR_LEN")) + " */"

                isFirst = false;

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
           }
           
           Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: QueryMakeFunction.toHtml("        )")
           });

           Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: QueryMakeFunction.toHtml("        VALUES (")
           });
           
           isFirst = true;
           for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=1;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }

                syntaxs.push( QueryMakeFunction.toHtml( (isFirst==0 ? "             , " : "               ") + "T." + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")+columnRecordList[idx].get("ENTITY_NM_ALIAS").length ));

                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM"))); // "/* " + QueryMakeFunction.toHtml(columnRecordList[idx].get("ATTR_NM"),  columnRecordList[idx].get("ATTR_LEN")) + " */"

                isFirst = false;

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
           }
           Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: QueryMakeFunction.toHtml("        )")
           });
        }
    }
    
    
    static makeSyntaxUpdate(queryType, records, entityList, entityColumnList) {
        
        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }
            
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];

            syntaxs.push( QueryMakeFunction.toHtml("UPDATE " + QueryMakeFunction.getCommentString(entityList[ett]["TABL_NM"])));
            syntaxs.push( QueryMakeFunction.toHtml("       "+ entityList[ett]["ENTITY_NM"]) + " " + entityList[ett]["ENTITY_NM_ALIAS"] + " /* " + entityList[ett]["TABL_NM"] + " */");
            syntaxs.push( QueryMakeFunction.toHtml("   SET "));

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });

            var isFirst = true;
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                if( columnRecordList[idx].get("PK_YN") != 'Y') {
                    if( columnRecordList[idx].get("INDENT")) {
                        for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                            syntaxs.push("&nbsp;&nbsp;&nbsp;")
                        }
                    }

                    syntaxs.push( QueryMakeFunction.toHtml( (isFirst==0 ? ", " : "  ") + columnRecordList[idx].get("ENTITY_NM_ALIAS") + ( columnRecordList[idx].get("ENTITY_NM_ALIAS") ? "." : "") + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")+columnRecordList[idx].get("ENTITY_NM_ALIAS").length -2 ));
                    syntaxs.push( " = " );
                    
                    var len = columnRecordList[idx].get("COL_LEN");
                    if( varType == "CAMEL_CASE" ) {
                        len = columnRecordList[idx].get("COL_LEN_CAMEL");
                    }
                    syntaxs.push( QueryMakeFunction.toHtml( "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len));

                    syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM"))); // "/* " + QueryMakeFunction.toHtml(columnRecordList[idx].get("ATTR_NM"),  columnRecordList[idx].get("ATTR_LEN")) + " */"

                    isFirst = false;

                    Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: syntaxs.join('&nbsp')
                    });
                }
           }
           
           Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: QueryMakeFunction.toHtml(" WHERE 1 = 1")
           });
            
           for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                if( columnRecordList[idx].get("PK_YN") == 'Y') {
                    if( columnRecordList[idx].get("INDENT")) {
                        for( var i=1;i < columnRecordList[idx].get("INDENT") ; i++) {
                            syntaxs.push("&nbsp;&nbsp;&nbsp;")
                        }
                    }

                    syntaxs.push( QueryMakeFunction.toHtml( "   AND " + columnRecordList[idx].get("ENTITY_NM_ALIAS") + ( columnRecordList[idx].get("ENTITY_NM_ALIAS") ? "." : "") + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")+columnRecordList[idx].get("ENTITY_NM_ALIAS").length ));
                    syntaxs.push( "=" );
                    
                    var len = columnRecordList[idx].get("COL_LEN");
                    if( varType == "CAMEL_CASE" ) {
                        len = columnRecordList[idx].get("COL_LEN_CAMEL");
                    }
                    syntaxs.push( QueryMakeFunction.toHtml( "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len));

                    syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM"))); // "/* " + QueryMakeFunction.toHtml(columnRecordList[idx].get("ATTR_NM"),  columnRecordList[idx].get("ATTR_LEN")) + " */"

                    isFirst = false;

                    Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                        tag: 'div',
                        style : QueryMakeFunction.getStyleSyntax(),
                        html: syntaxs.join('&nbsp')
                    });
                }
           }
        }
    }
    

    
        
        /**
     * alter table 스크립트 생성
     */
    static makeSyntaxInsertValue(queryType, records, entityList, entityColumnList) {

        var colmnLineCnt = Ext.getCmp("queryCenterQueryOption_COLMN_CNT").getValue();
        
        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }            
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            var indexTreeRecord = QueryMakeFunction.getIndexTreeRecord(entityList[ett]["ENTITY_ID"])

            syntaxs.push( QueryMakeFunction.toHtml("INSERT "));
            syntaxs.push( QueryMakeFunction.toHtml("  INTO "+ entityList[ett]["ENTITY_NM"] + " " + QueryMakeFunction.getCommentString(entityList[ett]["TABL_NM"])));
            syntaxs.push( QueryMakeFunction.toHtml("     ("));

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
                
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                
                for( var col=0; col< colmnLineCnt; col++ ) {
                    if( idx >= columnRecordList.length ) {
                        continue;
                    }
                    syntaxs.push( QueryMakeFunction.toHtml( (idx==0 ? "  " : ", ") + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")));
                    
                    syntaxs.push( QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM"))) ; //  columnRecordList[idx].get("ATTR_LEN")) 
                
                    idx++
                }
                
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
            
            syntaxs = [];
            syntaxs.push(QueryMakeFunction.toHtml("     ) "));
            syntaxs.push(" VALUES ")
            syntaxs.push(QueryMakeFunction.toHtml("     ("));
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
            
            
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                
                var len = columnRecordList[idx].get("COL_LEN");
                
                if( varType == "CAMEL_CASE" ) {
                    len = columnRecordList[idx].get("COL_LEN_CAMEL");
                }
                for( var col=0; col< colmnLineCnt; col++ ) {
                    if( idx >= columnRecordList.length ) {
                        continue;
                    }
                    syntaxs.push( QueryMakeFunction.toHtml( (idx==0 ? "  " : ", ") + "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len));
                    
                    syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));
                    idx++
                }
                
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
            
            syntaxs = [];

            syntaxs.push(QueryMakeFunction.toHtml("     )"));
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });
        }

    }
    

     /**
     * Insert select 
     */
    static makeSyntaxInsertSelect(queryType, records, entityList, entityColumnList) {


        for( var ett=0 ; ett<entityList.length; ett++) {
            var syntaxs = [];
            if( ett > 0 ) {
                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: "<br/>"
                });
            }
                        
            var columnRecordList = entityColumnList[entityList[ett]["ENTITY_NM"]];
            
            var indexTreeRecord = QueryMakeFunction.getIndexTreeRecord(entityList[ett]["ENTITY_ID"])

            syntaxs.push( QueryMakeFunction.toHtml("INSERT "));
            syntaxs.push( QueryMakeFunction.toHtml("  INTO "+ entityList[ett]["ENTITY_NM"] + " /* " + entityList[ett]["TABL_NM"] + " */"));
            syntaxs.push( QueryMakeFunction.toHtml("     ("));

            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
                
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                
                
                syntaxs.push( QueryMakeFunction.toHtml( (idx==0 ? "  " : ", ") + columnRecordList[idx].get("COLMN_NM") , columnRecordList[idx].get("COL_LEN")));
                
                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
            
            syntaxs = [];
            syntaxs.push(QueryMakeFunction.toHtml("     ) "));
            
            syntaxs.push(" SELECT ")
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('<br/>')
            });
            
            
            var varType = Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
            
            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                if( columnRecordList[idx].get("INDENT")) {
                    for( var i=0;i < columnRecordList[idx].get("INDENT") ; i++) {
                        syntaxs.push("&nbsp;&nbsp;&nbsp;")
                    }
                }
                
                var len = columnRecordList[idx].get("COL_LEN");
                
                syntaxs.push( QueryMakeFunction.toHtml( (idx==0 ? "  " : ", ") + columnRecordList[idx].get("ENTITY_NM_ALIAS") + ( columnRecordList[idx].get("ENTITY_NM_ALIAS") ? "." : "") + columnRecordList[idx].get("COLMN_NM") ,  columnRecordList[idx].get("ENTITY_NM_ALIAS").length + 2 + columnRecordList[idx].get("COL_LEN")));
                syntaxs.push(" AS ");
                syntaxs.push( QueryMakeFunction.toHtml( columnRecordList[idx].get("COLMN_NM_ALIAS_NM"), columnRecordList[idx].get("COL_LEN")));

                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
            
            syntaxs = [];

            syntaxs.push(QueryMakeFunction.toHtml("  FROM " + entityList[ett]["ENTITY_NM"] + " " + entityList[ett]["ENTITY_NM_ALIAS"] + "      /* " + entityList[ett]["TABL_NM"] + " */"));
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });
            
            syntaxs = [];
            syntaxs.push(QueryMakeFunction.toHtml(" WHERE 1 = 1 "));
            Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                tag: 'div',
                style : QueryMakeFunction.getStyleSyntax(),
                html: syntaxs.join('&nbsp')
            });

            for( var idx=0; idx < columnRecordList.length; idx++) {
                syntaxs = [];
                
                syntaxs.push( QueryMakeFunction.toHtml( "   AND " + columnRecordList[idx].get("ENTITY_NM_ALIAS") + ( columnRecordList[idx].get("ENTITY_NM_ALIAS") ? "." : "") + columnRecordList[idx].get("COLMN_NM") ,  columnRecordList[idx].get("ENTITY_NM_ALIAS").length + 2 + columnRecordList[idx].get("COL_LEN")));
                syntaxs.push(" =");

                var len = columnRecordList[idx].get("COL_LEN");

                if( varType == "CAMEL_CASE" ) {
                    len = columnRecordList[idx].get("COL_LEN_CAMEL");
                }
                syntaxs.push( QueryMakeFunction.toHtml( "#{" + QueryMakeFunction.getVarName(columnRecordList[idx].get("COLMN_NM")) +"}" , len));

                syntaxs.push(QueryMakeFunction.getCommentString(columnRecordList[idx].get("ATTR_NM")));

                Ext.DomHelper.append(Ext.get("rightSqlArea-innerCt"), {
                    tag: 'div',
                    style : QueryMakeFunction.getStyleSyntax(),
                    html: syntaxs.join('&nbsp')
                });
            }
        }
    }
    
    static getVarDataType(record) {
        var type = "String";
        if( record.get("DATA_TYPE").indexOf("BIT") >= 0) {
            type = "int";
        } else if( record.get("DATA_TYPE").indexOf("FLOAT") >= 0) {
            type = "double";
        } else if( record.get("DATA_TYPE").indexOf("BIGINT") >= 0) {
            type = "long";
        } else if( record.get("DATA_TYPE").indexOf("DOUBLE") >= 0) {
            type = "double";
        } else if( record.get("DATA_TYPE").indexOf("NUMBER") >= 0) {
            type = "long";
        } else if( record.get("DATA_TYPE").indexOf("BOOLEAN") >= 0) {
            type = "boolean";
        } else if( record.get("DATA_TYPE").indexOf("DECIMAL") >= 0) {
            type = "int";
        } else if( record.get("DATA_TYPE").indexOf("INTEGER") >= 0) {
            type = "int";
        } else if( record.get("DATA_TYPE").indexOf("TINYINT") >= 0) {
            type = "int";
        } else if( record.get("DATA_TYPE").indexOf("SMALLINT") >= 0) {
            type = "int";
        } else if( record.get("DATA_TYPE").indexOf("MEDIUMINT") >= 0) {
            type = "int";
        } else if( record.get("DATA_TYPE").indexOf("DATETIME") >= 0) {
            type = "Date";
        } else if( record.get("DATA_TYPE").indexOf("DATE") >= 0) {
            type = "Date";
        } else if( record.get("DATA_TYPE").indexOf("TIMESTAMP") >= 0) {
            type = "Date";
        } 

        return type;
    }

    static getCommentString(comment, len, _commentType) {
        var commentType = _commentType||Ext.getCmp("queryCenterQueryOption_COMMENT_TYPE").getValue();
        var objectType = Ext.getCmp("queryCenterQueryOption_SQL_SYNTAX").getValue();
        var colmnLineCnt = Ext.getCmp("queryCenterQueryOption_COLMN_CNT").getValue();
        
        var commentString = "";
        if( objectType.indexOf("Value-Object") >= 0 ) {
            if( commentType == "LINE" && colmnLineCnt != 1 ) {
                commentString = "// " + QueryMakeFunction.toHtml(comment, len);
            } else {
                commentString = "/* " + QueryMakeFunction.toHtml(comment, len) + " */";
            }
        } else {
            if( commentType == "LINE" && colmnLineCnt != 1 ) {
                commentString = "-- " + QueryMakeFunction.toHtml(comment, len);
            } else {
                commentString = "/* " + QueryMakeFunction.toHtml(comment, len) + " */";
            }
        }
        return commentString;
    }
        
    static getVarName(columnName, _varType ) {
        var varType = _varType||Ext.getCmp("queryCenterQueryOption_VAR_TYPE").getValue();
        
        if( varType == "CAMEL_CASE") {
            return QueryMakeFunction.toCamelCase(columnName);
        } else if( varType == "PASCAL_CASE") {
            return QueryMakeFunction.toPascalCase(columnName);
        } else if( varType == "SNAKE_CASE_UPPER") {
            return columnName.toUpperCase();
        } else if( varType == "SNAKE_CASE_LOWER") {
            return columnName.toLowerCase();
        } else {
            return columnName;
        }
    }
 
    static toPascalCase(str) {
        return str.toLowerCase()
               .replace(new RegExp(/[-_]+/, 'g'), ' ')
               .replace(new RegExp(/[^\w\s]/, 'g'), '')
               .replace( new RegExp(/\s+(.)(\w*)/, 'g'),
                         ($1, $2, $3) => `${$2.toUpperCase() + $3}`
                        ).replace(new RegExp(/\w/), s => s.toUpperCase());
    }
   
    static toCamelCase(str) {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    static toHtml(str, len) {
        if( len ) {
            return str.padEnd(len, ' ').replace(/\s/g, '&nbsp;');
        } else {
            return str.replace(/\s/g, '&nbsp;');
        }
        
    }
    static getEntityColumnList(records) {
        var filterdRecords = {};
        var columnMaxLength = {}
        var attrMaxLength = {}
        var columnCamelMaxLength = {}
        var totalColumnMaxLength = 0;
        for( var i=0; i < records.length; i++) {
                
            if(!filterdRecords[records[i].get("ENTITY_NM")]) {
                filterdRecords[records[i].get("ENTITY_NM")] = new Array();
                attrMaxLength[records[i].get("ENTITY_NM")] = 0
                columnMaxLength[records[i].get("ENTITY_NM")] = 0
                columnCamelMaxLength[records[i].get("ENTITY_NM")] = 0
            }
            
            attrMaxLength[records[i].get("ENTITY_NM")] = Math.max(attrMaxLength[records[i].get("ENTITY_NM")], records[i].get("ATTR_NM_LEN") + 6 ); // QueryMakeFunction.getStringLength(records[i].get("ATTR_NM"))+4);
            columnMaxLength[records[i].get("ENTITY_NM")] = Math.max(columnMaxLength[records[i].get("ENTITY_NM")], records[i].get("COL_NM_LEN"));
            columnCamelMaxLength[records[i].get("ENTITY_NM")] = Math.max(columnCamelMaxLength[records[i].get("ENTITY_NM")], records[i].get("COL_NM_PLAIN_LEN"));
            filterdRecords[records[i].get("ENTITY_NM")].push(records[i])
            totalColumnMaxLength = Math.max(totalColumnMaxLength, records[i].get("COL_NM_LEN"));
        }
        for( var x in  filterdRecords) {
            for( var i=0; i< filterdRecords[x].length; i++) {
                filterdRecords[x][i].set("COL_LEN_TOTAL", totalColumnMaxLength);
                filterdRecords[x][i].set("COL_LEN", columnMaxLength[x]);
                filterdRecords[x][i].set("ATTR_LEN", attrMaxLength[x]);
                filterdRecords[x][i].set("COL_LEN_CAMEL", columnCamelMaxLength[x]);
            }
            
        }
        
        return filterdRecords;
    }

    static getStringLength (str){
        var retCode = 0;
        var strLength = 0;
        for (var i = 0; i < str.length; i++){
            var code = str.charCodeAt(i);
            var ch = str.substr(i,1).toUpperCase();
            code = parseInt(code);
            if ((ch < "0" || ch > "9") && (ch < "A" || ch > "Z") && ((code > 255) || (code < 0))) {
                strLength = strLength + 2;
            } else{
                strLength = strLength + 1;
            }
         }
         return strLength;
     }


    static getProjectData( ) {
        var response = Ext.Ajax.request({
            async: false,
            url: '/project/data/detail.do',
            params: {
                    'SESSION_YN' : 'Y',
                    'COMMON_COLUMN' : 'Y'
            }
        });
        this.projectData = Ext.decode(response.responseText).detail;
        this.commonColumnList = Ext.decode(response.responseText).commonColumnList
        return this.projectData;
    }
    
    static getIndexTreeRecord(entity_id) {
        
        var response = Ext.Ajax.request({
            async: false,
            url: '/entity/data/indexTreeList.do',
            params: {
                    'entity_id' : entity_id
            }
        });
        var indexTreeRecord = Ext.decode(response.responseText);

        return indexTreeRecord;

    }
    
    
    static getPkName(entity) {
        console.log("PK_PREFIX_NM_FMT : " +  this.projectData["PK_PREFIX_NM_FMT"], entity["ENTITY_NM"])
        if( this.projectData["PK_PREFIX_NM_FMT"] ) {
            return this.projectData["PK_PREFIX_NM_FMT"].replace("#ENTITY_NM#", entity["ENTITY_NM"]);
        } else {
            return "PK_"+entity["ENTITY_NM"];
        }
        
    }

    static getEntityList(records) {
        var entitySet = new Set();
        var entityList = new Array();
        var entityNmLength = 0;
        for( var i=0; i<records.length; i++) {
            
            if( !entitySet.has(records[i].get("ENTITY_NM") )) {
                console.log(records[i] )
                entityNmLength = Math.max( entityNmLength, records[i].get("ENTITY_NM").length + 4 );
                entityList.push( {  ENTITY_ID:records[i].get("ENTITY_ID")
                                  , ENTITY_NM:records[i].get("ENTITY_NM")
                                  , ENTITY_NM_ALIAS:records[i].get("ENTITY_NM_ALIAS")
                                  , TABL_NM : records[i].get("TABL_NM")
                                  , ENTITY_NM_ALIAS  : records[i].get("ENTITY_NM_ALIAS") ? records[i].get("ENTITY_NM_ALIAS") : records[i].get("ENTITY_NM")
                                  ,  })
                entitySet.add(records[i].get("ENTITY_NM"))
            }
        }
        
        for( var i=0; i<entityList.length; i++ ) {
            entityList[i]["ENTITY_LEN"] = entityNmLength;
        }
        
        return entityList;
    }
}
