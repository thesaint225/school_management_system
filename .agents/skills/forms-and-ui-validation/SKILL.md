---
name: forms-and-ui-validation
description: >-
  Guides form implementation and field-level UI validation for the School Management System.
  Use this skill whenever creating, modifying, styling, or debugging HTML forms, input validation,
  blur event handlers, validation icons, ARIA validation attributes, or field error messages.
---

# Forms & UI Validation Playbook

Do not rely on previous conversations or assumptions. `AGENTS.md` and this skill are the project's source of truth for form validation.

## Step 1 — Confirm the Relevant Validation Rules

Before editing the code, explicitly list the validation rules that apply to the task. Verify that you enforce all of the following:

- **Trigger on Blur**: Validation happens when the user leaves a field (`blur`).
- **Explicit Visual Confirmation**: A valid field must receive explicit visual confirmation (a green checkmark/icon).
- **No Silent Confirmation**: Silence must **NOT** be treated as confirmation.
- **Actionable Error Messages**: An invalid field must explain **how to fix the problem**, not merely say that it is invalid. Error messages must be specific and actionable.
- **Design Tokens**:
  - Use `--status-success` for successful validation.
  - Use `--status-danger` for errors.
- **Accessibility**:
  - Validation feedback must be accessible and must not rely on color alone.
  - Maintain `aria-invalid` and appropriate `aria-describedby` relationships where applicable.

## Step 2 — Inspect the Existing Implementation

Before changing anything, inspect:
1. The existing form HTML generation.
2. Existing validation JavaScript.
3. Existing error elements.
4. Existing CSS for validation states.
5. `AGENTS.md` and this playbook.

Do not immediately rewrite the validation system.

## Step 3 — Implement

Modify the existing implementation so that it follows the rules while preserving:
- Existing field IDs.
- Existing form structure.
- Existing validation rules unless they are incorrect.
- Existing functionality.
- Existing design tokens.

Do not create a completely different validation system unless the current implementation makes the requirements impossible to satisfy.

## Step 4 — Verify Your Work

After implementing the changes, test each scenario mentally and, where possible, in the browser:

### Scenario A: Valid Field
```text
User enters valid value
        ↓
Leaves field (blur)
        ↓
Validation runs
        ↓
Green check / success state (--status-success) appears
```

### Scenario B: Invalid Field
```text
User enters invalid value
        ↓
Leaves field (blur)
        ↓
Validation runs
        ↓
Error state (--status-danger) appears
        ↓
Message explains exactly how to fix it
```

### Scenario C: Correcting an Error
```text
Invalid field
        ↓
User fixes value
        ↓
Leaves field (blur)
        ↓
Error disappears
        ↓
Green success state (--status-success) appears
```

## Step 5 — Final Compliance Check

Before finishing, compare your implementation against this playbook and `AGENTS.md`. If any implementation decision conflicts with the rules, fix it before reporting the task as complete. Do **NOT** report the task as complete if the implementation does not satisfy every rule above.

