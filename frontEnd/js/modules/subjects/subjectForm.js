// subjectForm.js - Course / Subject Creation Form Module
// Connects to Spring Boot backend via subjectApi.js and enforces accessible blur validation

import { createSubjectInDb } from '../../api/subjectApi.js';

export function initSubjectForm(subjects, onSubjectAdded) {
  const form = document.querySelector('#subjectCreationForm');
  const feedback = document.querySelector('#subjectFormFeedback');
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (!form) return;

  const nameInput = document.querySelector('#subjectTitle');
  const errorName = document.querySelector('#errorSubjectTitle');

  const codeInput = document.querySelector('#subjectCode');
  const errorCode = document.querySelector('#errorSubjectCode');

  const deptSelect = document.querySelector('#subjectDepartment');
  const errorDept = document.querySelector('#errorSubjectDepartment');

  const descInput = document.querySelector('#subjectDescription');
  const activeInput = document.querySelector('#subjectActive');

  function setFieldError(inputEl, errorEl, message) {
    if (message) {
      if (inputEl) {
        inputEl.classList.add('is-invalid');
        inputEl.classList.remove('is-valid');
        inputEl.setAttribute('aria-invalid', 'true');
      }
      if (errorEl) {
        errorEl.textContent = `⚠️ ${message}`;
        errorEl.classList.add('visible');
      }
      return false;
    } else {
      if (inputEl) {
        inputEl.classList.remove('is-invalid');
        inputEl.classList.add('is-valid');
        inputEl.setAttribute('aria-invalid', 'false');
      }
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      return true;
    }
  }

  function validateTitle() {
    const val = nameInput?.value.trim() || '';
    if (!val) {
      return setFieldError(nameInput, errorName, 'Please enter a valid subject title (e.g. Mathematics, English).');
    }
    return setFieldError(nameInput, errorName, '');
  }

  function validateCode() {
    const val = codeInput?.value.trim() || '';
    if (!val) {
      return setFieldError(codeInput, errorCode, 'Please enter a course code (e.g. MTH-101, SCI-101).');
    }
    return setFieldError(codeInput, errorCode, '');
  }

  function validateDepartment() {
    const val = deptSelect?.value || '';
    if (!val) {
      return setFieldError(deptSelect, errorDept, 'Please choose an academic department from the list.');
    }
    return setFieldError(deptSelect, errorDept, '');
  }

  // Attach blur and change listeners per AGENTS.md
  nameInput?.addEventListener('blur', validateTitle);
  codeInput?.addEventListener('blur', validateCode);
  deptSelect?.addEventListener('blur', validateDepartment);
  deptSelect?.addEventListener('change', validateDepartment);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isTitleValid = validateTitle();
    const isCodeValid = validateCode();
    const isDeptValid = validateDepartment();

    if (!isTitleValid || !isCodeValid || !isDeptValid) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = '⚠️ Please fix all highlighted fields before submitting.';
      }
      return;
    }

    const subjectDto = {
      name: nameInput.value.trim(),
      code: codeInput.value.trim(),
      department: deptSelect.value,
      description: descInput?.value.trim() || '',
      active: activeInput ? activeInput.checked : true,
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Creating Subject...</span>';
    }

    if (feedback) {
      feedback.className = 'form-feedback info';
      feedback.textContent = 'Saving subject to database...';
    }

    try {
      const createdSubject = await createSubjectInDb(subjectDto);
      subjects.push(createdSubject);

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.replaceChildren();
        const strong = document.createElement('strong');
        strong.textContent = createdSubject.name;
        feedback.append('✅ Successfully created ', strong, ` (${createdSubject.code || '#' + createdSubject.id})!`);
      }

      // Reset form
      form.reset();

      // Clear validation state classes
      form.querySelectorAll('.is-valid, .is-invalid').forEach((el) => {
        el.classList.remove('is-valid', 'is-invalid');
      });
      form.querySelectorAll('.field-error').forEach((el) => {
        el.textContent = '';
        el.classList.remove('visible');
      });

      if (typeof onSubjectAdded === 'function') {
        onSubjectAdded(createdSubject);
      }

      setTimeout(() => {
        if (feedback) {
          feedback.textContent = '';
          feedback.className = 'form-feedback';
        }
      }, 5000);
    } catch (error) {
      console.error('Error creating subject:', error);
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = `❌ Subject creation failed: ${error.message}`;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>➕ Create & Add Subject</span>';
      }
    }
  });
}
