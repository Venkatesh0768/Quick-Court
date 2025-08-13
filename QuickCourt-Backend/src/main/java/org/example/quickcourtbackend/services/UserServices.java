    package org.example.quickcourtbackend.services;

import org.example.quickcourtbackend.models.User;
import org.example.quickcourtbackend.dtos.UserResponseDto;
import org.example.quickcourtbackend.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServices {

    private UserRepository userRepository;
    public UserServices(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<UserResponseDto> getUserById(String id) {
        Optional<User> user = Optional.ofNullable(userRepository.findUserById(id));
        return user.map(this::convertToDto);
    }

    public Optional<User> updateUser(String id, User user) {
        Optional<User> existingUser = Optional.ofNullable(userRepository.findUserById(id));
        if (existingUser.isPresent()) {
            User updatedUser = existingUser.get();
            updatedUser.setFirstName(user.getFirstName());
            updatedUser.setLastName(user.getLastName());
            updatedUser.setEmail(user.getEmail());
            updatedUser.setPhoneNumber(user.getPhoneNumber());
            updatedUser.setRole(user.getRole());
            updatedUser.setProfilePictureUrl(user.getProfilePictureUrl());
            return Optional.of(userRepository.save(updatedUser));
        }
        return Optional.empty();
    }

    public boolean deleteUser(String id) {
        Optional<User> user = Optional.ofNullable(userRepository.findUserById(id));
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return true;
        }
        return false;
    }

    private UserResponseDto convertToDto(User user) {
        List<UserResponseDto.FacilitySummaryDto> facilitySummaries = null;
        if (user.getOwnedFacilities() != null) {
            facilitySummaries = user.getOwnedFacilities().stream()
                    .map(facility -> UserResponseDto.FacilitySummaryDto.builder()
                            .id(facility.getId())
                            .name(facility.getName())
                            .address(facility.getAddress())
                            .city(facility.getCity())
                            .state(facility.getState())
                            .zipCode(facility.getZipCode())
                            .build())
                    .collect(Collectors.toList());
        }

        return UserResponseDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .profilePictureUrl(user.getProfilePictureUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .ownedFacilities(facilitySummaries)
                .build();
    }

}
