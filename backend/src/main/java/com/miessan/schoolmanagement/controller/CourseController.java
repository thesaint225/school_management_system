package com.miessan.schoolmanagement.controller;

import com.miessan.schoolmanagement.dto.CourseRegistrationDto;
import com.miessan.schoolmanagement.model.Course;
import com.miessan.schoolmanagement.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;

// This constructor receives the CourseService from Spring
// and stores it in the courseService field so that
// any method in this controller can use the CourseService.
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }


    @PostMapping
    public Course createCourse(@Valid @RequestBody CourseRegistrationDto dto){

        return courseService.registerCourse(dto);

    }

    @GetMapping
    public List<Course> findAll(){
        return courseService.findAll();
    }
}
