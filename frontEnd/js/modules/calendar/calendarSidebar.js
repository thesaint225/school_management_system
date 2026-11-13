// Calendar Sidebar: Selected Date Agenda & Upcoming Next Widget
import { getCalendarState } from './calendarState.js';
import { getCalendarItems } from '../../data/calendarData.js';
import { formatAgendaDate, calculateDaysBetween, toISODateString } from '../../utils/dateUtils.js';
import { ICONS, getCategoryIcon } from '../../utils/icons.js';

const CATEGORY_LABELS = {
  term: { label: 'Academic Term', icon: ICONS.termPill, class: 'category-term' },
  event: { label: 'School Event', icon: ICONS.eventPill, class: 'category-event' },
  exam: { label: 'Examination', icon: ICONS.examPill, class: 'category-exam' },
  holiday: { label: 'Holiday / Break', icon: ICONS.holidayPill, class: 'category-holiday' },
  deadline: { label: 'Deadline', icon: ICONS.deadlinePill, class: 'category-deadline' },
};

function createAgendaItemElement(item) {
  const meta = CATEGORY_LABELS[item.category] || {
    label: String(item.category || 'Event'),
    icon: ICONS.calendar,
    class: 'category-default',
  };

  const article = document.createElement('article');
  article.className = `cal-agenda-card ${meta.class}`;

  const topDiv = document.createElement('div');
  topDiv.className = 'cal-card-top';

  const catBadge = document.createElement('span');
  catBadge.className = `cal-category-badge ${meta.class}`;
  const iconSpan = document.createElement('span');
  iconSpan.setAttribute('aria-hidden', 'true');
  iconSpan.innerHTML = meta.icon;
  const labelSpan = document.createElement('span');
  labelSpan.textContent = meta.label;
  catBadge.append(iconSpan, ' ', labelSpan);
  topDiv.appendChild(catBadge);

  if (item.badge) {
    const subBadge = document.createElement('span');
    subBadge.className = 'cal-item-subbadge';
    subBadge.textContent = item.badge;
    topDiv.appendChild(subBadge);
  }

  const titleEl = document.createElement('h4');
  titleEl.className = 'cal-card-title';
  titleEl.textContent = item.title || '';

  const descEl = document.createElement('p');
  descEl.className = 'cal-card-desc';
  descEl.textContent = item.description || '';

  const metaGrid = document.createElement('div');
  metaGrid.className = 'cal-card-meta-grid';

  const createMetaRow = (svgIcon, labelText, valueText) => {
    const row = document.createElement('div');
    row.className = 'cal-meta-item';
    const lbl = document.createElement('span');
    lbl.className = 'cal-meta-label';
    lbl.innerHTML = svgIcon;
    lbl.append(` ${labelText}`);
    const strong = document.createElement('strong');
    strong.textContent = valueText;
    row.append(lbl, strong);
    return row;
  };

  metaGrid.append(
    createMetaRow(ICONS.time, 'Time:', item.time || 'All Day'),
    createMetaRow(ICONS.location, 'Venue:', item.location || 'School Campus'),
    createMetaRow(ICONS.users, 'Target:', item.targetAudience || 'All'),
  );

  article.append(topDiv, titleEl, descEl, metaGrid);
  return article;
}

function renderUpcomingHighlights() {
  const upcomingWrap = document.querySelector('#calUpcomingList');
  if (!upcomingWrap) return;

  const now = new Date();
  const todayISO = toISODateString(now.getFullYear(), now.getMonth(), now.getDate());

  // Filter items happening on or after today, sorted by date ascending
  const upcomingItems = getCalendarItems()
    .filter((item) => item.date >= todayISO)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 3);

  upcomingWrap.replaceChildren();

  if (upcomingItems.length === 0) {
    const emptyP = document.createElement('p');
    emptyP.className = 'cal-empty-sub';
    emptyP.textContent = 'No more scheduled items for the remainder of this term.';
    upcomingWrap.appendChild(emptyP);
    return;
  }

  upcomingItems.forEach((item) => {
    const meta = CATEGORY_LABELS[item.category] || {
      label: String(item.category || 'Event'),
      icon: ICONS.calendar,
      class: 'category-default',
    };
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

    const li = document.createElement('li');
    li.className = 'cal-upcoming-item';
    li.dataset.date = item.date;

    const iconDiv = document.createElement('div');
    iconDiv.className = `cal-upcoming-icon ${meta.class}`;
    iconDiv.setAttribute('aria-hidden', 'true');
    iconDiv.innerHTML = meta.icon;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'cal-upcoming-info';
    const titleP = document.createElement('p');
    titleP.className = 'cal-upcoming-title';
    titleP.textContent = item.title || '';
    const dateSpan = document.createElement('span');
    dateSpan.className = 'cal-upcoming-date';
    dateSpan.textContent = formatAgendaDate(item.date);
    infoDiv.append(titleP, dateSpan);

    const urgencySpan = document.createElement('span');
    urgencySpan.className = `cal-urgency-badge ${urgencyClass}`;
    urgencySpan.textContent = urgencyText;

    li.append(iconDiv, infoDiv, urgencySpan);
    upcomingWrap.appendChild(li);
  });
}

export function renderCalendarSidebar() {
  const selectedDateHeader = document.querySelector('#calSelectedDateHeader');
  const agendaListContainer = document.querySelector('#calAgendaList');
  if (!selectedDateHeader || !agendaListContainer) return;

  const { selectedDate, activeFilter } = getCalendarState();

  // Header
  selectedDateHeader.textContent = formatAgendaDate(selectedDate);

  // Filter items matching the selected date and active category filter
  const itemsForDay = getCalendarItems().filter((item) => {
    const matchesDate = item.date === selectedDate;
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    return matchesDate && matchesCategory;
  });

  agendaListContainer.replaceChildren();

  if (itemsForDay.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'cal-agenda-empty';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'cal-empty-icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.innerHTML = ICONS.calendar;

    const titleP = document.createElement('p');
    titleP.className = 'cal-empty-title';
    titleP.textContent = 'No activities scheduled';

    const descP = document.createElement('p');
    descP.className = 'cal-empty-desc';
    descP.textContent = `There are no events, exams, or deadlines on this date${activeFilter !== 'all' ? ` matching the "${activeFilter}" filter` : ''}.`;

    emptyDiv.append(iconSpan, titleP, descP);
    agendaListContainer.appendChild(emptyDiv);
  } else {
    itemsForDay.forEach((item) => {
      agendaListContainer.appendChild(createAgendaItemElement(item));
    });
  }

  // Update Upcoming Highlights widget
  renderUpcomingHighlights();
}
