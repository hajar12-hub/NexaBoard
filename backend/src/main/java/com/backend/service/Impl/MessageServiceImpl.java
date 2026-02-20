package com.backend.service.Impl;

import com.backend.dto.MessageRequest;
import com.backend.dto.MessageResponse;
import com.backend.model.Message;
import com.backend.repository.MessageRepository;
import com.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    @Override
    public MessageResponse createMessage(String userId, String userName, String userRole, MessageRequest request) {
        Message message = Message.builder()
                .senderId(userId)
                .senderName(userName)
                .senderRole(userRole)
                .content(request.getContent())
                .type(request.getType() != null ? request.getType() : "message")
                .projectId(request.getProjectId())
                .projectName(request.getProjectName())
                .build();
        return toResponse(messageRepository.save(message));
    }

    @Override
    public List<MessageResponse> getAllMessages() {
        return messageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessagesByProject(String projectId) {
        return messageRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse toResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .senderId(m.getSenderId())
                .senderName(m.getSenderName())
                .senderRole(m.getSenderRole())
                .content(m.getContent())
                .type(m.getType())
                .projectId(m.getProjectId())
                .projectName(m.getProjectName())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
