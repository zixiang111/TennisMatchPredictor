package com.tennis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionResponse {
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("player1_name")
    private String player1Name;
    
    @JsonProperty("player2_name")
    private String player2Name;
    
    @JsonProperty("player1_win_prob")
    private Double player1WinProb;
    
    @JsonProperty("player2_win_prob")
    private Double player2WinProb;
    
    @JsonProperty("predicted_winner")
    private String predictedWinner;
    
    @JsonProperty("confidence")
    private Double confidence;
    
    @JsonProperty("confidence_level")
    private String confidenceLevel;
    
    @JsonProperty("recommendation")
    private String recommendation;
    
    @JsonProperty("key_factors")
    private String keyFactors;
    
    @JsonProperty("tournament")
    private String tournament;
    
    @JsonProperty("surface")
    private String surface;
    
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
