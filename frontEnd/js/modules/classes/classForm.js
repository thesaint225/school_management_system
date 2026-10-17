// classForm.js - Class Creation Form Module
// Connects to Spring Boot backend via classApi.js and enforces accessible blur validation

import { createClassInDb } from '../../api/classApi.js';

export function initClassForm(classes, onClassAdded) {
  const form = document.querySelector('#classCreationForm');
  const feedback = document.querySelector('#classFormFeedback');
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (!form) return;

  const nameInput = form.querySelector('#className');
  const errorName = form.querySelector('#errorClassName');

  const descInput = form.querySelector('#classDescription');
  const activeInput = form.querySelector('#classActive');

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
      return setFieldError(nameInput, errorName, 'Please enter a valid class title (e.g. Form 1, Form 2, Grade 10).');
    }
    return setFieldError(nameInput, errorName, '');
  }

  nameInput?.addEventListener('blur', validateTitle);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateTitle()) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = '⚠️ Please fix all highlighted fields before submitting.';
      }
      return;
    }

    const classDto = {
      name: nameInput.value.trim(),
      description: descInput?.value.trim() || '',
      active: activeInput ? activeInput.checked : true,
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Creating Class...</span>';
    }

    if (feedback) {
      feedback.className = 'form-feedback info';
      feedback.textContent = 'Saving class to database...';
    }

    try {
      const createdClass = await createClassInDb(classDto);
      classes.push(createdClass);

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.replaceChildren();
        const strong = document.createElement('strong');
        strong.textContent = createdClass.name;
        feedback.append('✅ Successfully created ', strong, ` (#CLS-${createdClass.id})!`);
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

      if (typeof onClassAdded === 'function') {
        onClassAdded(createdClass);
      }

      setTimeout(() => {
        if (feedback) {
          feedback.textContent = '';
          feedback.className = 'form-feedback';
        }
      }, 5000);
    } catch (error) {
      console.error('Error creating class:', error);
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = `❌ Class creation failed: ${error.message}`;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>➕ Create & Add Class</span>';
      }
    }
  });
}
