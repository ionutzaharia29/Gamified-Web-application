package com.ibm.skillsbuild.Service;

import com.ibm.skillsbuild.Model.PasswordResetToken;
import com.ibm.skillsbuild.Model.User;
import com.ibm.skillsbuild.Repository.PasswordResetTokenRepository;
import com.ibm.skillsbuild.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;


    public void initiatePasswordReset(String email){
        User user = userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("Email address not found. Make sure it's correct and try again"));

        String resetToken = UUID.randomUUID().toString();

        PasswordResetToken token = new PasswordResetToken(user, resetToken);
        tokenRepository.save(token);

        sendResetEmail(user, resetToken);
    }

    private void sendResetEmail(User user, String resetToken){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText("your reset code for your password: " + resetToken);
        try {
            mailSender.send(message);
        }catch (Exception e){
            throw new RuntimeException("Email could not be sent. Please try again later.");
        }
    }

    @Transactional
    public void resetPassword(String resetToken, String newPassword){
        PasswordResetToken token = tokenRepository.findByResetToken(resetToken).orElseThrow(()-> new RuntimeException("Invalid token. Please try again."));

        if(token.isExpired()){
            throw new RuntimeException("Token is expired. Please request a new reset link.");
        }

        if (token.isUsed()){
            throw new RuntimeException("Token has already been used. Please request a new reset link.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }
}
