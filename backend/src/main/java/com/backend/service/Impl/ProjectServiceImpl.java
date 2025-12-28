package com.backend.service.Impl;

import com.backend.dto.ProjectRequest;
import com.backend.dto.ProjectResponse;
import com.backend.model.Project;
import com.backend.model.User;
import com.backend.repository.ProjectRepository;
import com.backend.repository.UserRepository;
import com.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public ProjectResponse createProject(ProjectRequest request) {
        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description("New project Nexaboard")
                .managerId(manager.getId())
                .managerName(manager.getName())
                .deadline(request.getDeadline())
                .totalProgress(0)
                .status("In Progress")
                .teamIds(new ArrayList<>())
                .build();

        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);}  //transformer l'objet projet en projectResponse

    @Override
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponse> getUserProjects(String userId) {
        // Récupérer les projets où l'utilisateur est manager ou membre de l'équipe
        List<Project> managerProjects = projectRepository.findByManagerId(userId);
        List<Project> teamProjects = projectRepository.findByTeamIdsContaining(userId);
        
        // Combiner et dédupliquer par ID
        List<Project> allProjects = new ArrayList<>(managerProjects);
        for (Project project : teamProjects) {
            boolean exists = allProjects.stream()
                    .anyMatch(p -> p.getId().equals(project.getId()));
            if (!exists) {
                allProjects.add(project);
            }
        }
        
        return allProjects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found!"));
        return mapToResponse(project);
    }

    @Override
    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }

    //méthode privée pour transformer l'entité en DTO
    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .totalProgress(project.getTotalProgress())
                .status(project.getStatus())
                .managerName(project.getManagerName())
                .managerId(project.getManagerId())
                .deadline(project.getDeadline())
                .teamSize(project.getTeamIds() != null ? project.getTeamIds().size() : 0)
                .build();
    }
}