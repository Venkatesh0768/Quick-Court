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
    public MatchResponseDTO createMatch(MatchRequestDTO dto) {
        User creator = userRepository.findById(dto.getCreatorId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Court court = courtRepository.findById(dto.getCourtId())
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

        Match saved = matchRepository.save(match);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getAllMatches() {
        return matchRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatchResponseDTO getMatchById(String id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));
        return mapToResponse(match);
    }

    @Transactional
    public void deleteMatch(String id) {
        if (!matchRepository.existsById(id)) {
            throw new IllegalArgumentException("Match not found");
        }
        matchRepository.deleteById(id);
    }

    private MatchResponseDTO mapToResponse(Match match) {
        MatchResponseDTO dto = new MatchResponseDTO();
        dto.setId(match.getId());
        dto.setCreatorId(match.getCreator().getId());
        dto.setCourtId(match.getCourt().getId());
        dto.setDate(match.getDate());
        dto.setStartTime(match.getStartTime());
        dto.setEndTime(match.getEndTime());
        dto.setMaxPlayers(match.getMaxPlayers());
        dto.setCurrentPlayers(match.getCurrentPlayers());
        dto.setStatus(match.getStatus());
        return dto;
    }
}

