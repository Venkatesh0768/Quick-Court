package org.example.quickcourtbackend.dtos;

import lombok.*;
import org.example.quickcourtbackend.models.Booking;
import org.example.quickcourtbackend.models.Facility;
import org.example.quickcourtbackend.models.Match;
import org.example.quickcourtbackend.models.Review;

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
    private List<Facility> ownedFacilities;
    private List<Booking> bookings;
    private List<Match> createdMatches;
    private List<Review> reviews;
}
