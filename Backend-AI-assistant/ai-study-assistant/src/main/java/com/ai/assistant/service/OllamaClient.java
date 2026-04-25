package com.ai.assistant.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OllamaClient {

    @Value("${ollama.base-url}")
    private String baseUrl;

    @Value("${ollama.chat.model}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Flux<String> streamResponse(String prompt) {
        WebClient client = WebClient.builder().build();
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "stream", true
        );

        return client.post()
                .uri(baseUrl + "/api/chat")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToFlux(String.class)
                .filter(line -> !line.trim().isEmpty())
                .map(line -> {
                    try {
                        JsonNode node = objectMapper.readTree(line);
                        if (node.has("message")) {
                            return node.get("message").get("content").asText();
                        }
                        return "";
                    } catch (Exception e) {
                        return "";
                    }
                });
    }
}