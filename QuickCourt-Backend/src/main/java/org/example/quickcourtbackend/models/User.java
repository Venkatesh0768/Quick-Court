package org.example.quickcourtbackend.models;

import jakarta.persistence.*;
import lombok.*;
import org.example.quickcourtbackend.enums.UserRole;

<<<<<<< HEAD
=======

>>>>>>> feature/frontend
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class User extends BaseModel {

<<<<<<< HEAD

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
=======
    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

>>>>>>> feature/frontend
    private String profilePictureUrl;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Facility> ownedFacilities;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Match> createdMatches;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;
}