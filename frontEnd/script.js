const students = [
  {
    id: 1,
    name: 'Ama Mensah',
    gender: 'Female',
    class: 'Form 1',
    yearOfEnrollment: 2024,
    dateOfBirth: '2009-04-15',
    email: 'ama.mensah@edumanage.edu',
    phone: '+233 24 123 4567',
    subjects: ['Mathematics', 'English', 'Integrated Science', 'ICT'],
    gpa: 3.85,
    attendance: 96,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:05 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Kofi Mensah',
      relation: 'Father',
      phone: '+233 20 987 6543',
    },
  },

  {
    id: 2,
    name: 'Henri Miessan',
    gender: 'Male',
    class: 'Form 3',
    yearOfEnrollment: 2023,
    dateOfBirth: '2007-09-22',
    email: 'henri.miessan@edumanage.edu',
    phone: '+233 50 234 5678',
    subjects: ['Physics', 'Elective Maths', 'Chemistry', 'English'],
    gpa: 3.92,
    attendance: 98,
    dailyAttendance: {
      status: 'Present',
      timestamp: '07:55 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mrs. Cynthia Miessan',
      relation: 'Mother',
      phone: '+233 24 876 5432',
    },
  },

  {
    id: 3,
    name: 'Daniel Owusu',
    gender: 'Male',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-11-05',
    email: 'daniel.owusu@edumanage.edu',
    phone: '+233 27 345 6789',
    subjects: ['Economics', 'Geography', 'Government', 'English'],
    gpa: 3.45,
    attendance: 91,
    dailyAttendance: {
      status: 'Late',
      timestamp: '08:35 GMT',
    },
    feesStatus: 'Pending',
    guardian: {
      name: 'Mr. Emmanuel Owusu',
      relation: 'Father',
      phone: '+233 55 765 4321',
    },
  },

  {
    id: 4,
    name: 'Madam Fausty',
    gender: 'Female',
    class: 'Form 3',
    yearOfEnrollment: 2022,
    dateOfBirth: '2006-03-18',
    email: 'fausty.mensah@edumanage.edu',
    phone: '+233 26 456 7890',
    subjects: ['Literature', 'French', 'History', 'English'],
    gpa: 3.78,
    attendance: 94,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:12 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Dr. Kwame Appiah',
      relation: 'Uncle',
      phone: '+233 20 654 3210',
    },
  },

  {
    id: 5,
    name: 'Kwame Mensah',
    gender: 'Male',
    class: 'Form 1',
    yearOfEnrollment: 2025,
    dateOfBirth: '2010-01-30',
    email: 'kwame.mensah@edumanage.edu',
    phone: '+233 54 567 8901',
    subjects: ['General Science', 'Mathematics', 'Social Studies', 'ICT'],
    gpa: 3.6,
    attendance: 88,
    dailyAttendance: {
      status: 'Absent',
      timestamp: null,
    },
    feesStatus: 'Overdue',
    guardian: {
      name: 'Mrs. Grace Mensah',
      relation: 'Mother',
      phone: '+233 24 543 2109',
    },
  },

  {
    id: 6,
    name: 'Abena Asante',
    gender: 'Female',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-07-12',
    email: 'abena.asante@edumanage.edu',
    phone: '+233 59 678 9012',
    subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
    gpa: 3.95,
    attendance: 99,
    dailyAttendance: {
      status: 'Present',
      timestamp: '07:58 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Osei Asante',
      relation: 'Father',
      phone: '+233 27 432 1098',
    },
  },

  {
    id: 7,
    name: 'Kojo Boateng',
    gender: 'Male',
    class: 'Form 3',
    yearOfEnrollment: 2023,
    dateOfBirth: '2007-06-25',
    email: 'kojo.boateng@edumanage.edu',
    phone: '+233 20 789 0123',
    subjects: ['Accounting', 'Costing', 'Business Management', 'Economics'],
    gpa: 3.5,
    attendance: 92,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:20 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mrs. Sarah Boateng',
      relation: 'Mother',
      phone: '+233 50 321 0987',
    },
  },

  {
    id: 8,
    name: 'Akosua Owusu',
    gender: 'Female',
    class: 'Form 1',
    yearOfEnrollment: 2025,
    dateOfBirth: '2010-08-19',
    email: 'akosua.owusu@edumanage.edu',
    phone: '+233 24 890 1234',
    subjects: ['Visual Arts', 'General Knowledge in Art', 'English', 'ICT'],
    gpa: 3.7,
    attendance: 95,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:14 GMT',
    },
    feesStatus: 'Pending',
    guardian: {
      name: 'Mr. Yaw Owusu',
      relation: 'Father',
      phone: '+233 26 210 9876',
    },
  },

  {
    id: 9,
    name: 'Michael Mensah',
    gender: 'Male',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-12-03',
    email: 'michael.mensah@edumanage.edu',
    phone: '+233 55 901 2345',
    subjects: [
      'Technical Drawing',
      'Applied Electricity',
      'Mathematics',
      'Physics',
    ],
    gpa: 3.3,
    attendance: 89,
    dailyAttendance: {
      status: 'Late',
      timestamp: '08:40 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Joseph Mensah',
      relation: 'Father',
      phone: '+233 24 109 8765',
    },
  },

  {
    id: 10,
    name: 'Adwoa Frimpong',
    gender: 'Female',
    class: 'Form 3',
    yearOfEnrollment: 2022,
    dateOfBirth: '2006-10-14',
    email: 'adwoa.frimpong@edumanage.edu',
    phone: '+233 28 012 3456',
    subjects: [
      'Home Economics',
      'Food & Nutrition',
      'Biology',
      'Management in Living',
    ],
    gpa: 3.88,
    attendance: 97,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:00 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mrs. Rita Frimpong',
      relation: 'Mother',
      phone: '+233 54 098 7654',
    },
  },

  {
    id: 11,
    name: 'Yaw Asare',
    gender: 'Male',
    class: 'Form 1',
    yearOfEnrollment: 2025,
    dateOfBirth: '2009-11-28',
    email: 'yaw.asare@edumanage.edu',
    phone: '+233 23 123 4567',
    subjects: ['Mathematics', 'English', 'Social Studies', 'ICT'],
    gpa: 3.15,
    attendance: 86,
    dailyAttendance: {
      status: 'Absent',
      timestamp: null,
    },
    feesStatus: 'Overdue',
    guardian: {
      name: 'Mr. Samuel Asare',
      relation: 'Father',
      phone: '+233 20 987 6540',
    },
  },

  {
    id: 12,
    name: 'Esi Appiah',
    gender: 'Female',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-05-09',
    email: 'esi.appiah@edumanage.edu',
    phone: '+233 50 234 5671',
    subjects: ['Geography', 'Economics', 'Government', 'Mathematics'],
    gpa: 3.82,
    attendance: 96,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:10 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mrs. Joyce Appiah',
      relation: 'Mother',
      phone: '+233 24 876 5430',
    },
  },

  {
    id: 13,
    name: 'Kofi Addo',
    gender: 'Male',
    class: 'Form 3',
    yearOfEnrollment: 2023,
    dateOfBirth: '2007-02-17',
    email: 'kofi.addo@edumanage.edu',
    phone: '+233 27 345 6780',
    subjects: ['Elective Maths', 'Physics', 'Chemistry', 'Biology'],
    gpa: 3.9,
    attendance: 94,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:07 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Seth Addo',
      relation: 'Father',
      phone: '+233 55 765 4320',
    },
  },

  {
    id: 14,
    name: 'Afia Boateng',
    gender: 'Female',
    class: 'Form 1',
    yearOfEnrollment: 2025,
    dateOfBirth: '2010-04-02',
    email: 'afia.boateng@edumanage.edu',
    phone: '+233 26 456 7891',
    subjects: ['Integrated Science', 'Mathematics', 'English', 'French'],
    gpa: 3.65,
    attendance: 93,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:09 GMT',
    },
    feesStatus: 'Pending',
    guardian: {
      name: 'Mrs. Patience Boateng',
      relation: 'Mother',
      phone: '+233 20 654 3219',
    },
  },

  {
    id: 15,
    name: 'Samuel Osei',
    gender: 'Male',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-08-21',
    email: 'samuel.osei@edumanage.edu',
    phone: '+233 54 567 8902',
    subjects: ['Accounting', 'Business Management', 'Economics', 'ICT'],
    gpa: 3.75,
    attendance: 95,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:02 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Peter Osei',
      relation: 'Father',
      phone: '+233 24 543 2108',
    },
  },

  {
    id: 16,
    name: 'kwame osei',
    gender: 'Male',
    class: 'Form 4',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-08-21',
    email: 'samuel.osei@edumanage.edu',
    phone: '+233 54 567 8902',
    subjects: ['Accounting', 'Business Management', 'Economics', 'ICT'],
    gpa: 3.75,
    attendance: 95,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:15 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Peter Osei',
      relation: 'Father',
      phone: '+233 24 543 2108',
    },
  },
];

// DOM Elements
const showStudentsBtn = document.querySelector('#showStudentsBtn');
const studentList = document.querySelector('#studentList');
const totalStudentsCount = document.querySelector('#totalStudentsCount');
const totalClassesCount = document.querySelector('#totalClassesCount');
const academicTermRange = document.querySelector('#academicTermRange');
const liveTime = document.querySelector('#liveTime');
const achieversList = document.querySelector('#achieversList');
const viewAllAchieversBtn = document.querySelector('#viewAllAchieversBtn');
const studentModal = document.querySelector('#studentModal');
const closeModalBtn = document.querySelector('#closeModalBtn');
const modalBody = document.querySelector('#modalBody');

// Attendance DOM Elements
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
const prevPageBtn = document.querySelector('#prevPageBtn');
const nextPageBtn = document.querySelector('#nextPageBtn');
const pageNumbersWrap = document.querySelector('#pageNumbersWrap');
const paginationInfo = document.querySelector('#paginationInfo');
const pageSizeSelect = document.querySelector('#pageSizeSelect');

// Update dynamic stats on load
if (totalStudentsCount) {
  totalStudentsCount.textContent = students.length;
}

// Named function to extract the class name from a student
function getStudentClass(student) {
  return student.class;
}

if (totalClassesCount) {
  const classList = students.map(getStudentClass);
  const uniqueClasses = new Set(classList);
  totalClassesCount.textContent = uniqueClasses.size;
}

// ===========================================
// DATE & TIMEZONE FORMATTING (Africa/Accra)
// ===========================================

// 1. Separate options object for the live clock
const clockOptions = {
  timeZone: 'Africa/Accra',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short',
};

// 2. Named function to format live time using the clockOptions object
function formatSchoolTime(date) {
  const formatter = new Intl.DateTimeFormat('en-GB', clockOptions);
  return formatter.format(date);
}

// 3. Separate options object for academic term date ranges
const termRangeOptions = {
  timeZone: 'Africa/Accra',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

// 4. Named function to format an academic term date range using termRangeOptions
function formatTermRange(startDate, endDate) {
  const formatter = new Intl.DateTimeFormat('en-GH', termRangeOptions);
  return formatter.formatRange(startDate, endDate);
}

// Named function to update the live clock in the header
function updateLiveClock() {
  if (liveTime) {
    const now = new Date();
    liveTime.textContent = formatSchoolTime(now);
  }
}

// Start live school clock
updateLiveClock();
setInterval(updateLiveClock, 1000);

// Populate academic term date range on the dashboard
if (academicTermRange) {
  const termStart = new Date('2026-09-01');
  const termEnd = new Date('2026-12-18');
  academicTermRange.textContent = formatTermRange(termStart, termEnd);
}

// ===========================================
// TOP ACHIEVERS WIDGET (.sort() & .slice(0, 3))
// ===========================================

// 1. Comparator function to sort students by highest GPA first
function compareStudentGpa(a, b) {
  return b.gpa - a.gpa;
}

// 2. Helper function to determine student stream / program
function getStudentProgram(student) {
  const subjects = student.subjects;
  if (subjects.includes('Physics') || subjects.includes('Chemistry')) {
    return 'Science';
  }
  if (
    subjects.includes('Accounting') ||
    subjects.includes('Business Management')
  ) {
    return 'Business';
  }
  if (subjects.includes('Literature') || subjects.includes('History')) {
    return 'General Arts';
  }
  if (
    subjects.includes('Technical Drawing') ||
    subjects.includes('Applied Electricity')
  ) {
    return 'Technical';
  }
  if (
    subjects.includes('Food & Nutrition') ||
    subjects.includes('Home Economics')
  ) {
    return 'Home Economics';
  }
  return subjects[0] || 'General';
}

// 3. Named function to render ONE achiever row
function renderAchieverRow(student, index) {
  const medals = ['🥇', '🥈', '🥉'];
  const medal = medals[index] || '🎖️';
  const program = getStudentProgram(student);

  return `
    <div class="achiever-row" data-id="${student.id}" role="button" tabindex="0" aria-label="View profile of top achiever ${student.name}">
      <span class="achiever-medal" aria-hidden="true">${medal}</span>
      <div class="achiever-details">
        <p class="achiever-name">${student.name}</p>
        <span class="achiever-meta">${student.class} • ${program}</span>
      </div>
      <span class="achiever-gpa-badge">${student.gpa} GPA</span>
    </div>
  `;
}

// 4. Main function to build Top Achievers using spread operator [...students] and .slice(0, 3)
function renderTopAchievers() {
  // Make a safe copy of the array using spread operator
  const studentCopy = [...students];

  // Sort the copy from highest to lowest GPA
  studentCopy.sort(compareStudentGpa);

  // Take only the top 3 achievers using slice(0, 3)
  const top3Achievers = studentCopy.slice(0, 3);

  // Map to HTML rows
  return top3Achievers.map(renderAchieverRow).join('');
}

// Populate Top Achievers on page load
if (achieversList) {
  achieversList.innerHTML = renderTopAchievers();
}

// ===========================================
// NAMED FUNCTIONS FOR STUDENT RENDERING
// ===========================================

// 1. Function to create HTML for ONE student card in the list
function studentInfo(student) {
  return `
    <div class="student-card" data-id="${student.id}" role="button" tabindex="0" aria-label="View profile of ${student.name}">
      <span class="student-id">#${student.id}</span>
      <span class="student-name">${student.name}</span>
      <span class="student-class">${student.class}</span>
      <span class="student-year">Enrolled: ${student.yearOfEnrollment}</span>
      <span class="card-view-btn">View Profile ↗</span>
    </div>
  `;
}

// 2. Function to create ONE subject badge HTML
function createSubjectPill(subject) {
  return `<span class="subject-pill">${subject}</span>`;
}

// 3. Named functions to extract initials from a full name (e.g. "Henri Miessan" -> "HM")
function getFirstLetter(word) {
  return word[0];
}

function getInitials(name) {
  const words = name.split(' ');
  const initials = words.map(getFirstLetter).join('');
  return initials.toUpperCase();
}

// 4. Function to create the complete modal profile HTML for a student
function renderStudentProfile(student) {
  // Use named function inside .map() to format all subjects
  const subjectsHTML = student.subjects.map(createSubjectPill).join('');
  const statusClass = student.feesStatus.toLowerCase();
  const initials = getInitials(student.name);

  // Daily attendance status badge
  const daily = student.dailyAttendance || {
    status: 'Unmarked',
    timestamp: null,
  };
  let todayBadgeHTML = '';
  if (daily.status === 'Present') {
    todayBadgeHTML = `<span class="badge-risk good">✅ Present ${daily.timestamp ? `(${daily.timestamp})` : ''}</span>`;
  } else if (daily.status === 'Late') {
    todayBadgeHTML = `<span class="badge-risk warning">⏰ Late ${daily.timestamp ? `(${daily.timestamp})` : ''}</span>`;
  } else if (daily.status === 'Absent') {
    todayBadgeHTML = `<span class="badge-risk danger">❌ Absent</span>`;
  } else {
    todayBadgeHTML = `<span class="badge-risk">⚪ Unmarked</span>`;
  }

  // Term attendance standing badge
  let standingBadgeHTML = '';
  if (student.attendance >= 90) {
    standingBadgeHTML = `<span class="badge-risk good">Excellent Standing</span>`;
  } else if (student.attendance >= 80) {
    standingBadgeHTML = `<span class="badge-risk warning">Satisfactory</span>`;
  } else {
    standingBadgeHTML = `<span class="badge-risk danger">At Risk (&lt; 80%)</span>`;
  }

  return `
    <div class="profile-header">
      <div class="profile-avatar">${initials}</div>
      <div>
        <h3 id="modalStudentName">${student.name}</h3>
        <div class="profile-header-meta">
          <p>${student.class} • ${student.gender} • Enrolled: ${student.yearOfEnrollment}</p>
          <span class="status-badge ${statusClass}">Fees: ${student.feesStatus}</span>
        </div>
      </div>
    </div>

    <div class="profile-attendance-card">
      <div class="profile-attendance-info">
        <span>Today's Check-In Status</span>
        <strong>${daily.status} ${daily.timestamp ? `• ${daily.timestamp}` : ''}</strong>
      </div>
      <div>
        ${todayBadgeHTML}
      </div>
    </div>

    <div class="profile-grid">
      <div class="profile-field">
        <span>Email Address</span>
        <strong>${student.email}</strong>
      </div>
      <div class="profile-field">
        <span>Phone Number</span>
        <strong>${student.phone}</strong>
      </div>
      <div class="profile-field">
        <span>Grade Point Average</span>
        <strong>${student.gpa} / 4.0</strong>
      </div>
      <div class="profile-field">
        <span>Term Attendance</span>
        <strong>${student.attendance}% &nbsp;${standingBadgeHTML}</strong>
      </div>
      <div class="profile-field">
        <span>Date of Birth</span>
        <strong>${student.dateOfBirth}</strong>
      </div>
      <div class="profile-field">
        <span>Student ID</span>
        <strong>#EDU-${student.id.toString().padStart(4, '0')}</strong>
      </div>
    </div>

    <p class="profile-section-title">Enrolled Subjects (${student.subjects.length}):</p>
    <div class="subject-pills">
      ${subjectsHTML}
    </div>

    <div class="guardian-card">
      <p class="profile-section-title">Guardian Information:</p>
      <p><strong>${student.guardian.name}</strong> <span>(${student.guardian.relation})</span></p>
      <p><span>Phone:</span> ${student.guardian.phone}</p>
    </div>
  `;
}

// ===========================================
// MODAL CONTROLS & EVENT LISTENERS
// ===========================================

function openModal(student) {
  if (studentModal && modalBody) {
    modalBody.innerHTML = renderStudentProfile(student);
    studentModal.classList.add('active');
    studentModal.setAttribute('aria-hidden', 'false');
  }
}

function closeModal() {
  if (studentModal) {
    studentModal.classList.remove('active');
    studentModal.setAttribute('aria-hidden', 'true');
  }
}

// Close modal handlers
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (studentModal) {
  // Close when clicking outside the card (on the dark background overlay)
  studentModal.addEventListener('click', function (e) {
    if (e.target === studentModal) {
      closeModal();
    }
  });
}

// Close with Escape key
window.addEventListener('keydown', function (e) {
  if (
    e.key === 'Escape' &&
    studentModal &&
    studentModal.classList.contains('active')
  ) {
    closeModal();
  }
});

// Card click handler on the student list
if (studentList) {
  studentList.addEventListener('click', function (e) {
    const card = e.target.closest('.student-card');
    if (!card) return;

    const clickedId = Number(card.dataset.id);

    // Named function to find the matching student
    function findClickedStudent(student) {
      return student.id === clickedId;
    }

    const selectedStudent = students.find(findClickedStudent);

    if (selectedStudent) {
      openModal(selectedStudent);
    }
  });
}

// Achiever row click handler (opens matching student modal)
if (achieversList) {
  achieversList.addEventListener('click', function (e) {
    const row = e.target.closest('.achiever-row');
    if (!row) return;

    const clickedId = Number(row.dataset.id);

    // Named function to find the clicked achiever
    function findClickedAchiever(student) {
      return student.id === clickedId;
    }

    const selectedAchiever = students.find(findClickedAchiever);
    if (selectedAchiever) {
      openModal(selectedAchiever);
    }
  });
}

// "View all →" button: reveals student list and scrolls smoothly to it
if (viewAllAchieversBtn && showStudentsBtn && studentList) {
  viewAllAchieversBtn.addEventListener('click', function () {
    if (!isVisible) {
      showStudentsBtn.click();
    }
    studentList.scrollIntoView({ behavior: 'smooth' });
  });
}

// ===========================================
// TOGGLE BUTTON (SHOW / HIDE STUDENTS)
// ===========================================

let isVisible = false;

if (showStudentsBtn && studentList) {
  showStudentsBtn.addEventListener('click', function () {
    isVisible = !isVisible;

    if (isVisible) {
      // Map array to HTML cards using named function
      studentList.innerHTML = students.map(studentInfo).join('');
      showStudentsBtn.textContent = 'Hide Students';
      showStudentsBtn.setAttribute('aria-expanded', 'true');
    } else {
      studentList.innerHTML = '';
      showStudentsBtn.textContent = 'Show Students';
      showStudentsBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===========================================
// ATTENDANCE DASHBOARD MODULE (MODULAR ARCHITECTURE)
// ===========================================

// Centralized State for Attendance
const attendanceState = {
  searchQuery: '',
  classFilter: 'All',
  statusFilter: 'All',
  genderFilter: 'All',
  currentPage: 1,
  pageSize: 6,
};

// 1. Timezone-aware Time and Date Helpers (Africa/Accra GMT)
function getSchoolAttendanceTime() {
  const now = new Date();
  return (
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Accra',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(now) + ' GMT'
  );
}

function formatAttendanceOfficialDate() {
  const now = new Date();
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(now);
}

// Live Accra Time Header Clock
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

// 2. Data Retrieval Service: getTodayAttendance()
function getTodayAttendance() {
  return students.map(function (s) {
    return {
      studentId: s.id,
      name: s.name,
      class: s.class,
      gender: s.gender,
      attendanceRate: s.attendance,
      dailyAttendance: s.dailyAttendance || {
        status: 'Unmarked',
        timestamp: null,
      },
    };
  });
}

// 3. Analytics Calculation Service: calculateAttendanceRate()
function calculateAttendanceRate(studentList) {
  const list = studentList || students;
  const counts = list.reduce(
    function (acc, student) {
      let status = 'Unmarked';
      if (student.dailyAttendance) {
        status = student.dailyAttendance.status;
      }
      if (status === 'Present') {
        acc.present += 1;
      } else if (status === 'Late') {
        acc.late += 1;
      } else if (status === 'Absent') {
        acc.absent += 1;
      } else {
        acc.unmarked += 1;
      }
      return acc;
    },
    { present: 1, late: 1, absent: 1, unmarked: 1 },
  );

  const total = list.length;
  const weightedScore = counts.present + counts.late * 0.5;
  const rate = total > 0 ? ((weightedScore / total) * 100).toFixed(1) : '0.0';
  const presentPct =
    total > 0 ? ((counts.present / total) * 100).toFixed(1) : '0.0';
  const latePct = total > 0 ? ((counts.late / total) * 100).toFixed(1) : '0.0';
  const absentPct =
    total > 0 ? ((counts.absent / total) * 100).toFixed(1) : '0.0';

  return {
    present: counts.present,
    late: counts.late,
    absent: counts.absent,
    unmarked: counts.unmarked,
    total: total,
    rate: rate,
    presentPct: presentPct,
    latePct: latePct,
    absentPct: absentPct,
  };
}

// 4. Filtering Service: filterStudents()
function filterStudents() {
  const query = attendanceState.searchQuery.trim().toLowerCase();
  const classFilter = attendanceState.classFilter;
  const statusFilter = attendanceState.statusFilter;
  const genderFilter = attendanceState.genderFilter;

  return students.filter(function (student) {
    // 1. Search Query (matches student name or ID e.g. "ama", "1", "edu-0001")
    const formattedId =
      `#edu-${student.id.toString().padStart(4, '0')}`.toLowerCase();
    const matchesSearch =
      query === '' ||
      student.name.toLowerCase().includes(query) ||
      student.id.toString().includes(query) ||
      formattedId.includes(query);

    // 2. Class Filter
    const matchesClass = classFilter === 'All' || student.class === classFilter;

    // 3. Status Filter
    const status = student.dailyAttendance
      ? student.dailyAttendance.status
      : 'Unmarked';
    const matchesStatus = statusFilter === 'All' || status === statusFilter;

    // 4. Gender Filter
    const matchesGender = genderFilter === 'All' || student.gender === genderFilter;

    return matchesSearch && matchesClass && matchesStatus && matchesGender;
  });
}

// 5. Individual Student Status Updaters
function markStudentPresent(studentId) {
  const student = students.find(function (s) {
    return s.id === studentId;
  });
  if (!student) return;

  student.dailyAttendance.status = 'Present';
  student.dailyAttendance.timestamp = getSchoolAttendanceTime();
  renderAttendance();
}

function markStudentLate(studentId) {
  const student = students.find(function (s) {
    return s.id === studentId;
  });
  if (!student) return;

  student.dailyAttendance.status = 'Late';
  student.dailyAttendance.timestamp = getSchoolAttendanceTime();
  renderAttendance();
}

function markStudentAbsent(studentId) {
  const student = students.find(function (s) {
    return s.id === studentId;
  });
  if (!student) return;

  student.dailyAttendance.status = 'Absent';
  student.dailyAttendance.timestamp = null;
  renderAttendance();
}

function resetStudentAttendance(studentId) {
  const student = students.find(function (s) {
    return s.id === studentId;
  });
  if (!student) return;

  student.dailyAttendance.status = 'Unmarked';
  student.dailyAttendance.timestamp = null;
  renderAttendance();
}

// 6. Bulk Action Updaters
function markAllVisiblePresent() {
  const nowTime = getSchoolAttendanceTime();
  const visibleStudents = filterStudents();

  visibleStudents.forEach(function (student) {
    student.dailyAttendance.status = 'Present';
    student.dailyAttendance.timestamp = nowTime;
  });

  renderAttendance();
}

function resetAllVisibleAttendance() {
  const visibleStudents = filterStudents();

  visibleStudents.forEach(function (student) {
    student.dailyAttendance.status = 'Unmarked';
    student.dailyAttendance.timestamp = null;
  });

  renderAttendance();
}

// 7. Render Subsystems: Analytics Summary Bar
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

// 8. Render Subsystems: Roster Table Row
function renderRosterTableRow(student) {
  const initials = getInitials(student.name);
  const daily = student.dailyAttendance || {
    status: 'Unmarked',
    timestamp: null,
  };
  const status = daily.status;

  // Status Badge Pill
  let statusBadgeHTML = '';
  if (status === 'Present') {
    statusBadgeHTML = `<span class="status-badge-pill status-present">🟢 Present</span>`;
  } else if (status === 'Late') {
    statusBadgeHTML = `<span class="status-badge-pill status-late">🟠 Late</span>`;
  } else if (status === 'Absent') {
    statusBadgeHTML = `<span class="status-badge-pill status-absent">🔴 Absent</span>`;
  } else {
    statusBadgeHTML = `<span class="status-badge-pill status-unmarked">⚪ Unmarked</span>`;
  }

  // Time format
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
            🟢 Present
          </button>
          <button 
            type="button" 
            class="btn-ctrl btn-late ${status === 'Late' ? 'active' : ''}" 
            data-action="late"
            aria-pressed="${status === 'Late'}"
            title="Mark Late">
            🟠 Late
          </button>
          <button 
            type="button" 
            class="btn-ctrl btn-absent ${status === 'Absent' ? 'active' : ''}" 
            data-action="absent"
            aria-pressed="${status === 'Absent'}"
            title="Mark Absent">
            🔴 Absent
          </button>
        </div>
      </td>

      <td>
        <button type="button" class="btn-roster-view" data-action="view-modal">
          View ↗
        </button>
      </td>
    </tr>
  `;
}

// 9. Render Subsystems: Pagination Controls
function renderPagination(totalFilteredCount) {
  if (!rosterPagination) return;

  const pageSize = attendanceState.pageSize;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));

  // Ensure current page is valid
  if (attendanceState.currentPage > totalPages) {
    attendanceState.currentPage = totalPages;
  }
  const currentPage = attendanceState.currentPage;

  // Pagination Info text
  if (paginationInfo) {
    if (totalFilteredCount === 0) {
      paginationInfo.innerHTML = `No students found matching filters`;
    } else {
      const start = (currentPage - 1) * pageSize + 1;
      const end = Math.min(currentPage * pageSize, totalFilteredCount);
      paginationInfo.innerHTML = `Showing <strong>${start}–${end}</strong> of <strong>${totalFilteredCount}</strong> students`;
    }
  }

  // Prev / Next button disabled state
  if (prevPageBtn) {
    prevPageBtn.disabled = currentPage <= 1;
  }
  if (nextPageBtn) {
    nextPageBtn.disabled = currentPage >= totalPages;
  }

  // Page Numbers
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

// 10. Main Orchestrator: renderAttendance()
function renderAttendance() {
  // Update Analytics summary numbers
  renderAnalyticsSummary();

  if (!rosterTableBody) return;

  // Get filtered students
  const filteredStudents = filterStudents();
  const totalFiltered = filteredStudents.length;

  // Empty state handling
  if (totalFiltered === 0) {
    rosterTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="roster-empty-cell">
          🔍 No students found matching your search or filters.
        </td>
      </tr>
    `;
    renderPagination(0);
    return;
  }

  // Paginate filtered array
  const pageSize = attendanceState.pageSize;
  const startIndex = (attendanceState.currentPage - 1) * pageSize;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + pageSize,
  );

  // Render table rows
  rosterTableBody.innerHTML = paginatedStudents
    .map(renderRosterTableRow)
    .join('');

  // Update Pagination
  renderPagination(totalFiltered);
}

// 11. Event Listeners for Filters & Search
if (rosterSearchInput) {
  rosterSearchInput.addEventListener('input', function (e) {
    attendanceState.searchQuery = e.target.value;
    attendanceState.currentPage = 1; // Reset to page 1 on new search
    renderAttendance();
  });
}

if (rosterClassFilter) {
  rosterClassFilter.addEventListener('change', function (e) {
    attendanceState.classFilter = e.target.value;
    attendanceState.currentPage = 1; // Reset to page 1 on filter change
    renderAttendance();
  });
}

if (rosterStatusFilter) {
  rosterStatusFilter.addEventListener('change', function (e) {
    attendanceState.statusFilter = e.target.value;
    attendanceState.currentPage = 1;
    renderAttendance();
  });
}

if (rosterGenderFilter) {
  rosterGenderFilter.addEventListener('change', function (e) {
    attendanceState.genderFilter = e.target.value;
    attendanceState.currentPage = 1;
    renderAttendance();
  })

}

if (pageSizeSelect) {
  pageSizeSelect.addEventListener('change', function (e) {
    attendanceState.pageSize = Number(e.target.value);
    attendanceState.currentPage = 1;
    renderAttendance();
  });
}

// 12. Event Delegation for Table Roster Actions
if (rosterTableBody) {
  rosterTableBody.addEventListener('click', function (e) {
    const row = e.target.closest('tr');
    if (!row) return;

    const studentId = Number(row.dataset.studentId);
    if (!studentId) return;

    // Check action
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
      const student = students.find(function (s) {
        return s.id === studentId;
      });
      if (student) {
        openModal(student);
      }
    }
  });
}

// 13. Pagination Event Listeners
if (prevPageBtn) {
  prevPageBtn.addEventListener('click', function () {
    if (attendanceState.currentPage > 1) {
      attendanceState.currentPage -= 1;
      renderAttendance();
    }
  });
}

if (nextPageBtn) {
  nextPageBtn.addEventListener('click', function () {
    const filteredCount = filterStudents().length;
    const totalPages = Math.ceil(filteredCount / attendanceState.pageSize);
    if (attendanceState.currentPage < totalPages) {
      attendanceState.currentPage += 1;
      renderAttendance();
    }
  });
}

if (pageNumbersWrap) {
  pageNumbersWrap.addEventListener('click', function (e) {
    const btn = e.target.closest('.page-num-btn');
    if (!btn) return;
    const pageNum = Number(btn.dataset.page);
    if (pageNum && pageNum !== attendanceState.currentPage) {
      attendanceState.currentPage = pageNum;
      renderAttendance();
    }
  });
}

// 14. Bulk Actions Event Listeners
if (markAllPresentBtn) {
  markAllPresentBtn.addEventListener('click', markAllVisiblePresent);
}

if (resetAttendanceBtn) {
  resetAttendanceBtn.addEventListener('click', resetAllVisibleAttendance);
}

// Initial render on load
renderAttendance();

// ===========================================
// CONTACT FORM SUBMISSION
// ===========================================
const contactForm = document.querySelector('#contactForm');
const formFeedback = document.querySelector('#formFeedback');

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fullNameInput = document.querySelector('#fullName');
    const name = fullNameInput ? fullNameInput.value : 'there';

    formFeedback.textContent = `Thank you, ${name}! Your message has been sent to administration.`;
    contactForm.reset();

    setTimeout(function () {
      formFeedback.textContent = '';
    }, 5000);
  });
}

// ===========================================
// PRACTICE EXERCISES & HELPER FUNCTIONS
// ===========================================

const student = {
  name: 'Ama',
  age: 15,

  introduce() {
    console.log(`My name is ${this.name} and I am ${this.age} years old.`);
  },
};
student.introduce();

// Filter Form 3 candidates using a named function
function isForm3Candidate(student) {
  return student.class === 'Form 3';
}
const form3Candidates = students.filter(isForm3Candidate);

// Fee currency conversion helpers
function toPesewas(cedis) {
  return cedis * 100;
}

const schoolFees = 357878;
function toCedis(pesewas) {
  return pesewas / 100;
}

console.log('School Fees in GHS:', toCedis(schoolFees));

const now = new Date();
console.log(now);

const ms = now.getTime();
console.log(ms);

let name = 'Kweku';
console.log(name.length);
const upperName = name.toUpperCase();
console.log(upperName);

const sentence = `Sir Augistine book's`;
console.log(sentence);

const yearDate = new Date();
console.log(yearDate.getFullYear());

const price = 2000;
console.log(`The school fee is GHS ${price}`);

const message = `Hello
World`;

console.log(message);

console.log(window);

// function studentFullName(student) {
//   return student.name;
// }

// const studentNames = students.map(studentFullName);

// console.log(studentNames);
// function Splitname(student) {
//   return student.split(' ');
// }
// const stringName = studentNames.map(Splitname);
// console.log(stringName);

// function initialName(studentName) {
//   return studentName[0][0] + studentName[1][0];
// }

// const initials = stringName.map(initialName);
// console.log(initials);

// function studentName(student) {
//   return student.name;
// }

// const studentsName = students.map(studentName);
// console.log(studentsName);

// function splitName(studentname) {
//   return studentname.split(' ');
// }

// const SplitNames = studentsName.map(splitName);
// console.log(SplitNames);

// function initialName(studentInitial) {
//   return studentInitial[0][0] + studentInitial[1][0];
// }

// const initialNames = SplitNames.map(initialName);
// console.log(initialNames);

// function initialName(studentName) {
//   const names = studentName.name.split(' ');
//   return names[0][0] + names[1][0];
// }

// const initialNames = students.map(initialName);

// console.log(initialName);

const today = new Date();
console.log(today);

console.log(new Intl.DateTimeFormat(['en', 'gh']).format(today));
console.log(new Intl.DateTimeFormat(['fr', 'fr']).format(today));

function displayTime() {
  const today = new Date();

  console.log(
    new Intl.DateTimeFormat('gh-GH', {
      // dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Africa/Accra',
    }).format(today),
  );
}

displayTime;

const pupils = [
  { name: 'John', id: 1 },
  { name: 'Mary', id: 2 },
  { name: 'David', id: 3 },
];

// const studentId = pupils.map((student) => student.id);
// console.log(studentId);

// const convertStudentIdToString = studentId.map((student) =>
//   student.toString().padStart(4, '0'),
// );
// console.log(convertStudentIdToString);

const id = '7';
console.log(id.padEnd(4, 's'));

// ===========================================
// STUDENT REGISTRATION FORM HANDLER
// ===========================================

const studentRegistrationForm = document.getElementById('studentRegistrationForm');
const studentFormFeedback = document.getElementById('studentFormFeedback');

if (studentRegistrationForm) {
  const dobInput = document.getElementById('studentDob');
  if (dobInput) {
    dobInput.setAttribute('max', new Date().toISOString().split('T')[0]);
  }

  const nameInput = document.getElementById('studentName');
  const errorName = document.getElementById('errorStudentName');
  const genderSelect = document.getElementById('studentGender');
  const errorGender = document.getElementById('errorStudentGender');
  const errorDob = document.getElementById('errorStudentDob');
  const emailInput = document.getElementById('studentEmail');
  const errorEmail = document.getElementById('errorStudentEmail');
  const phoneInput = document.getElementById('studentPhone');
  const errorPhone = document.getElementById('errorStudentPhone');
  const classSelect = document.getElementById('studentClass');
  const errorClass = document.getElementById('errorStudentClass');
  const yearInput = document.getElementById('yearOfEnrollment');
  const errorYear = document.getElementById('errorYearOfEnrollment');
  const subjectsContainer = studentRegistrationForm.querySelector('.checkbox-group');
  const errorSubjects = document.getElementById('errorSubjects');
  const feesSelect = document.getElementById('feesStatus');
  const errorFees = document.getElementById('errorFeesStatus');
  const guardianNameInput = document.getElementById('guardianName');
  const errorGuardianName = document.getElementById('errorGuardianName');
  const guardianRelationSelect = document.getElementById('guardianRelation');
  const errorGuardianRelation = document.getElementById('errorGuardianRelation');
  const guardianPhoneInput = document.getElementById('guardianPhone');
  const errorGuardianPhone = document.getElementById('errorGuardianPhone');

  function setFieldError(inputEl, errorEl, message) {
    if (message) {
      if (inputEl) {
        inputEl.classList.add('is-invalid');
        inputEl.classList.remove('is-valid');
      }
      if (errorEl) {
        errorEl.textContent = '⚠️ ' + message;
        errorEl.classList.add('visible');
      }
      return false;
    } else {
      if (inputEl) {
        inputEl.classList.remove('is-invalid');
        inputEl.classList.add('is-valid');
      }
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      return true;
    }
  }

  function validateStudentName() {
    const val = nameInput ? nameInput.value.trim() : '';
    return setFieldError(nameInput, errorName, !val ? 'Please enter the student\'s full legal name (e.g. Ama Mensah).' : '');
  }

  function validateStudentGender() {
    const val = genderSelect ? genderSelect.value : '';
    return setFieldError(genderSelect, errorGender, !val ? 'Please choose a gender option from the dropdown list.' : '');
  }

  function validateStudentDob() {
    const val = dobInput ? dobInput.value : '';
    if (!val) return setFieldError(dobInput, errorDob, 'Please select or enter the student\'s date of birth (YYYY-MM-DD).');
    const d = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(d.getTime()) || d >= today) return setFieldError(dobInput, errorDob, 'Please choose a past date. Date of birth cannot be today or in the future.');
    return setFieldError(dobInput, errorDob, '');
  }

  function validateStudentEmail() {
    const val = emailInput ? emailInput.value.trim() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val || !emailPattern.test(val)) return setFieldError(emailInput, errorEmail, 'Please enter a valid email address with "@" and domain (e.g. name@school.edu).');
    return setFieldError(emailInput, errorEmail, '');
  }

  function validateStudentPhone() {
    const val = phoneInput ? phoneInput.value.trim() : '';
    return setFieldError(phoneInput, errorPhone, !val ? 'Please enter an active contact phone number (e.g. +233 24 123 4567).' : '');
  }

  function validateStudentClass() {
    const val = classSelect ? classSelect.value : '';
    return setFieldError(classSelect, errorClass, !val ? 'Please select an assigned class level (Form 1, Form 2, or Form 3).' : '');
  }

  function validateYearOfEnrollment() {
    const val = Number(yearInput ? yearInput.value : 0);
    if (!val || isNaN(val) || val < 2020 || val > 2030) return setFieldError(yearInput, errorYear, 'Please enter a 4-digit enrollment year between 2020 and 2030.');
    return setFieldError(yearInput, errorYear, '');
  }

  function validateSubjects() {
    const checked = studentRegistrationForm.querySelectorAll('input[name="subjects"]:checked');
    return setFieldError(subjectsContainer, errorSubjects, checked.length === 0 ? 'Please check at least one enrolled subject checkbox above.' : '');
  }

  function validateFeesStatus() {
    const val = feesSelect ? feesSelect.value : '';
    return setFieldError(feesSelect, errorFees, !val ? 'Please choose the initial fee status (Paid, Pending, Unpaid, or Partial).' : '');
  }

  function validateGuardianName() {
    const val = guardianNameInput ? guardianNameInput.value.trim() : '';
    return setFieldError(guardianNameInput, errorGuardianName, !val ? 'Please enter the primary guardian\'s full name (e.g. Mr. Kofi Mensah).' : '');
  }

  function validateGuardianRelation() {
    const val = guardianRelationSelect ? guardianRelationSelect.value : '';
    return setFieldError(guardianRelationSelect, errorGuardianRelation, !val ? 'Please select the guardian\'s relationship (e.g. Father, Mother, Guardian).' : '');
  }

  function validateGuardianPhone() {
    const val = guardianPhoneInput ? guardianPhoneInput.value.trim() : '';
    return setFieldError(guardianPhoneInput, errorGuardianPhone, !val ? 'Please enter an emergency contact phone number for the guardian.' : '');
  }

  nameInput?.addEventListener('blur', validateStudentName);
  nameInput?.addEventListener('input', () => { if (nameInput.classList.contains('is-invalid') || nameInput.classList.contains('is-valid')) validateStudentName(); });
  genderSelect?.addEventListener('blur', validateStudentGender);
  genderSelect?.addEventListener('change', validateStudentGender);
  dobInput?.addEventListener('blur', validateStudentDob);
  dobInput?.addEventListener('change', validateStudentDob);
  emailInput?.addEventListener('blur', validateStudentEmail);
  emailInput?.addEventListener('input', () => { if (emailInput.classList.contains('is-invalid') || emailInput.classList.contains('is-valid')) validateStudentEmail(); });
  phoneInput?.addEventListener('blur', validateStudentPhone);
  phoneInput?.addEventListener('input', () => { if (phoneInput.classList.contains('is-invalid') || phoneInput.classList.contains('is-valid')) validateStudentPhone(); });
  classSelect?.addEventListener('blur', validateStudentClass);
  classSelect?.addEventListener('change', validateStudentClass);
  yearInput?.addEventListener('blur', validateYearOfEnrollment);
  yearInput?.addEventListener('input', () => { if (yearInput.classList.contains('is-invalid') || yearInput.classList.contains('is-valid')) validateYearOfEnrollment(); });

  const subjectCheckboxes = studentRegistrationForm.querySelectorAll('input[name="subjects"]');
  subjectCheckboxes.forEach((cb) => { cb.addEventListener('change', validateSubjects); });

  feesSelect?.addEventListener('blur', validateFeesStatus);
  feesSelect?.addEventListener('change', validateFeesStatus);

  guardianNameInput?.addEventListener('blur', validateGuardianName);
  guardianNameInput?.addEventListener('input', () => { if (guardianNameInput.classList.contains('is-invalid') || guardianNameInput.classList.contains('is-valid')) validateGuardianName(); });
  guardianRelationSelect?.addEventListener('blur', validateGuardianRelation);
  guardianRelationSelect?.addEventListener('change', validateGuardianRelation);
  guardianPhoneInput?.addEventListener('blur', validateGuardianPhone);
  guardianPhoneInput?.addEventListener('input', () => { if (guardianPhoneInput.classList.contains('is-invalid') || guardianPhoneInput.classList.contains('is-valid')) validateGuardianPhone(); });

  studentRegistrationForm.addEventListener('reset', function () {
    const validatedInputs = studentRegistrationForm.querySelectorAll('.is-invalid, .is-valid');
    validatedInputs.forEach(el => {
      el.classList.remove('is-invalid');
      el.classList.remove('is-valid');
    });
    const errorSpans = studentRegistrationForm.querySelectorAll('.field-error');
    errorSpans.forEach(span => { span.textContent = ''; span.classList.remove('visible'); });
    if (studentFormFeedback) studentFormFeedback.textContent = '';
  });

  studentRegistrationForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const isNameValid = validateStudentName();
    const isGenderValid = validateStudentGender();
    const isDobValid = validateStudentDob();
    const isEmailValid = validateStudentEmail();
    const isPhoneValid = validateStudentPhone();
    const isClassValid = validateStudentClass();
    const isYearValid = validateYearOfEnrollment();
    const isSubjectsValid = validateSubjects();
    const isFeesValid = validateFeesStatus();
    const isGuardianNameValid = validateGuardianName();
    const isGuardianRelationValid = validateGuardianRelation();
    const isGuardianPhoneValid = validateGuardianPhone();

    const isFormValid = isNameValid && isGenderValid && isDobValid && isEmailValid && isPhoneValid && isClassValid && isYearValid && isSubjectsValid && isFeesValid && isGuardianNameValid && isGuardianRelationValid && isGuardianPhoneValid;

    if (!isFormValid) {
      const firstInvalid = studentRegistrationForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = nameInput ? nameInput.value.trim() : '';
    const gender = genderSelect ? genderSelect.value : '';
    const studentClass = classSelect ? classSelect.value : '';
    const yearOfEnrollment = Number(yearInput ? yearInput.value : 2024);
    const dateOfBirth = dobInput ? dobInput.value : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const feesStatus = feesSelect ? feesSelect.value : 'Pending';
    const attendance = 100;
    const dailyStatus = 'Unmarked';
    const dailyTimestamp = '--';
    const guardianName = guardianNameInput ? guardianNameInput.value.trim() : '';
    const guardianRelation = guardianRelationSelect ? guardianRelationSelect.value : 'Guardian';
    const guardianPhone = guardianPhoneInput ? guardianPhoneInput.value.trim() : '';

    const checkedBoxes = studentRegistrationForm.querySelectorAll('input[name="subjects"]:checked');
    const selectedSubjects = Array.from(checkedBoxes).map(function (cb) { return cb.value; });

    const payload = {
      name: name,
      gender: gender,
      class: studentClass,
      yearOfEnrollment: yearOfEnrollment,
      dateOfBirth: dateOfBirth,
      email: email,
      phone: phone,
      subjects: selectedSubjects,
      gpa: 0.0,
      attendance: attendance,
      dailyAttendance: {
        status: dailyStatus,
        timestamp: dailyTimestamp,
      },
      feesStatus: feesStatus,
      guardian: {
        name: guardianName,
        relation: guardianRelation,
        phone: guardianPhone,
      },
    };

    let newStudent;
    try {
      const resp = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        newStudent = await resp.json();
      } else {
        throw new Error('Server returned ' + resp.status);
      }
    } catch (err) {
      const nextId = students.length > 0 ? Math.max.apply(null, students.map(function (s) { return s.id; })) + 1 : 1;
      newStudent = Object.assign({ id: nextId }, payload);
    }

    if (!newStudent.subjects) newStudent.subjects = selectedSubjects;
    students.push(newStudent);
    console.log('✅ Registered New Student in Database & UI:', newStudent);

    const totalStudentsCount = document.querySelector('#totalStudentsCount');
    if (totalStudentsCount) totalStudentsCount.textContent = students.length;
    const dashTotalStudents = document.querySelector('#dashTotalStudents');
    if (dashTotalStudents) dashTotalStudents.textContent = students.length;

    if (studentFormFeedback) {
      studentFormFeedback.textContent = `✅ Successfully registered ${newStudent.name} (#EDU-${newStudent.id.toString().padStart(4, '0')}) into Database!`;
      studentFormFeedback.style.color = 'hsl(158, 70%, 30%)';
    }

    studentRegistrationForm.reset();
  });
}



