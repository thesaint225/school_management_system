// Calendar Domain Namespace
import {
  getCalendarItems,
  getAcademicTerms,
  updateCalendarItems,
  updateAcademicTerms,
} from '../../data/calendarData.js';
import {
  fetchCalendarEventsFromDb,
  fetchAcademicTermsFromDb,
  fetchActiveTermFromDb,
  createCalendarEventInDb,
} from '../../api/calendarApi.js';
import {
  CalendarState,
  getCalendarState,
  setCalendarViewMonth,
  navigateCalendarMonth,
  setSelectedDate,
  setActiveFilter,
  resetCalendarToToday,
} from './calendarState.js';
import { initCalendarModule, refreshCalendarViews } from './calendarModule.js';

export const Calendar = Object.freeze({
  // Encapsulated Store Accessors & Mutators
  getItems: getCalendarItems,
  getTerms: getAcademicTerms,
  setItems: updateCalendarItems,
  setTerms: updateAcademicTerms,

  // View State
  state: CalendarState,
  getState: getCalendarState,
  setViewMonth: setCalendarViewMonth,
  navigateMonth: navigateCalendarMonth,
  setSelectedDate,
  setActiveFilter,
  resetToToday: resetCalendarToToday,

  // Backend API Operations
  fetchEventsFromDb: fetchCalendarEventsFromDb,
  fetchTermsFromDb: fetchAcademicTermsFromDb,
  fetchActiveTermFromDb,
  createEventInDb: createCalendarEventInDb,

  // UI Controllers
  init: initCalendarModule,
  refreshViews: refreshCalendarViews,
});

