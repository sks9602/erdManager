/**
 * Grid상단에 checkbox가 포함된 Column
 */
/*
Ext.override(Ext.selection.CheckboxModel, {
    maybeFireSelectionChange: function(fireEvent) {
    	for( var x in arguments ) {
    		console.log("Ext.selection.CheckboxModel.maybeFireSelectionChange() - " + x + ":" + arguments[x])
    	}
        if (fireEvent && !this.suspendChange) {
            this.updateHeaderState();
        }
        this.callParent(arguments);
    },
    onCheckChange: function(record, isSelected, suppressEvent, commitFn) {
        var me = this,
            eventName = isSelected ? 'select' : 'deselect';

        console.log("Ext.selection.CheckboxModel.onCheckChange() - " + eventName )

        if ((suppressEvent || me.fireEvent('before' + eventName, me, record)) !== false &&
           commitFn() !== false) {

            if (!suppressEvent) {
                me.fireEvent(eventName, me, record);
            }
        }
    },
    onSelectChange: function() {
    	for( var x in arguments ) {
    		console.log("Ext.selection.CheckboxModel.onSelectChange() - " + x + ":" + arguments[x])
    		if( typeof(arguments[x]) == 'object') {
    			for( var y in arguments[x] ) {
    				if( typeof(arguments[x][y]) != 'function') {
    					console.log("Ext.selection.CheckboxModel.onSelectChange() for- " + y + ":" + arguments[x][y]);

 						for( var z in arguments[x][y] ) {
 							if( typeof(arguments[x][y][z]) != 'function') {
 								console.log("Ext.selection.CheckboxModel.onSelectChange() for- for- ["+ typeof(arguments[x][y][z])+ "]" + z + ":" + arguments[x][y][z]);
 							}
						}
    				}
    			}
    		}
    	}
        this.callParent(arguments);
        if (!this.suspendChange) {
            this.updateHeaderState();
        }
    }
});

Ext.util.Observable.prototype.fireEvent =
    Ext.Function.createInterceptor(Ext.util.Observable.prototype.fireEvent, function() {
        console.log(this.$className, arguments, this);
        return true;
});
*/

Ext.define('Ext.form.field.ux.CheckColumn', {
    extend: 'Ext.grid.column.CheckColumn',
    alias: 'widget.ux_checkcolumn',
    renderTpl: [
        '<div id="{id}-titleEl" data-ref="titleEl" {tipMarkup}class="', Ext.baseCSSPrefix, 'column-header-inner<tpl if="!$comp.isContainer"> ', Ext.baseCSSPrefix, 'leaf-column-header</tpl>',
        '<tpl if="empty"> ', Ext.baseCSSPrefix, 'column-header-inner-empty</tpl>">',

        '<span class="', Ext.baseCSSPrefix, 'column-header-text-container" >',
        '<span class="', Ext.baseCSSPrefix, 'column-header-text-wrapper">',
        '<span id="{id}-textEl" data-ref="textEl" class="', Ext.baseCSSPrefix, 'column-header-text',
        '{childElCls}">',
        '<img class="', Ext.baseCSSPrefix, 'grid-checkcolumn" style="float:left;" src="' + Ext.BLANK_IMAGE_URL + '"/>',
        '{text}',
        '</span>',
        '</span>',
        '</span>',
        '<tpl if="!menuDisabled">',
        '<div id="{id}-triggerEl" data-ref="triggerEl" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-trigger',
        '{childElCls}" style="{triggerStyle}"></div>',
        '</tpl>',
        '</div>',
        '{%this.renderContainer(out,values)%}'
    ],
    editor: {
        xtype: 'checkbox',
        cls: 'x-grid-checkheader-editor'
    },
    constructor : function(config) {
        var me = this;

        Ext.apply(config, {
            stopSelection: true,
            sortable: false,
            draggable: false,
            resizable: false,
            menuDisabled: true,
            hideable: false,
            tdCls: 'no-tip',
            defaultRenderer: me.defaultRenderer,
            checked: false
        });

        me.callParent([ config ]);

        me.on('headerclick', me.onHeaderClick);
        me.on('selectall', me.onSelectAll);
        me.on('checkchange', me.onCheckChange);
    },
    /** disabled 하게 할 정보는 각 jsp에서 구현 Example.v_list.jsp참고.. **/
    isDisabled : function(record) {
    	return false;
    },
    /** hidden 하게 할 정보는 각 jsp에서 구현 Example.v_list.jsp참고.. **/
    isHidden : function(record) {
    	return false;
    },
    onHeaderClick: function(headerCt, header, e, el) {
        var me = this,
            grid = headerCt.grid;


        if( !grid.getStore() || grid.getStore().getCount() <= 0 ) {
        	return;
        }

        if (!me.checked) {
        	me.fireEvent('selectall', grid.getStore(), header, true, grid);
            header.getEl().down('img').addCls(Ext.baseCSSPrefix + 'grid-checkcolumn-checked');
            me.checked = true;
        } else {
        	me.fireEvent('selectall', grid.getStore(), header, false, grid);
            header.getEl().down('img').removeCls(Ext.baseCSSPrefix + 'grid-checkcolumn-checked');
            me.checked = false;
        }
    },
    processEvent: function(type, view, cell, recordIndex, cellIndex, e, record, row) {
        var me = this,
            key = type === 'keydown' && e.getKey(),
            mousedown = type == 'mousedown';
        /*
        if( this.isDisabled(record) || this.isHidden(record) ) {
        	e.stopEvent();
     		return false;
        }

        if (!me.disabled && (mousedown || (key == e.ENTER || key == e.SPACE))) {
            var dataIndex = me.dataIndex,
                checked = dataIndex.endsWith("_YN") ? ((record.get(dataIndex) == 'Y' || record.get(dataIndex) == true) ? 'N' : 'Y') : !record.get(dataIndex),
                isChecked = dataIndex.endsWith("_YN") ? checked=='Y' : checked ;

            if (me.fireEvent('beforecheckchange', me, recordIndex, isChecked) !== false) {

                record.set(dataIndex, checked );

                // me.fireEvent('checkchange', me, recordIndex, isChecked);

                if (mousedown) {
                    e.stopEvent();
                }

                if (!me.stopSelection) {
                    view.selModel.selectByPosition({
                        row: recordIndex,
                        column: cellIndex
                    });
                }
                return false;
            } else {
                return !me.stopSelection;
            }
        } else {
            return false; // me.callParent(arguments);
        }
        */
    },
    onSelectAll: function(store, column, checked, grid) {
    	var me = this;
        var dataIndex = column.dataIndex, storeCnt = store.getCount(), record, v ;

        try {
        	var toolbars, progressBar, changedTextItem, girdPageTBId = this.pActionFlag +"_grid_bbar_"+this.gridId+"_gridPageTB";
        	try {
	        	// summary에서 checkbox있을 경우
	        	if( Ext.getCmp(grid.ownerCt.getId()).getXType() == 'panel') {
	        		toolbars = Ext.getCmp(Ext.getCmp(grid.getId()).getDockedComponent(girdPageTBId).getId());
	        		progressBar = toolbars.child('#progressBar'); // .getComponent('progressBar');
	        		changedTextItem = toolbars.child('#changedTextItem');
	        	}
	        	// 일반 grid
	        	else {
        			if( Ext.getCmp(grid.ownerCt.getId()).getDockedComponent('gridPageTB') == undefined ) {
	        			// toolbars = Ext.getCmp(grid.ownerCt.getId()).dockedItems.items[2];
        				toolbars =  Ext.getCmp(grid.ownerCt.getId()).getDockedComponent(girdPageTBId)
			        	progressBar = toolbars.child('#progressBar'); // .getComponent('progressBar');
		        		changedTextItem = toolbars.child('#changedTextItem');
        			} else {
    	        		toolbars = Ext.getCmp(Ext.getCmp(grid.ownerCt.getId()).getDockedComponent('gridPageTB').getId());
    		        	progressBar = toolbars.child('#progressBar'); // .getComponent('progressBar');
    	        		changedTextItem = toolbars.child('#changedTextItem');
        			}

	        	}
        	} catch(e) {
        		console.log(e)
        	}

        	if( progressBar ) {
	 	        progressBar.show( null, function() {progressBar.updateProgress(0, 'Initiated.', false, this); }, this );

		        progressBar.updateProgress(0, 'Changing.', false, this);
        	}

	        store.suspendEvents();

	        var changeArr = new Array(), page=20;
	        for( var i=0; i<=Math.ceil(storeCnt/page); i++) {
	        	if( storeCnt >= Math.min(((i+1)*page)-1, storeCnt) && i*page <= Math.min(((i+1)*page)-1, storeCnt) ) {
	        		changeArr[i] = [i*page, Math.min(((i+1)*page)-1, storeCnt-1), storeCnt ];
	        	}
	        }

	        var changeFn = function(changeArr, idx) {
	        	var idx = idx||0;
	        	var sIdx = changeArr[idx][0], eIdx = changeArr[idx][1], tIdx = changeArr[idx][2];
		        for(var i = sIdx; i <= eIdx  ; i++) {
		        	// disabled Value가 아닌 경우에만 변경..
		        	var record = store.getAt(i);

		        	if( !me.isDisabled(record) && !me.isHidden(record) ){
		            	if(dataIndex.endsWith("_YN")) {
        					store.getAt(i).set(dataIndex, checked ? "Y" : "N" );
        				} else {
        					store.getAt(i).set(dataIndex, checked );
        				}
		            }
		        }
		        if( progressBar ) {
		        	if( tIdx == i ) {
				        store.resumeEvents();
				        grid.getView().refresh();

		        		progressBar.updateProgress(1, 'It&#39s done.', false, this);

		        		if( store.getModifiedRecords().length==0 ) {
		            		changedTextItem.hide();
		            		toolbars.child('#changedTextItemSeperator').hide();
		        		} else if( toolbars ) {
		            		changedTextItem.show();
		            		toolbars.child('#changedTextItemSeperator').show();
		        		}
			        	changedTextItem.setText( Ext.String.format(toolbars.changedItems, store.getModifiedRecords().length) );
		        	} else {
		                var v = i/tIdx;
		                progressBar.updateProgress(v, Math.round(100*v) + '% changed.', false, this);

		        		if( store.getModifiedRecords().length==0 ) {
		            		changedTextItem.hide();
		            		toolbars.child('#changedTextItemSeperator').hide();
		        		} else if( toolbars ) {
		            		changedTextItem.show();
		            		toolbars.child('#changedTextItemSeperator').show();
		        		}
			        	changedTextItem.setText( Ext.String.format(toolbars.changedItems, store.getModifiedRecords().length) );
		        	}
		        }

		        if( changeArr.length > idx+1) {
		        	idx += 1;
		        	Ext.Function.defer(changeFn, 100, this, [changeArr, idx] );
		        }
	        }

	        changeFn(changeArr);

        } catch(e) {
        	console.log( e );

            store.suspendEvents();
	        // 실제 data변경
	        for(var i = 0; i < storeCnt  ; i++) {
	        	store.getAt(i).set(dataIndex, checked );  // ? 'Y' :'N'
	        	if( progressBar ) {
		        	if( i%20 == 19 ) {
		                v = i/storeCnt;
		                progressBar.updateProgress(v, Math.round(100*v) + '% changed', true, this);
		        	}
	        	}
	        }
	        store.resumeEvents();
	        grid.getView().refresh();
        }

	} ,
    renderer : function(value, meta, record){
        var cssPrefix = Ext.baseCSSPrefix,
        cls = [cssPrefix + 'grid-checkcolumn'];

        if( this.isDisabled(record) ) {
    		meta.tdCls += ' ' + this.disabledCls;
    	}

        if ( (typeof(value) == 'boolean' && value) || (typeof(value) == 'string' && value.toUpperCase() == 'Y') ) {
            cls.push(cssPrefix + 'grid-checkcolumn-checked');
        }

        if( this.isHidden(record) ) {
    		cls = [];
        }

    	return '<img class="' + cls.join(' ') + '" src="' + Ext.BLANK_IMAGE_URL + '"/>';


	}



});