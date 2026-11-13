import { DateUtils } from './utils/dateUtils.js';
import { Student } from './modules/students/index.js';
import { Teacher } from './modules/teachers/index.js';
import { ClassRoom } from './modules/classes/index.js';
import { Subject } from './modules/subjects/index.js';
import { Attendance } from './modules/attendance/index.js';
import { Calendar } from './modules/calendar/index.js';
import { Results } from './modules/results/index.js';

// 1. Live School Clock (Accra GMT)
const liveTime = document.querySelector('#liveTime');

function updateLiveClock() {
  if (liveTime) {
    liveTime.textContent = DateUtils.formatSchoolTime(new Date());
  }
}
updateLiveClock();
setInterval(updateLiveClock, 1000);

// 2. Populate Dashboard Overview Dynamic Statistics from `Student` & `Calendar` Domains
export function renderDashboardOverview() {
  const currentStudents = Student.getAll();

  // A. Total Students & Unique Classes
  const dashTotalStudents = document.querySelector('#dashTotalStudents');
  const dashClassesCount = document.querySelector('#dashClassesCount');
  if (dashTotalStudents) {
    dashTotalStudents.textContent = currentStudents.length;
  }
  if (dashClassesCount) {
    const uniqueClasses = new Set(currentStudents.map((s) => s.class));
    dashClassesCount.textContent = `Enrolled across ${uniqueClasses.size} classes`;
  }

  // B. Attendance Analytics
  const stats = Attendance.calculateRate(currentStudents);
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
    const highAchievers = currentStudents.filter((s) => s.gpa >= 3.7);
    dashAchieversCount.textContent = highAchievers.length;
  }

  // D. Academic Term Stat Card
  const dashTermName = document.querySelector('#dashTermName');
  const dashTermRange = document.querySelector('#dashTermRange');
  const terms = Calendar.getTerms();
  const activeTerm = terms.find((t) => t.status === 'Active') || terms[0];
  if (dashTermName && activeTerm) {
    dashTermName.textContent = activeTerm.name.split(' (')[0];
  }
  if (dashTermRange && activeTerm) {
    dashTermRange.textContent = DateUtils.formatTermRange(
      activeTerm.startDate,
      activeTerm.endDate,
    );
  }

  // E. Dashboard Upcoming Highlights List
  const dashUpcomingList = document.querySelector('#dashUpcomingList');
  if (dashUpcomingList) {
    const now = new Date();
    const todayISO = DateUtils.toISODateString(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const upcoming = Calendar.getItems()
      .filter((item) => item.date >= todayISO)
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, 3);

    dashUpcomingList.replaceChildren();

    if (upcoming.length === 0) {
      const emptyP = document.createElement('p');
      emptyP.className = 'cal-empty-desc';
      emptyP.textContent = 'No more upcoming scheduled items this term.';
      dashUpcomingList.appendChild(emptyP);
    } else {
      upcoming.forEach((item) => {
        const [year, month, day] = item.date.split('-');
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' })
          .format(new Date(Number(year), Number(month) - 1, Number(day)))
          .toUpperCase();

        const itemDiv = document.createElement('div');
        itemDiv.className = 'upcoming-item';
        itemDiv.dataset.date = item.date;

        const dateDiv = document.createElement('div');
        dateDiv.className = 'event-date';
        const dayStrong = document.createElement('strong');
        dayStrong.textContent = String(Number(day));
        const monthSpan = document.createElement('span');
        monthSpan.textContent = monthName;
        dateDiv.append(dayStrong, monthSpan);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'event-info';
        const titleStrong = document.createElement('strong');
        titleStrong.textContent = item.title;
        const metaSpan = document.createElement('span');
        metaSpan.textContent = `${item.location} • ${item.time}`;
        infoDiv.append(titleStrong, metaSpan);

        itemDiv.append(dateDiv, infoDiv);
        dashUpcomingList.appendChild(itemDiv);
      });
    }
  }
}

// 3. Initialize Student Modal Controls
const handleStudentModalChange = (student, action) => {
  if (action === 'delete' && student) {
    Student.removeById(student.id);
  }
  refreshAllStudentViews();
};

Student.initModal(handleStudentModalChange);

// 4. Helper to Refresh All Connected Views
export function refreshAllStudentViews() {
  const currentStudents = Student.getAll();
  renderDashboardOverview();
  Student.initTopAchievers(currentStudents, (s) => Student.openModal(s, 'view', handleStudentModalChange));
  Student.initRoster(currentStudents, (s, action) => Student.openModal(s, action || 'view', handleStudentModalChange));
  Attendance.initRoster(currentStudents, (s) => {
    Student.openModal(s, 'view', handleStudentModalChange);
    renderDashboardOverview();
  });
}

// 5. Initialize Academic Calendar Module (Option B Grid + Sidebar)
Calendar.init();

// 6. Initialize Student Registration Form (Persists directly to Spring Boot & Database)
Student.initForm(() => {
  refreshAllStudentViews();
});

// 7. Initialize Teacher Management & Roster
let teacherRosterController = null;

const handleTeacherModalChange = (teacher, action) => {
  if (action === 'delete' && teacher) {
    Teacher.removeById(teacher.id);
  }
  refreshAllTeacherViews();
};

Teacher.initModal(handleTeacherModalChange);

export function refreshAllTeacherViews() {
  if (teacherRosterController) {
    teacherRosterController.refresh();
  } else {
    teacherRosterController = Teacher.initRoster(Teacher.getAll(), (t, action) => {
      Teacher.openModal(t, action || 'view', handleTeacherModalChange);
    });
  }
}

Teacher.initForm(() => {
  refreshAllTeacherViews();
});

// 8. Initialize Subject & Course Management
let subjectRosterController = null;

const handleSubjectModalChange = (subject, action) => {
  if (action === 'delete' && subject) {
    Subject.removeById(subject.id);
  }
  Subject.invalidateCache();
  refreshAllSubjectViews();
};

Subject.initModal(handleSubjectModalChange);

export function refreshAllSubjectViews() {
  if (subjectRosterController) {
    subjectRosterController.refresh();
  } else {
    subjectRosterController = Subject.initRoster((sub, action) => {
      Subject.openModal(sub, action || 'view', handleSubjectModalChange);
    });
  }
}

Subject.initForm(() => {
  Subject.invalidateCache();
  refreshAllSubjectViews();
});

// 9. Initialize Class & Roster Management
let classRosterController = null;

const handleClassModalChange = async (cls, action) => {
  if (action === 'delete' && cls) {
    ClassRoom.removeById(cls.id);
  }
  ClassRoom.invalidateCache();
  await syncClassesFromDatabase();
  // Also resync students as classes or assignments may have changed
  await syncStudentsFromDatabase();
};

ClassRoom.initModal(handleClassModalChange);

export function refreshAllClassViews() {
  if (classRosterController) {
    classRosterController.refresh();
  } else {
    classRosterController = ClassRoom.initRoster((cls, action) => {
      ClassRoom.openModal(cls, action || 'view', handleClassModalChange);
    });
  }
}

ClassRoom.initForm(() => {
  ClassRoom.invalidateCache();
  syncClassesFromDatabase();
});

// 10. Initialize Results & Report Cards Module
Results.init();

async function syncClassesFromDatabase() {
  const dbClasses = await ClassRoom.fetchAllFromDb();
  if (dbClasses && Array.isArray(dbClasses)) {
    ClassRoom.setAll(dbClasses);
  }
  refreshAllClassViews();
}

async function syncStudentsFromDatabase() {
  const dbStudents = await Student.fetchAllFromDb();
  if (dbStudents && Array.isArray(dbStudents) && dbStudents.length > 0) {
    Student.setAll(dbStudents);
  }
  refreshAllStudentViews();
}

// 11. Initial Bootstrap: Load live records from Database API (with graceful fallback)
async function bootstrapDataFromDatabase() {
  // A. Subjects
  const dbSubjects = await Subject.fetchAllFromDb();
  if (dbSubjects && Array.isArray(dbSubjects) && dbSubjects.length > 0) {
    Subject.setAll(dbSubjects);
    console.log(`🚀 Subjects Directory successfully synced with ${Subject.getAll().length} courses from database.`);
  }
  refreshAllSubjectViews();

  // B. Classes
  await syncClassesFromDatabase();
  console.log(`🚀 Classes Directory successfully synced with ${ClassRoom.getAll().length} classes from database.`);

  // C. Students
  await syncStudentsFromDatabase();
  console.log(`🚀 Dashboard successfully synced with ${Student.getAll().length} students from database.`);

  // D. Teachers
  const dbTeachers = await Teacher.fetchAllFromDb();
  if (dbTeachers && Array.isArray(dbTeachers) && dbTeachers.length > 0) {
    Teacher.setAll(dbTeachers);
    console.log(`🚀 Teacher Directory successfully synced with ${Teacher.getAll().length} teachers from database.`);
  }
  refreshAllTeacherViews();

  // E. Results & Academic Reports
  await Results.init();
  console.log('🚀 Results & Report Cards module initialized.');

  // F. Academic Terms & Calendar Events
  const dbTerms = await Calendar.fetchTermsFromDb();
  if (dbTerms && Array.isArray(dbTerms) && dbTerms.length > 0) {
    Calendar.setTerms(dbTerms);
    console.log(`🚀 Academic Terms successfully synced with ${Calendar.getTerms().length} terms from database.`);
  }

  const dbEvents = await Calendar.fetchEventsFromDb();
  if (dbEvents && Array.isArray(dbEvents) && dbEvents.length > 0) {
    Calendar.setItems(dbEvents);
    console.log(`🚀 Academic Calendar successfully synced with ${Calendar.getItems().length} events from database.`);
  }

  // Refresh dashboard and calendar views with synced database records
  renderDashboardOverview();
  Calendar.refreshViews();
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
