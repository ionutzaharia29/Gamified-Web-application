package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.Badge;
import com.ibm.skillsbuild.Model.BadgeCategory;
import com.ibm.skillsbuild.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Long> {

    List<Badge> findByUserId(Long userId);
    List<Badge> findByUser(User user);

    List<Badge> findByUserAndCategory(User user, BadgeCategory category);
    List<Badge> findByUserIdAndCategory(Long userId, BadgeCategory category);

    boolean existsByUserAndBadgeName(User user, String badgeName);
    boolean existsByUserIdAndBadgeName(Long userId, String badgeName);

    Long countByUser(User user);
    Long countByUserId(Long userId);

    Long countByUserAndCategory(User user, BadgeCategory category);

    List<Badge> findByUserAndRarityTier(User user, Integer rarityTier);

    List<Badge> findByUserIdAndRarityTierGreaterThanEqual(
            Long userId,
            Integer minRarity
    );

    @Query("SELECT b FROM Badge b WHERE " +
            "b.user.id = :userId " +
            "ORDER BY b.awardedAt DESC")
    List<Badge> findRecentBadges(@Param("userId") Long userId);


    @Query("SELECT b.user FROM Badge b WHERE b.badgeName= :badgeName")  // ✅ Correct field
    List<User> findUsersWithBadge(@Param("badgeName") String badgeName);

    @Query("SELECT COUNT(b) FROM Badge b")
    Long countTotalBadgesAwarded();


    @Query("SELECT b.user, COUNT(b) as badgeCount FROM Badge b " +
            "GROUP BY b.user " +
            "ORDER BY badgeCount DESC")
    List<Object[]> getBadgeLeaderboard();
}
