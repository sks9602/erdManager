
  
/*
    this.roomId = null;
    this.userNm = null;
    
    this.socket.onopen = function (e) {
        this.openRoom("aa", "aaa");
        
        this.sendMessage("메시지.....")
    };
    
    this.socket.onmessage = function (e) {
        console.log( e )
    }
    this.socket.onclose = function (e) {
        console.log( '연결 끊김' )
    }
     
    this.openRoom = function(roomId, userNm) {
        if( this.roomId != roomId ) {
            this.roomId = roomId;
            this.userNm = userNm;
            var jsonMsg = {"type" : "ENTER", "roomId": this.roomId , "sender": this.userNm , "msg": ""};
            
            this.socket.send(JSON.stringify(jsonMsg));
        }
    }
    
    this.sendMessage = function(msg) {
        var jsonMsg = {"type" : "TALK", "roomId": this.roomId , "sender": this.userNm, "msg": msg};
        
        this.socket.send(JSON.stringify(jsonMsg));
    }
    
    this.exitRoom = function(roomId, userNm) {
        var jsonMsg = {"type" : "QUIT", "roomId": this.roomId , "sender": this.userNm , "msg": ""};
        
        this.socket.send(JSON.stringify(jsonMsg));
    }
*/