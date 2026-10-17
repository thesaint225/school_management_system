// classRoster.js - Class Directory, Search, Filter, & Grid Roster Module

export function classCardHTML(cls) {
  const isActive = cls.active !== false;
  const statusBadgeClass = isActive ? 'status-badge-active' : 'status-badge-danger';
  const statusText = isActive ? 'Active' : 'Archived / Inactive';
  const studentCount = cls.studentCount || 0;
  const description = cls.description || 'No level description provided for this academic class.';

  return `
    <div class="class-card ${!isActive ? 'class-card-inactive' : ''}" data-id="${cls.id}" role="button" tabindex="0" aria-label="View class ${cls.name}">
      <div class="class-card-top">
        <div class="class-title-group">
          <span class="class-icon-badge">🏛️</span>
          <h4 class="class-card-title">${cls.name}</h4>
        </div>
        <span class="status-badge ${statusBadgeClass}">${statusText}</span>
      </div>
      
      <div class="class-card-body">
        <div class="class-enrollment-badge">
          <span>👥</span>
          <strong>${studentCount} Enrolled Student${studentCount === 1 ? '' : 's'}</strong>
        </div>
        <p class="class-card-desc">${description}</p>
      </div>

      <div class="card-action-group">
        <span class="card-view-btn" data-action="view">Students & Details ↗</span>
        <span class="card-edit-btn" data-action="edit">Edit ✏️</span>
      </div>
    </div>
  `;
}

export function renderClassGrid(classList, containerEl, onClassClick) {
  if (!containerEl) return;

  if (!classList || classList.length === 0) {
    containerEl.innerHTML = `
      <div class="empty-roster-state">
        <div class="empty-icon">🏛️</div>
        <h4>No Classes Found</h4>
        <p>No academic class records match your search or filter criteria.</p>
      </div>
    `;
    return;
  }

  containerEl.innerHTML = classList.map(classCardHTML).join('');
}

export function initClassRoster(classes, onClassClick) {
  const classListEl = document.querySelector('#classList');
  const classSearchInput = document.querySelector('#classSearchInput');
  const classStatusFilter = document.querySelector('#classStatusFilter');
  const totalClassesCount = document.querySelector('#totalClassesListCount');
  const activeClassesCount = document.querySelector('#activeClassesListCount');
  const totalEnrolledCount = document.querySelector('#totalEnrolledInClassesCount');

  function updateClassStats() {
    if (totalClassesCount) {
      totalClassesCount.textContent = classes.length;
    }
    if (activeClassesCount) {
      const activeCount = classes.filter((c) => c.active !== false).length;
      activeClassesCount.textContent = activeCount;
    }
    if (totalEnrolledCount) {
      const totalEnrolled = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
      totalEnrolledCount.textContent = totalEnrolled;
    }
  }

  updateClassStats();

  function filterAndRender() {
    const searchQuery = (classSearchInput?.value || '').trim().toLowerCase();
    const selectedStatus = classStatusFilter?.value || 'All';

    const filtered = classes.filter((cls) => {
      const name = (cls.name || '').toLowerCase();
      const desc = (cls.description || '').toLowerCase();

      const matchesSearch = !searchQuery || name.includes(searchQuery) || desc.includes(searchQuery);

      let matchesStatus = true;
      if (selectedStatus === 'Active') {
        matchesStatus = cls.active !== false;
      } else if (selectedStatus === 'Inactive') {
        matchesStatus = cls.active === false;
      }

      return matchesSearch && matchesStatus;
    });

    renderClassGrid(filtered, classListEl, onClassClick);
  }

  // Initial render
  filterAndRender();

  // Search & Filter listeners
  classSearchInput?.addEventListener('input', filterAndRender);
  classStatusFilter?.addEventListener('change', filterAndRender);

  // Card click delegator
  classListEl?.addEventListener('click', (e) => {
    const card = e.target.closest('.class-card');
    if (!card) return;
    const clickedId = Number(card.dataset.id);
    const selected = classes.find((c) => c.id === clickedId);
    if (!selected) return;

    const actionBtn = e.target.closest('[data-action]');
    const action = actionBtn ? actionBtn.dataset.action : 'view';

    if (onClassClick) {
      onClassClick(selected, action);
    }
  });

  return {
    refresh: () => {
      updateClassStats();
      filterAndRender();
    },
  };
}
