package org.example.quickcourtbackend.controllers;

import org.example.quickcourtbackend.dtos.CreateFacilityRequestDto;
import org.example.quickcourtbackend.dtos.FacilityResponseDto;
import org.example.quickcourtbackend.dtos.UpdateFacilityRequestDto;
import org.example.quickcourtbackend.models.Facility;
import org.example.quickcourtbackend.services.FacilityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @PostMapping
    public ResponseEntity<Facility> createFacility(@RequestBody Facility facility) {
        Facility created = facilityService.createFacility(facility);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{facilityId}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable String facilityId) {
        return ResponseEntity.ok(facilityService.getFacilityById(facilityId));
    }

    @PutMapping("/{facilityId}")
    public ResponseEntity<Facility> updateFacility(@PathVariable String facilityId, @RequestBody Facility facility) {
        return ResponseEntity.ok(facilityService.updateFacility(facilityId, facility));
    }
}
