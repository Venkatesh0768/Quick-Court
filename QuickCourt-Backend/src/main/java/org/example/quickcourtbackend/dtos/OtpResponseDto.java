package org.example.quickcourtbackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpResponseDto {
    
    private boolean success;
    private String message;
    private String otp;
    private long expiryTime;
}
