package com.miessan.schoolmanagement.controller;

import com.miessan.schoolmanagement.model.AcademicTerm;
import com.miessan.schoolmanagement.model.CalendarEvent;
import com.miessan.schoolmanagement.service.CalendarService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CalendarController.class)
class CalendarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CalendarService calendarService;

    @Test
    void getAllTerms_ReturnsList() throws Exception {
        AcademicTerm term = new AcademicTerm(1L, "term-1-2026", "Term 1", "2026/2027",
                LocalDate.of(2026, 9, 1), LocalDate.of(2026, 12, 18), "Active", 15);

        when(calendarService.findAllTerms()).thenReturn(List.of(term));

        mockMvc.perform(get("/api/calendar/terms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].termCode").value("term-1-2026"))
                .andExpect(jsonPath("$[0].name").value("Term 1"))
                .andExpect(jsonPath("$[0].status").value("Active"));
    }

    @Test
    void getActiveTerm_ReturnsActiveTerm() throws Exception {
        AcademicTerm term = new AcademicTerm(1L, "term-1-2026", "Term 1", "2026/2027",
                LocalDate.of(2026, 9, 1), LocalDate.of(2026, 12, 18), "Active", 15);

        when(calendarService.findActiveTerm()).thenReturn(Optional.of(term));

        mockMvc.perform(get("/api/calendar/terms/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.termCode").value("term-1-2026"))
                .andExpect(jsonPath("$.status").value("Active"));
    }

    @Test
    void getEvents_ReturnsEventList() throws Exception {
        CalendarEvent event = new CalendarEvent(1L, "cal-001", "term", "Resumption Day",
                LocalDate.of(2026, 9, 1), "08:00 GMT", "Campus Wide", "First day", "All", "Milestone");

        when(calendarService.findAllEvents()).thenReturn(List.of(event));

        mockMvc.perform(get("/api/calendar/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventCode").value("cal-001"))
                .andExpect(jsonPath("$[0].title").value("Resumption Day"))
                .andExpect(jsonPath("$[0].category").value("term"));
    }
}
