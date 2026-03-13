package com.ibm.skillsbuild.Controller;

import com.ibm.skillsbuild.Model.User;
import com.ibm.skillsbuild.Service.CourseProgressService;
import com.ibm.skillsbuild.dto.CourseProgressRequest;
import com.ibm.skillsbuild.dto.CourseProgressResponse;
import com.ibm.skillsbuild.dto.MessageResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CourseProgressController {

    @Autowired
    private CourseProgressService courseProgressService;

    private String resolveEmail(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return null;
        }
        return ((User) auth.getPrincipal()).getEmail();
    }

    /**
     * Update the progress status of a course for the authenticated user.
     * POST /api/progress/{courseId}
     * Body: { "status": "IN_PROGRESS" | "COMPLETED" }
     */
    @PostMapping("/{courseId}")
    public ResponseEntity<?> updateProgress(
            @PathVariable String courseId,
            @Valid @RequestBody CourseProgressRequest request
    ) {
        String email = resolveEmail(SecurityContextHolder.getContext().getAuthentication());
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        try {
            CourseProgressResponse response = courseProgressService.updateStatus(email, courseId, request.getStatus());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Enroll the authenticated user in a course.
     * POST /api/progress/{courseId}/enroll
     * Sets status to IN_PROGRESS. Idempotent: returns current state if already enrolled.
     */
    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<?> enroll(@PathVariable String courseId) {
        String email = resolveEmail(SecurityContextHolder.getContext().getAuthentication());
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        try {
            CourseProgressResponse response = courseProgressService.enroll(email, courseId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Get all course progress entries for the authenticated user.
     * GET /api/progress
     */
    @GetMapping
    public ResponseEntity<?> getProgress() {
        String email = resolveEmail(SecurityContextHolder.getContext().getAuthentication());
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Unauthorized"));
        }
        try {
            List<CourseProgressResponse> progress = courseProgressService.getAllProgress(email);
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
