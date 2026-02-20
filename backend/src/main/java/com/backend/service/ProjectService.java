package com.backend.service;

import com.backend.dto.ProjectRequest;
import com.backend.dto.ProjectResponse;
import com.backend.dto.ProjectUpdateRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface ProjectService {
    ProjectResponse createProject(ProjectRequest request);
    ProjectResponse updateProject(String id, ProjectUpdateRequest request);
    List<ProjectResponse> getAllProjects();
    List<ProjectResponse> getUserProjects(String userId);
    ProjectResponse getProjectById(String id);
    void deleteProject(String id);
}
