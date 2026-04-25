package com.ai.assistant.controller;

import com.ai.assistant.dto.ChatHistoryDTO;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.UserRepository;
import com.ai.assistant.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ChatHistoryDTO>> getHistory(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        List<ChatHistoryDTO> history = chatService.getUserChats(user)
                .stream()
                .map(ChatHistoryDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(history);
    }
}
