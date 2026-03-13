package com.ibm.skillsbuild.Controller;

import com.ibm.skillsbuild.Model.User;
import com.ibm.skillsbuild.Service.AuthService;
import com.ibm.skillsbuild.Service.PasswordResetService;
import com.ibm.skillsbuild.dto.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest){
        try{
            String message = authService.userRegistration(registerRequest);
            return ResponseEntity.ok(new MessageResponse(message));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest){
        try {
            LoginResponse loginResponse = authService.loginUser(loginRequest);
            return ResponseEntity.ok(loginResponse);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(new MessageResponse((e.getMessage())));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
        try{
            passwordResetService.initiatePasswordReset(request.getEmail());
            return ResponseEntity.ok(new MessageResponse("Password reset link sent to your email."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Password reset link sent to your email."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        try{
            passwordResetService.resetPassword(request.getResetToken(), request.getNewPassword());
            return ResponseEntity.ok(new MessageResponse("Password reset successful. Please login with your new password."));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request){
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentEmail = ((User) authentication.getPrincipal()).getEmail();

            LoginResponse updatedUser = authService.updateProfile(currentEmail, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(@Valid @RequestBody DeleteAccountRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentEmail = ((User) authentication.getPrincipal()).getEmail();
            authService.deleteAccount(currentEmail, request.getPassword());
            return ResponseEntity.ok(new MessageResponse("Your account has been successfully deleted."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testAuth() {
        return ResponseEntity.ok(new MessageResponse("Authentication is working! You are logged in."));
    }
}