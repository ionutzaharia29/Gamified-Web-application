package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.CourseProgress;
import com.ibm.skillsbuild.Model.CourseStatus;
import com.ibm.skillsbuild.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {

    Optional<CourseProgress> findByUserAndCourseId(User user, String courseId);

    List<CourseProgress> findByUser(User user);

    long countByUserAndStatus(User user, CourseStatus status);

    void deleteByUser(User user);
}
