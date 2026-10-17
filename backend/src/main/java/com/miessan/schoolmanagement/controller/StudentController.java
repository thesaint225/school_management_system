package com.miessan.schoolmanagement.controller;

import com.miessan.schoolmanagement.dto.StudentRegistrationDto;
import com.miessan.schoolmanagement.model.Student;
import com.miessan.schoolmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentservice;

    public StudentController(StudentService studentservice) {
        this.studentservice = studentservice;
    }

    @PostMapping
    public Student createStudent(@Valid @RequestBody StudentRegistrationDto dto) {
        return studentservice.registerStudent(dto);
    }

    @GetMapping
    public List<Student> findAllStudents() {
        return studentservice.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentservice.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRegistrationDto dto) {
        return studentservice.updateStudent(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        if (studentservice.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        studentservice.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
