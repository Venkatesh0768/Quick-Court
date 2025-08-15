package org.example.quickcourtbackend.models;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnore;
=======
>>>>>>> feature/frontend
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Review extends BaseModel {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
<<<<<<< HEAD
    @JsonIgnore
=======
>>>>>>> feature/frontend
    private User user;

    @ManyToOne
    @JoinColumn(name = "facility_id", nullable = false)
<<<<<<< HEAD
    @JsonIgnore
=======
>>>>>>> feature/frontend
    private Facility facility;

    @Column(nullable = false)
    private Integer rating; // 1-5

    private String comment;
}