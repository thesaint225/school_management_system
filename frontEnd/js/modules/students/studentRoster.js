// Student Roster & Grid Directory Module

function studentInfo(student) {
  return `
    <div class="student-card" data-id="${student.id}" role="button" tabindex="0" aria-label="View profile of ${student.name}">
      <span class="student-id">#${student.id}</span>
      <span class="student-name">${student.name}</span>
      <span class="student-class">${student.class}</span>
      <span class="student-year">Enrolled: ${student.yearOfEnrollment}</span>
      <div class="card-action-group">
        <span class="card-view-btn" data-action="view">View ↗</span>
        <span class="card-edit-btn" data-action="edit">Edit ✏️</span>
      </div>
    </div>
  `;
}

let isVisible = false;
let currentStudentsList = [];
let currentOnStudentClick = null;

export function initStudentRoster(students, onStudentClick) {
  currentStudentsList = Array.isArray(students) ? students : [];
  if (typeof onStudentClick === 'function') {
    currentOnStudentClick = onStudentClick;
  }

  const showStudentsBtn = document.querySelector('#showStudentsBtn');
  const studentList = document.querySelector('#studentList');
  const totalStudentsCount = document.querySelector('#totalStudentsCount');
  const totalClassesCount = document.querySelector('#totalClassesCount');
  const viewAllAchieversBtn = document.querySelector('#viewAllAchieversBtn');

  // Populate Dashboard Summary Counters
  if (totalStudentsCount) {
    totalStudentsCount.textContent = currentStudentsList.length;
  }

  if (totalClassesCount) {
    const classList = currentStudentsList.map((s) => s.class);
    const uniqueClasses = new Set(classList);
    totalClassesCount.textContent = uniqueClasses.size;
  }

  if (showStudentsBtn && studentList) {
    if (isVisible) {
      studentList.innerHTML = currentStudentsList.map(studentInfo).join('');
    }

    showStudentsBtn.onclick = () => {
      isVisible = !isVisible;
      if (isVisible) {
        studentList.innerHTML = currentStudentsList.map(studentInfo).join('');
        showStudentsBtn.textContent = 'Hide Students';
        showStudentsBtn.setAttribute('aria-expanded', 'true');
      } else {
        studentList.innerHTML = '';
        showStudentsBtn.textContent = 'Show Students';
        showStudentsBtn.setAttribute('aria-expanded', 'false');
      }
    };

    // Student Card click handler
    studentList.onclick = (e) => {
      const card = e.target.closest('.student-card');
      if (!card) return;
      const clickedId = Number(card.dataset.id);
      const selected = currentStudentsList.find((s) => s.id === clickedId);
      if (!selected) return;

      const actionBtn = e.target.closest('[data-action]');
      const action = actionBtn ? actionBtn.dataset.action : 'view';

      if (currentOnStudentClick) {
        currentOnStudentClick(selected, action);
      }
    };
  }

  // "View all →" button from Top Achievers widget
  if (viewAllAchieversBtn && showStudentsBtn && studentList) {
    viewAllAchieversBtn.onclick = () => {
      if (!isVisible) {
        showStudentsBtn.click();
      }
      studentList.scrollIntoView({ behavior: 'smooth' });
    };
  }
}
