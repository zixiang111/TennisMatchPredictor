package com.tennis.service;

import com.tennis.dto.PredictionRequest;
import com.tennis.dto.PredictionResponse;
import com.tennis.entity.MatchPrediction;
import com.tennis.repository.MatchPredictionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PredictionService {
    
    private final MLServiceClient mlServiceClient;
    private final RuleEngine ruleEngine;
    private final ValidationService validationService;
    private final MatchPredictionRepository predictionRepository;
    
    public PredictionResponse predictMatch(PredictionRequest request) {
        log.info("Processing prediction: {} vs {}", request.getPlayer1Name(), request.getPlayer2Name());
        
        // Validate input
        validationService.validatePredictionRequest(request);
        
        // Call ML service
        PredictionResponse prediction;
        try {
            prediction = mlServiceClient.predictMatch(request);
        } catch (Exception e) {
            log.warn("ML service failed, using rule engine", e);
            prediction = ruleEngine.generatePrediction(request);
            prediction.setConfidenceLevel("LOW");
        }
        
        // Calculate additional metrics
        enrichPrediction(prediction);
        
        // Save to database
        savePrediction(prediction, request);
        
        return prediction;
    }
    
    public List<PredictionResponse> batchPredict(List<PredictionRequest> requests) {
        return requests.stream()
                .map(this::predictMatch)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<PredictionResponse> getPredictionHistory(Pageable pageable) {
        return predictionRepository.findAll(pageable)
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public List<PredictionResponse> getPredictionsByTournament(String tournament) {
        return predictionRepository.findByTournament(tournament).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private void enrichPrediction(PredictionResponse prediction) {
        // Determine confidence level
        if (prediction.getConfidence() > 0.8) {
            prediction.setConfidenceLevel("HIGH");
        } else if (prediction.getConfidence() > 0.65) {
            prediction.setConfidenceLevel("MEDIUM");
        } else {
            prediction.setConfidenceLevel("LOW");
        }
        
        // Generate recommendation
        String recommendation = generateRecommendation(prediction);
        prediction.setRecommendation(recommendation);
    }
    
    private String generateRecommendation(PredictionResponse prediction) {
        Double maxProb = Math.max(prediction.getPlayer1WinProb(), prediction.getPlayer2WinProb());
        
        if (maxProb > 0.85) {
            return "STRONG_WIN";
        } else if (maxProb > 0.75) {
            return "WIN";
        } else if (maxProb > 0.60) {
            return "MODERATE";
        } else if (maxProb > 0.50) {
            return "SLIGHT";
        } else {
            return "AVOID";
        }
    }
    
    private void savePrediction(PredictionResponse prediction, PredictionRequest request) {
        try {
            MatchPrediction entity = MatchPrediction.builder()
                    .player1Name(request.getPlayer1Name())
                    .player2Name(request.getPlayer2Name())
                    .player1WinProbability(prediction.getPlayer1WinProb())
                    .player2WinProbability(prediction.getPlayer2WinProb())
                    .predictedWinner(prediction.getPredictedWinner())
                    .confidence(prediction.getConfidence())
                    .tournament(request.getTournament())
                    .surface(request.getSurface())
                    .createdAt(LocalDateTime.now())
                    .build();
            
            predictionRepository.save(entity);
            prediction.setId(entity.getId());
        } catch (Exception e) {
            log.warn("Failed to save prediction to database", e);
        }
    }
    
    private PredictionResponse mapToResponse(MatchPrediction entity) {
        return PredictionResponse.builder()
                .id(entity.getId())
                .player1Name(entity.getPlayer1Name())
                .player2Name(entity.getPlayer2Name())
                .player1WinProb(entity.getPlayer1WinProbability())
                .player2WinProb(entity.getPlayer2WinProbability())
                .predictedWinner(entity.getPredictedWinner())
                .confidence(entity.getConfidence())
                .tournament(entity.getTournament())
                .surface(entity.getSurface())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
