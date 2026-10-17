package com.miessan.schoolmanagement.service;

import com.miessan.schoolmanagement.dto.ClassRequestDto;
import com.miessan.schoolmanagement.dto.ClassResponseDto;
import com.miessan.schoolmanagement.model.SchoolClass;
import com.miessan.schoolmanagement.model.Student;
import com.miessan.schoolmanagement.repository.SchoolClassRepository;
import com.miessan.schoolmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class SchoolClassService {

    private final SchoolClassRepository classRepository;
    private final StudentRepository studentRepository;

    public SchoolClassService(SchoolClassRepository classRepository, StudentRepository studentRepository) {
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
    }

    public List<ClassResponseDto> findAll(boolean activeOnly) {
        List<SchoolClass> classes = activeOnly ? classRepository.findByActiveTrue() : classRepository.findAll();
        return classes.stream()
                .map(this::toResponseDto)
                .toList();
    }

    public Optional<ClassResponseDto> findById(Long id) {
        return classRepository.findById(id).map(this::toResponseDto);
    }

    public Optional<SchoolClass> findEntityById(Long id) {
        return classRepository.findById(id);
    }

    public ClassResponseDto createClass(ClassRequestDto dto) {
        if (classRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new IllegalArgumentException("A class with the name '" + dto.getName().trim() + "' already exists.");
        }

        SchoolClass schoolClass = new SchoolClass();
        schoolClass.setName(dto.getName().trim());
        schoolClass.setDescription(dto.getDescription());
        schoolClass.setActive(dto.getActive() != null ? dto.getActive() : true);

        SchoolClass saved = classRepository.save(schoolClass);
        return toResponseDto(saved);
    }

    public Optional<ClassResponseDto> updateClass(Long id, ClassRequestDto dto) {
        return classRepository.findById(id).map(schoolClass -> {
            String newName = dto.getName().trim();
            if (!schoolClass.getName().equalsIgnoreCase(newName) && classRepository.existsByNameIgnoreCase(newName)) {
                throw new IllegalArgumentException("A class with the name '" + newName + "' already exists.");
            }

            String oldName = schoolClass.getName();
            schoolClass.setName(newName);
            schoolClass.setDescription(dto.getDescription());
            if (dto.getActive() != null) {
                schoolClass.setActive(dto.getActive());
            }

            SchoolClass saved = classRepository.save(schoolClass);

            // Sync student records if class name changed
            if (!oldName.equalsIgnoreCase(newName)) {
                List<Student> students = studentRepository.findBySchoolClassId(id);
                for (Student student : students) {
                    student.setStudentClass(newName);
                    studentRepository.save(student);
                }
            }

            return toResponseDto(saved);
        });
    }

    public Map<String, Object> deleteOrDeactivate(Long id) {
        Optional<SchoolClass> classOpt = classRepository.findById(id);
        if (classOpt.isEmpty()) {
            throw new NoSuchElementException("Class with ID " + id + " does not exist.");
        }

        SchoolClass schoolClass = classOpt.get();
        long enrolledCount = studentRepository.countBySchoolClassId(id);
        if (enrolledCount == 0 && schoolClass.getName() != null) {
            enrolledCount = studentRepository.countByStudentClassIgnoreCase(schoolClass.getName());
        }

        Map<String, Object> result = new HashMap<>();

        if (enrolledCount > 0) {
            // Safe Deactivation: keep academic data intact without breaking relational records
            schoolClass.setActive(false);
            classRepository.save(schoolClass);
            result.put("message", "Class '" + schoolClass.getName() + "' has " + enrolledCount + " active student enrollment(s). It has been safely deactivated / archived to preserve academic records.");
            result.put("status", "ARCHIVED");
            result.put("action", "DEACTIVATED");
            result.put("class", toResponseDto(schoolClass));
        } else {
            classRepository.delete(schoolClass);
            result.put("message", "Class '" + schoolClass.getName() + "' had no assigned students and was permanently deleted.");
            result.put("status", "DELETED");
            result.put("action", "DELETED");
        }

        return result;
    }

    public List<Student> getStudentsByClassId(Long classId) {
        Optional<SchoolClass> classOpt = classRepository.findById(idOrThrow(classId));
        if (classOpt.isEmpty()) {
            return Collections.emptyList();
        }

        SchoolClass schoolClass = classOpt.get();
        return studentRepository.findByClassIdOrClassName(schoolClass.getId(), schoolClass.getName());
    }

    public Student assignStudentToClass(Long classId, Long studentId) {
        SchoolClass schoolClass = classRepository.findById(classId)
                .orElseThrow(() -> new NoSuchElementException("Class with ID " + classId + " does not exist."));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student with ID " + studentId + " does not exist."));

        student.setSchoolClass(schoolClass);
        student.setStudentClass(schoolClass.getName());
        return studentRepository.save(student);
    }

    public Student removeStudentFromClass(Long classId, Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student with ID " + studentId + " does not exist."));

        student.setSchoolClass(null);
        student.setStudentClass("Unassigned");
        return studentRepository.save(student);
    }

    private Long idOrThrow(Long id) {
        if (id == null) throw new IllegalArgumentException("Class ID cannot be null");
        return id;
    }

    private ClassResponseDto toResponseDto(SchoolClass schoolClass) {
        long count = studentRepository.countByClassIdOrClassName(schoolClass.getId(), schoolClass.getName());
        return new ClassResponseDto(
                schoolClass.getId(),
                schoolClass.getName(),
                schoolClass.getDescription(),
                schoolClass.getActive(),
                (int) count
        );
    }
}
