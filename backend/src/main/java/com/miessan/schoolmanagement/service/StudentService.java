package com.miessan.schoolmanagement.service;

import com.miessan.schoolmanagement.dto.StudentRegistrationDto;
import com.miessan.schoolmanagement.model.DailyAttendance;
import com.miessan.schoolmanagement.model.Enrollment;
import com.miessan.schoolmanagement.model.SchoolClass;
import com.miessan.schoolmanagement.model.Student;
import com.miessan.schoolmanagement.model.Subject;
import com.miessan.schoolmanagement.repository.SchoolClassRepository;
import com.miessan.schoolmanagement.repository.StudentRepository;
import com.miessan.schoolmanagement.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolClassRepository classRepository;

    public StudentService(StudentRepository studentRepository, SubjectRepository subjectRepository) {
        this(studentRepository, subjectRepository, null);
    }

    @org.springframework.beans.factory.annotation.Autowired
    public StudentService(StudentRepository studentRepository, SubjectRepository subjectRepository, SchoolClassRepository classRepository) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.classRepository = classRepository;
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    public Student registerStudent(StudentRegistrationDto registrationDto) {
        Student student = new Student();
        student.setName(registrationDto.getName());
        student.setGender(registrationDto.getGender());
        student.setStudentClass(registrationDto.getStudentClass());

        if (classRepository != null && registrationDto.getStudentClass() != null && !registrationDto.getStudentClass().isBlank()) {
            SchoolClass schoolClass = classRepository.findByNameIgnoreCase(registrationDto.getStudentClass().trim())
                    .orElseGet(() -> classRepository.save(new SchoolClass(registrationDto.getStudentClass().trim())));
            student.setSchoolClass(schoolClass);
        }

        student.setYearOfEnrollment(registrationDto.getYearOfEnrollment());
        student.setDateOfBirth(registrationDto.getDateOfBirth());
        student.setEmail(registrationDto.getEmail());
        student.setPhone(registrationDto.getPhone());

        if (registrationDto.getSubjects() != null) {
            for (String subjectName : registrationDto.getSubjects()) {
                Subject subject = subjectRepository.findByName(subjectName)
                        .orElseGet(() -> subjectRepository.save(new Subject(subjectName)));
                student.addEnrollment(new Enrollment(student, subject));
            }
        }

        student.setGpa(registrationDto.getGpa() != null ? registrationDto.getGpa() : 0.0);
        student.setAttendance(registrationDto.getAttendance() != null ? registrationDto.getAttendance() : 100);
        student.setDailyAttendance(registrationDto.getDailyAttendance() != null ? registrationDto.getDailyAttendance() : new DailyAttendance("Unmarked", "--"));
        student.setFeesStatus(registrationDto.getFeesStatus() != null ? registrationDto.getFeesStatus() : "Pending");
        student.setGuardian(registrationDto.getGuardian());

        return studentRepository.save(student);
    }

    public Optional<Student> updateStudent(Long id, StudentRegistrationDto registrationDto) {
        return studentRepository.findById(id).map(student -> {
            student.setName(registrationDto.getName());
            student.setGender(registrationDto.getGender());
            student.setStudentClass(registrationDto.getStudentClass());

            if (classRepository != null && registrationDto.getStudentClass() != null && !registrationDto.getStudentClass().isBlank()) {
                SchoolClass schoolClass = classRepository.findByNameIgnoreCase(registrationDto.getStudentClass().trim())
                        .orElseGet(() -> classRepository.save(new SchoolClass(registrationDto.getStudentClass().trim())));
                student.setSchoolClass(schoolClass);
            }

            student.setYearOfEnrollment(registrationDto.getYearOfEnrollment());
            student.setDateOfBirth(registrationDto.getDateOfBirth());
            student.setEmail(registrationDto.getEmail());
            student.setPhone(registrationDto.getPhone());

            if (registrationDto.getSubjects() != null) {
                Set<String> newSubjectNames = new HashSet<>(registrationDto.getSubjects());

                // Remove enrollments that are no longer selected
                student.getEnrollments().removeIf(enrollment ->
                        enrollment.getSubject() != null && !newSubjectNames.contains(enrollment.getSubject().getName())
                );

                // Find subjects already enrolled
                Set<String> existingSubjectNames = student.getEnrollments().stream()
                        .map(e -> e.getSubject() != null ? e.getSubject().getName() : null)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());

                // Add newly selected subjects
                for (String subjectName : newSubjectNames) {
                    if (!existingSubjectNames.contains(subjectName)) {
                        Subject subject = subjectRepository.findByName(subjectName)
                                .orElseGet(() -> subjectRepository.save(new Subject(subjectName)));
                        student.addEnrollment(new Enrollment(student, subject));
                    }
                }
            }

            if (registrationDto.getGpa() != null) {
                student.setGpa(registrationDto.getGpa());
            }
            if (registrationDto.getAttendance() != null) {
                student.setAttendance(registrationDto.getAttendance());
            }
            if (registrationDto.getDailyAttendance() != null) {
                student.setDailyAttendance(registrationDto.getDailyAttendance());
            }
            if (registrationDto.getFeesStatus() != null) {
                student.setFeesStatus(registrationDto.getFeesStatus());
            }
            if (registrationDto.getGuardian() != null) {
                student.setGuardian(registrationDto.getGuardian());
            }

            return studentRepository.save(student);
        });
    }

    public void deleteById(Long id) {
        studentRepository.deleteById(id);
    }
}
