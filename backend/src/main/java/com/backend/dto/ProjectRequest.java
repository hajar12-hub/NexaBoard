package com.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectRequest {
    private String name;
    private String managerId;
    private LocalDate deadline;
}
