/**
 * combobox 재구성.. (Combo + X + 팝업)
 */
Ext.define('Ext.form.field.ux.ComboTripple', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.combotipple_ux',
    trigger2Cls: 'x-form-clear-trigger',
    trigger3Cls: 'x-form-search-trigger',
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    valueField: 'VALUE',
    displayField: 'NAME',
    labelSeparator: '',
    // editable      : false,
    width: 320,
    labelWidth: 100,
    columns: 'auto',
    msgTarget: 'side',
    triggers: {
        foo: {
            cls: 'x-form-clear-trigger',
            handler: function() {
                console.log('foo trigger clicked');
            }
        },
        bar: {
            cls: 'x-form-search-trigger',
            handler: function() {
                console.log('bar trigger clicked');
            }
        }
    },

    /*
    constructor: function(config) {

        this.listeners = Ext.applyIf(config.listeners || {}, {
            beforerender: function(_this) {
                _this.listConfig = _this.listConfig || {};
                if (!_this.listConfig.itemTpl) {
                   // _this.listConfig.itemTpl = Ext.create('Ext.XTemplate', '<tpl for=".">{NAME}<tpl if="COMMENTS_TITLE">' + Ext.String.format(G_HELP_TIP_TPL_ITEM, _this.getId() + '-{VALUE}-help') + '</tpl></tpl>')
                }
            },
            // 도움말 Comments에 기능 추가..
            afterrender: function(_this) {
                try {
                    _this.setPopupTriggerDisplay(_this.code || '' != '' || _this.code.indexOf('.') < 0);
                } catch (e) {
                    alert('ComboTripple.js -> ' + e);
                }
                var imgEl = Ext.get(_this.getId() + '-help');
                if (imgEl) {
                    imgEl.on("click", function(e, t, eOpts) {
                        e.stopEvent();
                        var win = Ext.getCmp('comments-window');
                        if (!win) {
                            win = Ext.create('Ext.window.ux.WindowHelp', {
                                title: _this.getFieldLabel() + '의 Comments 수정 ',
                                x: e.getX(),
                                y: e.getY(),
                                target: t
                            });
                        } else {
                            win.setTitle(_this.getFieldLabel() + '의 Comments 수정 ');
                            win.setX(e.getX());
                            win.setY(e.getY());
                            win.setTarget(t);

                            Ext.getCmp('comments-window-comments').setValue(t.getAttribute('data-qtip'));
                        }
                        win.show();
                    });
                }
                _this.setCloseTriggerDisplay((_this.value == null || _this.value == '') ?  false : true);
                
                // ok, 하지만 화면의 ui때문에 주석처리
                _this.on('change', function(__this, newValue, oldValue, eOpts) {
                    __this.setCloseTriggerDisplay(newValue != '');
                });

            },
            change: function(_this, newValue, oldValue, eOpts) {

                if (config.event && config.event.change) {
                    Ext.Function.defer(config.event.change, 0, this, [_this, newValue, oldValue, eOpts]);
                }
            }
        }); // config.listeners; <-- original
        this.callParent(arguments);
    },
    */
    initComponent: function() {
        var me = this;
        me.queryMode = 'local';
        me.forceSelection = true;
        // me.editable      = false;

        me.callParent(arguments);

    },
    afterRender: function() {
        this.callParent();
        // 'X' 콤보 안보이게..
        if (!this.allowBlank) { // || this.getValue() == '' ok, 하지만 화면의 ui때문에 주석처리
            this.setCloseTriggerDisplay(false);
        }

    },
    onTrigger2Click: function(event) {
        var me = this;
        // alert(event.getTarget().className);
        me.collapse();
        // 첫번째 값이 "-전체-" 인 경우
        /* if(  me.first == 'all') {
            me.setValue('');       	
       	} else */

        if (me.first || 'none' == 'none' || me.first == 'all') {
            me.clearValue();
        }
        me.inputEl.focus();
        /*  ok, 하지만 화면의 ui때문에 주석처리 */
        me.setCloseTriggerDisplay(false);

    },
    onTrigger3Click: function(event) {
        var me = this;
        me.collapse();
        
        var code = me.code;
        
        if (me.code && me.code.indexOf('.') >= 0) {
            hoAlert('공통코드가 아닙니다.', Ext.exptyFn, 1000);
        } else {
            var ux_combo_window_code_view = Ext.getCmp('ux_combo_window_code_view');
            if (!ux_combo_window_code_view) {
                ux_combo_window_code_view = Ext.create('Ext.window.Window', {
                    title: '공통코드 팝업',
                    id: 'ux_combo_window_code_view',
                    scrollable: true,
                    closable: true,
                    modal: true,
                    height: 600,
                    width: 1200,
                    border: 0,
                    layout: 'fit',
                    items: [
                        Ext.create('Ext.tree.Panel', {
                            viewConfig: {
                                forceFit: true
                            },
                            autoScroll : true,
                            rootVisible: false,
                            columnLines: true,
                            rowLines: true,
                            useArrows: true,

                            reserveScrollbar: true,
                            
                            id: 'ux_combo_grid_window_code_view',
                            store: Ext.create('Ext.data.TreeStore', {
                                idProperty: 'ID',
                                textProperty: 'TEXT',
                                storeId: 'ux_combo_store_grid_store_window_code_view',
                                autoDestroy: true,
                                // autoLoad : true,
                                remoteSort: true,
                                fields: ['depth', 'leaf', 'expanded', 'COMPANY_ID', 'CD', 'CD_NM', 'P_CD', 'FREE_1', 'FREE_2', 'FREE_3', 'FREE_4', 'FREE_5', 'FREE_6', 'FREE_7', 'FREE_8', 'FREE_9', 'FREE_A', 'FREE_B', 'FREE_C', 'FREE_D', 'FREE_E', 'FREE_F', 'FREE_G', 'FREE_H', 'FREE_I', 'USE_YN', 'COMMENTS_TITLE', 'COMMENTS', 'SORT_NUM', 'ICON_CLS'],
                                id: 'ux_combo_grid_store_window_code_view',
                                proxy: Ext.create('Ext.data.HttpProxy', {
                                    type: 'ajax', //'memory',
                                    url: '/s/system/code.do?p_action_flag=v_list_group',
                                    reader: {
                                        type: 'json'
                                    },
                    		        writer: {
                    		            type: 'singlepost', // 'json',
                    		            writeAllFields: true,
                    		            encode : true,
                    		           	params : { }, // @TODO  이런 형태로 파라미터 추가 가능..
                    		            allowSingle : false 
                    		        },
                    				api: {
                    	                create: '/s/system/code.do',
                    	                update: '/s/system/code.do'
                    		        }
                                })
                            }),
                            selType: 'cellmodel',
                            margin: '0 0 0 0',
                            plugins : [
                     			Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})
                    		], 
                            columns: [{
                                    xtype: 'rownumberer',
                                    // header: 'No',
                                    width: 30
                                }, {
                                    xtype: 'treecolumn',
                                    dataIndex: 'CD_NM',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 코드명',
                                    sortable: true,
                                    style: 'text-align:center',
                                    minWidth: 150,
                                    locked : true,
                                    editor : {
                        				xtype      : 'textfield_ux',
                        				allowBlank: false
                        			}
                                }, {
                                    dataIndex: 'CD',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 코드',
                                    sortable: true,
                                    style: 'text-align:center',
                                    width: 100,
                                    locked : true,
                                    editor : {
                        				xtype      : 'textfield_ux',
                        				allowBlank: false
                        			}
                                }, {
                                    dataIndex: 'ICON_CLS',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; ICON CLS',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                                    locked : true,
                                    editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'USE_YN',
                                    header: '<div class="grid-header-combotipple"></div>&nbsp; 사용여부',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 80,
                                    locked : true,
                                    editor : {
                                    	xtype : 'combo',
                                    	store : Ext.create('Ext.data.Store', {
                                    	    fields: ['code', 'name'],
                                    	    data : [
                                    	        {"code":"Y", "name":"사용"},
                                    	        {"code":"N", "name":"미사용"}
                                    	    ]
                                    	}),
                                    	queryMode: 'local',
                                        displayField: 'name',
                                        valueField: 'code'
                                    },
                                    renderer : function(value, metaData ) {
                                    	var combo = metaData.column.getEditor(), rValue = value||'';
                                    	
                                    	if(value && combo && combo.store && combo.displayField||'name'){
                                        	var index = combo.store.findExact(combo.valueField||'code', value);
                        	    	        if(index >= 0){
                        	    	        	rValue = combo.store.getAt(index).get(combo.displayField||'name');
                        	    	        } 
                                    	}
                    	    	        return rValue;
                                    }
                                }, {
                                    dataIndex: 'FREE_1',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드1',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_2',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드2',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_3',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드3',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_4',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드4',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_5',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드5',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_6',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드6',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_7',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드7',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_8',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드8',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_9',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드9',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_A',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드A',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_B',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드B',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_C',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드C',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_D',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드D',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_E',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드E',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_F',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드F',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_G',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드G',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_H',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드H',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'FREE_I',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정의 코드I',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'COMMENTS_TITLE',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; COMMENT제목',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'COMMENTS',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; COMMENT',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'center',
                                    width: 90,
                        			editor : {
                        				xtype      : 'textfield_ux'
                        			}
                                }, {
                                    dataIndex: 'SORT_NUM',
                                    header: '<div class="grid-header-textfield"></div>&nbsp; 정렬 순서',
                                    sortable: true,
                                    style: 'text-align:center',
                                    align: 'right',
                                    width: 90,
                        			editor : {
                        				xtype      : 'numberfield_ux'
                        			}
                                }

                            ],
                            dockedItems: [{
                                xtype: 'toolbar',
                                dock: 'top',
                                flex: 1,
                                border: true,
                                items: ['->', {
                                    xtype: 'button',
                                    border: 1,
                                    style: {
                                        borderColor: '#99bce8',
                                        borderStyle: 'solid'
                                    },
                                    glyph: 'xf1f8@FontAwesome',
                                    text: '삭제', // iconCls:'btn-icon-save', 
                                    handler: function() {
                                    	var grid_1 = Ext.getCmp('ux_combo_grid_window_code_view');
                                    	
                                    	var selectedNode = grid_1.getSelectionModel().getSelection();
                                    	
                                    	var store = Ext.getStore('ux_combo_store_grid_store_window_code_view');
                                    	
                                    	var t_node = store.getNodeById(selectedNode[0].getId());
                                    	
                                    	t_node.remove();
                                    }
                                }, {
                                    xtype: 'button',
                                    border: 1,
                                    style: {
                                        borderColor: '#99bce8',
                                        borderStyle: 'solid'
                                    },
                                    glyph: 'xf067@FontAwesome',
                                    text: '추가', // iconCls:'btn-icon-save', 
                                    handler: function() {
                                    	var store = Ext.getStore('ux_combo_store_grid_store_window_code_view');
                                    	
                                    	var t_node = store.getNodeById(code);
                                    	
                                    	var ran = Math.round(Math.random()*10000000);
                                    	
                                    	t_node.appendChild({
                                    		CD_NM: '',
                                    		id : ran,
									        USE_YN: 'Y',
									        leaf: true
										}); 
                                    }
                                }, {
                                    xtype: 'button',
                                    border: 1,
                                    style: {
                                        borderColor: '#99bce8',
                                        borderStyle: 'solid'
                                    },
                                    glyph: 'xf0c7@FontAwesome',
                                    text: '저장', // iconCls:'btn-icon-save', 
                                    handler: function() {
                                    	var grid_1 = Ext.getCmp('ux_combo_grid_window_code_view');
                						console.log( code );
                						var params = {CODE : code};
                						grid_1.submit('changed', 'b_update_code', { params : params } ) ;
                                    }
                                }]
                            }]
                        })
                     ] // end of items
                });
            }
            ux_combo_window_code_view.show();
            var codeStore = Ext.getStore('ux_combo_store_grid_store_window_code_view');
            codeStore.load({
                params: {
                    'code': me.code,
                    'ROOT': '*'
                }
            });
        }
    },
    setCloseTriggerDisplay: function(display) {
        if (!this.allowBlank) {
            this.triggerCell.item(1).setDisplayed(false);
        } else {
            this.triggerCell.item(1).setDisplayed(display);
        }
    },
    setPopupTriggerDisplay: function(display) {
        this.triggerCell.item(1).setDisplayed(false);
    }
});