package org.example.quickcourtbackend.dtos;

import lombok.Data;
import org.example.quickcourtbackend.enums.MatchStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MatchResponseDTO {
    private String id;
    private String creatorId;
    private String courtId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer maxPlayers;
    private Integer currentPlayers;
    private MatchStatus status;
}