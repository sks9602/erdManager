    
    // custom Vtype for vtype:'IPAddress'
    Ext.define('Override.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',
    
        IPAddress:  function(value) {
            return this.IPAddressRe.test(value);
        },
        IPAddressRe: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
        IPAddressText: 'Must be a numeric IP address',
        IPAddressMask: /[\d\.]/i
    });
    
    // custom Vtype for vtype:'IPAddress'
    Ext.define('Override.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',
    
        CHARScale:  function(value) {
            return this.CHARScaleRe.test(value);
        },
        CHARScaleRe: /^(4000|[1-3]\d{1,3}|\d{1,3}|^0)$/,
        CHARScaleText: '4000이하',
        CHARScaleMask: /[\d\.]/i
    });
    
    Ext.define('Override.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',
    
        NUMBERScale:  function(value) {
            return this.NUMBERScaleRe.test(value);
        },
        NUMBERScaleRe: /^\d{1,2}(\,\d{1,})?$/,
        NUMBERScaleText: '숫자(ex. 4 또는 5,3 등)',
        NUMBERScaleMask: /[\d\.]/i
    });
    
    Ext.define('Override.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',
    
        DB_TABLEScale:  function(value) {
            return this.DB_TABLEScaleRe.test(value);
        },
        DB_TABLEScaleRe: /^[a-zA-Z0-9\_\;]*$/,
        DB_TABLEScaleText: '영문,숫자,_,;(구분자)',
        DB_TABLEScaleMask: /[a-zA-Z0-9\_\;]*/i
    });
    
    
    
    Ext.define('Override.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',
    
        MariaDBDataTypeScale:  function(value) {
            return this.MariaDBDataTypeScaleRe.test(value);
        },// scale불필요|scale필수|scale옵션(,없이)|scale옵션(,포함)
        MariaDBDataTypeScaleRe: /^((AUTO_INCREMENT|COMMENT|DATE|BOOLEAN|LONGBLOB|LONGTEXT|TINYBLOB|TINYTEXT|MEDIUMBLOB|MEDIUMTEXT)|((TIME|DATETIME|TIMESTAMP)(\([1-6]?\))?)|((BINARY|VARCHAR|VARBINARY)\(\d{1,4}\))|(YEAR|YEAR\(4\))|((BIT|BLOB|CHAR|TEXT|)(\(\d{1,2}\))?)|((INTEGER|TINYINT|SMALLINT|MEDIUMINT|BIGINT)(\(\d{1,2}\))?(SIGNED|UNSIGNED|ZEROFILL)?)|((FLOAT|DOUBLE)(\(\d{1,2}\,d{1,2}\))?)|((NUMERIC|NUMBER|DECIMAL)(\(\d{1,2}(\,\d{1,})?\))?(\s*SIGNED|\s*UNSIGNED|\s*ZEROFILL)?))|(ENUM\('\w{1,}'(\,\s*'\w{1,}')*\))$/,
        MariaDBDataTypeScaleText: '데이타타입[(숫자,숫자)]',
        MariaDBDataTypeScaleMask: /[A-Z0-9\,\(\)]*/i
    });