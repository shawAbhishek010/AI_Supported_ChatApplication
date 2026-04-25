package com.ai.assistant.controller;

import com.ai.assistant.dto.ChatMessageDTO;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.UserRepository;
import com.ai.assistant.service.AIService;
import com.ai.assistant.service.AnalyticsService;
import com.ai.assistant.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final AIService aiService;
    private final ChatService chatService;
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    public void handleChatMessage(@Payload ChatMessageDTO messageDTO,
                                  Principal principal,
                                  SimpMessageHeaderAccessor headerAccessor) {
        if (principal == null) {
            messagingTemplate.convertAndSendToUser(
                    headerAccessor.getSessionId(), "/queue/errors", "Authentication is required."
            );
            return;
        }

        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        String modelUsed = aiService.getProviderName();

        // Send user message back to the client (echo)
        messagingTemplate.convertAndSendToUser(
                username, "/queue/messages",
                new ServerMessage("user", messageDTO.getMessage(), modelUsed)
        );

        StringBuilder fullResponse = new StringBuilder();

        Flux<String> aiStream = aiService.streamResponse(messageDTO.getMessage(), modelUsed);

        aiStream.doOnNext(chunk -> {
            fullResponse.append(chunk);
            // Send chunk to client
            messagingTemplate.convertAndSendToUser(
                    username, "/queue/stream",
                    new StreamChunk(chunk, false)
            );
        }).doOnComplete(() -> {
            // Send completion signal
            messagingTemplate.convertAndSendToUser(
                    username, "/queue/stream",
                    new StreamChunk("", true)
            );
            // Save chat history
            chatService.saveChat(user, messageDTO.getMessage(), fullResponse.toString(), modelUsed);
            analyticsService.recordChat(user, modelUsed);
            messagingTemplate.convertAndSendToUser(
                    username, "/queue/messages",
                    new ServerMessage("assistant", fullResponse.toString(), modelUsed)
            );
        }).doOnError(error -> {
            log.error("AI streaming error", error);
            messagingTemplate.convertAndSendToUser(
                    username, "/queue/errors",
                    "Error: " + error.getMessage()
            );
        }).subscribe();
    }

    // Inner classes for WebSocket messages
    record ServerMessage(String sender, String content, String model) {}
    record StreamChunk(String chunk, boolean done) {}
}
