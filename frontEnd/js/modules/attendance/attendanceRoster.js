// Attendance Roster & Interactive Roll Call Module
import { attendanceState } from './attendanceState.js';
import { calculateAttendanceRate } from './attendanceAnalytics.js';
import { getInitials } from '../students/studentModal.js';
import { ICONS } from '../../utils/icons.js';
import {
  getSchoolAttendanceTime,
  formatAttendanceOfficialDate,
} from '../../utils/dateUtils.js';

export function initAttendanceRoster(students, onOpenStudentModal) {
  // DOM Elements
  const statTodayAttendanceRate = document.querySelector(
    '#statTodayAttendanceRate',
  );
  const attendanceAccraTime = document.querySelector('#attendanceAccraTime');
  const attendanceDateFull = document.querySelector('#attendanceDateFull');
  const metricPresentCount = document.querySelector('#metricPresentCount');
  const metricPresentPct = document.querySelector('#metricPresentPct');
  const metricLateCount = document.querySelector('#metricLateCount');
  const metricLatePct = document.querySelector('#metricLatePct');
  const metricAbsentCount = document.querySelector('#metricAbsentCount');
  const metricAbsentPct = document.querySelector('#metricAbsentPct');
  const metricAttendanceRate = document.querySelector('#metricAttendanceRate');
  const metricStatusTag = document.querySelector('#metricStatusTag');
  const metricProgressFill = document.querySelector('#metricProgressFill');
  const rosterSearchInput = document.querySelector('#rosterSearchInput');
  const rosterClassFilter = document.querySelector('#rosterClassFilter');
  const rosterStatusFilter = document.querySelector('#rosterStatusFilter');
  const rosterGenderFilter = document.querySelector('#rosterGenderFilter');
  const markAllPresentBtn = document.querySelector('#markAllPresentBtn');
  const resetAttendanceBtn = document.querySelector('#resetAttendanceBtn');
  const rosterTableBody = document.querySelector('#rosterTableBody');
  const rosterPagination = document.querySelector('#rosterPagination');
  const prevPageBtn = document.querySelector('#prevPageBtn');
  const nextPageBtn = document.querySelector('#nextPageBtn');
  const pageNumbersWrap = document.querySelector('#pageNumbersWrap');
  const paginationInfo = document.querySelector('#paginationInfo');
  const pageSizeSelect = document.querySelector('#pageSizeSelect');

  // Accra Time Header Clock in attendance section
  function updateAttendanceHeaderClock() {
    if (attendanceAccraTime) {
      attendanceAccraTime.textContent = getSchoolAttendanceTime();
    }
  }
  updateAttendanceHeaderClock();
  setInterval(updateAttendanceHeaderClock, 1000);

  if (attendanceDateFull) {
    attendanceDateFull.textContent = formatAttendanceOfficialDate();
  }

  // Filtering Service
  function filterStudents() {
    const query = attendanceState.searchQuery.trim().toLowerCase();
    const classFilter = attendanceState.classFilter;
    const statusFilter = attendanceState.statusFilter;
    const genderFilter = attendanceState.genderFilter;

    return students.filter((student) => {
      const formattedId =
        `#edu-${student.id.toString().padStart(4, '0')}`.toLowerCase();
      const matchesSearch =
        query === '' ||
        student.name.toLowerCase().includes(query) ||
        student.id.toString().includes(query) ||
        formattedId.includes(query);

      const matchesClass =
        classFilter === 'All' || student.class === classFilter;

      const status = student.dailyAttendance
        ? student.dailyAttendance.status
        : 'Unmarked';
      const matchesStatus =
        statusFilter === 'All' || status === statusFilter;

      const matchesGender =
        genderFilter === 'All' || student.gender === genderFilter;

      return matchesSearch && matchesClass && matchesStatus && matchesGender;
    });
  }

  // Individual Student Status Updaters
  function markStudentPresent(studentId) {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    student.dailyAttendance.status = 'Present';
    student.dailyAttendance.timestamp = getSchoolAttendanceTime();
    renderAttendance();
  }

  function markStudentLate(studentId) {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    student.dailyAttendance.status = 'Late';
    student.dailyAttendance.timestamp = getSchoolAttendanceTime();
    renderAttendance();
  }

  function markStudentAbsent(studentId) {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    student.dailyAttendance.status = 'Absent';
    student.dailyAttendance.timestamp = null;
    renderAttendance();
  }

  // Bulk Action Updaters
  function markAllVisiblePresent() {
    const nowTime = getSchoolAttendanceTime();
    const visibleStudents = filterStudents();
    visibleStudents.forEach((student) => {
      student.dailyAttendance.status = 'Present';
      student.dailyAttendance.timestamp = nowTime;
    });
    renderAttendance();
  }

  function resetAllVisibleAttendance() {
    const visibleStudents = filterStudents();
    visibleStudents.forEach((student) => {
      student.dailyAttendance.status = 'Unmarked';
      student.dailyAttendance.timestamp = null;
    });
    renderAttendance();
  }

  // Render Subsystems: Analytics Summary Bar
  function renderAnalyticsSummary() {
    const stats = calculateAttendanceRate(students);

    if (metricPresentCount) metricPresentCount.textContent = stats.present;
    if (metricPresentPct) metricPresentPct.textContent = `${stats.presentPct}%`;

    if (metricLateCount) metricLateCount.textContent = stats.late;
    if (metricLatePct) metricLatePct.textContent = `${stats.latePct}%`;

    if (metricAbsentCount) metricAbsentCount.textContent = stats.absent;
    if (metricAbsentPct) metricAbsentPct.textContent = `${stats.absentPct}%`;

    if (metricAttendanceRate) metricAttendanceRate.textContent = `${stats.rate}%`;
    if (metricProgressFill) metricProgressFill.style.width = `${stats.rate}%`;
    if (statTodayAttendanceRate)
      statTodayAttendanceRate.textContent = `${stats.rate}%`;

    if (metricStatusTag) {
      const numRate = parseFloat(stats.rate);
      if (numRate >= 90) {
        metricStatusTag.textContent = 'Excellent';
        metricStatusTag.className = 'status-indicator-tag';
      } else if (numRate >= 80) {
        metricStatusTag.textContent = 'On Track';
        metricStatusTag.className = 'status-indicator-tag warning';
      } else {
        metricStatusTag.textContent = 'At Risk';
        metricStatusTag.className = 'status-indicator-tag danger';
      }
    }
  }

  // Render Subsystems: Roster Table Row
  function renderRosterTableRow(student) {
    const initials = getInitials(student.name);
    const daily = student.dailyAttendance || {
      status: 'Unmarked',
      timestamp: null,
    };
    const status = daily.status;

    let statusBadgeHTML = '';
    if (status === 'Present') {
      statusBadgeHTML = `<span class="status-badge-pill status-present">${ICONS.present} Present</span>`;
    } else if (status === 'Late') {
      statusBadgeHTML = `<span class="status-badge-pill status-late">${ICONS.late} Late</span>`;
    } else if (status === 'Absent') {
      statusBadgeHTML = `<span class="status-badge-pill status-absent">${ICONS.absent} Absent</span>`;
    } else {
      statusBadgeHTML = `<span class="status-badge-pill status-unmarked">${ICONS.unmarked} Unmarked</span>`;
    }

    const timeDisplay = daily.timestamp
      ? `<span class="roster-time">${daily.timestamp}</span>`
      : `<span class="roster-time empty">—</span>`;

    return `
      <tr data-student-id="${student.id}">
        <td>
          <div class="roster-student-cell">
            <div class="roster-avatar">${initials}</div>
            <div>
              <div class="roster-student-name">${student.name}</div>
              <div class="roster-student-id">#EDU-${student.id.toString().padStart(4, '0')}</div>
            </div>
          </div>
        </td>

        <td>
          <span class="roster-class-badge">${student.class}</span>
        </td>

        <td>
          ${statusBadgeHTML}
        </td>

        <td>
          ${timeDisplay}
        </td>

        <td>
          <div class="segmented-status-control" role="group" aria-label="Mark attendance for ${student.name}">
            <button 
              type="button" 
              class="btn-ctrl btn-present ${status === 'Present' ? 'active' : ''}" 
              data-action="present"
              aria-pressed="${status === 'Present'}"
              title="Mark Present">
              ${ICONS.present} Present
            </button>
            <button 
              type="button" 
              class="btn-ctrl btn-late ${status === 'Late' ? 'active' : ''}" 
              data-action="late"
              aria-pressed="${status === 'Late'}"
              title="Mark Late">
              ${ICONS.late} Late
            </button>
            <button 
              type="button" 
              class="btn-ctrl btn-absent ${status === 'Absent' ? 'active' : ''}" 
              data-action="absent"
              aria-pressed="${status === 'Absent'}"
              title="Mark Absent">
              ${ICONS.absent} Absent
            </button>
          </div>
        </td>

        <td>
          <button type="button" class="btn-roster-view" data-action="view-modal">
            <span>View</span> ${ICONS.externalLink}
          </button>
        </td>
      </tr>
    `;
  }

  // Render Subsystems: Pagination Controls
  function renderPagination(totalFilteredCount) {
    if (!rosterPagination) return;

    const pageSize = attendanceState.pageSize;
    const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));

    if (attendanceState.currentPage > totalPages) {
      attendanceState.currentPage = totalPages;
    }
    const currentPage = attendanceState.currentPage;

    if (paginationInfo) {
      if (totalFilteredCount === 0) {
        paginationInfo.innerHTML = `No students found matching filters`;
      } else {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, totalFilteredCount);
        paginationInfo.innerHTML = `Showing <strong>${start}–${end}</strong> of <strong>${totalFilteredCount}</strong> students`;
      }
    }

    if (prevPageBtn) {
      prevPageBtn.disabled = currentPage <= 1;
    }
    if (nextPageBtn) {
      nextPageBtn.disabled = currentPage >= totalPages;
    }

    if (pageNumbersWrap) {
      let pagesHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        pagesHTML += `
          <button 
            type="button" 
            class="page-num-btn ${i === currentPage ? 'active' : ''}" 
            data-page="${i}"
            aria-label="Go to page ${i}"
            aria-current="${i === currentPage ? 'page' : 'false'}">
            ${i}
          </button>
        `;
      }
      pageNumbersWrap.innerHTML = pagesHTML;
    }
  }

  // Main Orchestrator: renderAttendance()
  function renderAttendance() {
    renderAnalyticsSummary();

    if (!rosterTableBody) return;

    const filteredStudents = filterStudents();
    const totalFiltered = filteredStudents.length;

    if (totalFiltered === 0) {
      rosterTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="roster-empty-cell">
            ${ICONS.search} <span>No students found matching your search or filters.</span>
          </td>
        </tr>
      `;
      renderPagination(0);
      return;
    }

    const pageSize = attendanceState.pageSize;
    const startIndex = (attendanceState.currentPage - 1) * pageSize;
    const paginatedStudents = filteredStudents.slice(
      startIndex,
      startIndex + pageSize,
    );

    rosterTableBody.innerHTML = paginatedStudents
      .map(renderRosterTableRow)
      .join('');

    renderPagination(totalFiltered);
  }

  // Event Listeners for Filters & Search
  if (rosterSearchInput) {
    rosterSearchInput.addEventListener('input', (e) => {
      attendanceState.searchQuery = e.target.value;
      attendanceState.currentPage = 1;
      renderAttendance();
    });
  }

  if (rosterClassFilter) {
    rosterClassFilter.addEventListener('change', (e) => {
      attendanceState.classFilter = e.target.value;
      attendanceState.currentPage = 1;
      renderAttendance();
    });
  }

  if (rosterStatusFilter) {
    rosterStatusFilter.addEventListener('change', (e) => {
      attendanceState.statusFilter = e.target.value;
      attendanceState.currentPage = 1;
      renderAttendance();
    });
  }

  if (rosterGenderFilter) {
    rosterGenderFilter.addEventListener('change', (e) => {
      attendanceState.genderFilter = e.target.value;
      attendanceState.currentPage = 1;
      renderAttendance();
    });
  }

  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', (e) => {
      attendanceState.pageSize = Number(e.target.value);
      attendanceState.currentPage = 1;
      renderAttendance();
    });
  }

  // Event Delegation for Table Roster Actions
  if (rosterTableBody) {
    rosterTableBody.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;

      const studentId = Number(row.dataset.studentId);
      if (!studentId) return;

      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.dataset.action;
      if (action === 'present') {
        markStudentPresent(studentId);
      } else if (action === 'late') {
        markStudentLate(studentId);
      } else if (action === 'absent') {
        markStudentAbsent(studentId);
      } else if (action === 'view-modal') {
        const student = students.find((s) => s.id === studentId);
        if (student && onOpenStudentModal) {
          onOpenStudentModal(student);
        }
      }
    });
  }

  // Pagination Event Listeners
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (attendanceState.currentPage > 1) {
        attendanceState.currentPage -= 1;
        renderAttendance();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const filteredCount = filterStudents().length;
      const totalPages = Math.ceil(filteredCount / attendanceState.pageSize);
      if (attendanceState.currentPage < totalPages) {
        attendanceState.currentPage += 1;
        renderAttendance();
      }
    });
  }

  if (pageNumbersWrap) {
    pageNumbersWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.page-num-btn');
      if (!btn) return;
      const pageNum = Number(btn.dataset.page);
      if (pageNum && pageNum !== attendanceState.currentPage) {
        attendanceState.currentPage = pageNum;
        renderAttendance();
      }
    });
  }

  // Bulk Actions
  if (markAllPresentBtn) {
    markAllPresentBtn.addEventListener('click', markAllVisiblePresent);
  }

  if (resetAttendanceBtn) {
    resetAttendanceBtn.addEventListener('click', resetAllVisibleAttendance);
  }

  // Initial render
  renderAttendance();
}
