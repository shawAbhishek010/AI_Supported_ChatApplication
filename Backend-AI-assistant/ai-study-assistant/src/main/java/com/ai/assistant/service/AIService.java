package com.ai.assistant.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class AIService {

    private final OllamaClient ollamaClient;

    public Flux<String> streamResponse(String message, String model) {
        return ollamaClient.streamResponse(message);
    }

    public String getProviderName() {
        return "ollama";
    }
}
