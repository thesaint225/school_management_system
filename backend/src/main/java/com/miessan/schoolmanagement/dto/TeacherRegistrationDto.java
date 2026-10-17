package com.miessan.schoolmanagement.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;
import java.util.List;

public class TeacherRegistrationDto {

    @NotBlank(message = "Please enter the teacher's first name (e.g. Kwame)")
    private String firstName;

    @NotBlank(message = "Please enter the teacher's last name (e.g. Mensah)")
    private String lastName;

    @NotBlank(message = "Please enter a valid email address with '@' and domain (e.g. name@school.edu)")
    @Email(message = "Please enter a valid email address with '@' and domain (e.g. name@school.edu)")
    private String email;

    @NotBlank(message = "Please enter a valid Ghanaian phone number (e.g. +233 24 123 4567)")
    private String phone;

    private String gender;

    @Past(message = "Please choose a past date. Date of birth cannot be today or in the future")
    private LocalDate dateOfBirth;

    private LocalDate hireDate;

    @NotBlank(message = "Please select or enter the teacher's primary department")
    private String department;

    private String qualification;

    private String employmentStatus; // "Full-time", "Part-time", "On Leave"

    private List<String> subjects;

    private List<String> classes;

    public TeacherRegistrationDto() {
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getEmploymentStatus() {
        return employmentStatus;
    }

    public void setEmploymentStatus(String employmentStatus) {
        this.employmentStatus = employmentStatus;
    }

    public List<String> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }

    public List<String> getClasses() {
        return classes;
    }

    public void setClasses(List<String> classes) {
        this.classes = classes;
    }
}
