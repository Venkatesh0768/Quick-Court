package org.example.quickcourtbackend.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MatchRequestDTO {
    private String creatorId;
    private String courtId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer maxPlayers;
}