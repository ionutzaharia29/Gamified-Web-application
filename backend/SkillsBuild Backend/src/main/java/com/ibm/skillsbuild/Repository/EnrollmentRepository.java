package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.Course;
import com.ibm.skillsbuild.Model.CourseStatus;
import com.ibm.skillsbuild.Model.Enrollment;
import com.ibm.skillsbuild.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository <Enrollment, Long>{
    List<Enrollment> findByUserId(Long userId);
    List<Enrollment> findByUser(User user);

    boolean existsByUserIdAndEnrolledCourseId(Long userId, Long courseId);
    boolean existsByUserAndEnrolledCourse(User user, Course course);

    Optional<Enrollment> findByUserAndEnrolledCourse(User user, Course course);
    Optional<Enrollment> findByUserIdAndEnrolledCourseId(Long userId, Long courseId);

    Long countByUserAndStatus(User user, CourseStatus status);
    Long countByUserIdAndStatus(Long userId, CourseStatus status);

    @Query("SELECT e FROM Enrollment e WHERE " +
            "e.user.id = :userId AND " +
            "e.status = 'IN_PROGRESS' " +
            "ORDER BY e.startedAt DESC")
    List<Enrollment> findInProgressCourses(@Param("userId") Long userId);


    @Query("SELECT e FROM Enrollment e WHERE " +
            "e.user.id = :userId AND " +
            "e.status = 'COMPLETED' " +
            "ORDER BY e.courseCompletedAt DESC")
    List<Enrollment> findCompletedCourses(@Param("userId") Long userId);


    @Query("SELECT e FROM Enrollment e WHERE " +
            "e.user.id = :userId " +
            "ORDER BY e.enrolledAt DESC")
    List<Enrollment> findRecentEnrollments(@Param("userId") Long userId);


    List<Enrollment> findByCourseCompletedAtBetween(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    Long countByEnrolledCourseAndStatus(Course course, CourseStatus status);

    List<Enrollment> findByEnrolledCourse(Course course);

    @Query("SELECT e FROM Enrollment e WHERE " +
            "e.user.id = :userId AND " +
            "e.status = 'ENROLLED' AND " +
            "e.enrolledAt < :cutoffDate")
    List<Enrollment> findAbandonedEnrollments(
            @Param("userId") Long userId,
            @Param("cutoffDate") LocalDateTime cutoffDate
    );


}
