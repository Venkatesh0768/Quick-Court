package org.example.quickcourtbackend.repositories;


import org.example.quickcourtbackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.function.Supplier;

@Repository
public interface AuthRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findUserById(String id);

    Supplier<? extends User> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);
}
