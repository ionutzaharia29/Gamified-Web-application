package com.ibm.skillsbuild.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotBlank(message = "Email must not be empty")
    @Email(message = "Please provide a valid email address")
    private String email;
}
