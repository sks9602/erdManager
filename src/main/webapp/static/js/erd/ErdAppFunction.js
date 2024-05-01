class  ErdAppFunction{
    
    static makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
          if( counter%4 == 0 && counter!= 16 ) {
              result += "-";
          }
        }
        return result;
    }
    
    static getButtonDisabled() {
        console.log( Ext.getCmp("centerTop_EditStartButton").getText() );
        if( Ext.getCmp("centerTop_EditStartButton").getText() == "편집중(나)") {
            return false;
        } else {
            return true;
        }
    }
    
    // 단어사전 조회.
    static getWord(value, obj_type, callbackFunction) {
            var response = Ext.Ajax.request({
                async: false,
                url: '/word/data/detail.do',
                method: 'POST',
                params: {
                    VALUE: value,
                    OBJ_TYPE : obj_type,
                }
                /* ,
                success : function(response, opts) {
                     var obj = Ext.decode(response.responseText);
                     // var json = Ext.JSON.decode(Ext.decode(response.responseText).detail);
                     
                     callbackFunction(obj.detail.ABBR);
                },
                */
            });
            
            var res = Ext.decode(response.responseText);
        
            if( callbackFunction ) {
                callbackFunction(res.detail.ABBR);
            }
        
            return res.detail.ABBR;
    }
    
    static loadSnippetInfo( snippet_uid ) {
         Ext.create('Ext.data.Store', {
             storeId: 'domainEditDetailStore',
             fields: [
                { name : 'SNIPPET_UID', type : 'string', format : '' },
                { name : 'SNIPPET_CD', type : 'string', format : '' },
                { name : 'SNIPPET_CD_NM', type : 'string', format : '' },
                { name : 'SNIPPET_NM', type : 'string', format : '' },
                { name : 'USE_YN', type : 'string', format : '' },
                { name: 'SNIPPET', type: 'string' },
             ],
             proxy: {
                 type: 'ajax',
                 url: '/project/data/snippetDetail.do',
                 reader: {
                     type: 'json',
                     rootProperty: 'detail'
                 },
                 extraParams: {
                    SNIPPET_UID : snippet_uid
                }
             },
             autoLoad: true,
             listeners : {
                 load : function(_this, _records, _successful, _eOpts ) {
                      Ext.getCmp('snippetWindowForm').loadRecord(_records[0]);
                 }
                 
             }
         });
    }
    static snippetWindow(snippet_cd) {
        var window = Ext.create('Ext.window.Window', {


            title :  '쿼리 스니핏 관리',
            width : 1200,
             height : 720,
             autoShow :false,
             resizable : false,
             modal : true,
             id: 'snippetWindow',
             layout: 'border',
             border : true,
             items : [
                   {   xtype : 'gridpanel',
                       region: 'west',
                       columnLines: true,
                       border : true,
                       width : 420,
                       title: '스니핏 목록',
                       margin : "0 5 0 5",
                        store: {
                            xtype : 'store',
                            storeId: 'snippetListStore',
                            idProperty : 'data',
                            fields: [
                                { name : 'SNIPPET_UID', type : 'string', format : '' },
                                { name : 'SNIPPET_CD', type : 'string', format : '' },
                                { name : 'SNIPPET_CD_NM', type : 'string', format : '' },
                                { name : 'SNIPPET_NM', type : 'string', format : '' },
                                { name : 'USE_YN', type : 'string', format : '' },
                                { name : 'USE_YN_NM', type : 'string', format : '' },
                            ],
                            
                            autoLoad:  true ,
                            proxy : {
                                   type : 'ajax',
                                   url : '/project/data/snippetList.do',
                                   reader : {
                                       type : 'json',
                                       rootProperty : 'data',
                                       totalProperty: 'totalCount' 
                                   },
                                   extraParams: {
                                       EDITABLE : "Y"
                                   }
                               },
                               root: {
                                    expanded:  false ,
                            },
                        },
                       columns: [
                            { xtype: 'rownumberer', },
                            { text: '스니핏 구분', header: '<div style="text-align:center;width:100%;">스니핏 구분</div>', dataIndex: 'SNIPPET_CD_NM', width : 120, minWidth : 100,  sort : true, },
                            { text: '스니핏 명', header: '<div style="text-align:center;width:100%;">스니핏 명</div>', flex : 1, width : 120, sortable: true, dataIndex: 'SNIPPET_NM' , minWidth : 100,   sort : true, 
                                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                    
                                    var link = new Array()
                                    
                                    link.push('<div class="link" id="snippet_'+ record.data.SNIPPET_UID +'" onclick="ErdAppFunction.loadSnippetInfo(\''+ record.data.SNIPPET_UID +'\')">'+record.data.SNIPPET_NM+'</div>');
                                
                                    return link.join(' ');
                                }
                            },
                            { text: '사용여부', header: '<div style="text-align:center;width:100%;">사용여부</div>', dataIndex: 'USE_YN_NM', width : 60, minWidth : 100,  sort : true, },
                       ], 
                   },
                   {
                       region: 'center',
                       border : true,
                       items : [
                           {
                                xtype : 'formPanel_ux',
                                id : 'snippetWindowForm',
                                region: 'center',
                                heigth : 410,
                                layout: { type: 'table' , columns: 1 },
                                bbar : [
                                   '->',
                                   { text: '신규',  cls : "btn_segmentedbutton"
                                     , handler : function() {
                                            Ext.getCmp('snippetWindowForm').getForm().reset(true);
                                         
                                         }
                                   },
                                   { text: '저장',  cls : "btn_segmentedbutton"
                                     , handler : function() {
                                           Ext.getCmp('snippetWindowForm').submit({
                                               clientValidation: true,
                                               url: '/project/data/snippetSave.do',
                                               success: function(form, action) {
                                                  Ext.getCmp("snippetWindow_SNIPPET_UID").setValue(action.result.SNIPPET_UID)
                                                  Ext.Msg.alert('성공', action.result.message, function() {
                                         
                                                      
                                                      Ext.getStore("snippetListStore").reload()
                                                      
                                                      // SNIPPET 초기화
                                                      ErdDrawFunction.sqlEditionList[snippet_cd] = null;
                                                      
                                                  });
                                               },
                                               failure: function(form, action) {
                                                  // console.log('failure', form, action );
                                                   switch (action.failureType) {
                                                       case Ext.form.action.Action.CLIENT_INVALID:
                                                           Ext.Msg.alert(
                                                               '오류',
                                                               '입력값을 확인하세요.'
                                                           );
                                                           break;
                                                       case Ext.form.action.Action.CONNECT_FAILURE:
                                                           Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                                           break;
                                                       case Ext.form.action.Action.SERVER_INVALID:
                                                          Ext.Msg.alert('실패', action.result.errorMessage);
                                                  }
                                               }
                                           });

                                        }    
                                   }
                                   
                                ],
                                items: [
                                    
                                    {   
                                        fieldLabel : '사용 구분',
                                        labelCls   : 'x-form-item-label x-form-item-label-required',
                                        xtype: 'combo_ux',
                                        name: 'SNIPPET_CD',
                                        msgTarget: 'side',
                                        allowBlank: true,
                                        // anchor: '100%',
                                        width : '99%',
                                        style : {padding : "0 0 0 0"},
                                        flex: 1,
                                        value : snippet_cd||'SELECT',
                                        valueField : 'VALUE',
                                        displayField: 'NAME',
                                        store : Ext.create('Ext.data.Store', {
                                            fields: ['VALUE', 'NAME'],
                                            data : [
                                                {"VALUE":"SELECT", "NAME":"조회(SELECT)"},
                                                {"VALUE":"CUD", "NAME":"등록/수정/삭제(CUD)"},
                                                {"VALUE":"WHERE", "NAME":"WHERE절 조건"},
                                            ]
                                        }),
                                    },
                                    {   
                                        fieldLabel : '스니핏 명',
                                        labelWidth : 100,
                                        xtype: 'textfield_ux',
                                        labelCls   : 'x-form-item-label x-form-item-label-required',
                                        name: 'SNIPPET_NM',
                                        msgTarget: 'side',
                                        allowBlank: false,
                                        value : '',
                                        width : '99%',
                                        anchor: '100%',
                                        emptyText : '스니핏 명',
                                        submitEmptyText : false,
                                    },
                                     {   
                                        fieldLabel : '스니핏 내용',
                                        xtype: 'textarea_ux',
                                        // labelCls   : 'x-form-item-label x-form-item-label-required',
                                        name: 'SNIPPET',
                                        msgTarget: 'side',
                                        // allowBlank: false,
                                        emptyText : '',
                                        submitEmptyText : false,
                                        height : 150,
                                        anchor: '100%',
                                        width : '99%',
                                        style : {padding : "0 0 0 0" },
                                        fieldStyle : { 'font-family' : "'Nanum Gothic Coding', monospace; font-size:13;"},
                                        contextMenu: { // TextArea에 contextMenu 속성을 추가하여 컨텍스트 메뉴를 설정합니다.
                                                xtype: 'menu', // 메뉴 컴포넌트
                                                items: [{
                                                    text: 'Cut', // 잘라내기 메뉴 아이템
                                                    handler: function() {
                                                        var textarea = Ext.getCmp('myTextArea'); // ID를 사용하여 TextArea 컴포넌트를 가져옵니다.
                                                        textarea.cut(); // 잘라내기 동작을 수행합니다.
                                                    }
                                                }, {
                                                    text: 'Copy', // 복사하기 메뉴 아이템
                                                    handler: function() {
                                                        var textarea = Ext.getCmp('myTextArea');
                                                        textarea.copy(); // 복사하기 동작을 수행합니다.
                                                    }
                                                }, {
                                                    text: 'Paste', // 붙여넣기 메뉴 아이템
                                                    handler: function() {
                                                        var textarea = Ext.getCmp('myTextArea');
                                                        textarea.paste(); // 붙여넣기 동작을 수행합니다.
                                                    }
                                                }]
                                            }
                                    },
                                    
                                    {   
                                        fieldLabel : '사용여부',
                                        labelCls   : 'x-form-item-label x-form-item-label-required',
                                        xtype: 'combo_ux',
                                        name: 'USE_YN',
                                        msgTarget: 'side',
                                        allowBlank: true,
                                        // anchor: '100%',
                                        width : '99%',
                                        style : {padding : "0 0 0 0"},
                                        flex: 1,
                                        value : 'Y',
                                        valueField : 'VALUE',
                                        displayField: 'NAME',
                                        store : Ext.create('Ext.data.Store', {
                                            fields: ['VALUE', 'NAME'],
                                            data : [
                                                {"VALUE":"Y", "NAME":"사용"},
                                                {"VALUE":"N", "NAME":"미사용"},
                                            ]
                                        }),
                                    },
                                    {
                                       xtype : 'hiddenfield',
                                       name: 'SNIPPET_UID',
                                       id : 'snippetWindow_SNIPPET_UID',
                                       hidden : true,
                                    },
                                 ]
                           },
                           {   xtype : 'gridpanel',
                               region: 'south',
                               rowLines : true,
                               columnLines: true,
                               id : 'snippetAbleVarGrid',
                               scrollable:true,
                               border : true,
                               height : 560,
                               autoScroll: true,
                                layout: {
                                    type: 'auto',
                                    align: 'stretch'
                                },
                               collapsible: false,
                               title: '사용가능한 변수',
                               enableTextSelection: true,
                               userSelectable: { bodyElement: 'text' },
                               /*
                              viewConfig: {
                                  templates: {
                                     cell: new Ext.Template(
                                        '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}"  tabIndex="0" {cellAttr}>',
                                        '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
                                        '</td>'
                                     )
                                  }
                               },
                               */
                              
                                plugins: {
                                    cellediting: {
                                        editing : true,
                                        clicksToEdit: 1
                                    }
                                },
                               
                                store: {
                                    xtype : 'store',
                                    storeId: 'snippetVarListStore',
                                    idProperty : 'data',
                                    fields: [
                                        { name : 'VAR_CD', type : 'string', format : '' },
                                        { name : 'VAR_NM', type : 'string', format : '' },
                                    ],
                                    data : [
                                        { 'VAR_CD' : '#ENTITY_ID#', 'VAR_NM':'테이블 ID'},
                                        { 'VAR_CD' : '#ENTITY_NM[.camelCase|.snake_case|.SNAKE_CASE]#', 'VAR_NM':'테이블 물리명', },
                                        { 'VAR_CD' : '#ENTITY_NM_ALIAS#', 'VAR_NM':'테이블 ALIAS'},
                                        { 'VAR_CD' : '#TABL_NM#', 'VAR_NM':'테이블 논리명'},
                                        { 'VAR_CD' : '#COLMN_NM[.camelCase|.snake_case|.SNAKE_CASE]#', 'VAR_NM':'컬럼 물리명'},
                                        { 'VAR_CD' : '#ATTR_NM#', 'VAR_NM':'컬럼 논리명'},
                                        { 'VAR_CD' : '#COLMN_DESC#', 'VAR_NM':'컬럼 설명'},
                                        { 'VAR_CD' : '#COLMN_ID#', 'VAR_NM':'컬럼ID'},
                                        { 'VAR_CD' : '#COLMN_SCD#', 'VAR_NM':'컬럼상태코드'},
                                        { 'VAR_CD' : '#COLMN_SCD_NM#', 'VAR_NM':'컬럼상태코드명'},
                                        { 'VAR_CD' : '#DATA_TYPE#', 'VAR_NM':'데이터 타입'},
                                        { 'VAR_CD' : '#DEFAULT_VAL#', 'VAR_NM':'기본값'},
                                        { 'VAR_CD' : '#DOMAIN_DATA_TYPE#', 'VAR_NM':'도메인 데이터 타입'},
                                        { 'VAR_CD' : '#DOMAIN_NM#', 'VAR_NM':'도메인 명'},
                                        //{ 'VAR_CD' : '#DTYPE#', 'VAR_NM':'데이터 타입'},
                                        // { 'VAR_CD' : '#FK_ENTITY_ID#', 'VAR_NM':'(FK)테이블 ID'},
                                        { 'VAR_CD' : '#FK_ENTITY_NM#', 'VAR_NM':'(FK)테이블 물리명'},
                                        // { 'VAR_CD' : '#INDENT#', 'VAR_NM':''},
                                        //{ 'VAR_CD' : '#LEN1#', 'VAR_NM':'데이터길이(소수점이상)'},
                                        //{ 'VAR_CD' : '#LEN2#', 'VAR_NM':'데이터길이(소수점이하)'},
                                        { 'VAR_CD' : '#NOTNULL_YN#', 'VAR_NM':'NOTNULL여부(Y/N)'},
                                        { 'VAR_CD' : '#NUMB_MTH#', 'VAR_NM':'코드/채번방식'},
                                        { 'VAR_CD' : '#PK_YN#', 'VAR_NM':'PK여부(Y/N)'},
                                        //{ 'VAR_CD' : '#UP_ENTITY_ID#', 'VAR_NM':''},
                                        { 'VAR_CD' : '#USE_YN#', 'VAR_NM':'사용여부'},
                                        //{ 'VAR_CD' : '#VERSN#', 'VAR_NM':''},
                                        
                                    ]
                                },
                               columns: [
                                    { xtype: 'rownumberer', },
                                    { text: '변수명', header: '<div style="text-align:center;width:100%;">변수명</div>', dataIndex: 'VAR_CD', flex : 1, width : 120, minWidth : 100,  sort : true, 
                                        renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                            var link = new Array();
                                            
                                            link.push('<div onclick="navigator.clipboard.writeText(\''+value+'\')">'+ value +'</div>');
                                            
                                            return link.join(' ');
                                           
                                           // return this.self.tpl.applyTemplate(record.data);
                                        },
                                        editor: {
                                            xtype : 'textfield'
                                        }
                                        /*
                                        statics: {
                                            tpl: new Ext.XTemplate(
                                                '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',
                                                    '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
                                                '</td>')
                                        }
                                        */
                                    },
                                    { text: '변수설명', header: '<div style="text-align:center;width:100%;">변수설명</div>', dataIndex: 'VAR_NM', width : 120, minWidth : 100,  sort : true, },
                               ], 
                           },
                    ]
                }
             ]
        });
        
        window.show();
    }
    
    /**
     * 테이블 index관리.
     */
    static tableIndexWindow(entity_id, index_id, _animateTarget) {
        var title = index_id ? "인덱스 수정" : "인덱스 추가";
        var window = Ext.create('Ext.window.Window', {
            title :  title,
            width : 1000,
             height : 60+(23*3)+500,
             autoShow :false,
             resizable : false,
             modal : true,
             id: 'tableIndexWindow',
             layout: 'border',
             animateTarget : _animateTarget||'leftSequenceAddBtn',
             border : true,
             buttons : [
                 {text: '', id : 'tableIndexWindow_btnDeleteCtrl', hidden : (index_id? false : true)
                     , handler : function() {
                          Ext.getCmp("tableIndexWindow_CHANGE_USE_YN").setValue("Y");
                          var use_yn = Ext.getCmp("tableIndexWindow_USE_YN").getValue()||"Y";
                          
                          if( use_yn  == "N" ) {
                              Ext.getCmp("tableIndexWindow_USE_YN").setValue("Y");
                          } else {
                              Ext.getCmp("tableIndexWindow_USE_YN").setValue("N");
                          }

                          submitFormGrid('tableIndexWindowForm', 'indexColumnListGrid', '/entity/data/saveIndex.do',  'all'
                              , function() { // successFn

                                  if( use_yn == "N") {
                                      Ext.getCmp("tableIndexWindow_btnDeleteCtrl").setText("삭제");
                                  } else {
                                      Ext.getCmp("tableIndexWindow_btnDeleteCtrl").setText("삭제취소");
                                  }
                                            
                                  Ext.getStore("indexTreeListStore").reload();
                                  Ext.getStore("columnChangeLogStore").reload();
                                  
                                  Ext.Msg.alert('성공', '인덱스를 수정했습니다.', function() {
                                      window.close()
                                  });
                              }
                              , function() { // failureFn
                                  Ext.Msg.alert('실패', '인덱스 수정에 실패했습니다.');
                              }
                          );
                     }
                     
                 },
                 { text: '저장', handler : function() {

                            /*
                            var gridData = Ext.encode(Ext.getStore("indexColumnListStore").getData().items.map(function (record) {
                                return record.data;
                            }));
                            */
                            submitFormGrid('tableIndexWindowForm', 'indexColumnListGrid', '/entity/data/saveIndex.do', 'all'
                                , function() { // successFn
                                    
                                    Ext.getStore("indexTreeListStore").reload();
                                    Ext.Msg.alert('성공', '인덱스를 생성했습니다.');
                                    Ext.Msg.alert('성공', '인덱스를 수정했습니다.', function() {
                                        window.close()
                                    });
                                }
                                , function() { // failureFn
                                    Ext.Msg.alert('실패', '인덱스 생성에 실패했습니다.');
                                }
                            );
                     }
                 }
             ],
             items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'tableIndexWindowForm',
                        region: 'north',
                        layout: { type: 'table' , columns: 2 },
                          listeners : {
                              afterrender : function( _this, eOpts) {
                                    var store = Ext.create('Ext.data.Store', {
                                        id : "tableIndeFormStore",
                                        fields: [
                                           { name : "ENTITY_ID"        , type : "string"},
                                           { name : "INDEX_ID"        , type : "string"},
                                           { name : "INDEX_NM"          , type : "string"},
                                           { name : "APLY_USER_NM"     , type : "string"},
                                           { name : "APLY_USR_UID"     , type : "string"},
                                           { name : "APLY_DT_FMT"      , type : "string"},
                                           { name : "APLY_DT"          , type : "date", format : "yyyy-mm-dd HH:mi:ss"},
                                           { name : "TRT_USER_NM"      , type : "string"},
                                           { name : "TRT_USR_UID"      , type : "string"},
                                           { name : "TRT_DT_FMT"       , type : "string"},
                                           { name : "TRT_DT"           , type : "date", format : "yyyy-mm-dd HH:mi:ss"},
                                           { name : "USE_YN"       , type : "string"},
                                        ], 
                                        proxy : {
                                            type : 'ajax',
                                            url : '/entity/data/indexInfo.do',
                                            reader : {
                                                type : 'json',
                                                rootProperty : 'data',
                                                totalProperty: 'totalCount' 
                                            },
                                            extraParams: {
                                               ENTITY_ID : entity_id,
                                               INDEX_ID : index_id,
                                            }
                                        }
                                    });
                                    store.load({params: { 'ENTITY_ID' : entity_id , INDEX_ID : index_id } });
                                    store.on("load", function(_this, _records, _successful, _eOpts ) {
                                        console.log( _this );
                                        console.log( _records[0]);
                                        var form = Ext.getCmp('tableIndexWindowForm');
                                        form.loadRecord(_records[0]);
                                        
                                        if( _records[0] ) {
                                            if( _records[0].get("USE_YN") == "N") {
                                                Ext.getCmp("tableIndexWindow_btnDeleteCtrl").setText("삭제취소");
                                            } else {
                                                Ext.getCmp("tableIndexWindow_btnDeleteCtrl").setText("삭제");
                                            }
                                        }
                                        // Ext.getCmp("editTableWindow_TABL_SCD").setValue(_records[0].data.TABL_SCD);
                                    });
                                }
                          },
                        items: [
                            {   
                                fieldLabel : '인덱스명',
                                labelWidth : 100,
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'INDEX_NM',
                                msgTarget: 'side',
                                allowBlank: false,
                                value : '',
                                anchor: '100%',
                                emptyText : '인덱스명',
                                submitEmptyText : false,
                            },
                            {
                                 xtype: 'checkboxgroup_ux',
                                 fieldLabel : '인덱스 관리상태',
                                 // vertical: true,
                                 colspan : 2,
                                 columns: 5,
                                 // id : 'addProject_TABL_SCD',
                                 name : 'INDEX_SCD[]',
                                 style : {padding : "0 3 0 0"},
                                 width : '100%',
                                 // height: 48, // 74,
                                 // serialize: true,
                                 listeners : {
                                     afterrender : function(_thisCheckboxGroup, _event) {
                                           var store = Ext.create('Ext.data.Store', {
                                                storeId: 'codeListStore_TABL_SCD',
                                                autoLoad: true,
                                                fields: [
                                                    { name: 'CD', type: 'string' },
                                                    { name: 'CD_NM', type: 'string' },
                                                    { name: 'CHECKED', type: 'string' },
                                                ],
                                                proxy: {
                                                    type: 'ajax',
                                                    url : '/codeProject/data/list.do',
                                                    extraParams : {
                                                        CD_GRP : "TABL_SCD",
                                                        GBN_CD : "INDEX_ID",
                                                        INDEX_ID : index_id
                                                    }, // , 
                                                    reader: {
                                                        type: 'json',
                                                        rootProperty : 'data',
                                                        totalProperty: 'totalCount'
                                                    },
                                                },
                                                listeners : {
                                                    load : function(_thisStore, records, successful, operation, eOpts) {
                                                        for(var i=0; i<records.length; i++) {
                                                            var item = { xtype : 'checkbox', boxLabel: records[i].get("CD_NM"), name: records[i].get("CD").replace(/TABL/ig, 'INDEX'), inputValue : records[i].get("CD"), checked: (records[i].get("IS_CHECKED")== "Y" ? true : false) };
                                                            
                                                            _thisCheckboxGroup.add(item);
                                                        }
                                                    }
                                                    
                                                }
                                                
                                            });
                                     },
                                     
                                 },
                                 items: [
                                     /*
                                     { xtype: 'checkbox', boxLabel: 'Item 1', name: 'cb-item-1', inputValue: '1', checked: true  },
                                    */
                                 ]
                             },
                            {
                               xtype : 'hiddenfield',
                               name: 'ENTITY_ID',
                               value : entity_id,
                               hidden : true,
                            },
                            {
                               xtype : 'hiddenfield',
                               name: 'INDEX_ID',
                               value : index_id,
                               hidden : true,
                            },
                            {
                               xtype : 'hiddenfield',
                               name: 'USE_YN',
                               id : 'tableIndexWindow_USE_YN',
                               hidden : true,
                            },
                            {
                               xtype : 'hiddenfield',
                               name: 'CHANGE_USE_YN',
                               id : 'tableIndexWindow_CHANGE_USE_YN',
                               hidden : true,
                            },
                        ]
                   },
                   {   xtype : 'gridpanel',
                       region: 'west',
                       columnLines: true,
                       border : true,
                       width : 460,
                       id : 'tableColumnList_gridPanel',
                       selType: 'checkboxmodel',
                       selModel: {
                          checkOnly: false,
                          injectCheckbox: 0,
                          mode: 'MULTI'
                       },
                       viewConfig: {
                            plugins: {
                                gridviewdragdrop: {
                                    containerScroll: true,
                                    copy : false,
                                    allowCopy : false,
                                    autoGenId : true,
                                    dragGroup: 'dd-grid-to-grid-group2',
                                    dropGroup: 'dd-grid-to-grid-group2',
                                    //ddGroup: 'destination1',
                                }
                            },
                            listeners: {
                                beforedrop : function ( node, data, overModel, dropPosition, dropHandlers, eOpts )  {
                                    var tableColumnStroe = Ext.getStore("tableColumnListStore");
                                    tableColumnStroe.sort('RNUM', "ASC");
                                },
                            },
                       },
                       title: '테이블 컬럼목록',
                        store: {
                            xtype : 'store',
                            storeId: 'tableColumnListStore',
                            idProperty : 'data',
                            fields: [
                                { name : 'COLMN_ID', type : 'string', format : '' },
                                { name : 'COLMN_NM', type : 'string', format : '' },
                                { name : 'ATTR_NM', type : 'string', format : '' },
                                { name : 'DATA_TYPE', type : 'string', format : '' },
                                { name : 'NOTNULL_YN', type : 'string', format : '' },
                                { name : 'NOTNULL_YN_BOOL', type : 'bool', format : '' },
                                { name : 'DEFAULT_VAL', type : 'string', format : '' },
                                { name : 'SEQ', type : 'string', format : '' },
                                { name : 'PK_YN', type : 'string', format : '' },
                                { name : 'PK_YN_BOOL', type : 'bool', format : '' },
                                { name : 'RNUM', type : 'int', format : '' },
                            ],
                            
                            autoLoad:  true ,
                            proxy : {
                                   type : 'ajax',
                                   url : '/entity/data/columnListNotIndexed.do',
                                   reader : {
                                       type : 'json',
                                       rootProperty : 'data',
                                       totalProperty: 'totalCount' 
                                   },
                                   extraParams: {
                                       ENTITY_ID : entity_id,
                                       INDEX_ID : index_id,
                                   }
                               },
                               root: {
                                    expanded:  false ,
                            },
                        },
                       columns: [
                            { xtype: 'rownumberer', },
                            { text: 'PK', dataIndex: 'PK_YN', width : 28, menuDisabled : true,  resizable : false, sort : false, disable : true, },
                            { text: '컬럼 논리 명', header: '<div style="text-align:center;width:100%;">컬럼 논리 명</div>', dataIndex: 'ATTR_NM', width : 120, minWidth : 100,  sort : true, },
                            { text: '컬럼 물리 명', header: '<div style="text-align:center;width:100%;">컬럼 명</div>', width : 120, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100,   sort : true, },
                            { text: '데이터 타입', header: '<div style="text-align:center;width:100%;">데이터 타입</div>', dataIndex: 'DATA_TYPE', width : 90,  sort : true, },
                            { text: 'Not널', dataIndex: 'NOTNULL_YN', align: "center", width : 50, menuDisabled : true, resizable : false,  sort : true, },
                       ], 
                   },
                   {   xtype : 'panel',
                       region: 'center',
                       border : true,
                       margin : "0 5 0 5",
                       title : '<>',
                       // style : {padding : "0 5 0 5"},
                       width : 50,
                       layout: {
                           type: 'vbox',
                           align: 'stretch'
                       },
                       items : [
                           {xtype : 'panel', html : '<div style="height:220px"></div>'},
                           {xtype : 'button', text : '->',  margin : "0 4 0 2",
                                handler : function() {
                                    var tableColumngrid = Ext.getCmp("tableColumnList_gridPanel");
                                    var selectedRecords = tableColumngrid.getSelectionModel().getSelection();

                                    var indexColumnGrid = Ext.getCmp("indexColumnListGrid");
                                    var indexStore = Ext.getStore("indexColumnListStore");
                                    for( var i=0 ; i < selectedRecords.length; i++) {
                                        selectedRecords[i].set("SORT_BASE", "ASC");
                                        indexStore.add(selectedRecords[i]);
                                        Ext.getStore("tableColumnListStore").remove(selectedRecords[i]);
                                    }
                                } 
                            },
                           {xtype : 'panel', html : '<div style="height:10px"></div>'},
                           {xtype : 'button', text : '<-',  margin : "0 4 0 2", 
                                handler : function() {
                                    var tableColumngrid = Ext.getCmp("tableColumnList_gridPanel");
                                    var tableColumnStroe = Ext.getStore("tableColumnListStore");
                                    var selectedRecords = tableColumngrid.getSelectionModel().getSelection();

                                    var indexColumnGrid = Ext.getCmp("indexColumnListGrid");
                                    var indexStore = Ext.getStore("indexColumnListStore");
                                    var indexRecords = indexColumnGrid.getSelectionModel().getSelection();
                                    for( var i=0 ; i < indexRecords.length; i++) {
                                        tableColumnStroe.add(indexRecords[i]);
                                        indexStore.remove(indexRecords[i]);
                                    }
                                    tableColumnStroe.sort('RNUM', "ASC");
                                } 
                           },
                       ]
                   },
                   {   xtype : 'gridpanel',
                       region: 'east',
                       columnLines: true,
                       border : true,
                       width : 490,
                       selType: 'checkboxmodel',
                       selModel: {
                          checkOnly: false,
                          injectCheckbox: 0,
                          mode: 'MULTI'
                       },
                       plugins: {
                            cellediting: {
                                editing : true,
                                clicksToEdit: 1
                            }
                       },
                       viewConfig: {
                            plugins: {
                                gridviewdragdrop: {
                                    containerScroll: true,
                                    copy : false,
                                    allowCopy : false,
                                    autoGenId : true,
                                    dragGroup: 'dd-grid-to-grid-group2',
                                    dropGroup: 'dd-grid-to-grid-group2',
                                    //ddGroup: 'destination1',
                                },
                            },
                            listeners: {
                                beforedrop : function ( node, data, overModel, dropPosition, dropHandlers, eOpts )  {
                                    for( var i=0; i < data.records.length; i++) {
                                        var dropRec = data.records[i];
                                        dropRec.set("SORT_BASE", "ASC");
                                    }
                                },
                                drop : function(node, data, overModel, dropPosition, eOpts ) {
                                    
                                    for( var i=0; i < Ext.getStore("indexColumnListStore").getData().length ; i++) {
                                        Ext.getStore("indexColumnListStore").getAt(i).set("ROW_NUM", i+1);;
                                    }
                                }
                            },
                       },
                       id : 'indexColumnListGrid',
                       title: '인덱스 컬럼목록',
                        store: {
                            xtype : 'store',
                            storeId: 'indexColumnListStore',
                            idProperty : 'data',
                            fields: [
                                { name : 'ROW_NUM', type : 'int', format : '' },
                                { name : 'COLMN_ID', type : 'string', format : '' },
                                { name : 'COLMN_NM', type : 'string', format : '' },
                                { name : 'ATTR_NM', type : 'string', format : '' },
                                { name : 'DATA_TYPE', type : 'string', format : '' },
                                { name : 'NOTNULL_YN', type : 'string', format : '' },
                                { name : 'NOTNULL_YN_BOOL', type : 'bool', format : '' },
                                { name : 'DEFAULT_VAL', type : 'string', format : '' },
                                { name : 'SEQ', type : 'string', format : '' },
                                { name : 'PK_YN', type : 'string', format : '' },
                                { name : 'PK_YN_BOOL', type : 'bool', format : '' },
                                { name : 'SORT_BASE', type : 'string', format : '' },
                            ],
                            
                            autoLoad:  true ,
                            proxy : {
                                   type : 'ajax',
                                   url : '/entity/data/columnListIndexed.do',
                                   reader : {
                                       type : 'json',
                                       rootProperty : 'data',
                                       totalProperty: 'totalCount' 
                                   },
                                   extraParams: {
                                       ENTITY_ID : entity_id,
                                       INDEX_ID : index_id,
                                   }
                               },
                               root: {
                                    expanded:  false ,
                            },
                        },
                       columns: [
                            { xtype: 'rownumberer', },
                            { text: '컬럼 논리 명', header: '<div style="text-align:center;width:100%;">컬럼 논리 명</div>', dataIndex: 'ATTR_NM', width : 110, minWidth : 100, flex : 1,  sort : true, },
                            { text: '컬럼 물리 명', header: '<div style="text-align:center;width:100%;">컬럼 명</div>', width : 120, sortable: true, dataIndex: 'COLMN_NM' , minWidth : 100,   sort : true, },
                            { text: '데이터 타입', header: '<div style="text-align:center;width:100%;">데이터 타입</div>', dataIndex: 'DATA_TYPE', width : 90,  sort : true, },
                            { text: '순서', header: '<div style="text-align:center;width:100%;"><div class="grid-header-numberfield"></div>순서</div>', dataIndex: 'ROW_NUM', width : 50, minWidth : 50, resize : false,
                                editor: {
                                    selectOnFocus: false,
                                    xtype : 'numberfield',
                                    minValue : 1,
                                    maxValue : 100,
                                    step : 1,
                                    listeners : {
                                        // change : function ( _this, newValue, oldValue, eOpts ) {
                                        focusleave : function ( _this, event, eOpts ) {
                                            Ext.getStore("indexColumnListStore").sort('ROW_NUM', "ASC");
                                            for( var i=0; i < Ext.getStore("indexColumnListStore").getData().length ; i++) {
                                                Ext.getStore("indexColumnListStore").getAt(i).set("ROW_NUM", i+1);
                                            }
                                            Ext.getStore("indexColumnListStore").sort('ROW_NUM', "ASC");
                                        }
                                    }
                                },
                            },
                            { text: '정렬순서', header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>정렬순서</div>', dataIndex: 'SORT_BASE', align: "center", width : 80, menuDisabled : true, resizable : false,   
                               editor: {
                                 xtype: 'combo',
                                 typeAhead: true,
                                 triggerAction: 'all',
                                 selectOnFocus: false,
                                 store: [
                                     ['ASC', 'ASC'],
                                     ['DESC', 'DESC'],
                                 ]
                              }
                            },
                       ], 
                   },
             ]
        });
        
        window.show();
    }
    
    
    static deleteTableWindow(drawDataLoad, type) {
        var _this = drawDataLoad;
        var valueTABL_SCD_SUBJECT = "";
        var msg = "";
        // 업무영역에서 선택된 항목을 삭제하는 경우,.
        if( type == 'deleteSelectedObjects' ) {
            var size = drawDataLoad.getSelectedTables()["ENTITY_IDS"].size;
        
            msg = '선택된 ' + size+'개의 테이블을 삭제하시겠습니까?';
        } 
        // 상세 조회된 entity삭제
        else if( type == 'deleteEntity' ) {
            var table_nm = Ext.getCmp('CENTER_RIGHT_TABL_NM').getValue();
            var entity_nm = Ext.getCmp('CENTER_RIGHT_ENTITY_NM').getValue();
            msg = "테이블 "+table_nm+"["+entity_nm+"]을(를) 삭제하시겠습니까?";
            // 우측 테이블 상세의 상태코드
            valueTABL_SCD_SUBJECT = Ext.getCmp("TABLE_DTL_TABL_SCD").getValue();
        }
        
        Ext.create('Ext.window.Window', {
            title :  msg,
            width : 380,
             height : 60+(23*2),
             autoShow :false,
             resizable : false,
             modal : true,
             id: 'deleteTableOrRelation',
             buttons : [
                 { text: '삭제', handler : function() {
                        /*
                        if( Ext.getCmp("delType_ALL").checked && !Ext.getCmp("delTypePopup_TABL_SCD_SUBJECT").value ) {
                               Ext.Msg.alert(
                                   '오류',
                                   '테이블 상태를 선택하세요.',
                                   function() {
                                       Ext.getCmp("delTypePopup_TABL_SCD_SUBJECT").focus();
                                   }
                               );
                               return;
                        }
                        */
                        var delType = 'deleteTable';
                        
                        if( Ext.getCmp('delType_ALL').checked ) {
                            delType = 'deleteTableInProject';
                        } else {
                            type = 'deleteSelectedObjects';
                        }
                        ;
                        // 업무영역에서 선택된 항목을 삭제하는 경우,.
                        if( type == 'deleteSelectedObjects' ) {
                            // 테이블 삭제..
                            drawDataLoad.getSelectedTables()["ENTITY_IDS"].forEach(function(entity_id, entity_id2, set) {
                               var table = drawDataLoad.getDrawedTable(drawDataLoad.getSelectedTables()["SUBJECT_ID"], entity_id);
                               
                               // 테이블 삭제
                               var result = drawDataLoad.deleteTableInfo(delType, { "SUBJECT_ID" : drawDataLoad.getSelectedTables()["SUBJECT_ID"], "ENTITY_ID" : entity_id} )
                               
                               if( result.success ){
                                   if( result.SUBJECT_ENTITY_DELETE_YN == "Y" ) {
                                       if( table ) {
                                           table.deleteTable();
                                       }
                                   } else {
                                       var pkInsertEntityList = result.PK_INSERT_ENTITY_LIST;
                                       var pkDeleteEntityList = result.PK_DELETE_ENTITY_LIST;
                                       
                                       var entityList = result.ENTITY_LIST;
                                       var entityColumnList = result.ENTITY_COLUMN_LIST;
                                       
                                       drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
                                    }
                               }
                            });
                        
                            drawDataLoad.setSelectedTables( null, null, null);
                            Ext.getCmp('DRAW_BUTTON').setValue('pointer');
                        }
                        // 상세 조회된 entity삭제
                        else if( type == 'deleteEntity' ) {
                            var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
                            var entity_id = Ext.getCmp("CENTER_RIGHT_TABLE_ENTITY_ID").getValue();
                            var table = drawDataLoad.getDrawedTable(subject_id, entity_id);
                           
                            // 테이블 삭제
                            var result = drawDataLoad.deleteTableInfo(delType, { "SUBJECT_ID" : subject_id, "ENTITY_ID" : entity_id} )
                            
                            if( result.success ){
                                if( result.SUBJECT_ENTITY_DELETE_YN == "Y" ) {
                                    if( table ) {
                                        table.deleteTable();
                                    }
                                } else {
                                    var pkInsertEntityList = result.PK_INSERT_ENTITY_LIST;
                                    var pkDeleteEntityList = result.PK_DELETE_ENTITY_LIST;
                                    
                                    var entityList = result.ENTITY_LIST;
                                    var entityColumnList = result.ENTITY_COLUMN_LIST;
                                    
                                    drawDataLoad.restoreEntityAndColumn(pkInsertEntityList, pkDeleteEntityList, entityList, entityColumnList);
                                 }
                                 
                                 // 좌측 테이블 영역 재조회.
                                 Ext.getStore("entityListStore").reload();
                                 
                                 Ext.getCmp("btn_tableDelete").setText("삭제취소");
                                 if( Ext.getCmp("table_DML_TCD").value == "DML_TCD_I") {
                                      Ext.getCmp("table_DML_TCD").setValue("DML_TCD_I_D");
                                 } else if( Ext.getCmp("table_DML_TCD").value == "DML_TCD_U") {
                                      Ext.getCmp("table_DML_TCD").setValue("DML_TCD_U_D");
                                 } else {
                                     Ext.getCmp("table_DML_TCD").setValue("DML_TCD_D");
                                 }
                            }
                        }
                        
                        Ext.getCmp('deleteTableOrRelation').close();
                     }
                 }
             ],
             items : [
                    {
                        xtype      : 'fieldcontainer',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'vbox',
                        items: [
                            {
                                boxLabel  : '업무영역에서만 삭제',
                                name      : 'delType',
                                inputValue: 'SUBJECT',
                                id        : 'delType_SUBJECT',
                                checked   : true
                            },
                            {
                                boxLabel  : '프로젝트에서 완전히 삭제',
                                name      : 'delType',
                                inputValue: 'ALL',
                                id        : 'delType_ALL'
                            }, 
                            /*
                            {
                                xtype      : 'combo_ux',
                                fieldLabel : '테이블 상태', 
                                id : "delTypePopup_TABL_SCD_SUBJECT",
                                name : 'TABL_SCD',
                                msgTarget: 'side',
                                anchor: '100%',
                                width:200,
                                aqtip : '테이블 상태',
                                queryMode: 'local',
                                displayField: 'CD_NM',
                                valueField: 'CD',
                                emptyText : '선택',
                                value : valueTABL_SCD_SUBJECT,
                                style : {padding : "0 3 0 1"},
                                
                                store : Ext.getStore("store_TABLE_DTL_TABL_SCD")
                            },
                            */
                        ]
                    },
             ]
             , listeners : {
                 close : function( panel, eOpts ) {
                     Ext.getCmp('DRAW_BUTTON').setValue('pointer');
                 } 
                 
             }
        }).show();
    
    }
    
    
    static addTableWindow(entityType, draw, drawDataLoad, subjectAreaInfo, scroll, ev ) {
        var window = Ext.create('Ext.window.Window', {
                         title :  ' 신규 테이블/뷰 등록',
                         width : 400,
                         height : 60+(23*3)+100,
                         autoShow :false,
                         resizable : false,
                         modal : true,
                         id : 'addTableWindow',
                         buttons : [
                             { text: '저장', handler : function() {
                                   
                                    
                                   Ext.getCmp('addTableForm').submit({
                                       clientValidation: true,
                                       url: '/entity/data/save.do',
                                       success: function(form, action) {
                                          console.log('success', form, action );
                                          Ext.Msg.alert('성공', action.result.message, function() {
                                              // 테이블 상태 코드
                                              /*
                                              var record = Ext.getStore("addTableForm_TABL_SCD_Store").findRecord("CD", Ext.getCmp("addTableWindow_TABL_SCD").getValue());
                                              var tabl_scd_nm = "";
                                              if( record ) {
                                                  tabl_scd_nm =record.data.CD_NM;
                                              }
                                              */
                                              var entity_tcd = Ext.getCmp("addTableWindow_ENTITY_NM").getValue()
                                              
                                              var record = Ext.getStore("addTableWindow_ENTITY_TCD_Store").findRecord("VALUE", entity_tcd);
                                              var entity_tcd_nm = "";
                                              if( record ) {
                                                  entity_tcd_nm =record.data.NAME;
                                              }
                                             
                                              var entity_id = action.result.ENTITY_ID;
                                              
                                              var tableInfo = { "SUBJECT_ID" : subjectAreaInfo["SUBJECT_ID"],  "ENTITY_ID" : entity_id , "TABLE_NM" : Ext.getCmp('addTableWindow_TABL_NM').getValue(), "ENTITY_NM": Ext.getCmp('addTableWindow_ENTITY_NM').getValue(), "IS_SUB_TABLE" : false, "X" : scroll.left + ev.layerX, "Y" : scroll.top + ev.layerY, "WIDTH" : 150, "HEIGHT" : 100, "HAS_PK" : false, "ENTITY_TCD" : entity_tcd, "ENTITY_TCD_NM" : entity_tcd_nm };
                                              drawDataLoad.setDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"], new DrawTable( draw, subjectAreaInfo, tableInfo, drawDataLoad ));
                                              drawDataLoad.getDrawedTable(subjectAreaInfo["SUBJECT_ID"], tableInfo["ENTITY_ID"]).drawTable();
                                            
                                              drawDataLoad.addTable( tableInfo );
                                              
                                              Ext.getCmp('DRAW_BUTTON').setValue('pointer');
                                              Ext.getStore("domainTreeStore").reload();
                                              Ext.getStore("entityListStore").reload();
                                              Ext.getStore("subjectEntityListStore").reload();
                                              
                                              Ext.getStore("columnListStore").removeAll();
                                              Ext.getStore("tableLayoutStore").reload();

                                               
                                              $( "#minimap-"+ subjectAreaInfo["SUBJECT_ID"] ).html('');
                                              $( "#minimap-"+ subjectAreaInfo["SUBJECT_ID"] ).minimap( $("#"+ subjectAreaInfo["SUBJECT_ID"] ) );

                                              // 상세 테이블 조회 영역 표시..
                                              ErdDrawFunction.loadTableInfo(entity_id, true);
                                 
                                              Ext.getCmp('addTableWindow').close();
                                              
                                              // ENTITY 수 증가.
                                              drawDataLoad.addProjectBuyInfo( 'ENTITY', 1);
                                          });
                                       },
                                       failure: function(form, action) {
                                          // console.log('failure', form, action );
                                           switch (action.failureType) {
                                               case Ext.form.action.Action.CLIENT_INVALID:
                                                   Ext.Msg.alert(
                                                       '오류',
                                                       '입력값을 확인하세요.'
                                                   );
                                                   break;
                                               case Ext.form.action.Action.CONNECT_FAILURE:
                                                   Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                                   break;
                                               case Ext.form.action.Action.SERVER_INVALID:
                                                  Ext.Msg.alert('실패', action.result.errorMessage);
                                          }
                                       }
                                   });
                               } 
                             },
                          ],
                          items : [
                                {
                                    xtype : 'formPanel_ux',
                                    submitEmptyText : false,
                                    id : 'addTableForm',
                                    // layout: { type: 'table' , columns: 1 },
                                    items: [
                                             {xtype: 'hiddenfield', name: 'SUBJECT_ID', value: subjectAreaInfo["SUBJECT_ID"] },
                                             {xtype: 'hiddenfield', name: 'IS_SUB_TABLE', value: "N" },
                                             {xtype: 'hiddenfield', name: 'X', value: scroll.left + ev.layerX },
                                             {xtype: 'hiddenfield', name: 'Y', value: scroll.top + ev.layerY },
                                             {xtype: 'hiddenfield', name: 'WIDTH', value: 150 },
                                             {xtype: 'hiddenfield', name: 'HEIGHT', value: 100 },
                                             {   
                                                fieldLabel : '테이블/뷰 논리 명',
                                                xtype: 'textfield_ux',
                                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'TABL_NM',
                                                id : 'addTableWindow_TABL_NM',
                                                msgTarget: 'side',
                                                allowBlank: false,
                                                emptyText : '테이블명(한글)을 입력',
                                                submitEmptyText : false,
                                                anchor: '100%',
                                                style : {padding : "0 3 0 1"},
                                                listeners: {
                                                    afterrender: function(field) {
                                                        field.focus();
                                                        
                                                    }, 
                                                    change : function( _this, newValue, oldValue, eOpts ) {
                                                        // console.log( newValue + ": " + oldValue)
                                                    },
                                                    focusleave : function( _this, event, eOpts ) {
                                                        
                                                        // Ext.getCmp('addTableWindow_ENTITY_NM').setValue(ErdAppFunction.getWord( _this.getValue(), 'ENTITY'));
                                                        ErdAppFunction.getWord( _this.getValue(), 'ENTITY', function(_value) {
                                                            console.log( _value );
                                                            Ext.getCmp('addTableWindow_ENTITY_NM').setValue( _value );
                                                        });
                                                    }
                                                },
                                            }, 
                                             {   
                                                fieldLabel : '테이블/뷰 물리 명',
                                                xtype: 'textfield_ux',
                                                // labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'ENTITY_NM',
                                                id : 'addTableWindow_ENTITY_NM',
                                                msgTarget: 'side',
                                                // allowBlank: false,
                                                // emptyText : '엔테티명(영어)을 입력, 미입력시 단어사전을 이용해 설정 가능',
                                                submitEmptyText : false,
                                                anchor: '100%',
                                                style : {padding : "0 3 0 1"},
                                            }, 

                                            {   
                                                fieldLabel : '객체 유형',
                                                xtype: 'combo_ux',
                                                name: 'ENTITY_TCD',
                                                id : "addTableWindow_ENTITY_TCD",
                                                msgTarget: 'side',
                                                allowBlank: true,
                                                // anchor: '100%',
                                                width : '99%',
                                                style : {padding : "0 3 0 1"},
                                                flex: 1,
                                                value : entityType,
                                                valueField : 'VALUE',
                                                displayField: 'NAME',
                                                store : Ext.create('Ext.data.Store', {
                                                    id : "addTableWindow_ENTITY_TCD_Store",
                                                    fields: ['VALUE', 'NAME'],
                                                    data : [
                                                        {"VALUE":"TABLE", "NAME":"테이블(Table)"},
                                                        {"VALUE":"VIEW", "NAME":"뷰(View)"},
                                                        {"VALUE":"MVIEW", "NAME":"구체화뷰(MView)"},
                                                    ]
                                                }),
                                                listeners : {
                                                    afterrender : function( _this, eOpts ) {
                                                        Ext.getStore("addTableWindow_ENTITY_TCD_Store").clearFilter();
                                                        
                                                        Ext.getStore("addTableWindow_ENTITY_TCD_Store").filter({
                                                            property: 'VALUE',//your displayField
                                                            anyMatch: true,
                                                            value   : entityType, // this.getRawValue(),
                                                            exactMatch: false,
                                                            caseSensitive: false
                                                        });
                                                    }
                                                    
                                                }
                                            },

                                            
                                            /*
                                            {
                                                xtype      : 'combo_ux',
                                                fieldLabel : '테이블 관리상태', 
                                                id : 'addTableWindow_TABL_SCD',
                                                name : 'TABL_SCD',
                                                msgTarget: 'side',
                                                anchor: '100%',
                                                width:200,
                                                aqtip : '테이블 관리상태',
                                                queryMode: 'local',
                                                displayField: 'CD_NM',
                                                valueField: 'CD',
                                                value : '',
                                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                                allowBlank: false,
                                                style : {padding : "0 3 0 1"},
                                                
                                                store : Ext.create('Ext.data.Store', {
                                                    id : "addTableForm_TABL_SCD_Store",
                                                    fields: [
                                                        { name : "CD"         , type : "string"},        
                                                        { name : "CD_GRP"     , type : "string"},        
                                                        { name : "CD_NM"      , type : "string"},        
                                                        { name : "CD_VAL_A"   , type : "string"},        
                                                        { name : "CD_VAL_B"   , type : "string"},        
                                                        { name : "CD_VAL_C"   , type : "string"},        
                                                        { name : "CD_VAL_1"   , type : "number"},        
                                                        { name : "CD_VAL_2"   , type : "number"},        
                                                        { name : "CD_VAL_3"   , type : "number"},        
                                                        { name : "ORD_TRN"    , type : "string"},        
                                                        { name : "IS_CHECKED" , type : "string"},        
                                                    ],
                                                    autoLoad: true,
                                                    proxy: {
                                                        type: 'ajax',
                                                        url : '/codeProject/data/list.do',
                                                        extraParams : {
                                                            "CD_GRP" : "TABL_SCD",
                                                        }, // , 
                                                        reader: {
                                                            type: 'json',
                                                            rootProperty : 'data',
                                                            totalProperty: 'totalCount'
                                                        },
                                                    },
                                                    listeners : {
                                                        load : function( store , records, successful, operation, eOpts ) {
                                                            store.clearFilter();
                                                            
                                                            store.filter({
                                                                property: 'IS_CHECKED',//your displayField
                                                                anyMatch: true,
                                                                value   : 'Y', // this.getRawValue(),
                                                                exactMatch: true,
                                                                caseSensitive: false
                                                            });
                                                            
                                                            var record = store.findRecord("IS_CHECKED", "Y");
                                                            
                                                            Ext.getCmp("addTableWindow_TABL_SCD").setValue(record.data.CD)
                                                            
                                                        }    
                                                    }
                                                }),
                                                listeners : {
                                                    afterrender : function ( _this, eOpts ) {
                                                        
                                                        // var store1 = this.getStore();//store object
                                                        // store1.clearFilter();
                                                        // 
                                                        // store1.filter({
                                                        //     property: 'IS_CHECKED',//your displayField
                                                        //     anyMatch: true,
                                                        //     value   : 'Y', // this.getRawValue(),
                                                        //     exactMatch: true,
                                                        //     caseSensitive: false
                                                        // });
                                                        // 
                                                        // var record = store1.findRecord("IS_CHECKED", "Y");
                                                        // _this.value = record.data.CD;
                                                        
                                                    },
                                                    beforerender : function ( _this, eOpts ) {
                                                        // console.log( _this )    
                                                    },
                                                    
                                                    expand: function(field, eOpts) {
                                                        
                                                    },
                                                } 
                                             },
                                             */
                                             {   
                                                fieldLabel : '테이블/뷰 설명',
                                                xtype: 'textarea_ux',
                                                // labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'TABL_DESC',
                                                msgTarget: 'side',
                                                // allowBlank: false,
                                                emptyText : '',
                                                submitEmptyText : false,
                                                height : 100,
                                                anchor: '100%',
                                                style : {padding : "0 3 1 1"},
                                            }
                                    ]
                                 }
                            ]
                     });
            window.show();
        
    }

    static editTableWindow( subject_id, entity_id ) {
        var window = Ext.create('Ext.window.Window', {
                         title :  ' 신규 테이블 등록',
                         width : 400,
                         height : 60+(23*3)+100,
                         autoShow :false,
                         resizable : false,
                         modal : true,
                         id : 'editTableWindow',
                          listeners : {
                              afterrender : function( _this, eOpts) {
                                    var store = Ext.create('Ext.data.Store', {
                                        id : "editTableDetailStore",
                                        fields: [
                                           { name : "PROJECT_ID"       , type : "string"},
                                           { name : "ENTITY_ID"        , type : "string"},
                                           { name : "ENTITY_NM"        , type : "string"},
                                           { name : "TABL_NM"          , type : "string"},
                                           { name : "TABL_SCD"         , type : "string"},
                                           { name : "TABL_SCD_NM"      , type : "string"},
                                           { name : "DML_TCD"          , type : "string"},  
                                           { name : "DML_TCD_NM"       , type : "string"},  
                                           { name : "TCD_NM"           , type : "string"},
                                           { name : "DML_DT_FMT"       , type : "string"},
                                           { name : "DML_DT"           , type : "date", format : "yyyy-mm-dd HH:mi:ss"},
                                           { name : "APLY_USR_UID"     , type : "string"},
                                           { name : "APLY_DT_FMT"      , type : "string"},
                                           { name : "APLY_DT"          , type : "date", format : "yyyy-mm-dd HH:mi:ss"},
                                           { name : "TRT_USR_UID"      , type : "string"},
                                           { name : "TRT_DT_FMT"       , type : "string"},
                                           { name : "TRT_DT"           , type : "date", format : "yyyy-mm-dd HH:mi:ss"},
                                           { name : "ENTITY_ID"        , type : "string"},
                                           { name : "TABL_DESC"        , type : "string"},
                                           { name : "FRST_INS_DT"      , type : "string"},
                                           { name : "FRST_INS_USR_UID" , type : "string"},
                                           { name : "LAST_UPD_DT"      , type : "string"},
                                           { name : "LAST_UPD_USR_UID" , type : "string"},
                                           { name : "VERSN"            , type : "string"},
                                           { name : "USE_YN"           , type : "string"},
                                        ], 
                                        proxy : {
                                            type : 'ajax',
                                            url : '/entity/data/detail.do',
                                            reader : {
                                                type : 'json',
                                                rootProperty : 'data',
                                                totalProperty: 'totalCount' 
                                            },
                                            extraParams: {
                                                
                                            }
                                        }
                                    });
                                    store.load({params: { 'ENTITY_ID' : entity_id } });
                                    store.on("load", function(_this, _records, _successful, _eOpts ) {
                                        console.log( _this );
                                        console.log( _records[0]);
                                        var form = Ext.getCmp('editTableForm');
                                        form.loadRecord(_records[0]);
                                        
                                        // Ext.getCmp("editTableWindow_TABL_SCD").setValue(_records[0].data.TABL_SCD);
                                    });
                                }
                          },
                         buttons : [
                             { text: '저장', handler : function() {
                                   
                                    
                                   Ext.getCmp('editTableForm').submit({
                                       clientValidation: true,
                                       url: '/entity/data/save.do',
                                       success: function(form, action) {
                                          console.log('success', form, action );
                                          Ext.Msg.alert('성공', action.result.message, function() {
                                              // 테이블 상태 코드
                                              var record = Ext.getStore("editTableForm_TABL_SCD_Store").findRecord("CD", Ext.getCmp("editTableWindow_TABL_SCD").getValue());
                                              var tabl_scd_nm = "";
                                              if( record ) {
                                                  tabl_scd_nm =record.data.CD_NM;
                                              }
                                              var entity_id = action.result.ENTITY_ID;
                                              
                                              var table_nm = Ext.getCmp('editTableWindow_TABL_NM').getValue();
                                              var entity_nm = Ext.getCmp('editTableWindow_ENTITY_NM').getValue();
                                              var tableInfo = { "SUBJECT_ID" : subject_id,  "ENTITY_ID" : entity_id , "TABLE_NM" : table_nm, "ENTITY_NM": entity_nm, "TABL_SCD_NM" : tabl_scd_nm };
                                              //drawDataLoad.setDrawedTable(subject_id, tableInfo["ENTITY_ID"], new DrawTable( draw, subjectAreaInfo, tableInfo, drawDataLoad ));
                                              //drawDataLoad.getDrawedTable(subject_id, tableInfo["ENTITY_ID"]).drawTable();
                                            
                                              // drawDataLoad.addTable( tableInfo );
                                              
                                              Ext.getCmp('DRAW_BUTTON').setValue('pointer');
                                              Ext.getStore("domainTreeStore").reload();
                                              Ext.getStore("entityListStore").reload();
                                              Ext.getStore("subjectEntityListStore").reload();
                                              
                                              Ext.getStore("columnListStore").removeAll();
                                              Ext.getStore("tableLayoutStore").reload();

                                              // 테이블 명 변경
                                              var node = Ext.dom.Query.selectNode("g.header_"+entity_id + " text tspan");
                                              Ext.DomHelper.overwrite(node, table_nm+ "/"+entity_nm+"[" +tabl_scd_nm + "]");

                                               
                                              //$( "#minimap" ).html('');
                                              //$( "#minimap" ).minimap( $("#"+ entity_id ) );
                                              var entityDetailStore = Ext.getStore("entityDetailStore");

                                              entityDetailStore.load({params: { 'ENTITY_ID' : entity_id } });
                                              entityDetailStore.on("load", function(_this, _records, _successful, _eOpts ) {
                                                    var form = Ext.getCmp('centerRightEntityDetailForm');
                                                    form.loadRecord(_records[0]);
                                              });
                                              
                                              var entity = action.result.ENTITY;
                                              var subjectEntityList = action.result.ENTITY_LIST;
                                              
                                              drawDataLoad.restoreEntityInfo(entity, subjectEntityList);

                                              // 상세 테이블 조회 영역 표시..
                                              ErdDrawFunction.loadTableInfo(entity_id, true);

                                              Ext.getCmp('editTableWindow').close();
                                              // 좌측테이블 병역 재조회.
                                              Ext.getStore("entityListStore").reload();
                                          });
                                       },
                                       failure: function(form, action) {
                                          // console.log('failure', form, action );
                                           switch (action.failureType) {
                                               case Ext.form.action.Action.CLIENT_INVALID:
                                                   Ext.Msg.alert(
                                                       '오류',
                                                       '입력값을 확인하세요.'
                                                   );
                                                   break;
                                               case Ext.form.action.Action.CONNECT_FAILURE:
                                                   Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                                   break;
                                               case Ext.form.action.Action.SERVER_INVALID:
                                                  Ext.Msg.alert('실패', action.result.errorMessage);
                                          }
                                       }
                                   });
                               } 
                             },
                          ],
                          items : [
                                {
                                    xtype : 'formPanel_ux',
                                    submitEmptyText : false,
                                    id : 'editTableForm',
                                    // layout: { type: 'table' , columns: 1 },
                                    items: [
                                             {xtype: 'hiddenfield', name: 'SUBJECT_ID', value: subject_id },
                                             {xtype: 'hiddenfield', name: 'ENTITY_ID', value: entity_id },
                                             {   
                                                fieldLabel : '테이블 명',
                                                xtype: 'textfield_ux',
                                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'TABL_NM',
                                                id : 'editTableWindow_TABL_NM',
                                                msgTarget: 'side',
                                                allowBlank: false,
                                                emptyText : '테이블명(한글)을 입력',
                                                submitEmptyText : false,
                                                anchor: '100%',
                                                style : {padding : "0 3 0 1"},
                                                listeners: {
                                                    afterrender: function(field) {
                                                        field.focus();
                                                        
                                                    }, 
                                                    change : function( _this, newValue, oldValue, eOpts ) {
                                                        // console.log( newValue + ": " + oldValue)
                                                    },
                                                    focusleave : function( _this, event, eOpts ) {
                                                        ErdAppFunction.getWord( _this.getValue(), 'ENTITY', function(_value) {
                                                            console.log( _value );
                                                            if( Ext.getCmp('editTableWindow_ENTITY_NM') ) {
                                                                Ext.getCmp('editTableWindow_ENTITY_NM').setValue( _value );
                                                            }
                                                        });
                                                        
                                                    }
                                                },
                                            }, 
                                             {   
                                                fieldLabel : 'ENTITY명',
                                                xtype: 'textfield_ux',
                                                // labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'ENTITY_NM',
                                                id : 'editTableWindow_ENTITY_NM',
                                                msgTarget: 'side',
                                                // allowBlank: false,
                                                // emptyText : '엔테티명(영어)을 입력, 미입력시 단어사전을 이용해 설정 가능',
                                                submitEmptyText : false,
                                                anchor: '100%',
                                                style : {padding : "0 3 0 1"},
                                            }, 
                                            {
                                                xtype      : 'combo_ux',
                                                fieldLabel : '테이블 관리상태', 
                                                id : 'editTableWindow_TABL_SCD',
                                                name : 'TABL_SCD',
                                                msgTarget: 'side',
                                                anchor: '100%',
                                                width:200,
                                                aqtip : '테이블 관리상태',
                                                queryMode: 'local',
                                                displayField: 'CD_NM',
                                                valueField: 'CD',
                                                value : '',
                                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                                allowBlank: false,
                                                style : {padding : "0 3 0 1"},
                                                
                                                store : Ext.create('Ext.data.Store', {
                                                    id : "editTableForm_TABL_SCD_Store",
                                                    fields: [
                                                        { name : "CD"         , type : "string"},        
                                                        { name : "CD_GRP"     , type : "string"},        
                                                        { name : "CD_NM"      , type : "string"},        
                                                        { name : "CD_VAL_A"   , type : "string"},        
                                                        { name : "CD_VAL_B"   , type : "string"},        
                                                        { name : "CD_VAL_C"   , type : "string"},        
                                                        { name : "CD_VAL_1"   , type : "number"},        
                                                        { name : "CD_VAL_2"   , type : "number"},        
                                                        { name : "CD_VAL_3"   , type : "number"},        
                                                        { name : "ORD_TRN"    , type : "string"},        
                                                        { name : "IS_CHECKED" , type : "string"},        
                                                    ],
                                                    autoLoad: true,
                                                    proxy: {
                                                        type: 'ajax',
                                                        url : '/codeProject/data/list.do',
                                                        extraParams : {
                                                            "CD_GRP" : "TABL_SCD",
                                                        }, // , 
                                                        reader: {
                                                            type: 'json',
                                                            rootProperty : 'data',
                                                            totalProperty: 'totalCount'
                                                        },
                                                    },
                                                    listeners : {
                                                        load : function( store , records, successful, operation, eOpts ) {
                                                            store.clearFilter();
                                                            
                                                            store.filter({
                                                                property: 'IS_CHECKED',//your displayField
                                                                anyMatch: true,
                                                                value   : 'Y', // this.getRawValue(),
                                                                exactMatch: true,
                                                                caseSensitive: false
                                                            });
                                                            
                                                        }    
                                                    }
                                                }),
                                                listeners : {
                                                    afterrender : function ( _this, eOpts ) {
                                                    },
                                                    beforerender : function ( _this, eOpts ) {
                                                        // console.log( _this )    
                                                    },
                                                    
                                                    expand: function(field, eOpts) {
                                                        
                                                    },
                                                } 
                                            }, 
                                             {   
                                                fieldLabel : 'ENTITY설명',
                                                xtype: 'textarea_ux',
                                                // labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'TABL_DESC',
                                                msgTarget: 'side',
                                                // allowBlank: false,
                                                emptyText : '',
                                                submitEmptyText : false,
                                                height : 100,
                                                anchor: '100%',
                                                style : {padding : "0 3 1 1"},
                                            }
                                    ]
                                 }
                            ]
                     });
            window.show();
        
    }

    static editDomainWindow(domain_id, domain_nm, top_domain_nm){
        var window = Ext.create('Ext.window.Window', {
              title : '['+domain_nm+'] 도메인수정',
              width : 400,
              height : 370,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : 'domain_'+domain_id,
              layout: 'fit',
              listeners : {
                  afterrender : function( _this, eOpts) {

                     Ext.create('Ext.data.Store', {
                         storeId: 'domainEditDetailStore',
                         fields: [
                            { name: 'DOMAIN_ID', type: 'string' },
                            { name: 'DOMAIN_NM', type: 'string' },
                            { name: 'UP_DOMAIN_ID', type: 'string' },
                            { name: 'TOP_DOMAIN_NM', type: 'string' },
                            { name: 'DTYPE', type: 'string' },
                            { name: 'PROJECT_ID', type: 'string' },
                            { name: 'LEN1', type: 'string' },
                            { name: 'LEN2', type: 'string' },
                            { name: 'DEFAULT_VAL', type: 'string' },
                            { name: 'ICON_CLS', type: 'string' },
                            { name: 'COLUMN_CNT', type: 'number' },
                         ],
                         proxy: {
                             type: 'ajax',
                             url: '/domain/data/detail.do',
                             reader: {
                                 type: 'json',
                                 rootProperty: 'detail'
                             },
                             extraParams: {
                                DOMAIN_ID : domain_id
                            }
                         },
                         autoLoad: true,
                         listeners : {
                             load : function(_this, _records, _successful, _eOpts ) {
                                  Ext.getCmp('editDomainForm').loadRecord(_records[0]);
                             }
                             
                         }
                     });
                  }
              },
              buttons : [
                  { text: '저장', handler : function() {
                        Ext.getCmp('editDomainForm').submit({
                            clientValidation: true,
                            url: '/domain/data/save.do',
                            success: function(form, action) {
                               // console.log('success', form, action );
                               Ext.Msg.alert('성공', action.result.message, function() {
                                   Ext.getStore("domainTreeStore").reload();
                               });
                            },
                            failure: function(form, action) {
                               // console.log('failure', form, action );
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert(
                                            '오류',
                                            '입력값을 확인하세요.'
                                        );
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                       Ext.Msg.alert('실패', action.result.errorMessage);
                               }
                            }
                        });
                    } 
                  },
                  { text: '삭제', handler : function() {
                      
                        var node = Ext.getStore("domainTreeStore").findNode( "DOMAIN_ID", domain_id);
                        var columnCount = Ext.getStore("domainEditDetailStore").getAt(0).get("COLUMN_CNT");
                        if( node.hasChildNodes() ) {
                                Ext.Msg.alert(
                                    '오류',
                                    '하위노드가 있을 경우 삭제 할 수 없습니다.'
                                );
                        } 
                        else if( columnCount > 0 ) {
                                Ext.Msg.alert(
                                    '오류',
                                    '컬럼에서 사용중인 도메인은 삭제 할 수 없습니다.<br/>(현재 '+columnCount+'개의 컬럼에서 사용 중이니, 해당컬럼의 도메인을 변경 후 삭제하세요.)'
                                );
                        } 
                        else {
                            Ext.getCmp('editDomainForm').submit({
                                msgConfirm : '도메인 ['+domain_nm + ']을(를) 삭제하시겠습니까?',
                                clientValidation: true,
                                url: '/domain/data/delete.do',
                                success: function(form, action) {
                                    // console.log('success', form, action );
                                    var idx = Ext.getStore("domainTreeStore").find( "DOMAIN_ID", domain_id);
                                    Ext.Msg.alert('성공', action.result.message, function() {
                                       // Ext.getStore("domainTreeStore").reload();
                                       
                                       Ext.getStore("domainTreeStore").removeAt(idx);
                                       window.close();
                                    });
                                    
                                },
                                failure: function(form, action) {
                                   // console.log('failure', form, action );
                                    switch (action.failureType) {
                                        case Ext.form.action.Action.CLIENT_INVALID:
                                            Ext.Msg.alert(
                                                '오류',
                                                '입력값을 확인하세요.'
                                            );
                                            break;
                                        case Ext.form.action.Action.CONNECT_FAILURE:
                                            Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                           Ext.Msg.alert('실패', action.result.errorMessage);
                                   }
                                }
                            });
                        }
                    } 
                  }
                  
              ],
              items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'editDomainForm',
                        items: [
                             {
                                xtype: 'hiddenfield',
                                name: 'UP_DOMAIN_ID',
                                //value: domainInfo.DOMAIN_ID
                             },
                             {
                                xtype: 'hiddenfield',
                                name: 'DOMAIN_ID',
                                //value: domainInfo.DOMAIN_ID
                             },
                             {
                                fieldLabel : '최상위 도메인명',
                                xtype: 'hiddenfield',
                                name: 'TOP_DOMAIN_NM',
                                //value : domainInfo.TOP_DOMAIN_NM,
                                
                             },
                             {
                                fieldLabel : '상위도메인명',
                                xtype: 'displayfield_ux',
                                name: 'UP_DOMAIN_NM',
                                //value : domainInfo.DOMAIN_NM,
                                
                             },
                             {   
                                fieldLabel : '도메인명',
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'DOMAIN_NM',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                listeners: {
                                    afterrender: function(field) {
                                        field.focus();
                                    }
                                },
                            }, 
                             {   
                                fieldLabel : '데이터 타입',
                                xtype: 'combo_ux', // combotipple_ux
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'DTYPE',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                
                                //forceSelection: true,
                                //autoSelect: true,
                                //typeAheadDelay: 0,
                                //typeAhead: true,
                                //triggerAction: 'all',
                                //minChars: 1,
                                queryMode: 'local',
                                valueField : 'DTYPE',
                                displayField: 'DTYPE',
                                store : Ext.getStore("store_DATA_TYPE"),
                                  /* Ext.create('Ext.data.Store', {
                                    storeId: 'datatypeListStore',
                                    autoLoad: true,
                                    fields: [
                                        { name: 'DTYPE', type: 'string' },
                                        { name: 'DBASE', type: 'string' },
                                        { name: 'UP_DTYPE', type: 'string' },
                                        { name: 'DTYPE_DESC', type: 'string' },
                                        { name: 'SYNTAX', type: 'string' },
                                        { name: 'SCALE_YN', type: 'string' },
                                        { name: 'SCALE_NEED_YN', type: 'string' },
                                        { name: 'COMMA_YN', type: 'string' },
                                    ],
                                    proxy: {
                                        type: 'ajax',
                                        url : '/datatype/data/list.do',
                                        extraParams : {
                                            
                                        }, // , 
                                        reader: {
                                            type: 'json',
                                            rootProperty : 'dataList',
                                            totalProperty: 'totalCount'
                                        },
                                    }
                                }),
                                */
                                listeners : {
                                    expand: function(field, eOpts) {
                                        var store1 = this.getStore();//store object
                                        store1.clearFilter();
                                        store1.filter({
                                            property: 'UP_DTYPE',//your displayField
                                            anyMatch: true,
                                            value   : top_domain_nm, // this.getRawValue(),
                                            exactMatch: false,
                                            caseSensitive: false
                                        });
                                    },
                                    change : function( _this, newValue, oldValue, eOpts ) {
                                        if( _this.displayTplData && _this.displayTplData[0] ) {
                                            if( _this.displayTplData[0].SCALE_YN == "Y") {
                                                Ext.getCmp("editDomainForm_dataLen").setDisabled(false);
                                                if(  _this.displayTplData[0].COMMA_YN == "Y") {
                                                    Ext.apply(Ext.getCmp("editDomainForm_dataLen"), {vtype: 'NUMBERScale'});
                                                    Ext.getCmp("editDomainForm_dataLen").setBlankText("ex) 4 또는 10,2");
                                                } else {
                                                    Ext.apply(Ext.getCmp("editDomainForm_dataLen"), {vtype: 'CHARScale'});
                                                    Ext.getCmp("editDomainForm_dataLen").setBlankText("1~4000사이값");
                                                }
                                                if( _this.displayTplData[0].SCALE_NEED_YN == "Y") {
                                                    Ext.getCmp("editDomainForm_dataLen").setAllowBlank(false);
                                                    Ext.getCmp("editDomainForm_dataLen").labelEl.addCls("x-form-item-label-required")
                                                } else {
                                                    Ext.getCmp("editDomainForm_dataLen").setAllowBlank(true);
                                                    Ext.getCmp("editDomainForm_dataLen").labelEl.removeCls("x-form-item-label-required")
                                                }
                                            } else {
                                                Ext.getCmp("editDomainForm_dataLen").setValue('');
                                                Ext.getCmp("editDomainForm_dataLen").setDisabled(true);
                                                Ext.getCmp("editDomainForm_dataLen").setAllowBlank(true);
                                                Ext.getCmp("editDomainForm_dataLen").labelEl.removeCls("x-form-item-label-required")
                                            }

                                            Ext.get("dtypeDesc").setHtml("[사용법]"+ _this.displayTplData[0].SYNTAX +"<br>["+newValue+"]설명<br/><div>"+ _this.displayTplData[0].DTYPE_DESC +"</div>" );
                                        } else {
                                            Ext.get("dtypeDesc").setHtml("[사용법]사용법<br>[데이터타입]설명");
                                        }
                                    }
                                }
                            }, 
                            {   
                                fieldLabel : '데이터 길이',
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                id : 'editDomainForm_dataLen',
                                name: 'LEN',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                // disabled : true,
                                maskRe: /[0-9\,]/,
                                placeholder : '길이 등록'
                            },
                            {   
                                fieldLabel : '기본값',
                                xtype: 'textfield_ux',
                                name: 'DEFAULT_VAL',
                                msgTarget: 'side',
                                allowBlank: true,
                                anchor: '100%',
                            },
                            {   
                                fieldLabel : '도메인 설명',
                                xtype: 'textarea_ux',
                                name: 'DOMAIN_DESC',
                                msgTarget: 'side',
                                allowBlank: true,
                                anchor: '100%',
                                height : 50
                            }, 
                            {
                                xtype : 'component',
                                html : "[사용법]사용법<br>[데이터타입]설명",
                                id : "dtypeDesc"
                            },
                        ]
                }
              ]
        }).show();
    }
    
    static addDomainWindow(domain_id, domain_nm, top_domain_nm, record){
        var window = Ext.create('Ext.window.Window', {
              title : '['+domain_nm+']의 하위 도메인등록',
              width : 400,
              height : 370,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : 'domain_'+domain_id,
              layout: 'fit',
              
              listeners : {
                  afterrender : function( _this, eOpts) {

                     Ext.create('Ext.data.Store', {
                         storeId: 'domainAddDetailStore',
                         fields: [
                            { name: 'DOMAIN_ID', type: 'string' },
                            { name: 'DOMAIN_NM', type: 'string' },
                            { name: 'UP_DOMAIN_ID', type: 'string' },
                            { name: 'TOP_DOMAIN_NM', type: 'string' },
                            { name: 'DTYPE', type: 'string' },
                            { name: 'PROJECT_ID', type: 'string' },
                            { name: 'LEN1', type: 'string' },
                            { name: 'LEN2', type: 'string' },
                            { name: 'DEFAULT_VAL', type: 'string' },
                            { name: 'ICON_CLS', type: 'string' },
                            { name: 'COLUMN_CNT', type: 'number' },
                         ],
                         proxy: {
                             type: 'ajax',
                             url: '/domain/data/detailForAdd.do',
                             reader: {
                                 type: 'json',
                                 rootProperty: 'detail'
                             },
                             extraParams: {
                                DOMAIN_ID : domain_id
                            }
                         },
                         autoLoad: true,
                         listeners : {
                             load : function(_this, _records, _successful, _eOpts ) {
                                  Ext.getCmp('addDomainForm').loadRecord(_records[0]);
                                  Ext.getCmp('addDomainForm_DOMAIN_NM').focus();
                             }
                             
                         }
                     });
                  }
              },
              buttons : [
                  { text: '저장', handler : function() {
                        Ext.getCmp('addDomainForm').submit({
                            clientValidation: true,
                            url: '/domain/data/save.do',
                            success: function(form, action) {
                               /*
                                var node = Ext.getStore("domainTreeStore").findNode( "DOMAIN_ID", domain_id);
                                node.appendChild({"DOMAIN_ID" : "DOMAIN_ID", "DOMAIN_NM" : "DOMAIN_NM", "leaf":false, "text" : "text"});
                               */
                               
                               Ext.Msg.alert('성공', action.result.message, function() {
                                   Ext.getStore("domainTreeStore").reload();
                                   window.close();
                               });
                               
                            },
                            failure: function(form, action) {
                               // console.log('failure', form, action );
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert(
                                            '오류',
                                            '입력값을 확인하세요.'
                                        );
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                       Ext.Msg.alert('실패', action.result.errorMessage);
                               }
                            }
                        });
                      } 
                  }
                  
              ],
              items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'addDomainForm',
                        items: [
                             {
                                xtype: 'hiddenfield',
                                name: 'UP_DOMAIN_ID',
                                value: domain_id
                             },
                             {
                                fieldLabel : '최상위 도메인명',
                                xtype: 'hiddenfield',
                                name: 'TOP_DOMAIN_NM',
                                value : top_domain_nm,
                                
                             },
                             {
                                fieldLabel : '상위도메인명',
                                xtype: 'displayfield_ux',
                                name: 'UP_DOMAIN_NM',
                                value : domain_nm,
                                
                             },
                             {   
                                fieldLabel : '도메인명',
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'DOMAIN_NM',
                                id : 'addDomainForm_DOMAIN_NM',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                listeners: {
                                    afterrender: function(field) {
                                        field.focus();
                                    }
                                },
                              }, 
                             {   
                                fieldLabel : '데이터 타입',
                                xtype: 'combo_ux', // combotipple_ux
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'DTYPE',
                                msgTarget: 'side',
                                allowBlank: false,
                                // forceSelection: true,
                                //autoSelect: true,
                                //typeAheadDelay: 0,
                                //typeAhead: true,
                                //triggerAction: 'all',
                                //minChars: 1,
                                //anyMatch: true,
                                queryMode: 'local',
                                anchor: '100%',
                                value : '',
                                valueField : 'DTYPE',
                                displayField: 'DTYPE',
                                store : Ext.getStore("store_DATA_TYPE"),
                                 /* Ext.create('Ext.data.Store', {
                                    storeId: 'datatypeListStore',
                                    autoLoad: true,
                                    fields: [
                                        { name: 'DTYPE', type: 'string' },
                                        { name: 'DBASE', type: 'string' },
                                        { name: 'UP_DTYPE', type: 'string' },
                                        { name: 'DTYPE_DESC', type: 'string' },
                                        { name: 'SYNTAX', type: 'string' },
                                        { name: 'SCALE_YN', type: 'string' },
                                        { name: 'SCALE_NEED_YN', type: 'string' },
                                        { name: 'COMMA_YN', type: 'string' },
                                    ],
                                    proxy: {
                                        type: 'ajax',
                                        url : '/datatype/data/list.do',
                                        extraParams : {
                                            
                                        }, // , 
                                        reader: {
                                            type: 'json',
                                            rootProperty : 'dataList',
                                            totalProperty: 'totalCount'
                                        },
                                    }
                                }), */
                                
                                listeners : {
                                    expand: function(field, eOpts) {
                                        var store1 = this.getStore();//store object
                                        store1.clearFilter();
                                        store1.filter({
                                            property: 'UP_DTYPE',//your displayField
                                            anyMatch: true,
                                            value   : top_domain_nm, // this.getRawValue(),
                                            exactMatch: false,
                                            caseSensitive: false
                                        });
                                    },
                                    change : function( _this, newValue, oldValue, eOpts ) {
                                        
                                        // console.log( _this.displayTplData, _this.displayTplData[0] )
                                        if( _this.displayTplData && _this.displayTplData[0] ) {
                                            if( _this.displayTplData[0].SCALE_YN == "Y") {
                                                Ext.getCmp("addDomainForm_dataLen").setDisabled(false);
                                                Ext.getCmp("addDomainForm_dataLen").focus();
                                                if(  _this.displayTplData[0].COMMA_YN == "Y") {
                                                    Ext.apply(Ext.getCmp("addDomainForm_dataLen"), {vtype: 'NUMBERScale'});
                                                    Ext.getCmp("addDomainForm_dataLen").setBlankText("ex) 4 또는 10,2");
                                                } else {
                                                    Ext.apply(Ext.getCmp("addDomainForm_dataLen"), {vtype: 'CHARScale'});
                                                    Ext.getCmp("addDomainForm_dataLen").setBlankText("1~4000사이값");
                                                }
                                                if( _this.displayTplData[0].SCALE_NEED_YN == "Y") {
                                                    Ext.getCmp("addDomainForm_dataLen").setAllowBlank(false);
                                                    Ext.getCmp("addDomainForm_dataLen").labelEl.addCls("x-form-item-label-required")
                                                } else {
                                                    Ext.getCmp("addDomainForm_dataLen").setAllowBlank(true);
                                                    Ext.getCmp("addDomainForm_dataLen").labelEl.removeCls("x-form-item-label-required")
                                                }
                                            } else {
                                                Ext.getCmp("addDomainForm_dataLen").setDisabled(true);
                                                Ext.getCmp("addDomainForm_dataLen").setAllowBlank(true);
                                                Ext.getCmp("addDomainForm_dataLen").labelEl.removeCls("x-form-item-label-required")
                                            }

                                            Ext.get("dtypeDesc").setHtml("[사용법]"+ _this.displayTplData[0].SYNTAX +"<br>["+newValue+"]설명<br/><div>"+ _this.displayTplData[0].DTYPE_DESC +"</div>" );
                                        } else {
                                            Ext.get("dtypeDesc").setHtml("[사용법]사용법<br>[데이터타입]설명");
                                        }
                                        
                                    },
                                    render : function(_this, eOpts) {
                                        if( record  ) {
                                            if( record.get("SCALE_YN") == "Y") {
                                                Ext.getCmp("addDomainForm_dataLen").setDisabled(false);
                                                if( record.get("COMMA_YN")  == "Y") {
                                                    Ext.apply(Ext.getCmp("addDomainForm_dataLen"), {vtype: 'NUMBERScale'});
                                                    Ext.getCmp("addDomainForm_dataLen").setBlankText("ex) 4 또는 10,2");
                                                } else {
                                                    Ext.apply(Ext.getCmp("addDomainForm_dataLen"), {vtype: 'CHARScale'});
                                                    Ext.getCmp("addDomainForm_dataLen").setBlankText("1~4000사이값");
                                                }
                                                Ext.getCmp("addDomainForm_dataLen").setAllowBlank(false);
                                            } else {
                                                Ext.getCmp("addDomainForm_dataLen").setDisabled(true);
                                                Ext.getCmp("addDomainForm_dataLen").setAllowBlank(true);
                                            }

                                            Ext.get("dtypeDesc").setHtml("[사용법]"+ record.get("SYNTAX") +"<br>["+record.get("DTYPE")+"]설명<br/><div>"+ record.get("DTYPE_DESC") +"</div>" );
                                        } else {
                                            Ext.get("dtypeDesc").setHtml("[사용법]사용법<br>[데이터타입]설명");
                                        }
                                    }
                                }
                                
                            }, 
                            {   
                                fieldLabel : '데이터 길이',
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                id : 'addDomainForm_dataLen',
                                name: 'LEN',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                // disabled : true,
                                value : record.get("LEN1") + (record.get("LEN2") ? ("," +record.get("LEN2"))  : "" ),
                                maskRe: /[0-9\,]/,
                                placeholder : '길이 등록'
                            },
                            {   
                                fieldLabel : '기본값',
                                xtype: 'textfield_ux',
                                name: 'DEFAULT_VAL',
                                msgTarget: 'side',
                                allowBlank: true,
                                value : record.get("DEFAULT_VAL"),
                                anchor: '100%',
                            },
                            {   
                                fieldLabel : '도메인 설명',
                                xtype: 'textarea_ux',
                                name: 'DOMAIN_DESC',
                                msgTarget: 'side',
                                allowBlank: true,
                                anchor: '100%',
                                height : 50
                            }, 
                            {
                                xtype : 'component',
                                html : "[데이터타입 설명]",
                                id : "dtypeDesc"
                            },
                        ]
                }
              ]
        }).show();
    }
    
    static deleteDomain(domain_id, domain_nm){
        /*
        Ext.Msg.confirm('도메인 삭제', '도메인 ['+domain_nm + ']을(를) 삭제하시겠습니까?', function(btn) {
            console.log(btn + " : " + domain_id);
        });
        */
        Ext.Msg.show({
             title:'도메인 삭제',
             msg: '도메인 ['+domain_nm + ']을(를) 삭제하시겠습니까?',
             animateTarget : 'domain_delete_'+domain_id,
             buttons: Ext.Msg.YESNO, //YESNOCANCEL
             icon: Ext.Msg.QUESTION,
             fn : function(btn) {
                 if( btn == "yes") {
                     
                 }
             }
        });
        
    }

    /**
     * 업무영역 등록
     */
    static addSequenceWindow(sequence_id, _animateTarget){
        
        var viewSize = Ext.getBody().getViewSize();
        
        var window = Ext.create('Ext.window.Window', {
              title : '시퀀스 등록',
              width : 400,
              height : 60+(23*8)+50, // 
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : _animateTarget||'leftSequenceAddBtn',
              layout: 'fit',
              listeners : {
                  afterrender : function( _this, eOpts) {

                     Ext.create('Ext.data.Store', {
                         storeId: 'sequenceDetailStore',
                         fields: [
                            { name: 'SEQNC_ID', type: 'string' },
                            { name: 'SEQNC_NM', type: 'string' },
                            { name: 'SEQNC_DESC', type: 'string' },
                            { name: 'BGN_VAL', type: 'int' },
                            { name: 'END_VAL', type: 'int' },
                            { name: 'INC_VAL', type: 'int' },
                            { name: 'USE_YN', type: 'string' },
                            { name: 'TABL_SCD', type: 'string' },
                            { name: 'TABL_SCD_NM', type: 'string' },
                            { name: 'TRT_USR_UID', type: 'string' },
                            { name: 'TRT_DT', type: 'string' },
                            { name: 'TRT_DT_FMT', type: 'string' },
                            { name: 'ENTITY_NM', type: 'string' },
                            { name: 'COLMN_NM', type: 'string' },
                         ],
                         proxy: {
                             type: 'ajax',
                             url: '/sequence/data/detail.do',
                             reader: {
                                 type: 'json',
                                 rootProperty: 'detail'
                             },
                             extraParams: {
                                SEQNC_ID : sequence_id
                            }
                         },
                         autoLoad: true,
                         listeners : {
                             load : function(_this, _records, _successful, _eOpts ) {
                                  Ext.getCmp('addSequenceForm').loadRecord(_records[0]);
                             }
                             
                         }
                     });
                  }
              },
              buttons : [
                  { text: '저장', handler : function() {
                        Ext.getCmp('addSequenceForm').submit({
                            clientValidation: true,
                            url: '/sequence/data/save.do',
                            success: function(form, action) {
                               /*
                                var node = Ext.getStore("domainTreeStore").findNode( "DOMAIN_ID", domain_id);
                                node.appendChild({"DOMAIN_ID" : "DOMAIN_ID", "DOMAIN_NM" : "DOMAIN_NM", "leaf":false, "text" : "text"});
                               */
                               
                               Ext.Msg.alert('성공', action.result.message, function() {
                                   Ext.getStore("sequenceListStore").reload();
                                   window.close();
                               });
                               
                            },
                            failure: function(form, action) {
                               // console.log('failure', form, action );
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert(
                                            '오류',
                                            '입력값을 확인하세요.'
                                        );
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                       Ext.Msg.alert('실패', action.result.errorMessage);
                               }
                            }
                        });
                      } 
                  }
                  
              ],
              items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'addSequenceForm',
                        items: [
                             {
                                xtype: 'hiddenfield',
                                name: 'SEQNC_ID',
                                value: sequence_id
                             },
                             {   
                                fieldLabel : '시퀀스 명',
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'SEQNC_NM',
                                value : '',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                listeners: {
                                    afterrender: function(field) {
                                        field.focus();
                                    }
                                },
                            }, 
                            {   
                                fieldLabel : '시작값',
                                xtype: 'numberfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'BGN_VAL',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                decimalPrecision : 0,
                                value : 1, // parseInt(viewSize.width/100)*100,
                                step : 1,
                                minValue : 1, // parseInt(viewSize.width/100)*100,
                                maxValue : 9999999999, // parseInt(viewSize.width/100)*100+10000,
                                placeholder : '시작값'
                            },
                            {   
                                fieldLabel : '종료값',
                                xtype: 'numberfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'END_VAL',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                decimalPrecision : 0,
                                value : 1, // parseInt(viewSize.height/100)*100,
                                step : 1,
                                minValue : 1, // parseInt(viewSize.height/100)*100,
                                maxValue : 9999999999, // parseInt(viewSize.height/100)*100+10000,
                                placeholder : '종료값'
                            },
                            {   
                                fieldLabel : '증가값',
                                xtype: 'numberfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'INC_VAL',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                decimalPrecision : 0,
                                value : 1, // parseInt(viewSize.height/100)*100,
                                step : 1,
                                minValue : 1, // parseInt(viewSize.height/100)*100,
                                maxValue : 100, // parseInt(viewSize.height/100)*100+10000,
                                placeholder : '증가값'
                            },
                            {
                                 xtype: 'combo_ux',
                                 fieldLabel : '객체 상태 관리',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                 id : 'addSequence_TABL_SCD',
                                 name : 'TABL_SCD',
                                 style : {padding : "0 0 0 0"},
                                 width : '100%',
                                 allowBlank: false,
                                 displayField: 'CD_NM',
                                 valueField: 'CD',
                                 store : Ext.create('Ext.data.Store', {
                                        storeId: 'sequenceListStore_TABL_SCD',
                                        autoLoad: true,
                                        fields: [
                                            { name: 'CD', type: 'string' },
                                            { name: 'CD_NM', type: 'string' },
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url : '/codeProject/data/list.do',
                                            extraParams : {
                                                CD_GRP : "TABL_SCD",
                                            }, // , 
                                            reader: {
                                                type: 'json',
                                                rootProperty : 'data',
                                                totalProperty: 'totalCount'
                                            },
                                        },
                                        listeners : {
                                            load : function() {
                                                if( sequence_id ) {
                                                    Ext.getCmp("addSequence_TABL_SCD").setValue( Ext.getStore("sequenceListStore_TABL_SCD").getAt(0).get("CD"));
                                                }
                                            }
                                        }
                                        
                                    })
                            },
                            {   
                                fieldLabel : '사용여부',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                xtype: 'combo_ux',
                                name: 'USE_YN',
                                msgTarget: 'side',
                                allowBlank: true,
                                // anchor: '100%',
                                width : '100%',
                                style : {padding : "0 0 0 0"},
                                flex: 1,
                                value : 'Y',
                                valueField : 'VALUE',
                                displayField: 'NAME',
                                store : Ext.create('Ext.data.Store', {
                                    fields: ['VALUE', 'NAME'],
                                    data : [
                                        {"VALUE":"Y", "NAME":"사용"},
                                        {"VALUE":"N", "NAME":"삭제"},
                                    ]
                                }),
                            },
                             {   
                                fieldLabel : '테이블 명',
                                xtype: 'textfield_ux',
                                // labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'ENTITY_NM',
                                value : '',
                                msgTarget: 'side',
                                allowBlank: true,
                                anchor: '100%',
                                listeners: {
                                    afterrender: function(field) {
                                        
                                    }
                                },
                            }, 
                             {   
                                fieldLabel : '컬럼 명',
                                xtype: 'textfield_ux',
                                // labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'COLMN_NM',
                                value : '',
                                msgTarget: 'side',
                                allowBlank: true,
                                anchor: '100%',
                                listeners: {
                                    afterrender: function(field) {
                                        
                                    }
                                },
                            }, 
                            {   
                                fieldLabel : '시퀀스 설명',
                                xtype: 'textarea_ux',
                                name: 'SEQNC_DESC',
                                msgTarget: 'side',
                                allowBlank: true,
                                anchor: '100%',
                                height : 50
                            }, 
                        ]
                }
              ]
        }).show();
    }


    /**
     * 업무영역 등록
     */
    static addSubjectWindow(subject_id, subject_nm, _animateTarget){
        
        var viewSize = Ext.getBody().getViewSize();
        
        var window = Ext.create('Ext.window.Window', {
              title : '업무영역 ' + (subject_id ? "수정" : "등록"),
              width : 400,
              height : 130,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : _animateTarget||'leftSubjectSubjectAddBtn',
              layout: 'fit',
              listeners : {
                  afterrender : function( _this, eOpts) {

                     Ext.create('Ext.data.Store', {
                         storeId: 'subjectDetailStore',
                         fields: [
                            { name: 'SUBJECT_ID', type: 'string' },
                            { name: 'SUBJECT_NM', type: 'string' },
                            { name: 'WIDTH', type: 'string' },
                            { name: 'HEIGHT', type: 'string' },
                         ],
                         proxy: {
                             type: 'ajax',
                             url: '/subject/data/detail.do',
                             reader: {
                                 type: 'json',
                                 rootProperty: 'detail'
                             },
                             extraParams: {
                                SUBJECT_ID : subject_id
                            }
                         },
                         autoLoad: true,
                         listeners : {
                             load : function(_this, _records, _successful, _eOpts ) {
                                  Ext.getCmp('addSubjectForm').loadRecord(_records[0]);
                             }
                             
                         }
                     });
                  }
              },
              buttons : [
                  { text: '저장', handler : function() {
                        Ext.getCmp('addSubjectForm').submit({
                            clientValidation: true,
                            url: '/subject/data/save.do',
                            success: function(form, action) {
                               /*
                                var node = Ext.getStore("domainTreeStore").findNode( "DOMAIN_ID", domain_id);
                                node.appendChild({"DOMAIN_ID" : "DOMAIN_ID", "DOMAIN_NM" : "DOMAIN_NM", "leaf":false, "text" : "text"});
                               */
                               
                               Ext.Msg.alert('성공', action.result.message, function() {
                                   for(var i=0; i < Ext.getCmp("ERD-SUBJECTS").items.keys.length;i++) {
                                       if( subject_id ==  Ext.getCmp("ERD-SUBJECTS").items.keys[i]) {
                                           
                                           // Ext.getCmp("ERD-SUBJECTS").getTab(subject_id).setTitle('New Tab Title');
                                           Ext.getCmp("ERD-SUBJECTS").setTabTitle(i, Ext.getCmp("addSubjectWindow_SUBJECT_NM").getValue());
                                           // Ext.getCmp("ERD-SUBJECTS").items.items[0].title = Ext.getCmp("addSubjectWindow_SUBJECT_NM").getValue();
                                           // Ext.getCmp("ERD-SUBJECTS").getAt(i).doLayout();
                                           // Ext.getCmp("ERD-SUBJECTS").getComponent(subject_id).setTitle(Ext.getCmp("addSubjectWindow_SUBJECT_NM").getValue());
                                        }
                                   }
                                   Ext.getStore("subjectEntityListStore").reload();
                                   drawDataLoad.reloadData("subjectAreaDatas");
                                   window.close();
                               });
                               
                            },
                            failure: function(form, action) {
                               // console.log('failure', form, action );
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert(
                                            '오류',
                                            '입력값을 확인하세요.'
                                        );
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                       Ext.Msg.alert('실패', action.result.errorMessage);
                               }
                            }
                        });
                      } 
                  },
                  
                  { text: '삭제', handler : function() {
                        Ext.getCmp('addSubjectForm').submit({
                            msg : '삭제하시겠습니까?',
                            clientValidation: true,
                            url: '/subject/data/delete.do',
                            success: function(form, action) {
                               
                               Ext.Msg.alert('성공', action.result.message, function() {
                                   for(var i=0; i < Ext.getCmp("ERD-SUBJECTS").items.keys.length;i++) {
                                       if( subject_id ==  Ext.getCmp("ERD-SUBJECTS").items.keys[i]) {
                                           
                                           Ext.getCmp("ERD-SUBJECTS").setTabTitle(i, Ext.getCmp("addSubjectWindow_SUBJECT_NM").getValue());
                                        }
                                   }
                                   Ext.getStore("subjectEntityListStore").reload();
                                   
                                   drawDataLoad.reloadData("subjectAreaDatas");
                                   
                                   Ext.getCmp("ERD-SUBJECTS").remove(subject_id);
                                   
                                   window.close();
                               });
                               
                            },
                            failure: function(form, action) {
                               // console.log('failure', form, action );
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert(
                                            '오류',
                                            '입력값을 확인하세요.'
                                        );
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                       Ext.Msg.alert('실패', action.result.errorMessage);
                               }
                            }
                        });
                      } 
                  }
                  
              ],
              items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'addSubjectForm',
                        items: [
                             {
                                xtype: 'hiddenfield',
                                name: 'SUBJECT_ID',
                                value: subject_id
                             },
                             {   
                                fieldLabel : '기본 업무영역 명',
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'SUBJECT_NM',
                                id : 'addSubjectWindow_SUBJECT_NM',
                                value : subject_nm,
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                listeners: {
                                    afterrender: function(field) {
                                        field.focus();
                                    }
                                },
                            }, 
                            {   
                                fieldLabel : '그리기 영역 넓이',
                                xtype: 'numberfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'WIDTH',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                decimalPrecision : 0,
                                value : 2500, // parseInt(viewSize.width/100)*100,
                                step : 100,
                                minValue : 2500, // parseInt(viewSize.width/100)*100,
                                maxValue : 30000, // parseInt(viewSize.width/100)*100+10000,
                                placeholder : '영역 넓이'
                            },
                            {   
                                fieldLabel : '그리기 영역 높이',
                                xtype: 'numberfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'HEIGHT',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                decimalPrecision : 0,
                                value : 2500, // parseInt(viewSize.height/100)*100,
                                step : 100,
                                minValue : 2500, // parseInt(viewSize.height/100)*100,
                                maxValue : 30000, // parseInt(viewSize.height/100)*100+10000,
                                placeholder : '영역 높이'
                            },
                        ]
                }
              ]
        }).show();
    }

    /**
     * 프로젝트 공유 신청
     */
    static applyProjectWindow(_animateTarget){
        var window = Ext.create('Ext.window.Window', {
              title : '프로젝트 공유신청',
              width : 400,
              height : 60+(23*2)+75,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : _animateTarget,
              layout: 'fit',
              buttons : [
                  { text: '공유 신청', disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                        handler : function() {
                            Ext.getCmp('applyProjectForm').submit({
                                clientValidation: true,
                                url: '/project/data/apply.do',
                                success: function(form, action) {

                                   Ext.Msg.alert('성공', action.result.message, function() {
                                        window.close();
                                   });
                                   
                                },
                                failure: function(form, action) {
                                    // console.log('failure', form, action );
                                    switch (action.failureType) {
                                        case Ext.form.action.Action.CLIENT_INVALID:
                                            Ext.Msg.alert(
                                                '오류',
                                                '입력값을 확인하세요.'
                                            );
                                            break;
                                        case Ext.form.action.Action.CONNECT_FAILURE:
                                            Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                           Ext.Msg.alert('실패', action.result.errorMessage);
                                   }
                                }
                            });
                     }
                  }
              ],
              items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'applyProjectForm',
                        layout: { type: 'table' , columns: 1 },
                        defaults: { autoScroll: false, anchor: '100%', labelWidth: 100, margin : '0 3 1 1'},
                        border : 1,
                        // style: 'border-bottom: 1;  ',
                        items: [
                             {  
                                labelWidth : 120,
                                fieldLabel : '프로젝트 공유코드',
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'PROJECT_SHARE_ID',
                                value : '',
                                msgTarget: 'side',
                                allowBlank: false,
                                // anchor: '100%',
                                width : '100%',
                                style : {padding : "0 3 0 0"},
                                flex : 1,
                                listeners: {
                                    afterrender: function(field) {
                                        // field.focus();
                                    }
                                },
                            },
                            {
                                xtype : 'component',
                                html : "[설명]<br/>프로젝트 공유코드(ex.ABCD-EFGH-HIJK-LMMN형식)를 등록하면 프로젝트 담당자에게 공유신청 됩니다.<br/>담당자 승인 후 해당 프로젝트 조회가능합니다." + (!drawDataLoad.isLogined() ? "" : "<br/>* 로그인 후 신청가능합니다.") ,
                            },
                        ]
                  }
             ]
        }).show();;
    }
    
    
    /**
     * 프로젝트 등록
     */
    static addProjectWindow(project_id, _animateTarget){
        
        var response = Ext.Ajax.request({
            async: false,
            url: '/project/data/count.do',
            params: {
                    'SESSION_YN' : 'Y'
            }
        });
        var projectCountData = Ext.decode(response.responseText).detail;
        
        if( projectCountData.SESSION_USR_UID == 'GUEST') {
            Ext.Msg.alert(
                '오류',
                'Guest계정은 프로젝트를 추가 할 수 없습니다.<br/>로그인 후 사용해주세요.'
            ); 
        }else if( projectCountData.PROJECT_CNT >= 2 ) {
            Ext.Msg.alert(
                '오류',
                '무료 프로젝트는 2개까지 가능합니다.<br/>프로젝트를 추가 등록하시려면, 구매 후 이용하시기 바랍니다.'
            );
        }else {
            var viewSize = Ext.getBody().getViewSize();
            
            var window = Ext.create('Ext.window.Window', {
                  title : '프로젝트 등록',
                  width : 700,
                  height : 60+(23*11)+75,
                  autoShow :false,
                  resizable : false,
                  modal : true,
                  animateTarget : _animateTarget,
                  layout: 'fit',
                  listeners : {
                      afterrender : function( _this, eOpts) {
    
                         Ext.create('Ext.data.Store', {
                             storeId: 'projectAddDetailStore',
                             fields: [
                                { name: 'PROJECT_ID', type: 'string' },
                                { name: 'PROJECT_NM', type: 'string' },
                                { name: 'DBASE', type: 'string' },
                                { name: 'START_DT', type: 'string' },
                                { name: 'END_DT', type: 'string' },
                             ],
                             proxy: {
                                 type: 'ajax',
                                 url: '/project/data/detail.do',
                                 reader: {
                                     type: 'json',
                                     rootProperty: 'detail'
                                 },
                                 extraParams: {
                                    PROJECT_ID : project_id
                                }
                             },
                             autoLoad: true,
                             listeners : {
                                 load : function(_this, _records, _successful, _eOpts ) {
                                      Ext.getCmp('addProjectForm').loadRecord(_records[0]);
                                 }
                                 
                             }
                         });
                      }
                  },
                  buttons : [
                      { text: '저장', disabled : !drawDataLoad.hasUserAuthOfModeler(), handler : function() {
                            Ext.getCmp('addProjectForm').submit({
                                clientValidation: true,
                                url: '/project/data/insert.do',
                                success: function(form, action) {
                                   /*
                                    var node = Ext.getStore("domainTreeStore").findNode( "DOMAIN_ID", domain_id);
                                    node.appendChild({"DOMAIN_ID" : "DOMAIN_ID", "DOMAIN_NM" : "DOMAIN_NM", "leaf":false, "text" : "text"});
                                   */
                                   
                                   Ext.Msg.alert('성공', action.result.message, function() {
                                       if( project_id == '') {
                                           Ext.getStore('domainTreeStore').reload();
                                           Ext.getStore("entityListStore").reload();
                                           Ext.getStore("subjectEntityListStore").reload();
                                           
                                           Ext.getStore("columnListStore").removeAll();
                                           Ext.getStore("tableLayoutStore").reload();
                                           
                                           window.close();
                                       } else {
                                           Ext.getStore("projectListStore").reload();
                                           
                                           window.close();
                                       }
    
                                   });
                                   
                                },
                                failure: function(form, action) {
                                    // console.log('failure', form, action );
                                    switch (action.failureType) {
                                        case Ext.form.action.Action.CLIENT_INVALID:
                                            Ext.Msg.alert(
                                                '오류',
                                                '입력값을 확인하세요.'
                                            );
                                            break;
                                        case Ext.form.action.Action.CONNECT_FAILURE:
                                            Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                           Ext.Msg.alert('실패', action.result.errorMessage);
                                   }
                                }
                            });
                          } 
                      }
                      
                  ],
                  items : [
                      {
                            xtype : 'formPanel_ux',
                            id : 'addProjectForm',
                            layout: { type: 'table' , columns: 2 },
                            defaults: { autoScroll: false, anchor: '100%', labelWidth: 100, margin : '0 3 1 1'},
                            border : 1,
                            // style: 'border-bottom: 1;  ',
                            items: [
                                 {   
                                    fieldLabel : '프로젝트 명',
                                    xtype: 'textfield_ux',
                                    labelCls   : 'x-form-item-label x-form-item-label-required',
                                    name: 'PROJECT_NM',
                                    value : '',
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    // anchor: '100%',
                                    // colspan : 2,
                                    // width : '690',
                                    width : '340',
                                    style : {padding : "0 3 0 0"},
                                    flex : 1,
                                    listeners: {
                                        afterrender: function(field) {
                                            field.focus();
                                        }
                                    },
                                }, 
                                 {   
                                    fieldLabel : '구매상품',
                                    xtype: 'combo_ux', // combotipple_ux
                                    labelCls   : 'x-form-item-label x-form-item-label-required',
                                    name: 'BUY_SEQ',
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    width : '340',
                                    
                                    style : {padding : "0 3 0 0"},
                                    valueField : 'BUY_CD',
                                    displayField: 'BUY_NM',
                                    store : Ext.create('Ext.data.Store', {
                                        storeId: 'buyListStore',
                                        autoLoad: true,
                                        fields: [
                                            { name: 'BUY_CD', type: 'string' },
                                            { name: 'BUY_NM', type: 'string' },
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url : '/project/data/buyList.do',
                                            extraParams : {
                                                
                                            }, // , 
                                            reader: {
                                                type: 'json',
                                                rootProperty : 'dataList',
                                                totalProperty: 'totalCount'
                                            },
                                        }
                                    }),
                                },
                                 {   
                                    fieldLabel : 'DataBase종류',
                                    xtype: 'combo_ux', // combotipple_ux
                                    labelCls   : 'x-form-item-label x-form-item-label-required',
                                    name: 'DBASE',
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    width : '340',
                                    
                                    style : {padding : "0 3 0 0"},
                                    valueField : 'DBASE',
                                    displayField: 'DBASE',
                                    store : Ext.create('Ext.data.Store', {
                                        storeId: 'datatypeListStore',
                                        autoLoad: true,
                                        fields: [
                                            { name: 'DBASE', type: 'string' },
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url : '/dbase/data/list.do',
                                            extraParams : {
                                                
                                            }, // , 
                                            reader: {
                                                type: 'json',
                                                rootProperty : 'dataList',
                                                totalProperty: 'totalCount'
                                            },
                                        }
                                    }),
                                },
                                 {   
                                    fieldLabel : '프로젝트 공유코드',
                                    xtype: 'displayfield_ux',
                                    name: 'PROJECT_SHARE_ID',
                                    value : ErdAppFunction.makeid(16),
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    // anchor: '100%',
                                    width : '340',
                                    style : {padding : "0 3 0 0"},
                                    flex : 1,
                                    listeners: {
                                        afterrender: function(field) {
                                            // field.focus();
                                        }
                                    },
                                }, 
                                {   
                                    fieldLabel : '프로젝트 시작일',
                                    xtype: 'datefield_ux',
                                    labelCls   : 'x-form-item-label x-form-item-label-required',
                                    name: 'START_DT',
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    // anchor: '100%',
                                    width : '340',
                                    // style : {padding : "0 3 0 0"},
                                },
                                {   
                                    fieldLabel : '프로젝트 종료일',
                                    xtype: 'datefield_ux',
                                    name: 'END_DT',
                                    msgTarget: 'side',
                                    allowBlank: true,
                                    anchor: '100%',
                                    //width : '96%',
                                    width : '345',
                                    style : {padding : "0 3 0 0"},
                                },
                                 {
                                    xtype : 'fieldset',
                                    title: '객체 관리',
                                    instructions: '객체 관리',
                                    margin : '0 3 3 0',
                                    padding : '0 2 0 3',
                                    colspan : 2,
                                    layout: { type: 'table' , columns: 2 },
                                    items: [
                                        {   
                                            fieldLabel : '테이블 단어사전',
                                            xtype: 'combo_ux',
                                            name: 'ENTITY_WORD_YN',
                                            msgTarget: 'side',
                                            allowBlank: true,
                                            // anchor: '100%',
                                            width : '99%',
                                            style : {padding : "0 0 0 0"},
                                            flex: 1,
                                            value : 'Y',
                                            valueField : 'VALUE',
                                            displayField: 'NAME',
                                            store : Ext.create('Ext.data.Store', {
                                                fields: ['VALUE', 'NAME'],
                                                data : [
                                                    {"VALUE":"Y", "NAME":"적용"},
                                                    {"VALUE":"N", "NAME":"미적용"},
                                                ]
                                            }),
                                        },
                                        {   
                                            fieldLabel : '테이블 대소문자',
                                            xtype: 'combo_ux',
                                            name: 'ENTITY_CAPITALIZE',
                                            id : "addProjectForm_entityCapitalize",
                                            msgTarget: 'side',
                                            allowBlank: true,
                                            // anchor: '100%',
                                            width : '99%',
                                            style : {padding : "0 0 0 0"},
                                            flex: 1,
                                            value : 'UPPER',
                                            valueField : 'VALUE',
                                            displayField: 'NAME',
                                            store : Ext.create('Ext.data.Store', {
                                                fields: ['VALUE', 'NAME'],
                                                data : [
                                                    {"VALUE":"UPPER", "NAME":"대문자"},
                                                    {"VALUE":"LOWER", "NAME":"소문자"},
                                                    {"VALUE":"NONE", "NAME":"입력한대로"},
                                                ]
                                            }),
                                        },
            
                                        {   
                                            fieldLabel : '컬럼 단어사전',
                                            xtype: 'combo_ux',
                                            name: 'COLMN_WORD_YN',
                                            msgTarget: 'side',
                                            allowBlank: true,
                                            // anchor: '100%',
                                            width : '99%',
                                            style : {padding : "0 0 0 0"},
                                            value : 'Y',
                                            valueField : 'VALUE',
                                            displayField: 'NAME',
                                            store : Ext.create('Ext.data.Store', {
                                                fields: ['VALUE', 'NAME'],
                                                data : [
                                                    {"VALUE":"Y", "NAME":"적용"},
                                                    {"VALUE":"N", "NAME":"미적용"},
                                                ]
                                            }),
                                        },
                                        {   
                                            fieldLabel : '컬럼 대소문자',
                                            xtype: 'combo_ux',
                                            name: 'COLMN_CAPITALIZE',
                                            id : "addProjectForm_colmnCapitalize",
                                            msgTarget: 'side',
                                            allowBlank: true,
                                            // anchor: '100%',
                                            width : '99%',
                                            style : {padding : "0 0 0 0"},
                                            flex: 1,
                                            value : 'UPPER',
                                            valueField : 'VALUE',
                                            displayField: 'NAME',
                                            store : Ext.create('Ext.data.Store', {
                                                fields: ['VALUE', 'NAME'],
                                                data : [
                                                    {"VALUE":"UPPER", "NAME":"대문자"},
                                                    {"VALUE":"LOWER", "NAME":"소문자"},
                                                    {"VALUE":"NONE", "NAME":"입력한대로"},
                                                ]
                                            }),
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            labelSeparator : '',
                                            layout: 'hbox',
                                            colspan : 2,
                                            width : '99%',
                                            items: [
                                                    {   
                                                        xtype: 'numberfield_ux',
                                                        fieldLabel : '테이브 변경 조회',
                                                        name: 'ENTITY_DISPLAY_DAYCNT',
                                                        msgTarget: 'side',
                                                        allowBlank: false,
                                                        // anchor: '100%',
                                                        width : 180, 
                                                        minValue : 0,
                                                        maxValue : 30,
                                                        value : 7,
                                                        step : 1,
                                                        decimalPrecision : 0,
                                                        style : {padding : "0 3 0 0"},
                                                        disabled : false,
                                                        listeners : {
                                                        }
                                                    },
                                                    {
                                                        xtype: 'displayfield_ux',
                                                        value : '일 이내 변경 건 포함',
                                                        width : 200,
                                                    },
                                                    {   
                                                        xtype: 'numberfield_ux',
                                                        fieldLabel : '컬럼 변경 조회',
                                                        name: 'COLMN_DISPLAY_DAYCNT',
                                                        msgTarget: 'side',
                                                        allowBlank: false,
                                                        // anchor: '100%',
                                                        width : 180, 
                                                        minValue : 0,
                                                        maxValue : 30,
                                                        value : 7,
                                                        step : 1,
                                                        decimalPrecision : 0,
                                                        style : {padding : "0 3 0 0"},
                                                        disabled : false,
                                                        listeners : {
                                                        }
                                                    },
                                                    {
                                                        xtype: 'displayfield_ux',
                                                        value : '일 이내 변경 건 포함',
                                                        width : 200,
                                                    },
                                            ]
                                        },
    
                                        {
                                            xtype: 'fieldcontainer',
                                            fieldLabel: 'PK명 규칙',
                                            labelSeparator : '',
                                            layout: 'hbox',
                                            colspan : 2,
                                            width : '99%',
                                            items: [
                                                    {
                                                        fieldLabel : '',
                                                        xtype: 'combo_ux',
                                                        name: 'PK_POSITION',
                                                        msgTarget: 'side',
                                                        allowBlank: true,
                                                        // anchor: '100%',
                                                        width : 100,
                                                        style : {padding : "0 3 0 0"},
                                                        flex: 1,
                                                        value : 'SUFFIX',
                                                        valueField : 'VALUE',
                                                        displayField: 'NAME',
                                                        store : Ext.create('Ext.data.Store', {
                                                            fields: ['VALUE', 'NAME'],
                                                            data : [
                                                                {"VALUE":"PREFIX", "NAME":"PREFIX"},
                                                                {"VALUE":"SUFFIX", "NAME":"SUFFIX"},
                                                            ]
                                                        }),
                                                        listeners : {
                                                            change : function( _this, newValue, oldValue, eOpts )  {
                                                                if( newValue == 'PREFIX') {
                                                                    Ext.getCmp("addProjectForm_pkPrefixNmFmt").setDisabled(false);
                                                                    Ext.getCmp("addProjectForm_pkSuffixNmFmt").setDisabled(true);
                                                                    Ext.getCmp("addProjectForm_pkSuffixNmFmt").setValue("");
                                                                } else {
                                                                    Ext.getCmp("addProjectForm_pkPrefixNmFmt").setDisabled(true);
                                                                    Ext.getCmp("addProjectForm_pkSuffixNmFmt").setDisabled(false);
                                                                    Ext.getCmp("addProjectForm_pkPrefixNmFmt").setValue("");
                                                                } 
                                                            }
                                                        }
                                                    },
                                                    {   
                                                        xtype: 'textfield_ux',
                                                        name: 'PK_PREFIX_NM_FMT',
                                                        id : 'addProjectForm_pkPrefixNmFmt',
                                                        msgTarget: 'side',
                                                        // allowBlank: false,
                                                        // anchor: '100%',
                                                        width : 150, 
                                                        style : {padding : "0 3 0 0"},
                                                        value : '',
                                                        disabled : false,
                                                        listeners : {
                                                            change : function(_this, newValue, oldValue, eOpts ) {
                                                                console.log( newValue );
                                                                 if(Ext.getCmp("addProjectForm_entityCapitalize").getValue() == "UPPER") {
                                                                     _this.setValue(newValue.toUpperCase());
                                                                 } else if(Ext.getCmp("addProjectForm_entityCapitalize").getValue() == "LOWER") {
                                                                     _this.setValue(newValue.toLowerCase());
                                                                 } 
                                                            }
                                                        }
                                                    },
                                                    {
                                                        xtype: 'displayfield_ux',
                                                        value : 'TABLE_NAME',
                                                        width : 75,
                                                    },
                                                    {   
                                                        xtype: 'textfield_ux',
                                                        name: 'PK_SUFFIX_NM_FMT',
                                                        id : 'addProjectForm_pkSuffixNmFmt',
                                                        msgTarget: 'side',
                                                        allowBlank: false,
                                                        // anchor: '100%',
                                                        width : 150, 
                                                        style : {padding : "0 3 0 0"},
                                                        value : '',
                                                        disabled : true,
                                                        listeners : {
                                                            change : function(_this, newValue, oldValue, eOpts ) {
                                                                console.log( newValue );
                                                                 if(Ext.getCmp("addProjectForm_entityCapitalize").getValue() == "UPPER") {
                                                                     _this.setValue(newValue.toUpperCase());
                                                                 } else if(Ext.getCmp("addProjectForm_entityCapitalize").getValue() == "LOWER") {
                                                                     _this.setValue(newValue.toLowerCase());
                                                                 } 
                                                            }
                                                        }
                                                    },
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            fieldLabel: 'INDEX명 규칙',
                                            labelSeparator : '',
                                            layout: 'hbox',
                                            colspan : 2,
                                            width : '99%',
                                            items: [
                                                    {
                                                        fieldLabel : '',
                                                        xtype: 'combo_ux',
                                                        name: 'INDEX_POSITION',
                                                        msgTarget: 'side',
                                                        allowBlank: true,
                                                        // anchor: '100%',
                                                        width : 100,
                                                        style : {padding : "0 3 0 0"},
                                                        flex: 1,
                                                        value : 'PREFIX',
                                                        valueField : 'VALUE',
                                                        displayField: 'NAME',
                                                        store : Ext.create('Ext.data.Store', {
                                                            fields: ['VALUE', 'NAME'],
                                                            data : [
                                                                {"VALUE":"PREFIX", "NAME":"PREFIX"},
                                                                {"VALUE":"SUFFIX", "NAME":"SUFFIX"},
                                                            ]
                                                        }),
                                                        listeners : {
                                                            change : function( _this, newValue, oldValue, eOpts )  {
                                                                if( newValue == 'PREFIX') {
                                                                    Ext.getCmp("addProjectForm_indexPrefixNmFmt").setDisabled(false);
                                                                    Ext.getCmp("addProjectForm_indexSuffixNmFmt").setDisabled(true);
                                                                    Ext.getCmp("addProjectForm_indexSuffixNmFmt").setValue("");
                                                                } else {
                                                                    Ext.getCmp("addProjectForm_indexPrefixNmFmt").setDisabled(true);
                                                                    Ext.getCmp("addProjectForm_indexSuffixNmFmt").setDisabled(false);
                                                                    Ext.getCmp("addProjectForm_indexPrefixNmFmt").setValue("");
                                                                } 
                                                            }
                                                        }
                                                    },
                                                    {   
                                                        xtype: 'textfield_ux',
                                                        name: 'INDEX_PREFIX_NM_FMT',
                                                        id : 'addProjectForm_indexPrefixNmFmt',
                                                        msgTarget: 'side',
                                                        // allowBlank: false,
                                                        // anchor: '100%',
                                                        width : 150, 
                                                        style : {padding : "0 3 0 0"},
                                                        value : '',
                                                        disabled : false,
                                                        listeners : {
                                                            change : function(_this, newValue, oldValue, eOpts ) {
                                                                console.log( newValue );
                                                                 if(Ext.getCmp("addProjectForm_entityCapitalize").getValue() == "UPPER") {
                                                                     _this.setValue(newValue.toUpperCase());
                                                                 } else if(Ext.getCmp("addProjectForm_entityCapitalize").getValue() == "LOWER") {
                                                                     _this.setValue(newValue.toLowerCase());
                                                                 } 
                                                            }
                                                        }
                                                    },
                                                    {
                                                        xtype: 'displayfield_ux',
                                                        value : 'TABLE_NAME',
                                                        width : 75,
                                                    },
                                                    {   
                                                        xtype: 'textfield_ux',
                                                        name: 'INDEX_SUFFIX_NM_FMT',
                                                        id : 'addProjectForm_indexSuffixNmFmt',
                                                        msgTarget: 'side',
                                                        allowBlank: false,
                                                        // anchor: '100%',
                                                        width : 150, 
                                                        style : {padding : "0 3 0 0"},
                                                        value : '',
                                                        disabled : true,
                                                        listeners : {
                                                            change : function(_this, newValue, oldValue, eOpts ) {
                                                                console.log( newValue );
                                                                 if(Ext.getCmp("addProjectForm_entityCapitalize").getValue() == "UPPER") {
                                                                     _this.setValue(newValue.toUpperCase());
                                                                 } else if(Ext.getCmp("addProjectForm_entityCapitalize").getValue() == "LOWER") {
                                                                     _this.setValue(newValue.toLowerCase());
                                                                 } 
                                                            }
                                                        }
                                                    },
                                            ]
                                        },
                                         {   
                                            fieldLabel : '테이블 스페이스명',
                                            xtype: 'textfield_ux',
                                            name: 'TABLE_SPACE_NM',
                                            value : '',
                                            msgTarget: 'side',
                                            // anchor: '100%',
                                            width : '99%',
                                            // style : {padding : "0 3 0 0"},
                                            flex : 1,
                                            listeners: {
                                                afterrender: function(field) {
                                                    
                                                }
                                            },
                                        }, 
                                         {   
                                            fieldLabel : '인덱스 스페이스명',
                                            xtype: 'textfield_ux',
                                            name: 'INDEX_SPACE_NM',
                                            value : '',
                                            msgTarget: 'side',
                                            // anchor: '100%',
                                            width : '99%',
                                            // style : {padding : "0 3 0 0"},
                                            flex : 1,
                                            listeners: {
                                                afterrender: function(field) {
                                                    
                                                }
                                            },
                                        }, 
                                        {
                                             xtype: 'checkboxgroup_ux',
                                             fieldLabel : '객체 상태 관리',
                                             // vertical: true,
                                             colspan : 2,
                                             columns: 5,
                                             // id : 'addProject_TABL_SCD',
                                             name : 'TABL_SCD[]',
                                             style : {padding : "0 3 0 0"},
                                             width : '100%',
                                             // height: 48, // 74,
                                             // serialize: true,
                                             listeners : {
                                                 afterrender : function(_thisCheckboxGroup, _event) {
                                                       var store = Ext.create('Ext.data.Store', {
                                                            storeId: 'codeListStore_TABL_SCD',
                                                            autoLoad: true,
                                                            fields: [
                                                                { name: 'CD', type: 'string' },
                                                                { name: 'CD_NM', type: 'string' },
                                                                { name: 'CHECKED', type: 'string' },
                                                            ],
                                                            proxy: {
                                                                type: 'ajax',
                                                                url : '/codeProject/data/list.do',
                                                                extraParams : {
                                                                    CD_GRP : "TABL_SCD",
                                                                    PROJECT_ID : project_id
                                                                }, // , 
                                                                reader: {
                                                                    type: 'json',
                                                                    rootProperty : 'data',
                                                                    totalProperty: 'totalCount'
                                                                },
                                                            },
                                                            listeners : {
                                                                load : function(_thisStore, records, successful, operation, eOpts) {
                                                                    for(var i=0; i<records.length; i++) {
                                                                        var item = { xtype : 'checkbox', boxLabel: records[i].get("CD_NM"), /* name: "TABL_SCD_ES", */ inputValue : records[i].get("CD"), checked: (records[i].get("IS_CHECKED")== "Y" ? true : false) };
                                                                        
                                                                        _thisCheckboxGroup.add(item);
                                                                    }
                                                                }
                                                                
                                                            }
                                                            
                                                        });
                                                 },
                                                 
                                             },
                                             items: [
                                                 /*
                                                 { xtype: 'checkbox', boxLabel: 'Item 1', name: 'cb-item-1', inputValue: '1', checked: true  },
                                                */
                                             ]
                                         },
                                     ]
                                 },
                                 {
                                    xtype : 'fieldset',
                                    title: '기본 업무영역 정보',
                                    instructions: 'Tell us all about yourself',
                                    margin : '0 3 3 0',
                                    padding : '0 2 0 3',
                                    colspan : 2,
                                    layout: { type: 'table' , columns: 2 },
                                    //collapsible: true,
                                    //collapsed: true,
                                    listeners : {
                                        expand : function(fieldset, eOpts ) {
                                            Ext.getCmp('addUserWindow').setHeight(60+(23*8));
                                        },
                                        collapse : function ( fieldset, eOpts ) {
                                            Ext.getCmp('addUserWindow').setHeight(60+(23*4));
                                            
                                            var comps = fieldset.query();
                                            for(var i=0; i<comps.length; i++){
                                                if( comps[i].xtype.indexOf("textfield")>=0 
                                                    || comps[i].xtype.indexOf("datefield")>=0
                                                    || comps[i].xtype.indexOf("combo")>=0) {
                                                     comps[i].setValue('');
                                                 }
                                            }
                                            
                                        }
                                    },
                                    items: [
                                             {   
                                                fieldLabel : '기본 업무영역 명',
                                                xtype: 'textfield_ux',
                                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'SUBJECT_NM',
                                                value : '',
                                                msgTarget: 'side',
                                                allowBlank: false,
                                                width: '99%',
                                                colspan : 2,
                                            }, 
                                            {   
                                                fieldLabel : '그리기 영역 넓이',
                                                xtype: 'numberfield_ux',
                                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'WIDTH',
                                                msgTarget: 'side',
                                                allowBlank: false,
                                                // anchor: '99%',
                                                width: '99%',
                                                decimalPrecision : 0,
                                                value : 2000, // parseInt(viewSize.width/100)*100,
                                                step : 100,
                                                minValue : 2000, // parseInt(viewSize.width/100)*100,
                                                maxValue : 30000, // parseInt(viewSize.width/100)*100+10000,
                                                placeholder : '영역 넓이'
                                            },
                                            {   
                                                fieldLabel : '그리기 영역 높이',
                                                xtype: 'numberfield_ux',
                                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                                name: 'HEIGHT',
                                                msgTarget: 'side',
                                                allowBlank: false,
                                                // anchor: '99%',
                                                width: '99%',
                                                decimalPrecision : 0,
                                                value : 2000, // parseInt(viewSize.height/100)*100,
                                                step : 100,
                                                minValue : 2000, // parseInt(viewSize.height/100)*100,
                                                maxValue : 30000, // parseInt(viewSize.height/100)*100+10000,
                                                placeholder : '영역 높이',
                                                padding : '0 0 3 0',
                                            },
                                    ]
                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'PROJECT_ID',
                                    value: project_id ? project_id : '',
                                },
                            ]
                    }
                  ]
            }).show();
        }
    }

    /**
     * 프로젝트 수정
     */
    static editProjectWindow(project_id, _animateTarget){
        
        var viewSize = Ext.getBody().getViewSize();
        
        var window = Ext.create('Ext.window.Window', {
              title : '프로젝트 수정',
              width : 700,
              height : 60+(23*11)+75,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : _animateTarget,
              layout: 'fit',
              
              listeners : {
                  afterrender : function( _this, eOpts) {

                     Ext.create('Ext.data.Store', {
                         storeId: 'projectEditDetailStore',
                         fields: [
                            { name: 'PROJECT_ID', type: 'string' },
                            { name: 'PROJECT_NM', type: 'string' },
                            { name: 'PROJECT_SHARE_ID', type: 'string' },
                            { name: 'DBASE', type: 'string' },
                            { name: 'START_DT', type: 'string' },
                            { name: 'END_DT', type: 'string' },
                         ],
                         proxy: {
                             type: 'ajax',
                             url: '/project/data/detail.do',
                             reader: {
                                 type: 'json',
                                 rootProperty: 'detail'
                             },
                             extraParams: {
                                PROJECT_ID : project_id
                            }
                         },
                         autoLoad: true,
                         listeners : {
                             load : function(_this, _records, _successful, _eOpts ) {
                                  Ext.getCmp('editProjectForm').loadRecord(_records[0]);
                                  Ext.getCmp('editProjectForm_DBASE_ORI').setValue( _records[0].data.DBASE )
                             }
                             
                         }
                     });
                  }
              },
              buttons : [
                  { text: '저장', handler : function() {
                       var msg = "";
                       if( Ext.getCmp('editProjectForm_DBASE_ORI').getValue() != Ext.getCmp('editProjectForm_DBASE').getValue()) {
                           msg = "DataBase종류가 변경된 경우에는 도메인이 모두 초기화 됩니다.그래도 수정하시겠습니까?"
                       }
                      
                        Ext.getCmp('editProjectForm').submit({
                            msgConfirm : msg,
                            clientValidation: true,
                            url: '/project/data/update.do',
                            success: function(form, action) {
                               /*
                                var node = Ext.getStore("domainTreeStore").findNode( "DOMAIN_ID", domain_id);
                                node.appendChild({"DOMAIN_ID" : "DOMAIN_ID", "DOMAIN_NM" : "DOMAIN_NM", "leaf":false, "text" : "text"});
                               */
                               Ext.get("erd-title").setHtml(Ext.getCmp("editProjectForm_PROJECT_NM").getValue());
                               Ext.Msg.alert('성공', action.result.message, function() {
                                   if( project_id == '') {
                                       Ext.getStore('domainTreeStore').reload();
                                       Ext.getStore("entityListStore").reload();
                                       Ext.getStore("subjectEntityListStore").reload();
                                       
                                       Ext.getStore("columnListStore").removeAll();
                                       Ext.getStore("tableLayoutStore").reload();
                                       
                                       window.close();
                                   } else {
                                       // Ext.getStore("projectListStore").reload();
                                       
                                       window.close();
                                   }

                               });
                               
                            },
                            failure: function(form, action) {
                                // console.log('failure', form, action );
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert(
                                            '오류',
                                            '입력값을 확인하세요.'
                                        );
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                       Ext.Msg.alert('실패', action.result.errorMessage);
                               }
                            }
                        });
                      } 
                  }
                  
              ],
              items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'editProjectForm',
                        layout: { type: 'table' , columns: 2 },
                        defaults: { autoScroll: false, anchor: '100%', labelWidth: 100, margin : '0 3 1 1'},
                        border : 1,
                        items: [
                             {   
                                fieldLabel : '프로젝트 명',
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'PROJECT_NM',
                                value : '',
                                id : 'editProjectForm_PROJECT_NM',
                                msgTarget: 'side',
                                allowBlank: false,
                                // anchor: '100%',
                                // colspan : 2,
                                // width : '690',
                                width : '340',
                                style : {padding : "0 3 0 0"},
                                flex : 1,
                                listeners: {
                                    afterrender: function(field) {
                                        field.focus();
                                    }
                                },
                            }, 
                             {   
                                    fieldLabel : '구매상품',
                                    xtype: 'combo_ux', // combotipple_ux
                                    labelCls   : 'x-form-item-label x-form-item-label-required',
                                    name: 'BUY_SEQ',
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    width : '340',
                                    
                                    style : {padding : "0 3 0 0"},
                                    valueField : 'BUY_CD',
                                    displayField: 'BUY_NM',
                                    store : Ext.create('Ext.data.Store', {
                                        storeId: 'buyListStore',
                                        autoLoad: true,
                                        fields: [
                                            { name: 'BUY_CD', type: 'string' },
                                            { name: 'BUY_NM', type: 'string' },
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url : '/project/data/buyList.do',
                                            extraParams : {
                                                
                                            }, // , 
                                            reader: {
                                                type: 'json',
                                                rootProperty : 'dataList',
                                                totalProperty: 'totalCount'
                                            },
                                        }
                                    }),
                                },
                            
                              {   
                                fieldLabel : 'DataBase종류',
                                xtype: 'combo_ux', // combotipple_ux
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'DBASE',
                                msgTarget: 'side',
                                allowBlank: false,
                                width : '340',
                                id: 'editProjectForm_DBASE',
                                
                                style : {padding : "0 3 0 0"},
                                valueField : 'DBASE',
                                displayField: 'DBASE',
                                store : Ext.create('Ext.data.Store', {
                                    storeId: 'datatypeListStore',
                                    autoLoad: true,
                                    fields: [
                                        { name: 'DBASE', type: 'string' },
                                    ],
                                    proxy: {
                                        type: 'ajax',
                                        url : '/dbase/data/list.do',
                                        extraParams : {
                                            
                                        }, // , 
                                        reader: {
                                            type: 'json',
                                            rootProperty : 'dataList',
                                            totalProperty: 'totalCount'
                                        },
                                    }
                                }),
                            },
                             {   
                                fieldLabel : '프로젝트 공유코드',
                                xtype: 'displayfield_ux',
                                name: 'PROJECT_SHARE_ID',
                                msgTarget: 'side',
                                allowBlank: false,
                                // anchor: '100%',
                                width : '340',
                                style : {padding : "0 3 0 0"},
                                flex : 1,
                                listeners: {
                                    afterrender: function(field) {
                                        // field.focus();
                                    }
                                },
                            }, 
                            {   
                                fieldLabel : '프로젝트 시작일',
                                xtype: 'datefield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'START_DT',
                                msgTarget: 'side',
                                allowBlank: false,
                                // anchor: '100%',
                                width : '340',
                            },
                            {   
                                fieldLabel : '프로젝트 종료일',
                                xtype: 'datefield_ux',
                                name: 'END_DT',
                                msgTarget: 'side',
                                allowBlank: true,
                                anchor: '100%',
                                //width : '96%',
                                width : '345',
                                style : {padding : "0 3 0 0"},
                            },
                             {
                                xtype : 'fieldset',
                                title: '객체 관리',
                                instructions: '객체 관리',
                                margin : '0 3 3 0',
                                padding : '0 2 0 3',
                                colspan : 2,
                                layout: { type: 'table' , columns: 2 },
                                items: [
                                    {   
                                        fieldLabel : '테이블 단어사전',
                                        xtype: 'combo_ux',
                                        name: 'ENTITY_WORD_YN',
                                        msgTarget: 'side',
                                        allowBlank: true,
                                        // anchor: '100%',
                                        width : '99%',
                                        style : {padding : "0 0 0 0"},
                                        flex: 1,
                                        value : 'Y',
                                        valueField : 'VALUE',
                                        displayField: 'NAME',
                                        store : Ext.create('Ext.data.Store', {
                                            fields: ['VALUE', 'NAME'],
                                            data : [
                                                {"VALUE":"Y", "NAME":"적용"},
                                                {"VALUE":"N", "NAME":"미적용"},
                                            ]
                                        }),
                                    },
                                    {   
                                        fieldLabel : '테이블 대소문자',
                                        xtype: 'combo_ux',
                                        name: 'ENTITY_CAPITALIZE',
                                        id : "editProjectForm_entityCapitalize",
                                        msgTarget: 'side',
                                        allowBlank: true,
                                        // anchor: '100%',
                                        width : '99%',
                                        style : {padding : "0 0 0 0"},
                                        flex: 1,
                                        value : 'UPPER',
                                        valueField : 'VALUE',
                                        displayField: 'NAME',
                                        store : Ext.create('Ext.data.Store', {
                                            fields: ['VALUE', 'NAME'],
                                            data : [
                                                {"VALUE":"UPPER", "NAME":"대문자"},
                                                {"VALUE":"LOWER", "NAME":"소문자"},
                                                {"VALUE":"NONE", "NAME":"입력한대로"},
                                            ]
                                        }),
                                    },
        
                                    {   
                                        fieldLabel : '컬럼 단어사전',
                                        xtype: 'combo_ux',
                                        name: 'COLMN_WORD_YN',
                                        msgTarget: 'side',
                                        allowBlank: true,
                                        // anchor: '100%',
                                        width : '99%',
                                        style : {padding : "0 0 0 0"},
                                        value : 'Y',
                                        valueField : 'VALUE',
                                        displayField: 'NAME',
                                        store : Ext.create('Ext.data.Store', {
                                            fields: ['VALUE', 'NAME'],
                                            data : [
                                                {"VALUE":"Y", "NAME":"적용"},
                                                {"VALUE":"N", "NAME":"미적용"},
                                            ]
                                        }),
                                    },
                                    {   
                                        fieldLabel : '컬럼 대소문자',
                                        xtype: 'combo_ux',
                                        name: 'COLMN_CAPITALIZE',
                                        id : "editProjectForm_colmnCapitalize",
                                        msgTarget: 'side',
                                        allowBlank: true,
                                        // anchor: '100%',
                                        width : '99%',
                                        style : {padding : "0 0 0 0"},
                                        flex: 1,
                                        value : 'UPPER',
                                        valueField : 'VALUE',
                                        displayField: 'NAME',
                                        store : Ext.create('Ext.data.Store', {
                                            fields: ['VALUE', 'NAME'],
                                            data : [
                                                {"VALUE":"UPPER", "NAME":"대문자"},
                                                {"VALUE":"LOWER", "NAME":"소문자"},
                                                {"VALUE":"NONE", "NAME":"입력한대로"},
                                            ]
                                        }),
                                    },

                                    {
                                        xtype: 'fieldcontainer',
                                        labelSeparator : '',
                                        layout: 'hbox',
                                        colspan : 2,
                                        width : '99%',
                                        items: [
                                                {   
                                                    xtype: 'numberfield_ux',
                                                    fieldLabel : '테이브 변경 조회',
                                                    name: 'ENTITY_DISPLAY_DAYCNT',
                                                    msgTarget: 'side',
                                                    allowBlank: false,
                                                    // anchor: '100%',
                                                    width : 180, 
                                                    minValue : 0,
                                                    maxValue : 30,
                                                    value : 7,
                                                    step : 1,
                                                    decimalPrecision : 0,
                                                    style : {padding : "0 3 0 0"},
                                                    disabled : false,
                                                    listeners : {
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield_ux',
                                                    value : '일 이내 변경 건 포함',
                                                    width : 200,
                                                },
                                                {   
                                                    xtype: 'numberfield_ux',
                                                    fieldLabel : '컬럼 변경 조회',
                                                    name: 'COLMN_DISPLAY_DAYCNT',
                                                    msgTarget: 'side',
                                                    allowBlank: false,
                                                    // anchor: '100%',
                                                    width : 180, 
                                                    minValue : 0,
                                                    maxValue : 30,
                                                    value : 7,
                                                    step : 1,
                                                    decimalPrecision : 0,
                                                    style : {padding : "0 3 0 0"},
                                                    disabled : false,
                                                    listeners : {
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield_ux',
                                                    value : '일 이내 변경 건 포함',
                                                    width : 200,
                                                },
                                        ]
                                    },

                                    {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: 'PK명 규칙',
                                        labelSeparator : '',
                                        layout: 'hbox',
                                        colspan : 2,
                                        width : '99%',
                                        items: [
                                                {
                                                    fieldLabel : '',
                                                    xtype: 'combo_ux',
                                                    name: 'PK_POSITION',
                                                    msgTarget: 'side',
                                                    allowBlank: true,
                                                    // anchor: '100%',
                                                    width : 100,
                                                    style : {padding : "0 3 0 0"},
                                                    flex: 1,
                                                    value : '',
                                                    valueField : 'VALUE',
                                                    displayField: 'NAME',
                                                    store : Ext.create('Ext.data.Store', {
                                                        fields: ['VALUE', 'NAME'],
                                                        data : [
                                                            {"VALUE":"PREFIX", "NAME":"PREFIX"},
                                                            {"VALUE":"SUFFIX", "NAME":"SUFFIX"},
                                                        ]
                                                    }),
                                                    listeners : {
                                                        change : function( _this, newValue, oldValue, eOpts )  {
                                                            if( newValue == 'PREFIX') {
                                                                Ext.getCmp("editProjectForm_pkPrefixNmFmt").setDisabled(false);
                                                                Ext.getCmp("editProjectForm_pkSuffixNmFmt").setDisabled(true);
                                                                Ext.getCmp("editProjectForm_pkSuffixNmFmt").setValue("");
                                                            } else {
                                                                Ext.getCmp("editProjectForm_pkPrefixNmFmt").setDisabled(true);
                                                                Ext.getCmp("editProjectForm_pkSuffixNmFmt").setDisabled(false);
                                                                Ext.getCmp("editProjectForm_pkPrefixNmFmt").setValue("");
                                                            } 
                                                        }
                                                    }
                                                },
                                                {   
                                                    xtype: 'textfield_ux',
                                                    name: 'PK_PREFIX_NM_FMT',
                                                    id : 'editProjectForm_pkPrefixNmFmt',
                                                    msgTarget: 'side',
                                                    // allowBlank: false,
                                                    // anchor: '100%',
                                                    width : 150, 
                                                    style : {padding : "0 3 0 0"},
                                                    value : '',
                                                    disabled : false,
                                                    listeners : {
                                                        change : function(_this, newValue, oldValue, eOpts ) {
                                                            console.log( newValue );
                                                             if(Ext.getCmp("editProjectForm_entityCapitalize").getValue() == "UPPER") {
                                                                 _this.setValue(newValue.toUpperCase());
                                                             } else if(Ext.getCmp("editProjectForm_entityCapitalize").getValue() == "LOWER") {
                                                                 _this.setValue(newValue.toLowerCase());
                                                             } 
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield_ux',
                                                    value : 'TABLE_NAME',
                                                    width : 75,
                                                },
                                                {   
                                                    xtype: 'textfield_ux',
                                                    name: 'PK_SUFFIX_NM_FMT',
                                                    id : 'editProjectForm_pkSuffixNmFmt',
                                                    msgTarget: 'side',
                                                    allowBlank: false,
                                                    // anchor: '100%',
                                                    width : 150, 
                                                    style : {padding : "0 3 0 0"},
                                                    value : '',
                                                    disabled : true,
                                                    listeners : {
                                                        change : function(_this, newValue, oldValue, eOpts ) {
                                                            console.log( newValue );
                                                             if(Ext.getCmp("editProjectForm_entityCapitalize").getValue() == "UPPER") {
                                                                 _this.setValue(newValue.toUpperCase());
                                                             } else if(Ext.getCmp("editProjectForm_entityCapitalize").getValue() == "LOWER") {
                                                                 _this.setValue(newValue.toLowerCase());
                                                             } 
                                                        }
                                                    }
                                                },
                                        ]
                                    },
                                    {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: 'INDEX명 규칙',
                                        labelSeparator : '',
                                        layout: 'hbox',
                                        colspan : 2,
                                        width : '99%',
                                        items: [
                                                {
                                                    fieldLabel : '',
                                                    xtype: 'combo_ux',
                                                    name: 'INDEX_POSITION',
                                                    msgTarget: 'side',
                                                    allowBlank: true,
                                                    // anchor: '100%',
                                                    width : 100,
                                                    style : {padding : "0 3 0 0"},
                                                    flex: 1,
                                                    value : '',
                                                    valueField : 'VALUE',
                                                    displayField: 'NAME',
                                                    store : Ext.create('Ext.data.Store', {
                                                        fields: ['VALUE', 'NAME'],
                                                        data : [
                                                            {"VALUE":"PREFIX", "NAME":"PREFIX"},
                                                            {"VALUE":"SUFFIX", "NAME":"SUFFIX"},
                                                        ]
                                                    }),
                                                    listeners : {
                                                        change : function( _this, newValue, oldValue, eOpts )  {
                                                            if( newValue == 'PREFIX') {
                                                                Ext.getCmp("editProjectForm_indexPrefixNmFmt").setDisabled(false);
                                                                Ext.getCmp("editProjectForm_indexSuffixNmFmt").setDisabled(true);
                                                                Ext.getCmp("editProjectForm_indexSuffixNmFmt").setValue("");
                                                            } else {
                                                                Ext.getCmp("editProjectForm_indexPrefixNmFmt").setDisabled(true);
                                                                Ext.getCmp("editProjectForm_indexSuffixNmFmt").setDisabled(false);
                                                                Ext.getCmp("editProjectForm_indexPrefixNmFmt").setValue("");
                                                            } 
                                                        }
                                                    }
                                                },
                                                {   
                                                    xtype: 'textfield_ux',
                                                    name: 'INDEX_PREFIX_NM_FMT',
                                                    id : 'editProjectForm_indexPrefixNmFmt',
                                                    msgTarget: 'side',
                                                    // allowBlank: false,
                                                    // anchor: '100%',
                                                    width : 150, 
                                                    style : {padding : "0 3 0 0"},
                                                    value : '',
                                                    disabled : false,
                                                    listeners : {
                                                        change : function(_this, newValue, oldValue, eOpts ) {
                                                            console.log( newValue );
                                                             if(Ext.getCmp("editProjectForm_entityCapitalize").getValue() == "UPPER") {
                                                                 _this.setValue(newValue.toUpperCase());
                                                             } else if(Ext.getCmp("editProjectForm_entityCapitalize").getValue() == "LOWER") {
                                                                 _this.setValue(newValue.toLowerCase());
                                                             } 
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield_ux',
                                                    value : 'TABLE_NAME',
                                                    width : 75,
                                                },
                                                {   
                                                    xtype: 'textfield_ux',
                                                    name: 'INDEX_SUFFIX_NM_FMT',
                                                    id : 'editProjectForm_indexSuffixNmFmt',
                                                    msgTarget: 'side',
                                                    allowBlank: false,
                                                    // anchor: '100%',
                                                    width : 150, 
                                                    style : {padding : "0 3 0 0"},
                                                    value : '',
                                                    disabled : true,
                                                    listeners : {
                                                        change : function(_this, newValue, oldValue, eOpts ) {
                                                            console.log( newValue );
                                                             if(Ext.getCmp("editProjectForm_entityCapitalize").getValue() == "UPPER") {
                                                                 _this.setValue(newValue.toUpperCase());
                                                             } else if(Ext.getCmp("editProjectForm_entityCapitalize").getValue() == "LOWER") {
                                                                 _this.setValue(newValue.toLowerCase());
                                                             } 
                                                        }
                                                    }
                                                },
                                        ]
                                    },
                                     {   
                                        fieldLabel : '테이블 스페이스명',
                                        xtype: 'textfield_ux',
                                        name: 'TABLE_SPACE_NM',
                                        value : '',
                                        msgTarget: 'side',
                                        // anchor: '100%',
                                        width : '99%',
                                        // style : {padding : "0 3 0 0"},
                                        flex : 1,
                                        listeners: {
                                            afterrender: function(field) {
                                                
                                            }
                                        },
                                    }, 
                                     {   
                                        fieldLabel : '인덱스 스페이스명',
                                        xtype: 'textfield_ux',
                                        name: 'INDEX_SPACE_NM',
                                        value : '',
                                        msgTarget: 'side',
                                        // anchor: '100%',
                                        width : '99%',
                                        // style : {padding : "0 3 0 0"},
                                        flex : 1,
                                        listeners: {
                                            afterrender: function(field) {
                                                
                                            }
                                        },
                                    }, 
                                    {
                                         xtype: 'checkboxgroup_ux',
                                         fieldLabel : '객체 상태 관리',
                                         // vertical: true,
                                         colspan : 2,
                                         columns: 5,
                                         // id : 'addProject_TABL_SCD',
                                         name : 'TABL_SCD[]',
                                         style : {padding : "0 3 0 0"},
                                         width : '100%',
                                         // height: 48, // 74,
                                         // serialize: true,
                                         listeners : {
                                             afterrender : function(_thisCheckboxGroup, _event) {
                                                   var store = Ext.create('Ext.data.Store', {
                                                        storeId: 'codeListStore_TABL_SCD',
                                                        autoLoad: true,
                                                        fields: [
                                                            { name: 'CD', type: 'string' },
                                                            { name: 'CD_NM', type: 'string' },
                                                            { name: 'CHECKED', type: 'string' },
                                                        ],
                                                        proxy: {
                                                            type: 'ajax',
                                                            url : '/codeProject/data/list.do',
                                                            extraParams : {
                                                                CD_GRP : "TABL_SCD",
                                                                PROJECT_ID : project_id
                                                            }, // , 
                                                            reader: {
                                                                type: 'json',
                                                                rootProperty : 'data',
                                                                totalProperty: 'totalCount'
                                                            },
                                                        },
                                                        listeners : {
                                                            load : function(_thisStore, records, successful, operation, eOpts) {
                                                                for(var i=0; i<records.length; i++) {
                                                                    var item = { xtype : 'checkbox', boxLabel: records[i].get("CD_NM"), /* name: "TABL_SCD_ES", */ inputValue : records[i].get("CD"), checked: (records[i].get("IS_CHECKED")== "Y" ? true : false) };
                                                                    
                                                                    _thisCheckboxGroup.add(item);
                                                                }
                                                            }
                                                            
                                                        }
                                                        
                                                    });
                                             },
                                             
                                         },
                                         items: [
                                             /*
                                             { xtype: 'checkbox', boxLabel: 'Item 1', name: 'cb-item-1', inputValue: '1', checked: true  },
                                            */
                                         ]
                                     },
                                 ]
                             },
                             {
                                xtype : 'fieldset',
                                title: '기본 업무영역 정보',
                                instructions: 'Tell us all about yourself',
                                margin : '0 3 3 0',
                                padding : '0 2 0 3',
                                colspan : 2,
                                layout: { type: 'table' , columns: 2 },
                                //collapsible: true,
                                //collapsed: true,
                                listeners : {
                                    expand : function(fieldset, eOpts ) {
                                        Ext.getCmp('addUserWindow').setHeight(60+(23*8));
                                    },
                                    collapse : function ( fieldset, eOpts ) {
                                        Ext.getCmp('addUserWindow').setHeight(60+(23*4));
                                        
                                        var comps = fieldset.query();
                                        for(var i=0; i<comps.length; i++){
                                            if( comps[i].xtype.indexOf("textfield")>=0 
                                                || comps[i].xtype.indexOf("datefield")>=0
                                                || comps[i].xtype.indexOf("combo")>=0) {
                                                 comps[i].setValue('');
                                             }
                                        }
                                        
                                    }
                                },
                                items: [
                                          {   
                                            fieldLabel : '기본 업무영역',
                                            xtype: 'combo_ux', // combotipple_ux
                                            labelCls   : 'x-form-item-label x-form-item-label-required',
                                            name: 'SUBJECT_ID',
                                            msgTarget: 'side',
                                            allowBlank: false,
                                            colspan : 2,
                                            width : '99%',
                                            
                                            style : {padding : "0 3 0 0"},
                                            valueField : 'SUBJECT_ID',
                                            displayField: 'SUBJECT_NM',
                                            store : Ext.create('Ext.data.Store', {
                                                storeId: 'datatypeListStore',
                                                autoLoad: true,
                                                fields: [
                                                    { name: 'SUBJECT_ID', type: 'string' },
                                                    { name: 'SUBJECT_NM', type: 'string' },
                                                    { name: 'WIDTH', type: 'string' },
                                                    { name: 'HEIGHT', type: 'string' },
                                                ],
                                                proxy: {
                                                    type: 'ajax',
                                                    url : '/project/data/subjectList.do',
                                                    extraParams : {
                                                        PROJECT_ID : project_id ? project_id : ''
                                                    }, // , 
                                                    reader: {
                                                        type: 'json',
                                                        rootProperty : 'dataList',
                                                        totalProperty: 'totalCount'
                                                    },
                                                }
                                            }),
                                            listeners : {
                                                change : function( _this, newValue, oldValue, eOpts ) {
                                                    if( _this.displayTplData &&  _this.displayTplData[0] ) {
                                                        Ext.getCmp("editProjectForm_WIDTH").setValue(_this.displayTplData[0].WIDTH);
                                                        Ext.getCmp("editProjectForm_HEIGHT").setValue(_this.displayTplData[0].HEIGHT);
                                                    }
                                                }
                                            }
                                        },
                                        {   
                                            fieldLabel : '그리기 영역 넓이',
                                            xtype: 'numberfield_ux',
                                            labelCls   : 'x-form-item-label x-form-item-label-required',
                                            name: 'WIDTH',
                                            id : "editProjectForm_WIDTH",
                                            msgTarget: 'side',
                                            allowBlank: false,
                                            // anchor: '99%',
                                            width: '99%',
                                            decimalPrecision : 0,
                                            value : 2000, // parseInt(viewSize.width/100)*100,
                                            step : 100,
                                            minValue : 2000, // parseInt(viewSize.width/100)*100,
                                            maxValue : 30000, // parseInt(viewSize.width/100)*100+10000,
                                            placeholder : '영역 넓이'
                                        },
                                        {   
                                            fieldLabel : '그리기 영역 높이',
                                            xtype: 'numberfield_ux',
                                            labelCls   : 'x-form-item-label x-form-item-label-required',
                                            name: 'HEIGHT',
                                            id : "editProjectForm_HEIGHT",
                                            msgTarget: 'side',
                                            allowBlank: false,
                                            // anchor: '99%',
                                            width: '99%',
                                            decimalPrecision : 0,
                                            value : 2000, // parseInt(viewSize.height/100)*100,
                                            step : 100,
                                            minValue : 2000, // parseInt(viewSize.height/100)*100,
                                            maxValue : 30000, // parseInt(viewSize.height/100)*100+10000,
                                            placeholder : '영역 높이',
                                            padding : '0 0 3 0',
                                        },
                                ]
                            },
                             {
                                xtype: 'hiddenfield',
                                name: 'PROJECT_ID',
                                value: project_id ? project_id : '',
                             },
                            {
                                xtype: 'hiddenfield',
                                name: 'SUBJECT_ID',
                                value: '',
                             },
                            {
                                xtype: 'hiddenfield',
                                name: 'VERSN',
                                value: '',
                             },
                            {
                                xtype: 'hiddenfield',
                                id: 'editProjectForm_DBASE_ORI',
                                name: 'DBASE_ORI',
                                value: '',
                             },
                        ]
                }
              ]
        }).show();
    }
    
    /**
     * 프로젝트 선택 팝업
     */
    static listProjectWindow(){
        var window = Ext.create('Ext.window.Window', {
              title : '프로젝트 열기',
              width : 600,
              height : 600,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : 'topListProject',
              layout: 'fit',
              buttons : [
              ],
              items : [
                  {   
                      xtype : 'gridpanel',
                      columnLines: true,
                      store : {
                          xtype : 'store',
                          storeId : 'projectListStore',
                          idProperty : 'PROJECT_ID',
                          fields: [
                              {name : 'PROJECT_ID', type : 'string'},
                              {name : 'PROJECT_NM', type : 'string'},
                              {name : 'APPR_SCD', type : 'string'},
                              {name : 'APPR_SCD_NM', type : 'string'},
                              {name : 'DBASE', type : 'string'},
                              {name : 'START_DT', type : 'string'},
                              {name : 'END_DT', type : 'string'},
                              {name : 'AUTH_CD', type : 'string'},
                          ],
                          autoLoad: true,
                          proxy : {
                               type : 'ajax',
                               url : '/project/data/list.do',
                               reader : {
                                   type : 'json',
                                   rootProperty : 'data',
                                   totalProperty: 'totalCount' 
                               },
                               extraParams: {
                                   'aa' : 'aa',
                               },
                           },
                      },
                      columns: [
                          { xtype: 'rownumberer'},
                          { header: '<div style="text-align:center;width:100%;">프로젝트</div>', dataIndex: 'PROJECT_NM', flex: 1,
                               renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                   var link = new Array();
                                   link.push('<span class="link" id="projectList_'+ record.data.PROJECT_ID +'">'+ record.data.PROJECT_NM +'</span>');
                                   return link.join(' ');
                               },
                               listeners : {
                                   click : function(_this, cell, rowIndex, cellIndex, e, record, tr) {
                                       e.stopEvent();
                                       
                                       var items = new Array;
                                       items.push(Ext.create('Ext.Action', {
                                                   // iconCls : 'btn-icon-tree-add-first-level',
                                                   text: '프로젝트를 ['+record.data.PROJECT_NM+']으로 변경' + (record.get("APPR_SCD") != "APPR_SCD_APP" ? "(승인 후 가능)" : ""),
                                                   disabled : record.get("APPR_SCD") != "APPR_SCD_APP",
                                                   handler : function() {
                                                       // extjs.admin.main.jsp에 설정됨.
                                                       var project_id = record.data.PROJECT_ID;

                                                       var doc1 = document.projectForm;
                                                       doc1.PROJECT_ID.value = project_id;
                                                       doc1.submit();
                                                   }
                                               }));
                                       if( record.get("AUTH_CD") == "MANAGER" ) {
                                           items.push(Ext.create('Ext.Action', {
                                                       // iconCls : 'btn-icon-tree-add-first-level',
                                                       text: '프로젝트 ['+record.data.PROJECT_NM+'] 정보관리',
                                                       disabled : record.get("AUTH_CD") != "MANAGER",
                                                       handler : function() {
                                                           var project_id = record.data.PROJECT_ID;
                                                           var _animateTarget = 'projectList_'+record.data.PROJECT_ID;
                                                           ErdAppFunction.editProjectWindow(project_id, _animateTarget);
                                                       }
                                                   }));
                                        }
                                       
                                       var contextMenu = Ext.create('Ext.menu.Menu', {
                                           items: items
                                       });
                                       contextMenu.showAt([e.getXY()[0]+10, e.getXY()[1]]);
                                       return false;
                                   }
                                   
                               }
                          },
                          { header: '<div style="text-align:center;width:100%;">DataBase</div>', dataIndex: 'DBASE', align:'center', width : 100, },
                          { header: '<div style="text-align:center;width:100%;">공유상태</div>', dataIndex: 'APPR_SCD_NM', align:'center', width : 60, },
                          { header: '<div style="text-align:center;width:100%;">프로젝트 기간</div>',
                            columns : [
                                  { header: '<div style="text-align:center;width:100%;">시작일</div>', dataIndex: 'START_DT', align:'center', width : 90, },
                                  { header: '<div style="text-align:center;width:100%;">종료일</div>', dataIndex: 'END_DT', align:'center', width : 90, },
                            ]
                          }
                      ],
                  }
              ]
         }).show();
    }

    /**
     * 프로젝트 참여자 관리
     */
    static managerUserListWindow(_animateTarget){
        var window = Ext.create('Ext.window.Window', {
              title : '프로젝트 참여자 관리',
              width : 600,
              height : 700,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : _animateTarget,
              layout: 'border',
              buttons : [
              ],
              items : [
                        {
                            region: 'north',
                            xtype: 'formPanel_ux',
                            id : 'managerUserListSearchForm',
                            title: '검색 조건',
                            height : 54+(23*2),
                            border : false,
                            layout: { type: 'table' , columns: 2 },
                            bbar : [
                                '->', { xtype: 'button', text: '조회', cls : 'btn_segmentedbutton', // disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                                    listeners : {
                                        click : function(_this, e, eOpts) { 
                                            if( this.up('form').getForm().isValid() ) {
                                                var me = this;
                                                var store = Ext.getStore("userListStore").load({page : 1, limit : 999999 , params: me.up('form').getValues(false, false, false, false)}); store.currentPage = 1; store.params = me.up('form').getForm().getFieldValues(false);
                                            }
                                        }
                                    }
                                },
                            ],
                            items : [
                                 {   
                                    fieldLabel : '사용자 명',
                                    xtype: 'textfield_ux',
                                    name: 'USR_NM',
                                    value : '',
                                    msgTarget: 'side',
                                    width : '100%',
                                    style : {padding : "0 2 0 0"},
                                    flex : 1,
                                    listeners: {
                                        afterrender: function(field) {
                                            field.focus();
                                        }
                                    },
                                },
                                 {   
                                    fieldLabel : '사용자 ID',
                                    xtype: 'textfield_ux',
                                    name: 'LOGIN_ID',
                                    value : '',
                                    msgTarget: 'side',
                                    width : '100%',
                                    style : {padding : "0 2 0 0"},
                                    flex : 1,
                                    listeners: {
                                        afterrender: function(field) {
                                        }
                                    },
                                },
                                {   
                                    fieldLabel : '사용권한',
                                    xtype: 'combo_ux',
                                    name: 'AUTH_CD',
                                    msgTarget: 'side',
                                    allowBlank: true,
                                    // anchor: '100%',
                                    width : '99%',
                                    style : {padding : "0 0 0 0"},
                                    flex: 1,
                                    value : '',
                                    valueField : 'VALUE',
                                    displayField: 'NAME',
                                    store : Ext.create('Ext.data.Store', {
                                        fields: ['VALUE', 'NAME'],
                                        data : [
                                            {"VALUE":"", "NAME":"전체"},
                                            {"VALUE":"MANAGER", "NAME":"관리자"},
                                            {"VALUE":"MODELER", "NAME":"모델러"},
                                            {"VALUE":"VIEWER", "NAME":"단순조회"},
                                        ]
                                    }),
                                },
                                {   
                                    fieldLabel : '처리상태',
                                    xtype: 'combo_ux',
                                    name: 'APPR_SCD',
                                    msgTarget: 'side',
                                    allowBlank: true,
                                    // anchor: '100%',
                                    width : '99%',
                                    style : {padding : "0 0 0 0"},
                                    flex: 1,
                                    value : '',
                                    valueField : 'VALUE',
                                    displayField: 'NAME',
                                    store : Ext.create('Ext.data.Store', {
                                        fields: ['VALUE', 'NAME'],
                                        data : [
                                            {"VALUE":"", "NAME":"전체"},
                                            {"VALUE":"APPR_SCD_APY", "NAME":"신청중"},
                                            {"VALUE":"APPR_SCD_APP", "NAME":"승인"},
                                            {"VALUE":"APPR_SCD_RJT", "NAME":"반려"},
                                        ]
                                    }),
                                },
                            ]
                        },
                          {   
                              xtype : 'gridpanel',
                              region: 'center',
                              title : '참여자 목록',
                              id : 'userListGrid',
                              selType: 'checkboxmodel',
                              selModel: {
                                  checkOnly: false,
                                  injectCheckbox: 1,
                                  mode: 'MULTI'
                              },
                              plugins: {
                                  cellediting: {
                                      editing : true,
                                      clicksToEdit: 1
                                  }
                              },
                              columnLines: true,
                                tbar : [
                                    {
                                         fieldLabel : '권한구분:',
                                         labelWidth : 60,
                                         xtype: 'combobox',
                                         typeAhead: true,
                                         width : 150,
                                         triggerAction: 'all',
                                         selectOnFocus: false,
                                         displayField: 'CD_NM',
                                         valueField: 'CD',
                                         store: {
                                             storeId : 'authCdStore',
                                             field : [
                                                 { name : 'CD', type : 'string', format : '' },
                                                 { name : 'CD_NM', type : 'string', format : '' },
                                             ],
                                             data: [
                                                 { 'CD' : 'MANAGER', 'CD_NM' : '관리자'},
                                                 { 'CD' : 'MODELER', 'CD_NM' : '모델러'},
                                                 { 'CD' : 'VIEWER', 'CD_NM' : '단순조회'},
                                             ]
                                         },
                                         listeners : {
                                             change : function( _this, newValue, oldValue, eOpts ) {
                                                 var grid = Ext.getCmp("userListGrid");
                                                 var selectedRecords = grid.getSelectionModel().getSelection();

                                                 var store = Ext.getStore('apprScdStore');
                                                
                                                 for( var i=0; i < selectedRecords.length; i++) {
                                                     selectedRecords[i].set("AUTH_CD", newValue);
                                                     if( store ) {
                                                        var index = store.findExact('CD',newValue);
                                                        var rs = store.getAt(index).data; 
                                                        if( rs && rs.CD_NM ) {
                                                            selectedRecords[i].set("AUTH_CD_NM", rs.CD_NM);
                                                        }
                                                     }
                                                 }
                                             }
                                             
                                         }
                                         
                                     },
                                    {
                                         fieldLabel : '승인상태:',
                                         labelWidth : 60,
                                         xtype: 'combobox',
                                         typeAhead: true,
                                         width : 150,
                                         triggerAction: 'all',
                                         selectOnFocus: false,
                                         displayField: 'CD_NM',
                                         valueField: 'CD',
                                         store: {
                                             storeId: 'apprScdStore',
                                             field : [
                                                 { name : 'CD', type : 'string', format : '' },
                                                 { name : 'CD_NM', type : 'string', format : '' },
                                             ],
                                             data: [
                                                 { 'CD' : 'APPR_SCD_APY', 'CD_NM' : '신청중'},
                                                 { 'CD' : 'APPR_SCD_APP', 'CD_NM' : '승인'},
                                                 { 'CD' : 'APPR_SCD_RJT', 'CD_NM' : '반려'},                                             ]
                                         },
                                         listeners : {
                                             change : function( _this, newValue, oldValue, eOpts ) {
                                                 var grid = Ext.getCmp("userListGrid");
                                                 var selectedRecords = grid.getSelectionModel().getSelection();

                                                 var store = Ext.getStore('apprScdStore');
                                                
                                                 for( var i=0; i < selectedRecords.length; i++) {
                                                     selectedRecords[i].set("APPR_SCD", newValue);
                                                     if( store ) {
                                                        var index = store.findExact('CD',newValue);
                                                        var rs = store.getAt(index).data; 
                                                        if( rs && rs.CD_NM ) {
                                                            selectedRecords[i].set("APPR_SCD_NM", rs.CD_NM);
                                                        }
                                                     }
                                                 }
                                             }
                                             
                                         }
                                     },
                                    '->'
                                    ,{ xtype: 'splitbutton', text: '추가', cls : 'btn_segmentedbutton', // disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                                    
                                        listeners : {
                                            click : function(_this, e, eOpts) { 
                                                
                                                var store = Ext.getStore("userListStore");
                                                
                                                var grid = Ext.getCmp("userListGrid");
                                                var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                
                                                var row = -1 ; // grid.store.indexOf(selectedRecord);
                                                store.insert(row+1, {AUTH_CD : "VIEWER", AUTH_CD_NM : "단순조회", APPR_SCD : "APPR_SCD_APP", APPR_SCD_NM : "승인" });
            
                                            }
                                        },

                                        menu: {
                                            plain: true,
                                            // disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                                            items: [ 
                                                    {text: '3건 추가', id : 'userList_addColumn3',
                                                        // disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                                                        handler : function(_this, ev) {
                                                             var grid = Ext.getCmp("userListGrid");
                                                             var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                             var row = -1 ; // grid.store.indexOf(selectedRecord);
                                                             
                                                             var store = Ext.getStore("userListStore");

                                                             for(var i=0; i < 3 ; i++){
                                                                 store.insert(row+i+1, {AUTH_CD : "VIEWER", AUTH_CD_NM : "단순조회", APPR_SCD : "APPR_SCD_APP", APPR_SCD_NM : "승인" });
                                                             }
                                                        }
                                                    },
                                                    {text: '5건 추가', id : 'userList_addColumn5',
                                                        // disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                                                        handler : function(_this, ev) {
                                                             var grid = Ext.getCmp("userListGrid");
                                                             var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                             var row = -1 ; // grid.store.indexOf(selectedRecord);
                                                             
                                                             var store = Ext.getStore("userListStore");

                                                             for(var i=0; i < 5 ; i++){
                                                                 store.insert(row+i+1, {AUTH_CD : "VIEWER", AUTH_CD_NM : "단순조회", APPR_SCD : "APPR_SCD_APP", APPR_SCD_NM : "승인" });
                                                             }
                                                        }
                                                    },
                                                    {text: '10건 추가', id : 'userList_addColumn10',
                                                        // disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                                                        handler : function(_this, ev) {
                                                             var grid = Ext.getCmp("userListGrid");
                                                             var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                             var row = -1 ; //grid.store.indexOf(selectedRecord);
                                                             
                                                             var store = Ext.getStore("userListStore");

                                                             for(var i=0; i < 10 ; i++){
                                                                 store.insert(row+i+1, {AUTH_CD : "VIEWER", AUTH_CD_NM : "단순조회", APPR_SCD : "APPR_SCD_APP", APPR_SCD_NM : "승인" });
                                                             }
                                                        }
                                                    },
                                                    {text: '다건 추가', id : 'userList_addColumnMulti',
                                                        // disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                                                        handler : function(_this, ev) {
                                                            Ext.MessageBox.prompt('입력', '추가 할 컬럼 수(숫자만입력, 1~15사이 숫자):', function(btn, text) {
                                                                    var rowCnt = text.replace(/[^0-9]/g,'');
                                                                    
                                                                    if( btn == 'ok') {
                                                                        if( rowCnt > 15 || rowCnt < 1) {
                                                                            Ext.MessageBox.alert('알림', '숫자는 1~15사이의 숫자를 입력하세요.')
                                                                        } else {
                                                                            
                                                                             var grid = Ext.getCmp("rightWord_gridpanel");
                                                                             var selectedRecord = grid.getSelectionModel().getSelection()[0];
                                                                             var row = -1 ; //grid.store.indexOf(selectedRecord);
                                                                             
                                                                             var store = Ext.getStore("userListStore");

                                                                             for(var i=0; i < rowCnt ; i++){
                                                                                 store.insert(row+i+1, {AUTH_CD : "VIEWER", AUTH_CD_NM : "단순조회", APPR_SCD : "APPR_SCD_APP", APPR_SCD_NM : "승인" });
                                                                             }
                                                                        }
                                                                    }
                                                                }, this, false, '10', {
                                                                    prompt : { xtype: 'numberfield',
                                                                               minValue: 0, 
                                                                               maxValue: 100 
                                                                             }
                                                                }
                                                            );
                                                            
                                                        }
                                                    },
                                               ]   
                                          },

                                    }
                                    , { text: '저장', cls : 'btn_segmentedbutton', // disabled : !drawDataLoad.hasUserAuthOfModeler(), 
                                        listeners : {
                                            click : function(_this, e, eOpts) { 

                                                var gridColumn = Ext.getCmp("userListGrid");
                                                gridColumn.submit('changed', '/project/data/userStatusSave.do', {
                                                    showSaving : true,
                                                    callback : function(form, success, response) { 
                                                        var res = Ext.decode(response.responseText);
                                                        if( res.error && res.message ) {
                                                            Ext.Msg.alert(
                                                                    '알림',
                                                                    res.message
                                                                );
                                                        } else {
                                                            var store = Ext.getStore("userListStore");
                                                            store.reload();
                                                        }
                                                    },
                                                    success : function(batch, option) {
                                                        Ext.Msg.alert(
                                                                '안내',
                                                                '저장되었습니다.'
                                                            );
                                                        var store = Ext.getStore("userListStore");
                                                        store.reload();
                                                    },
                                                    failure : function() {
                                                        Ext.MessageBox.hide();
                                                        // alert('실패');
                                                    }
                                                });

                                            }
                                        }
                                    },
                                ],
                              store : {
                                  xtype : 'store',
                                  storeId : 'userListStore',
                                  idProperty : 'USR_UID',
                                  fields: [
                                      {name : 'USR_UID', type : 'string'},
                                      {name : 'USR_NM', type : 'string'},
                                      {name : 'LOGIN_ID', type : 'string'},
                                      {name : 'AUTH_CD', type : 'string'},
                                      {name : 'AUTH_CD_NM', type : 'string'},
                                      {name : 'APPR_SCD', type : 'string'},
                                      {name : 'APPR_SCD_NM', type : 'string'},
                                      {name : 'APLY_DT_FMT', type : 'string'},
                                      {name : 'APLY_DT', type : 'string'},
                                  ],
                                  autoLoad: true,
                                  proxy : {
                                       type : 'ajax',
                                       url : '/project/data/userList.do',
                                       reader : {
                                           type : 'json',
                                           rootProperty : 'data',
                                           totalProperty: 'totalCount' 
                                       },
                                       extraParams: {
                                           
                                       },
                                   },
                              },
                              columns: [
                                  { xtype: 'rownumberer'},
                                  { header: '<div style="text-align:center;width:100%;">사용자 명</div>', dataIndex: 'USR_NM', flex: 1,
                                       renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                                           var link = new Array();
                                           link.push('<span id="userList_'+ record.data.USR_NM +'">'+ record.data.USR_NM +'</span>');
                                           return link.join(' ');
                                       },
                                  },
                                  { header: '<div style="text-align:center;width:100%;"><div class="grid-header-textfield"></div>*사용자ID</div>', dataIndex: 'LOGIN_ID', align:'left', width : 150, flex: 1, 
                                        getEditor: function(record){
                                            if (record.get("USR_UID")) {
                                                return "";
                                            } else {
                                                return  {
                                                    allowBlank: true,
                                                    selectOnFocus: false
                                                };
                                                
                                            }
                                            
                                        }
                                  
                                  },
                                  { header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>*권한구분</div>', dataIndex: 'AUTH_CD', align:'center', width : 80, 
                                       renderer : function (value, metaData, record , rowIndex, colIndex, store, view ){
                                            var store = Ext.getStore('authCdStore');
                                            if( store ) {
                                                var index = store.findExact('CD',value);
                                                 
                                                console.log( 'index', index ); 
                                                if (index != -1){
                                                    var rs = store.getAt(index).data; 
                                                    return rs.CD_NM; 
                                                } else {
                                                    return value;
                                                }
                                            } else {
                                                return record.get("AUTH_CD_NM");
                                            }
                                       },
                                       editor: {
                                         xtype: 'combobox',
                                         typeAhead: true,
                                         triggerAction: 'all',
                                         selectOnFocus: false,
                                         displayField: 'CD_NM',
                                         valueField: 'CD',
                                         store: {
                                             
                                             field : [
                                                 { name : 'CD', type : 'string', format : '' },
                                                 { name : 'CD_NM', type : 'string', format : '' },
                                             ],
                                             data: [
                                                 { 'CD' : 'MANAGER', 'CD_NM' : '관리자'},
                                                 { 'CD' : 'MODELER', 'CD_NM' : '모델러'},
                                                 { 'CD' : 'VIEWER', 'CD_NM' : '단순조회'},
                                             ]
                                         }
                                     }
                                  },
                                  { header: '<div style="text-align:center;width:100%;"><div class="grid-header-combogrid"></div>*승인상태</div>', dataIndex: 'APPR_SCD', align:'center', width : 80, 
                                       renderer : function (value, metaData, record , rowIndex, colIndex, store, view ){
                                            var store = Ext.getStore('apprScdStore');
                                            if( store ) {
                                                var index = store.findExact('CD',value);
                                                console.log( 'index', index ); 
                                                if (index != -1){
                                                    var rs = store.getAt(index).data; 
                                                    return rs.CD_NM; 
                                                } else {
                                                    return value;
                                                }
                                            } else {
                                                return record.get("APPR_SCD_NM");;
                                            }
                                        },
                                       editor: {
                                         xtype: 'combobox',
                                         typeAhead: true,
                                         triggerAction: 'all',
                                         selectOnFocus: false,
                                         displayField: 'CD_NM',
                                         valueField: 'CD',
                                         store: {
                                             
                                             field : [
                                                 { name : 'CD', type : 'string', format : '' },
                                                 { name : 'CD_NM', type : 'string', format : '' },
                                             ],
                                             data: [
                                                 { 'CD' : 'APPR_SCD_APY', 'CD_NM' : '신청중'},
                                                 { 'CD' : 'APPR_SCD_APP', 'CD_NM' : '승인'},
                                                 { 'CD' : 'APPR_SCD_RJT', 'CD_NM' : '반려'},
                                             ]
                                         }
                                     }
                                     
                                  },
                                  { header: '<div style="text-align:center;width:100%;">신청(처리)일자</div>', dataIndex: 'APLY_DT_FMT', align:'center', width : 100,}
                              ],
                          }
                      ]
                 }).show();
    }


    /**
     * 로그인
     */
    static loginWindow(messageShow){
        
        var viewSize = Ext.getBody().getViewSize();
        
        var window = Ext.create('Ext.window.Window', {
              title : '로그인',
              width : 400,
              height : 60+(23*3) + (messageShow ? (25*2) : 0),
              autoShow :false,
              resizable : false,
              modal : true,
              id : 'loginWindow',
              layout: 'fit',
              buttons : [
                  { text: '로그인', handler : function() {
                        Ext.getCmp('loginForm').submit({
                            isForceSave : true,
                            clientValidation: true,
                            url: '/common/login/login.do',
                            success: function(form, action) {
                                console.log( action )
                               /*
                                var node = Ext.getStore("domainTreeStore").findNode( "DOMAIN_ID", domain_id);
                                node.appendChild({"DOMAIN_ID" : "DOMAIN_ID", "DOMAIN_NM" : "DOMAIN_NM", "leaf":false, "text" : "text"});
                               */
                              
                                self.location.href = '/extjs/erd/erd.do';
                                /*
                                Ext.get("erd-title").setHtml(action.result.PROJECT_NM);
                                
                                Ext.getCmp('loginWindow').close();
                                */
                               /*
                               Ext.Msg.alert('성공', action.result.message, function() {
                                   
                               });
                               */
                            },
                            failure: function(form, action) {
                               // console.log('failure', form, action );
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert(
                                            '오류',
                                            '입력값을 확인하세요.'
                                        );
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('실패', '로그인에 실패했습니다.<br/>아이디/패스워드를 확인하세요.');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                       Ext.Msg.alert('실패', "로그인에 실패했습니다.<br/>아이디/패스워드를 확인하세요.");
                               }
                            }
                        });
                      } 
                  },
                  { text: '회원가입', handler : function() {
                        Ext.getCmp('loginWindow').close();
                        ErdAppFunction.addUserWindow();
                     }
                  },
                  { text: '패스워드 초기화', handler : function() {
                        if( Ext.getCmp("loginForm_LOGIN_ID").getValue() == "" ) {
                            Ext.Msg.alert('실패', "아이디(ID)를 입력 후 [패스워드 초기화]버튼을 클릭하면,<br/>ID에 해당하는 메일로 초기화된 패스워드를 받아볼 수 있습니다.");
                        } else {
                            
                            var regex = new RegExp('^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$');
                            var login_id = Ext.getCmp("loginForm_LOGIN_ID").getValue();
                            console.log( login_id, regex.test(login_id) )
                            if( !regex.test(login_id) ) {
                                Ext.Msg.alert('실패', "아이디(ID)를 이메일(ex. some@email.com) 형식으로 입력하세요.", function() {
                                    Ext.getCmp("loginForm_LOGIN_ID").focus();
                                });
                            } else {
                                Ext.Msg.confirm('확인', '패스워드를 초기화하시겠습니까?<br/>(*초기화된 패스워드는 입력한ID(e-mail:'+Ext.getCmp("loginForm_LOGIN_ID").getValue()+')로 발송됩니다.', function(btn) {
                                    if( btn == 'yes') {
                                        var response = Ext.Ajax.request({
                                            async: false,
                                            url: '/user/data/initPassword.do',
                                            params: {
                                                LOGIN_ID :  login_id
                                            }
                                        });
                                        
                                        if(Ext.decode(response.responseText).success) {
                                            Ext.Msg.alert('안내', Ext.decode(response.responseText).message);
                                        } else {
                                            Ext.Msg.alert('실패', Ext.decode(response.responseText).message);
                                        }
                                    }
                                });
                            }
                        }
                     }
                  }
              ],
              items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'loginForm',
                        items: [
                             {   
                                fieldLabel : '아이디(ID)',
                                xtype: 'textfield_ux',
                                id : "loginForm_LOGIN_ID",
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'LOGIN_ID',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                value : Ext.util.Cookies.get('LOGIN_ID')||'',
                                emptyText : 'ID(ex, some@email.com)',
                                submitEmptyText : false,
                                regex : /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+\/=?\^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
                                listeners: {
                                    afterrender: function(field) {
                                        console.log( )
                                        if( Ext.getCmp("loginForm_CHECK_ID_SAVE").checked  ) {
                                            field.setValue(Ext.util.Cookies.get('LOGIN_ID'));
                                        } 
                                        field.focus();
                                    },
                                    change : function ( _this, newValue, oldValue, eOpts )  {
                                        if( Ext.getCmp("loginForm_CHECK_ID_SAVE").checked  ) {
                                            var date = new Date(Date.now() + 7*24*60*60*1000);
                                            // date = date.toUTCString();
                                            Ext.util.Cookies.set('LOGIN_ID', newValue, date);
                                        } else {
                                            Ext.util.Cookies.set('LOGIN_ID', '');
                                        }
                                        
                                    }
                                },
                            }, 
                            {   
                                fieldLabel : '패스워드(PWD)',
                                xtype: 'password_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'PWD',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                // regex : /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
                                emptyText : '숫자+문자+특수문자 혼합(8자리 이상)',
                                submitEmptyText : false,
                            },
                            {
                                xtype: 'checkbox_ux',
                                name : 'CHECK_ID_SAVE',
                                id : 'loginForm_CHECK_ID_SAVE',
                                boxLabel: 'ID 저장', 
                                style : {padding : "0 3 0 1"},
                                inputValue: 'Y',
                                anchor: '100%',
                                checked: Ext.util.Cookies.get('CHECK_ID_SAVE') ? true : false,
                                listeners: {
                                    change:    function (cb, newValue, oldValue, eOpts) {
                                        Ext.util.Cookies.set('CHECK_ID_SAVE', newValue);
                                        if( cb.checked ) {
                                            var date = new Date(Date.now() + 7*24*60*60*1000);
                                            // date = date.toUTCString();
                                            Ext.util.Cookies.set('LOGIN_ID', Ext.getCmp("loginForm_LOGIN_ID").getValue(), date);
                                        } else {
                                            Ext.util.Cookies.set('LOGIN_ID', '');
                                        }
                                    }
                                },
                                
                            },
                            {   
                                xtype : 'component',
                                html : "[안내]<br/>Guest계정은 테이블 등록/수정이 불가능 합니다.<br/>로그인 후 사용해주세요.",
                                id : "loginInfoDesc",
                                visible : !messageShow,
                            },
                        ]
                }
              ],
        }).show();
    }

    /**
     * 사용자 등록
     */
    static addUserWindow(){
        
        var viewSize = Ext.getBody().getViewSize();
        
        var window = Ext.create('Ext.window.Window', {
              title : '회원가입',
              width : 400,
              height : 90+(23*8), // 4
              autoShow :false,
              resizable : false,
              modal : true,
              id : 'addUserWindow',
              layout: 'fit',
              buttons : [
                  { text: '저장', handler : function() {
                        Ext.getCmp('userRegistForm').isValid();
                        
                        console.log( Ext.getCmp('userRegistPwd_1').getValue(), Ext.getCmp('userRegistPwd_2').getValue())
                        if( Ext.getCmp('userRegistPwd_1').getValue() != Ext.getCmp('userRegistPwd_2').getValue()) {
                               Ext.Msg.alert('WARN', '패스워드가 일치하지 않습니다.', function() {
                                  Ext.getCmp('userRegistPwd_2').focus();
                               });
                               return;
                        }
                        Ext.getCmp('userRegistForm').submit({
                            msgConfirm : '회원가입하시겠습니까?',
                            clientValidation: true,
                            url: '/user/data/insert.do',
                            success: function(form, action) {
                               /*
                                var node = Ext.getStore("domainTreeStore").findNode( "DOMAIN_ID", domain_id);
                                node.appendChild({"DOMAIN_ID" : "DOMAIN_ID", "DOMAIN_NM" : "DOMAIN_NM", "leaf":false, "text" : "text"});
                               */
                               
                               Ext.Msg.alert('성공', action.result.message, function() {
                                   self.location.href = '/extjs/erd/erd.do';
                                   //Ext.getStore("subjectEntityListStore").reload();
                                   //window.close();
                               });
                               
                            },
                            failure: function(form, action) {
                                switch (action.failureType) {
                                    case Ext.form.action.Action.CLIENT_INVALID:
                                        Ext.Msg.alert(
                                            '오류',
                                            '입력값을 확인하세요.'
                                        );
                                        break;
                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                        Ext.Msg.alert('실패', '저장에 실패했습니다.');
                                        break;
                                    case Ext.form.action.Action.SERVER_INVALID:
                                       Ext.Msg.alert('실패', action.result.errorMessage, function() {
                                           Ext.getCmp('userRegistForm_LOGIN_ID').focus();
                                       });
                               }
                            }
                        });
                      } 
                  },
                  { text: '로그인 창', handler : function() {
                        Ext.getCmp('addUserWindow').close();
                        ErdAppFunction.loginWindow()
                     }
                  }
              ],
              items : [
                  {
                        xtype : 'formPanel_ux',
                        id : 'userRegistForm',
                        items: [
                            {   
                                fieldLabel : '사용자명',
                                labelWidth : 140,
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'USR_NM',
                                msgTarget: 'side',
                                allowBlank: false,
                                value : '',
                                anchor: '100%',
                                emptyText : '사용자명',
                                submitEmptyText : false,
                            },
                             {   
                                fieldLabel : '아이디(ID)',
                                labelWidth : 140,
                                xtype: 'textfield_ux',
                                id: 'userRegistForm_LOGIN_ID',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'LOGIN_ID',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                regex : /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+\/=?\^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
                                value : 'some@email.com',
                                emptyText : 'ID(ex, some@email.com)',
                                submitEmptyText : false,
                                listeners: {
                                    afterrender: function(field) {
                                        field.focus();
                                    }
                                },
                            }, 
                            {   
                                fieldLabel : '패스워드(PWD)',
                                labelWidth : 140,
                                id : 'userRegistPwd_1',
                                xtype: 'password_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'PWD',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                regex : /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
                                value : 'some@email.com',
                                emptyText : '숫자+문자+특수문자 혼합(8자리 이상)',
                                submitEmptyText : false,
                            }, 
                            {   
                                fieldLabel : '패스워드확인(PWD)',
                                labelWidth : 140,
                                id : 'userRegistPwd_2',
                                xtype: 'password_ux',
                                labelCls   : 'x-form-item-label x-form-item-label-required',
                                name: 'PWD2',
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                regex : /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
                                value : 'some@email.com',
                                emptyText : '숫자+문자+특수문자 혼합(8자리 이상)',
                                submitEmptyText : false,
                            }, 
                            {   
                                fieldLabel : '프로젝트 공유신청코드',
                                labelWidth : 140,
                                xtype: 'textfield_ux',
                                labelCls   : 'x-form-item-label',
                                name: 'REQ_PROJECT_SHARE_ID',
                                msgTarget: 'side',
                                anchor: '100%',
                                emptyText : '',
                                submitEmptyText : false,
                            },
                            {   
                                xtype : 'component',
                                html : "*아이디(ID)는 비밀번호 초기화시 발송되는 메일주소이니 정확하게 입력하시기 바랍니다.<br/>* 다른 프로젝트를 공유받고자 할 경우, [프로젝트 공유신청코드]로 요청 하면 해당 프로젝트의 담당자 승인 후 사용 가능합니다.<br/>공유코드가 정확하지 않은 경우에는 신청되지 않으니, 상단 [프로젝트열기]메뉴에서 신청 여부를 확인하세요.",
                                id : "shareProjectIdDesc"
                            },
                            {xtype: 'hiddenfield', name: 'PROJECT_SHARE_ID', value: ErdAppFunction.makeid(16), },
                        ]
                }
              ]
        }).show();
    }
}