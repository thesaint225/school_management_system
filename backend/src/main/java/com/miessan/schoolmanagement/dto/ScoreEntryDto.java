package com.miessan.schoolmanagement.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ScoreEntryDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @Min(value = 0, message = "CA score cannot be less than 0")
    @Max(value = 100, message = "CA score cannot exceed 100")
    private Double caScore;

    @Min(value = 0, message = "Exam score cannot be less than 0")
    @Max(value = 100, message = "Exam score cannot exceed 100")
    private Double examScore;

    public ScoreEntryDto() {
    }

    public ScoreEntryDto(Long studentId, String subjectName, Double caScore, Double examScore) {
        this.studentId = studentId;
        this.subjectName = subjectName;
        this.caScore = caScore;
        this.examScore = examScore;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Double getCaScore() {
        return caScore;
    }

    public void setCaScore(Double caScore) {
        this.caScore = caScore;
    }

    public Double getExamScore() {
        return examScore;
    }

    public void setExamScore(Double examScore) {
        this.examScore = examScore;
    }
}
