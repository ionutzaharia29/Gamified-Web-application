package com.ibm.skillsbuild.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String fullName, String email) {
        this.fullName = fullName;
        this.email = email;
    }

}