package com.tennis.service;

import com.tennis.dto.PredictionRequest;
import com.tennis.dto.PredictionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class MLServiceClient {
    
    @Value("${ml-service.baseUrl:http://localhost:5000}")
    private String mlServiceUrl;
    
    @Value("${ml-service.timeout:15000}")
    private long timeout;
    
    private final RestTemplate restTemplate;
    private volatile boolean mlServiceAvailable = true;
    
    @Retryable(
            retryFor = RestClientException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public PredictionResponse predictMatch(PredictionRequest request) {
        try {
            String url = mlServiceUrl + "/api/predict";
            log.info("Calling ML service: {}", url);
            
            PredictionResponse response = restTemplate.postForObject(
                    url,
                    request,
                    PredictionResponse.class
            );
            
            mlServiceAvailable = true;
            return response;
        } catch (RestClientException e) {
            mlServiceAvailable = false;
            log.error("ML service call failed", e);
            throw e;
        }
    }
    
    public boolean checkHealth() {
        try {
            String url = mlServiceUrl + "/api/health";
            restTemplate.getForObject(url, Object.class);
            mlServiceAvailable = true;
            return true;
        } catch (Exception e) {
            log.warn("ML service health check failed", e);
            mlServiceAvailable = false;
            return false;
        }
    }
    
    public boolean isAvailable() {
        return mlServiceAvailable;
    }
}
