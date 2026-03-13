package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);

    List<User> findAllByOrderByLeaderboardScoreDesc();

    List<User> findTop10ByOrderByLeaderboardScoreDesc();

    List<User> findTop100ByOrderByLeaderboardScoreDesc();

    List<User> findByUserLevel(Integer level);

    List<User> findByLoginStreakGreaterThanEqual(Integer streak);

    @Query("SELECT u FROM User u WHERE u.xp BETWEEN :minXp AND :maxXp")
    List<User> findByXpRange(@Param("minXp") Integer minXp, @Param("maxXp") Integer maxXp);

    @Query("SELECT COUNT(u) FROM User u")
    Long countTotalUsers();

    @Query("SELECT COUNT(u) + 1 FROM User u WHERE u.leaderboardScore > :score")
    Long getUserRankByScore(Integer score);

}
