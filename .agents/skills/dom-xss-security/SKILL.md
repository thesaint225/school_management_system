---
name: dom-xss-security
description: >-
  Enforces DOM security and XSS prevention patterns when rendering dynamic or API data in frontend JavaScript.
  Use this skill whenever creating or modifying DOM elements, populating <select> dropdowns, rendering table cells,
  displaying form feedback banners, or showing toast notifications, and before completing any frontend JS task.
---

# DOM Security & Data Rendering (XSS Prevention) Playbook

## Rule 1: Never Interpolate Dynamic Data Directly into `<option>` via `innerHTML`
- When dynamically populating dropdown `<select>` options with user or database data, **NEVER** use `.map().join('')` or string concatenation into `innerHTML`:
  ```javascript
  // ❌ FORBIDDEN: High XSS Risk (Stored XSS via attribute breakout or HTML injection)
  select.innerHTML = items.map(item => `<option value="${item.name}">${item.name}</option>`).join('');
  ```

## Rule 2: Always Use Safe DOM Methods (`createElement`, `textContent`, `appendChild`)
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

## Rule 3: General Dynamic Content Rendering
- For labels, table cells, spans, and headings receiving database or user inputs, prefer `element.textContent = data` instead of `element.innerHTML = data`.
- If dynamic HTML templates must be constructed, always sanitize or escape user-controlled strings (e.g., `&`, `<`, `>`, `"`, `'`) before embedding them into template literals.

## Rule 4: Form Feedback, Status Banners, and Toast Notifications
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

## Rule 5: Mandatory Pre-Completion XSS Check
- Before finishing any task that touches frontend JavaScript, inspect all DOM insertion points in the modified files:
  1. Check for `innerHTML`, `outerHTML`, `insertAdjacentHTML`, and `document.write`.
  2. Confirm that no user-controlled or API-supplied string reaches an unescaped HTML sink.
  3. Ensure all dropdown options, banners, and dynamic text use `textContent` or `createElement`.

