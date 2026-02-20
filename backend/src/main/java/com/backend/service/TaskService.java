package com.backend.service;

import com.backend.dto.TaskRequest;
import com.backend.dto.TaskResponse;
import com.backend.model.Task;
import com.backend.model.enums.TaskStatus;

import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest request);
    TaskResponse updateTask(String taskId, TaskRequest request);
    List<TaskResponse> getTasksByProject(String projectId);
    List<TaskResponse> getUserTasks(String userId);
    TaskResponse updateTaskStatus(String taskId, TaskStatus newStatus);
    void deleteTask(String taskId);
}