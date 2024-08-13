
Ext.override(Ext.form.Field, {
    constructor: function(config) {
        if( !config.afterLabelTextTpl && config.comments ) {
            config.afterLabelTextTpl =  Ext.create('Ext.XTemplate', Ext.String.format(G_HELP_TIP_TPL , '{id}-help', config.commentsTitle||'', config.comments ));
        }
        this.callParent(arguments);
    },
    afterRender: function() {
        var me = this;
        me.callParent();

        var labelEl = Ext.get(me.getId()+'-labelEl');

        if( labelEl ) {
            labelEl.on('contextmenu', function( e, t, eOpts){
                e.stopEvent();

                onItemContextMenu(e, t, eOpts, me) // t -> Ext.get(me.getId()+'-help')

                return false;
            });
        }

        if( me.qtip ) {
            Ext.create('Ext.tip.ToolTip', {
                target: me.getEl(),
                html: me.qtip
            });
        }
    },
    /**
     * allowBlank속성 변경.
     */
    setAllowBlank : function(value) {
        Ext.apply(this, {allowBlank: value});
    },
    /**
     * allowBlank속성 변경.
     */
    setBlankText : function(value) {
        Ext.apply(this, {blankText: value});
    }
});


/**
 * 암호화 하여 submit

Ext.override(Ext.form.field.Text, {
    key : 'MyFramework_AES_Key',
    iv : 'MyFramework_AES_IV',
    getSubmitData: function() {
        var me = this,
        data = null,
        val, encVal ;
        if (!me.disabled && me.submitValue && !me.isFileUpload()) {
            val = me.getSubmitValue();
            if (val !== null) {
                data = {};
                switch(me.encryptType) {
                    case 'sha256' :
                        encVal = CryptoJS.SHA256(val).toString();
                        break;
                    case 'aes' :
                        encVal = CryptoJS.AES.encrypt(val, , me.key||'TODO-PASSWORD-KEY' , { iv : me.iv||'TODO-PASSWORD-IV' }).toString();
                        break;
                    default :
                        encVal = val;
                        break;
                }
                data[me.getName()] = encVal ;
            }
        }
        return data;
    }
});
*/

/**
 *
 * input type="password" submit value암호화
 *
 */

Ext.define('Ext.form.field.ux.Password', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.password_ux',
    encryptType : 'sha256',
    inputType : 'password',
     msgTarget  : 'side',
    labelSeparator : '',
    width : 320,
    labelWidth : 100,
    key : 'MyFramework_AES_Key',
    iv : 'MyFramework_AES_IV',
    initComponent: function () {

        var me = this;

        me.callParent(arguments);
    },
    getSubmitData: function() {
        var me = this,
        data = null,
        val, encVal ;
        if (!me.disabled && me.submitValue && !me.isFileUpload()) {
            val = me.getSubmitValue();
            if (val !== null && val != '') {
                data = {};
                switch(me.encryptType) {
                    case 'sha256' :
                        encVal = CryptoJS.SHA256(val).toString();
                        break;
                    case 'aes' :
                        encVal = CryptoJS.AES.encrypt(val, me.key||'TODO-PASSWORD-KEY' , { iv : me.iv||'TODO-PASSWORD-IV' } ).toString();
                        break;
                    default :
                        encVal = CryptoJS.SHA256(val).toString();
                        break;
                }
                data[me.getName()] = encVal ;
            }
        }
        return data;
    }


});


Ext.define('Ext.form.field.ux.TextFieldUx', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.textfield_ux',
    padding : '0 0 1 0',
    border : 0,
    labelSeparator : '',
    msgTarget  : 'side',
    labelWidth : 100,
    width      : 300,
    /*
    key : 'MyFramework_AES_Key',
    iv : 'MyFramework_AES_IV',

    cls: 'my-field', // <-- 앞뒤 감싸기 추가용..
    beforeBodyEl: '<span class="my-field-prefix">$</span>', //  <-- 앞뒤 감싸기 추가용..
    afterBodyEl: '<span class="my-field-suffix">.00</span>', //  <-- 앞뒤 감싸기 추가용..
    
    fieldSubTpl: [
         '<div data-ref="triggerWrap" class="x-form-trigger-wrap x-form-trigger-wrap-default">', //  <-- 앞뒤 감싸기 추가용..
              '<input id="{id}" type="{type}" {inputAttrTpl}',
              ' size="1"',
              '<tpl if="name"> name="{name}"</tpl>',
              '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
              '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
              '{%if (values.maxLength !== undefined){%} maxlength="{maxLength}"{%}%}',
              '<tpl if="readOnly"> readonly="readonly"</tpl>',
              '<tpl if="disabled"> disabled="disabled"</tpl>',
              '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
              '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
              ' class="{fieldCls} {typeCls} {editableCls} {inputCls}" autocomplete="off"/>',
         '</div>', //  <-- 앞뒤 감싸기 추가용..
        //  ,
          {
              disableFormats: true
          }
      ],
    */
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    },
    
    setReadOnly: function(readOnly) {
        var me = this,
            inputEl = me.inputEl;
        if (inputEl) {

            inputEl.dom.disabled = !!readOnly || me.disabled;
            if( readOnly ) {
                inputEl.addCls('x-form-text-ux-readonly');
            } else {
                inputEl.removeCls('x-form-text-ux-readonly');
            }
        }
        me.callParent(arguments);
    },
    /*
    getSubTplData: function() {
        var me = this,
            value = me.getRawValue(),
            isEmpty = me.emptyText && value.length < 1,
            maxLength = me.maxLength,
            placeholder;




        if (me.enforceMaxLength) {
            if (maxLength === Number.MAX_VALUE) {
                maxLength = undefined;
            }
        } else {
            maxLength = undefined;
        }

        if (isEmpty) {
            if (Ext.supports.Placeholder) {
                placeholder = me.emptyText;
            } else {
                value = me.emptyText;
                me.valueContainsPlaceholder = true;
            }
        }

        return Ext.apply(me.callParent(), {
            maxLength   : maxLength,
            readOnly    : me.readOnly,
            placeholder : placeholder,
            value       : value,
            fieldCls    : me.fieldCls + ((isEmpty && (placeholder || value)) ? ' ' + me.emptyCls : '') + (me.allowBlank ? '' :  ' ' + me.requiredCls)
        });
    },
    */
    getSubmitData: function() {
        var me = this,
        data = null,
        val, encVal ;
        if (!me.disabled && me.submitValue && !me.isFileUpload()) {
            val = me.getSubmitValue();
            if (val !== null) {
                data = {};
                switch(me.encryptType) {
                    case 'sha256' :
                        encVal = CryptoJS.SHA256(val).toString();
                        break;
                    case 'aes' :
                        encVal = CryptoJS.AES.encrypt(val, me.key||'TODO-PASSWORD-KEY' , { iv : me.iv||'TODO-PASSWORD-IV' }).toString();
                        break;
                    default :
                        encVal = val;
                        break;
                }
                data[me.getName()] = encVal ;
            }
        }
        return data;
    }
});

/**
 * NumberField에 단위 포함....
 *
 * - 단위를 포함하기 위해서 아래의 속성 추가
 * unit <- required
 * unitStyle
 */
Ext.define('Ext.form.field.ux.NumberFieldUx', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.numberfield_ux',
    border : 0,
    labelSeparator : '',
    msgTarget  : 'side',
    labelWidth : 100,
    width      : 320,
    baseChars : '0123456789,.',
    currencySymbol: null,
    useThousandSeparator: false,
    thousandSeparator: ',',
    alwaysDisplayDecimals: false,
    fieldCls : 'x-form-num-field-align-right' ,
    trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',

    unit : undefined, // 항목의 단위
    unitStyle : undefined,    // 항목의 단위표현을 위한 css
    triggerTpl : '<td style="{triggerStyle}" class="{triggerCls}">' +
                    '<div class="' + Ext.baseCSSPrefix + 'trigger-index-0 ' + Ext.baseCSSPrefix + 'form-trigger ' + Ext.baseCSSPrefix + 'form-spinner-up {spinnerUpCls} {childElCls}" role="button"></div>' +
                    '<div class="' + Ext.baseCSSPrefix + 'trigger-index-1 ' + Ext.baseCSSPrefix + 'form-trigger ' + Ext.baseCSSPrefix + 'form-spinner-down {spinnerDownCls} {childElCls}" role="button"></div>' +
                '</td>' +
                '<tpl if="unit">'+
                    '<td>&nbsp;'+ // style="{unitStyle}"
                        '{unit}'+
                    '</td>'+
                '</tpl>'+
                '</tr>',
    constructor: function(config) {
        if( config.minValue != null &&  config.minValue != undefined ) {
            config.oriMinValue = config.minValue;
        }
        if( config.maxValue != null &&  config.maxValue != undefined ) {
            config.oriMaxValue = config.maxValue;
        }

        this.callParent(arguments);
    } ,
    initComponent: function() {
        var me = this;

        this.thousandSeparator = ',' ;
        this.decimalSeparator = '.' ;
        /*
        if (this.useThousandSeparator && this.decimalSeparator == ',' && this.thousandSeparator == ',') {
            this.thousandSeparator = '.';
        } else {
            if (this.allowDecimals && this.thousandSeparator == '.' && this.decimalSeparator == '.') {
                this.decimalSeparator = ',';
            }
        }
        */

        me.callParent(arguments);
    },
    getValue : function(){
        var a=this,
        b=a.rawToValue(a.processRawValue(a.getRawValue()));
        a.value=b;
        return b;

    },
    fixPrecision : function(value) {
        var me = this,
            nan = isNaN(value),
            precision = me.decimalPrecision;

        if (nan || !value) {
            return nan ? '' : value;
        } else if (!me.allowDecimals || precision <= 0) {
            precision = 0;
        }
        return parseFloat(Ext.Number.toFixed(parseFloat(value), precision));
        //return Ext.Number.toFixed(parseFloat(value), precision);
    },
    getTriggerData: function(){
        var me = this,
            hideTrigger = (me.readOnly || me.hideTrigger);

        return {
            triggerCls: Ext.baseCSSPrefix + 'trigger-cell',
            triggerStyle: hideTrigger ? 'display:none' : '',
            spinnerUpCls: !me.spinUpEnabled ? me.trigger1Cls + '-disabled': '',
            spinnerDownCls: !me.spinDownEnabled ? me.trigger2Cls + '-disabled': '',
            unit : me.unit||'',
            unitStyle : me.unit ? me.unitStyle||'width:15px;' : 'display:none;'
        };
    },

    beforeBlur : function() {
        var me = this;
        me.callParent();
        me.setMinMaxValue();

    },
    setMinMaxValue : function() {
        var me = this;

        if( this.edId ) {
            var edObj = Ext.getCmp(this.edId);
            if( edObj ) {
                if( me.getOriMaxValue()  != null) {
                    me.setMaxValue(Math.min(me.getOriMaxValue(), edObj.getValue() == null ? me.getOriMaxValue() : edObj.getValue() ) ) ;
                }
                if( edObj.getOriMinValue() != null ) {
                    edObj.setMinValue(Math.max(edObj.getOriMinValue(), me.getValue() == null ? edObj.getOriMinValue() : me.getValue() ) );
                }
                edObj.validate();
            }
        }
        if( this.stId ) {
            var stObj = Ext.getCmp(this.stId);
            if( stObj ) {
                if( stObj.getOriMaxValue() != null ) {
                    stObj.setMaxValue(Math.min(stObj.getOriMaxValue(), me.getValue() == null ? stObj.getOriMaxValue() : me.getValue() ));
                }
                if( me.getOriMinValue()  != null ) {
                    me.setMinValue(Math.max(me.getOriMinValue(), stObj.getValue() == null ? me.getOriMinValue() : stObj.getValue() ) ) ;
                }
                stObj.validate();
            }

        }
    },
    valueToRaw: function(value) {

        var me = this, decimalSeparator = me.decimalSeparator;
        value = me.parseValue(value);
        value = me.fixPrecision(value);
        value = Ext.isNumber(value) ? value : parseFloat(String(value).replace(decimalSeparator, '.'));
        if (isNaN(value)) {
            value = '';
        } else {
            value = me.forcePrecision ? value.toFixed(me.decimalPrecision) : parseFloat(value);
            value = String(value).replace(".", decimalSeparator);
        }
        return value;
    },
    getOriMinValue : function() {
        return (this.oriMinValue !=null && this.oriMinValue!=undefined )  ? this.oriMinValue : null;
    },
    getOriMaxValue : function() {
        return (this.oriMaxValue !=null && this.oriMaxValue!=undefined )  ? this.oriMaxValue : null;
    },
    setValue: function(value){
        Ext.form.field.ux.NumberFieldUx.superclass.setValue.call(this, value != null ? value.toString().replace('.', this.decimalSeparator) : value);

        this.setRawValue(this.getFormattedValue(this.getValue()));
    },
    getFormattedValue: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat()) {
            var neg = null;

            value = (neg = value < 0) ? value * -1 : value;

            value = value ? value.toString() : '';

            var ps = value.split('.');
            ps[1] = ps[1] ? ps[1] : null;

            var whole = ps[0];

            if( this.decimalPrecision  ) {
                value = whole + (ps[1] ? this.decimalSeparator + ps[1].rpad('0', this.decimalPrecision) : this.decimalSeparator + ''.rpad('0', this.decimalPrecision));
            } else {
                value = whole + (ps[1] ? this.decimalSeparator + ps[1] : '');
            }
            return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''), (Ext.isEmpty(this.currencySymbol) ? '' : this.currencySymbol + ' '), value);
        } else {
            var neg = null;

            value = (neg = value < 0) ? value * -1 : value;
            value = this.allowDecimals && this.alwaysDisplayDecimals ? value.toFixed(this.decimalPrecision) : value;

            if (this.useThousandSeparator)  {
                if (this.useThousandSeparator && Ext.isEmpty(this.thousandSeparator)) {
                    throw ('NumberFormatException: invalid thousandSeparator, property must has a valid character.');
                }
                if (this.thousandSeparator == this.decimalSeparator) {
                    throw ('NumberFormatException: invalid thousandSeparator, thousand separator must be different from decimalSeparator.');
                }

                value = value ? value.toString() : '';

                var ps = value.split('.');
                ps[1] = ps[1] ? ps[1] : null;

                var whole = ps[0];

                var r = /(\d+)(\d{3})/;

                var ts = this.thousandSeparator;

                while (r.test(whole)) {
                    whole = whole.replace(r, '$1' + ts + '$2');
                }

                if( this.decimalPrecision  ) {
                    value = whole + (ps[1] ? this.decimalSeparator + ps[1].rpad('0', this.decimalPrecision) : this.decimalSeparator + ''.rpad('0', this.decimalPrecision));
                } else {
                    value = whole + (ps[1] ? this.decimalSeparator + ps[1] : '');
                }
            }

            return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''), (Ext.isEmpty(this.currencySymbol) ? '' : this.currencySymbol + ' '), value);
        }
    },
    /**
     * overrides parseValue to remove the format applied by this class
     */
    parseValue: function(value){
        //Replace the currency symbol and thousand separator
        return Ext.form.field.ux.NumberFieldUx.superclass.parseValue.call(this, this.removeFormat(value));
    },
    /**
     * Remove only the format added by this class to let the superclass validate with it's rules.
     * @param {Object} value
     */
    removeFormat: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat()) {
            return value;
        } else {
            value = value.toString().replace(this.currencySymbol + ' ', '');

            value = this.useThousandSeparator ? value.replace(new RegExp('[' + this.thousandSeparator + ']', 'g'), '') : value;

            return value;
        }
    },
    /**
     * Remove the format before validating the the value.
     * @param {Number} value
     
    getErrors: function(value){
        return Ext.form.field.ux.NumberFieldUx.superclass.getErrors.call(this, this.removeFormat(value));
    },
    */
    hasFormat: function(){
        return this.decimalSeparator != '.' || (this.useThousandSeparator == true && this.getRawValue() != null) || !Ext.isEmpty(this.currencySymbol) || this.alwaysDisplayDecimals;
    },
    /**
     * Display the numeric value with the fixed decimal precision and without the format using the setRawValue, don't need to do a setValue because we don't want a double
     * formatting and process of the value because beforeBlur perform a getRawValue and then a setValue.
     */
    onFocus: function(){
        this.setRawValue(this.removeFormat(this.getRawValue()));

        this.callParent(arguments);
    }
});

/**
 * Checkbox tooltip추가..
 */
Ext.define('Ext.form.field.Checkbox', {
    override : 'Ext.form.field.Checkbox',
    qtip : null,
    /*
    getValue: function () {
        return this.checked ? this.getSubmitValue() : '';
    },
    */
    listeners: {
        render: function(c) {
            if( c.qtip ) {
                Ext.create('Ext.tip.ToolTip', {
                    target: c.getEl(),
                    html: c.qtip
                });
            }
        }
    }
});

Ext.override(Ext.form.field.Checkbox, {
    setValue: function(checked) {
        var me = this;
        /*
        if( me.name.indexOf("_ALL")>=0) {
            return false;
        } else {
            return me.callParent(arguments);
        }
        */
        return me.callParent(arguments);
    }
});


/**
 * comments Tooltip을 위해.. Ext.form.CheckboxGroupg확장
 *
 * - Comments Tooltip을 위해 아래의 속성 추가
 * commentsTitle
 * comments <- required
 */
Ext.define('Ext.form.field.ux.CheckboxUx', {
    extend: 'Ext.form.Checkbox' ,
    alias: 'widget.checkbox_ux' ,

    border : 0,
    labelSeparator : '',
    columns: 'auto', msgTarget  : 'side', //'auto'
    labelWidth : 100,
    
    constructor: function(config) {
        this.callParent(arguments);
    },
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.initField();
    },
});

Ext.define('Ext.form.field.ux.CheckboxGroupUx', {
    extend: 'Ext.form.CheckboxGroup' ,
    alias: 'widget.checkboxgroup_ux' ,
    border : 0,
    labelSeparator : '',
    columns: 'auto', msgTarget  : 'side', //'auto'
    labelWidth : 100,
    cbAllValObj : {},
    cbChkedValObj : {},
    cbChkedArr : new Array,
    constructor: function(config) {
        if( !config.afterLabelTextTpl && config.comments ) {
            config.afterLabelTextTpl =  Ext.create('Ext.XTemplate', Ext.String.format(G_HELP_TIP_TPL , '{id}-help', config.commentsTitle||'', config.comments ));
        }

        this.listeners = Ext.applyIf(config.listeners||{}, {
            // 도움말 Comments에 기능 추가..
            afterrender: function(_this){
                if(_this.child('#all')){
                    _this.child('#all').on('change', function(_thisCb, newValue, oldValue, eOpts) {
                        var boxes = _this.getBoxes('[name='+_this.name+']');


                        var values = new Array();
                        for(var x in boxes ) {
                            values.push(boxes[x].inputValue);
                        }
                        _this.cbAllValObj[_this.name] = values;
                        var valNoneObj = new Object;
                        valNoneObj[_this.name] = [];

                        if( newValue) {
                            if( newValue == 'on' ) {
                                _this.setValue(_this.cbAllValObj, true);
                            }
                        } else {
                            _this.setValue(valNoneObj);
                        }

                        for(var x in boxes ) {
                            boxes[x].setDisabled((newValue || newValue=='on'));
                        }
                    }, this );
                }
                /* 전체 선택 관련 - 아래의 모든 checkbox가 선택되면 전체가 선택되게..
                if(_this.child('#all')){
                    var boxes = _this.getBoxes('[name='+_this.name+']');
                    var values = new Array();
                    for(var x in boxes ) {
                        values.push(boxes[x].inputValue);
                    }
                    _this.cbAllValObj[_this.name] = values;
                    var valNoneObj = new Object;
                    valNoneObj[_this.name] = [];
                    try {
                        _this.child('#all').on('change', function(_thisCb, newValue, oldValue, eOpts) {

                            if( newValue) {
                                if( newValue == 'on' ) {
                                    _this.setValue(_this.cbAllValObj);
                                }
                            } else {
                                _this.setValue(valNoneObj);
                            }
                        }, this );
                    } catch(e) {
                    }

                    for(var x in boxes ) {
                        boxes[x].on('change', function(_thisCb, newValue, oldValue, eOpts) {
                            if( newValue ) {
                                _this.cbChkedArr[newValue] = true;
                            }
                            if( oldValue ) {
                                _this.cbChkedArr[oldValue] = false;
                            }
                            _this.checkChecked();
                        });
                    }
                }
                */
            }
        });

        this.callParent(arguments);
    },
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.initField();
    },
    afterRender: function() {
        var me = this;
        me.callParent();

        var labelEl = Ext.get(me.getId()+'-labelEl');

        if( labelEl ) {
            labelEl.on('contextmenu', function( e, t, eOpts){
                e.stopEvent();
                onItemContextMenu(e, t, eOpts, me); // Ext.get(me.getId()+'-help')

                return false;
            });
        }

        if( me.qtip ) {
            Ext.create('Ext.tip.ToolTip', {
                target: me.getEl(),
                html: me.qtip
            });
        }
    },
    /*
    checkChecked : function() {
        var valObj = new Object, valArr = new Array;

        for( var x in this.cbChkedArr ) {
            if( this.cbChkedArr[x]) {
                valArr.push(x);
            }
        }
        this.child('#all').setValue( this.cbAllValObj[this.name].length == valArr.length);
        valObj[this.name] = valArr;

        this.setValue(valObj);
    },
    */
    setValue: function(value, isAllChecked) {

        var me    = this,
            boxes = me.getBoxes('[name='+this.name+']'),
            ba = me.getBoxes('[name='+this.name+'_ALL]'),
            b,
            bLen  = boxes.length,
            box, name,
            cbValue;

        if( ba && ba[0] && isAllChecked !== true ) {
            ba[0].setValue(false);
        }
        me.batchChanges(function() {
            for (b = 0; b < bLen; b++) {

                box = boxes[b];
                name = box.getName();
                cbValue = false;

                if (value && value.hasOwnProperty(name)) {
                    if (Ext.isArray(value[name])) {
                        cbValue = Ext.Array.contains(value[name], box.inputValue);
                    } else {
                        cbValue = value[name];
                    }
                } else if( typeof(value) == 'string') {
                    cbValue = ( value == box.inputValue )
                } else if(Ext.isArray(value)) {
                    cbValue = Ext.Array.contains(value, box.inputValue)
                }

                box.setValue(cbValue);
            }
        });
        return me;
    },
    getChecked: function() {
        return this.getBoxes('[name='+this.name+'][checked]');
    },
});

/**
 * comments Tooltip을 위해.. Ext.form.RadioGroup 확장
 *
 * - Comments Tooltip을 위해 아래의 속성 추가
 * commentsTitle
 * comments <- required
 */
Ext.define('Ext.form.field.ux.RadioGroupUx', {
    extend: 'Ext.form.RadioGroup' ,
    alias: 'widget.radiogroup_ux' ,
    border : 0,
    labelSeparator : '',
    columns: 'auto', msgTarget  : 'side',
    labelWidth : 100,
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    },
    afterRender: function() {
        var me = this;
        me.callParent();

        var labelEl = Ext.get(me.getId()+'-labelEl');

        if( labelEl ) {
            labelEl.on('contextmenu', function( e, t, eOpts){
                e.stopEvent();

                onItemContextMenu(e, t, eOpts, me); // Ext.get(me.getId()+'-help')

                return false;
            });
        }

        if( me.qtip ) {
            Ext.create('Ext.tip.ToolTip', {
                target: me.getEl(),
                html: me.qtip
            });
        }
    }
});

/** TextArea 한글 글자수 계산  추가**/
Ext.define('Ext.form.field.ux.TextAreaUx', {
    extend: 'Ext.form.field.TextArea' ,
    alias: 'widget.textarea_ux' ,
    labelWidth : 100,
    labelSeparator : '',
    width : 625,
    msgTarget: 'side' ,
    // height : 100, minHeight : 100, maxHeight : 300, <-- grow 때문에 주석처리
    grow    : true,
    growMin : 100,
    growMax : 300,
    // enforceMaxLength: true,
    enableKeyEvents: true,
    maxLength : 4000,
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    },
    pasteCheck: function(){
        var me = this,
            value = me.getValue(),
            max = me.maxLength;

        if (me.getLength() > max) {
            value = value.substr(0, max) // cut(max); //substr(0, max);
            me.setValue(value);
        }
    },

    fireKey: function(e) {
        var me = this,
            key = e.getKey(),
            value;

        if (e.isSpecialKey() && (me.enterIsSpecial || (key !== e.ENTER || e.hasModifier()))) {
            me.fireEvent('specialkey', me, e);
        }

        if (me.needsMaxCheck && key !== e.BACKSPACE && key !== e.DELETE && !e.isNavKeyPress() && !me.isCutCopyPasteSelectAll(e, key)) {
            value = me.getValue();

            if (me.getLength() >  me.maxLength) { // value.length
                e.stopEvent();

                value = value.cut(me.maxLength);
                me.setValue(value);
            }
        }
    },
    getLength : function() {
        var me=this, cnt = 0, message=me.getValue();

        for (var i = 0; i < message.length; i++) {
            if (message.charCodeAt(i) > 127) {
                cnt += 3; // utf-8 : 3, etc : 2
            } else {
                cnt++;
            }
        }
        return cnt;
    }

});

/**
 * Display
 */
Ext.define('Ext.form.field.ux.DisplayUx', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.displayfield_ux',
    border : 0,
    labelWidth : 100,
    width      : 320,
    labelSeparator : '',
    msgTarget: 'side' ,
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }

});

/**
 * Display
 */
Ext.define('Ext.form.field.ux.TextAreaUx', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.textarea_ux',
    border : 0,
    labelWidth : 100,
    width      : 320,
    labelSeparator : '',
    msgTarget: 'side' ,
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }

});


/**
 * File
 */
Ext.define('Ext.form.field.ux.FileUx', {
    extend: 'Ext.form.field.File',
    alias: 'widget.filefield_ux',
    labelWidth : 100,
    border : 0,
    labelSeparator : '',
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }

});


/**
 * File
 */
Ext.define('Ext.form.field.ux.LabelUx', {
    extend: 'Ext.form.Label', // 'Ext.form.field.Base',
    alias: 'widget.label_ux',
    border : 0,
    // cls:'grid_label',
    width : 120,
    labelSeparator : '',
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }

});

Ext.define('Ext.form.field.ux.ComboBoxUX', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.comboajax_ux',
    trigger2Cls : 'x-form-clear-trigger',
    queryMode     : 'remote',
    triggerAction : 'all',
    forceSelection: true,
    valueField    : 'TNAME', // 'TABLE_NAME' , // 'VALUE'  @ TODO
    displayField  : 'TNAME', // ,'TNAME', // 'NAME'  @ TODO
    labelSeparator: '',
    // editable      : false,
    width         : 320,
    labelWidth : 100,
    columns    : 'auto',
    msgTarget  : 'side',
    autoShow: true,
    queryCaching : false,
    prefixCmp : null, // ID선택을 위한 prefix (구성 : "id_cmp_"+p_action_flag +"_" + form_name + "_")
    dependCmpNames : null, // 이 컴포넌트가 참고해야하는 component의 id
    cascadeCmpNames : null, // 이 컴포넌트의 영향을 받는 component의 id
    storeParams : {},
    queryParam : 'FIND_NM',
    constructor: function(config) {

        var params = {  p_action_flag : 'r_list_data' };

        Ext.apply(params, { code : config.code } );

        // 파라미터 생성
        if( config.prefixCmp && config.dependCmpNames ) {
            var dependsCmps = config.dependCmpNames.split(','), dependCmpId;

            var dependParams = new Object();

            for( var i=0; i<dependsCmps.length; i++) {
                dependCmpId = config.prefixCmp + dependsCmps[i];
                if( Ext.getCmp(dependCmpId) ) {
                    dependParams[dependsCmps[i]] = Ext.getCmp(dependCmpId).getValue();
                }
            }
            Ext.apply(params, dependParams );
        }
        Ext.apply(this.storeParams, params);

        this.store = Ext.create('Ext.data.JsonStore', {
            pageSize: config.pageSize ? config.pageSize : null ,
            autoLoad : true,
            remoteSort:    true,
            fields:    ['NAME', 'VALUE', 'TABLE_NAME', 'TNAME', 'GROUP', 'COMPANY_CD', 'CODE', 'CODE_NM', 'UP_CD', 'USEDEF1', 'USEDEF2', 'USEDEF3', 'USEDEF4', 'USEDEF5'], //  @ TODO 'table_name','tname', 삭제
            proxy: {type: 'ajax',
                    url : G_CONTEXT_PATH+'/example/example.do', /// @ TODO url변경..
                    extraParams : params, // ,
                    reader: {
                                type: 'json',
                                totalProperty: 'totalCount',
                                root: 'datas'
                            }
                    }
        })

        this.listeners = Ext.applyIf(config.listeners||{}, {
            beforequery: function(_this){
                // 파라미터 생성
                if( this.prefixCmp && this.dependCmpNames ) {
                    var dependsCmps = this.dependCmpNames.split(','), dependCmpId;

                    for( var i=0; i<dependsCmps.length; i++) {
                        dependCmpId = this.prefixCmp + dependsCmps[i];
                        if( Ext.getCmp(dependCmpId) ) {
                            this.store.proxy.setExtraParam ( dependsCmps[i] , Ext.getCmp(dependCmpId).getValue() );
                        }
                    }
                }

            },
            change : function (_this, newValue, oldValue, eOpts) {
                // 연관 Component초기화
                if( this.prefixCmp && this.cascadeCmpNames ) {
                    var cascadeCmps = this.cascadeCmpNames.split(','), cascadeCmpId;

                    for( var i=0; i<cascadeCmps.length; i++) {
                        cascadeCmpId = this.prefixCmp + cascadeCmps[i];
                        if( Ext.getCmp(cascadeCmpId) ) {
                            Ext.getCmp(cascadeCmpId).setValue("");
                            Ext.getCmp(cascadeCmpId).store.clearFilter();
                        }
                    }
                }
            }
        });
        this.callParent(arguments);
    },
    onTrigger2Click: function(event) {
        var me = this;
        me.collapse();
        me.clearValue();
        me.inputEl.focus();
    },
    getParams: function(queryString) {
        var params = {},
            param = this.queryParam;

        if (param) {
            var qs = queryString.split(",");
            params[param] = [];
            for( var x in qs ) {
                // params[param] = queryString;
                params[param].push(qs[x].trim());
            }
        }
        return params;
    },
    findRecord : function(field, value) {
        var ds = this.store, params = {}, idx = ds.find(field, value);
        if ( !this.initialRecordFound && this.queryMode === 'remote' && value != '') { // idx === -1 &&
            this.initialRecordFound = true;
            this.store.on({
                load : {
                    fn : Ext.Function.bind(function(value) {
                        if (this.forceSelection) {
                            if (value == '') {
                                idx = ds.find(field, value); // 처음 선택시 선택 안될대.. 처리.
                                return idx !== -1 ? ds.getAt(idx) : false; // 처음 선택시 선택 안될대.. 처리.
                            }
                            this.setValue(value);
                        }
                        this.store.removeAll();
                    }, this, [ value ]),
                    single : true
                }
            });

            params[this.queryParam] = value;
            Ext.apply(params, this.storeParams);
            ds.load({
                params : params
            });
        }
        idx = ds.find(field, value);
        return idx !== -1 ? ds.getAt(idx) : false;
    }

});

/**
 * Ext.slider에서 tip항상나오게 하는 plugin
 */
Ext.define('Ext.slider.AlwaysVisibleTipUX', {
    extend: 'Ext.slider.Tip',
    init: function(slider) {
        var me = this;
        me.callParent(arguments);
        slider.removeListener('dragend', me.hide, me);;
        slider.on({
            scope: me,
            change: me.onSlide,
            afterrender: function() {
                setTimeout(function() {
                    me.onSlide(slider, null, slider.thumbs[0]);
                }, 100);
            }
        });
    }
});

/*
Ext.override(Ext.slider.Tip, {

    init: function(slider) {
        var me = this,
            align,
            offsets;
        if (!me.position) {
            me.position = slider.vertical ? me.defaultVerticalPosition : me.defaultHorizontalPosition;
        }

        switch (me.position) {
            case 'top':
                offsets = [0, -10];
                align = 'b-t?';
                break;
            case 'bottom':
                offsets = [0, 10];
                align = 't-b?';
                break;
            case 'left':
                offsets = [-10, 0];
                align = 'r-l?';
                break;
            case 'right':
                offsets = [10, 0];
                align = 'l-r?';
        }

        if (!me.align) {
            me.align = align;
        }

        if (!me.offsets) {
            me.offsets = offsets;
        }

        slider.on({
            scope    : me,
            dragstart: me.onSlide,
            drag     : me.onSlide,
      //      dragend  : me.hide,
            destroy  : me.destroy
        });
    },

});
*/

Ext.override(Ext.slider.Multi, {
    constructor: function(config) {
        if( !config.afterLabelTextTpl && config.comments ) {
            config.afterLabelTextTpl =  Ext.create('Ext.XTemplate', Ext.String.format(G_HELP_TIP_TPL , '{id}-help', config.commentsTitle||'', config.comments ));
        }
        this.callParent(arguments);
    }/*,
    afterRender: function() {
        var me = this;
        me.callParent();

        var labelEl = Ext.get(me.getId()+'-labelEl');

        if( labelEl ) {
            labelEl.on('contextmenu', function( e, t, eOpts){
                e.stopEvent();

                onItemContextMenu(e, Ext.get(me.getId()+'-help'), eOpts, me)

                return false;
            });
        }

        if( me.qtip ) {
            Ext.create('Ext.tip.ToolTip', {
                target: me.getEl(),
                html: me.qtip
            });
        }
    }
    */
});

/**
 * Single Slider (상세에서 주로 사용)..
 *
 */
Ext.define('Ext.form.field.ux.SingleSliderUx', {
    extend: 'Ext.slider.Single',
    alias: 'widget.singleSlider_ux',
    border : 0,
    labelSeparator : '',
    msgTarget  : 'side',
    labelWidth : 100,
    width : 320,
    // plugins: [Ext.create('Ext.slider.AlwaysVisibleTipUX')],
    constructor: function(config) {
        if( !config.afterLabelTextTpl && config.comments ) {
            config.afterLabelTextTpl =  Ext.create('Ext.XTemplate', Ext.String.format(G_HELP_TIP_TPL , '{id}-help', config.commentsTitle||'', config.comments ));
        }

        this.callParent(arguments);
    },
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }
});

/**
 * Multi Slider (검색에서 주로 사용)...
 *
 */
Ext.define('Ext.form.field.ux.MultiSliderUx', {
    extend: 'Ext.slider.Multi',
    alias: 'widget.multiSlider_ux',
    border : 0,
    labelSeparator : '',
    msgTarget  : 'side',
    labelWidth : 100,
    width : 320,
    isFormField : true,
    // plugins: [Ext.create('Ext.slider.AlwaysVisibleTipUX')],
    fieldSubTpl: [
        //'<table style="width:100%"><tr><td>[<span id="{id}-start-value">1</span>]</td>',
        //'<td style="width:100%">',
        '<div id="{id}" class="' + Ext.baseCSSPrefix + 'slider {fieldCls} {vertical}',
        '{childElCls}',
        '" aria-valuemin="{minValue}" aria-valuemax="{maxValue}" aria-valuenow="{value}" aria-valuetext="{value}">',
            '<div id="{cmpId}-endEl" class="' + Ext.baseCSSPrefix + 'slider-end" role="presentation">',
                '<div id="{cmpId}-innerEl" class="' + Ext.baseCSSPrefix + 'slider-inner" role="presentation">',
                    '{%this.renderThumbs(out, values)%}',
                '</div>',
            '</div>',
        '</div>',
        //'</td>',
        //'<td>[<span id="{id}-end-value">2</span>]</td></tr></table>',
        {
            renderThumbs: function(out, values) {
                var me = values.$comp,
                    i = 0,
                    thumbs = me.thumbs,
                    len = thumbs.length,
                    thumb,
                    thumbConfig;

                for (; i < len; i++) {
                    thumb = thumbs[i];
                    thumbConfig = thumb.getElConfig();
                    thumbConfig.id = me.id + '-thumb-' + i;
                    Ext.DomHelper.generateMarkup(thumbConfig, out);
                }
            },
            renderThumbsBefore: function(out, values) {
                var me = values.$comp,
                    i = 0,
                    thumbs = me.thumbs,
                    len = thumbs.length,
                    thumb,
                    thumbConfig;


                    thumb = thumbs[0];
                    thumbConfig = thumb.getElConfig();
                    thumbConfig.id = me.id + '-thumb-before';
                    Ext.DomHelper.generateMarkup(thumbConfig, out);

            },
            renderThumbsAfter: function(out, values) {
                var me = values.$comp,
                    i = 0,
                    thumbs = me.thumbs,
                    len = thumbs.length,
                    thumb,
                    thumbConfig;

                    thumb = thumbs[0];
                    thumbConfig = thumb.getElConfig();
                    thumbConfig.id = me.id + '-thumb-after';
                    Ext.DomHelper.generateMarkup(thumbConfig, out);
            },
            disableFormats: true
        }
    ],
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }
    /*
    ,
    listeners:{
        afterrender: function(t, options) {
            for(i=0; i<t.thumbs.length; i++){
                //Ext.get(t.id+'-inputEl-'+(i==0? 'start' :'end')+'-value').update(t.thumbs[i].value==0 ? 0 : t.thumbs[i].value);

                var thumbElId = t.thumbs[i].el.id;
                Ext.DomHelper.overwrite(thumbElId, {
                    tag: 'span',
                    id: 'thumb-label-'+i,
                    cls: 'thumb-label',
                    html: t.thumbs[i].value,
                });

            }
        },
        change: function(t, options) {
            for(i=0; i<t.thumbs.length; i++){
                //Ext.get(t.id+'-inputEl-'+(i==0? 'start' :'end')+'-value').update(t.thumbs[i].value==0 ? 0 : t.thumbs[i].value);

                   var thumbElId = t.thumbs[i].el.id;
                Ext.DomHelper.overwrite(thumbElId, {
                    tag: 'div',
                    id: 'thumb-label-'+i,
                    cls: 'thumb-label',
                    html: t.thumbs[i].value,
                });

            }
         }
    }
    */
});


/**
 * Popup Trigger
 */
Ext.define('Ext.form.field.ux.PopupTrigger', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.popuptrigger_ux',
    triggerCls : 'x-form-search-trigger'
});

/**
 * 년월일 + 년월일 형태의 component생성..
 */
Ext.define('Ext.form.field.ux.PeriodDate', {
    alias: 'widget.perioddate_ux',
    extend: 'Ext.form.field.Date',
    trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    trigger3Cls: Ext.baseCSSPrefix + 'form-combo-trigger',
    altFormats : "Y/m/d|m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|Ymd|n-j|n/j",
    submitFormat: 'Y-m-d H:i:s', // 참고Y-m-d H:i:s
    labelWidth : 100,
    format : 'Y/m/d',
    submitValue : true,
    dateField : true,
    labelSeparator : '',
    divideBy : {
            w:604800000, // week
            d:86400000, // day
            h:3600000, // hour
            m:60000,  // minute
            s:1000   // second
    },
    initComponent : function(){
        var me = this;

        me.callParent();

    },
    afterRender: function(){
        this.callParent();
        // 'X' 콤보 안보이게..
        if( !this.allowBlank ) {
            this.triggerCell.item(1).setDisplayed(false);
        }
        // this.triggerCell.item(2);
        /* trigger에 menu달기.. 실패..
        try {
            this.menu = Ext.create('Ext.menu.Menu', {
                width: 120,
                floating: false,
                renderTo : this.triggerEl.elements[2].id,
                items: [{
                    text: '종료일 1주 전'
                }]});
        } catch(e) {
            alert(e);
        }
        */
    },

    initValue: function() {
        var me = this,
            value = me.value;

        if( value == 'year') {
            if( this.edDtId ) {
                me.value = Ext.Date.parse(Ext.Date.format(new Date(), 'Y') + '0101', 'Ymd');
            } else if( this.stDtId ) {
                me.value = Ext.Date.parse(Ext.Date.format(new Date(), 'Y') + '1231', 'Ymd');
            }
        } else if( value == 'month') {
            if( this.edDtId ) {
                var stDt = Ext.Date.getFirstDateOfMonth(new Date());
                me.value = stDt;
            } else if( this.stDtId ) {
                var edDt = Ext.Date.getLastDateOfMonth(new Date());
                me.value = edDt;
            }
        } else if( value == 'week') {
            var start = new Date(), offset = start.getDay() ;
            var viewStart = Ext.Date.add(start, Ext.Date.DAY, -1*offset);

            if( this.edDtId ) {
                me.value = viewStart;
            } else if( this.stDtId ) {
                var viewEnd = Ext.Date.add(viewStart, Ext.Date.DAY, 6);
                me.value = viewEnd;
            }
        } else if( value == 'today') {
            if( this.edDtId ) {
                me.value = new Date();
            } else if( this.stDtId ) {
                me.value = new Date();
            } else {
                me.value = new Date();
            }
        } else if( value ) {
            var values = this.value.replace(/ /, '').split(",");
            var val,gap,patt = new RegExp('[\\+\\-]?(\\d[ymw].*$|\\d)', 'i');
            var yPat = new RegExp('[\\+\\-]?\\dy.*$', 'i')
                ,mPat = new RegExp('[\\+\\-]?\\dm.*$', 'i')
                ,wPat = new RegExp('[\\+\\-]?\\dw.*$', 'i');

            if( this.edDtId && values[0] && Ext.isString(values[0]) ) {
                if( patt.test(values[0]) ) {
                    if( yPat.test( values[0] ) ) {
                        val = Ext.Date.parse(Ext.Date.format(new Date(), 'Y') + '0101', 'Ymd');
                        gap = values[0].replace(/y.*$/i, '');
                        me.value = Ext.Date.add(val, Ext.Date.YEAR, gap);
                    } else if( mPat.test( values[0] ) ) {
                        val = Ext.Date.getFirstDateOfMonth(new Date());
                        gap = values[0].replace(/m.*$/i, '');
                        me.value = Ext.Date.add(val, Ext.Date.MONTH, gap);
                    } else if( wPat.test( values[0] ) ) {
                        var start = new Date(), offset = start.getDay() ;
                        val = Ext.Date.add(start, Ext.Date.DAY, -1*offset);
                        gap = values[0].replace(/w.*$/i, '');
                        me.value = Ext.Date.add(val, Ext.Date.DAY, gap*7);
                    } else {
                        me.value = Ext.Date.add(new Date(), Ext.Date.DAY, values[0]);
                    }
                } else {
                    me.value = me.rawToValue(values[0]);
                }
            } else if( this.stDtId && values[1] && Ext.isString(values[1]) ) {
                if( patt.test(values[1]) ) {
                    if( yPat.test( values[1] ) ) {
                        val = Ext.Date.parse(Ext.Date.format(new Date(), 'Y') + '1231', 'Ymd');
                        gap = values[1].replace(/y.*$/i, '');
                        me.value = Ext.Date.add(val, Ext.Date.YEAR, gap);
                    } else if( mPat.test( values[1]) ) {
                        val = Ext.Date.getLastDateOfMonth(new Date());
                        gap = values[1].replace(/m.*$/i, '');
                        me.value = Ext.Date.add(val, Ext.Date.MONTH, gap);
                    } else if( wPat.test( values[1]) ) {
                        var start = new Date(), offset = start.getDay() ;
                        val = Ext.Date.add(Ext.Date.add(start, Ext.Date.DAY, -1*offset), Ext.Date.DAY,6);
                        gap = values[1].replace(/w.*$/i, '');
                        me.value = Ext.Date.add(val, Ext.Date.DAY, gap*7);
                    } else {
                        me.value = Ext.Date.add(new Date(), Ext.Date.DAY, values[1]);
                    }
                } else {
                    me.value = me.rawToValue(values[1]);
                }
            } else {
                me.value = me.rawToValue(values[0]);
            }
        }

        me.callParent();
    },
    onTrigger2Click: function(event) {
        var me = this;
        me.collapse();
        me.setValue(null);
        me.setMinMaxValue();
        me.focus(false, 60);
        /*
        if( this.edDtId ) {
            var edDtObj = Ext.getCmp(this.edDtId);
            edDtObj.triggerCell.item(2).setDisplayed(false);
        } else if( this.stDtId ) {
            var stDtObj = Ext.getCmp(this.stDtId);
            stDtObj.triggerCell.item(2).setDisplayed(false);
        }
        */
    },
    onTrigger3Click: function(_this, event) {
        var me = this, menu;
        me.inputEl.focus();
        var trigger3El =  me.triggerEl.elements[2];
        if( this.edDtId ) {
            var edDtObj = Ext.getCmp(this.edDtId);
            try {
            menu = me.menuSt = me.menuSt||Ext.create('Ext.menu.Menu', {
                    width: 150,
                    items: [
                {
                    text: '종료일  5일 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.DAY, -5);
                        }
                    }
                },{
                    text: '종료일  30일 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.DAY, -30);
                        }
                    }
                },'-',{
                    text: '종료일 1주 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.DAY, -7);
                        }
                    }
                },{
                    text: '종료일 2주 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.DAY, -14);
                        }
                    }
                },'-',{
                    text: '종료일 1개월 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.MONTH, -1);
                        }
                    }
                },{
                    text: '종료일 3개월 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.MONTH, -3);
                        }
                    }
                },{
                    text: '종료일 6개월 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.MONTH, -6);
                        }
                    }
                },'-',{
                    text: '종료일 1년 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.YEAR, -1);
                        }
                    }
                },{
                    text: '종료일 2년 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.YEAR, -2);
                        }
                    }
                },{
                    text: '종료일 3년 전',
                    handler : function() {
                        if( edDtObj ) {
                            me.add(edDtObj.getValue(), Ext.Date.YEAR, -3);
                        }
                    }
                },'-',{
                    text: '시작일 ~ 종료일 차이',
                    handler : function() {
                        if( edDtObj ) {
                            var endDt = edDtObj.isValid() ? edDtObj.getValue()  : null ;
                            var sttDt = me.isValid()  ? me.getValue()  : null ;

                            if( endDt && sttDt ) {
                                var diff = endDt - sttDt ;

                                hoAlert( Ext.Date.format(sttDt,'Y/m/d' ) + '~' +  Ext.Date.format( endDt ,'Y/m/d') +' 차이는  <br/>[' + ((diff / me.divideBy.d )+1) + ']일 입니다.', Ext.exptyFn, 5000);
                            } else {
                                hoAlert( '시작일 / 종료일을 모두 입력하세요.', Ext.exptyFn, 5000);
                            }
                        }
                    }
                }]});
            } catch(e) {}
        } else {
            var stDtObj = Ext.getCmp(this.stDtId);
            try {
            menu = me.menuEd = me.menuEd||Ext.create('Ext.menu.Menu', {
                width: 150,
                items: [
                    {
                        text: '시작일  5일 후',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.DAY, 5);
                        }
                    },{
                        text: '시작일  30일 후',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.DAY, 30);
                        }
                    },'-',{
                        text: '시작일 1주 후',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.DAY, 7);
                        }
                    },{
                        text: '시작일 2주 후',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.DAY, 14);
                        }
                    },'-',{
                        text: '시작일 1개월 후 ',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.MONTH, 1);
                        }
                    },{
                        text: '시작일 3개월 후 ',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.MONTH, 3);
                        }
                    },{
                        text: '시작일 6개월 후 ',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.MONTH, 6);
                        }
                    },'-',{
                        text: '시작일 1년 후',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.YEAR, 1);
                        }
                    },{
                        text: '시작일 2년 후',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.YEAR, 12);
                        }
                    },{
                        text: '시작일 3년 후',
                        handler : function() {
                            me.add(stDtObj.getValue(), Ext.Date.YEAR, 3);
                        }
                    },'-',{
                        text: '시작일 ~ 종료일 차이',
                        handler : function() {
                            if( stDtObj ) {
                                var endDt = me.isValid() ? me.getValue() : null ;
                                var sttDt = stDtObj.isValid()  ? stDtObj.getValue() : null;

                                if( endDt && sttDt ) {
                                    var diff = endDt - sttDt ;

                                    hoAlert( Ext.Date.format(sttDt,'Y/m/d' ) + '~' +  Ext.Date.format( endDt ,'Y/m/d') +' 차이는  <br/>[' + ((diff / me.divideBy.d )+1) + ']일 입니다.', Ext.exptyFn, 5000);
                                } else {
                                    hoAlert( '시작일 / 종료일을 모두 입력하세요.', Ext.exptyFn, 5000);
                                }
                            }
                        }
                    }
                ]
            });
            }catch(e) {}
        }
        menu.showBy(me.bodyEl, 0, 0);
    },
    add : function( date, interval, value ) {
        var newDate;

        switch(interval) {
            case Ext.Date.DAY :
                newDate = Ext.Date.add( Ext.Date.add(date, Ext.Date.DAY, 1*value), Ext.Date.DAY, value ==0 ? 0 : (value<0 ? 1 : -1) );
                break;
            case Ext.Date.MONTH :
                newDate = Ext.Date.add( Ext.Date.add(date, Ext.Date.MONTH, 1*value), Ext.Date.DAY, value ==0 ? 0 : (value<0 ? 1 : -1) );
                break;
            case Ext.Date.YEAR :
                newDate = Ext.Date.add( Ext.Date.add(date, Ext.Date.YEAR, 1*value), Ext.Date.DAY, value ==0 ? 0 : (value<0 ? 1 : -1) );
                break;
            default :
                newDate = date;
                break;
        }
        this.focus(false, 60);
        this.setValue( newDate );

    },
    beforeBlur : function() {
        var me = this;
        me.callParent();
        me.setMinMaxValue();

    },
    setMinMaxValue : function() {
        var me = this;
        if( this.edDtId ) {
            var edDtObj = Ext.getCmp(this.edDtId);
            if( edDtObj ) {
                edDtObj.setMinValue(me.getValue());
                edDtObj.validate();
                me.setMaxValue(edDtObj.getValue() ) ;
            }
        }

        if( this.stDtId ) {
            var stDtObj = Ext.getCmp(this.stDtId);
            if( stDtObj ) {
                stDtObj.setMaxValue(me.getValue());
                stDtObj.validate();
                me.setMinValue(stDtObj.getValue() ) ;
            }

        }
    },
    onExpand: function() {
        var me = this;
        me.callParent();
        me.setMinMaxValue();
    }/* ,
    getModelData: function() {
        var format = this.submitFormat || this.format,
        value = this.getValue();

        return value ? Ext.Date.format(value, format) : '';
    } */
});


/**
 * 날짜 combobox뒤에 붙는 기간 설정 버튼
 */
Ext.define('Ext.form.field.ux.PeriodButton', {
    alias: 'widget.periodbutton_ux',
    extend: 'Ext.button.Button',
    constructor: function(config) {
        config.text = config.text||'기간설정';

        config.menu  = Ext.create('Ext.menu.Menu', {
            items : [
                {  text: '1주', handler : function() {
                    Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, -7);
                    Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, 0);
                }},
                {  text: '2주', handler : function() {
                    Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, -14);
                    Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, 0);
                }},
                '-',
                {  text: '1개월', handler : function() {
                    Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.MONTH, -1);
                    Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, 0);
                }},
                {  text: '3개월', handler : function() {
                    Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.MONTH, -3);
                    Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, 0);
                }},
                {  text: '6개월', handler : function() {
                    Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.MONTH, -6);
                    Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, 0);
                }},
                '-',
                {  text: '1년', handler : function() {
                    Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.YEAR, -1);
                    Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, 0);
                }},
                {  text: '2년', handler : function() {
                    Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.YEAR, -2);
                    Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, 0);
                }},
                {  text: '3년', handler : function() {
                    Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.YEAR, -3);
                    Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).add(new Date(),Ext.Date.DAY, 0);
                }},'-',
                {  text: '시작일 ~ 종료일 날짜 계산', handler : function() {
                    var sttDt = Ext.getCmp('id_stt_'+config.name+'_'+config.actionFlag).getValue();
                    var endDt = Ext.getCmp('id_end_'+config.name+'_'+config.actionFlag).getValue();
                    var diff = endDt - sttDt ;
                    hoAlert(diff + ":"+ getDateDiff(diff, 'd') ); //  diff/ divideBy[datepart] -> days,
                }}
            ]
        });

        this.callParent(arguments);
    },
    initComponent: function() {
        var me = this;
        me.callParent();
    }
});

function getDateDiff(diff, type) {
    var divideBy = {
            w:604800000, // week
            d:86400000, // day
            h:3600000, // hour
            m:60000,  // minute
            s:1000   // second
        };
    return diff/ divideBy[type];
}

Ext.define('Ext.form.field.ux.Date', {
    extend:'Ext.form.field.Date',
    alias: 'widget.datefield_ux',
    
    padding : '0 0 1 0',
    border : 0,
    labelSeparator : '',
    msgTarget  : 'side',
    labelWidth : 100,
    width : 240,
    altFormats : "Y/m/d|m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|Ymd|n-j|n/j",
    submitFormat: 'Y-m-d H:i:s', // 참고Y-m-d H:i:s
    format : 'Y/m/d',
    submitValue : true,
    dateField : true,
    initComponent : function(){
        var me = this;

        me.callParent();
    },
});
/*
Ext.define('Ext.form.field.ux.Date', {
    extend:'Ext.form.field.Date',
    alias: 'widget.datefield_ux',
    border : 0,
    labelSeparator : '',
    msgTarget  : 'side',
    labelWidth : 100,
    width : 240,
    trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    altFormats : "Y/m/d|m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|Ymd|n-j|n/j",
    submitFormat: 'Y-m-d H:i:s', // 참고Y-m-d H:i:s
    format : 'Y/m/d',
    submitValue : true,
    dateField : true,
    initComponent : function(){
        var me = this;

        me.callParent();
    },
    getSubTplMarkup: function(values) {
        var me = this,
            childElCls = values.childElCls,
            field = Ext.form.field.Base.prototype.getSubTplMarkup.apply(me, arguments); // me.callParent(arguments);

        return '<table id="' + me.id + '-triggerWrap" class="' + Ext.baseCSSPrefix + 'form-trigger-wrap ' + Ext.baseCSSPrefix +'form-date-enlarge'  + childElCls + '" cellpadding="0" cellspacing="0"><tbody><tr>' +
            '<td id="' + me.id + '-inputCell" class="' + Ext.baseCSSPrefix + 'form-trigger-input-cell' + childElCls + '">' + field + '</td>' +
            me.getTriggerMarkup() +
            '</tr></tbody></table>';
    },
    onTrigger2Click: function(event) {
        var me = this;
        me.collapse();
        me.setValue(null);
        me.setMinMaxValue();
        me.focus(false, 60);
    }

});
*/

/**
 * 시간 필드..
 *
 */
Ext.define('Ext.form.field.ux.Time', {
    extend: 'Ext.form.field.Time',
    alias: 'widget.timefield_ux',
    border : 0,
    labelSeparator : '',
    msgTarget  : 'side',
    labelWidth : 100,
    width : 320,
    isFormField : true,
    // plugins: [Ext.create('Ext.slider.AlwaysVisibleTipUX')],
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }
});


/**
 * 년/월 이 표시되는 component
 */
Ext.define('Ext.form.field.ux.Month', {
    extend:'Ext.form.field.Date',
    alias: 'widget.monthfield_ux',
    requires: ['Ext.picker.Month'],
    alternateClassName: ['Ext.form.field.ux.MonthField', 'Ext.form.ux.Month'],
    selectMonth: null,
    labelWidth : 100,
    width : 320,
    createPicker: function() {
        var me = this, format = Ext.String.format;

        return Ext.create('Ext.picker.Month', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                select :        { scope: me,   fn: me.onSelect      },
                monthdblclick : { scope: me,   fn: me.onOKClick     },
                yeardblclick :  { scope: me,   fn: me.onOKClick     },
                OkClick :       { scope: me,   fn: me.onOKClick     },
                CancelClick :   { scope: me,   fn: me.onCancelClick }
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    },
    onCancelClick: function() {
        var me = this;
        me.selectMonth = null;
        me.collapse();
    },
    onOKClick: function() {
        var me = this;
        if( me.selectMonth ) {
            me.setValue(me.selectMonth);
            me.fireEvent('select', me, me.selectMonth);
        }
        me.collapse();
    },
    onSelect: function(m, d) {
        var me = this;
        me.selectMonth = new Date(( d[0]+1 ) +'/1/'+d[1]);
    }
});


Ext.define('Ext.form.field.ux.ComboBox', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.combobox_ux',
    border : 0,
    labelSeparator : '',
    msgTarget  : 'side',
    labelWidth : 100,
    width : 320
});

Ext.define('Ext.ux.form.field.ColorCombo', {
    extend:'Ext.form.FieldContainer',
    mixins:{
        field:'Ext.form.field.Field'
    },
    alias: 'widget.colorcombo_ux',

    //configurables
    combineErrors: true,
    msgTarget: 'under',
    layout: 'hbox',
    readOnly: false,

    // properties
    colorValue: null,
    /**
     * @property dateField
     * @type Ext.form.field.Date
     */
    colorField: null,

    initComponent: function(){
        var me = this
            ,i = 0
            ,key
            ,tab;

        me.items = me.items || [];

        me.colorField = Ext.create('Ext.form.field.Trigger', {
            flex:1,
            isFormField:false, //exclude from field query's
            submitValue:false,
            readOnly: me.readOnly,
            onTriggerClick: function() {
              me.picker.show();
              me.picker.alignTo(me.colorField.inputEl);
            }
        });
        me.items.push(me.colorField);

        me.picker = Ext.create('Ext.picker.Color', {
          renderTo: document.body,
          floating: true,
          hidden: true,
          style: {
            backgroundColor: "#fff"
          },
          listeners: {
            scope:this,
            select: function(field, value, opts){
              me.setValue(value);
              me.picker.hide();
            }
          }
        });
        me.items.push(me.picker);

        for (; i < me.items.length; i++) {
            me.items[i].on('focus', Ext.bind(me.onItemFocus, me));
            me.items[i].on('blur', Ext.bind(me.onItemBlur, me));
            me.items[i].on('specialkey', function(field, event){
                key = event.getKey();
                tab = key == event.TAB;

                if (tab && me.focussedItem == me.dateField) {
                    event.stopEvent();
                    me.timeField.focus();
                    return;
                }

                me.fireEvent('specialkey', field, event);
            });
        }

        me.callParent();

        // this dummy is necessary because Ext.Editor will not check whether an inputEl is present or not
        this.inputEl = {
            dom: document.createElement('div'),
            swallowEvent:function(){}
        };

        me.initField();
    },
    focus:function(){
        this.callParent(arguments);
        this.colorField.focus();
        var me = this;
    },

    onItemFocus:function(item){
        if (this.blurTask){
            this.blurTask.cancel();
        }
        this.focussedItem = item;
    },

    onItemBlur:function(item, e){
        var me = this;
        if (item != me.focussedItem){ return; }
        // 100ms to focus a new item that belongs to us, otherwise we will assume the user left the field
        me.blurTask = new Ext.util.DelayedTask(function(){
            me.picker.hide();
            me.fireEvent('blur', me, e);
        });
        me.blurTask.delay(100);
    },

    getValue: function(){
        var value = null
            ,color = this.colorField.getSubmitValue();

        if (color){
          value = this.colorField.getValue();
        }
        return value;
    },

    getSubmitValue: function(){
//        var value = this.getValue();
//        return value ? Ext.Date.format(value, this.dateTimeFormat) : null;

        var me = this
            ,value = me.getValue();

        return value;
    },

    setValue: function(value){
        this.colorField.setValue(value);
    },
    // Bug? A field-mixin submits the data from getValue, not getSubmitValue
    getSubmitData: function(){
        var me = this
            ,data = null;

        if (!me.disabled && me.submitValue && !me.isFileUpload()) {
            data = {};
            data[me.getName()] = '' + me.getSubmitValue();
        }
        return data;
    }
});

Ext.define('Ext.form.field.ux.ComboTreeGridDomain-MoveToTreeGrid-domain', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.colorcombo_ux1',

    requires: ['Ext.grid.View', 'Ext.grid.column.Column'],

    width: 290,
    anchor: '100%',
    valueField : 'DOMAIN_NM',  // <-- TODO 설정..
    displayField : 'DOMAIN_NM',  // <-- TODO 설정..
    // fieldLabel: 'Grid Picker',

    fields: [
        { name: 'DOMAIN_ID', type: 'string' },
        { name: 'DOMAIN_NM', type: 'string' },
        { name: 'UP_DOMAIN_ID', type: 'string' },
        { name: 'PROJECT_ID', type: 'string' },
        { name: 'DTYPE', type: 'string' },
        { name: 'LEN1', type: 'string' },
        { name: 'LEN2', type: 'string' },
        { name: 'DATA_TYPE', type: 'string' },
        { name: 'DEFAULT_VAL', type: 'string' },
        { name: 'ICON_CLS', type: 'string' },
        { name: 'iconCls', type: 'string' },
        { name: 'LAST_UPD_DT', type: 'string' },
        { name: 'LAST_UPD_USR_UID', type: 'string' }
    ],
    proxy : {
        type : 'ajax',
        url : '/domain/data/tree.do',
        reader : {
            type : 'json',
            rootProperty : 'CHILDREN'
        },
        extraParams: {
            PROJECT_ID : 'PROJECT'
        }
    },
    root: {
        expanded: false
    },
    initComponent: function() {
        var me = this;
        me.setValue( me.valueText||'' );
        me.callParent(arguments);
    },
    setDomainId : function(domainId) {
       var me = this;
       
       this.domainId = domainId;
    },
    setDataType : function(dataType) {
       var me = this;
       
       this.dataType = dataType;
    },
    getDomainId : function() {
       return this.domainId;
    },
    getDataType : function() {
       return this.dataType;
    },
    createPicker: function() {
        var me = this;
        picker = new Ext.create('Ext.tree.Panel', {
            floating: true,
            hidden: true,
            height: 350,
            minHeight: 150,
            minWidth: 300,
            width: 300,
            header: false,
            value : me.value,
            rootVisible: me.rootVisible||false,
            store: Ext.create('Ext.data.TreeStore', {
                remoteSort: true,
                autoLoad: true,
                fields: me.fields||[],
                proxy: me.proxy||{}
            }),
            listeners : {
                cellclick : function( _this, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    me.setDomainId( record.get("DOMAIN_ID"))
                    me.setDataType( record.get("DATA_TYPE"))
                    me.setValue( record.get( me.valueField ));
                    me.setRawValue( record.get( me.displayField ));
                },
                celldblclick : function( _this, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    me.setDomainId( record.get("DOMAIN_ID"))
                    me.setDataType( record.get("DATA_TYPE"))
                    me.setValue( record.get( me.valueField ));
                    me.setRawValue( record.get( me.displayField ));
                    me.picker.hide();
                }, 
                render : function( _this,  eOpts ) {
                    try {
                        _this.store.load();
                    } catch(e) {
                    }
                }
            },
            columns: [{
                xtype: 'treecolumn',
                minWidth: 120,
                width: 120,
                flex : 1,
                text: '도메인명',
                dataIndex : 'DOMAIN_NM'
            }, {
                xtype: 'gridcolumn',
                minWidth: 80,
                width: 90,
                flex : 1,
                text: '<div style="text-align:center;width:100%;">데이터 타입</div> ',
                width: 90,
                dataIndex: 'DTYPE_LEN',
                align : 'left',
                renderer : function(value, metaData, record , rowIndex, colIndex, store, view ) {
                    
                    if( record.data.LEVEL == 1) {
                        return record.data.DTYPE;
                    } else if( record.data.DTYPE == 'DATE' || record.data.DTYPE == 'DATETIME'|| record.data.DTYPE == 'CLOB' ) {
                        return record.data.DTYPE;
                    } else if( record.data.DTYPE == 'VARCHAR' || record.data.DTYPE == 'VARCHAR2' 
                           || record.data.DTYPE == 'INTEGER' || record.data.DTYPE == 'LONG' ) {
                        return record.data.DTYPE+'('+record.data.LEN1+')';
                    } else if( record.data.DTYPE == 'NUMBER' || record.data.DTYPE == 'FLOAT' || record.data.DTYPE == 'DOUBLE'  ) {
                        if( record.data.LEN2 != null && record.data.LEN2 != '' && record.data.LEN2 != '0' ) {
                            return record.data.DTYPE+'('+record.data.LEN1 + "," + record.data.LEN2+')';
                        } else {
                            return record.data.DTYPE+'('+record.data.LEN1 +')';
                        }
                    } else {
                        return record.data.DTYPE+'('+record.data.LEN1+')';
                    }
                }
            }, {
                header: '기본값',
                width: 50,
                dataIndex: 'DEFAULT_VAL',
                align: 'center'
            }]
        });
        
        return picker;
    },
    getValue: function() 
    {
            return this.value;
    },
    getSubmitValue: function()
    {
            return this.value;
    },
    

});