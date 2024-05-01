var ErdAuth = function() {
    
    this.projectUserDatas = {};
    this.subjectEditMap = {};
    
    this.loadData = function() {
        
        var response = Ext.Ajax.request({
            async: false,
            url: '/project/data/loginUser.do',
            params: {

            }
        });
        this.projectUserDatas = Ext.decode(response.responseText).data;
    }
    
    /**
     * 편집을 시작 하거나, 편집상태 조회.
     */
    this.startOrCheckSubjectEditInfo = function(subject_id, isSave, isAlert) {
        var response = Ext.Ajax.request({
            async: false,
            url: '/subject/data/startOrCheckEditInfo.do',
            params: {
                SUBJECT_ID : subject_id,
                EDIT_START_YN : isSave ? "Y" : "N" 
            }
        });
        this.subjectEditInfo = Ext.decode(response.responseText).data;
        
        this.subjectEditMap[subject_id] = this.subjectEditInfo;
        
        if( isAlert ) {
            if( this.subjectEditInfo["EDIT_USR_NM"] ) {
                Ext.Msg.alert('안내', this.subjectEditInfo["EDIT_USR_NM"]+'님이 '+this.subjectEditInfo["EDIT_START_DT_FMT"]+'부터 편집중입니다.');
            } else {
                Ext.Msg.alert('안내', '편집중인 모델러가 없습니다. [편집시작]버튼을 클릭하여 편집가능합니다.');
            }
        }
        
        this.setButtonEnable();
    }
    
    /*
     * 편집 종료
     */
    this.endSubjectEditInfo = function(subject_id) {
        var response = Ext.Ajax.request({
            async: false,
            url: '/subject/data/endEditInfo.do',
            params: {
                SUBJECT_ID : subject_id,
            }
        });
        var res = Ext.decode(response.responseText);
        this.subjectEditInfo = res.data;
        
        if( res.success ) {
            this.subjectEditMap[subject_id] = this.subjectEditInfo;
        }
        
        this.setButtonEnable();
    }
    
    /**
     * 모델링 권한 있는지..
     */
    this.hasUserAuthOfModeler = function() {
        return this.projectUserDatas.AUTH== 'MODELER' || this.projectUserDatas.AUTH== 'MANAGER';
    }

    /**
     * 모델링 권한 있는지..
     */
    this.isLogined = function() {
        return this.projectUserDatas.LOGINED_YN == 'Y';
    }
    
    /**
     * 관리자 권한 있는지..
     */
    this.hasUserAuthOfManager = function() {
        return this.projectUserDatas.AUTH== 'MANAGER';
    }
    
    this.getUserInfo = function( ) {
        return this.projectUserDatas;
    }
    
    this.getSubjectEditInfo = function() {
        return  this.subjectEditInfo;
    }
    
    this.isEditable = function() {
        var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
        var subjectEditInfo = this.subjectEditMap[subject_id];
        if( subjectEditInfo["I_AM_EDITING_YN"] == "Y" && this.hasUserAuthOfModeler() ) { 
            return true;
        } else {
            return false;
        }
    }
    
    this.setButtonEnable = function() {
        
        var subject_id = Ext.getCmp("ERD-SUBJECTS").getActiveTab().getId();
        var subjectEditInfo = this.subjectEditMap[subject_id];
        
        if( subjectEditInfo["I_AM_EDITING_YN"] == "Y") { 
            // 편집관련 버튼
            Ext.getCmp('centerTop_EditStartButton').setText('편집중(나)');
            Ext.getCmp('centerTop_EditStartButton').setPressed(true);
            Ext.getCmp('centerTop_EditEndButton').setDisabled(false);
            Ext.getCmp('centerTop_EditStatusCheckButton').setDisabled(true);
            
            Ext.getCmp("DRAW_BUTTON").setDisabled(false);
            // Ext.getCmp("COLOR_BUTTON").setDisabled(false);

            // 업무영역 버튼
            Ext.getCmp("leftSubjectSubjectAddBtn").setDisabled(false);
            
            // 공통컬럼 버튼
            Ext.getCmp("erdLeftCommonColumnAdd").setDisabled(false);
            Ext.getCmp("erdLeftCommonColumnDelete").setDisabled(false);
            Ext.getCmp("erdLeftCommonColumnSave").setDisabled(false);

            // 시퀀스 버튼
            Ext.getCmp("erdLeftSequenceAdd").setDisabled(false);
            Ext.getCmp("erdLeftSequenceDelete").setDisabled(false);
            Ext.getCmp("erdLeftSequenceSave").setDisabled(false);

            // 테이블 관련 버튼
            Ext.getCmp("btn_tableDelete").setDisabled(false);
            Ext.getCmp("btn_tableSaveStatus").setDisabled(false);
            Ext.getCmp("btn_tableManagement").setDisabled(false);
            // 컬럼 관련 버튼
            Ext.getCmp("btn_tableColumnAdd").setDisabled(false);
            Ext.getCmp("btn_tableColumnDelete").setDisabled(false);
            Ext.getCmp("btn_tableColumnChangeColor").setDisabled(false);
            Ext.getCmp("btn_tableColumnApplyWord").setDisabled(false);
            Ext.getCmp("btn_tableColumnSave").setDisabled(false);
            // 인덱스 관련 버튼
            Ext.getCmp("btn_addTableIndexWindow").setDisabled(false);

            // 단어사전 버튼
            Ext.getCmp("erdRightWordDelete").setDisabled(false);
            Ext.getCmp("erdRightWordAdd").setDisabled(false);
            Ext.getCmp("erdRightWordApply").setDisabled(false);
            Ext.getCmp("erdRightWordSave").setDisabled(false);
                               
        } else {
            // 편집관련 버튼
            Ext.getCmp('centerTop_EditStartButton').setText('편집시작');
            Ext.getCmp('centerTop_EditStartButton').setDisabled(false);
            Ext.getCmp('centerTop_EditEndButton').setDisabled(true);
            Ext.getCmp('centerTop_EditStatusCheckButton').setDisabled(false);
            Ext.getCmp('centerTop_EditStatusCheckButton').setPressed(false);
            
            Ext.getCmp("DRAW_BUTTON").setDisabled(true);
            // Ext.getCmp("COLOR_BUTTON").setDisabled(true);

            // 업무영역 버튼
            Ext.getCmp("leftSubjectSubjectAddBtn").setDisabled(true);

            // 공통컬럼 버튼
            Ext.getCmp("erdLeftCommonColumnAdd").setDisabled(true);
            Ext.getCmp("erdLeftCommonColumnDelete").setDisabled(true);
            Ext.getCmp("erdLeftCommonColumnSave").setDisabled(true);

            // 시퀀스 버튼
            Ext.getCmp("erdLeftSequenceAdd").setDisabled(true);
            Ext.getCmp("erdLeftSequenceDelete").setDisabled(true);
            Ext.getCmp("erdLeftSequenceSave").setDisabled(true);

            // 테이블 관련 버튼
            Ext.getCmp("btn_tableDelete").setDisabled(true);
            Ext.getCmp("btn_tableSaveStatus").setDisabled(true);
            Ext.getCmp("btn_tableManagement").setDisabled(true);
            // 컬럼 관련 버튼
            Ext.getCmp("btn_tableColumnAdd").setDisabled(true);
            Ext.getCmp("btn_tableColumnDelete").setDisabled(true);
            Ext.getCmp("btn_tableColumnChangeColor").setDisabled(true);
            Ext.getCmp("btn_tableColumnApplyWord").setDisabled(true);
            Ext.getCmp("btn_tableColumnSave").setDisabled(true);
            // 인덱스 버튼
            Ext.getCmp("btn_addTableIndexWindow").setDisabled(true);

            // 단어사전 버튼
            Ext.getCmp("erdRightWordDelete").setDisabled(true);
            Ext.getCmp("erdRightWordAdd").setDisabled(true);
            Ext.getCmp("erdRightWordApply").setDisabled(true);
            Ext.getCmp("erdRightWordSave").setDisabled(true);
                               
            if( subjectEditInfo["EDITABLE_YN"] == "Y") {
                
            } else {
                Ext.getCmp('centerTop_EditStartButton').setText('편집중('+subjectEditInfo["EDIT_USR_NM"] + '님)');
                Ext.getCmp('centerTop_EditStartButton').setDisabled(true);
            }
        }
    }
}