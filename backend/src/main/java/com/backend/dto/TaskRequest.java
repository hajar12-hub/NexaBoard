package com.backend.dto;


import com.backend.model.enums.TaskPriority;
import com.backend.model.enums.TaskStatus;
import lombok.Data;

@Data
public class TaskRequest{
    private String title;
    private String description;
    private String projectId;
    private TaskStatus status;
    private TaskPriority priority;
    private String assignedId;

}
