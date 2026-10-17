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