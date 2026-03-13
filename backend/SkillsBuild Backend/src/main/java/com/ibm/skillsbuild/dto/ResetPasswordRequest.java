package com.ibm.skillsbuild.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank(message = "Reset code must not be empty")
    private String resetToken;

    @NotBlank(message = "New password must not be empty")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$",
        message = "Password must contain at least one uppercase letter, one number, and one special character"
    )
    private String newPassword;
}
