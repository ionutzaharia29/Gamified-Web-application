package com.ibm.skillsbuild.Model;

import com.ibm.skillsbuild.Converter.CourseDurationConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String courseTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 500, name = "course_url")
    private String url;

    @Column(name = "image_url", length = 200)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty = Difficulty.BEGINNER;

    @Convert(converter = CourseDurationConverter.class)
    @Column(name = "duration_minutes", nullable = false)
    private CourseDuration duration = CourseDuration.zero();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category courseCategory;

    @Column(nullable = false, name = "xp_reward")
    private Integer xpReward = 100;

    @Column(nullable = false, name = "score_reward")
    private Integer scoreReward = 0;

    @Column(nullable = false, name = "total_enrolled")
    private Integer totalEnrollments = 0;

    @Column(nullable = false, name = "total_completed")
    private Integer totalCompleted = 0;

    @Column(name = "external_id", unique = true, length = 100)
    private String externalId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ToString.Exclude
    @OneToMany(mappedBy = "enrolledCourse", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "savedCourse", cascade = CascadeType.ALL)
    private List<Bookmark> bookmarks = new ArrayList<>();

    @PrePersist
    protected void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }

    public void incrementTotalEnrollments(){
        this.totalEnrollments++;
    }

    public void incrementTotalCompleted(){
        this.totalCompleted++;
    }

}
