package org.example.quickcourtbackend.dtos;

import lombok.*;

@Data
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDto {
    private String email;
    private String password;
    
    // Basic validation methods
    public boolean isValid() {
        return email != null && !email.trim().isEmpty() && 
               password != null && !password.trim().isEmpty();
    }
    
    public boolean isEmailValid() {
        return email != null && email.contains("@") && email.contains(".");
    }
}
