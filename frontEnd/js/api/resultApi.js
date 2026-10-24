import { validateStudentReport, validateStudentReportList } from '../utils/apiValidator.js';

// resultApi.js - REST API Client connecting Frontend to Spring Boot Results & PDF generation
const API_BASE_URL = 'http://localhost:8080/api/results';

/**
 * Save or update a score for a student & subject.
 * Validates the updated student report card before returning.
 * @param {Object} scoreEntryDto - { studentId, subjectName, caScore, examScore }
 * @returns {Promise<Object>} Validated updated student report card
 */
export async function saveScoreToDb(scoreEntryDto) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(scoreEntryDto),
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetails = errorJson.message || JSON.stringify(errorJson);
    } catch {
      const text = await response.text();
      if (text) errorDetails = text;
    }
    throw new Error(errorDetails);
  }

  const rawReport = await response.json();
  const updatedReport = validateStudentReport(rawReport, 'POST /api/results');
  console.log('✅ Successfully saved score and validated report:', updatedReport);
  return updatedReport;
}

/**
 * Fetch a student's terminal report card with calculated average.
 * Validates the report structure before returning.
 * @param {number|string} studentId
 * @returns {Promise<Object|null>}
 */
export async function fetchStudentReportFromDb(studentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const rawReport = await response.json();
    return validateStudentReport(rawReport, `GET /api/results/student/${studentId}`);
  } catch (error) {
    console.warn(`⚠️ Could not fetch or validate report for student #${studentId}:`, error);
    return null;
  }
}

/**
 * Fetch all student academic reports.
 * Validates array of reports against StudentReportDto contract.
 * @returns {Promise<Array>}
 */
export async function fetchAllReportsFromDb() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const rawReports = await response.json();
    return validateStudentReportList(rawReports, 'GET /api/results');
  } catch (error) {
    console.warn('⚠️ Could not fetch or validate reports list:', error);
    return [];
  }
}

/**
 * Download the official printable A4 PDF report card from backend byte stream.
 * @param {number|string} studentId
 * @param {string} studentName
 */
export async function downloadReportPdfFromDb(studentId, studentName = 'student') {
  try {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}/pdf`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`PDF generation failed with HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    const cleanName = (studentName || 'student').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.setAttribute('download', `report-card-${cleanName}.pdf`);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 1500);
    console.log(`📄 Downloaded official PDF report card for ${cleanName}.`);
  } catch (error) {
    console.error('❌ Failed to download PDF report card:', error);
    alert('Failed to generate PDF report card. Please ensure the backend is running.');
  }
}
