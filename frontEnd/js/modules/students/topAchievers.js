// Top Achievers Module (.sort() & .slice(0, 3))
import { ICONS } from '../../utils/icons.js';

export function compareStudentGpa(a, b) {
  return b.gpa - a.gpa;
}

export function getStudentProgram(student) {
  const subjects = student.subjects;
  if (subjects.includes('Physics') || subjects.includes('Chemistry')) {
    return 'Science';
  }
  if (
    subjects.includes('Accounting') ||
    subjects.includes('Business Management')
  ) {
    return 'Business';
  }
  if (subjects.includes('Literature') || subjects.includes('History')) {
    return 'General Arts';
  }
  if (
    subjects.includes('Technical Drawing') ||
    subjects.includes('Applied Electricity')
  ) {
    return 'Technical';
  }
  if (
    subjects.includes('Food & Nutrition') ||
    subjects.includes('Home Economics')
  ) {
    return 'Home Economics';
  }
  return subjects[0] || 'General';
}

export function renderAchieverRow(student, index) {
  const medals = [ICONS.medalGold, ICONS.medalSilver, ICONS.medalBronze];
  const medal = medals[index] || ICONS.medalDefault;
  const program = getStudentProgram(student);

  return `
    <div class="achiever-row" data-id="${student.id}" role="button" tabindex="0" aria-label="View profile of top achiever ${student.name}">
      <span class="achiever-medal" aria-hidden="true">${medal}</span>
      <div class="achiever-details">
        <p class="achiever-name">${student.name}</p>
        <span class="achiever-meta">${student.class} • ${program}</span>
      </div>
      <span class="achiever-gpa-badge">${student.gpa} GPA</span>
    </div>
  `;
}

export function renderTopAchievers(students) {
  const studentCopy = [...students];
  studentCopy.sort(compareStudentGpa);
  const top3Achievers = studentCopy.slice(0, 3);
  return top3Achievers.map(renderAchieverRow).join('');
}

export function initTopAchievers(students, onAchieverClick) {
  const achieversList = document.querySelector('#achieversList');
  if (achieversList) {
    achieversList.innerHTML = renderTopAchievers(students);

    achieversList.addEventListener('click', (e) => {
      const row = e.target.closest('.achiever-row');
      if (!row) return;
      const clickedId = Number(row.dataset.id);
      const selected = students.find((s) => s.id === clickedId);
      if (selected && onAchieverClick) {
        onAchieverClick(selected);
      }
    });
  }
}
