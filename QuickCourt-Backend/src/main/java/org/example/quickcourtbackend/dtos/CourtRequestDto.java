package org.example.quickcourtbackend.dtos;

import lombok.*;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourtRequestDto {
    private String facilityId;   // UUID as String
    private String name;
    private String sportType;    // Enum as String
    private Double pricePerHour;
    private String operatingHours;
    private List<String> availabilityIds; // Optional
    private List<String> bookingIds;      // Optional
    private List<String> matchIds;        // Optional

    // Getters & Setters
}