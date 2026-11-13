// Attendance Roster & Interactive Roll Call Module
import {
  getAttendanceState,
  setAttendanceSearchQuery,
  setAttendanceClassFilter,
  setAttendanceStatusFilter,
  setAttendanceGenderFilter,
  setAttendancePageSize,
  setAttendanceCurrentPage,
} from './attendanceState.js';
import {
  getStudents,
  getStudentById,
  updateStudentDailyAttendance,
} from '../../data/studentsData.js';
import { calculateAttendanceRate } from './attendanceAnalytics.js';
import { getInitials } from '../../utils/domUtils.js';
import { ICONS } from '../../utils/icons.js';
import {
  getSchoolAttendanceTime,
  formatAttendanceOfficialDate,
} from '../../utils/dateUtils.js';

let attendanceClockIntervalId = null;
let attendanceController = null;
let currentOpenStudentModalCallback = null;

export function initAttendanceRoster(_studentsInput, onOpenStudentModal) {
  if (typeof onOpenStudentModal === 'function') {
    currentOpenStudentModalCallback = onOpenStudentModal;
  }

  if (attendanceController) {
    attendanceController.refresh();
    return attendanceController;
  }

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
  if (!attendanceClockIntervalId) {
    attendanceClockIntervalId = setInterval(updateAttendanceHeaderClock, 1000);
  }

  if (attendanceDateFull) {
    attendanceDateFull.textContent = formatAttendanceOfficialDate();
  }

  // Filtering Service
  function filterStudents() {
    const { searchQuery, classFilter, statusFilter, genderFilter } = getAttendanceState();
    const query = searchQuery.trim().toLowerCase();
    const currentStudents = getStudents();

    return currentStudents.filter((student) => {
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
    updateStudentDailyAttendance(studentId, 'Present', getSchoolAttendanceTime());
    renderAttendance();
  }

  function markStudentLate(studentId) {
    updateStudentDailyAttendance(studentId, 'Late', getSchoolAttendanceTime());
    renderAttendance();
  }

  function markStudentAbsent(studentId) {
    updateStudentDailyAttendance(studentId, 'Absent', null);
    renderAttendance();
  }

  // Bulk Action Updaters
  function markAllVisiblePresent() {
    const nowTime = getSchoolAttendanceTime();
    const visibleStudents = filterStudents();
    visibleStudents.forEach((student) => {
      updateStudentDailyAttendance(student.id, 'Present', nowTime);
    });
    renderAttendance();
  }

  function resetAllVisibleAttendance() {
    const visibleStudents = filterStudents();
    visibleStudents.forEach((student) => {
      updateStudentDailyAttendance(student.id, 'Unmarked', null);
    });
    renderAttendance();
  }

  // Render Subsystems: Analytics Summary Bar
  function renderAnalyticsSummary() {
    const stats = calculateAttendanceRate(getStudents());

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

  // Render Subsystems: Roster Table Row (Safe DOM construction)
  function createRosterTableRowElement(student) {
    const initials = getInitials(student.name);
    const daily = student.dailyAttendance || {
      status: 'Unmarked',
      timestamp: null,
    };
    const status = daily.status;

    const tr = document.createElement('tr');
    tr.dataset.studentId = String(student.id);

    // 1. Student Identity Cell
    const tdStudent = document.createElement('td');
    const studentCellDiv = document.createElement('div');
    studentCellDiv.className = 'roster-student-cell';
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'roster-avatar';
    avatarDiv.textContent = initials;
    const identityWrap = document.createElement('div');
    const nameDiv = document.createElement('div');
    nameDiv.className = 'roster-student-name';
    nameDiv.textContent = student.name;
    const idDiv = document.createElement('div');
    idDiv.className = 'roster-student-id';
    idDiv.textContent = `#EDU-${student.id.toString().padStart(4, '0')}`;
    identityWrap.append(nameDiv, idDiv);
    studentCellDiv.append(avatarDiv, identityWrap);
    tdStudent.appendChild(studentCellDiv);

    // 2. Class Badge Cell
    const tdClass = document.createElement('td');
    const classBadge = document.createElement('span');
    classBadge.className = 'roster-class-badge';
    classBadge.textContent = student.class;
    tdClass.appendChild(classBadge);

    // 3. Status Badge Cell
    const tdStatus = document.createElement('td');
    const statusBadge = document.createElement('span');
    if (status === 'Present') {
      statusBadge.className = 'status-badge-pill status-present';
      statusBadge.innerHTML = ICONS.present;
      statusBadge.append(' Present');
    } else if (status === 'Late') {
      statusBadge.className = 'status-badge-pill status-late';
      statusBadge.innerHTML = ICONS.late;
      statusBadge.append(' Late');
    } else if (status === 'Absent') {
      statusBadge.className = 'status-badge-pill status-absent';
      statusBadge.innerHTML = ICONS.absent;
      statusBadge.append(' Absent');
    } else {
      statusBadge.className = 'status-badge-pill status-unmarked';
      statusBadge.innerHTML = ICONS.unmarked;
      statusBadge.append(' Unmarked');
    }
    tdStatus.appendChild(statusBadge);

    // 4. Timestamp Cell
    const tdTime = document.createElement('td');
    const timeSpan = document.createElement('span');
    if (daily.timestamp) {
      timeSpan.className = 'roster-time';
      timeSpan.textContent = daily.timestamp;
    } else {
      timeSpan.className = 'roster-time empty';
      timeSpan.textContent = '—';
    }
    tdTime.appendChild(timeSpan);

    // 5. Segmented Status Controls Cell
    const tdControls = document.createElement('td');
    const controlGroup = document.createElement('div');
    controlGroup.className = 'segmented-status-control';
    controlGroup.setAttribute('role', 'group');
    controlGroup.setAttribute('aria-label', `Mark attendance for ${student.name}`);

    const createStatusBtn = (actionName, btnClass, isActive, titleText, iconSvg, labelText) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn-ctrl ${btnClass}${isActive ? ' active' : ''}`;
      btn.dataset.action = actionName;
      btn.setAttribute('aria-pressed', String(isActive));
      btn.title = titleText;
      btn.innerHTML = iconSvg;
      btn.append(` ${labelText}`);
      return btn;
    };

    controlGroup.append(
      createStatusBtn('present', 'btn-present', status === 'Present', 'Mark Present', ICONS.present, 'Present'),
      createStatusBtn('late', 'btn-late', status === 'Late', 'Mark Late', ICONS.late, 'Late'),
      createStatusBtn('absent', 'btn-absent', status === 'Absent', 'Mark Absent', ICONS.absent, 'Absent'),
    );
    tdControls.appendChild(controlGroup);

    // 6. View Modal Action Cell
    const tdView = document.createElement('td');
    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'btn-roster-view';
    viewBtn.dataset.action = 'view-modal';
    const viewTextSpan = document.createElement('span');
    viewTextSpan.textContent = 'View';
    const extIconSpan = document.createElement('span');
    extIconSpan.innerHTML = ICONS.externalLink;
    viewBtn.append(viewTextSpan, ' ', extIconSpan);
    tdView.appendChild(viewBtn);

    tr.append(tdStudent, tdClass, tdStatus, tdTime, tdControls, tdView);
    return tr;
  }

  // Render Subsystems: Pagination Controls
  function renderPagination(totalFilteredCount) {
    if (!rosterPagination) return;

    const { pageSize, currentPage: rawCurrentPage } = getAttendanceState();
    const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));

    if (rawCurrentPage > totalPages) {
      setAttendanceCurrentPage(totalPages);
    }
    const { currentPage } = getAttendanceState();

    if (paginationInfo) {
      paginationInfo.replaceChildren();
      if (totalFilteredCount === 0) {
        paginationInfo.textContent = 'No students found matching filters';
      } else {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, totalFilteredCount);
        const rangeStrong = document.createElement('strong');
        rangeStrong.textContent = `${start}–${end}`;
        const totalStrong = document.createElement('strong');
        totalStrong.textContent = String(totalFilteredCount);
        paginationInfo.append('Showing ', rangeStrong, ' of ', totalStrong, ' students');
      }
    }

    if (prevPageBtn) {
      prevPageBtn.disabled = currentPage <= 1;
    }
    if (nextPageBtn) {
      nextPageBtn.disabled = currentPage >= totalPages;
    }

    if (pageNumbersWrap) {
      pageNumbersWrap.replaceChildren();
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = `page-num-btn${i === currentPage ? ' active' : ''}`;
        pageBtn.dataset.page = String(i);
        pageBtn.setAttribute('aria-label', `Go to page ${i}`);
        pageBtn.setAttribute('aria-current', i === currentPage ? 'page' : 'false');
        pageBtn.textContent = String(i);
        pageNumbersWrap.appendChild(pageBtn);
      }
    }
  }

  // Main Orchestrator: renderAttendance()
  function renderAttendance() {
    renderAnalyticsSummary();

    if (!rosterTableBody) return;

    const filteredStudents = filterStudents();
    const totalFiltered = filteredStudents.length;

    rosterTableBody.replaceChildren();

    if (totalFiltered === 0) {
      const emptyTr = document.createElement('tr');
      const emptyTd = document.createElement('td');
      emptyTd.colSpan = 6;
      emptyTd.className = 'roster-empty-cell';
      const iconSpan = document.createElement('span');
      iconSpan.innerHTML = ICONS.search;
      const msgSpan = document.createElement('span');
      msgSpan.textContent = 'No students found matching your search or filters.';
      emptyTd.append(iconSpan, ' ', msgSpan);
      emptyTr.appendChild(emptyTd);
      rosterTableBody.appendChild(emptyTr);
      renderPagination(0);
      return;
    }

    const { pageSize, currentPage } = getAttendanceState();
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedStudents = filteredStudents.slice(
      startIndex,
      startIndex + pageSize,
    );

    paginatedStudents.forEach((student) => {
      rosterTableBody.appendChild(createRosterTableRowElement(student));
    });

    renderPagination(totalFiltered);
  }

  // Event Listeners for Filters & Search
  if (rosterSearchInput) {
    rosterSearchInput.addEventListener('input', (e) => {
      setAttendanceSearchQuery(e.target.value);
      renderAttendance();
    });
  }

  if (rosterClassFilter) {
    rosterClassFilter.addEventListener('change', (e) => {
      setAttendanceClassFilter(e.target.value);
      renderAttendance();
    });
  }

  if (rosterStatusFilter) {
    rosterStatusFilter.addEventListener('change', (e) => {
      setAttendanceStatusFilter(e.target.value);
      renderAttendance();
    });
  }

  if (rosterGenderFilter) {
    rosterGenderFilter.addEventListener('change', (e) => {
      setAttendanceGenderFilter(e.target.value);
      renderAttendance();
    });
  }

  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', (e) => {
      setAttendancePageSize(Number(e.target.value));
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
        const student = getStudentById(studentId);
        if (student && currentOpenStudentModalCallback) {
          currentOpenStudentModalCallback(student);
        }
      }
    });
  }

  // Pagination Event Listeners
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      const { currentPage } = getAttendanceState();
      if (currentPage > 1) {
        setAttendanceCurrentPage(currentPage - 1);
        renderAttendance();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const { currentPage, pageSize } = getAttendanceState();
      const filteredCount = filterStudents().length;
      const totalPages = Math.ceil(filteredCount / pageSize);
      if (currentPage < totalPages) {
        setAttendanceCurrentPage(currentPage + 1);
        renderAttendance();
      }
    });
  }

  if (pageNumbersWrap) {
    pageNumbersWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.page-num-btn');
      if (!btn) return;
      const pageNum = Number(btn.dataset.page);
      const { currentPage } = getAttendanceState();
      if (pageNum && pageNum !== currentPage) {
        setAttendanceCurrentPage(pageNum);
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

  attendanceController = {
    refresh: renderAttendance,
  };
  return attendanceController;
}
