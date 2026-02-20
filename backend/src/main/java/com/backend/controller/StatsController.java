package com.backend.controller;

import com.backend.repository.MessageRepository;
import com.backend.repository.ProjectRepository;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @GetMapping
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of(
                "projects", projectRepository.count(),
                "members", userRepository.count(),
                "messages", messageRepository.count()
        ));
    }
}
