package com.miessan.schoolmanagement.controller;

import com.miessan.schoolmanagement.dto.ScoreEntryDto;
import com.miessan.schoolmanagement.dto.StudentReportDto;
import com.miessan.schoolmanagement.model.Enrollment;
import com.miessan.schoolmanagement.service.PdfReportCardService;
import com.miessan.schoolmanagement.service.ResultService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResultController.class)
class ResultControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ResultService resultService;

    @MockitoBean
    private PdfReportCardService pdfReportCardService;

    @Test
    void saveScore_ReturnsUpdatedReport() throws Exception {
        String json = "{\"studentId\": 1, \"subjectName\": \"Mathematics\", \"caScore\": 25.0, \"examScore\": 65.0}";

        StudentReportDto report = new StudentReportDto();
        report.setStudentId(1L);
        report.setStudentName("Ama Mensah");
        report.setTotalMarks(90.0);
        report.setAverageScore(90.0);
        report.getSubjectScores().add(new StudentReportDto.SubjectScoreItem("Mathematics", 25.0, 65.0, 90.0, "Excellent"));

        when(resultService.saveScore(any(ScoreEntryDto.class))).thenReturn(new Enrollment());
        when(resultService.getStudentReport(1L)).thenReturn(Optional.of(report));

        mockMvc.perform(post("/api/results")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentName").value("Ama Mensah"))
                .andExpect(jsonPath("$.averageScore").value(90.0))
                .andExpect(jsonPath("$.subjectScores[0].subjectName").value("Mathematics"))
                .andExpect(jsonPath("$.subjectScores[0].totalScore").value(90.0));
    }

    @Test
    void getStudentReport_ReturnsReportCard() throws Exception {
        StudentReportDto report = new StudentReportDto();
        report.setStudentId(1L);
        report.setStudentName("Ama Mensah");
        report.setStudentClass("Form 1A");
        report.setAverageScore(84.0);

        when(resultService.getStudentReport(1L)).thenReturn(Optional.of(report));

        mockMvc.perform(get("/api/results/student/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentName").value("Ama Mensah"))
                .andExpect(jsonPath("$.studentClass").value("Form 1A"))
                .andExpect(jsonPath("$.averageScore").value(84.0));
    }

    @Test
    void downloadReportPdf_ReturnsPdfBytes() throws Exception {
        StudentReportDto report = new StudentReportDto();
        report.setStudentId(1L);
        report.setStudentName("Ama Mensah");

        byte[] fakePdfBytes = "%PDF-1.4 test".getBytes();

        when(resultService.getStudentReport(1L)).thenReturn(Optional.of(report));
        when(pdfReportCardService.generateStudentReportPdf(any(StudentReportDto.class))).thenReturn(fakePdfBytes);

        mockMvc.perform(get("/api/results/student/1/pdf"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"report-card-Ama_Mensah.pdf\""))
                .andExpect(content().bytes(fakePdfBytes));
    }
}
