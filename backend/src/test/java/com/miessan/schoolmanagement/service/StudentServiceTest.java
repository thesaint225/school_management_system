package com.miessan.schoolmanagement.service;

import com.miessan.schoolmanagement.dto.StudentRegistrationDto;
import com.miessan.schoolmanagement.model.Enrollment;
import com.miessan.schoolmanagement.model.Student;
import com.miessan.schoolmanagement.model.Subject;
import com.miessan.schoolmanagement.repository.StudentRepository;
import com.miessan.schoolmanagement.repository.SubjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SubjectRepository subjectRepository;

    private StudentService studentService;

    @BeforeEach
    void setUp() {
        studentService = new StudentService(studentRepository, subjectRepository);
    }

    @Test
    void registerStudent_WithSubjects_CreatesEnrollments() {
        StudentRegistrationDto dto = new StudentRegistrationDto();
        dto.setName("John Doe");
        dto.setEmail("john@example.com");
        dto.setSubjects(List.of("Math", "Science"));

        Subject math = new Subject(1L, "Math", "MTH101");
        Subject science = new Subject(2L, "Science", "SCI101");

        when(subjectRepository.findByName("Math")).thenReturn(Optional.of(math));
        when(subjectRepository.findByName("Science")).thenReturn(Optional.of(science));
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Student savedStudent = studentService.registerStudent(dto);

        assertNotNull(savedStudent);
        assertEquals("John Doe", savedStudent.getName());
        assertEquals(2, savedStudent.getEnrollments().size());

        List<String> enrolledSubjectNames = savedStudent.getEnrollments().stream()
                .map(Enrollment::getSubject)
                .map(Subject::getName)
                .toList();

        assertTrue(enrolledSubjectNames.contains("Math"));
        assertTrue(enrolledSubjectNames.contains("Science"));
        verify(studentRepository).save(savedStudent);
    }
}
