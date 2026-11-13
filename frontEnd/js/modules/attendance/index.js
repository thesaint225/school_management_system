// Attendance Domain Namespace
import { calculateAttendanceRate } from './attendanceAnalytics.js';
import { initAttendanceRoster } from './attendanceRoster.js';
import {
  AttendanceState,
  getAttendanceState,
  setAttendanceSearchQuery,
  setAttendanceClassFilter,
  setAttendanceStatusFilter,
  setAttendanceGenderFilter,
  setAttendancePageSize,
  setAttendanceCurrentPage,
  resetAttendanceState,
} from './attendanceState.js';

export const Attendance = Object.freeze({
  state: AttendanceState,
  getState: getAttendanceState,
  setSearchQuery: setAttendanceSearchQuery,
  setClassFilter: setAttendanceClassFilter,
  setStatusFilter: setAttendanceStatusFilter,
  setGenderFilter: setAttendanceGenderFilter,
  setPageSize: setAttendancePageSize,
  setCurrentPage: setAttendanceCurrentPage,
  resetState: resetAttendanceState,
  calculateRate: calculateAttendanceRate,
  initRoster: initAttendanceRoster,
});

