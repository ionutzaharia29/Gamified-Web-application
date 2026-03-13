package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.Bookmark;
import com.ibm.skillsbuild.Model.Course;
import com.ibm.skillsbuild.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository <Bookmark, Long>{

    List<Bookmark> findByUser(User user);

    List<Bookmark> findByUserId(Long userId);

    @Query("SELECT b FROM Bookmark b WHERE " + "b.user.id = :userId" + " ORDER BY b.createdAt DESC")
    List<Bookmark> findRecentBookmarks(@Param("userId") Long userId);

    boolean existsByUserAndSavedCourse(User user, Course course);
    boolean existsByUserIdAndSavedCourseId(Long userId, Long courseId);

    Optional<Bookmark> findByUserAndSavedCourse(User user, Course course);
    Optional<Bookmark> findByUserIdAndSavedCourseId(Long userId, Long courseId);

    Long countByUser(User user);

    Long countByUserId(Long userId);

    Long countBySavedCourse(Course course);

    Long countBySavedCourseId(Long courseId);

    @Query("SELECT b FROM Bookmark b WHERE " +
            "b.user.id = :userId AND " +
            "b.savedCourse.courseCategory.categoryName= :categoryName")
    List<Bookmark> findBookmarksByCategory(
            @Param("userId") Long userId,
            @Param("categoryName") String categoryName
    );

    void deleteByUserIdAndSavedCourseId(Long userId, Long courseId);


}
