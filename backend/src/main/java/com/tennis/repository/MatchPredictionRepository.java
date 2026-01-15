package com.tennis.repository;

import com.tennis.entity.MatchPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchPredictionRepository extends JpaRepository<MatchPrediction, Long> {
    List<MatchPrediction> findByTournament(String tournament);
    List<MatchPrediction> findByPlayer1NameOrPlayer2Name(String player1Name, String player2Name);
}
