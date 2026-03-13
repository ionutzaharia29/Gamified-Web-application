package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.Category;
import com.ibm.skillsbuild.Model.Course;
import com.ibm.skillsbuild.Model.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByExternalId(String externalId);

    List<Course> findByCourseCategory(Category category);

    List<Course> findByCourseCategoryCategoryName(String categoryName);

    List<Course> findByDifficulty(Difficulty difficultyLevel);

    List<Course> findByCourseTitleContainingIgnoreCase(String keyword);

    @Query("SELECT c FROM Course c WHERE " +
            "LOWER(c.courseTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Course> searchCourseByKeyword(@Param("keyword") String keyword);

    List<Course> findTop10ByOrderByTotalEnrollmentsDesc();

    List<Course> findTop10ByOrderByCreatedAtDesc();

    List<Course> findByDifficultyAndCourseCategory(Difficulty difficulty, Category category);

    @Query("SELECT c FROM Course c WHERE " +
            "c.totalEnrollments > 0 AND " +
            "(c.totalCompleted * 100.0) / c.totalEnrollments >= :minRate " +
            "ORDER BY c.totalCompleted DESC")
    List<Course> findCoursesWithCompletionRateAbove(@Param("minRate") Double minRate);

    Long countByCourseCategory(Category category);

    @Query("SELECT c FROM Course c WHERE " +
            "c.difficulty IN ('BEGINNER', 'INTERMEDIATE') " +
            "ORDER BY c.totalEnrollments DESC")
    List<Course> findRecommendedCourses();

}
