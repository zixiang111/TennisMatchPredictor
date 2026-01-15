package com.tennis.service;

import com.tennis.dto.PredictionRequest;
import com.tennis.dto.PredictionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class RuleEngine {
    
    public PredictionResponse generatePrediction(PredictionRequest request) {
        log.info("Using rule engine for prediction: {} vs {}", 
                request.getPlayer1Name(), request.getPlayer2Name());
        
        // Simple rule-based prediction
        double player1Prob = 0.5;
        double player2Prob = 0.5;
        
        // Adjust based on available rank
        if (request.getPlayer1Rank() != null && request.getPlayer2Rank() != null) {
            int rankDiff = request.getPlayer2Rank() - request.getPlayer1Rank();
            player1Prob = 0.5 + (rankDiff * 0.01);
            player1Prob = Math.max(0.3, Math.min(0.7, player1Prob));
            player2Prob = 1.0 - player1Prob;
        }
        
        // Adjust based on career win percentage
        if (request.getPlayer1WinPctCareer() != null && request.getPlayer2WinPctCareer() != null) {
            double winDiff = request.getPlayer1WinPctCareer() - request.getPlayer2WinPctCareer();
            player1Prob += (winDiff * 0.1);
            player1Prob = Math.max(0.3, Math.min(0.7, player1Prob));
            player2Prob = 1.0 - player1Prob;
        }
        
        String predictedWinner = player1Prob > player2Prob 
                ? request.getPlayer1Name() 
                : request.getPlayer2Name();
        
        return PredictionResponse.builder()
                .player1Name(request.getPlayer1Name())
                .player2Name(request.getPlayer2Name())
                .player1WinProb(player1Prob)
                .player2WinProb(player2Prob)
                .predictedWinner(predictedWinner)
                .confidence(Math.max(player1Prob, player2Prob))
                .confidenceLevel("LOW")
                .tournament(request.getTournament())
                .surface(request.getSurface())
                .keyFactors("Using fallback rule engine")
                .createdAt(LocalDateTime.now())
                .build();
    }
}
