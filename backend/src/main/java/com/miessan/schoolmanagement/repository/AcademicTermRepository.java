package com.miessan.schoolmanagement.repository;

import com.miessan.schoolmanagement.model.AcademicTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicTermRepository extends JpaRepository<AcademicTerm, Long> {

    Optional<AcademicTerm> findByTermCode(String termCode);

    List<AcademicTerm> findByAcademicYear(String academicYear);

    Optional<AcademicTerm> findByStatusIgnoreCase(String status);
}
