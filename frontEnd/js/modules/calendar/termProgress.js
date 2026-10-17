// Academic Term Progress & Status Tracker
import { academicTerms } from '../../data/calendarData.js';
import { formatTermRange, calculateDaysBetween } from '../../utils/dateUtils.js';

export function getActiveAcademicTerm() {
  const active = academicTerms.find((t) => t.status === 'Active');
  return active || academicTerms[0];
}

export function calculateTermProgress(term = getActiveAcademicTerm()) {
  const now = new Date();
  const start = new Date(term.startDate + 'T00:00:00');
  const end = new Date(term.endDate + 'T23:59:59');

  const totalDurationDays = calculateDaysBetween(start, end);
  const daysElapsed = Math.max(0, calculateDaysBetween(start, now));
  const daysRemaining = Math.max(0, calculateDaysBetween(now, end));

  let percentage = 0;
  if (totalDurationDays > 0) {
    percentage = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDurationDays) * 100)));
  }

  let statusText = 'In Progress';
  if (now < start) {
    statusText = 'Upcoming';
    percentage = 0;
  } else if (now > end) {
    statusText = 'Completed';
    percentage = 100;
  }

  return {
    term,
    totalDurationDays,
    daysElapsed,
    daysRemaining,
    percentage,
    statusText,
    formattedRange: formatTermRange(term.startDate, term.endDate),
  };
}

export function renderTermProgressWidget() {
  const progress = calculateTermProgress();
  
  const termNameEl = document.querySelector('#calTermName');
  const termRangeEl = document.querySelector('#calTermRange');
  const termProgressPctEl = document.querySelector('#calTermProgressPct');
  const termDaysLeftEl = document.querySelector('#calTermDaysLeft');
  const termProgressFill = document.querySelector('#calTermProgressBarFill');
  const termStatusBadge = document.querySelector('#calTermStatusBadge');

  if (termNameEl) termNameEl.textContent = progress.term.name;
  if (termRangeEl) termRangeEl.textContent = progress.formattedRange;
  if (termProgressPctEl) termProgressPctEl.textContent = `${progress.percentage}% Complete`;
  if (termDaysLeftEl) {
    termDaysLeftEl.textContent = `${progress.daysRemaining} days left (${progress.daysElapsed} elapsed of ${progress.totalDurationDays} days)`;
  }
  if (termProgressFill) {
    termProgressFill.style.width = `${progress.percentage}%`;
  }
  if (termStatusBadge) {
    termStatusBadge.textContent = progress.statusText;
    termStatusBadge.className = `cal-status-pill ${progress.statusText.toLowerCase()}`;
  }
}
