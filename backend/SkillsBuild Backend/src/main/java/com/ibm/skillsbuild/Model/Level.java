package com.ibm.skillsbuild.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Level {

    @Id
    @Column(name = "level_number", nullable = false)
    private Integer levelNumber;

    @Column(name = "level_title", length = 50)
    private String title;

    @Column(length = 255, name = "level_description")
    private String description;

    @Column(name = "xp_required", nullable = false)
    private Integer xpRequired;

    @Column(name = "xp_till_next_level", nullable = false)
    private Integer xpTillNextLevel;

    @Column(name = "level_badge_url", length = 100)
    private String levelBadgeUrl;

}

