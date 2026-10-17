// teacherForm.js - Teacher Registration ("Hire Teacher") Form Module
// Connects to Spring Boot backend via teacherApi.js and enforces accessible blur validation

import { registerTeacherInDb } from '../../api/teacherApi.js';
import { populateSubjectCheckboxes } from '../subjects/subjectUtils.js';
import { populateClassCheckboxes } from '../classes/classUtils.js';

export function initTeacherForm(teachers, onTeacherAdded) {
  const form = document.querySelector('#teacherRegistrationForm');
  const feedback = document.querySelector('#teacherFormFeedback');
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (!form) return;

  const fnInput = document.querySelector('#teacherFirstName');
  const errorFn = document.querySelector('#errorTeacherFirstName');

  const lnInput = document.querySelector('#teacherLastName');
  const errorLn = document.querySelector('#errorTeacherLastName');

  const genderSelect = document.querySelector('#teacherGender');
  const errorGender = document.querySelector('#errorTeacherGender');

  const dobInput = document.querySelector('#teacherDob');
  const errorDob = document.querySelector('#errorTeacherDob');

  const hireDateInput = document.querySelector('#teacherHireDate');
  const errorHireDate = document.querySelector('#errorTeacherHireDate');

  const deptSelect = document.querySelector('#teacherDepartment');
  const errorDept = document.querySelector('#errorTeacherDepartment');

  const qualInput = document.querySelector('#teacherQualification');
  const errorQual = document.querySelector('#errorTeacherQualification');

  const statusSelect = document.querySelector('#teacherStatus');
  const errorStatus = document.querySelector('#errorTeacherStatus');

  const emailInput = document.querySelector('#teacherEmail');
  const errorEmail = document.querySelector('#errorTeacherEmail');

  const phoneInput = document.querySelector('#teacherPhone');
  const errorPhone = document.querySelector('#errorTeacherPhone');

  const subjectsContainer = document.querySelector('#teacherSubjectsContainer');
  const errorSubjects = document.querySelector('#errorTeacherSubjects');

  const classesContainer = document.querySelector('#teacherClassesContainer');
  const errorClasses = document.querySelector('#errorTeacherClasses');

  // Enforce past date constraint on DOB
  if (dobInput) {
    const today = new Date().toISOString().split('T')[0];
    dobInput.setAttribute('max', today);
  }

  // Pre-fill hire date with today if empty
  if (hireDateInput && !hireDateInput.value) {
    hireDateInput.value = new Date().toISOString().split('T')[0];
  }

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

  function validateFirstName() {
    const val = fnInput?.value.trim() || '';
    if (!val) {
      return setFieldError(fnInput, errorFn, "Please enter the teacher's first name (e.g. Kwame).");
    }
    return setFieldError(fnInput, errorFn, '');
  }

  function validateLastName() {
    const val = lnInput?.value.trim() || '';
    if (!val) {
      return setFieldError(lnInput, errorLn, "Please enter the teacher's last name (e.g. Asante).");
    }
    return setFieldError(lnInput, errorLn, '');
  }

  function validateGender() {
    const val = genderSelect?.value || '';
    if (!val) {
      return setFieldError(genderSelect, errorGender, 'Please choose a gender option from the dropdown list.');
    }
    return setFieldError(genderSelect, errorGender, '');
  }

  function validateDob() {
    const val = dobInput?.value || '';
    if (!val) {
      return setFieldError(dobInput, errorDob, "Please select or enter the teacher's date of birth (YYYY-MM-DD).");
    }
    const d = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(d.getTime()) || d >= today) {
      return setFieldError(dobInput, errorDob, 'Please choose a past date. Date of birth cannot be today or in the future.');
    }
    return setFieldError(dobInput, errorDob, '');
  }

  function validateHireDate() {
    const val = hireDateInput?.value || '';
    if (!val) {
      return setFieldError(hireDateInput, errorHireDate, 'Please enter the official hire / appointment date.');
    }
    return setFieldError(hireDateInput, errorHireDate, '');
  }

  function validateDepartment() {
    const val = deptSelect?.value || '';
    if (!val) {
      return setFieldError(deptSelect, errorDept, 'Please choose the academic department from the list.');
    }
    return setFieldError(deptSelect, errorDept, '');
  }

  function validateQualification() {
    const val = qualInput?.value.trim() || '';
    if (!val) {
      return setFieldError(qualInput, errorQual, 'Please enter the teacher\'s highest academic qualification (e.g. B.Ed. Mathematics, M.Sc. Physics).');
    }
    return setFieldError(qualInput, errorQual, '');
  }

  function validateStatus() {
    const val = statusSelect?.value || '';
    if (!val) {
      return setFieldError(statusSelect, errorStatus, 'Please select the teacher\'s employment status.');
    }
    return setFieldError(statusSelect, errorStatus, '');
  }

  function validateEmail() {
    const val = emailInput?.value.trim() || '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val || !emailPattern.test(val)) {
      return setFieldError(emailInput, errorEmail, 'Please enter a valid staff email address with "@" and domain (e.g. name@school.edu).');
    }
    return setFieldError(emailInput, errorEmail, '');
  }

  function validatePhone() {
    const val = phoneInput?.value.trim() || '';
    if (!val) {
      return setFieldError(phoneInput, errorPhone, 'Please enter an active contact phone number (e.g. +233 24 456 7890).');
    }
    return setFieldError(phoneInput, errorPhone, '');
  }

  function validateSubjects() {
    const checked = form.querySelectorAll('input[name="teacherSubjects"]:checked');
    if (checked.length === 0) {
      return setFieldError(subjectsContainer, errorSubjects, 'Please check at least one assigned teaching subject.');
    }
    return setFieldError(subjectsContainer, errorSubjects, '');
  }

  function validateClasses() {
    const checked = form.querySelectorAll('input[name="teacherClasses"]:checked');
    if (checked.length === 0) {
      return setFieldError(classesContainer, errorClasses, 'Please check at least one assigned class allocation.');
    }
    return setFieldError(classesContainer, errorClasses, '');
  }

  // Attach blur and change listeners per AGENTS.md
  fnInput?.addEventListener('blur', validateFirstName);
  lnInput?.addEventListener('blur', validateLastName);
  genderSelect?.addEventListener('blur', validateGender);
  genderSelect?.addEventListener('change', validateGender);
  dobInput?.addEventListener('blur', validateDob);
  dobInput?.addEventListener('change', validateDob);
  hireDateInput?.addEventListener('blur', validateHireDate);
  hireDateInput?.addEventListener('change', validateHireDate);
  deptSelect?.addEventListener('blur', validateDepartment);
  deptSelect?.addEventListener('change', validateDepartment);
  qualInput?.addEventListener('blur', validateQualification);
  statusSelect?.addEventListener('blur', validateStatus);
  statusSelect?.addEventListener('change', validateStatus);
  emailInput?.addEventListener('blur', validateEmail);
  phoneInput?.addEventListener('blur', validatePhone);

  populateSubjectCheckboxes(subjectsContainer, ['Mathematics'], 'teacherSubjects', validateSubjects);
  populateClassCheckboxes(classesContainer, ['Form 1A'], 'teacherClasses', validateClasses);

  // Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isFnValid = validateFirstName();
    const isLnValid = validateLastName();
    const isGenderValid = validateGender();
    const isDobValid = validateDob();
    const isHireDateValid = validateHireDate();
    const isDeptValid = validateDepartment();
    const isQualValid = validateQualification();
    const isStatusValid = validateStatus();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isSubjectsValid = validateSubjects();
    const isClassesValid = validateClasses();

    if (!isFnValid || !isLnValid || !isGenderValid || !isDobValid || !isHireDateValid ||
        !isDeptValid || !isQualValid || !isStatusValid || !isEmailValid || !isPhoneValid ||
        !isSubjectsValid || !isClassesValid) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = '⚠️ Please fix all highlighted fields before submitting.';
      }
      return;
    }

    const selectedSubjects = Array.from(
      form.querySelectorAll('input[name="teacherSubjects"]:checked')
    ).map((cb) => cb.value);

    const selectedClasses = Array.from(
      form.querySelectorAll('input[name="teacherClasses"]:checked')
    ).map((cb) => cb.value);

    const teacherDto = {
      firstName: fnInput.value.trim(),
      lastName: lnInput.value.trim(),
      gender: genderSelect.value,
      dateOfBirth: dobInput.value,
      hireDate: hireDateInput.value,
      department: deptSelect.value,
      qualification: qualInput.value.trim(),
      employmentStatus: statusSelect.value,
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      subjects: selectedSubjects,
      classes: selectedClasses,
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Registering Teacher...</span>';
    }

    if (feedback) {
      feedback.className = 'form-feedback info';
      feedback.textContent = 'Saving teacher record to database...';
    }

    try {
      const createdTeacher = await registerTeacherInDb(teacherDto);
      teachers.push(createdTeacher);

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.replaceChildren();
        const teacherName = createdTeacher.name || `${createdTeacher.firstName || ''} ${createdTeacher.lastName || ''}`.trim();
        const strong = document.createElement('strong');
        strong.textContent = teacherName;
        feedback.append('✅ Successfully registered ', strong, ` (${createdTeacher.teacherNumber || '#' + createdTeacher.id})!`);
      }

      // Reset form
      form.reset();
      if (hireDateInput) {
        hireDateInput.value = new Date().toISOString().split('T')[0];
      }

      // Clear validation state classes
      form.querySelectorAll('.is-valid, .is-invalid').forEach((el) => {
        el.classList.remove('is-valid', 'is-invalid');
      });
      form.querySelectorAll('.field-error').forEach((el) => {
        el.textContent = '';
        el.classList.remove('visible');
      });

      if (typeof onTeacherAdded === 'function') {
        onTeacherAdded(createdTeacher);
      }

      setTimeout(() => {
        if (feedback) {
          feedback.textContent = '';
          feedback.className = 'form-feedback';
        }
      }, 5000);
    } catch (error) {
      console.error('Error during teacher registration:', error);
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = `❌ Registration failed: ${error.message}`;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>➕ Register & Hire Teacher</span>';
      }
    }
  });
}
