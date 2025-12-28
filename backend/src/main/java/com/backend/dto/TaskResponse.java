package com.backend.dto;

import com.backend.model.enums.TaskPriority;
import com.backend.model.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private String assigneeName;
    private String projectId;
}
