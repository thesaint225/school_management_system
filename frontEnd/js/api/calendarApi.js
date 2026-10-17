// calendarApi.js - REST API Client connecting Frontend to Spring Boot & Database for Academic Calendar & Events
const API_BASE_URL = 'http://localhost:8080/api/calendar';

/**
 * Fetch all calendar events from the backend database.
 * @param {string} [category] - Optional category filter (term, event, exam, holiday, deadline)
 * @returns {Promise<Array|null>} Array of calendar events, or null if network/server error
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

    const data = await response.json();
    console.log(`📅 Loaded ${data.length} calendar events from database.`);
    return data;
  } catch (error) {
    console.warn('⚠️ Could not connect to backend database for calendar events; using fallback data.', error);
    return null;
  }
}

/**
 * Fetch all academic terms from the backend database.
 * @returns {Promise<Array|null>} Array of academic terms, or null if network/server error
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

    const data = await response.json();
    console.log(`🏛️ Loaded ${data.length} academic terms from database.`);
    return data;
  } catch (error) {
    console.warn('⚠️ Could not connect to backend database for academic terms; using fallback data.', error);
    return null;
  }
}

/**
 * Fetch currently active academic term.
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

    return await response.json();
  } catch (error) {
    console.warn('⚠️ Could not connect to backend for active academic term.', error);
    return null;
  }
}

/**
 * Create a new calendar event in the database.
 * @param {Object} eventDto
 * @returns {Promise<Object>}
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

  const created = await response.json();
  console.log('✅ Created calendar event in database:', created);
  return created;
}
