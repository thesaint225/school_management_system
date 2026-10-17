package com.miessan.schoolmanagement.controller;

import com.miessan.schoolmanagement.dto.StudentRegistrationDto;
import com.miessan.schoolmanagement.model.Student;
import com.miessan.schoolmanagement.service.StudentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StudentService studentService;

    @Test
    void createStudent_ReturnsCreatedStudent() throws Exception {
        String jsonContent = "{ \"name\": \"John Doe\", \"dateOfBirth\": \"2000-01-01\", \"email\": \"john.doe@example.com\" }";

        Student student = new Student();
        student.setId(1L);
        student.setName("John Doe");

        when(studentService.registerStudent(any(StudentRegistrationDto.class))).thenReturn(student);

        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonContent))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void findAllStudents_ReturnsStudentList() throws Exception {
        Student student = new Student();
        student.setId(1L);
        student.setName("John Doe");

        when(studentService.findAll()).thenReturn(List.of(student));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("John Doe"));
    }

    @Test
    void getStudentById_WhenExists_ReturnsStudent() throws Exception {
        Student student = new Student();
        student.setId(1L);
        student.setName("John Doe");

        when(studentService.findById(1L)).thenReturn(Optional.of(student));

        mockMvc.perform(get("/api/students/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void getStudentById_WhenDoesNotExist_ReturnsNotFound() throws Exception {
        when(studentService.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/students/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateStudent_WhenExists_ReturnsUpdatedStudent() throws Exception {
        String jsonContent = "{ \"name\": \"Jane Doe\", \"dateOfBirth\": \"2001-01-01\" }";

        Student student = new Student();
        student.setId(1L);
        student.setName("Jane Doe");

        when(studentService.updateStudent(eq(1L), any(StudentRegistrationDto.class))).thenReturn(Optional.of(student));

        mockMvc.perform(put("/api/students/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonContent))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Jane Doe"));
    }

    @Test
    void deleteStudent_WhenStudentExists_ReturnsNoContent() throws Exception {
        Long studentId = 1L;
        Student student = new Student();
        student.setId(studentId);

        when(studentService.findById(studentId)).thenReturn(Optional.of(student));
        doNothing().when(studentService).deleteById(studentId);

        mockMvc.perform(delete("/api/students/{id}", studentId))
                .andExpect(status().isNoContent());

        Mockito.verify(studentService).deleteById(studentId);
    }

    @Test
    void deleteStudent_WhenStudentDoesNotExist_ReturnsNotFound() throws Exception {
        Long nonExistentId = 999L;

        when(studentService.findById(nonExistentId)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/students/{id}", nonExistentId))
                .andExpect(status().isNotFound());

        Mockito.verify(studentService, Mockito.never()).deleteById(nonExistentId);
    }
}
