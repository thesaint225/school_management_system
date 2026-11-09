# School Management System — AI Constitution (`AGENTS.md`)

## 1. Design System

The CSS `:root` variables are the single source of truth for the application's visual design.

### Colors
- Use `--primary` and its derived tokens for primary UI elements.
- Use `--status-danger` for destructive actions and validation errors.
- Use `--status-success` for successful validation states.
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

---

## 2. Core Development & Architecture Rules

- **Inspect Before Modifying**: Always read and understand existing code, contracts, and call sites before making changes.
- **Smallest Necessary Change**: Make the smallest change necessary; do not rewrite working modules or introduce heavy dependencies unnecessarily.
- **Preserve Existing Architecture**: Build upon existing validation and utility libraries (`apiValidator.js`, `dateUtils.js`, `classUtils.js`) and established coding patterns.
- **Scope Discipline**: Do not modify unrelated files. Preserve existing functionality.
- **Honest Verification**: Never claim tests or browser checks have passed without running them. Before finishing, verify that existing project rules were not violated.

---

## 3. Domain Guardrails & Playbooks (Skills)

Detailed step-by-step workflows live in `.agents/skills/`. **Always activate and follow the corresponding skill when performing any of the tasks below:**

- **Forms & UI Validation (`forms-and-ui-validation`)**:
  - Validate on field `blur`, show explicit `--status-success` (green check) or actionable `--status-danger` error messages, and maintain accessible `aria-invalid` / `aria-describedby` attributes.
  - Follow `.agents/skills/forms-and-ui-validation/SKILL.md` whenever creating or modifying forms or field validation.
- **DOM Security & XSS Prevention (`dom-xss-security`)**:
  - Never interpolate dynamic user or API data into `innerHTML` (especially `<option>`, toasts, or feedback banners); always use safe DOM APIs (`createElement`, `textContent`, `replaceChildren`).
  - Follow `.agents/skills/dom-xss-security/SKILL.md` whenever rendering data into the DOM and run its pre-completion XSS check before finishing any frontend JS task.
- **Backend API, Runtime Validation & Input Contracts (`data-contracts-and-api-validation`)**:
  - The backend API is the single source of truth (never hardcode frontend mock data when backend endpoints exist). Validate all untrusted inputs and API responses at runtime (`apiValidator.js`), enforce finite domain ranges without silent defaults, and never leak student PII in logs.
  - Follow `.agents/skills/data-contracts-and-api-validation/SKILL.md` whenever integrating backend APIs, writing validators or domain functions, or authoring boundary tests.
- **JavaScript Encapsulation & State Protection (`javascript-encapsulation-protection`)**:
  - Keep internal module state private, prefer controlled public getters/mutators with input validation over exporting mutable objects/arrays directly, prevent shared-reference mutations (`structuredClone()` or shallow copies where appropriate), and never treat frontend encapsulation as a substitute for Spring Security and backend role/ownership checks.
  - Follow `.agents/skills/javascript-encapsulation-protection/SKILL.md` whenever creating, inspecting, or refactoring JavaScript modules, state stores, or caches, and write isolation tests to verify external mutations cannot corrupt internal state.
- **Frontend Browser QA (`playwright-browser-qa`)**:
  - Verify real user outcomes (not just clicks) and produce an honest, evidence-based QA report for frontend changes.
  - Follow `.agents/skills/playwright-browser-qa/SKILL.md` whenever verifying frontend UI changes with Playwright MCP.

---

## 4. Developer Mentorship & Learning Process

I am learning software development. My goal is to understand the code I build, not just get a working application. Optimize for my learning, not just speed of implementation.

### Before Writing Code
- Explain the problem we are solving in simple English.
- Explain the concept behind the solution.
- Inspect the existing code and identify relevant files, functions, and APIs.
- Explain your proposed approach before making significant changes.
- Prefer small, understandable changes over large rewrites.

### While Writing Code
- Explain unfamiliar JavaScript, TypeScript, HTML, CSS, React, and backend concepts.
- Explain the *why* behind validation and error-handling patterns in beginner-friendly terms (contrast safe vs. unsafe patterns with concrete examples, and relate technical concepts like `TypeError` vs. `RangeError` to real-world software consequences such as data corruption and silent bugs).
- Use meaningful variable and function names.
- Avoid unnecessary abstractions, clever shortcuts, and premature optimization.
- Reuse existing functions and APIs instead of creating duplicates.
- Tell me which files you change and why.
- Do not silently modify unrelated code.

### After Writing Code
For each important change, explain:
- **Purpose**: Why is this code needed?
- **Inputs**: Where does the data come from?
- **Process**: What happens step by step?
- **Output**: What does it return, display, or change?
- **Dependencies**: Which other code uses it?
- **Edge cases**: What might go wrong?
- **Testing**: How can I verify that it works?

### My Learning Process
- Do not explain an entire large file all at once.
- Break the work into small, logical sections.
- Teach one unfamiliar concept at a time.
- Ask me to predict what a short code example will do.
- Let me attempt small exercises before revealing the answer.
- When I make a mistake, explain the reasoning rather than simply correcting it.
- If I ask you to write code, help me understand the result afterward.
- Do not assume that working code means I understand it.

**Important**: I want to become capable of reading, debugging, modifying, and eventually designing code independently.
