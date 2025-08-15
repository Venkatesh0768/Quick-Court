package org.example.quickcourtbackend.models;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
=======
>>>>>>> feature/frontend
import jakarta.persistence.*;
import lombok.*;
import org.example.quickcourtbackend.enums.VerificationStatus;

<<<<<<< HEAD
=======

>>>>>>> feature/frontend
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Facility extends BaseModel {

    @ManyToOne
<<<<<<< HEAD
    @JsonIgnore
=======
>>>>>>> feature/frontend
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String zipCode;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

<<<<<<< HEAD
    @JsonManagedReference

    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Court> courts;

    @JsonManagedReference

=======
    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Court> courts;

>>>>>>> feature/frontend
    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;
}
