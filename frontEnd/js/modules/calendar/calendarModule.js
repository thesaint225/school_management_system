// Main Calendar Module Controller
import { calendarState } from './calendarState.js';
import { renderTermProgressWidget } from './termProgress.js';
import { renderCalendarGrid } from './calendarGrid.js';
import { renderCalendarSidebar } from './calendarSidebar.js';
import { formatCalendarHeaderDate, toISODateString } from '../../utils/dateUtils.js';

export function refreshCalendarViews() {
  const monthTitle = document.querySelector('#calMonthYearTitle');
  if (monthTitle) {
    monthTitle.textContent = formatCalendarHeaderDate(
      calendarState.viewYear,
      calendarState.viewMonth,
    );
  }
  renderTermProgressWidget();
  renderCalendarGrid((newSelectedDate) => {
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
      if (calendarState.viewMonth === 0) {
        calendarState.viewMonth = 11;
        calendarState.viewYear -= 1;
      } else {
        calendarState.viewMonth -= 1;
      }
      refreshCalendarViews();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      if (calendarState.viewMonth === 11) {
        calendarState.viewMonth = 0;
        calendarState.viewYear += 1;
      } else {
        calendarState.viewMonth += 1;
      }
      refreshCalendarViews();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      calendarState.viewYear = now.getFullYear();
      calendarState.viewMonth = now.getMonth();
      calendarState.selectedDate = toISODateString(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
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

      calendarState.activeFilter = filterVal;

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
        const [y, m, d] = dateStr.split('-').map(Number);
        calendarState.viewYear = y;
        calendarState.viewMonth = m - 1;
        calendarState.selectedDate = dateStr;
        refreshCalendarViews();
      }
    });
  }
}
