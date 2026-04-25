package com.ai.assistant.repository;

import com.ai.assistant.entity.SavedNote;
import com.ai.assistant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedNoteRepository extends JpaRepository<SavedNote, Long> {
    List<SavedNote> findByUserOrderByCreatedAtDesc(User user);
    long countByUser(User user);
}