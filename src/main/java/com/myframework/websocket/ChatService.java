package com.myframework.websocket;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatService {

    private final ObjectMapper objectMapper;
    private Map<String, ChatRoom> chatRooms;

    @PostConstruct
    private void init() {
        chatRooms = new LinkedHashMap<>();
    }

    public List<ChatRoom> findAllRoom() {
        return new ArrayList<>(chatRooms.values());
    }

    public ChatRoom findRoomById(String roomId) {
    	ChatRoom chatRoom = chatRooms.get(roomId);
    	
    	if( chatRoom ==  null) {
    		chatRoom = createRoom(roomId);
    	}
    	
        return chatRoom;
    }

    public ChatRoom createRoom(String roomId) {
        ChatRoom chatRoom = ChatRoom.builder()
                .roomId(roomId)
                .build();
        chatRooms.put(roomId, chatRoom);
        return chatRoom;
    }
}