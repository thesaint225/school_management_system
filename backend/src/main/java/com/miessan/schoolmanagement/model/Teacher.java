package com.miessan.schoolmanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teacher_number", unique = true)
    private String teacherNumber;

    @NotBlank(message = "Please enter the teacher's first name (e.g. Kwame)")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Please enter the teacher's last name (e.g. Mensah)")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Email(message = "Please enter a valid email address with '@' and domain (e.g. k.mensah@school.edu)")
    private String email;

    private String phone;

    private String gender;

    @Past(message = "Date of birth must be in the past")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    private String department;

    private String qualification;

    @Column(name = "employment_status")
    private String employmentStatus; // e.g. "Full-time", "Part-time", "On Leave"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "teacher_subjects", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "subject_name")
    private List<String> subjects = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "teacher_classes", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "class_name")
    private List<String> classes = new ArrayList<>();

    public Teacher() {
    }

    public Teacher(Long id, String teacherNumber, String firstName, String lastName, String email, String phone,
                   String gender, LocalDate dateOfBirth, LocalDate hireDate, String department,
                   String qualification, String employmentStatus, List<String> subjects) {
        this(id, teacherNumber, firstName, lastName, email, phone, gender, dateOfBirth, hireDate, department, qualification, employmentStatus, subjects, new ArrayList<>());
    }

    public Teacher(Long id, String teacherNumber, String firstName, String lastName, String email, String phone,
                   String gender, LocalDate dateOfBirth, LocalDate hireDate, String department,
                   String qualification, String employmentStatus, List<String> subjects, List<String> classes) {
        this.id = id;
        this.teacherNumber = teacherNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.hireDate = hireDate;
        this.department = department;
        this.qualification = qualification;
        this.employmentStatus = employmentStatus;
        this.subjects = subjects != null ? subjects : new ArrayList<>();
        this.classes = classes != null ? classes : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeacherNumber() {
        return teacherNumber;
    }

    public void setTeacherNumber(String teacherNumber) {
        this.teacherNumber = teacherNumber;
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

    @JsonProperty("name")
    public String getFullName() {
        String fn = firstName != null ? firstName : "";
        String ln = lastName != null ? lastName : "";
        return (fn + " " + ln).trim();
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
        this.subjects = subjects != null ? subjects : new ArrayList<>();
    }

    public List<String> getClasses() {
        return classes;
    }

    public void setClasses(List<String> classes) {
        this.classes = classes != null ? classes : new ArrayList<>();
    }
}
