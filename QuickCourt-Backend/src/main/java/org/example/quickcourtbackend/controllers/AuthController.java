package org.example.quickcourtbackend.controllers;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.example.quickcourtbackend.dtos.ApiResponseDto;
import org.example.quickcourtbackend.dtos.LoginRequestDto;
import org.example.quickcourtbackend.dtos.SignUpRequestDto;
import org.example.quickcourtbackend.models.OtpRequest;
import org.example.quickcourtbackend.models.OtpVerificationRequest;
import org.example.quickcourtbackend.models.User;
import org.example.quickcourtbackend.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDto<User>> signup(@RequestBody SignUpRequestDto user) {
        try {
            log.info("User signup request received for email: {}", user.getEmail());
            
            if (!user.isValid()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("All required fields must be provided"));
            }
            
            if (!user.isEmailValid()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("Invalid email format"));
            }
            
            if (!user.isPasswordStrong()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("Password must be at least 8 characters long"));
            }
            
            User createdUser = service.createUser(user);
            log.info("User signup successful for email: {}", user.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.success("User created successfully", createdUser));
                
        } catch (IllegalArgumentException e) {
            log.warn("User signup failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponseDto.error(e.getMessage()));
        } catch (Exception e) {
            log.error("User signup error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.error("Internal server error occurred"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<String>> signIn(@RequestBody LoginRequestDto user, HttpServletResponse response) {
        try {
            log.info("User login request received for email: {}", user.getEmail());
            
            if (!user.isValid()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("Email and password are required"));
            }
            
            if (!user.isEmailValid()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("Invalid email format"));
            }
            
            boolean isValid = service.validateUser(user, response);
            if (!isValid) {
                log.warn("Login failed for email: {}", user.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("Invalid email or password"));
            }
            
            log.info("User login successful for email: {}", user.getEmail());
            return ResponseEntity.ok()
                .body(ApiResponseDto.success("Login successful", "User authenticated successfully"));
                
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.error("Internal server error occurred"));
        }
    }
    
    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponseDto<String>> sendOtp(@RequestBody OtpRequest request) {
        try {
            log.info("OTP request received for email: {}", request.getEmail());
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("Email is required"));
            }
            
            String result = service.initiateOtpLogin(request.getEmail());
            log.info("OTP sent successfully for email: {}", request.getEmail());
            
            return ResponseEntity.ok()
                .body(ApiResponseDto.success("OTP sent successfully", result));
                
        } catch (IllegalArgumentException e) {
            log.warn("OTP request failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponseDto.error(e.getMessage()));
        } catch (Exception e) {
            log.error("OTP request error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.error("Failed to send OTP"));
        }
    }
    
    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponseDto<String>> verifyOtp(@RequestBody OtpVerificationRequest request,
                                                          HttpServletResponse response) {
        try {
            log.info("OTP verification request received for email: {}", request.getEmail());
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("Email is required"));
            }
            
            if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponseDto.error("OTP is required"));
            }
            
            boolean isValid = service.verifyOtpAndLogin(request.getEmail(), request.getOtp(), response);
            if (!isValid) {
                log.warn("OTP verification failed for email: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("Invalid or expired OTP"));
            }
            
            log.info("OTP verification successful for email: {}", request.getEmail());
            return ResponseEntity.ok()
                .body(ApiResponseDto.success("OTP verification successful", "User authenticated successfully"));
                
        } catch (Exception e) {
            log.error("OTP verification error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.error("Internal server error occurred"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponseDto<String>> validate(HttpServletRequest request, HttpServletResponse response) {
        try {
            log.info("Token validation request received");
            
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    log.debug("Cookie: {} = {}", cookie.getName(), cookie.getValue());
                }
            }
            
            return ResponseEntity.ok()
                .body(ApiResponseDto.success("Token validation successful", "User is authenticated"));
                
        } catch (Exception e) {
            log.error("Token validation error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.error("Token validation failed"));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponseDto<List<User>>> getAllUser() {
        try {
            log.info("Get all users request received");
            List<User> users = service.getAllUser();
            return ResponseEntity.ok()
                .body(ApiResponseDto.success("Users retrieved successfully", users));
                
        } catch (Exception e) {
            log.error("Get all users error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.error("Failed to retrieve users"));
        }
    }
}
