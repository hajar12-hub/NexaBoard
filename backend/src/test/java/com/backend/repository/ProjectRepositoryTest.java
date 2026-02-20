package com.backend.repository;

import com.backend.model.Project;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest   //Lance un MongoDB léger pour le test
class ProjectRepositoryTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void shouldFindProjectsByManagerId() {
        // Given
        Project project = Project.builder()
                .name("Test Project")
                .managerId("manager_123")
                .build();
        projectRepository.save(project);

        // When
        List<Project> found = projectRepository.findByManagerId("manager_123");

        // Then
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getName()).isEqualTo("Test Project");
    }
}
