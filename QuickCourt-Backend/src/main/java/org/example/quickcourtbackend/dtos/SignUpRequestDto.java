package org.example.quickcourtbackend.dtos;

import lombok.*;

@Data
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequestDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String password;
    private String role;
    
    // Basic validation methods
    public boolean isValid() {
        return email != null && !email.trim().isEmpty() && 
               password != null && !password.trim().isEmpty() &&
               firstName != null && !firstName.trim().isEmpty() &&
               lastName != null && !lastName.trim().isEmpty();
    }
    
    public boolean isEmailValid() {
        return email != null && email.contains("@") && email.contains(".");
    }
    
    public boolean isPasswordStrong() {
        return password != null && password.length() >= 8;
    }
}
