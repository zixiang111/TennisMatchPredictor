package com.tennis.controller;

import com.tennis.dto.ApiResponse;
import com.tennis.service.SystemStatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class HealthController {
    
    private final SystemStatsService systemStatsService;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "tennis-predictor");
        response.put("timestamp", System.currentTimeMillis());
        response.put("database", "connected");
        response.put("mlService", systemStatsService.isMlServiceAvailable() ? "connected" : "unavailable");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/system/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemStats() {
        try {
            Map<String, Object> stats = systemStatsService.getSystemStats();
            return ResponseEntity.ok(new ApiResponse<>(true, stats, null));
        } catch (Exception e) {
            log.error("System stats error", e);
            return ResponseEntity.ok(new ApiResponse<>(false, null, "Failed to retrieve system stats"));
        }
    }
}
