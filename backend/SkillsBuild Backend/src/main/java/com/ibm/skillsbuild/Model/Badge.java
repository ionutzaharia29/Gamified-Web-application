package com.ibm.skillsbuild.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 255)
    private String description;

    @Column(nullable = false, length = 50)
    private String badgeName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "category")
    private BadgeCategory category;

    @Column(length = 100, name = "badge_icon_url")
    private String iconImagePath;

    @Column(nullable = false, name = "rarity_level")
    private Integer rarityTier = 1;

    @Column(name = "awarded_date", nullable = false)
    private LocalDateTime awardedAt;

    @PrePersist
    protected void setAwardTimestamp() {
        this.awardedAt = LocalDateTime.now();

}

}


