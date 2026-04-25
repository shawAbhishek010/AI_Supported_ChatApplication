package com.ai.assistant.repository;

import com.ai.assistant.entity.Analytics;
import com.ai.assistant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    Optional<Analytics> findByUserAndDate(User user, LocalDate date);
    List<Analytics> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}