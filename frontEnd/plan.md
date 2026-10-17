# 🎓 EduManage — School Management System (SMS)
## Project Learning Plan & Roadmap

Welcome to the **EduManage School Management System** practice project! This document outlines the architecture, completed milestones, key concepts learned, date/timezone strategy, and the future roadmap for taking your HTML, CSS, and JavaScript skills to the next level.

---

## 📌 1. Project Overview

EduManage is a modern, responsive single-page dashboard designed to practice frontend web development fundamentals without external libraries.

* **Tech Stack**: Vanilla HTML5, Modern CSS (Design Tokens & HSL), Vanilla JavaScript (ES6+).
* **Target Audience**: Web development learners building real-world UI components and interactive DOM applications.

---

## 🏗️ 2. Current Architecture & File Structure

```
sms/
├── index.html       # Semantic layout, ARIA accessibility, hero, stats, cards, modal & contact form
├── style.css        # Centralized HSL design system, CSS variables, modal styling, responsive layout
├── script.js        # Enriched data array, DOM rendering, modal handlers, named functions, array methods
└── plan.md          # Project documentation, timezone architecture, and learning milestones
```

---

## 🌍 3. Date & Timezone Architecture (Strategy & Standards)

Handling dates and timezones properly is a critical requirement for school systems.

### A. Why Timezones Matter in an SMS
1. **Attendance Timestamps**: Accurate student check-in/check-out logs without timezone drift.
2. **Fee & Assignment Deadlines**: Ensuring "Due by 23:59" is calculated according to the school's official clock.
3. **Audit & Message Logs**: Tracking exactly when contact forms and administrative actions take place.
4. **Live School Clock**: Giving students and staff an unambiguous reference time.

### B. Standard Timezone: `Africa/Accra` (GMT / UTC+0)
* **School Context**: Matches the Ghanaian school dataset (e.g. `+233` phone numbers, GHS Cedis currency).
* **Key Advantage**: GMT operates with **zero Daylight Saving Time (DST) shifts**, making calculations reliable and predictable all year round.

### C. The "Store UTC, Display Local" Principle
* **Data Storage Format**: Store timestamps in standardized **ISO 8601 UTC** format (e.g., `2026-08-31T09:46:00Z`).
* **UI Presentation**: Format dates on the screen using the native JavaScript **`Intl.DateTimeFormat`** API.

```javascript
// 1. Live School Clock Formatter
function formatSchoolTime(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short', // e.g. "09:46:00 GMT"
  }).format(date);
}

// 2. Academic Term Date Range Formatter (.formatRange)
function formatTermRange(startDate, endDate) {
  const formatter = new Intl.DateTimeFormat('en-GH', {
    timeZone: 'Africa/Accra',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return formatter.formatRange(startDate, endDate); // e.g. "1 Sept – 18 Dec 2026"
}
```

---

## ✅ 4. Completed Features & Concepts Learned

### 🌐 HTML5 & Accessibility (A11y)
- [x] **Semantic Landmarks**: `<header>`, `<main>`, `<section>`, `<footer>`.
- [x] **Accessibility Tags**: 
  - `aria-hidden="true"` to hide decorative icons and emojis from screen readers.
  - `aria-controls="studentList"` and `aria-expanded="true/false"` for interactive toggle buttons.
  - `aria-live="polite"` for dynamic live regions and form confirmations.
- [x] **Accessible Forms**: Explicit `<label for="...">` bindings, autocomplete attributes, and field validation.
- [x] **Dialog / Modal Structure**: Accessible modal overlay with `role="dialog"` and `aria-modal="true"`.

### 🎨 CSS & Design System
- [x] **HSL Color Palette**: `:root` design tokens with consistent hue, saturation, and lightness tuning.
- [x] **WCAG 2.1 Contrast**: Audited all text colors against backgrounds for AAA/AA compliance.
- [x] **Layout & Grid**: Responsive grid for stat cards, student list, and contact form inputs.
- [x] **Interactive States**: Smooth hover transitions, modal animations (`modalFadeIn`, `modalSlideUp`), and focus-visible rings using `box-shadow` to prevent layout jitter.
- [x] **Mobile Responsiveness**: Clean single-column layout under `750px`.

### ⚡ JavaScript (ES6+)
- [x] **DOM Manipulation**: `querySelector`, `addEventListener`, `innerHTML`, `setAttribute`.
- [x] **Array Mapping (`.map()`)**: Transforming objects into HTML card template literals using separate named functions.
- [x] **Array Searching (`.find()`)**: Finding student records by ID upon card clicks.
- [x] **Boolean Toggle Logic**: Using `let isVisible = false` and `!isVisible` to control UI state.
- [x] **Initials Extraction Algorithm**: `getInitials(name)` splitting full names into 2-letter uppercase avatar badges.
- [x] **Dynamic Calculations**:
  - Total students count via `students.length`.
  - Unique class count via `new Set(students.map(getStudentClass)).size`.
- [x] **Enriched Data Model**: 15 student records with nested arrays (`subjects`) and nested objects (`guardian`).
- [x] **Modal Controls**: Opening student details and closing via `✕` button, dark backdrop clicks, and `Escape` key.

---

## 🗺️ 5. Roadmap & Future Practice Milestones

### 📍 Milestone 1: Live School Clock & Date Formatting (Timezone Implementation)
- [x] **Live Header Clock Widget**: Display real-time school time (`HH:MM:SS GMT`) updated every second via `setInterval`.
- [x] **Academic Term Date Range (`.formatRange`)**: Format academic term start and end dates dynamically into localized Ghanaian format (`1 Sept – 18 Dec 2026`).
- [ ] **Date of Birth & Enrollment Date Formatting**: Format ISO date strings into readable localized dates (e.g. `"15 Apr 2009"`).
- [ ] **Contact Form Timestamping**: Append the submission timestamp in GMT to form confirmation messages.

### 📍 Milestone 2: Top Achievers Widget (`[...students]`, `.sort()` & `.slice(0, 3)`)
- [x] **Executive Dashboard Card**: Add a specialized "🏆 Top Achievers" card to the dashboard.
- [x] **Array Copying (`[...students]`)**: Make a safe shallow copy of the array using the spread operator `[...students]` to prevent mutating the master state.
- [x] **Array Sorting (`.sort()`)**: Sort student copies in descending order by GPA (`b.gpa - a.gpa`).
- [x] **Array Slicing (`.slice(0, 3)`)**: Grab precisely the top 3 highest-achieving students using `slice(0, 3)`.
- [x] **Medal Badging**: Display `🥇 1st`, `🥈 2nd`, and `🥉 3rd` medals dynamically by row index.
- [x] **Modal Integration**: Clicking any top achiever card directly opens their detailed profile modal.
- [x] **"View all →" Link**: Clicking "View all" smoothly toggles/scrolls to the full student list.

### 📍 Milestone 3: Search & Filter Controls (Beginner-Intermediate)
- [ ] **Live Name Search**: Add an `<input type="search">` to filter student cards in real-time as you type using `.filter()` and `.includes()`.
- [ ] **Class Filter Tabs**: Buttons for `All`, `Form 1`, `Form 2`, and `Form 3` to filter students by class.
- [ ] **Sort Controls**: Dropdown to sort students alphabetically (A-Z) or by GPA / Enrollment Year.

### 📍 Milestone 4: Add New Student Form (Intermediate)
- [ ] **Student Registration Form**: Create a form with inputs for Name, Class, Year, and Guardian.
- [ ] **Array Push (`.push()`)**: Add the new student object into the `students` array.
- [ ] **Live Re-render**: Re-run the render function and update the dashboard statistics counter automatically.

### 📍 Milestone 5: CRUD Operations & Card Actions (Intermediate)
- [ ] **Delete Student**: Add a "Delete" button (`🗑️`) on each card that removes the student by ID using `.filter()` or `.splice()`.
- [ ] **Edit Student**: Allow updating student class, fees status, or enrollment year.

### 📍 Milestone 6: Data Persistence with `localStorage` (Intermediate)
- [ ] **Save Data**: Store the `students` array in the browser using `localStorage.setItem('sms_students', JSON.stringify(students))`.
- [ ] **Load on Refresh**: Retrieve saved students on page reload so newly added students are not lost.

### 📍 Milestone 7: Dark Mode Toggle (Advanced Styling)
- [ ] **Theme Switcher**: Add a button to toggle between Light and Dark themes by overriding `:root` HSL lightness variables.

---

## 📚 6. Quick Reference & Cheatsheet

### Common Array Methods
| Method | Purpose | Returns |
| :--- | :--- | :--- |
| `.map()` | Transforms every element into something new | New array of same length |
| `.filter()` | Keeps only elements matching a condition | New array (filtered) |
| `.find()` | Finds the first matching element | Single element or `undefined` |
| `.reduce()` | Aggregates array into a single value/object | Single accumulated value |
| `.sort()` | Sorts items in place | Sorted array |

### Native Date Formatting (`Intl.DateTimeFormat`)
| Format Option | Example Code | Output |
| :--- | :--- | :--- |
| Date Only | `new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', dateStyle: 'medium' }).format(new Date())` | `31 Aug 2026` |
| Time with Zone | `new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', timeStyle: 'medium' }).format(new Date())` | `09:46:00 GMT` |
| Date Range (`.formatRange`) | `new Intl.DateTimeFormat('en-GH', { timeZone: 'Africa/Accra', year: 'numeric', month: 'short', day: 'numeric' }).formatRange(startDate, endDate)` | `1 Sept – 18 Dec 2026` |

---
*Created as part of the HTML/CSS/JS learning curriculum.*
