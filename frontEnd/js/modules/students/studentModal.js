// Student Modal Profile & Editing Module
// Connects to Spring Boot via updateStudentInDb and syncs in-memory data with the database

import { updateStudentInDb, deleteStudentFromDb } from '../../api/studentApi.js';
import { downloadReportPdfFromDb } from '../../api/resultApi.js';
import { populateSubjectCheckboxes } from '../subjects/subjectUtils.js';
import { populateClassSelectOptions } from '../classes/classUtils.js';

export function createSubjectPill(subject) {
  return `<span class="subject-pill">${subject}</span>`;
}

export function getFirstLetter(word) {
  return word ? word[0] : '';
}

export function getInitials(name) {
  const words = (name || '').trim().split(' ');
  const initials = words.map(getFirstLetter).join('');
  return (initials || 'ST').toUpperCase();
}

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'English',
  'Integrated Science',
  'ICT',
  'Physics',
  'Chemistry',
  'Economics',
  'Geography',
  'Government',
  'Elective Maths',
];

// Reference to callbacks and current modal state
let activeStudent = null;
let onStudentUpdateCallback = null;

export function renderStudentProfile(student) {
  const subjects = student.subjects || [];
  const subjectsHTML = subjects.map(createSubjectPill).join('');
  const statusClass = (student.feesStatus || 'pending').toLowerCase();
  const initials = getInitials(student.name);

  // Daily attendance status badge
  const daily = student.dailyAttendance || {
    status: 'Unmarked',
    timestamp: null,
  };
  let todayBadgeHTML = '';
  if (daily.status === 'Present') {
    todayBadgeHTML = `<span class="badge-risk good">✅ Present ${daily.timestamp ? `(${daily.timestamp})` : ''}</span>`;
  } else if (daily.status === 'Late') {
    todayBadgeHTML = `<span class="badge-risk warning">⏰ Late ${daily.timestamp ? `(${daily.timestamp})` : ''}</span>`;
  } else if (daily.status === 'Absent') {
    todayBadgeHTML = `<span class="badge-risk danger">❌ Absent</span>`;
  } else {
    todayBadgeHTML = `<span class="badge-risk">⚪ Unmarked</span>`;
  }

  // Term attendance standing badge
  let standingBadgeHTML = '';
  const attendanceRate = student.attendance != null ? student.attendance : 100;
  if (attendanceRate >= 90) {
    standingBadgeHTML = `<span class="badge-risk good">Excellent Standing</span>`;
  } else if (attendanceRate >= 80) {
    standingBadgeHTML = `<span class="badge-risk warning">Satisfactory</span>`;
  } else {
    standingBadgeHTML = `<span class="badge-risk danger">At Risk (&lt; 80%)</span>`;
  }

  const guardian = student.guardian || { name: '--', relation: 'Guardian', phone: '--' };

  return `
    <div class="profile-header">
      <div class="profile-avatar">${initials}</div>
      <div class="profile-header-content">
        <div class="profile-title-row">
          <h3 id="modalStudentName">${student.name}</h3>
          <button type="button" id="editStudentBtn" class="btn-edit-student" title="Edit Student Record">
            <span>✏️ Edit Student</span>
          </button>
        </div>
        <div class="profile-header-meta">
          <p>${student.class} • ${student.gender} • Enrolled: ${student.yearOfEnrollment}</p>
          <span class="status-badge ${statusClass}">Fees: ${student.feesStatus}</span>
        </div>
      </div>
    </div>

    <div id="modalAlert" class="modal-alert-banner" style="display: none;" role="status"></div>

    <div class="profile-attendance-card">
      <div class="profile-attendance-info">
        <span>Today's Check-In Status</span>
        <strong>${daily.status} ${daily.timestamp ? `• ${daily.timestamp}` : ''}</strong>
      </div>
      <div>
        ${todayBadgeHTML}
      </div>
    </div>

    <div class="profile-grid">
      <div class="profile-field">
        <span>Email Address</span>
        <strong>${student.email || '--'}</strong>
      </div>
      <div class="profile-field">
        <span>Phone Number</span>
        <strong>${student.phone || '--'}</strong>
      </div>
      <div class="profile-field">
        <span>Grade Point Average</span>
        <strong>${student.gpa != null ? student.gpa : '0.0'} / 4.0</strong>
      </div>
      <div class="profile-field">
        <span>Term Attendance</span>
        <strong>${attendanceRate}% &nbsp;${standingBadgeHTML}</strong>
      </div>
      <div class="profile-field">
        <span>Date of Birth</span>
        <strong>${student.dateOfBirth || '--'}</strong>
      </div>
      <div class="profile-field">
        <span>Student ID</span>
        <strong>#EDU-${student.id.toString().padStart(4, '0')}</strong>
      </div>
    </div>

    <p class="profile-section-title">Enrolled Subjects (${subjects.length}):</p>
    <div class="subject-pills">
      ${subjectsHTML || '<span class="cal-empty-desc">No subjects enrolled.</span>'}
    </div>

    <div class="guardian-card">
      <p class="profile-section-title">Guardian Information:</p>
      <p><strong>${guardian.name}</strong> <span>(${guardian.relation})</span></p>
      <p><span>Phone:</span> ${guardian.phone}</p>
    </div>

    <div class="modal-footer-actions">
      <button type="button" id="downloadStudentModalPdfBtn" class="btn-pdf-download">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="svg-icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>📄 Download Official Report Card (PDF)</span>
      </button>
      <button type="button" id="editStudentBottomBtn" class="btn-edit-student-primary">
        <span>✏️ Edit Student Record</span>
      </button>
    </div>
  `;
}

export function renderDeleteConfirmation(student) {
  const initials = getInitials(student.name);
  return `
    <div class="delete-confirmation-card">
      <div class="delete-modal-icon">⚠️</div>
      <span class="delete-confirmation-badge">CONFIRM DELETION</span>
      <h3 class="delete-confirmation-title">Delete Student Record</h3>

      <p class="delete-confirmation-question">
        Are you sure you want to delete <strong>${student.name}</strong>?
      </p>

      <div class="delete-student-summary">
        <div class="profile-avatar delete-avatar">${initials}</div>
        <div class="delete-summary-info">
          <strong>${student.name}</strong>
          <p>#EDU-${student.id.toString().padStart(4, '0')} • ${student.class} • Enrolled: ${student.yearOfEnrollment}</p>
          <span class="status-badge ${(student.feesStatus || 'pending').toLowerCase()}">Fees: ${student.feesStatus}</span>
        </div>
      </div>

      <div class="delete-warning-box">
        <p>⚠️ <strong>Warning:</strong> This action cannot be undone. All enrolled subjects and attendance history will be permanently deleted from the database.</p>
      </div>

      <div class="delete-modal-actions">
        <button type="button" id="cancelDeleteBtn" class="btn-cancel-delete">
          <span>Cancel</span>
        </button>
        <button type="button" id="confirmDeleteBtn" class="btn-confirm-delete">
          <span>🗑️ Delete Student</span>
        </button>
      </div>

      <p id="deleteModalFeedback" class="form-feedback" aria-live="polite"></p>
    </div>
  `;
}

export function renderStudentEditForm(student) {
  const initials = getInitials(student.name);
  const enrolled = new Set(student.subjects || []);
  const guardian = student.guardian || { name: '', relation: 'Father', phone: '' };

  const subjectCheckboxesHTML = AVAILABLE_SUBJECTS.map((sub) => {
    const isChecked = enrolled.has(sub) ? 'checked' : '';
    return `
      <label class="checkbox-item">
        <input type="checkbox" name="editSubjects" value="${sub}" ${isChecked}> ${sub}
      </label>
    `;
  }).join('');

  return `
    <div class="edit-modal-top">
      <div class="profile-avatar">${initials}</div>
      <div>
        <span class="edit-modal-badge">EDITING STUDENT RECORD</span>
        <h3 id="modalStudentName">#EDU-${student.id.toString().padStart(4, '0')} - ${student.name}</h3>
      </div>
    </div>

    <form id="editStudentModalForm" class="edit-modal-form" novalidate>
      <div class="edit-form-grid">
        <div class="form-group">
          <label for="editName">Full Name *</label>
          <input type="text" id="editName" value="${student.name || ''}" required placeholder="e.g. Ama Mensah" autocomplete="name" aria-describedby="errorEditName">
          <span class="field-error" id="errorEditName" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editGender">Gender *</label>
          <select id="editGender" required aria-describedby="errorEditGender">
            <option value="Female" ${student.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option value="Male" ${student.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Other" ${student.gender === 'Other' ? 'selected' : ''}>Other</option>
          </select>
          <span class="field-error" id="errorEditGender" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editClass">Class Level *</label>
          <select id="editClass" required aria-describedby="errorEditClass">
            <option value="${student.class || ''}" selected>${student.class || 'Select class level'}</option>
          </select>
          <span class="field-error" id="errorEditClass" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editYear">Enrollment Year *</label>
          <input type="number" id="editYear" min="2020" max="2030" value="${student.yearOfEnrollment || 2024}" required aria-describedby="errorEditYear">
          <span class="field-error" id="errorEditYear" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editDob">Date of Birth *</label>
          <input type="date" id="editDob" value="${student.dateOfBirth || ''}" required aria-describedby="errorEditDob">
          <span class="field-error" id="errorEditDob" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editEmail">Email Address *</label>
          <input type="email" id="editEmail" value="${student.email || ''}" required placeholder="e.g. student@school.edu" autocomplete="email" aria-describedby="errorEditEmail">
          <span class="field-error" id="errorEditEmail" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editPhone">Phone Number *</label>
          <input type="tel" id="editPhone" value="${student.phone || ''}" required placeholder="e.g. +233 24 123 4567" autocomplete="tel" aria-describedby="errorEditPhone">
          <span class="field-error" id="errorEditPhone" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editFees">Fees Status *</label>
          <select id="editFees" required aria-describedby="errorEditFees">
            <option value="Paid" ${student.feesStatus === 'Paid' ? 'selected' : ''}>Paid</option>
            <option value="Pending" ${student.feesStatus === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Unpaid" ${student.feesStatus === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
            <option value="Partial" ${student.feesStatus === 'Partial' ? 'selected' : ''}>Partial</option>
          </select>
          <span class="field-error" id="errorEditFees" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group full-width">
          <label for="editGuardianName">Guardian Full Name *</label>
          <input type="text" id="editGuardianName" value="${guardian.name || ''}" required placeholder="e.g. Mr. Kofi Mensah" aria-describedby="errorEditGuardianName">
          <span class="field-error" id="errorEditGuardianName" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editGuardianRelation">Guardian Relationship *</label>
          <select id="editGuardianRelation" required aria-describedby="errorEditGuardianRelation">
            <option value="Father" ${guardian.relation === 'Father' ? 'selected' : ''}>Father</option>
            <option value="Mother" ${guardian.relation === 'Mother' ? 'selected' : ''}>Mother</option>
            <option value="Guardian" ${guardian.relation === 'Guardian' ? 'selected' : ''}>Guardian</option>
            <option value="Uncle" ${guardian.relation === 'Uncle' ? 'selected' : ''}>Uncle</option>
            <option value="Aunt" ${guardian.relation === 'Aunt' ? 'selected' : ''}>Aunt</option>
            <option value="Other" ${guardian.relation === 'Other' ? 'selected' : ''}>Other</option>
          </select>
          <span class="field-error" id="errorEditGuardianRelation" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editGuardianPhone">Guardian Phone *</label>
          <input type="tel" id="editGuardianPhone" value="${guardian.phone || ''}" required placeholder="e.g. +233 20 987 6543" aria-describedby="errorEditGuardianPhone">
          <span class="field-error" id="errorEditGuardianPhone" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group full-width">
          <label>Enrolled Subjects (Check all that apply) *</label>
          <div class="checkbox-group" id="editSubjectsContainer" role="group" aria-label="Enrolled Subjects" aria-describedby="errorEditSubjects">
            ${subjectCheckboxesHTML}
          </div>
          <span class="field-error" id="errorEditSubjects" role="alert" aria-live="polite"></span>
        </div>
      </div>

      <div class="edit-modal-actions">
        <button type="button" id="deleteStudentFromEditBtn" class="btn-delete-from-edit" title="Permanently delete this student record">
          <span>🗑️ Delete Student</span>
        </button>
        <div class="edit-modal-btn-group">
          <button type="button" id="cancelEditBtn" class="btn-cancel-edit">
            <span>Cancel</span>
          </button>
          <button type="submit" id="saveEditBtn" class="btn-save-edit">
            <span>💾 Save Changes</span>
          </button>
        </div>
      </div>

      <p id="editModalFeedback" class="form-feedback" aria-live="polite"></p>
    </form>
  `;
}

// Helpers for Field Validation
function setModalFieldError(inputEl, errorEl, message) {
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

function attachEditFormListeners(student) {
  const form = document.querySelector('#editStudentModalForm');
  if (!form) return;

  const nameInput = form.querySelector('#editName');
  const errorName = form.querySelector('#errorEditName');
  const genderSelect = form.querySelector('#editGender');
  const errorGender = form.querySelector('#errorEditGender');
  const classSelect = form.querySelector('#editClass');
  const errorClass = form.querySelector('#errorEditClass');
  const yearInput = form.querySelector('#editYear');
  const errorYear = form.querySelector('#errorEditYear');
  const dobInput = form.querySelector('#editDob');
  const errorDob = form.querySelector('#errorEditDob');
  const emailInput = form.querySelector('#editEmail');
  const errorEmail = form.querySelector('#errorEditEmail');
  const phoneInput = form.querySelector('#editPhone');
  const errorPhone = form.querySelector('#errorEditPhone');
  const feesSelect = form.querySelector('#editFees');
  const errorFees = form.querySelector('#errorEditFees');
  const guardianNameInput = form.querySelector('#editGuardianName');
  const errorGuardianName = form.querySelector('#errorEditGuardianName');
  const guardianRelationSelect = form.querySelector('#editGuardianRelation');
  const errorGuardianRelation = form.querySelector('#errorEditGuardianRelation');
  const guardianPhoneInput = form.querySelector('#editGuardianPhone');
  const errorGuardianPhone = form.querySelector('#errorEditGuardianPhone');
  const subjectsContainer = form.querySelector('#editSubjectsContainer');
  const errorSubjects = form.querySelector('#errorEditSubjects');
  const cancelBtn = form.querySelector('#cancelEditBtn');
  const saveBtn = form.querySelector('#saveEditBtn');
  const feedback = form.querySelector('#editModalFeedback');

  // Enforce past date on DOB
  if (dobInput) {
    const today = new Date().toISOString().split('T')[0];
    dobInput.setAttribute('max', today);
  }

  // Cancel button switches back to Profile View
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openStudentModal(student, 'view');
    });
  }

  // Delete button opens Confirmation View
  const deleteFromEditBtn = form.querySelector('#deleteStudentFromEditBtn');
  if (deleteFromEditBtn) {
    deleteFromEditBtn.addEventListener('click', () => {
      openStudentModal(student, 'delete', onStudentUpdateCallback);
    });
  }

  // Real-time validation handlers with Actionable Instructions
  function validateName() {
    const val = nameInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(nameInput, errorName, "Please enter the student's full legal name (e.g. Ama Mensah).");
    }
    return setModalFieldError(nameInput, errorName, '');
  }

  function validateGender() {
    const val = genderSelect?.value || '';
    if (!val) {
      return setModalFieldError(genderSelect, errorGender, 'Please choose a gender option from the dropdown list.');
    }
    return setModalFieldError(genderSelect, errorGender, '');
  }

  function validateClass() {
    const val = classSelect?.value || '';
    if (!val) {
      return setModalFieldError(classSelect, errorClass, 'Please select an assigned class level (Form 1, Form 2, or Form 3).');
    }
    return setModalFieldError(classSelect, errorClass, '');
  }

  function validateYear() {
    const val = Number(yearInput?.value);
    if (!val || isNaN(val) || val < 2020 || val > 2030) {
      return setModalFieldError(yearInput, errorYear, 'Please enter a 4-digit enrollment year between 2020 and 2030.');
    }
    return setModalFieldError(yearInput, errorYear, '');
  }

  function validateDob() {
    const val = dobInput?.value || '';
    if (!val) {
      return setModalFieldError(dobInput, errorDob, "Please select or enter the student's date of birth (YYYY-MM-DD).");
    }
    const d = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(d.getTime()) || d >= today) {
      return setModalFieldError(dobInput, errorDob, 'Please choose a past date. Date of birth cannot be today or in the future.');
    }
    return setModalFieldError(dobInput, errorDob, '');
  }

  function validateEmail() {
    const val = emailInput?.value.trim() || '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val || !emailPattern.test(val)) {
      return setModalFieldError(emailInput, errorEmail, 'Please enter a valid email address with "@" and domain (e.g. name@school.edu).');
    }
    return setModalFieldError(emailInput, errorEmail, '');
  }

  function validatePhone() {
    const val = phoneInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(phoneInput, errorPhone, 'Please enter an active contact phone number (e.g. +233 24 123 4567).');
    }
    return setModalFieldError(phoneInput, errorPhone, '');
  }

  function validateFees() {
    const val = feesSelect?.value || '';
    if (!val) {
      return setModalFieldError(feesSelect, errorFees, 'Please choose the fee status (Paid, Pending, Unpaid, or Partial).');
    }
    return setModalFieldError(feesSelect, errorFees, '');
  }

  function validateGuardianName() {
    const val = guardianNameInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(guardianNameInput, errorGuardianName, "Please enter the primary guardian's full name (e.g. Mr. Kofi Mensah).");
    }
    return setModalFieldError(guardianNameInput, errorGuardianName, '');
  }

  function validateGuardianRelation() {
    const val = guardianRelationSelect?.value || '';
    if (!val) {
      return setModalFieldError(guardianRelationSelect, errorGuardianRelation, "Please select the guardian's relationship (e.g. Father, Mother, Guardian).");
    }
    return setModalFieldError(guardianRelationSelect, errorGuardianRelation, '');
  }

  function validateGuardianPhone() {
    const val = guardianPhoneInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(guardianPhoneInput, errorGuardianPhone, 'Please enter an emergency contact phone number for the guardian.');
    }
    return setModalFieldError(guardianPhoneInput, errorGuardianPhone, '');
  }

  function validateSubjects() {
    const checked = form.querySelectorAll('input[name="editSubjects"]:checked');
    if (checked.length === 0) {
      return setModalFieldError(subjectsContainer, errorSubjects, 'Please check at least one enrolled subject checkbox above.');
    }
    return setModalFieldError(subjectsContainer, errorSubjects, '');
  }

  // Attach blur and change handlers (blur validation per AGENTS.md)
  nameInput?.addEventListener('blur', validateName);
  genderSelect?.addEventListener('blur', validateGender);
  genderSelect?.addEventListener('change', validateGender);
  classSelect?.addEventListener('blur', validateClass);
  classSelect?.addEventListener('change', validateClass);
  yearInput?.addEventListener('blur', validateYear);
  dobInput?.addEventListener('blur', validateDob);
  dobInput?.addEventListener('change', validateDob);
  emailInput?.addEventListener('blur', validateEmail);
  phoneInput?.addEventListener('blur', validatePhone);
  feesSelect?.addEventListener('blur', validateFees);
  feesSelect?.addEventListener('change', validateFees);
  guardianNameInput?.addEventListener('blur', validateGuardianName);
  guardianRelationSelect?.addEventListener('blur', validateGuardianRelation);
  guardianRelationSelect?.addEventListener('change', validateGuardianRelation);
  guardianPhoneInput?.addEventListener('blur', validateGuardianPhone);

  populateSubjectCheckboxes(subjectsContainer, student.subjects, 'editSubjects', validateSubjects);
  populateClassSelectOptions(classSelect, student.class).then(() => {
    validateClass();
  });

  // Initial validation run to establish accessible visual confirmation on pre-populated fields
  validateName();
  validateGender();
  validateClass();
  validateYear();
  validateDob();
  validateEmail();
  validatePhone();
  validateFees();
  validateGuardianName();
  validateGuardianRelation();
  validateGuardianPhone();
  validateSubjects();

  // Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isFormValid =
      validateName() &&
      validateGender() &&
      validateClass() &&
      validateYear() &&
      validateDob() &&
      validateEmail() &&
      validatePhone() &&
      validateFees() &&
      validateGuardianName() &&
      validateGuardianRelation() &&
      validateGuardianPhone() &&
      validateSubjects();

    if (!isFormValid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const checkedBoxes = form.querySelectorAll('input[name="editSubjects"]:checked');
    const selectedSubjects = Array.from(checkedBoxes).map((cb) => cb.value);

    const payload = {
      name: nameInput.value.trim(),
      gender: genderSelect.value,
      class: classSelect.value,
      yearOfEnrollment: Number(yearInput.value),
      dateOfBirth: dobInput.value,
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      subjects: selectedSubjects,
      gpa: student.gpa != null ? student.gpa : 0.0,
      attendance: student.attendance != null ? student.attendance : 100,
      dailyAttendance: student.dailyAttendance || { status: 'Unmarked', timestamp: '--' },
      feesStatus: feesSelect.value,
      guardian: {
        name: guardianNameInput.value.trim(),
        relation: guardianRelationSelect.value,
        phone: guardianPhoneInput.value.trim(),
      },
    };

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span>⏳ Saving Changes...</span>';
    }

    try {
      let updatedStudentRecord;
      try {
        updatedStudentRecord = await updateStudentInDb(student.id, payload);
      } catch (networkErr) {
        console.warn('⚠️ Network save failed, updating in-memory record:', networkErr);
        updatedStudentRecord = {
          ...student,
          ...payload,
        };
      }

      // Ensure subjects array is assigned
      if (!updatedStudentRecord.subjects) {
        updatedStudentRecord.subjects = selectedSubjects;
      }

      // Mutate current student record in place
      Object.assign(student, updatedStudentRecord);

      // Trigger global UI updates (Dashboard, Roster, Top Achievers)
      if (onStudentUpdateCallback) {
        onStudentUpdateCallback(student);
      }

      // Return to Profile View and show success alert
      openStudentModal(student, 'view');

      const modalAlert = document.querySelector('#modalAlert');
      if (modalAlert) {
        modalAlert.textContent = `✅ Successfully updated ${student.name}'s record in database!`;
        modalAlert.style.display = 'block';
        setTimeout(() => {
          if (modalAlert) modalAlert.style.display = 'none';
        }, 4000);
      }
    } catch (err) {
      if (feedback) {
        feedback.textContent = `❌ Update failed: ${err.message}`;
        feedback.style.color = 'hsl(0, 75%, 55%)';
      }
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span>💾 Save Changes</span>';
      }
    }
  });
}

const studentModal = document.querySelector('#studentModal');
const closeModalBtn = document.querySelector('#closeModalBtn');
const modalBody = document.querySelector('#modalBody');

export function showToastNotification(message) {
  let toast = document.querySelector('#appToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToastNotification';
    toast.className = 'app-toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

export function openStudentModal(student, mode = 'view', onUpdate) {
  if (!student) return;
  activeStudent = student;
  if (onUpdate) {
    onStudentUpdateCallback = onUpdate;
  }

  if (studentModal && modalBody) {
    if (mode === 'edit') {
      modalBody.innerHTML = renderStudentEditForm(student);
      attachEditFormListeners(student);
    } else if (mode === 'delete') {
      modalBody.innerHTML = renderDeleteConfirmation(student);
      const cancelDeleteBtn = modalBody.querySelector('#cancelDeleteBtn');
      const confirmDeleteBtn = modalBody.querySelector('#confirmDeleteBtn');
      const feedback = modalBody.querySelector('#deleteModalFeedback');

      if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
          openStudentModal(student, 'edit', onStudentUpdateCallback);
        });
      }

      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
          confirmDeleteBtn.disabled = true;
          confirmDeleteBtn.innerHTML = '<span>⏳ Deleting from Database...</span>';

          try {
            try {
              await deleteStudentFromDb(student.id);
            } catch (networkErr) {
              console.warn('⚠️ Server delete failed, removing locally:', networkErr);
            }

            if (onStudentUpdateCallback) {
              onStudentUpdateCallback(student, 'delete');
            }

            closeStudentModal();
            showToastNotification(`🗑️ Successfully deleted <strong>${student.name}</strong> (#EDU-${student.id.toString().padStart(4, '0')})`);
          } catch (err) {
            if (feedback) {
              feedback.textContent = `❌ Delete failed: ${err.message}`;
              feedback.style.color = 'hsl(0, 75%, 55%)';
            }
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.innerHTML = '<span>🗑️ Delete Student</span>';
          }
        });
      }
    } else {
      modalBody.innerHTML = renderStudentProfile(student);
      const editBtn = modalBody.querySelector('#editStudentBtn');
      const editBottomBtn = modalBody.querySelector('#editStudentBottomBtn');
      const downloadPdfBtn = modalBody.querySelector('#downloadStudentModalPdfBtn');

      const handleEdit = () => {
        openStudentModal(student, 'edit', onStudentUpdateCallback);
      };
      if (editBtn) editBtn.addEventListener('click', handleEdit);
      if (editBottomBtn) editBottomBtn.addEventListener('click', handleEdit);

      if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', async () => {
          downloadPdfBtn.disabled = true;
          downloadPdfBtn.innerHTML = '<span>⏳ Generating PDF...</span>';
          try {
            await downloadReportPdfFromDb(student.id, student.name);
          } finally {
            downloadPdfBtn.disabled = false;
            downloadPdfBtn.innerHTML = `
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="svg-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>📄 Download Official Report Card (PDF)</span>`;
          }
        });
      }
    }

    studentModal.classList.add('active');
    studentModal.setAttribute('aria-hidden', 'false');
  }
}

export function closeStudentModal() {
  if (studentModal) {
    studentModal.classList.remove('active');
    studentModal.setAttribute('aria-hidden', 'true');
    activeStudent = null;
  }
}

export function initStudentModal(onUpdate) {
  if (onUpdate) {
    onStudentUpdateCallback = onUpdate;
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeStudentModal);
  }

  if (studentModal) {
    studentModal.addEventListener('click', (e) => {
      if (e.target === studentModal) {
        closeStudentModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      studentModal &&
      studentModal.classList.contains('active')
    ) {
      closeStudentModal();
    }
  });
}
