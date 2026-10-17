package com.miessan.schoolmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Please enter the student's full legal name (e.g. Ama Mensah)")
    private String name;

    private String gender;

    @JsonProperty("class")
    @Column(name = "student_class")
    private String studentClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    @JsonIgnore
    private SchoolClass schoolClass;

    private Integer yearOfEnrollment;

    @Past(message = "Please choose a past date. Date of birth cannot be today or in the future")
    private LocalDate dateOfBirth;

    @Email(message = "Please enter a valid email address with '@' and domain (e.g. name@school.edu)")
    private String email;

    private String phone;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Enrollment> enrollments = new ArrayList<>();

    private Double gpa;

    private Integer attendance;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "status", column = @Column(name = "daily_attendance_status")),
            @AttributeOverride(name = "timestamp", column = @Column(name = "daily_attendance_timestamp"))
    })
    private DailyAttendance dailyAttendance;

    private String feesStatus;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "guardian_name")),
            @AttributeOverride(name = "relation", column = @Column(name = "guardian_relation")),
            @AttributeOverride(name = "phone", column = @Column(name = "guardian_phone"))
    })
    private Guardian guardian;

    public Student() {
    }

    public Student(Long id, String name, String gender, String studentClass, Integer yearOfEnrollment,
            LocalDate dateOfBirth, String email, String phone, List<Enrollment> enrollments, Double gpa,
            Integer attendance, DailyAttendance dailyAttendance, String feesStatus, Guardian guardian) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.studentClass = studentClass;
        this.yearOfEnrollment = yearOfEnrollment;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.phone = phone;
        this.enrollments = enrollments != null ? enrollments : new ArrayList<>();
        this.gpa = gpa;
        this.attendance = attendance;
        this.dailyAttendance = dailyAttendance;
        this.feesStatus = feesStatus;
        this.guardian = guardian;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        if (schoolClass != null && schoolClass.getName() != null) {
            return schoolClass.getName();
        }
        return studentClass;
    }

    public void setStudentClass(String studentClass) {
        this.studentClass = studentClass;
    }

    public SchoolClass getSchoolClass() {
        return schoolClass;
    }

    public void setSchoolClass(SchoolClass schoolClass) {
        this.schoolClass = schoolClass;
        if (schoolClass != null) {
            this.studentClass = schoolClass.getName();
        }
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

    @JsonIgnore
    public List<Enrollment> getEnrollments() {
        return enrollments;
    }

    @JsonProperty("subjects")
    public List<String> getSubjects() {
        if (enrollments == null) return new ArrayList<>();
        return enrollments.stream()
                .map(e -> e.getSubject() != null ? e.getSubject().getName() : null)
                .filter(Objects::nonNull)
                .toList();
    }

    public void setEnrollments(List<Enrollment> enrollments) {
        this.enrollments = enrollments;
    }

    public void addEnrollment(Enrollment enrollment) {
        this.enrollments.add(enrollment);
        enrollment.setStudent(this);
    }

    public void removeEnrollment(Enrollment enrollment) {
        this.enrollments.remove(enrollment);
        enrollment.setStudent(null);
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
