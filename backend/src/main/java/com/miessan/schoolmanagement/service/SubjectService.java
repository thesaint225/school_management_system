package com.miessan.schoolmanagement.service;

import com.miessan.schoolmanagement.dto.SubjectRequestDto;
import com.miessan.schoolmanagement.model.Subject;
import com.miessan.schoolmanagement.repository.EnrollmentRepository;
import com.miessan.schoolmanagement.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;

    public SubjectService(SubjectRepository subjectRepository, EnrollmentRepository enrollmentRepository) {
        this.subjectRepository = subjectRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }

    public List<Subject> findActive() {
        return subjectRepository.findByActiveTrue();
    }

    public Optional<Subject> findById(Long id) {
        return subjectRepository.findById(id);
    }

    public Optional<Subject> findByName(String name) {
        return subjectRepository.findByNameIgnoreCase(name);
    }

    public Subject createSubject(SubjectRequestDto dto) {
        // If subject name already exists, throw or return existing
        Optional<Subject> existing = subjectRepository.findByNameIgnoreCase(dto.getName());
        if (existing.isPresent()) {
            Subject subj = existing.get();
            subj.setCode(dto.getCode());
            subj.setDepartment(dto.getDepartment());
            subj.setDescription(dto.getDescription());
            subj.setActive(dto.getActive() != null ? dto.getActive() : true);
            return subjectRepository.save(subj);
        }

        Subject subject = new Subject();
        subject.setName(dto.getName());
        subject.setCode(dto.getCode());
        subject.setDepartment(dto.getDepartment());
        subject.setDescription(dto.getDescription());
        subject.setActive(dto.getActive() != null ? dto.getActive() : true);
        return subjectRepository.save(subject);
    }

    public Optional<Subject> update(Long id, SubjectRequestDto dto) {
        return subjectRepository.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setCode(dto.getCode());
            existing.setDepartment(dto.getDepartment());
            existing.setDescription(dto.getDescription());
            if (dto.getActive() != null) {
                existing.setActive(dto.getActive());
            }
            return subjectRepository.save(existing);
        });
    }

    public Subject save(Subject subject) {
        return subjectRepository.save(subject);
    }

    /**
     * Safe deletion/deactivation:
     * If subject has active student enrollments, deactivate it (active = false) to preserve historical data.
     * If no enrollments reference this subject, permanently delete it.
     */
    public boolean deleteOrDeactivate(Long id) {
        Optional<Subject> optionalSubject = subjectRepository.findById(id);
        if (optionalSubject.isEmpty()) {
            return false;
        }

        long enrollmentCount = enrollmentRepository.countBySubjectId(id);
        if (enrollmentCount > 0) {
            Subject subject = optionalSubject.get();
            subject.setActive(false);
            subjectRepository.save(subject);
            return true;
        } else {
            subjectRepository.deleteById(id);
            return true;
        }
    }
}
