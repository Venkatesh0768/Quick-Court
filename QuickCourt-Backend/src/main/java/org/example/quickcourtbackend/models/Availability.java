package org.example.quickcourtbackend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Availability extends BaseModel {
<<<<<<< HEAD

    @ManyToOne
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

=======
    @ManyToOne
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;
>>>>>>> feature/frontend
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
}
