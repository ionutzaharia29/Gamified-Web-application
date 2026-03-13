package com.ibm.skillsbuild.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressResponse {

    private String courseId;
    private String status;          // "IN_PROGRESS" or "COMPLETED"
    private int xpAwarded;          // XP earned by this action (0 if none)
    private int totalXp;            // User's updated total XP
    private int level;              // User's updated level
    private int leaderboardScore;   // User's updated leaderboard score
}
