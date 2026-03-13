package com.ibm.skillsbuild.Repository;

import com.ibm.skillsbuild.Model.PasswordResetToken;
import com.ibm.skillsbuild.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByResetToken(String resetToken);

    void deleteByExpirationTimeBefore(LocalDateTime now);

    void deleteByUser(User user);
}
