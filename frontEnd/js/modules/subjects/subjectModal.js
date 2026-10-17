// subjectModal.js - Subject Detail, Edit, & Safe Deactivation Modal Module
// Connects to Spring Boot API via subjectApi.js and handles accessible validation per AGENTS.md

import { updateSubjectInDb, deleteOrDeactivateSubjectInDb } from '../../api/subjectApi.js';
import { teachers } from '../../data/teachersData.js';
import { getInitials } from '../students/studentModal.js';

export const SUBJECT_DEPARTMENTS = [
  'Mathematics & Computing',
  'Natural Sciences',
  'Languages',
  'Humanities & Social Sciences',
  'Science & Mathematics',
  'Information Technology',
  'Business & Accounting',
  'Arts & Design',
  'Physical Education',
];

let activeSubject = null;
let onSubjectUpdateCallback = null;

export function renderSubjectDetails(subject) {
  const isActive = subject.active !== false;
  const statusBadgeClass = isActive ? 'status-badge-active' : 'status-badge-danger';
  const statusText = isActive ? 'Active' : 'Archived / Inactive';
  const subjectCode = subject.code || `SUB-${subject.id}`;
  const department = subject.department || 'General Studies';
  const description = subject.description || 'No detailed syllabus or description provided.';

  const assignedTeachers = teachers.filter((t) => (t.subjects || []).includes(subject.name));
  const instructorsHTML = assignedTeachers.length > 0
    ? assignedTeachers.map((t) => {
        const initials = getInitials(t.name || `${t.firstName || ''} ${t.lastName || ''}`);
        const classesStr = (t.classes || []).map((c) => `🏛️ ${c}`).join(', ') || 'No specific classes assigned';
        return `
          <div class="class-student-row">
            <div class="profile-avatar class-student-avatar">${initials}</div>
            <div class="class-student-meta">
              <strong>${t.name || `${t.firstName || ''} ${t.lastName || ''}`}</strong>
              <span>${classesStr} • ${t.department || 'Academic Staff'}</span>
            </div>
            <span class="status-badge status-badge-active">${t.employmentStatus || 'Faculty'}</span>
          </div>
        `;
      }).join('')
    : '<div class="cal-empty-desc" style="padding: 12px 0;">No teachers are currently assigned to this subject.</div>';

  return `
    <div class="profile-header">
      <div class="profile-avatar subject-modal-avatar">📚</div>
      <div class="profile-header-content">
        <div class="profile-title-row">
          <h3 id="modalSubjectName">${subject.name}</h3>
          <button type="button" id="editSubjectBtn" class="btn-edit-student" title="Edit Subject Information">
            <span>✏️ Edit Subject</span>
          </button>
        </div>
        <div class="profile-header-meta">
          <p><span class="subject-code-tag">${subjectCode}</span> • 🏛️ ${department}</p>
          <span class="status-badge ${statusBadgeClass}">${statusText}</span>
        </div>
      </div>
    </div>

    <div id="subjectModalAlert" class="modal-alert-banner" style="display: none;" role="status"></div>

    <div class="profile-grid">
      <div class="profile-field">
        <span>Subject / Course Code</span>
        <strong>${subjectCode}</strong>
      </div>
      <div class="profile-field">
        <span>Academic Department</span>
        <strong>${department}</strong>
      </div>
      <div class="profile-field">
        <span>Offering Status</span>
        <strong>${statusText}</strong>
      </div>
      <div class="profile-field">
        <span>System ID</span>
        <strong>#SUB-${subject.id}</strong>
      </div>
    </div>

    <p class="profile-section-title">Course Description & Syllabus Overview:</p>
    <div class="subject-description-box">
      <p>${description}</p>
    </div>

    <div class="class-students-section" style="margin-bottom: 20px;">
      <p class="profile-section-title" style="margin: 0 0 12px 0;">Assigned Instructors & Class Streams (${assignedTeachers.length}):</p>
      <div class="class-students-list">
        ${instructorsHTML}
      </div>
    </div>

    <div class="modal-footer-actions">
      <button type="button" id="editSubjectBottomBtn" class="btn-edit-student-primary">
        <span>✏️ Edit Subject Details</span>
      </button>
      <button type="button" id="deactivateSubjectTopBtn" class="btn-archive-danger">
        <span>${isActive ? '⏸️ Deactivate / Archive' : '🗑️ Manage Deletion'}</span>
      </button>
    </div>
  `;
}

export function renderSubjectDeleteConfirmation(subject) {
  const isActive = subject.active !== false;
  const subjectCode = subject.code || `SUB-${subject.id}`;
  return `
    <div class="delete-confirmation-card">
      <div class="delete-modal-icon">⚠️</div>
      <span class="delete-confirmation-badge">CONFIRM SUBJECT STATUS CHANGE</span>
      <h3 class="delete-confirmation-title">${isActive ? 'Deactivate Subject' : 'Delete / Archive Subject'}</h3>

      <p class="delete-confirmation-question">
        Are you sure you want to change the status of <strong>${subject.name}</strong> (${subjectCode})?
      </p>

      <div class="delete-student-summary">
        <div class="profile-avatar delete-avatar">📚</div>
        <div class="delete-summary-info">
          <strong>${subject.name} (${subjectCode})</strong>
          <p>${subject.department || 'General'} • ${isActive ? 'Currently Active' : 'Currently Inactive'}</p>
        </div>
      </div>

      <div class="delete-warning-box">
        <p>ℹ️ <strong>Safe Deactivation Policy:</strong> If students are currently enrolled in this subject, the system will safely deactivate it (marking it as archived) to protect historical academic records and grades without violating database foreign key constraints.</p>
      </div>

      <div class="delete-modal-actions">
        <button type="button" id="cancelDeleteSubjectBtn" class="btn-cancel-delete">
          <span>Cancel</span>
        </button>
        <button type="button" id="confirmDeleteSubjectBtn" class="btn-confirm-delete">
          <span>${isActive ? '⏸️ Deactivate Subject' : '🗑️ Delete Subject'}</span>
        </button>
      </div>

      <p id="deleteSubjectModalFeedback" class="form-feedback" aria-live="polite"></p>
    </div>
  `;
}

export function renderSubjectEditForm(subject) {
  const subjectCode = subject.code || `SUB-${subject.id}`;

  return `
    <div class="edit-modal-top">
      <div class="profile-avatar subject-modal-avatar">📚</div>
      <div>
        <span class="edit-modal-badge">EDITING SUBJECT DETAILS</span>
        <h3 id="modalSubjectName">${subject.name} (${subjectCode})</h3>
      </div>
    </div>

    <form id="editSubjectModalForm" class="edit-modal-form" novalidate>
      <div class="edit-form-grid">
        <div class="form-group full-width">
          <label for="editSubjectName">Subject Title / Course Name *</label>
          <input type="text" id="editSubjectName" value="${subject.name || ''}" required placeholder="e.g. Advanced Mathematics" autocomplete="off" aria-describedby="errorEditSubjectName">
          <span class="field-error" id="errorEditSubjectName" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editSubjectCode">Course Code *</label>
          <input type="text" id="editSubjectCode" value="${subject.code || ''}" required placeholder="e.g. MTH-101" autocomplete="off" aria-describedby="errorEditSubjectCode">
          <span class="field-error" id="errorEditSubjectCode" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group">
          <label for="editSubjectDepartment">Department *</label>
          <select id="editSubjectDepartment" required aria-describedby="errorEditSubjectDepartment">
            <option value="" disabled>Select Department...</option>
          </select>
          <span class="field-error" id="errorEditSubjectDepartment" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group full-width">
          <label for="editSubjectDescription">Description & Syllabus Overview</label>
          <textarea id="editSubjectDescription" rows="3" placeholder="Enter course description, learning objectives, or curriculum details..." aria-describedby="errorEditSubjectDescription">${subject.description || ''}</textarea>
          <span class="field-error" id="errorEditSubjectDescription" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group full-width">
          <label class="checkbox-item" style="font-weight: 600;">
            <input type="checkbox" id="editSubjectActive" ${subject.active !== false ? 'checked' : ''}>
            <span>Active & Open for Student Enrollments</span>
          </label>
        </div>
      </div>

      <div class="edit-modal-actions">
        <button type="button" id="deleteSubjectFromEditBtn" class="btn-delete-from-edit">
          <span>⏸️ Deactivate / Delete</span>
        </button>
        <div class="edit-modal-btn-group">
          <button type="button" id="cancelSubjectEditBtn" class="btn-cancel-edit">
            <span>Cancel</span>
          </button>
          <button type="submit" id="saveSubjectEditBtn" class="btn-save-edit">
            <span>💾 Save Changes</span>
          </button>
        </div>
      </div>

      <p id="editSubjectModalFeedback" class="form-feedback" aria-live="polite"></p>
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

function wireSubjectEditFormValidation(subject, modalBody) {
  const form = modalBody.querySelector('#editSubjectModalForm');
  if (!form) return;

  const nameInput = form.querySelector('#editSubjectName');
  const codeInput = form.querySelector('#editSubjectCode');
  const deptSelect = form.querySelector('#editSubjectDepartment');
  const descInput = form.querySelector('#editSubjectDescription');
  const activeInput = form.querySelector('#editSubjectActive');

  if (deptSelect) {
    deptSelect.innerHTML = '';
    SUBJECT_DEPARTMENTS.forEach((dept) => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      if (subject.department === dept) {
        option.selected = true;
      }
      deptSelect.appendChild(option);
    });
  }

  const errorName = form.querySelector('#errorEditSubjectName');
  const errorCode = form.querySelector('#errorEditSubjectCode');
  const errorDept = form.querySelector('#errorEditSubjectDepartment');

  const cancelBtn = form.querySelector('#cancelSubjectEditBtn');
  const deleteBtn = form.querySelector('#deleteSubjectFromEditBtn');
  const feedbackEl = form.querySelector('#editSubjectModalFeedback');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openSubjectModal(subject, 'view', onSubjectUpdateCallback);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      openSubjectModal(subject, 'delete', onSubjectUpdateCallback);
    });
  }

  function validateName() {
    const val = nameInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(nameInput, errorName, 'Please enter a valid subject title (e.g. Mathematics, English).');
    }
    return setModalFieldError(nameInput, errorName, '');
  }

  function validateCode() {
    const val = codeInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(codeInput, errorCode, 'Please enter a course code (e.g. MTH-101, ENG-101).');
    }
    return setModalFieldError(codeInput, errorCode, '');
  }

  function validateDepartment() {
    const val = deptSelect?.value || '';
    if (!val) {
      return setModalFieldError(deptSelect, errorDept, 'Please select a department from the dropdown.');
    }
    return setModalFieldError(deptSelect, errorDept, '');
  }

  // Attach blur and change listeners per AGENTS.md
  nameInput?.addEventListener('blur', validateName);
  codeInput?.addEventListener('blur', validateCode);
  deptSelect?.addEventListener('blur', validateDepartment);
  deptSelect?.addEventListener('change', validateDepartment);

  // Initial validation check
  validateName();
  validateCode();
  validateDepartment();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isCodeValid = validateCode();
    const isDeptValid = validateDepartment();

    if (!isNameValid || !isCodeValid || !isDeptValid) {
      if (feedbackEl) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = '⚠️ Please resolve the highlighted errors before saving.';
      }
      return;
    }

    const updatedDto = {
      name: nameInput.value.trim(),
      code: codeInput.value.trim(),
      department: deptSelect.value,
      description: descInput?.value.trim() || '',
      active: activeInput?.checked !== false,
    };

    const saveBtn = form.querySelector('#saveSubjectEditBtn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span>⏳ Saving...</span>';
    }

    try {
      const savedResult = await updateSubjectInDb(subject.id, updatedDto);
      Object.assign(subject, savedResult);

      if (typeof onSubjectUpdateCallback === 'function') {
        onSubjectUpdateCallback(subject, 'update');
      }

      openSubjectModal(subject, 'view', onSubjectUpdateCallback);
      showSubjectModalAlert('✅ Subject updated successfully!');
    } catch (err) {
      console.error('Error saving subject changes:', err);
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

function wireSubjectDeleteConfirmation(subject, modalBody) {
  const cancelBtn = modalBody.querySelector('#cancelDeleteSubjectBtn');
  const confirmBtn = modalBody.querySelector('#confirmDeleteSubjectBtn');
  const feedbackEl = modalBody.querySelector('#deleteSubjectModalFeedback');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openSubjectModal(subject, 'edit', onSubjectUpdateCallback);
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<span>⏳ Updating Status...</span>';

      try {
        const result = await deleteOrDeactivateSubjectInDb(subject.id);

        if (result && result.action === 'DEACTIVATED') {
          subject.active = false;
          if (typeof onSubjectUpdateCallback === 'function') {
            onSubjectUpdateCallback(subject, 'update');
          }
          openSubjectModal(subject, 'view', onSubjectUpdateCallback);
          showSubjectModalAlert('ℹ️ Subject has active enrollments; marked as Inactive/Archived.');
        } else {
          if (typeof onSubjectUpdateCallback === 'function') {
            onSubjectUpdateCallback(subject, 'delete');
          }
          closeSubjectModal();
        }
      } catch (err) {
        console.error('Error deleting/deactivating subject:', err);
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback error';
          feedbackEl.textContent = `❌ Could not complete action: ${err.message}`;
        }
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<span>Proceed</span>';
      }
    });
  }
}

function showSubjectModalAlert(msg) {
  const alertBanner = document.querySelector('#subjectModalAlert');
  if (alertBanner) {
    alertBanner.textContent = msg;
    alertBanner.style.display = 'block';
    setTimeout(() => {
      alertBanner.style.display = 'none';
    }, 4000);
  }
}

export function openSubjectModal(subject, mode = 'view', updateCallback = null) {
  activeSubject = subject;
  if (updateCallback) onSubjectUpdateCallback = updateCallback;

  const modal = document.querySelector('#subjectModal');
  const modalBody = document.querySelector('#subjectModalBody');
  if (!modal || !modalBody) return;

  if (mode === 'edit') {
    modalBody.innerHTML = renderSubjectEditForm(subject);
    wireSubjectEditFormValidation(subject, modalBody);
  } else if (mode === 'delete') {
    modalBody.innerHTML = renderSubjectDeleteConfirmation(subject);
    wireSubjectDeleteConfirmation(subject, modalBody);
  } else {
    modalBody.innerHTML = renderSubjectDetails(subject);

    const editBtn = modalBody.querySelector('#editSubjectBtn');
    const editBottomBtn = modalBody.querySelector('#editSubjectBottomBtn');
    const deactivateBtn = modalBody.querySelector('#deactivateSubjectTopBtn');

    const handleEditClick = () => {
      openSubjectModal(subject, 'edit', onSubjectUpdateCallback);
    };

    if (editBtn) editBtn.addEventListener('click', handleEditClick);
    if (editBottomBtn) editBottomBtn.addEventListener('click', handleEditClick);
    if (deactivateBtn) {
      deactivateBtn.addEventListener('click', () => {
        openSubjectModal(subject, 'delete', onSubjectUpdateCallback);
      });
    }
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

export function closeSubjectModal() {
  const modal = document.querySelector('#subjectModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  activeSubject = null;
}

export function initSubjectModal(onUpdate) {
  if (onUpdate) {
    onSubjectUpdateCallback = onUpdate;
  }

  const modal = document.querySelector('#subjectModal');
  const closeBtn = document.querySelector('#closeSubjectModalBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSubjectModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSubjectModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeSubjectModal();
    }
  });
}
