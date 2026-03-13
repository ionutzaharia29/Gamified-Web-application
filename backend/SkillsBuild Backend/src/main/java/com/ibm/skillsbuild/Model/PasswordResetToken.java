package com.ibm.skillsbuild.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table( name = "password_reset_tokens")
@Data
@NoArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String resetToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expirationTime;

    @Column(nullable = false)
    private boolean isUsed;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public PasswordResetToken(User user, String resetToken) {
        this.user = user;
        this.resetToken = resetToken;
        this.expirationTime = LocalDateTime.now().plusHours(24);
        this.createdAt = LocalDateTime.now();
        this.isUsed = false;
    }

    public boolean isExpired(){
        return LocalDateTime.now().isAfter(expirationTime);
    }
}
