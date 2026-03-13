package com.ibm.skillsbuild.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "target_courses")
    private Integer targetCourses = 1;

    @Column(name = "target_xp")
    private Integer targetXp = 100;

    @Column(name = "current_courses")
    private Integer currentCourses = 0;

    @Column(name = "current_xp")
    private Integer currentXp = 0;

    @Column(name = "week_start_date")
    private LocalDate weekStartDate;

    @Column(name = "week_end_date")
    private LocalDate weekEndDate;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;


    @PrePersist
    protected void calculateWeekEnd(){
        if(this.weekStartDate != null) {
        this.weekEndDate = this.weekStartDate.plusDays(6);
        }
    }

    public int getProgressPercentage(){
        int courseProgress = targetCourses == 0 ? 0 : (currentCourses * 100) / targetCourses;
        int xpProgress = targetXp == 0 ? 0 : (currentXp * 100) / targetXp;
        return (courseProgress + xpProgress) / 2;
    }

    public void updateProgress(int coursesCompleted, int xpEarned){
        this.currentCourses = coursesCompleted;
        this.currentXp = xpEarned;
        checkIfGoalMet();
    }

    private void checkIfGoalMet(){
        if(this.currentCourses >= this.targetCourses && this.currentXp >= this.targetXp){
            this.isCompleted = true;
        }
    }

}
