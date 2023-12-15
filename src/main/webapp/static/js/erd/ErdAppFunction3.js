class  ErdAppFunction{
    static editDomainWindow(domain_id, domain_nm){
        Ext.create('Ext.window.Window', {
              title : '['+domain_nm+'] 도메인수정',
              width : 300,
              height : 200,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : 'domain_add_'+domain_id
        }).show();
    }
    
    static addDomainWindow(domain_id, domain_nm){
        Ext.create('Ext.window.Window', {
              title : '['+domain_nm+']의 하위 도메인등록',
              width : 300,
              height : 200,
              autoShow :false,
              resizable : false,
              modal : true,
              animateTarget : 'domain_add_'+domain_id,
              layout: 'fit',
              items : [
                  Ext.create('Ext.form.Panel', {
                        items: [
                            {
                                value : domain_id,
                                valueText : domain_nm,
                                fieldLabel: '상위도메인',
                                labelSeparator : '',
                                xtype: 'combotreegrid',
                                rootVisible: false,
                                fields: [
                                    { name: 'DOMAIN_ID', type: 'string' },
                                    { name: 'DOMAIN_NM', type: 'string' },
                                    { name: 'UP_DOMAIN_ID', type: 'string' },
                                    { name: 'DTYPE', type: 'string' },
                                    { name: 'PROJECT_ID', type: 'string' },
                                    { name: 'LEN1', type: 'string' },
                                    { name: 'LEN2', type: 'string' },
                                    { name: 'DEFAULT_VAL', type: 'string' },
                                    { name: 'ICON_CLS', type: 'string' },
                                    { name: 'iconCls', type: 'string' },
                                    { name: 'LAST_UPD_DT', type: 'string' },
                                    { name: 'LAST_UPD_USR_UID', type: 'string' }
                                ],
                                proxy: {
                                    type: 'ajax',
                                    url : '/data/tree/domain.do',
                                    extraParams : {
                                        PROJECT_ID : 'PROJECT'
                                    }, // , 
                                    reader: {
                                        type: 'json',
                                        rootProperty : 'CHILDREN',
                                        totalProperty: 'totalCount'
                                    },
                                    root: {
                                        expanded: false
                                    },
                                }
                             },
                             {   
                                fieldLabel : '도메인명',
                                xtype: 'textfield_ux',
                                name: 'type_1',
                                msgTarget: 'side',
                                allowBlank: true,
                                anchor: '100%',
                            }, 
                        ]
                })
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
                 alert(btn)
             }
        });
        
    }
}