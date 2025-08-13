package org.example.quickcourtbackend.services;

import jakarta.persistence.EntityNotFoundException;
import org.example.quickcourtbackend.enums.VerificationStatus;
import org.example.quickcourtbackend.models.Facility;
import org.example.quickcourtbackend.models.User;
import org.example.quickcourtbackend.dtos.CreateFacilityRequestDto;
import org.example.quickcourtbackend.dtos.FacilityResponseDto;
import org.example.quickcourtbackend.dtos.UpdateFacilityRequestDto;
import org.example.quickcourtbackend.repositories.FacilityRepository;
import org.example.quickcourtbackend.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;

    public FacilityService(FacilityRepository facilityRepository, UserRepository userRepository) {
        this.facilityRepository = facilityRepository;
        this.userRepository = userRepository;
    }


    public FacilityResponseDto createFacility(CreateFacilityRequestDto createFacilityRequestDto) {
        Optional<User> isExisted = Optional.ofNullable(userRepository.findUserById(createFacilityRequestDto.getOwnerId()));
        if (isExisted.isPresent()){
            Facility facility = new Facility();

            facility.setOwner(isExisted.get());
            facility.setName(createFacilityRequestDto.getName());
            facility.setDescription(createFacilityRequestDto.getDescription());
            facility.setAddress(createFacilityRequestDto.getAddress());
            facility.setCity(createFacilityRequestDto.getCity());
            facility.setState(createFacilityRequestDto.getState());
            facility.setZipCode(createFacilityRequestDto.getZipCode());
            facility.setLatitude(createFacilityRequestDto.getLatitude());
            facility.setLongitude(createFacilityRequestDto.getLongitude());
            facility.setVerificationStatus(VerificationStatus.PENDING);
            Facility savedFacility = facilityRepository.save(facility);

            FacilityResponseDto responseDto = new FacilityResponseDto();
            responseDto.setOwnerId(savedFacility.getId());
            responseDto.setName(savedFacility.getName());
            responseDto.setDescription(savedFacility.getDescription());
            responseDto.setAddress(savedFacility.getAddress());
            responseDto.setCity(savedFacility.getCity());
            responseDto.setState(savedFacility.getState());
            responseDto.setZipCode(savedFacility.getZipCode());
            responseDto.setLatitude(savedFacility.getLatitude());
            responseDto.setLongitude(savedFacility.getLongitude());

            return responseDto;
        } else {
            throw new EntityNotFoundException("User not found with ID: " + createFacilityRequestDto.getOwnerId());
        }
    }

    public List<FacilityResponseDto> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(facility -> {
                    FacilityResponseDto responseDto = new FacilityResponseDto();
                    responseDto.setId(facility.getId());
                    responseDto.setOwnerId(facility.getOwner().getId());
                    responseDto.setName(facility.getName());
                    responseDto.setDescription(facility.getDescription());
                    responseDto.setAddress(facility.getAddress());
                    responseDto.setCity(facility.getCity());
                    responseDto.setState(facility.getState());
                    responseDto.setZipCode(facility.getZipCode());
                    responseDto.setLatitude(facility.getLatitude());
                    responseDto.setLongitude(facility.getLongitude());
                    return responseDto;
                })
                .collect(Collectors.toList());
    }

    public FacilityResponseDto getFacilityById(String id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facility not found with ID: " + id));

        FacilityResponseDto responseDto = new FacilityResponseDto();
        responseDto.setOwnerId(facility.getOwner().getId());
        responseDto.setName(facility.getName());
        responseDto.setDescription(facility.getDescription());
        responseDto.setAddress(facility.getAddress());
        responseDto.setCity(facility.getCity());
        responseDto.setState(facility.getState());
        responseDto.setZipCode(facility.getZipCode());
        responseDto.setLatitude(facility.getLatitude());
        responseDto.setLongitude(facility.getLongitude());

        return responseDto;
    }

    public FacilityResponseDto updateFacility(String id, UpdateFacilityRequestDto updateFacilityRequestDto) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facility not found with ID: " + id));

        facility.setName(updateFacilityRequestDto.getName());
        facility.setDescription(updateFacilityRequestDto.getDescription());
        facility.setAddress(updateFacilityRequestDto.getAddress());
        facility.setCity(updateFacilityRequestDto.getCity());
        facility.setState(updateFacilityRequestDto.getState());
        facility.setZipCode(updateFacilityRequestDto.getZipCode());
        facility.setLatitude(updateFacilityRequestDto.getLatitude());
        facility.setLongitude(updateFacilityRequestDto.getLongitude());

        Facility updatedFacility = facilityRepository.save(facility);

        FacilityResponseDto responseDto = new FacilityResponseDto();
        responseDto.setOwnerId(updatedFacility.getOwner().getId());
        responseDto.setName(updatedFacility.getName());
        responseDto.setDescription(updatedFacility.getDescription());
        responseDto.setAddress(updatedFacility.getAddress());
        responseDto.setCity(updatedFacility.getCity());
        responseDto.setState(updatedFacility.getState());
        responseDto.setZipCode(updatedFacility.getZipCode());
        responseDto.setLatitude(updatedFacility.getLatitude());
        responseDto.setLongitude(updatedFacility.getLongitude());

        return responseDto;
    }
}