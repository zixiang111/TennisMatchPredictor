package com.tennis.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String player1Name;
    
    @Column(nullable = false)
    private String player2Name;
    
    @Column(nullable = false)
    private Double player1WinProbability;
    
    @Column(nullable = false)
    private Double player2WinProbability;
    
    @Column(nullable = false)
    private String predictedWinner;
    
    @Column(nullable = false)
    private Double confidence;
    
    @Column(nullable = false)
    private String tournament;
    
    @Column(nullable = false)
    private String surface;
    
    @Column(name = "actual_winner")
    private String actualWinner;
    
    @Column(name = "correct")
    private Boolean correct;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
