// Calendar 7-Column Grid Matrix Generator
import { getCalendarState, setSelectedDate } from './calendarState.js';
import { getCalendarItems } from '../../data/calendarData.js';
import { toISODateString } from '../../utils/dateUtils.js';

function getMonthDaysMatrix(year, monthIndex) {
  // First day of current month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  // Total days in current month
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  // Total days in previous month
  const totalDaysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const cells = [];

  // 1. Trailing days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = totalDaysInPrevMonth - i;
    const prevMonthIdx = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    cells.push({
      year: prevYear,
      monthIndex: prevMonthIdx,
      day: dayNum,
      dateString: toISODateString(prevYear, prevMonthIdx, dayNum),
      isCurrentMonth: false,
    });
  }

  // 2. Days in current month
  for (let d = 1; d <= totalDaysInMonth; d++) {
    cells.push({
      year,
      monthIndex,
      day: d,
      dateString: toISODateString(year, monthIndex, d),
      isCurrentMonth: true,
    });
  }

  // 3. Leading days for next month (fill up to full rows: 35 or 42 cells)
  const totalGridCells = cells.length > 35 ? 42 : 35;
  const remainingCells = totalGridCells - cells.length;
  for (let n = 1; n <= remainingCells; n++) {
    const nextMonthIdx = monthIndex === 11 ? 0 : monthIndex + 1;
    const nextYear = monthIndex === 11 ? year + 1 : year;
    cells.push({
      year: nextYear,
      monthIndex: nextMonthIdx,
      day: n,
      dateString: toISODateString(nextYear, nextMonthIdx, n),
      isCurrentMonth: false,
    });
  }

  return cells;
}

function filterCalendarItemsByDateAndCategory(dateString, categoryFilter) {
  return getCalendarItems().filter((item) => {
    const matchesDate = item.date === dateString;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesDate && matchesCategory;
  });
}

export function renderCalendarGrid(onSelectDateCallback) {
  const gridContainer = document.querySelector('#calGridDays');
  if (!gridContainer) return;

  const { viewYear, viewMonth, selectedDate, activeFilter } = getCalendarState();
  const cells = getMonthDaysMatrix(viewYear, viewMonth);

  const now = new Date();
  const todayISO = toISODateString(now.getFullYear(), now.getMonth(), now.getDate());

  gridContainer.replaceChildren();

  cells.forEach((cell) => {
    const itemsOnThisDay = filterCalendarItemsByDateAndCategory(cell.dateString, activeFilter);
    const isToday = cell.dateString === todayISO;
    const isSelected = cell.dateString === selectedDate;

    const cellClasses = [
      'cal-day-cell',
      cell.isCurrentMonth ? 'in-month' : 'out-month',
      isToday ? 'is-today' : '',
      isSelected ? 'is-selected' : '',
      itemsOnThisDay.length > 0 ? 'has-events' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = cellClasses;
    btn.dataset.date = cell.dateString;
    btn.setAttribute('aria-label', `${cell.dateString}, ${itemsOnThisDay.length} items scheduled`);
    btn.setAttribute('aria-pressed', String(isSelected));

    const dayNumberSpan = document.createElement('span');
    dayNumberSpan.className = 'cal-day-number';
    dayNumberSpan.textContent = String(cell.day);
    btn.appendChild(dayNumberSpan);

    if (itemsOnThisDay.length > 0) {
      const dotsDiv = document.createElement('div');
      dotsDiv.className = 'cal-day-dots';

      const visibleDots = itemsOnThisDay.slice(0, 4);
      visibleDots.forEach((item) => {
        const dotSpan = document.createElement('span');
        const safeCategory = String(item.category || 'default').replace(/[^a-z0-9_-]/gi, '');
        dotSpan.className = `cal-dot cal-dot-${safeCategory}`;
        dotSpan.title = String(item.title || '');
        dotsDiv.appendChild(dotSpan);
      });

      if (itemsOnThisDay.length > 4) {
        const moreSpan = document.createElement('span');
        moreSpan.className = 'cal-dot-more';
        moreSpan.textContent = '+';
        dotsDiv.appendChild(moreSpan);
      }

      btn.appendChild(dotsDiv);
    }

    gridContainer.appendChild(btn);
  });

  // Day Cell click event delegation
  gridContainer.onclick = (e) => {
    const dayBtn = e.target.closest('.cal-day-cell');
    if (!dayBtn) return;
    const clickedDate = dayBtn.dataset.date;
    if (clickedDate) {
      setSelectedDate(clickedDate);
      renderCalendarGrid(onSelectDateCallback);
      if (onSelectDateCallback) {
        onSelectDateCallback(clickedDate);
      }
    }
  };
}
