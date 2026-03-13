package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository <Category, Long>{
    Optional<Category> findByCategoryName(String categoryName);

    boolean existsByCategoryName(String categoryName);

    List<Category> findAllByOrderByCategoryNameAsc();

    @Query("SELECT DISTINCT c FROM Category c " +
            "JOIN c.coursesInCategory " +
            "ORDER BY c.categoryName")
    List<Category> findCategoriesWithCourses();


    @Query("SELECT c.categoryName, COUNT(co) FROM Category c " +
            "LEFT JOIN c.coursesInCategory co " +
            "GROUP BY c.categoryName")
    List<Object[]> countCoursesPerCategory();
}
