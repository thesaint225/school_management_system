package com.miessan.schoolmanagement.service;

import com.miessan.schoolmanagement.dto.TeacherRegistrationDto;
import com.miessan.schoolmanagement.model.Teacher;
import com.miessan.schoolmanagement.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public List<Teacher> findAll() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> findById(Long id) {
        return teacherRepository.findById(id);
    }

    public Teacher registerTeacher(TeacherRegistrationDto dto) {
        Teacher teacher = new Teacher();
        teacher.setFirstName(dto.getFirstName());
        teacher.setLastName(dto.getLastName());
        teacher.setEmail(dto.getEmail());
        teacher.setPhone(dto.getPhone());
        teacher.setGender(dto.getGender());
        teacher.setDateOfBirth(dto.getDateOfBirth());
        teacher.setHireDate(dto.getHireDate() != null ? dto.getHireDate() : LocalDate.now());
        teacher.setDepartment(dto.getDepartment());
        teacher.setQualification(dto.getQualification());
        teacher.setEmploymentStatus(dto.getEmploymentStatus() != null ? dto.getEmploymentStatus() : "Full-time");

        if (dto.getSubjects() != null) {
            teacher.setSubjects(new ArrayList<>(dto.getSubjects()));
        }
        if (dto.getClasses() != null) {
            teacher.setClasses(new ArrayList<>(dto.getClasses()));
        }

        Teacher saved = teacherRepository.save(teacher);

        // Auto-generate unique staff ID if not set
        if (saved.getTeacherNumber() == null || saved.getTeacherNumber().isBlank()) {
            int year = saved.getHireDate() != null ? saved.getHireDate().getYear() : LocalDate.now().getYear();
            saved.setTeacherNumber(String.format("TEA-%d-%04d", year, saved.getId()));
            saved = teacherRepository.save(saved);
        }

        return saved;
    }

    public Optional<Teacher> updateTeacher(Long id, TeacherRegistrationDto dto) {
        return teacherRepository.findById(id).map(teacher -> {
            teacher.setFirstName(dto.getFirstName());
            teacher.setLastName(dto.getLastName());
            teacher.setEmail(dto.getEmail());
            teacher.setPhone(dto.getPhone());
            teacher.setGender(dto.getGender());
            teacher.setDateOfBirth(dto.getDateOfBirth());
            if (dto.getHireDate() != null) {
                teacher.setHireDate(dto.getHireDate());
            }
            teacher.setDepartment(dto.getDepartment());
            teacher.setQualification(dto.getQualification());
            if (dto.getEmploymentStatus() != null) {
                teacher.setEmploymentStatus(dto.getEmploymentStatus());
            }
            if (dto.getSubjects() != null) {
                teacher.setSubjects(new ArrayList<>(dto.getSubjects()));
            }
            if (dto.getClasses() != null) {
                teacher.setClasses(new ArrayList<>(dto.getClasses()));
            }
            return teacherRepository.save(teacher);
        });
    }

    public void deleteById(Long id) {
        teacherRepository.deleteById(id);
    }
}
