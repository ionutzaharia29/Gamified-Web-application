package com.ibm.skillsbuild.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Full name must not be empty")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email must not be empty")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password must not be empty")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$",
        message = "Password must contain at least one uppercase letter, one number, and one special character"
    )
    private String password;
}
