package com.ibm.skillsbuild.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "course_progress")  // Changed from 'progress'
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progress {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "course_enrollment_id")
    private Enrollment courseEnrollment;

    @Column(nullable = false, name = "percentage_completed")
    private Integer percentageCompleted = 0;

    @Column(nullable = false, name = "modules_completed")
    private Integer modulesCompleted = 0;

    @Column(nullable = false, name = "total_modules")
    private Integer totalModules = 0;

    @Column(name = "bookmarked_position", length = 500)
    private String bookmarkedPosition;

    @Column(name = "minutes_spent")
    private Integer minutesSpent = 0;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void setUpdatedAt() {
        this.updatedAt = LocalDateTime.now();
        this.lastAccessed = LocalDateTime.now();
    }

    public void updateProgress(int percentageCompleted, int modulesCompleted){
        this.percentageCompleted = percentageCompleted;
        this.modulesCompleted = modulesCompleted;
    }

    public void addMinutesSpent(int minutesSpent){
        this.minutesSpent += minutesSpent;
    }
}

