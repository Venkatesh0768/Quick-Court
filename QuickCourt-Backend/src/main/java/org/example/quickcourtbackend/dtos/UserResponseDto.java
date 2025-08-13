package org.example.quickcourtbackend.dtos;

import lombok.*;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private String id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String role;
    private String profilePictureUrl;
    private Date createdAt;
    private Date updatedAt;
    
    // Only include basic facility info to prevent infinite recursion
    private List<FacilitySummaryDto> ownedFacilities;
    
    @Setter
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FacilitySummaryDto {
        private String id;
        private String name;
        private String address;
        private String city;
        private String state;
        private String zipCode;
    }
}
