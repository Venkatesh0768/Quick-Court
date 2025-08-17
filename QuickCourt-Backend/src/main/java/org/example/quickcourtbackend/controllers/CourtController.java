package org.example.quickcourtbackend.controllers;

import org.example.quickcourtbackend.dtos.CourtRequestDto;
import org.example.quickcourtbackend.dtos.CourtResponseDto;
import org.example.quickcourtbackend.services.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courts")
@CrossOrigin(origins = "https://quick-court.vercel.app", allowCredentials = "true")
public class CourtController {

    @Autowired
    private CourtService courtService;

    @PostMapping
    public ResponseEntity<CourtResponseDto> createCourt(@RequestBody CourtRequestDto courtRequestDto) {
        return ResponseEntity.ok(courtService.createCourt(courtRequestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourtResponseDto> getCourtById(@PathVariable String id) {
        return ResponseEntity.ok(courtService.getCourtById(id));
    }

    @GetMapping
    public ResponseEntity<List<CourtResponseDto>> getAllCourts() {
        return ResponseEntity.ok(courtService.getAllCourts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourtResponseDto> updateCourt(@PathVariable String id, @RequestBody CourtRequestDto courtRequestDto) {
        return ResponseEntity.ok(courtService.updateCourt(id, courtRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourt(@PathVariable String id) {
        courtService.deleteCourt(id);
        return ResponseEntity.noContent().build();
    }
}
