package com.ibm.skillsbuild.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseProgressRequest {

    @NotBlank(message = "Status must not be empty")
    private String status; // "IN_PROGRESS" or "COMPLETED"
}
