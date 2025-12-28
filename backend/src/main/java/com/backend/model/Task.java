package com.backend.model;


import com.backend.model.enums.TaskPriority;
import com.backend.model.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String projectId;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private String assigneeId;
    private String assigneeName;
    private LocalDateTime dueDate;

    @Builder.Default  //pour éviter le fait que la date soit nulle
    private LocalDateTime createdAt = LocalDateTime.now();
}
