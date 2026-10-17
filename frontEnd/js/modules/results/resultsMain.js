// resultsMain.js - Core UI module for Score Entry, Terminal Reports & PDF Generation
import { saveScoreToDb, fetchStudentReportFromDb, downloadReportPdfFromDb, fetchAllReportsFromDb } from '../../api/resultApi.js';
import { fetchStudentsFromDb } from '../../api/studentApi.js';
import { fetchSubjectsFromDb } from '../../api/subjectApi.js';
import { students as localStudents } from '../../data/studentsData.js';

let cachedStudents = [];
let cachedSubjects = [];
let currentReportStudentId = null;

export async function initResultsModule() {
  const resultStudentSelect = document.getElementById('resultStudentSelect');
  const resultSubjectSelect = document.getElementById('resultSubjectSelect');
  const resultCaScore = document.getElementById('resultCaScore');
  const resultExamScore = document.getElementById('resultExamScore');
  const liveTotalBadge = document.getElementById('liveTotalBadge');
  const scoreEntryForm = document.getElementById('scoreEntryForm');
  const reportStudentSelect = document.getElementById('reportStudentSelect');
  const downloadReportPdfBtn = document.getElementById('downloadReportPdfBtn');

  // Live Total Calculation
  function updateLiveTotal() {
    const caVal = parseFloat(resultCaScore?.value);
    const examVal = parseFloat(resultExamScore?.value);
    const hasCa = !isNaN(caVal);
    const hasExam = !isNaN(examVal);

    if (hasCa || hasExam) {
      const ca = hasCa ? caVal : 0;
      const exam = hasExam ? examVal : 0;
      const total = (ca + exam).toFixed(1);
      if (liveTotalBadge) {
        liveTotalBadge.textContent = `Total: ${total} / 100`;
        liveTotalBadge.className = 'live-total-badge badge-active';
      }
    } else {
      if (liveTotalBadge) {
        liveTotalBadge.textContent = 'Total: -- / 100';
        liveTotalBadge.className = 'live-total-badge';
      }
    }
  }

  ['input', 'change', 'keyup'].forEach(evt => {
    resultCaScore?.addEventListener(evt, updateLiveTotal);
    resultExamScore?.addEventListener(evt, updateLiveTotal);
  });

  // Load students and subjects
  await loadDropdownData();

  // When score student select changes, update subject options if student has specific enrolled subjects
  resultStudentSelect?.addEventListener('change', (e) => {
    const studentId = e.target.value;
    updateSubjectSelectForStudent(studentId);
  });

  // When report student select changes, render that student's report card
  reportStudentSelect?.addEventListener('change', async (e) => {
    const studentId = e.target.value;
    if (studentId) {
      await loadAndDisplayReport(studentId);
    }
  });

  // Score Entry Form Submit
  scoreEntryForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = document.getElementById('scoreFormFeedback');
    const studentId = resultStudentSelect?.value;
    const subjectName = resultSubjectSelect?.value;
    const caScore = resultCaScore?.value ? parseFloat(resultCaScore.value) : null;
    const examScore = resultExamScore?.value ? parseFloat(resultExamScore.value) : null;

    if (!studentId) {
      if (feedback) feedback.innerHTML = '<span class="error-msg">⚠️ Please select a student.</span>';
      return;
    }
    if (!subjectName) {
      if (feedback) feedback.innerHTML = '<span class="error-msg">⚠️ Please select a subject.</span>';
      return;
    }

    if (feedback) feedback.innerHTML = '<span class="loading-msg">⏳ Saving score to database...</span>';

    try {
      const updatedReport = await saveScoreToDb({
        studentId: Number(studentId),
        subjectName,
        caScore,
        examScore,
      });

      if (feedback) {
        feedback.replaceChildren();
        const span = document.createElement('span');
        span.className = 'success-msg';
        span.textContent = `✅ Score saved successfully for ${subjectName}!`;
        feedback.appendChild(span);
        setTimeout(() => { feedback.replaceChildren(); }, 4000);
      }

      // Reset score inputs
      if (resultCaScore) resultCaScore.value = '';
      if (resultExamScore) resultExamScore.value = '';
      updateLiveTotal();

      // Refresh displayed report
      if (reportStudentSelect) {
        reportStudentSelect.value = studentId;
      }
      renderReportCard(updatedReport);
    } catch (err) {
      if (feedback) {
        feedback.replaceChildren();
        const span = document.createElement('span');
        span.className = 'error-msg';
        span.textContent = `❌ Error saving score: ${err.message}`;
        feedback.appendChild(span);
      }
    }
  });

  // Download PDF Button Click
  downloadReportPdfBtn?.addEventListener('click', async () => {
    if (!currentReportStudentId) {
      alert('Please select a student first to generate their PDF report card.');
      return;
    }
    const student = cachedStudents.find(s => String(s.id) === String(currentReportStudentId));
    const studentName = student ? student.name : 'Student';
    downloadReportPdfBtn.disabled = true;
    downloadReportPdfBtn.textContent = '⏳ Generating PDF...';
    try {
      await downloadReportPdfFromDb(currentReportStudentId, studentName);
    } finally {
      downloadReportPdfBtn.disabled = false;
      downloadReportPdfBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="svg-icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download Official PDF`;
    }
  });

  // Automatically load report for first student if available
  if (cachedStudents.length > 0) {
    const firstStudentId = cachedStudents[0].id;
    if (resultStudentSelect) resultStudentSelect.value = firstStudentId;
    if (reportStudentSelect) reportStudentSelect.value = firstStudentId;
    updateSubjectSelectForStudent(firstStudentId);
    await loadAndDisplayReport(firstStudentId);
  }
}

async function loadDropdownData() {
  const dbStudents = await fetchStudentsFromDb();
  cachedStudents = (dbStudents && dbStudents.length > 0) ? dbStudents : localStudents;

  const dbSubjects = await fetchSubjectsFromDb();
  cachedSubjects = dbSubjects || [];

  populateStudentDropdowns();
  populateSubjectDropdown(cachedSubjects);
}

function populateStudentDropdowns() {
  const resultStudentSelect = document.getElementById('resultStudentSelect');
  const reportStudentSelect = document.getElementById('reportStudentSelect');

  if (resultStudentSelect) {
    resultStudentSelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Student --';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    resultStudentSelect.appendChild(defaultOption);

    cachedStudents.forEach(s => {
      const cls = s.studentClass || s.class || 'Form 1A';
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = `${s.name} (${cls})`;
      resultStudentSelect.appendChild(option);
    });
  }

  if (reportStudentSelect) {
    reportStudentSelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Student to View Report --';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    reportStudentSelect.appendChild(defaultOption);

    cachedStudents.forEach(s => {
      const cls = s.studentClass || s.class || 'Form 1A';
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = `${s.name} (${cls})`;
      reportStudentSelect.appendChild(option);
    });
  }
}

function updateSubjectSelectForStudent(studentId) {
  const resultSubjectSelect = document.getElementById('resultSubjectSelect');
  if (!resultSubjectSelect) return;

  const student = cachedStudents.find(s => String(s.id) === String(studentId));
  let subjectList = [];

  if (student && student.subjects && student.subjects.length > 0) {
    // If student has subjects array of strings
    subjectList = student.subjects.map(sub => typeof sub === 'string' ? sub : (sub.name || sub.subjectName));
  } else if (student && student.enrollments && student.enrollments.length > 0) {
    subjectList = student.enrollments.map(e => e.subject ? e.subject.name : (e.subjectName || ''));
  }

  // Fallback to all cached subjects if student has no listed subjects
  if (subjectList.length === 0 && cachedSubjects.length > 0) {
    subjectList = cachedSubjects.map(s => s.name);
  }

  if (subjectList.length === 0) {
    subjectList = ['Mathematics', 'English', 'Integrated Science', 'ICT', 'Physics', 'Chemistry', 'Biology', 'Economics'];
  }

  // Remove duplicates and blanks
  subjectList = [...new Set(subjectList.filter(Boolean))];

  resultSubjectSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select Subject --';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  resultSubjectSelect.appendChild(defaultOption);

  subjectList.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    resultSubjectSelect.appendChild(option);
  });
}

function populateSubjectDropdown(subjects) {
  const resultSubjectSelect = document.getElementById('resultSubjectSelect');
  if (!resultSubjectSelect) return;
  const list = (subjects && subjects.length > 0)
    ? subjects.map(s => s.name)
    : ['Mathematics', 'English', 'Integrated Science', 'ICT', 'Physics', 'Chemistry', 'Biology', 'Economics'];

  resultSubjectSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select Subject --';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  resultSubjectSelect.appendChild(defaultOption);

  list.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    resultSubjectSelect.appendChild(option);
  });
}

export async function loadAndDisplayReport(studentId) {
  currentReportStudentId = studentId;
  const container = document.getElementById('studentReportCardContainer');
  if (container) {
    container.innerHTML = '<div class="report-card-loading"><div class="spinner"></div><p>Loading academic report card...</p></div>';
  }

  const report = await fetchStudentReportFromDb(studentId);
  if (report) {
    renderReportCard(report);
  } else {
    // Fallback if backend offline
    const local = cachedStudents.find(s => String(s.id) === String(studentId));
    if (local) {
      renderFallbackReport(local);
    } else if (container) {
      container.innerHTML = '<p class="empty-state">No report card data found for this student.</p>';
    }
  }
}

export function renderReportCard(report) {
  const container = document.getElementById('studentReportCardContainer');
  if (!container) return;

  currentReportStudentId = report.studentId;

  const avgDisplay = report.averageScore !== null && report.averageScore !== undefined
    ? `${report.averageScore.toFixed(1)}%`
    : 'N/A';

  const totalMarksDisplay = report.totalMarks !== null && report.totalMarks !== undefined
    ? `${report.totalMarks.toFixed(1)}`
    : '--';

  const evalCount = report.evaluatedSubjectsCount !== undefined ? report.evaluatedSubjectsCount : 0;
  const totalCount = report.totalSubjectsCount !== undefined ? report.totalSubjectsCount : (report.subjectScores?.length || 0);

  const scoresRows = (report.subjectScores && report.subjectScores.length > 0)
    ? report.subjectScores.map((item, idx) => {
        const ca = item.caScore !== null && item.caScore !== undefined ? item.caScore.toFixed(1) : '--';
        const exam = item.examScore !== null && item.examScore !== undefined ? item.examScore.toFixed(1) : '--';
        const total = item.totalScore !== null && item.totalScore !== undefined
          ? `<strong class="score-total-pill">${item.totalScore.toFixed(1)}</strong>`
          : '<span class="score-pending">Pending</span>';
        const remark = item.remark || (item.totalScore ? (item.totalScore >= 80 ? 'Excellent' : item.totalScore >= 70 ? 'Very Good' : item.totalScore >= 60 ? 'Good' : 'Pass') : 'Pending');

        return `
          <tr>
            <td class="col-index">${idx + 1}</td>
            <td class="col-subject"><strong>${item.subjectName}</strong></td>
            <td class="col-score">${ca}</td>
            <td class="col-score">${exam}</td>
            <td class="col-score">${total}</td>
            <td class="col-remark"><span class="remark-badge">${remark}</span></td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="6" class="text-center">No subjects recorded for this student.</td></tr>`;

  container.innerHTML = `
    <div class="official-report-card">
      <!-- Report Header -->
      <div class="report-school-header">
        <div class="school-seal-mark">🎓</div>
        <div class="school-details">
          <h3>SPRINGFIELD INTERNATIONAL ACADEMY</h3>
          <p class="school-motto">“Excellence, Integrity &amp; Leadership”</p>
          <p class="school-contact">P.O. Box 1024, Academic Avenue, Accra • Tel: +233 (0) 24 555 0192</p>
        </div>
      </div>

      <div class="report-title-ribbon">
        <h4>OFFICIAL STUDENT ACADEMIC PERFORMANCE REPORT</h4>
      </div>

      <!-- Student Bio Grid -->
      <div class="report-bio-grid">
        <div class="bio-item">
          <span class="bio-label">Student Name:</span>
          <span class="bio-value"><strong>${report.studentName}</strong></span>
        </div>
        <div class="bio-item">
          <span class="bio-label">Student ID:</span>
          <span class="bio-value">STD-${1000 + (Number(report.studentId) || 1)}</span>
        </div>
        <div class="bio-item">
          <span class="bio-label">Class / Form:</span>
          <span class="bio-value">${report.studentClass || 'Form 1A'}</span>
        </div>
        <div class="bio-item">
          <span class="bio-label">Academic Term:</span>
          <span class="bio-value">${report.term || 'Term 1'} (${report.academicYear || '2026/2027'})</span>
        </div>
      </div>

      <!-- Subject Scores Table -->
      <div class="report-table-wrapper">
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject Name</th>
              <th>CA (30%)</th>
              <th>Exam (70%)</th>
              <th>Total (100%)</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            ${scoresRows}
          </tbody>
        </table>
      </div>

      <!-- Performance Summary Box -->
      <div class="report-summary-cards">
        <div class="summary-card">
          <span class="card-label">Total Marks Obtained</span>
          <span class="card-val">${totalMarksDisplay}</span>
        </div>
        <div class="summary-card highlight">
          <span class="card-label">Terminal Average Score</span>
          <span class="card-val">${avgDisplay}</span>
        </div>
        <div class="summary-card">
          <span class="card-label">Subjects Evaluated</span>
          <span class="card-val">${evalCount} of ${totalCount}</span>
        </div>
      </div>

      <!-- Endorsements Footer -->
      <div class="report-endorsements">
        <div class="endorsement-box">
          <h5>Class Teacher's Remarks</h5>
          <p class="remark-text">“${report.teacherRemark || 'Demonstrates strong commitment and diligence across core academic areas.'}”</p>
          <div class="signature-line">Signature: ______________________</div>
        </div>
        <div class="endorsement-box">
          <h5>Headteacher's Endorsement</h5>
          <p class="remark-text">“${report.headteacherRemark || 'A commendable academic term. Keep up the high standard of discipline.'}”</p>
          <div class="signature-line">Signature &amp; Stamp: ______________</div>
        </div>
      </div>
    </div>
  `;
}

function renderFallbackReport(student) {
  const defaultScores = [
    { subjectName: 'Mathematics', caScore: 25.0, examScore: 65.0, totalScore: 90.0, remark: 'Excellent' },
    { subjectName: 'English', caScore: 22.0, examScore: 60.0, totalScore: 82.0, remark: 'Excellent' },
    { subjectName: 'Integrated Science', caScore: 20.0, examScore: 56.0, totalScore: 76.0, remark: 'Very Good' },
    { subjectName: 'ICT', caScore: 28.0, examScore: 60.0, totalScore: 88.0, remark: 'Excellent' },
    { subjectName: 'Physics', caScore: null, examScore: null, totalScore: null, remark: 'Pending' }
  ];
  const evaluated = defaultScores.filter(s => s.totalScore !== null && s.totalScore !== undefined);
  const total = evaluated.reduce((sum, s) => sum + s.totalScore, 0);
  const avg = evaluated.length > 0 ? (total / evaluated.length) : null;

  renderReportCard({
    studentId: student.id,
    studentName: student.name,
    studentClass: student.studentClass || student.class || 'Form 3',
    academicYear: '2026/2027',
    term: 'Term 1',
    averageScore: avg !== null ? avg : 84.0,
    totalMarks: total,
    evaluatedSubjectsCount: evaluated.length,
    totalSubjectsCount: defaultScores.length,
    subjectScores: defaultScores
  });
}
