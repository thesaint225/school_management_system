// subjectApi.js - REST API Client connecting Frontend to Spring Boot & Database for Subjects
const API_BASE_URL = 'http://localhost:8080/api/subjects';

/**
 * Fetch all subjects from the database via Spring Boot REST API.
 * @param {boolean} activeOnly - If true, filters for active subjects only
 * @returns {Promise<Array|null>} Array of subjects, or null if network error
 */
export async function fetchSubjectsFromDb(activeOnly = false) {
  try {
    const url = activeOnly ? `${API_BASE_URL}?activeOnly=true` : API_BASE_URL;
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
    console.log(`🌐 Loaded ${data.length} subject records from database (activeOnly: ${activeOnly}).`);
    return data;
  } catch (error) {
    console.warn('⚠️ Could not connect to backend database for subjects.', error);
    return null;
  }
}

/**
 * Fetch a single subject by ID from DB.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchSubjectByIdFromDb(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load subject #${id}: HTTP ${response.status}`);
  }

  return await response.json();
}

/**
 * Create a new subject into the database via Spring Boot POST /api/subjects.
 * @param {Object} subjectDto
 * @returns {Promise<Object>} The created Subject entity
 */
export async function createSubjectInDb(subjectDto) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(subjectDto),
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

  const createdSubject = await response.json();
  console.log('✅ Successfully created subject in database:', createdSubject);
  return createdSubject;
}

/**
 * Update an existing subject in the database via Spring Boot PUT /api/subjects/{id}.
 * @param {number|string} id - Subject ID
 * @param {Object} subjectDto - Updated subject DTO payload
 * @returns {Promise<Object>} The updated Subject entity
 */
export async function updateSubjectInDb(id, subjectDto) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(subjectDto),
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

  const updatedSubject = await response.json();
  console.log(`✅ Successfully updated subject #${id} in database:`, updatedSubject);
  return updatedSubject;
}

/**
 * Delete or deactivate a subject in the database via Spring Boot DELETE /api/subjects/{id}.
 * @param {number|string} id - Subject ID
 * @returns {Promise<Object>} Result object from backend (e.g. { message, status, action })
 */
export async function deleteOrDeactivateSubjectInDb(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
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

  try {
    const result = await response.json();
    console.log(`🗑️ Deleted or deactivated subject #${id}:`, result);
    return result;
  } catch {
    return { success: true };
  }
}
