package com.miessan.schoolmanagement.service;

import com.miessan.schoolmanagement.dto.CourseRegistrationDto;
import com.miessan.schoolmanagement.model.Course;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    private  final List <Course> courses = new ArrayList<>();


    //    LIST ALL COURSES
    public List<Course> findAll(){

        return courses;

    }

//    register course

    public  Course registerCourse(CourseRegistrationDto registrationDto){
        Course course = new Course();

        course.setCourseName(registrationDto.getCourseName());
        course.setCourseDescription(registrationDto.getCourseDescription());
        course.setCreditHours(registrationDto.getCreditHours());

        courses.add(course);


        return course;
    }
}
