package com.tennis.controller;

import com.tennis.dto.ApiResponse;
import com.tennis.dto.PredictionRequest;
import com.tennis.dto.PredictionResponse;
import com.tennis.service.PredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class PredictionController {
    
    private final PredictionService predictionService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<PredictionResponse>> predictMatch(
            @Valid @RequestBody PredictionRequest request) {
        log.info("Prediction request received: {} vs {}", request.getPlayer1Name(), request.getPlayer2Name());
        
        try {
            PredictionResponse prediction = predictionService.predictMatch(request);
            return ResponseEntity.ok(new ApiResponse<>(true, prediction, null));
        } catch (IllegalArgumentException e) {
            log.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        } catch (Exception e) {
            log.error("Prediction error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, null, "Failed to generate prediction"));
        }
    }
    
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<PredictionResponse>>> batchPredict(
            @Valid @RequestBody List<PredictionRequest> requests) {
        log.info("Batch prediction request received with {} matches", requests.size());
        
        try {
            List<PredictionResponse> predictions = predictionService.batchPredict(requests);
            return ResponseEntity.ok(new ApiResponse<>(true, predictions, null));
        } catch (Exception e) {
            log.error("Batch prediction error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, null, "Failed to generate batch predictions"));
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<PredictionResponse>>> getPredictionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        log.info("History request: page={}, size={}", page, size);
        
        try {
            Page<PredictionResponse> history = predictionService.getPredictionHistory(
                    PageRequest.of(page, size));
            return ResponseEntity.ok(new ApiResponse<>(true, history, null));
        } catch (Exception e) {
            log.error("History retrieval error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, null, "Failed to retrieve history"));
        }
    }
    
    @GetMapping("/tournament/{tournament}")
    public ResponseEntity<ApiResponse<List<PredictionResponse>>> getPredictionsByTournament(
            @PathVariable String tournament) {
        log.info("Tournament predictions request: {}", tournament);
        
        try {
            List<PredictionResponse> predictions = predictionService.getPredictionsByTournament(tournament);
            return ResponseEntity.ok(new ApiResponse<>(true, predictions, null));
        } catch (Exception e) {
            log.error("Tournament predictions error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, null, "Failed to retrieve tournament predictions"));
        }
    }
}
