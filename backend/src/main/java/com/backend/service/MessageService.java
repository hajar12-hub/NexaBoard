package com.backend.service;

import com.backend.dto.MessageRequest;
import com.backend.dto.MessageResponse;

import java.util.List;

public interface MessageService {
    MessageResponse createMessage(String userId, String userName, String userRole, MessageRequest request);
    List<MessageResponse> getAllMessages();
    List<MessageResponse> getMessagesByProject(String projectId);
}
