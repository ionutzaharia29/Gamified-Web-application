package com.ibm.skillsbuild.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false , length = 100)
    private String fullName;

    @Column(unique = true , nullable = false , length = 100)
    private String email;

    @Column(nullable = false , length = 255)
    private String password;

    @Column(nullable = false, name = "login_streak")
    private Integer loginStreak = 0;

    @Column(nullable = false, name = "user_level")
    private Integer userLevel = 1;

    @Column(nullable = false, name = "leaderboard_score")
    private Integer leaderboardScore = 0;

    @Column(nullable = false, name = "xp")
    private Integer xp = 0;

    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Enrollment> courseEnrollments = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Badge> earnedBadges = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmark> savedCourses = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WeeklyGoal> learningGoals = new ArrayList<>();


    @PrePersist
    protected void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }

    public void addXP(int points){
        this.xp += points;
    }

    public void addleaderboardScore(int points){
        this.leaderboardScore += points;
    }

    public void incrementLoginStreak(){
        this.loginStreak++;
    }
    public void resetLoginStreak(){
        this.loginStreak = 0;
    }








}
