package com.backend.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Data
@Builder
public class ProjectResponse {
    private String id;
    private String name;
    private String description;
    private int totalProgress;
    private String status;
    private String managerName;
    private String managerId;
    private LocalDate deadline;
    private int teamSize;
}
