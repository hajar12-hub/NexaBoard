package com.backend.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String name;
    private String description;
    private int totalProgress;
    private String status;
    private String managerId;
    private String managerName;

    private List<String> teamIds = new ArrayList<>();
    private LocalDate deadline;   //la date d'échance
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

}
