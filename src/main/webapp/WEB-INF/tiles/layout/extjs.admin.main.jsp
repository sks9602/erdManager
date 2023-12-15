<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>
<%@ page import="java.util.Locale" %>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, height=device-height, viewport-fit=cover, shrink-to-fit=no">
    <meta name="title" content="WEB ERD">
    <meta name="description" content="">
    <meta name="copyrigt" content="">
    <meta name="keywords" content="erd, weberd, er-diagram">

    <title>WEB ERD</title>
    <script type="text/javascript">window.fiddleSessionId="16191347856604893430";</script><!-- hasCodeToTransform: false --><!-- framework css -->
    <!-- link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-neptune/resources/theme-neptune-all-debug.css" -->
    <!-- link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-crisp/resources/theme-crisp-all-debug.css" -->
    <link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-classic/resources/theme-classic-all-debug.css">
    <link rel="stylesheet" href="/static/css/erd.css">
    <link rel="stylesheet" href="/static/css/ext.css">
    
    <script type="text/javascript" src="https://cdn.sencha.com/ext/commercial/7.3.0/build/ext-all-debug.js"></script>
    <script type="text/javascript" src="https://cdn.sencha.com/ext/commercial/7.3.0/build/classic/theme-neptune/theme-neptune-debug.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>

    <link href="https://cdn.jsdelivr.net/npm/svg.select.js@3.0.1/dist/svg.select.min.css" rel="stylesheet"/>

    <script src="//code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g="  crossorigin="anonymous"></script>
    <script src="//code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    
    <script src="/static/js/jQuery/plugin/jquery-minimap.js"></script>
    
    <script src="/static/js/svg/svg.draggable-table.js"></script>
    <script src="/static/js/svg/svg.draggable-resizer.js"></script>

    <script src="/static/js/erd/DrawDataLoad.js"></script>
    <script src="/static/js/erd/DrawSubjectArea.js"></script>
    <script src="/static/js/erd/DrawTable.js"></script>
    <script src="/static/js/erd/DrawRelation.js"></script>
    <script src="/static/js/erd/ErdAppFunction.js"></script>
    <script src="/static/js/erd/ErdDrawFunction.js"></script>
    
    <script src="/static/js/ext-ux/StringUtil.js"></script>
    <script src="/static/js/ext-ux/HoMessage.js"></script>
    <script src="/static/js/ext-ux/VType.js"></script>
    <script src="/static/js/ext-ux/ComboTreeGrid-domain.js"></script>
    <script src="/static/js/ext-ux/ComboTreeGrid-dataType.js"></script>
    <script src="/static/js/ext-ux/ComboTree.js"></script>
    <script src="/static/js/ext-ux/ComboTripple.js"></script>
    <script src="/static/js/ext-ux/ComboUx.js"></script>
    <script src="/static/js/ext-ux/FormFieldUx.js"></script>
    <script src="/static/js/ext-ux/FormPanel.js"></script>
    <script src="/static/js/ext-ux/ColumnCheck.js"></script>
    
<!--
로딩화면 만들기
 script type='text/javascript' src='/static/js/loadImg.js'></script>
<script type='text/javascript'>
    $(function(){
        $('img').imgPreload()
    })
</script -->
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet"  -->
    <!--  https://fontawesome.com/search  -->
    <style>

        
    </style>
    
    <script type="text/javascript">
        if (Ext.Loader) {
            Ext.Loader.setPath({
                'Ext.ux' : 'https://cdn.sencha.com/ext/commercial/7.3.0/packages/ux/src',
                // 'Ext.field' : 'http://127.0.0.1:9081/contents/extjs/field'
            });
        }
        
        Ext.override(Ext.panel.Panel, {   // Ext.grid.Panel
            /**
             *  submitType
             *     1. 'changed' : Grid중 변경된 내용을 submit
             *     2. 'checked' : Grid중 selected 된 내용을 submit
             *     3. 'all' : Grid의 모든 내용을 submit
             */
            submit : function(submitType, submitUri, option) {
                
                var me = this, store = this.getStore(), noQuestion = (option||{}).noQuestion, records;
                var showSaving = (option||{}).showSaving||false;
                var msgTxt = (option||{}).msgConfirm||'저장하시겠습니까?';
                var paramsArgs = (option||{}).params||{};
                var forceSave = (option||{}).forceSave||false;
                // 변경된 내용을 submit
                if( submitType.toLowerCase() == 'changed' ) {
                    records = store.getModifiedRecords();
                    console.log( records );

                    console.log( store.getNewRecords() );
                    // records.push.apply( records, store.getNewRecords() );
                    // or records = records.concat( store.getNewRecords() );
                }
                // selected 된 내용을 submit
                else if( submitType.toLowerCase() == 'checked' ) {
                    records = this.getSelectionModel().getSelection();
                }
                // Grid의 모든 내용을 submit
                else if( submitType.toLowerCase() == 'all' ) {
                    if( !store.getRange || !store.getCount ) {
                        hoAlert('지원되지 않는 형식 제출 방식 입니다.<br/>(submitType을 확인하세요.)');
                        return;
                    }
                    records = store.getRange(0, store.getCount( ) );

                }
                // 이외는 오류
                else {
                    hoAlert('구분자가 정확하지 않습니다.(changed/checked)', Ext.exptyFn, 2000);
                }

                if( !submitUri || typeof(submitUri) != 'string') {
                    hoAlert('기능이 정확하지 않습니다.', Ext.exptyFn, 2000);
                }

                /*
                 * (내부 함수)
                 * 저장 처리
                 */
                function  fs_submit() {
                    // 변경된 내용을 submit
                    if( submitType.toLowerCase() == 'changed'  ) {
                    	 
                        store.proxy.writer.params = {  }; // 'p_action_flag' : actionFlag
                        var params = paramsArgs; // 'p_action_flag' : actionFlag

                        var keys = [];

                        var fields = records&&records[0]  ? records[0].fields : store.config.fields;
                        
                        for(var key =0; key< fields.length; key++){
                            console.log( fields[key]['name'] );
                            keys.push(fields[key]['name'] );
                            // keys.push(records[0].fields.get(key)['name'] );
                        }
                        
                        console.log( " records.length : ", records.length)
                        for(var k=0;k < keys.length;k++){
                            params[keys[k]+"[]"] = params[keys[k]+"[]"]||[];
                            for(var j=0;j < records.length;j++){
                                params[keys[k]+"[]"].push(records[j].get(keys[k]));
                            }
                        }
                        /*
                        if( option && option.params ) {
                            for( var x in option.params) {
                                store.proxy.writer.params[x] = option.params[x];
                            }
                        }
                        */
                        // store.proxy.url = submitUri;
                        
                        Ext.applyIf(option||{}, {
                            /*
                            callback : function(batch, option) {
                                if( store.reload ) {
                                    store.reload()
                                }
                            },
                            */
                            success : function(batch, option) {
                                Ext.Msg.alert('Success',  getResultMessageGrid(batch, option)); // batch.operations[0].request.scope.reader.jsonData.message );
                                if( store.commitChanges ) {
                                    store.commitChanges();
                                } else {
                                    /*
                                    if( option && option.params && option.params['CODE'] ) {
                                        store.load({
                                            params: {
                                                'code': option.params['CODE'],
                                                'ROOT': '*'
                                            }
                                        });
                                    }
                                    */
                                }
                            },
                            failure : function(batch, option) {
                                Ext.Msg.alert('Fail',  getResultMessageGrid(batch, option));
                            }
                        });
        
                        option = Ext.applyIf({
                            url: submitUri, // store.proxy.url,
                            method: 'POST',
                            params: params
                        }, option||{});
                        
                        Ext.Ajax.request(option);
                        
                        // store.sync(option);
                    }
                    // selected 된 내용을 submit
                    else if( submitType.toLowerCase() == 'checked' || submitType.toLowerCase() == 'all') {
                        var params = paramsArgs; // 'p_action_flag' : actionFlag

                        var keys = [];
                        
                        for(var key =0; key< records[0].fields.length; key++){
                            keys.push(records[0].fields[key]['name'] );
                            // keys.push(records[0].fields.get(key)['name'] );
                        }
                        for(var k=0;k < keys.length;k++){
                            params[keys[k]+"[]"] = params[keys[k]+"[]"]||[];
                            for(var j=0;j < records.length;j++){
                                params[keys[k]+"[]"].push(records[j].get(keys[k]));
                            }
                        }
                        option = Ext.applyIf({
                            url: submitUri, // store.proxy.url,
                            method: 'POST',
                            params: params
                        }, option||{});

                        Ext.applyIf(option, {
                            success : function(response) {
                                Ext.Msg.alert('Success',  response.responseText.message );

                                store.commitChanges();
                            },
                            failure : function(response) {
                                Ext.Msg.alert('Fail',  response.responseText.message );
                            }
                        });

                        Ext.Ajax.request(option);
                    }
                }
                if( records.length > 0 || forceSave ) {
                    // 묻지 않고 바로 저장..
                    if (noQuestion) {
                        // 저장 처리 (내부 함수)
                        fs_submit()
                    } else {
                        hoConfirm( msgTxt , function(btn, text, opt) {
                            if( btn == 'yes' ) {
                                var mBox = Ext.MessageBox;
                                if( showSaving ) {
	                                Ext.MessageBox.show({
	                                       msg: 'Saving your data, please wait...',
	                                       progressText: 'Saving...',
	                                       width:300,
	                                       wait:true,
	                                       waitConfig: {interval:200},
	                                       icon:'ext-mb-download', //custom class in msg-box.html
	                                       iconHeight: 50
	                                });
                                }
                                
                                // 저장 처리 (내부 함수)
                                fs_submit();
                                /*
                                setTimeout(function(){
                                	Ext.MessageBox.hide();
                                }, 300);
                                */
                            }
                        });
                    }
                } else {
                    // 묻지 않고 바로 저장..
                    if (noQuestion) {
                        Ext.create('widget.uxNotification', {
                            title: '알림',
                            position: 'br',
                            manager: 'form1',
                            iconCls: 'ux-notification-icon-error',
                            autoCloseDelay: 3000,
                            spacing: 20,
                            html: '변경된 내용이 없습니다.'
                        }).show();
                    } else {
                        hoAlert('변경된 내용이 없습니다.', Ext.exptyFn, 2000, this.getId());
                        // checkbox에 선택하라는 경고...
                        if( submitType == 'checked' ) {
                            var column = this.down('gridcolumn');
                            // Ext.get(column.getId() + '-titleEl').frame('blue', 1, 0.2).frame('blue', 1, 0.2);
                            Ext.get(column.getId()).frame('blue', 1, 0.2).frame('blue', 1, 0.2);
                        }
                    }
                }
            },
            getSelectedRecords : function() {
                return this.getSelectionModel().getSelection();
            },
            getNewRecords : function() {
                var store = this.getStore();
                return store.getNewRecords();
            },
            getModifiedRecords : function() {
                var store = this.getStore();
                return store.getModifiedRecords();
            },
            getRemovedRecords : function() {
                var store = this.getStore();
                return store.getRemovedRecords();
            },
            getTouchedRecords : function() {
                var store = this.getStore(), records = new Array;
                records.concat( store.getNewRecords() );
                records.concat( store.getModifiedRecords() );
                records.concat( store.getRemovedRecords() );
                return records;
            }
        });
    </script>
    
    <tiles:insertAttribute name="body" flush="true"/>
</head>
<body>
<!-- 
로딩화면 만들기
div class="images">
    <ul>
        <li>
            <img class="main-img" src="https://smallenvelop.com/demo/image-loading/images/1.jpg">
        </li>   
        <li>
            <img class="main-img" src="https://smallenvelop.com/demo/image-loading/images/2.jpg">
        </li>   
    </ul>
</div -->
    <form name="projectForm" method="post" action="/extjs/erd/erd.do">
        <input type="hidden" name="PROJECT_ID" value=""/>
    </form>
</body>
</html>