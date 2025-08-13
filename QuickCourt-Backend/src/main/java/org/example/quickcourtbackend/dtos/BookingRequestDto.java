package org.example.quickcourtbackend.dtos;

// BookingRequestDto.java
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingRequestDto {
    private String userId;
    private String courtId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer duration;
    private String status;
    private String paymentStatus;

}
