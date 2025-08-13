package org.example.quickcourtbackend.repositories;

import org.example.quickcourtbackend.models.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {
    // Add custom queries if needed
}
