// Main Calendar Module Controller
import {
  getCalendarState,
  setCalendarViewMonth,
  navigateCalendarMonth,
  setSelectedDate,
  setActiveFilter,
  resetCalendarToToday,
} from './calendarState.js';
import { renderTermProgressWidget } from './termProgress.js';
import { renderCalendarGrid } from './calendarGrid.js';
import { renderCalendarSidebar } from './calendarSidebar.js';
import { formatCalendarHeaderDate } from '../../utils/dateUtils.js';

export function refreshCalendarViews() {
  const monthTitle = document.querySelector('#calMonthYearTitle');
  if (monthTitle) {
    const { viewYear, viewMonth } = getCalendarState();
    monthTitle.textContent = formatCalendarHeaderDate(viewYear, viewMonth);
  }
  renderTermProgressWidget();
  renderCalendarGrid((_newSelectedDate) => {
    renderCalendarSidebar();
  });
  renderCalendarSidebar();
}

export function initCalendarModule() {
  // DOM Elements
  const prevMonthBtn = document.querySelector('#calPrevMonthBtn');
  const nextMonthBtn = document.querySelector('#calNextMonthBtn');
  const todayBtn = document.querySelector('#calTodayBtn');
  const filterPillsContainer = document.querySelector('#calFilterPills');
  const upcomingWrap = document.querySelector('#calUpcomingList');

  // 1. Initial Render
  refreshCalendarViews();

  // 2. Navigation Handlers
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      navigateCalendarMonth(-1);
      refreshCalendarViews();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      navigateCalendarMonth(1);
      refreshCalendarViews();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      resetCalendarToToday();
      refreshCalendarViews();
    });
  }

  // 3. Category Filter Handlers
  if (filterPillsContainer) {
    filterPillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.cal-filter-pill');
      if (!pill) return;

      const filterVal = pill.dataset.filter;
      if (!filterVal) return;

      setActiveFilter(filterVal);

      // Update active style on pills
      filterPillsContainer.querySelectorAll('.cal-filter-pill').forEach((btn) => {
        const isCurrent = btn.dataset.filter === filterVal;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      });

      refreshCalendarViews();
    });
  }

  // 4. Click handler for upcoming highlights to jump directly to that date
  if (upcomingWrap) {
    upcomingWrap.addEventListener('click', (e) => {
      const item = e.target.closest('.cal-upcoming-item');
      if (!item) return;

      const dateStr = item.dataset.date;
      if (dateStr) {
        const [y, m] = dateStr.split('-').map(Number);
        setCalendarViewMonth(y, m - 1);
        setSelectedDate(dateStr);
        refreshCalendarViews();
      }
    });
  }
}
