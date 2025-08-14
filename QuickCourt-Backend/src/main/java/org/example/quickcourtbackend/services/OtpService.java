package org.example.quickcourtbackend.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${otp.expiry:300000}")
    private long otpExpiryMs;
    
    @Value("${otp.length:6}")
    private int otpLength;
    
    @Value("${otp.max-attempts:3}")
    private int maxAttempts;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    // In-memory storage for OTP codes (in production, use Redis or database)
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    
    public String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
    
    public boolean sendOtp(String email) {
        String otp = null;
        LocalDateTime expiryTime = null;
        
        try {
            otp = generateOtp();
            expiryTime = LocalDateTime.now().plusSeconds(otpExpiryMs / 1000);
            
            // Store OTP data
            otpStorage.put(email, new OtpData(otp, expiryTime, 0));
            
            // Send email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("QuickCourt - OTP Verification");
            message.setText(String.format("""
                Hello!
                
                Your OTP verification code is: %s
                
                This code will expire in %d minutes.
                
                If you didn't request this code, please ignore this email.
                
                Best regards,
                QuickCourt Team
                """, otp, otpExpiryMs / 60000));
            
            mailSender.send(message);
            log.info("OTP sent successfully to email: {}", email);
            return true;
            
        } catch (Exception e) {
            log.error("Failed to send OTP to email: {}", email, e);
            // Fallback: log OTP to console for debugging
            if (otp != null && expiryTime != null) {
                log.info("=== OTP GENERATED FOR TESTING (Email failed) ===");
                log.info("Email: {}", email);
                log.info("OTP: {}", otp);
                log.info("Expires: {}", expiryTime);
                log.info("===============================================");
            }
            return false;
        }
    }
    
    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        
        if (otpData == null) {
            log.warn("No OTP found for email: {}", email);
            return false;
        }
        
        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(otpData.expiryTime)) {
            log.warn("OTP expired for email: {}", email);
            otpStorage.remove(email);
            return false;
        }
        
        // Check max attempts
        if (otpData.attempts >= maxAttempts) {
            log.warn("Max OTP attempts exceeded for email: {}", email);
            otpStorage.remove(email);
            return false;
        }
        
        // Increment attempts
        otpData.attempts++;
        
        // Verify OTP
        if (otpData.otp.equals(otp)) {
            log.info("OTP verified successfully for email: {}", email);
            otpStorage.remove(email);
            return true;
        }
        
        log.warn("Invalid OTP attempt for email: {}, attempts: {}", email, otpData.attempts);
        return false;
    }
    
    public boolean isOtpExpired(String email) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            return true;
        }
        return LocalDateTime.now().isAfter(otpData.expiryTime);
    }
    
    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
    
    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;
        private int attempts;
        
        public OtpData(String otp, LocalDateTime expiryTime, int attempts) {
            this.otp = otp;
            this.expiryTime = expiryTime;
            this.attempts = attempts;
        }
    }
}
