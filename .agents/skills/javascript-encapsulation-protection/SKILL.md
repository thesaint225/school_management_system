---
name: javascript-encapsulation-protection
description: >-
  Enforces JavaScript module encapsulation, private internal state, defensive copying (structuredClone / shallow copies),
  validated state mutators, and isolation unit testing for the School Management System. Use this skill whenever creating,
  inspecting, or refactoring JavaScript modules, state stores, data caches, or utility helpers, or when writing encapsulation
  and mutation-safety tests.
---

# JavaScript Encapsulation & State Protection Playbook

## Purpose

Ensure that JavaScript code in the School Management System follows strong encapsulation and protects internal application data (student records, teacher rosters, academic terms, class caches, and UI state) from accidental or unauthorized external modification—while recognizing that client-side encapsulation is an integrity and maintainability boundary, **never** a replacement for backend security.

---

## 1. Core Encapsulation Rules

### Rule 1: Inspect Modules for Exposed Mutable State
- Audit JavaScript modules for exported `let`/`const` arrays, plain objects, or state containers (`export const students = [...]`, `export const calendarState = {...}`).
- Remember that `const` in JavaScript only prevents **reassigning the variable binding**—it does **not** prevent mutating properties of an object or elements of an array (`students.push(...)`, `students.length = 0`, `calendarState.viewMonth = 99`).

### Rule 2: Keep Implementation Details Private by Default
- Variables, helper functions, caches (`cachedActiveClasses`, `cachedActiveSubjects`), and internal state objects must remain unexported (module-scoped) or enclosed inside functions/classes unless external callers genuinely require access.
- Do not export internal formatting or DOM helper functions solely for convenience if they are only used inside that module.

### Rule 3: Prefer Controlled Public Functions Over Direct State Exposure
- Replace direct external access to mutable arrays/objects with explicit reader (getter) and writer (setter/mutator) functions:
  ```javascript
  // ❌ WEAK ENCAPSULATION: Any importing module can corrupt state directly
  export const calendarState = {
    viewYear: 2026,
    viewMonth: 8,
    activeFilter: 'all',
  };

  // ✅ STRONG ENCAPSULATION: Private state + controlled public functions
  const state = {
    viewYear: 2026,
    viewMonth: 8,
    activeFilter: 'all',
  };

  export function getCalendarState() {
    return { ...state }; // Shallow copy of flat primitive properties
  }
  ```

### Rule 4: Review Returned Arrays and Objects for Shared References
- Returning an internal array or object directly (`return cachedActiveClasses;`) hands the caller a **shared memory reference**. If the caller runs `.push()`, `.pop()`, `.sort()`, or mutates `item.name = '...'`, the module's internal cache is silently corrupted for all other consumers.
- Always check whether a returned value contains nested objects or arrays (e.g., a `student` record containing `subjects: [...]`, `dailyAttendance: {...}`, and `guardian: {...}`).

### Rule 5: Use `structuredClone()` or an Appropriate Copying Strategy
- When callers need an independent copy of nested mutable data (such as student records with nested `guardian`, `dailyAttendance`, and `subjects` arrays), use `structuredClone(data)` so external edits cannot mutate internal state.
- For flat objects containing only primitives (like `calendarState` or `attendanceState`), a shallow copy (`{ ...state }`) or `Object.freeze({ ...state })` is sufficient.
- For read-only lists of primitive values (e.g., subject names), `array.slice()` or `[...array]` is sufficient.

### Rule 6: Do Not Apply Deep Cloning Blindly
- Consider performance, data types, and whether copying is necessary before calling `structuredClone()`:
  - **Supported types**: Plain objects, arrays, `Date`, `Map`, `Set`, primitives.
  - **Unsupported types (throws `DataCloneError`)**: Functions, DOM nodes (`HTMLElement`), class instances with methods, or closures.
  - **Performance**: Avoid running `structuredClone()` inside tight rendering loops if the consumer only reads a single primitive field; instead, provide a targeted query function (e.g., `getStudentCount()`, `getStudentById(id)`).

### Rule 7: Validate Inputs Before Modifying Internal State
- Every public mutator or setter function must validate its inputs before modifying private state (aligning with `data-contracts-and-api-validation`):
  - Throw `TypeError` if the argument is of the wrong type (e.g., non-number, `null`, or non-array).
  - Throw `RangeError` if numeric or enum values fall outside valid domain boundaries (e.g., `viewMonth < 0 || viewMonth > 11`, negative fees, GPA outside `0.0–4.0`).
  - Clone incoming objects/arrays before storing them internally so the caller cannot mutate the object *after* passing it into the setter.
  ```javascript
  const ALLOWED_FILTERS = new Set(['all', 'term', 'event', 'exam', 'holiday', 'deadline']);

  export function setActiveFilter(filter) {
    if (typeof filter !== 'string') {
      throw new TypeError(`Filter must be a string, received ${typeof filter}.`);
    }
    if (!ALLOWED_FILTERS.has(filter)) {
      throw new RangeError(`Invalid calendar filter "${filter}".`);
    }
    state.activeFilter = filter;
  }
  ```

### Rule 8: Avoid Unnecessary Global Variables and Mutable Shared State
- Never attach application data or state to `window` or `globalThis`.
- Avoid scattering duplicate mutable copies of the same dataset across multiple modules; keep a single well-encapsulated module boundary per domain.

### Rule 9: Explain Encapsulation Weaknesses Found in Existing Code
- When inspecting or refactoring a module, clearly explain to the developer:
  1. **What** internal state or reference is exposed.
  2. **How** external code could accidentally corrupt it (with a concrete example, such as `.sort()` mutating an array in place or modifying a nested `guardian.phone` property).
  3. **Why** the chosen encapsulation strategy (closure, unexported module binding, shallow copy, or `structuredClone()`) fixes the issue.

### Rule 10: Generate Isolation Tests to Verify Encapsulation
- Every encapsulated state store, cache, or data module must have automated tests verifying that:
  1. Mutating an array or nested object returned by a getter does **not** alter the internal state on subsequent reads.
  2. Mutating an input array or object *after* passing it to a setter/updater does **not** alter the stored internal state.
  3. Invalid inputs to state mutators throw `TypeError` or `RangeError` and leave the existing internal state completely unchanged.

---

## 2. Critical Security Boundary: Frontend Encapsulation vs. Backend Security

**JavaScript encapsulation is an application integrity and code-quality mechanism—it is NEVER a replacement for backend security.**

Anyone with a browser can open DevTools, inspect network traffic, modify frontend JavaScript in memory, or send raw HTTP requests via `curl` or Postman directly to the backend API.

For the School Management System:
1. **Spring Security Must Enforce Authentication & Authorization**: All protected endpoints (`/api/students`, `/api/teachers`, `/api/classes`, `/api/subjects`, `/api/results`, `/api/calendar`) must be guarded on the server by Spring Security filters and method/endpoint security rules.
2. **Backend Services Must Enforce Role & Ownership Rules**:
   - Role checks (`ADMIN`, `TEACHER`, `STUDENT`, `GUARDIAN`) must happen in the Spring Boot backend service/controller layer.
   - **Teachers must not modify results or attendance for classes or subjects they are not assigned to.** The backend must verify teacher-to-class/subject assignment in the database before accepting any `POST`/`PUT`/`DELETE` request.
3. **Frontend Restrictions Are Never the Final Security Boundary**: Hiding an "Edit" or "Delete" button in the DOM or keeping a variable unexported in an ES module only prevents accidental bugs in the UI—it does **not** stop a malicious user from calling the REST API directly.
4. **Honest Security Reporting**: Never claim that data or an operation is "secure" merely because a variable is not exported or an object is cloned. Always explain:
   - **Actual protection provided**: Prevents accidental in-memory mutation, shared-reference bugs, and unintended coupling between frontend modules.
   - **Limitations**: Does not protect against browser DevTools inspection, XSS executing in the same origin, or direct API calls bypassing the UI.

---

## 3. Mandatory Agent Workflow

Whenever implementing a feature, refactoring state, or reviewing frontend modules:

1. **Inspect Relevant Existing Modules**:
   - Read the target module and its callers (`import` sites) before proposing or writing changes.
2. **Identify Encapsulation Risks**:
   - List any exported mutable arrays/objects, unvalidated state mutations, or getters returning live internal references.
3. **Apply This Skill's Rules**:
   - Keep state private to the module or closure.
   - Expose controlled getter/mutator functions with strict input validation (`TypeError` / `RangeError`).
   - Return safe copies (`{ ...state }`, `[...list]`, or `structuredClone()`) based on data shape and performance needs.
4. **Implement the Feature**:
   - Make the smallest, clearest change that satisfies the requirement while preserving existing functionality and design tokens.
5. **Run Appropriate Tests**:
   - Write and execute unit/integration tests that specifically attempt to mutate returned objects/arrays and pass invalid arguments to mutators, verifying that internal state remains intact.
6. **Report Protection & Remaining Risks Honestly**:
   - Summarize what in-memory protections were added, verify test results from actual execution, and explicitly note any backend authorization or ownership checks (e.g., Spring Security class/subject ownership for teacher result entry) that must be enforced server-side.

