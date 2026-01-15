package com.tennis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerStatsDto {
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("country")
    private String country;
    
    @JsonProperty("rank")
    private Integer rank;
    
    @JsonProperty("points")
    private Long points;
    
    @JsonProperty("career_matches")
    private Integer careerMatches;
    
    @JsonProperty("career_wins")
    private Integer careerWins;
    
    @JsonProperty("win_percentage")
    private Double winPercentage;
    
    @JsonProperty("career_titles")
    private Integer careerTitles;
    
    @JsonProperty("surface_preferences")
    private String surfacePreferences;
}
