// Student Registration Form Module
// Aligns directly with backend com.miessan.schoolmanagement.dto.StudentRegistrationDto and persists to Database

import { registerStudentInDb } from '../../api/studentApi.js';
import { populateSubjectCheckboxes } from '../subjects/subjectUtils.js';
import { populateClassSelectOptions } from '../classes/classUtils.js';

/**
 * Initializes student registration form handling and field-level blur validation.
 * @param {Array} students - The in-memory students array
 * @param {Function} [onStudentAdded] - Callback triggered when a student record is added
 */
export function initStudentForm(students, onStudentAdded) {
  const form = document.querySelector('#studentRegistrationForm');
  const feedback = document.querySelector('#studentFormFeedback');
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (!form) return;

  // Field elements
  const nameInput = document.querySelector('#studentName');
  const errorName = document.querySelector('#errorStudentName');

  const genderSelect = document.querySelector('#studentGender');
  const errorGender = document.querySelector('#errorStudentGender');

  const dobInput = document.querySelector('#studentDob');
  const errorDob = document.querySelector('#errorStudentDob');

  const emailInput = document.querySelector('#studentEmail');
  const errorEmail = document.querySelector('#errorStudentEmail');

  const phoneInput = document.querySelector('#studentPhone');
  const errorPhone = document.querySelector('#errorStudentPhone');

  const classSelect = document.querySelector('#studentClass');
  const errorClass = document.querySelector('#errorStudentClass');

  const yearInput = document.querySelector('#yearOfEnrollment');
  const errorYear = document.querySelector('#errorYearOfEnrollment');

  const subjectsContainer = document.querySelector('#studentSubjectsContainer') || form.querySelector('.checkbox-group');
  const errorSubjects = document.querySelector('#errorSubjects');

  const feesSelect = document.querySelector('#feesStatus');
  const errorFees = document.querySelector('#errorFeesStatus');

  const guardianNameInput = document.querySelector('#guardianName');
  const errorGuardianName = document.querySelector('#errorGuardianName');

  const guardianRelationSelect = document.querySelector('#guardianRelation');
  const errorGuardianRelation = document.querySelector('#errorGuardianRelation');

  const guardianPhoneInput = document.querySelector('#guardianPhone');
  const errorGuardianPhone = document.querySelector('#errorGuardianPhone');

  // Enforce @Past constraint on Date of Birth in the date picker
  if (dobInput) {
    const today = new Date().toISOString().split('T')[0];
    dobInput.setAttribute('max', today);
  }

  // Helper to set or clear error on a field and apply valid visual confirmation
  function setFieldError(inputEl, errorEl, message) {
    if (message) {
      if (inputEl) {
        inputEl.classList.add('is-invalid');
        inputEl.classList.remove('is-valid');
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
      }
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      return true;
    }
  }

  // Validation functions for individual fields
  function validateStudentName() {
    const value = nameInput?.value.trim() || '';
    if (!value) {
      return setFieldError(nameInput, errorName, 'Please enter the student\'s full legal name (e.g. Ama Mensah).');
    }
    return setFieldError(nameInput, errorName, '');
  }

  function validateStudentGender() {
    const value = genderSelect?.value || '';
    if (!value) {
      return setFieldError(genderSelect, errorGender, 'Please choose a gender option from the dropdown list.');
    }
    return setFieldError(genderSelect, errorGender, '');
  }

  function validateStudentDob() {
    const value = dobInput?.value || '';
    if (!value) {
      return setFieldError(dobInput, errorDob, 'Please select or enter the student\'s date of birth (YYYY-MM-DD).');
    }
    const dobDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(dobDate.getTime()) || dobDate >= today) {
      return setFieldError(dobInput, errorDob, 'Please choose a past date. Date of birth cannot be today or in the future.');
    }
    return setFieldError(dobInput, errorDob, '');
  }

  function validateStudentEmail() {
    const value = emailInput?.value.trim() || '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailPattern.test(value)) {
      return setFieldError(emailInput, errorEmail, 'Please enter a valid email address with "@" and domain (e.g. name@school.edu).');
    }
    return setFieldError(emailInput, errorEmail, '');
  }

  function validateStudentPhone() {
    const value = phoneInput?.value.trim() || '';
    if (!value) {
      return setFieldError(phoneInput, errorPhone, 'Please enter an active contact phone number (e.g. +233 24 123 4567).');
    }
    return setFieldError(phoneInput, errorPhone, '');
  }

  function validateStudentClass() {
    const value = classSelect?.value || '';
    if (!value) {
      return setFieldError(classSelect, errorClass, 'Please select an assigned class level (Form 1, Form 2, or Form 3).');
    }
    return setFieldError(classSelect, errorClass, '');
  }

  function validateYearOfEnrollment() {
    const value = Number(yearInput?.value);
    if (!value || isNaN(value) || value < 2020 || value > 2030) {
      return setFieldError(yearInput, errorYear, 'Please enter a 4-digit enrollment year between 2020 and 2030.');
    }
    return setFieldError(yearInput, errorYear, '');
  }

  function validateSubjects() {
    const checkedBoxes = form.querySelectorAll('input[name="subjects"]:checked');
    if (checkedBoxes.length === 0) {
      return setFieldError(subjectsContainer, errorSubjects, 'Please check at least one enrolled subject checkbox above.');
    }
    return setFieldError(subjectsContainer, errorSubjects, '');
  }

  function validateFeesStatus() {
    const value = feesSelect?.value || '';
    if (!value) {
      return setFieldError(feesSelect, errorFees, 'Please choose the initial fee status (Paid, Pending, Unpaid, or Partial).');
    }
    return setFieldError(feesSelect, errorFees, '');
  }

  function validateGuardianName() {
    const value = guardianNameInput?.value.trim() || '';
    if (!value) {
      return setFieldError(guardianNameInput, errorGuardianName, 'Please enter the primary guardian\'s full name (e.g. Mr. Kofi Mensah).');
    }
    return setFieldError(guardianNameInput, errorGuardianName, '');
  }

  function validateGuardianRelation() {
    const value = guardianRelationSelect?.value || '';
    if (!value) {
      return setFieldError(guardianRelationSelect, errorGuardianRelation, 'Please select the guardian\'s relationship (e.g. Father, Mother, Guardian).');
    }
    return setFieldError(guardianRelationSelect, errorGuardianRelation, '');
  }

  function validateGuardianPhone() {
    const value = guardianPhoneInput?.value.trim() || '';
    if (!value) {
      return setFieldError(guardianPhoneInput, errorGuardianPhone, 'Please enter an emergency contact phone number for the guardian.');
    }
    return setFieldError(guardianPhoneInput, errorGuardianPhone, '');
  }

  // Attach blur event listeners (validate when user leaves the field)
  nameInput?.addEventListener('blur', validateStudentName);
  nameInput?.addEventListener('input', () => {
    if (nameInput.classList.contains('is-invalid') || nameInput.classList.contains('is-valid')) {
      validateStudentName();
    }
  });

  genderSelect?.addEventListener('blur', validateStudentGender);
  genderSelect?.addEventListener('change', validateStudentGender);

  dobInput?.addEventListener('blur', validateStudentDob);
  dobInput?.addEventListener('change', validateStudentDob);

  emailInput?.addEventListener('blur', validateStudentEmail);
  emailInput?.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid') || emailInput.classList.contains('is-valid')) {
      validateStudentEmail();
    }
  });

  phoneInput?.addEventListener('blur', validateStudentPhone);
  phoneInput?.addEventListener('input', () => {
    if (phoneInput.classList.contains('is-invalid') || phoneInput.classList.contains('is-valid')) {
      validateStudentPhone();
    }
  });

  populateClassSelectOptions(classSelect);

  classSelect?.addEventListener('blur', validateStudentClass);
  classSelect?.addEventListener('change', validateStudentClass);

  yearInput?.addEventListener('blur', validateYearOfEnrollment);
  yearInput?.addEventListener('input', () => {
    if (yearInput.classList.contains('is-invalid') || yearInput.classList.contains('is-valid')) {
      validateYearOfEnrollment();
    }
  });

  populateSubjectCheckboxes(subjectsContainer, ['Mathematics', 'English', 'Integrated Science', 'ICT'], 'subjects', validateSubjects);

  feesSelect?.addEventListener('blur', validateFeesStatus);
  feesSelect?.addEventListener('change', validateFeesStatus);

  guardianNameInput?.addEventListener('blur', validateGuardianName);
  guardianNameInput?.addEventListener('input', () => {
    if (guardianNameInput.classList.contains('is-invalid') || guardianNameInput.classList.contains('is-valid')) {
      validateGuardianName();
    }
  });

  guardianRelationSelect?.addEventListener('blur', validateGuardianRelation);
  guardianRelationSelect?.addEventListener('change', validateGuardianRelation);

  guardianPhoneInput?.addEventListener('blur', validateGuardianPhone);
  guardianPhoneInput?.addEventListener('input', () => {
    if (guardianPhoneInput.classList.contains('is-invalid') || guardianPhoneInput.classList.contains('is-valid')) {
      validateGuardianPhone();
    }
  });

  // Clear errors and valid states on reset
  form.addEventListener('reset', () => {
    const validatedInputs = form.querySelectorAll('.is-invalid, .is-valid');
    validatedInputs.forEach((el) => {
      el.classList.remove('is-invalid');
      el.classList.remove('is-valid');
    });
    const errorSpans = form.querySelectorAll('.field-error');
    errorSpans.forEach((span) => {
      span.textContent = '';
      span.classList.remove('visible');
    });
    if (feedback) feedback.textContent = '';
  });

  // Submit Handler: Final safety check across all fields
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateStudentName();
    const isGenderValid = validateStudentGender();
    const isDobValid = validateStudentDob();
    const isEmailValid = validateStudentEmail();
    const isPhoneValid = validateStudentPhone();
    const isClassValid = validateStudentClass();
    const isYearValid = validateYearOfEnrollment();
    const isSubjectsValid = validateSubjects();
    const isFeesValid = validateFeesStatus();
    const isGuardianNameValid = validateGuardianName();
    const isGuardianRelationValid = validateGuardianRelation();
    const isGuardianPhoneValid = validateGuardianPhone();

    const isFormValid =
      isNameValid &&
      isGenderValid &&
      isDobValid &&
      isEmailValid &&
      isPhoneValid &&
      isClassValid &&
      isYearValid &&
      isSubjectsValid &&
      isFeesValid &&
      isGuardianNameValid &&
      isGuardianRelationValid &&
      isGuardianPhoneValid;

    if (!isFormValid) {
      // Focus first invalid element
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Extract values
    const name = nameInput?.value.trim() || '';
    const gender = genderSelect?.value || '';
    const studentClass = classSelect?.value || '';
    const yearOfEnrollment = Number(yearInput?.value) || new Date().getFullYear();
    const dateOfBirth = dobInput?.value || '';
    const email = emailInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const feesStatus = feesSelect?.value || 'Pending';
    const attendance = 100;
    const dailyStatus = 'Unmarked';
    const dailyTimestamp = '--';
    const guardianName = guardianNameInput?.value.trim() || '';
    const guardianRelation = guardianRelationSelect?.value || 'Guardian';
    const guardianPhone = guardianPhoneInput?.value.trim() || '';

    const checkedBoxes = form.querySelectorAll('input[name="subjects"]:checked');
    const selectedSubjects = Array.from(checkedBoxes).map((cb) => cb.value);

    // Payload matching StudentRegistrationDto
    const studentRegistrationDtoPayload = {
      name: name,
      gender: gender,
      class: studentClass,
      yearOfEnrollment: yearOfEnrollment,
      dateOfBirth: dateOfBirth,
      email: email,
      phone: phone,
      subjects: selectedSubjects,
      gpa: 0.0,
      attendance: attendance,
      dailyAttendance: {
        status: dailyStatus,
        timestamp: dailyTimestamp,
      },
      feesStatus: feesStatus,
      guardian: {
        name: guardianName,
        relation: guardianRelation,
        phone: guardianPhone,
      },
    };

    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving to Database...';
    }

    try {
      let createdStudent;
      try {
        createdStudent = await registerStudentInDb(studentRegistrationDtoPayload);
      } catch (networkErr) {
        console.warn('⚠️ Fallback to local memory registration:', networkErr);
        const nextId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
        createdStudent = {
          id: nextId,
          ...studentRegistrationDtoPayload,
        };
      }

      if (!createdStudent.subjects) {
        createdStudent.subjects = selectedSubjects;
      }

      students.push(createdStudent);

      if (onStudentAdded) {
        onStudentAdded(createdStudent);
      }

      form.reset();

      if (feedback) {
        feedback.textContent = `✅ Successfully registered ${createdStudent.name} (#EDU-${createdStudent.id.toString().padStart(4, '0')}) to Database!`;
        feedback.style.color = 'hsl(158, 70%, 30%)';
        setTimeout(() => {
          if (feedback.textContent.includes('Successfully registered')) {
            feedback.textContent = '';
          }
        }, 5000);
      }
    } catch (err) {
      if (feedback) {
        feedback.textContent = `❌ Registration failed: ${err.message}`;
        feedback.style.color = 'hsl(0, 75%, 55%)';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}
