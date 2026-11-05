---
name: data-contracts-and-api-validation
description: >-
  Guides backend API integration, runtime API response validation, input argument contracts, domain range checks,
  error handling, and boundary testing. Use this skill whenever adding or fetching backend data, modifying API clients,
  validating DTOs in apiValidator.js, writing domain/utility functions, or writing unit and boundary tests.
---

# Backend API Integration, Runtime Validation & Input Contracts Playbook

## Part 1: Backend Data & API Workflow

**Important Principle**: The backend/database is the source of truth. The frontend displays and interacts with that data; it should not become a second database.

### Rules & Required Workflow
When asked to add or display data in the frontend:
1. **Inspect Backend First**: Do not assume an endpoint exists. Inspect the existing backend controllers, services, repositories, DTOs, entities, and API endpoints before implementing frontend data.
2. **Reuse Existing Architecture**: Identify the correct existing endpoint for creating or fetching the data. Reuse the existing API and project architecture instead of creating duplicate endpoints or duplicate functionality.
3. **No Hardcoded Mock Data**: Do not hardcode or create static/mock replacement data in the frontend when the corresponding backend functionality already exists (unless explicitly requested).
4. **Seed Sample Data via API (`curl`)**: When sample/development data is required, prefer using `curl` requests against the existing backend API to create it rather than inserting static data directly into frontend JavaScript.
5. **Confirm Persistence**: Verify that data created through the API is actually persisted in the database.
6. **Fetch & Verify in Frontend**: Update the frontend to fetch the persisted data from the backend and verify that it displays the backend data correctly.

---

## Part 2: Runtime API Response Validation & Trust Boundaries

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

---

## Part 3: Input Validation, Error Handling, and Testing Standards

### Rule 1: Validate Untrusted Data at Entry Boundaries
- Validate all untrusted inputs at the system or module boundary before processing or passing them deep into internal logic.
- Untrusted sources include: user inputs (forms, query parameters, search inputs), external storage (`localStorage`, `sessionStorage`), and remote network responses.
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

