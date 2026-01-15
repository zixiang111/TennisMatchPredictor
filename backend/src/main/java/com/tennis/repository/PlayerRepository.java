package com.tennis.repository;

import com.tennis.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT p FROM Player p ORDER BY p.rank ASC LIMIT :limit")
    List<Player> findTopByLimit(@Param("limit") int limit);
}
