package com.tennis.service;

import com.tennis.dto.PlayerStatsDto;
import com.tennis.entity.Player;
import com.tennis.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlayerService {
    
    private final PlayerRepository playerRepository;
    
    public List<Player> searchPlayers(String query) {
        log.info("Searching players with query: {}", query);
        return playerRepository.findByNameContainingIgnoreCase(query);
    }
    
    public PlayerStatsDto getPlayerStats(Long id) {
        return playerRepository.findById(id)
                .map(this::mapToStatsDto)
                .orElseThrow(() -> new RuntimeException("Player not found"));
    }
    
    public List<Player> getTopPlayers(int limit) {
        return playerRepository.findTopByLimit(limit);
    }
    
    private PlayerStatsDto mapToStatsDto(Player player) {
        double winPercentage = 0;
        if (player.getCareerMatches() != null && player.getCareerMatches() > 0) {
            winPercentage = ((double) player.getCareerWins() / player.getCareerMatches()) * 100;
        }
        
        return PlayerStatsDto.builder()
                .id(player.getId())
                .name(player.getName())
                .country(player.getCountry())
                .rank(player.getRank())
                .points(player.getPoints())
                .careerMatches(player.getCareerMatches())
                .careerWins(player.getCareerWins())
                .winPercentage(winPercentage)
                .careerTitles(player.getCareerTitles())
                .surfacePreferences(player.getSurfacePreferences())
                .build();
    }
}
