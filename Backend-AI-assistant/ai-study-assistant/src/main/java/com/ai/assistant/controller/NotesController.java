package com.ai.assistant.controller;

import com.ai.assistant.dto.NoteDTO;
import com.ai.assistant.entity.SavedNote;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.SavedNoteRepository;
import com.ai.assistant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NotesController {

    private final SavedNoteRepository noteRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SavedNote>> getAllNotes(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(noteRepository.findByUserOrderByCreatedAtDesc(user));
    }

    @PostMapping
    public ResponseEntity<SavedNote> createNote(@RequestBody NoteDTO noteDTO,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        SavedNote note = new SavedNote();
        note.setUser(user);
        note.setTitle(noteDTO.getTitle());
        note.setContent(noteDTO.getContent());
        return ResponseEntity.ok(noteRepository.save(note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavedNote> updateNote(@PathVariable Long id,
                                                @RequestBody NoteDTO noteDTO,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        SavedNote note = noteRepository.findById(id).orElseThrow();
        if (!note.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        note.setTitle(noteDTO.getTitle());
        note.setContent(noteDTO.getContent());
        note.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(noteRepository.save(note));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        SavedNote note = noteRepository.findById(id).orElseThrow();
        if (!note.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        noteRepository.delete(note);
        return ResponseEntity.noContent().build();
    }
}