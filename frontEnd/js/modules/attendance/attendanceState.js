// Centralized State for Attendance Roll Call (Encapsulated)

const ALLOWED_STATUS_FILTERS = new Set(['All', 'Present', 'Late', 'Absent', 'Unmarked']);
const ALLOWED_GENDER_FILTERS = new Set(['All', 'Female', 'Male', 'Other']);

// Private internal state — never exported directly
const state = {
  searchQuery: '',
  classFilter: 'All',
  statusFilter: 'All',
  genderFilter: 'All',
  currentPage: 1,
  pageSize: 6,
};

/**
 * Returns a defensive shallow copy of the current attendance state.
 * Because all properties are primitives, callers cannot mutate internal state.
 * @returns {{ searchQuery: string, classFilter: string, statusFilter: string, genderFilter: string, currentPage: number, pageSize: number }}
 */
export function getAttendanceState() {
  return { ...state };
}

/**
 * Updates the search query and resets pagination to page 1.
 * @param {string} query
 */
export function setAttendanceSearchQuery(query) {
  if (typeof query !== 'string') {
    throw new TypeError(`searchQuery must be a string, received ${typeof query}.`);
  }
  state.searchQuery = query;
  state.currentPage = 1;
}

/**
 * Updates the class filter and resets pagination to page 1.
 * @param {string} classFilter
 */
export function setAttendanceClassFilter(classFilter) {
  if (typeof classFilter !== 'string' || classFilter.trim().length === 0) {
    throw new TypeError(`classFilter must be a non-empty string, received ${typeof classFilter}.`);
  }
  state.classFilter = classFilter.trim();
  state.currentPage = 1;
}

/**
 * Updates the attendance status filter and resets pagination to page 1.
 * @param {string} statusFilter
 */
export function setAttendanceStatusFilter(statusFilter) {
  if (typeof statusFilter !== 'string') {
    throw new TypeError(`statusFilter must be a string, received ${typeof statusFilter}.`);
  }
  if (!ALLOWED_STATUS_FILTERS.has(statusFilter)) {
    throw new RangeError(
      `Invalid statusFilter "${statusFilter}". Allowed: ${Array.from(ALLOWED_STATUS_FILTERS).join(', ')}.`
    );
  }
  state.statusFilter = statusFilter;
  state.currentPage = 1;
}

/**
 * Updates the gender filter and resets pagination to page 1.
 * @param {string} genderFilter
 */
export function setAttendanceGenderFilter(genderFilter) {
  if (typeof genderFilter !== 'string') {
    throw new TypeError(`genderFilter must be a string, received ${typeof genderFilter}.`);
  }
  if (!ALLOWED_GENDER_FILTERS.has(genderFilter)) {
    throw new RangeError(
      `Invalid genderFilter "${genderFilter}". Allowed: ${Array.from(ALLOWED_GENDER_FILTERS).join(', ')}.`
    );
  }
  state.genderFilter = genderFilter;
  state.currentPage = 1;
}

/**
 * Updates the page size and resets pagination to page 1.
 * @param {number} pageSize
 */
export function setAttendancePageSize(pageSize) {
  if (typeof pageSize !== 'number' || !Number.isInteger(pageSize)) {
    throw new TypeError(`pageSize must be an integer, received ${typeof pageSize === 'number' ? pageSize : typeof pageSize}.`);
  }
  if (pageSize < 1 || pageSize > 100) {
    throw new RangeError(`pageSize must be between 1 and 100, received ${pageSize}.`);
  }
  state.pageSize = pageSize;
  state.currentPage = 1;
}

/**
 * Updates the current page number.
 * @param {number} page
 */
export function setAttendanceCurrentPage(page) {
  if (typeof page !== 'number' || !Number.isInteger(page)) {
    throw new TypeError(`currentPage must be an integer, received ${typeof page === 'number' ? page : typeof page}.`);
  }
  if (page < 1) {
    throw new RangeError(`currentPage must be at least 1, received ${page}.`);
  }
  state.currentPage = page;
}

/**
 * Resets all attendance filters and pagination to their initial defaults.
 */
export function resetAttendanceState() {
  state.searchQuery = '';
  state.classFilter = 'All';
  state.statusFilter = 'All';
  state.genderFilter = 'All';
  state.currentPage = 1;
  state.pageSize = 6;
}
