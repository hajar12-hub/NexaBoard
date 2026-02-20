package com.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private String type; // message, decision, announcement
    private String projectId;
    private String projectName;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
