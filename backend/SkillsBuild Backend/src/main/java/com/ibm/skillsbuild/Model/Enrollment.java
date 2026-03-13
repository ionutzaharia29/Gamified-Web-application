package com.ibm.skillsbuild.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "enrollments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course enrolledCourse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "enrollment_status")
    private CourseStatus status = CourseStatus.ENROLLED;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime courseCompletedAt;

    @OneToOne(orphanRemoval = true, cascade = CascadeType.ALL, mappedBy = "courseEnrollment")
    private Progress progress;


    @PrePersist
    protected void setEnrolledAt() {
        this.enrolledAt = LocalDateTime.now();
    }

    public void markAsStarted(){
        this.status = CourseStatus.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }
    public void markAsCompleted(){
        this.status = CourseStatus.COMPLETED;
        this.courseCompletedAt = LocalDateTime.now();
    }
}


