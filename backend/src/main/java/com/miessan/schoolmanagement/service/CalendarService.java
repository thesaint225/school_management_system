package com.miessan.schoolmanagement.service;

import com.miessan.schoolmanagement.dto.AcademicTermDto;
import com.miessan.schoolmanagement.dto.CalendarEventDto;
import com.miessan.schoolmanagement.model.AcademicTerm;
import com.miessan.schoolmanagement.model.CalendarEvent;
import com.miessan.schoolmanagement.repository.AcademicTermRepository;
import com.miessan.schoolmanagement.repository.CalendarEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CalendarService {

    private final AcademicTermRepository termRepository;
    private final CalendarEventRepository eventRepository;

    public CalendarService(AcademicTermRepository termRepository, CalendarEventRepository eventRepository) {
        this.termRepository = termRepository;
        this.eventRepository = eventRepository;
    }

    // ==========================================
    // Academic Terms Management
    // ==========================================

    public List<AcademicTerm> findAllTerms() {
        return termRepository.findAll();
    }

    public Optional<AcademicTerm> findTermById(Long id) {
        return termRepository.findById(id);
    }

    public Optional<AcademicTerm> findActiveTerm() {
        return termRepository.findByStatusIgnoreCase("Active");
    }

    public AcademicTerm createOrUpdateTerm(AcademicTermDto dto) {
        AcademicTerm term = null;
        if (dto.getTermCode() != null && !dto.getTermCode().isBlank()) {
            term = termRepository.findByTermCode(dto.getTermCode()).orElse(null);
        }
        if (term == null) {
            term = new AcademicTerm();
        }
        term.setTermCode(dto.getTermCode());
        term.setName(dto.getName());
        term.setAcademicYear(dto.getAcademicYear());
        term.setStartDate(dto.getStartDate());
        term.setEndDate(dto.getEndDate());
        term.setStatus(dto.getStatus());
        term.setTotalWeeks(dto.getTotalWeeks());

        return termRepository.save(term);
    }

    // ==========================================
    // Calendar Events Management
    // ==========================================

    public List<CalendarEvent> findAllEvents() {
        return eventRepository.findAllByOrderByDateAsc();
    }

    public List<CalendarEvent> findEventsByCategory(String category) {
        return eventRepository.findByCategoryIgnoreCase(category);
    }

    public List<CalendarEvent> findEventsBetween(LocalDate start, LocalDate end) {
        return eventRepository.findByDateBetweenOrderByDateAsc(start, end);
    }

    public Optional<CalendarEvent> findEventById(Long id) {
        return eventRepository.findById(id);
    }

    public CalendarEvent createEvent(CalendarEventDto dto) {
        CalendarEvent event = new CalendarEvent();
        event.setEventCode(dto.getEventCode());
        event.setCategory(dto.getCategory());
        event.setTitle(dto.getTitle());
        event.setDate(dto.getDate());
        event.setTime(dto.getTime());
        event.setLocation(dto.getLocation());
        event.setDescription(dto.getDescription());
        event.setTargetAudience(dto.getTargetAudience());
        event.setBadge(dto.getBadge());

        return eventRepository.save(event);
    }

    public Optional<CalendarEvent> updateEvent(Long id, CalendarEventDto dto) {
        return eventRepository.findById(id).map(existing -> {
            if (dto.getEventCode() != null) existing.setEventCode(dto.getEventCode());
            existing.setCategory(dto.getCategory());
            existing.setTitle(dto.getTitle());
            existing.setDate(dto.getDate());
            existing.setTime(dto.getTime());
            existing.setLocation(dto.getLocation());
            existing.setDescription(dto.getDescription());
            existing.setTargetAudience(dto.getTargetAudience());
            existing.setBadge(dto.getBadge());
            return eventRepository.save(existing);
        });
    }

    public boolean deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            return false;
        }
        eventRepository.deleteById(id);
        return true;
    }
}
