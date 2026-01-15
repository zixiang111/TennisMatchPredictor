package com.tennis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TennisMatchPredictorApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(TennisMatchPredictorApplication.class, args);
    }
}
