package com.ai.assistant.repository;

import com.ai.assistant.entity.ChatMessage;
import com.ai.assistant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserOrderByTimestampDesc(User user);
    long countByUser(User user);
    long countByUserAndModel(User user, String model);
}