package com.ibm.skillsbuild.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NotBlank
public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private Long userId;
    private String email;
    private String fullName;
    private Integer xp;
    private Integer level;
    private Integer loginStreak;
    private Integer leaderboardScore;

    public LoginResponse(String token, Long userId, String email, String fullName, Integer xp, Integer level, Integer loginStreak, Integer leaderboardScore) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.xp = xp;
        this.level = level;
        this.loginStreak = loginStreak;
        this.leaderboardScore = leaderboardScore;
    }
}
