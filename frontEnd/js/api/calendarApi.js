import {
  validateCalendarEvent,
  validateCalendarEventList,
  validateAcademicTerm,
  validateAcademicTermList,
} from '../utils/apiValidator.js';

// calendarApi.js - REST API Client connecting Frontend to Spring Boot & Database for Academic Calendar & Events
const API_BASE_URL = 'http://localhost:8080/api/calendar';

/**
 * Fetch all calendar events from the backend database.
 * Validates array of events against the CalendarEvent contract.
 * @param {string} [category] - Optional category filter (term, event, exam, holiday, deadline)
 * @returns {Promise<Array|null>} Array of validated calendar events, or null if network/server/validation error
 */
export async function fetchCalendarEventsFromDb(category = null) {
  try {
    let url = `${API_BASE_URL}/events`;
    if (category && category !== 'all') {
      url += `?category=${encodeURIComponent(category)}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const rawData = await response.json();
    const validatedData = validateCalendarEventList(rawData, 'GET /api/calendar/events');
    console.log(`📅 Loaded & validated ${validatedData.length} calendar events from database.`);
    return validatedData;
  } catch (error) {
    console.warn('⚠️ Could not load valid calendar events from database; using fallback data.', error);
    return null;
  }
}

/**
 * Fetch all academic terms from the backend database.
 * Validates array of terms against the AcademicTerm contract.
 * @returns {Promise<Array|null>} Array of validated academic terms, or null if network/server/validation error
 */
export async function fetchAcademicTermsFromDb() {
  try {
    const response = await fetch(`${API_BASE_URL}/terms`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const rawData = await response.json();
    const validatedData = validateAcademicTermList(rawData, 'GET /api/calendar/terms');
    console.log(`🏛️ Loaded & validated ${validatedData.length} academic terms from database.`);
    return validatedData;
  } catch (error) {
    console.warn('⚠️ Could not load valid academic terms from database; using fallback data.', error);
    return null;
  }
}

/**
 * Fetch currently active academic term.
 * Validates term against AcademicTerm contract.
 * @returns {Promise<Object|null>}
 */
export async function fetchActiveTermFromDb() {
  try {
    const response = await fetch(`${API_BASE_URL}/terms/active`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const raw = await response.json();
    return validateAcademicTerm(raw, 'GET /api/calendar/terms/active');
  } catch (error) {
    console.warn('⚠️ Could not load valid active academic term from database.', error);
    return null;
  }
}

/**
 * Create a new calendar event in the database.
 * @param {Object} eventDto
 * @returns {Promise<Object>} Validated created event entity
 */
export async function createCalendarEventInDb(eventDto) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(eventDto),
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetails = errorJson.message || JSON.stringify(errorJson);
    } catch {
      const text = await response.text();
      if (text) errorDetails = text;
    }
    throw new Error(errorDetails);
  }

  const raw = await response.json();
  const created = validateCalendarEvent(raw, 'POST /api/calendar/events');
  console.log('✅ Created & validated calendar event in database:', created);
  return created;
}
