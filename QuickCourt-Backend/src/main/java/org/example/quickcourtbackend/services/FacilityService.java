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

    public Facility createFacility(Facility facility) {
        facility.setVerificationStatus(VerificationStatus.PENDING);
        return facilityRepository.save(facility);
    }

    public Facility getFacilityById(String id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facility not found with ID: " + id));
    }

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility updateFacility(String id, Facility updatedFacility) {
        Facility existing = getFacilityById(id);
        existing.setName(updatedFacility.getName());
        existing.setDescription(updatedFacility.getDescription());
        existing.setAddress(updatedFacility.getAddress());
        existing.setCity(updatedFacility.getCity());
        existing.setState(updatedFacility.getState());
        existing.setZipCode(updatedFacility.getZipCode());
        existing.setLatitude(updatedFacility.getLatitude());
        existing.setLongitude(updatedFacility.getLongitude());
        return facilityRepository.save(existing);
    }

}