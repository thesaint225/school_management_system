// Calendar Sidebar: Selected Date Agenda & Upcoming Next Widget
import { calendarState } from './calendarState.js';
import { calendarItems } from '../../data/calendarData.js';
import { formatAgendaDate, calculateDaysBetween, toISODateString } from '../../utils/dateUtils.js';
import { ICONS, getCategoryIcon } from '../../utils/icons.js';

const CATEGORY_LABELS = {
  term: { label: 'Academic Term', icon: ICONS.termPill, class: 'category-term' },
  event: { label: 'School Event', icon: ICONS.eventPill, class: 'category-event' },
  exam: { label: 'Examination', icon: ICONS.examPill, class: 'category-exam' },
  holiday: { label: 'Holiday / Break', icon: ICONS.holidayPill, class: 'category-holiday' },
  deadline: { label: 'Deadline', icon: ICONS.deadlinePill, class: 'category-deadline' },
};

export function renderAgendaItemCard(item) {
  const meta = CATEGORY_LABELS[item.category] || { label: item.category, icon: ICONS.calendar, class: 'category-default' };
  
  return `
    <article class="cal-agenda-card ${meta.class}">
      <div class="cal-card-top">
        <span class="cal-category-badge ${meta.class}">
          <span aria-hidden="true">${meta.icon}</span> <span>${meta.label}</span>
        </span>
        ${item.badge ? `<span class="cal-item-subbadge">${item.badge}</span>` : ''}
      </div>

      <h4 class="cal-card-title">${item.title}</h4>
      <p class="cal-card-desc">${item.description}</p>

      <div class="cal-card-meta-grid">
        <div class="cal-meta-item">
          <span class="cal-meta-label">${ICONS.time} Time:</span>
          <strong>${item.time || 'All Day'}</strong>
        </div>
        <div class="cal-meta-item">
          <span class="cal-meta-label">${ICONS.location} Venue:</span>
          <strong>${item.location || 'School Campus'}</strong>
        </div>
        <div class="cal-meta-item">
          <span class="cal-meta-label">${ICONS.users} Target:</span>
          <strong>${item.targetAudience || 'All'}</strong>
        </div>
      </div>
    </article>
  `;
}

export function renderUpcomingHighlights() {
  const upcomingWrap = document.querySelector('#calUpcomingList');
  if (!upcomingWrap) return;

  const now = new Date();
  const todayISO = toISODateString(now.getFullYear(), now.getMonth(), now.getDate());

  // Filter items happening on or after today, sorted by date ascending
  const upcomingItems = calendarItems
    .filter((item) => item.date >= todayISO)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 3);

  if (upcomingItems.length === 0) {
    upcomingWrap.innerHTML = `<p class="cal-empty-sub">No more scheduled items for the remainder of this term.</p>`;
    return;
  }

  const itemsHTML = upcomingItems
    .map((item) => {
      const meta = CATEGORY_LABELS[item.category] || { label: item.category, icon: ICONS.calendar, class: 'category-default' };
      const daysUntil = calculateDaysBetween(todayISO, item.date);

      let urgencyText = 'Today';
      let urgencyClass = 'good';
      if (daysUntil === 1) {
        urgencyText = 'Tomorrow';
        urgencyClass = 'warning';
      } else if (daysUntil > 1) {
        urgencyText = `In ${daysUntil} days`;
        urgencyClass = daysUntil <= 7 ? 'warning' : 'normal';
      }

      return `
        <li class="cal-upcoming-item" data-date="${item.date}">
          <div class="cal-upcoming-icon ${meta.class}" aria-hidden="true">${meta.icon}</div>
          <div class="cal-upcoming-info">
            <p class="cal-upcoming-title">${item.title}</p>
            <span class="cal-upcoming-date">${formatAgendaDate(item.date)}</span>
          </div>
          <span class="cal-urgency-badge ${urgencyClass}">${urgencyText}</span>
        </li>
      `;
    })
    .join('');

  upcomingWrap.innerHTML = itemsHTML;
}

export function renderCalendarSidebar() {
  const selectedDateHeader = document.querySelector('#calSelectedDateHeader');
  const agendaListContainer = document.querySelector('#calAgendaList');
  if (!selectedDateHeader || !agendaListContainer) return;

  const { selectedDate, activeFilter } = calendarState;

  // Header
  selectedDateHeader.textContent = formatAgendaDate(selectedDate);

  // Filter items matching the selected date and active category filter
  const itemsForDay = calendarItems.filter((item) => {
    const matchesDate = item.date === selectedDate;
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    return matchesDate && matchesCategory;
  });

  if (itemsForDay.length === 0) {
    agendaListContainer.innerHTML = `
      <div class="cal-agenda-empty">
        <span class="cal-empty-icon" aria-hidden="true">${ICONS.calendar}</span>
        <p class="cal-empty-title">No activities scheduled</p>
        <p class="cal-empty-desc">There are no events, exams, or deadlines on this date ${activeFilter !== 'all' ? `matching the "${activeFilter}" filter` : ''}.</p>
      </div>
    `;
  } else {
    agendaListContainer.innerHTML = itemsForDay.map(renderAgendaItemCard).join('');
  }

  // Update Upcoming Highlights widget
  renderUpcomingHighlights();
}
