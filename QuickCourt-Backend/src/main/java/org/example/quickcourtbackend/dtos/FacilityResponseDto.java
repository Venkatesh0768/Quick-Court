package org.example.quickcourtbackend.dtos;

import lombok.Getter;
import lombok.Setter;
import org.example.quickcourtbackend.enums.VerificationStatus;

@Getter
@Setter
public class FacilityResponseDto {
    private String id;
    private String ownerId;
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Double latitude;
    private Double longitude;
    private VerificationStatus verificationStatus;
}