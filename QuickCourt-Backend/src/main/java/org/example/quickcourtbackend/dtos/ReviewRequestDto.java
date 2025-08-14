package org.example.quickcourtbackend.dtos;


import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class ReviewRequestDto {
    private String userId;     // UUID as String
    private String facilityId; // UUID as String
    private Integer rating;    // 1-5
    private String comment;

}
