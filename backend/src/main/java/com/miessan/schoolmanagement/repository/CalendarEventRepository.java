package com.miessan.schoolmanagement.repository;

import com.miessan.schoolmanagement.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    Optional<CalendarEvent> findByEventCode(String eventCode);

    List<CalendarEvent> findByCategoryIgnoreCase(String category);

    List<CalendarEvent> findByDateBetweenOrderByDateAsc(LocalDate startDate, LocalDate endDate);

    List<CalendarEvent> findAllByOrderByDateAsc();
}
