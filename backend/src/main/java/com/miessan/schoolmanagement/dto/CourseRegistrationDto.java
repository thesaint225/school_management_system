package com.miessan.schoolmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CourseRegistrationDto {

    @NotBlank
    private  String courseName;

    @NotBlank
    private String courseDescription;

    @Positive
    private int creditHours;

    public String getCourseDescription() {
        return courseDescription;
    }

    public String getCourseName() {
        return courseName;
    }

    public int getCreditHours() {
        return creditHours;
    }
}
