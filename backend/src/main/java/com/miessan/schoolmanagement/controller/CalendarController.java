package com.miessan.schoolmanagement.controller;

import com.miessan.schoolmanagement.dto.AcademicTermDto;
import com.miessan.schoolmanagement.dto.CalendarEventDto;
import com.miessan.schoolmanagement.model.AcademicTerm;
import com.miessan.schoolmanagement.model.CalendarEvent;
import com.miessan.schoolmanagement.service.CalendarService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    // ==========================================
    // Academic Terms Endpoints
    // ==========================================

    @GetMapping("/terms")
    public List<AcademicTerm> getAllTerms() {
        return calendarService.findAllTerms();
    }

    @GetMapping("/terms/active")
    public ResponseEntity<AcademicTerm> getActiveTerm() {
        return calendarService.findActiveTerm()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/terms")
    public ResponseEntity<AcademicTerm> createOrUpdateTerm(@Valid @RequestBody AcademicTermDto dto) {
        AcademicTerm saved = calendarService.createOrUpdateTerm(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ==========================================
    // Calendar Events Endpoints
    // ==========================================

    @GetMapping("/events")
    public List<CalendarEvent> getEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
            return calendarService.findEventsByCategory(category);
        }
        if (start != null && end != null) {
            return calendarService.findEventsBetween(start, end);
        }
        return calendarService.findAllEvents();
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<CalendarEvent> getEventById(@PathVariable Long id) {
        return calendarService.findEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/events")
    public ResponseEntity<CalendarEvent> createEvent(@Valid @RequestBody CalendarEventDto dto) {
        CalendarEvent created = calendarService.createEvent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<CalendarEvent> updateEvent(@PathVariable Long id, @Valid @RequestBody CalendarEventDto dto) {
        return calendarService.updateEvent(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        boolean deleted = calendarService.deleteEvent(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
