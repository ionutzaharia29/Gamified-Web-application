package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.User;
import com.ibm.skillsbuild.Model.WeeklyGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeeklyGoalRepository extends JpaRepository <WeeklyGoal, Long>{
    List<WeeklyGoal> findByUserId(Long userId);

    List<WeeklyGoal> findByUser(User user);

    @Query("SELECT wg FROM WeeklyGoal wg WHERE " +
            "wg.user.id = :userId AND " +
            "wg.weekStartDate <= :today AND " +
            "wg.weekEndDate >= :today")
    Optional<WeeklyGoal> findCurrentWeekGoal(
            @Param("userId") Long userId,
            @Param("today") LocalDate today
    );

    List<WeeklyGoal> findByUserIdAndWeekStartDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<WeeklyGoal> findByUserAndIsCompleted(User user, boolean completed);

    List<WeeklyGoal> findByUserIdAndIsCompleted(Long userId, boolean completed);

    Long countByUserAndIsCompleted(User user, Boolean completed);

    @Query("SELECT wg FROM WeeklyGoal wg WHERE " +
            "wg.user.id = :userId " +
            "ORDER BY wg.weekStartDate DESC")
    List<WeeklyGoal> findGoalHistory(@Param("userId") Long userId);

    @Query("SELECT wg FROM WeeklyGoal wg WHERE " +
            "wg.user.id = :userId AND " +
            "wg.weekEndDate >= :today " +
            "ORDER BY wg.weekStartDate ASC")
    List<WeeklyGoal> findActiveGoals(
            @Param("userId") Long userId,
            @Param("today") LocalDate today
    );
    boolean existsByUserIdAndWeekStartDate(Long userId, LocalDate weekStart);
}
