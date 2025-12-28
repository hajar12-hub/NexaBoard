package com.backend.repository;

import com.backend.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByManagerId(String managerId);
    List<Project> findByTeamIdsContaining(String userId);
}
