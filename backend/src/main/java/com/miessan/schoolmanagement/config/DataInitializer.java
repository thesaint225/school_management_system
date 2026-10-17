package com.miessan.schoolmanagement.config;

import com.miessan.schoolmanagement.dto.StudentRegistrationDto;
import com.miessan.schoolmanagement.dto.TeacherRegistrationDto;
import com.miessan.schoolmanagement.model.AcademicTerm;
import com.miessan.schoolmanagement.model.CalendarEvent;
import com.miessan.schoolmanagement.model.DailyAttendance;
import com.miessan.schoolmanagement.model.Enrollment;
import com.miessan.schoolmanagement.model.Guardian;
import com.miessan.schoolmanagement.model.SchoolClass;
import com.miessan.schoolmanagement.model.Student;
import com.miessan.schoolmanagement.model.Subject;
import com.miessan.schoolmanagement.repository.AcademicTermRepository;
import com.miessan.schoolmanagement.repository.CalendarEventRepository;
import com.miessan.schoolmanagement.repository.EnrollmentRepository;
import com.miessan.schoolmanagement.repository.SchoolClassRepository;
import com.miessan.schoolmanagement.repository.StudentRepository;
import com.miessan.schoolmanagement.repository.SubjectRepository;
import com.miessan.schoolmanagement.repository.TeacherRepository;
import com.miessan.schoolmanagement.service.StudentService;
import com.miessan.schoolmanagement.service.TeacherService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            StudentRepository studentRepository,
            StudentService studentService,
            TeacherRepository teacherRepository,
            TeacherService teacherService,
            SchoolClassRepository classRepository,
            SubjectRepository subjectRepository,
            EnrollmentRepository enrollmentRepository,
            AcademicTermRepository termRepository,
            CalendarEventRepository eventRepository) {
        return args -> {
            // 1. Ensure standard classes exist
            List<String> defaultClasses = List.of("Form 1A", "Form 1B", "Form 2A", "Form 2B", "Form 3A", "Form 3B", "Form 1", "Form 2", "Form 3");
            for (String clsName : defaultClasses) {
                if (!classRepository.existsByNameIgnoreCase(clsName)) {
                    classRepository.save(new SchoolClass(null, clsName, "Academic class stream for " + clsName, true));
                }
            }

            // 2. Ensure standard subjects exist
            if (subjectRepository.count() == 0) {
                subjectRepository.save(new Subject(null, "Mathematics", "MTH-101", "Science & Mathematics", "Core secondary mathematics curriculum covering algebra, geometry, and calculus.", true));
                subjectRepository.save(new Subject(null, "English", "ENG-101", "Languages", "English grammar, writing composition, and literature analysis.", true));
                subjectRepository.save(new Subject(null, "Integrated Science", "SCI-101", "Science & Mathematics", "Foundational natural sciences combining biology, chemistry, and physics.", true));
                subjectRepository.save(new Subject(null, "ICT", "ICT-101", "Information Technology", "Information and Communications Technology and practical programming.", true));
                subjectRepository.save(new Subject(null, "Physics", "PHY-201", "Science & Mathematics", "Advanced mechanics, waves, electromagnetism, and modern physics.", true));
                subjectRepository.save(new Subject(null, "Chemistry", "CHM-201", "Science & Mathematics", "Organic and inorganic chemistry, reaction dynamics, and lab work.", true));
                subjectRepository.save(new Subject(null, "Biology", "BIO-201", "Science & Mathematics", "Cellular biology, human physiology, ecology, and genetics.", true));
                subjectRepository.save(new Subject(null, "Economics", "ECO-201", "Humanities & Social Sciences", "Micro and macroeconomic principles, finance, and trade.", true));
                subjectRepository.save(new Subject(null, "Literature", "LIT-201", "Languages", "African and world literature, prose, poetry, and drama.", true));
                subjectRepository.save(new Subject(null, "Elective Maths", "EMTH-201", "Science & Mathematics", "Advanced mathematics for engineering and science paths.", true));
            }

            // 3. Ensure John Mensah and key faculty exist with proper class allocations
            boolean hasJohnMensah = teacherRepository.findAll().stream()
                    .anyMatch(t -> "John".equalsIgnoreCase(t.getFirstName()) && "Mensah".equalsIgnoreCase(t.getLastName()));

            if (!hasJohnMensah) {
                TeacherRegistrationDto t1 = new TeacherRegistrationDto();
                t1.setFirstName("John");
                t1.setLastName("Mensah");
                t1.setGender("Male");
                t1.setEmail("john.mensah@edumanage.edu");
                t1.setPhone("+233 24 111 2233");
                t1.setDateOfBirth(LocalDate.of(1985, 6, 12));
                t1.setHireDate(LocalDate.of(2021, 9, 1));
                t1.setDepartment("Science & Mathematics");
                t1.setQualification("B.Ed. Mathematics");
                t1.setEmploymentStatus("Full-time");
                t1.setSubjects(List.of("Mathematics"));
                t1.setClasses(List.of("Form 1A", "Form 2A"));
                teacherService.registerTeacher(t1);
            }

            // Also update any existing teachers with empty classes to have realistic default classes
            teacherRepository.findAll().forEach(teacher -> {
                if (teacher.getClasses() == null || teacher.getClasses().isEmpty()) {
                    if ("Languages".equalsIgnoreCase(teacher.getDepartment())) {
                        teacher.setClasses(List.of("Form 1A", "Form 1B", "Form 2A"));
                    } else if ("Information Technology".equalsIgnoreCase(teacher.getDepartment())) {
                        teacher.setClasses(List.of("Form 1A", "Form 2A", "Form 3A"));
                    } else if ("Humanities & Social Sciences".equalsIgnoreCase(teacher.getDepartment())) {
                        teacher.setClasses(List.of("Form 2A", "Form 3B"));
                    } else {
                        teacher.setClasses(List.of("Form 2A", "Form 3A", "Form 3B"));
                    }
                    teacherRepository.save(teacher);
                }
            });

            // 4. Seed Students if empty
            if (studentRepository.count() == 0) {
                StudentRegistrationDto s1 = new StudentRegistrationDto();
                s1.setName("Ama Mensah");
                s1.setGender("Female");
                s1.setStudentClass("Form 1A");
                s1.setYearOfEnrollment(2024);
                s1.setDateOfBirth(LocalDate.of(2009, 4, 15));
                s1.setEmail("ama.mensah@edumanage.edu");
                s1.setPhone("+233 24 123 4567");
                s1.setSubjects(List.of("Mathematics", "English", "Integrated Science", "ICT"));
                s1.setGpa(3.85);
                s1.setAttendance(96);
                s1.setDailyAttendance(new DailyAttendance("Present", "08:05 GMT"));
                s1.setFeesStatus("Paid");
                s1.setGuardian(new Guardian("Mr. Kofi Mensah", "Father", "+233 20 987 6543"));
                studentService.registerStudent(s1);

                StudentRegistrationDto s2 = new StudentRegistrationDto();
                s2.setName("Henri Miessan");
                s2.setGender("Male");
                s2.setStudentClass("Form 3A");
                s2.setYearOfEnrollment(2023);
                s2.setDateOfBirth(LocalDate.of(2007, 9, 22));
                s2.setEmail("henri.miessan@edumanage.edu");
                s2.setPhone("+233 50 234 5678");
                s2.setSubjects(List.of("Physics", "Elective Maths", "Chemistry", "English"));
                s2.setGpa(3.92);
                s2.setAttendance(98);
                s2.setDailyAttendance(new DailyAttendance("Present", "07:55 GMT"));
                s2.setFeesStatus("Paid");
                s2.setGuardian(new Guardian("Mrs. Cynthia Miessan", "Mother", "+233 24 876 5432"));
                studentService.registerStudent(s2);

                StudentRegistrationDto s3 = new StudentRegistrationDto();
                s3.setName("Daniel Owusu");
                s3.setGender("Male");
                s3.setStudentClass("Form 2A");
                s3.setYearOfEnrollment(2024);
                s3.setDateOfBirth(LocalDate.of(2008, 11, 5));
                s3.setEmail("daniel.owusu@edumanage.edu");
                s3.setPhone("+233 27 345 6789");
                s3.setSubjects(List.of("Economics", "Geography", "Government", "English"));
                s3.setGpa(3.45);
                s3.setAttendance(91);
                s3.setDailyAttendance(new DailyAttendance("Late", "08:35 GMT"));
                s3.setFeesStatus("Pending");
                s3.setGuardian(new Guardian("Mr. Emmanuel Owusu", "Father", "+233 55 765 4321"));
                studentService.registerStudent(s3);

                StudentRegistrationDto s4 = new StudentRegistrationDto();
                s4.setName("Madam Fausty");
                s4.setGender("Female");
                s4.setStudentClass("Form 3B");
                s4.setYearOfEnrollment(2022);
                s4.setDateOfBirth(LocalDate.of(2006, 3, 18));
                s4.setEmail("fausty.mensah@edumanage.edu");
                s4.setPhone("+233 26 456 7890");
                s4.setSubjects(List.of("Literature", "French", "History", "English"));
                s4.setGpa(3.78);
                s4.setAttendance(94);
                s4.setDailyAttendance(new DailyAttendance("Present", "08:12 GMT"));
                s4.setFeesStatus("Paid");
                s4.setGuardian(new Guardian("Dr. Kwame Appiah", "Uncle", "+233 20 654 3210"));
                studentService.registerStudent(s4);

                StudentRegistrationDto s5 = new StudentRegistrationDto();
                s5.setName("Kwame Mensah");
                s5.setGender("Male");
                s5.setStudentClass("Form 1B");
                s5.setYearOfEnrollment(2025);
                s5.setDateOfBirth(LocalDate.of(2010, 1, 30));
                s5.setEmail("kwame.mensah@edumanage.edu");
                s5.setPhone("+233 54 876 5432");
                s5.setSubjects(List.of("Mathematics", "Integrated Science", "Social Studies", "ICT"));
                s5.setGpa(3.60);
                s5.setAttendance(89);
                s5.setDailyAttendance(new DailyAttendance("Absent", "--"));
                s5.setFeesStatus("Unpaid");
                s5.setGuardian(new Guardian("Mr. Ebenezer Mensah", "Father", "+233 24 555 1234"));
                studentService.registerStudent(s5);

                StudentRegistrationDto s6 = new StudentRegistrationDto();
                s6.setName("Abena Asante");
                s6.setGender("Female");
                s6.setStudentClass("Form 2B");
                s6.setYearOfEnrollment(2024);
                s6.setDateOfBirth(LocalDate.of(2008, 7, 12));
                s6.setEmail("abena.asante@edumanage.edu");
                s6.setPhone("+233 20 112 2334");
                s6.setSubjects(List.of("Biology", "Chemistry", "Elective Maths", "English"));
                s6.setGpa(3.95);
                s6.setAttendance(97);
                s6.setDailyAttendance(new DailyAttendance("Present", "07:50 GMT"));
                s6.setFeesStatus("Paid");
                s6.setGuardian(new Guardian("Mrs. Akua Asante", "Mother", "+233 50 998 8776"));
                studentService.registerStudent(s6);
            }

            // 5. Always ensure Ama Mensah has her initial scores and subjects populated
            studentRepository.findAll().stream()
                    .filter(s -> "Ama Mensah".equalsIgnoreCase(s.getName()))
                    .findFirst()
                    .ifPresent(ama -> {
                        List<Enrollment> amaEnrollments = enrollmentRepository.findByStudentId(ama.getId());
                        for (Enrollment en : amaEnrollments) {
                            String sub = en.getSubject() != null ? en.getSubject().getName() : "";
                            if ("Mathematics".equalsIgnoreCase(sub)) {
                                en.setCaScore(25.0);
                                en.setExamScore(65.0);
                                en.calculateTotalScore();
                            } else if ("English".equalsIgnoreCase(sub)) {
                                en.setCaScore(22.0);
                                en.setExamScore(60.0);
                                en.calculateTotalScore();
                            } else if ("Integrated Science".equalsIgnoreCase(sub) || "Science".equalsIgnoreCase(sub)) {
                                en.setCaScore(20.0);
                                en.setExamScore(56.0);
                                en.calculateTotalScore();
                            } else if ("ICT".equalsIgnoreCase(sub)) {
                                en.setCaScore(28.0);
                                en.setExamScore(60.0);
                                en.calculateTotalScore();
                            }
                            enrollmentRepository.save(en);
                        }
                    });

            // 6. Ensure academic terms exist
            if (termRepository.count() == 0) {
                termRepository.save(new AcademicTerm(null, "term-1-2026", "Term 1 (Harmattan Term)", "2026/2027", LocalDate.parse("2026-09-01"), LocalDate.parse("2026-12-18"), "Active", 15));
                termRepository.save(new AcademicTerm(null, "term-2-2027", "Term 2", "2026/2027", LocalDate.parse("2027-01-12"), LocalDate.parse("2027-04-16"), "Upcoming", 14));
                termRepository.save(new AcademicTerm(null, "term-3-2027", "Term 3", "2026/2027", LocalDate.parse("2027-05-04"), LocalDate.parse("2027-07-23"), "Upcoming", 12));
            }

            // 7. Ensure calendar events and academic milestones exist
            if (eventRepository.count() == 0) {
                eventRepository.save(new CalendarEvent(null, "cal-001", "term", "Term 1 Resumption Day", LocalDate.parse("2026-09-01"), "08:00 GMT", "Campus Wide", "First day of academic year 2026/2027 for all enrolled students.", "All Students & Staff", "Term Milestone"));
                eventRepository.save(new CalendarEvent(null, "cal-002", "term", "Term 1 Vacation & Speech Day", LocalDate.parse("2026-12-18"), "11:00 GMT", "Assembly Hall", "Official closing ceremony and report card distribution for Term 1.", "All Students & Parents", "Term Milestone"));
                eventRepository.save(new CalendarEvent(null, "cal-003", "event", "Freshers Orientation & Campus Tour", LocalDate.parse("2026-09-08"), "09:00 - 12:00 GMT", "Auditorium", "Welcome program and library tour for newly admitted Form 1 students.", "Form 1 Students", "Orientation"));
                eventRepository.save(new CalendarEvent(null, "cal-004", "event", "PTA General Assembly Meeting", LocalDate.parse("2026-10-21"), "14:00 - 16:30 GMT", "School Auditorium", "Parent-Teacher meeting on academic progress, development projects, and welfare.", "Parents & Teachers", "PTA Meeting"));
                eventRepository.save(new CalendarEvent(null, "cal-005", "event", "Inter-Houses Athletics Championship", LocalDate.parse("2026-11-12"), "08:30 - 16:00 GMT", "Sports Complex", "Annual track & field competitions between Aggrey, Gbewaa, and Tweneboa houses.", "All Students & Staff", "Sports"));
                eventRepository.save(new CalendarEvent(null, "cal-006", "event", "Science & ICT Innovation Exhibition", LocalDate.parse("2026-11-27"), "10:00 - 15:00 GMT", "Science Complex", "Student science projects, robotics display, and software demonstrations.", "All Classes", "Exhibition"));
                eventRepository.save(new CalendarEvent(null, "cal-007", "exam", "Mid-Term Assessment: Core Subjects", LocalDate.parse("2026-10-14"), "08:30 - 13:00 GMT", "Classrooms / Exam Hall", "Mathematics, English Language, and Integrated Science midterm assessment.", "Form 1, 2, 3", "Mid-Term Exam"));
                eventRepository.save(new CalendarEvent(null, "cal-008", "exam", "Mid-Term Assessment: Elective Subjects", LocalDate.parse("2026-10-15"), "09:00 - 14:00 GMT", "Designated Exam Rooms", "Physics, Chemistry, Accounting, Geography, Literature, and Technical Drawing.", "Form 2 & 3", "Mid-Term Exam"));
                eventRepository.save(new CalendarEvent(null, "cal-009", "exam", "End of Term 1 Final Examinations Begin", LocalDate.parse("2026-12-01"), "08:30 GMT", "Main Examination Halls", "Start of comprehensive end-of-term examinations across all subjects.", "All Classes", "Final Exam"));
                eventRepository.save(new CalendarEvent(null, "cal-010", "exam", "Form 3 Mock WAEC Practical Exams", LocalDate.parse("2026-12-08"), "08:00 - 15:30 GMT", "Science & Computer Labs", "Practical lab assessments for final-year candidates.", "Form 3 Students", "Mock Exam"));
                eventRepository.save(new CalendarEvent(null, "cal-011", "holiday", "Kwame Nkrumah Memorial Day", LocalDate.parse("2026-09-21"), "All Day", "National Statutory Holiday", "Ghana national public holiday celebrating the birthday of Dr. Kwame Nkrumah. School closed.", "General Public", "Public Holiday"));
                eventRepository.save(new CalendarEvent(null, "cal-012", "holiday", "Term 1 Mid-Term Break", LocalDate.parse("2026-10-24"), "All Day", "Campus Wide", "Mid-term break for students and staff. Normal classes resume on Monday, Oct 26.", "Students & Staff", "School Break"));
                eventRepository.save(new CalendarEvent(null, "cal-013", "holiday", "National Farmers' Day", LocalDate.parse("2026-12-04"), "All Day", "National Statutory Holiday", "Ghana national public holiday honoring farmers and fishers. No academic work.", "General Public", "Public Holiday"));
                eventRepository.save(new CalendarEvent(null, "cal-014", "holiday", "Christmas Day", LocalDate.parse("2026-12-25"), "All Day", "National Statutory Holiday", "Christmas Day celebrations.", "General Public", "Public Holiday"));
                eventRepository.save(new CalendarEvent(null, "cal-015", "deadline", "Term 1 Course & Club Registration Deadline", LocalDate.parse("2026-09-18"), "17:00 GMT", "Academic Affairs Office", "Final cutoff to register or change elective subjects and school club memberships.", "All Students", "Registration Due"));
                eventRepository.save(new CalendarEvent(null, "cal-016", "deadline", "Tuition Fees 2nd Installment Cutoff", LocalDate.parse("2026-10-14"), "17:00 GMT", "Accounts & Finance Portal", "Due date for 50% tuition installment to avoid clearance hold during exams.", "Guardians & Accounts", "Payment Due"));
                eventRepository.save(new CalendarEvent(null, "cal-017", "deadline", "Form 3 Project & SBA Portfolio Submission", LocalDate.parse("2026-11-20"), "16:00 GMT", "Departmental Heads", "Submission of continuous assessment project work and practical art portfolios.", "Form 3 Candidates", "Project Due"));
                eventRepository.save(new CalendarEvent(null, "cal-018", "deadline", "Continuous Assessment (SBA) Score Entry Cutoff", LocalDate.parse("2026-11-25"), "23:59 GMT", "Teacher Portal", "Final deadline for subject teachers to enter class scores into EduManage.", "Teachers & Staff", "Grades Due"));
            }

            System.out.println("✅ DataInitializer: Successfully populated initial student, teacher, subject, class, calendar, and score records.");
        };
    }
}
