package com.miessan.schoolmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(
    name = "enrollments",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "subject_id"})
    }
)
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties("enrollments")
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    @JsonIgnoreProperties("enrollments")
    private Subject subject;

    private Double grade;

    private Double caScore;

    private Double examScore;

    private Double totalScore;

    private String academicYear;

    private String semester;

    private LocalDate enrolledDate;

    public Enrollment() {
        this.enrolledDate = LocalDate.now();
    }

    public Enrollment(Student student, Subject subject) {
        this.student = student;
        this.subject = subject;
        this.enrolledDate = LocalDate.now();
    }

    public Enrollment(Student student, Subject subject, Double grade, String academicYear, String semester, LocalDate enrolledDate) {
        this.student = student;
        this.subject = subject;
        this.grade = grade;
        this.academicYear = academicYear;
        this.semester = semester;
        this.enrolledDate = enrolledDate != null ? enrolledDate : LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Double getGrade() {
        return grade;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
    }

    public Double getCaScore() {
        return caScore;
    }

    public void setCaScore(Double caScore) {
        this.caScore = caScore;
        calculateTotalScore();
    }

    public Double getExamScore() {
        return examScore;
    }

    public void setExamScore(Double examScore) {
        this.examScore = examScore;
        calculateTotalScore();
    }

    public Double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Double totalScore) {
        this.totalScore = totalScore;
        this.grade = totalScore;
    }

    public Double calculateTotalScore() {
        if (caScore == null && examScore == null) {
            this.totalScore = null;
            this.grade = null;
            return null;
        }
        double ca = caScore != null ? caScore : 0.0;
        double exam = examScore != null ? examScore : 0.0;
        this.totalScore = ca + exam;
        this.grade = this.totalScore;
        return this.totalScore;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public LocalDate getEnrolledDate() {
        return enrolledDate;
    }

    public void setEnrolledDate(LocalDate enrolledDate) {
        this.enrolledDate = enrolledDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Enrollment that = (Enrollment) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
