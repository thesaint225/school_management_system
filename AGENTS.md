# School Management System — AI Rules

## Design System

The CSS `:root` variables are the single source of truth
for the application's visual design.

### Colors

- Use `--primary` and its derived tokens for primary UI elements.
- Use `--status-danger` for destructive actions.
- Do not invent new colors when an existing design token is appropriate.
- Do not randomly change the application's color palette.

### Buttons

- Delete buttons must use the danger design tokens.
- Save buttons are the primary action.
- Cancel buttons are secondary actions.
- Destructive actions require confirmation.

### Student Modals

- View modal is read-only.
- Edit modal is used to modify student information.
- Delete Student belongs in the Edit/Manage flow.
- Do not move Delete into the View modal unless explicitly requested.

### UI

- Keep the interface minimalistic.
- Preserve the existing glassmorphism design.
- Do not redesign existing components unless explicitly requested.
- Do not change IDs or existing functionality when only styling is requested.

## Development Rules

- Inspect existing code before modifying it.
- Make the smallest change necessary.
- Do not rewrite working code unnecessarily.
- Do not modify unrelated files.
- Preserve existing functionality.
- Before finishing, verify that existing project rules were not violated.

## Forms & Validation

Do not rely on your previous conversation or your own assumptions. The rules in AI_RULES.md are the project's source of truth.

Step 2 — Confirm the relevant rules

Before editing the code, explicitly list the validation rules that apply to this task.

In particular, verify that you understand:

Validation happens when the user leaves a field (blur).
A valid field must receive explicit visual confirmation.
A valid field should show a green checkmark/icon.
Silence must NOT be treated as confirmation.
An invalid field must explain how to fix the problem, not merely say that it is invalid.
Error messages must be specific and actionable.
Use --status-success for successful validation.
Use --status-danger for errors.
The validation feedback must be accessible and must not rely on color alone.
aria-invalid and appropriate aria-describedby relationships must be maintained where applicable.
Step 3 — Inspect the existing implementation

Before changing anything, inspect:

The existing form HTML generation.
Existing validation JavaScript.
Existing error elements.
Existing CSS for validation states.
Existing AI_RULES.md.

Do not immediately rewrite the validation system.

Step 4 — Implement

Modify the existing implementation so that it follows the rules.

Preserve:

Existing field IDs.
Existing form structure.
Existing validation rules unless they are incorrect.
Existing functionality.
Existing design tokens.

Do not create a completely different validation system unless the current implementation makes the requirements impossible to satisfy.

Step 5 — Verify your work

After implementing the changes, test each scenario mentally and, where possible, in the browser:

Valid field
User enters valid value
        ↓
Leaves field
        ↓
Validation runs
        ↓
Green check/success state appears
Invalid field
User enters invalid value
        ↓
Leaves field
        ↓
Validation runs
        ↓
Error state appears
        ↓
Message explains exactly how to fix it
Correcting an error
Invalid field
    ↓
User fixes value
    ↓
Leaves field
    ↓
Error disappears
    ↓
Green success state appears
Step 6 — Final compliance check

Before finishing, compare your implementation against AI_RULES.md.

If any implementation decision conflicts with the rules, fix it before reporting the task as complete.

Do NOT tell me that the task is complete if the implementation does not satisfy the rules.



## Backend Data & API
Backend Is the Source of Truth
Frontend data must come from the backend API.
Do not hardcode or create static/mock data in the frontend when the corresponding backend functionality already exists.
Before implementing frontend data, inspect the existing backend controllers, services, repositories, DTOs, entities, and API endpoints.
Reuse the existing API and project architecture instead of creating duplicate endpoints or duplicate functionality.
When sample/development data is required, use the existing backend API to create it.
Prefer using curl requests against the backend API to create sample data rather than inserting static data directly into frontend JavaScript.
Verify that data created through the API is actually persisted in the database.
Verify that the frontend retrieves the persisted data from the backend and displays it correctly.
Do not assume an endpoint exists. Inspect the backend implementation first.
Do not create a new endpoint if an existing endpoint already provides the required functionality.
Required Workflow

When asked to add or display data in the frontend:

Inspect the existing backend API and data model.
Identify the correct existing endpoint for creating or fetching the data.
If sample data is needed, use curl to create it through the backend API.
Confirm that the data is persisted in the database.
Update the frontend to fetch the data from the backend.
Verify that the frontend displays the backend data correctly.
Avoid hardcoded/static replacement data unless explicitly requested.
Important Principle

The backend/database is the source of truth. The frontend displays and interacts with that data; it should not become a second database.

## DOM Security & Data Rendering (XSS Prevention)

### Rule 1: Never Interpolate Dynamic Data Directly into `<option>` via `innerHTML`
- When dynamically populating dropdown `<select>` options with user or database data, **NEVER** use `.map().join('')` or string concatenation into `innerHTML`:
  ```javascript
  // ❌ FORBIDDEN: High XSS Risk (Stored XSS via attribute breakout or HTML injection)
  select.innerHTML = items.map(item => `<option value="${item.name}">${item.name}</option>`).join('');
  ```

### Rule 2: Always Use Safe DOM Methods (`createElement`, `textContent`, `appendChild`)
- Construct options using native DOM APIs that treat values strictly as text nodes, bypassing the browser's HTML parser:
  ```javascript
  // ✅ REQUIRED PATTERN
  select.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select Option --';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id || item.name;
    option.textContent = item.name; // 🛡️ Safe: textContent never parses or executes HTML
    if (isSelected) option.selected = true;
    if (isDisabled) option.disabled = true;
    select.appendChild(option);
  });
  ```

### Rule 3: General Dynamic Content Rendering
- For labels, table cells, spans, and headings receiving database or user inputs, prefer `element.textContent = data` instead of `element.innerHTML = data`.
- If dynamic HTML templates must be constructed, always sanitize or escape user-controlled strings (e.g., `&`, `<`, `>`, `"`, `'`) before embedding them into template literals.

### Rule 4: Form Feedback, Status Banners, and Toast Notifications
- Form submission feedback (success/error messages) and toast notifications must **never** concatenate user-entered or API data directly into `innerHTML`:
  ```javascript
  // ❌ FORBIDDEN: High XSS Risk
  feedback.innerHTML = `✅ Successfully created <strong>${createdClass.name}</strong>!`;
  toast.innerHTML = message;
  ```
- **Always use `textContent` or safe DOM appending (`replaceChildren()` + `document.createElement` + `textContent`)**:
  ```javascript
  // ✅ REQUIRED PATTERN: Toasts
  toast.textContent = message; // 🛡️ Safe from XSS

  // ✅ REQUIRED PATTERN: Form feedback with highlighted text
  feedback.className = 'form-feedback success';
  feedback.replaceChildren();
  const strong = document.createElement('strong');
  strong.textContent = createdClass.name; // 🛡️ Safe from XSS
  feedback.append('✅ Successfully created ', strong, ` (#CLS-${createdClass.id})!`);
  ```

### Rule 5: Mandatory Pre-Completion XSS Check
- Before finishing any task that touches frontend JavaScript, inspect all DOM insertion points in the modified files:
  1. Check for `innerHTML`, `outerHTML`, `insertAdjacentHTML`, and `document.write`.
  2. Confirm that no user-controlled or API-supplied string reaches an unescaped HTML sink.
  3. Ensure all dropdown options, banners, and dynamic text use `textContent` or `createElement`.

## Runtime API Response Validation & Trust Boundaries

### Rule 1: Mandatory Runtime Validation at Trust Boundaries
- All external data entering the application via `fetch()` or other network mechanisms must be validated at runtime before it is returned to callers, stored in application state, or rendered in the UI.
- Do not assume that `response.ok` or successful `response.json()` parsing means the data is structurally valid or safe.
- Do not assume TypeScript interfaces or static types validate data at runtime. JavaScript runtime validation must inspect actual values, primitive types, and collections.

### Rule 2: Contract-Based Validation Matching Backend DTOs & Models
- Response validators must strictly reflect the backend Spring Boot entity and DTO contracts (`Student`, `Teacher`, `ClassResponseDto`, `Subject`, `AcademicTerm`, `CalendarEvent`, `StudentReportDto`).
- Required fields, numeric boundaries, non-empty text, enum values, and date strings (`YYYY-MM-DD` or ISO 8601) must be verified.
- Optional and nullable fields must be explicitly declared and verified without false rejections.
- Every item within a returned collection/array must be individually validated.

### Rule 3: Reusable Validation Architecture
- Maintain reusable primitive and domain validators in `frontEnd/js/utils/apiValidator.js`.
- Avoid duplicating ad-hoc validation logic across individual API client functions or UI components.
- When an API response fails validation, throw an `ApiValidationError` describing the field and expected vs. received types.

### Rule 4: Privacy & Sensitive Data Protection
- Validation error messages and logs must **never** leak sensitive student personal identifiable information (PII) or financial details (e.g. full names, phone numbers, guardian details, or fees data).
- Logs must describe structural discrepancies (e.g. `Field "gpa" expected number, received string`) rather than printing raw sensitive payloads.

### Rule 5: Safe Error & Fallback Handling
- Never silently treat malformed responses as successful empty results.
- When backend connectivity fails or response data is invalid, log a structured warning and safely activate existing seed data fallbacks without crashing downstream roster, attendance, or dashboard rendering.

### Rule 6: Testing Requirements for API Data Boundaries
- Automated tests must verify both valid payloads and malformed responses (missing required fields, incorrect types, corrupted nested objects, and invalid array items).
- Tests must use deterministic fixtures and mocked network responses to test validation logic independently of a live backend.

## Input Validation, Error Handling, and Testing Standards

### Rule 1: Validate Untrusted Data at Entry Boundaries
- Validate all untrusted inputs at the system or module boundary before processing or passing them deep into internal logic.
- Untrusted sources include: user inputs (forms, query parameters, search inputs), external storage (localStorage, sessionStorage), and remote network responses.
- Boundary validation must reject malformed data early, preventing invalid state from poisoning downstream services and UI components.

### Rule 2: Enforce Explicit Function Argument Contracts
- Public, exported, and domain functions must validate their arguments against their declared parameter contracts.
- **Guard Destructured Parameters**: When defining functions that destructure object parameters, always defend against `null`, `undefined`, or non-object arguments:
  ```javascript
  // ❌ FORBIDDEN: Crashes with TypeError if called with null or non-object before validation
  function renderReport({ studentId, term }) { ... }

  // ✅ REQUIRED PATTERN: Safe default and defensive contract check
  function renderReport(options = {}) {
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new TypeError('Expected an options object for renderReport.');
    }
    const { studentId, term } = options;
    if (typeof studentId !== 'number' || !Number.isInteger(studentId) || studentId <= 0) {
      throw new TypeError('studentId must be a positive integer.');
    }
    // ...
  }
  ```

### Rule 3: Choose Appropriate Built-in and Domain Error Types
- Select specific error classes that accurately describe the nature of the failure:
  - **`TypeError`**: When an argument or variable violates expected data type contracts (e.g., received a string when a number was expected, or `null` when an object was required).
  - **`RangeError`**: When a value is of the correct type (e.g., number or date) but falls outside permissible numeric bounds, date sequences, or array indices (e.g., negative fees, GPA > 4.0, or score > 100).
  - **`Error`**: For general operational failures that cannot be classified as type or range errors (e.g., network timeout, unexpected server state).
  - **Domain Errors (e.g., `ApiValidationError`)**: For specific architectural boundaries (e.g., API schema validation) where custom metadata is required.
- **Meaningful Error Messages**: Messages must state what was expected, what was received, and the field/parameter name:
  ```javascript
  // ❌ VAGUE: throw new Error('Invalid input');
  // ✅ ACTIONABLE: throw new RangeError(`Fee must be a non-negative number, received ${fee}.`);
  ```

### Rule 4: Verify Finite Numbers and Domain Business Ranges
- In JavaScript, `typeof NaN === 'number'`, `typeof Infinity === 'number'`, and `typeof -Infinity === 'number'`. Therefore, `typeof value === 'number'` alone is insufficient.
- Always verify that numbers are finite: `Number.isFinite(value)`.
- Enforce domain-specific constraints rigorously:
  - **Fees**: Must be finite and non-negative (`fee >= 0`). Never accept negative amounts.
  - **Scores & Grades**: Continuous assessment (CA) and exam scores must reside within their respective maximum limits (e.g. CA: 0–30, Exam: 0–70, Total: 0–100).
  - **GPA**: Must be between `0.0` and `4.0`.
  - **Attendance Percentage**: Must be between `0` and `100`.
  ```javascript
  // ✅ REQUIRED PATTERN: Numerical and domain validation
  export function validateFee(fee) {
    if (typeof fee !== 'number') {
      throw new TypeError(`Fee must be a number, received ${typeof fee}.`);
    }
    if (!Number.isFinite(fee) || fee < 0) {
      throw new RangeError(`Fee must be a finite, non-negative number, received ${fee}.`);
    }
    return fee;
  }
  ```

### Rule 5: Never Use Unjustified Defaults that Conceal Missing or Corrupted Data
- Do **not** silently default missing or invalid financial, academic, or identity data to zero, empty strings, or arbitrary values unless explicitly mandated by business requirements.
- *Reasoning*: Defaulting a missing fee to `0` can erroneously mark a student as having zero debt or being fully paid; defaulting a missing student ID can cause data corruption across shared records. Missing or invalid required data must produce an explicit failure.

### Rule 6: Avoid Swallowing Exceptions and Silent Undefined Returns
- Functions must not silently return `undefined` or `null` when invalid arguments are provided if the function contract requires an explicit operation or valid output.
- Avoid empty `catch {}` blocks that swallow runtime exceptions without logging or corrective action.
- When an operation cannot proceed due to invalid parameters (e.g., missing mandatory DOM container or invalid callback), fail fast with an actionable exception rather than silently exiting.
- Deliberate fallbacks (such as switching to local cached data when backend services are unreachable) are permitted only when accompanied by structured warning logs and clearly documented fallback paths.

### Rule 7: Comprehensive Testing Standards Across Data Boundaries
- Automated tests must cover:
  1. **Valid Inputs**: Standard happy path scenarios with expected outputs.
  2. **Invalid Data Types**: Passing `null`, `undefined`, boolean, string, object, or symbols where numbers or arrays are expected.
  3. **Boundary & Edge Values**: `0`, `-0`, minimum allowable values, maximum allowable values, values immediately beyond the boundaries (`min - 1`, `max + 1`), `NaN`, `Infinity`, and `-Infinity`.
  4. **Missing Properties**: Objects missing required keys, or collections containing empty/null entries.
  5. **Malformed Formats**: Invalid date strings, ill-formatted email addresses, or unparseable JSON.
- **Never claim tests have passed without running them**: Always execute the actual test runner (e.g. `npx playwright test ...`), observe the terminal exit status, and report genuine output.

### Rule 8: Architecture Preservation & Mentorship-Driven Code Changes
- **Preserve Existing Architecture**: Build upon existing validation libraries (`apiValidator.js`, `dateUtils.js`, `classUtils.js`) and established coding patterns. Do not rewrite working modules or introduce heavy dependencies unnecessarily.
- **Inspect Before Changing**: Always read and understand the existing code, contracts, and call sites before making modifications.
- **Explain Decisions in Beginner-Friendly Terms**: Explain the *why* behind every validation and error handling pattern:
  - Contrast safe vs. unsafe patterns with concrete examples.
  - Detail inputs, outputs, failure modes, and edge cases.
  - Relate technical concepts (like `TypeError` vs `RangeError`) to real-world software consequences (such as data corruption and silent bugs).



  I am learning software development. My goal is to understand the code I build, not just get a working application.

Before writing code

Explain the problem we are solving in simple English.

Explain the concept behind the solution.

Inspect the existing code and identify relevant files, functions, and APIs.

Explain your proposed approach before making significant changes.

Prefer small, understandable changes over large rewrites.

While writing code

Explain unfamiliar JavaScript, TypeScript, HTML, CSS, React, and backend concepts.

Use meaningful variable and function names.

Avoid unnecessary abstractions, clever shortcuts, and premature optimization.

Reuse existing functions and APIs instead of creating duplicates.

Tell me which files you change and why.

Do not silently modify unrelated code.

After writing code

For each important change, explain:

Purpose: Why is this code needed?

Inputs: Where does the data come from?

Process: What happens step by step?

Output: What does it return, display, or change?

Dependencies: Which other code uses it?

Edge cases: What might go wrong?

Testing: How can I verify that it works?

My learning process

Do not explain an entire large file all at once.

Break the work into small, logical sections.

Teach one unfamiliar concept at a time.

Ask me to predict what a short code example will do.

Let me attempt small exercises before revealing the answer.

When I make a mistake, explain the reasoning rather than simply correcting it.

If I ask you to write code, help me understand the result afterward.

Do not assume that working code means I understand it.

Important

I want to become capable of reading, debugging, modifying, and eventually designing code independently. Optimize for my learning, not just speed of implementation.