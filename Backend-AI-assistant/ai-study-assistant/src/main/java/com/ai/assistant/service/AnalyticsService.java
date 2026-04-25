package com.ai.assistant.service;

import com.ai.assistant.entity.Analytics;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.AnalyticsRepository;
import com.ai.assistant.repository.ChatMessageRepository;
import com.ai.assistant.repository.SavedNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final SavedNoteRepository savedNoteRepository;

    public void recordChat(User user, String model) {
        LocalDate today = LocalDate.now();
        Optional<Analytics> opt = analyticsRepository.findByUserAndDate(user, today);
        Analytics analytics = opt.orElseGet(() -> {
            Analytics a = new Analytics();
            a.setUser(user);
            a.setDate(today);
            return a;
        });
        analytics.setTotalChats(analytics.getTotalChats() + 1);
        analytics.setOllamaUsage(analytics.getOllamaUsage() + 1);
        analyticsRepository.save(analytics);
    }

    public com.ai.assistant.dto.DashboardDTO getDashboardStats(User user) {
        long totalChats = chatMessageRepository.countByUser(user);
        long totalNotes = savedNoteRepository.countByUser(user);
        long ollamaCount = chatMessageRepository.countByUserAndModel(user, "ollama");

        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        long todayChats = analyticsRepository.findByUserAndDate(user, today)
                .map(Analytics::getTotalChats).orElse(0);
        long weekChats = analyticsRepository.findByUserAndDateBetween(user, weekAgo, today)
                .stream().mapToInt(Analytics::getTotalChats).sum();

        return com.ai.assistant.dto.DashboardDTO.builder()
                .totalChats(totalChats)
                .totalNotes(totalNotes)
                .ollamaCount(ollamaCount)
                .todayChats(todayChats)
                .weekChats(weekChats)
                .build();
    }
}
