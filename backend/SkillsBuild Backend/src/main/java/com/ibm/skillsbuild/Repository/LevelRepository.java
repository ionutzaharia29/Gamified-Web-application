package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LevelRepository extends JpaRepository<Level, Integer> {

    Optional<Level> findByLevelNumber(Integer levelNumber);

    List<Level> findAllByOrderByLevelNumberAsc();

    @Query("SELECT l FROM Level l WHERE " +
            "l.xpRequired <= :xp " +
            "ORDER BY l.levelNumber DESC")
    List<Level> findLevelForXP(@Param("xp") Integer xp);

    @Query("SELECT l FROM Level l WHERE " +
            "l.levelNumber = :currentLevel + 1")
    Optional<Level> findNextLevel(@Param("currentLevel") Integer currentLevel);

    @Query("SELECT MAX(l.levelNumber) FROM Level l")
    Integer findMaxLevel();

    boolean existsByLevelNumber(Integer levelNumber);
}
