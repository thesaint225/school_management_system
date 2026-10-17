package com.miessan.schoolmanagement.repository;

import com.miessan.schoolmanagement.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByName(String name);
    Optional<Subject> findByNameIgnoreCase(String name);
    List<Subject> findByActiveTrue();
    List<Subject> findByDepartment(String department);
}
