package org.example.quickcourtbackend.repositories;


import org.example.quickcourtbackend.models.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FacilityRepository extends JpaRepository<Facility, String> {

}
