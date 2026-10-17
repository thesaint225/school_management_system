package com.miessan.schoolmanagement.repository;

import com.miessan.schoolmanagement.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByTeacherNumber(String teacherNumber);
    List<Teacher> findByDepartment(String department);
}
