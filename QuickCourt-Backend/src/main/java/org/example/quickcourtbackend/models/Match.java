package org.example.quickcourtbackend.models;

import jakarta.persistence.*;
import lombok.*;
import org.example.quickcourtbackend.enums.MatchStatus;


import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "matches")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Match extends BaseModel {

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ManyToOne
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer maxPlayers;

    @Column(nullable = false)
    private Integer currentPlayers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status;
}
