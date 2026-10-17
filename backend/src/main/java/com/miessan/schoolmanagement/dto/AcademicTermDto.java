package com.miessan.schoolmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class AcademicTermDto {

    private String termCode;

    @NotBlank(message = "Term name is required")
    private String name;

    private String academicYear;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;

    private Integer totalWeeks;

    public AcademicTermDto() {
    }

    public AcademicTermDto(String termCode, String name, String academicYear, LocalDate startDate, LocalDate endDate, String status, Integer totalWeeks) {
        this.termCode = termCode;
        this.name = name;
        this.academicYear = academicYear;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.totalWeeks = totalWeeks;
    }

    public String getTermCode() {
        return termCode;
    }

    public void setTermCode(String termCode) {
        this.termCode = termCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalWeeks() {
        return totalWeeks;
    }

    public void setTotalWeeks(Integer totalWeeks) {
        this.totalWeeks = totalWeeks;
    }
}
