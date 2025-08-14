package org.example.quickcourtbackend.dtos;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateFacilityRequestDto {
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Double latitude;
    private Double longitude;

}