package com.tennis.service;

import com.tennis.repository.MatchPredictionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemStatsService {
    
    private final MatchPredictionRepository predictionRepository;
    private final MLServiceClient mlServiceClient;
    
    private final long startTime = System.currentTimeMillis();
    
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Prediction stats
        stats.put("total_predictions", predictionRepository.count());
        
        // Memory stats
        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
        stats.put("memory_used_mb", memoryMXBean.getHeapMemoryUsage().getUsed() / 1024 / 1024);
        stats.put("memory_max_mb", memoryMXBean.getHeapMemoryUsage().getMax() / 1024 / 1024);
        
        // Uptime
        long uptime = (System.currentTimeMillis() - startTime) / 1000;
        stats.put("uptime_seconds", uptime);
        
        // Service status
        stats.put("ml_service_available", mlServiceClient.isAvailable());
        stats.put("timestamp", System.currentTimeMillis());
        
        return stats;
    }
    
    public boolean isMlServiceAvailable() {
        return mlServiceClient.isAvailable();
    }
}
