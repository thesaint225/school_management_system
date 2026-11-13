---
name: javascript-architecture
description: >-
  Guides modern JavaScript architecture using ES Modules, frozen domain namespaces, encapsulation,
  single-responsibility module design, circular dependency prevention, and maintainable folder
  structures for the School Management System. Use this skill whenever creating JavaScript modules,
  refactoring frontend architecture, designing namespaces, reviewing encapsulation and module
  boundaries, or auditing dependency graphs.
---

# Modern JavaScript Architecture Playbook (`javascript-architecture`)

## 1. Purpose & Core Architectural Philosophy

This skill establishes a consistent, scalable, and maintainable JavaScript architecture for the **School Management System** frontend (`frontEnd/js/`) using native **ES Modules**, **frozen domain namespaces**, and **strict encapsulation**.

Every JavaScript module created or refactored under this playbook must be:
- **Modular**: Focused on a single clear responsibility with explicit inputs and outputs.
- **Maintainable**: Easy to locate, read, and modify without unintended ripple effects.
- **Reusable**: Shared logic lives in dedicated utility or domain modules rather than being copy-pasted across files.
- **Easy to Test**: Free of top-level DOM side effects so modules can be imported directly into Playwright/Node unit tests.
- **Secure by Design**: Enforces runtime contract validation, safe DOM APIs (`createElement`, `textContent`), and strict separation from backend security responsibilities.

---

## 2. Modern vs. Outdated JavaScript Practices

Distinguish timeless software principles from outdated pre-ES6 workarounds:

| Category | Practice | Guidance for This Project |
|---|---|---|
| **Timeless Principles** | Separation of concerns, single responsibility, lexical scope, closures, least privilege (hiding internal state), explicit contracts | **Mandatory** in every module. |
| **Modern Standard (ES6+)** | Native ES Modules (`import` / `export`), `const` / `let`, `structuredClone()`, `Object.freeze()`, `async` / `await`, private class fields (`#field`) | **Preferred standard** across `frontEnd/js/`. |
| **Older Patterns (Use Selectively)** | IIFEs (`(function() { ... })()`), manual Revealing Module Pattern | **Usually unnecessary** for file isolation because ES Modules already have private file scope. Only use an IIFE when isolating a one-off synchronous initialization expression, and never delete an existing IIFE without first verifying why it was written. |
| **Outdated Anti-Patterns** | Single giant global namespace (`window.SchoolApp = {}`), script-tag ordering without modules, exporting mutable arrays/objects (`export const students = []`) | **Forbidden**. Never attach state to `window` or export raw mutable arrays. |

---

## 3. Core Architectural Topics & Rules

### A. ES Modules (`import` and `export`)

1. **Named Exports vs. Default Exports**:
   - **Prefer named exports** (`export function registerStudentInDb(...)`, `export const Student = Object.freeze(...)`) over default exports. Named exports enforce consistent symbol naming across the codebase, improve IDE autocomplete, and make automated refactoring and tree-shaking reliable.
   - Use default exports only when an external library or tool explicitly requires one.
2. **Module Scope & Visibility**:
   - Every `.js` file is its own private ES Module scope. Variables, constants, caches, and helper functions declared without `export` are completely private to that file.
   - Keep everything private by default; only add `export` when another module or unit test genuinely needs to call it.
3. **Browser Module Loading & File Extensions**:
   - Because the frontend runs natively in the browser (`<script type="module" src="js/main.js">`) without a bundler rewrite step, **always include the explicit `.js` file extension** in relative import paths:
     ```javascript
     // ✅ GOOD: Explicit relative path with .js extension
     import { Student } from './modules/students/index.js';
     import { DateUtils } from './utils/dateUtils.js';

     // ❌ BAD: Missing .js extension fails in native browser ES Module loading
     import { Student } from './modules/students';
     ```
4. **No Top-Level DOM Side Effects in Imported Modules**:
   - Do **not** run `document.querySelector(...)` or attach event listeners at the top level of a reusable module outside of an initialization function (except in the top-level entry point `main.js`).
   - Top-level `document` access crashes with `ReferenceError: document is not defined` when the module is imported in Node.js unit tests (`npx playwright test`).
   ```javascript
   // ❌ BAD: Crashes Node unit tests on import and queries DOM before initialization
   const studentModal = document.querySelector('#studentModal');
   export function openStudentModal(student) { ... }

   // ✅ GOOD: Queries DOM lazily when called in the browser
   export function openStudentModal(student) {
     const studentModal = document.querySelector('#studentModal');
     if (!studentModal) return;
     ...
   }
   ```
5. **Import Organisation**:
   - Group imports at the top of each file in a consistent order:
     1. Shared utilities (`utils/apiValidator.js`, `utils/dateUtils.js`, `utils/domUtils.js`, `utils/icons.js`)
     2. Data stores and API clients (`data/...`, `api/...`)
     3. Feature/UI modules (`modules/...`)
6. **One Module vs. Multiple Modules**:
   - Split a domain into separate modules when responsibilities diverge (e.g., `studentApi.js` for HTTP requests, `studentsData.js` for in-memory state, `studentForm.js` for registration form validation, `studentModal.js` for profile/edit/delete modals, `studentRoster.js` for directory listing).
   - Avoid splitting a tiny 30-line helper into 5 separate files (avoid unnecessary fragmentation).

---

### B. Namespace Design (`Object.freeze`)

1. **What a Namespace Object Is**:
   - A frozen plain object exported from a domain `index.js` or utility module that groups closely related operations under a clear domain noun (`Student`, `Teacher`, `ClassRoom`, `Subject`, `Attendance`, `Calendar`, `Results`, `Api`, `Validator`, `DateUtils`, `DomUtils`, `Icons`).
2. **How Namespaces Complement ES Modules**:
   - Individual files (`studentForm.js`, `studentModal.js`, `studentsData.js`, `studentApi.js`) keep each file small and focused.
   - The domain barrel (`modules/students/index.js`) composes those focused functions into a cohesive `Student` namespace so orchestrators like `main.js` do not need 35+ separate imports:
   ```javascript
   // ✅ GOOD: Cohesive, frozen domain namespace in frontEnd/js/modules/students/index.js
   export const Student = Object.freeze({
     getAll: getStudents,
     getById: getStudentById,
     setAll: setStudents,
     add: addStudent,
     updateInStore: updateStudentInStore,
     updateAttendance: updateStudentDailyAttendance,
     removeById: removeStudentById,
     fetchAllFromDb: fetchStudentsFromDb,
     registerInDb: registerStudentInDb,
     updateInDb: updateStudentInDb,
     deleteFromDb: deleteStudentFromDb,
     initModal: initStudentModal,
     openModal: openStudentModal,
     initRoster: initStudentRoster,
     initForm: initStudentForm,
     initTopAchievers,
   });
   ```
3. **When Namespaces Improve Clarity vs. When They Are Unnecessary**:
   - **Use a namespace** when a domain or utility library exposes 4+ cohesive operations accessed by higher-level controllers (`Student.getAll()`, `ClassRoom.setAll(dbClasses)`, `DateUtils.formatSchoolTime()`, `Validator.validateStudent()`).
   - **Do NOT use a namespace** for private internal helpers inside a single file, and **never** create a monolithic global object (`const App = { Students: { Modals: { ... } } }`) for the entire application.
4. **Appropriate Use of `Object.freeze()`**:
   - Always wrap exported namespace objects and constant lookup tables (`ICONS`, `SUBJECT_DEPARTMENTS`) in `Object.freeze({...})` so callers cannot accidentally overwrite a method (`Student.getAll = null` throws a `TypeError` in ES Module strict mode).
   - Remember: `Object.freeze()` is **shallow** and is an **in-memory code-integrity guardrail**, never a security boundary.

---

### C. Public APIs vs. Private Implementation Details

1. **Expose Only What Callers Need**:
   - Before adding `export` to any function or constant, ask: *"Which external file imports this?"* If the answer is *"none"*, keep it private (unexported).
2. **Keep Rendering & Validation Sub-Helpers Private**:
   - Internal HTML/DOM builders (`studentInfo`, `classCardHTML`, `subjectCardHTML`, `teacherCardHTML`, `renderStudentProfile`, `renderStudentEditForm`, `renderDeleteConfirmation`, `createAgendaItemElement`), internal sorting/filtering helpers (`compareStudentGpa`, `getMonthDaysMatrix`), and internal `Intl.DateTimeFormat` option objects (`termRangeOptions`) must remain unexported.
   ```javascript
   // ❌ BAD: Exporting internal card builder and internal state array
   export const classes = [];
   export function classCardHTML(cls) { ... }
   export function renderClassGrid(classList, containerEl) { ... }
   export function initClassRoster(classes, onClassClick) { ... }

   // ✅ GOOD: Internal helpers are private; only the public initializer is exported
   function classCardHTML(cls) { ... }
   function renderClassGrid(classList, containerEl) { ... }
   export function initClassRoster(onClassClick) { ... }
   ```

---

### D. Encapsulation, Lexical Scope & Closures

1. **Module-Scoped Private State**:
   - Store in-memory collections (`students`, `teachers`, `calendarItems`, `academicTerms`, `classesStore`, `subjectsStore`) and UI state (`calendarState`, `attendanceState`) as unexported `const`/`let` bindings inside their module.
   - Note that `const students = []` only prevents reassigning the variable `students`; it does **not** prevent `students.push(...)` or `students[0].gpa = 0`. Therefore, never export the array itself.
2. **Closures & Factory Controllers**:
   - Use closures inside UI initializers (such as `initTeacherRoster`, `initClassRoster`, `initSubjectRoster`, `initAttendanceRoster`) to encapsulate DOM references and filter functions, returning a minimal controller object (`{ refresh }`) without leaking internal DOM nodes or state:
   ```javascript
   // ✅ GOOD: Closure encapsulates DOM elements and returns a controlled { refresh } API
   export function initSubjectRoster(onSubjectClick) {
     const subjectList = document.querySelector('#subjectList');
     function filterAndRender() { ... }
     return {
       refresh: () => {
         updateSubjectStats();
         filterAndRender();
       },
     };
   }
   ```
3. **Defensive Copying (`structuredClone` vs. Shallow Copy)**:
   - When returning objects containing nested arrays or objects (such as a `student` with `subjects: [...]`, `guardian: {...}`, `dailyAttendance: {...}`), return `structuredClone(record)` so external mutations cannot corrupt the store.
   - When accepting objects/arrays into a setter (`setStudents`, `addStudent`, `setClassCache`), validate first and store `structuredClone(input)` so caller mutations *after* the call cannot corrupt the store.
   - For flat state objects containing only primitives (`calendarState`, `attendanceState`), a shallow copy (`return { ...state };`) is fast and sufficient.
4. **Classes & `#private` Fields**:
   - Prefer plain modules, functions, and closures for stateless utilities, API clients, and standard stores. Use ES classes with `#private` fields only when instantiating multiple stateful objects that share prototype behavior (or custom error classes like `export class ApiValidationError extends Error`).

---

### E. Module Responsibilities & Maintainable Folder Structure

Maintain a flat, predictable 4-layer architecture inside `frontEnd/js/` (avoiding folder nesting deeper than 3 levels):

```text
frontEnd/js/
├── main.js                        # Application entry point & section/bootstrap orchestrator
├── api/                           # Layer 1: REST API Clients (fetch + runtime DTO validation)
│   ├── index.js                   # Exports frozen `Api` namespace
│   ├── studentApi.js              # Student REST endpoints (/api/students)
│   ├── teacherApi.js              # Teacher REST endpoints (/api/teachers)
│   ├── classApi.js                # Class REST endpoints (/api/classes)
│   ├── subjectApi.js              # Subject REST endpoints (/api/subjects)
│   ├── resultApi.js               # Results & PDF endpoints (/api/results)
│   └── calendarApi.js             # Calendar & Term endpoints (/api/calendar)
├── data/                          # Layer 2: Encapsulated Domain Data Stores & Seed Fallbacks
│   ├── studentsData.js            # Private `students` store + validated getters/mutators
│   ├── teachersData.js            # Private `teachers` store + validated getters/mutators
│   └── calendarData.js            # Private `calendarItems` & `academicTerms` stores
├── modules/                       # Layer 3: Feature & UI Modules (grouped by school domain)
│   ├── students/                  # index.js (`Student`), studentForm.js, studentModal.js, studentRoster.js, topAchievers.js
│   ├── teachers/                  # index.js (`Teacher`), teacherForm.js, teacherModal.js, teacherRoster.js
│   ├── classes/                   # index.js (`ClassRoom`), classForm.js, classModal.js, classRoster.js, classUtils.js
│   ├── subjects/                  # index.js (`Subject`), subjectForm.js, subjectModal.js, subjectRoster.js, subjectUtils.js
│   ├── attendance/                # index.js (`Attendance`), attendanceAnalytics.js, attendanceRoster.js, attendanceState.js
│   ├── calendar/                  # index.js (`Calendar`), calendarGrid.js, calendarModule.js, calendarSidebar.js, calendarState.js, termProgress.js
│   └── results/                   # index.js (`Results`), resultsMain.js
└── utils/                         # Layer 4: Pure Shared Utilities (zero domain/UI state)
    ├── apiValidator.js            # Runtime DTO contract validators (`Validator`)
    ├── dateUtils.js               # Africa/Accra GMT date formatters & ISO date checks (`DateUtils`)
    ├── domUtils.js                # Shared UI/HTTP helpers (`getInitials`, `setFieldError`, `extractApiErrorMessage`)
    └── icons.js                   # Frozen SVG icon dictionary (`ICONS`, `Icons`)
```

**Single Responsibility Rules**:
- **`api/` modules** must never query or mutate the DOM. Their job is HTTP transport + calling `apiValidator.js`.
- **`data/` modules** must never call `fetch()` or touch the DOM. Their job is holding validated in-memory state and returning defensive copies.
- **`utils/` modules** must never import from `modules/`, `data/`, or `api/`. They are pure, stateless helpers at the bottom of the dependency graph.
- **`main.js`** coordinates bootstrapping and cross-domain refreshes (`refreshAllStudentViews()`) via domain namespaces; it must not contain raw data arrays or complex form validation logic.

---

### F. Circular Dependency Prevention & Dependency Direction

1. **What a Circular Dependency Is**:
   - Module `A` imports Module `B`, and Module `B` (directly or through Module `C`) imports Module `A`.
   - In ES Modules, circular imports can cause imported bindings to be uninitialized (throwing `ReferenceError: Cannot access '...' before initialization` at runtime) and make modules impossible to test in isolation.
2. **Strict One-Way Dependency Direction**:
   Always enforce a top-down, acyclic dependency flow:
   ```text
   main.js
     ↓
   modules/<domain>/index.js
     ↓
   modules/<domain>/*.js  (UI Forms, Modals, Rosters, View State)
     ↓
   data/*.js  &  api/*.js
     ↓
   utils/*.js (apiValidator.js, dateUtils.js, domUtils.js, icons.js)
   ```
3. **How to Prevent Cross-Domain Coupling & Cycles**:
   - **Rule A**: Feature sub-modules (`studentModal.js`, `studentForm.js`) must **not** import from their own barrel (`modules/students/index.js`); the barrel imports from them.
   - **Rule B**: Do not import a general utility function from another domain's UI module. For example, `classModal.js`, `subjectModal.js`, and `attendanceRoster.js` must **not** import `getInitials` from `modules/students/studentModal.js`. Shared helpers belong in `utils/domUtils.js`.
   - **Rule C**: When two domains need to react to each other (e.g., deleting a class requires resyncing students), coordinate the callback in `main.js` rather than making `classModal.js` and `studentModal.js` import each other.

---

### G. Additional Modern JavaScript Architecture Practices

1. **Strict Separation of Frontend & Backend Responsibilities**:
   - **PostgreSQL + Spring Boot** is the single source of truth for persistent school records (`Student`, `Teacher`, `SchoolClass`, `Subject`, `StudentResult`, `CalendarEvent`, `AcademicTerm`).
   - **Frontend encapsulation and `Object.freeze()` are NOT security boundaries.** Anyone can open browser DevTools or run `curl` against `http://localhost:8080/api/...`.
   - **Authentication, role-based access control (`ADMIN`, `TEACHER`, `STUDENT`, `GUARDIAN`), and ownership checks** (e.g., verifying a teacher is assigned to a class/subject before saving marks or attendance) must always be enforced by Spring Security and backend services.
   - Business rules (unique student email, valid GPA range `0.0–4.0`, safe class/subject deactivation when students are enrolled) must be enforced by the backend even when frontend blur validation exists.
2. **Error Handling & Input Validation Conventions**:
   - Align with `data-contracts-and-api-validation`:
     - Throw `TypeError` when an argument has the wrong primitive/object type (e.g., `getStudentById('1')` or `setCalendarViewMonth('2026', 8)`).
     - Throw `RangeError` when an argument has the right type but falls outside allowed domain boundaries (e.g., `getStudentById(0)`, `setSelectedDate('2026-02-31')`, empty/whitespace strings `''`, or inverted date ranges `startDate > endDate`).
     - Validate all multi-step state mutations **atomically**: validate every input *before* mutating any state field so a failed check never leaves partial state changes behind.
3. **Safe DOM Manipulation & XSS Prevention**:
   - Align with `dom-xss-security`:
     - Never interpolate dynamic user or API strings into `innerHTML` (especially in `<option>`, tables, calendar cells, feedback banners, or toasts).
     - Use `document.createElement()`, `element.textContent = ...`, and `container.replaceChildren()`.
4. **Idempotent UI Initialization**:
   - Whenever a view refresh function (like `refreshAllStudentViews()`) can be called multiple times during a session, ensure event listeners and `setInterval` timers are attached **only once** (or return a `{ refresh }` controller) so listeners never stack and pagination/buttons never fire multiple times per click.

---

## 4. Mandatory Coding-Agent Workflow & Developer Mentorship

When using this skill, the coding agent **must** follow these 12 behaviors:

1. **Inspect existing code first** before proposing or making any architectural changes.
2. **Reuse established project conventions** (`apiValidator.js`, `dateUtils.js`, `domUtils.js`, `classUtils.js`, `subjectUtils.js`, existing CSS `:root` tokens).
3. **Avoid rewriting working code unnecessarily** (Smallest Necessary Change).
4. **Explain why a module or namespace is needed** in beginner-friendly English.
5. **Explain why each function is exported or kept private**.
6. **Identify all incoming and outgoing dependencies** (`grep` for `import` sites) before moving, renaming, or unexporting any symbol.
7. **Check for circular dependencies** and verify strict top-down dependency direction.
8. **Preserve existing API contracts and application behavior**.
9. **Avoid premature abstractions** or overengineering (do not add complex pub/sub buses, deep inheritance hierarchies, or frameworks when plain ES modules and functions suffice).
10. **Make changes incrementally** and verify each layer.
11. **Run relevant automated tests (`npx playwright test`) and browser checks** and report actual results.
12. **Never claim verification succeeded without actually running the checks**.

### Progressive Developer Learning Explanations

Whenever making an important architectural change, explain progressively (without overwhelming the developer all at once):
- **What the concept means** in simple English (e.g., what a barrel module or closure is).
- **Why it is needed** and what bug or maintenance headache it prevents.
- **How it applies to the School Management System** (using real entities like `Student`, `Teacher`, `ClassRoom`, `Attendance`).
- **Why this implementation was selected** and **what alternatives exist**.
- **What the developer should check** when reviewing AI-generated code (e.g., checking for leaked exports, top-level DOM queries, or shared reference mutations).

---

## 5. Checklists & Verification Requirements

### A. JavaScript Architecture Review Checklist

Use this checklist when reviewing a commit or module:
- [ ] **ES Module Visibility**: Are internal helper functions, config objects, caches, and state arrays unexported (private to the module)?
- [ ] **No Exposed Mutable State**: Does any module export a raw mutable array or object (`export const list = []`)?
- [ ] **Defensive Copying**: Do getters/setters for nested records (`Student`, `Teacher`, `ClassRoom`, `Subject`, `Calendar`) use `structuredClone()` so external mutations cannot corrupt internal state?
- [ ] **Frozen Namespaces**: Are exported namespace objects and constant dictionaries frozen with `Object.freeze()`?
- [ ] **Input Contracts (`TypeError` vs. `RangeError`)**: Do state mutators validate types (`TypeError`) and domain ranges (`RangeError`) before mutating state? Are multi-step updates atomic?
- [ ] **No Top-Level DOM Queries**: Can the module be imported in a Node unit test without throwing `ReferenceError: document is not defined`?
- [ ] **Idempotent Event Listeners**: If an `init*` or `refresh*` function is called repeatedly, does it avoid stacking duplicate `addEventListener` or `setInterval` calls?
- [ ] **Dependency Direction & Duplication**: Are shared helpers placed in `utils/` rather than imported across unrelated feature modals? Are there zero circular dependencies?
- [ ] **DOM XSS Safety**: Are dynamic values rendered via `createElement` and `textContent` instead of unescaped `innerHTML`?
- [ ] **Honest Security Boundary**: Does the code/review respect that frontend encapsulation is for code integrity, while Spring Security and backend services enforce authorization and ownership?

### B. Safe Architectural Refactoring Checklist

Before and during any refactoring:
- [ ] **1. Map Call Sites**: Run `grep -rn "symbolName" frontEnd/js/ tests/` before unexporting, renaming, or moving any function.
- [ ] **2. Check Browser & Test Imports**: Ensure all relative imports include the `.js` extension and that existing Playwright spec imports continue to resolve.
- [ ] **3. Extract Shared Helpers Downward**: Move duplicated logic (`getInitials`, `setFieldError`, `extractApiErrorMessage`, `isValidISODateString`) downward into `frontEnd/js/utils/`, never sideways between feature modules.
- [ ] **4. Encapsulate State & Expose Namespaces**: Keep state arrays private, expose validated getters/mutators, and group domain operations in `modules/<domain>/index.js` with `Object.freeze()`.
- [ ] **5. Verify End-to-End**: Run unit tests, integration tests, and live browser checks.

### C. Testing & Verification Requirements

Before completing any architectural or module task:
1. **Run Encapsulation, Validation & Utility Unit Tests**:
   ```bash
   npx playwright test tests/encapsulation-protection.spec.js tests/api-validation.spec.js tests/date-utils.spec.js
   ```
2. **Run Full End-to-End Playwright Suite** (with frontend on port `5500` and Spring Boot backend on port `8080`):
   ```bash
   npx playwright test
   ```
3. **Verify in Live Browser (Playwright MCP)** when UI or module wiring changes:
   - Confirm zero JavaScript console/module errors (`SyntaxError`, `TypeError`, `ReferenceError`).
   - Confirm interactive flows (Student/Teacher/Class/Subject modals, forms, Attendance pagination, Calendar navigation, Results report cards) work end-to-end.

