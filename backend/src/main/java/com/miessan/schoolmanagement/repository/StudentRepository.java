package com.miessan.schoolmanagement.repository;

import com.miessan.schoolmanagement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findBySchoolClassId(Long classId);
    List<Student> findByStudentClassIgnoreCase(String studentClass);
    long countBySchoolClassId(Long classId);
    long countByStudentClassIgnoreCase(String studentClass);

    @Query("SELECT DISTINCT s FROM Student s WHERE s.schoolClass.id = :classId OR (s.schoolClass IS NULL AND LOWER(s.studentClass) = LOWER(:className))")
    List<Student> findByClassIdOrClassName(@Param("classId") Long classId, @Param("className") String className);

    @Query("SELECT COUNT(DISTINCT s) FROM Student s WHERE s.schoolClass.id = :classId OR (s.schoolClass IS NULL AND LOWER(s.studentClass) = LOWER(:className))")
    long countByClassIdOrClassName(@Param("classId") Long classId, @Param("className") String className);
}