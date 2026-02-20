package com.backend.controller;

import com.backend.dto.MessageRequest;
import com.backend.dto.MessageResponse;
import com.backend.model.User;
import com.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MessageResponse>> getByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(messageService.getMessagesByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<MessageResponse> create(@RequestBody MessageRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(messageService.createMessage(
                user.getId(),
                user.getName(),
                user.getRole().name().toLowerCase(),
                request
        ));
    }
}
