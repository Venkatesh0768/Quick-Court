package org.example.quickcourtbackend.services;

import org.example.quickcourtbackend.enums.MatchStatus;
import org.example.quickcourtbackend.models.Court;
import org.example.quickcourtbackend.models.Match;
import org.example.quickcourtbackend.models.User;
import org.example.quickcourtbackend.dtos.MatchRequestDTO;
import org.example.quickcourtbackend.dtos.MatchResponseDTO;
import org.example.quickcourtbackend.repositories.CourtRepository;
import org.example.quickcourtbackend.repositories.MatchRepository;
import org.example.quickcourtbackend.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final CourtRepository courtRepository;

    public MatchService(MatchRepository matchRepository, UserRepository userRepository, CourtRepository courtRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.courtRepository = courtRepository;
    }

    @Transactional
    public Match createMatch(Match dto) {
        User creator = userRepository.findById(dto.getCreator().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Court court = courtRepository.findById(dto.getCourt().getId())
                .orElseThrow(() -> new IllegalArgumentException("Court not found"));

        Match match = new Match();
        match.setCreator(creator);
        match.setCourt(court);
        match.setDate(dto.getDate());
        match.setStartTime(dto.getStartTime());
        match.setEndTime(dto.getEndTime());
        match.setMaxPlayers(dto.getMaxPlayers());
        match.setCurrentPlayers(1);
        match.setStatus(MatchStatus.OPEN);

        return matchRepository.save(match);
    }

    @Transactional
    public Match updateMatch(String id, Match dto) {
        Match existingMatch = matchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        if (dto.getDate() != null) existingMatch.setDate(dto.getDate());
        if (dto.getStartTime() != null) existingMatch.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) existingMatch.setEndTime(dto.getEndTime());
        if (dto.getMaxPlayers() != 0) existingMatch.setMaxPlayers(dto.getMaxPlayers());
        if (dto.getStatus() != null) existingMatch.setStatus(dto.getStatus());

        return matchRepository.save(existingMatch);
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public Match getMatchById(String id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));
    }

    public void deleteMatch(String id) {
        if (!matchRepository.existsById(id)) {
            throw new IllegalArgumentException("Match not found");
        }
        matchRepository.deleteById(id);
    }
}