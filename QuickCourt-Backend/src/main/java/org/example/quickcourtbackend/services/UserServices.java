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

    private final UserRepository userRepository;
    public UserServices(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
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


    public Optional<User> getUserById(String userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()){
            return user;
        }
        throw  new RuntimeException("No User Found");
    }
}
