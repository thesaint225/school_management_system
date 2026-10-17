package com.miessan.schoolmanagement.dto;

import java.util.ArrayList;
import java.util.List;

public class StudentReportDto {

    private Long studentId;
    private String studentName;
    private String studentClass;
    private String email;
    private String academicYear;
    private String term;
    private Double totalMarks;
    private Double averageScore;
    private int evaluatedSubjectsCount;
    private int totalSubjectsCount;
    private String teacherRemark;
    private String headteacherRemark;
    private List<SubjectScoreItem> subjectScores = new ArrayList<>();

    public StudentReportDto() {
    }

    public static class SubjectScoreItem {
        private String subjectName;
        private Double caScore;
        private Double examScore;
        private Double totalScore;
        private String remark;

        public SubjectScoreItem() {
        }

        public SubjectScoreItem(String subjectName, Double caScore, Double examScore, Double totalScore, String remark) {
            this.subjectName = subjectName;
            this.caScore = caScore;
            this.examScore = examScore;
            this.totalScore = totalScore;
            this.remark = remark;
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

        public Double getTotalScore() {
            return totalScore;
        }

        public void setTotalScore(Double totalScore) {
            this.totalScore = totalScore;
        }

        public String getRemark() {
            return remark;
        }

        public void setRemark(String remark) {
            this.remark = remark;
        }
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentClass() {
        return studentClass;
    }

    public void setStudentClass(String studentClass) {
        this.studentClass = studentClass;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public int getEvaluatedSubjectsCount() {
        return evaluatedSubjectsCount;
    }

    public void setEvaluatedSubjectsCount(int evaluatedSubjectsCount) {
        this.evaluatedSubjectsCount = evaluatedSubjectsCount;
    }

    public int getTotalSubjectsCount() {
        return totalSubjectsCount;
    }

    public void setTotalSubjectsCount(int totalSubjectsCount) {
        this.totalSubjectsCount = totalSubjectsCount;
    }

    public String getTeacherRemark() {
        return teacherRemark;
    }

    public void setTeacherRemark(String teacherRemark) {
        this.teacherRemark = teacherRemark;
    }

    public String getHeadteacherRemark() {
        return headteacherRemark;
    }

    public void setHeadteacherRemark(String headteacherRemark) {
        this.headteacherRemark = headteacherRemark;
    }

    public List<SubjectScoreItem> getSubjectScores() {
        return subjectScores;
    }

    public void setSubjectScores(List<SubjectScoreItem> subjectScores) {
        this.subjectScores = subjectScores;
    }
}
