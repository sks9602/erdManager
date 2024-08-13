package com.myframework.websocket;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatMessageVO {
    // 메시지 타입 : 입장, 채팅, 나감
    public enum MessageType {
        ENTER, START, TALK, END, QUIT
    }
    private MessageType type; // 메시지 타입
    private String roomId; // 방번호
    private String sender; // 메시지 보낸사람
    private String message; // 메시지
}