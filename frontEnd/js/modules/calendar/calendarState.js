// Calendar Module Centralized State

const today = new Date();

export const calendarState = {
  viewYear: today.getFullYear(),
  viewMonth: today.getMonth(), // 0-indexed (0 = Jan, 8 = Sep, 9 = Oct, etc.)
  selectedDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
  activeFilter: 'all', // 'all' | 'term' | 'event' | 'exam' | 'holiday' | 'deadline'
};
