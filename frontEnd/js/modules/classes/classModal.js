// classModal.js - Class Detail, Enrolled Students, Assignment, Edit, & Safe Deactivation Modal Module
// Connects to Spring Boot API via classApi.js and handles accessible validation per AGENTS.md

import {
  updateClassInDb,
  deleteOrDeactivateClassInDb,
  fetchClassStudentsFromDb,
  assignStudentToClassInDb,
  removeStudentFromClassInDb,
  fetchClassesFromDb,
} from '../../api/classApi.js';
import { fetchStudentsFromDb } from '../../api/studentApi.js';
import { teachers } from '../../data/teachersData.js';
import { getInitials } from '../students/studentModal.js';

let activeClass = null;
let onClassUpdateCallback = null;

export function renderClassDetails(cls, students = []) {
  const isActive = cls.active !== false;
  const statusBadgeClass = isActive ? 'status-badge-active' : 'status-badge-danger';
  const statusText = isActive ? 'Active' : 'Archived / Inactive';
  const studentCount = students.length;
  const description = cls.description || 'No detailed syllabus or level overview provided.';

  const assignedTeachers = teachers.filter((t) => (t.classes || []).includes(cls.name));
  const teachersHTML = assignedTeachers.length > 0
    ? assignedTeachers.map((t) => {
        const initials = getInitials(t.name || `${t.firstName || ''} ${t.lastName || ''}`);
        const subjectsStr = (t.subjects || []).join(', ') || 'General Studies';
        return `
          <div class="class-student-row">
            <div class="profile-avatar class-student-avatar">${initials}</div>
            <div class="class-student-meta">
              <strong>${t.name || `${t.firstName || ''} ${t.lastName || ''}`}</strong>
              <span>📖 ${subjectsStr} • ${t.department || 'Academic Staff'}</span>
            </div>
            <span class="status-badge status-badge-active">${t.employmentStatus || 'Faculty'}</span>
          </div>
        `;
      }).join('')
    : '<div class="cal-empty-desc" style="padding: 12px 0;">No teachers are currently assigned to this class stream.</div>';

  const studentsListHTML = students.length > 0
    ? students.map((s) => {
        const initials = getInitials(s.name);
        return `
          <div class="class-student-row" data-student-id="${s.id}">
            <div class="profile-avatar class-student-avatar">${initials}</div>
            <div class="class-student-meta">
              <strong>${s.name}</strong>
              <span>#EDU-${s.id.toString().padStart(4, '0')} • GPA: ${s.gpa ? s.gpa.toFixed(1) : '0.0'} • Attendance: ${s.attendance || 100}%</span>
            </div>
            <div class="class-student-actions">
              <button type="button" class="btn-sm-move-student" data-action="move-student" data-student-id="${s.id}" data-student-name="${s.name}" title="Move or Reassign to another class">
                <span>Move Class ⇄</span>
              </button>
            </div>
          </div>
        `;
      }).join('')
    : '<div class="cal-empty-desc" style="padding: 16px 0;">No students are currently enrolled in this class.</div>';

  return `
    <div class="profile-header">
      <div class="profile-avatar class-modal-avatar">🏛️</div>
      <div class="profile-header-content">
        <div class="profile-title-row">
          <h3 id="modalClassName">${cls.name}</h3>
          <button type="button" id="editClassBtn" class="btn-edit-student" title="Edit Class Details">
            <span>✏️ Edit Class</span>
          </button>
        </div>
        <div class="profile-header-meta">
          <p>Academic Level • <strong>${studentCount} Enrolled Student${studentCount === 1 ? '' : 's'}</strong></p>
          <span class="status-badge ${statusBadgeClass}">${statusText}</span>
        </div>
      </div>
    </div>

    <div id="classModalAlert" class="modal-alert-banner" style="display: none;" role="status"></div>

    <div class="profile-grid">
      <div class="profile-field">
        <span>Class Title</span>
        <strong>${cls.name}</strong>
      </div>
      <div class="profile-field">
        <span>Enrolled Students</span>
        <strong>${studentCount} Active</strong>
      </div>
      <div class="profile-field">
        <span>Offering Status</span>
        <strong>${statusText}</strong>
      </div>
      <div class="profile-field">
        <span>Database ID</span>
        <strong>#CLS-${cls.id}</strong>
      </div>
    </div>

    <p class="profile-section-title">Level Overview & Curriculum Description:</p>
    <div class="subject-description-box">
      <p>${description}</p>
    </div>

    <div class="class-students-section" style="margin-bottom: 20px;">
      <p class="profile-section-title" style="margin: 0 0 12px 0;">Assigned Faculty & Subject Teachers (${assignedTeachers.length}):</p>
      <div class="class-students-list">
        ${teachersHTML}
      </div>
    </div>

    <div class="class-students-section">
      <div class="class-students-header">
        <p class="profile-section-title" style="margin: 0;">Enrolled Student Roster (${studentCount}):</p>
        <button type="button" id="assignStudentModalBtn" class="btn-assign-student-sm">
          <span>➕ Assign Student</span>
        </button>
      </div>

      <div class="class-students-list">
        ${studentsListHTML}
      </div>
    </div>

    <div class="modal-footer-actions">
      <button type="button" id="editClassBottomBtn" class="btn-edit-student-primary">
        <span>✏️ Edit Class Details</span>
      </button>
      <button type="button" id="deactivateClassTopBtn" class="btn-archive-danger">
        <span>${isActive ? '⏸️ Deactivate / Archive' : '🗑️ Manage Deletion'}</span>
      </button>
    </div>
  `;
}

export function renderClassEditForm(cls) {
  return `
    <div class="edit-modal-top">
      <div class="profile-avatar class-modal-avatar">🏛️</div>
      <div>
        <span class="edit-modal-badge">EDITING CLASS DETAILS</span>
        <h3 id="modalClassName">${cls.name}</h3>
      </div>
    </div>

    <form id="editClassModalForm" class="edit-modal-form" novalidate>
      <div class="edit-form-grid">
        <div class="form-group full-width">
          <label for="editClassName">Class Title / Level Name *</label>
          <input type="text" id="editClassName" value="${cls.name || ''}" required placeholder="e.g. Form 1, Grade 10" autocomplete="off" aria-describedby="errorEditClassName">
          <span class="field-error" id="errorEditClassName" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group full-width">
          <label for="editClassDescription">Level Description & Overview</label>
          <textarea id="editClassDescription" rows="3" placeholder="Enter level description, academic requirements, or curriculum details..." aria-describedby="errorEditClassDescription">${cls.description || ''}</textarea>
          <span class="field-error" id="errorEditClassDescription" role="alert" aria-live="polite"></span>
        </div>

        <div class="form-group full-width">
          <label class="checkbox-item" style="font-weight: 600;">
            <input type="checkbox" id="editClassActive" ${cls.active !== false ? 'checked' : ''}>
            <span>Active & Available for Student Placement</span>
          </label>
        </div>
      </div>

      <div class="edit-modal-actions">
        <button type="button" id="deleteClassFromEditBtn" class="btn-delete-from-edit">
          <span>⏸️ Deactivate / Delete</span>
        </button>
        <div class="edit-modal-btn-group">
          <button type="button" id="cancelClassEditBtn" class="btn-cancel-edit">
            <span>Cancel</span>
          </button>
          <button type="submit" id="saveClassEditBtn" class="btn-save-edit">
            <span>💾 Save Changes</span>
          </button>
        </div>
      </div>

      <p id="editClassModalFeedback" class="form-feedback" aria-live="polite"></p>
    </form>
  `;
}

export function renderAssignStudentForm(cls) {
  return `
    <div class="edit-modal-top">
      <div class="profile-avatar class-modal-avatar">➕</div>
      <div>
        <span class="edit-modal-badge">STUDENT ASSIGNMENT</span>
        <h3 id="modalClassName">Assign Student to ${cls.name}</h3>
      </div>
    </div>

    <form id="assignStudentModalForm" class="edit-modal-form" novalidate>
      <div class="edit-form-grid">
        <div class="form-group full-width">
          <label for="assignStudentPicker">Select Student to Assign *</label>
          <select id="assignStudentPicker" required aria-describedby="errorAssignStudentPicker">
            <option value="" disabled selected>Choose a student from the registry...</option>
          </select>
          <span class="field-error" id="errorAssignStudentPicker" role="alert" aria-live="polite"></span>
        </div>
      </div>

      <div class="edit-modal-actions">
        <button type="button" id="cancelAssignStudentBtn" class="btn-cancel-edit">
          <span>Cancel</span>
        </button>
        <button type="submit" id="confirmAssignStudentBtn" class="btn-save-edit">
          <span>✅ Assign to ${cls.name}</span>
        </button>
      </div>

      <p id="assignStudentModalFeedback" class="form-feedback" aria-live="polite"></p>
    </form>
  `;
}

export function renderMoveStudentForm(cls, student) {
  return `
    <div class="edit-modal-top">
      <div class="profile-avatar class-modal-avatar">⇄</div>
      <div>
        <span class="edit-modal-badge">REASSIGN STUDENT CLASS</span>
        <h3 id="modalClassName">Move ${student.name}</h3>
      </div>
    </div>

    <form id="moveStudentModalForm" class="edit-modal-form" novalidate>
      <div class="edit-form-grid">
        <div class="form-group full-width">
          <label>Current Placement</label>
          <div class="form-hint" style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">
            👤 ${student.name} (#EDU-${student.id.toString().padStart(4, '0')}) is currently in <strong>${cls.name}</strong>.
          </div>
        </div>

        <div class="form-group full-width">
          <label for="moveTargetClassSelect">Select New Target Class Level *</label>
          <select id="moveTargetClassSelect" required aria-describedby="errorMoveTargetClass">
            <option value="" disabled selected>Choose destination class...</option>
          </select>
          <span class="field-error" id="errorMoveTargetClass" role="alert" aria-live="polite"></span>
        </div>
      </div>

      <div class="edit-modal-actions">
        <button type="button" id="cancelMoveStudentBtn" class="btn-cancel-edit">
          <span>Cancel</span>
        </button>
        <button type="submit" id="confirmMoveStudentBtn" class="btn-save-edit">
          <span>⇄ Move Student</span>
        </button>
      </div>

      <p id="moveStudentModalFeedback" class="form-feedback" aria-live="polite"></p>
    </form>
  `;
}

export function renderClassDeleteConfirmation(cls) {
  const isActive = cls.active !== false;
  return `
    <div class="delete-confirmation-card">
      <div class="delete-modal-icon">⚠️</div>
      <span class="delete-confirmation-badge">CONFIRM CLASS STATUS CHANGE</span>
      <h3 class="delete-confirmation-title">${isActive ? 'Deactivate Class' : 'Delete / Archive Class'}</h3>

      <p class="delete-confirmation-question">
        Are you sure you want to change the status of <strong>${cls.name}</strong>?
      </p>

      <div class="delete-student-summary">
        <div class="profile-avatar delete-avatar">🏛️</div>
        <div class="delete-summary-info">
          <strong>${cls.name}</strong>
          <p>${cls.studentCount || 0} Enrolled Students • ${isActive ? 'Currently Active' : 'Currently Inactive'}</p>
        </div>
      </div>

      <div class="delete-warning-box">
        <p>ℹ️ <strong>Safe Deactivation Policy:</strong> If students are currently assigned to this class, the system will safely deactivate it (marking it as archived) to preserve all historical academic records without breaking database relational integrity.</p>
      </div>

      <div class="delete-modal-actions">
        <button type="button" id="cancelDeleteClassBtn" class="btn-cancel-delete">
          <span>Cancel</span>
        </button>
        <button type="button" id="confirmDeleteClassBtn" class="btn-confirm-delete">
          <span>${isActive ? '⏸️ Deactivate Class' : '🗑️ Delete Class'}</span>
        </button>
      </div>

      <p id="deleteClassModalFeedback" class="form-feedback" aria-live="polite"></p>
    </div>
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

function wireClassEditFormValidation(cls, modalBody) {
  const form = modalBody.querySelector('#editClassModalForm');
  if (!form) return;

  const nameInput = form.querySelector('#editClassName');
  const descInput = form.querySelector('#editClassDescription');
  const activeInput = form.querySelector('#editClassActive');
  const errorName = form.querySelector('#errorEditClassName');

  const cancelBtn = form.querySelector('#cancelClassEditBtn');
  const deleteBtn = form.querySelector('#deleteClassFromEditBtn');
  const feedbackEl = form.querySelector('#editClassModalFeedback');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openClassModal(cls, 'view', onClassUpdateCallback);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      openClassModal(cls, 'delete', onClassUpdateCallback);
    });
  }

  function validateName() {
    const val = nameInput?.value.trim() || '';
    if (!val) {
      return setModalFieldError(nameInput, errorName, 'Please enter a valid class title (e.g. Form 1, Form 2).');
    }
    return setModalFieldError(nameInput, errorName, '');
  }

  nameInput?.addEventListener('blur', validateName);
  validateName();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateName()) {
      if (feedbackEl) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = '⚠️ Please fix highlighted errors before saving.';
      }
      return;
    }

    const updatedDto = {
      name: nameInput.value.trim(),
      description: descInput?.value.trim() || '',
      active: activeInput?.checked !== false,
    };

    const saveBtn = form.querySelector('#saveClassEditBtn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span>⏳ Saving...</span>';
    }

    try {
      const savedResult = await updateClassInDb(cls.id, updatedDto);
      Object.assign(cls, savedResult);

      if (typeof onClassUpdateCallback === 'function') {
        onClassUpdateCallback(cls, 'update');
      }

      openClassModal(cls, 'view', onClassUpdateCallback);
      showClassModalAlert('✅ Class details updated successfully!');
    } catch (err) {
      console.error('Error saving class changes:', err);
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

function wireAssignStudentForm(cls, modalBody, allStudents = []) {
  const form = modalBody.querySelector('#assignStudentModalForm');
  if (!form) return;

  const selectEl = form.querySelector('#assignStudentPicker');
  const errorSelect = form.querySelector('#errorAssignStudentPicker');
  const cancelBtn = form.querySelector('#cancelAssignStudentBtn');
  const feedbackEl = form.querySelector('#assignStudentModalFeedback');

  if (selectEl && allStudents && allStudents.length > 0) {
    allStudents.forEach((s) => {
      const isCurrentClass = s.class && s.class.toLowerCase() === cls.name.toLowerCase();
      const currentStatus = isCurrentClass ? ' (Already in this class)' : ` (Currently in ${s.class || 'Unassigned'})`;
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = `${s.name} (#EDU-${s.id.toString().padStart(4, '0')})${currentStatus}`;
      if (isCurrentClass) {
        option.disabled = true;
      }
      selectEl.appendChild(option);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openClassModal(cls, 'view', onClassUpdateCallback);
    });
  }

  function validateStudentPicker() {
    const val = selectEl?.value;
    if (!val) {
      return setModalFieldError(selectEl, errorSelect, 'Please select a student from the dropdown list.');
    }
    return setModalFieldError(selectEl, errorSelect, '');
  }

  selectEl?.addEventListener('change', validateStudentPicker);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStudentPicker()) return;

    const studentId = selectEl.value;
    const submitBtn = form.querySelector('#confirmAssignStudentBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Assigning...</span>';
    }

    try {
      await assignStudentToClassInDb(cls.id, studentId);
      cls.studentCount = (cls.studentCount || 0) + 1;

      if (typeof onClassUpdateCallback === 'function') {
        onClassUpdateCallback(cls, 'update');
      }

      openClassModal(cls, 'view', onClassUpdateCallback);
      showClassModalAlert(`✅ Student successfully assigned to ${cls.name}!`);
    } catch (err) {
      console.error('Error assigning student:', err);
      if (feedbackEl) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = `❌ Failed to assign student: ${err.message}`;
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>✅ Assign to ${cls.name}</span>`;
      }
    }
  });
}

function wireMoveStudentForm(cls, student, modalBody, availableClasses = []) {
  const form = modalBody.querySelector('#moveStudentModalForm');
  if (!form) return;

  const selectEl = form.querySelector('#moveTargetClassSelect');
  const errorSelect = form.querySelector('#errorMoveTargetClass');
  const cancelBtn = form.querySelector('#cancelMoveStudentBtn');
  const feedbackEl = form.querySelector('#moveStudentModalFeedback');

  if (selectEl && availableClasses && availableClasses.length > 0) {
    availableClasses
      .filter((c) => c.name.toLowerCase() !== cls.name.toLowerCase() && c.active !== false)
      .forEach((c) => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.name} (${c.studentCount || 0} students)`;
        selectEl.appendChild(option);
      });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openClassModal(cls, 'view', onClassUpdateCallback);
    });
  }

  function validateTargetClass() {
    const val = selectEl?.value;
    if (!val) {
      return setModalFieldError(selectEl, errorSelect, 'Please select a destination class level.');
    }
    return setModalFieldError(selectEl, errorSelect, '');
  }

  selectEl?.addEventListener('change', validateTargetClass);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateTargetClass()) return;

    const targetClassId = selectEl.value;
    const submitBtn = form.querySelector('#confirmMoveStudentBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Moving...</span>';
    }

    try {
      await assignStudentToClassInDb(targetClassId, student.id);
      if (cls.studentCount > 0) cls.studentCount -= 1;

      if (typeof onClassUpdateCallback === 'function') {
        onClassUpdateCallback(cls, 'update');
      }

      openClassModal(cls, 'view', onClassUpdateCallback);
      showClassModalAlert(`✅ ${student.name} moved to new class!`);
    } catch (err) {
      console.error('Error moving student:', err);
      if (feedbackEl) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = `❌ Failed to move student: ${err.message}`;
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>⇄ Move Student</span>';
      }
    }
  });
}

function wireClassDeleteConfirmation(cls, modalBody) {
  const cancelBtn = modalBody.querySelector('#cancelDeleteClassBtn');
  const confirmBtn = modalBody.querySelector('#confirmDeleteClassBtn');
  const feedbackEl = modalBody.querySelector('#deleteClassModalFeedback');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      openClassModal(cls, 'edit', onClassUpdateCallback);
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<span>⏳ Updating Status...</span>';

      try {
        const result = await deleteOrDeactivateClassInDb(cls.id);

        if (result && result.action === 'DEACTIVATED') {
          cls.active = false;
          if (typeof onClassUpdateCallback === 'function') {
            onClassUpdateCallback(cls, 'update');
          }
          openClassModal(cls, 'view', onClassUpdateCallback);
          showClassModalAlert('ℹ️ Class has enrolled students; marked as Inactive/Archived.');
        } else {
          if (typeof onClassUpdateCallback === 'function') {
            onClassUpdateCallback(cls, 'delete');
          }
          closeClassModal();
        }
      } catch (err) {
        console.error('Error deleting/deactivating class:', err);
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

function showClassModalAlert(msg) {
  const alertBanner = document.querySelector('#classModalAlert');
  if (alertBanner) {
    alertBanner.textContent = msg;
    alertBanner.style.display = 'block';
    setTimeout(() => {
      alertBanner.style.display = 'none';
    }, 4000);
  }
}

export async function openClassModal(cls, mode = 'view', updateCallback = null, extraContext = null) {
  activeClass = cls;
  if (updateCallback) onClassUpdateCallback = updateCallback;

  const modal = document.querySelector('#classModal');
  const modalBody = document.querySelector('#classModalBody');
  if (!modal || !modalBody) return;

  if (mode === 'edit') {
    modalBody.innerHTML = renderClassEditForm(cls);
    wireClassEditFormValidation(cls, modalBody);
  } else if (mode === 'delete') {
    modalBody.innerHTML = renderClassDeleteConfirmation(cls);
    wireClassDeleteConfirmation(cls, modalBody);
  } else if (mode === 'assign-student') {
    const allStudents = (await fetchStudentsFromDb()) || [];
    modalBody.innerHTML = renderAssignStudentForm(cls);
    wireAssignStudentForm(cls, modalBody, allStudents);
  } else if (mode === 'move-student' && extraContext?.student) {
    const allClasses = (await fetchClassesFromDb()) || [];
    modalBody.innerHTML = renderMoveStudentForm(cls, extraContext.student);
    wireMoveStudentForm(cls, extraContext.student, modalBody, allClasses);
  } else {
    // View Details with Students
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 30px;">
        <div class="empty-icon">⏳</div>
        <p>Loading class details and student roster...</p>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    let students = [];
    try {
      students = (await fetchClassStudentsFromDb(cls.id)) || [];
    } catch {
      students = [];
    }

    cls.studentCount = students.length;
    modalBody.innerHTML = renderClassDetails(cls, students);

    const editBtn = modalBody.querySelector('#editClassBtn');
    const editBottomBtn = modalBody.querySelector('#editClassBottomBtn');
    const deactivateBtn = modalBody.querySelector('#deactivateClassTopBtn');
    const assignBtn = modalBody.querySelector('#assignStudentModalBtn');

    if (editBtn) editBtn.addEventListener('click', () => openClassModal(cls, 'edit', onClassUpdateCallback));
    if (editBottomBtn) editBottomBtn.addEventListener('click', () => openClassModal(cls, 'edit', onClassUpdateCallback));
    if (deactivateBtn) deactivateBtn.addEventListener('click', () => openClassModal(cls, 'delete', onClassUpdateCallback));
    if (assignBtn) assignBtn.addEventListener('click', () => openClassModal(cls, 'assign-student', onClassUpdateCallback));

    // Move student buttons in roster
    modalBody.querySelectorAll('[data-action="move-student"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const studentId = Number(btn.dataset.studentId);
        const studentName = btn.dataset.studentName;
        openClassModal(cls, 'move-student', onClassUpdateCallback, {
          student: { id: studentId, name: studentName },
        });
      });
    });
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

export function closeClassModal() {
  const modal = document.querySelector('#classModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  activeClass = null;
}

export function initClassModal(onUpdate) {
  if (onUpdate) {
    onClassUpdateCallback = onUpdate;
  }

  const modal = document.querySelector('#classModal');
  const closeBtn = document.querySelector('#closeClassModalBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeClassModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeClassModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeClassModal();
    }
  });
}
