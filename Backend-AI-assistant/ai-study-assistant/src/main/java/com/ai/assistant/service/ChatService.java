package com.ai.assistant.service;

import com.ai.assistant.entity.ChatMessage;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessage saveChat(User user, String message, String response, String model) {
        ChatMessage chat = new ChatMessage();
        chat.setUser(user);
        chat.setMessage(message);
        chat.setResponse(response);
        chat.setModel(model);
        chat.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(chat);
    }

    public List<ChatMessage> getUserChats(User user) {
        return chatMessageRepository.findByUserOrderByTimestampDesc(user);
    }
}
