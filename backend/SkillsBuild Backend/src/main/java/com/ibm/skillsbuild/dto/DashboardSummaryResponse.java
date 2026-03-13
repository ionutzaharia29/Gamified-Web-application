package com.ibm.skillsbuild.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DashboardSummaryResponse {

    // Placeholders for the XP and level logic
    private int currentLevel;
    private int totalXp;
    private int coursesCompleted;
    private int badgesEarned;

    public DashboardSummaryResponse() {}

    public DashboardSummaryResponse(int currentLevel, int totalXp, int coursesCompleted, int badgesEarned) {
        this.currentLevel = currentLevel;
        this.totalXp = totalXp;
        this.coursesCompleted = coursesCompleted;
        this.badgesEarned = badgesEarned;
    }


}

