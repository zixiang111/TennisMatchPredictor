package com.tennis.controller;

import com.tennis.dto.ApiResponse;
import com.tennis.dto.PlayerStatsDto;
import com.tennis.entity.Player;
import com.tennis.service.PlayerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class PlayerController {
    
    private final PlayerService playerService;
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Player>>> searchPlayers(
            @RequestParam String query) {
        log.info("Player search: {}", query);
        
        try {
            List<Player> players = playerService.searchPlayers(query);
            return ResponseEntity.ok(new ApiResponse<>(true, players, null));
        } catch (Exception e) {
            log.error("Player search error", e);
            return ResponseEntity.ok(new ApiResponse<>(true, List.of(), null));
        }
    }
    
    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse<PlayerStatsDto>> getPlayerStats(
            @PathVariable Long id) {
        log.info("Player stats request: {}", id);
        
        try {
            PlayerStatsDto stats = playerService.getPlayerStats(id);
            return ResponseEntity.ok(new ApiResponse<>(true, stats, null));
        } catch (Exception e) {
            log.error("Player stats error", e);
            return ResponseEntity.ok(new ApiResponse<>(false, null, "Player not found"));
        }
    }
    
    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<Player>>> getTopPlayers(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Top players request: limit={}", limit);
        
        try {
            List<Player> topPlayers = playerService.getTopPlayers(limit);
            return ResponseEntity.ok(new ApiResponse<>(true, topPlayers, null));
        } catch (Exception e) {
            log.error("Top players error", e);
            return ResponseEntity.ok(new ApiResponse<>(true, List.of(), null));
        }
    }
}
