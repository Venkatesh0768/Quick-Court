package org.example.quickcourtbackend.dtos;

// CourtResponseDto.java
import lombok.*;

import java.util.List;



@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourtResponseDto {
    private String id;
    private String facilityId;
    private String name;
    private String sportType;
    private Double pricePerHour;
    private String operatingHours;
    private List<String> availabilityIds;
    private List<String> bookingIds;
    private List<String> matchIds;

    // Getters & Setters
}

