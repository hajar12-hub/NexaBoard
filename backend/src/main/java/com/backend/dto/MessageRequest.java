package com.backend.dto;

import lombok.Data;

@Data
public class MessageRequest {
    private String content;
    private String type; // message, decision, announcement
    private String projectId;
    private String projectName;
}
