package com.ibm.skillsbuild.Service;

import com.ibm.skillsbuild.Model.User;
import com.ibm.skillsbuild.Repository.CourseProgressRepository;
import com.ibm.skillsbuild.Repository.PasswordResetTokenRepository;
import com.ibm.skillsbuild.Repository.UserRepository;
import com.ibm.skillsbuild.Security.JwtTokenProvider;
import com.ibm.skillsbuild.dto.LoginRequest;
import com.ibm.skillsbuild.dto.LoginResponse;
import com.ibm.skillsbuild.dto.RegisterRequest;
import com.ibm.skillsbuild.dto.UpdateProfileRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private CourseProgressRepository courseProgressRepository;


    public String userRegistration(RegisterRequest registerRequest){

        if (userRepository.existsByEmail(registerRequest.getEmail())){
            throw new RuntimeException("This email address is already in use. Please sign in with your existing account or use a different email address.");
        }

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        user.setXp(0);
        user.setLeaderboardScore(0);
        user.setUserLevel(1);
        user.setLoginStreak(0);

        userRepository.save(user);

        return "Your account has been created successfully. You may now sign in using your credentials.";
    }

    public LoginResponse loginUser(LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()-> new RuntimeException("Invalid username/password supplied"));

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid username/password supplied");
        }

        updateLoginStreak(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return new LoginResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getXp(), user.getUserLevel(), user.getLoginStreak(), user.getLeaderboardScore());
    }

    public LoginResponse updateProfile(String currentEmail, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found."));

        // Check if new email is already taken by someone else
        if (!currentEmail.equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("This email address is already in use.");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        userRepository.save(user);

        // Return updated user info — generate new token if email changed
        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new LoginResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getXp(), user.getUserLevel(), user.getLoginStreak(), user.getLeaderboardScore());
    }

    @Transactional
    public void deleteAccount(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Incorrect password. Please try again.");
        }

        // Delete entities not covered by User cascade (no cascade config on User side)
        passwordResetTokenRepository.deleteByUser(user);
        courseProgressRepository.deleteByUser(user);

        // Delete user — cascades: Enrollments → Progress, Badges, Bookmarks, WeeklyGoals
        userRepository.delete(user);
    }

    private void updateLoginStreak(User user){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastLoginTime = user.getLastLoginTime();

        if(lastLoginTime == null){
            user.setLoginStreak(1);
        }else{
            LocalDate today = now.toLocalDate();
            LocalDate lastLoginDate = lastLoginTime.toLocalDate();

            if(lastLoginDate.isEqual(today)){
                return;
            }else if (lastLoginDate.isEqual(today.minusDays(1))){
                user.incrementLoginStreak();
            }else{
                user.resetLoginStreak();
                user.setLoginStreak(1);
            }
        }

        user.setLastLoginTime(now);
        userRepository.save(user);
    }
}