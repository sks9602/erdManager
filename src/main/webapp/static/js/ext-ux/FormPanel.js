/**
 * Records에서 해당하는 index의 record를 조회
 * @param records
 * @param idx
 * @returns
 */
function getRecord(records, idx) {
	if(Ext.isArray(records)) {
		
		var ridx = idx||0;
		if( ridx < records.length ) {
			return records[ridx];
		} else {
			return null;
		}
	} else {
		return records;
	}
}

/**
 * Class that checks if user is idle.
 */
Ext.define('Utils.IdleTimer', {
    alias: 'utils.idle_timer',
    mixins: {
        observable: 'Ext.util.Observable'
    },

    config: {
        //the amount of time (ms) before the user is considered idle
        timeout: 30000
    },

    idle: false,           // indicates if the user is idle
    tId: -1,               // timeout ID
    enabled: false,        // indicates if the idle timer is enabled

    constructor: function(config){

        config = config || {};

        var me = this;
        me.addEvents(
            'start',
            'stop',
            'idle',
            'active'
        );

        me.mixins.observable.constructor.call(me);

        if (config.listeners) {
            me.on(config.listeners);
            delete config.listeners;
        }

        me.initConfig(config);
    },

    destroy: function(){
        this.clearListeners();
    },

    isRunning: function(){
        return this.enabled;
    },

    /**
     * Indicates if the user is idle or not.
     * @return {boolean} True if the user is idle, false if not.
     */
    isIdle: function(){
        return this.idle;
    },

    /**
     * Starts the idle timer. This adds appropriate event handlers
     * and starts the first timeout.
     * @param {int} timeout (Optional) A new value for the timeout period in ms.
     * @return {void}
     * @static
     */
    start: function(timeout){

        var me = this;

        me.enabled = true;
        me.idle = false;

        if (Ext.typeOf(timeout) == "number"){
            me.setTimeout(timeout);
        }

        //assign appropriate event handlers
        Ext.getDoc().on({
            mousemove: me.handleUserEvent,
            keydown: me.handleUserEvent,
            scope: me
        });

        //set a timeout to toggle state
        me.tId = Ext.Function.defer(me.toggleIdleState, me.getTimeout(), me);
    },

    /**
     * Stops the idle timer. This removes appropriate event handlers
     * and cancels any pending timeouts.
     * @return {void}
     */
    stop: function(){
        var me = this;

        me.enabled = false;
        clearTimeout(me.tId);

        //detach the event handlers
        Ext.getDoc().un({
            mousemove: me.handleUserEvent,
            keydown: me.handleUserEvent
        });
    },


    handleUserEvent: function(event){
        var me = this;

        clearTimeout(me.tId);

        if (me.enabled){

            if (me.idle) {

                // Bugfix: We have to skip several mousemove events because when we
                // show idle screen, somehouse mousemove event emitted.
                if (event.type == 'mousemove' && me.activeSwitchCounter < 5) {
                    me.activeSwitchCounter++;
                    return;
                }
                me.activeSwitchCounter = 0;

                me.toggleIdleState();
            }

            me.tId = Ext.Function.defer(me.toggleIdleState, me.getTimeout(), me);
        }
    },

    toggleIdleState: function(){
        this.idle = !this.idle;
        this.fireEvent(this.idle ? 'idle' : 'active');
    }
});

/*
var timer = Ext.create('Utils.IdleTimer', {
    timeout: 3000,
    listeners: {
        idle: function(){
            console.log('Application went into idle state');
        },
        active: function(){
            console.log('Application went into active state');
        }
    }
});

timer.start();
*/
Ext.override(Ext.form.action.Submit, {

    getParams: function(useModelValues) {
         console.log( "useModelValues", useModelValues );
       var falseVal = false,
            configParams = {}, // this.callParent(),
            fieldParams;
        // fieldParams = this.form.getValues(falseVal, falseVal, this.submitEmptyText !== falseVal, useModelValues, true);
        
        fieldParams =  this.form.getValues(false, false, true, undefined);
        // fieldParams =  this.form.getValues(falseVal, falseVal, this.submitEmptyText !== falseVal, true, true);
        
        //console.log( this.form.getValues(falseVal, falseVal, this.submitEmptyText !== falseVal, false, true) );
        //console.log( this.form.getValues(falseVal, falseVal, false, false, true) );
        //console.log( this.form.getValues(falseVal, falseVal, true, false, true) );
        //console.log( this.form.getValues(falseVal, falseVal, false, false, false) );
        
        return Ext.apply({}, fieldParams, configParams);
    },
});

Ext.override(Ext.form.BasicForm, {
    submitEmptyText : false,
	findInvalid: function() {
		var result = [], me = this;
		me.getFields().filterBy(function(field) {
			if( !field.validate() ) {
				field.el.frame('red', 1, 0.2).frame('red', 1, 0.2);
				result.push( field );
			}
        });
		return result;
	},
    loadRecord : function(record, ignoreObjectNames) {
    	var me = this;
    	
    	if( record == null || (record.get("totalCount") && record.get("totalCount") < 0 && record.get("message")) ) {
    		hoAlert('연결이 종료 되었습니다.', fs_goLoginPage );
    	}
    	return me.callParent(arguments);
    	
    	/*
    	if( ignoreObjectNames ) {
            this._record = record;
            return this.setValuesHasIgnore(record.getData(), ignoreObjectNames);   		
    	} else {
    		
    	}
    	*/
    },

    addExtraParams : function(extraParams) {
        var me = this;
        me.extraParams = extraParams||{};
    },
    
    getValues: function(asString, dirtyOnly, includeEmptyText, useDataValues, extraParams) {
        // false, false, true, true
        // console.log( asString, dirtyOnly, includeEmptyText, useDataValues );
        console.trace()
        var values  = {},
            fields  = this.getFields().items,
            f,
            fLen    = fields.length,
            isArray = Ext.isArray,
            field, data, val, bucket, name;
        
        for (f = 0; f < fLen; f++) {
            field = fields[f];
            // console.log( field, useDataValues&&!field.dateField ? 'getModelData' : 'getSubmitData' )
            if (!dirtyOnly || field.isDirty()) {  // DateField에서.. getSubmitValue()안되어서. 수정.. "&&!field.dateField" 추가됨..
                data = field[useDataValues&&!field.dateField ? 'getModelData' : 'getSubmitData'](includeEmptyText);
                console.log(field, data, Ext.isObject(data) );
                if (Ext.isObject(data)) {
                    for (name in data) {
                        console.log(name, field.xtype)
                                               
                        if (data.hasOwnProperty(name)) {
                            val = data[name];
                            console.log(name, val)
                            if (includeEmptyText && val === '') {
                                val = field.emptyText || '';
                            }
                            
                            if( field.xtype == 'checkbox') {
                                /*
                                values[name] = val;
                                
                                if( !values[name] ) {
                                    console.log(name, val);
                                    values[name] = val;
                                } else {
                                    bucket = values[name];
                                    
                                    if (!isArray(bucket)) {
                                        bucket = values[name] = [bucket];
                                    }
                                    
                                    bucket.push(val);
                                    if (isArray(val)) {
                                        values[name] = bucket.concat(val);
                                    } else {
                                        bucket.push(val);
                                    }
                                    
                                    values[name] = bucket;
                                    console.log(name, bucket);
                                }
                                */
                                 continue;
                            } 
                            

                            if (values.hasOwnProperty(name)) {
                               
                                bucket = values[name];
                                console.log( bucket, isArray(bucket) )
                                if (!isArray(bucket)) {
                                    bucket = values[name] = [bucket];
                                }
                                bucket.push(val);
                                
                                if (isArray(val)) {
                                    values[name] = bucket.concat(val);
                                } else {
                                    bucket.push(val);
                                }
                                

                            } else {
                                values[name] = val;
                            }
                           values[name] = val;
                           console.log( val)
                           /*
                           if( values[name] == null || values[name] == undefined) {
                               values[name] = val;
                           } else {
                               
                               if (!isArray(values[name])) {
                                   bucket = [values[name]];
                               } else {
                                   bucket = values[name];
                               }
                               console.log( bucket );
                               bucket.push(val);
                               values[name] = bucket;
                           }
                           */
                        }
                    }
                } else {
                	try {
                        if( !values[field.name] ) {
	                	  values[field.name] = field.getValue()[field.name];
	                	}
	                	console.log( values[field.name] );
                	} catch(e) {
                		console.log(e)
                	}
                }
            }
        }

        if (asString) {
            values = Ext.Object.toQueryString(values);
        }
        
       console.log(values)
       console.log(extraParams||{});
       console.log(Ext.apply(values, extraParams||{}));
        
        return Ext.apply(values, extraParams||{});
    },
    /*
    doAction: function(action, options) {
        if (Ext.isString(action)) {
            action = Ext.ClassManager.instantiateByAlias('formaction.' + action, Ext.apply({}, options, {form: this}));
        }
        if (this.fireEvent('beforeaction', this, action) !== false) {
            this.beforeAction(action);
            
            Ext.defer(action.run, 100, action);

        }
        return this;
    },     


    beforeAction: function(action) {
        var me = this,
            waitMsg = action.waitMsg,
            maskCls = Ext.baseCSSPrefix + 'mask-loading',
            fields  = me.getFields().items,
            f,
            fLen    = fields.length,
            field, waitMsgTarget;
        
        for (f = 0; f < fLen; f++) {
            field = fields[f];
            
            if( (action.p_action_flag || action.P_ACTION_FLAG) && (field.name == 'p_action_flag' || field.name == 'P_ACTION_FLAG' ) ) {
            	me.origin_p_action_flag = field.getValue();
            	me.origin_field = field;
            	field.setValue(action.p_action_flag);
            }

            if (field.isFormField && field.syncValue) {
                field.syncValue();
            }
        }

        if (waitMsg) {
            waitMsgTarget = me.waitMsgTarget;
            if (waitMsgTarget === true) {
                me.owner.el.mask(waitMsg, maskCls);
            } else if (waitMsgTarget) {
                waitMsgTarget = me.waitMsgTarget = Ext.get(waitMsgTarget);
                waitMsgTarget.mask(waitMsg, maskCls);
            } else {
                me.floatingAncestor = me.owner.up('[floating]');

                if (me.floatingAncestor) {
                    me.savePreventFocusOnActivate = me.floatingAncestor.preventFocusOnActivate;
                    me.floatingAncestor.preventFocusOnActivate = true;
                }
                Ext.MessageBox.wait(waitMsg, action.waitTitle || me.waitTitle);
            }
        }
    },
    */
    afterAction: function(action, success) {
        var me = this;
        if (action.waitMsg) {
            var messageBox = Ext.MessageBox,
                waitMsgTarget = me.waitMsgTarget;
            if (waitMsgTarget === true) {
                me.owner.el.unmask();
            } else if (waitMsgTarget) {
                waitMsgTarget.unmask();
            } else {
                messageBox.hide();
            }
        }
        
        if( this.origin_field && this.origin_p_action_flag ) {
            this.origin_field.setValue(this.origin_p_action_flag);
            this.origin_field = null;
            this.origin_p_action_flag = null;
            
        }
       
        if (me.floatingAncestor) {
            me.floatingAncestor.preventFocusOnActivate = me.savePreventFocusOnActivate;
        }
        if (success) {
            if (action.reset) {
                me.reset();
            }
            Ext.callback(action.success, action.scope || action, [me, action]);
            me.fireEvent('actioncomplete', me, action);
        } else {
            Ext.callback(action.failure, action.scope || action, [me, action]);
            me.fireEvent('actionfailed', me, action);
        }
    },
    /*
    submit: function(options) {
        var me = this,
            action;
        options = options || {};
        if (options.standardSubmit || me.standardSubmit) {
            action = 'standardsubmit';
        } else {
            action = me.api ? 'directsubmit' : 'submit';
        }
        return me.doAction(action, options);
    },
    doAction: function(action, options) {
        var me = this;
        if (Ext.isString(action)) {
            action = Ext.ClassManager.instantiateByAlias('formaction.' + action, Ext.apply({}, options, {
                form: me
            }));
        }
        if (me.fireEvent('beforeaction', me, action) !== false) {
            me.beforeAction(action);
            me.actionTimer = Ext.defer(action.run, 100, action);
        }
        return me;
    },
    beforeAction: function(action) {
        var me = this,
            waitMsg = action.waitMsg,
            maskCls = Ext.baseCSSPrefix + 'mask-loading',
            fields = me.getFields().items,
            f,
            fLen = fields.length,
            field, waitMsgTarget;
        // Call HtmlEditor's syncValue before actions
        for (f = 0; f < fLen; f++) {
            field = fields[f];
            if (field.isFormField && field.syncValue) {
                field.syncValue();
            }
        }
        if (waitMsg) {
            waitMsgTarget = me.waitMsgTarget;
            if (waitMsgTarget === true) {
                me.owner.el.mask(waitMsg, maskCls);
            } else if (waitMsgTarget) {
                waitMsgTarget = me.waitMsgTarget = Ext.get(waitMsgTarget);
                waitMsgTarget.mask(waitMsg, maskCls);
            } else {
                me.floatingAncestor = me.owner.up('[floating]');
                // https://sencha.jira.com/browse/EXTJSIV-6397
                // When the "wait" MessageBox is hidden, the ZIndexManager activates the previous
                // topmost floating item which would be any Window housing this form.
                // That kicks off a delayed focus call on that Window.
                // So if any form post submit processing displayed a MessageBox, that gets
                // stomped on.
                // The solution is to not move focus at all during this process.
                if (me.floatingAncestor) {
                    me.savePreventFocusOnActivate = me.floatingAncestor.preventFocusOnActivate;
                    me.floatingAncestor.preventFocusOnActivate = true;
                }
                Ext.MessageBox.wait(waitMsg, action.waitTitle || me.waitTitle);
            }
        }
    },
    */
    /*,
    updateRecord: function(record) {
        record = record || this._record;
        if (!record) {
            return this;
        }
        
        var fields = record.fields.items,
            values = this.getFieldValues(),
            obj = {},
            i = 0,
            len = fields.length,
            name;

        for (; i < len; ++i) {
            name  = fields[i].name;

            if (values.hasOwnProperty(name)) {
                obj[name] = values[name];
            }
        }

        record.beginEdit();
        record.set(obj);
        record.endEdit();

        return this;
    },
	getFieldValues : function(dirtyOnly){
		var o = {}, n, key, val;
		this.getFields().each(function(f) {
			if (dirtyOnly !== true || f.isDirty()) {
				n = f.getName();
				key = o[n];
				val = f.getValue();
				if(Ext.isDefined(key)){
					if(Ext.isArray(key)){
						o[n].push(val);
					}else{
						var _val = o[n];
						o[n] = [];
						o[n].push(_val);
						o[n].push(val);
                       // o[n] = [key, val];
					}
				}else{
					o[n] = val;
				}
			}
		});
		return o;
	}*/
});

/**
 * Form Panel 전송시 Form에 포함된 Grid의 정보 까지 포함하여 submit
 */
Ext.define('Ext.ux.FormPanel', {
    alias: 'widget.formPanel_ux',
    extend: 'Ext.form.Panel',
    autoSubmit : false,
    autoSubmitInterval : 2000,
    submitEmptyText  : false,
    /*
    listeners : {
    	collapse : function(p, e) {
    		p.getDockedComponent( p.id + '_buttonToolbar' ).setVisible(true);
    	}
    },
    */
    constructor: function(config) {
    	this.callParent(arguments);
    },
    initComponent: function() {
    	var me = this;
    	me.callParent();
    },
    setValuesHasIgnore: function(values, ignoreObjectNames) {
        var me = this,
            v, vLen, val, field;

        function setVal(fieldId, val) {
            var field = me.findField(fieldId);
            if (field) {
                field.setValue(val);
                if (me.trackResetOnLoad) {
                    field.resetOriginalValue();
                }
            }
        }

        Ext.suspendLayouts();
        
        if (Ext.isArray(values)) {
            
            vLen = values.length;

            for (v = 0; v < vLen; v++) {
                val = values[v];

                setVal(val.id, val.value);
            }
        } else {
            
            Ext.iterate(values, setVal);
        }
        Ext.resumeLayouts(true);
        return this;
    },
    getField : function(name) {
    	var me = this, field = null;
    	
    	if( name && me.query('[id*='+name+']') ) {
    		field = me.query('[id*='+name+']')[0];
    	}
    	return field;
    },
    getFields : function(name) {
    	var me = this, fields = null;
    	
    	if( name && me.query('[id*='+name+']') ) {
    		fields = me.query('[id*='+name+']');
    	}
    	return fields;
    },
    getFieldValue : function(name) {
    	var me = this, field = null;
    	
    	if( name && me.query('[id*='+name+']') ) {
    		field = me.query('[id*='+name+']')[0];
    	}
    	return field.getValue();
    },
    setFieldChangeStatus : function( field ) {
    	var me = this;
    	if( me.autoSubmit ) {
	    	if( this.timerId ) {
	    		clearInterval( this.timerId );
	    	}
	    	this.timerId = setTimeout(function(){
	    		if( me.down('toolbar').down('#id_auto_save_msg') ) {
	    			var saveMsg = me.down('toolbar').down('#id_auto_save_msg');
	        		saveMsg.setText('# Saving draft...');
	        		
	        		Ext.defer(function(){
						saveMsg.setText('Draft auto-saved at ' + Ext.Date.format(new Date(), 'g:i:s A'));
			        }, 2000);
	    		}
	    		
	    		me.submit({ isForceSave : true })
	    		
	    		clearInterval( me.timerId );
	    		
	        }, this.autoSubmitInterval );
    	}
    },
    submit: function(options) {
    	
    	var me = this, 
    		isForceSave = options&&options['isForceSave'],   // 오류와 상관없이 강제소 SUBMIT
    		msgTxt = options&&options['msgConfirm'], 
    		errorsNote = options&&options['errorsNote'] 
    		extraParams = options&&options['extraParams'];
    	
    	// options.waitMsg = '저장 중입니다. ';
    	
    	// Form을 강제로 저장하는 경우
    	if( isForceSave ) {
            if( me.isValid() ) {
    	    	var grid, store, records, params = {}, totalCnt = 0, idx=0, pActionFlag = '';
    	    	
    	    	// Grid 찾기
    	    	for( var i=0; i < me.query('grid').length ; i++ ) {
    	    		grid = me.query('grid')[i];
    	    		store = grid.getStore();
    
    	    		if( grid.submitModified ) {
    	    			records = store.getModifiedRecords();
    	    		} else {
    	    			records = store.getRange(0, store.getCount( ) );
    	    		}
    	    		
    	    		if( !records || records.length == 0 ) {
    	    			continue;
    	    		}
    	    		/*
    	    		var keys = [];
    
    	    		for(var key =0; key< records[0].fields.length; key++){
    	    			keys.push(records[0].fields.get(key)['name'] );
    	    		}
    	    		for(var k=0;k < keys.length;k++){
    	    			params[keys[k]] = params[keys[k]]||[];
    	    			for(var j=0;j < records.length;j++){
    	    				params[keys[k]].push(records[j].get(keys[k]));
    	    			}
    	    		}  
    	    		*/
    	    		var jsonData="{\"data\" : [";
    	    		jsonData += Ext.JSON.encode(records[0].data);
    	    		for(var cnt=1;cnt<records.length;cnt++){
    	    			var record = records[cnt];
    	    			jsonData += ',' + Ext.JSON.encode(record.data);
    	    		}
    	    		jsonData = jsonData.substring(0,jsonData.length) + "]}";
    	    		
    	    		me.child('#'+grid.hiddenName).setValue(jsonData);
    	    	} 
    	    	/*
    	    	pActionFlag =  me.query('[id*=P_ACTION_FLAG]')[0].getValue();
    	    	if( options && options['p_action_flag'] && me.query('[id*=P_ACTION_FLAG]') ) {
    	    		me.query('[id*=P_ACTION_FLAG]')[0].setValue(options['p_action_flag']);
    	    	}
    	    	*/
    			me.form.submit(Ext.applyIf(options||{},{	    				
        			success : function(form, action) {
        				if( options&&options['uxNotification'] ) {
    	    				Ext.create('widget.uxNotification', { 
    	    					title: '알림',
    	    					position: 'br',
    	    					manager: options['manager'],
    	    					iconCls: 'ux-notification-icon-information', 
    	    					autoCloseDelay: 3000,
    	    					spacing: 20,
    	    					html: '저장 되었습니다.'
    	    				}).show(); 
        				}
        				if( option && option['onSuccess'] ) {
        					Ext.Function.defer( option['onSuccess'], 0 );
        				}
        				
        				// me.query('[id*=P_ACTION_FLAG]')[0].setValue(pActionFlag);
    					// Ext.Msg.alert('Success', getResultMessageForm(form, action)); // action.result.message);
    				},
    				failure: function(form, action) {
    					// me.query('[id*=P_ACTION_FLAG]')[0].setValue(pActionFlag);
    					// Ext.Msg.alert('Failure', getResultMessageForm(form, action)); // action.result.message);
    				}, 
    				clientValidation : false
    				// , params : params
    				}) ); //, headers: {'Content-Type': 'application/json'}
                } else {
                    if(errorsNote) {
                        for( var x in errorsNote ) {
                            fs_Frame(errorsNote[x].id , errorsNote[x].color);
                            
                            if( errorsNote[x].msg ) {
                                if( errorsNote[x].time ) {
                                    hoAlert( errorsNote[x].msg, errorsNote[x].fn, errorsNote[x].time );
                                } else {
                                    hoAlert( errorsNote[x].msg, errorsNote[x].fn);
                                }
                                
                            }
                        }
                    }
                    me.getForm().findInvalid();
                }
    	} 
    	// Form을 강제로 저장하지 않는 경우
    	else {
	    	if( me.isValid() ) {

		    	hoConfirm( msgTxt||'저장하시겠습니까?' , function(btn, text, opt) { 
		    		if( btn == 'yes' ) {
		    			var mBox = Ext.MessageBox;
		    			
		    	    	var grid, store, records, params = {}, totalCnt = 0, idx=0, pActionFlag = '';;
                                                
		    	    	// params = me.getForm().getFieldValues(false);
	    	    	    
		    	    	// Grid 찾기
		    	    	for( var i=0; i < me.query('grid').length ; i++ ) {
		    	    		grid = me.query('grid')[i];
		    	    		store = grid.getStore();
		
		    	    		if( grid.submitModified ) {
		    	    			records = store.getModifiedRecords();
		    	    		} else {
		    	    			records = store.getRange(0, store.getCount( ) );
		    	    		}
		    	    		
		    	    		if( !records || records.length == 0 ) {
		    	    			continue;
		    	    		}
		    	    		/*
		    	    		var keys = [];
		
		    	    		for(var key =0; key< records[0].fields.length; key++){
		    	    			keys.push(records[0].fields.get(key)['name'] );
		    	    		}
		    	    		for(var k=0;k < keys.length;k++){
		    	    			params[keys[k]] = params[keys[k]]||[];
		    	    			for(var j=0;j < records.length;j++){
		    	    				params[keys[k]].push(records[j].get(keys[k]));
		    	    			}
		    	    		}  
		    	    		*/
		    	    		
		    	    		var jsonData="{\"data\" : [";
		    	    		jsonData += Ext.JSON.encode(records[0].data);
		    	    		for(var cnt=1;cnt<records.length;cnt++){
		    	    			var record = records[cnt];
		    	    			jsonData += ',' + Ext.JSON.encode(record.data);
		    	    		}
		    	    		jsonData = jsonData.substring(0,jsonData.length) + "]}";
		    	    		
		    	    		me.child('#'+grid.hiddenName).setValue(jsonData);
		    	    	}   
		    	    	/*
		    	    	var toggle;
		    	    	
		    	    	for( var i=0; i < me.query('toggleslide').length ; i++ ) {
		    	    		toggle = me.query('toggleslide')[i];
		    	    		params[toggle.getName()].push(toggle.getValue());
		    	    	}
		    	    	*/
		    	    	/*
		    	    	pActionFlag =  me.query('[id*=P_ACTION_FLAG]')[0].getValue();
		    	    	if( options && options['p_action_flag'] && me.query('[id*=P_ACTION_FLAG]') ) {
		    	    		me.query('[id*=P_ACTION_FLAG]')[0].setValue(options['p_action_flag']);
		    	    	}
		    	    	*/
		        		options.waitMsg = '저장 중입니다. ';	
		        		// console.log(me.form.submit)
                        me.form.submit(Ext.applyIf(options||{},{	
		    				// waitMsg: 'Saving...',
			    			success : function(form, action) {
				    			// me.query('[id*=P_ACTION_FLAG]')[0].setValue(pActionFlag);
		    					Ext.Msg.alert('Success', getResultMessageForm(form, action)); // action.result.message);
		    				},
		    				failure: function(form, action) {
				    			// me.query('[id*=P_ACTION_FLAG]')[0].setValue(pActionFlag);
		    					Ext.Msg.alert('Failure', getResultMessageForm(form, action)); // action.result.message);
		    				}
		    				// , params : params
		    				}) 
		    			); //, headers: {'Content-Type': 'application/json'}
                        
                        if( me.form.hasUpload() ) {
		    	    		mBox.show({
		    	    		    title: 'Please wait',
		    	    		    msg: 'File Uploading...',
		    	    		    progressText: 'Initializing...',
		    	    		    width:300,
		    	    		    progress:true,
		    	    		    closable:false
		    	    		});
		    	    		
		    	    		var runner = new Ext.util.TaskRunner(),
		    	    		task = runner.newTask({
		    	    		     run: function () {
		    	    		    		Ext.Ajax.request({
		    	    		        		url: '/s/system/file.do?p_action_flag=r_up_progress',
		    	    		        		method: 'POST',
		    	    		        		success : function(response,options){
		    	    		        			var percentage =  Ext.decode(response.responseText).percentage ;
		    	    		        			
		    	    		        			mBox.updateProgress(percentage/100, percentage+'% completed');
		    	    		        			
		    	    		        			// 완료시
		    	    		        			if( percentage >= 100 ) {
		    	    		        				try {
		    	    		        					task.stop();
		    	    		        					task.destroy();
		    	    		        				} catch(e) {
		    	    		        					alert('task.destroy' +e);
		    	    		        				}
		    	    		        				
		    	    		        				// 메시시 박스 사라지게..
		    	    		        				Ext.Function.defer(function() {
		    	    		        					
		    	    		        					Ext.MessageBox.hide();
		    	    		        					
		    	    		        					Ext.Ajax.request({
		    	    		        						url: '/s/system/file.do?p_action_flag=r_up_progress&destroy=true',
		    	    		        						method: 'POST'
		    	    		        					});
		    	    		        					
		    	    		        				}, 1000);
		    	    		        				
		    	    		        			} 
		    	    		        			//오류 발생시
		    	    		        			else if( percentage < 0 ) {
		    	    		        				try {
		    	    		        					task.stop();
		    	    		        					task.destroy();
		    	    		        				} catch(e) {
		    	    		        					alert('task.destroy' +e);
		    	    		        				}
		    	    		        				var msg = 'Canceled.';
		    	    		        				if( percentage != -1 ) {
		    	    		        					msg = 'Error.';
		    	    		        				}
		    	    		        				mBox.updateProgress(0, msg );
		    	    		        				// 메시시 박스 사라지게..
		    	    		        				Ext.Function.defer(function() {
		    	    		        					
		    	    		        					Ext.MessageBox.hide();
		    	    		        					
		    	    		        					Ext.Ajax.request({
		    	    		        						url: '/s/system/file.do?p_action_flag=r_up_progress&destroy=true',
		    	    		        						method: 'POST'
		    	    		        					});
		    	    		        					
		    	    		        				}, 1000);	
		    	    		        			}
		    	    		        		},
		    	    		        		failure: function(){
		    	    		        			
		    	    		        		},
		    	    		        		scope: this
		    	    		        	});
	
		    	    		     },
		    	    		     interval: 1000
		    	    		 });
	
		    	    		task.start();
		    	    		
			    			setTimeout(function(){
			    				try {
			    					mBox.hide();
			    				} catch(e) {
			    					
			    				}
			    				
			    	        }, 10000);
			    	        
		    	    	} 
		    	    	/* options.waitMsg = '저장 중입니다. ';	로 대체..
		    	    	 else { // --> waitMsg: 'Saving...',
			    			mBox.show({
				 		           msg: 'Saving your data, please wait...',
				 		           progressText: 'Saving...',
				 		           width:300,
				 		           wait:true,
				 		           waitConfig: {interval:200},
				 		           icon:'ext-mb-download', 
				 		           iconHeight: 50
				    			});
			    			
			    			setTimeout(function(){
			    				mBox.hide();
			    	        }, 3000);
		    	    		
		    	    	} 
		    	    	*/
	
		    		}
		    	}, me); // , me.getId()
	    	} else {
	    		if(errorsNote) {
	    			for( var x in errorsNote ) {
	    				fs_Frame(errorsNote[x].id , errorsNote[x].color);
	    				
	    				if( errorsNote[x].msg ) {
	    					if( errorsNote[x].time ) {
	    						hoAlert( errorsNote[x].msg, errorsNote[x].fn, errorsNote[x].time );
	    					} else {
	    						hoAlert( errorsNote[x].msg, errorsNote[x].fn);
	    					}
	    					
	    				}
	    			}
	    		}
	    		me.getForm().findInvalid();
	    	}
    	}
    }
});

function submitFormGrid(formId, gridId, url, gridRecordType, successFn, failureFn) {
    var gridData = Ext.getCmp(gridId).getParamData(gridRecordType);
    
    var formData = Ext.getCmp(formId).getValues(false, false, true, undefined);
    
    var params = Ext.applyIf(formData, gridData);

    if( Ext.getCmp(formId).isValid() ) {
        hoConfirm( '저장하시겠습니까?' , function(btn, text, opt) { 
            if( btn == 'yes' ) {
                // 서버로 데이터 전송
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: params ,
                    success: function (response) {
                        successFn();
                    },
                    failure: function (response) {
                        failureFn();
                    }
                });
            }
        });
    } else {
        /*
        if(errorsNote) {
            for( var x in errorsNote ) {
                fs_Frame(errorsNote[x].id , errorsNote[x].color);
                
                if( errorsNote[x].msg ) {
                    if( errorsNote[x].time ) {
                        hoAlert( errorsNote[x].msg, errorsNote[x].fn, errorsNote[x].time );
                    } else {
                        hoAlert( errorsNote[x].msg, errorsNote[x].fn);
                    }
                    
                }
            }
        }
        */
        Ext.getCmp(formId).getForm().findInvalid();
    }
    
}

