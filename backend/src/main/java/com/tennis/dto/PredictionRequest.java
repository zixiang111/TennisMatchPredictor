package com.tennis.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {
    @NotBlank(message = "Player 1 name is required")
    private String player1Name;
    
    @NotBlank(message = "Player 2 name is required")
    private String player2Name;
    
    @NotBlank(message = "Tournament is required")
    private String tournament;
    
    @NotBlank(message = "Surface is required")
    private String surface;
    
    private Integer player1Rank;
    private Integer player2Rank;
    private Long player1Points;
    private Long player2Points;
    private Double player1WinPctCareer;
    private Double player2WinPctCareer;
}
