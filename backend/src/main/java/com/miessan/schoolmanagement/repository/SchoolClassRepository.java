package com.miessan.schoolmanagement.repository;

import com.miessan.schoolmanagement.model.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    Optional<SchoolClass> findByName(String name);
    Optional<SchoolClass> findByNameIgnoreCase(String name);
    List<SchoolClass> findByActiveTrue();
    boolean existsByNameIgnoreCase(String name);
}
