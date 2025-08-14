package org.example.quickcourtbackend.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class CreateFacilityRequestDto {
    private String ownerId;
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Double latitude;
    private Double longitude;
}