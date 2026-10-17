// teacherApi.js - REST API Client connecting Frontend to Spring Boot & Database for Teachers
const API_BASE_URL = 'http://localhost:8080/api/teachers';

/**
 * Fetch all teachers from the database via Spring Boot REST API.
 * Returns array of teachers, or null if network error / server offline.
 */
export async function fetchTeachersFromDb() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`🌐 Loaded ${data.length} teacher records from database.`);
    return data;
  } catch (error) {
    console.warn('⚠️ Could not connect to backend database for teachers. Running with local cache / seed data.', error);
    return null;
  }
}

/**
 * Register a new teacher into the database via Spring Boot POST /api/teachers.
 * @param {Object} teacherRegistrationDto
 * @returns {Promise<Object>} The persisted Teacher entity returned from DB
 */
export async function registerTeacherInDb(teacherRegistrationDto) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(teacherRegistrationDto),
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

  const createdTeacher = await response.json();
  console.log('✅ Successfully persisted teacher to database:', createdTeacher);
  return createdTeacher;
}

/**
 * Update an existing teacher record in the database via Spring Boot PUT /api/teachers/{id}.
 * @param {number|string} id - Teacher ID
 * @param {Object} teacherRegistrationDto - Updated teacher DTO payload
 * @returns {Promise<Object>} The updated Teacher entity returned from DB
 */
export async function updateTeacherInDb(id, teacherRegistrationDto) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(teacherRegistrationDto),
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

  const updatedTeacher = await response.json();
  console.log(`✅ Successfully updated teacher #${id} in database:`, updatedTeacher);
  return updatedTeacher;
}

/**
 * Delete a teacher record from the database via Spring Boot DELETE /api/teachers/{id}.
 * @param {number|string} id - Teacher ID
 * @returns {Promise<boolean>}
 */
export async function deleteTeacherFromDb(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete teacher #${id}: HTTP ${response.status}`);
  }

  console.log(`🗑️ Successfully deleted teacher #${id} from database.`);
  return true;
}
