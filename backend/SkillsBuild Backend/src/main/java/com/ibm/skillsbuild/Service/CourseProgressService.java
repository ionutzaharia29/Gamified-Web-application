package com.ibm.skillsbuild.Service;

import com.ibm.skillsbuild.Model.CourseProgress;
import com.ibm.skillsbuild.Model.CourseStatus;
import com.ibm.skillsbuild.Model.User;
import com.ibm.skillsbuild.Repository.CourseProgressRepository;
import com.ibm.skillsbuild.Repository.CourseRepository;
import com.ibm.skillsbuild.Repository.UserRepository;
import com.ibm.skillsbuild.dto.CourseProgressResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseProgressService {

    private static final int XP_FOR_COMPLETION = 100;
    private static final int XP_PER_LEVEL = 150;

    @Autowired
    private CourseProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    /** Recalculate level and update leaderboard score when XP is awarded. */
    private void applyXpReward(User user, int xpEarned) {
        user.addXP(xpEarned);
        user.addleaderboardScore(xpEarned);
        int newLevel = 1 + (user.getXp() / XP_PER_LEVEL);
        user.setUserLevel(newLevel);
    }

    private CourseProgressResponse buildResponse(String courseId, String status, int xpEarned, User user) {
        return new CourseProgressResponse(
                courseId, status, xpEarned,
                user.getXp(), user.getUserLevel(), user.getLeaderboardScore()
        );
    }

    @Transactional
    public CourseProgressResponse updateStatus(String email, String courseId, String statusStr) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CourseStatus newStatus;
        try {
            newStatus = CourseStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status. Use IN_PROGRESS or COMPLETED.");
        }

        if (newStatus == CourseStatus.ENROLLED) {
            throw new RuntimeException("Status must be IN_PROGRESS or COMPLETED.");
        }

        Optional<CourseProgress> existing = progressRepository.findByUserAndCourseId(user, courseId);
        CourseProgress progress;
        int xpEarned = 0;

        if (existing.isPresent()) {
            progress = existing.get();

            // Cannot downgrade from COMPLETED
            if (progress.getStatus() == CourseStatus.COMPLETED) {
                return buildResponse(courseId, "COMPLETED", 0, user);
            }

            // Can only move forward: IN_PROGRESS → COMPLETED
            progress.setStatus(newStatus);

            if (newStatus == CourseStatus.COMPLETED && progress.getXpAwarded() == 0) {
                xpEarned = XP_FOR_COMPLETION;
                progress.setXpAwarded(xpEarned);
                progress.setCompletedAt(LocalDateTime.now());
                applyXpReward(user, xpEarned);
                userRepository.save(user);
                courseRepository.findByExternalId(courseId).ifPresent(course -> {
                    course.incrementTotalCompleted();
                    courseRepository.save(course);
                });
            }
        } else {
            // No existing record — only IN_PROGRESS is allowed as first step
            if (newStatus == CourseStatus.COMPLETED) {
                throw new RuntimeException("You must mark this course as In Progress before completing it.");
            }
            progress = new CourseProgress();
            progress.setUser(user);
            progress.setCourseId(courseId);
            progress.setStatus(newStatus);
            progress.setStartedAt(LocalDateTime.now());
            courseRepository.findByExternalId(courseId).ifPresent(course -> {
                course.incrementTotalEnrollments();
                courseRepository.save(course);
            });
        }

        progressRepository.save(progress);

        User updatedUser = userRepository.findByEmail(email).orElse(user);
        return buildResponse(courseId, newStatus.name(), xpEarned, updatedUser);
    }

    @Transactional
    public CourseProgressResponse enroll(String email, String courseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Idempotent: return current state if already enrolled
        Optional<CourseProgress> existing = progressRepository.findByUserAndCourseId(user, courseId);
        if (existing.isPresent()) {
            CourseProgress p = existing.get();
            return buildResponse(p.getCourseId(), p.getStatus().name(), 0, user);
        }

        CourseProgress progress = new CourseProgress();
        progress.setUser(user);
        progress.setCourseId(courseId);
        progress.setStatus(CourseStatus.IN_PROGRESS);
        progress.setStartedAt(LocalDateTime.now());
        progressRepository.save(progress);

        courseRepository.findByExternalId(courseId).ifPresent(course -> {
            course.incrementTotalEnrollments();
            courseRepository.save(course);
        });

        return buildResponse(courseId, CourseStatus.IN_PROGRESS.name(), 0, user);
    }

    public List<CourseProgressResponse> getAllProgress(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return progressRepository.findByUser(user).stream()
                .map(p -> new CourseProgressResponse(
                        p.getCourseId(),
                        p.getStatus().name(),
                        p.getXpAwarded(),
                        user.getXp(),
                        user.getUserLevel(),
                        user.getLeaderboardScore()
                ))
                .collect(Collectors.toList());
    }
}
