package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.Enrollment;
import com.ibm.skillsbuild.Model.Progress;
import org.hibernate.boot.jaxb.mapping.spi.JaxbPersistentAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    Optional<Progress> findByCourseEnrollmentId(Long enrollmentId);
    Optional<Progress> findByCourseEnrollment(Enrollment enrollment);

    @Query("SELECT p FROM Progress p WHERE " +
            "p.courseEnrollment.user.id = :userId AND " +
            "p.courseEnrollment.enrolledCourse.id = :courseId")
    Optional<Progress> findByUserAndCourse(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId
    );

    @Query("SELECT p FROM Progress p WHERE " +
            "p.courseEnrollment.user.id = :userId")
    List<Progress> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Progress p WHERE " +
            "p.courseEnrollment.user.id = :userId AND " +
            "p.percentageCompleted >= :threshold " +
            "ORDER BY p.percentageCompleted DESC")
    List<Progress> findProgressAboveThreshold(
            @Param("userId") Long userId,
            @Param("threshold") Integer threshold
    );

    @Query("SELECT SUM(p.minutesSpent) FROM Progress p WHERE " +
            "p.courseEnrollment.user.id = :userId")
    Long getTotalStudyTime(@Param("userId") Long userId);


    @Query("SELECT AVG(p.percentageCompleted) FROM Progress p WHERE " +
            "p.courseEnrollment.user.id = :userId")
    Double getAverageCompletionPercentage(@Param("userId") Long userId);

    boolean existsByCourseEnrollment(Enrollment enrollment);
}

