<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="tagErd"  tagdir="/WEB-INF/tags/erd"%>

	<script>
	var drawDataLoad = new DrawDataLoad();
	var erdAuth	  = new ErdAuth();
	drawDataLoad.loadData();
	erdAuth.loadData();

	<tagErd:itemCode type="ext-js-store" name="DATA_TYPE" cdGrp="DATA_TYPE" firstText="" value=""></tagErd:itemCode>

	var socket = new WebSocket("ws://localhost:8080/ws/chat");

	var roomId = '${sessionScope._sessionVO.projectId}', userNm = '${sessionScope._sessionVO.usrNm}';

	function socketEnterRoom(ws){
		// if (!isOpen(ws)) return;
		var jsonMsg =  {"type" : "ENTER", "roomId": roomId , "sender": userNm , "message": ""};
		ws.send(JSON.stringify(jsonMsg));
	}

	socket.onopen = function (e) {
		// 
		socketEnterRoom(socket);
	};

	function socketStartEdit() {
		if (!isOpen(socket)) return;
		
		var jsonMsg =  {"type" : "START", "roomId": roomId , "sender": userNm , "message": ""};
		socket.send(JSON.stringify(jsonMsg));
	}
	
	function isOpen(ws) { 
		console.log( ws.readyState, ws.OPEN );
		return ws.readyState === ws.OPEN ;
	}
	
	socket.onmessage = function (e) {
		// alert( e.data );
		var json = Ext.JSON.decode(e.data);
		console.log(json);
		if( json.type == "START" || json.type == "END" ) {
			Ext.Msg.alert('안내',  Ext.JSON.decode(e.data).message , function() {
				
			});
		}
	}

	socket.onclose = function (e) {
		console.log( '연결 끊김' )
	}

	function socketSendMessage( msg) {
		if (!isOpen(socket)) return;
		
		var jsonMsg = {"type" : "TALK", "roomId": roomId , "sender": userNm, "message": msg};
		socket.send(JSON.stringify(jsonMsg));
	}
	
	function socketEndEdit() {
		if (!isOpen(socket)) return;
		
		var jsonMsg =  {"type" : "END", "roomId": roomId , "sender": userNm , "message": ""};
		socket.send(JSON.stringify(jsonMsg));
	}
	
	function socketExitRoom() {
		if (!isOpen(socket)) return;
		var jsonMsg = {"type" : "QUIT", "roomId": roomId , "sender": userNm, "message": ""};
		
		socket.send(JSON.stringify(jsonMsg));
	}

	window.onbeforeunload = function() {
		socketExitRoom();
	};
	
	Ext.onReady(function() {
	    Ext.create('Ext.container.Viewport', {
	        layout: 'border',
	        items: [
	            {
	                region: 'north',
	                html: '<h1 class="x-panel-header">Page Title</h1>',
	                border: false,
	                margins: '0 0 5 0'
	            },
	            {
	                region: 'west',
	                collapsible: true,
	                title: 'Navigation',
	                width: 150,
	                layout: 'border',
	                items: [
	                    {
	                        region: 'north',
	                        xtype: 'panel',
	                        title: 'Sub Panel 1',
	                        height: 100
	                    },
	                    {
	                        region: 'center',
	                        xtype: 'panel',
	                        title: 'Sub Panel 2'
	                    }
	                ]
	            },
	            {
	                region: 'center',
	                xtype: 'panel',
	                layout: 'border',
	                items: [
	                    {
	                        region: 'north',
	                        xtype: 'panel',
	                        title: 'Inner Panel 1',
	                        height: 100
	                    },
	                    {
	                        region: 'center',
	                        xtype: 'panel',
	                        title: 'Inner Panel 2'
	                    },
	                    {
	                        region: 'south',
	                        xtype: 'panel',
	                        title: 'Inner Panel 3',
	                        height: 100
	                    }
	                ]
	            },
                {
                    region: 'east',
                    collapsible: true,
                    title: 'Navigation',
                    width: 150,
                    layout: 'border',
                    items: [
                        {
                            region: 'north',
                            xtype: 'panel',
                            title: 'Sub Panel 1',
                            height: 100
                        },
                        {
                            region: 'center',
                            xtype: 'panel',
                            title: 'Sub Panel 2'
                        }
                    ]
                },
	        ]
	    });
	});

	if (document.all) {
		// document.all.loading.style.visibility='hidden';
		var el = Ext.get("loading"); 
		el.fadeOut({
				duration: 1000,
				callback: function () {
					el.hide();
				}
		});
		//el.setOpacity(0);
		//el.hide();
	}
	if (document.layers) {
		// document.loading.visibility='hidden';
		var el = Ext.get("loading"); 
		el.fadeOut({
				duration: 1000,
				callback: function () {
					el.hide();
				}
		});
		//el.setOpacity(0);
		//el.hide();
	}
	if (document.getElementById) {
		// document.getElementById('loading').style.visibility='hidden';
		var el = Ext.get("loading"); 
		el.fadeOut({
				duration: 1000,
				callback: function () {
					el.hide();
				}
		});
		//el.setOpacity(0);
		//el.hide();
	}

	
	/*
	window.onbeforeunload = function() {
		return "사이트를 나가시겠습니까?"; 
	};
	*/
	</script>