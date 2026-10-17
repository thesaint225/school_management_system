package com.miessan.schoolmanagement.controller;

import com.miessan.schoolmanagement.dto.ScoreEntryDto;
import com.miessan.schoolmanagement.dto.StudentReportDto;
import com.miessan.schoolmanagement.model.Enrollment;
import com.miessan.schoolmanagement.service.PdfReportCardService;
import com.miessan.schoolmanagement.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;
    private final PdfReportCardService pdfReportCardService;

    public ResultController(ResultService resultService, PdfReportCardService pdfReportCardService) {
        this.resultService = resultService;
        this.pdfReportCardService = pdfReportCardService;
    }

    @PostMapping
    public ResponseEntity<StudentReportDto> saveScore(@Valid @RequestBody ScoreEntryDto dto) {
        resultService.saveScore(dto);
        return resultService.getStudentReport(dto.getStudentId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentReportDto> getStudentReport(@PathVariable Long studentId) {
        return resultService.getStudentReport(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}/pdf")
    public ResponseEntity<byte[]> downloadReportPdf(@PathVariable Long studentId) {
        return resultService.getStudentReport(studentId)
                .map(report -> {
                    byte[] pdfBytes = pdfReportCardService.generateStudentReportPdf(report);
                    String sanitizedName = report.getStudentName() != null
                            ? report.getStudentName().replaceAll("[^a-zA-Z0-9.-]", "_")
                            : "student";
                    String filename = "report-card-" + sanitizedName + ".pdf";

                    return ResponseEntity.ok()
                            .contentType(MediaType.APPLICATION_PDF)
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                            .body(pdfBytes);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<StudentReportDto> getAllReports() {
        return resultService.getAllStudentReports();
    }
}
