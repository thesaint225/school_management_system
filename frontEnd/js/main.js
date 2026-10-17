import { students } from './data/studentsData.js';
import { fetchStudentsFromDb } from './api/studentApi.js';
import { teachers } from './data/teachersData.js';
import { fetchTeachersFromDb } from './api/teacherApi.js';
import { academicTerms, calendarItems, updateCalendarItems, updateAcademicTerms } from './data/calendarData.js';
import { fetchCalendarEventsFromDb, fetchAcademicTermsFromDb } from './api/calendarApi.js';
import {
  formatSchoolTime,
  formatTermRange,
  formatAgendaDate,
  toISODateString,
} from './utils/dateUtils.js';
import { initTopAchievers } from './modules/students/topAchievers.js';
import {
  initStudentModal,
  openStudentModal,
} from './modules/students/studentModal.js';
import { initStudentRoster } from './modules/students/studentRoster.js';
import { calculateAttendanceRate } from './modules/attendance/attendanceAnalytics.js';
import { initAttendanceRoster } from './modules/attendance/attendanceRoster.js';
import { initCalendarModule, refreshCalendarViews } from './modules/calendar/calendarModule.js';
import { initStudentForm } from './modules/students/studentForm.js';
import { initTeacherModal, openTeacherModal } from './modules/teachers/teacherModal.js';
import { initTeacherRoster } from './modules/teachers/teacherRoster.js';
import { initTeacherForm } from './modules/teachers/teacherForm.js';
import { fetchSubjectsFromDb } from './api/subjectApi.js';
import { initSubjectModal, openSubjectModal } from './modules/subjects/subjectModal.js';
import { initSubjectRoster } from './modules/subjects/subjectRoster.js';
import { initSubjectForm } from './modules/subjects/subjectForm.js';
import { invalidateSubjectCache } from './modules/subjects/subjectUtils.js';
import { fetchClassesFromDb } from './api/classApi.js';
import { initClassModal, openClassModal } from './modules/classes/classModal.js';
import { initClassRoster } from './modules/classes/classRoster.js';
import { initClassForm } from './modules/classes/classForm.js';
import { invalidateClassCache } from './modules/classes/classUtils.js';
import { initResultsModule } from './modules/results/resultsMain.js';

// 1. Live School Clock (Accra GMT)
const liveTime = document.querySelector('#liveTime');

function updateLiveClock() {
  if (liveTime) {
    liveTime.textContent = formatSchoolTime(new Date());
  }
}
updateLiveClock();
setInterval(updateLiveClock, 1000);

// 2. Populate Dashboard Overview Dynamic Statistics from `students` Array
export function renderDashboardOverview() {
  // A. Total Students & Unique Classes
  const dashTotalStudents = document.querySelector('#dashTotalStudents');
  const dashClassesCount = document.querySelector('#dashClassesCount');
  if (dashTotalStudents) {
    dashTotalStudents.textContent = students.length;
  }
  if (dashClassesCount) {
    const uniqueClasses = new Set(students.map((s) => s.class));
    dashClassesCount.textContent = `Enrolled across ${uniqueClasses.size} classes`;
  }

  // B. Attendance Analytics
  const stats = calculateAttendanceRate(students);
  const dashAttendanceRate = document.querySelector('#dashAttendanceRate');
  const dashCirclePct = document.querySelector('#dashCirclePct');
  const dashAttendanceCircle = document.querySelector('#dashAttendanceCircle');
  const dashPresentCount = document.querySelector('#dashPresentCount');
  const dashPresentPct = document.querySelector('#dashPresentPct');
  const dashLateCount = document.querySelector('#dashLateCount');
  const dashLatePct = document.querySelector('#dashLatePct');
  const dashAbsentCount = document.querySelector('#dashAbsentCount');
  const dashAbsentPct = document.querySelector('#dashAbsentPct');

  if (dashAttendanceRate) dashAttendanceRate.textContent = `${stats.rate}%`;
  if (dashCirclePct) dashCirclePct.textContent = `${stats.rate}%`;
  if (dashAttendanceCircle) {
    dashAttendanceCircle.style.background = `conic-gradient(var(--primary-600) 0% ${stats.rate}%, hsla(217, 30%, 80%, 0.25) ${stats.rate}% 100%)`;
  }
  if (dashPresentCount) dashPresentCount.textContent = stats.present;
  if (dashPresentPct) dashPresentPct.textContent = `${stats.presentPct}%`;
  if (dashLateCount) dashLateCount.textContent = stats.late;
  if (dashLatePct) dashLatePct.textContent = `${stats.latePct}%`;
  if (dashAbsentCount) dashAbsentCount.textContent = stats.absent;
  if (dashAbsentPct) dashAbsentPct.textContent = `${stats.absentPct}%`;

  // C. Top Achievers (Students with GPA >= 3.7)
  const dashAchieversCount = document.querySelector('#dashAchieversCount');
  if (dashAchieversCount) {
    const highAchievers = students.filter((s) => s.gpa >= 3.7);
    dashAchieversCount.textContent = highAchievers.length;
  }

  // D. Academic Term Stat Card
  const dashTermName = document.querySelector('#dashTermName');
  const dashTermRange = document.querySelector('#dashTermRange');
  const activeTerm =
    academicTerms.find((t) => t.status === 'Active') || academicTerms[0];
  if (dashTermName && activeTerm) {
    dashTermName.textContent = activeTerm.name.split(' (')[0];
  }
  if (dashTermRange && activeTerm) {
    dashTermRange.textContent = formatTermRange(
      activeTerm.startDate,
      activeTerm.endDate,
    );
  }

  // E. Dashboard Upcoming Highlights List
  const dashUpcomingList = document.querySelector('#dashUpcomingList');
  if (dashUpcomingList) {
    const now = new Date();
    const todayISO = toISODateString(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const upcoming = calendarItems
      .filter((item) => item.date >= todayISO)
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, 3);

    if (upcoming.length === 0) {
      dashUpcomingList.innerHTML = `<p class="cal-empty-desc">No more upcoming scheduled items this term.</p>`;
    } else {
      dashUpcomingList.innerHTML = upcoming
        .map((item) => {
          const [year, month, day] = item.date.split('-');
          const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' })
            .format(new Date(Number(year), Number(month) - 1, Number(day)))
            .toUpperCase();
          return `
            <div class="upcoming-item" data-date="${item.date}">
              <div class="event-date">
                <strong>${Number(day)}</strong>
                <span>${monthName}</span>
              </div>
              <div class="event-info">
                <strong>${item.title}</strong>
                <span>${item.location} • ${item.time}</span>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }
}

// 3. Initialize Student Modal Controls
const handleStudentModalChange = (student, action) => {
  if (action === 'delete' && student) {
    const idx = students.findIndex((s) => s.id === student.id);
    if (idx !== -1) {
      students.splice(idx, 1);
    }
  }
  refreshAllStudentViews();
};

initStudentModal(handleStudentModalChange);

// 4. Helper to Refresh All Connected Views
export function refreshAllStudentViews() {
  renderDashboardOverview();
  initTopAchievers(students, (s) => openStudentModal(s, 'view', handleStudentModalChange));
  initStudentRoster(students, (s, action) => openStudentModal(s, action || 'view', handleStudentModalChange));
  initAttendanceRoster(students, (s) => {
    openStudentModal(s, 'view', handleStudentModalChange);
    renderDashboardOverview();
  });
}

// 5. Initialize Academic Calendar Module (Option B Grid + Sidebar)
initCalendarModule();

// 6. Initialize Student Registration Form (Persists directly to Spring Boot & Database)
initStudentForm(students, () => {
  refreshAllStudentViews();
});

// 7. Initialize Teacher Management & Roster
let teacherRosterController = null;

const handleTeacherModalChange = (teacher, action) => {
  if (action === 'delete' && teacher) {
    const idx = teachers.findIndex((t) => t.id === teacher.id);
    if (idx !== -1) {
      teachers.splice(idx, 1);
    }
  }
  refreshAllTeacherViews();
};

initTeacherModal(handleTeacherModalChange);

export function refreshAllTeacherViews() {
  if (teacherRosterController) {
    teacherRosterController.refresh();
  } else {
    teacherRosterController = initTeacherRoster(teachers, (t, action) => {
      openTeacherModal(t, action || 'view', handleTeacherModalChange);
    });
  }
}

initTeacherForm(teachers, () => {
  refreshAllTeacherViews();
});

// 8. Initialize Subject & Course Management
const subjects = [];
let subjectRosterController = null;

const handleSubjectModalChange = (subject, action) => {
  if (action === 'delete' && subject) {
    const idx = subjects.findIndex((s) => s.id === subject.id);
    if (idx !== -1) {
      subjects.splice(idx, 1);
    }
  }
  invalidateSubjectCache();
  refreshAllSubjectViews();
};

initSubjectModal(handleSubjectModalChange);

export function refreshAllSubjectViews() {
  if (subjectRosterController) {
    subjectRosterController.refresh();
  } else {
    subjectRosterController = initSubjectRoster(subjects, (sub, action) => {
      openSubjectModal(sub, action || 'view', handleSubjectModalChange);
    });
  }
}

initSubjectForm(subjects, () => {
  invalidateSubjectCache();
  refreshAllSubjectViews();
});

// 9. Initialize Class & Roster Management
const classes = [];
let classRosterController = null;

const handleClassModalChange = async (cls, action) => {
  if (action === 'delete' && cls) {
    const idx = classes.findIndex((c) => c.id === cls.id);
    if (idx !== -1) {
      classes.splice(idx, 1);
    }
  }
  invalidateClassCache();
  await syncClassesFromDatabase();
  // Also resync students as classes or assignments may have changed
  await syncStudentsFromDatabase();
};

initClassModal(handleClassModalChange);

export function refreshAllClassViews() {
  if (classRosterController) {
    classRosterController.refresh();
  } else {
    classRosterController = initClassRoster(classes, (cls, action) => {
      openClassModal(cls, action || 'view', handleClassModalChange);
    });
  }
}

initClassForm(classes, () => {
  invalidateClassCache();
  syncClassesFromDatabase();
});

// 10. Initialize Results & Report Cards Module
initResultsModule();

async function syncClassesFromDatabase() {
  const dbClasses = await fetchClassesFromDb();
  if (dbClasses && Array.isArray(dbClasses)) {
    classes.length = 0;
    classes.push(...dbClasses);
  }
  refreshAllClassViews();
}

async function syncStudentsFromDatabase() {
  const dbStudents = await fetchStudentsFromDb();
  if (dbStudents && Array.isArray(dbStudents) && dbStudents.length > 0) {
    students.length = 0;
    students.push(...dbStudents);
  }
  refreshAllStudentViews();
}

// 10. Initial Bootstrap: Load live records from Database API (with graceful fallback)
async function bootstrapDataFromDatabase() {
  // A. Subjects
  const dbSubjects = await fetchSubjectsFromDb();
  if (dbSubjects && Array.isArray(dbSubjects) && dbSubjects.length > 0) {
    subjects.length = 0;
    subjects.push(...dbSubjects);
    console.log(`🚀 Subjects Directory successfully synced with ${subjects.length} courses from database.`);
  }
  refreshAllSubjectViews();

  // B. Classes
  await syncClassesFromDatabase();
  console.log(`🚀 Classes Directory successfully synced with ${classes.length} classes from database.`);

  // C. Students
  await syncStudentsFromDatabase();
  console.log(`🚀 Dashboard successfully synced with ${students.length} students from database.`);

  // D. Teachers
  const dbTeachers = await fetchTeachersFromDb();
  if (dbTeachers && Array.isArray(dbTeachers) && dbTeachers.length > 0) {
    teachers.length = 0;
    teachers.push(...dbTeachers);
    console.log(`🚀 Teacher Directory successfully synced with ${teachers.length} teachers from database.`);
  }
  refreshAllTeacherViews();

  // E. Results & Academic Reports
  await initResultsModule();
  console.log('🚀 Results & Report Cards module initialized.');

  // F. Academic Terms & Calendar Events
  const dbTerms = await fetchAcademicTermsFromDb();
  if (dbTerms && Array.isArray(dbTerms) && dbTerms.length > 0) {
    updateAcademicTerms(dbTerms);
    console.log(`🚀 Academic Terms successfully synced with ${academicTerms.length} terms from database.`);
  }

  const dbEvents = await fetchCalendarEventsFromDb();
  if (dbEvents && Array.isArray(dbEvents) && dbEvents.length > 0) {
    updateCalendarItems(dbEvents);
    console.log(`🚀 Academic Calendar successfully synced with ${calendarItems.length} events from database.`);
  }

  // Refresh dashboard and calendar views with synced database records
  initDashboard();
  refreshCalendarViews();
}

bootstrapDataFromDatabase();

// 10. Navigation & Section Jump Controller
const navButtons = document.querySelectorAll('.main-nav .nav-btn');
const statCardAcademicTerm = document.querySelector('#statCardAcademicTerm');

function focusSection(targetSectionId, activeNavName) {
  const targetSection = document.querySelector(targetSectionId);
  if (!targetSection) return;

  // Update active nav button
  navButtons.forEach((btn) => {
    const isTarget = btn.dataset.nav === activeNavName;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-current', isTarget ? 'page' : 'false');
  });

  // Smooth scroll and pulse highlight
  targetSection.scrollIntoView({ behavior: 'smooth' });
  const card =
    targetSection.querySelector(
      '.calendar-card, .attendance-card, .achievers-card, .stat-card, form, .section-header',
    ) || targetSection;

  card.classList.remove('section-focus-pulse');
  void card.offsetWidth; // Reflow
  card.classList.add('section-focus-pulse');

  setTimeout(() => {
    card.classList.remove('section-focus-pulse');
  }, 1500);
}

// Nav bar links click handler
navButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const targetId = btn.getAttribute('href');
    const navName = btn.dataset.nav;
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      focusSection(targetId, navName);
    }
  });
});

// Clickable Academic Term stat card -> jumps to Calendar
if (statCardAcademicTerm) {
  statCardAcademicTerm.addEventListener('click', () => {
    focusSection('#calendarSection', 'calendar');
  });

  statCardAcademicTerm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      focusSection('#calendarSection', 'calendar');
    }
  });
}

// 10. Contact Form Handler
const contactForm = document.querySelector('#contactForm');
const formFeedback = document.querySelector('#formFeedback');

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullNameInput = document.querySelector('#fullName');
    const name = fullNameInput ? fullNameInput.value : 'there';

    formFeedback.textContent = `Thank you, ${name}! Your message has been sent to administration.`;
    contactForm.reset();

    setTimeout(() => {
      formFeedback.textContent = '';
    }, 5000);
  });
}

console.log('🎓 EduManage SMS dynamic dashboard connected to student data.');

const id = '7';

console.log(id.padEnd(4, 's'));

const result = 'hello'.repeat(5);
console.log(result);

const a = 5;
const b = '4';

console.log(a == b);
console.log(a === b);

const list = [1, 1, 2, 2, 3, 3];
const listNumber = new Set(list);
console.log(listNumber);

if ('student') {
  console.log('true');
} else {
  console.log('false');
}

console.log('Ama' && 'Mensah');

if ([]) {
  console.log('this is an empty array');
}

let age = null;

age = 33;
if (age > 18) {
  console.log('you are mature');
} else {
  console.log('you are still an aldo');
}
