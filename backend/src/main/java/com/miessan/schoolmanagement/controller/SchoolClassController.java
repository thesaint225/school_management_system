package com.miessan.schoolmanagement.controller;

import com.miessan.schoolmanagement.dto.ClassRequestDto;
import com.miessan.schoolmanagement.dto.ClassResponseDto;
import com.miessan.schoolmanagement.model.Student;
import com.miessan.schoolmanagement.service.SchoolClassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/classes")
public class SchoolClassController {

    private final SchoolClassService classService;

    public SchoolClassController(SchoolClassService classService) {
        this.classService = classService;
    }

    @GetMapping
    public List<ClassResponseDto> findAll(@RequestParam(value = "activeOnly", defaultValue = "false") boolean activeOnly) {
        return classService.findAll(activeOnly);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassResponseDto> findById(@PathVariable Long id) {
        return classService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<Student>> getStudentsByClassId(@PathVariable Long id) {
        if (classService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(classService.getStudentsByClassId(id));
    }

    @PostMapping
    public ResponseEntity<ClassResponseDto> createClass(@Valid @RequestBody ClassRequestDto dto) {
        ClassResponseDto created = classService.createClass(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassResponseDto> updateClass(@PathVariable Long id, @Valid @RequestBody ClassRequestDto dto) {
        return classService.updateClass(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteOrDeactivateClass(@PathVariable Long id) {
        try {
            Map<String, Object> result = classService.deleteOrDeactivate(id);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{classId}/students/{studentId}")
    public ResponseEntity<Student> assignStudentToClass(@PathVariable Long classId, @PathVariable Long studentId) {
        try {
            Student assigned = classService.assignStudentToClass(classId, studentId);
            return ResponseEntity.ok(assigned);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{classId}/students/{studentId}")
    public ResponseEntity<Student> removeStudentFromClass(@PathVariable Long classId, @PathVariable Long studentId) {
        try {
            Student updated = classService.removeStudentFromClass(classId, studentId);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
