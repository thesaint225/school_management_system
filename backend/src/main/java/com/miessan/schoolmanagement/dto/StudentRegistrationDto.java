package com.miessan.schoolmanagement.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.miessan.schoolmanagement.model.DailyAttendance;
import com.miessan.schoolmanagement.model.Guardian;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;
import java.util.List;

public class StudentRegistrationDto {

    @NotBlank(message = "Please enter the student's full legal name (e.g. Ama Mensah)")
    private String name;

    private String gender;

    @JsonProperty("class")
    private String studentClass;

    private Integer yearOfEnrollment;

    @Past(message = "Please choose a past date. Date of birth cannot be today or in the future")
    private LocalDate dateOfBirth;

    @Email(message = "Please enter a valid email address with '@' and domain (e.g. name@school.edu)")
    private String email;

    private String phone;

    private List<String> subjects;

    private Double gpa;

    private Integer attendance;

    private DailyAttendance dailyAttendance;

    private String feesStatus;

    private Guardian guardian;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getStudentClass() {
        return studentClass;
    }

    public void setStudentClass(String studentClass) {
        this.studentClass = studentClass;
    }

    public Integer getYearOfEnrollment() {
        return yearOfEnrollment;
    }

    public void setYearOfEnrollment(Integer yearOfEnrollment) {
        this.yearOfEnrollment = yearOfEnrollment;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<String> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }

    public Double getGpa() {
        return gpa;
    }

    public void setGpa(Double gpa) {
        this.gpa = gpa;
    }

    public Integer getAttendance() {
        return attendance;
    }

    public void setAttendance(Integer attendance) {
        this.attendance = attendance;
    }

    public DailyAttendance getDailyAttendance() {
        return dailyAttendance;
    }

    public void setDailyAttendance(DailyAttendance dailyAttendance) {
        this.dailyAttendance = dailyAttendance;
    }

    public String getFeesStatus() {
        return feesStatus;
    }

    public void setFeesStatus(String feesStatus) {
        this.feesStatus = feesStatus;
    }

    public Guardian getGuardian() {
        return guardian;
    }

    public void setGuardian(Guardian guardian) {
        this.guardian = guardian;
    }
}
