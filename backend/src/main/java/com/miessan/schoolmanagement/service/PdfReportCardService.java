package com.miessan.schoolmanagement.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.miessan.schoolmanagement.dto.StudentReportDto;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class PdfReportCardService {

    // Theme Colors - Matching App Green Palette
    private static final Color PRIMARY_BRAND = new Color(22, 101, 52);    // #166534 (Brand Dark Green / Primary 700)
    private static final Color SECONDARY_BRAND = new Color(21, 128, 61);  // #15803D (Brand Green / Primary 600)
    private static final Color TEXT_DARK = new Color(15, 23, 42);         // #0F172A
    private static final Color TEXT_MUTED = new Color(100, 116, 139);     // #64748B
    private static final Color BG_LIGHT = new Color(240, 253, 244);       // #F0FDF4 (Primary 50)
    private static final Color BG_ALT_ROW = new Color(248, 250, 252);     // #F8FAFC
    private static final Color BORDER_COLOR = new Color(220, 252, 231);   // #DCFCE7 (Primary 100)
    private static final Color ACCENT_GREEN = new Color(22, 101, 52);     // #166534

    public byte[] generateStudentReportPdf(StudentReportDto report) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // 1. School Header Banner
            addSchoolHeader(document);

            // 2. Report Card Title Ribbon
            addTitleRibbon(document);

            // 3. Student Information Card
            addStudentInfoCard(document, report);

            // Spacing
            document.add(new Paragraph(" "));

            // 4. Academic Performance Table
            addScoresTable(document, report);

            // 5. Summary / Performance Box
            addSummaryBox(document, report);

            // Spacing
            document.add(new Paragraph(" "));

            // 6. Teacher & Headteacher Endorsements
            addEndorsementSection(document, report);

            // 7. Footer Note
            addFooter(document);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report card: " + e.getMessage(), e);
        }
    }

    private void addSchoolHeader(Document doc) throws DocumentException {
        PdfPTable headerTable = new PdfPTable(1);
        headerTable.setWidthPercentage(100);

        Font schoolNameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, PRIMARY_BRAND);
        Font mottoFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, SECONDARY_BRAND);
        Font contactFont = FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_MUTED);

        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph name = new Paragraph("SPRINGFIELD INTERNATIONAL ACADEMY", schoolNameFont);
        name.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(name);

        Paragraph motto = new Paragraph("“Excellence, Integrity & Leadership”", mottoFont);
        motto.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(motto);

        Paragraph contact = new Paragraph("P.O. Box 1024, Academic Avenue, Accra, Ghana | Tel: +233 (0) 24 555 0192 | info@springfield.edu.gh", contactFont);
        contact.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(contact);

        headerTable.addCell(cell);
        doc.add(headerTable);

        // Divider
        LineSeparator separator = new LineSeparator(1.5f, 100, PRIMARY_BRAND, Element.ALIGN_CENTER, -2);
        doc.add(new Chunk(separator));
    }

    private void addTitleRibbon(Document doc) throws DocumentException {
        PdfPTable ribbonTable = new PdfPTable(1);
        ribbonTable.setWidthPercentage(100);
        ribbonTable.setSpacingBefore(8f);
        ribbonTable.setSpacingAfter(8f);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(BG_LIGHT);
        cell.setBorderColor(BORDER_COLOR);
        cell.setPadding(6f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PRIMARY_BRAND);
        Paragraph title = new Paragraph("OFFICIAL STUDENT ACADEMIC PERFORMANCE REPORT", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(title);

        ribbonTable.addCell(cell);
        doc.add(ribbonTable);
    }

    private void addStudentInfoCard(Document doc, StudentReportDto report) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{20f, 30f, 20f, 30f});

        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, TEXT_MUTED);
        Font valFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, TEXT_DARK);

        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
        String studentIdStr = report.getStudentId() != null ? "STD-" + (1000 + report.getStudentId()) : "N/A";
        String studentClass = report.getStudentClass() != null ? report.getStudentClass() : "Form 1A";
        String academicYear = report.getAcademicYear() != null ? report.getAcademicYear() : "2026/2027";
        String term = report.getTerm() != null ? report.getTerm() : "Term 1";

        addInfoCell(table, "Student Name:", labelFont, report.getStudentName(), valFont);
        addInfoCell(table, "Student ID:", labelFont, studentIdStr, valFont);
        addInfoCell(table, "Class / Form:", labelFont, studentClass, valFont);
        addInfoCell(table, "Academic Term:", labelFont, term + " (" + academicYear + ")", valFont);
        addInfoCell(table, "Issue Date:", labelFont, dateStr, valFont);
        addInfoCell(table, "Academic Status:", labelFont, "Enrolled / Good Standing", valFont);

        doc.add(table);
    }

    private void addInfoCell(PdfPTable table, String label, Font labelFont, String val, Font valFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(BG_LIGHT);
        cell.setBorderColor(BORDER_COLOR);
        cell.setPadding(5f);

        Paragraph p = new Paragraph();
        p.add(new Chunk(label + " ", labelFont));
        p.add(new Chunk(val != null ? val : "N/A", valFont));
        cell.addElement(p);
        table.addCell(cell);
    }

    private void addScoresTable(Document doc, StudentReportDto report) throws DocumentException {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{32f, 17f, 17f, 17f, 17f});

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
        String[] headers = {"Subject Name", "CA (30%)", "Exam (70%)", "Total (100%)", "Remark"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(PRIMARY_BRAND);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(6f);
            cell.setBorderColor(PRIMARY_BRAND);
            table.addCell(cell);
        }

        Font rowFont = FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_DARK);
        Font boldRowFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, PRIMARY_BRAND);
        Font remarkFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, ACCENT_GREEN);

        if (report.getSubjectScores() == null || report.getSubjectScores().isEmpty()) {
            PdfPCell emptyCell = new PdfPCell(new Phrase("No subjects or scores recorded for this student.", rowFont));
            emptyCell.setColspan(5);
            emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            emptyCell.setPadding(10f);
            table.addCell(emptyCell);
        } else {
            boolean alt = false;
            for (StudentReportDto.SubjectScoreItem item : report.getSubjectScores()) {
                Color rowBg = alt ? BG_ALT_ROW : Color.WHITE;
                alt = !alt;

                // Subject Name
                PdfPCell nameCell = new PdfPCell(new Phrase(item.getSubjectName(), rowFont));
                nameCell.setBackgroundColor(rowBg);
                nameCell.setBorderColor(BORDER_COLOR);
                nameCell.setPadding(5f);
                table.addCell(nameCell);

                // CA Score
                String caStr = item.getCaScore() != null ? String.format("%.1f", item.getCaScore()) : "--";
                PdfPCell caCell = new PdfPCell(new Phrase(caStr, rowFont));
                caCell.setBackgroundColor(rowBg);
                caCell.setBorderColor(BORDER_COLOR);
                caCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                caCell.setPadding(5f);
                table.addCell(caCell);

                // Exam Score
                String examStr = item.getExamScore() != null ? String.format("%.1f", item.getExamScore()) : "--";
                PdfPCell examCell = new PdfPCell(new Phrase(examStr, rowFont));
                examCell.setBackgroundColor(rowBg);
                examCell.setBorderColor(BORDER_COLOR);
                examCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                examCell.setPadding(5f);
                table.addCell(examCell);

                // Total Score
                String totalStr = item.getTotalScore() != null ? String.format("%.1f", item.getTotalScore()) : "Pending";
                PdfPCell totalCell = new PdfPCell(new Phrase(totalStr, boldRowFont));
                totalCell.setBackgroundColor(rowBg);
                totalCell.setBorderColor(BORDER_COLOR);
                totalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                totalCell.setPadding(5f);
                table.addCell(totalCell);

                // Remark
                String remarkStr = item.getRemark() != null ? item.getRemark() : getScoreRemark(item.getTotalScore());
                PdfPCell remarkCell = new PdfPCell(new Phrase(remarkStr, remarkFont));
                remarkCell.setBackgroundColor(rowBg);
                remarkCell.setBorderColor(BORDER_COLOR);
                remarkCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                remarkCell.setPadding(5f);
                table.addCell(remarkCell);
            }
        }

        doc.add(table);
    }

    private void addSummaryBox(Document doc, StudentReportDto report) throws DocumentException {
        PdfPTable summaryTable = new PdfPTable(3);
        summaryTable.setWidthPercentage(100);
        summaryTable.setSpacingBefore(6f);
        summaryTable.setWidths(new float[]{35f, 35f, 30f});

        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, TEXT_MUTED);
        Font valFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PRIMARY_BRAND);

        String totalMarksStr = report.getTotalMarks() != null ? String.format("%.1f", report.getTotalMarks()) : "--";
        String avgStr = report.getAverageScore() != null ? String.format("%.1f%%", report.getAverageScore()) : "N/A";
        String evalCountStr = report.getEvaluatedSubjectsCount() + " of " + report.getTotalSubjectsCount() + " Subjects";

        addSummaryCell(summaryTable, "Total Marks Obtained", totalMarksStr, labelFont, valFont);
        addSummaryCell(summaryTable, "Overall Average Score", avgStr, labelFont, valFont);
        addSummaryCell(summaryTable, "Subjects Evaluated", evalCountStr, labelFont, valFont);

        doc.add(summaryTable);
    }

    private void addSummaryCell(PdfPTable table, String label, String value, Font labelFont, Font valFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(BG_LIGHT);
        cell.setBorderColor(PRIMARY_BRAND);
        cell.setPadding(7f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph pLabel = new Paragraph(label, labelFont);
        pLabel.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pLabel);

        Paragraph pVal = new Paragraph(value, valFont);
        pVal.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pVal);

        table.addCell(cell);
    }

    private void addEndorsementSection(Document doc, StudentReportDto report) throws DocumentException {
        PdfPTable endorseTable = new PdfPTable(2);
        endorseTable.setWidthPercentage(100);
        endorseTable.setWidths(new float[]{50f, 50f});
        endorseTable.setSpacingBefore(10f);

        Font sectionHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, PRIMARY_BRAND);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_DARK);
        Font lineFont = FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_MUTED);

        // Class Teacher Column
        PdfPCell teacherCell = new PdfPCell();
        teacherCell.setBorderColor(BORDER_COLOR);
        teacherCell.setPadding(8f);
        teacherCell.addElement(new Paragraph("CLASS TEACHER'S REMARKS", sectionHeaderFont));
        String tRemark = report.getTeacherRemark() != null ? report.getTeacherRemark() : getTeacherDefaultRemark(report.getAverageScore());
        teacherCell.addElement(new Paragraph("“" + tRemark + "”", bodyFont));
        teacherCell.addElement(new Paragraph("\nSignature: __________________________   Date: ____________", lineFont));
        endorseTable.addCell(teacherCell);

        // Headteacher Column
        PdfPCell headCell = new PdfPCell();
        headCell.setBorderColor(BORDER_COLOR);
        headCell.setPadding(8f);
        headCell.addElement(new Paragraph("HEADTEACHER'S ENDORSEMENT", sectionHeaderFont));
        String hRemark = report.getHeadteacherRemark() != null ? report.getHeadteacherRemark() : "A commendable academic term. Keep up the high standard of discipline.";
        headCell.addElement(new Paragraph("“" + hRemark + "”", bodyFont));
        headCell.addElement(new Paragraph("\nSignature & Stamp: __________________   Date: ____________", lineFont));
        endorseTable.addCell(headCell);

        doc.add(endorseTable);
    }

    private void addFooter(Document doc) throws DocumentException {
        Paragraph footer = new Paragraph(
                "\nNext Term Begins: January 12, 2027  •  Official Electronic Academic Record  •  Springfield Management System",
                FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, TEXT_MUTED)
        );
        footer.setAlignment(Element.ALIGN_CENTER);
        doc.add(footer);
    }

    private String getScoreRemark(Double totalScore) {
        if (totalScore == null) return "Pending";
        if (totalScore >= 80) return "Excellent";
        if (totalScore >= 70) return "Very Good";
        if (totalScore >= 60) return "Good";
        if (totalScore >= 50) return "Pass";
        return "Needs Support";
    }

    private String getTeacherDefaultRemark(Double avg) {
        if (avg == null) return "Assessments in progress.";
        if (avg >= 80) return "Outstanding performance. Exhibits exceptional diligence and insight.";
        if (avg >= 70) return "Very good result. Demonstrates strong potential and consistent effort.";
        if (avg >= 60) return "Good work this term. Encouraged to aim higher in core areas.";
        if (avg >= 50) return "Fair progress. Needs more focused preparation for exams.";
        return "Needs intensive revision and dedicated academic support.";
    }
}
