package org.example.quickcourtbackend.services;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.example.quickcourtbackend.dtos.LoginRequestDto;
import org.example.quickcourtbackend.dtos.SignUpRequestDto;
import org.example.quickcourtbackend.repositories.UserRepository;
import org.example.quickcourtbackend.enums.UserRole;
import org.example.quickcourtbackend.models.User;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AuthService{

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    public AuthService(UserRepository userRepository, AuthenticationManager authenticationManager, 
                      JWTService jwtService, PasswordEncoder passwordEncoder, OtpService otpService) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
    }

    public User createUser(SignUpRequestDto userDto) {
        log.info("Creating new user with email: {}", userDto.getEmail());
        
        // Validate input
        if (!userDto.isValid()) {
            throw new IllegalArgumentException("All required fields must be provided");
        }
        
        if (!userDto.isEmailValid()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        if (!userDto.isPasswordStrong()) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());

        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = User.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .role(UserRole.valueOf(userDto.getRole()))
                .phoneNumber(userDto.getPhoneNumber())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    public Optional<User> validateUser(LoginRequestDto userDto, HttpServletResponse response) {
        log.info("Validating user login for email: {}", userDto.getEmail());
        Optional<User> user = userRepository.findByEmail(userDto.getEmail());
        // Validate input
        if (!userDto.isValid()) {
            log.warn("Invalid login request data for email: {}", userDto.getEmail());
            throw new RuntimeException("Invalid login request data for email");
        }
        
        if (!userDto.isEmailValid()) {
            log.warn("Invalid email format for login: {}", userDto.getEmail());
            throw new RuntimeException("Invalid email format for login");
        }
        
        try {
            // Use email for authentication to maintain consistency
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword())
            );

            if (authentication.isAuthenticated()) {
                String token = jwtService.createToken(userDto.getEmail());

                ResponseCookie cookie = ResponseCookie.from("JwtToken", token)
                        .httpOnly(true)
                        .secure(false) // Set to true in production with HTTPS
                        .path("/")
                        .maxAge(7 * 24 * 3600) // 7 days in seconds
                        .sameSite("Lax") // Add SameSite for better security
                        .build();

                response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                log.info("User login successful for email: {}", userDto.getEmail());
                return user;
            }
        } catch (BadCredentialsException e) {
            log.warn("Invalid credentials for email: {}", userDto.getEmail());
        } catch (Exception e) {
            log.error("Authentication error for email: {}", userDto.getEmail(), e);
        }
        throw new RuntimeException("Invalid login request data for email");
    }
    
    public String initiateOtpLogin(String email) {
        log.info("Initiating OTP login for email: {}", email);
        
        // Check if user exists
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            log.warn("OTP login attempted for non-existent email: {}", email);
            throw new IllegalArgumentException("User not found with this email");
        }
        
        // Generate and send OTP
        boolean otpSent = otpService.sendOtp(email);
        if (!otpSent) {
            log.error("Failed to send OTP for email: {}", email);
            throw new RuntimeException("Failed to send OTP");
        }
        
        log.info("OTP sent successfully to email: {}", email);
        return "OTP sent successfully to your email"; // Return success message instead of OTP
    }
    
    public Boolean verifyOtpAndLogin(String email, String otp, HttpServletResponse response) {
        log.info("Verifying OTP for email: {}", email);
        
        // Verify OTP
        if (!otpService.verifyOtp(email, otp)) {
            log.warn("Invalid OTP for email: {}", email);
            return false;
        }
        
        // Check if user exists
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            log.warn("OTP verified but user not found for email: {}", email);
            return false;
        }
        
        // Generate JWT token
        String token = jwtService.createToken(email);
        
        ResponseCookie cookie = ResponseCookie.from("JwtToken", token)
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/")
                .maxAge(7 * 24 * 3600) // 7 days in seconds
                .sameSite("Lax")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.info("OTP login successful for email: {}", email);
        return true;
    }

    public List<User> getAllUser() {
        log.info("Retrieving all users");
        return userRepository.findAll();
    }
}