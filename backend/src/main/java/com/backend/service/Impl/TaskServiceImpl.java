package com.backend.service.Impl;

import com.backend.dto.TaskRequest;
import com.backend.dto.TaskResponse;
import com.backend.model.Task;
import com.backend.model.User;
import com.backend.model.enums.TaskStatus;
import com.backend.repository.TaskRepository;
import com.backend.repository.UserRepository;
import com.backend.service.TaskService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TaskServiceImpl implements TaskService{

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;


    @Override
    public TaskResponse createTask(TaskRequest request) {
        String assigneeName = "Unassigned";
        if(request.getAssignedId() != null && !request.getAssignedId().isEmpty()){
            User assignee = userRepository.findById(request.getAssignedId()).orElse(null);
            if(assignee != null){
                assigneeName = assignee.getName();
            }
        }
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .projectId(request.getProjectId())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority())
                .assigneeId(request.getAssignedId())
                .assigneeName(assigneeName)
                .build();
        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public List<TaskResponse> getTasksByProject(String projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getUserTasks(String userId) {
        return taskRepository.findByAssigneeId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse updateTaskStatus(String taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(()-> new RuntimeException("task not find!"));
        task.setStatus(newStatus);
        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(String taskId) {
        taskRepository.deleteById(taskId);
    }

    private TaskResponse mapToResponse(Task task){
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .assigneeName(task.getAssigneeName())
                .projectId(task.getProjectId())
                .build();
    }
}
