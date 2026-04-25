package com.ai.assistant.dto;

import com.ai.assistant.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatHistoryDTO {
    private Long id;
    private String message;
    private String response;
    private String model;
    private LocalDateTime timestamp;

    public static ChatHistoryDTO fromEntity(ChatMessage chatMessage) {
        return new ChatHistoryDTO(
                chatMessage.getId(),
                chatMessage.getMessage(),
                chatMessage.getResponse(),
                chatMessage.getModel(),
                chatMessage.getTimestamp()
        );
    }
}
