---
name: playwright-browser-qa
description: >-
  Provides the evidence-based frontend browser QA workflow and report template using Playwright MCP.
  Use this skill whenever verifying frontend code changes, testing user interactions, checking responsive layouts,
  or generating a frontend QA verification report.
---

# Evidence-Based Frontend Browser QA with Playwright MCP

## A. Understand the Change & Derive a Targeted Test Plan
- **Inspect Code & Workflows**: Inspect the code being changed and identify the affected user workflows before touching anything.
- **Explain the Implementation Plan**: Explain the proposed approach, component interactions, and architectural considerations before making significant changes.
- **Analyze Cross-Feature Impact**: Consider how shared functions, components, state management, and backend API calls may affect other areas of the application.
- **Derive a Change-Specific Test Plan**: Choose scenarios based on the actual code diff rather than generic page-load checks. Write a short browser test plan tailored to the change:
  - *Filter changed*: Apply the filter, verify the results, combine filters if relevant, and clear them.
  - *Reset logic changed*: Modify the current state, reset it, and verify the original state is restored.
  - *Persistence changed*: Update the value, save it, reload the page, and verify the saved value remains.
  - *Modal changed*: Open it, inspect its contents, close it, and verify the expected final state.
  - *Responsive layout changed*: Inspect the affected component at appropriate mobile and desktop viewport sizes.
  - *API integration changed*: Perform the relevant action and inspect the UI result, network request, and response.
- **Targeted Testing**: Select test scenarios proportionally based on actual code changes; avoid running exhaustive, unrelated scenarios unnecessarily.

## B. Run Automated Checks First
- **Execute Relevant Project Checks**: Run relevant existing test suites (e.g., Playwright specs, unit tests), linters, and build validations.
- **Passing Tests Are Not Complete Proof**: Automated tests verify isolated asserted conditions, but do not prove that the full, end-to-end user experience, visual styling, and interactivity are working seamlessly in the live DOM.

## C. Review the Running Application & Verify Outcomes
When a change affects the frontend and browser review is feasible:
- **Start the Application Stack**: Start the frontend and any required backend or supporting services (e.g., Spring Boot API, database) using existing project workflows if they are not already running.
- **Launch via Playwright MCP**: Use Playwright MCP tools to navigate to the running application.
- **Simulate Real User Interactions**: Interact with the changed feature as a genuine user would (clicking, typing, selecting, submitting).
- **Verify Outcomes, Not Just Actions**: For every important interaction, check what happened afterward. Do not stop at clicking a button, filling a form, submitting a request, closing a modal, or clicking Reset:
  - *Student registration*: Verify that the student appears in the expected list or that the application provides reliable confirmation of the saved record.
  - *Filtering*: Verify that every displayed row satisfies the selected criteria.
  - *Reset*: Verify that the expected original state is restored.
  - *Persistent settings*: Reload the page and verify that the saved setting remains.
  - *Unsuccessful API request*: Verify that the user receives appropriate feedback and that the interface remains usable.
  - *Principle*: Distinguish between an action being performed and its intended outcome being verified.
- **Test Core States & Edge Cases**: Test relevant success cases, invalid input rejection, empty states, loading indicators, error banners, and form reset or recovery behavior where applicable.
- **Check Related Workflows**: Verify regression paths and connected features that could have been affected by shared state or components.

## D. Use Appropriate Evidence & Multi-Viewport Inspection
Choose evidence that directly answers the question being investigated:
- **DOM Assertions & Snapshots**: Verify visible text, form values, accessible states, URLs, enabled or disabled controls, and dialog presence.
- **Screenshots for Visual Layout**: Inspect layout, clipping, overlap, alignment, text wrapping, and responsive presentation. Use both DOM evidence and screenshots when a component exists in the DOM but may still be visually unusable or occluded. Do not capture screenshots merely to make the report look complete; use them when they provide useful evidence.
- **Verify Relevant Viewports**: For responsive or layout-related changes, inspect the affected feature at appropriate viewport sizes, including mobile and desktop when relevant. Check that controls remain accessible, text is readable, content is not clipped, and elements do not overlap. Do not claim responsive behavior was verified unless the relevant viewport checks were actually performed.
- **Investigate Console & Network Activity**: Inspect browser console output and network requests/responses related to the changed workflow. Focus on errors introduced by the change or errors that prevent the feature from working. Distinguish pre-existing issues from newly introduced issues when evidence permits.
- **Verify Persisted Results**: Do not claim a request succeeded solely because the interface displayed a success message. Verify the response or persisted result when the workflow and available tools allow it.

## E. Fix and Re-verify (Iterative Loop)
When a problem or defect is found during verification:
1. **Describe the Problem**: Clearly state the observed behavior versus the expected behavior.
2. **Investigate Root Cause**: Identify the underlying cause before modifying the code.
3. **Explain to Learner**: Explain the fix in beginner-friendly terms.
4. **Make Minimal Correction**: Make the smallest appropriate correction to resolve the issue.
5. **Repeat Browser Workflow**: Re-run the exact browser workflow that exposed the problem to verify the fix.
6. **Rerun Automated Tests**: Execute relevant automated tests to guard against regressions.
- *Rule*: Do not mark a problem fixed until the relevant verification has been performed. If verification is blocked, report that limitation.

## F. Verify Honestly & Transparent Boundaries
- **Code Appearance != Working Software**: Never claim a feature works merely because the written code looks clean or correct.
- **Zero Fabrication**: Never invent browser interactions, screenshots, test results, HTTP status codes, or successful checks. A page loading successfully does not constitute verification of a feature.
- **Acknowledge Tool Limitations**: If Playwright MCP is unavailable, disconnected, or fails to launch, explicitly explain that limitation. Do not pretend to have used it.
- **Report Startup Failures Transparently**: If the application cannot start, report the actual error output and what remains unverified.
- **Explain When Browser QA Is Skipped**: If browser QA is not feasible or is unrelated to the change (e.g., documentation-only updates, backend-only endpoints), explain why and perform appropriate alternative checks.
- **Preserve Security & Integrity**: Do not bypass authentication, security controls, CSRF protections, or other safeguards merely to make a test pass.
- **Safe Test Data**: Use safe, isolated test data and avoid destructive actions against real user data.

## G. Produce an Evidence-Based QA Report
For every meaningful frontend change, provide a concise, honest, and specific report:
- **Route or Page Reviewed**: Exact URL or view tested.
- **Files or Features Changed**: What changed in the codebase and why.
- **Test Plan Derived from Change**: Scenarios selected based on the code diff.
- **Browser Actions Actually Performed**: Specific interactions executed (clicks, inputs, selections) and viewports tested.
- **Expected vs. Observed Outcomes**: Concrete outcomes verified (DOM updates, state persistence, error messages).
- **Evidence Inspected**: Relevant DOM state, screenshots, console logs, or network responses.
- **Automated Tests Executed**: Test suites run and their genuine results.
- **Bugs Found, Fixed & Re-verified**: Issues uncovered, fixes applied, and re-test results.
- **Remaining Failures & Unverified Items**: Anything that failed, was skipped, or remains unverified.

