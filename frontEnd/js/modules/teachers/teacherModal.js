// teacherModal.js - Teacher Profile, Edit, & Delete Modal Module
// Connects to Spring Boot API via teacherApi.js and handles accessible validation per AGENTS.md

import { updateTeacherInDb, deleteTeacherFromDb } from '../../api/teacherApi.js';
import { populateSubjectCheckboxes } from '../subjects/subjectUtils.js';
import { populateClassCheckboxes } from '../classes/classUtils.js';

export function createSubjectPill(subject) {
  return `<span class="subject-pill">${subject}</span>`;
}

export function createClassPill(className) {
  return `<span class="class-pill">🏛️ ${className}</span>`;
}

export function getFirstLetter(word) {
  return word ? word[0] : '';
}

export function getInitials(name) {
  const words = (name || '').trim().split(' ');
  const initials = words.map(getFirstLetter).join('');
  return (initials || 'TR').toUpperCase();
}

const AVAILABLE_DEPARTMENTS = [
  'Science & Mathematics',
  'Languages',
  'Information Technology',
  'Humanities & Social Sciences',
  'Business & Accounting',
  'Arts & Design',
  'Physical Education',
];

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
  'Literature',
  'Biology',
];

let activeTeacher = null;
let onTeacherUpdateCallback = null;

export function renderTeacherProfile(teacher) {
  const subjects = teacher.subjects || [];
  const subjectsHTML = subjects.map(createSubjectPill).join('');
  const classes = teacher.classes || [];
  const classesHTML = classes.map(createClassPill).join('');
  const fullName = teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`;
  const initials = getInitials(fullName);
  const status = teacher.employmentStatus || 'Full-time';
  let statusBadgeClass = 'status-badge-active';
  if (status === 'Part-time') statusBadgeClass = 'status-badge-partial';
  if (status === 'On Leave') statusBadgeClass = 'status-badge-danger';

  return `
    <div class="profile-header">
      <div class="profile-avatar">${initials}</div>
      <div class="profile-header-content">
        <div class="profile-title-row">
          <h3 id="modalTeacherName">${fullName}</h3>
          <button type="button" id="editTeacherBtn" class="btn-edit-student" title="Edit Teacher Record">
            <span>✏️ Edit Teacher</span>
          </button>
        </div>
        <div class="profile-header-meta">
          <p>${teacher.department || 'General'} • ${teacher.gender || 'Not specified'} • ${teacher.teacherNumber || `#TEA-${teacher.id}`}</p>
          <span class="status-badge ${statusBadgeClass}">${status}</span>
        </div>
      </div>
    </div>

    <div id="teacherModalAlert" class="modal-alert-banner" style="display: none;" role="status"></div>

    <div class="profile-grid">
      <div class="profile-field">
        <span>Email Address</span>
        <strong>${teacher.email || '--'}</strong>
      </div>
      <div class="profile-field">
        <span>Phone Number</span>
        <strong>${teacher.phone || '--'}</strong>
      </div>
      <div class="profile-field">
        <span>Department</span>
        <strong>${teacher.department || '--'}</strong>
      </div>
      <div class="profile-field">
        <span>Qualification</span>
        <strong>${teacher.qualification || '--'}</strong>
      </div>
      <div class="profile-field">
        <span>Hire / Join Date</span>
        <strong>${teacher.hireDate || '--'}</strong>
      </div>
      <div class="profile-field">
        <span>Date of Birth</span>
        <strong>${teacher.dateOfBirth || '--'}</strong>
      </div>
    </div>

    <p class="profile-section-title">Assigned Teaching Subjects (${subjects.length}):</p>
    <div class="subject-pills">
      ${subjectsHTML || '<span class="cal-empty-desc">No subjects assigned.</span>'}
    </div>

    <p class="profile-section-title" style="margin-top: 16px;">Assigned Classes / Class Allocations (${classes.length}):</p>
    <div class="subject-pills">
      ${classesHTML || '<span class="cal-empty-desc">No classes assigned.</span>'}
    </div>

    <div class="modal-footer-actions">
      <button type="button" id="editTeacherBottomBtn" class="btn-edit-student-primary">
        <span>✏️ Edit Teacher Record</span>
      </button>
    </div>
  `;
}

export function renderTeacherDeleteConfirmation(teacher) {
  const fullName = teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`;
  const initials = getInitials(fullName);
  return `
    <div class="delete-confirmation-card">
      <div class="delete-modal-icon">⚠️</div>
      <span class="delete-confirmation-badge">CONFIRM REMOVAL</span>
      <h3 class="delete-confirmation-title">Remove Teacher Record</h3>

      <p class="delete-confirmation-question">
        Are you sure you want to remove <strong>${fullName}</strong> from the staff registry?
      </p>

      <div class="delete-student-summary">
        <div class="profile-avatar delete-avatar">${initials}</div>
        <div class="delete-summary-info">
          <strong>${fullName}</strong>
          <p>${teacher.teacherNumber || `#TEA-${teacher.id}`} • ${teacher.department || 'Staff'} • ${teacher.employmentStatus || 'Full-time'}</p>
          <span class="status-badge status-badge-active">${teacher.email || ''}</span>
        </div>
      </div>

      <div class="delete-warning-box">
        <p>⚠️ <strong>Warning:</strong> This action cannot be undone. All assigned subject records and class allocations will be permanently removed from the database.</p>
      </div>

      <div class="delete-modal-actions">
        <button type="button" id="cancelDeleteTeacherBtn" class="btn-cancel-delete">
          <span>Cancel</span>
        </button>
        <button type="button" id="confirmDeleteTeacherBtn" class="btn-confirm-delete">
          <span>🗑️ Remove Teacher</span>
        </button>
      </div>

      <p id="deleteTeacherModalFeedback" class="form-feedback" aria-live="polite"></p>
    </div>
  `;
}

export function renderTeacherEditForm(teacher) {
  const fullName = teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`;
  const initials = getInitials(fullName);
  const enrolled = new Set(teacher.subjects || []);

  const subjectCheckboxesHTML = AVAILABLE_SUBJECTS.map((sub) => {
    const isChecked = enrolled.has(sub) ? 'checked' : '';
    return `
      <label class="checkbox-item">
        <input type="checkbox" name="editTeacherSubjects" value="${sub}" ${isChecked}> ${sub}
      </label>
    `;
  }).join('');

  return `
    <div class="edit-modal-top">
      <div class="profile-avatar">${initials}</div>
      <div>
        <span class="edit-modal-badge">EDITING TEACHER RECORD</span>
        <h3 id="modalTeacherName">${teacher.teacherNumber || `#TEA-${teacher.id}`} — ${fullName}</h3>
      </div>
    </div>

    <form id="editTeacherModalForm" class="edit-modal-form" novalidate>
      <div class="edit-form-grid">
        <div class="form-group">
          <label for="editTeacherFirstName">First Name *</label>
          <input type="text" id="editTeacherFirstName" value="${teacher.firstName || ''}" required placeholder="e.g. Kwame" autocomplete="given-name" aria-describedby="errorEditTeacherFirstName">
          <span class="field-error" id="errorEditTeacherFirstName" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherLastName">Last Name *</label>
          <input type="text" id="editTeacherLastName" value="${teacher.lastName || ''}" required placeholder="e.g. Asante" autocomplete="family-name" aria-describedby="errorEditTeacherLastName">
          <span class="field-error" id="errorEditTeacherLastName" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherGender">Gender *</label>
          <select id="editTeacherGender" required aria-describedby="errorEditTeacherGender">
            <option value="Male" ${teacher.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Female" ${teacher.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option value="Other" ${teacher.gender === 'Other' ? 'selected' : ''}>Other</option>
          </select>
          <span class="field-error" id="errorEditTeacherGender" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherDepartment">Department *</label>
          <select id="editTeacherDepartment" required aria-describedby="errorEditTeacherDepartment">
            <option value="" disabled>Select Department...</option>
          </select>
          <span class="field-error" id="errorEditTeacherDepartment" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherQualification">Qualification *</label>
          <input type="text" id="editTeacherQualification" value="${teacher.qualification || ''}" required placeholder="e.g. B.Ed. Mathematics" aria-describedby="errorEditTeacherQualification">
          <span class="field-error" id="errorEditTeacherQualification" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherStatus">Employment Status *</label>
          <select id="editTeacherStatus" required aria-describedby="errorEditTeacherStatus">
            <option value="Full-time" ${teacher.employmentStatus === 'Full-time' ? 'selected' : ''}>Full-time</option>
            <option value="Part-time" ${teacher.employmentStatus === 'Part-time' ? 'selected' : ''}>Part-time</option>
            <option value="On Leave" ${teacher.employmentStatus === 'On Leave' ? 'selected' : ''}>On Leave</option>
          </select>
          <span class="field-error" id="errorEditTeacherStatus" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherEmail">Email Address *</label>
          <input type="email" id="editTeacherEmail" value="${teacher.email || ''}" required placeholder="e.g. kwame.asante@edumanage.edu" autocomplete="email" aria-describedby="errorEditTeacherEmail">
          <span class="field-error" id="errorEditTeacherEmail" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherPhone">Phone Number *</label>
          <input type="tel" id="editTeacherPhone" value="${teacher.phone || ''}" required placeholder="e.g. +233 24 456 7890" autocomplete="tel" aria-describedby="errorEditTeacherPhone">
          <span class="field-error" id="errorEditTeacherPhone" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherDob">Date of Birth *</label>
          <input type="date" id="editTeacherDob" value="${teacher.dateOfBirth || ''}" required aria-describedby="errorEditTeacherDob">
          <span class="field-error" id="errorEditTeacherDob" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editTeacherHireDate">Hire Date *</label>
          <input type="date" id="editTeacherHireDate" value="${teacher.hireDate || ''}" required aria-describedby="errorEditTeacherHireDate">
          <span class="field-error" id="errorEditTeacherHireDate" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group full-width">
          <label>Assigned Teaching Subjects (Check all that apply) *</label>
          <div class="checkbox-group" id="editTeacherSubjectsContainer" role="group" aria-label="Assigned Subjects" aria-describedby="errorEditTeacherSubjects">
            ${subjectCheckboxesHTML}
          </div>
          <span class="field-error" id="errorEditTeacherSubjects" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group full-width">
          <label>Assigned Classes / Class Allocations (Check all that apply) *</label>
          <div class="checkbox-group" id="editTeacherClassesContainer" role="group" aria-label="Assigned Classes" aria-describedby="errorEditTeacherClasses">
            <!-- Dynamically populated from backend database -->
          </div>
          <span class="field-error" id="errorEditTeacherClasses" role="alert" aria-live="polite"></span>
        </div>
      </div>

      <div class="edit-modal-actions">
        <button type="button" id="deleteTeacherFromEditBtn" class="btn-delete-from-edit">
          <span>🗑️ Remove Teacher</span>
        </button>
        <div class="edit-modal-btn-group">
          <button type="button" id="cancelTeacherEditBtn" class="btn-cancel-edit">
            <span>Cancel</span>
          </button>
          <button type="submit" id="saveTeacherEditBtn" class="btn-save-edit">
            <span>💾 Save Changes</span>
          </button>
        </div>
      </div>

      <p id="editTeacherModalFeedback" class="form-feedback" aria-live="polite"></p>
    </form>
  `;
}

function setModalFieldError(inputEl, errorEl, message) {
  if (!inputEl || !errorEl) return false;
  if (message) {
    inputEl.classList.add('is-invalid');
    inputEl.classList.remove('is-valid');
    inputEl.setAttribute('aria-invalid', 'true');
    errorEl.textContent = `⚠️ ${message}`;
    errorEl.classList.add('visible');
    return false;
  } else {
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
    inputEl.setAttribute('aria-invalid', 'false');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
    return true;
  }
}

function wireTeacherEditFormValidation(teacher, modalBody) {
  const form = modalBody.querySelector('#editTeacherModalForm');
  if (!form) return;

  const fnInput = form.querySelector('#editTeacherFirstName');
  const lnInput = form.querySelector('#editTeacherLastName');
  const genderSelect = form.querySelector('#editTeacherGender');
  const deptSelect = form.querySelector('#editTeacherDepartment');
  const qualInput = form.querySelector('#editTeacherQualification');
  const statusSelect = form.querySelector('#editTeacherStatus');
  const emailInput = form.querySelector('#editTeacherEmail');
  const phoneInput = form.querySelector('#editTeacherPhone');
  const dobInput = form.querySelector('#editTeacherDob');
  const hireDateInput = form.querySelector('#editTeacherHireDate');
  const subjectsContainer = form.querySelector('#editTeacherSubjectsContainer');
  const classesContainer = form.querySelector('#editTeacherClassesContainer');

  if (deptSelect) {
    deptSelect.innerHTML = '';
    AVAILABLE_DEPARTMENTS.forEach((dept) => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      if (teacher.department === dept) {
        option.selected = true;
      }
      deptSelect.appendChild(option);
    });
  }

  const errorFn = form.querySelector('#errorEditTeacherFirstName');
  const errorLn = form.querySelector('#errorEditTeacherLastName');
  const errorGender = form.querySelector('#errorEditTeacherGender');
  const errorDept = form.querySelector('#errorEditTeacherDepartment');
  const errorQual = form.querySelector('#errorEditTeacherQualification');
  const errorStatus = form.querySelector('#errorEditTeacherStatus');
  const errorEmail = form.querySelector('#errorEditTeacherEmail');
  const errorPhone = form.querySelector('#errorEditTeacherPhone');
  const errorDob = form.querySelector('#errorEditTeacherDob');
  const errorHireDate = form.querySelector('#errorEditTeacherHireDate');
  const errorSubjects = form.querySelector('#errorEditTeacherSubjects');
  const errorClasses = form.querySelector('#errorEditTeacherClasses');

  const cancelBtn = form.querySelector('#cancelTeacherEditBtn');
  const deleteBtn = form.querySelector('#deleteTeacherFromEditBtn');
  const feedbackEl = form.querySelector('#editTeacherModalFeedback');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openTeacherModal(teacher, 'view', onTeacherUpdateCallback);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      openTeacherModal(teacher, 'delete', onTeacherUpdateCallback);
    });
  }

  function validateFirstName() {
    const val = fnInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(fnInput, errorFn, "Please enter the teacher's first name (e.g. Kwame).");
    }
    return setModalFieldError(fnInput, errorFn, '');
  }

  function validateLastName() {
    const val = lnInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(lnInput, errorLn, "Please enter the teacher's last name (e.g. Asante).");
    }
    return setModalFieldError(lnInput, errorLn, '');
  }

  function validateGender() {
    const val = genderSelect?.value || '';
    if (!val) {
      return setModalFieldError(genderSelect, errorGender, 'Please select a gender option from the dropdown.');
    }
    return setModalFieldError(genderSelect, errorGender, '');
  }

  function validateDepartment() {
    const val = deptSelect?.value || '';
    if (!val) {
      return setModalFieldError(deptSelect, errorDept, 'Please select an academic department.');
    }
    return setModalFieldError(deptSelect, errorDept, '');
  }

  function validateQualification() {
    const val = qualInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(qualInput, errorQual, 'Please enter academic qualification (e.g. B.Sc. Physics).');
    }
    return setModalFieldError(qualInput, errorQual, '');
  }

  function validateStatus() {
    const val = statusSelect?.value || '';
    if (!val) {
      return setModalFieldError(statusSelect, errorStatus, 'Please select an employment status.');
    }
    return setModalFieldError(statusSelect, errorStatus, '');
  }

  function validateEmail() {
    const val = emailInput?.value.trim() || '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val || !emailPattern.test(val)) {
      return setModalFieldError(emailInput, errorEmail, 'Please enter a valid staff email address with "@" and domain (e.g. name@school.edu).');
    }
    return setModalFieldError(emailInput, errorEmail, '');
  }

  function validatePhone() {
    const val = phoneInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(phoneInput, errorPhone, 'Please enter an active contact phone number (e.g. +233 24 456 7890).');
    }
    return setModalFieldError(phoneInput, errorPhone, '');
  }

  function validateDob() {
    const val = dobInput?.value || '';
    if (!val) {
      return setModalFieldError(dobInput, errorDob, 'Please enter date of birth.');
    }
    const d = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(d.getTime()) || d >= today) {
      return setModalFieldError(dobInput, errorDob, 'Date of birth must be a valid past date.');
    }
    return setModalFieldError(dobInput, errorDob, '');
  }

  function validateHireDate() {
    const val = hireDateInput?.value || '';
    if (!val) {
      return setModalFieldError(hireDateInput, errorHireDate, 'Please enter the official hire date.');
    }
    return setModalFieldError(hireDateInput, errorHireDate, '');
  }

  function validateSubjects() {
    const checked = form.querySelectorAll('input[name="editTeacherSubjects"]:checked');
    if (checked.length === 0) {
      return setModalFieldError(subjectsContainer, errorSubjects, 'Please check at least one assigned subject checkbox.');
    }
    return setModalFieldError(subjectsContainer, errorSubjects, '');
  }

  function validateClasses() {
    const checked = form.querySelectorAll('input[name="editTeacherClasses"]:checked');
    if (checked.length === 0) {
      return setModalFieldError(classesContainer, errorClasses, 'Please check at least one assigned class allocation checkbox.');
    }
    return setModalFieldError(classesContainer, errorClasses, '');
  }

  // Attach blur and change listeners per AGENTS.md
  fnInput?.addEventListener('blur', validateFirstName);
  lnInput?.addEventListener('blur', validateLastName);
  genderSelect?.addEventListener('blur', validateGender);
  genderSelect?.addEventListener('change', validateGender);
  deptSelect?.addEventListener('blur', validateDepartment);
  deptSelect?.addEventListener('change', validateDepartment);
  qualInput?.addEventListener('blur', validateQualification);
  statusSelect?.addEventListener('blur', validateStatus);
  statusSelect?.addEventListener('change', validateStatus);
  emailInput?.addEventListener('blur', validateEmail);
  phoneInput?.addEventListener('blur', validatePhone);
  dobInput?.addEventListener('blur', validateDob);
  dobInput?.addEventListener('change', validateDob);
  hireDateInput?.addEventListener('blur', validateHireDate);
  hireDateInput?.addEventListener('change', validateHireDate);

  populateSubjectCheckboxes(subjectsContainer, teacher.subjects, 'editTeacherSubjects', validateSubjects);
  populateClassCheckboxes(classesContainer, teacher.classes, 'editTeacherClasses', validateClasses);

  // Initial validation run to establish accessible visual confirmation on pre-populated fields
  validateFirstName();
  validateLastName();
  validateGender();
  validateDepartment();
  validateQualification();
  validateStatus();
  validateEmail();
  validatePhone();
  validateDob();
  validateHireDate();
  validateSubjects();
  validateClasses();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isFnValid = validateFirstName();
    const isLnValid = validateLastName();
    const isGenderValid = validateGender();
    const isDeptValid = validateDepartment();
    const isQualValid = validateQualification();
    const isStatusValid = validateStatus();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDob();
    const isHireDateValid = validateHireDate();
    const isSubjectsValid = validateSubjects();
    const isClassesValid = validateClasses();

    if (!isFnValid || !isLnValid || !isGenderValid || !isDeptValid || !isQualValid ||
        !isStatusValid || !isEmailValid || !isPhoneValid || !isDobValid || !isHireDateValid ||
        !isSubjectsValid || !isClassesValid) {
      if (feedbackEl) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = '⚠️ Please resolve the highlighted errors above before saving.';
      }
      return;
    }

    const selectedSubjects = Array.from(
      form.querySelectorAll('input[name="editTeacherSubjects"]:checked')
    ).map((cb) => cb.value);

    const selectedClasses = Array.from(
      form.querySelectorAll('input[name="editTeacherClasses"]:checked')
    ).map((cb) => cb.value);

    const updatedDto = {
      firstName: fnInput.value.trim(),
      lastName: lnInput.value.trim(),
      gender: genderSelect.value,
      department: deptSelect.value,
      qualification: qualInput.value.trim(),
      employmentStatus: statusSelect.value,
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dateOfBirth: dobInput.value,
      hireDate: hireDateInput.value,
      subjects: selectedSubjects,
      classes: selectedClasses,
    };

    const saveBtn = form.querySelector('#saveTeacherEditBtn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span>⏳ Saving...</span>';
    }

    try {
      const savedResult = await updateTeacherInDb(teacher.id, updatedDto);
      Object.assign(teacher, savedResult);

      if (typeof onTeacherUpdateCallback === 'function') {
        onTeacherUpdateCallback(teacher, 'update');
      }

      openTeacherModal(teacher, 'view', onTeacherUpdateCallback);
      showTeacherModalAlert('✅ Teacher profile updated successfully!');
    } catch (err) {
      console.error('Error saving teacher changes:', err);
      if (feedbackEl) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = `❌ Failed to save changes: ${err.message}`;
      }
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span>💾 Save Changes</span>';
      }
    }
  });
}

function wireTeacherDeleteConfirmation(teacher, modalBody) {
  const cancelBtn = modalBody.querySelector('#cancelDeleteTeacherBtn');
  const confirmBtn = modalBody.querySelector('#confirmDeleteTeacherBtn');
  const feedbackEl = modalBody.querySelector('#deleteTeacherModalFeedback');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openTeacherModal(teacher, 'edit', onTeacherUpdateCallback);
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<span>⏳ Removing...</span>';

      try {
        await deleteTeacherFromDb(teacher.id);

        if (typeof onTeacherUpdateCallback === 'function') {
          onTeacherUpdateCallback(teacher, 'delete');
        }

        closeTeacherModal();
      } catch (err) {
        console.error('Error deleting teacher:', err);
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback error';
          feedbackEl.textContent = `❌ Could not remove teacher: ${err.message}`;
        }
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<span>🗑️ Remove Teacher</span>';
      }
    });
  }
}

function showTeacherModalAlert(msg) {
  const alertBanner = document.querySelector('#teacherModalAlert');
  if (alertBanner) {
    alertBanner.textContent = msg;
    alertBanner.style.display = 'block';
    setTimeout(() => {
      alertBanner.style.display = 'none';
    }, 4000);
  }
}

export function openTeacherModal(teacher, mode = 'view', updateCallback = null) {
  activeTeacher = teacher;
  if (updateCallback) onTeacherUpdateCallback = updateCallback;

  const modal = document.querySelector('#teacherModal');
  const modalBody = document.querySelector('#teacherModalBody');
  if (!modal || !modalBody) return;

  if (mode === 'edit') {
    modalBody.innerHTML = renderTeacherEditForm(teacher);
    wireTeacherEditFormValidation(teacher, modalBody);
  } else if (mode === 'delete') {
    modalBody.innerHTML = renderTeacherDeleteConfirmation(teacher);
    wireTeacherDeleteConfirmation(teacher, modalBody);
  } else {
    modalBody.innerHTML = renderTeacherProfile(teacher);

    const editBtn = modalBody.querySelector('#editTeacherBtn');
    const editBottomBtn = modalBody.querySelector('#editTeacherBottomBtn');

    const handleEditClick = () => {
      openTeacherModal(teacher, 'edit', onTeacherUpdateCallback);
    };

    if (editBtn) editBtn.addEventListener('click', handleEditClick);
    if (editBottomBtn) editBottomBtn.addEventListener('click', handleEditClick);
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

export function closeTeacherModal() {
  const modal = document.querySelector('#teacherModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  activeTeacher = null;
}

export function initTeacherModal(onUpdate) {
  if (onUpdate) {
    onTeacherUpdateCallback = onUpdate;
  }

  const modal = document.querySelector('#teacherModal');
  const closeBtn = document.querySelector('#closeTeacherModalBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeTeacherModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeTeacherModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeTeacherModal();
    }
  });
}
