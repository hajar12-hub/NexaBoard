package com.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {
    private String id;
    private String senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private String type;
    private String projectId;
    private String projectName;
    private LocalDateTime createdAt;
}
