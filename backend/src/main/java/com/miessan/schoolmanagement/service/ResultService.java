package com.miessan.schoolmanagement.service;

import com.miessan.schoolmanagement.dto.ScoreEntryDto;
import com.miessan.schoolmanagement.dto.StudentReportDto;
import com.miessan.schoolmanagement.model.Enrollment;
import com.miessan.schoolmanagement.model.Student;
import com.miessan.schoolmanagement.model.Subject;
import com.miessan.schoolmanagement.repository.EnrollmentRepository;
import com.miessan.schoolmanagement.repository.StudentRepository;
import com.miessan.schoolmanagement.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ResultService {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ResultService(StudentRepository studentRepository,
                         SubjectRepository subjectRepository,
                         EnrollmentRepository enrollmentRepository) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public Enrollment saveScore(ScoreEntryDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + dto.getStudentId()));

        Subject subject = subjectRepository.findByNameIgnoreCase(dto.getSubjectName().trim())
                .orElseGet(() -> subjectRepository.save(new Subject(dto.getSubjectName().trim())));

        Enrollment enrollment = enrollmentRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId())
                .orElseGet(() -> {
                    Enrollment newEnrollment = new Enrollment(student, subject);
                    student.addEnrollment(newEnrollment);
                    return newEnrollment;
                });

        enrollment.setCaScore(dto.getCaScore());
        enrollment.setExamScore(dto.getExamScore());
        enrollment.calculateTotalScore();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Update student GPA / average if applicable
        updateStudentGpa(student);

        return savedEnrollment;
    }

    @Transactional(readOnly = true)
    public Optional<StudentReportDto> getStudentReport(Long studentId) {
        return studentRepository.findById(studentId).map(this::buildReportDto);
    }

    @Transactional(readOnly = true)
    public List<StudentReportDto> getAllStudentReports() {
        List<Student> students = studentRepository.findAll();
        List<StudentReportDto> reports = new ArrayList<>();
        for (Student student : students) {
            reports.add(buildReportDto(student));
        }
        return reports;
    }

    private StudentReportDto buildReportDto(Student student) {
        StudentReportDto report = new StudentReportDto();
        report.setStudentId(student.getId());
        report.setStudentName(student.getName());
        report.setStudentClass(student.getStudentClass() != null ? student.getStudentClass() : "Form 1A");
        report.setEmail(student.getEmail());
        report.setAcademicYear("2026/2027");
        report.setTerm("Term 1");

        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        List<StudentReportDto.SubjectScoreItem> scoreItems = new ArrayList<>();

        double sumTotal = 0.0;
        int evaluatedCount = 0;

        for (Enrollment e : enrollments) {
            String subName = e.getSubject() != null ? e.getSubject().getName() : "Unknown";
            Double ca = e.getCaScore();
            Double exam = e.getExamScore();
            Double total = e.getTotalScore();

            String remark = getScoreRemark(total);

            scoreItems.add(new StudentReportDto.SubjectScoreItem(subName, ca, exam, total, remark));

            if (total != null) {
                sumTotal += total;
                evaluatedCount++;
            }
        }

        report.setSubjectScores(scoreItems);
        report.setTotalSubjectsCount(enrollments.size());
        report.setEvaluatedSubjectsCount(evaluatedCount);

        if (evaluatedCount > 0) {
            report.setTotalMarks(Math.round(sumTotal * 10.0) / 10.0);
            double avg = sumTotal / evaluatedCount;
            report.setAverageScore(Math.round(avg * 10.0) / 10.0);
        } else {
            report.setTotalMarks(null);
            report.setAverageScore(null);
        }

        return report;
    }

    private void updateStudentGpa(Student student) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        double sum = 0.0;
        int count = 0;
        for (Enrollment e : enrollments) {
            if (e.getTotalScore() != null) {
                sum += e.getTotalScore();
                count++;
            }
        }
        if (count > 0) {
            student.setGpa(Math.round((sum / count) * 10.0) / 10.0);
            studentRepository.save(student);
        }
    }

    private String getScoreRemark(Double totalScore) {
        if (totalScore == null) return "Pending";
        if (totalScore >= 80) return "Excellent";
        if (totalScore >= 70) return "Very Good";
        if (totalScore >= 60) return "Good";
        if (totalScore >= 50) return "Pass";
        return "Needs Support";
    }
}
