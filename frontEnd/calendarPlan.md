# 📅 EduManage — Calendar & Academic Schedule System
## Modular Architecture & Calendar Implementation Plan (Option B)

Welcome to the **Calendar System Architecture & Modularization Plan** for the **EduManage School Management System**. This document outlines the step-by-step roadmap to first refactor our growing codebase into clean **ES6 Modules**, and then implement an interactive **Monthly Calendar Grid + Agenda Sidebar** (Option B) covering **Academic Terms**, **Events**, **Exams**, **Holidays**, and **Deadlines**.

---

## 📌 1. Executive Summary & Goals

### The Challenges
1. **Monolithic Codebase**: `script.js` has grown past 1,500 lines containing student records, attendance tracking, clock utilities, top achievers, modal logic, and DOM event listeners in a single file.
2. **Missing Central Schedule**: The SMS needs a unified academic timetable so administrators, teachers, and students can track terms, exams, school events, statutory holidays, and fee/submission deadlines in one place.

### The Objectives
1. **Refactor to Native ES6 Modules (`type="module"`)**:
   - Separate concerns cleanly into data, utilities, and focused feature modules.
   - Keep each file small, readable, and easy to maintain.
2. **Build the Option B Calendar Module (Grid + Sidebar)**:
   - **Monthly Calendar Grid**: Dynamic 7x5/6 month view with navigation (Prev / Next Month, "Today" jump), active date indicators, and colored category dots.
   - **Interactive Sidebar / Agenda**: Shows all items scheduled for the selected day or filtered month, with countdowns, badges, and quick details.
   - **5 Core Pillars**:
     - 🎓 **Academic Terms** (Term 1, 2, 3 dates, % progress bar, active term status).
     - 🎉 **School Events** (PTA Meetings, Sports Day, Speech Day, Open House).
     - 📝 **Exams** (Mid-term & Final exam timetables, countdown timer).
     - 🏖️ **Holidays** (Statutory Ghana holidays, mid-term breaks).
     - ⏳ **Deadlines** (Fee payment deadlines, project submissions, report releases).

---

## 🏗️ 2. Phase 1: Clean Modular File Structure (ES6 Modules)

We will organize the application using modern standard JavaScript modules without needing any bundlers or external tools.

```
sms/
├── index.html                  # Main dashboard layout (loads js/main.js as type="module")
├── style.css                   # Global styles + Module-specific CSS tokens
├── plan.md                     # SMS Overview & Date Architecture
├── attendancePlan.md           # Attendance System Architecture
├── calendarPlan.md             # 📅 THIS CALENDAR & MODULARIZATION PLAN
└── js/
    ├── main.js                 # App entry point: initializes all modules & global clocks
    │
    ├── data/
    │   ├── studentsData.js     # Student records (16 students with attendance & bio)
    │   └── calendarData.js     # Academic terms, events, exams, holidays, and deadlines
    │
    ├── utils/
    │   ├── dateUtils.js        # Intl.DateTimeFormat, Africa/Accra timezone helpers, formatters
    │   └── domUtils.js         # Reusable DOM helpers ($ selector, formatters, sanitizers)
    │
    └── modules/
        ├── students/           # 🧑‍🎓 Student Directory & Modal
        │   ├── studentRoster.js
        │   ├── topAchievers.js
        │   └── studentModal.js
        │
        ├── attendance/         # 📋 Attendance & Roll Call
        │   ├── attendanceState.js
        │   ├── attendanceAnalytics.js
        │   └── attendanceRoster.js
        │
        └── calendar/           # 📅 CALENDAR MODULE (Option B)
            ├── calendarState.js    # Selected date, current month/year view, active filter
            ├── calendarGrid.js     # Monthly matrix generation (42-day grid) & event dots
            ├── calendarSidebar.js  # Selected date agenda list & upcoming next widget
            ├── termProgress.js     # Academic term progress calculation (% & days left)
            └── calendarModule.js   # Main Calendar controller uniting grid & sidebar
```

---

## 📅 3. Phase 2: Calendar Module Design (Option B)

### Layout Wireframe (Desktop & Responsive Tablet/Mobile)

```
+---------------------------------------------------------------------------------------------------------+
| 📅 ACADEMIC CALENDAR & SCHEDULE                                  [ Africa/Accra Official Academic Time ]|
+---------------------------------------------------------------------------------------------------------+
| [ Active Term: Term 1 (1 Sept - 18 Dec 2026) • 42% Complete • 56 Days Remaining ]                      |
| [ Progress Bar: =====================---------------------------- ]                                     |
+---------------------------------------------------------------------------------------------------------+
| Category Filter: [ All ] [ 🎓 Terms ] [ 🎉 Events ] [ 📝 Exams ] [ 🏖️ Holidays ] [ ⏳ Deadlines ]      |
+---------------------------------------------------------------------------------------------------------+
|                                                      |                                                  |
| ◀  October 2026  ▶  [ Today ]                        | 📌 Agenda: Wednesday, Oct 14, 2026               |
|------------------------------------------------------|--------------------------------------------------|
| Sun  Mon  Tue  Wed  Thu  Fri  Sat                    | 📝 Mid-Term Mathematics Exam                     |
| 27   28   29   30   1    2    3                      |    Time: 09:00 - 11:30 GMT | Form: Form 1 & 2   |
| 4    5    6    7    8    9    10                     |    Venue: Main Hall                              |
| 11   12   13  [14]  15   16   17   <- (dots: 📝,⏳)  |--------------------------------------------------|
| 18   19   20   21   22   23   24                     | ⏳ Term 1 Fee 2nd Installment Due                |
| 25   26   27   28   29   30   31                     |    Status: Approaching (Due in 3 days)           |
|                                                      |--------------------------------------------------|
|                                                      | ⚡ Upcoming This Month (3 Next Items):           |
| [Legend: 🎓 Term  🎉 Event  📝 Exam  🏖️ Holiday  ⏳ Deadline] | 1. PTA General Meeting (Oct 21)        |
|                                                      | 2. Mid-Term Break Begins (Oct 24)                |
|                                                      | 3. Science Project Submission (Oct 30)           |
+---------------------------------------------------------------------------------------------------------+
```

---

## 🗄️ 4. Data Model Design (`calendarData.js`)

```javascript
export const academicTerms = [
  {
    id: 'term-1-2026',
    name: 'Term 1 (Harmattan Term)',
    academicYear: '2026/2027',
    startDate: '2026-09-01',
    endDate: '2026-12-18',
    status: 'Active', // 'Upcoming' | 'Active' | 'Completed'
    totalWeeks: 15,
  },
  {
    id: 'term-2-2027',
    name: 'Term 2',
    academicYear: '2026/2027',
    startDate: '2027-01-12',
    endDate: '2027-04-16',
    status: 'Upcoming',
    totalWeeks: 14,
  },
  {
    id: 'term-3-2027',
    name: 'Term 3',
    academicYear: '2026/2027',
    startDate: '2027-05-04',
    endDate: '2027-07-23',
    status: 'Upcoming',
    totalWeeks: 12,
  },
];

export const calendarItems = [
  // 1. Academic Terms Milestones
  {
    id: 'cal-001',
    category: 'term',
    title: 'Term 1 Resumption Day',
    date: '2026-09-01',
    time: '08:00 GMT',
    location: 'Campus Wide',
    description: 'First day of academic year 2026/2027 for all students.',
    targetAudience: 'All Students & Staff',
  },
  {
    id: 'cal-002',
    category: 'term',
    title: 'Term 1 Vacation Day',
    date: '2026-12-18',
    time: '12:00 GMT',
    location: 'Assembly Hall',
    description: 'Official closing ceremony and report card distribution.',
    targetAudience: 'All Students',
  },

  // 2. School Events
  {
    id: 'cal-003',
    category: 'event',
    title: 'PTA General Meeting',
    date: '2026-10-21',
    time: '14:00 GMT',
    location: 'School Auditorium',
    description: 'Discussion on academic progress and school infrastructure.',
    targetAudience: 'Parents & Guardians',
  },
  {
    id: 'cal-004',
    category: 'event',
    title: 'Annual Inter-Houses Athletics Competition',
    date: '2026-11-12',
    time: '09:00 GMT',
    location: 'Sports Stadium',
    description: 'Track and field events between Aggrey, Gbewaa, and Tweneboa houses.',
    targetAudience: 'All Students & Parents',
  },

  // 3. Exams
  {
    id: 'cal-005',
    category: 'exam',
    title: 'Mid-Term Assessment: Core Subjects',
    date: '2026-10-14',
    time: '09:00 - 13:00 GMT',
    location: 'Examination Rooms',
    description: 'Mathematics, Integrated Science, and English tests.',
    targetAudience: 'Form 1, 2, 3',
  },
  {
    id: 'cal-006',
    category: 'exam',
    title: 'End of Term 1 Final Examinations',
    date: '2026-12-01',
    time: '08:30 - 15:00 GMT',
    location: 'Examination Halls',
    description: 'Comprehensive examinations covering all term syllabus.',
    targetAudience: 'All Classes',
  },

  // 4. Statutory Holidays & School Breaks
  {
    id: 'cal-007',
    category: 'holiday',
    title: 'Kwame Nkrumah Memorial Day',
    date: '2026-09-21',
    time: 'All Day',
    location: 'National Holiday',
    description: 'Statutory public holiday across Ghana. No academic activities.',
    targetAudience: 'All',
  },
  {
    id: 'cal-008',
    category: 'holiday',
    title: 'Term 1 Mid-Term Break',
    date: '2026-10-24',
    endDate: '2026-10-27',
    time: 'All Day',
    location: 'Break',
    description: 'Four-day mid-term rest period for students and teachers.',
    targetAudience: 'All Students & Teachers',
  },
  {
    id: 'cal-009',
    category: 'holiday',
    title: "National Farmers' Day",
    date: '2026-12-04',
    time: 'All Day',
    location: 'National Holiday',
    description: 'Honoring Ghanaian agricultural workers. School closed.',
    targetAudience: 'All',
  },

  // 5. Deadlines
  {
    id: 'cal-010',
    category: 'deadline',
    title: 'Term 1 School Fees 2nd Installment Deadline',
    date: '2026-10-14',
    time: '17:00 GMT',
    location: 'Accounts Office / Online Portal',
    description: 'Final date to clear 50% tuition fees without late penalty.',
    targetAudience: 'Guardians & Accounts',
  },
  {
    id: 'cal-011',
    category: 'deadline',
    title: 'Form 3 Project Work Submission',
    date: '2026-11-20',
    time: '16:00 GMT',
    location: 'Department Heads',
    description: 'Submission of final year practical projects and art portfolios.',
    targetAudience: 'Form 3 Students',
  }
];
```

---

## ⚙️ 5. Implementation Roadmap & Milestones

### Milestone 1: Modularize the Existing Codebase (No Breaking Changes)
1. Create directory structure: `js/data/`, `js/utils/`, `js/modules/students/`, `js/modules/attendance/`, `js/modules/calendar/`.
2. Extract `studentsData.js` from `script.js`.
3. Extract `dateUtils.js` (`formatSchoolTime`, `formatTermRange`, `Africa/Accra` Intl helpers) and `domUtils.js`.
4. Extract student listing, top achievers, and modal code into `js/modules/students/`.
5. Extract attendance state, analytics, and roster table into `js/modules/attendance/`.
6. Connect everything cleanly through `js/main.js` with `<script type="module" src="js/main.js">` in `index.html`.
7. Verify all existing features (stats cards, top achievers, modal, roll call, pagination, live clock) continue functioning seamlessly.

### Milestone 2: Calendar UI & Styling (Option B Grid + Sidebar)
1. Add the **Calendar Section** markup to `index.html` with:
   - Term Progress Banner (% complete, days left progress bar).
   - Category Filter Bar (`All`, `Academic Term`, `Events`, `Exams`, `Holidays`, `Deadlines`).
   - Month Navigator Header (`◀ Prev Month`, `Next Month ▶`, `Today` button, Month/Year title).
   - 7-column Calendar Grid (Sunday - Saturday).
   - Interactive Agenda Sidebar (Selected date header, scheduled items list, upcoming highlight widget).
2. Add modern, sleek CSS styling to `style.css` (Glassmorphic cards, colored category dots/badges, hover states, mobile responsiveness).

### Milestone 3: Calendar Logic & Interactive Controllers
1. Create `calendarData.js` with the 5 categories.
2. Build `calendarGrid.js` to compute day matrices, fill blank padding days, render colored dot indicators, and highlight the current active date.
3. Build `calendarSidebar.js` to render the detailed cards for whatever date is clicked or display the upcoming highlights.
4. Build `termProgress.js` to dynamically compute:
   - Total term duration in days.
   - Elapsed days vs. remaining days.
   - Exact percentage progress for the live term progress bar.
5. Add event listener dispatchers for Month Navigation (prev/next/today) and Category Filtering.

### Milestone 4: Verification & Testing
1. Test month navigation forward/backward across year boundaries (e.g. Dec 2026 -> Jan 2027).
2. Test clicking any date on the grid to update the sidebar agenda.
3. Test all category filter buttons (Terms, Events, Exams, Holidays, Deadlines).
4. Verify mobile/responsive layout adapts cleanly to narrow screens.

---

## 💡 6. Educational Concepts Mastered in this Project

* **ES6 Modules (`import` / `export`)**: Clean code organization, encapsulation, and code reuse.
* **JavaScript Date Matrix Computation**: Calculating first day of month, total days in month, and mapping 42 grid cells (previous month trailing days, active month days, next month leading days).
* **Date Math & Progress Tracking**: Calculating time intervals, elapsed percentage, and remaining days relative to official school dates.
* **State Management**: Managing `currentViewingMonth`, `currentViewingYear`, `selectedDate`, and `activeCategoryFilter`.
* **Component-based DOM Rendering**: Pure functional template string renderers mapped to state.
