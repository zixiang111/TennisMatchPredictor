package com.tennis.service;

import com.tennis.dto.PredictionRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

@Slf4j
@Service
public class ValidationService {
    
    private static final Pattern PLAYER_NAME_PATTERN = Pattern.compile("^[a-zA-Z\\s'-]+$");
    private static final Set<String> VALID_SURFACES = Set.of("HARD", "CLAY", "GRASS", "CARPET");
    private static final Set<String> VALID_TOURNAMENTS = new HashSet<>();
    
    static {
        // Initialize valid tournaments
        VALID_TOURNAMENTS.addAll(Set.of(
                "Australian Open", "French Open", "Wimbledon", "US Open",
                "ATP Finals", "Masters 1000", "Masters", "ATP 500", "ATP 250"
        ));
    }
    
    public void validatePredictionRequest(PredictionRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Prediction request cannot be null");
        }
        
        validatePlayerName(request.getPlayer1Name(), "Player 1");
        validatePlayerName(request.getPlayer2Name(), "Player 2");
        validateSurface(request.getSurface());
        validateTournament(request.getTournament());
        
        if (request.getPlayer1Name().equalsIgnoreCase(request.getPlayer2Name())) {
            throw new IllegalArgumentException("Players cannot be the same");
        }
    }
    
    private void validatePlayerName(String name, String fieldName) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " name cannot be empty");
        }
        
        if (name.length() < 2 || name.length() > 100) {
            throw new IllegalArgumentException(fieldName + " name must be between 2 and 100 characters");
        }
        
        if (!PLAYER_NAME_PATTERN.matcher(name).matches()) {
            throw new IllegalArgumentException(fieldName + " name contains invalid characters");
        }
    }
    
    private void validateSurface(String surface) {
        if (surface == null || surface.trim().isEmpty()) {
            throw new IllegalArgumentException("Surface cannot be empty");
        }
        
        if (!VALID_SURFACES.contains(surface.toUpperCase())) {
            throw new IllegalArgumentException("Invalid surface. Valid options: " + VALID_SURFACES);
        }
    }
    
    private void validateTournament(String tournament) {
        if (tournament == null || tournament.trim().isEmpty()) {
            throw new IllegalArgumentException("Tournament cannot be empty");
        }
        
        if (tournament.length() > 100) {
            throw new IllegalArgumentException("Tournament name must not exceed 100 characters");
        }
    }
}
