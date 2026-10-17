// teacherRoster.js - Teacher Directory, Search, Filter, & Grid Roster Module

import { getInitials, createSubjectPill } from './teacherModal.js';
import { getActiveClasses } from '../classes/classUtils.js';

export function teacherCardHTML(teacher) {
  const fullName = teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`;
  const initials = getInitials(fullName);
  const status = teacher.employmentStatus || 'Full-time';
  let statusBadgeClass = 'status-badge-active';
  if (status === 'Part-time') statusBadgeClass = 'status-badge-partial';
  if (status === 'On Leave') statusBadgeClass = 'status-badge-danger';

  const subjectPills = (teacher.subjects || []).slice(0, 3).map(createSubjectPill).join('');
  const extraSubjectsCount = (teacher.subjects || []).length > 3 ? `<span class="subject-pill-more">+${teacher.subjects.length - 3}</span>` : '';

  const classPills = (teacher.classes || []).slice(0, 2).map((c) => `<span class="class-pill-sm">🏛️ ${c}</span>`).join('');
  const extraClassesCount = (teacher.classes || []).length > 2 ? `<span class="subject-pill-more">+${teacher.classes.length - 2}</span>` : '';

  return `
    <div class="teacher-card" data-id="${teacher.id}" role="button" tabindex="0" aria-label="View profile of ${fullName}">
      <div class="teacher-card-top">
        <div class="profile-avatar teacher-card-avatar">${initials}</div>
        <div class="teacher-card-meta">
          <span class="teacher-staff-id">${teacher.teacherNumber || `#TEA-${teacher.id}`}</span>
          <span class="status-badge ${statusBadgeClass}">${status}</span>
        </div>
      </div>
      
      <div class="teacher-card-body">
        <h4 class="teacher-card-name">${fullName}</h4>
        <p class="teacher-card-dept">${teacher.department || 'Academic Staff'}</p>
        <p class="teacher-card-qual">🎓 ${teacher.qualification || 'Educator'}</p>
        
        <div class="teacher-card-subjects">
          ${subjectPills}
          ${extraSubjectsCount}
        </div>

        <div class="teacher-card-classes">
          ${classPills || '<span class="cal-empty-desc" style="font-size:0.75rem;">No classes allocated</span>'}
          ${extraClassesCount}
        </div>
      </div>

      <div class="card-action-group">
        <span class="card-view-btn" data-action="view">Profile ↗</span>
        <span class="card-edit-btn" data-action="edit">Edit ✏️</span>
      </div>
    </div>
  `;
}

export function renderTeacherGrid(teachersList, containerEl, onTeacherClick) {
  if (!containerEl) return;

  if (!teachersList || teachersList.length === 0) {
    containerEl.innerHTML = `
      <div class="empty-roster-state">
        <div class="empty-icon">👨‍🏫</div>
        <h4>No Teachers Found</h4>
        <p>No teacher records match your current search or filter criteria.</p>
      </div>
    `;
    return;
  }

  containerEl.innerHTML = teachersList.map(teacherCardHTML).join('');
}

export function initTeacherRoster(teachers, onTeacherClick) {
  const teacherList = document.querySelector('#teacherList');
  const teacherSearchInput = document.querySelector('#teacherSearchInput');
  const teacherClassFilter = document.querySelector('#teacherClassFilter');
  const teacherDeptFilter = document.querySelector('#teacherDeptFilter');
  const teacherStatusFilter = document.querySelector('#teacherStatusFilter');
  const totalTeachersCount = document.querySelector('#totalTeachersCount');
  const totalDepartmentsCount = document.querySelector('#totalDepartmentsCount');

  async function populateClassFilterDropdown() {
    if (!teacherClassFilter) return;
    try {
      const activeClasses = await getActiveClasses();
      const currentSelected = teacherClassFilter.value || 'All';

      teacherClassFilter.innerHTML = '';
      const allOption = document.createElement('option');
      allOption.value = 'All';
      allOption.textContent = 'All Classes';
      if (currentSelected === 'All') {
        allOption.selected = true;
      }
      teacherClassFilter.appendChild(allOption);

      activeClasses.forEach((cls) => {
        const option = document.createElement('option');
        option.value = cls.name;
        option.textContent = `🏛️ ${cls.name}`;
        if (cls.name === currentSelected) {
          option.selected = true;
        }
        teacherClassFilter.appendChild(option);
      });
    } catch (err) {
      console.warn('Could not populate class filter dropdown:', err);
    }
  }

  function updateTeacherStats() {
    if (totalTeachersCount) {
      totalTeachersCount.textContent = teachers.length;
    }
    if (totalDepartmentsCount) {
      const depts = new Set(teachers.map((t) => t.department).filter(Boolean));
      totalDepartmentsCount.textContent = depts.size;
    }
  }

  updateTeacherStats();
  populateClassFilterDropdown();

  function filterAndRender() {
    const searchQuery = (teacherSearchInput?.value || '').trim().toLowerCase();
    const selectedClass = teacherClassFilter?.value || 'All';
    const selectedDept = teacherDeptFilter?.value || 'All';
    const selectedStatus = teacherStatusFilter?.value || 'All';

    const filtered = teachers.filter((teacher) => {
      const fullName = (teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`).toLowerCase();
      const teacherNo = (teacher.teacherNumber || '').toLowerCase();
      const dept = (teacher.department || '').toLowerCase();
      const subjects = (teacher.subjects || []).join(' ').toLowerCase();
      const teacherClasses = (teacher.classes || []).join(' ').toLowerCase();

      const matchesSearch = !searchQuery ||
        fullName.includes(searchQuery) ||
        teacherNo.includes(searchQuery) ||
        dept.includes(searchQuery) ||
        subjects.includes(searchQuery) ||
        teacherClasses.includes(searchQuery);

      const matchesClass = selectedClass === 'All' || (teacher.classes || []).includes(selectedClass);
      const matchesDept = selectedDept === 'All' || teacher.department === selectedDept;
      const matchesStatus = selectedStatus === 'All' || teacher.employmentStatus === selectedStatus;

      return matchesSearch && matchesClass && matchesDept && matchesStatus;
    });

    renderTeacherGrid(filtered, teacherList, onTeacherClick);
  }

  // Initial render
  filterAndRender();

  // Search and filter listeners
  teacherSearchInput?.addEventListener('input', filterAndRender);
  teacherClassFilter?.addEventListener('change', filterAndRender);
  teacherDeptFilter?.addEventListener('change', filterAndRender);
  teacherStatusFilter?.addEventListener('change', filterAndRender);

  // Card click delegator
  teacherList?.addEventListener('click', (e) => {
    const card = e.target.closest('.teacher-card');
    if (!card) return;
    const clickedId = Number(card.dataset.id);
    const selected = teachers.find((t) => t.id === clickedId);
    if (!selected) return;

    const actionBtn = e.target.closest('[data-action]');
    const action = actionBtn ? actionBtn.dataset.action : 'view';

    if (onTeacherClick) {
      onTeacherClick(selected, action);
    }
  });

  return {
    refresh: () => {
      updateTeacherStats();
      populateClassFilterDropdown();
      filterAndRender();
    },
  };
}
