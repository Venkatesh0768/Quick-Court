package org.example.quickcourtbackend.repositories;

import org.example.quickcourtbackend.models.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourtRepository extends JpaRepository<Court , String> {


}
