// subjectRoster.js - Subject Directory, Search, Filter, & Grid Roster Module

export function subjectCardHTML(subject) {
  const isActive = subject.active !== false;
  const statusBadgeClass = isActive ? 'status-badge-active' : 'status-badge-danger';
  const statusText = isActive ? 'Active' : 'Archived / Inactive';
  const subjectCode = subject.code || `SUB-${subject.id}`;
  const department = subject.department || 'General Studies';
  const description = subject.description || 'No description provided for this course.';

  return `
    <div class="subject-card ${!isActive ? 'subject-card-inactive' : ''}" data-id="${subject.id}" role="button" tabindex="0" aria-label="View subject ${subject.name}">
      <div class="subject-card-top">
        <span class="subject-code-badge">${subjectCode}</span>
        <span class="status-badge ${statusBadgeClass}">${statusText}</span>
      </div>
      
      <div class="subject-card-body">
        <h4 class="subject-card-title">${subject.name}</h4>
        <p class="subject-card-dept">🏛️ ${department}</p>
        <p class="subject-card-desc">${description}</p>
      </div>

      <div class="card-action-group">
        <span class="card-view-btn" data-action="view">Details ↗</span>
        <span class="card-edit-btn" data-action="edit">Edit ✏️</span>
      </div>
    </div>
  `;
}

export function renderSubjectGrid(subjectsList, containerEl, onSubjectClick) {
  if (!containerEl) return;

  if (!subjectsList || subjectsList.length === 0) {
    containerEl.innerHTML = `
      <div class="empty-roster-state">
        <div class="empty-icon">📚</div>
        <h4>No Subjects Found</h4>
        <p>No subject or course records match your current search or filter criteria.</p>
      </div>
    `;
    return;
  }

  containerEl.innerHTML = subjectsList.map(subjectCardHTML).join('');
}

export function initSubjectRoster(subjects, onSubjectClick) {
  const subjectList = document.querySelector('#subjectList');
  const subjectSearchInput = document.querySelector('#subjectSearchInput');
  const subjectDeptFilter = document.querySelector('#subjectDeptFilter');
  const subjectStatusFilter = document.querySelector('#subjectStatusFilter');
  const totalSubjectsCount = document.querySelector('#totalSubjectsCount');
  const activeSubjectsCount = document.querySelector('#activeSubjectsCount');

  function updateSubjectStats() {
    if (totalSubjectsCount) {
      totalSubjectsCount.textContent = subjects.length;
    }
    if (activeSubjectsCount) {
      const activeCount = subjects.filter((s) => s.active !== false).length;
      activeSubjectsCount.textContent = activeCount;
    }
  }

  updateSubjectStats();

  function filterAndRender() {
    const searchQuery = (subjectSearchInput?.value || '').trim().toLowerCase();
    const selectedDept = subjectDeptFilter?.value || 'All';
    const selectedStatus = subjectStatusFilter?.value || 'All';

    const filtered = subjects.filter((subject) => {
      const name = (subject.name || '').toLowerCase();
      const code = (subject.code || '').toLowerCase();
      const dept = (subject.department || '').toLowerCase();
      const desc = (subject.description || '').toLowerCase();

      const matchesSearch = !searchQuery ||
        name.includes(searchQuery) ||
        code.includes(searchQuery) ||
        dept.includes(searchQuery) ||
        desc.includes(searchQuery);

      const matchesDept = selectedDept === 'All' || subject.department === selectedDept;
      
      let matchesStatus = true;
      if (selectedStatus === 'Active') {
        matchesStatus = subject.active !== false;
      } else if (selectedStatus === 'Inactive') {
        matchesStatus = subject.active === false;
      }

      return matchesSearch && matchesDept && matchesStatus;
    });

    renderSubjectGrid(filtered, subjectList, onSubjectClick);
  }

  // Initial render
  filterAndRender();

  // Search and filter listeners
  subjectSearchInput?.addEventListener('input', filterAndRender);
  subjectDeptFilter?.addEventListener('change', filterAndRender);
  subjectStatusFilter?.addEventListener('change', filterAndRender);

  // Card click delegator
  subjectList?.addEventListener('click', (e) => {
    const card = e.target.closest('.subject-card');
    if (!card) return;
    const clickedId = Number(card.dataset.id);
    const selected = subjects.find((s) => s.id === clickedId);
    if (!selected) return;

    const actionBtn = e.target.closest('[data-action]');
    const action = actionBtn ? actionBtn.dataset.action : 'view';

    if (onSubjectClick) {
      onSubjectClick(selected, action);
    }
  });

  return {
    refresh: () => {
      updateSubjectStats();
      filterAndRender();
    },
  };
}
